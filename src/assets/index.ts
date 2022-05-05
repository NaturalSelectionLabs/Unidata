import Main from '../index';
import Base from './base';
import lodashArray from 'lodash-es/array';
import EthereumNFTMoralis from './ethereum-nft-moralis';
import EthereumNFTOpenSea from './ethereum-nft-opensea';
import EthereumNFTPOAP from './ethereum-nft-poap';
import SolanaNFTSolscan from './solana-nft-solscan';
import SolanaNFTMoralis from './solana-nft-moralis';
import EthereumNFTAlchemy from './ethereum-nft-alchemy';

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
            options.providers!.map((provider: string) => this.map[options.source][provider].get(options)),
        );
        const assets = Array.prototype.concat(...list);
        return lodashArray.unionBy(assets, (item: Asset) => item.metadata?.proof);
    }
}

export default Assets;
