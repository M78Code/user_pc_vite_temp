<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 排球赛事的细节比分展示
-->
<template>
<!-- 排球 -->
  <div class='score_child_9 mx-12 font-style menu-s'>
    <span v-for="(item, key) of score_array" :key="key">
      <span>&nbsp;&nbsp;</span>
      <span :class="(score_array.length == key + 1&&detail_data.mo != 1) ? 'active-text': '' ">{{ $filters.score_format(item)}}</span>
      <span>&nbsp;&nbsp;</span>
    </span>
  </div>
</template>

<script>
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
export default {
  name: 'score_child_9',
  data(){
    return {
      // 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
      // 排球比分集合
      msc_array:[],
      // mmp rule array; // 排球休息阶段 第一局结束...
      mmp_arr:['301','302','303','304','305','306'],
      // mmp rule array; // 排球比赛进行阶段 第一局...
      mmp_arr2:['8','9','10','11','12','441','442'],
    }
  },
  computed: {
    // 取出排球比分的集合
    score_array(){
      return this.init_event();
    }
  },
  watch: {
    detail_data:{
      handler(n, o){
        switch(n.mmp){
          case '301':  //301   第一局结束 S121显示第二局比分0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
            break;
          case '9':    //9     第二局开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
            break;
          case '302':  //302   第二局结束 S122显示第三局比分0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
            break;
          case '10':   //10    第三局开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
            break;
          case '303':  //303   第三局结束 S123显示第四局比分0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S123|0:0')
            break;
          case '11':   //11    第四局开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S123|0:0')
            break;
          case '304':  //304   第四局结束 S124显示第五局比分0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S124|0:0')
            break;
          case '12':   //12    第五局开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S124|0:0')
            break;
          case '305':  //305   第五局结束 S125显示第六局比分0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S125|0:0')
            break;
          case '441':  //441   第六局开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S125|0:0')
            break;
          case '306':  //306   第六局结束 S126显示第七局比分0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S126|0:0')
            break;
          case '442':  //442   第七局开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S126|0:0')
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
     *@description 取出符合排球阶段的比分
     *@param {Undefined}
     *@return {Array} 比分集合
     */
    init_event(){
      for(let i = 120; i<= 159; i ++){
        this.msc_array.push(`S${i}`);
      }
      let msc = this.detail_data.msc;
      // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
      msc = lodash.sortBy( msc, (item) => {
        return +(item.split("|")[0]).substring(1)
      })
      let score_arr = [];
      // 循环只取出接口返回的比分里面符合排球阶段的比分
      lodash.forEach(msc, (item, index)=>{
        // S120 S121 S123 S124 S125 ...
        let num_index = item.split("|")[0];
        if(this.msc_array.includes(num_index)){
          score_arr.push(item.split("|")[1]);
        }
      })
      return score_arr;
    },
    /**
     *@description 根据赛事状态显示默认排球比分
     *@param {Undefined}
     *@return {Undefined}
     */
    validate_stage(){
      switch(this.detail_data.mmp){
        case '301':  //301   第一局结束 S121显示第二局比分0:0
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
          break;
        case '9':    //9     第二局开始
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
          break;
        case '302':  //302   第二局结束 S122显示第三局比分0:0
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
          break;
        case '10':   //10    第三局开始
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
          break;
        case '303':  //303   第三局结束 S123显示第四局比分0:0
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S123|0:0')
          break;
        case '11':   //11    第四局开始
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S123|0:0')
          break;
        case '304':  //304   第四局结束 S124显示第五局比分0:0
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S124|0:0')
          break;
        case '12':   //12    第五局开始
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S124|0:0')
          break;
        case '305':  //305   第五局结束 S125显示第六局比分0:0
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S125|0:0')
          break;
        case '441':  //441   第六局开始
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S125|0:0')
          break;
        case '306':  //306   第六局结束 S126显示第七局比分0:0
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S126|0:0')
          break;
        case '442':  //442   第七局开始
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
