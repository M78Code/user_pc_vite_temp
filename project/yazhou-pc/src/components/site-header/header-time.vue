<!-- @Description: 站点页眉-->
<template>
    <div class="show-date yb-family-odds">
        <div class="date-item">
            <!-- 日期时间 -->
            <span class="date-time">{{ date_time }}</span>
            <!-- 时区 -->
            <span class="time-zone">(GMT+8)</span>
        </div>
    </div>
</template>
  

<script setup>
import { onMounted, onUnmounted, ref, defineComponent } from 'vue'
import { useMittOn } from 'src/core/mitt/index.js'
import * as MITT_TYPES from 'project_path/src/core/mitt/mitt-keys.js'
// import { mx_get_remote_time, utc_to_gmt_no_8_ms2 } from "src/core/formart/module/format-date.js";

/** 日期时间 */
const date_time = ref('')
/** 初始化时间戳 */
const time_local = ref(0)
const time = ref({
    local_time: 0,
    remote_time: 0
})

/** 获取系统时间 = 日期时间 */
function get_date_time() {
    // time.value = mx_get_remote_time();
    time_local.value = new Date().getTime();
    // date_time.value = utc_to_gmt_no_8_ms2(time.value);
}
/** 钩子触发 */
onMounted(get_date_time)

/** 更新当前时间显示 */
function set_date_time(data) {
    const now_ = new Date().getTime();
    // date_time.value = utc_to_gmt_no_8_ms2(time.value + (now_ - time_local.value) + (now_ - data.time));
}
/** 监听和销毁 页面右上角服务器时间展示 */
// const { off: off_set_date_time } = useMittOn(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD, set_date_time)
/** 销毁事件 */
// onUnmounted(() => off_set_date_time(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD))
</script >

<script>
export default defineComponent({
    name: 'header-time',
})
</script>
  
<style lang="scss">
.show-date-wrap {
    width: 200px;
    height: 60px;
    margin-right: 18px;

    .show-date {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 90;
        width: 200px;
        text-align: right;
        line-height: 60px;
        height: 60px;
    }
}
</style>
  