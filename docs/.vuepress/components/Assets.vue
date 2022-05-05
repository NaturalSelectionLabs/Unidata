<template>
    <div>
        <div class="input-wrap">
            <label>Identity: </label>
            <el-input
                v-model="identity"
                placeholder="Please input ethereum address"
                clearable
                :maxlength="source === 'Solana NFT' ? 44 : 42"
                show-word-limit
                class="input"
            />
        </div>
        <h5>Code</h5>
        <pre class="code"><code>{{ `const assets: Assets = unidata.assets.get({
    source: '${props.source}',
    identity: '${identity}',${providers ? `
    providers: ${JSON.stringify(providers)},` : ''}
});`}}</code></pre>
        <h5>View</h5>
        <div class="loading-wrap" v-loading="loading">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
                >Check all networks</el-checkbox
            >
            <el-checkbox-group v-model="checked" @change="handleCheckedChange">
                <el-checkbox v-for="(value, network) in networks" :key="network" :label="network">{{
                    network
                }}</el-checkbox>
            </el-checkbox-group>
            <el-row class="assets" :gutter="20">
                <el-col class="asset" :span="8" v-loading="loading" v-for="asset in checkedAssets" :key="asset">
                    <el-card class="asset-card">
                        <div class="asset-body">
                            <video
                                style="width: 100px; height: 100px"
                                :src="asset.attachments.find((attachment) => attachment.type === 'preview')?.address"
                                :fit="'cover'"
                                v-if="
                                    asset.attachments
                                        .find((attachment) => attachment.type === 'preview')
                                        ?.mime_type?.split('/')[0] === 'video'
                                "
                                autoplay
                                loop
                                muted
                            />
                            <model-viewer
                                style="width: 100px; height: 100px"
                                :src="asset.attachments.find((attachment) => attachment.type === 'preview')?.address"
                                ar
                                ar-modes="webxr scene-viewer quick-look"
                                seamless-poster
                                shadow-intensity="1"
                                camera-controls
                                enable-pan
                                v-else-if="
                                    asset.attachments
                                        .find((attachment) => attachment.type === 'preview')
                                        ?.mime_type?.split('/')[0] === 'model'
                                "
                            ></model-viewer>
                            <el-image
                                style="width: 100px; height: 100px"
                                :src="asset.attachments.find((attachment) => attachment.type === 'preview')?.address"
                                :fit="'cover'"
                                v-else
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
        <h5>Data</h5>
        <pre class="data">{{ JSON.stringify(assets, null, 4) }}</pre>
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
    providers: {
        type: Array,
    },
});

const identity = ref(props.defaultIdentity);
const providers = ref(props.providers);

const loading = ref(true);
const assets = ref<Asset[]>([]);
const checkedAssets = ref<Asset[]>([]);
const networks = ref<{
    [network: string]: boolean;
}>({});

const checkAll = ref(true);
const isIndeterminate = ref(false);
const checked = ref<string[]>([]);

const handleCheckAllChange = (val: boolean) => {
    checked.value = val ? Object.keys(networks.value) : [];
    isIndeterminate.value = false;
};
const handleCheckedChange = (value: string[]) => {
    const checkedCount = value.length;
    checkAll.value = checkedCount === Object.keys(networks.value).length;
    isIndeterminate.value = checkedCount > 0 && checkedCount < Object.keys(networks.value).length;
};

const unidata = getCurrentInstance()?.appContext.config.globalProperties.unidata;
watchEffect(async () => {
    if (identity.value) {
        loading.value = true;
        assets.value = [];
        unidata.assets
            .get(
                providers.value
                    ? {
                          identity: identity.value,
                          source: props.source,
                          providers: providers.value,
                      }
                    : {
                          identity: identity.value,
                          source: props.source,
                      },
            )
            .then((p: Asset[]) => {
                assets.value = p;
                loading.value = false;

                p.forEach((asset: Asset) => {
                    if (asset.metadata?.network) {
                        networks.value[asset.metadata.network] = true;
                    }
                });

                checked.value = Object.keys(networks.value);
            });
    }
});

watchEffect(async () => {
    checkedAssets.value = assets.value.filter((asset: Asset) => checked.value.includes(asset.metadata?.network || ''));
});

let modelScript = document.createElement('script');
modelScript.type = 'module';
modelScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@google/model-viewer/dist/model-viewer.min.js');
document.head.appendChild(modelScript);
</script>

<style lang="less" scoped>
.loading-wrap {
    min-height: 50px;
}

.assets {
    padding: 10px 0;
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
