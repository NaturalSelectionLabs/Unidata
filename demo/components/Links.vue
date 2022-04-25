<template>
    <div>
        <h3>Sources</h3>
        <p>{{ Object.keys(providers).join(', ') }}</p>
        <h3>Model</h3>
        <Tree :obj="links" />
        <h5>Backlinks</h5>
        <Tree :obj="backlinks" />
        <h3>View</h3>
        <el-card class="links-card" v-for="(link, index) in links" :key="link">
            <div class="provider">
                <a target="_blank" :href="providers[link.list[0]?.source]?.site">
                    <img :src="`./assets/${providers[link.list[0]?.source]?.logo}`" />
                </a>
            </div>
            <div class="list">
                <div class="follow follow-left">
                    <p>{{ link.total }}</p>
                    <p>Following</p>
                    <ul>
                        <li v-for="item in link.list" :key="item">{{ item.to }}</li>
                    </ul>
                </div>
                <div class="follow">
                    <p>{{ backlinks[index].total }}</p>
                    <p>Followers</p>
                    <ul>
                        <li v-for="item in backlinks[index].list" :key="item">{{ item.from }}</li>
                    </ul>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
import Tree from './Tree.vue';

const unidata = getCurrentInstance()?.appContext.config.globalProperties.unidata;
const identity = getCurrentInstance()?.appContext.config.globalProperties.identity;

const providers = {
    CyberConnect: {
        logo: 'CyberConnect.svg',
        site: 'https://cyberconnect.me',
    },
};

const links = await Promise.all(Object.keys(providers).map((provider) => unidata.links.get(provider, identity)));
console.log(links);

const backlinks = await Promise.all(
    Object.keys(providers).map((provider) => unidata.links.get(provider, identity, true)),
);
console.log(backlinks);
</script>

<style lang="less">
.links-card {
    position: relative;

    .provider {
        position: absolute;
        top: 30px;
        right: 40px;

        img {
            width: 30px;
            height: 30px;
        }
    }

    .list {
        display: flex;
        align-items: center;
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
                    font-size: 14px;
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
