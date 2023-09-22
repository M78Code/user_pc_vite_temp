<!--
 * @Author:
 * @Date:
 * @Description: 赛事列表页 底部菜单
-->
<template>
  <div class="container-menu-w" :class="{
    black2: UserCtr.theme.includes('night'),
    'scrolling-up': scroll_dir > 0,
    'scrolling-down': scroll_dir < 0,
  }">

    <!-- <bet-bar v-if="get_betbar_show && route.name == 'matchList'"></bet-bar> -->
    <!-- 底部菜单资源配置图片 -->
    <div v-if="isshow_bottom_banner" class="bottom-banner">
      <img :src="calc_resources_obj.img_src" alt="" class="banner" @click="jump" />
      <img src="/yazhou-h5/image/svg/close9.svg" alt="" class="close" @click.self="close_banner" />
    </div>
    <div class="floating-menu">
      <div class="footer-menu-item" @click="menu_item_click(item, k)" v-for="(item, k) of footer_menulist" :key="k"
        v-show="bottom_option_show(item)" :class="{
          'f-disabled-m': k == 0 && menu_type == 100,
          'sub-menu-first': k == 0,
          'is-hidden': get_is_hidden(item, k),
          'effect-show': is_sub_first_effect && k == 0,
          disabled: item.is_disabled,
          'is-follow': show_favorite_list && item.id == 1,
        }">
        <div class="m-item-inner">
          <div class="item-img-wrapper" :class="{
            effected: item.id == 4 && is_effecting_ref,
            'rotate-clock-wise': is_refreshing,
          }">
            <span class="menu-item-img" :class="[
              item.icon.slice(0, -4),
              menu_item_img(item),
              lodash.get(get_user, 'favoriteButton') ? 'favoriteButton' : '',
            ]" :style="compute_css('foot-menu-icon', 0)"></span>
          </div>
          <div class="menu-item-title" :class="{
            'theme02-focus':
              show_favorite_list &&
              UserCtr.theme.includes('night') &&
              item.id == 1,
          }" v-show="item.id != 5">
            <span class="title-p1" :class="{ 'title-p2': item.title1 }">
              {{ item.title }}
            </span>
            <span v-if="item.title1" :class="item.title1 ? 'title-p2' : 'title-p1'">
              {{ item.title1 }}
            </span>
          </div>
          <div v-if="item.id == 0" class="play-w-change-icon" :style="compute_css('menu-set-switch')"></div>
        </div>
      </div>
    </div>

    <!--玩法菜单-->
    <div class="sub-background" v-if="sub_menu_l_show" :class="{ 'show-slow': sub_menu_l_show_slow }"
      @touchstart.prevent="hide_sub_menu_l_p" @click="hide_sub_menu_l_p">
      <div class="sub-m-menu flex justify-around items-center" @click.stop=""
        :class="{ 'show-slow': sub_menu_l_show_slow }">
        <div v-for="(sub_m, sub_i) of footer_sub_m_list" :key="sub_i"
          @touchstart.prevent.stop="sub_menu_changed(sub_m, sub_i)" class="wrapper column justify-center items-center"
          v-show="(MenuData.get_current_sub_menuid() == 5 || sub_m.id != 114) &&
            !([8, 7].includes(menu_type) && sub_m.id == 114) &&
            !(get_sport_all_selected && sub_m.id == 114)
            " :data-sid="sub_m.id" :data-mtype="MenuData.get_current_sub_menuid()" :data-cmtype="menu_type" :class="{
    current_sub_menu: sub_i == sub_footer_menu_i,
    'is-favorite': show_favorite_list,
    'no-display':
      MenuData.get_current_sub_menuid() == 44 && sub_m.id == 4,
  }">
          <div class="wrapper-inner column items-center justify-center">
            <div class="play-icon-wrap relative-position" :class="sub_m.icon"></div>
            <div class="title-contain relative-position row">
              <span>{{ sub_m.title }}</span>&nbsp;<span class="title0">{{ sub_m.title1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// TODO: 后续修改调整
import GlobalAccessConfig from "src/core/access-config/access-config.js";
// import common from "project_path/project/mixins/constant";
// import betBar from 'src/components/bet/bet-bar.vue';  // 投注栏收起后的底部条
import { utils, SessionStorage } from "src/core/index.js";
import { ref, computed, onBeforeUnmount, onMounted, watch } from "vue";
import lodash from "lodash";
import { useRoute, useRouter } from "vue-router";
import store from "src/store-redux/index.js";
import { UserCtr, i18n_t, compute_css, useMittOn, useMittEmit, MITT_TYPES, MenuData } from "src/core/index.js";
import BetDataCtr from "src/core/bet/class/bet-data-class-h5.js";

const { topMenuReducer, matchReducer, footerMenuReducer } = store.getState();
const { menu_type, update_time, get_sport_all_selected } = MenuData;

const is_effecting_ref = ref(true);
const is_refreshing = ref(false);
// 子菜单是否显示
const sub_menu_l_show = ref(false);
// 渐进式显示\隐藏子菜单
const sub_menu_l_show_slow = ref(false);
// 选中的子菜单下标
const sub_footer_menu_i = ref(0);
// 返回顶部按钮显示
const scroll_to_top_show = ref(false);
// 返回顶部时钟对象
const scroll_to_top_timeout = ref(0);
// 拖拽x坐标
const init_poi_y = ref(0);
// 拖拽过程中上一帧的鼠标x坐标
const prev_x = ref(null);
// 拖拽过程中上一帧的鼠标y坐标
const prev_y = ref(null);
// 是否拖拽到上方限制区
const flat_topped = ref(false);
// 滚动时点击返回顶部无效
const list_scroll_timeout = ref(0);
//列表滚动距离
const scroll_h = ref(0);
//上次记录的滚动方向 1向上滚  -1向下滚
const scroll_prev_dir = ref(-1);
//上一帧滚动位置
const prev_frame_poi = ref(0);
//处理中
const footer_clicked_handleing = ref(false);
//上一次的key
const prev_floating_sub = "prev-floating-sub-i";
//页脚数据
const footer_menulist = ref([]);
//子菜单显示/隐藏渐进效果
const is_sub_first_effect = ref(false);
//子菜单隐藏
const is_sub_first_hidden = ref(false);
//投注栏弹层显示非0否则0
const local_bet_status = ref(0);
//小于0显示页脚,大于0隐藏页脚
const scroll_dir = ref(0);

let timer1_,
  timer2_,
  timer3_,
  timer4_,
  timer5_,
  timer6_,
  timer7_;
//第一个页脚菜单更新相关逻辑
let timer_super9;
//简版足球角球图标分割线相关
let timer_super10;
const show_favorite_list = ref(UserCtr.show_favorite_list)
// 路由
const route = useRoute();
const router = useRouter();
/**
 * 是否显示菜单
*/
function get_is_hidden(item, k) {
  return (is_sub_first_hidden.value && k == 0) ||
    (!GlobalAccessConfig.get_collectSwitch() && item.id == 1) ||
    (!GlobalAccessConfig.get_filterSwitch() &&
      !GlobalAccessConfig.get_searchSwitch() &&
      item.id == 3)
}


// ...mapMutations([
//   'set_goto_list_top', // 设置赛事列表回到顶部
//   'set_toast',          // 设置提示信息
//   'set_settle_dialog_bool',
//   'set_show_favorite_list',
//   'set_show_match_filter',
//   'set_footer_sub_menu_id',
//   'set_footer_sub_changing',
//   'set_newer_standard_edition',
//   'set_resources_obj',
//   'set_menu_type',
//   'set_goto_detail_matchid',
//   'set_details_item',
//   'set_home_tab_item',
//   'set_hot_tab_item'
// ]),
/**
 * 点击图片跳转逻辑
 * type '0'-无链接 '1'-内部跳转链接（目前支持跳转到详情页，'details/3403089/1'、 'details/36858678123944596/100'...） '2'-外部跳转链接（'http://www.example.com'）
 */
const jump = () => {
  let { jump_url, type } = calc_resources_obj;
  if (jump_url) {
    if (type == "2" && jump_url.startsWith("http")) {
      window.open(calc_resources_obj.jump_url, "_blank");
    } else if (type == "1") {
      if (/#*\/*details/.test(jump_url) && route.name != "category") {
        const {
          groups: { mid, csid },
        } = /#*\/*details\/(?<mid>\d+)\/(?<csid>\d+)/.exec(jump_url) || {
          groups: {},
        };
        if (mid && csid) {
          // 如果是电竞赛事，需要设置菜单类型
          if ([100, 101, 102, 103].includes(+csid)) {
            set_menu_type(3000);
          }
          set_goto_detail_matchid(mid);
          set_details_item(0);
          router.push({ name: "category", params: { mid, csid } });
        }
      }
      // 跳热门联赛
      if (jump_url.startsWith("hot") && !get_golistpage) {
        let tid = jump_url.split("/")[1];
        let is_existtid =
          get_hot_list_item &&
          get_hot_list_item.subList &&
          get_hot_list_item.subList.find((item) => {
            return item.field2 == tid;
          });
        if (tid && is_existtid) {
          set_home_tab_item({ component: "hot", index: 1, name: "热门" });
          set_hot_tab_item({ field2: tid });
          router.push({ name: "home" });
        }
      }
    }
  }
};
/**
 * 关闭UI挂件
 */
const close_banner = () => {
  set_resources_obj({ is_show: false });
};

/**
 * 隐藏页脚二级菜单
 */
const hide_sub_menu_l_p = () => {
  sub_menu_l_show_slow.value = false;
  timer1_ = setTimeout(() => {
    sub_menu_l_show.value = false;
  }, 300);
};
/**
 * 初始化玩法选中项
 */
const init_play_way_selected = () => {
  let p_i = SessionStorage.get(prev_floating_sub);
  if (p_i != null) {
    p_i = p_i * 1;
    sub_menu_changed(footer_sub_m_list[p_i], p_i);
  }
};
/**
 * 根据场景切换页脚第一个菜单的显示内容
 */
const first_sub_menu_changed = () => {
  let ed = topMenuReducer.newer_standard_edition;
  if (ed == 2) {
    is_sub_first_effect.value = false;
    timer2_ = setTimeout(() => {
      is_sub_first_hidden.value = true;
    }, 210);
  } else {
    is_sub_first_hidden.value = false;
    timer3_ = setTimeout(() => {
      is_sub_first_effect.value = true;
    }, 10);
  }
};
/**
 * 初始化关注图标样式
 */
const init_follow_icon_style = () => {
  let item = footer_menulist.value.filter((f_item) => f_item.id === 1)[0] || {};
  let is_follow = show_favorite_list.value;
  if (is_follow) {
    item.icon = lodash.get(item, "icon1");
  } else {
    item.icon = lodash.get(item, "icon0");
  }
};
/**
 * @description: 更新第一个页脚菜单
 * @param {Object} sub_menu
 * @param {Number} i
 * @return {Undefined} Undefined
 */
const sub_menu_changed = (sub_menu, i) => {
  // TODO:后续修改调整
  SessionStorage.set(prev_floating_sub, i);
  // 非足球选择角球时,选中独赢
  const sub_menu_id = MenuData.get_current_sub_menuid();

  if (
    (sub_menu_id != 5 && sub_menu?.id == 114) ||
    (sub_menu_id == 44 && sub_menu?.id == 4)
  ) {
    sub_footer_menu_i.value = 0;
    SessionStorage.set(prev_floating_sub, 0);
  } else {
    sub_footer_menu_i.value = i;
    update_first_menu();
  }
};
/**
 * 更新第一个页脚菜单
 * @param {Undefined} Undefined
 * @return {Undefined} Undefined
 */
const update_first_menu = () => {
  let sub_menu = footer_sub_m_list.value[sub_footer_menu_i.value];
  footer_menulist.value[0].title = sub_menu.title;
  footer_menulist.value[0].title1 = sub_menu.title1;
  footer_menulist.value[0].icon = sub_menu.icon;
  footer_menulist.value[0].icon_black = UserCtr.theme.includes("day")
    ? sub_menu.icon
    : sub_menu.icon1;
  store.dispatch({
    type: "SET_FOOTER_SUB_MENU_ID",
    data: lodash.get(sub_menu, "id"),
  });
  store.dispatch({
    type: "SET_FOOTER_SUB_IDCHANGING",
    data: true,
  });
  clearTimeout(timer_super9);
  timer_super9 = setTimeout(() => {
    store.dispatch({
      type: "SET_FOOTER_SUB_IDCHANGING",
      data: false,
    });
  }, 800);
  timer4_ = setTimeout(() => {
    useMittEmit(
      MITT_TYPES.EMIT_FOOTER_SUB_MENU_ID_CHANGED,
      lodash.get(sub_menu, "id")
    );
  }, 200);
};
/**
 * @description: 底部子菜单点击事件
 * @param {Object} item 点击的子菜单
 * @param {Number} i 主菜单下标
 * @return {Undefined} Undefined
 */
const menu_item_click = (item, i) => {
  if (item.is_disabled) return;
  if (menu_type.value == 100 && i == 0) return;
  MenuData.set_footer_sub_menu_id(item.id)
  //独赢
  if (item.id === 0) {
    //赛马,摩托车,泥地摩托车不能切换玩法
    if (
      [1002, 1011, 1010, 1009].includes(MenuData.get_current_sub_menuid())
    ) {
      return;
    }
    sub_menu_l_show.value = true;
    clearTimeout(timer_super10);
    timer_super10.value = setTimeout(() => {
      sub_menu_l_show_slow.value = true;
    }, 50);
  }
  //关注
  else if (item.id === 1) {
    if (
      !utils.judge_collectSwitch(GlobalAccessConfig.get_collectSwitch(), this)
    )
      return;

    if (footer_clicked_handleing.value) return;

    timer5_ = setTimeout(() => {
      footer_clicked_handleing.value = false;
    }, 800);
    // useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
    //   text: "footer-follow",
    //   before_status: UserCtr.show_favorite_list,
    // });
    let is_follow = !UserCtr.show_favorite_list;
    if (is_follow) {
      item.icon = item.icon1;
    } else {
      item.icon = item.icon0;
    }
    show_favorite_list.value = is_follow;
    UserCtr.set_show_favorite_list(is_follow)
  }
  //注单
  else if (item.id === 2) {
    useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, true);
  }
  //筛选
  else if (item.id === 3) {
    if (
      !GlobalAccessConfig.get_filterSwitch() &&
      !GlobalAccessConfig.get_searchSwitch()
    ) {
      $toast(i18n_t(`common.temporarily_unavailable`), 2000);
      return;
    }
    //TODO
    // 监听搜索框状态
    useMittEmit(MITT_TYPES.EMIT_CHANGE_SELECT_DIALOG, true)
    // set_show_match_filter(true);
  }
  //刷新
  else if (item.id === 4) {
    if (is_refreshing.value) return;
    is_effecting_ref.value = true;
    is_refreshing.value = true;
    timer6_ = setTimeout(() => {
      is_effecting_ref.value = false;
      is_refreshing.value = false;
    }, 1000);
    useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
      text: "footer-refresh",
    });
  }
};
/**
 *切换到简版
 *@param {Undefined} undefined
 *@return {Undefined} undefined
 */
const change_to_simple_handle = () => {
  store.dispatch({});
  UserCtr.set_standard_edition(1)
};
/**
 * 虚拟体育禁用关注和筛选
 */
const virtual_disable_follow_filter = () => {
  // 赛果禁用筛选
  if (28 == menu_type.value) {
    footer_menulist.value.forEach((f_m) => {
      // 赛果 二级菜单 10000也不知道是什么
      if (f_m.id == 3 && MenuData.get_current_sub_menuid() == 10000) {
        f_m.is_disabled = true;
      } else {
        f_m.is_disabled = false;
      }
      // 赛果关注 禁用
      if (f_m.id === 1) {
        f_m.is_disabled = true;
      }
    });
    //是赛果 并且是虚拟体育  暂时注释代码
    if (MenuData.is_results_virtual_sports()) {
      footer_menulist.value.forEach((f_m) => {
        if (f_m.id == 1) {
          f_m.is_disabled = true;
        }
      });
    }
    // 赛果 二级菜单 100是 gz/国足?
    if ([100].includes(MenuData.get_current_sub_menuid())) {
      footer_menulist.value.forEach((f_m) => {
        if (f_m.id == 3) {
          f_m.is_disabled = true;
        }
      });
    }
  } else {
    footer_menulist.value.forEach((f_m) => {
      // 电竞下冠军不可点击关注
      if (
        f_m.id === 1 &&
        menu_type.value === 7 &&
        lodash.get(MenuData.current_lv_2_menu, "date_menu.menuType") == 100
      ) {
        f_m.is_disabled = true;
      } else {
        if (f_m.id == 3 && show_favorite_list.value) {
        } else {
          f_m.is_disabled = false;
        }
      }
      // 电竞放开 筛选
      if (f_m.id === 3 && menu_type.value === 7) {
        f_m.is_disabled = true;
      }
      if (f_m.id == 1 && !GlobalAccessConfig.get_collectSwitch()) {
        f_m.is_disabled = true;
      }
    });
  }
};
/**
 * 设置页脚菜单数据
 *@param init_footer_menulist_data 是否重置footer_menulist数据
 */
const set_footer_menulist = (init_footer_menulist_data = true) => {
  let is_virtual = MenuData.is_virtual_sport(); //虚拟体育
  // 赛果虚拟体育
  let is_result_virtual = MenuData.is_results_virtual_sports();
  let is_saiguo_gz =
    menu_type.value == 28 &&
    [100].includes(MenuData.get_current_sub_menuid());
  let is_electronicSports = menu_type.value == 7; // 电竞
  if (init_footer_menulist_data) {
    footer_menulist.value = [
      // 玩法菜单(独赢|大小|让球|角球等)
      {
        title: i18n_t("footer_menu.win_alone"),
        title1: UserCtr.lang == "en" ? "" : i18n_t("footer_menu.play_way_f"),
        icon: "f-icon-sub-duying.svg",
        icon_black: "f-icon-sub-duying-black.svg",
        id: 0,
        is_disabled: false,
      },
      // 关注
      {
        title: i18n_t("footer_menu.follow"),
        icon0: "f-icon-follow.svg",
        icon: show_favorite_list.value
          ? "f-icon-follow1.svg"
          : "f-icon-follow.svg",
        icon1: "f-icon-follow1.svg",
        icon_black: "f-icon-follow-black.svg",
        icon_black_fav: "f-icon-follow1-black.svg",
        icon2: "f-icon-follow-black.svg",
        id: 1,
        is_disabled: is_virtual || is_result_virtual || menu_type.value == 28,
      },
      // 注单
      {
        title: i18n_t("footer_menu.bet_order"),
        icon: "f-icon-bet-order.svg",
        icon_black: "f-icon-bet-order-black.svg",
        id: 2,
        is_disabled: false,
      },
      //筛选
      {
        title: i18n_t("footer_menu.filter"),
        icon: "f-icon-filter.svg",
        icon_black: "f-icon-filter-black.svg",
        id: 3,
        is_disabled:
          is_virtual ||
          is_saiguo_gz ||
          show_favorite_list.value ||
          is_electronicSports,
      },
      // 刷新
      {
        title: i18n_t("footer_menu.refresh"),
        icon: "f-icon-refresh.svg",
        icon_black: "f-icon-refresh-black.svg",
        id: 4,
        is_disabled: false,
      },
    ];
  }
  // 强制更新组件
  // $forceUpdate()
};

const get_user = ref(UserCtr.user_info);
watch(UserCtr.user_version, () => {
  console.error(UserCtr.user_info, 11111)
  get_user.value = UserCtr.user_info
})
// computed:{
// ...mapGetters([
//   "get_user",
//   "get_bet_list",
//   "get_settle_dialog_bool",
//   "get_curr_sub_menu_type",
//   "show_favorite_list.value",
//   "get_current_main_menu",
//   "get_filter_list",
//   "get_current_menu",
//   "UserCtr.lang",
//   "get_bet_status",
//   'get_list_scroll_direction',
//   'get_bet_list',
//   'get_betbar_show',
//   'get_curr_third_menu_id',
//   'get_access_config',
//   'get_resources_obj',
//   'get_golistpage',
//   'get_hot_list_item'

// ]),
// ...mapGetters({
//   menu_type: "get_menu_type",
//   get_newer_standard_edition:'get_newer_standard_edition',// 新手版与标准版
//   current_esport_csid:'get_current_esport_csid',
// }),
const isshow_bottom_banner = computed(() => {
  // TODO:获取商户信息
  // return get_resources_obj.is_show && !get_betbar_show && calc_resources_obj.img_src
});

const calc_resources_obj = computed(() => {
  if (UserCtr.theme.includes("day")) {
    return get_resources_obj.day;
  } else {
    return get_resources_obj.night;
  }
});
// 是否展示 底部菜单 选项
const bottom_option_show = computed(() => {
  return function (item) {
    return !(
      menu_type.value == 7 &&
      lodash.get(MenuData.current_lv_2_menu, "date_menu.menuType") == 100 &&
      item.id == 0
    );
  };
});
// 今日 串关 早盘 筛选时，要高亮
const menu_item_img = computed(() => {
  return function (item) {
    let obj =
      item.id == 3 &&
      typeof get_filter_list == "object" &&
      Object.keys(get_filter_list).length &&
      "fillter-high-light";
    if (UserCtr.theme.includes("y0"))
      obj =
        item.id == 3 &&
        typeof get_filter_list == "object" &&
        Object.keys(get_filter_list).length &&
        "fillter-high-light";
    return obj;
  };
});
const footer_sub_m_list = computed(() => {
  return [
    {
      title: ["en", "th", "ms", "ad"].includes(UserCtr.lang)
        ? ""
        : i18n_t("footer_menu.full_time"),
      title1: i18n_t("footer_menu.win_alone"),
      icon0: "f-icon-sub-duying0.svg",
      icon: "f-icon-sub-duying.svg",
      icon1: "f-icon-sub-duying-black.svg",
      // hpid 独赢
      id: 1,
    },
    {
      title: ["en", "th", "ms", "ad"].includes(UserCtr.lang)
        ? ""
        : i18n_t("footer_menu.full_time"),
      title1: i18n_t("footer_menu.rangqiu"),
      icon0: "f-icon-sub-rang0.svg",
      icon: "f-icon-sub-rang.svg",
      icon1: "f-icon-sub-rang-black.svg",
      // hpid 让球
      id: 4,
    },
    {
      title: ["en", "th", "ms", "ad"].includes(UserCtr.lang)
        ? ""
        : i18n_t("footer_menu.full_time"),
      title1: i18n_t("footer_menu.daxiao"),
      icon0: "f-icon-sub-daxiao0.svg",
      icon: "f-icon-sub-daxiao.svg",
      icon1: "f-icon-sub-daxiao-black.svg",
      // hpid 大小
      id: 2,
    },
    {
      title: ["en", "th", "ms", "ad"].includes(UserCtr.lang)
        ? ""
        : i18n_t("footer_menu.corner_kick"),
      title1: i18n_t("footer_menu.corner"),
      icon0: "f-icon-sub-jiaoqiu0.svg",
      icon: "f-icon-sub-jiaoqiu.svg",
      icon1: "f-icon-sub-jiaoqiu-black.svg",
      // hpid 角球
      id: 114,
    },
  ];
});
/**
 * @description: 当前是否为ihone,为iPhone添加特有的样式
 * @param {Undefined} Undefined
 * @return {Boolean}
 */
const is_iphone = computed(() => {
  let { iphone, mobile, safari } = Platform.is;
  if (iphone && mobile && safari) {
    return true;
  }
  return false;
});
// },

/**
 * 通过列表滚动决定页脚菜单显示/隐藏
 */
watch(
  () => matchReducer.list_scroll_direction,
  (direction) => {
    //不显示投注弹层时改变页脚菜单显示状态
    if (local_bet_status.value == 0) {
      scroll_dir.value = direction;
    }
  }
);
watch(show_favorite_list,
  (is_fav) => {
    let item = footer_menulist.value.filter((f_item) => f_item.id === 1)[0];
    if (is_fav) {
      item.icon = item.icon1;
      item.icon_black = item.icon1;
    } else {
      if (UserCtr.theme.includes("day")) {
        item.icon = item.icon0;
      } else if (UserCtr.theme.includes("night")) {
        item.icon_black = item.icon2;
      }
    }
    // 切换关注页面时，初始化底部菜单数据
    set_footer_menulist();
  }
);
watch(
  () => topMenuReducer.newer_standard_edition,
  () => {
    sub_menu_l_show.value = false;
    first_sub_menu_changed();
  }
);
watch(
  [
    menu_type, //一级菜单变化
    update_time, //菜单变化
    // topMenuReducer.current_main_menu.menuId, //二级菜单变化
    // topMenuReducer.curr_third_menu_id //三级菜单变化
  ],
  () => {
    if (get_sport_all_selected.value) {
      /**
       * 滚球菜单是否选中全部菜单变化
       */
      // 简版时滚球菜单选中全部菜单时
      // 值为 1简版 2标准版
      if (
        topMenuReducer.newer_standard_edition == 1 &&
        val &&
        menu_type.value == 1
      ) {
        let sub_menu = footer_sub_m_list.value[sub_footer_menu_i.value];
        if (lodash.get(sub_menu, "id") == 114) {
          // 当时菜单是角球时设置菜单为独赢
          sub_menu_changed(footer_sub_m_list.value[0], 0);
        }
      }
    }
    //以前是二级二级菜单变化执行 =》 其实哪一级菜单变化不执行呢？ 1级变了难道 234级不变？
    // if (MenuData.current_lv_2_menu_i) {
    init_play_way_selected();
    // 32014 确定每次点击菜单 都重置为独赢
    // if(1 || [1002, 1011, 1010, 1009].includes(+new_v)){
    //赛马 摩托车 泥地摩托车强制改为独赢
    let p_i = 0;
    sub_menu_changed(footer_sub_m_list.value[p_i], p_i);
    // }
    set_footer_menulist();
    // }
    virtual_disable_follow_filter();
  }
);


//投注栏弹层显示非0否则0
watch(
  () => BetDataCtr.bet_status,
  (c_status) => {
    if (c_status == 0) {
      timer7_ = setTimeout(() => {
        local_bet_status.value = c_status;
      }, 400);
    } else {
      local_bet_status.value = c_status;
    }
  }
);
const mitt_list = [
  useMittOn(MITT_TYPES.EMIT_MATCH_LIST_DATA_TAKED, update_first_menu).off,
  useMittOn(MITT_TYPES.EMIT_LANG_CHANGE, set_footer_menulist).off
]
onMounted(() => {
  set_footer_menulist();
  // set_show_match_filter(false)
  store.dispatch({
    type: "SET_SHOW_MATCH_FILTER",
    data: false,
  });
  // 监听赛事列表数据获取事件
  // 初始化关注按钮显示状态
  init_follow_icon_style();
  init_play_way_selected();
  virtual_disable_follow_filter();
  update_first_menu();
  first_sub_menu_changed();
});
/**
 * @description: 销毁前回调函数
 */
onBeforeUnmount(() => {
  // 批量清除定时器
  [
    timer1_,
    timer2_,
    timer3_,
    timer4_,
    timer5_,
    timer6_,
    timer7_,
    timer_super9,
    timer_super10,
  ].forEach(i => {
    clearTimeout(i);
  });
  mitt_list.forEach(i => i())
});
</script>
<style lang="scss" scoped>
@import url(./footer.scss);
@import url(./footer_menu.scss);
</style>