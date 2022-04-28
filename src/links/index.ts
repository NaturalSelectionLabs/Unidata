import Main from '../index';
import Base from './base';
import CyberConnect from './cyberconnect';

export type LinksOptions = {
    source: string;
    identity: string;
    reversed?: boolean;
    offset?: number;
    limit?: number;
};

class Links {
    map: {
        [key: string]: Base;
    };

    constructor(main: Main) {
        this.map = {
            CyberConnect: new CyberConnect(main),
        };
    }

    async get(options: LinksOptions) {
        return this.map[options.source].get(options);
    }
}

export default Links;
