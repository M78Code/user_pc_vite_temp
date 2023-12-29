<script setup name="score_child_7">
import {score_format, MITT_TYPES, useMittEmit} from "src/output"
import {reactive, watch, computed} from "vue";

const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})
const state = reactive({
    msc_array: [],      // 斯诺克比分集合
})

const initEvent = function () {
    state.msc_array = []
    for (let i = 120; i <= 159; i++) {
        state.msc_array.push(`S${i}`);
    }
    let msc = props.detail_data.msc;
    // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
    msc = lodash.sortBy(msc, (item) => {
        return +(item.split("|")[0]).substring(1)
    })
    let score_arr = [];
    lodash.forEach(msc, (item, index) => {
        let num_index = item.split("|")[0];
        if (state.msc_array.includes(num_index)) {
            score_arr.push(item.split("|")[1]);
        }
    })
    return score_arr;
}

const validateStage = function () {
    if (props.detail_data.mmp == '445') {
        let msc = props.detail_data.msc;
        // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
        msc = lodash.sortBy(msc, (item) => {
            return +(item.split("|")[0]).substring(1)
        })
        try {
            if (msc && Array.isArray(msc)) {
                const len = msc.length - 1
                let middle_number = Number((msc[len].split("|")[0]).substring(1)) + 1;
                useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, `S${middle_number}|0:0`);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

const score_array = computed(() => {
    return initEvent()
})


validateStage()

watch(props.detail_data, (newValue, oldValue) => {
    if (newValue.mmp == '445') {
        let msc = newValue.msc;
        // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
        msc = lodash.sortBy(msc, (item) => {
            return +(item.split("|")[0]).substring(1)
        })
        try {
            if (msc && Array.isArray(msc)) {
                const len = msc.length - 1
                let middle_number = Number((msc[len].split("|")[0]).substring(1)) + 1;
                useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, `S${middle_number}|0:0`);
            }
        } catch (error) {
            console.error(error);
        }
    }
}, {deep: true})
</script>

<!-- 斯诺克 -->
<template>
    <ul class='score_child_7 mx-12 font-style menu-s' v-if="score_array">
        <li v-for="(item, key) of score_array" :key="key">
            <span>&nbsp;</span>
            <span :class="(score_array.length == key + 1&&detail_data.mo != 1)? 'activeText': '' ">
                {{ score_format(item) }}
            </span>
            <span>&nbsp;</span>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.score_child_7 {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
}

.font-style {
    color: var(--q-gb-t-c-3);
    letter-spacing: 0;
    font:{
        size: .14rem;
        weight: bold;
    }
}

.activeText {
    color: var(--q-gb-t-c-1);
}

.menu-s {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: auto;
    white-space: nowrap;
}
</style>
