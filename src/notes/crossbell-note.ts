import Main from '../index';
import Base from './base';
import { NotesOptions, NoteSetOptions, NoteInput } from './index';
import { Indexer, Contract, Network } from 'crossbell.js';
import { Web3Storage } from 'web3.storage';
import { BigNumber } from 'ethers';

class CrossbellNote extends Base {
    indexer: Indexer;
    contract: Contract;

    constructor(main: Main) {
        super(main);

        Network.setIpfsGateway(this.main.options.ipfsGateway!);
    }

    async init() {
        await Network.switchToCrossbellMainnet(this.main.options.ethereumProvider);
        this.contract = new Contract(this.main.options.ethereumProvider);
        await this.contract.connect();
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
        if (options.identity) {
            let profileId = await this.main.utils.getCrossbellProfileId({
                identity: options.identity,
                platform: options.platform!,
            });
            if (profileId === '0') {
                return {
                    total: 0,
                    list: [],
                };
            }
            const filter = initialContract.filters.PostNote(BigNumber.from(profileId));
            events = await initialContract.queryFilter(filter);
        } else if (options.filter?.url) {
            const filter = initialContract.filters.PostNote(
                null,
                null,
                this.contract.getLinkKeyForAnyUri(options.filter?.url),
            );
            events = await initialContract.queryFilter(filter);
        }

        const list = await Promise.all(
            events.reverse().map(async (event: any) => {
                const profileId = event.args.profileId.toString();
                const nodeId = event.args.noteId.toString();
                const note = (await this.contract.getNote(profileId, nodeId, 'AnyUri')).data;

                // @ts-ignore
                const date = new Date((await initialContract.provider.getBlock(event.blockNumber)).timestamp * 1000);

                const item: Note = Object.assign({}, note.metadata as Partial<Note>, {
                    id: `${profileId}-${nodeId}`,

                    date_created: date,
                    date_updated: date,

                    related_urls: [
                        ...(note.linkItem?.uri && [note.linkItem?.uri]),
                        `https://scan.crossbell.io/tx/${event.transactionHash}`,
                    ],

                    authors: [options.identity],

                    source: 'Crossbell Note',
                    metadata: {
                        network: 'Crossbell',
                        proof: event.transactionHash,

                        block_number: event.blockNumber,
                    },
                });

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
            total: list.length,
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
            await this.init();
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

                const blob = new Blob([JSON.stringify(input)], {
                    type: 'application/json',
                });
                const file = new File([blob], `${options.identity}.json`);
                const cid = await web3Storage.put([file], {
                    name: file.name,
                    maxRetries: 3,
                    wrapWithDirectory: false,
                });

                const data = await this.contract.postNote(profileId, `ipfs://${cid}`);

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
                    await this.contract.deleteNote(profileId, input.id);

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
