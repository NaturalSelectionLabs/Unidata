# Ethereum NFT Activity

<Logos type="Notes" :names="['Ethereum', 'Polygon', 'Binance Smart Chain', 'Arbitrum', 'Fantom', 'Gnosis', 'POAP', 'RSS3']" />

::: tip
You can use RSS3 API for free (no rate limit disclosed).
:::

[Ethereum NFT](https://ethereum.org/en/nft/) is a kind of token on Ethereum with a chaotic specification. They can be normalized through Unidata now.

You can initialize with `ipfsGateway` to potentially get a faster response or higher stability.

## API

```ts
const notes: Notes = await unidata.notes.get(options: {
    source: 'Ethereum NFT Activity';
    identity: string;
    limit?: number;
    cursor?: string;
});
```

## Live Demo

<Notes :source="'Ethereum NFT Activity'" :defaultIdentity="[{
    identity: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    platform: 'Ethereum'
}]" />
