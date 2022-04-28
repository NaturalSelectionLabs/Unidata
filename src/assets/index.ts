import Main from '../index';
import Base from './base';
import EthereumNFT from './ethereum-nft';

export type AssetsOptions = {
    source: string;
    identity: string;
    provider?: string;
};

class Assets {
    map: {
        [key: string]: Base;
    };

    constructor(main: Main) {
        this.map = {
            'Ethereum NFT': new EthereumNFT(main),
        };
    }

    async get(options: AssetsOptions) {
        return this.map[options.source].get(options);
    }
}

export default Assets;
