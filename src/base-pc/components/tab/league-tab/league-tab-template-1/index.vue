<template>
  <div class="leagues-tabs leagues-bg">
    <tab :list="menu_obj_new" tab_name_key="menuName" :is_show_line="true" :currentIndex="menu_config.cur_level3_menu"
      @onclick="handle_click_menu_mi_league_tab_first_one" :key="menu_config.cur_level2_menu" />
  </div>
</template>
<script setup>
import tab from 'src/components/common/tab/tab-1/index.vue'
import base_data from "src/core/base-data/base-data.js";
import menu_config from "src/core/menu-pc/menu-data-class.js";
import { nextTick, ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps(need_register_props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 
const menu_obj_new = computed(() => {
  let menu_list = (base_data.vr_mi_config.find(item => item.menuId == props.current_mi) || {}).subList || []
  return menu_list
})
onMounted(() => {
  nextTick(() => {
    handle_click_menu_mi_league_tab_first_one({ csid: props.current_mi || '1001', index: 0 });
  })
})
/**
 * 点击联赛第一个
 */
function handle_click_menu_mi_league_tab_first_one(detail = {}) {
  let { csid, index } = detail
  handle_click_menu_mi_league_tab({ csid, index })
}
function handle_click_menu_mi_league_tab() { }
</script>

<style lang="scss" scoped>
.tab-wrap {
  overflow: hidden;

  .item-wrap {
    position: absolute;
    top: 0;
    width: 1000px;
    display: flex;
    height: 100%;
    z-index: 99;
    align-items: center;

    .tab-item {
      cursor: pointer;
      padding: 0 15px;
      text-align: center;
      flex-shrink: 0;
      height: 24px;
      line-height: 24px;
      border-radius: 15px;
      color: var(--q-gb-t-c-5);
      &.active {
        font-weight: 600;
        line-height: 24px;
        border: none !important;
      }

      .match-count {
        opacity: 0.7;
      }
    }

    .line-wrap {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 3px;

      .line {
        position: relative;
        width: 30px;
        height: 100%;
        transition: all 0.3s;
        z-index: 10;
      }

      &.pseudo {
        .line {

          &::before,
          &::after {
            display: none;
          }
        }
      }
    }
  }

  /** 左右切换按钮 -S*/
  .btn {
    height: 100%;
    position: absolute;
    top: 0;
    width: 38px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .left-btn {
    left: 0;
    transform: rotate(180deg);
  }

  .right-btn {
    right: 0;
  }

  /** 左右切换按钮 -E*/
}

.leagues-bg {
  .tab-wrap {
    .item-wrap {
      .line-wrap {
        bottom: 4px !important;
      }
    }
  }
}
</style>

