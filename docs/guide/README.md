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
    platform?: 'Ethereum' | 'Solana';
    infuraProjectID?: string;
    ipfsGateway?: string;
});
```

| Parameter           | Default                   | Description                                  |
| ------------------- | ------------------------- | -------------------------------------------- |
| `platform`          | `'Ethereum'`              | The platform to use. Defaults to `Ethereum`. |
| `infuraProjectID`   | ethers default keys       | The PROJECT ID of the Infura to use.         |
| `ipfsGateway`       | `'https://ipfs.io/ipfs/'` | The IPFS gateway to use.                     |
| `moralisWeb3APIKey` |                           | Account Web3 API Key of Moralis.             |
