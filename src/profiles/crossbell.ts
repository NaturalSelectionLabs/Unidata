import Main from '../index';
import Base from './base';
import { ProfilesOptions } from './index';
import { Indexer } from 'crossbell.js';

class Crossbell extends Base {
    indexer: Indexer;

    constructor(main: Main) {
        super(main);
    }

    private async init() {
        this.indexer = new Indexer();
        this.inited = true;
    }

    async get(options: ProfilesOptions) {
        if (!this.inited) {
            await this.init();
        }
        const res = await this.indexer.getProfiles(options.identity, {
            lastIdentifier: options.cursor,
            limit: options.limit,
        });

        const list = res.list.map((item: any) => {
            const profile: Profile = Object.assign(
                {
                    name: item.handle,
                    source: 'Crossbell',

                    metadata: {
                        network: 'Crossbell',
                        proof: item.transaction_hash,

                        handler: item.handle,
                        primary: item.primary,
                        token_id: item.token_id,
                        block_number: item.block_number,
                    },
                },
                {
                    ...(item.metadata?.name && { name: item.metadata.name }),
                    ...(item.metadata?.bio && { bio: item.metadata.bio }),
                    ...(item.metadata?.banners && { banners: this.main.utils.replaceIPFSs(item.metadata.banners) }),
                    ...(item.metadata?.avatars && { avatars: this.main.utils.replaceIPFSs(item.metadata.avatars) }),
                    ...(item.metadata?.websites && { websites: item.metadata.websites }),
                    ...(item.metadata?.connected_accounts && { connected_accounts: item.metadata.connected_accounts }),
                },
            );

            return profile;
        });

        return {
            total: res.total,
            ...(options.limit && list.length >= options.limit && { cursor: list[list.length - 1].metadata?.token_id }),

            list,
        };
    }
}

export default Crossbell;
