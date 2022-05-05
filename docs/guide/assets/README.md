# Overview

<Logos type="Assets" />

Assets are the properties owned by accounts, such as an NFT, a game achievement, a physical figure, a commodity for sale, etc.

## API

```ts
const assets: Assets = unidata.assets.get(options: {
    source: 'Ethereum NFT' | 'Solana NFT';
    providers?: ('Alchemy' | 'Moralis' | 'OpenSea' | 'POAP' | 'Solscan')[];
    identity: string;
});
```

-   `providers`: The providers of the data, requesting and aggregating from all supported providers by default.
-   `identity`: The Ethereum or Solana address.

## Specification

All returned data conform to the following specification.

```ts
type Assets = {
    date_created?: string;
    date_updated?: string;

    related_urls?: string[];

    tags?: string[];
    owners: AccountInstanceURI[];
    name?: string;
    description?: string;
    attachments?: {
        type?: string;
        content?: string;
        address?: URI;
        mime_type: string;
        size_in_bytes?: number;
    }[];

    source: AssetSource | NoteSource;

    metadata?: {
        network: Network;
        proof: string;

        [key: string]: any;
    };
}[];
```

## Live Demo

<Assets :source="'Ethereum NFT'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
