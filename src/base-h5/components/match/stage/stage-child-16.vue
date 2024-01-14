<template>
    <!-- 水球 -->
    <div className="stage_child_16">
        <span v-if="detail_data.mmp === 110">{{ i18n_t(`ms[${detail_data.ms}]`) }}</span>
        <span v-else>{{ i18n_t('mmp')[16][detail_data.mmp] }}</span>

        <!-- 四节休息阶段显示每节总时间 -->
        <span v-if="mmp_arr1.includes(detail_data.mmp)">{{ detail_data.mlet }}</span>

        <!-- 四节比赛阶段显示计时器 -->
        <span v-if="!mmp_arr1.includes(detail_data.mmp) && showTime > 0">
            &nbsp;&nbsp;
            <span v-if="showTime > 0">
                <span v-html="i18n_t('detail.less')"></span>{{ showTime | format_min_time }}{{ i18n_t("detail.mins") }}
            </span>
        </span>
    </div>
</template>

<script setup>
import {MITT_TYPES, useMittEmit} from "src/core/mitt/index.js";
import {ref, watchEffect} from "vue"

const props = defineProps(["detail_data", "dialog"]);

let showTimeInterval;
const mmp_arr1 = ['301', '302', '303'];
const mmp_arr = ['13', '14', '15', '16']

const showTime = ref('')


const initRestTime = (num) => {
    clearInterval(showTimeInterval)

    if (mmp_arr1.includes(props.detail_data.mmp)) {
        showTime.value = (props.detail_data.mlet.split(":")[0] === '8' || props.detail_data.mle === '0') ? 480 : '';
        savePageTime();
    } else if (mmp_arr.includes(props.detail_data.mmp)) {
        calculagraph(num);
    }
}

const calculagraph = (num) => {
    showTime.value = Number(props.detail_data.mst) - Number(num);
    savePageTime();
    showTimeInterval = setInterval(() => {
        if (showTime.value <= 0) {
            clearInterval(showTimeInterval);
            showTime.value = 0;
        } else {
            showTime.value -= 1;
        }
        savePageTime();
    }, 1000);
}

const savePageTime = () => {
    if (props.dialog) return;
    useMittEmit(MITT_TYPES.EMIT_SET_MATCH_TIME, Number(showTime.value));
}

const clearTimeObj = () => {
    if (showTimeInterval) {
        clearInterval(showTimeInterval);
        showTimeInterval = null;
    }
}

watchEffect(() => {
    if (mmp_arr.includes(props.detail_data.mmp)) {
        if (props.detail_data.mess === '0') {
            let num = 0;
            if (props.detail_data.c_time) {
                num = (new Date().getTime() - props.detail_data.c_time) / 1000;
            }
            clearTimeObj();
        } else if (props.detail_data.mess === '1') {
            let num = 0;
            if (props.detail_data.c_time) {
                num = (new Date().getTime() - props.detail_data.c_time) / 1000;
            }
            initRestTime(num);
        }
    } else {
        initRestTime(0);
    }
});
</script>

<style lang="scss" scoped></style>