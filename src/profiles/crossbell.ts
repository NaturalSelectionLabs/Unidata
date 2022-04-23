import Main from '../index';
import Base from './base';
import { Contract } from 'crossbell.js';
import axios from 'axios';

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

    async get(identity: string) {
        if (!this.inited) {
            await this.init();
        }
        const profileId = (await this.contract.getPrimaryProfileId(identity)).data;
        if (profileId && profileId !== '0') {
            const info = (await this.contract.getProfile(profileId)).data;
            let metadata;
            if (info.uri) {
                metadata = (await axios.get(this.main.utils.replaceIPFS(info.uri))).data;
            }
            if (metadata?.avatars) {
                metadata.avatars = this.main.utils.replaceIPFSs(metadata.avatars);
            }
            if (metadata?.banner) {
                metadata.banner = this.main.utils.replaceIPFSs(metadata.banner);
            }
            if (metadata?.connected_accounts) {
                metadata.connected_accounts = metadata.connected_accounts.map((account: any) => {
                    const platform = account.platform.toLowerCase();
                    if (account.identity && account.platform && this.accountsMap[platform]) {
                        const acc: Required<Profile>['connected_accounts'][number] = {
                            identity: account.identity,
                            platform: this.accountsMap[platform].platform,
                        };
                        if (this.accountsMap[platform].url) {
                            acc.url = this.accountsMap[platform].url?.replace('$$id', identity);
                        }
                        return acc;
                    } else {
                        return {
                            identity: identity,
                            platform: account.platform,
                        };
                    }
                });
            }
            const profile: Profile = Object.assign(
                {
                    name: info.handle,
                    source: 'Crossbell',
                },
                metadata,
            );

            return profile;
        } else {
            return null;
        }
    }
}

export default Crossbell;
