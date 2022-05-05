# Overview

<Logos :names="['Solana', 'Solscan', 'Moralis']" />

[Solana NFT / Metaplex](https://docs.metaplex.com/) is a kind of token on Solana.

## API

```ts
const assets: Assets = unidata.assets.get(options: {
    source: 'Solana NFT';
    identity: string;
    providers?: ('Solscan' | 'Moralis')[];
});
```

-   `providers`: The providers of the data, requesting and aggregating from all supported providers by default.
-   `identity`: The Solana address.

## Live Demo

<Assets :source="'Solana NFT'" :defaultIdentity="'EoCqmJ6xNQmZKYsic9PSgxxQzqZREjmhNFnkNqxoc8pp'" />
