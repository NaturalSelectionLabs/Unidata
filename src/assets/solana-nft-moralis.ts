import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';

class SolanaNFTMoralis extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        if (!this.main.options.moralisWeb3APIKey) {
            return {
                total: 0,
                list: [],
            };
        }

        const list = (
            await axios.get(`https://solana-gateway.moralis.io/account/mainnet/${options.identity}/nft`, {
                headers: {
                    'x-api-key': this.main.options.moralisWeb3APIKey!,
                },
            })
        ).data;
        const assets: Asset[] = await Promise.all(
            list.map(async (item: any) => {
                let moralisdata: any = {};
                try {
                    moralisdata = (
                        await axios.get(`https://solana-gateway.moralis.io/nft/mainnet/${item.mint}/metadata`, {
                            headers: {
                                'x-api-key': this.main.options.moralisWeb3APIKey!,
                            },
                        })
                    ).data;
                } catch (error) {}

                let metadata: any = {};
                try {
                    metadata = (await axios.get(moralisdata.metaplex?.metadataUri)).data;
                } catch (error) {}

                const asset: Asset = {
                    tags: ['NFT'],
                    owners: [options.identity],
                    name: metadata.name || moralisdata.name,
                    description: metadata.description,

                    source: 'Solana NFT',

                    metadata: {
                        network: 'Solana',
                        proof: item.mint,

                        token_standard: moralisdata.standard,
                        token_id: item.mint,
                        token_symbol: metadata.symbol || moralisdata.symbol,

                        collection_name: metadata.collection?.name,

                        providers: ['Moralis'],
                    },
                };

                if (metadata.image) {
                    asset.previews = [
                        {
                            address: this.main.utils.replaceIPFS(metadata.image),
                            mime_type: this.generateMimeType(metadata.image),
                        },
                    ];
                }

                const infoItem = metadata.animation_url || metadata.image;
                if (infoItem) {
                    asset.items = [
                        {
                            address: this.main.utils.replaceIPFS(infoItem),
                            mime_type: this.generateMimeType(infoItem),
                        },
                    ];
                }

                if (metadata.attributes) {
                    const attributes = this.generateAttributes(metadata.attributes);
                    if (attributes) {
                        asset.attributes = attributes;
                    }
                }

                this.generateRelatedUrls(asset);

                if (metadata.external_url) {
                    if (!asset.related_urls) {
                        asset.related_urls = [];
                    }
                    asset.related_urls.push(metadata.external_url);
                }

                return asset;
            }),
        );

        return {
            total: assets.length,
            list: assets,
        };
    }
}

export default SolanaNFTMoralis;
