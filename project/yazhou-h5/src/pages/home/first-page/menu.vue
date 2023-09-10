<template>
  <!-- 赛事框 -->
  <div
    class="main-content-match"
    :style="`height:${el_height}px`"
    ref="content"
  >
    <div class="match-warp flex" v-if="menu_list.length">
      <div class="left-menu valid" style="width: 80px">
        <q-scroll-area
          :style="`height:${el_height}px`"
          :thumb-style="thumbStyle"
        >
          <div
            class="item"
            :class="{ active: index == menu_index }"
            v-for="(item, index) in menu_list"
            :key="`menu-${index}`"
            @click="change_menu(index)"
            v-show="calc_show2(item)"
          >
            <span
              class="label"
              :class="{ is_chinise: ['zh', 'tw'].includes(get_lang) }"
              >{{ $t(`new_menu.${item.mi}`) }}</span
            >
            <span class="num" v-if="![407, 408, 410].includes(item.mi * 1)">{{
              count_menu(item.sl) || ""
            }}</span>
          </div>
        </q-scroll-area>
      </div>
      <div
        class="match-content col"
        :class="{ fadeInUp: animation }"
        v-if="menu_list[menu_index]"
      >
        <q-scroll-area
          ref="list_area"
          :style="`height:${el_height}px`"
          :thumb-style="{
            background: 'transparent',
          }"
        >
          <div
            class="item"
            :style="{ 'z-index': item.field1 * 3, position: 'relative' }"
            v-for="(item, index) in menu_list[menu_index].sl || []"
            :key="index"
            @click="to_list(item, index)"
            v-show="
              !loading_done || item.ct >= 0 || [5, 7].includes(+item.menuType)
            "
          >
            <div class="item-bg" :class="format_type(item)"></div>
            <div class="item-info" :class="{ 'is-english': get_lang == 'en' }">
              <div class="column items-center">
                <!-- <span class="match-type">{{t(`menu_list.${filter_meunu_desc(item.mi)}`) }}</span> -->
                <span class="match-type">{{
                  menu_h5_data.menus_i18n_map[item.mi]
                }}</span>
                <span class="match-num ellipsis">{{ item.ct || 0 }}</span>
                <span class="match-label ellipsis-2-lines">{{
                  $t("home.can_bet")
                }}</span>
              </div>
            </div>
          </div>
          <no_data v-if="noData" :which="no_data_txt" height="500"></no_data>
        </q-scroll-area>
      </div>
    </div>
    <no-data
      :which="no_menu_txt"
      height="500"
      style="padding-top: 0.6rem"
      v-if="noMenu"
    ></no-data>
  </div>
</template>
<script setup>
import { watch, ref, computed } from "vue";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
// 无网络展示组件
import no_data from "project_path/src/components/common/no-data.vue";
import menu_obj from "src/core/menu-h5/menu-data-class.js";
import base_data from "src/core/base-data/base-data.js";
import menu_h5_data from "src/core/menu-h5/menu-data-class.js";
import lodash from "lodash";
import { useRouter } from "vue-router";
import UserCtr from "src/core/user-config/user-ctr.js";
import { DateForMat } from "src/core/format/index.js";
//初始化数据
base_data.init();
const router = useRouter();
const menu_list = ref(base_data.mew_menu_list_res || []); //菜单列表
const menu_index = ref(0); //选中的菜单
const list_area = ref(null); //dom
const content = ref(null); //dom

let noData = ref(false);
let no_data_txt = ref("moMatch");
let noMenu = ref(false);
let no_menu_txt = ref("moMatch");
const get_lang = "zh";
//点击动画
let animation = ref(false);
let el_height = ref(window.innerHeight - 2.7 * (window.innerWidth / 3.75));

//处理menu
const menu_data_config = (data) => {
  // 处理无数据的情况
  if (!menu_list.value.length) {
    noMenu.value = true;
    no_menu_txt.value = "noMatch";
  } else {
    noMenu.value = false;
  }
  if (menu_list.value.length && !menu_list.value[menu_index.value].sl.length) {
    noData.value = true;
    no_data_txt = "noMatch";
  } else {
    noData.value = false;
  }
};
watch(menu_index, (i) => {
  list_area.value.setScrollPosition("vertical", 0);
});
watch(base_data.base_data_version, () => {
  const { mew_menu_list_res } = base_data; //获取主数据
  menu_list.value = menu_obj.recombine_menu(mew_menu_list_res);
  menu_data_config();
});
// /**
//  * @description: 球类id转化背景
//  * @param {String} id 球类id
//  * @return {}
//  */
const format_type = (id) => {
  return menu_h5_data.recombine_menu_bg(id);
};
/**
 *@description 页面尺寸变化处理
 *@return {Undefined} undefined
 */
let timer_1;
const window_resize_on = () => {
  clearTimeout(timer_1);
  timer_1 = setTimeout(() => {
    el_height = window.innerHeight - content.value.getBoundingClientRect().top;
  }, 1000);
};

const count_menu = (list = []) => {
  return list ? menu_h5_data.count_menu(list) : 0;
};
/**
 * @description: 切换左侧菜单
 * @param {String} index 选中下标
 * @return {}
 */
const change_menu = (index) => {
  // 埋点
  let objKey = {
    clickTime: "点击时间",
    userName: "用户名",
    userId: "用户ID",
    merchantId: "商户ID",
    languageVersion: "语言版本",
    terminal: "访问终端",
    eventLabel: "事件标签",
  };
  let _obj = {
    [objKey.eventLabel]: "",
    [objKey.clickTime]: DateForMat(new Date(), "yyyy-MM-dd hh:mm:ss"),
    [objKey.userName]: lodash.get(UserCtr, "user_info.userName"),
    [objKey.userId]: lodash.get(UserCtr, "user_info.userId"),
    [objKey.merchantId]: lodash.get(UserCtr, "user_info.mId"),
    [objKey.languageVersion]: lodash.get(UserCtr, "user_info.languageName"),
    [objKey.terminal]: "H5",
  };
  //====================menu router
  if (menu_index.value == index) return;
  let mi = menu_list.value[index].mi;
  menu_index.value = index;
  animation.value = false;
  menu_h5_data.set_current_lv1_menu(menu_list.value[index],index);

  // 动画效果
  //   if (home_timer1_) clearTimeout(home_timer1_);
  //   home_timer1_ = setTimeout(() => {
  //     animation.value = true;
  //   }, 50);
  let newMeuRouter = {
    //H5_首页_虚拟体育
    8: { name: "virtual_sports", query: { home: "home" } },
    408: {
      name: "matchList",
      query: {
        m: mi,
        token: UserCtr.user_token,
      },
    },
    7: {
      //H5_首页_电子竞技
      name: "matchList",
      query: {
        m: mi,
        token: UserCtr.user_token,
      },
    },
  };
  newMeuRouter[mi] && router.push(newMeuRouter[mi]);
  list_area.value.setScrollPosition("vertical", 0);
  return;
};
/**
 * @description 跳转列表页
 * @param {Object} item 列表球种数据
 */
const to_list = (item, index) => {
  if (item.ct) {
    menu_obj.set_current_lv2_menu(item);
    // const euid = menu_h5_data.get_euid(item.mi);
    // console.log(euid)
    router.push({
      name: "matchList",
      query: {
        m: menu_list.value[menu_index.value].mi,
        s: index,
        token: UserCtr.user_token,
      },
    });
  } else {
    $toast(t("home.match_no_has"), 800);
  }
  return;
};
// 计算左边菜单按钮是否展示
const calc_show2 = (item) => {
  if (item?.mi) {
    if (item.mi == 7)
      return (
        lodash.get(UserCtr, "user_info.openEsport") &&
        lodash.get(item, "sl").length > 0
      ); // 电竞tob后台关闭隐藏
    if (item.mi == 8) return lodash.get(UserCtr, "user_info.openVrSport"); // VRtob后台关闭隐藏
    return true;
  }
};

// 浏览器窗口变化事件监听
useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE, window_resize_on);
// 保证赛事框初始高度正确
window_resize_on();
</script>