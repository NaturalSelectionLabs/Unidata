import Main from '../index';
import Base from './base';
import ENS from './ens';
import CrossbellProfile from './crossbell-profile';

export type ProfilesOptions = {
    source: string;
    identity: string;
    platform?: string;
    limit?: number;
    cursor?: any;
};

export type ProfilesSetOptions = {
    source: string;
    identity: string;
    platform?: string;
    action?: string;
};

export type ProfileInput = Omit<Profile, 'source' | 'metadata'>;

class Profiles {
    map: {
        [key: string]: Base;
    };

    constructor(main: Main) {
        this.map = {
            ENS: new ENS(main),
            'Crossbell Profile': new CrossbellProfile(main),
        };
    }

    async get(options: ProfilesOptions) {
        return this.map[options.source].get(options);
    }

    async set(options: ProfilesSetOptions, input: ProfileInput) {
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
