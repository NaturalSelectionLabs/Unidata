# Solana NFT - Moralis

[Solana NFT / Metaplex](https://docs.metaplex.com/) is a kind of token on Solana.

[Moralis](https://moralis.io/) provides APIs to easy access to Solana NFTs.

You must initialize with `moralisWeb3APIKey` to use. The steps to get the key after registration are as follows:

![](https://i.imgur.com/wXPAPfm.png)

## API

```ts
const assets: Assets = unidata.assets.get(options: {
    source: 'Solana NFT';
    identity: string;
    provider?: 'Moralis';
});
```

## Live Demo

<Assets :source="'Solana NFT'" :provider="'Moralis'" :defaultIdentity="'EoCqmJ6xNQmZKYsic9PSgxxQzqZREjmhNFnkNqxoc8pp'" />
