# Crossbell Link

<Logos type="Links" :names="['Crossbell']" />

::: tip
You can use Crossbell API for free (no rate limit disclosed).
:::

[Crossbell](https://github.com/Crossbell-Box/).

## API

### Get

```ts
const links: Links = await unidata.links.get(options: {
    source: 'Crossbell Link';
    identity: string;
    platform?: string;
    type?: string;
    reversed?: boolean;
    cursor?: number;
    limit?: number;
    filter?: {
        to?: string;
    }
});
```

-   Use Ethereum address as the `identity` and `'Ethereum'` as the `platform` to get links from all links belonging to this address.
-   Use Crossbell handle as the `identity` and `'Crossbell'` as the `platform` to get links from a specific profile.
-   Use `filter.to` to get links to a certain Crossbell identity, useful when checking if a link exists with a certain Crossbell identity.

### Set

```ts
const result: {
    code: number;
    message: string;
} = await unidata.links.set(
    options: {
        source: 'Crossbell Link';
        identity: string;
        platform?: 'Ethereum' | 'Crossbell';
        action?: 'add' | 'remove';
    },
    input: {
        to: string;
        type: string;
    }
);
```

-   Use Ethereum address as the `identity` and `'Ethereum'` as the `platform` to set link from primary profile of this address.
-   Use Crossbell handle as the `identity` and `'Crossbell'` as the `platform` to set link from a specific profile.
-   `action`: can be `add` or `remove`, default to `add`.
-   `to`: the profile handle you want to link to.

## Live Demo

<Links :source="'Crossbell Link'" :defaultIdentity="[{
    identity: '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944',
    platform: 'Ethereum'
}, {
    identity: 'diygod',
    platform: 'Crossbell'
}]" />

### Set

Open the browser console and execute the following code

**add action:**

```ts
await unidata.links.set(
    {
        source: 'Crossbell Link',
        identity: '<your_ethereum_address>',
        platform: 'Ethereum',
        action: 'add',
    },
    {
        to: 'diygod',
        type: 'follow',
    },
);
```

**remove action:**

```ts
await unidata.links.set(
    {
        source: 'Crossbell Link',
        identity: '<your_ethereum_address>',
        platform: 'Ethereum',
        action: 'remove',
    },
    {
        to: 'diygod',
        type: 'follow',
    },
);
```
