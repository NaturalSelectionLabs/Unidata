import Main from '../index';
import Base from './base';
import MirrorEntry from './mirror-entry';
import EthereumNFTActivity from './ethereum-nft-activity';

export type NotesOptions = {
    source: string;
    identity: string;
    limit?: number;
};

class Notes {
    map: {
        [key: string]: Base;
    };

    constructor(main: Main) {
        this.map = {
            'Mirror Entry': new MirrorEntry(main),
            'Ethereum NFT Activity': new EthereumNFTActivity(main),
        };
    }

    async get(options: NotesOptions) {
        return this.map[options.source].get(options);
    }
}

export default Notes;
