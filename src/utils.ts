import Main from './index';

class Utils {
    main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    replaceIPFS(url: string) {
        return url.replace('ipfs://', this.main.options.ipfsGateway!);
    }

    replaceIPFSs(urls: string[]) {
        return urls.map((url: string) => url.replace('ipfs://', this.main.options.ipfsGateway!));
    }
}

export default Utils;
