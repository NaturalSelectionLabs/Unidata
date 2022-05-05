import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';

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
                        attachments: [],

                        source: 'Solana NFT',

                        metadata: {
                            network: 'Solana',
                            proof: item.tokenAddress,

                            token_standard: 'Metaplex',
                            token_id: item.tokenAddress,
                            token_symbol: data.onchainMetadata?.data.symbol,

                            collection_name: data.metadata?.data.collection.name,
                        },
                    };

                    if (data.metadata?.data.image) {
                        asset.attachments!.push({
                            type: 'preview',
                            address: data.metadata?.data.image,
                        });
                    }

                    if (data.metadata?.data.animation_url || data.metadata?.data.image) {
                        asset.attachments!.push({
                            type: 'object',
                            address: data.metadata?.data.animation_url || data.metadata?.data.image,
                        });
                    }

                    if (data.metadata?.data.attributes) {
                        asset.attachments!.push({
                            type: 'attributes',
                            content: JSON.stringify(data.metadata?.data.attributes),
                            mime_type: 'text/json',
                        });
                    }

                    this.generateRelatedUrls(asset);

                    if (data.metadata?.data.external_url) {
                        if (!asset.related_urls) {
                            asset.related_urls = [];
                        }
                        asset.related_urls.push(data.metadata?.data.external_url);
                    }

                    this.generateMimeType(asset);

                    return asset;
                }),
            )
        ).filter((asset) => asset);

        return assets;
    }
}

export default SolanaNFTSolscan;
