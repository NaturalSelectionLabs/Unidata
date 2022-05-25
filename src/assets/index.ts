import Main from '../index';
import Base from './base';
import { mergeWith, keyBy, values, uniqWith, isEqual } from 'lodash';
import EthereumNFTMoralis from './ethereum-nft-moralis';
import EthereumNFTOpenSea from './ethereum-nft-opensea';
import EthereumNFTPOAP from './ethereum-nft-poap';
import SolanaNFTSolscan from './solana-nft-solscan';
import SolanaNFTMoralis from './solana-nft-moralis';
import EthereumNFTAlchemy from './ethereum-nft-alchemy';
import FlowNFTAlchemy from './flow-nft-alchemy';
import GitcoinContribution from './gitcoin-contribution';

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
                Alchemy: new EthereumNFTAlchemy(main),
                Moralis: new EthereumNFTMoralis(main),
                OpenSea: new EthereumNFTOpenSea(main),
                POAP: new EthereumNFTPOAP(main),
            },
            'Solana NFT': {
                Solscan: new SolanaNFTSolscan(main),
                Moralis: new SolanaNFTMoralis(main),
            },
            'Flow NFT': {
                FlowNFTAlchemy: new FlowNFTAlchemy(main),
            },
            'Gitcoin Contribution': {
                RSS3: new GitcoinContribution(main),
            },
        };
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
                    const result = await this.map[options.source][provider].get(
                        Object.assign(options, {
                            cursor: options.cursor?.[index],
                        }),
                    );
                    this.main.utils.removeEmpty(result.list);
                    return result;
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

        const networks = ['Gnosis', 'Binance Smart Chain', 'Polygon', 'Ethereum'];
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

                return asset;
            })
            // sort according to network and block_number
            .sort((a: Asset, b: Asset) => {
                return (
                    networks.indexOf(b.metadata?.network || '') - networks.indexOf(a.metadata?.network || '') ||
                    parseInt(b.metadata?.block_number) - parseInt(a.metadata?.block_number)
                );
            });

        return result;
    }
}

export default Assets;
