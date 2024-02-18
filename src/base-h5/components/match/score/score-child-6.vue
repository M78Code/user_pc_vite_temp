<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 美式足球赛事的细节比分展示
-->
<template>
<!-- 美式足球 -->
  <div class='score_child_2 mx-12 font-style'>
      <!-- 常规4节比赛 -->
      <!-- mmp （13 第一节）（14 301 第二节）（15 302 第三节）（16 303 第四节） -->
      <template v-if="model_a.includes(detail_data.mmp) && detail_data.mo != 1">
        <span v-for="(item, key) of score_array" :key="key">
          <span>&ensp;</span>
          <span :class="(score_array.length == key + 1&&detail_data.mo != 1) ? 'active-text': '' " style="letter-spacing: 0.015rem">{{ $filters.score_format(item)}}</span>
        </span>
      <!-- 加时赛 -->
      <!-- mmp 32等待加时 40加时赛 110加时赛结束 100完赛 999完赛 -->
      <template v-if="model_b.includes(detail_data.mmp)">
        <template v-if="score_array.length == 4">
          <!-- 历史比分展示 -->
          <span v-for="(item, key) of score_array" :key="key">
            <span>&ensp;</span>
            <span style="letter-spacing: 0.015rem" >{{ $filters.score_format(item)}}</span>
          </span>
          <!-- 加时赛比分展示 -->
          <span v-if="detail_data.mmp != '32' && extraTime">
            <span>&ensp;</span>
            <span>{{'OT'}}&nbsp;<span style="letter-spacing: 0.015rem" :class=" (history_score&&detail_data.mo != 1) ? 'active-text': ''">{{ $filters.score_format(extraTime)}}</span></span>
          </span>
        </template>
      </template>

    </template>
  </div>
</template>

<script>
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
export default {
  name: 'score_child_2',
  data(){
    return {
      // 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
      // 常规4节比赛
      model_a:['13', '14', '15', '16', '301', '302', '303', '999'],
      // 加时赛比赛以及完赛
      model_b:['32', '40', '100', '110','999', '999'],
      //第1 2 3 4节比分
      msc_array:['S19','S20','S21','S22'],
    }
  },
  computed: {
    // 比分集合
    score_array(){
      return this.init_event();
    },
    // msc S7表示公共加时赛比分
    extraTime(){
      return this.get_extra_time();
    },
    // mmp赛事阶段100和999都显示历史比分
    history_score(){
      return this.detail_data.mmp != '100' && this.detail_data.mmp != '999';
    }
  },
  watch: {
    detail_data:{
      handler(n, o){
        switch( n.mmp ){
          case "301":   //301  第一节结束  S20 第二节比分(美足)
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S20|0:0')
            break;
          case "302":   //302  第二节结束  S21 第三节比分(美足)
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S21|0:0')
            break;
          case "303":   //303  第三节结束  S22 第四节比分(美足)
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S22|0:0')
            break;
          case "40":    //40   加时赛 S7 加时赛比分(美足)
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S7|0:0')
            break;
        }
      },
      deep: true,
    }
  },
  props: ['detail_data'],
  created(){
    this.validate_stage();
  },
  methods: {
    /**
     *@description 取出美足阶段的赛事比分
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
      // 循环只取出接口返回的比分里面符合美足球阶段的比分
        lodash.forEach(msc, (item, index)=>{
          let num_index = item.split("|")[0];
          if(this.msc_array.includes(num_index)){
            score_arr.push(item.split("|")[1]);
          }
        })
      return score_arr;
    },
    /**
     *@description 公共加时赛比分
     *@param {Undefined}
     *@return {String} 加时比分
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
     *@description 根据赛事状态显示默认比分
     *@param {Undefined}
     *@return {Undefined}
     */
    validate_stage(){
      switch( this.detail_data.mmp ){
        case "301":   //301 第一节结束 S20 第二节比分(美足)
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S20|0:0')
          break;
        case "302":   //302 第二节结束 S21 第三节比分(美足)
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S21|0:0')
          break;
        case "303":   //303 第三节结束 S22 第四节比分(美足)
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S22|0:0')
          break;
        case "40":    //40  加时赛 S7 加时赛比分(美足)
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S7|0:0')
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
/*************** 比分字体颜色 *************** -S*/
.active-text {
  color: #ffce63;
}

/*************** 比分字体颜色 *************** -E*/
</style>
