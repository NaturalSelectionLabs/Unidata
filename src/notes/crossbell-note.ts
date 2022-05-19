import Main from '../index';
import Base from './base';
import { NotesOptions, NoteSetOptions, NoteInput } from './index';
import { Indexer, Contract, Network } from 'crossbell.js';
import { Web3Storage } from 'web3.storage';

class CrossbellNote extends Base {
    indexer: Indexer;
    contract: Contract;
    contractSet: Contract;

    constructor(main: Main) {
        super(main);

        Network.setIpfsGateway(this.main.options.ipfsGateway!);
    }

    async get(options: NotesOptions) {
        if (!this.contract) {
            this.contract = new Contract();
            await this.contract.connect();
        }
        options = Object.assign(
            {
                platform: 'Ethereum',
            },
            options,
        );

        let profileId = await this.main.utils.getCrossbellProfileId({
            identity: options.identity,
            platform: options.platform!,
        });

        const result = (await this.contract.getNote(profileId, '1')).data;

        const now = new Date().toISOString();

        const item: Note = Object.assign({}, <any>result.metadata, {
            id: result.noteId,

            date_created: now,
            date_updated: now,

            authors: [options.identity],

            source: 'Crossbell Note',
            metadata: {
                network: 'Crossbell',
                proof: result.noteId,
            },
        });

        // Crossbell specification compatibility
        if (item.summary) {
            item.summary = {
                content: (<any>item).summary,
                mime_type: 'text/markdown',
            };
        }

        return {
            total: 1,
            list: [item],
        };
    }

    async set(options: NoteSetOptions, input: NoteInput) {
        options = Object.assign(
            {
                platform: 'Ethereum',
                action: 'add',
            },
            options,
        );

        if (!this.contractSet) {
            this.contractSet = new Contract(this.main.options.ethereumProvider);
            await this.contractSet.connect();
        }

        let profileId = await this.main.utils.getCrossbellProfileId({
            identity: options.identity,
            platform: options.platform!,
        });

        switch (options.action) {
            case 'add': {
                const web3Storage = new Web3Storage({
                    token: this.main.options.web3StorageAPIToken!,
                });

                // Crossbell specification compatibility
                if (input.summary) {
                    (<any>input).summary = input.summary.content;
                }

                const blob = new Blob([JSON.stringify(input)], {
                    type: 'application/json',
                });
                const file = new File([blob], `${options.identity}.json`);
                const cid = await web3Storage.put([file], {
                    name: file.name,
                    maxRetries: 3,
                    wrapWithDirectory: false,
                });

                const data = await this.contractSet.postNote(profileId, `ipfs://${cid}`);

                return {
                    code: 0,
                    message: 'Success',
                    data: data.data.noteId,
                };
            }
            case 'remove': {
                if (!input.id) {
                    return {
                        code: 1,
                        message: 'Missing id',
                    };
                } else {
                    await this.contractSet.deleteNote(profileId, input.id);

                    return {
                        code: 0,
                        message: 'Success',
                    };
                }
            }
            case 'update': {
                // TODO
            }
            default:
                throw new Error(`Unsupported action: ${options.action}`);
        }
    }
}

export default CrossbellNote;
