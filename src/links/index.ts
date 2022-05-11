import Main from '../index';
import Base from './base';
import CyberConnect from './cyberconnect';
import Crossbell from './crossbell';

export type LinksOptions = {
    source: string;
    identity: string;
    type?: string;
    reversed?: boolean;
    cursor?: number;
    limit?: number;
};

class Links {
    map: {
        [key: string]: Base;
    };

    constructor(main: Main) {
        this.map = {
            CyberConnect: new CyberConnect(main),
            Crossbell: new Crossbell(main),
        };
    }

    async get(options: LinksOptions) {
        return this.map[options.source].get(options);
    }
}

export default Links;
