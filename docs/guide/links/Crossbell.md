# Crossbell

<Logos type="Links" :names="['Crossbell']" />

::: tip
You can use Crossbell API for free (no rate limit disclosed).
:::

[Crossbell](https://github.com/Crossbell-Box/).

## API

```ts
const links: Links = await unidata.links.get(options: {
    source: 'Crossbell';
    identity: string;
    type?: string;
    reversed?: boolean;
    cursor?: number;
    limit?: number;
});
```

## Live Demo

<Links :source="'Crossbell'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
