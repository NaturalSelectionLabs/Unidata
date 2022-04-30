# ENS

[ENS](https://ens.domains/): Your web3 username, a name for all your cryptocurrency addresses, and decentralised websites.

## API

```ts
const profiles: Profiles = unidata.profiles.get(options: {
    source: 'ENS';
    identity: string;
});
```

## Live Demo

<Profiles :source="'ENS'" :defaultIdentity="'0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'" />
