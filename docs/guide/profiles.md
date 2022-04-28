# 👾 Profiles

Profiles record the basic information of accounts, including the name, avatar, bio, connected accounts, etc.

**All returned profile data conform to the following specification:**

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

**API:**

```ts
const profiles: Profiles = unidata.profiles.get(options: {
    source: string;
    identity: string;
});
```

## ENS

[ENS](https://ens.domains/): Your web3 username, a name for all your cryptocurrency addresses, and decentralised websites.

```js
options.source = 'ENS';
```

### Live Demo

<Profiles :source="'ENS'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />

## Crossbell

[Crossbell](https://github.com/Crossbell-Box/).

```js
options.source = 'Crossbell';
```

### Live Demo

<Profiles :source="'Crossbell'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
