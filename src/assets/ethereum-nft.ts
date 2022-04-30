import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';

class EthereumNFT extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        if (!options.provider || options.provider === 'Moralis') {
            return await this.getMoralis(options);
        } else {
            throw new Error('Unknown provider');
        }
    }

    async getMoralis(options: AssetsOptions) {
        if (!this.main.options.moralisWeb3APIKey) {
            throw new Error('Moralis Web3 API key is not set');
        }
        const chains = ['eth', 'polygon', 'bsc', 'avalanche', 'fantom'];
        const networkMap: {
            [key: string]: string;
        } = {
            eth: 'Ethereum',
            polygon: 'Polygon',
            bsc: 'Binance Smart Chain',
            avalanche: 'Avalanche',
            fantom: 'Fantom',
        };
        const url = `https://deep-index.moralis.io/api/v2/${options.identity}/nft`;
        let result: Asset[] = [];
        let resyncIndex = 1;

        await Promise.all(
            chains.map(async (chain) => {
                let response;
                try {
                    const res = await axios.get(url, {
                        params: {
                            chain,
                        },
                        headers: {
                            'x-api-key': this.main.options.moralisWeb3APIKey!,
                        },
                    });
                    response = res.data?.result;
                } catch (error) {
                    response = [];
                }

                let list = [];
                if (response && response.length) {
                    list = await Promise.all(
                        response.map(async (item: any) => {
                            let metadata;
                            try {
                                if (item.metadata) {
                                    metadata = JSON.parse(item.metadata);
                                } else if (item.token_uri) {
                                    setTimeout(() => {
                                        axios.get(
                                            `https://deep-index.moralis.io/api/v2/nft/${item.token_address}/${item.token_id}/metadata/resync`,
                                            {
                                                params: {
                                                    chain,
                                                    flag: 'metadata',
                                                    mode: 'sync',
                                                },
                                                headers: {
                                                    'x-api-key': this.main.options.moralisWeb3APIKey!,
                                                },
                                            },
                                        );
                                    }, resyncIndex * 10000);
                                    resyncIndex++;
                                    metadata = (await axios.get(item.token_uri)).data;
                                }
                            } catch (error) {}

                            const asset: Asset = {
                                owners: item.owner_of || options.identity,
                                name: metadata?.name || `${item.name} #${item.token_id}`,
                                description: metadata?.description,
                                attachments: [],

                                source: 'Ethereum NFT',

                                metadata: {
                                    network: networkMap[chain],
                                    proof: `${item.token_address}-${item.token_id}`,

                                    token_standard: `${item.contract_type.slice(0, 3)}-${item.contract_type.slice(3)}`,
                                    token_id: item.token_id,
                                    token_symbol: item.symbol,

                                    collection_address: item.token_address,
                                    collection_name: item.name,

                                    block_number_minted: item.block_number_minted,
                                    block_number: item.block_number,
                                },
                            };

                            if (metadata?.image || metadata?.image_url) {
                                asset.attachments!.push({
                                    type: 'preview',
                                    address: this.main.utils.replaceIPFS(metadata?.image || metadata?.image_url),
                                });
                            }

                            if (metadata?.animation_url || metadata?.image || metadata?.image_url) {
                                asset.attachments!.push({
                                    type: 'object',
                                    address: this.main.utils.replaceIPFS(
                                        metadata?.animation_url || metadata?.image || metadata?.image_url,
                                    ),
                                });
                            }

                            if (metadata?.attributes) {
                                asset.attachments!.push({
                                    type: 'attributes',
                                    content: JSON.stringify(metadata?.attributes),
                                    mime_type: 'text/json',
                                });
                            }

                            if (metadata?.external_url) {
                                asset.attachments!.push({
                                    type: 'external_url',
                                    content: metadata?.external_url,
                                    mime_type: 'text/uri-list',
                                });
                            }

                            this.generateRelatedUrls(asset);
                            this.generateMimeType(asset);

                            return asset;
                        }),
                    );
                }
                result = result.concat(list);

                return chain;
            }),
        );

        return result.sort((a, b) => parseInt(b.metadata?.block_number || 0) - parseInt(a.metadata?.block_number || 0));
    }
}

export default EthereumNFT;
