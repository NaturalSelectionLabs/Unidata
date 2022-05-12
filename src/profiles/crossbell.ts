import Main from '../index';
import Base from './base';
import { Contract } from 'crossbell.js';
import axios from 'axios';
import { ProfilesOptions } from './index';

class Crossbell extends Base {
    contract: Contract;

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
}

export default Crossbell;
