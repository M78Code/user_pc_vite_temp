<script setup name="score_child_4">
import {computed, onBeforeMount, watch} from "vue";
import {useRoute} from "vue-router"
import {score_format, MITT_TYPES, useMittEmit} from "src/output"

const route = useRoute()

const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})

// 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
const msc_array = ['S120', 'S121', 'S122'];     // 冰球比分: 第一节比分, 第二节比分, 第三节比分
const mmp_arr = ['1', '2', '3', '301', '302', '999'];       // mmp 冰球赛事阶段: 1第一节 2第二节 3第三节 301第一节休息, 302第二节休息
const mmp_arr1 = ["32", "40", "110", '999'];        // 加时赛阶段
const mmp_arr2 = ["34", "50", "120", '999'];     // 点球阶段

const init_event = function () {
    let msc = props.detail_data.msc;
    // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
    msc = lodash.sortBy(msc, (item) => {
        return +(item.split("|")[0]).substring(1)
    })
    let score_arr = [];
    // 循环只取出接口返回的比分里面符合冰球阶段的比分
    lodash.forEach(msc, (item, index) => {
        // S120 S121 S122 ...
        let num_index = item.split("|")[0];
        if (msc_array.includes(num_index)) {
            score_arr.push(item.split("|")[1]);
        }
    })
    return score_arr;
}
const get_extra_time = function () {
    let msc = props.detail_data.msc;
    let extra = "";
    lodash.forEach(msc, (item, index) => {
        let num_index = item.split("|")[0];
        if (num_index == "S7") {
            extra = item.split("|")[1];
        }
    })
    return extra;
}
const get_penalty_score = function () {
    let msc = props.detail_data.msc;
    let penalty = "";
    lodash.forEach(msc, (item, index) => {
        let num_index = item.split("|")[0];
        if (num_index == "S170") {
            penalty = item.split("|")[1];
        }
    })
    return penalty;
}
const validate_stage = function () {
    switch (props.detail_data.mmp) {
        case '301':  // 第一节结束  S121是第二节比分 0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
            break;
        case '2':    // 第二节开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
            break;
        case '302':  // 第二节结束  S122是第三节比分 0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
            break;
        case '3':    // 第三节开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
            break;
        case '34':   // 等待点球大战阶段 前端显示点球大战 S170是点球大战比分
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S170|0:0')
            break;
    }
}

const score_array = computed(() => {
    return init_event();
})
// msc S7 表示公共加时赛比分  冰球
const extraTime = computed(() => {
    return get_extra_time();
})
// msc S170	点球大战比分  冰球
const penaltyScore = computed(() => {
    return get_penalty_score();
})
const is_match_result = computed(() => {
    return route.name == 'result'
    return ['result_details', 'match_result'].includes(route.name)
})

onBeforeMount(() => {
    validate_stage()
})
watch(() => props.detail_data, (newValue, oldValue) => {
    switch (newValue.mmp) {
        case '301':  // 第一节结束  S121是第二节比分 0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
            break;
        case '2':    // 第二节开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
            break;
        case '302':  // 第二节结束  S122是第三节比分 0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
            break;
        case '3':    // 第三节开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
            break;
        case '34':   // 等待点球大战阶段 前端显示点球大战 S170是点球大战比分
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S170|0:0')
            break;
    }
}, {deep: true})
</script>

<template>
    <!-- 冰球 -->
    <!-- 可能会产生滚动，故用class  menu-s -->
    <ul class="score_child_4 font-style menu-s" v-if="mmp_arr.includes(detail_data.mmp) && !is_match_result">
        <li v-for="(item, key) of score_array" :key="key">
            <span>&ensp;</span>
            <span :class="{'active-text':(score_array.length == key + 1 && detail_data.mo != 1)}">
                  {{ score_format(item) }}
            </span>
            <span>&ensp;</span>
        </li>
    </ul>
    <ul class="score_child_4 font-style menu-s" v-if="mmp_arr1.includes(detail_data.mmp) || mmp_arr2.includes(detail_data.mmp)">
        <li v-for="(item, key) of score_array" :key="key">
            <span>&ensp;</span>
            <span>{{ score_format(item) }}</span>
            <span>&ensp;</span>
        </li>
                <!-- 加时赛比分展示 -->
        <li v-if="extraTime">
            <span>&ensp;</span>
            <span class="activeText">{{ i18n_t('match_info.ice_add') }}:{{ score_format(extraTime) }}</span>
            <span>&ensp;</span>
        </li>
        <!-- 点球比分展示 -->
        <li v-if="penaltyScore">
            <span>&ensp;</span>
            <span class="activeText">{{ i18n_t('match_info.shoot_out') }}:{{ score_format(penaltyScore) }}</span>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.score_child_4{
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
}
.font-style {
    font-size: 0.12rem;
    color: var(--q-gb-t-c-3);
    letter-spacing: 0;
}

.active-text {
    color: var(--q-gb-t-c-1);
}

.menu-s {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: auto;
    white-space: nowrap;
}
</style>
