# ENS

<Logos type="Profiles" :names="['ENS', 'The Graph', 'Infura']" />

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
    identity: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    platform: 'Ethereum'
}]" />
