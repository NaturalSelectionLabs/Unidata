# Overview

<Logos type="Profiles" />

Profiles record the basic information of accounts, including the name, avatar, bio, connected accounts, etc.

## API

```ts
const profiles: Profiles = await unidata.profiles.get(options: {
    source: string;
    identity: string;
    limit?: number;
    cursor?: any;
});
```

-   `identity`: Ethereum address, Solana address, Flow address, etc.
-   `limit`: The number of assets to return. Since providers use different pagination schemes, it cannot guarantee that the quantities are always accurate.
-   `cursor`: The pagination cursor returned from the previous page's results. Since providers use different pagination schemes, its type is uncertain.

## Specification

All returned data conform to the following specification.

```ts
type Profiles = {
    total: number;

    list: {
        name?: string;
        avatars?: URI[];
        bio?: string;
        websites?: URI[];
        banners?: URI[];

        connected_accounts?: {
            identity: string;
            platform: string;
            url?: string;
        }[];

        source: ProfileSource;

        metadata?: {
            network: Network;
            proof: string;

            [key: string]: any;
        };
    }[];
};
```
