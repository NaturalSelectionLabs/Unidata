import Main from '../index';
import Base from './base';
import ENS from './ens';
import Crossbell from './crossbell';

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

    async get(source: string, identity: string) {
        return this.map[source].get(identity);
    }
}

export default Profiles;
