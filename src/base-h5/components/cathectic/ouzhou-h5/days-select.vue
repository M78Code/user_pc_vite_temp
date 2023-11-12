<template>
    <div class="fliter">
        <span @click.stop="showList = true">
            {{ list[_index].title }}
            <icon-wapper name="icon-triangle1" />
        </span>
        <q-slide-transition>
            <ul v-if="showList" @click.stop>
                <li v-for="(item, index) in list" :key="index" :class="{'active': index === _index}" @click="change(index)">{{ item.title }}</li>
            </ul>
        </q-slide-transition>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { IconWapper } from 'src/components/icon'
import { i18n_t } from "src/boot/i18n.js";
let showList = ref(false)
let _index = ref(0)
// 展示多长时间的注单记录  (1:今天 2:昨日 3:七日内 4:一月内)
const [day, yestoday, week, month] = i18n_t('bet_record.bet_date_list');
const list = ref([
    { title: day, val: 1 },
    { title: yestoday, val: 2 },
    { title: week, val: 3 },
    { title: month, val: 4 },
])

const emit = defineEmits(['changeDays'])
const change = (index) => {
    _index.value = index
    showList.value = false
    emit('changeDays', list.value[index].val)
}

const close = () => {
    showList.value = false
}

onMounted(() => {
    document.addEventListener('click', close, true)
})
onUnmounted(() => {
    document.removeEventListener('click', close, true)
})
</script>
<style lang="scss" scoped>
.fliter {
    margin-left: 0.1rem;
    line-height: 0.46rem;
    height: 0.5rem;
    font-size: 0.16rem;
    position: relative;

    i {
        font-size: 0.2rem;
    }

    ul {
        position: absolute;
        z-index: 10;
        left: -0.1rem;
        top: 0.5rem;
        background: var(--q-gb-bg-c-15);
        padding: 0 0.1rem;
        box-shadow: 2px 2px 4px var(--q-gb-bg-c-8);
        li {
            font-size: 0.14rem;
            line-height: 2.5;
            text-wrap: nowrap;
            padding: 0 0.08rem;
            border-bottom: 1px solid var(--q-gb-bg-c-11);
            &:last-child {
                border-bottom: none;
            }
            &.active {
                color: var(--q-gb-bg-c-12);
            }
        }
    }
}
</style>