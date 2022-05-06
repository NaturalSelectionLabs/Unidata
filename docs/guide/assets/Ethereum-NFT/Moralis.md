# Moralis Provider

<Logos type="Assets" :names="['Ethereum', 'Polygon', 'Binance Smart Chain', 'Arbitrum', 'Fantom', 'Moralis']" />

::: warning
You can use Moralis API for free (5 requests per second per key), and you can pay for more frequent requests.
You need to register a Moralis account to use it.
:::

[Moralis](https://moralis.io/) provides APIs to easy access to Ethereum NFTs, supporting Ethereum mainnet, Polygon, Binance Smart Chain, Avalanche, Fantom.

You can initialize with `ipfsGateway` to get potentially faster response or higher stability.

You must initialize with `moralisWeb3APIKey` to use, which will expose your Moralis api key on the front end. The steps to get the key after registration are as follows:

![](https://i.imgur.com/wXPAPfm.png)

In addition to fetching data from Moralis, Unidata will automatically report missing metadata to Moralis to let Moralis to resync.

## API

```ts
const assets: Assets = await unidata.assets.get(options: {
    source: 'Ethereum NFT';
    identity: string;
    providers: ['Moralis'];
});
```

## Live Demo

<Assets :source="'Ethereum NFT'" :providers="['Moralis']" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
