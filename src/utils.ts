import Main from './index';
import { type Indexer, createIndexer } from 'crossbell';
import mime from 'mime';
import axios from 'axios';
import type { Address } from 'viem';

class Utils {
    main: Main;
    indexer: Indexer;

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

    async getCrossbellCharacter(options: { identity: string; platform: string }) {
        let profile;

        if (!this.indexer) {
            this.indexer = createIndexer();
        }

        switch (options.platform) {
            case 'Ethereum':
                profile = await this.indexer.character.getPrimary(options.identity as Address);
                break;
            case 'Crossbell':
                profile = await this.indexer.character.getByHandle(options.identity as Address);
                break;
            default:
                throw new Error(`Unsupported platform: ${options.platform}`);
        }

        return profile;
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

    async uploadToIPFS(obj: any) {
        const res = await axios.post(this.main.options.ipfsRelay, obj);
        return res.data.url;
    }
}

export default Utils;
