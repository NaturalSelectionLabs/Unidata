# Crossbell Profile

<Logos type="Profiles" :names="['Crossbell']" />

::: tip
You can use Crossbell API for free (no rate limit disclosed).
:::

[Crossbell](https://github.com/Crossbell-Box/).

You can initialize with `ipfsGateway` `web3StorageAPIToken` to potentially get a faster response or higher stability.

## API

### Get

```ts
const profiles: Profiles = await unidata.profiles.get(options: {
    source: 'Crossbell Profile';
    identity: string;
    platform?: 'Ethereum' | 'Crossbell';
    limit?: number;
    cursor?: string;
});
```

-   Use Ethereum address as the `identity` and Ethereum as the `platform` to get all profiles belonging to this address.
-   Use Crossbell handle as the `identity` and Crossbell as the `platform` to get a specific profile.

### Set

```ts
const result: {
    code: number;
    message: string;
} = await unidata.profiles.set(
    options: {
        source: 'Crossbell Profile';
        identity: string;
        platform?: 'Ethereum' | 'Crossbell';
        action?: 'update' | 'add';
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

-   Use Ethereum address as the `identity` and Ethereum as the `platform` to set primary profile of this address.
-   Use Crossbell handle as the `identity` and Crossbell as the `platform` to set a specific profile.
-   `action`: can be `update` or `add`, default to `update`.
-   If the `platform` is Crossbell, then the `action` cannot be `add`.

## Live Demo

### Get

<Profiles :source="'Crossbell Profile'" :defaultIdentity="[{
    identity: '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944',
    platform: 'Ethereum'
}, {
    identity: 'diygod',
    platform: 'Crossbell'
}]" />

### Set

Open the browser console and execute the following code

**update action:**

```ts
await unidata.profiles.set(
    {
        source: 'Crossbell Profile',
        identity: '<your_ethereum_address>',
        platform: 'Ethereum',
        action: 'update',
    },
    {
        name: '<your_name>',
    },
);
```

**add action:**

```ts
await unidata.profiles.set(
    {
        source: 'Crossbell Profile',
        identity: '<your_ethereum_address>',
        platform: 'Ethereum',
        action: 'add',
    },
    {
        username: '<crossbell_handle>',
        name: '<your_name>',
    },
);
```
