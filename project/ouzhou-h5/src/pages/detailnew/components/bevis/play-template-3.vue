<!-- ms: 0开 1封 2关 11锁 -->
<!-- hs: 0开 1封 2关 11锁 -->
<!-- os: 1开 2封 3隐藏不显示不占地方-->
<!-- 按ol循环，不考虑按tittle循环-->
<script setup name="play-template-3">
import BetData from "src/core/bet/class/bet-data-class.js";
import {computed, defineProps} from "vue";
import olStatus from "../ol_status.vue";
import {odd_lock_ouzhou} from "src/base-h5/core/utils/local-image.js";
import {compute_value_by_cur_odd_type, MatchDetailCalss} from "src/core/index.js"

const props = defineProps({
    item_data: {
        type: Object,
        default: () => ({}),
    },
    active: {
        type: Number,
        default: () => 0,
    },
    sport_id: {
        type: [String, Number],
        default: ''
    },
})
const emits = defineEmits(["bet_click_"]);
const go_betting = (data) => {
    if (data.os == 2) return
    emits("bet_click_", data, props.item_data.hpn);
}
const AssembleData = computed(()=>{
    let information = {
        others: [],
        assemble: [],
        title: []
    }
    let { title,hl } = props.item_data
    const assemble = hl[0].ol.filter(i=>i.os != 3)
    return []
})
</script>
<template>
    <section class="template3" v-if="item_data?.hl[0]?.ol">
        <ul v-for="item of AssembleData" :key="item?.id">
            <li></li>
        </ul>
    </section>
</template>

<style lang="scss" scoped>
.template3{
    overflow: hidden;
    padding: 8px;
    box-sizing: border-box;
}

.lock {
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
}
</style>
