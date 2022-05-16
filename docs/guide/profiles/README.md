# Overview

<Logos type="Profiles" />

Profiles record the basic information of accounts, including the name, avatar, bio, connected accounts, etc.

## API

### Get

```ts
const profiles: Profiles = await unidata.profiles.get(options: {
    source: string;
    identity: string;
    platform?: string;
    limit?: number;
    cursor?: any;
});
```

-   `identity`: Ethereum address, Solana address, Flow address, Crossbell handle, etc.
-   `platform`: Platfrom of the identity. Ethereum, Solana, Flow, Crossbell, etc. Default to `Ethereum`.
-   `limit`: The number of assets to return. Since providers use different pagination schemes, it cannot guarantee that the quantities are always accurate.
-   `cursor`: The pagination cursor returned from the previous page's results. Since providers use different pagination schemes, its type is uncertain.

### Set

Incrementally updates your profile.

```ts
const result: {
    code: number;
    message: string;
} = await unidata.profiles.set(
    options: {
        source: string;
        identity: string;
        platform?: string;
    },
    input: {
        username?: string;
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
    }
);
```

## Specification

All returned data conform to the following specification.

```ts
type Profiles = {
    total: number;

    list: {
        username?: string;
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
