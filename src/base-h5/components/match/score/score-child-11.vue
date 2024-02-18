<!--
 * @Author: Supermark
 * @Date: 2021-07-13 20:28:18
 * @Description: 详情页手球比分展示
-->
<template>
  <div class='stage_child_11 row mx-12 font-style'>
    <div>
      <!-- 上半场，全场，加时赛，点球大战-->
      <span>&nbsp;&nbsp;</span>
      <span v-if="score_array[1] && collection_a.includes(detail_data.mmp)"> {{i18n_t('match_info.half')}}</span>
      <span v-if="score_array[0] && collection_b.includes(detail_data.mmp)">/{{i18n_t('match_info.full')}}</span>
      <span v-if="add_score && collection_c.includes(detail_data.mmp)">/{{i18n_t('match_info.add')}}</span>
      <span v-if="shoot_score && collection_c.includes(detail_data.mmp)">/{{i18n_t('match_info.shoot_out')}}</span>

      <span v-if="score_array[1] && collection_a.includes(detail_data.mmp)"> : {{ $filters.score_format(score_array[1])}}</span>
      <span v-if="score_array[0] && collection_b.includes(detail_data.mmp)"> / {{ $filters.score_format(score_array[0])}}</span>
      <span v-if="add_score && collection_c.includes(detail_data.mmp)"> / {{ $filters.score_format(add_score)}}</span>
      <span v-if="shoot_score && collection_c.includes(detail_data.mmp)"> / {{ $filters.score_format(shoot_score)}}</span>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from "vuex"
export default {
  name: 'stage_child_11',
  data(){
    return {
      // 1全场  2上半场  7加时赛  170点球大战
      msc_array:["S1","S2","S7","S170"],
      // 满足难度需求 start 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
      collection_a : ['6','31', '7', '41', '100', '32', '33', '42', '110', '34', '50', '120','999'],
      collection_b : ['41', '100', '32', '33', '42', '110', '34', '50', '120','999'],
      collection_c : ['110', '34', '50', '120','999'],
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
  props: ['detail_data'],
  methods: {
    /**
     *@description 手球阶段的比分
     *@param {Undefined}
     *@return {Array} 手球比分
     */
    initEvent(){
      let msc = this.detail_data.msc;
      // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
      msc = lodash.sortBy( msc, (item) => {
        return +(item.split("|")[0]).substring(1)
      })

      let score_arr = [];
      // 循环只取出接口返回的比分里面符合手球阶段的比分
      lodash.forEach(msc, (item, index)=>{
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
        if(this.msc_array.includes(num_index)){
          score_arr.push(item.split("|")[1]);
        }
      })
      return score_arr;
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
</style>
