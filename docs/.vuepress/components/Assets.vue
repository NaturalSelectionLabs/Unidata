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
        <pre class="code"><code>{{ `const assets: Assets = await unidata.assets.get({
    source: '${props.source}',
    identity: '${identity}',${providers ? `
    providers: ${JSON.stringify(providers)},` : ''}
});`}}</code></pre>
        <h5>View</h5>
        <div class="loading-wrap" v-loading="loading">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
                >Check all networks and providers ({{ assets.total }})</el-checkbox
            >
            <div>
                <div class="check-type">Networks:</div>
                <el-checkbox-group v-model="networkChecked" @change="handleCheckedChange">
                    <el-checkbox v-for="(value, network) in networks" :key="network" :label="network"
                        >{{ network }} ({{
                            assets.list.filter((asset) => asset.metadata.network === network).length
                        }})</el-checkbox
                    >
                </el-checkbox-group>
            </div>
            <div>
                <div class="check-type">Providers:</div>
                <el-checkbox-group v-model="providerChecked" @change="handleCheckedChange">
                    <el-checkbox v-for="(value, provider) in mproviders" :key="provider" :label="provider"
                        >{{ provider }} ({{
                            assets.list.filter((asset) => asset.metadata.providers.find((pro) => pro === provider))
                                .length
                        }})</el-checkbox
                    >
                </el-checkbox-group>
            </div>
            <el-row class="assets" :gutter="20">
                <el-col class="asset" :span="8" v-loading="loading" v-for="asset in checkedAssets" :key="asset">
                    <el-card class="asset-card">
                        <div class="asset-body">
                            <video
                                style="width: 100px; height: 100px"
                                :src="asset.previews?.[0]?.address"
                                :fit="'cover'"
                                v-if="asset.previews?.[0]?.mime_type?.split('/')[0] === 'video'"
                                autoplay
                                loop
                                muted
                            />
                            <model-viewer
                                style="width: 100px; height: 100px"
                                :src="asset.previews?.[0]?.address"
                                ar
                                ar-modes="webxr scene-viewer quick-look"
                                seamless-poster
                                shadow-intensity="1"
                                camera-controls
                                enable-pan
                                v-else-if="asset.previews?.[0]?.mime_type?.split('/')[0] === 'model'"
                            ></model-viewer>
                            <el-image
                                style="width: 100px; height: 100px"
                                :src="asset.previews?.[0]?.address"
                                :fit="'cover'"
                                @error="handleError"
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
import { watchEffect, ref, getCurrentInstance, reactive } from 'vue';
import axios from 'axios';

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
const assets = reactive<Assets>({
    total: 0,
    list: [],
});
const checkedAssets = ref<Asset[]>([]);
const networks = ref<{
    [network: string]: boolean;
}>({});
const mproviders = ref<{
    [provider: string]: boolean;
}>({});

const checkAll = ref(true);
const isIndeterminate = ref(false);
const networkChecked = ref<string[]>([]);
const providerChecked = ref<string[]>([]);

const handleCheckAllChange = (val: boolean) => {
    networkChecked.value = val ? Object.keys(networks.value) : [];
    providerChecked.value = val ? Object.keys(mproviders.value) : [];
    isIndeterminate.value = false;
};
const handleCheckedChange = (value: string[]) => {
    const checkedCount = value.length;
    checkAll.value = checkedCount === Object.keys(networks.value).length;
    isIndeterminate.value = checkedCount > 0 && checkedCount < Object.keys(networks.value).length;
};

const handleError = async (e: any) => {
    const src = e.path[0].getAttribute('src');
    if (src) {
        const result = await axios({
            url: src,
            method: 'HEAD',
        });
        assets.list.forEach((asset) => {
            if (asset.previews?.[0]?.address === src) {
                asset.previews![0].mime_type = result.headers['content-type'];
            }
        });
    }
};

const unidata = getCurrentInstance()?.appContext.config.globalProperties.unidata;
watchEffect(async () => {
    if (identity.value) {
        loading.value = true;
        assets.total = 0;
        assets.list = [];
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
            .then((p: Assets) => {
                assets.total = p.total;
                assets.list = p.list;
                loading.value = false;

                p.list.forEach((asset: Asset) => {
                    if (asset.metadata?.network) {
                        networks.value[asset.metadata.network] = true;
                    }
                    if (asset.metadata?.providers) {
                        asset.metadata.providers.forEach((provider: string) => {
                            mproviders.value[provider] = true;
                        });
                    }
                });

                networkChecked.value = Object.keys(networks.value);
                providerChecked.value = Object.keys(mproviders.value);
            });
    }
});

watchEffect(async () => {
    checkedAssets.value = assets.list.filter(
        (asset: Asset) =>
            networkChecked.value.includes(asset.metadata?.network || '') &&
            providerChecked.value.find((provider: string) => asset.metadata?.providers?.includes(provider)),
    );
});
</script>

<style lang="less" scoped>
.loading-wrap {
    min-height: 50px;

    .check-type {
        font-size: 14px;
        margin: 5px 0;
    }
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
