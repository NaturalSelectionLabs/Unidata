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

<p class="grid">
    <span><a target="_blank" href="https://ens.domains/"><img alt="ENS" src="/images/sources/ens.svg"></a></span>
    <span><a target="_blank" href="">Crossbell</a></span>
    <span><a target="_blank" href="https://infura.io/"><img alt="Infura" src="/images/sources/infura.svg"></a></span>
</p>

| Source                                         | Provider                                   | Docs                                                  |
| ---------------------------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| [ENS](https://ens.domains/)                    | [Infura](https://infura.io/)               | [profiles/ENS.md](/guide/profiles/ENS.md)             |
| [Crossbell](https://github.com/Crossbell-Box/) | [Crossbell RPC](https://api.cybertino.io/) | [profiles/Crossbell.md](/guide/profiles/Crossbell.md) |

### Links

<p class="grid">
    <span><a target="_blank" href="https://cyberconnect.me/"><img alt="CyberConnect" src="/images/sources/cyberconnect.svg"></a></span>
</p>

| Source                                   | Provider                                                                    | Docs                                                  |
| ---------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------- |
| [CyberConnect](https://cyberconnect.me/) | [CyberConnect API](https://docs.cyberconnect.me/cyberconnect-api/overview/) | [links/CyberConnect.md](/guide/links/CyberConnect.md) |

### Assets

<p class="grid">
    <span><a target="_blank" href="https://ethereum.org/"><img alt="Ethereum" src="/images/sources/ethereum.png"></a></span>
    <span><a target="_blank" href="https://polygon.technology/"><img alt="Polygon" src="/images/sources/polygon.svg"></a></span>
    <span><a target="_blank" href="https://www.binance.org/en"><img alt="Binance Smart Chain" src="/images/sources/bsc.svg"></a></span>
    <span><a target="_blank" href="https://arbitrum.io/"><img alt="Arbitrum" src="/images/sources/arbitrum.jpeg"></a></span>
    <span><a target="_blank" href="https://fantom.foundation/"><img alt="Fantom" src="/images/sources/fantom.svg"></a></span>
    <span><a target="_blank" href="https://poap.xyz/"><img alt="POAP" src="/images/sources/poap.svg"></a></span>
    <span><a target="_blank" href="https://solana.com/"><img alt="Solana" src="/images/sources/solana.svg"></a></span>
    <span><a target="_blank" href="https://moralis.io/"><img alt="Moralis" src="/images/sources/moralis.svg"></a></span>
    <span><a target="_blank" href="https://opensea.io/"><img alt="OpenSea" src="/images/sources/opensea.svg"></a></span>
    <span><a target="_blank" href="https://solscan.io/"><img alt="Solscan" src="/images/sources/solscan.svg"></a></span>
</p>

| Source                                       | Provider                       | Docs                                                                    |
| -------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------- |
| [Ethereum NFT](https://ethereum.org/en/nft/) | [Moralis](https://moralis.io/) | [assets/Ethereum-NFT-Moralis.md](/guide/assets/Ethereum-NFT-Moralis.md) |
| [Ethereum NFT](https://ethereum.org/en/nft/) | [OpenSea](https://opensea.io/) | [assets/Ethereum-NFT-OpenSea.md](/guide/assets/Ethereum-NFT-OpenSea.md) |
| [Ethereum NFT](https://ethereum.org/en/nft/) | [POAP](https://poap.xyz/)      | [assets/Ethereum-NFT-POAP.md](/guide/assets/Ethereum-NFT-POAP.md)       |
| [Solana NFT](https://solana.com/nft/)        | [Solscan](https://solscan.io/) | [assets/Solana-NFT-Solscan.md](/guide/assets/Solana-NFT-Solscan.md)     |
| [Solana NFT](https://solana.com/nft/)        | [Moralis](https://moralis.io/) | [assets/Solana-NFT-Moralis.md](/guide/assets/Solana-NFT-Moralis.md)     |

### Notes

TODO
