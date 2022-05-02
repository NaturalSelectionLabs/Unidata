# ENS

<Logos :names="['ENS', 'Infura']" />

::: tip
You can use Infura API for free (25 requests / seconds, 10,000,000 requests / month), and you can pay for more frequent requests.
:::

[ENS](https://ens.domains/) is an Ethereum name service that supports only a limited fields and features of profile.

You can initialize with `ipfsGateway` and `infuraProjectID` to get potentially faster response or higher stability.

## API

```ts
const profiles: Profiles = unidata.profiles.get(options: {
    source: 'ENS';
    identity: string;
});
```

## Live Demo

<Profiles :source="'ENS'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
