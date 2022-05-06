# Mirror Entry

<Logos type="Notes" :names="['Mirror', 'RSS3']" />

::: tip
You can use RSS3 API for free (no rate limit disclosed).
:::

[Mirror](https://mirror.xyz/) Entry is a writing platform made by Mirror.

You can initialize with `ipfsGateway` to get potentially faster response or higher stability.

## API

```ts
const notes: Notes = unidata.notes.get(options: {
    source: 'Mirror Entry';
    identity: string;
    limit?: number;
});
```

## Live Demo

<Notes :source="'Mirror Entry'" :defaultIdentity="'0x9651B2a7Aa9ed9635cE896a1Af1a7d6294d5e902'" />
