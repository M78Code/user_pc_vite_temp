<template>
  <!-- 赛事框 -->
  <div class="main-content-match" :style="`height:${el_height}px`" ref="content">
    <div class="match-warp flex" v-if="menu_list.length">
      <div class="left-menu valid" style="width: 80px">
        <q-scroll-area :style="`height:${el_height}px`" :thumb-style="thumbStyle">
          <div class="item" v-for="(item, index) in menu_list" :key="`menu-${index}`"
            :class="{ active: menu_index == index }" :style="compute_css('home-item-' + (menu_index == index ? 'active' : 'unchecked'))
              " @click="change_menu(index)" v-show="calc_show2(item)">
            <span class="label" :class="{ is_chinise: ['zh', 'tw'].includes(get_lang) }">{{ $t(`new_menu.${item.mi}`)
            }}</span>
            <span class="num" v-if="![407, 408, 410].includes(item.mi * 1)">{{
              MenuData.count_menu(item) || ""
            }}</span>
          </div>
        </q-scroll-area>
      </div>
      <div class="match-content col" :class="{ fadeInUp: animation }" v-if="menu_list[menu_index]">
        <q-scroll-area ref="list_area" :style="`height:${el_height}px`" :thumb-style="{
          background: 'transparent',
        }">
          <div class="item" :style="{ 'z-index': item.field1 * 3, position: 'relative' }"
            v-for="(item, index) in menu_list[menu_index].sl || []" :key="index" @click="to_list(item, index)" v-show="!loading_done || item.ct >= 0 || [5, 7].includes(+item.menuType)
              ">
            <div class="item-bg" :style="compute_css('home-item-all')" :class="MenuData.recombine_menu_bg(item)"></div>
            <div class="item-info" :class="{ 'is-english': get_lang == 'en' }">
              <div class="column items-center">
                <!-- <span class="match-type">{{t(`menu_list.${filter_meunu_desc(item.mi)}`) }}</span> -->
                <span class="match-type">{{ item.name || MenuData.get_menus_i18n_map(
                  MenuData.recombine_menu_desc(item.mi)
                ) }}</span>
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
import { api_home } from "src/api/index.js";
import { watch, ref, computed } from "vue";
import { useMittEmit, uid, axios_loop, useMittOn, MITT_TYPES } from "src/core/";
import { db } from "src/core/menu-h5/common/db.js";
// 无网络展示组件
import no_data from "project_path/src/components/common/no-data.vue";
import { MenuData, UserCtr, compute_css } from "src/core/";
import lodash from "lodash";
import { useRouter } from "vue-router";
import { DateForMat } from "src/core/format/index.js";
// import menu_data  from "project_path/src/config/menu_new_data.js" //  api1.5 菜单 本地化假数据
//初始化数据
const router = useRouter();
const menu_list = ref(MenuData.menu_list || []); //菜单列表
const menu_index = ref(0); ////左侧菜单选中项单
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
const loading_done = ref(false)// 代表接口加载结束
//点击动画
let animation = ref(false);
let el_height = ref(window.innerHeight - 2.7 * (window.innerWidth / 3.75));

//处理menu
const menu_data_config = (data) => {
  menu_list.value = data;
  // chang_index(data)
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
//用戶信息變化
watch(UserCtr.user_version, () => {
  get_lang.value = UserCtr.lang;
});
watch(MenuData.update_time, () => {
  const { menu_list: res } = MenuData; //获取主数据
  menu_data_config(MenuData.recombine_menu(res));
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
// const chang_index = (data) => {
//   if ([1, 2, 3].includes(get_home_menu_index)) {
//     data.forEach((item, index) => {
//       if (item.mi ==get_home_menu_index) {
//         menu_index.value = index;
//         change_menu(index);
//       }
//     });
//   }
// };
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
  MenuData.set_current_lv1_menu(menu_list.value[index], index);

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
    MenuData.set_current_lv2_menu(item);
    // const euid = MenuData.get_euid(item.mi);
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

// // 去除串关
// const remove_crosstalk = (data) => {
//   for (let i = data.length - 1; i >= 0; i--) {
//     // 如果是串关去除串关
//     if (data[i].menuType == 11) {
//       data.splice(i, 1);
//     }
//   }
// };



// 主内容 菜单数据处理
// const menu_data_loaded = (data) => {
//   data = lodash.cloneDeep(data);
//   let newData = base_data.recombine_menu(data);
//   // save_home_data(data)
//   menu_data_config(newData);
//   return;
// };
/**
 * @description: 菜单推送
 * @param {Object} skt_data 推送数据
 * @return {}
 */
const ws_change_menu = (skt_data) => {
  //以前好像没有做啥
  // upd_home_data(state, callback) {
  //     if (callback) {
  //       callback(state)
  //     }
  //   },
  // upd_home_data((state) => {
  console.error('ws推送菜单数据', skt_data)
  skt_data.forEach((list) => {
    // menu.forEach((item) => {
    //   if (item.menuId == list.menuId) {
    //     item.count = list.count;
    //   }
    //   item.subList.forEach((sub) => {
    //     if (sub.menuId == list.menuId) {
    //       sub.count = list.count;
    //     }
    //   });
    // });
  });
  // });
  // $forceUpdate();
};

// 浏览器窗口变化事件监听
useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE, window_resize_on);
useMittOn(MITT_TYPES.EMIT_MENU_MATCH_COUNT_CHANGE, ws_change_menu);
// 保证赛事框初始高度正确
window_resize_on();

/**
 * @description: 获取列表数据
 * @return {}
 */
//  const get_list = async () => {
//   loading_done.value = false;
//   //获取indexDB menu数据
//   // let menuBuldata = await db.menus_info.bulkGet()
//   // if(buldata.length>0){
//   //     // res.data = buldata
//   //     console.error(menuBuldata,"parammenu_data======")
//   // }
//   // if (!get_home_data && get_home_data.length) {
//   //   console.error(get_home_data,"parammenu_data======333")
//   //   menu_data_loaded(get_home_data);  // 先用缓存数据
//   // }
//   let params = {
//     cuid: uid ? uid() : "0", //用户ID/或UUid
//     sys: 7, //1 panda 体育 ;3 188体育
//   };
//   const send_gcuuid = uid();
//   params.gcuuid = send_gcuuid;
//   let obj_ = {
//     // axios api对象
//     axios_api: api_home.get_menu_init,
//     // axios api对象参数
//     params: params,
//     // axios中then回调方法
//     fun_then: (res) => {
//       if (res && send_gcuuid != res.gcuuid) return;
//       let code = lodash.get(res, "code");
//       if (code == 200) {
//         let data = lodash.get(res, "data");
//         remove_crosstalk(data);
//         loading_done.value = true;
//         //DB插入数据 缓存menu数据
//         if (!lodash.isEmpty(data)) {
//           //mi 作为主键
//           db.menus_info.bulkAdd(data, "mi");
//           loading_done.value = true;
//         }
//         menu_data_loaded(data);
//         //URL地址带token认定是首次进入，所以首页列表数据加载完后要删除掉
//         if (!location.search.includes("keep_url")) {
//           history.replaceState(
//             null,
//             "",
//             `${location.pathname}${location.hash}`
//           );
//         }
//       } else {
//         menu_data_loaded(menu_data);
//         noMenu.value = true;
//         no_menu_txt.value = "noMatch";
//       }
//     },
//     // axios中catch回调方法
//     fun_catch: (err) => {
//       noMenu.value = true;
//       no_menu_txt.value = "noMatch";
//       loading_done.value = false;
//     },
//     // 最大循环调用次数(异常时会循环调用),默认3次
//     max_loop: 2,
//     // 异常调用时延时时间,毫秒数,默认1000
//     timers: 1000,
//   };
//   // axios_api轮询调用方法
//   const res = await axios_loop(obj_);
// };
// get_list()
</script>