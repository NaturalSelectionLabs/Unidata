import Utils from './utils';
import Profiles from './profiles';
import Links from './links';

type IOptions = {
    platform?: 'Ethereum' | 'Solana';
    infuraProjectID?: string;
    ipfsGateway?: string;
};

class Unidata {
    options: IOptions;
    utils: Utils;
    profiles: Profiles;
    links: Links;

    constructor(options: IOptions) {
        this.options = Object.assign(
            {},
            {
                platform: 'Ethereum',
                ipfsGateway: 'https://ipfs.io/ipfs/',
            },
            options,
        );

        this.utils = new Utils(this);

        this.profiles = new Profiles(this);
        this.links = new Links(this);
    }
}

export default Unidata;
