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

| Parameter           | Default                   | Description                          |
| ------------------- | ------------------------- | ------------------------------------ |
| `infuraProjectID`   | ethers default keys       | The PROJECT ID of the Infura to use. |
| `ipfsGateway`       | `'https://ipfs.io/ipfs/'` | The IPFS gateway to use.             |
| `moralisWeb3APIKey` |                           | Account Web3 API Key of Moralis.     |
| `openseaAPIKey`     |                           | API Key of OpenSea.                  |
| `alchemyAPIKey`     | `'demo'`                  | API Key of Alchemy.                  |

If you don't want to expose some api keys on the front end, or if you want to cache data for faster response and higher stability, then you can use the SDK for your Node.js project.

## Supported Sources

### Profiles

<Logos type="Profiles" />

### Links

<Logos type="Links" />

### Assets

<Logos type="Assets" />

### Notes

<Logos type="Notes" />
