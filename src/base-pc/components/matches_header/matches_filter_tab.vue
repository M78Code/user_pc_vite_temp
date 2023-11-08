<!--
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-15 19:17:42
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-07-16 21:06:06
 * @FilePath       : \user-pc-vue3\src\components\matches_header\matches_filter_tab.vue
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="current-filter-wrap">
    <div class="current-filter-tab" v-for="(item, index) in current_filter_list" :key="item.value">
      <div class="filter-label" @click="choose_filter_tab(item)" :class="{ 'checked': current_choose_tab == item.value }">
        {{ item.label }}
        <div class="current-mark" :class="{'show-mark': current_choose_tab == item.value}"></div>
      </div>
      <div class="filter-tab-split-line" v-show="index != current_filter_list.length - 1"></div>
    </div>
  </div>
</template>

<script setup>
  import { api_base_data } from "src/api/index.js";
  import { ref,onMounted,onUnmounted } from 'vue';
  import _ from "lodash"
  import { utils } from "src/base-pc/utils/utils";
  import MatchListOuzhouClass from 'src/core/match-list-pc/match-ouzhou-list.js'

  const current_choose_tab = ref('');

  // 日期
  const current_filter_list = ref([{label:"Today",value:""}])

  onMounted(()=>{
    // 获取最新的 数据
    let redux_menu = _.cloneDeep(MatchListOuzhouClass.redux_menu) 
    // 修改菜单数据
    //redux_menu.mid_tab_menu_type = ''

    MatchListOuzhouClass.set_menu(redux_menu)
  })
 
 const set_time = ref(0) 
 const menu_id = ref(0)

  // 监听 tab切换变化
let un_subscribe = () => {
  const { menu_id_euid_ealy,mid_tab_menu_type,menu_root,menu_left } = MatchListOuzhouClass.redux_menu

  // 切换赛种后 初始化
  if(!mid_tab_menu_type){
    current_choose_tab.value = ''
  }
  // 左侧菜单切换 并且 赛种id不能相同
  if( menu_root == 4 && (menu_id.value != menu_left )){
    menu_id.value = menu_left
    clearTimeout(set_time.value)
    // 节流
    set_time.value = setTimeout(() => {
      get_sport_ealy_date(menu_id_euid_ealy)
    }, 800);
  }

};


/**
 * 接口返回数据的 wapper
 */
const set_ses_wapper = (res, default_value) => {
  let result = default_value;
  let data = (res || {}).data;
  if (data && (data.code == "0000000" || data.code == "200")) {
    result = data.data;
  }
  return result;
}

const get_sport_ealy_date = async euid => {

  let result = []
  const _obj = {
    axios_api: api_base_data.post_date_menu,
    error_codes:['0401038'],
    params: { euid },
    time:2000,
    max_loop:1,
    fun_then: res => {
      result = _.get(res, "data.data");
      const date_list = []
      
      result.forEach(item=>{
        if(item.field1){
          date_list.push({
            value:item.field1,
            label:item.menuName,
            count: item.count
          })
        }
      })

      current_filter_list.value = [{label:"Today",value:""},...date_list]

    },
    fun_catch: err => {
      // 连续3次请求无响应则返回列表页
      current_filter_list.value = [{label:"Today",value:""}]
    }
  }

  utils.axios_api_loop(_obj);
  
}

  
  /**
   * @param
   */
  const choose_filter_tab = payload => {
    // 获取最新的 数据
    let redux_menu = _.cloneDeep(MatchListOuzhouClass.redux_menu) 
    // 修改菜单数据
    redux_menu.mid_tab_menu_type = payload.value

    MatchListOuzhouClass.set_menu(redux_menu)

    current_choose_tab.value = payload.value
    
  }

  onUnmounted(()=>{
    un_subscribe()
  })

</script>

<style lang="scss" scoped>

  .current-filter-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    height: 44px;
    background: #FFFFFF;
    padding-left: 18.25px;
  }

  .current-filter-tab {
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .filter-label {
    display: flex;
    height: 100%;
    position: relative;
    align-items: center;
    font-size: 13px;
    color: #8A8986;
  }

  .checked {
    color: #1A1A1A;
    font-weight: 500;
    font-size: 13px;
  }

  .filter-tab-split-line {
    width: 1px;
    height: 12px;
    background: #D9D9D9;
    margin: 0 16px;
  }

  .current-mark {
    width: 8px;
    height: 8px;
    // border-radius: 4px 4px 0 0;
    position: absolute;
    bottom: 0px;
    left: 50%;
    display: none;
    margin-left: -4px;
    background: #FF7000;
    clip-path: circle(50% at 50% 100%);
  }
  .show-mark {
    display: block;
  }
</style>