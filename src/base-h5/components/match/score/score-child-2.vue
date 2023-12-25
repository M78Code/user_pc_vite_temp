<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页篮球比分展示子组件
-->
<template>
<!-- 篮球 -->
  <div class='score_child_2 mx-12 font-style'>
    <template v-if="detail_data.ms != 111 && detail_data.mle != 73">
      <!-- 加时赛 -->
      <!-- mmp 32 等待加时  40 加时赛  110加时赛结束 -->
      <!-- msc S7表示公共加时赛比分 -->
      <!-- 上半场，下半场模式 -->
      <!-- mmp  1.上半场 2.下半场 31.中场休息 -->
      <template v-if="model_a.includes(detail_data.mmp) && detail_data.mle == 17 && !['result_details', 'match_result'].includes($route.name)">
        <span v-for="(item, key) of score_array" :key="key">
          <span>&nbsp;&nbsp;</span>
          <span :class="score_array.length == key + 1 ? 'activeText': '' ">{{`${key + 1}H`}}<span style="letter-spacing: 0.01rem">{{$filters.score_format(item)}}</span></span>
        </span>
      </template>
      <!-- 常规4节比赛 -->
      <!-- mmp （13 第一节）（14 301 第二节）（15 302 第三节）（16 303 第四节） -->
      <template v-if="model_b.includes(detail_data.mmp) && detail_data.mo != 1">
        <span v-for="(item, key) of score_array" :key="key">
          <span>&nbsp;&nbsp;</span>
          <span :class="score_array.length == key + 1 ? 'activeText': '' "><span style="letter-spacing: 0.01rem">{{$filters.score_format(item)}}</span></span>
        </span>
      </template>
      <!-- 加时赛 -->
      <!-- mmp 32 等待加时  40 加时赛  110加时赛结束 -->
      <template v-if="model_c.includes(detail_data.mmp)">
        <!-- 区分model_a or model_b -->
        <template v-if="score_array.length == 2">
          <span v-for="(item, key) of score_array" :key="key">
            <span>&nbsp;&nbsp;</span>
            <span>{{`${key + 1}H`}}&nbsp;{{$filters.score_format(item)}}</span>
          </span>
          <!-- 加时赛比分展示 -->
          <span v-if="extraTime">
            <span>&nbsp;&nbsp;</span>
            <span class="activeText">{{i18n_t('match_info.add')}}{{$filters.score_format(extraTime)}}</span>
          </span>
        </template>
        <template v-else-if="score_array.length == 4">
          <span v-for="(item, key) of score_array" :key="key">
            <span>&nbsp;&nbsp;</span>
            <span>{{$filters.score_format(item)}}</span>
          </span>
          <!-- 加时赛比分展示 -->
          <span v-if="extraTime">
            <span>&nbsp;&nbsp;</span>
            <span class="activeText">{{i18n_t('match_info.add')}}({{$filters.score_format(extraTime)}})</span>
          </span>
        </template>
        <!-- <template v-else>
          <span v-for="(item, key) of score_array" :key="key">
            <span>&nbsp;&nbsp;</span>
            <span>{{$filters.score_format(item)}}</span>
          </span>
        </template> -->
      </template>
    </template>
  </div>
</template>

<script>
// import { mapGetters } from "vuex"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
export default {
  name: 'score_child_2',
  data(){
    return {
      // 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
      // 上半场，下半场
      model_a:['1', '2', '31'],
      // 常规4节比赛
      model_b:['13', '14', '15', '16', '301', '302', '303'],
      // 加时赛比赛
      model_c:['32', '40', '110','999'],
      // 常规4节比赛的比分
      msc_array:['S19','S20','S21','S22'],
      // 上下半场
      msc_array1:['S2','S3'],
    }
  },
  computed: {
    // 菜单是赛果get_menu_type == 28
    // ...mapGetters(['get_menu_type']),
    // 比分集合
    score_array(){
      return this.initEvent();
    },
    // 加时赛比分
    extraTime(){
      return this.getExtraTime();
    }
  },
  watch: {
    detail_data:{
      handler(n, o){
        switch( n.mmp ){
          case "301":   //301 第一节结束 S20 第二节比分(篮球)
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S20|0:0')
            break;
          case "302":   //302 第二节结束 S21 第三节比分(篮球)
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S21|0:0')
            break;
          case "303":   //303 第三节结束 S22 第四节比分(篮球)
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S22|0:0')
            break;
          case "31":    //31  上半场结束 S3  下半场比分
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S3|0:0')
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
     *@description 篮球比分集合
     *@param {Undefined}
     *@return {Array} 篮球比分
     */
    initEvent(){
      let msc = this.detail_data.msc;
      // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
      msc = lodash.sortBy( msc, (item) => {
        return +(item.split("|")[0]).substring(1)
      })
      let score_arr = [];
      // 循环只取出接口返回的比分里面符合篮球球阶段的比分
      if(this.detail_data.mlet == '17'|| this.detail_data.mle == '17'){
        lodash.forEach(msc, (item)=>{
          // S1 S2 S3 S19 S20 ...
          let num_index = item.split("|")[0];
          if(this.msc_array1.includes(num_index)){
            score_arr.push(item.split("|")[1]);
          }
        })
      }else {
        lodash.forEach(msc, (item)=>{
          let num_index = item.split("|")[0];
          if(this.msc_array.includes(num_index)){
            score_arr.push(item.split("|")[1]);
          }
        })
      }
      return score_arr;
    },
    /**
     *@description 公共加时赛比分
     *@param {Undefined}
     *@return {String} 加时赛比分
     */
    getExtraTime(){
      let msc = this.detail_data.msc;
      let extra = "";
      lodash.forEach(msc,(item)=>{
        let num_index = item.split("|")[0];
        if(num_index == "S7"){
          extra = item.split("|")[1];
        }
      })
      return extra;
    },
    /**
     *@description 根据赛事阶段显示默认的比分
     *@param {Undefined}
     *@return {Undefined}
     */
    validateStage(){
      switch( this.detail_data.mmp ){
        case "301":   //301 第一节结束   S20 第二节比分(篮球)
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S20|0:0')
          break;
        case "302":   //302 第二节结束 S21 第三节比分(篮球)
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S21|0:0')
          break;
        case "303":  //303  第三节结束 S22 第四节比分(篮球)
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S22|0:0')
          break;
        case "31":   //31  上半场结束 S3 下半场比分
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S3|0:0')
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
.activeText {
  color: #ffce63;
}

/*************** 当前比分字体颜色 *************** -E*/
</style>
