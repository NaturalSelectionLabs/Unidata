import Main from '../index';
import Base from './base';
import { Indexer, Contract, Network } from 'crossbell.js';
import { ProfilesOptions, ProfileSetOptions, ProfileInput } from './index';
import axios from 'axios';
import { createClient, Client } from '@urql/core';
import type { Profile } from '../specifications';

class CrossbellProfile extends Base {
    indexer: Indexer;
    contract: Contract;
    urqlClient: Client;

    constructor(main: Main) {
        super(main);

        Network.setIpfsGateway(this.main.options.ipfsGateway!);
    }

    private async init() {
        this.urqlClient = createClient({
            url: 'https://indexer.crossbell.io/v1/graphql',
            maskTypename: false,
        });
    }

    async get(options: ProfilesOptions) {
        if (!this.urqlClient) {
            this.init();
        }

        options = Object.assign(
            {
                platform: 'Ethereum',
            },
            options,
        );

        const response = await this.urqlClient
            .query(
                `
                query getProfiles($identity: String!, $limit: Int) {
                    profiles( where: { ${
                        options.platform === 'Ethereum' ? 'owner' : 'handle'
                    }: { equals: $identity } }, orderBy: [{ createdAt: asc }], ${
                    options.cursor ? `cursor: { profileId: ${options.cursor}}, ` : ''
                }take: $limit ) {
                        handle
                        profileId
                        primary
                        uri
                        createdAt
                        updatedAt
                        metadata {
                            content
                        }
                        transactionHash
                        blockNumber
                        updatedTransactionHash
                    }
                }`,
                {
                    identity: options.identity.toLowerCase(),
                    limit: options.limit,
                },
            )
            .toPromise();

        const list = await Promise.all(
            response.data?.profiles?.map(async (item: any) => {
                if (item.uri && !(item.metadata && item.metadata.content)) {
                    try {
                        const res = await axios.get(this.main.utils.replaceIPFS(item.uri));
                        item.metadata = {
                            content: res.data,
                        };
                    } catch (error) {}
                }

                const profile: Profile = Object.assign(
                    {
                        date_created: item.createdAt,
                        date_updated: item.updatedAt,
                        username: item.handle,
                        source: 'Crossbell Profile',

                        metadata: {
                            network: 'Crossbell',
                            proof: item.profileId,

                            primary: item.primary,
                            block_number: item.blockNumber,
                            transactions: [
                                item.transactionHash,
                                ...(item.transactionHash !== item.updatedTransactionHash
                                    ? [item.updatedTransactionHash]
                                    : []),
                            ],
                        },
                    },
                    {
                        ...(item.metadata?.content?.name && { name: item.metadata.content.name }),
                        ...(item.metadata?.content?.bio && { bio: item.metadata.content.bio }),
                        ...(item.metadata?.content?.banners && { banners: item.metadata.content.banners }),
                        ...(item.metadata?.content?.avatars && { avatars: item.metadata.content.avatars }),
                        ...(item.metadata?.content?.websites && { websites: item.metadata.content.websites }),
                        ...(item.metadata?.content?.tags && { tags: item.metadata.content.tags }),

                        ...(item.metadata?.content?.connected_accounts && {
                            connected_accounts: item.metadata.content.connected_accounts,
                        }),
                    },
                );

                return profile;
            }),
        );

        const result = {
            total: list.length,
            ...(options.limit && list.length >= options.limit && { cursor: list[list.length - 1].metadata.proof }),

            list: list.map((profile: Profile) => {
                // Crossbell specification compatibility
                if (profile.connected_accounts) {
                    profile.connected_accounts = profile.connected_accounts.map((account: any) => {
                        if (typeof account === 'string') {
                            const match = account.match(/:\/\/account:(.*)@(.*)/);
                            if (match) {
                                account = {
                                    identity: match[1],
                                    platform: match[2],
                                };
                            } else {
                                account = {
                                    identity: account,
                                };
                            }
                        }
                        return account;
                    });
                }

                return profile;
            }),
        };

        return result;
    }

    async set(options: ProfileSetOptions, input: ProfileInput) {
        options = Object.assign(
            {
                platform: 'Ethereum',
                action: 'update',
            },
            options,
        );

        if (!this.contract) {
            this.contract = new Contract(this.main.options.ethereumProvider);
            await this.contract.connect();
        }

        switch (options.action) {
            case 'update': {
                let profile = await this.main.utils.getCrossbellProfile({
                    identity: options.identity,
                    platform: options.platform!,
                });

                if (!profile) {
                    return {
                        code: 1,
                        message: 'Profile not found',
                    };
                }

                // setHandle
                if (input.username && input.username !== profile.handle) {
                    await this.contract.setHandle(profile.profileId + '', input.username);
                }

                // setProfileUri
                if (Object.keys(input).filter((key) => key !== 'username').length) {
                    const username = input.username || options.identity;
                    delete input.username;

                    // Crossbell specification compatibility
                    if (input.connected_accounts) {
                        input.connected_accounts = input.connected_accounts.map((account: any) => {
                            if (account.identity && account.platform) {
                                return `csb://account:${account.identity}@${account.platform.toLowerCase()}`;
                            } else {
                                return account;
                            }
                        });
                    }

                    const result = Object.assign({}, profile.metadata?.content, input);
                    const ipfs = await this.main.utils.uploadToIPFS(result, username);
                    await this.contract.setProfileUri(profile.profileId + '', ipfs);

                    return {
                        code: 0,
                        message: 'Success',
                    };
                } else {
                    return {
                        code: 0,
                        message: 'Success',
                    };
                }
            }
            case 'add': {
                switch (options.platform) {
                    case 'Ethereum': {
                        const username = input.username || options.identity;
                        delete input.username;
                        const result = input;
                        const ipfs = await this.main.utils.uploadToIPFS(result, username);
                        await this.contract.createProfile(options.identity, username, ipfs);

                        return {
                            code: 0,
                            message: 'Success',
                        };
                    }
                    default:
                        throw new Error(`Unsupported platform: ${options.platform}`);
                }
            }
            default:
                throw new Error(`Unsupported action: ${options.action}`);
        }
    }
}

export default CrossbellProfile;
