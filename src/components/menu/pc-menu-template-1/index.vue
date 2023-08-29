<template>
  <div class="c-menu-sports menu-border">
    <div class="header relative-position">
      <!--   体育菜单-->
      <div class="menu-item menu-top menu-item-title disable-hover">
        <!-- {{ i18n.t('common.menu_title') }} -->
        体育菜单
        <!-- <span @click="send_user">user</span> <span @click="send_vr">vr</span> <span @click="send_menu">菜单</span> -->
      </div>
      <!--   今日、早盘、 -->
      <div class="menu-item menu-tab disable-hover double">
        <div
          class="item yb-flex-center"
          :class="jinri_zaopan == 2 ? 'active' : ''"
          @click="handle_click_jinri_zaopan(2)"
        >
          今日
          <!-- {{ i18n.t("menu.match_today") }} -->
        </div>
        <div
          class="item yb-flex-center"
          :class="jinri_zaopan == 3 ? 'active' : ''"
          @click="handle_click_jinri_zaopan(3)"
        >
          早盘
          <!-- {{ i18n.t("menu.match_early") }} -->
        </div>
      </div>
    </div>

    <div style="display: none;">{{ base_data.base_data_version }}</div>

    <div
      v-for="item1 in base_data.left_menu_base_mi_arr"
      :key="`${jinri_zaopan}_${item1}`"
      :class="base_data.is_mi_300_open && item1 == 400 ? 'menu-border' : ''"
    >
      <!--   赛种-->
      <!-- {{ base_data.filterSport_arr }} -- {{ base_data.compute_sport_id(item1) }} -->
      <div
        v-if="item1 == 300 || lv_1_num(item1)"
        class="menu-item menu-fold1 search"
        :class="current_lv_1_mi == item1 ? 'y-active' : ''"
        @click="lev_1_click(item1)"
      >
        <!-- icon -->
        <div class="row items-center">
          <sport-icon
            :sport_id="base_data.compute_sport_id(item1)"
            size="18px"
            class="icon"
            status="2"
          />
        </div>
        <div class="items-right row" style="flex-wrap: wrap">
          <div style="line-height: 1; flex: 1">
            <span class="menu-text">
              <!-- 名字 {{ item1 }} -->
              {{ base_data.menus_i18n_map[item1] || "" }}
            </span>
          </div>
          <!-- 数字 显示    有些赛种不显示 -->
          <div
            class="col-right"
            style="min-width: 40px"
            v-if="base_data.menus_i18n_map[item1]"
          >
            <!-- 有滚球赛事  hl 今日&&存在滚球赛事时  展示live图标 -->

            <div
              class="live-text"
              v-if="
                jinri_zaopan == 2 &&
                lv_1_num(item1) &&
                base_data.mi_gunqiu.includes(item1)
              "
            />
            <span class="match-count yb-family-odds" v-if="item1 != 300">{{
              lv_1_num(item1)
            }}</span>
          </div>
        </div>
      </div>

      <!--  子菜单  ，  开始    -->
      <!--  子菜单  ， 冠军 不显示子菜单  -->
      <!--  常规体育 含 娱乐     子菜单  开始    -->
      <div
        v-if="![400, 2000, 300].includes(item1)"
        class="menu-fold2-wrap"
        :class="current_lv_1_mi == item1 && !show_menu ? 'open' : ''"
      >
        <!-- :class="current_lv_1_mi == item1 ? '' : ''" -->
        <template v-for="item2 in compute_item1_sublist_mi_100(item1)">
          <!--  常规赛种 （不含娱乐）  下的  玩法 （ 不含冠军 ）        开始   -->
          <div
            :key="`${jinri_zaopan}_${item1}_${item2.mi}_100`"
            @click.stop="
              lv_2_click_wapper_1({ lv1_mi: item1, lv2_mi: item2.mi })
            "
            v-if="item1 != 118"
            v-show="item2['ct']"
            :class="current_lv_2_mi == item2.mi ? 'active' : ''"
            class="menu-item menu-fold2"
          >
            <div class="row items-center relative-position">
              <span class="menu-point"></span>
              <span class="menu-text ellipsis">
                <!-- 名字{{ item2.mi }}  -->
                {{ base_data.menus_i18n_map[item2.mi] || "" }}
              </span>
            </div>
            <div class="col-right relative-position" style="min-width: 40px">
              <span class="match-count yb-family-odds" v-if="item1 != 2000">
                {{ item2["ct"] }}</span
              >
            </div>
          </div>
          <!--  常规赛种 （不含娱乐）  下的  玩法 （ 不含冠军 ）        结束    -->
        </template>
        <!-- 常规赛种   （含娱乐）  增补  冠军玩法    开始 -->
        <div
          :key="`${jinri_zaopan}_${item1}_guanjun_1`"
          @click.stop="lv_2_click_wapper_2({ lv1_mi: item1 })"
          v-if="base_data.commn_sport_guanjun_obj[`mi_${item1}`]"
          v-show="base_data.commn_sport_guanjun_obj[`mi_${item1}`]['ct']"
          :class="
            current_lv_2_mi ==
            base_data.commn_sport_guanjun_obj[`mi_${item1}`]['mi']
              ? 'active'
              : ''
          "
          class="menu-item menu-fold2"
        >
          <div class="row items-center relative-position">
            <span class="menu-point"></span>
            <span class="menu-text ellipsis">
              <!--国际化字段返回在  基础赛种  拼接 4 冠军专属后缀上   -->
              {{ base_data.menus_i18n_map[`${item1}4`] || "" }}
            </span>
          </div>
          <div class="col-right relative-position" style="min-width: 40px">
            <span class="match-count yb-family-odds">
              {{ base_data.commn_sport_guanjun_obj[`mi_${item1}`]["ct"] }}</span
            >
          </div>
        </div>
        <!-- 常规赛种   （含娱乐）  增补  冠军玩法      结束  -->
      </div>
      <!--  常规体育 含 娱乐    子菜单  结束     -->
      <!--  电竞    子菜单  开始    -->
      <div
        v-if="item1 == 2000"
        class="menu-fold2-wrap"
        :data-id="show_menu"
        :class="current_lv_1_mi == item1 && !show_menu ? 'open' : ''"
      >
        <MenuItem
          :menu_list="compute_item1_sublist_mi_2000(item1)"
          :base_data="base_data"
          :current_lv_2_mi="current_lv_2_mi"
        />
      </div>
      <!--  电竞    子菜单   结束     -->
      <!--  VR    子菜单   开始     -->
      <div
        v-if="item1 == 300"
        class="menu-fold2-wrap"
        :data-id="show_menu"
        :class="current_lv_1_mi == item1 && !show_menu ? 'open' : ''"
      >
        <MenuItem
          :menu_list="compute_item1_sublist_mi_300(item1)"
          :base_data="base_data"
          :current_lv_2_mi="current_lv_2_mi"
        />
      </div>
      <!--  VR    子菜单   结束     -->
      <!--  子菜单  ，  结束     -->
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
// 菜单配置
import menu_config from "src/core/menu-pc/menu-data-class.js";

import MenuItem from "./menu-item.vue";

// 今日  2 早盘   3
const jinri_zaopan_ = ref(2);
// 当前的一级菜单ID
const current_lv_1_mi = ref(""); //"101",
// 当前的二级菜单ID
const current_lv_2_mi = ref(""); //"101201", // 101301
// 当前赛种是否收起 状态
const show_menu = ref(false);
// 首次进入 刷新用
const first_change = ref(false);

const props = defineProps({
  base_data: {
    type: Object,
    default: () => {},
  },
});

/**
 * @description: 今日 早盘 紧急开关
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const today_early = () => {
  const { lv2_mi, lv1_mi } = menu_config.left_menu_result;

  if (!props.base_data.left_menu_base_mi_arr.includes(Number(lv1_mi))) {
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
    menu_config.set_left_menu_result({
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
  if (!props.base_data.is_mi_2000_open || !props.base_data.is_mi_300_open) {
    params = {
      root: 1,
      lv1_mi: "",
      lv2_mi: 1,
      sports: "",
      guanjun: "",
    };
  } else {
    let { lv2_mi, lv1_mi } = menu_config.left_menu_result;
    // 电竞 vr 部分关停

    // 判断 电竞 下面是否还有该 赛种
    if (menu_config.menu_root == 2000) {
      let esports =
        props.base_data.dianjing_sublist.find((item) => item.mi == lv2_mi) ||
        {};
      if (esports.mi) {
        return;
      } else {
        params.lv2_mi = props.base_data.dianjing_sublist[0].mi;
      }
    }
    // 判断 VR 下面是否还有该 赛种
    if (menu_config.menu_root == 300) {
      let vr_sports =
        props.base_data.vr_mi_config.find((item) => item.menuId == lv2_mi) ||
        {};
      if (vr_sports.menuId) {
        return;
      } else {
        params.lv2_mi = props.base_data.vr_mi_config[0].menuId;
      }
      return lv_2_click_wapper_4({ lv1_mi, lv2_mi: params.lv2_mi });
    }

    // 单个赛事关闭后
    params.root = menu_config.menu_root;
    params.lv1_mi = lv1_mi;
  }
  // 设置 中间 菜单输出
  menu_config.set_mid_menu_result(params);
  // 设置左侧菜单输出
  menu_config.set_left_menu_result({
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
  const { lv1_mi, lv2_mi, root, jinri_zaopan } = menu_config.left_menu_result;

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
    props.base_data.mew_menu_list_res.find((x) => x.mi == "" + item1) || {};
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
  return props.base_data.vr_mi_config;
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
    props.base_data.mew_menu_list_res.find((x) => x.mi == "" + item1) || {};
  let sub_list = [];
  // 电竞
  sub_list = props.base_data.dianjing_sublist;
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
  if (jinri_zaopan_.value == jinri_zaopan?.value && current_lv_1_mi.value == mi) {
    return false;
  }
  if (jinri_zaopan) {
    jinri_zaopan_.value = jinri_zaopan?.value;
  }
  // jinri_zaopan_.value  = jinri_zaopan ? jinri_zaopan : jinri_zaopan_;
  current_lv_1_mi.value = mi;
  current_lv_2_mi.value = "";

  // 刷新 不切换回列表
  if (!first_change) {
    // 详情切换 须回到列表页
    set_route_url();
  }
  if (mi == 400) {
    const { mid_menu_result } = menu_config;
    // 1级 冠军和vr体育 点击后默认为早盘
    jinri_zaopan_.value = 2;
    let mi;
    if (mid_menu_result.root && mid_menu_result.root == 400) {
      mi = mid_menu_result.mi;
    } else {
      mi = 400;
    }
    // // 设置      中间 菜单输出
    menu_config.set_mid_menu_result({
      root: 400,
      mi,
      sports: "guanjun",
      guanjun: "guanjun",
    });

    //冠军  没有子菜单  直接点击 冠军足球
    menu_config.set_left_menu_result({
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
      props.base_data.dianjing_sublist.find((item) => item.mi == lv2_es) || {};
    if (!esports_mi.mi) {
      // 有默认值但是没有在列表中 选择列表中的第一个
      lv2_es = props.base_data.dianjing_sublist[0].mi;
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
    let menuId = (props.base_data.vr_mi_config[0] || {}).menuId || "1010";

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
  // console.error(' base_data.mi_info_map', base_data.mi_info_map)
  let { lv1_mi, lv2_mi } = detail;
  // 父级euid
  // let { euid } = base_data.mi_info_map[`mi_${lv1_mi}${jinri_zaopan}`];
  // 当前 pid 和 orpt
  // let lv2_mi_info = base_data.mi_info_map[`mi_${lv2_mi}`];

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
  //      menu_config.is_multi_colum()&&
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
      cuid: "", // UserCtr.get_uid(), // ????
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
  // console.log(lv1_mi,jinri_zaopan)

  // console.warn("lv_2_click_wapper_2-------- 常规赛种   （含娱乐）  的 冠军玩法     点击-----------",base_data)

  let lv2_mi = "";
  // 获取 二级菜单id
  if (Object.keys(props.base_data.commn_sport_guanjun_obj).length) {
    lv2_mi = props.base_data.commn_sport_guanjun_obj[`mi_${lv1_mi}`]["mi"];
  }

  // 父级euid
  // let euid;
  // 娱乐
  // if (lv1_mi==118) {
  //   // 娱乐冠军写死
  //   euid = '3020112' || base_data.mi_info_map[`mi_${lv2_mi}`].euid;
  // }else{
  //   euid = base_data.mi_info_map[`mi_${lv1_mi}${jinri_zaopan}`].euid
  // }
  // let { euid } = base_data.mi_info_map[`mi_${lv1_mi}${jinri_zaopan}`];

  let config = {
    root: jinri_zaopan_.value,
    lv1_mi,
    lv2_mi,
    sports: "common",
    guanjun: "common-guanjun",
    mid_menu_show: {
      list_filter_date: jinri_zaopan_.value == 3,
    },
  };
  // 当前 pid 和 orpt
  // let lv2_mi_info = base_data.mi_info_map[`mi_${lv2_mi}`];
  // 如果
  if (jinri_zaopan_.value != 3) {
    let base_params = {
      cuid: "", // UserCtr.get_uid(), // ??????
      selectionHour: "", // $store.state.filter.open_select_time,
      sort: "", // vx_match_sort,
      apiType: 1,
      // orpt: 18,
      sportId: "",
    };
    let csid = "" + (1 * lv1_mi - 100);
    // 没有中间菜单
    let mid_menu_refer_params = {
      begin_request: true,
      is_collect: false,
      route: "list",
      root: "400",
      sports: "common",
      guanjun: "common-guanjun",
      // 列表队列 接口
      match_list: {
        api_name: "post_league_list",
        params: {
          ...base_params,
          // ...lv2_mi_info,
          // orpt: lv2_mi_info.orpt || base_params.orpt,
          // pids: lv2_mi_info.pids,
          // euid,
          sportId: csid,
        },
      },
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
    props.base_data.vr_mi_config.find((item) => lv2_mi == item.menuId) || {};
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
        tid: vr_obj.subList[0].field1,
        // isLive: 1,
        selectionHour: "", // $store.state.filter.open_select_time,
        csid: vr_obj.menuId,
      },
    },
  };

  // lv_2_click_common(config);
  // // 设置      中间 菜单输出
  menu_config.set_left_menu_result(config);

  // // 设置   请求  列表结构  API 参数的  值
  menu_config.set_match_list_api_config(mid_menu_refer_params);
};
/**
 * 二级菜单点击
 * @param {*} mi
 */
const lv_2_click_common = (detail = {}) => {
  // 刷新 不切换回列表
  if (!first_change) {
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

  if (current_lv_2_mi == lv2_mi) {
    return false;
  }

  current_lv_1_mi.value = lv1_mi;
  current_lv_2_mi.value = lv2_mi;

  // 获取 euid orpt tid
  let obj = props.base_data.mi_info_map[`mi_${lv2_mi}`];

  //电子竞技没有 euis
  if (lv1_mi != 2000) {
    // 常规赛种 euid
    if (lv1_mi != 118) {
      let mid = `mi_${lv1_mi}${jinri_zaopan_.value}`;
      obj.euid = props.base_data.mi_info_map[mid].euid;
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
  console.error("当前选中的 侧边 二级菜单 ------------ ", result);
  menu_config.set_left_menu_result(result);
};

/**
 * 一级菜单数量计算
 * @param {*} mi
 */
const lv_1_num = (mi) => {
  // console.warn("mi", mi);
  if (mi == 2000) {
    //电竞
    let sub_list = props.base_data.dianjing_sublist;
    let num = 0;
    sub_list.map((x) => {
      //  1  滚球  3 早盘  4 冠军  合计得出总数
      num = num + lv_1_num_sublist_dianjing(x.mi);
    });
    return num;
  } else if ([118, 300].includes(1 * mi)) {
    //娱乐 和 VR
    let obj = props.base_data.mew_menu_list_res.find((x) => x.mi == mi) || {};
    let sl = obj["sl"] || [];
    let n = 0;
    sl.map((x) => {
      n = n + x.ct;
    });
    return n;
  } else if (mi == 400) {
    // "冠军"
    let obj = props.base_data.mew_menu_list_res.find((x) => x.mi == mi) || {};
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
  let obj = props.base_data.mew_menu_list_res.find((x) => x.mi == mi) || {};
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
  // console.error('base_data',props.base_data)
  //球类
  let obj = props.base_data.mew_menu_list_res.find((x) => x.mi == mif) || {};
  //冠军
  let obj2 = (obj.sl || []).find((x) => x.mi == mi) || {};
  return obj2["ct"] || 0;
};

/**
 * 详情页回首页
 */
const set_route_url = () => {
  let { name } = $route;
  if (["details", "search", "video", "virtual_details"].includes(name)) {
    $router.push("/home");
  }
  vx_set_layout_list_type("match");
  set_filter_select_obj([]);
  first_change.value = false;
};
/**
 * 今日早盘按钮点击
 * @param {*} val
 */
const handle_click_jinri_zaopan = (val) => {
  set_route_url();

  let lv1_mi = current_lv_1_mi || "101";
  // 今日/早盘下的 冠军和VR 点击今日、早盘后 默认为足球
  if ([400, 300].includes(Number(menu_config.menu_root))) {
    lv1_mi = "101";
  }
  //current_lv_1_mi.value = ''
  lev_1_click(lv1_mi, val);
};
// 模拟推送
// const send_menu = () => {
//   base_data.set_ws_send_new_menu_init()
// }
// const send_user = () => {
//   base_data.set_ws_send_new_user_info_init()
// }
// const send_vr = () => {
//   base_data.set_ws_send_new_vr_menu_init()
// }
</script>
<style lang="scss" scoped>
/* 体育菜单 */
.c-menu-sports {
  /* 体育菜单标题 */
  .menu-item-title {
    height: 32px !important;
    margin-bottom: 2px;
    font-size: 12px;
  }

  .menu-tab {
    padding: 0 !important;
  }
}
</style>
