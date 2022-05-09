import Main from './index';

class Utils {
    main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    replaceIPFS(url: string) {
        if (/^[a-zA-Z0-9]{46}$/.test(url)) {
            url = 'ipfs://' + url;
        }
        return url.replace('ipfs://', this.main.options.ipfsGateway!);
    }

    replaceIPFSs(urls: string[]) {
        return urls.map((url: string) => this.replaceIPFS(url));
    }
}

export default Utils;
