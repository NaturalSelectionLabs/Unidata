<template>
    <p class="grid">
        <span v-for="item in result" :key="item">
            <a target="_blank" :href="item.url">
                <img :alt="item.name" :src="item.image" v-if="item.image" />
                <span v-else>{{ item.name }}</span>
            </a>
        </span>
    </p>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    names: {
        type: Array,
    },
    type: {
        type: String,
    },
});

const names = ref(props.names);
const type = ref(props.type);

const data = [
    // Profiles
    {
        name: 'ENS',
        type: 'Profiles',
        image: '/images/sources/ens.svg',
        url: 'https://ens.domains/',
    },
    {
        name: 'Crossbell',
        type: 'Profiles',
        image: '/images/sources/crossbell.svg',
        url: 'https://github.com/Crossbell-Box/',
    },
    {
        name: 'Infura',
        type: 'Profiles',
        image: '/images/sources/infura.svg',
        url: 'https://infura.io/',
    },

    // Links
    {
        name: 'CyberConnect',
        type: 'Links',
        image: '/images/sources/cyberconnect.svg',
        url: 'https://cyberconnect.me/',
    },

    // Assets
    {
        name: 'Ethereum',
        type: 'Assets',
        image: '/images/sources/ethereum.png',
        url: 'https://ethereum.org/',
    },
    {
        name: 'Polygon',
        type: 'Assets',
        image: '/images/sources/polygon.svg',
        url: 'https://polygon.technology/',
    },
    {
        name: 'Binance Smart Chain',
        type: 'Assets',
        image: '/images/sources/bsc.svg',
        url: 'https://www.binance.org/en',
    },
    {
        name: 'Arbitrum',
        type: 'Assets',
        image: '/images/sources/arbitrum.jpeg',
        url: 'https://arbitrum.io/',
    },
    {
        name: 'Fantom',
        type: 'Assets',
        image: '/images/sources/fantom.svg',
        url: 'https://fantom.foundation/',
    },
    {
        name: 'Gnosis',
        type: 'Assets',
        image: '/images/sources/gnosis.svg',
        url: 'https://www.xdaichain.com/',
    },
    {
        name: 'POAP',
        type: 'Assets',
        image: '/images/sources/poap.svg',
        url: 'https://poap.xyz/',
    },
    {
        name: 'Solana',
        type: 'Assets',
        image: '/images/sources/solana.svg',
        url: 'https://solana.com/',
    },
    {
        name: 'Flow',
        type: 'Assets',
        image: '/images/sources/flow.svg',
        url: 'https://www.onflow.org/',
    },
    {
        name: 'Gitcoin',
        type: 'Assets',
        image: '/images/sources/gitcoin.svg',
        url: 'https://gitcoin.co/',
    },
    {
        name: 'Alchemy',
        type: 'Assets',
        image: '/images/sources/alchemy.svg',
        url: 'https://www.alchemy.com/',
    },
    {
        name: 'Solscan',
        type: 'Assets',
        image: '/images/sources/solscan.svg',
        url: 'https://solscan.io/',
    },
    {
        name: 'Moralis',
        type: 'Assets',
        image: '/images/sources/moralis.svg',
        url: 'https://moralis.io/',
    },
    {
        name: 'OpenSea',
        type: 'Assets',
        image: '/images/sources/opensea.svg',
        url: 'https://opensea.io/',
    },
    {
        name: 'RSS3',
        type: 'Assets',
        image: '/images/sources/rss3.png',
        url: 'https://rss3.io/',
    },

    // Notes
    {
        name: 'Mirror',
        type: 'Notes',
        image: '/images/sources/mirror.svg',
        url: 'https://mirror.xyz/',
    },
    {
        name: 'Ethereum',
        type: 'Notes',
        image: '/images/sources/ethereum.png',
        url: 'https://ethereum.org/',
    },
    {
        name: 'Polygon',
        type: 'Notes',
        image: '/images/sources/polygon.svg',
        url: 'https://polygon.technology/',
    },
    {
        name: 'Binance Smart Chain',
        type: 'Notes',
        image: '/images/sources/bsc.svg',
        url: 'https://www.binance.org/en',
    },
    {
        name: 'Arbitrum',
        type: 'Notes',
        image: '/images/sources/arbitrum.jpeg',
        url: 'https://arbitrum.io/',
    },
    {
        name: 'Fantom',
        type: 'Notes',
        image: '/images/sources/fantom.svg',
        url: 'https://fantom.foundation/',
    },
    {
        name: 'Gnosis',
        type: 'Notes',
        image: '/images/sources/gnosis.svg',
        url: 'https://www.xdaichain.com/',
    },
    {
        name: 'POAP',
        type: 'Notes',
        image: '/images/sources/poap.svg',
        url: 'https://poap.xyz/',
    },
    {
        name: 'Gitcoin',
        type: 'Notes',
        image: '/images/sources/gitcoin.svg',
        url: 'https://gitcoin.co/',
    },
    {
        name: 'RSS3',
        type: 'Notes',
        image: '/images/sources/rss3.png',
        url: 'https://rss3.io/',
    },
];

let result = data;
if (type.value) {
    result = data.filter((item): any => item.type === type.value);
}
if (names.value) {
    result = result.filter((item): any => names.value!.includes(item.name));
}
</script>

<style lang="less" scoped>
.grid {
    display: grid;
    row-gap: 3rem;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    column-gap: 60px;
    align-items: center;
    margin: 40px 0;
    text-align: center;

    a {
        width: 100%;
        display: inline-block;
    }

    img {
        vertical-align: middle;
        max-height: 40px;
        width: 100%;
    }
}
</style>
