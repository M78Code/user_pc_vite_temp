<template>
    <div class="c-simple-header">
        <div v-if="is_hide_icon" class="icon-layout"></div>
        <div v-else class="rule-logo">
            <div class="img-logo custom-format-img-logo-01"></div>
            <img src="" alt="">
        </div>
        <div class="head-info">
            <div class="rule-title">
                <slot />
            </div>
            <div class="systime">
                <div class="refresh" v-if="current_route_name == 'match_results'">
                    <refresh :loaded="data_loaded" @click="on_refresh()" />
                </div>
                <span>{{ date_time }} (GMT+8)</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router';
// TODO: mixins待处理
import time_format_mixin from "src/public/mixins/common/time_format";
// TODO: 待处理组件
import refresh from "src/public/components/refresh/refresh.vue";

const props = defineProps({
    /** 刷新按钮动画开关 */
    data_loaded: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['refresh'])
/** 赛果刷新当前数据 */
const on_refresh = () => emits("refresh")

/** 当前路径的名字 */
const { name: current_route_name } = useRoute()

/** 是否展示图标 */
const is_hide_icon = ref(false)

/** 版本号 */
const version_name = window.env.config.DEFAULT_VERSION_NAME

/** 定时器集合 */
const timeout_obj = ref({})
/** 清除定时器 */
const clear_time = () => {
    try {
        for (const key in timeout_obj.value) {
            clearTimeout(timeout_obj[key])
            clearInterval(timeout_obj[key])
        }
    } catch (error) {
        console.log('clear_time error', error);
    } finally {
        timeout_obj.value = {}
    }
}
/** 钩子触发 */
onUnmounted(clear_time)

/** 当前系统时间 */
const date_time = ref('')
/** 获取当前系统时间 */
const get_date_time = () => {
    // TODO: 待处理mixins函数
    let time = this.mx_get_remote_time();
    date_time.value = this.utc_to_gmt_no_8_ms2(time);
    timeout_obj.value.timer1 = setInterval(() => {
        time += 1000;
        date_time.value = this.utc_to_gmt_no_8_ms2(time);
    }, 1000);
}
/** 钩子触发 */
onMounted(get_date_time)

</script>

  
<style lang="scss" scoped>
.c-simple-header {
    display: flex;
    padding: 0 20px 0 15px;
    height: 61px;
    min-height: 61px;
    /*  必须用min-height；兼容IE */
    align-items: center;
    text-transform: uppercase;

    .rule-logo {
        margin-right: 33.3px;
        height: 100%;

        .img-logo {
            width: 130px;
            height: 100%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
        }
    }
}

.head-info {
    display: flex;
    justify-content: space-between;
    flex: 1;

    .rule-title {
        font-size: 12px;
    }

    .systime {
        min-width: 96px;
        font-size: 12px;
        display: flex;
        align-items: center;

        .refresh {
            width: 20px;
            height: 20px;
            margin-right: 5px;
            cursor: pointer;
        }
    }
}
</style>
  