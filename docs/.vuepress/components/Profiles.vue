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
        <h5>Code</h5>
        <pre class="code"><code>{{ `const profiles: Profiles = unidata.profiles.get({
    source: '${props.source}',
    identity: '${identity}',${providers ? `
    providers: ${JSON.stringify(providers)},` : ''}
});`}}</code></pre>
        <h5>View</h5>
        <el-card class="profile-card" v-loading="loading" v-for="profile in profiles.list" :key="profile">
            <font-awesome-icon class="edit" icon="pen-to-square" />
            <div class="info">
                <div class="avatar"><img :src="profile.avatars?.[0]" /></div>
                <div class="text">
                    <div class="name">
                        {{ profile.name }}
                        <span class="handler" v-if="profile.metadata?.handler">{{ profile.metadata?.handler }}</span>
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
        <h5>Data</h5>
        <pre class="data">{{ JSON.stringify(profiles, null, 4) }}</pre>
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
const profiles = ref<Profiles>({
    total: 0,
    list: [],
});

const unidata = getCurrentInstance()?.appContext.config.globalProperties.unidata;
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
.profile-card {
    position: relative;

    .edit {
        position: absolute;
        top: 35px;
        right: 40px;
        cursor: pointer;
        width: 20px;
        height: 20px;
        color: #555;
    }

    .info {
        display: flex;

        .avatar {
            width: 150px;
            height: 150px;
            margin-right: 40px;

            img {
                width: 100%;
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

                .handler {
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
