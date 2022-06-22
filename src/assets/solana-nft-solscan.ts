import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';
import type { Asset } from '../specifications';

class SolanaNFTSolscan extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        const list = (
            await axios.get(`https://public-api.solscan.io/account/tokens`, {
                params: {
                    account: options.identity,
                },
            })
        ).data;
        const assets: Asset[] = (
            await Promise.all(
                list.map(async (item: any) => {
                    let data: any = {};
                    try {
                        data = (await axios.get(`https://public-api.solscan.io/account/${item.tokenAddress}`)).data;
                    } catch (error) {}

                    if (data.tokenInfo.type !== 'nft') {
                        return false;
                    }

                    const asset: Asset = {
                        tags: ['NFT'],
                        owners: [options.identity],
                        name: data.metadata?.data.name || data.onchainMetadata?.data.name,
                        description: data.metadata?.data.description,

                        source: 'Solana NFT',

                        metadata: {
                            network: 'Solana',
                            proof: item.tokenAddress,

                            token_standard: 'Metaplex',
                            token_id: item.tokenAddress,
                            token_symbol: data.onchainMetadata?.data.symbol,

                            collection_name: data.metadata?.data.collection.name,

                            providers: ['Solscan'],
                        },
                    };

                    if (data.metadata?.data.image) {
                        asset.previews = [
                            {
                                address: data.metadata?.data.image,
                            },
                        ];
                    }

                    const infoItem = data.metadata?.data.animation_url || data.metadata?.data.image;
                    if (infoItem) {
                        asset.items = [
                            {
                                address: infoItem,
                            },
                        ];
                    }

                    if (data.metadata?.data.attributes) {
                        const attributes = this.generateAttributes(data.metadata?.data.attributes);
                        if (attributes) {
                            asset.attributes = attributes;
                        }
                    }

                    if (data.metadata?.data.external_url) {
                        if (!asset.related_urls) {
                            asset.related_urls = [];
                        }
                        asset.related_urls.push(data.metadata?.data.external_url);
                    }

                    return asset;
                }),
            )
        ).filter((asset) => asset);

        return {
            total: assets.length,
            list: assets,
        };
    }
}

export default SolanaNFTSolscan;
