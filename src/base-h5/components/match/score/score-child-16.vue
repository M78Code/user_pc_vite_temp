<!--
 * @Author: Supermark
 * @Date: 2021-08-14 15:52:40
 * @Description: 详情页水球比分展示子组件
-->
<template>
<!-- 水球 -->
  <div class='stage_child_16 mx-12 font-style'>
    <!-- 常规4节比赛 -->
    <!-- mmp （13 第一节）（14 301 第二节）（15 302 第三节）（16 303 第四节） -->
    <template v-if="model_a.includes(detail_data.mmp) && detail_data.mo != 1">
      <span v-for="(item, key) of score_array" :key="key">
        <span>&nbsp;&nbsp;</span>
        <span :class="score_array.length == key + 1 ? 'active-text': '' "><span style="letter-spacing: 0.01rem">{{ $filters.score_format(item)}}</span></span>
      </span>
    </template>
    <!-- 水球点球比分展示 -->
    <template v-if="model_b.includes(detail_data.mmp)">
      <!-- 常规4节比分 -->
      <span v-for="(item, key) of score_array" :key="key">
        <span>&ensp;</span>
        <span>{{ $filters.score_format(item)}}</span>
        <span>&ensp;</span>
      </span>
      <span v-if="penaltyScore">
        <span>&ensp;</span>
        <span>{{i18n_t('match_info.shoot_out')}}:&nbsp;<span class="active-text">{{ $filters.score_format(penaltyScore)}}</span></span>
      </span>
    </template>
  </div>
</template>

<script>
// import { mapGetters } from "vuex"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
export default {
  name: 'stage_child_16',
  data(){
    return {
      // 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
      // 常规4节比赛
      model_a:['13', '14', '15', '16', '301', '302', '303','999'],
      // 常规4节比赛的比分
      msc_array:['S19','S20','S21','S22'],
      // 点球阶段
      model_b:["34","50","120",'100','999']
    }
  },
  computed: {
    // 菜单是赛果get_menu_type == 28
    // ...mapGetters(['get_menu_type']),
    // 比分集合
    score_array(){
      return this.initEvent();
    },
    // msc S170	点球大战比分  水球
    penaltyScore(){
      return this.get_penalty_score();
    },
  },
  watch: {
    detail_data:{
      handler(n, o){
        switch( n.mmp ){
          case "301": //301 第一节结束 S20 第二节比分(水球)
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S20|0:0')
            break;
          case "302": //302 第二节结束 S21 第三节比分(水球)
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S21|0:0')
            break;
          case "303": //303 第三节结束 S22 第四节比分(水球)
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S22|0:0')
            break;
          case "34":  //等待点球大战阶段 前端显示点球大战 S170是点球大战比分
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S170|0:0')
            break;
        }
      },
      deep: true,
    }
  },
  props: ['detail_data'],
  created(){
    this.validateStage();
  },
  methods: {
    /**
     *@description 水球比分集合
     *@param {Undefined}
     *@return {Array} 水球比分
     */
    initEvent(){
      let msc = this.detail_data.msc;
      // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
      msc = lodash.sortBy( msc, (item) => {
        return +(item.split("|")[0]).substring(1)
      })
      let score_arr = [];
      // 循环只取出接口返回的比分里面符合水球球阶段的比分
      lodash.forEach(msc, (item, index)=>{
        let num_index = item.split("|")[0];
        if(this.msc_array.includes(num_index)){
          score_arr.push(item.split("|")[1]);
        }
      })
      return score_arr;
    },
    /**
     *@description: 获取点球大战的比分
     *@param {Undefined}
     *@return {Undefined} 点球大战比分
     */
    get_penalty_score(){
      let msc = this.detail_data.msc;
      let penalty = "";
      lodash.forEach(msc,(item)=>{
        let num_index = item.split("|")[0];
        if(num_index == "S170"){
          penalty = item.split("|")[1];
        }
      })
      return penalty;
    },
    /**
     *@description 根据赛事阶段显示默认的比分
     *@param {Undefined}
     *@return {Undefined}
     */
    validateStage(){
      switch( this.detail_data.mmp ){
        case "301": //301 第一节结束   S20 第二节比分(水球)
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S20|0:0')
          break;
        case "302": //302 第二节结束 S21 第三节比分(水球)
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S21|0:0')
          break;
        case "303": //303  第三节结束 S22 第四节比分(水球)
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S22|0:0')
          break;
        case "34":  //等待点球大战阶段 前端显示点球大战 S170是点球大战比分
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S170|0:0')
          break;
      }
    }
  },
}
</script>

<style lang="scss" scoped>
/*************** 字体样式 *************** -S*/
.font-style {
  font-size: 0.12rem;
  color: #FFFFFF;
  letter-spacing: 0;
}

/*************** 字体样式 *************** -E*/
/*************** 当前比分字体颜色 *************** -S*/
.active-text {
  color: #ffce63;
}

/*************** 当前比分字体颜色 *************** -E*/
</style>