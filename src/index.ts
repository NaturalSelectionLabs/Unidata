import Utils from './utils';
import Profiles from './profiles';
import Links from './links';
import Assets from './assets';

type IOptions = {
    infuraProjectID?: string;
    ipfsGateway?: string;
    moralisWeb3APIKey?: string;
    openseaAPIKey?: string;
    alchemyAPIKey?: string;
};

class Unidata {
    options: IOptions;
    utils: Utils;
    profiles: Profiles;
    links: Links;
    assets: Assets;

    constructor(options: IOptions) {
        this.options = Object.assign(
            {},
            {
                ipfsGateway: 'https://ipfs.io/ipfs/',
                alchemyAPIKey: 'demo',
            },
            options,
        );

        this.utils = new Utils(this);

        this.profiles = new Profiles(this);
        this.links = new Links(this);
        this.assets = new Assets(this);
    }
}

export default Unidata;
