import Main from '../index';
import Base from './base';
import { createClient, Client } from '@urql/core';

class CyberConnect extends Base {
    urqlClient: Client;

    constructor(main: Main) {
        super(main);
    }

    private async init() {
        this.urqlClient = createClient({
            url: 'https://api.cybertino.io/connect/',
        });
        this.inited = true;
    }

    async get(
        identity: string,
        reversed?: boolean,
        options?: {
            limit?: number;
            offset?: number;
            last?: string;
        },
    ) {
        if (!this.inited) {
            await this.init();
        }
        const key = reversed ? 'follower' : 'following';
        const result = await this.urqlClient
            .query(
                `
            query followingQuery($identity: String!, $limit: Int, $after: String) {
                identity(
                    address: $identity
                    network: ETH
                ) {
                    ${key}Count
                    ${key}s(first: $limit, after: $after) {
                        pageInfo {
                            hasNextPage
                            hasPreviousPage
                        }
                        list {
                            address
                        }
                    }
                }
            }
        `,
                {
                    identity: identity,
                    after: options?.offset + '',
                    limit: options?.limit || 10,
                },
            )
            .toPromise();
        return {
            total: result?.data?.identity?.[key + 'Count'] || 0,
            list:
                result?.data?.identity?.[key + 's']?.list.map((item: any) => ({
                    from: reversed ? item.address : identity,
                    to: reversed ? identity : item.address,
                    type: 'follow',
                    source: 'CyberConnect',
                })) || [],
        };
    }
}

export default CyberConnect;
