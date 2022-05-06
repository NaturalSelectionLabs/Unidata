# Overview

<Logos type="Links" />

Links describe the relationships between accounts, such as following relationship.

## API

```ts
const links: Links = await unidata.links.get(options: {
    source: string;
    identity: string;
    reversed?: boolean;
    offset?: number;
    limit?: number;
});
```

## Specification

All returned data conform to the following specification.

```ts
type Links = {
    total: number;
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
