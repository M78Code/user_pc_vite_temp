<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 冰球赛事的细节比分展示
-->
<template>
<!-- 冰球 -->
<!-- 可能会产生滚动，故用class  menu-s -->
  <div class='score_child_4 mx-12 font-style menu-s'>
    <!-- 常规三节赛事 -->
    <template v-if="mmp_arr.includes(detail_data.mmp) && !is_match_result">
      <span v-for="(item, key) of score_array" :key="key">
        <span>&ensp;</span>
        <span :class="{'active-text':(score_array.length == key + 1 && detail_data.mo != 1)}">{{ $filters.score_format(item)}}</span>
        <span>&ensp;</span>
      </span>
    </template>
    <!-- 加时赛||点球大战 -->
    <template v-if="mmp_arr1.includes(detail_data.mmp) || mmp_arr2.includes(detail_data.mmp)">
      <!-- 解决key重复 -->
      <span v-for="(item, key) of score_array" :key="key">
        <span>&ensp;</span>
        <span>{{ $filters.score_format(item)}}</span>
        <span>&ensp;</span>
      </span>
      <!-- 加时赛比分展示 -->
      <span v-if="extraTime">
        <span>&ensp;</span>
        <span class="activeText">{{i18n_t('match_info.ice_add')}}:{{ $filters.score_format(extraTime)}}</span>
        <span>&ensp;</span>
      </span>
      <!-- 点球比分展示 -->
      <span v-if="penaltyScore">
        <span>&ensp;</span>
        <span class="activeText">{{i18n_t('match_info.shoot_out')}}:{{ $filters.score_format(penaltyScore)}}</span>
      </span>
    </template>
  </div>
</template>

<script>
// import { mapGetters } from "vuex"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
export default {
  name: 'score_child_4',
  data(){
    return {
      // 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
      // 冰球比分: 第一节比分, 第二节比分, 第三节比分
      msc_array:['S120','S121','S122'],
      // mmp 冰球赛事阶段: 1第一节 2第二节 3第三节 301第一节休息, 302第二节休息
      mmp_arr:['1','2','3','301','302','999'],
      // 加时赛阶段
      mmp_arr1:["32","40","110",'999'],
      // 点球阶段
      mmp_arr2:["34","50","120",'999']
    }
  },
  computed: {
    // ...mapGetters([
    //   'get_detail_msc_changed',
    //   'get_menu_type'
    // ]),
    // 获取冰球赛事各个阶段的比分
    score_array(){
      return this.init_event();
    },
    // msc S7 表示公共加时赛比分  冰球
    extraTime(){
      return this.get_extra_time();
    },
    // msc S170	点球大战比分  冰球
    penaltyScore(){
      return this.get_penalty_score();
    },
    is_match_result(){
      return ['result_details', 'match_result'].includes(this.$route.name)
    }
  },
  watch: {
    get_detail_msc_changed(curr){
      this.init_event();
    },
    detail_data:{
      handler(n, o){
        switch(n.mmp){
          case '301':  // 第一节结束  S121是第二节比分 0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
            break;
          case '2':    // 第二节开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
            break;
          case '302':  // 第二节结束  S122是第三节比分 0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
            break;
          case '3':    // 第三节开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
            break;
          case '34':   // 等待点球大战阶段 前端显示点球大战 S170是点球大战比分
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S170|0:0')
            break;
        }
      },
      deep: true
    }
  },
  props: ['detail_data'],
  created(){
    this.validate_stage();
  },
  methods: {
    /**
     *@description 取出符合冰球阶段的比分
     *@param {Undefined}
     *@return {Array} 比分集合
     */
     init_event(){
      let msc = this.detail_data.msc;
      // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
      msc = lodash.sortBy( msc, (item) => {
        return +(item.split("|")[0]).substring(1)
      })
      let score_arr = [];
      // 循环只取出接口返回的比分里面符合冰球阶段的比分
      lodash.forEach(msc, (item, index)=>{
         // S120 S121 S122 ...
        let num_index = item.split("|")[0];
        if(this.msc_array.includes(num_index)){
          score_arr.push(item.split("|")[1]);
        }
      })
      return score_arr;
    },
    /**
     *@description 获取加时赛的比分
     *@param {Undefined}
     *@return {String} 加时赛比分
     */
    get_extra_time(){
      let msc = this.detail_data.msc;
      let extra = "";
      lodash.forEach(msc,(item,index)=>{
        let num_index = item.split("|")[0];
        if(num_index == "S7"){
          extra = item.split("|")[1];
        }
      })
      return extra;
    },
    /**
    *@description 获取点球大战的比分
    *@param {Undefined}
    *@return {String}} 点球大战比分
    */
    get_penalty_score(){
      let msc = this.detail_data.msc;
      let penalty = "";
      lodash.forEach(msc,(item,index)=>{
        let num_index = item.split("|")[0];
        if(num_index == "S170"){
          penalty = item.split("|")[1];
        }
      })
      return penalty;
    },
    /**
     *@description 根据赛事状态显示相应的比分
     *@param {Undefined}
     *@return {Undefined}
     */
    validate_stage(){
      switch(this.detail_data.mmp){
        case '301':  // 第一节结束  S121是第二节比分 0:0
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
          break;
        case '2':    // 第二节开始
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
          break;
        case '302':  // 第二节结束  S122是第三节比分 0:0
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
          break;
        case '3':    // 第三节开始
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
          break;
        case '34':   // 等待点球大战阶段 前端显示点球大战 S170是点球大战比分
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
/*************** 比分字体颜色 *************** -S*/
.active-text {
  color: #ffce63;
}

/*************** 比分字体颜色 *************** -E*/
/*************** 超出显示范围横向滚动样式 *************** -S*/
.menu-s {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: auto;
  white-space: nowrap;
}

/*************** 超出显示范围横向滚动样式 *************** -E*/
</style>
