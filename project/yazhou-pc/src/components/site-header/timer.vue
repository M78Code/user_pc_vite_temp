<!--
 * @Description: 定时器组件
-->
<template>
    <div class="test-info" v-if="is_test">
        {{ time_str }}
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount, defineComponent, getCurrentInstance, onMounted } from 'vue'
import { ss } from "src/core/utils/web-storage";
// import menu_stay_time from "src/public/utils/menuClass/menu_stay_time.js"
import { useMittEmit } from 'src/core/mitt/index.js'
import * as MITT_TYPES from 'project_path/src/core/mitt/mitt-keys.js'

/** 时间 */
const time_str = ref('')
/** 是否调试 */
const is_test = ref(ss.get('wsl'))
/** 定时器 */
const upd_time_refresh_timer = ref(null)
/** 清除定时器 */
function clear_upd_time_refresh_timer() {
    if (upd_time_refresh_timer.value) {
        clearInterval(upd_time_refresh_timer.value)
        upd_time_refresh_timer.value = null
    }
}
/** 钩子触发 */
onBeforeUnmount(clear_upd_time_refresh_timer)

/** 定时器2 */
const timer = ref(null)
/** 清除定时器 */
function clear_timer() {
    if (timer.value) {
        clearInterval(timer.value)
        timer.value = null
    }
}
/** 钩子触发 */
onBeforeUnmount(clear_timer)

/** 获取mixins */
const { proxy } = getCurrentInstance()

/** 初始化 */
function init() {
    // 全局一秒钟定时器
    upd_time_refresh_timer.value = setInterval(global_one_second_timer, 1000);
    if (is_test.value) {
        timer.value = setInterval(set_time_str, 100);
    }
}
onMounted(init)

/**
 * @Description 全局一秒钟定时器 
 * @param {undefined} undefined
*/
function global_one_second_timer() {
    // this.$root.$emit(this.emit_cmd.EMIT_UPD_TIME_REFRESH_CMD,{time:new Date().getTime(), step:1000});
    /** 广播事件 */
    useMittEmit(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD, { time: new Date().getTime() })
    // 统计各个菜单停留时间 每秒执行一次
    // proxy.statistical_stay_time()
}
/**
 * @Description 设置时间 
 * @param {undefined} undefined
*/
function set_time_str() {
    time_str.value = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
}

</script>
<script>
export default defineComponent({
    name: 'timer',
    // mixins: [menu_stay_time]
})
</script>
  
<style lang="scss" scoped>
.test-info {
    position: fixed;
    top: 20px;
    left: 50%;
    width: 250px;
    color: red;
    z-index: 9999999;
    font-size: 20px;
    transform: translateX(100px);
}
</style>
  