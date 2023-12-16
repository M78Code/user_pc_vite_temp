<!--
 * @Author:
 * @Date: 2023-12-16
 * @Description: 活动内容 主页面
-->
<template>
    <div class="acticity-content" >
      <iframe style="width:100%;height: 1000px" allow="autoplay" frameborder="0" scrolling="no" :src="acticity_src" ></iframe>
  </div>
</template>


<script setup>
import { ref,nextTick } from "vue";
import UserCtr from "src/core/user-config/user-ctr.js";
// 活动访问地址暂时写死
const  acticity_src = ref('')
//用户token
const  token = UserCtr.get_user_token()
//用户分组
const  gr = window.SEARCH_PARAMS.init_param.get('gr')?.toLocaleUpperCase()
    
// 访问路由拼接 
const  url  = 'http://test-topic.sportxxxifbdxm2.com/activity' +'?gr='+gr+'&token='+token
acticity_src.value = url
</script>
<style lang="scss" scoped>


</style>
