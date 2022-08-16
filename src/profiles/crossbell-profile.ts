import Main from '../index';
import Base from './base';
import { Indexer, Contract, Network, ListResponse, CharacterEntity } from 'crossbell.js';
import { ProfilesOptions, ProfileSetOptions, ProfileInput } from './index';
import axios from 'axios';
import type { Profile } from '../specifications';
import { unionBy } from 'lodash-es';

class CrossbellProfile extends Base {
    indexer: Indexer;
    contract: Contract;

    constructor(main: Main) {
        super(main);

        Network.setIpfsGateway(this.main.options.ipfsGateway!);
    }

    async get(options: ProfilesOptions) {
        if (!this.indexer) {
            this.indexer = new Indexer();
        }

        options = Object.assign(
            {
                platform: 'Ethereum',
            },
            options,
        );

        let response: ListResponse<CharacterEntity>;
        if (options.platform === 'Ethereum') {
            response = await this.indexer.getCharacters(options.identity, {
                cursor: options.cursor,
                limit: options.limit,
            });
        } else {
            const character = await this.indexer.getCharacterByHandle(options.identity);
            if (character) {
                response = {
                    count: 1,
                    cursor: '',
                    list: [character],
                };
            } else {
                response = {
                    count: 0,
                    cursor: '',
                    list: [],
                };
            }
        }

        let list = await Promise.all(
            response.list?.map(async (item) => {
                if (item.uri && !(item.metadata && item.metadata.content)) {
                    try {
                        const res = await axios.get(this.main.utils.replaceIPFS(item.uri));
                        (<any>item).metadata = {
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
                            proof: item.characterId,

                            raw: item.metadata?.content || {},
                            uri: item.uri,

                            primary: item.primary,
                            block_number: item.blockNumber,
                            owner: item.owner,
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
                        ...((<any>item).metadata?.content?.banners && {
                            banners: (<any>item).metadata.content.banners,
                        }),
                        ...(item.metadata?.content?.avatars && { avatars: item.metadata.content.avatars }),
                        ...(item.metadata?.content?.websites && { websites: item.metadata.content.websites }),
                        ...((<any>item).metadata?.content?.tags && { tags: (<any>item).metadata.content.tags }),

                        ...(item.metadata?.content?.connected_accounts && {
                            connected_accounts: item.metadata.content.connected_accounts,
                        }),
                        ...((<any>item.metadata?.content)?.attributes && {
                            attributes: (<any>item.metadata?.content).attributes,
                        }),
                    },
                );

                return profile;
            }),
        );

        const result = {
            total: list.length,
            ...(response.cursor && { cursor: response.cursor }),

            list: list.map((profile: Profile) => {
                // Crossbell specification compatibility
                if (profile.connected_accounts) {
                    profile.connected_accounts = profile.connected_accounts.map((account: any) => {
                        if (typeof account === 'string') {
                            const match = account.match(/:\/\/account:(.*)@(.*)/);
                            if (match) {
                                return {
                                    identity: match[1],
                                    platform: match[2],
                                };
                            } else {
                                return {
                                    identity: account,
                                    platform: '',
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
                let character = await this.main.utils.getCrossbellCharacter({
                    identity: options.identity,
                    platform: options.platform!,
                });

                if (!character) {
                    return {
                        code: 1,
                        message: 'Profile not found',
                    };
                }

                // setHandle
                if (input.username && input.username !== character.handle) {
                    await this.contract.setHandle(character.characterId + '', input.username);
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

                    const result = Object.assign({}, character.metadata?.content, input);
                    if (input.attributes && (<any>character.metadata?.content)?.attributes) {
                        result.attributes = unionBy(
                            input.attributes,
                            (<any>character.metadata?.content).attributes,
                            'trait_type',
                        );
                    }

                    const ipfs = await this.main.utils.uploadToIPFS(result, username);
                    await this.contract.setCharacterUri(character.characterId + '', ipfs);

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
                        await this.contract.createCharacter(options.identity, username, ipfs);

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
