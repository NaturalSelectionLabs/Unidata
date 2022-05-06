# Solscan Provider

<Logos type="Assets" :names="['Solana', 'Solscan']" />

::: tip
You can use Solscan API for free (150 requests / 30 seconds, 100,000 requests / day).
:::

[Solana NFT / Metaplex](https://docs.metaplex.com/) is a kind of token on Solana.

## API

```ts
const assets: Assets = await unidata.assets.get(options: {
    source: 'Solana NFT';
    providers?: ['Solscan'];
    identity: string;
});
```

-   `providers`: The providers of the data, requesting and aggregating from all supported providers by default.
-   `identity`: The Solana address.

## Live Demo

<Assets :source="'Solana NFT'" :providers="['Solscan']" :defaultIdentity="'EoCqmJ6xNQmZKYsic9PSgxxQzqZREjmhNFnkNqxoc8pp'" />
