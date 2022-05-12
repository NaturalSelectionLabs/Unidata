import Main from '../index';
import Base from './base';
import { Contract } from 'crossbell.js';
import axios from 'axios';
import { ProfilesOptions, ProfilesSetOptions } from './index';
import { Web3Storage } from 'web3.storage';

class Crossbell extends Base {
    contract: Contract;
    contractSet: Contract;

    constructor(main: Main) {
        super(main);
    }

    private async init() {
        this.contract = new Contract();
        await this.contract.connect();
        this.inited = true;
    }

    async get(options: ProfilesOptions) {
        if (!this.inited) {
            await this.init();
        }
        const profileId = (await this.contract.getPrimaryProfileId(options.identity)).data;
        if (profileId && profileId !== '0') {
            const info = (await this.contract.getProfile(profileId)).data;
            let meta;
            if (info.uri) {
                meta = (await axios.get(this.main.utils.replaceIPFS(info.uri))).data;
            }
            if (meta?.avatars) {
                meta.avatars = this.main.utils.replaceIPFSs(meta.avatars);
            }
            if (meta?.banners) {
                meta.banners = this.main.utils.replaceIPFSs(meta.banners);
            }
            if (meta?.connected_accounts) {
                meta.connected_accounts = meta.connected_accounts.map((account: any) => {
                    const platform = account.platform.toLowerCase();
                    if (account.identity && account.platform && this.accountsMap[platform]) {
                        const acc: Required<Profile>['connected_accounts'][number] = {
                            identity: account.identity,
                            platform: this.accountsMap[platform].platform,
                        };
                        if (this.accountsMap[platform].url) {
                            acc.url = this.accountsMap[platform].url?.replace('$$id', account.identity);
                        }
                        return acc;
                    } else {
                        return {
                            identity: account.identity,
                            platform: account.platform,
                        };
                    }
                });
            }
            const profile: Profile = Object.assign(
                {
                    username: info.handle,
                    source: 'Crossbell',

                    metadata: {
                        network: 'Crossbell',
                        proof: profileId,

                        uri: info.uri,
                    },
                },
                meta,
            );

            return {
                total: 1,
                list: [profile],
            };
        } else {
            return {
                total: 0,
                list: [],
            };
        }
    }

    async set(options: ProfilesSetOptions, input: ProfilesInput) {
        if (!this.contractSet) {
            this.contractSet = new Contract(window.ethereum);
            this.contractSet.connect();
        }
        const profile = (await this.get(options)).list[0];

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

        const proof = profile.metadata!.proof;

        // setHandle
        if (input.username && input.username !== profile.username) {
            await this.contractSet.setHandle(proof, input.username);
        }

        // setProfileUri
        if (Object.keys(input).filter((key) => key !== 'username').length) {
            const web3Storage = new Web3Storage({
                token: this.main.options.web3StorageAPIToken!,
            });
            const username = input.username || options.identity;
            delete input.username;
            let original = {};
            if (profile.metadata?.uri) {
                original = (await axios.get(this.main.utils.replaceIPFS(profile.metadata!.uri))).data;
            }
            const result = Object.assign(original, input);
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
