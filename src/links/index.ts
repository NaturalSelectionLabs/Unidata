import Main from '../index';
import Base from './base';
import Crossbell from './crossbell';

export type LinksOptions = {
    source: string;
    identity: string;
    platform?: string;
    type?: string;
    reversed?: boolean;
    cursor?: number;
    limit?: number;
};

export type LinksSetOptions = {
    source: string;
    identity: string;
    platform?: string;
    action?: string;
};

export type LinkInput = Omit<Link, 'date_created' | 'from' | 'source' | 'metadata'>;

class Links {
    map: {
        [key: string]: Base;
    };

    constructor(main: Main) {
        this.map = {
            Crossbell: new Crossbell(main),
        };
    }

    async get(options: LinksOptions) {
        return this.map[options.source].get(options);
    }

    async set(options: LinksSetOptions, input: LinkInput) {
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

export default Links;
