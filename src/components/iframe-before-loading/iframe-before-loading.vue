/*
 * @Description: 域名预加载逻辑组件
 */
<template>
  <div>
    <!-- 视频js预加载 -->
    <iframe v-if="data.video_src" style="display:none;" :src="data.video_src"></iframe>
    <iframe v-if="data.animation_src" style="display:none;" :src="data.animation_src"></iframe>
    <iframe v-if="data.activity_src" style="display:none;" :src="data.activity_src"></iframe>
    <iframe v-if="data.rules_src" style="display:none;" :src="data.rules_src"></iframe>
  </div>
</template>
<script setup>
import {reactive,onMounted,onUnmounted} from 'vue'
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import UserCtr from 'src/core/user-config/user-ctr.js'
let mitt_list = [];
let load_video_js_timer = {};
let run_timer = 0;
// 预加载数据
const data = reactive({
  video_src:'',
  animation_src:'',
  activity_src:'',
  rules_src:'',
});
/**
 * @Description 设置视频预加载地址
 * @param {undefined} undefined
*/
function iframe_before_loading(obj){
  if(obj){
    Object.assign(data, obj)
  // 延迟10s销毁预加载iframe
    for (const key in data) {
      const val = data[key];
      if(val){
        if (load_video_js_timer[key]) {clearTimeout(load_video_js_timer[key])};
        load_video_js_timer[key] = setTimeout(() => {
          data[key]='';
        },10000)
      }
    }
  }
}

/**
 * @Description 注意页面加载完成通知
 * @param {undefined} undefined
*/
function iframe_loading(data){
  if(data==0){
    clearTimeout(run_timer);
    run_timer = setTimeout(() => {
      const topic_obj = window.SEARCH_PARAMS.get_topic();
      iframe_before_loading({
        activity_src: UserCtr.get_topic_key_url('activity'),
        rules_src: UserCtr.get_topic_key_url('sports_rules')
      })
    }, 10000);
  }
}
onMounted(() => {
  mitt_list=[
    useMittOn(MITT_TYPES.EMIT_CHANGE_SEARCH_FILTER_SHOW, iframe_before_loading).off,
    useMittOn(MITT_TYPES.EMIT_LOADING_CTR_CMD, iframe_loading).off
  ];
})
onUnmounted(()=>{
  // 初始化数据
  for (const key in data) {
    data[key]=0;
  }
  // 清除延时器
  for (const key in load_video_js_timer) {
    clearTimeout(load_video_js_timer);
  }
  clearTimeout(run_timer);
  // 销毁监听
  mitt_list.forEach(i=>i&&i())
})
</script>
<style scoped lang="scss">
</style>