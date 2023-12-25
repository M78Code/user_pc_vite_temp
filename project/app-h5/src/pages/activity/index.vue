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
/** 环境变量 */ 
const current_env = window.BUILDIN_CONFIG.CURRENT_ENV
// 活动访问地址暂时写死
const  acticity_src = ref('')
const  url = ref('')
//用户token
const  token = UserCtr.get_user_token()
//用户分组
const  gr = window.SEARCH_PARAMS.init_param.get('gr')?.toLocaleUpperCase()
// if (current_env == 'idc_online' || current_env == 'idc_ylcs') {
//     // 生产环境
//   url.value =  'http://front-test-100.dbsportxxx2li.com/activity'
// } else if (current_env == 'idc_sandbox') {
//     // 试玩环境
//   url.value = 'http://front-test-99.dbsportxxx2li.com/activity'
// }else if(current_env == 'idc_lspre'){
//   //隔离环境
//   url.value = 'http://front-test-98.dbsportxxx2li.com/activity'
// } else {
//     // 其他环境，测试和开发 等
//   url.value =  'http://test-topic.sportxxxifbdxm2.com/activity'
// }
url.value  = lodash.get(window, `BUILDIN_CONFIG.DOMAIN_RESULT.topic.activity`);
const  theme_value = ref('')
if(gr == 'Y'){
  theme_value.value = UserCtr.get_user_url_parames().replace("&theme=theme-1", '&theme=theme01_y0')
}else{
  theme_value.value =UserCtr.get_user_url_parames()
}
// 访问路由拼接 
const  acticity_src_url  = url.value  +'?'+ theme_value.value;
acticity_src.value = acticity_src_url
console.error(gr,'活动跳转',acticity_src);

</script>
<style lang="scss" scoped>

</style>
