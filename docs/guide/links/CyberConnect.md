# CyberConnect

[CyberConnect](https://cyberconnect.me).

## API

```ts
const links: Links = unidata.links.get(options: {
    source: 'CyberConnect';
    identity: string;
    reversed?: boolean;
    offset?: number;
    limit?: number;
});
```

## Live Demo

<Links :source="'CyberConnect'" :defaultIdentity="'0x148d59faf10b52063071eddf4aaf63a395f2d41c'" />
