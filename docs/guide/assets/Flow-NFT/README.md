# Overview

<Logos type="Assets" :names="['Flow', 'Alchemy']" />

You can initialize with `ipfsGateway` `alchemyAPIKey` to get potentially faster response or higher stability.

## API

```ts
const assets: Assets = await unidata.assets.get(options: {
    source: 'Flow NFT';
    identity: string;
    providers?: ('Alchemy')[];
});
```

## Live Demo

<Assets :source="'Flow NFT'" :defaultIdentity="'0xff2da663c7033313'" />
