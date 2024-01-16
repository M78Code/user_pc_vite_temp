<!--
 * @Author: Supermark
 * @Date: 2020-07-14 17:46:47
 * @Description: 详情页显示斯诺克赛事第几节以及赛事时间
-->
<template>
<!-- 斯诺克 -->
  <span class='stage_child_7'>
    <!-- 斯诺克赛事阶段 -->
    {{match_period_map}}
  </span>
</template>

<script>
// import { mapGetters } from "vuex"
// import msc from "src/public/mixins/common/msc.js";
import { numberToChinese } from 'src/output/index.js';
import UserCtr from "src/core/user-config/user-ctr.js";
export default {
  // mixins: [msc],
  name: 'stage_child_7',
  props: ["detail_data"],
  computed:{
    /**
     *@description mmp映射赛事阶段名，国际化语言
     *@param {Undefined}  
     *@return {Srting} 赛事阶段 mmp的详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
     */
    match_period_map(){      
      let {mmp,ms,mct} = this.detail_data;
      let r = '';
      try{
        // ms: 0:未开始 1:进行中 2:暂停 3:结束 4:关闭
        // mmp: 0:未开赛
        // csid: 1:足球 2:篮球 5:网球 7:斯诺克 8:兵乓球 10:羽毛球
        
        // 前端做兼容处理 在赛事阶段:未开赛 赛事状态:进行中 的时候默认显示第一局
        if(this.detail_data.mmp == 0 && this.detail_data.ms == 1){
          mct = 1;
        }
        let new_num = mct;        
        if(['zh', 'hk'].includes(UserCtr.lang)){      
          new_num = numberToChinese(mct);
        }
        let game_count = i18n_t("mmp.7.x");
        r = game_count.replace('%s',new_num);

        // 前端做兼容处理 在赛事阶段:未开赛 赛事状态:进行中 的时候默认显示第一局
        // if(this.detail_data.mmp == 0 && this.detail_data.ms == 1){
        //   const first_mct = 1;
        //   let n_mct = first_mct;
        //   if(UserCtr.lang == 'zh'){
        //     n_mct = numberToChinese(first_mct)
        //   }
        //   r = game_count.replace('%s',new_num);
        // }
      }catch(e){console.error(e)}
      return r;
    }
  }
}
</script>

<style lang="scss" scoped></style>