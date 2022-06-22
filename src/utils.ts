import Main from './index';
import { Indexer, Contract, Network } from 'crossbell.js';
import mime from 'mime';
import { Web3Storage } from 'web3.storage';

class Utils {
    main: Main;
    indexer: Indexer;
    contract: Contract;

    constructor(main: Main) {
        this.main = main;
    }

    replaceIPFS(url: string) {
        if (/^[a-zA-Z0-9]{46}$/.test(url)) {
            url = 'ipfs://' + url;
        }
        return url.replace('ipfs://ipfs/', 'ipfs://').replace('ipfs://', this.main.options.ipfsGateway!);
    }

    replaceIPFSs(urls: string[]) {
        return urls.map((url: string) => this.replaceIPFS(url));
    }

    async getCrossbellProfileId(options: { identity: string; platform: string }) {
        let profileId;

        if (!this.contract) {
            this.contract = new Contract();
            await this.contract.connect();
        }

        switch (options.platform) {
            case 'Ethereum':
                {
                    if (!this.indexer) {
                        this.indexer = new Indexer();
                    }
                    profileId = (
                        await this.indexer.getProfiles(options.identity, {
                            primary: true,
                        })
                    ).list[0].token_id;
                }
                break;
            case 'Crossbell':
                {
                    profileId = (await this.contract.getProfileByHandle(options.identity)).data.profileId;
                }
                break;
            default:
                throw new Error(`Unsupported platform: ${options.platform}`);
        }

        return profileId;
    }

    removeEmpty(
        obj: any,
        father?: {
            obj: any;
            key: string;
        },
    ) {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                if (!obj[key] || Object.keys(obj[key]).length === 0) {
                    delete obj[key];
                } else {
                    this.removeEmpty(obj[key], {
                        obj,
                        key,
                    });
                }
            } else if (!obj[key]) {
                delete obj[key];
            }
        }
        if (Object.keys(obj).length === 0 && father) {
            delete father.obj[father.key];
        }
    }

    getMimeType(address: string) {
        address = this.main.utils.replaceIPFS(address);
        const mimeType = mime.getType(address);
        if (mimeType) {
            return mimeType;
        }
    }

    async uploadToIPFS(obj: any, filename = 'unidata') {
        const blob = new Blob([JSON.stringify(obj)], {
            type: 'application/json',
        });
        const file = new File([blob], `${filename}.json`);
        const web3Storage = new Web3Storage({
            token: this.main.options.web3StorageAPIToken!,
        });
        const cid = await web3Storage.put([file], {
            name: file.name,
            maxRetries: 3,
            wrapWithDirectory: false,
        });
        return `ipfs://${cid}`;
    }
}

export default Utils;
