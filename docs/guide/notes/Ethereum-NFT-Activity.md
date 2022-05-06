# Ethereum NFT Activity

<Logos type="Notes" :names="['Ethereum', 'Polygon', 'Binance Smart Chain', 'Arbitrum', 'Fantom', 'Gnosis', 'POAP', 'RSS3']" />

::: tip
You can use RSS3 API for free (no rate limit disclosed).
:::

[Ethereum NFT](https://ethereum.org/en/nft/) is a kind of token on Ethereum with a chaotic specification. They can be normalized through Unidata now.

You can initialize with `ipfsGateway` to get potentially faster response or higher stability.

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
