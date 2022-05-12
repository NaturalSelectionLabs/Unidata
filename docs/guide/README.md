---
sidebarDepth: 0
---

# Getting Started

## Installation

<CodeGroup>
  <CodeGroupItem title="yarn" active>

```bash
yarn add unidata.js
```

  </CodeGroupItem>

  <CodeGroupItem title="npm">

```bash
npm install unidata.js --save
```

  </CodeGroupItem>
</CodeGroup>

## Initialization

```ts
import Unidata from 'unidata.js';

const unidata = new Unidata({
    infuraProjectID?: string;
    ipfsGateway?: string;
    moralisWeb3APIKey?: string;
    openseaAPIKey?: string;
    alchemyAPIKey?: string;
});
```

| Parameter             | Default                           | Description                          |
| --------------------- | --------------------------------- | ------------------------------------ |
| `infuraProjectID`     | ethers default keys               | The PROJECT ID of the Infura to use. |
| `ipfsGateway`         | `'https://gateway.ipfs.io/ipfs/'` | The IPFS gateway to use.             |
| `moralisWeb3APIKey`   |                                   | Account Web3 API Key of Moralis.     |
| `openseaAPIKey`       |                                   | API Key of OpenSea.                  |
| `alchemyAPIKey`       | `'demo'`                          | API Key of Alchemy.                  |
| `web3StorageAPIToken` | Unidata default token             | API Token of Web3 Storage.           |

If you don't want to expose some api keys on the front end, or if you want to cache data for faster response and higher stability, then you can use the SDK for your Node.js project.

## Community

[![GitHub Org's stars](https://img.shields.io/github/stars/DIYgod/Unidata?style=social)](https://github.com/DIYgod/Unidata)

[![Discord](https://img.shields.io/discord/968954680514342973?label=Discord&logo=discord&style=social)](https://discord.gg/ggrfhdS9Fe)

[![Twitter Follow](https://img.shields.io/twitter/follow/Unidata_?style=social)](https://twitter.com/Unidata_)

## Supported Sources

### Assets

<Logos type="Assets" />

### Notes

<Logos type="Notes" />

### Profiles

<Logos type="Profiles" />

### Links

<Logos type="Links" />
