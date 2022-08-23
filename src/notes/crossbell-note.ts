import Main from '../index';
import Base from './base';
import { NotesOptions, NoteSetOptions, NoteInput } from './index';
import { Indexer, Contract, Network } from 'crossbell.js';
import type { Note } from '../specifications';
import { unionBy } from 'lodash-es';
import axios from 'axios';

class CrossbellNote extends Base {
    indexer: Indexer;
    contract: Contract;

    constructor(main: Main) {
        super(main);

        Network.setIpfsGateway(this.main.options.ipfsGateway!);
    }

    async get(options: NotesOptions) {
        if (!this.indexer) {
            this.indexer = new Indexer();
        }

        options = Object.assign(
            {
                platform: 'Ethereum',
            },
            options,
        );

        let characterId: number | undefined;
        if (options.identity) {
            characterId = (
                await this.main.utils.getCrossbellCharacter({
                    identity: options.identity,
                    platform: options.platform!,
                })
            )?.characterId;
            if (!characterId) {
                return {
                    total: 0,
                    list: [],
                };
            }
        }
        let res;
        if (options.filter?.id) {
            const note = await this.indexer.getNote(characterId + '', options.filter.id.split('-')[1]);
            if (note) {
                res = {
                    count: 1,
                    list: [note],
                };
            } else {
                res = {
                    count: 0,
                    list: [],
                };
            }
        } else {
            res = await this.indexer.getNotes({
                cursor: options.cursor,
                includeDeleted: false,
                limit: options.limit,
                includeEmptyMetadata: true,
                ...(characterId && { characterId: characterId + '' }),
                ...(options.filter?.url && { externalUrls: options.filter?.url }),
                ...(options.filter?.tags && { tags: options.filter?.tags }),
            });
        }

        const list = (
            await Promise.all(
                res?.list.map(async (event: any) => {
                    if (event.metadata.uri && !event.metadata.content) {
                        try {
                            const res = await axios.get(this.main.utils.replaceIPFS(event.metadata.uri));
                            event.metadata.content = res.data;

                            if (
                                options.filter?.url &&
                                !event.metadata.content.external_urls?.includes(options.filter?.url)
                            ) {
                                return null;
                            }

                            if (options.filter?.tags) {
                                if (!Array.isArray(options.filter?.tags)) {
                                    options.filter.tags = [options.filter.tags];
                                }
                                if (
                                    !options.filter.tags.every((tag: string) =>
                                        event.metadata.content.tags?.includes(tag),
                                    )
                                ) {
                                    return null;
                                }
                            }
                        } catch (error) {
                            console.warn(error);
                        }
                    }

                    const item: Note = Object.assign(
                        {
                            date_published: event.createdAt,
                        },
                        event.metadata?.content,
                        {
                            id: `${characterId}-${event.noteId}`,

                            date_created: event.createdAt,
                            date_updated: event.updatedAt,

                            related_urls: [
                                ...(event.toUri ? [event.toUri] : []),
                                ...(event.uri ? [this.main.utils.replaceIPFS(event.uri)] : []),
                                `https://scan.crossbell.io/tx/${event.transactionHash}`,
                                ...(event.updatedTransactionHash &&
                                event.updatedTransactionHash !== event.transactionHash
                                    ? [`https://scan.crossbell.io/tx/${event.updatedTransactionHash}`]
                                    : []),
                            ],

                            authors: [options.identity!],

                            source: 'Crossbell Note',
                            metadata: {
                                network: 'Crossbell',
                                proof: `${characterId}-${event.noteId}`,

                                block_number: event.blockNumber,
                                owner: event.owner,
                                transactions: [
                                    event.transactionHash,
                                    ...(event.transactionHash !== event.updatedTransactionHash
                                        ? [event.updatedTransactionHash]
                                        : []),
                                ],

                                raw: event.metadata?.content,
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
                        item.body = {
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
                    if ((<any>item).sources) {
                        item.applications = (<any>item).sources;
                        delete (<any>item).sources;
                    }

                    return item;
                }),
            )
        ).filter((item) => item) as Note[];

        return {
            total: res.count,
            ...(res.cursor && { cursor: res.cursor }),

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

        if (!this.contract) {
            this.contract = new Contract(this.main.options.ethereumProvider);
            await this.contract.connect();
        }

        let characterId = (
            await this.main.utils.getCrossbellCharacter({
                identity: options.identity,
                platform: options.platform!,
            })
        )?.characterId;
        if (!characterId) {
            return {
                code: 1,
                message: 'Character not found',
            };
        }

        // Crossbell specification compatibility
        if (input.body) {
            (<any>input).content = input.body.content;
            delete input.body;
        }
        if (input.summary) {
            (<any>input).summary = input.summary.content;
        }
        if (input.related_urls) {
            (<any>input).external_urls = input.related_urls;
            delete input.related_urls;
        }
        if (input.applications) {
            (<any>input).sources = input.applications;
            delete input.applications;
        }

        switch (options.action) {
            case 'add': {
                const ipfs = await this.main.utils.uploadToIPFS(input);

                const data = await this.contract.postNote(characterId + '', ipfs);

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
                } else if (input.id.split('-')[0] !== characterId + '') {
                    return {
                        code: 1,
                        message: 'Wrong id',
                    };
                } else {
                    await this.contract.deleteNote(characterId + '', input.id.split('-')[1]);

                    return {
                        code: 0,
                        message: 'Success',
                    };
                }
            }
            case 'update': {
                if (!input.id) {
                    return {
                        code: 1,
                        message: 'Missing id',
                    };
                } else if (input.id.split('-')[0] !== characterId + '') {
                    return {
                        code: 1,
                        message: 'Wrong id',
                    };
                } else {
                    if (!this.indexer) {
                        this.indexer = new Indexer();
                    }
                    const note = await this.indexer.getNote(characterId + '', input.id.split('-')[1]);
                    if (!note) {
                        return {
                            code: 1,
                            message: 'Note not found',
                        };
                    } else {
                        const id = input.id;
                        delete input.id;
                        const result = Object.assign({}, note.metadata?.content, input);
                        if (input.attributes && note.metadata?.content?.attributes) {
                            result.attributes = unionBy(
                                input.attributes,
                                note.metadata.content.attributes,
                                'trait_type',
                            );
                        }
                        const ipfs = await this.main.utils.uploadToIPFS(result);
                        await this.contract.setNoteUri(characterId + '', id.split('-')[1], ipfs);

                        return {
                            code: 0,
                            message: 'Success',
                        };
                    }
                }
            }
            default:
                throw new Error(`Unsupported action: ${options.action}`);
        }
    }
}

export default CrossbellNote;
