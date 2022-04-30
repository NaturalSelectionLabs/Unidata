# Introduction

Assets are the properties owned by accounts, such as an NFT, a game achievement, a physical figure, a commodity for sale, etc.

## API

```ts
const assets: Assets = unidata.assets.get(options: {
    source: string;
    identity: string;
    provider?: string;
});
```

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
