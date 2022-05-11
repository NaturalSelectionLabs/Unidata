import Main from '../index';
import Base from './base';
import ENS from './ens';
import Crossbell from './crossbell';

export type ProfilesOptions = {
    source: string;
    identity: string;
    limit?: number;
    cursor?: any;
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
}

export default Profiles;
