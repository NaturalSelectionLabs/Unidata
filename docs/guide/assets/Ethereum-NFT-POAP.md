# Ethereum NFT - POAP

::: tip
You can use POAP API for free.
:::

[Ethereum NFT](https://ethereum.org/en/nft/) is a kind of token on Ethereum with a chaotic specification. They can be normalized through Unidata now.

[POAP](https://poap.xyz/) is a kind of widely used semi-centralised NFTs, generally used as digital mementos, minted in celebration of life's remarkable moments.

## API

```ts
const assets: Assets = unidata.assets.get(options: {
    source: 'Ethereum NFT';
    identity: string;
    provider: 'POAP';
});
```

## Live Demo

<Assets :source="'Ethereum NFT'" :provider="'POAP'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
