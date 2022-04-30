# Ethereum NFT - Moralis

[Ethereum NFT](https://ethereum.org/en/nft/) is a kind of token on Ethereum with a chaotic specification. They can be normalized through Unidata now.

[Moralis](https://moralis.io/) provides APIs to easy access to Ethereum NFTs, supporting Ethereum mainnet, Polygon, Binance Smart Chain, Avalanche, Fantom.

You can initialize with `ipfsGateway` to get potentially faster speed.

You must initialize with `moralisWeb3APIKey` to use. The steps to get the key after registration are as follows:

![](https://i.imgur.com/wXPAPfm.png)

In addition to fetching data from Moralis, Unidata will automatically report missing metadata to Moralis to let Moralis to resync.

## API

```ts
const assets: Assets = unidata.assets.get(options: {
    source: 'Ethereum NFT';
    identity: string;
    provider?: 'Moralis';
});
```

## Live Demo

<Assets :source="'Ethereum NFT'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
