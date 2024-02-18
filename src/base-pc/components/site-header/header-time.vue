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
import { get_remote_time, utc_to_gmt_no_8_ms2 } from "src/output/index.js"

/** 日期时间 */
const date_time = ref('')

const timer_id = ref(null)
onUnmounted(() => {
    if (timer_id.value) {
        clearInterval(timer_id.value)
        timer_id.value = null
    }
})

/**
 * @Description:获取当前系统时间
 * @return {undefined} undefined
 */
function get_date_time() {
    let time = get_remote_time();
    date_time.value = utc_to_gmt_no_8_ms2(time);
    timer_id.value = setInterval(() => {
        time += 1000;
        date_time.value = utc_to_gmt_no_8_ms2(time);
    }, 1000);
}
onMounted(get_date_time)

</script>

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
  src/core/format/common/module/format-date.js