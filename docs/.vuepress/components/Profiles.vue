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
        <pre class="code"><code>{{ `const profiles: Profiles = await unidata.profiles.get({
    source: '${props.source}',
    identity: '${identity}',
    platform: '${platform}',${providers ? `
    providers: ${JSON.stringify(providers)},` : ''}
});`}}</code></pre>
        <h5>View</h5>
        <div class="loading-wrap" v-loading="loading">
            <el-card class="profile-card" v-for="profile in profiles.list" :key="profile">
                <div class="banner">
                    <img :src="profile.banners?.[0]" />
                </div>
                <div class="info">
                    <div class="avatar" v-if="profile.avatars?.length"><img :src="profile.avatars?.[0]" /></div>
                    <div class="text">
                        <div class="name">
                            {{ profile.name }}
                            <span class="username" v-if="profile.username">{{ profile.username }}</span>
                        </div>
                        <div class="bio">{{ profile.bio }}</div>
                        <div class="websites">
                            <ul>
                                <li v-for="website in profile.websites" :key="website">
                                    <a target="_blank" :href="website">
                                        <font-awesome-icon icon="link" />
                                        {{ website.replace(/https?:\/\//, '') }}
                                    </a>
                                </li>
                                <li v-for="account in profile.connected_accounts" :key="account">
                                    <a target="_blank" :href="account.url">
                                        <font-awesome-icon :icon="['fab', account.platform.toLowerCase()]" />
                                        {{ `${account.platform}: ${account.identity}` }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <h5>Data</h5>
        <pre class="data">{{ JSON.stringify(profiles, null, 4) }}</pre>
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
const profiles = ref<Profiles>({
    total: 0,
    list: [],
});

const unidata = getCurrentInstance()?.appContext.config.globalProperties.unidata;

watchEffect(async () => {
    identity.value = (<any>props.defaultIdentity.find((item: any) => item.platform === platform.value))?.identity;
});

watchEffect(async () => {
    if (identity.value) {
        loading.value = true;
        profiles.value = {
            total: 0,
            list: [],
        };
        unidata.profiles
            .get({
                identity: identity.value,
                platform: platform.value,
                source: props.source,
            })
            .then((p: Profiles) => {
                profiles.value = p;
                loading.value = false;
            });
    }
});
</script>

<style lang="less" scoped>
.loading-wrap {
    min-height: 150px;
}

.profile-card {
    position: relative;
    margin-bottom: 20px;

    .banner {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        display: flex;
        align-items: center;
    }

    .info {
        display: flex;
        z-index: 2;
        position: relative;
        background: rgba(255, 255, 255, 0.7);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(5px);
        border-radius: 35px;
        padding: 20px 10px;

        .avatar {
            width: 150px;
            height: 150px;
            margin-right: 40px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        .text {
            flex: 1;
            display: flex;
            justify-content: center;
            flex-direction: column;

            .name {
                font-weight: bold;
                font-size: 28px;
                margin-bottom: 5px;

                .username {
                    font-size: 14px;
                    color: #999;
                    margin-left: 10px;

                    &:before {
                        content: '@';
                    }
                }
            }

            .bio {
                font-size: 14px;
                color: #999;
            }
        }

        .websites {
            margin-top: 10px;

            .svg-inline--fa {
                width: 14px;
                height: 14px;
            }

            ul {
                padding: 0;
                list-style: none;
                margin: 0 0 -7px 0;
            }

            li {
                display: inline-block;
                margin-right: 20px;
                background: rgba(200, 200, 200, 0.5);
                padding: 5px 10px;
                line-height: 16px;
                font-size: 14px;
                line-height: 14px;
                border-radius: 14px;
                margin-bottom: 7px;

                a {
                    color: #333;
                    text-decoration: none;
                }
            }
        }
    }
}
</style>
