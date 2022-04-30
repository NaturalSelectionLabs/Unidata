import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';

class EthereumNFTOpensea extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        const res = await axios.get('https://api.opensea.io/api/v1/assets', {
            params: {
                format: 'json',
                owner: options.identity,
                limit: 50,
            },
        });
        const assets: Asset[] = res.data?.assets.map((item: any) => {
            const asset: Asset = {
                owners: [item.owner.address],
                name: item.name,
                description: item.description,
                attachments: [],

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
                },
            };

            if (item.image_original_url) {
                asset.attachments!.push({
                    type: 'preview',
                    address: this.main.utils.replaceIPFS(item.image_original_url),
                });
            }

            if (item.animation_original_url) {
                asset.attachments!.push({
                    type: 'object',
                    address: this.main.utils.replaceIPFS(item.animation_original_url),
                });
            }

            if (item.traits) {
                asset.attachments!.push({
                    type: 'attributes',
                    content: JSON.stringify(item.traits),
                    mime_type: 'text/json',
                });
            }

            this.generateRelatedUrls(asset);

            if (item.external_link) {
                if (!asset.related_urls) {
                    asset.related_urls = [];
                }
                asset.related_urls.push(item.external_link);
            }

            this.generateMimeType(asset);

            return asset;
        });

        return assets;
    }
}

export default EthereumNFTOpensea;
