# Gitcoin Contribution

<Logos type="Notes" :names="['Gitcoin', 'RSS3']" />

::: tip
You can use RSS3 API for free (no rate limit disclosed).
:::

[Ethereum NFT](https://ethereum.org/en/nft/) is a kind of token on Ethereum with a chaotic specification. They can be normalized through Unidata now.

## API

```ts
const notes: Notes = await unidata.notes.get(options: {
    source: 'Gitcoin Contribution';
    identity: string;
    limit?: number;
});
```

## Live Demo

<Notes :source="'Gitcoin Contribution'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
