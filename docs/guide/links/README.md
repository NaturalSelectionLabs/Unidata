# Overview

<Logos type="Links" />

Links describe the relationships between accounts, such as following relationship.

## API

### Get

```ts
const links: Links = await unidata.links.get(options: {
    source: string;
    identity: string;
    platform?: string;
    type?: string;
    reversed?: boolean;
    limit?: number;
    cursor?: any;
});
```

-   `identity`: Ethereum address, Solana address, Flow address, Crossbell handle, etc.
-   `platform`: Platfrom of the identity. Ethereum, Solana, Flow, Crossbell, etc. Default to `Ethereum`.
-   `type`: The type of links, follow, like, comment, etc.
-   `reversed`: If true, returns the reversed links that point to the current identity.
-   `limit`: The number of assets to return. Since providers use different pagination schemes, there is no guarantee that the quantities are always accurate.
-   `cursor`: The pagination cursor returned from the previous page's results. Since providers use different pagination schemes, the type is uncertain.

### Set

Add or remote your links.

```ts
const result: {
    code: number;
    message: string;
} = await unidata.links.set(
    options: {
        source: string;
        identity: string;
        action?: string;
    },
    input: {
        to: string;
        type: string;
    }
);
```

## Specification

All returned data conform to the following specification.

```ts
type Links = {
    total: number;
    cursor?: any;

    list: {
        from: InstanceURI;
        to: InstanceURI;
        type: LinkType;

        source: LinkSource;

        metadata?: {
            network: Network;
            proof: string;

            [key: string]: any;
        };
    }[];
};
```
