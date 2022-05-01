import Main from '../index';
import Base from './base';
import EthereumNFTMoralis from './ethereum-nft-moralis';
import EthereumNFTOpenSea from './ethereum-nft-opensea';
import EthereumNFTPOAP from './ethereum-nft-poap';
import SolanaNFTMoralis from './solana-nft-moralis';

export type AssetsOptions = {
    source: string;
    identity: string;
    provider?: string;
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
                Moralis: new EthereumNFTMoralis(main),
                OpenSea: new EthereumNFTOpenSea(main),
                POAP: new EthereumNFTPOAP(main),
            },
            'Solana NFT': {
                Moralis: new SolanaNFTMoralis(main),
            },
        };
    }

    async get(options: AssetsOptions) {
        switch (options.source) {
            case 'Ethereum NFT':
                options = Object.assign(
                    {
                        provider: 'Moralis',
                    },
                    options,
                );
                break;
            case 'Solana NFT':
                options = Object.assign(
                    {
                        provider: 'Moralis',
                    },
                    options,
                );
                break;
        }
        return this.map[options.source][options.provider!].get(options);
    }
}

export default Assets;
