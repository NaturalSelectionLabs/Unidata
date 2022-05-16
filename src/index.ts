import Utils from './utils';
import Profiles from './profiles';
import Links from './links';
import Assets from './assets';
import Notes from './notes';

console.log(
    `${'\n'} %c Unidata v${SDK_VERSION} %c https://unidata.app ${'\n'}`,
    'color: #fecc02; background: #030307; padding: 5px 0;',
    'background: #fecc02; padding: 5px 0;',
);

type IOptions = {
    infuraProjectID?: string;
    ipfsGateway?: string;
    moralisWeb3APIKey?: string;
    openseaAPIKey?: string;
    alchemyAPIKey?: string;
    web3StorageAPIToken?: string;
};

class Unidata {
    options: IOptions;
    utils: Utils;
    profiles: Profiles;
    links: Links;
    assets: Assets;
    notes: Notes;

    constructor(options?: IOptions) {
        this.options = Object.assign(
            {},
            {
                ipfsGateway: 'https://ipfs.io/ipfs/',
                alchemyAPIKey: 'demo',
                web3StorageAPIToken:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAyMDIwODZmRjU5OUU0Y0YyMzM4MkUzNjg1Y0NmZUEyOGNBODBCOTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTIzNjM1Njk3NDUsIm5hbWUiOiJVbmlkYXRhIn0.XmsAuXvbTj4BFhZlJK4xXfbd0ltVZJCEhqdYcW_kLOo',
            },
            options,
        );

        this.utils = new Utils(this);

        this.profiles = new Profiles(this);
        this.links = new Links(this);
        this.assets = new Assets(this);
        this.notes = new Notes(this);
    }
}

export default Unidata;
