import Main from '../index';
import Base from './base';
import { Indexer, Contract } from 'crossbell.js';
import axios from 'axios';
import { ProfilesOptions, ProfilesSetOptions } from './index';
import { Web3Storage } from 'web3.storage';

class Crossbell extends Base {
    indexer: Indexer;
    contract: Contract;
    contractSet: Contract;

    constructor(main: Main) {
        super(main);
    }

    private async init() {
        this.indexer = new Indexer();
        this.inited = true;
    }

    async get(options: ProfilesOptions) {
        if (!this.inited) {
            await this.init();
        }
        const res = await this.indexer.getProfiles(options.identity, {
            lastIdentifier: options.cursor,
            limit: options.limit,
        });

        const list = res.list.map((item: any) => {
            const profile: Profile = Object.assign(
                {
                    username: item.handle,
                    source: 'Crossbell',

                    metadata: {
                        network: 'Crossbell',
                        proof: item.token_id,

                        primary: item.primary,
                        block_number: item.block_number,
                    },
                },
                {
                    ...(item.metadata?.name && { name: item.metadata.name }),
                    ...(item.metadata?.bio && { bio: item.metadata.bio }),
                    ...(item.metadata?.banners && { banners: this.main.utils.replaceIPFSs(item.metadata.banners) }),
                    ...(item.metadata?.avatars && { avatars: this.main.utils.replaceIPFSs(item.metadata.avatars) }),
                    ...(item.metadata?.websites && { websites: item.metadata.websites }),
                    ...(item.metadata?.connected_accounts && { connected_accounts: item.metadata.connected_accounts }),
                },
            );

            return profile;
        });

        return {
            total: res.total,
            ...(options.limit && list.length >= options.limit && { cursor: list[list.length - 1].metadata?.token_id }),

            list,
        };
    }

    async set(options: ProfilesSetOptions, input: ProfilesInput) {
        if (!this.contractSet) {
            this.contractSet = new Contract(window.ethereum);
            this.contractSet.connect();
        }
        const profile = (
            await this.indexer.getProfiles(options.identity, {
                primary: true,
            })
        ).list[0];

        // createProfile
        if (!profile) {
            const web3Storage = new Web3Storage({
                token: this.main.options.web3StorageAPIToken!,
            });
            const username = input.username || options.identity;
            delete input.username;
            const result = input;
            const blob = new Blob([JSON.stringify(result)], {
                type: 'application/json',
            });
            const file = new File([blob], `${username}.json`);
            const cid = await web3Storage.put([file], {
                name: file.name,
                maxRetries: 3,
                wrapWithDirectory: false,
            });
            await this.contractSet.createProfile(options.identity, username, `ipfs://${cid}`);

            return {
                code: 0,
                message: 'Success',
            };
        }

        const proof = profile.token_id;

        // setHandle
        if (input.username && input.username !== profile.handle) {
            await this.contractSet.setHandle(proof, input.username);
        }

        // setProfileUri
        if (Object.keys(input).filter((key) => key !== 'username').length) {
            const web3Storage = new Web3Storage({
                token: this.main.options.web3StorageAPIToken!,
            });
            const username = input.username || options.identity;
            delete input.username;
            const result = Object.assign({}, profile.metadata, input);
            const blob = new Blob([JSON.stringify(result)], {
                type: 'application/json',
            });
            const file = new File([blob], `${username}.json`);
            const cid = await web3Storage.put([file], {
                name: file.name,
                maxRetries: 3,
                wrapWithDirectory: false,
            });
            await this.contractSet.setProfileUri(proof, `ipfs://${cid}`);

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
}

export default Crossbell;
