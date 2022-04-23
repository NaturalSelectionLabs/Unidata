<template>
    <el-tree :data="data" :props="defaultProps" />
</template>

<script lang="ts" setup>
interface Tree {
    label?: string;
    children?: Tree[];
    id?: number;
}

const props = defineProps({
    obj: {
        type: Object,
        required: true,
    },
});

function labelObj(obj: any) {
    const data: Tree[] = [];
    for (let key in obj) {
        const child: Tree = {};
        if (typeof obj[key] === 'object') {
            child.label = `${key}: ${obj[key].constructor.name}`;
            child.children = labelObj(obj[key]);
        } else {
            child.label = `${key}: ${obj[key]}`;
        }
        data.push(child);
    }
    return data;
}

const data: Tree[] = labelObj(props.obj);

const defaultProps = {
    children: 'children',
    label: 'label',
};
</script>

<style>
.el-tree .el-tree__empty-block {
    height: auto;
}
</style>
