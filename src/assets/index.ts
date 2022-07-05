import Main from '../index';
import Base from './base';
import { mergeWith, keyBy, values, uniqWith, isEqual } from 'lodash-es';
import EthereumNFTMoralis from './ethereum-nft-moralis';
import EthereumNFTOpenSea from './ethereum-nft-opensea';
import EthereumNFTPOAP from './ethereum-nft-poap';
import SolanaNFTSolscan from './solana-nft-solscan';
import SolanaNFTMoralis from './solana-nft-moralis';
import EthereumNFTAlchemy from './ethereum-nft-alchemy';
import FlowNFTAlchemy from './flow-nft-alchemy';
import GitcoinContribution from './gitcoin-contribution';
import EthereumNFTCrossbell from './ethereum-nft-crossbell';
import EthereumNFTNFTScan from './ethereum-nft-nftscan';
import type { Asset } from '../specifications';

export type AssetsOptions = {
    source: string;
    identity: string;
    providers?: string[];
    limit?: number;
    cursor?: any;
};

class Assets {
    main: Main;
    map: {
        [key: string]: {
            [key: string]: Base;
        };
    };

    constructor(main: Main) {
        this.main = main;
        this.map = {
            'Ethereum NFT': {
                NFTScan: new EthereumNFTNFTScan(main),
                Alchemy: new EthereumNFTAlchemy(main),
                Moralis: new EthereumNFTMoralis(main),
                OpenSea: new EthereumNFTOpenSea(main),
                POAP: new EthereumNFTPOAP(main),
                Crossbell: new EthereumNFTCrossbell(main),
            },
            'Solana NFT': {
                Solscan: new SolanaNFTSolscan(main),
                Moralis: new SolanaNFTMoralis(main),
            },
            'Flow NFT': {
                Alchemy: new FlowNFTAlchemy(main),
            },
            'Gitcoin Contribution': {
                RSS3: new GitcoinContribution(main),
            },
        };
    }

    private generateRelatedUrls(asset: Asset) {
        if (!asset.related_urls) {
            asset.related_urls = [];
        }
        switch (asset.metadata?.network) {
            case 'Ethereum':
                if (asset.metadata.token_id && asset.metadata.collection_address) {
                    asset.related_urls = asset.related_urls.concat([
                        `https://etherscan.io/nft/${asset.metadata.collection_address}/${asset.metadata.token_id}`,
                        `https://opensea.io/assets/${asset.metadata.collection_address}/${asset.metadata.token_id}`,
                    ]);
                }
                break;
            case 'Polygon':
                if (asset.metadata.token_id && asset.metadata.collection_address) {
                    asset.related_urls = asset.related_urls.concat([
                        `https://polygonscan.com/token/${asset.metadata.collection_address}?a=${asset.metadata.token_id}`,
                        `https://opensea.io/assets/matic/${asset.metadata.collection_address}/${asset.metadata.token_id}`,
                    ]);
                }
                break;
            case 'Binance Smart Chain':
                if (asset.metadata.token_id && asset.metadata.collection_address) {
                    asset.related_urls = asset.related_urls.concat([
                        `https://bscscan.com/token/${asset.metadata.collection_address}?a=${asset.metadata.token_id}`,
                    ]);
                }
                break;
            case 'Gnosis':
                if (asset.metadata.token_id && asset.metadata.collection_address) {
                    asset.related_urls = asset.related_urls.concat([
                        `https://blockscout.com/xdai/mainnet/token/0x22c1f6050e56d2876009903609a2cc3fef83b415/instance/${asset.metadata.token_id}/token-transfers`,
                        `https://app.poap.xyz/token/${asset.metadata.token_id}`,
                    ]);
                }
                break;
            case 'Solana':
                if (asset.metadata.token_id) {
                    asset.related_urls = asset.related_urls.concat([
                        `https://solscan.io/token/${asset.metadata.token_id}`,
                    ]);
                }
                break;
            case 'Crossbell':
                if (asset.metadata.token_id) {
                    asset.related_urls = asset.related_urls.concat([
                        `https://scan.crossbell.io/token/${asset.metadata.collection_address}/instance/${asset.metadata.token_id}`,
                    ]);
                }
                break;
        }
    }

    async get(options: AssetsOptions) {
        options = Object.assign(
            {
                providers: Object.keys(this.map[options.source]),
            },
            options,
        );

        let result;

        if (options.providers!.length > 1) {
            const list = await Promise.all(
                options.providers!.map(async (provider: string, index) => {
                    try {
                        const result = await this.map[options.source][provider].get(
                            Object.assign(options, {
                                cursor: options.cursor?.[index],
                            }),
                        );
                        this.main.utils.removeEmpty(result.list);
                        return result;
                    } catch (error) {
                        return {
                            total: 0,
                            list: [],
                        };
                    }
                }),
            );

            let merged = keyBy(list[0].list, (item) => item.metadata?.proof);
            for (let i = 1; i < list.length; i++) {
                merged = mergeWith(
                    merged,
                    keyBy(list[i].list, (item) => item.metadata?.proof),
                    (a, b) => {
                        if (Array.isArray(a)) {
                            return uniqWith(b.concat(a), isEqual);
                        }
                    },
                );
            }
            const assets = values(merged);
            const cursor = list.map((item) => item.cursor);

            result = {
                total: assets.length,
                ...(cursor.find((id) => id) && { cursor: cursor }),
                list: assets,
            };
        } else {
            result = await this.map[options.source][options.providers![0]].get(options);
        }

        const networks = ['Gnosis', 'Binance Smart Chain', 'Polygon', 'Crossbell', 'Ethereum'];
        result.list = result.list
            // default values
            .map((asset: Asset) => {
                if (!asset.name) {
                    asset.name = `${asset.metadata?.collection_name || asset.metadata?.token_symbol || ''} #${
                        asset.metadata?.token_id || ''
                    }`;
                }
                if (!asset.description) {
                    asset.description = asset.name;
                }
                if (asset.previews) {
                    asset.previews.forEach((item) => {
                        if (item.address) {
                            item.address = this.main.utils.replaceIPFS(item.address);
                        }
                        if (item.address && !item.mime_type) {
                            item.mime_type = this.main.utils.getMimeType(item.address);
                        }
                    });
                }
                if (asset.items) {
                    asset.items.forEach((item) => {
                        if (item.address) {
                            item.address = this.main.utils.replaceIPFS(item.address);
                        }
                        if (item.address && !item.mime_type) {
                            item.mime_type = this.main.utils.getMimeType(item.address);
                        }
                    });
                }

                if (asset.items && !asset.previews) {
                    asset.previews = asset.items;
                }
                if (asset.previews && !asset.items) {
                    asset.items = asset.previews;
                }

                this.generateRelatedUrls(asset);

                return asset;
            })
            // sort according to network and block_number
            .sort((a: Asset, b: Asset) => {
                const networkSort =
                    networks.indexOf(b.metadata?.network || '') - networks.indexOf(a.metadata?.network || '');
                if (networkSort) {
                    return networkSort;
                } else if (a.metadata?.block_number && b.metadata?.block_number) {
                    return parseInt(b.metadata?.block_number || 0) - parseInt(a.metadata?.block_number || 0);
                } else if (a.date_created && b.date_created) {
                    return +new Date(b.date_created) - +new Date(a.date_created);
                } else {
                    return 0;
                }
            });

        return result;
    }
}

export default Assets;
