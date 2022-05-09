import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';
import { BigNumber } from 'ethers';

class FlowNFTAlchemy extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        const res = await axios.get(
            `https://flow-mainnet.g.alchemy.com/v2/${this.main.options.alchemyAPIKey}/getNFTs/`,
            {
                params: {
                    owner: options.identity,
                },
            },
        );
        const assets: Asset[] = res.data?.nfts.map((item: any) => {
            const tokenId = BigNumber.from(item.id.tokenId).toString();
            const asset: Asset = {
                tags: ['NFT'],
                owners: [options.identity],
                name: item.title,
                description: item.description,

                source: 'Flow NFT',

                metadata: {
                    network: 'Flow',
                    proof: `${item.contract.address}-${tokenId}`,

                    token_id: tokenId,

                    collection_address: item.contract.address,
                    collection_name: item.contract.name,

                    providers: ['Alchemy'],
                },
            };

            if (item.media?.length) {
                asset.previews = item.media.map((media: any) => ({
                    address: this.main.utils.replaceIPFS(media.uri),
                    mime_type: this.generateMimeType(media.uri),
                }));
            }

            asset.items = asset.previews;

            if (item.metadata.metadata) {
                const attributes = this.generateAttributes(item.metadata.metadata);
                if (attributes) {
                    asset.attributes = attributes;
                }
            }

            this.generateRelatedUrls(asset);

            if (item.externalDomainViewUrl) {
                if (!asset.related_urls) {
                    asset.related_urls = [];
                }
                asset.related_urls.push(item.externalDomainViewUrl);
            }

            return asset;
        });

        return {
            total: res.data.nftCount,
            list: assets,
        };
    }
}

export default FlowNFTAlchemy;
