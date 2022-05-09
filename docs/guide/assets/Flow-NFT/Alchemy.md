# Alchemy Provider

<Logos type="Assets" :names="['Flow', 'Alchemy']" />

::: tip
You can use Alchemy API for free (no rate limit disclosed).
:::

You can initialize with `ipfsGateway` and `alchemyAPIKey` to get potentially faster response or higher stability.

## API

```ts
const assets: Assets = await unidata.assets.get(options: {
    source: 'Flow NFT';
    identity: string;
    providers?: ['Alchemy'];
});
```

## Live Demo

<Assets :source="'Flow NFT'" :providers="['Alchemy']" :defaultIdentity="'0xff2da663c7033313'" />
