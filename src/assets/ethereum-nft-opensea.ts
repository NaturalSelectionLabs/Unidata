import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';
import { utils } from 'ethers';
import type { Asset } from '../specifications';

class EthereumNFTOpensea extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        const res = await axios.get('https://api.opensea.io/api/v1/assets', {
            params: {
                format: 'json',
                owner: options.identity,
                limit: options.limit || 50,
                next: options.cursor,
            },
            headers: {
                'x-api-key': this.main.options.openseaAPIKey || '',
            },
        });
        const assets: Asset[] = res.data?.assets.map((item: any) => {
            const asset: Asset = {
                tags: ['NFT'],
                owners: [utils.getAddress(options.identity)],
                name: item.name,
                description: item.description,

                source: 'Ethereum NFT',

                metadata: {
                    network: 'Ethereum',
                    proof: `${item.asset_contract.address}-${item.token_id}`,

                    token_standard: `${item.asset_contract.schema_name.slice(
                        0,
                        3,
                    )}-${item.asset_contract.schema_name.slice(3)}`,
                    token_id: item.token_id,
                    token_symbol: item.asset_contract.symbol,

                    collection_address: item.asset_contract.address,
                    collection_name: item.asset_contract.name,

                    providers: ['OpenSea'],
                },
            };

            if (item.image_original_url) {
                asset.previews = [
                    {
                        address: item.image_original_url,
                    },
                ];
            }

            if (item.animation_original_url) {
                asset.items = [
                    {
                        address: item.animation_original_url,
                    },
                ];
            }

            if (item.traits) {
                const attributes = this.generateAttributes(item.traits);
                if (attributes) {
                    asset.attributes = attributes;
                }
            }

            if (item.external_link) {
                if (!asset.related_urls) {
                    asset.related_urls = [];
                }
                asset.related_urls.push(item.external_link);
            }

            return asset;
        });

        return {
            total: assets.length,
            ...(res.data?.next && { cursor: res.data?.next }),
            list: assets,
        };
    }
}

export default EthereumNFTOpensea;
