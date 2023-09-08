<template>
  <div class="menu-container">
    <ul class="menu-container-lv1">
      <li v-for="(item, index) in menu_list" :key="item.mi">
        <span @click="setMenu(item, index)">
          {{ i18n_t("new_menu." + item.mi) || item.mi }}
        </span>
      </li>
    </ul>
    <ul class="menu-container-lv2">
      <li v-for="(item, index) in current_menu.sl" :key="item.mi">
        <span @click="setMenuItem(item, index)">
          {{
            base_data.menus_i18n_map[
              menu_h5_data.recombine_menu_desc(item.mi)
            ] || ""
          }}<i>{{ item.ct }}</i>
        </span>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import GlobalAccessConfig from "src/core/access-config/access-config.js";
import { i18n_t, utils, UserCtr, get_file_path } from "src/core/index.js";
import base_data from "src/core/base-data/base-data.js";
import menu_h5_data from "src/core/menu-h5/menu-data-class.js";
import lodash from "lodash";
base_data.init(); //初始化菜单数据
const props = defineProps({
  // 菜单配置
  menu_config: {
    type: Object,
    default: () => {},
  },
});
let menu_list = ref(menu_h5_data.menu_list || []);
let current_menu = ref({});
watch(base_data.base_data_version, () => {
  const { mew_menu_list_res } = base_data; //获取主数据
  menu_list.value = menu_h5_data.recombine_menu(mew_menu_list_res);
  console.error(111, menu_list.value);
  current_menu.value = menu_list.value[0];
});
/**
 * 一级菜单事件
 */
function setMenu(item, index) {
  current_menu.value = item;
  menu_h5_data.set_current_menu(item);
}
/**
 * 二级菜单事件
 */
function setMenuItem(item, index) {
  menu_h5_data.set_current_lv2_menu(item);
}
</script>
<style lang="scss">
.menu-container-lv1 {
  display: flex;
  list-style: none;
  li {
    list-style: none;
    flex: 1;
    text-align: center;
  }
}
.menu-container-lv2 {
  overflow-x: auto;
  overflow-y: hidden;
  padding-top: 0.13rem;
  padding-bottom: 0.05rem;
  flex-wrap: nowrap;
  display: flex;
  list-style: none;
  li {
    width: 0.7rem;
    height: 100%;
    flex-shrink: 0;
    display: flex;
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
</style>
