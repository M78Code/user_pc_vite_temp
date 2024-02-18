<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页足球比分展示子组件
-->
<template>
  <div class='score_child_1 row mx-12 font-style'>
    <div>
      <!-- 上半场，全场，加时赛，点球大战-->
      <span>&nbsp;&nbsp;</span>
      <template v-if="project_name == 'app-h5' && ['result_details', 'match_result'].includes($route.name)">
        <span v-if="score_array[1] && collection_a.includes(detail_data.mmp)"> {{i18n_t('match_info.half')}}</span>
      </template>
      <template v-else>
        <span v-if="score_array[1] && collection_a.includes(detail_data.mmp)"> 
          {{project_name == 'app-h5' ? i18n_t('app_h5.detail.half') : i18n_t('match_info.half')}}
        </span>
      </template>
      
      
      <span v-if="score_array[0] && collection_b.includes(detail_data.mmp)">/{{i18n_t('match_info.full')}}</span>
      <span v-if="add_score && collection_c.includes(detail_data.mmp)">/{{i18n_t('match_info.add')}}</span>
      <span v-if="shoot_score && collection_c.includes(detail_data.mmp) && ['result_details', 'match_result'].includes($route.name)">/{{i18n_t('match_info.shoot_out')}}</span>

      <span v-if="score_array[1] && collection_a.includes(detail_data.mmp)"> : {{ $filters.score_format(score_array[1])}}</span>
      <span v-if="score_array[0] && collection_b.includes(detail_data.mmp)"> / {{ $filters.score_format(score_array[0])}}</span>
      <span v-if="add_score && collection_c.includes(detail_data.mmp)"> / {{ $filters.score_format(add_score)}}</span>
      <span v-if="shoot_score && collection_c.includes(detail_data.mmp) && ['result_details', 'match_result'].includes($route.name)"> / {{ $filters.score_format(shoot_score)}}</span>
    </div>
    <div>
      <!-- 角球,黄牌,红牌 -->
      <span>&nbsp;&nbsp;</span>
      <!-- 角球数 -->
      <span v-if="red_flag">
        <span>&nbsp;&nbsp;</span>
        <template v-if="project_name == 'app-h5'">
          <q-img
            v-if="['result_details', 'match_result'].includes($route.name)"
            style="width: 0.16rem;height: 0.16rem;margin-top:-5px;"
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/corner_kick_red.svg`"
          />
          <q-img 
            v-else
            style="width: 0.16rem;height: 0.16rem;margin-top:-5px;"  
            :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/corner_kick_red.svg`" 
          />
        </template>
        <span v-else><q-img style="width: 0.16rem;height: 0.16rem;margin-top:-5px;"  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/corner_kick.svg`" ></q-img></span>
        <span v-if="!['result_details', 'match_result'].includes($route.name)">&nbsp;&nbsp;{{project_name == 'app-h5' ? i18n_t('match_result.corner_kick') : ''}}</span>
        <span>{{ $filters.score_format(score_array_status[0])}}</span>
      </span>
      <!-- 黄牌数 -->
      <span v-if="yellow_card">
        <span>&nbsp;&nbsp;</span>
        <span><q-img style="width: 0.16rem;height: 0.16rem;margin-top:-5px;"  class="rounded-borders" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/details_yellow.svg`" ></q-img></span>
        <span v-if="!['result_details', 'match_result'].includes($route.name)">&nbsp;&nbsp;{{project_name == 'app-h5' ? i18n_t('match_result.yellow_card') : ''}}</span>
        <span>{{ $filters.score_format(score_array_status[2])}}</span>
      </span>
      <!-- 红牌数 -->
      <span v-if="red_card">
        <span>&nbsp;&nbsp;</span>
        <span><q-img style="width: 0.16rem;height: 0.16rem;margin-top:-5px;"  class="rounded-borders"  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/details_red_card.svg`" ></q-img></span>
        <span v-if="!['result_details', 'match_result'].includes($route.name)">&nbsp;&nbsp;{{project_name == 'app-h5' ? i18n_t('match_result.red_card') : ''}}</span>
        <span>{{ $filters.score_format(score_array_status[1])}}</span>
      </span>

    </div>
  </div>
</template>

<script>
import lodash from "lodash"
import { LOCAL_PROJECT_FILE_PREFIX ,BUILDIN_CONFIG} from 'src/output/index.js'
import {project_name } from 'src/output/module/constant-utils-common.js'

export default {
  name: 'score_child_1',
  data(){
    return {
      LOCAL_PROJECT_FILE_PREFIX,
      project_name,
      // 1全场  2上半场  7加时赛  170点球大战
      msc_array:["S1","S2","S7","S170"],
      // 5角球  11红牌  12黄牌
      status_array:["S5", "S11", "S12"],
      // 满足难度需求 start 详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
      collection_a : ['31', '7', '41', '100', '32', '33', '42', '110', '34', '50', '120','999'],
      collection_b : ['41', '100', '32', '33', '42', '110', '34', '50', '120','999'],
      collection_c : ['110', '34', '50', '120','999'],
      // 必须先设置为true
      red_flag:true,
      // 必须先设置为true
      yellow_card:true,
      // 必须先设置为true
      red_card:true,
      // 加时赛比分是否有
      add_score: false,
      // 点球比分是否有
      shoot_score: false,
    }
  },
  computed: {
    // 比分集合
    score_array(){
      return this.initEvent();
    },
    // 角球 红牌 黄牌数集合
    score_array_status(){
      return this.initEvent_status();
    },
    // ...mapGetters([
    //   // 赛果标识
    //   "get_menu_type"
    // ])
  },
  watch: {
    detail_data:{
      handler(n, o){
        // 数据改变，重新赋值 status_array;
        this.status_array = ["S5", "S11", "S12"]
        // 监听到detail_data改变 同时更新:角球/红牌/黄牌比分
        this.initEvent_status();
      },
      deep:true,
    },
  },
  props: ['detail_data'],
  methods: {
    /**
     *@description 足球阶段的比分
     *@param {Undefined}
     *@return {Array} 足球比分
     */
    initEvent(){
      let msc = this.detail_data.msc;
      // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
      msc = lodash.sortBy( msc, (item) => {
        return +(item.split("|")[0]).substring(1)
      })

      let score_arr = [];
      // 循环只取出接口返回的比分里面符合足球阶段的比分
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
    },
    /**
     *@description 角球 红牌 黄牌
     *@param {Undefined}
     *@return {Array} 角球 红牌 黄牌数
     */
    initEvent_status(){
     
      let msc = this.detail_data.msc;
      // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
      msc = lodash.sortBy( msc, (item) => {
        return item && +(item.split("|")[0]).substring(1)
      })
      let score_arr = ['0:0','0:0','0:0'];
      lodash.forEach(msc, (item, index)=>{
        let num_index = item?.split("|")[0];
        if(num_index == 'S5'){
          score_arr[0] = item.split("|")[1]
        }else if(num_index == 'S11'){
          score_arr[1] = item.split("|")[1]
        }else if(num_index == 'S12'){
          score_arr[2] = item.split("|")[1]
        }
      })

      // 复刻版的话角球，红牌，黄牌 都显示
      const {PROJECT_NAME} = BUILDIN_CONFIG
      if (PROJECT_NAME=='app-h5') {
        this.red_flag = this.red_card = this.yellow_card = true
      }else{
       // 角球
       this.red_flag = this.show_status(score_arr[0]) > 0 ? true: false;
      // 红牌
      this.red_card = this.show_status(score_arr[1]) > 0 ? true: false;
      // 黄牌
      this.yellow_card = this.show_status(score_arr[2]) > 0 ? true: false;
      }

     
      return score_arr;
    },
    /**
     *@description 判断角球 红牌 黄牌是否显示
     *@param {Undefined}
     *@return {Number} 角球 红牌 黄牌数是否大于0
     */
    show_status(str){
      // 解决部分报错问题;
      if(!str) return;
      let arr = str.split(':');
      let sum = arr.reduce( (total, item)=>{
        return Number(total) + Number(item);
      })
      // 判断sum是否为0;显示隐藏对应的status;
      return sum;
    }
  }
}
</script>

<script setup>
import { useRoute } from "vue-router"
const route = useRoute()
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