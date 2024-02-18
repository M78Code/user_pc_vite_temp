<template>
  <!-- 赛事框 -->
  <div class="main-content-match" :style="`height:${el_height}px`" ref="content">
    <div class="match-warp flex" v-if="menu_list.length">
      <div class="left-menu valid" style="width: 80px">
        <q-scroll-area :style="`height:${el_height}px`" :thumb-style="thumbStyle">
          <div class="item" v-for="(item, index) in menu_list" :key="`menu-${index}`"
            :class="{ active: menu_type == item.mi }" :style="compute_css_obj('home-item-' + (menu_type == item.mi ? 'active' : 'unchecked'))
              " @click="change_menu(item, index)" v-show="calc_show2(item)">
            <span class="label" :class="{ is_chinise: ['zh', 'tw', 'hk'].includes(lang) }">{{ i18n_t(`new_menu.${item.mi}`)
            }}</span>
            <span class="num" v-if="![407, 408, 410].includes(item.mi * 1)">{{
              MenuData.count_menu(item)
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
            <div class="item-bg" :style="compute_css_obj('home-item-all')" :class="MenuData.recombine_menu_bg(item)"></div>
            <div class="item-info" :class="{ 'is-english': lang == 'en' }">
              <div class="column items-center">
                <!-- <span class="match-type">{{i18n_t(`menu_list.${filter_meunu_desc(item.mi)}`) }}</span> -->
                <span class="match-type">{{ item.name || MenuData.get_menus_i18n_map(item.mi) }}</span>
                <span class="match-num ellipsis">{{ item.ct || 0 }}</span>
                <span class="match-label ellipsis-2-lines">{{
                  i18n_t("home.can_bet")
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
import { useMittOn, MITT_TYPES } from "src/output/index.js";
// 无网络展示组件
import no_data from "src/base-h5/components/common/no-data.vue";
import { MenuData, UserCtr, compute_css_obj } from "src/output/index.js";
import lodash from "lodash";
import { useRouter } from "vue-router";
import { DateForMat } from "src/output/index.js";
import { lang } from "src/base-h5/mixin/userctr";
import base_data from "src/core/base-data/base-data.js";

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
  // 如果是串关去除串关 热门 赛果

  const filter = data.filter(i => {
    if (MenuData.is_esports(i.mi)) return base_data.is_mi_2000_open; // 电竞tob后台关闭隐藏
    if (MenuData.is_vr(i.mi)) return base_data.is_mi_300_open; // VRtob后台关闭隐藏
    return !MenuData.is_mix(i.mi) && !MenuData.is_hot(i.mi) && !MenuData.is_results(i.mi)
  })
  menu_list.value = filter;
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
  list_area.value && list_area.value.setScrollPosition("vertical", 0);
});
watch(MenuData.update_time, () => {
  const { menu_list: res, menu_lv2 } = MenuData; //获取主数据
  menu_data_config((res));
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
  if (data && data.length && ![1, 2, 3, 4].includes(menu_type.value)) {
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
    if (content.value)
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
        // token: UserCtr.user_token,
      },
    },
    7: {
      //H5_首页_电子竞技
      name: "matchList",
      query: {
        m: mi,
        // token: UserCtr.user_token,
      },
    },
  };
  list_area.value?.setScrollPosition("vertical", 0);
  MenuData.set_current_lv1_menu(item, index)
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
        // token: UserCtr.user_token,
      },
    });
  } else {
    $toast(i18n_t("home.match_no_has"), 800);
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
onMounted(() => {
  chang_index(menu_list.value)
})
</script>
<style lang="scss" scoped>
/*  赛事框 */
.main-content-match {
  .match-warp {
    display: flex;
    height: 100%;
    margin: 0 0.1rem;

    :deep(.q-scrollarea) {
      height: 100%;
    }
  }

  .left-menu {
    padding-top: 0.08rem;
    width: 0.55rem;
    margin-right: 0.13rem;
    overflow-x: hidden;
    /* 兼容火狐 */
    scrollbar-width: none;
    /* 兼容IE10+ */
    -ms-overflow-style: none;

    /* 使用伪类选择器 ::-webkit-scrollbar ,兼容chrome和safari浏览器 */
    &::-webkit-scrollbar {
      display: none;
    }

    .item {
      width: 0.53rem;
      height: 0.63rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      margin-bottom: 0.05rem;
      position: relative;

      .label {
        width: 100%;
        font-size: 0.11rem;
        line-height: 0.16rem;
        text-align: center;
        font-weight: bold;

        &.is_chinise {
          font-size: 0.14rem;
          width: 0.36rem;
        }
      }

      .num {
        font-size: 0.16rem;
        line-height: 0.19rem;
      }
    }
  }

  .match-content {

    flex: 1;

    .item {
      width: 100%;
      height: 1.22rem;
      padding-left: 0.2rem;
      background-repeat: no-repeat;
      margin-bottom: -0.03rem;
      display: flex;
      position: relative;

      .item-bg {
        width: 2.67rem;
        height: 1.028rem;
        position: absolute;
        left: 0;
        top: 0.11rem;
        z-index: -1;
        overflow: hidden;
      }

      .item-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: 100%;
        text-align: center;

        &.is-english {
          width: auto;
          align-items: flex-start;
        }

        .match-type {
          font-size: 0.18rem;
          width: 1rem;
          font-weight: bold;
          white-space: nowrap;
        }

        .match-num {
          width: 1rem;
          font-size: 0.4rem;
          height: 0.44rem;
          line-height: 0.44rem;
        }

        .match-label {

          font-size: 0.12rem;

          display: flex;
          align-items: center;
          line-height: 1;
          min-height: 0.15rem;

          &:before,
          &:after {
            content: "";
            width: 0.15rem;
            height: 0.01rem;

            position: relative;
          }

          &:before {
            margin-right: 0.04rem;
          }

          &:after {
            margin-left: 0.04rem;
          }
        }
      }
    }
  }
}

.fadeInUp {
  -webkit-animation: fadeInUp 1s;
  animation: fadeInUp 1s;
  animation-fill-mode: both;
}

@keyframes fadeInUp {
  0% {
    -webkit-transform: translate3d(0, 5%, 0);
    transform: translate3d(0, 5%, 0);
  }

  10% {
    -webkit-transform: translate3d(0, 10%, 0);
    transform: translate3d(0, 10%, 0);
  }

  30% {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }

  100% {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
</style>
<style lang="scss" scoped>
.main-content-match {
    .left-menu {
      .item {
        background-image: var(--q-gb-bg-lg-8);
        .label {
          color: var(--q-gb-t-c-3);
        }
        .num {
          color: var(--q-gb-t-c-18);
        }
        &.active {
          background-image: var(--q-gb-bg-lg-6);
          .label,
          .num {
            color:  var(--q-gb-t-c-14);
          }
        }
      }
    }
    .match-content {
      .item {
        --per: -1.0272rem;
        .item-info {
          .match-type {
            color: var(--q-gb-t-c-3);
          }
          .match-num {
            color: var(--q-gb-t-c-3);
          }
          .match-label {
            color: var(--q-match-fs-color-1);
            &:before,
            &:after {
              background: rgba(153, 153, 153, 0.3);
            }
          }
        }
        .item-bg{
          &.football,&.basketball,&.badminton,&.pingpang,
          &.baseball,&.ice_hockey,&.boxing,&.handball,&.beach_volleyball,
          &.hockey,&.funny,&.gaoerfu,&.huachuan,&.feibiao,
          &.banqiu,&.binghu,&.fanchuan,&.jijian,&.juzhong,
          &.kongshoudao,&.qita,&.quwei{
            background-size: 2.67rem 22.6rem;
            background-position-x: center;
            background-image:  var(--q-color-img-bg-7);
          }
          &.tennis,&.snoke,&.volleyball,&.water_polo,&.rugby_union,
          &.usa_football,&.saiche,&.shatanzuqiu,&.shejian,&.shuaijiao,
          &.taiquandao,&.tianjing,&.tiaoshui,&.ticao,&.youyong,
          &.zixingche,&.sheji,&.roudao,&.roudao, &.saima,&.saigou {
            background-size: 2.67rem 20.55rem;
            background-position-x: center;
            background-image:  var(--q-color-img-bg-2);
          }
          &.football{
            background-position-y:  calc(var(--per) * 12);
          }
          &.basketball {
            background-position-y: calc(var(--per) * 18);
          }
          &.tennis {
            background-position-y: calc(var(--per) * 8);
          }
          &.badminton {
            background-position-y: calc(var(--per) * 21);
          }
          &.snoke {
            background-position-y: calc(var(--per) * 10);
          }
          &.pingpang {
            background-position-y: calc(var(--per) * 2);
          }
          &.baseball {
            background-position-y: calc(var(--per) * 19);
          }
          &.ice_hockey {
            background-position-y: calc(var(--per) * 6);
          }
          &.usa_football {
            background-position-y: calc(var(--per) * 4);
          }
          &.volleyball {
            background-position-y: calc(var(--per) * 3);
          }
          &.funny {
            background-position-y: calc(var(--per) * 11);
          }
          &.rugby_union {
            background-position-y: calc(var(--per) * 18);
          }
          &.boxing {
            background-position-y:  calc(var(--per) * 15);
          }
          &.beach_volleyball {
            background-position-y:  calc(var(--per) * 17);
          }
          &.handball {
            background-position-y:  calc(var(--per) * 9);
          }
          &.water_polo {
            background-position-y:  calc(var(--per) * 2);
          }
          &.hockey {
            background-position-y:  calc(var(--per) * 8);
          }
          &.banqiu {
            background-position-y:  calc(var(--per) * 20);
          }
          &.binghu {
            background-position-y:  calc(var(--per) * 17);
          }
          &.fanchuan {
            background-position-y:  calc(var(--per) * 14);
          }
          &.feibiao {
            background-position-y:  calc(var(--per) * 13);
          }
          &.gaoerfu {
            background-position-y:  calc(var(--per) * 10);
          }
          &.huachuan {
            background-position-y:  calc(var(--per) * 7);
          }
          &.jijian {
            background-position-y:  calc(var(--per) * 5);
          }
          &.juzhong {
            background-position-y:  calc(var(--per) * 4);
          }
          &.kongshoudao {
            background-position-y:  calc(var(--per) * 3);
          }
          &.qita {
            background-position-y:  calc(var(--per) * 1);
          }
          &.saiche {
            background-position-y:  calc(var(--per) * 17);
          }
          &.shatanzuqiu {
            background-position-y:  calc(var(--per) * 14);
          }
          &.shejian {
            background-position-y:  calc(var(--per) * 12);
          }
          &.shuaijiao {
            background-position-y:  calc(var(--per) * 11);
          }
          &.taiquandao {
            background-position-y:  calc(var(--per) * 9);
          }
          &.tianjing {
            background-position-y:  calc(var(--per) * 7);
          }
          &.tiaoshui {
            background-position-y:  calc(var(--per) * 6);
          }
          &.ticao {
            background-position-y:  calc(var(--per) * 5);
          }
          &.youyong {
            background-position-y:  calc(var(--per) * 1);
          }
          &.zixingche {
            background-position-y: 0;
          }
          &.sheji {
            background-position-y:  calc(var(--per) * 13);
          }
          &.roudao {
            background-position-y:  calc(var(--per) * 19);
          }
          &.saima {
            background-position-y:  calc(var(--per) * 15);
          }
          &.saigou {
            background-position-y:  calc(var(--per) * 16);
          }
          &.quwei {
            background-position-y:  0;
          }
        }
      }
    }
  }

</style>src/outputsrc/output/index.js