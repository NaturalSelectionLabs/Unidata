# Overview

<Logos type="Assets" />

Assets are the properties owned by accounts, such as an NFT, a game achievement, a physical figure, a commodity for sale, etc.

## API

```ts
const assets: Assets = await unidata.assets.get(options: {
    source: string;
    providers?: string[];
    identity: string;
    pagination_id?: any;
});
```

-   `providers`: The providers of the data, requesting and aggregating from all supported providers by default.
-   `identity`: Ethereum address, Solana address, Flow address, etc.
-   `pagination_id`: The pagination id returned from the previous page's results. Since providers use different pagination schemes, its type is uncertain.

## Specification

All returned data conform to the following specification.

```ts
type Assets = {
    total: number;
    pagination_id?: any;

    list: {
        date_created?: string;
        date_updated?: string;

        related_urls?: string[];

        tags?: string[];
        owners: AccountInstanceURI[];
        name?: string;
        description?: string;

        previews?: {
            content?: string;
            address?: URI;
            mime_type?: string;
            size_in_bytes?: number;
        }[];

        items?: {
            content?: string;
            address?: URI;
            mime_type?: string;
            size_in_bytes?: number;
        }[];

        attributes?: {
            content?: string;
            mime_type?: string;
        }[];

        source: AssetSource;

        metadata?: {
            network: Network;
            proof: string;

            [key: string]: any;
        };
    }[];
};
```
