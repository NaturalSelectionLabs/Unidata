import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';
import { utils } from 'ethers';
import type { Asset } from '../specifications';

class EthereumNFTNFTScan extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        if (!this.main.options.nftscanAPIKey) {
            return {
                total: 0,
                list: [],
            };
        }

        let result: Asset[] = [];

        const networkMap: {
            [key: string]: string;
        } = {
            Ethereum: 'https://restapi.nftscan.com/',
            Polygon: 'https://polygonapi.nftscan.com/',
            'Binance Smart Chain': 'https://bnbapi.nftscan.com/',
            Arbitrum: 'https://arbitrumapi.nftscan.com/',
            Moonbeam: 'https://moonbeamapi.nftscan.com/',
            Optimism: 'https://optimismapi.nftscan.com/',
        };

        const cursor: string[] = [];
        let total = 0;

        let networkWithErc: string[][] = [];
        const networks = Object.keys(networkMap);
        for (let i = 0; i < networks.length; i++) {
            networkWithErc = networkWithErc.concat([
                [networks[i], 'erc721'],
                [networks[i], 'erc1155'],
            ]);
        }

        await Promise.all(
            networkWithErc.map(async (nwe, index) => {
                const res = await axios.get(`${networkMap[nwe[0]]}api/v2/account/own/${options.identity}`, {
                    params: {
                        erc_type: nwe[1],
                        limit: 100,
                        cursor: options.cursor?.[index],
                    },
                    headers: {
                        'X-API-KEY': this.main.options.nftscanAPIKey!,
                    },
                });
                const assets: Asset[] = res.data?.data?.content?.map((item: any) => {
                    let metadata;
                    if (item.metadata_json) {
                        try {
                            metadata = JSON.parse(item.metadata_json);
                        } catch (error) {}
                    }
                    const asset: Asset = {
                        date_created: new Date(item.mint_timestamp).toISOString(),

                        tags: ['NFT'],
                        owners: [utils.getAddress(options.identity)],
                        name: item.name || metadata?.name,
                        description: metadata?.description,

                        source: 'Ethereum NFT',

                        metadata: {
                            network: nwe[0],
                            proof: `${item.contract_address}-${item.token_id}`,

                            token_standard: nwe[1] === 'erc721' ? 'ERC-721' : 'ERC-1155',
                            token_id: item.token_id,

                            collection_address: item.contract_address,
                            collection_name: item.contract_name,

                            providers: ['NFTScan'],
                        },
                    };

                    const preview = metadata?.image || metadata?.image_url;
                    if (preview) {
                        asset.previews = [
                            {
                                address: preview,
                            },
                        ];
                    }

                    const infoItem = metadata?.animation_url || metadata?.image || metadata?.image_url;
                    if (infoItem) {
                        asset.items = [
                            {
                                address: infoItem,
                            },
                        ];
                    }

                    if (metadata?.attributes) {
                        const attributes = this.generateAttributes(metadata?.attributes);
                        if (attributes) {
                            asset.attributes = attributes;
                        }
                    }

                    if (metadata?.external_url || metadata?.external_link) {
                        if (!asset.related_urls) {
                            asset.related_urls = [];
                        }
                        asset.related_urls.push(metadata?.external_url || metadata?.external_link);
                    }

                    return asset;
                });

                result = result.concat(assets);

                total += res.data?.data?.total;

                if (res.data?.data?.total && res.data?.data?.total > assets.length) {
                    cursor[index] = res.data?.data?.next;
                }

                return nwe[0];
            }),
        );

        return {
            total: total,
            ...(cursor.find((id) => id) && { cursor: cursor }),
            list: result,
        };
    }
}

export default EthereumNFTNFTScan;
