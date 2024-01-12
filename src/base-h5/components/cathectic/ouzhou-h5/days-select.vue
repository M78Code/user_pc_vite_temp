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
import { enum_time_type } from "src/core/bet-record/h5/util.js";

let showList = ref(false)
let _index = ref(2)
// 展示多长时间的注单记录  (1:今天 2:昨日 3:七日内 4:一月内)
const [day, yestoday, week, month] = i18n_t('bet_record.bet_date_list') || Array(4).fill('');
const [d, y, w, m] = enum_time_type; // [1, 2, 3, 4]
const list = ref([
    { title: day, val: d },
    { title: yestoday, val: y },
    { title: week, val: w },
    { title: month, val: m },
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
        background: #fff;
        padding: 0 0.1rem;
        box-shadow: 2px 2px 4px var(--q-gb-bg-c-9);
        li {
            font-size: 0.14rem;
            line-height: 2.5;
            text-wrap: nowrap;
            padding: 0 0.08rem;
            border-bottom: 1px solid var(--q-gb-bg-c-9);
            &:last-child {
                border-bottom: none;
            }
            &.active {
                color: var(--q-gb-bg-c-1);
            }
        }
    }
}
</style>