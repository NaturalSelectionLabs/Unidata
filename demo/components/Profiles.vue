<template>
    <div>
        <h3>Providers</h3>
        <Providers :providers="providers" />
        <h3>Model</h3>
        <Tree :obj="profiles" />
        <h3>View</h3>
        <el-card class="profile-card" v-for="profile in profiles" :key="profile">
            <font-awesome-icon class="edit" icon="pen-to-square" />
            <div class="provider">
                <a target="_blank" :href="providers[profile.source].site">
                    <img :src="`./assets/${providers[profile.source].logo}`" />
                </a>
            </div>
            <div class="info">
                <div class="avatar"><img crossorigin="anonymous" :src="profile.avatars?.[0]" /></div>
                <div class="text">
                    <div class="name">
                        {{ profile.name
                        }}<span class="handler" v-if="profile.metadata?.handler">{{ profile.metadata?.handler }}</span>
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
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
import Tree from './Tree.vue';
import Providers from './Providers.vue';

const unidata = getCurrentInstance()?.appContext.config.globalProperties.unidata;
const identity = getCurrentInstance()?.appContext.config.globalProperties.identity;

const providers = {
    Crossbell: {
        logo: 'Crossbell.png',
        site: 'https://github.com/Crossbell-Box',
    },
    ENS: {
        logo: 'ENS.svg',
        site: 'https://ens.domains/',
    },
};

const profiles = (
    await Promise.all(Object.keys(providers).map((provider) => unidata.profiles.get(provider, identity)))
).filter((profile) => profile);
</script>

<style lang="less">
.profile-card {
    position: relative;
    margin-top: 20px;

    .edit {
        position: absolute;
        top: 35px;
        right: 90px;
        cursor: pointer;
        width: 20px;
        height: 20px;
        color: #555;
    }

    .provider {
        position: absolute;
        top: 30px;
        right: 40px;

        img {
            width: 30px;
            height: 30px;
        }
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
