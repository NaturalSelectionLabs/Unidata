import Main from '../index';
import Base from './base';
import { AssetsOptions } from './index';
import { ethers, utils } from 'ethers';
import type { Asset } from '../specifications';

class EthereumNFTCrossbell extends Base {
    private provider: ethers.providers.JsonRpcProvider;
    private contracts: {
        abi: any;
        address: string;
    }[];

    constructor(main: Main) {
        super(main);
    }

    private async init() {
        const abi = (this.provider = new ethers.providers.JsonRpcProvider('https://rpc.crossbell.io'));

        this.contracts = [
            {
                abi: [
                    {
                        type: 'constructor',
                        stateMutability: 'nonpayable',
                        inputs: [
                            { type: 'string', name: '_name', internalType: 'string' },
                            { type: 'string', name: '_symbol', internalType: 'string' },
                        ],
                    },
                    {
                        type: 'event',
                        name: 'Approval',
                        inputs: [
                            { type: 'address', name: 'owner', internalType: 'address', indexed: true },
                            { type: 'address', name: 'approved', internalType: 'address', indexed: true },
                            { type: 'uint256', name: 'tokenId', internalType: 'uint256', indexed: true },
                        ],
                        anonymous: false,
                    },
                    {
                        type: 'event',
                        name: 'ApprovalForAll',
                        inputs: [
                            { type: 'address', name: 'owner', internalType: 'address', indexed: true },
                            { type: 'address', name: 'operator', internalType: 'address', indexed: true },
                            { type: 'bool', name: 'approved', internalType: 'bool', indexed: false },
                        ],
                        anonymous: false,
                    },
                    {
                        type: 'event',
                        name: 'OwnershipTransferred',
                        inputs: [
                            { type: 'address', name: 'previousOwner', internalType: 'address', indexed: true },
                            { type: 'address', name: 'newOwner', internalType: 'address', indexed: true },
                        ],
                        anonymous: false,
                    },
                    {
                        type: 'event',
                        name: 'Transfer',
                        inputs: [
                            { type: 'address', name: 'from', internalType: 'address', indexed: true },
                            { type: 'address', name: 'to', internalType: 'address', indexed: true },
                            { type: 'uint256', name: 'tokenId', internalType: 'uint256', indexed: true },
                        ],
                        anonymous: false,
                    },
                    {
                        type: 'function',
                        stateMutability: 'nonpayable',
                        outputs: [],
                        name: 'approve',
                        inputs: [
                            { type: 'address', name: 'to', internalType: 'address' },
                            { type: 'uint256', name: 'tokenId', internalType: 'uint256' },
                        ],
                    },
                    {
                        type: 'function',
                        stateMutability: 'view',
                        outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
                        name: 'balanceOf',
                        inputs: [{ type: 'address', name: 'owner', internalType: 'address' }],
                    },
                    {
                        type: 'function',
                        stateMutability: 'view',
                        outputs: [{ type: 'address', name: '', internalType: 'address' }],
                        name: 'getApproved',
                        inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }],
                    },
                    {
                        type: 'function',
                        stateMutability: 'view',
                        outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
                        name: 'isApprovedForAll',
                        inputs: [
                            { type: 'address', name: 'owner', internalType: 'address' },
                            { type: 'address', name: 'operator', internalType: 'address' },
                        ],
                    },
                    {
                        type: 'function',
                        stateMutability: 'nonpayable',
                        outputs: [],
                        name: 'mint',
                        inputs: [{ type: 'address', name: 'to', internalType: 'address' }],
                    },
                    {
                        type: 'function',
                        stateMutability: 'view',
                        outputs: [{ type: 'string', name: '', internalType: 'string' }],
                        name: 'name',
                        inputs: [],
                    },
                    {
                        type: 'function',
                        stateMutability: 'view',
                        outputs: [{ type: 'address', name: '', internalType: 'address' }],
                        name: 'owner',
                        inputs: [],
                    },
                    {
                        type: 'function',
                        stateMutability: 'view',
                        outputs: [{ type: 'address', name: '', internalType: 'address' }],
                        name: 'ownerOf',
                        inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }],
                    },
                    {
                        type: 'function',
                        stateMutability: 'nonpayable',
                        outputs: [],
                        name: 'renounceOwnership',
                        inputs: [],
                    },
                    {
                        type: 'function',
                        stateMutability: 'nonpayable',
                        outputs: [],
                        name: 'safeTransferFrom',
                        inputs: [
                            { type: 'address', name: 'from', internalType: 'address' },
                            { type: 'address', name: 'to', internalType: 'address' },
                            { type: 'uint256', name: 'tokenId', internalType: 'uint256' },
                        ],
                    },
                    {
                        type: 'function',
                        stateMutability: 'nonpayable',
                        outputs: [],
                        name: 'safeTransferFrom',
                        inputs: [
                            { type: 'address', name: 'from', internalType: 'address' },
                            { type: 'address', name: 'to', internalType: 'address' },
                            { type: 'uint256', name: 'tokenId', internalType: 'uint256' },
                            { type: 'bytes', name: '_data', internalType: 'bytes' },
                        ],
                    },
                    {
                        type: 'function',
                        stateMutability: 'nonpayable',
                        outputs: [],
                        name: 'setApprovalForAll',
                        inputs: [
                            { type: 'address', name: 'operator', internalType: 'address' },
                            { type: 'bool', name: 'approved', internalType: 'bool' },
                        ],
                    },
                    {
                        type: 'function',
                        stateMutability: 'view',
                        outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
                        name: 'supportsInterface',
                        inputs: [{ type: 'bytes4', name: 'interfaceId', internalType: 'bytes4' }],
                    },
                    {
                        type: 'function',
                        stateMutability: 'view',
                        outputs: [{ type: 'string', name: '', internalType: 'string' }],
                        name: 'symbol',
                        inputs: [],
                    },
                    {
                        type: 'function',
                        stateMutability: 'view',
                        outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
                        name: 'tokenByIndex',
                        inputs: [{ type: 'uint256', name: 'index', internalType: 'uint256' }],
                    },
                    {
                        type: 'function',
                        stateMutability: 'view',
                        outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
                        name: 'tokenOfOwnerByIndex',
                        inputs: [
                            { type: 'address', name: 'owner', internalType: 'address' },
                            { type: 'uint256', name: 'index', internalType: 'uint256' },
                        ],
                    },
                    {
                        type: 'function',
                        stateMutability: 'view',
                        outputs: [{ type: 'string', name: '', internalType: 'string' }],
                        name: 'tokenURI',
                        inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }],
                    },
                    {
                        type: 'function',
                        stateMutability: 'view',
                        outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
                        name: 'totalSupply',
                        inputs: [],
                    },
                    {
                        type: 'function',
                        stateMutability: 'nonpayable',
                        outputs: [],
                        name: 'transferFrom',
                        inputs: [
                            { type: 'address', name: 'from', internalType: 'address' },
                            { type: 'address', name: 'to', internalType: 'address' },
                            { type: 'uint256', name: 'tokenId', internalType: 'uint256' },
                        ],
                    },
                    {
                        type: 'function',
                        stateMutability: 'nonpayable',
                        outputs: [],
                        name: 'transferOwnership',
                        inputs: [{ type: 'address', name: 'newOwner', internalType: 'address' }],
                    },
                ],
                address: '0x2f5b8386B6A0E51E00a7903E9d2D3a2fE482f4C0',
            },
        ];
    }

    async get(options: AssetsOptions) {
        if (!this.provider) {
            await this.init();
        }
        const contract = new ethers.Contract(this.contracts[0].address, this.contracts[0].abi, this.provider);
        const total = (await contract.balanceOf(options.identity)).toNumber();

        const assets = await Promise.all(
            new Array(total).fill(0).map(async (_, index) => {
                console.log(options.identity, index);
                const id = (await contract.tokenOfOwnerByIndex(options.identity, index)).toNumber();
                const uri = await contract.tokenURI(id);
                const metadata = JSON.parse(atob(uri.replace('data:application/json;base64,', '')));

                const asset: Asset = {
                    tags: ['NFT'],
                    owners: [utils.getAddress(options.identity)],
                    name: metadata.name,
                    description: metadata.description,

                    items: [
                        {
                            address: metadata?.avatars[0],
                        },
                    ],

                    source: 'Ethereum NFT',

                    metadata: {
                        network: 'Crossbell',
                        proof: `${this.contracts[0].address}-${id}`,

                        token_standard: 'ERC-721',
                        token_id: id,

                        collection_address: this.contracts[0].address,
                        collection_name: contract.name,

                        providers: ['Crossbell'],
                    },
                };

                return asset;
            }),
        );

        return {
            total,
            list: assets,
        };
    }
}

export default EthereumNFTCrossbell;
