
/*
 * @Author: ty-rise 
 * @Date: 2023-10-20 16:16:50 
 * @Last Modified by: ty-rise
 * @Last Modified time: 2023-10-Sa 04:29:16
 */
<template>
  <div class="d-c-wrapper" :class="{ esport: is_export }" v-if="is_show_three_menu">
    <div class="date-container" ref="date_menu_container" :class="{ esport: is_export }">
      <div class="date-menu-item" v-for="( date_menu_item, date_index ) of  date_menu_list " :key="date_index" :class="{
        focus: date_menu_curr_i === date_index,
        'is-favorite': show_favorite_list,
        'hidden-champion':
          show_favorite_list &&
          is_export &&
          date_menu_item.menuId == '-999',
      }
        " @click="set_menu_lv3(date_menu_item, date_index, 'date_click')">
        <div>
          <!-- 串关不显示日期菜单后面的数量 -->
          {{ date_menu_item.menuName }}
          <span v-if="!show_favorite_list &&
            date_menu_item.count && !is_kemp && !is_results

            ">
            &nbsp;({{ date_menu_item.count }})
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed, onBeforeUnmount, } from "vue";
import { i18n_t, compute_css, GlobalAccessConfig, useMittOn, MITT_TYPES, UserCtr, MenuData, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/index.js";
//三级菜单 早盘日期菜单项
let date_menu_list = ref([]);
const date_menu_curr_i = ref(0);
// 一级菜单mi ref
const { menu_type, update_time } =
  MenuData;
//是否收藏
const show_favorite_list = ref(UserCtr.show_favorite_list)
//是否 电竞
const is_export = computed(() => {
  return MenuData.is_export(menu_type.value)
});
//是否显示三级菜单
const is_show_three_menu = computed(() => {
  return date_menu_list.value?.length > 0 && MenuData.get_is_show_three_menu()
});
/**
 * 三级菜单事件
 * @param {*} item 
 * @param {*} index 
 * @param {*} type 
 */
const set_menu_lv3 = (item, index, type = "click") => {
  //点本身return
  if (MenuData.current_lv_3_menu && MenuData.current_lv_3_menu.menuId == item.menuId) {
    return;
  }
  date_menu_curr_i.value = index;
  //设置三级菜单
  MenuData.set_current_lv3_menu(item, index, type);
  // 早盘 不走接口 自己筛选数据
  if (MenuData.is_zaopan()) return MatchMeta.filter_match_by_time(item?.field1)
  // 赛果 三级菜单 请求接口
  if (MenuData.is_results()) return MatchMeta.get_results_match()
  // 电竞 三级菜单 请求接口
  if (MenuData.is_export()) return MatchMeta.get_esports_match()
}
watch(update_time, (v) => {
  date_menu_list.value = MenuData.menu_lv3; //三级
  date_menu_curr_i.value = MenuData.current_lv_3_menu_i; //三级index
});
</script>

<style lang="scss" scoped>
// 三级菜单
.d-c-wrapper {
  width: 100%;
  height: 0.33rem;
  overflow: hidden;
  padding: 0 0.05rem;
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
</style>
