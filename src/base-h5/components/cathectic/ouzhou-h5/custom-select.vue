<template>
    <div class="fliter">
        <span class="show-val" @click.stop="showList = true">
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
import { enum_time_type, enum_order_by } from "src/core/bet-record/h5/util.js";

const props = defineProps({
    type: {  // 'date', 'order'
        type: String,
        default: ''
    },
    init_index: {
        type: Number,
        default: 0
    }
})

let showList = ref(false)
let _index = ref(0)
let list = ref([])

// 展示多长时间的注单记录  (1:今天 2:昨日 3:七日内 4:一月内)
const [day, yestoday, week, month] = i18n_t('bet_record.bet_date_list') || Array(4).fill('');
const [d, y, w, m] = enum_time_type; // [1, 2, 3, 4]
const dateList = [
    { title: day, val: d },
    { title: yestoday, val: y },
    { title: week, val: w },
    { title: month, val: m },
]

// 按什么排序  1-投注时间  2-默认排序（结算时间）  3-开赛时间
const orderList = [
{ title: i18n_t('bet_record.sort0'), val: 2 },
{ title: i18n_t('bet_record.bet_time'), val: 1 },
{ title: i18n_t('bet_record.sort2'), val: 3 },
]

// 初始值
_index.value = props.init_index;
list.value = props.type === 'date' ? dateList : orderList

const emit = defineEmits(['changeSelect'])
const change = (index) => {
    _index.value = index
    showList.value = false
    emit('changeSelect', list.value[index].val)
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
    margin-right: 0.1rem;
    line-height: 0.46rem;
    height: 0.5rem;
    font-size: 0.14rem;
    position: relative;
    .show-val {
        background-color: var(--q-gb-bg-c-5);
        padding: 0.1rem;
        border-radius: 0.5rem;
    }
    i {
        font-size: 0.2rem;
    }

    ul {
        position: absolute;
        z-index: 10;
        left: 0;
        top: 0.5rem;
        background: #fff;
        padding: 0 0.1rem;
        box-shadow: 2px 2px 4px var(--q-gb-bg-c-9);
        border-radius: 0.04rem;
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