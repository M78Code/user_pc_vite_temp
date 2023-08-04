<!--
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-08-02 13:35:14
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-08-04 14:28:06
 * @FilePath       : \user-pc-vite\project\yazhou-pc\App.vue
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: jiffy
 * @Date: 2023-08-01 18:37:50
 * @LastEditTime: 2023-08-04 10:41:02
 * @LastEditors: jiffy
 * @Description: 说明
 *  
-->
<template>
  <div>  
      <MainLayOut />  
    <!-- <h1>客户端模块化+SDK版本</h1>
    <img src="images/tes.png" alt="" /> -->
  </div>
</template>

<script setup>
import { onMounted,ref } from "vue";
import MainLayOut from "src/pages/main_layout.vue"
// 页面显示
// const show_router = ref(false)


onMounted(() => {
  // document.querySelector("#loading-root-ele").style.display = "none";
});
</script>

<style lang="scss" scoped>
</style>