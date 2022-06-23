# Gitcoin Contribution

<Logos type="Notes" :names="['Gitcoin', 'Ethereum', 'Polygon', 'RSS3']" />

::: tip
You can use RSS3 API for free (no rate limit disclosed).
:::

[Gitcoin Grants](https://gitcoin.co/grants/explorer/) allows individuals to get funding for a public goods project they are working on. Gitcoin Contributions are contributions made to Gitcoin Grants.

## API

```ts
const notes: Notes = await unidata.notes.get(options: {
    source: 'Gitcoin Contribution';
    identity: string;
    limit?: number;
    cursor?: string;
});
```

## Live Demo

<Notes :source="'Gitcoin Contribution'" :defaultIdentity="[{
    identity: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    platform: 'Ethereum'
}]" />
