import Main from '../index';
import Base from './base';
import MirrorEntry from './mirror-entry';
import EthereumNFTActivity from './ethereum-nft-activity';
import GitcoinContribution from './gitcoin-contribution';
import CrossbellNote from './crossbell-note';
import type { Note } from '../specifications';

export type NotesOptions = {
    source: string;
    identity?: string;
    platform?: string;
    limit?: number;
    cursor?: any;
    filter?: any;
};

export type NoteSetOptions = {
    source: string;
    identity: string;
    platform?: string;
    action?: string;
};

export type NoteInput = Partial<Omit<Note, 'date_created' | 'date_updated' | 'source' | 'metadata'>>;

class Notes {
    map: {
        [key: string]: Base;
    };

    constructor(main: Main) {
        this.map = {
            'Mirror Entry': new MirrorEntry(main),
            'Ethereum NFT Activity': new EthereumNFTActivity(main),
            'Gitcoin Contribution': new GitcoinContribution(main),
            'Crossbell Note': new CrossbellNote(main),
        };
    }

    async get(options: NotesOptions) {
        options = Object.assign(
            {
                limit: 10,
            },
            options,
        );

        const result = await this.map[options.source].get(options);
        result?.list &&
            (result.list = result.list.map((note) => {
                if (!note.date_published) {
                    note.date_published = note.date_created;
                }

                return note;
            }));

        return result;
    }

    async set(options: NoteSetOptions, input: NoteInput, extra?: any) {
        if (this.map[options.source].set) {
            return this.map[options.source].set!(options, input, extra);
        } else {
            return {
                code: 1,
                message: 'Method not implemented',
            };
        }
    }
}

export default Notes;
