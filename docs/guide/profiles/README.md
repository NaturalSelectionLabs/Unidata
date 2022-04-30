# Introduction

Profiles record the basic information of accounts, including the name, avatar, bio, connected accounts, etc.

## API

```ts
const profiles: Profiles = unidata.profiles.get(options: {
    source: string;
    identity: string;
});
```

## Specification

All returned data conform to the following specification.

```ts
type Profiles = {
    name?: string;
    avatars?: URI[];
    bio?: string;
    websites?: URI[];
    banner?: URI[];

    attachments?: {
        type?: string;
        content?: string;
        address?: URI;
        mime_type: string;
        size_in_bytes?: number;
    }[];

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
```
