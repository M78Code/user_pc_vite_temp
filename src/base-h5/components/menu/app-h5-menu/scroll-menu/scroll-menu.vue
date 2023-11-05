/*
 * @Author: ty-rise 
 * @Date: 2023-10-20 16:12:02 
 * @Last Modified by: ty-rise
 * @Last Modified time: 2023-10-Sa 05:38:13
 */
<template>
    <div class="sub-menu-date-w">
        <div class="sport-m-container">
          <div class="s-menu-container flex">
            <template v-for="item in scrollDataList" :key="lodash_.get(item, 'mi')">
              <div class="sport-menu-item flex justify-center" @click="set_menu_lv2(item, $event)" >
                <div class="inner-w flex justify-between items-center" :class="{
                  current: current_mi == item.mi
                }
                  ">
                  <div class="sport-w-icon">
                   
                    <span class="sport-icon-wrap"
                      :style="compute_css_obj({key:current_mi == item.mi ? 'menu-sport-active-image' : 'menu-sport-icon-image', position:format_type(item)})"></span>
                    <div v-show="item.ct > 0" class="sport-match-count">
                      {{ item.ct || 0 }}
                    </div>
                  </div>
                  <div class="s-w-i-title">
                    {{ (item.btn ?item.title : item.name) || MenuData.get_menus_i18n_map(item.mi) }}
                  </div>
                </div>

              </div>
            </template>
          </div>
        </div>
      </div>
</template>
<script setup>
import { ref,onUnmounted } from "vue";
import lodash_ from "lodash";
import BaseData from "src/core/base-data/base-data.js";
import { compute_css_obj, MenuData } from "src/core/index.js";
import {scrollMenu} from "../utils";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";

const emitters = ref({});

const props = defineProps({
  // 滑动菜单数据
  scrollDataList:{
    type: Array,
    default: () => []
  },
  // 当前选中的值
  current_mi:{
    type: String || Number,
    default: ''
  }
})

/**
 * 二级菜单事件
*/
function set_menu_lv2(item = {},event) {
  // 选中后点击无效
  if (item.mi == MenuData.current_lv_2_menu_mi) return
  // 设置菜单点击事件
  useMittEmit(MITT_TYPES.EMIT_SCROLL_TOP_NAV_CHANGE,item )

  event && scrollMenu(event,".s-menu-container",".sport-menu-item");
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
    padding: 0 0.05rem;
    transition: transform 0.6s, max-height 0.3s;

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
        padding-top: 0.04rem;
        padding-bottom: 0.05rem;
        flex-wrap: nowrap;
        scrollbar-width: none; // 去除滚动条火狐浏览器兼容性问题

        .sport-menu-item {
          min-width: 0.5rem;
          height: 100%;
          flex-shrink: 0;
          color: var(--q-gb-t-c-4);
          .current {
            color: var(--q-gb-bd-c-2);
            .inner-w {
              position: relative;
              font-size: 0.1rem;
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
                --per: -0.22rem;
                display: block;
                width: auto;
                height: 0.22rem;
                width: 0.22rem;
                background-position: 0 0;
                background-size: 0.22rem auto;
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
  }

</style>
