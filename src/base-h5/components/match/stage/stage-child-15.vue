<script setup>
import {ref, watch, onMounted, onBeforeUnmount} from 'vue';
import {useMittOn, MITT_TYPES, useMittEmit} from 'src/core/mitt/index.js';

const props = defineProps(["detail_data", "dialog"]);

const mmp_arr_base = ['6', '7', '13', '14', '15', '16', '40', '440', '301', '302', '303', '31', '100'];
const mmp_arr = ['6', '7', '13', '14', '15', '16', '40', '21'];
const mmp_arr1 = ['301', '302', '303', '31'];
const showTime = ref('');
let showTimeInterval;

const clearTimeObj = () => {
    if (showTimeInterval) {
        clearInterval(showTimeInterval);
        showTimeInterval = null;
    }
};

const savePageTime = () => {
    if (props.dialog) return;
    useMittEmit(MITT_TYPES.EMIT_SET_MATCH_TIME, Number(showTime.value));
};

const initRestTime = (num) => {
    clearTimeObj();
    if (mmp_arr1.includes(props.detail_data.mmp)) {
        showTime.value = (props.detail_data.mlet === '0' || props.detail_data.mle === '0') ? 900 : '';
        savePageTime();
    } else if (mmp_arr.includes(props.detail_data.mmp)) {
        calculagraph(num);
    }
};

const calculagraph = (num) => {
    showTime.value = Number(props.detail_data.mst) - Number(num);
    savePageTime();
    showTimeInterval = setInterval(() => {
        if (showTime.value <= 0) {
            clearInterval(showTimeInterval.value);
            showTime.value = 0;
        } else {
            showTime.value -= 1;
        }
        savePageTime();
    }, 1000);
};

const initEvent = () => {
    if (props.detail_data.mess === 0 && props.detail_data.cmec === "time_start" && !mmp_arr1.includes(props.detail_data.mmp)) {
        showTime.value = Number(props.detail_data.mst);
        savePageTime();
    } else {
        initRestTime(0);
    }
};

watch(() => props.detail_data, (newDetail, oldDetail) => {
    const {mmp, mess, c_time} = newDetail;
    const num = c_time ? (new Date().getTime() - c_time) / 1000 : 0;

    if (mmp_arr.includes(mmp)) {
        if (mess === '0') {
            clearTimeObj();
        } else if (mess === '1') {
            initRestTime(num);
        }
    } else {
        initRestTime(0);
    }
}, {deep: true});

onMounted(() => {
    initEvent();
});

onBeforeUnmount(() => {
    clearTimeObj();
});
</script>

<template>
    <!-- 曲棍球 -->
    <div class="stage_child_15">
        <span v-if="detail_data.ms == 110">{{ i18n_t(`ms[${detail_data.ms}]`) }}</span>
        <span v-else>{{ i18n_t('mmp')[15][detail_data.mmp] }}</span>
        <!-- 计时器 -->
        <span v-if="mmp_arr_base.includes(detail_data.mmp) && showTime >= 0">
            &nbsp;&nbsp;
            <span v-if="showTime >= 0">{{ $filters.format_mgt_time(showTime) }}</span>
        </span>
    </div>
</template>
