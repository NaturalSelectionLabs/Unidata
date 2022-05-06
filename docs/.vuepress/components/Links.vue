<template>
    <div>
        <div class="input-wrap">
            <label>Identity: </label>
            <el-input
                v-model="identity"
                placeholder="Please input ethereum address"
                clearable
                maxlength="42"
                show-word-limit
                class="input"
            />
        </div>
        <div class="input-wrap">
            <label>Limitation: </label>
            5
        </div>
        <h5>Code</h5>
        <pre class="code"><code>{{ `const links: Links = await unidata.links.get({
    source: '${props.source}',
    identity: '${identity}',${providers ? `
    providers: ${JSON.stringify(providers)},` : ''}
    limit: 5,
});`}}</code></pre>
        <h5>View</h5>
        <el-card class="links-card" v-loading="loading">
            <div class="list">
                <div class="follow follow-left">
                    <p>{{ links.total }}</p>
                    <p>Following</p>
                    <ul>
                        <li v-for="item in links.list" :key="item">{{ item.to }}</li>
                    </ul>
                </div>
                <div class="follow">
                    <p>{{ backlinks.total }}</p>
                    <p>Followers</p>
                    <ul>
                        <li v-for="item in backlinks.list" :key="item">{{ item.from }}</li>
                    </ul>
                </div>
            </div>
        </el-card>
        <h5>Data</h5>
        <pre class="data">{{ JSON.stringify(links, null, 4) }}</pre>
        <pre class="data">{{ JSON.stringify(backlinks, null, 4) }}</pre>
    </div>
</template>

<script setup lang="ts">
import { defineProps, watchEffect, ref, getCurrentInstance } from 'vue';

const props = defineProps({
    source: {
        type: String,
        required: true,
    },
    defaultIdentity: {
        type: String,
        required: true,
    },
});

const identity = ref(props.defaultIdentity);

const loading = ref(true);
const links = ref({});
const backlinks = ref({});

const unidata = getCurrentInstance()?.appContext.config.globalProperties.unidata;
watchEffect(async () => {
    if (identity.value) {
        loading.value = true;
        links.value = {};
        backlinks.value = {};
        unidata.links
            .get({
                source: props.source,
                identity: identity.value,
                limit: 5,
            })
            .then((p: any) => {
                links.value = p;
                loading.value = false;
            });
        unidata.links
            .get({
                source: props.source,
                identity: identity.value,
                reversed: true,
                limit: 5,
            })
            .then((p: any) => {
                backlinks.value = p;
                loading.value = false;
            });
    }
});
</script>

<style lang="less" scoped>
.links-card {
    position: relative;

    .list {
        display: flex;
        justify-content: center;

        .follow {
            text-align: center;
            flex: 1;

            p {
                margin: 0;

                &:first-child {
                    font-size: 20px;
                    font-weight: bold;
                }
            }

            ul {
                margin: 0;
                padding: 0;
                list-style: none;
                margin-top: 10px;

                li {
                    margin: 0;
                    padding: 0;
                    font-size: 12px;
                    color: #aaa;
                    margin-top: 5px;
                }
            }
        }

        .follow-left {
            border-right: 1px solid #eee;
        }
    }
}
</style>
