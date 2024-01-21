<template>
  <div class="header row justify-between" :style="computed_theme">
    <div v-show="false">{{ MenuData.menu_data_version }}</div>
    <!-- left -->
    <div class="col-left row items-center">
      <div class="row items-center all-collect">
         <!--全部按钮-->
        <div v-show="!filterHeader.show_filter_popup && !is_search_page" @click="on_change_list_type('match')"
          class="btn-wrap match-btn flex-1 h-full yb-flex-center cursor-pointer" :class="compute_quanbu_btn_class()">
          {{ i18n_t("common.all") }}
        </div>
        <!--收藏按钮-->
        <div v-show="MenuData.compute_if_can_show_shoucang() && !filterHeader.show_filter_popup && !is_search_page"
          @click="(enable_collect_api ? collect_count : true) && on_change_list_type('collect')"
          class="btn-wrap collect-btn flex-1 h-full yb-flex-center cursor-pointer"
          :class="{ 'active': vx_layout_list_type == 'collect', }" :title="i18n_t('list.my_collect')">
          <icon-wapper name="icon-star" :class="{ active: collect_count }" size="14px"
            :color="vx_layout_list_type == 'collect' ? '#272A33' : collect_count ? '#EFCC6E' : '#ABBAC8'" />
          <span class="number" :class="{ 'had-count': collect_count }">
            {{ collect_count }}
          </span>
        </div>
      </div>

     
      <!--当前菜单-->
      <div class="list-title  row items-center">
        <!-- <div class="title-text yb-font-bold ellipsis" :class="{'w105': show_select_time && is_short_title}" v-tooltip="{content:page_title,overflow:1}" v-html="page_title"></div> -->
        <!-- <span v-if="is_search_page" class="title-text path-icon-wrapper" :class="{'search':is_search_page}">
            <span class="icon-triangle3 search-path-icon"></span>
            <span>{{ get_search_keyword.substr(5)}}</span>
            </span> -->
        <span class="title-text path-icon-wrapper">
          <span>{{ page_title }}</span>
        </span>
      </div>
    </div>
    <div class="row items-center">
      <div class="row items-center">
        <!-- 选择联赛 -->
        <div class="select-competition row items-center curson-point" @click="handle_select_race_species">
          <span>选择联赛</span>
          <div class="all">
            <p>{{ props.select_list.length == 0 ? '全部':  `${props.select_list.length}` }}</p>
            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/arrow.svg`" alt="" class="arrow"/>
          </div>
        </div> 
        <!-- 欧盘/亚盘 -->
        <ul class="select-type row items-center curson-point">
          <li :class="[select_type == 0 ? 'select-type-active':'']" @click="handle_select_type(0)">欧盘</li>
          <li :class="[select_type == 1 ? 'select-type-active':'']" @click="handle_select_type(1)">亚盘</li>
        </ul>
        <!-- 专业、新手 切换-->
        <!-- <div show_type="sort" class="flex list-sort select-btn ya-zhou-border yb-hover-bg base-bg">
          <div @click="set_click_version(item)" v-for="(item, index) in ver_option"
            :class="[get_version == item.id ? 'active special' : 'yb-hover-bg', 'list-sort-item']" :key="index">
            <span class="inner-text">{{ i18n_t(item.name) }}</span>
          </div>
        </div> -->
        <ul class="select-type row items-center curson-point">
          <li :class="[get_version == item.id ? 'select-type-active-blue':'']" 
              @click="set_click_version(item)" v-for="(item, index) in ver_option" :key="index"
          >
            {{ i18n_t(item.name) }}
          </li>
        </ul>
        <!-- 热门/时间 -->
        <ul class="select-type row items-center curson-point">
          <li :class="[select_type_hot == 0 ? 'select-type-active':'']" @click="handle_select_hot(0)">热门</li>
          <li :class="[select_type_hot == 1 ? 'select-type-active':'']" @click="handle_select_hot(1)">时间</li>
        </ul>
        <!-- 列表简译/繁译按钮 只有中文展示-->
      <ul
       class="select-type row items-center curson-point"
       v-show="lodash.get(UserCtr, 'user_info.simpleTradSwitch') && ['zh', 'hk'].includes(UserCtr.lang)"
       >
        <li 
          v-for="(sort, index) in option" 
          @click="on_click_translate(sort)"
          :key="index"
          :class="[UserCtr.match_translate == sort.id ? 'select-type-active':'']" 
          >
          {{ sort.name }}
        </li>
        </ul>
        <!-- 日间/夜间 -->
        <ul class="select-type row items-center curson-point">
          <li :class="[UserCtr.theme == item.key? 'select-type-active':'']" 
              v-for="item in theme_list" :key="item.key" @click="handle_select_theme(item.key)">
              <!-- 没有的字体默认展示简体中文-->
              {{ item.i18n[UserCtr.lang] || item.i18n['zh']  }}
          </li>
        </ul>
      </div>
      <slot name="refresh"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed,onMounted, watch } from "vue";
import filterHeader from "src/core/filter-header/filter-header.js";
import { IconWapper } from 'src/components/icon';
import UserCtr from "src/core/user-config/user-ctr.js";
import { theme_list, theme_map } from "src/core/theme/"
import { PageSourceData, GlobalSwitchClass, MenuData, LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import BaseData from "src/core/base-data/base-data.js";
import { api_account } from "src/api/index.js";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"
import { compute_css_variables } from "src/core/css-var/index.js"

const props = defineProps({
  collect_count: {
    type: Number,
    default: () => null,
  },
  load_data_state: {
    type: String,
    default: () => '',
  },
  is_show_input: {
    type: Boolean,
    default: () => false,
  },
  is_show_hot: {
    type: Boolean,
    default: () => false,
  },
  select_list: {
    type: Array,
    default: () => ([])
  }
})
/**
 * @description change_type 修改盘类型 0欧盘/1亚盘
 * @description change_hot 修改热门 0热门/1时间
 * @description change_version 修改专业还是新手 0专业/1新手
 * 
 */
const emits = defineEmits(['change_type', 'change_theme', 'change_hot', 'change_version', 'change_race']);
const computed_theme = ref("")
const ver_option =  [
  {
    id: 1,
    name: 'set.pro',//"专业版",
  },
  {
    id: 2,
    name: 'set.beginner',//"新手版",
  }
]
// 简繁译
const option = [
  {
    id: 'zh',
    name: i18n_t('set.short_translation'),//"简译",
    icon: "icon-sort_league"
  },
  {
    id: 'hk',
    name: i18n_t('set.traditional_translation'),//"繁译",
    icon: "icon-sort_date"
  }
]
// 0欧盘/1亚盘
const select_type = ref(0);
// 0白天/1夜间
const select_type_theme = ref(0);
// 0热门/1时间
const select_type_hot = ref(0);
// 0专业/1新手
const get_version = ref(ver_option[0].id)
// 简繁译
const select_type_simpleTrad = ref(UserCtr.match_translate)
// 列表显示内容  match:赛事 collect:收藏 search:搜索
const vx_layout_list_type = ref('match');
const page_source = PageSourceData.page_source;
const is_search_page = page_source.includes('search');

const page_title= ref('')

let _menu_type = MenuData.menu_root;

/**
 * 修改类型 欧盘/亚盘
 * @param {0|1} value 
 */
const handle_select_type = (value) => {
  //亚盘禁止
  if (value === 1 ){
    return
  }
  select_type.value = value;
}

const handle_select_race_species = () => {
  emits('change_race')
}

//当前页面菜单title
const get_page_title = () => {
  //当前点击的是今日还是早盘 今日 2 早盘为3
  let TITLE = {
    1: i18n_t("menu.match_play"), //"滚球",
    2: i18n_t("menu.match_today"), //"今日",
    3: i18n_t("menu.match_early"), //"早盘",
    500: i18n_t("menu.match_hot"), //"热门赛事"
    400: i18n_t("menu.match_winner"), //"冠军"
  };
  let _page_title = ""
  let _menu_type = MenuData.menu_root
  if (is_search_page) {
    _page_title = i18n_t("common.search_title")
    // 今日|早盘|串关
  } else if ([2, 3].includes(+_menu_type)) {
    if (MenuData.menu_current_mif) {
      _page_title = `${TITLE[_menu_type]}（${BaseData.menus_i18n_map[MenuData.menu_current_mif]}）`
    } else {
      _page_title = TITLE[_menu_type]
    }
  } else if ([1, 500].includes(+_menu_type)) {
    _page_title = TITLE[_menu_type]
  } else if (_menu_type == 400) {
    _page_title = TITLE[_menu_type]
  }
  if (MenuData.is_today() && _menu_type == 2000) {
    //'今日  (电子竞技)'
    _page_title = `  ${i18n_t("menu.match_today")} (${i18n_t("common.e_sports")})`
  } else if (MenuData.is_zaopan() && _menu_type == 2000) {
    //'早盘  (电子竞技)'
    _page_title = `  ${i18n_t("menu.match_early")} (${i18n_t("common.e_sports")})`
  }
  page_title.value = _page_title
}

watch(() =>MenuData.menu_data_version.value, () => {
  console.error('get_page_title()',get_page_title())
  get_page_title()
})


/**
 * @ Description:切换简译/繁译
 * @param {object} row 切换的展示
 * @return {undefined} undefined
 */
const on_click_translate = async (row) => {
  if (UserCtr.match_translate == row.id) return
  useMittEmit(MITT_TYPES.EMIT_SET_MATCH_TRANSLATE, row.id)
}


function get_css_obj() {
 computed_theme.value = compute_css_variables({ category: 'component', module: 'match-details' }); 
}

/**
 * 计算 全部 按钮样式
 */
function compute_quanbu_btn_class() {
  let str = ''
  if (vx_layout_list_type.value == 'match') {
    str += 'active'
  }
  let can_show = MenuData.compute_if_can_show_shoucang()
  //如果不能显示收藏
  if (!can_show) {
    str += '   collect-btn'
  }
  return str
}

/**
 * 设置主题
 * @param {*} value 
 */
function handle_select_theme(value) {
  UserCtr.set_theme(value)
  select_type_theme.value = value;
}
/**
 * 设置热门/时间
 * @param {*} value 
 */
function handle_select_hot(value) {
  emits('change_hot', value);
  select_type_hot.value = value;
}

/**
 * 设置新手版还是专业版
 * @param {*} value 
 */
function set_click_version(value) {
  emits('change_version', value);
  get_version.value = value.id;
  MenuData.set_template_version(value.id)
}

/**
 * @description 切换列表展示是的收藏还是非收藏
 *
 * @param  {string} type
 * @return {undefined} undefined
 */
 function on_change_list_type (type) {
  if (type == vx_layout_list_type.value) {
    return
  }
  vx_layout_list_type.value=type
  MenuData.set_is_collect(type === "collect")
  MenuData.set_match_list_api_config(config);
}

onMounted(() => {
  get_css_obj();
})
</script>

<style lang="scss" scoped>
.row {
  display: flex;
}
.flex-1 {
  flex: 1;
}
.items-center {
  align-items: center;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}


.cursor-pointer {
  cursor: pointer;
}

.h-full {
  height: 100%;
}
.header {
  padding: 3px 20px;
}
.all-collect {
  width: 96px;
  height: 26px;
  border-radius: 100px ;
  overflow: hidden;
  border: 1px solid  #179CFF;
  font-size: 12px;

  .match-btn.active {
    background: #179CFF;
    color: #fff!important;
  }
  .collect-btn.active {
    background: #179CFF;
    color: #fff!important;
    :before {
      color: var(--q-gb-bg-c-8) !important;
    }
  }
}
.select-btn {
  margin-left: 5px;
  padding: 1px 2px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid transparent;
  background: var(--qq--background-gradient-1_1);

  &.ya-zhou-border {
    border: 1px solid transparent !important;
  }

  &.sort-btn {
    .icon-sort_league {
      &:before {
        color: var(--qq--y0-text-color5);
      }
    }
  }

}

.mr-12 {
  margin-right: 12px;
}

.col-left {
  .list-title {
    margin-left: 10px;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    .title-icon {
    }

    .title-text {
      color:var(--q-gb-t-c-20);
    }

    .path-icon-wrapper {
      display: flex;
      align-items: center;
    }

    .search-path-icon {
      font-size: 18px;
      margin: 0 4px;
      font-weight: bold;

      &:before {
        color: #595f73;
      }
    }

    .league-logo {
      margin-right: 10px;
      width: 18px;
      height: 18px;
    }
  }

  .btn-wrap {
    color:var(--q-gb-t-c-20);

    .number {
      margin-left: 6px;
      // color:var(--q-gb-t-c-20);
    }
  }

  .w105 {
    width: 105px;
  }
}

.select-competition {
  background-color: var(--q-match-details-icon);
  border-radius: 1000px;
  font-size: 12px;
  height: 24px;
  padding: 0 8px;
  color: #555;
  .all {
    margin-left: 6px;
    display: flex;
    justify-content: center;
    .arrow {
      width: 10px;
      height: 10px;
      margin-left: 2px;
    }
  }
}

.select-type {
  margin-left: 9px;
  border-radius: 1000px;
  height: 26px;
  overflow: hidden;
  background-color: var(--q-match-details-bet-block);
  color: #555;
  .select-type-active {
    color: #1D1D1D;
    background-color: #fff;
    border-radius: 1000px;
  }
  .select-type-active-blue {
    background-color: var(--q-gb-bg-c-1);
    border-radius: 1000px;
    color: #fff;
  }
  li {
    padding: 0 11px;
    height: 100%;
    text-align: center;
    line-height: 26px;
  }
}

.base-bg {
  background-color: #E9F0FF;
}
</style>