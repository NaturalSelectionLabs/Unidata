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

## Supported Sources

### Profiles

<Logos type="Profiles" />

| Source                                         | Provider                                   | Docs                                                  |
| ---------------------------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| [ENS](https://ens.domains/)                    | [Infura](https://infura.io/)               | [profiles/ENS.md](/guide/profiles/ENS.md)             |
| [Crossbell](https://github.com/Crossbell-Box/) | [Crossbell RPC](https://api.cybertino.io/) | [profiles/Crossbell.md](/guide/profiles/Crossbell.md) |

### Links

<Logos type="Links" />

| Source                                   | Provider                                                                    | Docs                                                  |
| ---------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------- |
| [CyberConnect](https://cyberconnect.me/) | [CyberConnect API](https://docs.cyberconnect.me/cyberconnect-api/overview/) | [links/CyberConnect.md](/guide/links/CyberConnect.md) |

### Assets

<Logos type="Assets" />

| Source                                       | Provider                       | Docs                                                                    |
| -------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------- |
| [Ethereum NFT](https://ethereum.org/en/nft/) | [Moralis](https://moralis.io/) | [assets/Ethereum-NFT-Moralis.md](/guide/assets/Ethereum-NFT-Moralis.md) |
| [Ethereum NFT](https://ethereum.org/en/nft/) | [OpenSea](https://opensea.io/) | [assets/Ethereum-NFT-OpenSea.md](/guide/assets/Ethereum-NFT-OpenSea.md) |
| [Ethereum NFT](https://ethereum.org/en/nft/) | [POAP](https://poap.xyz/)      | [assets/Ethereum-NFT-POAP.md](/guide/assets/Ethereum-NFT-POAP.md)       |
| [Solana NFT](https://solana.com/nft/)        | [Solscan](https://solscan.io/) | [assets/Solana-NFT-Solscan.md](/guide/assets/Solana-NFT-Solscan.md)     |
| [Solana NFT](https://solana.com/nft/)        | [Moralis](https://moralis.io/) | [assets/Solana-NFT-Moralis.md](/guide/assets/Solana-NFT-Moralis.md)     |

### Notes

TODO
