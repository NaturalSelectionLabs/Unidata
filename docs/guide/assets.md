# 💎 Assets

Assets are the properties owned by accounts, such as an NFT, a game achievement, a physical figure, a commodity for sale, etc.

**All returned assets data conform to the following specification:**

```ts
type Assets = {
    date_created: string;
    date_updated: string;

    related_urls?: string[];

    tags?: string[];
    authors: AccountInstanceURI[];
    title?: string;
    summary?: string;
    attachments?: {
        type?: string;
        content?: string;
        address?: URI;
        mime_type: string;
        size_in_bytes?: number;
    }[];

    source: AssetSource;

    metadata?: {
        network: Network;
        proof: string;

        [key: string]: any;
    };
}[];
```

**API:**

```ts
const assets: Assets = unidata.assets.get(options: {
    source: string;
    identity: string;
    provider?: string;
});
```

## Ethereum NFT

[Ethereum NFT](https://ethereum.org/en/nft/).

```js
options.source = 'Ethereum NFT';
```

### Live Demo

<Assets :source="'Ethereum NFT'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
