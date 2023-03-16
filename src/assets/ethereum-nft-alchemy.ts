import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';
import { BigNumber, utils } from 'ethers';
import type { Asset } from '../specifications';

class EthereumNFTAlchemy extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        let result: Asset[] = [];

        const networkMap: {
            [key: string]: {
                endpoint: string;
                keyName: 'alchemyEthereumAPIKey' | 'alchemyPolygonAPIKey';
            };
        } = {
            Ethereum: {
                endpoint: 'https://eth-mainnet.alchemyapi.io/v2/',
                keyName: 'alchemyEthereumAPIKey',
            },
            Polygon: {
                endpoint: 'https://polygon-mainnet.g.alchemy.com/v2/',
                keyName: 'alchemyPolygonAPIKey',
            },
        };

        const cursor: string[] = [];
        let total = 0;

        await Promise.all(
            Object.keys(networkMap).map(async (network, index) => {
                const key = this.main.options[networkMap[network].keyName];
                if (!key) {
                    return;
                }
                const res = await axios.get(`${networkMap[network].endpoint}${key}/getNFTs/`, {
                    params: {
                        owner: options.identity,
                        pageKey: options.cursor?.[index],
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

                    const preview = item.metadata?.image || item.metadata?.image_url;
                    if (preview) {
                        asset.previews = [
                            {
                                address: preview,
                            },
                        ];
                    }

                    const infoItem = item.metadata?.animation_url || item.metadata?.image || item.metadata?.image_url;
                    if (infoItem) {
                        asset.items = [
                            {
                                address: infoItem,
                            },
                        ];
                    }

                    if (item.metadata?.attributes) {
                        const attributes = this.generateAttributes(item.metadata?.attributes);
                        if (attributes) {
                            asset.attributes = attributes;
                        }
                    }

                    if (item.metadata?.external_url || item.metadata?.external_link) {
                        if (!asset.related_urls) {
                            asset.related_urls = [];
                        }
                        asset.related_urls.push(item.metadata?.external_url || item.metadata?.external_link);
                    }

                    return asset;
                });

                result = result.concat(assets);

                if (assets.length < res.data?.totalCount) {
                    cursor[index] = res.data?.pageKey;
                }
                total += res.data?.totalCount || assets.length;

                return network;
            }),
        );

        return {
            total: total,
            ...(cursor.find((id) => id) && { cursor: cursor }),
            list: result,
        };
    }
}

export default EthereumNFTAlchemy;
