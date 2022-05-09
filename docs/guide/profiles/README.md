# Overview

<Logos type="Profiles" />

Profiles record the basic information of accounts, including the name, avatar, bio, connected accounts, etc.

## API

```ts
const profiles: Profiles = await unidata.profiles.get(options: {
    source: string;
    identity: string;
});
```

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
