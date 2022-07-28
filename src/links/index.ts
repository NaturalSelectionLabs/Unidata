import Main from '../index';
import Base from './base';
import CrossbellLink from './crossbell-link';
import type { Link } from '../specifications';

export type LinksOptions = {
    source: string;
    identity: string;
    platform?: string;
    type?: string;
    reversed?: boolean;
    cursor?: any;
    limit?: number;
    filter?: any;
};

export type LinkSetOptions = {
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
            'Crossbell Link': new CrossbellLink(main),
        };
    }

    async get(options: LinksOptions) {
        return this.map[options.source].get(options);
    }

    async set(options: LinkSetOptions, input: LinkInput) {
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
