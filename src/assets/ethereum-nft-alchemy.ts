import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';
import { BigNumber } from 'ethers';
import { utils } from 'ethers/lib';

class EthereumNFTAlchemy extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        let result: Asset[] = [];

        const networkMap: {
            [key: string]: string;
        } = {
            Ethereum: 'https://eth-mainnet.alchemyapi.io/v2/',
            Polygon: 'https://polygon-mainnet.g.alchemy.com/v2/',
        };

        const pagination_id: string[] = [];
        let total = 0;

        await Promise.all(
            Object.keys(networkMap).map(async (network, index) => {
                const res = await axios.get(`${networkMap[network]}${this.main.options.alchemyAPIKey}/getNFTs/`, {
                    params: {
                        owner: options.identity,
                        pageKey: options.pagination_id?.[index],
                    },
                });
                const assets: Asset[] = res.data?.ownedNfts.map((item: any) => {
                    const tokenId = BigNumber.from(item.id.tokenId).toString();
                    const asset: Asset = {
                        tags: ['NFT'],
                        owners: [utils.getAddress(options.identity)],
                        name: item.title,
                        description: item.description,

                        source: 'Ethereum NFT',

                        metadata: {
                            network: network,
                            proof: `${item.contract.address}-${tokenId}`,

                            token_standard: `${item.id.tokenMetadata.tokenType.slice(
                                0,
                                3,
                            )}-${item.id.tokenMetadata.tokenType.slice(3)}`,
                            token_id: tokenId,

                            collection_address: item.contract.address,

                            providers: ['Alchemy'],
                        },
                    };

                    const preview = item.metadata.image || item.metadata.image_url;
                    if (preview) {
                        asset.previews = [
                            {
                                address: this.main.utils.replaceIPFS(preview),
                                mime_type: this.generateMimeType(preview),
                            },
                        ];
                    }

                    const infoItem = item.metadata.animation_url || item.metadata.image || item.metadata.image_url;
                    if (infoItem) {
                        asset.items = [
                            {
                                address: this.main.utils.replaceIPFS(infoItem),
                                mime_type: this.generateMimeType(infoItem),
                            },
                        ];
                    }

                    if (item.metadata.attributes) {
                        const attributes = this.generateAttributes(item.metadata.attributes);
                        if (attributes) {
                            asset.attributes = attributes;
                        }
                    }

                    this.generateRelatedUrls(asset);

                    if (item.metadata.external_url || item.metadata.external_link) {
                        if (!asset.related_urls) {
                            asset.related_urls = [];
                        }
                        asset.related_urls.push(item.metadata.external_url || item.metadata.external_link);
                    }

                    return asset;
                });

                result = result.concat(assets);

                if (assets.length < res.data?.totalCount) {
                    pagination_id[index] = res.data?.pageKey;
                }
                total += res.data?.totalCount || assets.length;

                return network;
            }),
        );

        return {
            total: total,
            ...(pagination_id.find((id) => id) && { pagination_id: pagination_id }),
            list: result,
        };
    }
}

export default EthereumNFTAlchemy;
