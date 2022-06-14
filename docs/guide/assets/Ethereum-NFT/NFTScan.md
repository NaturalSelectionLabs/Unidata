# NFTScan Provider

<Logos type="Assets" :names="['Ethereum', 'Polygon', 'Binance Smart Chain', 'Arbitrum', 'Moonbeam', 'Optimism', 'NFTScan']" />

::: tip
You can use NFTScan API for free (10,000 requests / day, 10 requests / second), and you can pay for more frequent requests.
:::

You must register an NFTScan account and initialize with `nftscanAPIKey` to use this provider.

You can initialize with `ipfsGateway` to potentially get a faster response or higher stability.

## API

```ts
const assets: Assets = await unidata.assets.get(options: {
    source: 'Ethereum NFT';
    identity: string;
    providers?: ['NFTScan'];
    limit?: number;
    cursor?: string[];
});
```

## Live Demo

<Assets :source="'Ethereum NFT'" :providers="['NFTScan']" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
