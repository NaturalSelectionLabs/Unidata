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
            <label>Platform: </label>
            <el-select v-model="platform">
                <el-option
                    v-for="item in defaultIdentity"
                    :key="item.platform"
                    :label="item.platform"
                    :value="item.platform"
                />
            </el-select>
        </div>
        <h5>Code</h5>
        <pre class="code"><code>{{ `const links: Links = await unidata.links.get({
    source: '${props.source}',
    identity: '${identity}',
    platform: '${platform}',${providers ? `
    providers: ${JSON.stringify(providers)},` : ''}
});`}}</code></pre>
        <h5>View</h5>
        <el-card class="links-card" v-loading="loading">
            <div class="list">
                <div class="follow follow-left">
                    <p>{{ links.total }}</p>
                    <p>Following</p>
                    <ul>
                        <li v-for="item in links.list" :key="item">
                            {{ item.to }} ({{ item.metadata.to_owner.slice(0, 5) }}...{{
                                item.metadata.to_owner.slice(-4)
                            }})
                        </li>
                    </ul>
                </div>
                <div class="follow">
                    <p>{{ backlinks.total }}</p>
                    <p>Followers</p>
                    <ul>
                        <li v-for="item in backlinks.list" :key="item">
                            {{ item.from }} ({{ item.metadata.from_owner.slice(0, 5) }}...{{
                                item.metadata.from_owner.slice(-4)
                            }})
                        </li>
                    </ul>
                </div>
            </div>
        </el-card>
        <h5>Data</h5>
        <pre class="data">{{ JSON.stringify(links, null, 4) }}</pre>
        <h6>Reversed Links Data</h6>
        <pre class="data">{{ JSON.stringify(backlinks, null, 4) }}</pre>
    </div>
</template>

<script setup lang="ts">
import { watchEffect, ref, getCurrentInstance } from 'vue';

const props = defineProps({
    source: {
        type: String,
        required: true,
    },
    defaultIdentity: {
        type: Array,
        required: true,
    },
});

const identity = ref((<any>props.defaultIdentity[0]).identity);
const platform = ref((<any>props.defaultIdentity[0]).platform);

const loading = ref(true);
const links = ref({});
const backlinks = ref({});

const unidata = getCurrentInstance()?.appContext.config.globalProperties.unidata;

watchEffect(async () => {
    identity.value = (<any>props.defaultIdentity.find((item: any) => item.platform === platform.value))?.identity;
});

watchEffect(async () => {
    if (identity.value) {
        loading.value = true;
        links.value = {};
        backlinks.value = {};
        unidata.links
            .get({
                source: props.source,
                identity: identity.value,
                platform: platform.value,
            })
            .then((p: any) => {
                links.value = p;
                loading.value = false;
            });
        unidata.links
            .get({
                source: props.source,
                identity: identity.value,
                platform: platform.value,
                reversed: true,
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
