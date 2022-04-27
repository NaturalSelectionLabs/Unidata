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
        <el-card class="profile-card" v-loading="loading">
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
        <h5>Data:</h5>
        <pre>{{ JSON.stringify(profile, null, 4) }}</pre>
    </div>
</template>

<script setup lang="ts">
import { defineProps, watchEffect, ref, getCurrentInstance } from 'vue';

const props = defineProps({
    provider: {
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
const profile = ref({});

watchEffect(async () => {
    if (identity.value) {
        loading.value = true;
        profile.value = {};
        getCurrentInstance()
            ?.appContext.config.globalProperties.unidata.profiles.get(props.provider, identity.value)
            .then((p: any) => {
                profile.value = p;
                loading.value = false;
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
