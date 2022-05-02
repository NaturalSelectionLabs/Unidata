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
            throw new Error('Moralis Web3 API key is not set');
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
                    attachments: [],

                    source: 'Solana NFT',

                    metadata: {
                        network: 'Solana',
                        proof: item.mint,

                        token_standard: moralisdata.standard,
                        token_id: item.mint,
                        token_symbol: metadata.symbol || moralisdata.symbol,

                        collection_name: metadata.collection?.name,
                    },
                };

                if (metadata.image) {
                    asset.attachments!.push({
                        type: 'preview',
                        address: metadata.image,
                    });
                }

                if (metadata.animation_url || metadata.image) {
                    asset.attachments!.push({
                        type: 'object',
                        address: metadata.animation_url || metadata.image,
                    });
                }

                if (metadata.attributes) {
                    asset.attachments!.push({
                        type: 'attributes',
                        content: JSON.stringify(metadata.attributes),
                        mime_type: 'text/json',
                    });
                }

                this.generateRelatedUrls(asset);

                if (metadata.external_url) {
                    if (!asset.related_urls) {
                        asset.related_urls = [];
                    }
                    asset.related_urls.push(metadata.external_url);
                }

                this.generateMimeType(asset);

                return asset;
            }),
        );

        return assets;
    }
}

export default SolanaNFTMoralis;
