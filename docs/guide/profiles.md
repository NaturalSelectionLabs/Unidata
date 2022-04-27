# 👾 Profiles

Profiles record the basic information of accounts, including the name, avatar, bio, connected accounts, etc.

**All returned profile data conform to the following specification:**

```ts
type Profile = {
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
};
```

## ENS

[ENS](https://ens.domains/): Your web3 username, a name for all your cryptocurrency addresses, and decentralised websites.

### API

```js
const profile: Profile = unidata.profiles.get('ENS', identity);
```

### Live Demo

<Profiles :provider="'ENS'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />

## Crossbell

[Crossbell](https://github.com/Crossbell-Box/).

### API

```js
const profile: Profile = unidata.profiles.get('Crossbell', identity);
```

### Live Demo

<Profiles :provider="'Crossbell'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
