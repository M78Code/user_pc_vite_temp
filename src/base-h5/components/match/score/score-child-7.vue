<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 斯诺克赛事的细节比分展示
-->
<template>
<!-- 斯诺克 -->
  <div class='score_child_7 mx-12 font-style menu-s'>
      <span v-for="(item, key) of score_array" :key="key">
        <span>&nbsp;&nbsp;</span>
        <span :class="(score_array.length == key + 1&&detail_data.mo != 1)? 'activeText': '' ">{{ $filters.score_format(item)}}</span>
        <span>&nbsp;&nbsp;</span>
      </span>
  </div>
</template>

<script>
// import { mapGetters } from "vuex"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
export default {
  name: 'score_child_7',
  data(){
    return {
      // 斯诺克比分集合
      msc_array:[],
    }
  },
  computed: {
    // ...mapGetters(['get_detail_msc_changed']),
    // 比分集合
    score_array(){
      return this.initEvent();
    }
  },
  watch: {
    get_detail_msc_changed(){
      let msc = this.detail_data.msc;
      // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
      msc = lodash.sortBy( msc, (item) => {
        return +(item.split("|")[0]).substring(1)
      })
      try {
        if (msc && Array.isArray( msc )){
          const len = msc.length-1
          let middle_number = Number((msc[len].split("|")[0]).substring(1)) + 1;
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, `S${middle_number}|0:0`);
      }
      } catch (error) {
        console.error(error);
      }
    },
    detail_data:{
      handler(n, o){
        if(n.mmp == '445'){
          let msc = this.detail_data.msc;
          // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
          msc = lodash.sortBy( msc, (item) => {
            return +(item.split("|")[0]).substring(1)
          })
          try {
            if ( msc && Array.isArray( msc )){
              const len = msc.length-1
              let middle_number = Number((msc[len].split("|")[0]).substring(1)) + 1;
              useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, `S${middle_number}|0:0`);
          }
          } catch (error) {
            console.error(error);
          }
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
     *@description 取出符合斯诺克赛事阶段的比分
     *@param {Undefined}
     *@return {Array} 比分集合
     */
    initEvent(){
      for(let i = 120; i<= 159; i ++){
        this.msc_array.push(`S${i}`);
      }
      let msc = this.detail_data.msc;
      // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
      msc = lodash.sortBy( msc, (item) => {
        return +(item.split("|")[0]).substring(1)
      })
      let score_arr = [];
      lodash.forEach(msc, (item, index)=>{
        let num_index = item.split("|")[0];
        if(this.msc_array.includes(num_index)){
          score_arr.push(item.split("|")[1]);
        }
      })
      return score_arr;
    },
    /**
     *@description 斯诺克休息阶段默认显示下一局比分0:0
     *@param {Undefined}
     *@return {Undefined}
     */
    validateStage(){
      if(this.detail_data.mmp == '445'){
        let msc = this.detail_data.msc;
        // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
        msc = lodash.sortBy( msc, (item) => {
          return +(item.split("|")[0]).substring(1)
        })
        try {
          if (msc && Array.isArray( msc )){
            const len = msc.length-1
            let middle_number = Number((msc[len].split("|")[0]).substring(1)) + 1;
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, `S${middle_number}|0:0`);
          }
        } catch (error) {
          console.error(error);
        }
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
.activeText {
  color: #ffce63;
}

/*************** 比分字体颜色 *************** -E*/
/*************** 超出显示范围横向滚动样式 *************** -S*/
.menu-s {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: auto;
  white-space: nowrap;
}

/*************** 超出显示范围横向滚动样式 *************** -E*/
</style>
