import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';

type Asset = {
    date_created?: string;
    date_updated?: string;

    related_urls?: string[];

    tags?: string[];
    owners: AccountInstanceURI[];
    name?: string;
    description?: string;
    attachments?: {
        type?: string;
        content?: string;
        address?: URI;
        mime_type?: string;
        size_in_bytes?: number;
    }[];

    source: AssetSource | NoteSource;

    metadata?: {
        network: Network;
        proof: string;

        [key: string]: any;
    };
};

class EthereumNFT extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        if (!options.provider || options.provider === 'Moralis') {
            return await this.getMoralis(options);
        } else {
            return [];
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
        const responses = await Promise.all(
            chains.map(async (chain) => {
                try {
                    const response = await axios.get(url, {
                        params: {
                            chain,
                        },
                        headers: {
                            'x-api-key': this.main.options.moralisWeb3APIKey!,
                        },
                    });
                    return response.data?.result;
                } catch (error) {
                    return [];
                }
            }),
        );
        let result: Asset[] = [];
        responses.forEach((response, index) => {
            if (response && response.length) {
                result = result.concat(
                    response.map((item: any) => {
                        let metadata;
                        try {
                            metadata = JSON.parse(item.metadata);
                        } catch (error) {}

                        const asset: Asset = {
                            related_urls: [], // TODO

                            owners: item.owner_of || options.identity,
                            name: `${item.name} #${item.token_id}`,
                            description: metadata?.description,
                            attachments: [],

                            source: 'Ethereum NFT',

                            metadata: {
                                network: networkMap[chains[index]],
                                proof: `${item.token_address}-${item.token_id}`,

                                token_standard: `${item.contract_type.slice(0, 3)}-${item.contract_type.slice(3)}`,
                                token_id: item.token_id,
                                token_symbol: item.symbol,

                                collection_address: item.token_address,
                                collection_name: item.name,
                            },
                        };

                        if (metadata?.image) {
                            asset.attachments!.push({
                                type: 'preview',
                                address: this.main.utils.replaceIPFS(metadata?.image),
                            });
                        }

                        if (metadata?.animation_url || metadata?.image) {
                            asset.attachments!.push({
                                type: 'object',
                                address: this.main.utils.replaceIPFS(metadata?.animation_url || metadata?.image),
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

                        return asset;
                    }),
                );
            }
        });
        return result;
    }
}

export default EthereumNFT;
