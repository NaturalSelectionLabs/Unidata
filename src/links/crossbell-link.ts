import Main from '../index';
import Base from './base';
import { LinksOptions, LinkSetOptions, LinkInput } from './index';
import { Indexer, Contract } from 'crossbell.js';

class CrossbellLink extends Base {
    indexer: Indexer;
    contract: Contract;

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

        const profile = await this.main.utils.getCrossbellProfile({
            identity: options.identity,
            platform: options.platform!,
        });

        let res = await this.indexer[options.reversed ? 'getBacklinksOfProfile' : 'getLinks'](profile?.profileId + '', {
            linkType: options.type,
            limit: options.limit,
            cursor: options.cursor,
        });

        const list = res?.list?.map((item) => ({
            date_created: item.createdAt,

            from: (options.reversed ? item.fromProfile?.handle : profile?.handle) || '',
            to: (options.reversed ? profile?.handle : item.toProfile?.handle) || '',
            type: options.type || '',
            source: 'Crossbell Link',

            metadata: {
                network: 'Crossbell',
                proof: item.transactionHash,
                block_number: item.blockNumber,

                from_owner: options.reversed ? item.fromProfile?.owner : options.identity,
                to_owner: options.reversed ? options.identity : item.toProfile?.owner,
            },
        }));

        return {
            total: res?.count,
            ...(res?.cursor && { cursor: res?.cursor }),
            list,
        };
    }

    async set(options: LinkSetOptions, link: LinkInput) {
        options = Object.assign(
            {
                platform: 'Ethereum',
                action: 'add',
            },
            options,
        );

        if (!this.contract) {
            this.contract = new Contract(this.main.options.ethereumProvider);
            await this.contract.connect();
        }

        let fromProfileId = (
            await this.main.utils.getCrossbellProfile({
                identity: options.identity,
                platform: options.platform!,
            })
        )?.profileId;
        if (!fromProfileId) {
            return {
                code: 1,
                message: 'Profile not found',
            };
        }

        const toProfileId = (
            await this.main.utils.getCrossbellProfile({
                identity: link.to,
                platform: 'Crossbell',
            })
        )?.profileId;
        if (!toProfileId) {
            return {
                code: 1,
                message: 'Profile not found',
            };
        }

        switch (options.action) {
            case 'add': {
                await this.contract.linkProfile(fromProfileId + '', toProfileId + '', link.type);

                return {
                    code: 0,
                    message: 'Success',
                };
            }
            case 'remove': {
                await this.contract.unlinkProfile(fromProfileId + '', toProfileId + '', link.type);

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
