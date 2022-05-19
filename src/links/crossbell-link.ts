import Main from '../index';
import Base from './base';
import { LinksOptions, LinkSetOptions, LinkInput } from './index';
import { Indexer, Contract } from 'crossbell.js';

class CrossbellLink extends Base {
    indexer: Indexer;
    contractSet: Contract;

    constructor(main: Main) {
        super(main);
    }

    async get(options: LinksOptions) {
        if (!this.indexer) {
            this.indexer = new Indexer();
        }
        options = Object.assign(
            {
                type: 'follow',
                platform: 'Ethereum',
            },
            options,
        );

        switch (options.platform) {
            case 'Ethereum': {
                const profiles = await this.indexer.getProfiles(options.identity);

                let res = await this.indexer[options.reversed ? 'getBacklinkingProfiles' : 'getLinkingProfiles'](
                    options.identity,
                    {
                        linkTypes: options.type,
                        // limit: options.limit,
                    },
                );
                if (options.limit) {
                    res.list = res?.list?.slice(0, options.limit);
                }
                const list = res?.list?.map((item: any) => ({
                    date_created: item.created_at,

                    from: options.reversed
                        ? item.from_detail.handle
                        : profiles.list.find((profile: any) => profile.token_id === item.from)?.handle,
                    to: options.reversed
                        ? profiles.list.find((profile: any) => profile.token_id === item.to)?.handle
                        : item.to_detail.handle,
                    type: options.type || '',
                    source: 'Crossbell Link',

                    metadata: {
                        network: 'Crossbell',
                        proof: item.transaction_hash,
                        block_number: item.block_number,

                        from_owner: options.reversed ? item.from_detail.owner : options.identity,
                        to_owner: options.reversed ? options.identity : item.to_detail.owner,
                    },
                }));

                return {
                    total: res?.total,
                    list,
                };
            }
            case 'Crossbell': {
                // TODO
                return {
                    total: 0,
                    list: [],
                };
            }
            default:
                throw new Error(`Unsupported platform: ${options.platform}`);
        }
    }

    async set(options: LinkSetOptions, link: LinkInput) {
        options = Object.assign(
            {
                platform: 'Ethereum',
                action: 'add',
            },
            options,
        );

        if (!this.contractSet) {
            this.contractSet = new Contract(this.main.options.ethereumProvider);
            await this.contractSet.connect();
        }

        let fromProfileId = await this.main.utils.getCrossbellProfileId({
            identity: options.identity,
            platform: options.platform!,
        });

        const toProfileId = (await this.contractSet.getProfileByHandle(link.to)).data.profileId;

        switch (options.action) {
            case 'add': {
                await this.contractSet.linkProfile(fromProfileId, toProfileId, link.type);

                return {
                    code: 0,
                    message: 'Success',
                };
            }
            case 'remove': {
                await this.contractSet.unlinkProfile(fromProfileId, toProfileId, link.type);

                return {
                    code: 0,
                    message: 'Success',
                };
            }
            default:
                throw new Error(`Unsupported action: ${options.action}`);
        }
    }
}

export default CrossbellLink;
