# Alchemy Provider

<Logos type="Assets" :names="['Flow', 'Alchemy']" />

::: tip
You can use Alchemy API for free (no rate limit disclosed).
:::

You must initialize with `alchemyFlowAPIKey` to use this provider.

You can initialize with `ipfsGateway` to potentially get a faster response or higher stability.

## API

```ts
const assets: Assets = await unidata.assets.get(options: {
    source: 'Flow NFT';
    identity: string;
    providers?: ['Alchemy'];
    limit?: number;
    cursor?: string;
});
```

## Live Demo

<Assets :source="'Flow NFT'" :providers="['Alchemy']" :defaultIdentity="'0xff2da663c7033313'" />
