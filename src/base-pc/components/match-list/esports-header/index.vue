<template>
  <!-- 电竞背景图 sportsbg-csid -->
  <!-- :class="`sportsbg-${current_menu.csid}`" -->
  <div
    class="c-esports-header"
    :style="compute_css_obj(`pc-img-esports-${current_menu.csid}-banner`)"
    v-show="MenuData.is_esports()"
  >
    <!-- 游戏种类列表 -->
    <div class="sport-tab">
      <div
        class="sport-item"
        :class="{ active: current_menu.mi == item.mi }"
        v-for="item in dianjing_sublist"
        :key="item.csid"
        @click="sport_click(item)"
      >
        <!-- 游戏logo -->
        <sport-icon :sport_id="item.csid" status="2" size="24px" />
        <!-- 游戏名称-->
        <div class="sport-name">
          <!-- {{ current_menu.mi }} -->
          {{ menus_i18n_map[item.mi] }}
        </div>
      </div>
    </div>
    <!-- 日期列表 -->
    <div class="date-wrap">
      <DateTab />
    </div>
  </div>
</template>
<script setup>
import { onMounted,ref,watch } from "vue";
import DateTab from "src/base-pc/components/tab/date-tab/index.vue";
import BaseData from "src/core/base-data/base-data.js";
import { compute_css_obj } from "src/core/server-img/index.js";
import { MenuData } from "src/output/index.js";
import sportIcon from "src/components/sport_icon/sport-icon.vue";
const current_menu = ref({});
const dianjing_sublist = ref(BaseData.dianjing_sublist);
const menus_i18n_map = ref(BaseData.menus_i18n_map);

const props = defineProps({});

onMounted(() => {
  //解析菜单数据
  const { left_menu_result } = MenuData;
  current_menu.value =
    dianjing_sublist.value.find((item) => item.mi == left_menu_result.lv2_mi) ||
    {};
  sport_click(current_menu.value);
});
/**
 * @Description 球种点击
 * @param {undefined} undefined
 */
function sport_click(item) {
  // console.error("sport_click------",item)
  current_menu.value = { ...item };
  // 是否收藏
  let is_collect = false; // this.get_layout_list_type == "collect";
  let mi_info = BaseData.mi_info_map[`mi_${item.mi}`] || {};
  let params = {
    ...mi_info,
    mi: item.mi,
    csid: item.csid,
  };
  let config = {
    begin_request: false,
    is_collect,
    route: "list",
    root: "2000",
    sports: "",
    guanjun: "",
    // 列表队列 接口
    match_list: {
      api_name: "post_fetch_esports_matchs",
      api_type: "",
      params: {},
    },
    //
    bymids: {
      api_name: "",
      api_type: "",
      params: {},
    },
  };
  // 设置      左侧 菜单输出
  MenuData.set_left_menu_result({
    ...MenuData.left_menu_result,
    lv2_mi: item.mi,
  });
  // 设置     中间 菜单输出
  MenuData.set_mid_menu_result(params);
  // 设置   请求  列表结构  API 参数的  值
  // MenuData.set_match_list_api_config(config);
}

// watch(MenuData.menu_data_version,()=>{
//   const { left_menu_result } = MenuData;
//   if( current_menu.value?.mi!=left_menu_result.lv2_mi){
//     current_menu.value =
//       dianjing_sublist.value.find((item) => item.mi == left_menu_result.lv2_mi) ||
//       {};
//     sport_click(current_menu.value);
//   }
// })
/**
 * @Description 日期菜单点击
 * @param {undefined} undefined
 */
function tab_click(obj) {
  // 如果列表数据在加载中
  if (props.load_data_state == "loading") {
    return;
  }
}
</script>
<style lang="scss">
  @import url('./esports-header.scss');
</style>
<style lang="scss" scoped>
.c-esports-header {
  border-radius: 0 0 6px 6px;
  position: relative;
  width: 100%;
  background-size: 100% auto;
  padding-top: 56px;
  z-index: -1;
  .sport-tab {
    height: 118px;
    display: flex;
    margin-left: 20px;
    height: 60px;
    .sport-item {
      width: 80px;
      height: 100%;
      border-radius: 4px 4px 0 0;
      text-align: center;
      line-height: 14px;
      cursor: pointer;
      .sport-img {
        margin: 6px auto;
        display: block;
        background-image: url($SCSSPROJECTPATH+"/image/common/png/elf_esports.png");
      }
      &.active {
        .sport-img {
          background-image: url($SCSSPROJECTPATH+"/image/common/png/sport_old_icon.png");
        }
      }
    }
  }
  .date-wrap {
    border-radius: 0 0 6px 6px;
    border: 1px solid var(--qq--gb-bd-c-3);
    border-top: 0;
    height: 40px;
    padding-left: 10px;
    font-size: 14px;
  }
  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    height: 10px;
    width: 100%;
    background-color: var(--qq--gb-bd-c-3);
    z-index: -1;
  }
}
</style>