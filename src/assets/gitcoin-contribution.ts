import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';
import { utils } from 'ethers';
import { mergeWith, keyBy, values, uniqWith, isEqual } from 'lodash-es';
import type { Asset, Assets } from '../specifications';

class GitcoinContribution extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        const response = (
            await axios.get(`https://pregod.rss3.dev/v0.4.0/account:${options.identity}@ethereum/notes`, {
                params: {
                    item_sources: 'Gitcoin Contribution',
                },
            })
        ).data;

        const result: Assets = {
            total: response.total,
            list: response.list.map((item: any) => {
                const asset: Asset = {
                    date_created: item.date_created,
                    date_updated: item.date_updated,
                    tags: ['Donation'],
                    owners: [utils.getAddress(options.identity)],
                    name: item.title,
                    description: item.attachments.filter((attachment: any) => attachment.type === 'description')[0]
                        .content,

                    source: 'Gitcoin Contribution',

                    related_urls: item.related_urls,

                    metadata: {
                        network: item.metadata.approach === 'Standard' ? 'Ethereum' : item.metadata.approach,
                        proof: item.metadata.destination,

                        amounts: [
                            {
                                value: item.metadata.value_amount,
                                symbol: item.metadata.value_symbol,
                            },
                        ],

                        providers: ['RSS3'],
                    },
                };

                const preview = item.attachments.filter((attachment: any) => attachment.type === 'logo')[0].address;
                if (preview) {
                    asset.previews = [
                        {
                            address: preview,
                        },
                    ];
                }

                return asset;
            }),
        };

        let list = result.list;
        let merged = keyBy([list[0]], (item) => item.metadata?.proof);
        for (let i = 1; i < list.length; i++) {
            merged = mergeWith(
                merged,
                keyBy([list[i]], (item) => item.metadata?.proof),
                (a, b) => {
                    if (Array.isArray(a)) {
                        return uniqWith(a.concat(b), isEqual);
                    }
                },
            );
        }
        const assets = values(merged);

        result.list = assets as Asset[];

        return result;
    }
}

export default GitcoinContribution;
