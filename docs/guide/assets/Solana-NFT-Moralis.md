# Solana NFT - Moralis

<Logos :names="['Solana', 'Moralis']" />

::: warning
You can use Moralis API for free (5 requests per second per key), and you can pay for more frequent requests.
You need to register a Moralis account to use it.
:::

[Solana NFT / Metaplex](https://docs.metaplex.com/) is a kind of token on Solana.

[Moralis](https://moralis.io/) provides APIs to easy access to Solana NFTs.

You must initialize with `moralisWeb3APIKey` to use, which will expose your Moralis api key on the front end. The steps to get the key after registration are as follows:

![](https://i.imgur.com/wXPAPfm.png)

## API

```ts
const assets: Assets = unidata.assets.get(options: {
    source: 'Solana NFT';
    identity: string;
    providers: ['Moralis'];
});
```

## Live Demo

<Assets :source="'Solana NFT'" :providers="['Moralis']" :defaultIdentity="'EoCqmJ6xNQmZKYsic9PSgxxQzqZREjmhNFnkNqxoc8pp'" />
