<template>
  <div class="current-filter-wrap">
    <div class="current-filter-tab" v-for="(item, index) in current_filter_list" :key="item.value">
      <div class="filter-label" @click="choose_filter_tab(item, index)" :class="{ 'checked': current_choose_tab == item.value }">
        {{ item.label }}
        <div class="current-mark" :class="{'show-mark': current_choose_tab == item.value}"></div>
      </div>
      <div class="filter-tab-split-line" v-show="index != current_filter_list.length - 1"></div>
    </div>
  </div>
</template>

<script setup>
  import { ref,onMounted,onUnmounted, watch, nextTick } from 'vue';
  import _ from "lodash"
  import MatchListOuzhouClass from 'src/core/match-list-pc/match-ouzhou-list.js'
  import BaseData from "src/core/base-data/base-data.js";
  import { UserCtr,MenuData } from 'src/core/index.js'
  import { api_common } from "src/api/index.js";

  const current_choose_tab = ref('');

  // 日期
  const current_filter_list = ref([{label:"Today",value:""}])

  onMounted(()=>{
    // 获取最新的 数据
    let redux_menu = _.cloneDeep(MatchListOuzhouClass.redux_menu) 
    // 修改菜单数据
    //redux_menu.mid_tab_menu_type = ''
    MatchListOuzhouClass.set_menu(redux_menu)
    get_date_menu_list()
  })
 
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
  }

};

/**
 * 计算 日期 接口 请求参数
 */
 function compute_get_date_menu_list_params() {
  let params = {};
  let left_menu_result = MenuData.left_menu_result;
  let {
    lv1_mi,
    lv2_mi,
    euid,
    tid = "",
  } = left_menu_result;
  if (lv1_mi == 2000) {
    //  早盘 或者 今日的  电竞
    let csid = parseInt(lv2_mi) - 2000;
    params = {
      csid,
      device: "PC_PRO",
    };
  } else {
    // 早盘 的 请求 euid 是 赛种  +3 对应的 euid 不是 玩法对应的
    let mi_euid = BaseData.mi_info_map[`mi_${lv1_mi}3`] || {};
    // orpt // pis
    let mi_info = BaseData.mi_info_map[`mi_${lv2_mi}`] || {};
    if (lv1_mi == 118) {
      euid = '3020212'
    }
    // 早盘的 其他 常规赛种
    params = {
      apiType: 1,
      cuid: UserCtr.get_uid(), //用户 id
      device: "PC",
      ...mi_info,
      euid: mi_euid.euid || euid, // lv2_mi 找到 euid
      md: '',
      selectionHour: null,
      sort: 1,
      tid,
    };
  }
  return params;
}
/**
* 获取 日期 菜单
* nu/getDateMenuList
*/
async function get_date_menu_list() {
  let params = compute_get_date_menu_list_params();
  let api_fn_name = ''
  if (MenuData.is_export()) {
    //电竞
    api_fn_name = "get_esports_date_menu"
  } else {
    api_fn_name = "post_date_menu"
  }
  let res = await api_common[api_fn_name](params);
  let data = res.data;
  let arr = [];
  if (Array.isArray(data)) {
    data.map((x) => {
      if(x.field1){
        arr.push({
          count: x.count,
          value: x.field1,
          label: x.menuName,
        });
     }
    });
  }
  current_filter_list.value = [{label:"Today",value:""}, ...arr]
  handle_click_menu_mi_3_date(current_filter_list.value[0], 0)
}

watch(MenuData.menu_data_version,()=>{
  nextTick(()=>{
    get_date_menu_list()
  })
})
  
  /**
   * @param
   */
  const choose_filter_tab = (item, index) => {
    // 获取最新的 数据
    let redux_menu = _.cloneDeep(MatchListOuzhouClass.redux_menu) 
    // 修改菜单数据
    redux_menu.mid_tab_menu_type = item.value

    MatchListOuzhouClass.set_menu(redux_menu)

    current_choose_tab.value = item.value

    handle_click_menu_mi_3_date(item, index)
  }

  /**
 *  早盘 的 日期 菜单点击
 */
function handle_click_menu_mi_3_date (detail = {}) {
  let { md, index } = detail;
  let root = MenuData.menu_root;
  let { lv2_mi, lv1_mi } = MenuData.left_menu_result
  // 当前 pid 和 orpt
  let lv2_mi_info = BaseData.mi_info_map[`mi_${lv2_mi}`];
  // 父级euid
  let euid;
  if (root != 2000) {
    // 娱乐
    if (lv1_mi == 118) {
      euid = '3020212' || BaseData.mi_info_map[`mi_${lv2_mi}`].euid;
    } else {
      euid = BaseData.mi_info_map[`mi_${lv1_mi}${root}`].euid
    }
  }
  let params = { ...lv2_mi_info, lv2_mi, md, euid };
  MenuData.set_mid_menu_result(params);
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