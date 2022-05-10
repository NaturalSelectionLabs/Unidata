# Overview

<Logos type="Links" />

Links describe the relationships between accounts, such as following relationship.

## API

```ts
const links: Links = await unidata.links.get(options: {
    source: string;
    identity: string;
    reversed?: boolean;
    limit?: number;
    pagination_id?: any;
});
```

-   `identity`: Ethereum address, Solana address, Flow address, etc.
-   `reversed`: If true, returns the reversed links that point to the current identity.
-   `limit`: The maximum number of list items to return.
-   `pagination_id`: The pagination id returned from the previous page's results. Since providers use different pagination schemes, its type is uncertain.

## Specification

All returned data conform to the following specification.

```ts
type Links = {
    total: number;
    pagination_id?: any;

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
