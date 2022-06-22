import Main from '../index';
import Base from './base';
import { NotesOptions, NoteSetOptions, NoteInput } from './index';
import { Indexer, Contract, Network } from 'crossbell.js';
import { Web3Storage } from 'web3.storage';
import { BigNumber } from 'ethers';
import type { Note } from '../specifications';

class CrossbellNote extends Base {
    indexer: Indexer;
    contract: Contract;
    contractSet: Contract;

    constructor(main: Main) {
        super(main);

        Network.setIpfsGateway(this.main.options.ipfsGateway!);
    }

    async init() {
        if (!this.contract) {
            this.contract = new Contract();
            await this.contract.connect();
        }
    }

    async initSet() {
        if (!this.contractSet) {
            this.contractSet = new Contract(this.main.options.ethereumProvider);
            await this.contractSet.connect();
        }
    }

    async get(options: NotesOptions) {
        if (!this.contract) {
            await this.init();
        }

        options = Object.assign(
            {
                platform: 'Ethereum',
            },
            options,
        );

        // @ts-ignore
        const initialContract = this.contract.contract;

        let events: any;
        let profileId: string = '';
        if (options.identity) {
            profileId = await this.main.utils.getCrossbellProfileId({
                identity: options.identity,
                platform: options.platform!,
            });
            if (profileId === '0') {
                return {
                    total: 0,
                    list: [],
                };
            }
        }
        if (options.filter?.url) {
            const filter = initialContract.filters.PostNote(
                null,
                null,
                this.contract.getLinkKeyForAnyUri(options.filter.url),
            );
            events = await initialContract.queryFilter(filter);
            if (profileId) {
                events = events.filter((event: any) => event.args.profileId.toString() === profileId);
            }
        } else {
            if (profileId) {
                const filter = initialContract.filters.PostNote(BigNumber.from(profileId));
                events = await initialContract.queryFilter(filter);
            } else {
                throw new Error('Missing identity');
            }
        }

        const total = events.length;
        let hasMore;

        events = events.reverse();
        if (options.cursor) {
            events = events.slice(options.cursor);
        }
        if (options.limit) {
            hasMore = events.length > options.limit;
            events = events.slice(0, options.limit);
        }

        const list = await Promise.all(
            events.map(async (event: any) => {
                const profileId = event.args.profileId.toString();
                const nodeId = event.args.noteId.toString();
                const note = (await this.contract.getNote(profileId, nodeId, 'AnyUri')).data;

                // @ts-ignore
                const date = new Date(
                    (await initialContract.provider.getBlock(event.blockNumber)).timestamp * 1000,
                ).toISOString();

                const item: Note = Object.assign(
                    {
                        date_published: date,
                    },
                    note.metadata as Partial<Note>,
                    {
                        id: `${profileId}-${nodeId}`,

                        date_created: date,
                        date_updated: date,

                        related_urls: [
                            ...(note.linkItem?.uri && [note.linkItem?.uri]),
                            ...(note.contentUri && [this.main.utils.replaceIPFS(note.contentUri)]),
                            `https://scan.crossbell.io/tx/${event.transactionHash}`,
                        ],

                        authors: [options.identity],

                        source: 'Crossbell Note',
                        metadata: {
                            network: 'Crossbell',
                            proof: event.transactionHash,

                            block_number: event.blockNumber,
                        },
                    },
                );

                // Crossbell specification compatibility
                if (item.summary) {
                    item.summary = {
                        content: (<any>item).summary,
                        mime_type: 'text/markdown',
                    };
                }
                if ((<any>item).content) {
                    item.summary = {
                        content: (<any>item).content,
                        mime_type: 'text/markdown',
                    };
                    delete (<any>item).content;
                }

                if (item.attachments) {
                    item.attachments.forEach((attachment) => {
                        if (attachment.address) {
                            attachment.address = this.main.utils.replaceIPFS(attachment.address);
                        }
                        if (attachment.address && !attachment.mime_type) {
                            attachment.mime_type = this.main.utils.getMimeType(attachment.address);
                        }
                    });
                }

                return item;
            }),
        );

        return {
            total,
            ...(hasMore && { cursor: (options.cursor || 0) + options.limit }),

            list: list,
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
            await this.initSet();
        }

        let profileId = await this.main.utils.getCrossbellProfileId({
            identity: options.identity,
            platform: options.platform!,
        });
        if (profileId === '0') {
            return {
                code: 1,
                message: 'Profile not found',
            };
        }

        switch (options.action) {
            case 'add': {
                const web3Storage = new Web3Storage({
                    token: this.main.options.web3StorageAPIToken!,
                });

                // Crossbell specification compatibility
                if (input.body) {
                    (<any>input).content = input.body.content;
                    delete input.body;
                }
                if (input.summary) {
                    (<any>input).summary = input.summary.content;
                }
                let url;
                if (input.related_urls) {
                    if (input.related_urls.length > 1) {
                        throw new Error('Only one related_url is allowed');
                    } else {
                        url = input.related_urls[0];
                        delete input.related_urls;
                    }
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

                let data;
                if (url) {
                    data = await this.contractSet.postNoteForAnyUri(profileId, `ipfs://${cid}`, url);
                } else {
                    data = await this.contractSet.postNote(profileId, `ipfs://${cid}`);
                }

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
