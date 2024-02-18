<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页橄榄球比分展示子组件
-->
<template>
  <div class='score_child_14 row mx-12 font-style'>
    <!-- 半场 -->
    <span>&nbsp;&nbsp;</span>
    <span v-if="score_array[1] && collection_a.includes(detail_data.mmp)">{{i18n_t('match_info.half')}}: <span class="active-text">{{ $filters.score_format(score_array[1])}}</span></span>
    <!-- 加时赛 -->
    <span v-if="add_score && collection_c.includes(detail_data.mmp)">&nbsp;&nbsp;{{i18n_t('match_info.add')}}: <span class="active-text">{{ $filters.score_format(add_score)}}</span></span>
    <!-- 点球大战 -->
    <span v-if="shoot_score && collection_d.includes(detail_data.mmp)">&nbsp;&nbsp;{{i18n_t('match_info.shoot_out')}}: <span class="active-text">{{ $filters.score_format(shoot_score)}}</span></span>
    <!-- 全场 -->
    <span v-if="score_array[0] && collection_b.includes(detail_data.mmp)">&nbsp;&nbsp;{{i18n_t('match_info.full')}}: <span class="active-text">{{ $filters.score_format(score_array[0])}}</span></span>
  </div>
</template>

<script>
// import { mapGetters } from "vuex"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
export default {
  name: 'score_child_14',
  data(){
    return {
      // 1全场  2上半场  7加时赛  170点球大战
      msc_array:["S1","S2","S7","S170"],
      // 展示上半场比分阶段
      collection_a : ['6','31','7','41','100','32','33','42','110','34','50','120','999','443','440','444'],
      // 展示全场比分阶段
      collection_b : ['7','41','100','32','33','42','110','34','50','120','999','443','440','444'],
      // 加时赛阶段
      collection_c : ['32','41','33','42','443','440','444','110','999'],
      // 点球阶段
      collection_d : ['34','50','120','999'],
      // 加时赛比分是否有
      add_score: false,
      // 点球比分是否有
      shoot_score: false
    }
  },
  computed: {
    // 比分集合
    score_array(){
      return this.initEvent();
    },
    // ...mapGetters([
    //   // 赛果标识
    //   "get_menu_type"
    // ])
  },
  watch: {
    detail_data:{
      handler(n){
        switch( n.mmp ){
          case "34":    //34  等待点球大战阶段 前端显示点球大战 S170是点球大战比分
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
     *@description 橄榄球阶段的比分
     *@param {Undefined}
     *@return {Array} 橄榄球比分
     */
    initEvent(){
      let msc = this.detail_data.msc;
      // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
      msc = lodash.sortBy( msc, (item) => {
        return +(item.split("|")[0]).substring(1)
      })

      let score_arr = [];
      // 循环只取出接口返回的比分里面符合橄榄球阶段的比分
      lodash.forEach(msc, (item)=>{
        // S1 S2 S3 S19 S20 ...
        let num_index = item.split("|")[0];
        // 加时赛
        if(num_index == 'S7'){
          this.add_score = item.split("|")[1];
        }
        // 点球
        if(num_index == 'S170'){
          this.shoot_score = item.split("|")[1];
        }
        // 1全场  2上半场  7加时赛  170点球大战
        if(this.msc_array.includes(num_index)){
          score_arr.push(item.split("|")[1]);
        }
      })
      return score_arr;
    },
        /**
     *@description 根据赛事阶段显示默认的比分
     *@param {Undefined}
     *@return {Undefined}
     */
    validateStage(){
      switch( this.detail_data.mmp ){
        case "34":  //34  等待点球大战阶段 前端显示点球大战 S170是点球大战比分
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S170|0:0')
          break;
      }
    }
  }
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
/*************** 比分字体颜色 *************** -S*/
.active-text {
  color: #ffce63;
}

/*************** 比分字体颜色 *************** -E*/
</style>
