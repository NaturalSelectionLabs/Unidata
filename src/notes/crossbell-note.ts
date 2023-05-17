import Main from '../index';
import Base from './base';
import { NotesOptions, NoteSetOptions, NoteInput } from './index';
import { Indexer, Contract, Network, NoteEntity, ListResponse } from 'crossbell';
import type { Note } from '../specifications';
import { unionBy } from 'lodash-es';
import axios from 'axios';

const orderByMap = {
    date_created: 'createdAt',
    date_updated: 'updatedAt',
    date_published: 'publishedAt',
};

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
        let res: ListResponse<NoteEntity>;
        if (options.filter?.id) {
            const note = await this.indexer.getNote(characterId + '', options.filter.id.split('-')[1]);
            if (note) {
                res = {
                    count: 1,
                    cursor: null,
                    list: [note],
                };
            } else {
                res = {
                    count: 0,
                    cursor: null,
                    list: [],
                };
            }
        } else {
            res = await this.indexer.getNotes({
                cursor: options.cursor,
                includeDeleted: options.include_deleted,
                limit: options.limit,
                includeEmptyMetadata: true,
                ...(options.order_by && { orderBy: orderByMap[options.order_by] }),
                ...(characterId && { characterId: characterId + '' }),
                ...(options.filter?.url && { externalUrls: options.filter?.url }),
                ...(options.filter?.tags && { tags: options.filter?.tags }),
                ...(options.filter?.applications && { sources: options.filter?.applications }),
            });
        }

        const list = (
            await Promise.all(
                res?.list.map(async (event: any) => {
                    if (event.metadata.uri && !event.metadata.content) {
                        try {
                            const ipfsRes = await axios.get(this.main.utils.replaceIPFS(event.metadata.uri), {
                                ...(typeof window === 'undefined' && {
                                    headers: {
                                        'User-Agent':
                                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                                    },
                                }),
                            });
                            event.metadata.content = ipfsRes.data;

                            if (
                                options.filter?.url &&
                                !event.metadata.content.external_urls?.includes(options.filter?.url)
                            ) {
                                res.count--;
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
                                    res.count--;
                                    return null;
                                }
                            }

                            if (options.filter?.applications) {
                                if (!Array.isArray(options.filter?.applications)) {
                                    options.filter.applications = [options.filter.applications];
                                }
                                if (
                                    !options.filter.applications.every((application: string) =>
                                        event.metadata.content.sources?.includes(application),
                                    )
                                ) {
                                    res.count--;
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

                            authors: [event.operator],

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

    async set(
        options: NoteSetOptions,
        input: NoteInput,
        extra?: {
            targetUri?: string;
            targetNote?: string;
            newbieToken?: string;
        },
    ) {
        options = Object.assign(
            {
                platform: 'Ethereum',
                action: 'add',
            },
            options,
        );

        if (!this.contract && !extra?.newbieToken) {
            this.contract = new Contract(this.main.options.ethereumProvider);
            await this.contract.connect();
        }
        if (!this.indexer) {
            this.indexer = new Indexer();
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
                let data;
                if (extra?.newbieToken) {
                    let link = {};
                    if (extra && extra.targetUri) {
                        link = {
                            linkItemType: 'AnyUri',
                            linkItem: {
                                uri: extra.targetUri,
                            },
                        };
                    } else if (extra && extra.targetNote) {
                        link = {
                            linkItemType: 'Note',
                            linkItem: {
                                characterId: extra.targetNote.split('-')?.[0],
                                noteId: extra.targetNote.split('-')?.[1],
                            },
                        };
                    }
                    data = (
                        await axios.put(
                            `${this.indexer.endpoint}/newbie/contract/notes`,
                            Object.assign(
                                {
                                    metadata: input,
                                    locked: false,
                                },
                                link,
                            ),
                            {
                                headers: {
                                    authorization: `Bearer ${extra?.newbieToken}`,
                                },
                            },
                        )
                    ).data;
                } else {
                    const ipfs = await this.main.utils.uploadToIPFS(input);

                    if (extra && extra.targetUri) {
                        data = await this.contract.postNoteForAnyUri(characterId + '', ipfs, extra.targetUri);
                    } else if (extra && extra.targetNote) {
                        data = await this.contract.postNoteForNote(
                            characterId + '',
                            ipfs,
                            extra.targetNote.split('-')?.[0],
                            extra.targetNote.split('-')?.[1],
                        );
                    } else {
                        data = await this.contract.postNote(characterId + '', ipfs);
                    }
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
                } else if (input.id.split('-')[0] !== characterId + '') {
                    return {
                        code: 1,
                        message: 'Wrong id',
                    };
                } else if (extra?.newbieToken) {
                    await axios.delete(`${this.indexer.endpoint}/newbie/contract/notes/${input.id.split('-')[1]}`, {
                        headers: {
                            authorization: `Bearer ${extra?.newbieToken}`,
                        },
                    });
                } else {
                    await this.contract.deleteNote(characterId + '', input.id.split('-')[1]);
                }

                return {
                    code: 0,
                    message: 'Success',
                };
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
                    const note = await this.indexer.getNote(characterId + '', input.id.split('-')[1]);
                    if (!note) {
                        return {
                            code: 1,
                            message: 'Note not found',
                        };
                    } else {
                        const id = input.id;
                        delete input.id;
                        if (note.metadata?.uri && !note.metadata?.content) {
                            note.metadata.content = (
                                await axios.get(this.main.utils.replaceIPFS(note.metadata.uri), {
                                    ...(typeof window === 'undefined' && {
                                        headers: {
                                            'User-Agent':
                                                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                                        },
                                    }),
                                })
                            ).data;
                        }
                        const result = Object.assign({}, note.metadata?.content, input);
                        if (input.attributes && note.metadata?.content?.attributes) {
                            result.attributes = unionBy(
                                input.attributes,
                                note.metadata.content.attributes,
                                'trait_type',
                            );
                        }

                        if (extra?.newbieToken) {
                            await axios.post(
                                `${this.indexer.endpoint}/newbie/contract/notes/${id.split('-')[1]}/metadata`,
                                {
                                    metadata: result,
                                    mode: 'replace',
                                },
                                {
                                    headers: {
                                        authorization: `Bearer ${extra?.newbieToken}`,
                                    },
                                },
                            );
                        } else {
                            const ipfs = await this.main.utils.uploadToIPFS(result);
                            await this.contract.setNoteUri(characterId + '', id.split('-')[1], ipfs);
                        }

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
