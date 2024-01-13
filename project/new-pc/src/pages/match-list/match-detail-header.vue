<template>
  <div class="header row justify-between">
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
        <!-- 专业、新手 切换-->
        <div show_type="sort" class="flex list-sort select-btn ya-zhou-border yb-hover-bg">
          <div @click="set_click_version(item)" v-for="(item, index) in ver_option"
            :class="[get_version == item.id ? 'active special' : 'yb-hover-bg', 'list-sort-item']" :key="index">
            <span class="inner-text">{{ i18n_t("set.pro") }}</span>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import filterHeader from "src/core/filter-header/filter-header.js";
import { IconWapper } from 'src/components/icon'
import { PageSourceData, GlobalSwitchClass, MenuData } from "src/output/index.js";
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
})
// 列表显示内容  match:赛事 collect:收藏 search:搜索
const vx_layout_list_type = ref('match');
const page_source = PageSourceData.page_source;
const is_search_page = page_source.includes('search');
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

const get_version = ref(1)

let _menu_type = MenuData.menu_root;


//当前页面菜单title
const page_title = computed(() => {
  //当前点击的是今日还是早盘 今日 2 早盘为3
  let { jinri_zaopan } = MenuData.left_menu_result || {}
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
  } else if ([2, 3].includes(_menu_type)) {
    let sport_name = MenuData.get_current_left_menu_name()
    if (sport_name) {
      _page_title = `${TITLE[_menu_type]}（${sport_name}）`
    } else {
      _page_title = TITLE[_menu_type]
    }
  } else if ([1, 500].includes(_menu_type)) {
    _page_title = TITLE[_menu_type]
  } else if (_menu_type == 400) {
    _page_title = TITLE[_menu_type]
  }
  if (jinri_zaopan == 2 && _menu_type == 2000) {
    //'今日  (电子竞技)'
    _page_title = `  ${i18n_t("menu.match_today")} (${i18n_t("common.e_sports")})`
  } else if (jinri_zaopan == 3 && _menu_type == 2000) {
    //'早盘  (电子竞技)'
    _page_title = `  ${i18n_t("menu.match_early")} (${i18n_t("common.e_sports")})`
  }
  return _page_title;
})

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


function set_click_version(item) {

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

.list-sort {
  padding: 0;

  .list-sort-item {
    font-weight: 400;
    padding: 2px 11px;
    border-radius: 12px;
    font-size: 12px;

    &.active {
      //background: #626262;
      color: var(--qq--y0-text-color5_2);
      background: var(--qq--background-gradient-1_2);
      font-weight: 500;
      border: 0;
    }

    &.special {
      // background-image: linear-gradient(225deg, var(--qq--match-bg-color6) 0%, var(--qq--match-bg-color6) 100%);
      //background-color: #45B0FF;
      // color: var(--qq--yb-text-color27_1);
      /** copy 自src\css\pro\yabo\list_header\list_header.scss line:125 */
      position: relative;
      overflow: hidden;
      background: none;
      display: flex;
      justify-content: center;
      align-items: center;

      .inner-text {
        position: relative;
        z-index: 10;
      }

      &::before,
      &::after {
        content: '';
        position: absolute;
      }

      &::before {
        --private-inset: 1px;
        // inset: var(--private-inset); // 考虑兼容性问题
        top: var(--private-inset);
        bottom: var(--private-inset);
        left: var(--private-inset);
        right: var(--private-inset);
        background-color: var(--qq--background-gradient-1_2);
        z-index: 9;
        border-radius: 12px;
      }

      &::after {
        z-index: 8;
        width: 200%;
        padding-bottom: 200%;
        // 新手版专业版切换按钮边框流光
        background: conic-gradient(at center, transparent, #479ff1 30%, transparent 30%); // #TODO: css var
        animation: version-toggle-effect-animation 1s linear infinite;

        @keyframes version-toggle-effect-animation {
          100% {
            transform: rotate(360deg);
          }
        }
      }

      border: 0;
      // &:hover {
      // background-image: var(--qq--background-gradient-4);
      // color: var(--qq--y0-text-color5);
      // }
    }
  }
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

  .active {
    background: #179CFF;
    color: #fff;
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
    .number {
      margin-left: 6px;
    }
  }

  .w105 {
    width: 105px;
  }
}</style>