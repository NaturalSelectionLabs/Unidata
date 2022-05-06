# Overview

<Logos type="Assets" />

Assets are the properties owned by accounts, such as an NFT, a game achievement, a physical figure, a commodity for sale, etc.

## API

```ts
const assets: Assets = unidata.assets.get(options: {
    source: string;
    providers?: string[];
    identity: string;
});
```

-   `providers`: The providers of the data, requesting and aggregating from all supported providers by default.
-   `identity`: The Ethereum or Solana address.

## Specification

All returned data conform to the following specification.

```ts
type Assets = {
    total: number;
    list: {
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
};
```
