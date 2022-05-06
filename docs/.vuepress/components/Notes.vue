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
        <pre class="code"><code>{{ `const notes: Notes = await unidata.notes.get({
    source: '${props.source}',
    identity: '${identity}',${providers ? `
    providers: ${JSON.stringify(providers)},` : ''}
    limit: 10,
});`}}</code></pre>
        <h5>View</h5>
        <el-card class="note-card" v-loading="loading">
            <div class="note-content" v-for="note in notesFiltered" :key="note">
                <h2 class="note-title">
                    <span v-if="note.source === 'Ethereum NFT'">{{
                        note.metadata.from === identity ? 'Lost an NFT: ' : 'Got an NFT: '
                    }}</span>
                    <span>{{ note.title }}</span>
                    <a target="_blank" :href="url" v-for="url in note.related_urls" :key="url">
                        <font-awesome-icon icon="link" />
                    </a>
                </h2>
                <div class="note-date">
                    <strong>Created:</strong> {{ new Date(note.date_created).toDateString() }}
                    <strong>Updated:</strong> {{ new Date(note.date_updated).toDateString() }}
                </div>
                <div
                    class="note-body"
                    v-if="
                        note.attachments.filter((attachment) => attachment.type === 'body')[0]?.mime_type ===
                        'text/markdown'
                    "
                    v-html="md.render(note.attachments.filter((attachment) => attachment.type === 'body')[0]?.content)"
                ></div>
                <div class="note-body" v-else>
                    {{
                        note.attachments.filter((attachment) => attachment.type === 'body')[0]?.content || note.summary
                    }}
                </div>
                <div
                    class="note-media"
                    v-if="note.attachments.filter((attachment) => attachment.type === 'preview')[0]"
                >
                    <video
                        style="width: 100px; height: 100px"
                        :src="note.attachments.find((attachment) => attachment.type === 'preview')?.address"
                        :fit="'cover'"
                        v-if="
                            note.attachments
                                .find((attachment) => attachment.type === 'preview')
                                ?.mime_type?.split('/')[0] === 'video'
                        "
                        autoplay
                        loop
                        muted
                    />
                    <model-viewer
                        style="width: 100px; height: 100px"
                        :src="note.attachments.find((attachment) => attachment.type === 'preview')?.address"
                        ar
                        ar-modes="webxr scene-viewer quick-look"
                        seamless-poster
                        shadow-intensity="1"
                        camera-controls
                        enable-pan
                        v-else-if="
                            note.attachments
                                .find((attachment) => attachment.type === 'preview')
                                ?.mime_type?.split('/')[0] === 'model'
                        "
                    ></model-viewer>
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="note.attachments.find((attachment) => attachment.type === 'preview')?.address"
                        :fit="'cover'"
                        v-else
                    />
                </div>
            </div>
        </el-card>
        <h5>Data</h5>
        <pre class="data">{{ JSON.stringify(notes, null, 4) }}</pre>
    </div>
</template>

<script setup lang="ts">
import { defineProps, watchEffect, ref, getCurrentInstance } from 'vue';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

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
const notes = ref<Notes>({} as Notes);
const notesFiltered = ref<Note[]>([]);

const unidata = getCurrentInstance()?.appContext.config.globalProperties.unidata;
watchEffect(async () => {
    if (identity.value) {
        loading.value = true;
        notes.value = {} as Notes;
        unidata.notes
            .get({
                identity: identity.value,
                source: props.source,
                limit: 10,
            })
            .then((p: any) => {
                notes.value = p;

                const titleMap: {
                    [key: string]: boolean;
                } = {};
                notesFiltered.value = notes.value.list.filter((note) => {
                    if (titleMap[note.title || '']) {
                        return false;
                    } else {
                        titleMap[note.title || ''] = true;
                        return true;
                    }
                });
                loading.value = false;
            });
    }
});
</script>

<style lang="less" scoped>
.note-card {
    position: relative;

    .note-content {
        border-bottom: 2px solid #eee;
        padding: 20px 10px;
    }

    .note-title {
        margin-bottom: 10px;
        border: none;

        a {
            font-size: 14px;
            vertical-align: middle;
            margin-left: 5px;
        }

        span {
            vertical-align: middle;
        }
    }

    .note-body {
        font-size: 12px;
        color: #555;
    }

    .note-date {
        font-size: 12px;
        margin: 5px 0;
    }

    .note-media * {
        margin: 10px 0;
    }
}
</style>
