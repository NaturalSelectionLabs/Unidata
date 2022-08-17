# Crossbell Note

<Logos type="Notes" :names="['Crossbell']" />

::: tip
You can use Crossbell API for free (no rate limit disclosed).
:::

[Crossbell](https://github.com/Crossbell-Box/).

You can initialize with `ipfsGateway` to potentially get a faster response or higher stability.

## API

### Get

```ts
const notes: Notes = await unidata.notes.get(options: {
    source: 'Crossbell Note';
    identity?: string;
    platform?: string;
    limit?: number;
    cursor?: string;
    filter?: {
        url?: string;
        id?: string;
    }
});
```

-   `identity` is optional, returns data based on filter only when not provided.
-   Use Ethereum address as the `identity` and `'Ethereum'` as the `platform` to get notes from all profiles belonging to this address.
-   Use Crossbell handle as the `identity` and `'Crossbell'` as the `platform` to get notes from a specific profile.
-   Use `filter.url` to get notes linking to the url.
-   Use `filter.url` to get notes with a certain id.

### Set

Add, update or remove your notes.

```ts
const result: {
    code: number;
    message: string;
    data?: any;
} = await unidata.notes.set(
    options: {
        source: 'Crossbell Note';
        identity: 'Ethereum' | 'Crossbell';
        platform?: string;
        action?: 'add' | 'remove' | 'update';
    },
    input: {
        id?: string;

        related_urls?: string[];

        applications?: string[];
        tags?: string[];
        authors: AccountInstanceURI[];
        title?: string;
        content_warning?: string;

        summary?: {
            content?: string;
            address?: URI;
            mime_type?: string;
            size_in_bytes?: number;
        };

        body?: {
            content?: string;
            address?: URI;
            mime_type?: string;
            size_in_bytes?: number;
        };

        attachments?: {
            name?: string;
            content?: string;
            address?: URI;
            mime_type?: string;
            size_in_bytes?: number;
        }[];
    }
);
```

-   Use Ethereum address as the `identity` and `'Ethereum'` as the `platform` to set note from primary profile of this address.
-   Use Crossbell handle as the `identity` and `'Crossbell'` as the `platform` to set note from a specific profile.
-   `action`: can be `add`, `remove` or `update`, default to `add`.
-   `id`: `id` is not required for `add` action, but must be included for `remove` or `update` action.

## Live Demo

### Get

<Notes :source="'Crossbell Note'" :defaultIdentity="[{
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
await unidata.notes.set(
    {
        source: 'Crossbell Note',
        identity: '<your_ethereum_address>',
        platform: 'Ethereum',
        action: 'add',
    },
    {
        title: 'My First Note',
        summary: {
            content: '> From Unidata',
            mime_type: 'text/markdown',
        },
        body: {
            content: 'Body of my first note',
        },
        attachments: [
            {
                address: 'ipfs://bafybeifwzi2443622ihqzbs7ed67fed2juhcko35ncyvlngljo6bfjc44e/unidata2.jpeg',
            },
        ],
        related_urls: ['https://unidata.app/'],
    },
);
```

**remove action:**

```ts
await unidata.notes.set(
    {
        source: 'Crossbell Note',
        identity: '<your_ethereum_address>',
        platform: 'Ethereum',
        action: 'remove',
    },
    {
        id: '1',
    },
);
```

**update action(TODO):**

```ts
await unidata.notes.set(
    {
        source: 'Crossbell Note',
        identity: '<your_ethereum_address>',
        platform: 'Ethereum',
        action: 'update',
    },
    {
        id: '1',
        title: 'My Updated First Note',
    },
);
```
