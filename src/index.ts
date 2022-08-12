import Utils from './utils';
import ProfilesC from './profiles';
import LinksC from './links';
import AssetsC from './assets';
import NotesC from './notes';

import type { ProfileInput } from './profiles';
import type { LinkInput } from './links';
import type { NoteInput } from './notes';
import type { Asset, Assets, Note, Notes, Link, Links, Profile, Profiles } from './specifications';

export { Asset, Assets, Note, Notes, Link, Links, Profile, Profiles, ProfileInput, LinkInput, NoteInput };

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
    alchemyEthereumAPIKey?: string;
    alchemyPolygonAPIKey?: string;
    alchemyFlowAPIKey?: string;
    web3StorageAPIToken?: string;
    ethereumProvider?: any;
    nftscanAPIKey?: string;
};

class Unidata {
    options: IOptions;
    utils: Utils;
    profiles: ProfilesC;
    links: LinksC;
    assets: AssetsC;
    notes: NotesC;

    constructor(options?: IOptions) {
        this.options = Object.assign(
            {},
            {
                ipfsGateway: 'https://gateway.ipfs.io/ipfs/',
                web3StorageAPIToken:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAyMDIwODZmRjU5OUU0Y0YyMzM4MkUzNjg1Y0NmZUEyOGNBODBCOTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTIzNjM1Njk3NDUsIm5hbWUiOiJVbmlkYXRhIn0.XmsAuXvbTj4BFhZlJK4xXfbd0ltVZJCEhqdYcW_kLOo',
                ...(typeof window !== 'undefined' && { ethereumProvider: window.ethereum }),
            },
            options,
        );

        this.utils = new Utils(this);

        this.profiles = new ProfilesC(this);
        this.links = new LinksC(this);
        this.assets = new AssetsC(this);
        this.notes = new NotesC(this);
    }
}

export default Unidata;
