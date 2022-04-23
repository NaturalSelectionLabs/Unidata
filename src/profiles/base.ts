import Main from '../index';

abstract class Base {
    main: Main;
    inited: boolean;
    accountsMap: {
        [key: string]: {
            platform: string;
            url?: string;
        };
    };

    constructor(main: Main) {
        this.main = main;
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

    abstract get(identity: string): Promise<Profile | null>;
}

export default Base;
