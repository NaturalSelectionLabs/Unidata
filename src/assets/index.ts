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
    map: {
        [key: string]: {
            [key: string]: Base;
        };
    };

    constructor(main: Main) {
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

        if (options.providers!.length > 1) {
            const list = await Promise.all(
                options.providers!.map(async (provider: string) => {
                    const result = await this.map[options.source][provider].get(options);
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
                            return uniqWith(a.concat(b), isEqual);
                        }
                    },
                );
            }
            const assets = values(merged);

            return {
                total: assets.length,
                cursor: list.map((item) => item.cursor),
                list: assets,
            };
        } else {
            return await this.map[options.source][options.providers![0]].get(options);
        }
    }
}

export default Assets;
