import Utils from './utils';
import ProfilesC from './profiles';
import LinksC from './links';
import AssetsC from './assets';
import NotesC from './notes';

import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';
import axios from 'axios';

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
    ipfsRelay?: string;
    moralisWeb3APIKey?: string;
    openseaAPIKey?: string;
    alchemyEthereumAPIKey?: string;
    alchemyPolygonAPIKey?: string;
    alchemyFlowAPIKey?: string;
    ethereumProvider?: any;
    nftscanAPIKey?: string;
    poapAPIKey?: string;
};

class Unidata {
    options: IOptions & {
        ipfsGateway: string;
        ipfsRelay: string;
    };
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
                ipfsRelay: 'https://ipfs-relay.crossbell.io/json',
                ...(typeof window !== 'undefined' && { ethereumProvider: window.ethereum }),
            },
            options,
        );

        axiosRetry(axios, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: (err) => {
                return err.response?.status === 429 || isNetworkOrIdempotentRequestError(err);
            },
        });

        this.utils = new Utils(this);

        this.profiles = new ProfilesC(this);
        this.links = new LinksC(this);
        this.assets = new AssetsC(this);
        this.notes = new NotesC(this);
    }
}

export default Unidata;
