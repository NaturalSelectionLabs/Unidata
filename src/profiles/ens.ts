import Main from '../index';
import Base from './base';
import { createPublicClient, http, type PublicClient } from 'viem';
import { normalize } from 'viem/ens';
import { mainnet } from 'viem/chains';
import { compact } from 'lodash-es';

import { ProfilesOptions } from './index';
import { createClient, Client, cacheExchange, fetchExchange } from '@urql/core';
import type { Profile } from '../specifications';

class ENS extends Base {
    publicClient: PublicClient;
    urqlClient: Client;

    constructor(main: Main) {
        super(main);
    }

    private async init() {
        this.publicClient = createPublicClient({
            chain: mainnet,
            transport: http(`https://mainnet.infura.io/v3/${this.main.options.infuraProjectID}`),
        });
        this.urqlClient = createClient({
            url: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
            maskTypename: false,
            exchanges: [cacheExchange, fetchExchange],
        });
        this.inited = true;
    }

    async get(options: ProfilesOptions) {
        if (!this.inited) {
            await this.init();
        }

        const result = await this.urqlClient
            .query(
                `
                query getRegistrations($identity: ID!, $limit: Int, $cursor: Int) {
                    account(id: $identity) {
                    domains(orderBy: createdAt, orderDirection: "desc", skip: $cursor, first: $limit) {
                        id
                        name
                        createdAt
                        labelhash
                        resolver {
                            texts
                            id
                                address
                            }
                        }
                    }
                }`,
                {
                    identity: options.identity.toLowerCase(),
                    cursor: options.cursor || 0,
                    limit: options.limit,
                },
            )
            .toPromise();

        const list =
            (await Promise.all(
                result?.data?.account?.domains?.map(async (domain: any) => {
                    const profile: Profile = {
                        date_created: new Date(+domain.createdAt).toISOString(),

                        name: domain.name,
                        username: domain.name,
                        source: 'ENS',

                        metadata: {
                            network: 'Ethereum',
                            proof: domain.name,
                        },
                    };

                    const fields: string[] = domain.resolver?.texts || [];
                    await Promise.all(
                        fields.map(async (field) => {
                            const getText = () =>
                                this.publicClient.getEnsText({ name: normalize(domain.name), key: field });

                            switch (field) {
                                case 'avatar':
                                    profile.avatars = compact([await getText()]);
                                    break;
                                case 'description':
                                    profile.bio = (await getText()) ?? undefined;
                                    break;
                                case 'url':
                                    profile.websites = compact([await getText()]);
                                    break;
                                default:
                                    const split = field.split('.');
                                    if (split.length === 2 && (split[0] === 'com' || split[0] === 'org')) {
                                        if (!profile.connected_accounts) {
                                            profile.connected_accounts = [];
                                        }

                                        const identity = await getText();

                                        if (identity) {
                                            profile.connected_accounts.push({ identity, platform: split[1] });
                                        }
                                    }
                                    break;
                            }
                        }),
                    );

                    return profile;
                }),
            )) || [];

        return {
            total: list.length,

            ...(options.limit && list.length >= options.limit && { cursor: options.limit + (options.cursor || 0) }),
            list,
        };
    }

    set: undefined;
}

export default ENS;
