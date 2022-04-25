<template>
    <div>
        <div class="provider" v-for="(provider, key) in providers" :key="provider">
            <a :href="provider.site" target="_blank">
                <div class="logo">
                    <img :src="`./assets/${provider.logo}`" />
                </div>
                <div class="name">{{ key }}</div>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
const propss = defineProps({
    providers: {
        type: Object,
        required: true,
    },
});
const providers = propss.providers;
const keys = Object.keys(providers);
</script>

<style lang="less" scoped>
.provider {
    display: inline-block;
    margin-right: 70px;
    text-align: center;

    .logo {
        margin-bottom: 10px;

        img {
            height: 50px;
        }
    }

    .name {
        color: #555;
    }
}
</style>
