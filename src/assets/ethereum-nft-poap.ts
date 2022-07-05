import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import axios from 'axios';
import { utils } from 'ethers';
import type { Asset } from '../specifications';

class EthereumNFTPOAP extends Base {
    constructor(main: Main) {
        super(main);
    }

    async get(options: AssetsOptions) {
        const res = await axios.get(`https://api.poap.tech/actions/scan/${options.identity}`);
        const assets: Asset[] = res.data?.map((item: any) => {
            const asset: Asset = {
                tags: ['NFT', 'POAP'],
                owners: [utils.getAddress(item.owner)],
                name: item.event.name,
                description: item.event.description,

                items: [
                    {
                        address: item.event.image_url,
                        mime_type: 'image/png',
                    },
                ],

                attributes: [
                    {
                        key: 'country',
                        value: item.event.country,
                    },
                    {
                        key: 'city',
                        value: item.event.city,
                    },
                    {
                        key: 'year',
                        value: item.event.year,
                    },
                    {
                        key: 'start_date',
                        value: item.event.start_date,
                    },
                    {
                        key: 'end_date',
                        value: item.event.end_date,
                    },
                    {
                        key: 'expiry_date',
                        value: item.event.expiry_date,
                    },
                    {
                        key: 'supply',
                        value: item.event.supply,
                    },
                    {
                        key: 'event_url',
                        value: item.event.event_url,
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

                    providers: ['POAP'],
                },
            };

            return asset;
        });

        return {
            total: assets.length,
            list: assets,
        };
    }
}

export default EthereumNFTPOAP;
