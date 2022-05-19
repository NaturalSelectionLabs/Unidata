import Main from '../index';
import Base from './base';
import MirrorEntry from './mirror-entry';
import EthereumNFTActivity from './ethereum-nft-activity';
import GitcoinContribution from './gitcoin-contribution';

export type NotesOptions = {
    source: string;
    identity: string;
    limit?: number;
    cursor?: any;
};

export type NoteSetOptions = {
    source: string;
    identity: string;
    platform?: string;
    action?: string;
};

export type NoteInput = Omit<Note, 'date_created' | 'date_updated' | 'source' | 'metadata'>;

class Notes {
    map: {
        [key: string]: Base;
    };

    constructor(main: Main) {
        this.map = {
            'Mirror Entry': new MirrorEntry(main),
            'Ethereum NFT Activity': new EthereumNFTActivity(main),
            'Gitcoin Contribution': new GitcoinContribution(main),
        };
    }

    async get(options: NotesOptions) {
        return this.map[options.source].get(options);
    }
}

export default Notes;
