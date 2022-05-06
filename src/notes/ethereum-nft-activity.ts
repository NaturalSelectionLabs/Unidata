import Main from '../index';
import Base from './base';
import { NotesOptions } from './index';
import axios from 'axios';

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
                },
            })
        ).data;

        const result: Notes = {
            total: response.total,
            list: response.list.map((item: any) => {
                delete item.identifier;
                delete item.links;
                delete item.backlinks;

                item.authors = item.authors.map((author: string) => {
                    return {
                        identity: author.match(/account:(.*)@/)?.[1],
                        platform: author.match(/@(.*)$/)?.[1],
                    };
                });

                if (!item.attachments) {
                    item.attachments = [];
                }
                item.attachments.forEach((attachment: any) => {
                    if (attachment.address) {
                        attachment.address = this.main.utils.replaceIPFS(attachment.address);
                    }
                    return attachment;
                });

                return item;
            }),
        };

        return result;
    }
}

export default EthereumNFTActivity;
