import Main from '../index';
import Base from './base';
import { ethers } from 'ethers';
import { ProfilesOptions } from './index';
import { createClient, Client, cacheExchange, fetchExchange } from '@urql/core';
import type { Profile } from '../specifications';

class ENS extends Base {
    ethersProvider: ethers.providers.BaseProvider;
    urqlClient: Client;

    constructor(main: Main) {
        super(main);
    }

    private async init() {
        this.ethersProvider = new ethers.providers.InfuraProvider('homestead', this.main.options.infuraProjectID);
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
                    const resolver = await this.ethersProvider.getResolver(domain.name);
                    if (resolver) {
                        const fields: string[] = domain.resolver?.texts || [];
                        await Promise.all(
                            fields.map(async (field) => {
                                switch (field) {
                                    case 'avatar':
                                        profile.avatars = [await resolver.getText(field)];
                                        break;
                                    case 'description':
                                        profile.bio = await resolver.getText(field);
                                        break;
                                    case 'url':
                                        profile.websites = [await resolver.getText(field)];
                                        break;
                                    default:
                                        const split = field.split('.');
                                        if (split.length === 2 && (split[0] === 'com' || split[0] === 'org')) {
                                            if (!profile.connected_accounts) {
                                                profile.connected_accounts = [];
                                            }
                                            profile.connected_accounts.push({
                                                identity: await resolver.getText(field),
                                                platform: split[1],
                                            });
                                        }
                                        break;
                                }
                            }),
                        );
                    }

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
