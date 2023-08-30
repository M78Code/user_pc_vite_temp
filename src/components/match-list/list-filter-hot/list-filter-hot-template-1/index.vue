<template>
  <div class="c-match-list-filter">
    <drag-scroll class="item-wrap filter-sports competition" ref="drag_scroll">
      <!-- :class="current_menu == item.mi ? 'active' : 'no-active' -->
      <template v-for="item in mi_500_obj['sl']">
        <div :key="`vr_menu_obj_sl${item.mi}`" v-if="item.ct && BaseData.menus_i18n_map[item.mi]"
          @click="handle_click_menu_mi_500({ mi: item.mi, root: '500', })" class="item yb-flex-center hot-item "
          :class="current_menu == item.mi ? 'active' : 'no-active'">
          <div class="icon-wrap list-filter   menu-inline">
            <!-- 热门赛事列表菜单icon 本地精灵图     hot-img-no-active-->
            <span v-if="compute_if_has_local_icon(item.mi)" class="q-icon icon "
              :style="`background-position:0 -${icon_styles(item.mi)}px`"
              :class="current_menu == item.mi ? 'hot-img-active' : 'hot-img'">

            </span>
            <!-- 电竞 -->
            <sport-icon v-else-if="$utils.is_eports_csid(+item.st)" :sport_id="item.st" size="20px" class="icon" />
            <!-- 本地没有icon使用远程icon -->
            <img v-else class="l-icon" :key="item.mi" v-img="[item.st]" />
            <!-- 精 -->
          </div>
          <!-- 球种名称 -->
          <div class="name  menu-inline name-margin-left"
            v-tooltip="{ content: (item.mi == '50199' ? t('common.all') : BaseData.menus_i18n_map[item.mi] + ' ' + item.ct) || '', overflow: 1 }">
            <span>{{ (item.mi == '50199' ? t('common.all') : BaseData.menus_i18n_map[item.mi]) || '' }}</span>
            <span class="count-text">{{ item.ct }}</span>
          </div>

        </div>
      </template>

    </drag-scroll>
  </div>
</template>

<script setup>

import { defineProps, ref, onMounted } from 'vue';
import menu_config from "src/core/menu-pc/menu-data-class.js";
import { t } from "src/core/index.js";
import  { useRegistPropsHelper  } from "src/composables/regist-props/index.js"
import {component_symbol ,need_register_props} from "../config/index.js"

const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
;
const current_menu = ref('')
const name = ref('list_filter_hot')
const top_logos = ref([
  "50199",//赛事
  "50101",//竞足
  "180", //英超
  "320",//西甲
  "276",//德甲
  "79",//法甲
  "6408",// 欧冠
  "146",//CBA
  "208",// 韩篮甲
  "239",// 意甲
  "132",//NBA
  "262",//欧足联
  "39", // j2
  "90", //j1
  "95",
  "103",
  "130",
  "137",
  "150",
  "160",
  "185",
  "224",
  "244",
  "265",
  "295",
  "333",
  "340",
  "359",
  "427",
  "563",
  "1524",
  "1555",
  "1607",
  "2066",
  "2177",
  "2332",
  "3123",
  "3230",
  "6343",
  "6344",
  "6371",
  "8120",
  "17706",
  "20746",
  "21202",
  "24313",
  "24613",
  "26992",
  "28009",
  "28190",
  "28592",
  "64"
])

onMounted(() => {
  let mid_b = this.mi_500_obj['sl'].find(item => item.ct > 0) || {}
  // 刷新后 根据中间件 重新输出
  const { mi = mid_b.mi } = menu_config.mid_menu_result
  current_menu.value = mi
})

/**
 * @Description:计算精灵图联赛logo的偏移位置
 * @param {string|number} id  联赛id
 * @return {undefined} undefined
 */
const icon_styles = (mi) => {
  let mi1 = mi
  if (('' + mi).startsWith('502')) {
    mi1 = mi.substring(3)
  }
  let number = top_logos.value.indexOf(mi1);
  if (number == -1) {
    return -1;
  }
  // let size = 10 / 28
  let size = 20 / 48
  return parseInt(number * 68 * size * 100) / 100;
}

/**
 * 计算是否有本地图标
 */
const compute_if_has_local_icon = (mi) => {
  // 热门除了50199-30199  赛事、50101-30101 竞足外，
  // 常规联赛原菜单ID：301+联赛ID、新菜单：502+菜单ID；
  //电竞联赛原菜单：30+联赛ID、新菜单ID：联赛ID
  // 5010
  let mi1 = mi
  if (('' + mi).startsWith('502')) {
    mi1 = mi.substring(3)
  }
  return top_logos.value.includes(mi1)
}
</script>

<style lang="scss" scoped>
.c-match-list-filter {
  width: 100%;
  height: 48px;
  padding-bottom: 1px;

  .filter-sports {
    overflow: hidden;

    .item {
      max-width: 140px;
      min-width: 80px;
      height: 30px;
      padding: 5px;
      flex-shrink: 0;
      cursor: pointer;
      margin: 10px 3px;

      &.active .l-icon {
        opacity: 0.6 !important;
        filter: grayscale(100%);
        /*  球种logo */
      }

      .icon-wrap {
        .l-icon {
          width: 20px;
          height: 20px;
        }

        /*  球种名称样式 */
      }

      .menu-inline {
        display: inline-block;
      }

      .count-text {
        padding-left: 2px;
        padding-right: 3px;
      }

      .text-active {
        color: #fff;
      }

      .name-margin-left {
        margin-left: 5px;
      }

      .name {
        margin-top: 1px;
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 13px;

        /* 球种数量 */
        .count {
          display: inline-block;
        }
      }
    }
  }

  .competition {

    /* 选中的背景图 */
    .hot-item {
      .hot-img {
        width: 20px;
        height: 20px;
        background-size: 100% auto;
      }

      .hot-img-active {
        width: 20px;
        height: 20px;
        background-size: 100% auto;
      }
    }
  }
}
</style>
  