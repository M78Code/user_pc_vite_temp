<template>
  <div
    class="c-match-list-filter"
    :class="{
      'date-filter': menu_config.menu_root == 3,
      early: menu_config.menu_root == 3,
    }"
  >
    <!-- 滚球 -->
    <drag-scroll
      v-if="menu_config.menu_root == 1"
      class="item-wrap filter-sports"
      :class="$q.platform.is.ie && 'ie-browser'"
      ref="drag_scroll"
      :data-versin="BaseData.menu_version"
    >
      <!-- 全部 -->
      <div
        @click="
          handle_click_menu_mi_1({
            mi: '1',
            root: '1',
            sports: 'quanbu-gunqiu',
            guanjun: '',
          })
        "
        :class="current_menu == '1' ? 'active' : 'no-active'"
        v-if="GlobalAccessConfig.get_playAllShow()"
        class="item yb-flex-center"
      >
        <div class="icon-wrap list-filter menu-inline">
          <!-- <sport-icon :sport_id="0" size="20px" class="icon" /> -->
          <span class="soprts_id_icon"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_0` })"></span>
          <!-- 是否新上玩法 -->
          <!-- <img  class="menu-new-icon" v-if="menu.coppertone == 1" :src="`${LOCAL_PROJECT_FILE_PREFIX}/img/yabo/svg/virtual/menu_new.svg`"/> -->
        </div>
        <div
          class="name menu-inline name-margin-left"
          v-tooltip="{ content: i18n_t('common.all'), overflow: 1 }"
        >
          <span>{{ i18n_t("common.all") }}</span>
          <span class="count-text">{{ compute_quanbu_num_mi_1() }}</span>
        </div>
      </div>
      <!-- 常规球类 -->
      <template v-for="item in mi_100_arr">
        <div
          :key="`mi_100_arr_${item.mif}`"
          v-if="
            item.ct &&
            !BaseData.filterSport_arr.includes(
              '' + BaseData.compute_sport_id(item.mif)
            )
          "
          @click="
            handle_click_menu_mi_1({
              mi: item.mi,
              root: '1',
              mif: item.mif,
              sports: 'common',
              guanjun: '',
            })
          "
          :class="current_menu == item.mi ? 'active' : 'no-active'"
          class="item yb-flex-center"
        >
          <div class="icon-wrap list-filter menu-inline">
            <span class="soprts_id_icon"
            v-if="menu_config.is_esports()"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_${BaseData.compute_sport_id(item.mif)}` })"></span>
            <!-- 是否新上玩法 -->
            <!-- <img  class="menu-new-icon" v-if="menu.coppertone == 1" :src="`${LOCAL_PROJECT_FILE_PREFIX}/img/yabo/svg/virtual/menu_new.svg`"/> -->
          </div>
          <div
            class="name menu-inline name-margin-left"
            v-tooltip="{
              content: BaseData.menus_i18n_map[item.mif] || '',
              overflow: 1,
            }"
          >
            <span> {{ BaseData.menus_i18n_map[item.mif] || "" }} </span>
            <span class="count-text"> {{ item.ct }}</span>
          </div>
        </div>
      </template>
      <!-- 电竞  -->
      <template v-for="item in mi_2000_arr">
        <div
          :key="`mi_2000_arr_${item.mif}`"
          v-if="item.ct"
          @click="
            handle_click_menu_mi_1({
              mi: item.mi,
              mif: item.mif,
              root: '2000',
              sports: 'dianjing',
              guanjun: '',
            })
          "
          :class="current_menu == item.mi ? 'active' : 'no-active'"
          class="item yb-flex-center"
        >
          <div class="icon-wrap list-filter menu-inline">
            <!-- <sport-icon
              :sport_id="Number(item.mif) - 2000"
              size="20px"
              class="icon"
            /> -->
            <span class="soprts_id_icon"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_${Number(item.mif) - 2000}` })"></span>
            <!-- 是否新上玩法 -->
            <!-- <img  class="menu-new-icon" v-if="menu.coppertone == 1" :src="`${LOCAL_PROJECT_FILE_PREFIX}/img/yabo/svg/virtual/menu_new.svg`"/> -->
          </div>
          <div
            class="name menu-inline name-margin-left"
            v-tooltip="{
              content: BaseData.menus_i18n_map[item.mif] || '',
              overflow: 1,
            }"
          >
            <span>{{ BaseData.menus_i18n_map[item.mif] || "" }}</span>
            <span class="count-text"> {{ item.ct }}</span>
          </div>
        </div>
      </template>
      <!-- VR -->
      <template v-for="item in vr_menu_obj">
        <div
          v-if="item.count"
          :key="`vr_menu_obj_sl${item.menuId}`"
          class="item yb-flex-center"
          :class="current_menu == item.mi ? 'active' : 'no-active'"
          @click="
            handle_click_menu_mi_1({
              mi: item.menuId,
              menu: item.mi,
              root: '300',
              sports: 'vr',
              guanjun: '',
            })
          "
        >
          <!-- {{ item.mi }} -->
          <div class="icon-wrap list-filter menu-inline">
            <!-- <sport-icon :sport_id="item.menuId" size="20px" class="icon" /> -->
            <span class="soprts_id_icon"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_${item.menuId}` })"></span>
            <!-- 是否新上玩法 -->
            <!-- <img  class="menu-new-icon" v-if="menu.coppertone == 1" :src="`${LOCAL_PROJECT_FILE_PREFIX}/img/yabo/svg/virtual/menu_new.svg`"/> -->
          </div>
          <div
            class="name menu-inline name-margin-left"
            v-tooltip="{ content: item.name || '', overflow: 1 }"
          >
            <span>{{ item.name || "" }}</span>
            <span class="count-text">{{ item.count }}</span>
          </div>
        </div>
      </template>
    </drag-scroll>
    <!-- 冠军-球种  -->
    <drag-scroll
      v-if="menu_config.menu_root == 400"
      :data-id="menu_config.menu_root"
      class="item-wrap filter-sports"
      :class="$q.platform.is.ie && 'ie-browser'"
      ref="drag_scroll"
      :data-versin="BaseData.menu_version"
    >
      <!-- 全部 -->
      <div
        @click="
          handle_click_menu_mi_400({
            mi: '400',
            root: '400',
            sports: 'quanbu-guanjun',
            guanjun: 'guanjun-common',
          })
        "
        class="item yb-flex-center"
        :class="current_menu == '400' ? 'active' : 'no-active'"
      >
        <div class="icon-wrap list-filter menu-inline">
          <!-- <sport-icon :sport_id="0" size="20px" class="icon" /> -->
          <span class="soprts_id_icon"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_0` })"></span>
        </div>
        <div
          class="name menu-inline name-margin-left"
          v-tooltip="{ content: i18n_t('common.all'), overflow: 1 }"
        >
          <span>{{ i18n_t("common.all") }}</span>
          <span class="count-text">{{ compute_quanbu_num_mi_400() }}</span>
        </div>
      </div>
      <template v-for="item in mi_400_obj['sl']">
        <!--   no-active  active -->
        <div
          :key="item.mi"
          v-if="
            !BaseData.filterSport_arr.includes(
              '' + compute_mi_400_sl_mi_csid(item.mi)
            )
          "
          @click="
            handle_click_menu_mi_400({
              mi: item.mi,
              root: '400',
              sports: 'common',
              guanjun: 'guanjun-common',
            })
          "
          class="item yb-flex-center"
          :class="current_menu == item.mi ? 'active' : 'no-active'"
        >
          <div class="icon-wrap list-filter menu-inline">
            <span class="soprts_id_icon"
            v-if="menu_config.is_esports()"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_${compute_mi_400_sl_mi_csid(item.mi)}` })"></span>
            <!-- <sport-icon
              :sport_id="compute_mi_400_sl_mi_csid(item.mi)"
              size="20px"
              class="icon"
              :is_esports="true"
            /> -->
            <!-- 是否新上玩法 -->
            <!-- <img  class="menu-new-icon" v-if="menu.coppertone == 1" :src="`${LOCAL_PROJECT_FILE_PREFIX}/img/yabo/svg/virtual/menu_new.svg`"/> -->
          </div>
          <div
            class="name menu-inline name-margin-left"
            v-tooltip="{
              content: BaseData.menus_i18n_map[item.mi] || '',
              overflow: 1,
            }"
          >
            <span>{{ BaseData.menus_i18n_map[item.mi] || "" }}</span>
            <span class="count-text"> {{ item.ct }}</span>
          </div>
        </div>
      </template>
    </drag-scroll>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import GlobalAccessConfig from "src/core/access-config/access-config.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { get_match_status } from "src/core/utils/index";
import details from "src/core/match-list-pc/details-class/details.js";
import { other_play_name_to_playid } from "src/core/constant/config/data-class-ctr/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import menu_config from "src/core/menu-pc/menu-data-class.js";
import store from "src/store-redux/index.js";
import BaseData from "src/core/base-data/base-data.js";
import { i18n_t, MatchDetailCalss, PageSourceData,compute_css_obj } from "src/core/index.js";
import DragScroll from "src/base-pc/components/cus-scroll/drag_scroll.vue";

let state = store.getState();
// 当前页面来源信息
const { page_source } = PageSourceData;
const current_menu = ref({});
const mi_100_arr = ref([]);
const menu_mi = ref(1);
const drag_scroll = ref();
const mi_2000_arr = ref([]);
const mi_400_obj = ref([]);
const mi_500_obj = ref([]);
const vr_menu_obj = ref([]);
const route = useRoute();

set_init();
resolve_mew_menu_res();

watch(() => menu_config.menu_root, () => {
  resolve_mew_menu_res();
})

function set_init() {
  let mif = "",
    rootf = "";
  if (menu_config.menu_root == 1) {
    mif = 1;
    rootf = 1;
  } else {
    mif = 400;
    rootf = 400;
  }
  const { mi = mif, root = rootf } = menu_config.mid_menu_result;
  let obj = { mi, root };
  if (menu_config.menu_root == 400) {
    return handle_click_menu_mi_400({ ...obj, guanjun: "guanjun" });
  } else if (menu_config.menu_root == 1) {
    let sports = menu_mi.value == 1 ? "quanbu-gunqiu" : "common";
    console.log("menu_config.menu_root", obj, menu_mi);

    handle_click_menu_mi_1({ ...obj, sports });
  }
}
/**
 *全部 数量计算 滚球
 */
function compute_quanbu_num_mi_1() {
  // 常规的计算
  let num = 0;
  mi_100_arr.value.map((x) => {
    if (x.ct) {
      num += x.ct;
    }
  });
  //这个全部数量，应该只统计常规赛事的数量，不包含电子竞技和虚拟体育，
  //电竞
  // this.mi_2000_arr.map((x) => {
  //   num += x.ct;
  // });

  // vr 的计算
  // vr 数量是固定的
  // num += 19
  // let vr_sl = this.vr_menu_obj || [];
  // let vr_num = 0;
  // vr_sl.map((x) => {
  //   num += x.ct;
  // });
  return num;
}

/**
 * @Description:球种菜单切换  前置检查进程
 */
function handle_click_menu_mi_pre_process() {
  // if (drag_scroll && drag_scroll.is_move()) {
  //   return;
  // }
}

/**
 * 解析菜单数据
 */
  function resolve_mew_menu_res() {
  
  if (menu_config.menu_root == 500) {
    //热门
    resolve_mew_menu_res_mi_500();
  } else if (menu_config.menu_root == 1) {
    //滚球  常规 +电竞
    resolve_mew_menu_res_mi_100_2000();
  } else if (menu_config.menu_root == 400) {
    // 冠军
    resolve_mew_menu_res_mi_400();
  }

}
/**
 * 解析 新接口返回值     常规 +电竞
 */
function resolve_mew_menu_res_mi_100_2000() {
  //过滤常规球类
  let mi_100_list = [];
  let mi_2000_list = [];
  // 遍历 新菜单数据
  BaseData.mew_menu_list_res.map((x) => {
    // 拿到 基础赛种 id
    let mif = 1 * x.mi;
    //常规体育
    if (BaseData.left_menu_base_mi_arr.includes(mif)) {
      // 滚球对象
      let item = (x["sl"] || []).find((y) => y.mi == `${mif}1`) || {};
      item.mif = mif;
      mi_100_list.push(item);
    }
    //电竞
    if (BaseData.sports_mi.includes(mif)) {
      // 滚球对象
      let item = (x["sl"] || []).find((y) => y.mi == `${mif}1`) || {};
      item.mif = mif;
      mi_2000_arr.value.push(item);
    }
  });
  //常规体育
  mi_100_arr.value = mi_100_list;
  //电竞
  mi_2000_arr.value = mi_2000_list;
  //  VR  体育的
  vr_menu_obj.value = BaseData.vr_mi_config || [];
}

/**
 * 解析 新接口返回值  热门
 */
function resolve_mew_menu_res_mi_500() {
  mi_500_obj.value = BaseData.mew_menu_list_res.find((x) => x.mi == 500) || {
    sl: [],
  };
}
/**
 * 滚球 全部 euid 计算
 */
function compute_quanbu_euid() {
  //  console.warn('BaseData',BaseData)
  //  console.warn('mi_100_arr',this.mi_100_arr)
  //全部 euid
  let euids = [];
  //全部 csid
  let csids = [];
  // 常规的计算

  mi_100_arr.value.map((x) => {
    let obj = BaseData.mi_info_map[`mi_${x.mi}`] || {};
    euids.push(obj.euid);
  });
  //电竞
  mi_2000_arr.value.map((x) => {
    let obj = BaseData.mi_info_map[`mi_${x.mi}`] || {};
    euids.push(obj.euid);
  });
  euids = euids.filter((item) => item);
  return {
    csids: euids,
    csid: euids.join(","),
    euids: euids,
    euid: euids.join(","),
  };
}
/**
 * 解析 新接口返回值  冠军页面
 */
function resolve_mew_menu_res_mi_400() {
  mi_400_obj.value = BaseData.mew_menu_list_res.find((x) => x.mi == 400) || {
    sl: [],
  };
}
/**
 *全部 数量计算 冠军
  */
function compute_quanbu_num_mi_400() {
  return mi_400_obj.value["ct"];
  //  赛种过滤
  //  return vr_num + changgui_num;
}
/**
 * 冠军赛事的 CSID 计算  ，这里理论上是常规体育冠军
 * 电竞的冠军 和娱乐 目前都是分离的
 *
 * 确保一下冠军 有没有其他球类 例如 电竞等
 */
function compute_mi_400_sl_mi_csid(mi) {
  return parseInt(mi) - 400;
}
/**
 * 单个菜单按钮点击   滚球 的
 */
function handle_click_menu_mi_1(detail = {}) {
  handle_click_menu_mi_pre_process();
  // { mi:'',   root:'',   sports:'',  guanjun:'' }
  let {
    mif,
    mi, //当前的菜单
    root, //root 菜单
    sports,
    menu,
    guanjun,
  } = detail;
  resolve_mew_menu_res_mi_100_2000();
  // 滚球全部关闭的情况下 顺移到下一个
  if (mi == 1 && !GlobalAccessConfig.get_playAllShow()) {
    // resolve_mew_menu_res_mi_100_2000();
    mi = (mi_100_arr.value[0] || {}).mi;
    sports = "common";
  }
  current_menu.value = mi;
  // vr 使用 自定义 mi
  if (root == 300) {
    current_menu.value = menu;
  }
  if (mi != 1) {
    menu_mi.value = mi;
  }
  let route = "list";
  let mi_info = BaseData.mi_info_map[`mi_${mi}`] || {};
  //     请求  列表结构  API 参数的   模板
  let params = {};
  let obj = {};
  //全部
  if (GlobalAccessConfig.get_playAllShow()) {
    obj = compute_quanbu_euid();
  } else {
    BaseData.mi_info_map[`mi_${mi}`] || {};
  }
  //滚球
  if (mi == 1) {
    params = {
      csid: obj.csid,
      quanbu: obj,
      mi: 1,
      is_quanbu: 1,
      euid: obj.euid,
      root, //root 菜单
      sports,
      route,
      guanjun: "",
    };
  } else {
    params = {
      ...mi_info,
      root, //root 菜单
      sports,
      route,
      mi,
      mif,
      guanjun: "",
    };
  }
  //发起请求
  let begin_request = true;
  // 是否收藏
  let is_collect = false;
  // 列表队列 接口
  let match_list = {
    api_name: "api 方法名字   api_match 的 子方法名字",
    params: {},
  };
  // bymids 接口  基本参数
  let bymids = {
    api_name: "api 方法名字   api_match 的 子方法名字",
    params: {},
  };
  //基础参数
  let base_params = {
    cuid: UserCtr.get_cuid(),
    selectionHour: null,
    sort: GlobalAccessConfig.get_sortCut(),
    apiType: 1,
    orpt: -1,
    tid: "",
  };
  if (sports == "quanbu-gunqiu") {
    //滚球    全部
    match_list = {
      api_name: "post_fetch_match_list",
      params: {
        ...base_params,
        euid: obj.euid,
      },
    };
  } else if (sports == "common") {
    //滚球    常规体育
    match_list = {
      api_name: "post_fetch_match_list",
      params: {
        ...base_params,
        apiType: 1,
        orpt: -1,
        euid: mi_info.euid,
      },
    };
  } else if (sports == "dianjing") {
    //滚球    电竞
    match_list = {
      api_name: "post_fetch_esports_play_matchs",
      params: {
        ...base_params,
        category: 1,
        csid: ("" + mif).substring(1),
        isLive: 1,
      },
    };
  } else if (sports == "vr") {
    //滚球    虚拟体育
    let vr_obj = BaseData.vr_mi_config.find((item) => mi == item.menuId) || {};
    let vr_tid = vr_obj.subList[0].field1 || "";
    match_list = {
      api_name: "post_fetch_virtual_matchs",
      params: {
        csid: vr_obj.menuId,
        isLive: 1,
        selectionHour: null,
        tid: vr_tid,
      },
    };
  }
  let config = {
    begin_request,
    is_collect,
    route,
    root,
    sports,
    guanjun: guanjun || "",
    match_list,
    bymids,
  };
  // 设置      中间 菜单输出
  menu_config.set_mid_menu_result(params);
  // 设置   请求  列表结构  API 参数的  值
  menu_config.set_match_list_api_config(config);
}
/**
 * 单个菜单按钮点击  冠军的
 */
function handle_click_menu_mi_400(detail = {}) {
  handle_click_menu_mi_pre_process();
  let {
    mi, //当前的菜单
    root, //root 菜单
    sports,
    guanjun,
  } = detail;
  let route = "list";
  let mi_info = BaseData.mi_info_map[`mi_${mi}`] || {};
  current_menu.value = mi;
  let params = {
    ...detail,
    mi,
  };
  let base_params = {
    cuid: UserCtr.get_cuid(),
    selectionHour: null,
    sort: GlobalAccessConfig.get_sortCut(),
    apiType: 1,
    orpt: -1,
    orpt: 18,
    sportId: "",
  };
  // 是否收藏
  let is_collect = false;
  // 列表队列 接口
  let match_list = {
    api_name: "api 方法名字   api_match 的 子方法名字",
    params: {},
  };
  // bymids 接口  基本参数
  let bymids = {
    api_name: "api 方法名字   api_match 的 子方法名字",
    params: {},
  };
  //冠军   全部
  if (mi == 400) {
    // 全部
    params = {
      mi: 400,
      sportId: "",
      orpt: 18,
      cuid: UserCtr.get_cuid(),
      selectionHour: null,
      apiType: 1,
      sort: GlobalAccessConfig.get_sortCut(),
    };
    // 冠军全部后端没有做过滤 前端进行过滤处理
    // let sportId = this.mi_400_obj['sl'].map(item=> (1 * item.mi - 400)) || []
    // // 当前有冠军赛事的赛种id集合
    // params.sportId = sportId.join(',')
    // 注释上面代码 前端增加对应球种参数，返回的结果排序是乱的 后端为冠军全部做赛事过滤
    match_list = {
      api_name: "post_champion_list",
      params: {
        ...params,
      },
    };
  } else {
    let csid = "" + (1 * mi - 400);
    params = {
      ...mi_info,
      mi,
      csid: "" + (1 * mi - 400), //冠军常规体育类型的 菜单计算覆写
      orpt: 18,
      root: 400,
    };
    match_list = {
      api_name: "post_champion_list",
      params: {
        ...base_params,
        sportId: csid,
      },
    };
  }
  let config = {
    begin_request: true,
    is_collect,
    route,
    root,
    sports,
    guanjun,
    match_list,
    bymids,
  };
  // 设置      中间 菜单输出
  menu_config.set_mid_menu_result(params);
  // 设置   请求  列表结构  API 参数的  值
  menu_config.set_match_list_api_config(config);
}
</script>
<style lang="scss" scoped>
.c-match-list-filter {
  width: 100%;
  height: 48px;
  padding-bottom: 1px;
  .more-btn {
    z-index: 10;
    width: 30px;
    height: 100%;
    cursor: pointer;
  }
  .filter-sports {
    overflow: hidden;
    .item {
      max-width: 140px;
      min-width: 80px;
      height: 30px;
      padding: 5px;
      flex-shrink: 0;
      cursor: pointer;
      margin: 10px 3px;
      .icon-wrap {
        position: relative;
        .menu-new-icon {
          position: absolute;
          top: 0;
          left: 30px;
        }
        .icon-select {
          visibility: hidden;
          bottom: -6px;
          right: -5px;
        }
      }
      .count-text {
        padding-left: 2px;
        padding-right: 3px;
      }
      .text-active {
        color: #fff;
      }
      .menu-inline {
        display: inline-block;
      }
      .name-margin-left {
        margin-left: 5px;
      }
      .name {
        margin-top: 1px;
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 13px;
        .count {
          display: inline-block;
        }
      }
      &.active {
        .icon-select {
          visibility: visible;
        }
      }
    }
  }
  &.date-filter {
    height: 50px;
    font-size: 14px;
  }
}
</style>
