import Main from '../index';
import Base from './base';
import { ethers } from 'ethers';
import { ProfilesOptions } from './index';

class ENS extends Base {
    ethersProvider: ethers.providers.BaseProvider;

    constructor(main: Main) {
        super(main);
    }

    private async init() {
        this.ethersProvider = new ethers.providers.InfuraProvider('homestead', this.main.options.infuraProjectID);
        this.inited = true;
    }

    async get(options: ProfilesOptions) {
        if (!this.inited) {
            await this.init();
        }
        const username = await this.ethersProvider.lookupAddress(options.identity);
        if (username) {
            const resolver = await this.ethersProvider.getResolver(username);
            if (resolver) {
                const fields = [
                    'avatar',
                    'description',
                    'url',
                    'com.github',
                    'com.twitter',
                    'org.telegram',
                    'com.discord',
                    'com.reddit',
                    'name',
                    'banners',
                ];
                const info = await Promise.all(fields.map((field) => resolver.getText(field)));
                const profile: Profile = {
                    name: info[8] || username,
                    username: username,
                    source: 'ENS',

                    ...(info[0] && { avatars: [this.main.utils.replaceIPFS(info[0])] }),
                    ...(info[9] && { banners: [this.main.utils.replaceIPFS(info[9])] }),
                    ...(info[1] && { bio: info[1] }),
                    ...(info[2] && { websites: info[2].split('/n') }),
                };

                const connected_accounts: Required<Profile>['connected_accounts'] = [];
                [info[3], info[4], info[5], info[6], info[7]].forEach((account, index) => {
                    if (account) {
                        const key = fields[index + 3].split('.')[1];
                        if (this.accountsMap[key]) {
                            const acc: Required<Profile>['connected_accounts'][number] = {
                                identity: account,
                                platform: this.accountsMap[key].platform,
                            };
                            if (this.accountsMap[key].url) {
                                acc.url = this.accountsMap[key].url?.replace('$$id', account);
                            }
                            connected_accounts.push(acc);
                        } else {
                            connected_accounts.push({
                                identity: account,
                                platform: key,
                            });
                        }
                    }
                });
                if (connected_accounts.length) {
                    profile.connected_accounts = connected_accounts;
                }

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
        } else {
            return {
                total: 0,
                list: [],
            };
        }
    }
}

export default ENS;
