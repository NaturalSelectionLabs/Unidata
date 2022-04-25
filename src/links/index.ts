import Main from '../index';
import Base from './base';
import CyberConnect from './cyberconnect';

class Links {
    map: {
        [key: string]: Base;
    };

    constructor(main: Main) {
        this.map = {
            CyberConnect: new CyberConnect(main),
        };
    }

    async get(source: string, identity: string, reversed?: boolean, offset?: number) {
        return this.map[source].get(identity, reversed, offset);
    }
}

export default Links;
