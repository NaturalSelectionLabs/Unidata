# Mirror Entry

<Logos type="Notes" :names="['Mirror', 'RSS3']" />

::: tip
You can use RSS3 API for free (no rate limit disclosed).
:::

[Mirror](https://mirror.xyz/) Entry is a writing platform made by Mirror.

You can initialize with `ipfsGateway` to potentially get a faster response or higher stability.

## API

```ts
const notes: Notes = await unidata.notes.get(options: {
    source: 'Mirror Entry';
    identity: string;
    limit?: number;
    cursor?: string;
});
```

## Live Demo

<Notes :source="'Mirror Entry'" :defaultIdentity="[{
    identity: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    platform: 'Ethereum'
}]" />
