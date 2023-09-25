<template>
  <!-- 赛事框 -->
  <div class="main-content-match" :style="`height:${el_height}px`" ref="content">
    <div class="match-warp flex" v-if="menu_list.length">
      <div class="left-menu valid" style="width: 80px">
        <q-scroll-area :style="`height:${el_height}px`" :thumb-style="thumbStyle">
          <div class="item" v-for="(item, index) in menu_list" :key="`menu-${index}`"
            :class="{ active: menu_type == item.mi }" :style="compute_css('home-item-' + (menu_type == item.mi ? 'active' : 'unchecked'))
              " @click="change_menu(item, index)" v-show="calc_show2(item)">
            <span class="label" :class="{ is_chinise: ['zh', 'tw'].includes(get_lang) }">{{ $t(`new_menu.${item.mi}`)
            }}</span>
            <span class="num" v-if="![407, 408, 410].includes(item.mi * 1)">{{
              MenuData.count_menu(item) || ""
            }}</span>
          </div>
        </q-scroll-area>
      </div>
      <div class="match-content col" :class="{ fadeInUp: animation }" v-if="menu_lv2_list">
        <q-scroll-area ref="list_area" :style="`height:${el_height}px`" :thumb-style="{
          background: 'transparent',
        }">
          <div class="item" :style="{ 'z-index': item.field1 * 3, position: 'relative' }"
            v-for="(item, index) in menu_lv2_list" :key="index" @click="to_list(item, index)" v-show="!loading_done || item.ct >= 0 || [5, 7].includes(+item.menuType)
              ">
            <div class="item-bg" :style="compute_css('home-item-all')" :class="MenuData.recombine_menu_bg(item)"></div>
            <div class="item-info" :class="{ 'is-english': get_lang == 'en' }">
              <div class="column items-center">
                <!-- <span class="match-type">{{t(`menu_list.${filter_meunu_desc(item.mi)}`) }}</span> -->
                <span class="match-type">{{ item.name || MenuData.get_menus_i18n_map(item.mi) }}</span>
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
    <no-data :which="no_menu_txt" height="500" style="padding-top: 0.6rem" v-if="noMenu"></no-data>
  </div>
</template>
<script setup>
import { watch, ref, onMounted } from "vue";
import { useMittOn, MITT_TYPES } from "src/core/";
// 无网络展示组件
import no_data from "project_path/src/components/common/no-data.vue";
import { MenuData, UserCtr, compute_css } from "src/core/";
import lodash from "lodash";
import { useRouter } from "vue-router";
import { DateForMat } from "src/core/format/index.js";
//初始化数据
const router = useRouter();
const menu_list = ref(MenuData.menu_list || []); //菜单列表
const menu_lv2_list = ref(MenuData.menu_lv2 || []); //二级菜单列表
const list_area = ref(null); //dom
const content = ref(null); //dom

let noData = ref(false);
let no_data_txt = ref("moMatch");
let noMenu = ref(false);
let no_menu_txt = ref("moMatch");
const get_lang = ref(UserCtr.lang);
const thumbStyle = {
  background: "transparent"
}
const { menu_type } = MenuData;

const loading_done = ref(false)// 代表接口加载结束
//点击动画
let animation = ref(false);
let home_timer1_;
let el_height = ref(window.innerHeight - 2.7 * (window.innerWidth / 3.75));
//处理menu
const menu_data_config = (data) => {
  remove_crosstalk(data);// 如果是串关去除串关
  menu_list.value = data;
  chang_index(data)
  // 处理无数据的情况
  if (!menu_list.value.length) {
    noMenu.value = true;
    no_menu_txt.value = "noMatch";
  } else {
    noMenu.value = false;
  }
  if (menu_list.value.length && menu_lv2_list.value?.length) {
    noData.value = true;
    no_data_txt = "noMatch";
  } else {
    noData.value = false;
  }
};
const cancel_watch = watch(menu_type, (i) => {
  list_area.value.setScrollPosition("vertical", 0);
});
//用戶信息變化
watch(UserCtr.user_version, () => {
  get_lang.value = UserCtr.lang;
});
watch(MenuData.update_time, () => {
  const { menu_list: res, menu_lv2 } = MenuData; //获取主数据
  menu_data_config(MenuData.recombine_menu(res));
  menu_lv2_list.value = menu_lv2
});
//TODO  应该是菜单变化？
// watch(
//   () => uid,
//   () => {
//     handler = "get_list";
//   }
// );+
// const { menu_type } = MenuData; ////左侧菜单选中项单
/**
 * 菜单数据 改变后 重新改变menu_index?
*/
const chang_index = (data) => {
  //如果不是 早盘 滚球 冠军 今日 是不会有二级菜单的 所以重新设定为第一个
  if (![1, 2, 3, 4].includes(menu_type.value)) {
    change_menu(data[0], 0);
  }
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
/**
 * @description: 切换左侧菜单
 * @param {String} index 选中下标
 * @return {}
 */
const change_menu = (item, index) => {
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
  if (lodash.get(item, 'mi') == menu_type.value) return;
  let mi = lodash.get(item, 'mi')

  animation.value = true;
  // 动画效果
  //   if (home_timer1_) clearTimeout(home_timer1_);
  //   home_timer1_ = setTimeout(() => {
  //     animation.value = true;
  //   }, 50);
  // 动画效果
  clearTimeout(home_timer1_)
  home_timer1_ = setTimeout(() => {
    animation.value = false
  }, 5000)
  let newMeuRouter = {
    //H5_首页_虚拟体育
    8: { name: "virtual_sports", query: { home: "home" } },
    30: {
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
  list_area.value?.setScrollPosition("vertical", 0);
  MenuData.set_current_lv1_menu(item)
  if (newMeuRouter[mi]) {
    cancel_watch()
    router.push(newMeuRouter[mi]);
  }
};
/**
 * @description 跳转列表页
 * @param {Object} item 列表球种数据
 */
const to_list = (item, index) => {
  if (item.ct) {
    MenuData.set_current_lv2_menu(item);
    router.push({
      name: "matchList",
      query: {
        m: menu_type.value,
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
// 去除串关
const remove_crosstalk = (data = []) => {
  // 如果是串关去除串关
  const idx = data.findIndex(i => i.mi == 6)
  idx > -1 && data.splice(idx, 1);
};
// 浏览器窗口变化事件监听
useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE, window_resize_on);
// 保证赛事框初始高度正确
window_resize_on();
onMounted(() => {
  chang_index(menu_list.value)
})
</script>