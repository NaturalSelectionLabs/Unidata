# Getting Started

## Installation

<CodeGroup>
  <CodeGroupItem title="yarn" active>

```bash
yarn add unidata
```

  </CodeGroupItem>

  <CodeGroupItem title="npm">

```bash
npm install unidata --save
```

  </CodeGroupItem>
</CodeGroup>

## Initialization

```ts
import Unidata from 'unidata';

const unidata = new Unidata({
    platform?: 'Ethereum' | 'Solana';
    infuraProjectID?: string;
    ipfsGateway?: string;
});
```

| Parameter         | Default                          | Description                                  |
| ----------------- | -------------------------------- | -------------------------------------------- |
| `platform`        | `'Ethereum'`                     | The platform to use. Defaults to `Ethereum`. |
| `infuraProjectID` |                                  | The PROJECT ID of the Infura to use.         |
| `ipfsGateway`     | `'https://ipfs.infura.io/ipfs/'` | The IPFS gateway to use.                     |
