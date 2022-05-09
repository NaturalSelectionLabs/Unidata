import Main from '../index';
import Base from './base';
import unionBy from 'lodash/unionBy';
import EthereumNFTMoralis from './ethereum-nft-moralis';
import EthereumNFTOpenSea from './ethereum-nft-opensea';
import EthereumNFTPOAP from './ethereum-nft-poap';
import SolanaNFTSolscan from './solana-nft-solscan';
import SolanaNFTMoralis from './solana-nft-moralis';
import EthereumNFTAlchemy from './ethereum-nft-alchemy';
import FlowNFTAlchemy from './flow-nft-alchemy';

export type AssetsOptions = {
    source: string;
    identity: string;
    providers?: string[];
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
        };
    }

    async get(options: AssetsOptions) {
        options = Object.assign(
            {
                providers: Object.keys(this.map[options.source]),
            },
            options,
        );

        const list = await Promise.all(
            options.providers!.map(async (provider: string) => {
                const result = await this.map[options.source][provider].get(options);
                return result.list;
            }),
        );
        let assets = Array.prototype.concat(...list);
        assets = unionBy(assets, (item: Asset) => item.metadata?.proof);

        return {
            total: assets.length,
            list: assets,
        };
    }
}

export default Assets;
