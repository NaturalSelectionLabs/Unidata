# Ethereum NFT Activity

<Logos :names="['Ethereum', 'RSS3']" />

::: tip
You can use RSS3 API for free (no rate limit disclosed).
:::

## API

```ts
const notes: Notes = unidata.notes.get(options: {
    source: 'Ethereum NFT Activity';
    identity: string;
    limit?: number;
});
```

## Live Demo

<Notes :source="'Ethereum NFT Activity'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
