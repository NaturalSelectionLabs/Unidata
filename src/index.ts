import Profiles from './profiles';
import Utils from './utils';

type IOptions = {
    infuraProjectID?: string;
    ipfsGateway?: string;
};

class Unidata {
    profiles: Profiles;
    options: IOptions;
    utils: Utils;

    constructor(options: IOptions) {
        this.options = Object.assign(
            {},
            {
                ipfsGateway: 'https://ipfs.infura.io/ipfs/',
            },
            options,
        );

        this.utils = new Utils(this);

        this.profiles = new Profiles(this);
    }
}

export default Unidata;
