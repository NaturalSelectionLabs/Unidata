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
    limit?: number;
    cursor?: string;
});
```

### Set

```ts
const result: {
    code: number;
    message: string;
} = await unidata.profiles.set(
    options: {
        source: 'Crossbell';
        identity: string;
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

## Live Demo

### Get

<Profiles :source="'Crossbell'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />

### Set

Open the browser console and execute the following code

```ts
await unidata.profiles.set(
    {
        source: 'Crossbell',
        identity: '<your_ethereum_address>',
    },
    {
        name: '<your_name>',
    },
);
```
