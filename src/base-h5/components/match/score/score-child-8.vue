<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 兵乓球赛事的细节比分展示
-->
<template>
  <!-- 乒乓球 -->
  <div class='score_child_8 mx-12 font-style menu-s'>
      <span v-for="(item, key) of score_array" :key="key">
        <span style="letter-spacing: 0.01rem" :class="(score_array.length == key + 1&&detail_data.mo != 1)? 'activeText': '' ">{{ $filters.score_format(item)}}</span>
        <span>&nbsp;&nbsp;</span>
      </span>
  </div>
</template>

<script>
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
export default {
  name: 'score_child_8',
  data(){
    return {
      // 兵乓球比分集合
      msc_array:[],
      // mmp rule array: 乒乓球：301第一盘/局结束, 302第二盘/局结束, 303第三盘/局结束, 304第四盘/局结束, 305第五盘/局结束, 306第六盘/局结束;
      mmp_arr:['301','302','303', '304','305', '306'],
      // mmp rule array; 乒乓球: 8第一盘/局, 9第二盘/局, 10第三盘/局, 11第四盘/局, 12第五盘/局, 441第六局, 442第七局;
      mmp_arr2:['8','9','10','11','12', '441', '442'],
    }
  },
  computed: {
    // 比分集合
    score_array(){
      return this.initEvent();
    }
  },
  watch: {
    detail_data:{
      handler(n, o){
        switch(n.mmp){
          case '301':  //301   第一局结束
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
            break;
          case '9':    //9     第二局
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
            break;
          case '302':  //302   第二局结束
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
            break;
          case '10':   //10    第三局
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
            break;
          case '303':  //303   第三局结束
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S123|0:0')
            break;
          case '11':   //11    第四局
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S123|0:0')
            break;
          case '304':  //304   第四局结束
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S124|0:0')
            break;
          case '12':   //12    第五局
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S124|0:0')
            break;
          case '305':  //305   第五局结束
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S125|0:0')
            break;
          case '441':  //441   第六局
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S125|0:0')
            break;
          case '306':  //306   第六局结束
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S126|0:0')
            break;
          case '442':  //442   第七局
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S126|0:0')
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
     *@description 取出符合兵乓球赛事阶段的比分
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
      // 循环只取出接口返回的比分里面符合兵乓球阶段的比分
      lodash.forEach(msc, (item, index)=>{
         // S1 S2 S3 S19 S20 ...
        let num_index = item.split("|")[0];
        if(this.msc_array.includes(num_index)){
          score_arr.push(item.split("|")[1]);
        }
      })
      return score_arr;
    },
    /**
     *@description 对应赛事阶段显示默认的比分
     *@param {Undefined}
     *@return {Undefined}
     */
    validateStage(){
      switch(this.detail_data.mmp){
        case '301':  //301  第一局结束
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
          break;
        case '9':    //9    第二局
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
          break;
        case '302':  //302  第二局结束
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
          break;
        case '10':   //10   第三局
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
          break;
        case '303':  //303  第三局结束
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S123|0:0')
          break;
        case '11':   //11   第四局
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S123|0:0')
          break;
        case '304':  //304  第四局结束
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S124|0:0')
          break;
        case '12':   //12   第五局
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S124|0:0')
          break;
        case '305':  //305  第五局结束
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S125|0:0')
          break;
        case '441':  //441  第六局
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S125|0:0')
          break;
        case '306':  //306  第六局结束
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S126|0:0')
          break;
        case '442':  //442  第七局
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S126|0:0')
          break;
      }
    },
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
/*************** 超出显示范围横向滚动样式 *************** -S*/
.menu-s {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: auto;
  white-space: nowrap;
}

/*************** 超出显示范围横向滚动样式 *************** -E*/
</style>
