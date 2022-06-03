# Crossbell Provider

<Logos type="Assets" :names="['Crossbell']" />

## API

```ts
const assets: Assets = await unidata.assets.get(options: {
    source: 'Ethereum NFT';
    identity: string;
    providers: ['Crossbell'];
});
```

## Live Demo

<Assets :source="'Ethereum NFT'" :providers="['Crossbell']" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
