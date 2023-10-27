/*
 * @Author: ty-rise 
 * @Date: 2023-10-20 16:12:02 
 * @Last Modified by: ty-rise
 * @Last Modified time: 2023-10-Sa 05:38:13
 */
<template>
    <!--二级菜单, 三级菜单，上下滑动 隐藏显示 , 竞彩足球 (get_menu_type:30 不显示二级菜单) -->
    <div class="sub-menu-date-w" v-if="!is_jinzu" :class="{
        simple: menu_wrap_simple && !is_export,
        zaopan: is_mix || is_kemp || is_results || is_export,
        esport: is_export,
      }">
        <!-- 二级菜单, 三级菜单, 四级菜单  -->
        <div class="sport-m-container" :class="{
          simple: sport_container_simple && !is_export,
          'shadow-down': !is_export,
        }">
        <div v-show="false">   {{MenuData.update_time}} </div>
          <div class="s-menu-container flex" ref="sub_menu_scroller">
            <template v-for="item in MenuData.menu_lv_mi_lsit" :key="lodash_.get(item, 'mi')">
              <div class="sport-menu-item flex justify-center" v-show="item.ct > 0" @click="set_menu_lv2(item, $event)">
                <div class="inner-w flex justify-between items-center" :class="{
                  favorite: show_favorite_list,
                  current: MenuData.current_lv_2_menu_mi == item.mi
                }
                  ">
                  <div class="sport-w-icon">
                    <span class="sport-icon-wrap"
                      :style="compute_css_obj({key:MenuData.current_lv_2_menu_mi == item.mi ? 'menu-sport-active-image' : 'menu-sport-icon-image', position:format_type(item)})"></span>

                    <div class="sport-match-count" v-show="two_menu_show(item)">
                      {{ show_favorite_list ? '' : item.ct ? item.ct : 0 }}
                    </div>
                  </div>
                  <div class="s-w-i-title" :class="{
                    esport: is_export,
                    'din-regular': is_export
                  }
                    ">
                    {{ item.name || MenuData.get_menus_i18n_map(item.mi) }}
                  </div>
                </div>

              </div>
            </template>
          </div>
        </div>
      </div>
</template>
<script setup>
import scrollNav from "./scroll-nav.vue";
import lodash_ from "lodash";
import { useRoute } from "vue-router";
import MatchFold from 'src/core/match-fold'
import BaseData from "src/core/base-data/base-data.js";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import { ref, computed, onMounted, watch, reactive, nextTick, onUnmounted } from "vue";
import { compute_css_obj, MenuData, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, useMittOn, MITT_TYPES  } from "src/core/index.js";
import { is_scroll_ball, update_time, is_export, is_mix,is_results, is_kemp, is_jinzu, menu_type } from 'src/base-h5/mixin/menu.js'
import { get_sport_menu } from "../top-menu/top-list";
import {scrollMenu} from "../utils";

const route = useRoute();
const emitters = ref({});
//菜单容器是否收起
const menu_wrap_simple = ref(false);
//菜单容器二级菜单是否收起
const sport_container_simple = ref(false);

// 是否初次渲染
const is_first = ref(true)
let show_favorite_list = ref('')

onMounted(() => {
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_UPDATE_CURRENT_LIST_METADATA, init_match_callback).off
  };
})

/**
 * @description 元数据请求回来 初始化赛事加载
 */
const init_match_callback = () => {
  if (route.name !== 'matchList') return
  nextTick(() => { set_menu_lv2({ mi: '1012' }) })
}

/**
 * 二级菜单事件
 */
 async function set_menu_lv2(item = {},event) {
  console.log(item)
  // 选中后点击无效
  if (item.mi == MenuData.current_lv_2_menu_mi) return
  MenuData.set_current_lv_2_menu_mi(item)
  // 今日 / 滚球/ 冠军 没有 三级
  if([1,2,400].includes(MenuData.current_lv_1_menu_mi.value)){
    handle_match_render_data()
  }
  event && scrollMenu(event,".s-menu-container",".sport-menu-item");
}

watch(()=> MenuData.current_lv_1_menu_mi.value,() => {
  
  // 默认设置二级菜单id
  MenuData.set_current_lv_2_menu_mi( lodash_.get(MenuData.menu_lv_mi_lsit,'[0]',{}))

  // 今日 / 滚球/ 冠军 没有 三级
  if([1,2,400].includes(MenuData.current_lv_1_menu_mi.value)){
    handle_match_render_data()
  }
})

/**
* 二级菜单数量 是否展示
* @param {Number} sub  赛种item
*/
const two_menu_show = (sub) => {
  if (MenuData.is_results()) {
    return false
  }
  // 滚球下足球处理 1011足球
  let mi_list = MenuData.is_scroll_ball() ? [1001, 1002, 1004, 1010] : [1001, 1002, 1004, 1011, 1010]
  return ![is_export.value, is_results.value, is_export.value].includes(true) && !mi_list.includes(+sub.mi)
}
/**
 * 计算滚球下的全部数量
 */
 const all_sport_count_calc = computed(() => {
  //找到滚球
  let data_list = props.menu_list.find((item) => item.mi == 1);
  //滚球下所有是数量总和 updateime是时间作为计算属性变化
  return MenuData.count_menu(data_list, update_time.value)
});
/**
 * @description 处理赛事列表渲染数据
 */
 const handle_match_render_data = () => {
  
  is_first.value = false
  // 清除赛事折叠信息
  MatchDataBaseH5.init()
  MatchFold.clear_fold_info()
  // 冠军拉取旧接口； 待 元数据提供 冠军赛事后 再删除
  if (MenuData.is_kemp()) return MatchMeta.get_champion_match()
  // 赛果不走元数据， 直接拉取接口
  if (MenuData.is_results()) return MatchMeta.get_results_match()
  // 电竞不走元数据， 直接拉取接口
  if (MenuData.is_export()) return MatchMeta.get_esports_match()

  const mi_tid_mids_res = lodash_.get(BaseData, 'mi_tid_mids_res')
  if (lodash_.isEmpty(mi_tid_mids_res)) return

  // 设置菜单对应源数据
  MatchMeta.set_origin_match_data()
}
/**
 * @description: 球类id转化背景
 * @param {String} id 球类id
 * @return {}
 */
const format_type = ( item = {} ) => {
  if (MenuData.is_results()) {
    let type = +item.menuId
    // 赛果电竞图标
    if ([100, 101, 103, 102].includes(type)) {
      type += 2000
    }
    // 赛果 我的投注
    if (item.menuType && item.menuType == 29) {
      type = item.menuType
    }
    // 赛果冠军
    if (type == 10000) {
      type = 100
    }
    return type
  }
  //电竞背景处理
  if (BaseData.sports_mi.includes(+item.mi)) return +item.mi
  return MenuData.recombine_menu_bg(item, true)
}

onUnmounted(() => {
  Object.values(emitters.value).map((x) => x());
})


</script>
<style  scoped lang="scss">
    .sub-menu-date-w {
      z-index: 501;
    width: 100%;
    max-height: 1.35rem;
    // position: absolute;
    // left: 0;
    // top: 0.44rem;
    padding: 0 0.05rem;
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
          width: 0.5rem;
          height: 100%;
          flex-shrink: 0;
          color: var(--q-gb-t-c-4);
          &.champion {
            // width: 0.9rem;
          }

          .current {
            color: var(--q-gb-bd-c-2);
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
                background-position: 0 0;
                background-size: 0.22rem 18.88rem;

           
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

</style>