<!--
 * @Author: Supermark
 * @Date: 2020-09-16 16:19:05
 * @Description: 详情页显示棒球赛事第几节以及赛事时间
-->
<template>
  <!-- 棒球 -->
  <span class='stage_child_3'>
    <!-- 棒球赛事阶段 -->
    {{match_period_map}}
  </span>
</template>

<script>
// import msc from "src/public/mixins/common/msc.js";

export default {
  // mixins: [msc],
  name: 'stage_child_3',
  props: ["detail_data"],
  computed:{
    /**
     *@description mmp映射赛事阶段名，国际化语言
     *@param {Undefined}  
     *@return {Srting} 赛事阶段 mmp的详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
     */
    match_period_map(){      
      let {mmp,ms} = this.detail_data;
      let r = '';
      try{
        // ms: 0:未开始 1:进行中 2:暂停 3:结束 4:关闭
        // mmp: 0:未开赛
        // csid: 1:足球 2:篮球 3:棒球 4:冰球 5:网球 6:美式足球 7:斯诺克 8:兵乓球 9:排球 10:羽毛球
        
        // 从语言包里取数据文本
        r = i18n_t('mmp')[3][mmp];
        if(this.detail_data.mmp == 0 && this.detail_data.ms == 1){
          r = i18n_t('mmp')[3][401];
        }
      }catch(e){console.error(e)}
      return r;
    }
  }
}
</script>

<style lang="scss" scoped></style>
