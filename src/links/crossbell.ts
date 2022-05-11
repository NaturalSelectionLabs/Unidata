import Main from '../index';
import Base from './base';
import { LinksOptions } from './index';
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

    async get(options: LinksOptions) {
        if (!this.inited) {
            await this.init();
        }
        if (!options.type) {
            options.type = 'follow';
        }

        const profiles = await this.indexer.getProfiles(options.identity);

        let res = await this.indexer[options.reversed ? 'getBacklinkingProfiles' : 'getLinkingProfiles'](
            options.identity,
            options.type,
            {
                limit: options.limit,
            },
        );
        const list = res?.list?.map((item: any) => ({
            date_created: item.created_at,

            from: options.reversed
                ? item.to_detail.handle
                : profiles.list.find((profile: any) => profile.token_id === item.from)?.handle,
            to: options.reversed
                ? profiles.list.find((profile: any) => profile.token_id === item.from)?.handle
                : item.to_detail.handle,
            type: options.type || '',
            source: 'Crossbell',

            metadata: {
                network: 'Crossbell',
                proof: item.transaction_hash,
                block_number: item.block_number,

                from_owner: options.reversed ? item.to_detail.owner : options.identity,
                to_owner: options.reversed ? options.identity : item.to_detail.owner,
            },
        }));

        return {
            total: res?.total,
            list,
        };
    }
}

export default Crossbell;
