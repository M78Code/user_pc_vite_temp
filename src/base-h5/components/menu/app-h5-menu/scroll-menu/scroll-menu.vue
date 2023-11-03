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
              <div class="sport-menu-item flex justify-center" v-show="item.ct > 0" @click="!isSpecial?set_menu_lv2(item, $event):set_menu_lv_special(item, $event)">
                <div class="inner-w flex justify-between items-center" :class="{
                  current: activeMi == item.mi
                }
                  ">
                  <div class="sport-w-icon">
                    <span class="sport-icon-wrap"
                      :style="compute_css_obj({key:activeMi == item.mi ? 'menu-sport-active-image' : 'menu-sport-icon-image', position:format_type(item)})"></span>

                    <div class="sport-match-count">
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
import lodash_ from "lodash";
import MatchFold from 'src/core/match-fold'
import BaseData from "src/core/base-data/base-data.js";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { compute_css_obj, MenuData, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/index.js";
import {scrollMenu} from "../utils";
import {  menu_lv2 } from 'src/base-h5/mixin/menu.js'
const emitters = ref({});
const isSpecial = computed(()=>{return Object.keys(MenuData.current_lv_2_menu_mi_special).includes(menu_lv2.value?.mi?.toString())})
const scrollDataList = computed(()=>{return Object.keys(MenuData.current_lv_2_menu_mi_special).includes(menu_lv2.value?.mi?.toString())?MenuData.menu_lv_mi_special_lsit:MenuData.menu_lv_mi_lsit})
const activeMi = computed(()=>{return Object.keys(MenuData.current_lv_2_menu_mi_special).includes(menu_lv2.value?.mi?.toString())?MenuData.current_lv_special_menu_mi:MenuData.current_lv_2_menu_mi})

// 是否初次渲染
const is_first = ref(true)
onMounted(() => {
  set_menu_mi_change_get_api_data()
})

/**
 * 二级菜单事件
 */
 function set_menu_lv2(item = {},event) {
  // 选中后点击无效
  if (item.mi == MenuData.current_lv_2_menu_mi) return
  MenuData.set_current_lv_2_menu_mi(item)
  if(Object.keys(MenuData.current_lv_2_menu_mi_special).includes(item.mi.toString())){
    return MenuData.get_menu_lvmi_special_list(item.mi)
  }
  // 今日 / 滚球/ 冠军 没有 三级
  set_menu_mi_change_get_api_data()
  event && scrollMenu(event,".s-menu-container",".sport-menu-item");
}
/**
 * 三级特殊菜单事件
 */
 function set_menu_lv_special(item = {},event) {
  // 选中后点击无效
  if (item.mi == MenuData.current_lv_special_menu_mi) return;
  MenuData.set_current_lv_special_menu_mi(item);
  event && scrollMenu(event,".s-menu-container",".sport-menu-item");
}

watch(()=> MenuData.current_lv_1_menu_mi.value,() => {
  set_menu_mi_change_get_api_data()
})

// 菜单变化页面请求数据
const set_menu_mi_change_get_api_data = () => {
  // 今日 / 滚球/ 冠军 没有 三级
  if([1,2,400].includes(MenuData.current_lv_1_menu_mi.value)){
    handle_match_render_data()
  }
}
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
          width: 0.5rem;
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
                --per: -0.32rem;
                display: block;
                width: auto;
                height: 0.22rem;
                width: 0.22rem;
                background-position: 0 0;
                background-size: 0.22rem 18.88rem;
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
