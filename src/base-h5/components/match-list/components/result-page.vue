<!--
 * @Author: Supermark
 * @Date: 2020-12-26 15:23:03
 * @Description: 虚拟体育菜单下，比赛结束后需要展示一段时间的赛果页面
-->
<template>
  <div>
    <div class="dynamic-main">

      <!-- 排名 -->
      <div :class="{'border-gray': index <= 2}"
        v-for="(item,index) of rank" :key="index"
        >
        <div class="row justify-between dynamic-title" :class="{'bg-two':index == 1}">
          <div class="row items-center">
            <div class="virtual-num" :class="`virtual-num-${item.no} csid-${[1010].includes(sub_menu_type) ? '1002' : sub_menu_type} ${[1010].includes(sub_menu_type) ? `motorcycle-${item.no}` : ''}`"></div>
            <div class="virtual-name">{{item.name}}</div>
          </div>
          <div class="count-style">{{item.ranking}}</div>
        </div>
      </div>
    </div>

    <div class="fat-vir-result">
      <div class="row bg-color">
        <!-- 赛果第一行（3个或者2个） -->
        <div class="col-4 bor-btm"
          v-for="(item,index) in best_three_list" :key="index"
          :class="{'distance': index == 1, 'col-6':sub_menu_type == 1009}"
          >
          <div class="play-name">{{item.playName}}</div>
          <div class="row justify-center">
            <div v-for="(ol_item,ol_index) in item.ol" :key="ol_index"
              :style="{'margin-left':[1,2].includes(ol_index)?'.11rem':''}"
            >
              <div class="row justify-center" :class="{'border_right': ol_item.on.length > 2}">
                <div v-for="(on_item,on_index) in split_on(ol_item.on)" :key="on_index"
                  :class="[`virtual-num-${on_item} csid-${[1010].includes(sub_menu_type) ? '1002' : sub_menu_type}`, [1010].includes(sub_menu_type) ? `motorcycle-${on_item}` : '', {'margin_sty': on_index == 1}]" class="virtual-on">
                </div>
              </div>
              <div class="ov-style">
                {{get_odds(ol_item,item)}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row bg-color">
        <!-- 塞果中间二项 -->
        <div class="col-6 bor-btm"
          v-for="(item,index) in best_middle_list" :key="index"
          :class="{'distance-right': index == 0}"
          >
          <div class="play-name">{{item.playName}}</div>
          <div class="row justify-center">
            <div v-for="(ol_item,ol_index) in item.ol" :key="ol_index">
              <div class="row justify-center">
                <div v-for="(on_item,on_index) in split_on(ol_item.on)" :key="on_index"
                  :class="[`virtual-num-${on_item} csid-${[1010].includes(sub_menu_type) ? '1002' : sub_menu_type}`, [1010].includes(sub_menu_type) ? `motorcycle-${on_item}` : '', {'margin_sty': on_index == 1}]" class="virtual-on">
                </div>
              </div>
              <div class="ov-style">
                {{get_odds(ol_item,item)}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row bg-color">
        <!-- 赛果页面最后2项 -->
        <div class="col result-style"
          v-for="(unit,index) in last_three_list" :key="index"
          :class="{borrig : index == 0}"
          >
          <div class="item-ov" v-for="(ol_item,ol_index) in unit.ol" :key="ol_index">
            <div class="result-sty">{{ol_item.on}}</div>
            <div>
              {{get_odds(ol_item,unit)}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script setup>
import { onMounted, onUnmounted } from "vue";
import store from "src/store-redux/index.js";
import lodash from 'lodash'
import {MenuData } from "src/output/index.js"

// TODO: 其他模块得 store  待添加
// mixins:[odd_convert],

const props = defineProps({
  match_mid:String,
  current_match:Object
})

const store_state = store.getState()
// 接口返回的play字段的内容
const plays = ref(null)
// 接口返回的rank字段的内容
const rank = ref(null)
// 赛果前面三项
const best_three_list = ref([])
// 塞果中间二项
const best_middle_list = ref([])
// 赛果最后二项
const last_three_list = ref([])

const sub_menu_type = MenuData.current_lv_2_menu.type

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
})

onMounted(() => {
  if(current_match.match_status == 2){
    // 加载赛果结果
    load_result(()=>{
      // 获取前三项的数据
      best_three(),
      // 获取中间二项的数据
      best_middle(),
      // 获取最后二项的数据
      last_three()

      // 虚拟泥地摩托车赛果只有6个结果,每行展示2个
      if(sub_menu_type.value == 1009 && plays.value && plays.value.length == 6) {
        let arr = lodash.chunk(plays.value, 2);
        best_three_list.value = arr[0]
        best_middle_list.value = arr[1]
        last_three_list.value = arr[2]
      }
    })
  }
})

// 赔率切换显示对应的赔率
const get_odds = (item,play_obj) => {
  let val = item.ov / 100000, hsw = play_obj.hsw;
  let ov = compute_value_by_cur_odd_type(val, null, hsw);
  return ov ? ov : '';
}
/**
 * 获取赛马最终结果
 */
const get_score_list = () => {
  let res = [];
  if(current_match && current_match.list && current_match.list.length){
    let last_win_obj = current_match.list[current_match.list.length - 1];
    if(last_win_obj){
      res.push(last_win_obj.ranking1);
      res.push(last_win_obj.ranking2);
      res.push(last_win_obj.ranking3);
    }
  }
  return res;
}
const sort_plays = (plays_) => {
  let new_plays = lodash.sortBy(plays_,(item)=>{
    return item.playId
  })
  plays.value = new_plays
}
/**
 *@description: 加载赛果页面
 *@param {Undefined}
 *@return {Undefined} undefined
 */
const load_result = (callback) => {
  // console.warn("虚拟体育赛果接口:get_virtual_matchResult");
  let params = {
    mid: match_mid
  }
  // 传值赛事id: mid
  api_common.get_virtual_matchResult(params).then( res => {
    let code = _.get(res,'code')
    if(code == 200){
      rank.value = _.get(res,'data.rank') || []
      plays.value = _.get(res,'data.plays')
      $emit('send_virtual_result_rank_data', rank.value)
      sort_plays(plays.value)
      if(callback){
        callback();
      }
    }else{
      rank.value = []
      plays.value = []
    }
  }).catch( err=> {
    console.error(err);
    rank.value = []
    plays.value = []
  })
}

// 赛果页面前三项
const best_three = () => {
  if(plays.value){
    best_three_list.value = plays.value.slice(0,3)
  }
}

// 赛果页面中间三项
const best_middle = () => {
  if(plays.value){
    best_middle_list.value = plays.value.slice(3,5)
  }
}

// 赛果页面最后2项
const last_three = () => {
    last_three_list.value = plays.value.slice(5,7)
}

// 对字段on:1/2加工为数组
const split_on = (val) => {
  return val.split('/');
}

onUnmounted(() => {
  unsubscribe()
})

</script>
 
<style scoped lang="scss">
  @import "../styles/result-page";
</style>