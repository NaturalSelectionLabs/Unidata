# Overview

<Logos type="Assets" :names="['Ethereum', 'Polygon', 'Alchemy', 'Binance Smart Chain', 'Arbitrum', 'Fantom', 'Moralis', 'OpenSea', 'POAP']" />

[Ethereum NFT](https://ethereum.org/en/nft/) is a kind of token on Ethereum with a chaotic specification. They can be normalized through Unidata now.

You can initialize with `ipfsGateway` `alchemyEthereumAPIKey` `alchemyPolygonAPIKey` `moralisWeb3APIKey` and `openseaAPIKey` to potentially get a faster response or higher stability.

## API

```ts
const assets: Assets = await unidata.assets.get(options: {
    source: 'Ethereum NFT';
    identity: string;
    providers?: ('Alchemy' | 'Moralis' | 'OpenSea' | 'POAP')[];
    limit?: number;
    cursor?: any;
});
```

## Live Demo

<Assets :source="'Ethereum NFT'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
