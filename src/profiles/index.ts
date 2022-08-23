import Main from '../index';
import Base from './base';
import ENS from './ens';
import CrossbellProfile from './crossbell-profile';
import type { Profile } from '../specifications';

export type ProfilesOptions = {
    source: string;
    identity: string;
    platform?: string;
    limit?: number;
    cursor?: any;
    filter?: any;
};

export type ProfileSetOptions = {
    source: string;
    identity: string;
    platform?: string;
    action?: string;
};

export type ProfileInput = Omit<Profile, 'source' | 'metadata'>;

class Profiles {
    main: Main;
    map: {
        [key: string]: Base;
    };
    accountsMap: {
        [key: string]: {
            platform: string;
            url?: string;
        };
    };

    constructor(main: Main) {
        this.main = main;

        this.map = {
            ENS: new ENS(main),
            'Crossbell Profile': new CrossbellProfile(main),
        };
        this.accountsMap = {
            github: {
                platform: 'GitHub',
                url: 'https://github.com/$$id',
            },
            twitter: {
                platform: 'Twitter',
                url: 'https://twitter.com/$$id',
            },
            telegram: {
                platform: 'Telegram',
                url: 'https://t.me/$$id',
            },
            discord: {
                platform: 'Discord',
            },
            reddit: {
                platform: 'Reddit',
                url: 'https://www.reddit.com/user/$$id',
            },
            jike: {
                platform: 'Jike',
                url: 'https://web.okjike.com/u/$$id',
            },
        };
    }

    async get(options: ProfilesOptions) {
        const result = await this.map[options.source].get(options);

        result.list = result.list.map((profile) => {
            if (profile.avatars) {
                profile.avatars = this.main.utils.replaceIPFSs(profile.avatars);
            }
            if (profile.banners) {
                profile.banners = this.main.utils.replaceIPFSs(profile.banners);
            }

            if (profile.connected_accounts) {
                profile.connected_accounts = profile.connected_accounts.map((account) => {
                    const rule = this.accountsMap[account.platform.toLowerCase()];
                    if (rule) {
                        account.platform = rule.platform;
                        if (rule.url) {
                            account.url = rule.url.replace('$$id', account.identity);
                        }
                    }
                    return account;
                });
            }
            return profile;
        });

        return result;
    }

    async set(options: ProfileSetOptions, input: ProfileInput) {
        if (this.map[options.source].set) {
            return this.map[options.source].set!(options, input);
        } else {
            return {
                code: 1,
                message: 'Method not implemented',
            };
        }
    }
}

export default Profiles;
