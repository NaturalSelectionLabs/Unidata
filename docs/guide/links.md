# 🕸 Links

Links describe the relationships between accounts, such as following relationship.

**All returned links data conform to the following specification:**

```ts
type Links = {
    total: number;
    list: {
        from: InstanceURI;
        to: InstanceURI;
        type: LinkType;

        source: LinkSource;

        metadata?: {
            network: Network;
            proof: string;

            [key: string]: any;
        };
    }[];
};
```

## CyberConnect

[CyberConnect](https://cyberconnect.me).

### API

```js
const links: Links = unidata.links.get('CyberConnect', identity);
```

### Live Demo

<Links :provider="'CyberConnect'" :defaultIdentity="'0x148d59faf10b52063071eddf4aaf63a395f2d41c'" />
