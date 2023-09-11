<template>
  <div class="match-main-menu">
    <div class="menu-inner-wrap">
      <div class="main-wrap flex">
        <slot name="left">
          <div class="goback-icon-wrapper column justify-center">《</div>
        </slot>
        <div class="main-menu-container">
          <template v-for="(item, index) in menu_list" :key="item.mi">
            <div class="m-menu-item" v-show="show_dianjing(item, index)">
              <span @click="set_menu_lv1(item, index)">
                {{ i18n_t("new_menu." + item.mi) || item.mi }}
              </span>
              <span
                v-if="index == 1"
                @click="show_selector_sub = !show_selector_sub"
              >
                +++</span
              >
            </div>
          </template>

          <!-- 右侧活动和弹出设置 -->
          <slot name="right"></slot>
        </div>
      </div>
      <!--二级菜单, 三级菜单，上下滑动 隐藏显示 , 竞彩足球 (get_menu_type:30 不显示二级菜单) -->
      <div class="sub-menu-date-w" v-if="menu_type !== 30">
        <!-- :class="{
          simple: menu_wrap_simple && menu_type != 7,
          zaopan: [4, 11, 28, 3000].includes(+menu_type),
          esport: 3000 == menu_type,
        }" -->
        <!-- 二级菜单, 三级菜单, 四级菜单  -->
        <div class="sport-m-container">
          <!-- :class="{
            simple: sport_container_simple && menu_type != 7,
            'shadow-down': menu_type != 7,
          }" -->
          <!--   二级菜单 除了‘全部’按钮的其他所有 二级菜单  -->
          <div class="s-menu-container flex">
            <!--  二级菜单 滚球下边的一个按钮   "全部"按钮  -->
            <sub-menu-specially
              v-show="GlobalAccessConfig.get_playAllShow() && menu_type == 1"
              :title="i18n_t('footer_menu.all')"
              @click="select_all_sub_menu_handle"
              v-if="GlobalAccessConfig.get_playAllShow()"
            >
              <!-- :count="all_sport_count_calc()" -->

              <span
                class="sport-icon-wrap"
                :class="get_sport_icon(get_sport_all_selected)"
              ></span>
            </sub-menu-specially>
            <template v-for="(item, index) in current_menu" :key="item.mi">
              <div
                class="sport-menu-item flex justify-center"
                v-show="[7, 28].includes(menu_type) ? item.ct > 0 : true"
                @click="set_menu_lv2(item, index)"
              >
                {{ item.mi }}
                <span>
                  {{
                    item.name ||
                    base_data.menus_i18n_map[
                      menu_h5_data.recombine_menu_desc(item.mi)
                    ] ||
                    ""
                  }}<i>{{ item.ct }}</i>
                </span>
              </div>
            </template>
          </div>

          <!-- 三级菜单 日期 (只有 串关，早盘，赛果，电竞，才有) -->
          <div
            class="d-c-wrapper"
            :class="{ esport: menu_type == 7 }"
            v-if="is_show_three_menu"
          >
            <div
              class="date-container"
              ref="date_menu_container"
              :class="{ esport: menu_type == 7 }"
            >
              <div
                class="date-menu-item"
                :key="date_index"
                :class="{
                  focus: date_menu_curr_i === date_index,
                  'is-favorite': show_favorite_list,
                  'hidden-champion':
                    show_favorite_list &&
                    menu_type == 7 &&
                    date_menu_item.menuId === '-999',
                }"
                @click="set_menu_lv3(date_index, 'date_click')"
                v-for="(date_menu_item, date_index) of date_menu_list"
              >
                <div>
                  <!-- 串关不显示日期菜单后面的数量 -->
                  {{ date_menu_item.menuName }}
                  <span
                    v-if="
                      !show_favorite_list &&
                      date_menu_item.count &&
                      ![11, 28].includes(+menu_type)
                    "
                  >
                    &nbsp;({{ date_menu_item.count }})
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!--四级菜单 虚拟体育赛果才有的 联赛tab-->
          <div class="virtual-sports-results" v-if="is_show_four_menu">
            <div
              class="tab-item"
              v-for="(tab_item, i) of virtual_sports_results_tab"
              :key="i"
              @click="set_menu_lv4(tab_item, i)"
            >
              {{ tab_item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--主菜单里边---中间下拉弹框-->
  <div
    v-show="show_selector_sub"
    class="main-m-selector-w"
    @click="show_selector_sub = false"
    :class="{
      'effct-in': show_selector_sub,
    }"
    style="background: rgba(0, 0, 0, 0.2)"
  >
    <!-- :class="{ 'effct-in': show_selector_s2 }"

    中间下拉弹框内容=》 -->
    <!-- v-show="show_selector_sub" -->
    <div
      class="selector-w-inner flex wrap justify-left hairline-border show"
      :class="{
        favorite: show_favorite_list,
        show: show_selector_sub,
      }"
      style="background: #fff"
    >
      <template :key="i_m" v-for="(m_items, i_m) in pop_main_items">
        <div
          @click="set_menu_lv1(m_items, i_m, true)"
          class="main-m-select-item flex justify-center items-center"
          v-show="is_menu_show(m_items, i_m)"
        >
          <!-- current -->
          <div class="m-menu-name-m">
            {{ i18n_t(`new_menu.${m_items.mi}`) }}
          </div>
          <!-- <div class="m-count-match" v-if="!show_favorite_list">
            {{ count_menu(m_items) }}
          </div> -->
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import subMenuSpecially from "./sub-menu-specially.vue";
import { ref, watch, computed, unref } from "vue";
import GlobalAccessConfig from "src/core/access-config/access-config.js";
import { i18n_t, utils, UserCtr, get_file_path } from "src/core/index.js";
import base_data from "src/core/base-data/base-data.js";
import menu_h5_data from "src/core/menu-h5/menu-data-class.js";
import { cloneDeep, findIndex } from "lodash";
import { useRoute } from "vue-router";

// "1": "滚球",
//   "2": "今日",
//   "3": "早盘",
//   "4": "冠军",
//   "5": "即将开赛",
//   "6": "串关",
//   "7": "电竞",
//   "8": "VR",
//   "30": "竞足",
//   "28": "赛果",
const route = useRoute();
const props = defineProps({
  // 菜单配置
  menu_config: {
    type: Object,
    default: () => {},
  },
});

//一级菜单
let menu_list = ref([]);
//二级 菜单 当前菜单
let current_menu = ref({});
//三级菜单 早盘日期菜单项
let date_menu_list = ref([]);
// 如果是赛果，并且是 虚拟体育, 即 是  四级菜单
let virtual_sports_results_tab = ref([]);
const show_selector_sub = ref(false); //展示弹出框
// 一级菜单mi ref
const { menu_type, update_time } = menu_h5_data;

//是否显示三级菜单
const is_show_three_menu = computed(() => {
  console.error("是否展示三级", date_menu_list.value.length);
  return (
    menu_h5_data.get_is_show_three_menu() && date_menu_list.value.length > 0
  );
});
//是否显示四级菜单
const is_show_four_menu = computed(() => {
  console.error("是否展示四级", virtual_sports_results_tab.value.length);

  return (
    menu_h5_data.is_results_virtual_sports() &&
    virtual_sports_results_tab.value.length > 0
  );
});
const pop_main_items = ref([]); //弹出框数据
const show_favorite_list = ref(false); //是否显示收藏列表
// 获取主菜单列表  main_select_items 弹出的一级 菜单数据   main_menu_list_items 一级菜单数据
watch(update_time, (update_time) => {
  console.error(menu_h5_data.menu_list, update_time);
  const [lv1, pop] = menu_h5_data.get_sport_menu(); //获取体育菜单 【一级菜单，弹出框菜单】
  menu_list.value = lv1; //一级
  pop_main_items.value = pop; //pop级
  current_menu.value = menu_h5_data.menu_lv2; //2级
  date_menu_list.value = menu_h5_data.menu_lv3; //三级
  virtual_sports_results_tab.value = menu_h5_data.menu_lv4; //4级
});
/**
 * 一级菜单事件
 */
function set_menu_lv1(item, index, is_pop) {
  show_selector_sub.value = false;
  //弹出框点击
  if (is_pop) {
    menu_list.value.splice(1, 1, item);
  }
  menu_h5_data.set_current_lv1_menu(item, index);

  switch (item.mi) {
    case 1://滚球下的全部
    if(this.sport_all_selected)
      select_all_sub_menu_handle();
      break;
    case 28: //赛果
      menu_h5_data.get_results_menu();
      break;
    default:
      current_menu.value = item.sl;
      set_menu_lv2(item.sl[0], 0);
  }
}
/**
 * 二级菜单事件
 */
async function set_menu_lv2(item, index) {
  menu_h5_data.set_current_lv2_menu(item, index);
  // // 早盘,串关,电竞拉取接口更新日期菜单 3,6,7
  // const three_menu = await menu_h5_data.get_date_menu_api_when_subchange();
  // console.error(three_menu);
  // if (three_menu && three_menu.length) {
  //   date_menu_list.value = three_menu;
  //   // select_result_date_menu();
  //   set_menu_lv3(three_menu[0], 0);
  // }
  // if ([3, 6, 7].includes(menu_h5_data.get_current_sub_menuid())) {
  //   const threedata =await menu_h5_data.get_date_menu_api_when_subchange();
  //   console.error(threedata);
  //   select_result_date_menu();
  // } else {
  //   menu_h5_data.set_current_lv3_menu(null);
  // }
}
/**

 /**
     * 二级菜单 滚球 点击全部
     */
function select_all_sub_menu_handle() {
  let data_list = menu_h5_data.current_lv_1_menu.sl;
  let changeSubmenu = null;
  this.sub_menu_i = null; // 重置上一次储存二级菜单下标
  let selected_sub_menu_i_list = [];
  let euid_list = [];
  // this.set_useid_ievname(0); // 重置上次储存二级菜单muid
  // 二级菜单 下标
  data_list.forEach((sub_m, sub_i) => {
    if (sub_m.ct) {
      let euid = menu_h5_data.get_euid(sub_m.mi);
      euid_list.push(euid);
      selected_sub_menu_i_list.push(sub_i);
    }
  });
  // 设置 全部二级菜单euid
  changeSubmenu = euid_list.join(",");

  // this.set_current_second_menu(changeSubmenu);
  // this.set_current_sub_menuid(changeSubmenu);
  // 设置 全部二级菜单下index
  // this.selected_sub_menu_i_list = selected_sub_menu_i_list;
  // 设置缓存，代表全部
  // this.set_sport_all_selected(true);
}
/**
 * 三级菜单事件
 */
function set_menu_lv3(item, index) {
  //点击当前 就不做什么
  if (
    menu_h5_data.current_lv_3_menu &&
    menu_h5_data.current_lv_3_menu.menuId == item.menuId
  ) {
    return;
  }
  //设置三级菜单
  menu_h5_data.set_current_lv3_menu(item, index);
  // 如果是赛果，并且是 虚拟体育, 即 是  四级菜单
  // if (menu_h5_data.is_results_virtual_sports()) {

  //   // this.virtual_sports_results_click_handle(
  //   //   this.virtual_sports_results_tab[this.virtual_sports_results_tab_item_i],
  //   //   this.virtual_sports_results_tab_item_i
  //   // );
  // } else {
  //   //  是三级菜单
  //   // this.four_menu_item = null;
  //   // 菜单实例 初始化
  //   // this.handle_MenuInfoInstance_init();
  // }
}
/**
 * 四级菜单事件
 */
function set_menu_lv4(item, index) {
  menu_h5_data.set_current_lv4_menu(item, index);
}
//判断后台是否展示 VR / 电竞
const show_dianjing = (item, index) => {
  if (item?.mi) {
    if (item.mi == 7) return base_data.is_mi_2000_open; // 电竞tob后台关闭隐藏
    if (item.mi == 8) return base_data.is_mi_300_open; // VRtob后台关闭隐藏
    return ![2, 3, 6, 7].includes(index);
  }
};
//弹出框 是否展示
function is_menu_show(item) {
  if (item.mi == 28 && show_favorite_list.value) {
    return false;
  }
  let reslut = true;
  if ([2, 3, 4, 30].includes(+item.mi)) {
    if (item.ct <= 0) {
      reslut = false;
    }
  }
  return reslut;
}
menu_h5_data.set_query_menu(route.query)
</script>

<style scoped lang="scss">
.menu-inner-wrap {
  width: 100%;
  height: 0.44rem;
  position: relative;
  padding-bottom: 0.01rem;
  .m-i-background {
    width: 100%;
    height: 1.35rem;
    background-repeat: no-repeat;
    background-size: cover;
    // 使用css变量统一管理，所以废弃这里代码，转为不遍历
    // @each $e-sports in dota, lol, wangzhe, csgo {
    //   &.#{$e-sports} {
    //     background-image:  url("~public/image/bw3/menu/menu-top-background-#{$e-sports}.jpg");
    //   }
    // }
    &.dota {
      background-image: var(--q-color-com-img-bg-169);
    }

    &.lol {
      background-image: var(--q-color-com-img-bg-170);
    }

    &.wangzhe {
      background-image: var(--q-color-com-img-bg-171);
    }

    &.csgo {
      background-image: var(--q-color-com-img-bg-172);
    }
  }
  .main-wrap {
    width: 100%;
    height: 0.44rem;
    display: flex;
    align-items: center;
    color: #414655;
    transition: padding-top 0.3s;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    &.esport {
      background-color: transparent;
    }

    .goback-icon-wrapper {
      height: 0.2rem;
      padding-left: 0.15rem;
      img {
        width: 0.12rem;
        height: 0.2rem;
      }
    }
    .goback-icon-wrapper2 {
      visibility: hidden;
    }
    .main-menu-container {
      flex: 1;
      height: 0.27rem;
      line-height: 1;
      position: relative;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      border-radius: 0 0 0.05rem 0.05rem;
      padding-top: 1px;
      padding-right: 0.04rem;
      margin-left: 0.15rem;
      &.esport {
        background-color: transparent;
      }
      .m-menu-item {
        flex: 1;
        max-width: 0.8rem;
        position: relative;
        height: 0.2rem;
        font-size: 0.16rem;
        display: flex;
        justify-content: center;
        &.current {
          .i-title {
            font-weight: bold;
            &:after {
              content: " ";
              position: absolute;
              /* right: 0.03rem; */
              width: 0.22rem;
              height: 0.03rem;
              border-radius: 0.015rem;
              display: block;
              left: 50%;
              transform: translateX(-50%);
              // background-color: #ffb001;
            }
          }
          .m-menu-count {
            font-weight: bold;
          }
          &.esport {
            .i-title,
            .m-menu-count {
              color: #ffffff;
            }
          }
        }
        .i-title {
          text-overflow: ellipsis;
          white-space: nowrap;
          //overflow: hidden;
          line-height: 0.2rem;
          position: relative;
        }
        &.main_menu_407 {
          &.is_favorite {
            visibility: hidden;
          }
        }
        &.main_menu_410 {
          margin-right: 0;
          position: relative;
          left: 0.06rem;
        }
        .m-menu-count {
          width: 0.14rem;
          height: 0.18rem;
          position: relative;
          top: -0.04rem;
          left: 0.01rem;
          padding-left: 0.02rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          .count {
            font-size: 0.11rem;
            &.is_unit {
              min-width: 15px;
              text-align: center;
            }
          }
        }
        &.current {
          .i-title,
          .m-menu-count {
            font-weight: bold;
          }
          &.esport {
            .i-title,
            .m-menu-count {
              color: #ffffff;
            }
          }
        }
        .dir-triangle {
          width: 0;
          height: 0;
          border-left: 0.04rem solid transparent;
          border-right: 0.04rem solid transparent;
          //border-top: .04rem solid #000000;
          margin-top: 0.03rem;
          transition: transform 0.3s;
          position: absolute;
          top: 0.1rem;
          left: 0.03rem;
          &.open {
            transform: rotateZ(180deg);
          }
          &.arrow_esport {
            border-top: 0.04rem solid #fff;
          }
        }
      }
    }
    .activity-logo {
      display: block;
      width: 0.4rem;
      height: 0.3rem;
      margin: 0 0.1rem 0 0;
      border: none;
      position: relative;
      left: -0.05rem;
    }
    .red-dot {
      width: 0.05rem;
      height: 0.05rem;
      border-radius: 50%;
      background: #b11e33;
      position: absolute;
      right: 0.42rem;
      top: 0.06rem;
    }
  }

  .sub-menu-date-w {
    width: 100%;
    max-height: 1.35rem;
    position: absolute;
    left: 0;
    top: 0.44rem;
    transition: transform 0.6s, max-height 0.3s;
    &.esport {
      transition: unset !important;
      .sport-m-container {
        background-color: transparent;
      }
    }
    &.simple {
      transform: translate3d(0, -0.6rem, 0);

      &.zaopan {
        transform: translate3d(0, -0.93rem, 0);
      }
    }
    // 二级菜单
    .sport-m-container {
      width: 100%;
      height: auto;
      max-height: 1.35rem;
      overflow: hidden;
      position: relative;

      .s-menu-container {
        width: 100%;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        padding-top: 0.13rem;
        padding-bottom: 0.05rem;
        flex-wrap: nowrap;
        scrollbar-width: none; // 去除滚动条火狐浏览器兼容性问题
        .sport-menu-item {
          width: 0.7rem;
          height: 100%;
          flex-shrink: 0;
          &.champion {
            // width: 0.9rem;
          }
          &.current {
            .inner-w {
              position: relative;
              font-size: 0.1rem;
              &.favorite {
                &:after {
                  background: rgba(255, 145, 36, 0.08);
                }
              }
            }
          }
          .inner-w {
            height: 0.41rem;
            flex-direction: column;
            flex-wrap: nowrap;
            position: relative;
            .sport-w-icon {
              height: 0.27rem;
              position: relative;
              .sport-icon-wrap {
                --per: -0.32rem;
                display: block;
                width: auto;
                height: 0.22rem;
                width: 0.22rem;
                background: var(--q-color-com-img-bg-140) no-repeat 0 0 /
                  0.22rem 18.88rem;
                // 使用css变量统一管理，所以废弃这里代码，转为不遍历
                // @each $item, $img in (d: '04', c: '03', a: '01', e: 'y0', b: '05') {
                //   &.focus-#{$item} {
                //     background-image: url("~public/image/wwwassets/bw3/menu/sport_menu_#{$img}.png");
                //   }
                // }
                &.focus-d {
                  background-image: var(--q-color-com-img-bg-205);
                }

                &.focus-c {
                  background-image: var(--q-color-com-img-bg-206);
                }

                &.focus-a {
                  background-image: var(--q-color-com-img-bg-207);
                }

                &.focus-e {
                  background-image: var(--q-color-com-img-bg-208);
                }

                &.focus-b {
                  background-image: var(--q-color-com-img-bg-209);
                }
              }
              @each $s-number, $y in (s1, 1), (s2, 3), (s3, 28), (s4, 6),
                (s5, 19), (s6, 4), (s7, 15), (s10, 22), (s11, 13), (s12, 10),
                (s13, 12), (s8, 7), (s9, 6), (s20, 4), (s17, 6), (s2101, 39),
                (s2103, 40), (s2102, 41), (s2100, 42), (s16, 14), (s23, 8),
                (s41, 9), (s44, 10), (s1002, 11), (s45, 12), (s43, 13),
                (s24, 14), (s14, 20), (s27, 16), (s25, 17), (s39, 18), (s13, 19),
                (s22, 20), (s26, 21), (s15, 8), (s1011, 23), (s1009, 24),
                (s30, 26), (s19, 28), (s1001, 29), (s1004, 30), (s29, 31),
                (s48, 32), (s49, 33), (s50, 34), (s51, 35), (s52, 36), (s53, 38),
                (s3001, 39), (s3003, 40), (s3004, 41), (s3002, 42), (s20030, 43),
                (s20031, 44), (s20032, 45), (s20026, 46), (s20027, 47),
                (s20033, 48), (s20034, 49), (s20035, 50), (s20036, 51),
                (s20037, 52), (s20038, 53), (s20039, 54), (s100, 55), (s40, 56),
                (s1010, 57)
              {
                .#{$s-number} {
                  background-position-y: calc(var(--per) * #{$y});
                }
              }
              .sport-icon-wrap2 {
                position: absolute;
                bottom: 0;
                right: -0.04rem;
                width: 0.13rem;
                height: 0.14rem;
              }
              .sport-match-count {
                width: 1px;
                height: 1px;
                line-height: 1;
                position: absolute;
                right: -0.03rem;
                top: 0;
                font-size: 0.11rem;
              }
            }
            .s-w-i-title {
              max-width: 0.7rem;
              font-size: 0.1rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              position: relative;
              top: -0.01rem;
            }
          }
        }
      }
    }
    // 三级菜单
    .d-c-wrapper {
      width: 100%;
      height: 0.33rem;
      overflow: hidden;
    }

    .date-container {
      width: 100%;
      height: 0.34rem;
      padding-top: 0.1rem;
      overflow-x: auto;
      overflow-y: hidden;
      display: flex;
      line-height: 1;
      padding-left: 0.2rem;
      &::-webkit-scrollbar {
        display: none;
      }
      &.esport {
        background-color: initial !important;
      }
      &:after {
        content: " ";
        display: block;
        width: 0.01rem;
        height: 0.02rem;
        flex-shrink: 0;
      }
      /*****   日期菜单  ******* -S*/
      .date-menu-item {
        height: 0.2rem;
        font-size: 0.12rem;
        line-height: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        flex-shrink: 0;
        align-items: center;
        margin-right: 0.19rem;
        position: relative;

        &:last-child {
          width: auto;
          margin-right: 0.1rem;
        }
        &.focus {
          font-size: 0.12rem;

          &:after {
            content: " ";
            width: 0.14rem;
            height: 0.02rem;
            display: block;
            border-radius: 0.08rem;
          }
        }

        &.hidden-champion {
          display: none;
        }
      }
    }
    /*  联赛菜单 */
    .virtual-sports-results {
      height: 0.42rem;
      display: flex;
      flex-wrap: nowrap;
      overflow: auto;
      align-items: center;
      padding-left: 0.15rem;

      .tab-item {
        height: 0.26rem;
        line-height: 0.26rem;
        border-radius: 0.04rem;
        margin-right: 0.06rem;
        padding: 0 0.1rem;
        flex-shrink: 0;
      }
    }
  }
  /* **************主菜单中间的下拉弹框  容器********************************** -Star*/
  .main-m-selector-w {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0.44rem;
    left: 0;
    opacity: 0;
    transition: opacity 0.7s;
    overflow: hidden;
    &.effct-in {
      opacity: 1;
    }
    .selector-w-inner {
      padding: 0.2rem 0 0.09rem 0.17rem;
      transform: translate3d(0, -2.2rem, 0);
      transition: transform 0.35s;
      &.show {
        transform: translate3d(0, 0, 0);
      }
      .main-m-select-item {
        width: 1.6rem;
        height: 0.48rem;
        border-radius: 0.04rem;
        margin-bottom: 0.15rem;
        &:nth-child(odd) {
          margin-right: 0.2rem;
        }
        & > div {
          height: 0.24rem;
          &.m-menu-name-m {
            font-size: 0.16rem;
          }
          &.m-count-match {
            line-height: 0.24rem;
            font-size: 0.14rem;
            margin-left: 0.09rem;
          }
        }
        &.current {
          &.is-favorite {
            //background-color:#ff9124;
          }
          & > div {
            &:first-child {
              color: #ffffff;
            }
            &:last-child {
              color: #ffffff;
            }
          }
        }
      }
    }
  }
  /* **************主菜单容器********************************** -End*/
}
</style>
<style lang="scss" scoped>
/* **************主菜单中间的下拉弹框  容器********************************** -Star*/
.main-m-selector-w {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0.44rem;
  left: 0;
  opacity: 0;
  transition: opacity 0.7s;
  overflow: hidden;
  z-index: 9;
  &.effct-in {
    opacity: 1;
  }
  .selector-w-inner {
    padding: 0.2rem 0 0.09rem 0.17rem;
    transform: translate3d(0, -2.2rem, 0);
    transition: transform 0.35s;
    &.show {
      transform: translate3d(0, 0, 0);
    }
    .main-m-select-item {
      width: 1.6rem;
      height: 0.48rem;
      border-radius: 0.04rem;
      margin-bottom: 0.15rem;
      &:nth-child(odd) {
        margin-right: 0.2rem;
      }
      & > div {
        height: 0.24rem;
        &.m-menu-name-m {
          font-size: 0.16rem;
        }
        &.m-count-match {
          line-height: 0.24rem;
          font-size: 0.14rem;
          margin-left: 0.09rem;
        }
      }
      &.current {
        &.is-favorite {
          //background-color:#ff9124;
        }
        & > div {
          &:first-child {
            color: #ffffff;
          }
          &:last-child {
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
