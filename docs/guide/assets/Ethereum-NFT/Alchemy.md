# Alchemy Provider

<Logos type="Assets" :names="['Ethereum', 'Polygon', 'Alchemy']" />

::: tip
You can use Alchemy API for free (no rate limit disclosed).
:::

You can initialize with `ipfsGateway` and `alchemyAPIKey` to get potentially faster response or higher stability.

## API

```ts
const assets: Assets = await unidata.assets.get(options: {
    source: 'Ethereum NFT';
    identity: string;
    providers?: ['Alchemy'];
    limit?: number;
    pagination_id?: string[];
});
```

## Live Demo

<Assets :source="'Ethereum NFT'" :providers="['Alchemy']" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
