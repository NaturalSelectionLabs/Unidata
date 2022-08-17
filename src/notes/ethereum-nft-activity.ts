import Main from '../index';
import Base from './base';
import { NotesOptions } from './index';
import axios from 'axios';
import type { Notes } from '../specifications';

class EthereumNFTActivity extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: NotesOptions) {
        const response = (
            await axios.get(`https://pregod.rss3.dev/v0.4.0/account:${options.identity}@ethereum/notes`, {
                params: {
                    item_sources: 'Ethereum NFT',
                    limit: options.limit,
                    last_identifier: options.cursor,
                },
            })
        ).data;

        const result: Notes = {
            total: response.total,
            ...(new URL(response.identifier_next && response.identifier_next).searchParams.get('last_identifier') && {
                cursor: new URL(response.identifier_next).searchParams.get('last_identifier'),
            }),

            list: response.list.map((item: any) => {
                delete item.links;
                delete item.backlinks;

                item.id = item.identifier;
                delete item.identifier;

                item.authors = item.authors.map((author: string) => {
                    return {
                        identity: author.match(/account:(.*)@/)?.[1],
                        platform: author.match(/@(.*)$/)?.[1],
                    };
                });

                item.title =
                    item.metadata.from === options.identity ? 'Lost an NFT: ' : 'Got an NFT: ' + (item.title || '');
                item.summary = {
                    content: item.summary,
                    mime_type: 'text/plain',
                };

                if (!item.attachments) {
                    item.attachments = [];
                }
                item.attachments.forEach((attachment: any) => {
                    if (attachment.address) {
                        attachment.address = this.main.utils.replaceIPFS(attachment.address);
                    }
                    attachment.name = attachment.type;
                    delete attachment.type;
                    return attachment;
                });

                const body = item.attachments?.find((attachment: any) => attachment.name === 'body');
                if (body) {
                    item.body = body;
                    item.attachments = item.attachments.filter((attachment: any) => attachment.name !== 'body');
                    if (!item.attachments.length) {
                        delete item.attachments;
                    }
                    delete item.body.type;
                } else {
                    item.body = item.summary;
                }

                return item;
            }),
        };

        return result;
    }

    set: undefined;
}

export default EthereumNFTActivity;
