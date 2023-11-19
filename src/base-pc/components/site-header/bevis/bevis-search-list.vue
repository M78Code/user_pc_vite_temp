<script setup name="bevis-search-list">
import {defineProps, defineEmits} from "vue"

import {IconWapper} from 'src/components/icon/index.js'

const props = defineProps({
    kind: {
        type: String,
        default: 'hot'
    },
    list: {
        type: Array,
        default: ()=> ({})
    }
})

const formatKind = function (kind){
    return {
        title: kind === 'hot' ? '热门搜索' : '历史记录',
        tips: kind === 'hot' ? '换一换' : '清空历史记录'
    }
}

const emits = defineEmits(['Search'])

const bindSearch = function ({ keyWord }){
    emits('Search', keyWord)
}

const bindDelete = function ({ keyword }){
    emits('Delete',keyword)
}
</script>

<template>
    <dl class="list">
        <dt>
            <p>{{ formatKind(kind).title }}</p>
            <p class="cursorPointer">{{ formatKind(kind).tips }}</p>
        </dt>
        <dd v-for="(item,index) of list" :key="item.id" class="cursorPointer" @click="bindSearch(item)">
            <p>{{ ++index }}&nbsp;&nbsp;{{ item?.keyWord ?? item?.keyword }}</p>
            <IconWapper v-if="kind === 'history'" name="icon-del" size="8px" @click="bindDelete(item)"></IconWapper>
        </dd>
    </dl>
</template>

<style scoped lang="scss">
.cursorPointer{
    cursor: pointer;
}
p{
    margin: 0;
    padding: 0;
}
.list {
    width: 100%;
    margin: 0;

    dt {
        width: 100%;
        height: 40px;
        font-size: 14px;
        color: var(--qq--theme-color-search-pnl);
        position: relative;
        padding-left: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        &:before {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 3px;
            height: 12px;
            background: #ff7000;
        }
    }

    dd {
        margin-left: 10px;
        height: 30px;
        line-height: 30px;

        display: flex;
        align-items: center;
        justify-content: space-between;
        &:hover {
            color: #ff7000;
        }
    }
}
</style>