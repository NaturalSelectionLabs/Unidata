import Main from '../index';
import { AssetsOptions } from './index';
import mime from 'mime';

abstract class Base {
    main: Main;
    inited: boolean;

    constructor(main: Main) {
        this.main = main;
    }

    abstract get(options: AssetsOptions): Promise<Asset[] | null>;

    generateRelatedUrls(asset: Asset) {
        switch (asset.metadata?.network) {
            case 'Ethereum':
                if (asset.metadata.token_id && asset.metadata.collection_address) {
                    asset.related_urls = [
                        `https://etherscan.io/nft/${asset.metadata.collection_address}/${asset.metadata.token_id}`,
                        `https://opensea.io/assets/${asset.metadata.collection_address}/${asset.metadata.token_id}`,
                    ];
                }
                break;
            case 'Polygon':
                if (asset.metadata.token_id && asset.metadata.collection_address) {
                    asset.related_urls = [
                        `https://polygonscan.com/token/${asset.metadata.collection_address}?a=${asset.metadata.token_id}`,
                        `https://opensea.io/assets/matic/${asset.metadata.collection_address}/${asset.metadata.token_id}`,
                    ];
                }
                break;
            case 'Binance Smart Chain':
                if (asset.metadata.token_id && asset.metadata.collection_address) {
                    asset.related_urls = [
                        `https://bscscan.com/token/${asset.metadata.collection_address}?a=${asset.metadata.token_id}`,
                    ];
                }
                break;
            case 'Gnosis':
                if (asset.metadata.token_id && asset.metadata.collection_address) {
                    asset.related_urls = [
                        `https://blockscout.com/xdai/mainnet/token/0x22c1f6050e56d2876009903609a2cc3fef83b415/instance/${asset.metadata.token_id}/token-transfers`,
                        `https://app.poap.xyz/token/${asset.metadata.token_id}`,
                    ];
                }
                break;
        }
    }

    generateMimeType(asset: Asset) {
        asset.attachments?.forEach((attachment) => {
            if (attachment.address) {
                const mimeType = mime.getType(attachment.address);
                if (mimeType) {
                    attachment.mime_type = mimeType;
                }
            }
        });
    }
}

export default Base;
