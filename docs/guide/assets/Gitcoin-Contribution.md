# Gitcoin Contribution

<Logos type="Assets" :names="['Gitcoin', 'Ethereum', 'Polygon', 'RSS3']" />

::: tip
You can use RSS3 API for free (no rate limit disclosed).
:::

[Gitcoin Grants](https://gitcoin.co/grants/explorer/) allows individuals to get funding for a public goods project they are working on. Gitcoin Contributions is contributions to Gitcoin Grants.

## API

```ts
const assets: Assets = await unidata.assets.get(options: {
    source: 'Gitcoin Contribution';
    identity: string;
});
```

-   `providers`: The providers of the data, requesting and aggregating from all supported providers by default.
-   `identity`: The Solana address.

## Live Demo

<Assets :source="'Gitcoin Contribution'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
