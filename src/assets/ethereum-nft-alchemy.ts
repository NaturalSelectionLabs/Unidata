import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';
import { BigNumber } from 'ethers';

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

        await Promise.all(
            Object.keys(networkMap).map(async (network) => {
                const res = await axios.get(`${networkMap[network]}${this.main.options.alchemyAPIKey}/getNFTs/`, {
                    params: {
                        owner: options.identity,
                    },
                });
                const assets: Asset[] = res.data?.ownedNfts.map((item: any) => {
                    const tokenId = BigNumber.from(item.id.tokenId).toString();
                    const asset: Asset = {
                        tags: ['NFT'],
                        owners: [options.identity],
                        name: item.title,
                        description: item.description,
                        attachments: [],

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
                        },
                    };

                    if (item.metadata.image || item.metadata.image_url) {
                        asset.attachments!.push({
                            type: 'preview',
                            address: this.main.utils.replaceIPFS(item.metadata.image || item.metadata.image_url),
                        });
                    }

                    if (item.metadata.animation_url || item.metadata.image || item.metadata.image_url) {
                        asset.attachments!.push({
                            type: 'object',
                            address: this.main.utils.replaceIPFS(
                                item.metadata.animation_url || item.metadata.image || item.metadata.image_url,
                            ),
                        });
                    }

                    if (item.metadata.attributes) {
                        asset.attachments!.push({
                            type: 'attributes',
                            content: JSON.stringify(item.metadata.attributes),
                            mime_type: 'text/json',
                        });
                    }

                    this.generateRelatedUrls(asset);

                    if (item.metadata.external_url || item.metadata.external_link) {
                        if (!asset.related_urls) {
                            asset.related_urls = [];
                        }
                        asset.related_urls.push(item.metadata.external_url || item.metadata.external_link);
                    }

                    this.generateMimeType(asset);

                    return asset;
                });

                result = result.concat(assets);

                return network;
            }),
        );

        return result;
    }
}

export default EthereumNFTAlchemy;
