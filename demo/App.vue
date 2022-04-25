<template>
    <div class="body">
        <h1>Unidata Demos</h1>
        Ethereum Address:
        <div class="input">
            <el-input
                v-model="address"
                placeholder="Please input ethereum address"
                clearable
                maxlength="42"
                show-word-limit
            />
        </div>
        <h2>Profiles</h2>
        <Suspense>
            <Profiles />
            <template #fallback>Loading... </template>
        </Suspense>
        <h2>Links</h2>
        <Suspense>
            <Links />
            <template #fallback> Loading... </template>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Profiles from './components/Profiles.vue';
import Links from './components/Links.vue';

const address = ref(localStorage.getItem('address') || '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944');
watch(address, (address) => {
    localStorage.setItem('address', address);
});
</script>

<style>
.body {
    width: 800px;
    margin: 20px auto 50px;
}

.input {
    width: 450px;
    display: inline-block;
    margin-left: 20px;
}
</style>
