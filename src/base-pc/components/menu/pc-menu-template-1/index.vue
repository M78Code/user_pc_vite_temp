<template>
  <div class="c-menu-sports menu-border">
    <div class="header relative-position">
      <!--   体育菜单-->
      <div class="menu-item menu-top menu-item-title disable-hover">
        {{ i18n_t('common.menu_title') }}
        <!-- <span @click="send_user">user</span> <span @click="send_vr">vr</span> <span @click="send_menu">菜单</span> -->
      </div>
      <!--   今日、早盘、 -->
      <div class="menu-item menu-tab disable-hover double">
        <div class="item yb-flex-center" :style="compute_css_obj(`today_menu_bg_1${jinri_zaopan_ == 2 ? '_active' : ''}`)" :class="jinri_zaopan_ == 2 ? 'active' : ''"
          @click="handle_click_jinri_zaopan(2)">
          {{ i18n_t("menu.match_today") }}
        </div>
        <div class="item yb-flex-center" :style="compute_css_obj(`today_menu_bg_1${jinri_zaopan_ == 3 ? '_active' : ''}`)" :class="jinri_zaopan_ == 3 ? 'active' : ''"
          @click="handle_click_jinri_zaopan(3)">
          {{ i18n_t("menu.match_early") }}
        </div>
      </div>
    </div>

    <div style="display: none;">{{ BaseData.base_data_version }}</div>
    <div v-for="item1 in BaseData.left_menu_base_mi_arr" :key="`${jinri_zaopan_}_${item1}`"
      :class="set_vr_or_guanjun_border(item1)">
      <!--   赛种-->
      <!-- {{ BaseData.filterSport_arr }} -- {{ BaseData.compute_sport_id(item1) }} -->
      <div v-if="item1 == 300 || lv_1_num(item1)" class="menu-item menu-fold1 search"
        :class="current_lv_1_mi == item1 ? 'y-active' : ''" @click="lev_1_click(item1)">
        <!-- icon -->
        <div class="row items-center">
          <span class="soprts_id_icon"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_${BaseData.compute_sport_id(item1)}` })"
            :alt="BaseData.menus_i18n_map[item1]"></span>

        </div>
        <div class="items-right row" style="flex-wrap: wrap">
          <div style="line-height: 1; flex: 1">
            <span class="menu-text">
              <!-- 名字 {{ item1 }} -->
              {{ BaseData.menus_i18n_map[item1] || "" }}
            </span>
          </div>
          <!-- 数字 显示    有些赛种不显示 -->
          <div class="col-right" style="min-width: 40px" v-if="BaseData.menus_i18n_map[item1]">
            <!-- 有滚球赛事  hl 今日&&存在滚球赛事时  展示live图标 -->
            <div class="live-text" :style="compute_css_obj('live_text')" v-if="jinri_zaopan_ == 2 && lv_1_num(item1) && BaseData.mi_gunqiu.includes(item1)" />
            <span class="match-count yb-family-odds" v-if="item1 != 300">{{
              lv_1_num(item1)
            }}</span>
          </div>
        </div>
      </div>

      <!--  子菜单  ，  开始    -->
      <!--  子菜单  ， 冠军 不显示子菜单  -->
      <!--  常规体育 含 娱乐     子菜单  开始    -->
      <div v-if="![400, 2000, 300].includes(item1)" class="menu-fold2-wrap"
        :class="current_lv_1_mi == item1 && !show_menu ? 'open' : ''">
        <!-- :class="current_lv_1_mi == item1 ? '' : ''" -->
        <template v-for="item2 in compute_item1_sublist_mi_100(item1)">
          <!--  常规赛种 （不含娱乐）  下的  玩法 （ 不含冠军 ）        开始   -->
          <div :key="`${jinri_zaopan_}_${item1}_${item2.mi}_100`" @click.stop="
            lv_2_click_wapper_1({ lv1_mi: item1, lv2_mi: item2.mi })
            " v-if="item1 != 118" v-show="item2['ct']" :class="current_lv_2_mi == item2.mi ? 'active' : ''"
            class="menu-item menu-fold2">
            <div class="row items-center relative-position">
              <span class="menu-point"></span>
              <span class="menu-text ellipsis">
                <!-- 名字{{ item2.mi }}  -->
                {{ BaseData.menus_i18n_map[item2.mi] || "" }}
              </span>
            </div>
            <div class="col-right relative-position" style="min-width: 40px">
              <span class="match-count yb-family-odds" v-if="item1 != 2000">
                {{ item2["ct"] }}</span>
            </div>
          </div>
          <!--  常规赛种 （不含娱乐）  下的  玩法 （ 不含冠军 ）        结束    -->
        </template>
       
        <!-- 常规赛种   （含娱乐）  增补  冠军玩法    开始 -->
        <div :key="`${jinri_zaopan_}_${item1}_guanjun_1`" @click.stop="lv_2_click_wapper_2({ lv1_mi: item1 })"
          v-if="BaseData.commn_sport_guanjun_obj[`mi_${item1}`]"
          v-show="BaseData.commn_sport_guanjun_obj[`mi_${item1}`]['ct']" :class="current_lv_2_mi ==
              BaseData.commn_sport_guanjun_obj[`mi_${item1}`]['mi']
              ? 'active'
              : ''
            " class="menu-item menu-fold2">
          <div class="row items-center relative-position">
            <span class="menu-point"></span>
            <span class="menu-text ellipsis">
              <!--国际化字段返回在  基础赛种  拼接 4 冠军专属后缀上   -->
              {{ BaseData.menus_i18n_map[`${item1}4`] || "" }}
            </span>
          </div>
          <div class="col-right relative-position" style="min-width: 40px">
            <span class="match-count yb-family-odds">
              {{ BaseData.commn_sport_guanjun_obj[`mi_${item1}`]["ct"] }}</span>
          </div>
        </div>
        <!-- 常规赛种   （含娱乐）  增补  冠军玩法      结束  -->
      </div>
      <!--  常规体育 含 娱乐    子菜单  结束     -->
      <!--  电竞    子菜单  开始    -->
      <div v-if="item1 == 2000" class="menu-fold2-wrap" :data-id="show_menu"
        :class="current_lv_1_mi == item1 && !show_menu ? 'open' : ''">
        <MenuItem :menu_list="compute_item1_sublist_mi_2000(item1)" type='2000' @click_wapper_handle="click_wapper_handle" 
          :current_lv_2_mi="current_lv_2_mi" />
      </div>
      <!--  电竞    子菜单   结束     -->
      <!--  VR    子菜单   开始     -->
      <div v-if="item1 == 300" class="menu-fold2-wrap" :data-id="show_menu"
        :class="current_lv_1_mi == item1 && !show_menu ? 'open' : ''">
        <MenuItem :menu_list="compute_item1_sublist_mi_300(item1)" type='300' @click_wapper_handle="click_wapper_handle" 
          :current_lv_2_mi="current_lv_2_mi" />
      </div>
      <!--  VR    子菜单   结束     -->
      <!--  子菜单  ，  结束     -->
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed,nextTick } from "vue";
import { useRoute, useRouter } from 'vue-router'
// 菜单配置
import { MenuData } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import BaseData from "src/core/base-data/base-data.js"
import { compute_css_variables } from "src/core/css-var/index.js"
import { compute_css_obj } from 'src/core/server-img/index.js'
import lodash_ from "lodash"

import MenuItem from "./menu-item.vue";


const route = useRoute();
const router = useRouter();
// 今日  2 早盘   3
const jinri_zaopan_ = ref(2);
// 当前的一级菜单ID
const current_lv_1_mi = ref(""); //"101",
// 当前的二级菜单ID
const current_lv_2_mi = ref(""); //"101201", // 101301
// 当前赛种是否收起 状态
const show_menu = ref(true);
// 首次进入 刷新用
const first_change = ref(false);


onMounted(() => {
  handle_click_jinri_zaopan(2)
})


/**
 * @description: 冠军 vr border 样式
 * @param {item} 赛种id
 * @return {undefined} undefined
 */
const set_vr_or_guanjun_border = computed(()=> item =>{
  // 菜单ID == 300 vr体育
  if(item == 300){
    return 'menu-b-border'
  }
  // 菜单ID 400 冠军
  if(item == 400){
    return 'menu-y-border'
  }
})

/**
 * @description: 今日 早盘 紧急开关
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const today_early = () => {
  const { lv2_mi, lv1_mi } = MenuData.left_menu_result;

  if (!BaseData.left_menu_base_mi_arr.includes(Number(lv1_mi))) {
    let params = {},
      mid_menu_show = { list_filter: true },
      has_mid_menu = true;
    params = {
      root: 1,
      lv1_mi: "",
      lv2_mi: 1,
      sports: "",
      guanjun: "",
    };
    // 设置左侧菜单输出
    MenuData.set_left_menu_result({
      ...params,
      mid_menu_show,
      has_mid_menu,
    });
  }
};
/**
 * @description: 电竞 vr 紧急开关
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const esports_vr_switch = () => {
  let params = {},
    mid_menu_show = { list_filter: true },
    has_mid_menu = true;
  // 电竞和 vr关闭后 需要跳转到滚球 (没有数据 也算是关)
  if (!BaseData.is_mi_2000_open || !BaseData.is_mi_300_open) {
    params = {
      root: 1,
      lv1_mi: "",
      lv2_mi: 1,
      sports: "",
      guanjun: "",
    };
  } else {
    let { lv2_mi, lv1_mi } = MenuData.left_menu_result;
    // 电竞 vr 部分关停

    // 判断 电竞 下面是否还有该 赛种
    if (MenuData.menu_root == 2000) {
      let esports =
        BaseData.dianjing_sublist.find((item) => item.mi == lv2_mi) ||
        {};
      if (esports.mi) {
        return;
      } else {
        params.lv2_mi = BaseData.dianjing_sublist[0].mi;
      }
    }
    // 判断 VR 下面是否还有该 赛种
    if (MenuData.menu_root == 300) {
      let vr_sports =
        BaseData.vr_mi_config.find((item) => item.menuId == lv2_mi) ||
        {};
      if (vr_sports.menuId) {
        return;
      } else {
        params.lv2_mi = BaseData.vr_mi_config[0].menuId;
      }
      return lv_2_click_wapper_4({ lv1_mi, lv2_mi: params.lv2_mi });
    }

    // 单个赛事关闭后
    params.root = MenuData.menu_root;
    params.lv1_mi = lv1_mi;
  }
  // 设置 中间 菜单输出
  MenuData.set_mid_menu_result(params);
  // 设置左侧菜单输出
  MenuData.set_left_menu_result({
    ...params,
    mid_menu_show,
    has_mid_menu,
  });
};
/**
 * @description: 挂载组件初始化各项属性和默认方法调用
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const when_created = async () => {
  const { lv1_mi, lv2_mi, root, jinri_zaopan } = MenuData.left_menu_result;

  //  min 菜单 没值
  //  因为 当前默认是点击 滚球  ，如果是默认 点金今日 足球  这里需要写逻辑
  //如果默认  滚球 / 热门    则在   src\project\yabo\pages\main_menu\main_menu.vue   点 滚球 / 热门
  //如果默认  早盘 /今日     则在    这里    点 早盘 /今日
  if (root) {
    if ([2, 3].includes(Number(root))) {
      jinri_zaopan_.value = jinri_zaopan;

      lev_1_click(lv1_mi, "", lv2_mi);
    } else if ([300, 400, 2000].includes(Number(root))) {
      lev_1_click(lv1_mi, "", lv2_mi);
    }
  } else {
    jinri_zaopan_.value = 2;

    lev_1_click("101", "", lv2_mi);
  }

  await nextTick();

  first_change.value = false;
};
/**
 * @description: 计算一级菜单下的 二级菜单  常规体育
 * @param {*} item1
 * @return {Array} 列表
 */
const compute_item1_sublist_mi_100 = (item1) => {
  //  jinri_zaopan
  item1 = "" + item1;
  let obj =
    BaseData.mew_menu_list_res.find((x) => x.mi == "" + item1) || {};
  let sub_list = [];
  if (item1 == 118) {
    // 娱乐
    sub_list = obj["sl"];
  } else {
    //常规体育
    // 整个菜单原始数据
    // 当前球类的 今日 或者 早盘
    let obj2 =
      (obj.sl || []).find((x) => x.mi == `${item1}${jinri_zaopan_.value}`) ||
      {};
    // 当前球类的 今日 或者 早盘  的 玩法数据
    sub_list = obj2["sl"] || [];
  }
  return sub_list;
};
/**
 * @description: 计算一级菜单下的 二级菜单    虚拟体育
 * @param {*} item1
 * @return {Array} 列表
 */
const compute_item1_sublist_mi_300 = () => {
  let obj = BaseData.mew_menu_list_res.find((x) => x.mi == 300) || {};
  return obj.sl
};
/**
 * @description: 计算一级菜单下的 二级菜单    电子竞技
 * @param {*} item1
 * @return {Array} 列表
 */
const compute_item1_sublist_mi_2000 = (item1) => {
  //  jinri_zaopan
  item1 = "" + item1;
  let obj =
    BaseData.mew_menu_list_res.find((x) => x.mi == "" + item1) || {};
  let sub_list = [];
  // 电竞
  sub_list = BaseData.dianjing_sublist;
  //     {
  //   "menu_id": 101302,
  //   "parent_id": 1013,
  //   "menu_name": "波胆",
  //   "euid": null
  // }
  return sub_list;
};

/**
 * @description: 一级菜单 点击 找到第一个有数的 菜单
 * @param {*} mi 一级菜单id
 * @param {*} jinri_zaopan  今日或早盘
 * @param {*} lv2 二级菜单id 作用于刷新页面
 * @return {*}
 */
const lev_1_click = (mi, jinri_zaopan, lv2) => {
  // show_menu 展开或者收起  收起是 true  展开是false
  // current_lv_1_mi 选中按钮  选中的情况下 点击一级菜单 收起或者展开
  // 收起的情况下 再次回来 还是收起 / 展开的情况下 再次回来还是展开
  if (!jinri_zaopan) {
    // 点击一级菜单
    if (current_lv_1_mi.value == mi) {
      // 一级菜单点击无效
      show_menu.value = !show_menu.value;
    } else {
      show_menu.value = false;
    }
  }

  // 今日 / 早盘 选中的情况下 点击无效
  if (jinri_zaopan_.value == jinri_zaopan && current_lv_1_mi.value == mi) {
    return false;
  }
  if (jinri_zaopan) {
    jinri_zaopan_.value = jinri_zaopan
  }
  // jinri_zaopan_.value  = jinri_zaopan ? jinri_zaopan : jinri_zaopan_;
  current_lv_1_mi.value = mi;
  current_lv_2_mi.value = "";

  // 刷新 不切换回列表
  if (!first_change.value) {
    // 详情切换 须回到列表页
    set_route_url();
  }
  if (mi == 400) {
    const { mid_menu_result } = MenuData;
    // 1级 冠军和vr体育 点击后默认为早盘
    jinri_zaopan_.value = 2;
    let mi;
    if (mid_menu_result.root && mid_menu_result.root == 400) {
      mi = mid_menu_result.mi;
    } else {
      mi = 400;
    }
    // // 设置      中间 菜单输出
    MenuData.set_mid_menu_result({
      root: 400,
      mi,
      sports: "guanjun",
      guanjun: "guanjun",
    });

    //冠军  没有子菜单  直接点击 冠军足球
    MenuData.set_left_menu_result({
      root: 400,
      lv1_mi: 400,
      lv2_mi: lv2 || "400",
      sports: "quanbu-guanjun",
      guanjun: "guanjun-common",
      mid_menu_show: {
        list_filter: true, // 滚球  冠军
      },
      has_mid_menu: true,
    });
    return;
  } else if (mi == 2000) {
    // 设置默认值
    let lv2_es = lv2 || "2100";
    // 默认值是否在 列表中
    let esports_mi =
      BaseData.dianjing_sublist.find((item) => item.mi == lv2_es) || {};
    if (!esports_mi.mi) {
      // 有默认值但是没有在列表中 选择列表中的第一个
      lv2_es = BaseData.dianjing_sublist[0].mi;
    }
    //电竞  直接点英雄联盟
    lv_2_click_wapper_3({
      lv1_mi: "2000",
      lv2_mi: lv2_es,
    });
    return;
  } else if (mi == 300) {
    // 1级 冠军和vr体育 点击后默认为早盘
    jinri_zaopan_.value = 2;

    // 拿vr的第一个数据 菜单id作为默认值
    let menuId = (BaseData.vr_mi_config[0] || {}).menuId || "1010";

    // 虚拟体育  直接点 VR足球
    lv_2_click_wapper_4({
      lv1_mi: "300",
      lv2_mi: lv2 || menuId,
    });
    return;
  } else if (mi == 118) {
    //  娱乐
    lv_2_click_wapper_2({
      lv1_mi: "118",
    });
    return;
  } else {
    // 常规体育
    let arr = compute_item1_sublist_mi_100(mi);
    let arr2 = arr.filter((x) => x.ct > 0);
    let fmi = "";
    if (arr2.length) {
      //有常规玩法
      fmi = arr2[0]["mi"];
      // 常规赛种 （不含娱乐）  下的  玩法 （ 不含冠军 ）
      lv_2_click_wapper_1({
        lv1_mi: mi,
        lv2_mi: lv2 || fmi,
      });
      current_lv_2_mi.value = fmi;
    } else {
      //常规赛种   （含娱乐）  的 冠军玩法     点击
      // 只能走冠军
      lv_2_click_wapper_2({
        lv1_mi: mi,
      });
    }
  }
};
/**
 *   常规赛种 （不含娱乐）  下的  玩法 （ 不含冠军 ）     点击
 *
 * @param {*} detail
 */
const lv_2_click_wapper_1 = (detail = {}) => {
  //当选择了近期开赛时间再点击其他球种时，需要置为全部
  // $store.state.filter.open_select_time = null ??????? todo
  // console.error(' BaseData.mi_info_map', BaseData.mi_info_map)
  let { lv1_mi, lv2_mi } = detail;
  // 父级euid
  // let { euid } = BaseData.mi_info_map[`mi_${lv1_mi}${jinri_zaopan}`];
  // 当前 pid 和 orpt
  // let lv2_mi_info = BaseData.mi_info_map[`mi_${lv2_mi}`];
  
  let root = jinri_zaopan_.value;
  let config = {
    root,
    lv1_mi,
    lv2_mi,
    sports: "common",
    guanjun: "",

    mid_menu_show: {
      list_filter_date: jinri_zaopan_.value == 3,
    },
  };

  //13列玩法菜单  足球 今日  早盘   13    get_unfold_multi_column

  //  (
  //      MenuData.is_multi_colum()&&
  //       store.getters.get_unfold_multi_column &&
  //       store.getters.get_layout_cur_page.cur == "home"
  //     ) {
  //       match_tpl_number = 13;
  //     }

  // 如果
  if (jinri_zaopan_.value != 3) {
    // 是否收藏
    let is_collect = false; // get_layout_list_type == "collect";
    //基础参数
    let base_params = {
      cuid: UserCtr.get_uid(), // ????
      selectionHour: "", // $store.state.filter.open_select_time,
      sort: "", //vx_match_sort, // ????
    };
    // 没有中间菜单
    let mid_menu_refer_params = {
      begin_request: true,
      is_collect,
      route: "list",
      root: root,
      sports: "common",
      guanjun: "",
      // 列表队列 接口
      match_list: {
        api_name: "post_league_list",
        params: {
          ...base_params,
          apiType: 1,
          // ...lv2_mi_info,
          // euid,
        },
      },
      version: Date.now(),
      //
      bymids: {
        api_name: "",
        api_type: "",
        params: {},
      },
    };
    config.mid_menu_refer_params = mid_menu_refer_params;
  }

  lv_2_click_common(config);
};
/**
 *  常规赛种   （含娱乐）  的 冠军玩法     点击
 *
 * @param {*} detail
 */
const lv_2_click_wapper_2 = (detail = {}) => {
  let { lv1_mi } = detail;
  MenuData.set_menu_current_mi(lv1_mi)
};
/**
 *      电竞    子菜单     点击
 *
 * @param {*} detail
 */
const lv_2_click_wapper_3 = (detail = {}) => {
  let { lv1_mi, lv2_mi } = detail;
  let config = {
    root: 2000,
    lv1_mi,
    lv2_mi,
    sports: "dianjing",
    guanjun: "",
    mid_menu_show: {
      esports_header: true,
    },
  };
  lv_2_click_common(config);
};
/**
 *      VR    子菜单     点击
 *
 * @param {*} detail
 */
const lv_2_click_wapper_4 = (detail = {}) => {
  let { lv1_mi, lv2_mi } = detail;
  let vr_obj =
    BaseData.mew_menu_list_res.find((item) => item.mi == 300 ) || {};
    let vr_obj_config = vr_obj.sl.find(item => item.mi == lv2_mi) || {}
  // console.log(vr_obj)
  // console.error(vr_obj,'-----------------------------------------------------');
  let config = {
    root: 300,
    route: "list",
    lv1_mi,
    lv2_mi,
    // begin_request: true,
    // is_collect: false,
    sports: "vr",
    guanjun: "",
    has_mid_menu: true,
    mid_menu_show: {
      virtual_list_sport_header: true,
      virtual_list_league_header: lv2_mi == 31001,
    },
    // match_list :{
    //   api_name: "post_fetch_virtual_matchs",
    //   params: {
    //     csid: vr_obj.csid,
    //     isLive: 1,
    //     selectionHour: null,
    //     tid: vr_obj["sl"][0]['tid'],
    //   },
    // }
  };

  let mid_menu_refer_params = {
    begin_request: true,
    is_collect: false,
    route: "list",
    root: "300",
    sports: "vr",
    guanjun: "",
    match_list: {
      api_name: "post_fetch_virtual_matchs",
      params: {
        tid: vr_obj_config.sl[0].mi,
        // isLive: 1,
        selectionHour: "", // $store.state.filter.open_select_time,
        csid: vr_obj_config.mi,
      },
    },
  };

  // lv_2_click_common(config);
  // // 设置      中间 菜单输出
  MenuData.set_left_menu_result(config);

  // // 设置   请求  列表结构  API 参数的  值
  MenuData.set_match_list_api_config(mid_menu_refer_params);
};
/**
 * 二级菜单点击
 * @param {*} mi
 */
const lv_2_click_common = (detail = {}) => {
  // 刷新 不切换回列表
  if (!first_change.value) {
    // 详情切换 须回到列表页
    set_route_url();
  }

  let {
    root, // 根mi
    lv1_mi,
    lv2_mi,
    sports,
    guanjun,
    mid_menu_show,
    mid_menu_refer_params,
  } = detail;

  if (current_lv_2_mi.value == lv2_mi) {
    return false;
  }

  current_lv_1_mi.value = lv1_mi;
  current_lv_2_mi.value = lv2_mi;

  // 获取 euid orpt tid
  let obj = BaseData.mi_info_map[`mi_${lv2_mi}`];
  //电子竞技没有 euis
  if (lv1_mi != 2000) {
    // 常规赛种 euid
    if (lv1_mi != 118) {
      let mid = `mi_${lv1_mi}${jinri_zaopan_.value}`;
      try {
        obj.euid = lodash_.get(BaseData.mi_info_map,`${mid}.euid`) || '';
      } catch (error) {
        
      }
    }
  }
  // 常规赛种下 冠军模板都是18
  if (guanjun == "common-guanjun") {
    obj.orpt = 18;
  }
  if (lv1_mi == 118) {
    // 娱乐冠军写死
    obj.euid = "3020112" || obj.euid;
  }

  let result = {
    // ...obj, // 有二级
    jinri_zaopan: jinri_zaopan_.value,
    root,
    lv1_mi,
    lv2_mi,
    sports,
    guanjun,
  };

  // 今日常规赛种 不包含 电子竞技
  if (jinri_zaopan_.value == 2 && lv1_mi != 2000) {
    // 统一处理
    const params = mid_menu_refer_params.match_list.params;
    mid_menu_refer_params.match_list.params = {
      ...params,
      ...obj,
    };
  }

  // 中间菜单显示配置
  result.mid_menu_show = {
    ...mid_menu_show,
  };
  // 是否有中间菜单 ，
  // 有则 需要显示中间菜单组件,需要 走中间菜单渲染 ，中间菜单负责输出 列表请求参数
  // 如果没有 需要逻辑分流计算 列表请求参数
  let has_mid_menu = Object.values(mid_menu_show).filter((x) => x).length > 0;
  result.has_mid_menu = has_mid_menu;
  if (!has_mid_menu) {
    //如果 没有中间菜单  ，则 需要传递 辅助计算 列表参数的 字段
    result.mid_menu_refer_params = mid_menu_refer_params;
  }
  // jinri_zaopan_men_result.value = result; ????????
  MenuData.set_menu_current_mi(lv2_mi)
  MenuData.set_left_menu_result(result);
};

/**
 * 一级菜单数量计算
 * @param {*} mi
 */
const lv_1_num = (mi) => {
  // console.warn("mi", mi);
  if (mi == 2000) {
    //电竞
    let sub_list = BaseData.dianjing_sublist || [];
    let num = 0;
    sub_list.map((x) => {
      //  1  滚球  3 早盘  4 冠军  合计得出总数
      num = num + lv_1_num_sublist_dianjing(x.mi);
    });
    return num;
  } else if ([118, 300].includes(1 * mi)) {
    //娱乐 和 VR
    let obj = BaseData.mew_menu_list_res.find((x) => x.mi == mi) || {};
    let sl = obj["sl"] || [];
    let n = 0;
    sl.map((x) => {
      n = n + x.ct;
    });
    return n;
  } else if (mi == 400) {
    // "冠军"
    let obj = BaseData.mew_menu_list_res.find((x) => x.mi == mi) || {};
    return obj["ct"];
  } else {
    //  今日 或者 早盘
    let changgui = compute_num(`${mi}${jinri_zaopan_.value}`, mi) || 0;
    // 冠军
    let guanjun = compute_num(`${mi}4`, mi) || 0;
    return changgui + guanjun;
  }
};
/**
 * 计算单个电竞赛种的  数量总数
 */
const lv_1_num_sublist_dianjing = (mi, mif) => {
  let obj = BaseData.mew_menu_list_res.find((x) => x.mi == mi) || {};
  let sl = obj["sl"] || [];
  let n = 0;
  //  1  滚球  3 早盘  4 冠军  合计得出总数
  // let arr = [`${mi}1`, `${mi}3`, `${mi}4`];
  sl.map((x) => {
    // if (arr.includes(x.mi)) {
    n = n + x.ct;
    // }
  });
  return n;
};
/**
 *   菜单数量计算  冠军  / 今日 或者 早盘
 * @param {*} mi
 */
const compute_num = (mi, mif) => {
  // console.error('BaseData',BaseData)
  //球类
  let obj = BaseData.mew_menu_list_res.find((x) => x.mi == mif) || {};
  //冠军
  let obj2 = (obj.sl || []).find((x) => x.mi == mi) || {};
  return obj2["ct"] || 0;
};

/**
 * 详情页回首页
 */
const set_route_url = () => {
  let { name } = route;
  if ((!route?.query?.flag) && ["details", "search", "video", "virtual_details"].includes(name)) {
    router.push({
      name: 'home'
    });
  }
  // set_layout_list_type("match");
  // set_filter_select_obj([]);
  first_change.value = false;
};
/**
 * 今日早盘按钮点击
 * @param {*} val
 */
const handle_click_jinri_zaopan = (val) => {
  set_route_url();

  let lv1_mi = current_lv_1_mi.value || "101";
  // 今日/早盘下的 冠军和VR 点击今日、早盘后 默认为足球
  if ([400, 300].includes(Number(MenuData.menu_root))) {
    lv1_mi = "101";
  }
  //current_lv_1_mi.value = ''
  lev_1_click(lv1_mi, val);
};

// 点击事件
// 2000 电竞  300 vr
const click_wapper_handle = obj =>{
  if(obj.type == 2000){
    lv_2_click_wapper_3(obj.config);
  }
  if(obj.type == 300){
    lv_2_click_wapper_4(obj.config);
  }
}
// 模拟推送
// const send_menu = () => {
//   BaseData.set_ws_send_new_menu_init()
// }
// const send_user = () => {
//   BaseData.set_ws_send_new_user_info_init()
// }
// const send_vr = () => {
//   BaseData.set_ws_send_new_vr_menu_init()
// }
</script>
<style lang="scss" scoped>
.c-main-menu {
  font-size: 13px;
  /* *** 头部 ************ -S */
  z-index: 211;
  width: 100%;



  /* *** 头部 ************ -E */
  .scroll-inner-wrap {
    margin-bottom: 10px;
  }

  /* *** 体育 ************ -S */
  .c-menu-sports {
    font-size: 13px;

    .menu-item {

     

      &.menu-tab {
        font-size: 13px;
        justify-content: space-around;
        padding: 0px;

        .item {
          border-radius: 8px;
          margin-right: 10px;
          white-space: nowrap;
          margin-right: 0!important;
          height: 38px!important;
          background-size: 100% 100%;
          min-width: 98px;
          padding-bottom: 4px;
          box-shadow: none!important;
          &:last-child {
            margin-right: 0;
          }

          &.active {
            font-weight: 600;
            font-size: 14px;
            color: var(--q-gb-t-c-18);
          }

          &.active1 {
            margin-left: 152px;
          }
        }
      }
      &.menu-fold1{

        &.y-active{
          background: var(--q-gb-bg-lg-8);
          color: var(--q-gb-t-c-15); 
        }
        &:hover{
          background: var(--q-gb-bg-lg-9);
        }
      }
      &.menu-fold2 {
        &.active{
          color: var(--q-gb-t-c-15); 
        }
      }

    }
    .menu-y-border{
      .menu-fold1{
        border-top:1px solid var(--q-gb-bd-c-8);
        border-bottom:1px solid var(--q-gb-bd-c-8);
        &.y-active{
          border: none;
        }
      }
     
      
    }
    .menu-b-border{
      .menu-fold1{
        border-bottom:1px solid var(--q-gb-bd-c-8);
        &.y-active{
          border: none;
        }
      }
     
    }
  }

  /* *** 体育 ************ -E */
  /* *** 公共 ************ -S */
  .menu-wrap {
    cursor: pointer;

    .no-click {
      cursor: auto;

      &:hover {
        background: none !important;
      }
    }

    .menu-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.active {
        font-weight: 700;
        border-bottom: 0;
      }

      .hot-icon {
        width: 14px;
        height: 14px;
        margin-right: 10px;
      }

      .menu-new-icon {
        margin: 0 0 3px 4px;
      }

      .match-count {
        padding-right: 15px;
        display: inline-block;
        width: 40px;
        text-align: right;
        max-width: 45px;
      }

      &.disable-hover {
        &:hover {
          background-color: transparent !important;
        }
      }

      &.menu-top {
        padding: 0 15px 0 16px;
        height: 40px;

        .match-count {
          padding-right: 0;
        }

        &.menu-virtual {
          .menu-name {
            margin-left: 10px;
          }
        }

        &.hot-menu {
          &:hover {
            background: none;
          }
        }

        &.item-bet {
          width: 200px;
          height: 36px;
          border-radius: 10px;
          border-right: 0;
          margin-left: 10px;
        }

        &.no-click {
          font-size: 12px;
        }
      }

      &.menu-fold1,
      &.menu-fold2 {
        padding-left: 16px;
        height: 36px;

        &.active {
          border-bottom: 0;

          & .items-right.menu-border {
            border-bottom: 1px solid transparent;
          }

          & .menu-border {
            border-bottom: 1px solid transparent;
          }
        }

        .league-logo {
          width: 18px;
          height: 18px;
        }

        .items-right {
          margin-left: 10px;
          flex: 1;
          align-items: center;
          justify-content: space-between;
          height: 100%;

          .live-text {
            position: relative;
            top: 2px;
            display: inline-block;
            width: 26px;
            height: 12px;
          }
        }
      }
    }

    /*  玩法 菜单项 */
    .menu-fold2-wrap {
      max-height: 0px;
      overflow: hidden;
      transition: max-height 0.2s;

      &.open {
        max-height: 500px;
      }

      .menu-fold2 {
        padding: 0 0 0 43px;
        border-right: 2px solid transparent;

        .menu-border {
          position: absolute;
          width: 128px;
          height: 1px;
          right: 0;
          bottom: 0;
        }

        .menu-point {
          position: absolute;
          left: -18px;
          width: 4px;
          height: 4px;
          border-radius: 100%;
        }

        .menu-text {
          max-width: 130px;
        }

        .match-count {
          padding-right: 13px;
        }

        &.menu-virtual {
          padding-left: 34px;
        }
      }
    }
  }

  .hot-menu-wrap {
    margin-top: 15px;

    .level2 {
      .menu-text {
        max-width: 170px;
      }
    }
  }

  .menu-normal-fixed-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    cursor: pointer;

    .left {
      padding-left: 15px;

      .icon-menu_show_normal {
        margin-right: 5px;
      }
    }

    .right {
      padding-right: 15px;
      height: 100%;

      .icon-close {
        transform: scale(0.7);
      }
    }

    &.normal-close {
      height: 32px;
      justify-content: center;

      .icon-close {
        transform: scale(0.7);
      }
    }
  }

  .bet-mode-zone {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 40px;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
      padding-left: 15px;

      .bet-single-count {
        border-radius: 10px;
        color: var(--q-gb-t-c-1);
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin-left: 5px;
        text-align: center;
        transform: scale(0.8);
      }
    }

    .right {
      display: flex;
      flex-wrap: nowrap;
      margin-right: 10px;

      .check-box {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        padding-left: 5px;
        padding-right: 5px;

        .check-wrap {
          padding: 0;
          margin-right: 5px;
        }
      }
    }
  }

  .tip-content {
    width: calc(100% - 20px);
    height: 100px;
    position: absolute;
    bottom: 0;
    z-index: 500;
    top: 40px;
    left: 10px;

    &.top-content {
      top: 5px;
    }

    .content-wrap {
      position: absolute;
      top: 6px;
      width: 100%;
      background: var(--q-gb-bg-c-4);
      border: 2px solid #ff781d;
      border-radius: 5px;

      .content {
        padding: 10px;
        font-size: 12px;

        .row-1,
        .row-2,
        .row-3 {
          color: #2d2d2d;
          text-align: center;
        }

        .row-1 {
          margin-bottom: 10px;
          font-size: 14px;
          color: #ff781d;
          font-weight: bold;
        }
      }

      .triangle,
      .triangle1 {
        position: absolute;
        background: var(--q-gb-bg-c-4);
        border: 2px solid #ff781d;
        border-top: 0;
        border-left: 0;
        width: 15px;
        height: 15px;
        transform: rotate(45deg);
        top: 81px;
        right: 22px;
      }

      .triangle1 {
        top: 116px;
      }

      .icon-del {
        position: absolute;
        top: 16px;
        right: 10px;
        cursor: pointer;
      }
    }
  }

  /* *** 公共 ************ -E */
}

// 后续删掉
.yb-flex-center {
  .active {
    color: #ff0000;
  }
}

.soprts_id_icon {
  width: 18px;
  height: 18px;
  background-size: 100% auto;
}
.menu-item-title{
  height: 32px!important;
  margin-bottom: 2px;
  font-size: 12px;
}
</style>