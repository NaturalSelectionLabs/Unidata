import Main from '../index';
import Base from './base';
import ENS from './ens';
import Crossbell from './crossbell';

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
};

class Profiles {
    map: {
        [key: string]: Base;
    };

    constructor(main: Main) {
        this.map = {
            ENS: new ENS(main),
            Crossbell: new Crossbell(main),
        };
    }

    async get(options: ProfilesOptions) {
        return this.map[options.source].get(options);
    }

    async set(options: ProfilesSetOptions, input: ProfilesInput) {
        return this.map[options.source].set(options, input);
    }
}

export default Profiles;
