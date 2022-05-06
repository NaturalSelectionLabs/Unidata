# POAP Provider

<Logos type="Assets" :names="['Gnosis', 'POAP']" />

::: tip
You can use POAP API for free (no rate limit disclosed).
:::

[POAP](https://poap.xyz/) is a kind of widely used semi-centralised NFTs, generally used as digital mementos, minted in celebration of life's remarkable moments.

## API

```ts
const assets: Assets = unidata.assets.get(options: {
    source: 'Ethereum NFT';
    identity: string;
    providers: ['POAP'];
});
```

## Live Demo

<Assets :source="'Ethereum NFT'" :providers="['POAP']" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
