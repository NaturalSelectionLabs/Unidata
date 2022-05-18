# ENS

<Logos type="Profiles" :names="['ENS', 'Infura']" />

::: tip
You can use Infura API for free (25 requests / seconds, 10,000,000 requests / month), and you can pay for more frequent requests.
:::

[ENS](https://ens.domains/) is a famous Ethereum name service.

You can initialize with `ipfsGateway` and `infuraProjectID` to potentially get a faster response or higher stability.

## API

```ts
const profiles: Profiles = await unidata.profiles.get(options: {
    source: 'ENS';
    identity: string;
    platform?: 'Ethereum';
});
```

## Live Demo

<Profiles :source="'ENS'" :defaultIdentity="[{
    identity: '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944',
    platform: 'Ethereum'
}]" />
