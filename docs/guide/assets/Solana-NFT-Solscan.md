# Solana NFT - Solscan

::: tip
You can use Solscan API for free.
:::

[Solana NFT / Metaplex](https://docs.metaplex.com/) is a kind of token on Solana.

## API

```ts
const assets: Assets = unidata.assets.get(options: {
    source: 'Solana NFT';
    identity: string;
    provider?: 'Solscan';
});
```

## Live Demo

<Assets :source="'Solana NFT'" :provider="'Solscan'" :defaultIdentity="'EoCqmJ6xNQmZKYsic9PSgxxQzqZREjmhNFnkNqxoc8pp'" />
