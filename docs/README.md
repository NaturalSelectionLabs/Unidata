---
home: true
heroImage: /images/slogon.jpg
actions:
    - text: Get Started
      link: /guide/
      type: primary
features:
    - title: Transparent
      details: All logic is transparent and open sourced.
    - title: Decentralized
      details: All data is from Web3 welcomed decentralized platforms.
    - title: Modularized
      details: Profiles, links, assets, notes are independent of each other.
    - title: Neutral
      details: All Web3 decentralized platforms or data sources are welcomed. And the source code uses MIT License.
    - title: Easy
      details: All data is prepared for you through the same specifications and simple API.
    - title: Diverse
      details: A large number of platfroms and data sources are being supported for you to choose from.
footer: MIT Licensed
---

[![GitHub Org's stars](https://img.shields.io/github/stars/DIYgod/Unidata?style=social)](https://github.com/DIYgod/Unidata) [![Discord](https://img.shields.io/discord/968954680514342973?label=Discord&logo=discord&style=social)](https://discord.gg/ggrfhdS9Fe) [![Twitter Follow](https://img.shields.io/twitter/follow/Unidata_?style=social)](https://twitter.com/Unidata_)

## As Easy as 1, 2, 3

```ts
import Unidata from 'unidata.js';

const unidata = new Unidata();

const nfts = await unidata.assets.get({
    source: 'Ethereum NFT',
    identity: '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944',
});
```

## Supported Sources

### Assets

<Logos type="Assets" />

### Notes

<Logos type="Notes" />

### Profiles

<Logos type="Profiles" />

### Links

<Logos type="Links" />
