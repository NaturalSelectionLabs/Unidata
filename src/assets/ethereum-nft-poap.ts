import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';

class EthereumNFTPOAP extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        const res = await axios.get(`https://api.poap.tech/actions/scan/${options.identity}`);
        const assets: Asset[] = res.data?.map((item: any) => {
            const asset: Asset = {
                tags: ['NFT', 'POAP'],
                owners: [item.owner],
                name: item.event.name,
                description: item.event.description,
                attachments: [
                    {
                        type: 'preview',
                        address: item.event.image_url,
                        mime_type: 'image/png',
                    },
                    {
                        type: 'object',
                        address: item.event.image_url,
                        mime_type: 'image/png',
                    },
                    {
                        type: 'attributes',
                        content: JSON.stringify([
                            {
                                trait_type: 'country',
                                value: item.event.country,
                            },
                            {
                                trait_type: 'city',
                                value: item.event.city,
                            },
                            {
                                trait_type: 'year',
                                value: item.event.year,
                            },
                            {
                                trait_type: 'start_date',
                                value: item.event.start_date,
                            },
                            {
                                trait_type: 'end_date',
                                value: item.event.end_date,
                            },
                            {
                                trait_type: 'expiry_date',
                                value: item.event.expiry_date,
                            },
                            {
                                trait_type: 'supply',
                                value: item.event.supply,
                            },
                            {
                                trait_type: 'event_url',
                                value: item.event.event_url,
                            },
                        ]),
                        mime_type: 'text/json',
                    },
                ],

                source: 'Ethereum NFT',

                metadata: {
                    network: 'Gnosis',
                    proof: `0x22C1f6050E56d2876009903609a2cC3fEf83B415-${item.tokenId}`,

                    token_standard: 'ERC-721',
                    token_id: item.tokenId,
                    token_symbol: 'The Proof of Attendance Protocol',

                    collection_address: '0x22C1f6050E56d2876009903609a2cC3fEf83B415',
                    collection_name: 'POAP',
                },
            };

            this.generateRelatedUrls(asset);

            return asset;
        });

        return {
            total: assets.length,
            list: assets,
        };
    }
}

export default EthereumNFTPOAP;
