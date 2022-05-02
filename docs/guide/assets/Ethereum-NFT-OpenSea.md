# Ethereum NFT - OpenSea

::: tip
You can use OpenSea API for free, and you can request an API Key for more frequent requests.
:::

[Ethereum NFT](https://ethereum.org/en/nft/) is a kind of token on Ethereum with a chaotic specification. They can be normalized through Unidata now.

[OpenSea](https://opensea.io/) provides APIs to access to Ethereum NFTs, supporting Ethereum mainnet only.

You can initialize with `ipfsGateway` to get potentially faster speed.

It returns not only the NFTs on the chain, but also the fake NFTs stored in the Opensea centralized database that the user minted on the Opensea platform.

## API

```ts
const assets: Assets = unidata.assets.get(options: {
    source: 'Ethereum NFT';
    identity: string;
    provider: 'OpenSea';
});
```

## Live Demo

<Assets :source="'Ethereum NFT'" :provider="'OpenSea'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
