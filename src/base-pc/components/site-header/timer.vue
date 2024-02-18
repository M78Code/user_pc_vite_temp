<!--
 * @Description: 定时器组件
-->
<template>
    <div class="test-info" v-if="is_test">
        {{ time_str }}
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount, getCurrentInstance, onMounted } from 'vue'
import { SessionStorage } from "src/output/module/constant-utils.js";
// import menu_stay_time from "/utils/menuClass/menu_stay_time.js"

/** 时间 */
const time_str = ref('')
/** 是否调试 */
const is_test = ref(SessionStorage.get('wsl'))

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

/** 初始化 */
function init() {
    // 全局一秒钟定时器
    if (is_test.value) {
        // timer.value = setInterval(set_time_str, 100);
    }
}
onMounted(init)

/**
 * @Description 全局一秒钟定时器 
 * @param {undefined} undefined
*/
function global_one_second_timer() {
    // TODO: menu_stay_time.js
    // proxy.statistical_stay_time()
}
/**
 * @Description 设置时间 
 * @param {undefined} undefined
*/
function set_time_str() {
    time_str.value = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
}

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
  src/core/utils/common/index.js