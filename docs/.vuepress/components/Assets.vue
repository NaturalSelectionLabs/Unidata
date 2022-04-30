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
        <div class="networks" v-for="(value, network) in networks" :key="network">
            <p>Network: {{ network }}</p>
            <el-row class="assets" :gutter="20">
                <el-col
                    class="asset"
                    :span="12"
                    v-loading="loading"
                    v-for="asset in assets.filter((asset) => asset.metadata?.network === network)"
                    :key="asset"
                >
                    <el-card class="asset-card">
                        <div class="asset-body">
                            <el-image
                                style="width: 100px; height: 100px"
                                :src="asset.attachments.find((attachment) => attachment.type === 'preview')?.address"
                                :fit="'cover'"
                            />
                            <div class="text">
                                <div class="name">{{ asset.name }}</div>
                                <div class="description">{{ asset.description }}</div>
                                <a target="_blank" :href="url" v-for="url in asset.related_urls" :key="url">
                                    <font-awesome-icon icon="link" />
                                </a>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <h5>Data:</h5>
        <pre>{{ JSON.stringify(assets, null, 4) }}</pre>
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
const assets = ref([{}]);
const networks = ref<{
    [network: string]: boolean;
}>({});

watchEffect(async () => {
    if (identity.value) {
        loading.value = true;
        assets.value = [{}];
        getCurrentInstance()
            ?.appContext.config.globalProperties.unidata.assets.get({
                identity: identity.value,
                source: props.source,
            })
            .then((p: any) => {
                assets.value = p;
                loading.value = false;

                p.forEach((asset: Asset) => {
                    if (asset.metadata?.network) {
                        networks.value[asset.metadata.network] = true;
                    }
                });
                console.log('networks', networks.value, assets.value);
            });
    }
});
</script>

<style lang="less" scoped>
.input-wrap {
    display: flex;
    align-items: center;
    margin: 20px 0;

    label {
        margin-right: 10px;
    }

    .input {
        width: 450px;
    }
}

pre {
    padding: 0;
    font-size: 12px;
}

.asset {
    margin-bottom: 20px;

    .asset-body {
        display: flex;

        .text {
            flex: 1;
            margin-left: 10px;

            .name {
                font-size: 14px;
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                word-break: break-all;
                margin-bottom: 10px;
            }

            .description {
                font-size: 12px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                word-break: break-word;
                margin-bottom: 10px;
            }

            a {
                margin-right: 7px;
                color: #555;
                font-size: 14px;
            }
        }
    }
}
</style>
