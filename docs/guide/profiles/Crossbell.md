# Crossbell

<Logos type="Profiles" :names="['Crossbell']" />

::: tip
You can use Crossbell API for free (no rate limit disclosed).
:::

[Crossbell](https://github.com/Crossbell-Box/).

You can initialize with `ipfsGateway` `web3StorageAPIToken` to get potentially faster response or higher stability.

## API

### Get

```ts
const profiles: Profiles = await unidata.profiles.get(options: {
    source: 'Crossbell';
    identity: string;
    platform?: 'Ethereum' | 'Crossbell';
    limit?: number;
    cursor?: string;
});
```

-   Use Ethereum address as `identity` and Ethereum as `platfrom` to get all profiles belonging to this address.
-   Use Crossbell handle as the `identity` and Crossbell as the `platfrom` to get a specific profile.

### Set

```ts
const result: {
    code: number;
    message: string;
} = await unidata.profiles.set(
    options: {
        source: 'Crossbell';
        identity: string;
        platform?: 'Ethereum' | 'Crossbell';
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

-   Use Ethereum address as `identity` and Ethereum as `platfrom` to set primary profile of this address.
-   Use Crossbell handle as the `identity` and Crossbell as the `platfrom` to set a specific profile.

## Live Demo

### Get

<Profiles :source="'Crossbell'" :defaultIdentity="[{
    identity: '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944',
    platform: 'Ethereum'
}, {
    identity: 'diygod',
    platform: 'Crossbell'
}]" />

### Set

Open the browser console and execute the following code

```ts
await unidata.profiles.set(
    {
        source: 'Crossbell',
        identity: '<your_ethereum_address>',
        platform: 'Ethereum',
    },
    {
        name: '<your_name>',
    },
);
```

or

```ts
await unidata.profiles.set(
    {
        source: 'Crossbell',
        identity: '<your_crossbell_handle>',
        platform: 'Crossbell',
    },
    {
        name: '<your_name>',
    },
);
```
