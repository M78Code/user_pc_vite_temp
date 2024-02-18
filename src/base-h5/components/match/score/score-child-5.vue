<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description:详情页网球比分展示子组件
-->
<template>
<!-- 网球 -->
<!-- 可能会产生滚动，故用class  menu-s -->
  <div class='score_child_5 mx-12 font-style menu-s'>
      <span v-for="(item, key) of score_array" :key="key" class="mr-10">
        <span :class="{'activeText':(score_array.length == key + 1 && detail_data.mo != 1)}" style="letter-spacing: 0.015rem">{{ $filters.score_format(item)}}</span>
      </span>
  </div>
</template>

<script>
// import { mapGetters } from "vuex"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
export default {
  name: 'score_child_5',
  data(){
    return {
      // 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
      // 第一盘比分，第二盘比分，第三盘比分，第四盘比分，第五盘比分;
      msc_array:['S23','S39','S55','S71','S87'],
      // 第一盘，第二盘，第三盘，第四盘，第五盘;
      mmp_arr:['8', '9', '10', '11', '12','999'],
    }
  },
  computed: {
    // ...mapGetters([
    //   'get_detail_msc_changed'
    // ]),
    // 网球比分集合
    score_array(){
      return this.initEvent();
    }
  },
  watch: {
    get_detail_msc_changed(curr){
      this.initEvent();
    },
    detail_data:{
      handler(n){
        switch( n.mmp ){
          case '8': //8 第一盘  S23 第1盘比分（网球）
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S23|0:0')
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S103|0:0')
            break;
          case '9': //9 第二盘  S39 第2盘比分（网球）
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S39|0:0')
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S103|0:0')
            break;
          case '10': //10 第三盘 S55 第3盘比分（网球）
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S55|0:0')
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S103|0:0')
            break;
          case '11': //11 第四盘 S71 第4盘比分（网球）
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S71|0:0')
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S103|0:0')
            break;
          case '12': //12 第五盘 S87 第5盘比分（网球）
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S87|0:0')
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S103|0:0')
            break;
        }
      },
      deep: true
    }
  },
  props: ['detail_data'],
  created(){
    this.validateStage();
  },
  methods: {
    /**
     *@description 取出符合网球阶段的比分
     *@param {Undefined}
     *@return {Array} 比分集合
     */
    initEvent(){
      let msc = this.detail_data.msc;
      // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
      msc = lodash.sortBy( msc, (item) => {
        return +(item.split("|")[0]).substring(1)
      })
      let score_arr = [];
      // 循环只取出接口返回的比分里面符合网球阶段的比分
      lodash.forEach(msc, (item)=>{
        // S1 S2 S3 S19 S20 ...
        let num_index = item.split("|")[0];
        if(this.msc_array.includes(num_index)){
          score_arr.push(item.split("|")[1]);
        }
      })
      return score_arr;
    },
    /**
     *@description 查询赛事阶段比分
     *@param {String} 需要查询的比分
     *@return {Number} 比分是否存在
     */
    findStage(str){
      let tens_stage_col = [];
      lodash.forEach(this.detail_data.msc, (item)=>{
        tens_stage_col.push( item.split("|")[0] )
      })
      return tens_stage_col.indexOf(str);
    },
    /**
     *@description 根据赛事状态显示相应的比分
     *@param {Undefined}
     *@return {Undefined}
     */
    validateStage(){
      switch(this.detail_data.mmp){
        case '8': //8 第一盘  S23 第1盘比分（网球）
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S23|0:0')
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S103|0:0')
          break;
        case '9': //9 第二盘  S39 第2盘比分（网球）
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S39|0:0')
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S103|0:0')
          break;
        case '10': //10 第三盘 S55 第3盘比分（网球）
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S55|0:0')
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S103|0:0')
          break;
        case '11': //11 第四盘 S71 第4盘比分（网球）
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S71|0:0')
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S103|0:0')
          break;
        case '12': //12 第五盘 S87 第5盘比分（网球）
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S87|0:0')
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S103|0:0')
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/*************** 字体样式 *************** -S*/
.font-style {
  font-size: 0.12rem;
  color: #FFFFFF;
  letter-spacing: 0;
}

/*************** 字体样式 *************** -E*/
/*************** 比分字体颜色 *************** -S*/
.activeText {
  color: #ffce63;
}

/*************** 比分字体颜色 *************** -E*/
/*************** 超出显示范围横向滚动样式 *************** -S*/
.menu-s {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: auto;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 700;
}
.mr-10 {
  margin-right: 10px;
}
/*************** 超出显示范围横向滚动样式 *************** -E*/
</style>
