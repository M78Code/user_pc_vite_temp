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
  import { ref,onMounted,onUnmounted, watch } from 'vue';
  import _ from "lodash"
  import MatchListOuzhouClass from 'src/core/match-list-pc/match-ouzhou-list.js'
  import BaseData from "src/core/base-data/base-data.js";
  import { UserCtr,MenuData } from 'src/core/index.js'
  import { api_common } from "src/api/index.js";
  import DateTabClass from "src/base-pc/components/tab/date-tab/date-tab-class.js"

  const current_choose_tab = ref('');

  // 日期
  const current_filter_list = ref([{label: i18n_t("menu.match_today"),value:""}])

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
* 获取 日期 菜单
* nu/getDateMenuList
*/
async function get_date_menu_list() {
  let params =  DateTabClass.compute_get_date_menu_list_params();
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
  current_filter_list.value = [{label: i18n_t("menu.match_today"),value:""}, ...arr]
  DateTabClass.handle_click_menu_mi_3_date(current_filter_list.value[0])
}

watch(MenuData.menu_data_version,()=>{
  get_date_menu_list()
})
  /**
   * @param
   */
  const choose_filter_tab = item => {
    // 获取最新的 数据
    let redux_menu = _.cloneDeep(MatchListOuzhouClass.redux_menu) 
    // 修改菜单数据
    redux_menu.mid_tab_menu_type = item.value

    MatchListOuzhouClass.set_menu(redux_menu)

    current_choose_tab.value = item.value

    DateTabClass.handle_click_menu_mi_3_date(item)
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