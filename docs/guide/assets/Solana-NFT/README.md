# Overview

<Logos type="Assets" :names="['Solana', 'Solscan', 'Moralis']" />

[Solana NFT / Metaplex](https://docs.metaplex.com/) is a kind of token on Solana.

## API

```ts
const assets: Assets = await unidata.assets.get(options: {
    source: 'Solana NFT';
    identity: string;
    providers?: ('Solscan' | 'Moralis')[];
});
```

## Live Demo

<Assets :source="'Solana NFT'" :defaultIdentity="'EoCqmJ6xNQmZKYsic9PSgxxQzqZREjmhNFnkNqxoc8pp'" />
