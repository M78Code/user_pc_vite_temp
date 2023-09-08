<template>
  <div class="menu-container">
    <ul class="menu-container-lv1">
      <template v-for="(item, index) in menu_list" :key="item.mi">
        <li v-show="show_dianjing(item, index)">
          <span @click="set_menu_lv1(item, index)">
            {{ i18n_t("new_menu." + item.mi) || item.mi }}
          </span>
        </li>
      </template>
    </ul>
    <!--   二级菜单 除了‘全部’按钮的其他所有 二级菜单  -->
    <ul class="menu-container-lv2">
      <template v-for="(item, index) in current_menu.sl" :key="item.mi">
        <li v-show="item.ct" @click="set_menu_lv2(item, index)">
          <span>
            {{
              base_data.menus_i18n_map[
                menu_h5_data.recombine_menu_desc(item.mi)
              ] || ""
            }}<i>{{ item.ct }}</i>
          </span>
        </li>
      </template>
    </ul>
    <!-- 三级菜单 日期 (只有 串关，早盘，赛果，电竞，才有) -->
    <div
      class="d-c-wrapper"
      :class="{ esport: menu_1_type == 7 }"
      v-if="date_menu_list.length && [3, 11, 28, 7].includes(+menu_1_type)"
    >
      <div
        class="date-container"
        ref="date_menu_container"
        :class="{ esport: menu_1_type == 7 }"
      >
        <div
          class="date-menu-item"
          :key="date_index"
          :class="{
            focus: date_menu_curr_i === date_index,
            'is-favorite': show_favorite_list,
            'hidden-champion':
              show_favorite_list &&
              menu_1_type == 7 &&
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
  </div>
  <!--主菜单里边---中间下拉弹框-->
  <div
    class="main-m-selector-w"
    :class="{ 'effct-in': show_selector_s2 }"
    @click="show_selector_sub = false"
  >
    中间下拉弹框内容=》
    <!-- v-show="show_selector_sub" -->
    <div
      class="selector-w-inner flex wrap justify-left hairline-border"
      :class="{ favorite: show_favorite_list }"
    >
      <template :key="i_m" v-for="(m_items, i_m) in pop_main_select_items">
        <div
          :class="[
            {
              current: i_m === 1,
            },
          ]"
          @click="set_menu_lv1(m_items, i_m)"
          class="main-m-select-item flex justify-center items-center"
          v-show="is_menu_show(m_items, i_m)"
        >
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
import { onMounted, ref, watch, computed } from "vue";
import GlobalAccessConfig from "src/core/access-config/access-config.js";
import { i18n_t, utils, UserCtr, get_file_path } from "src/core/index.js";
import base_data from "src/core/base-data/base-data.js";
import menu_h5_data from "src/core/menu-h5/menu-data-class.js";
import { cloneDeep, findIndex } from "lodash";
import { useRoute } from "vue-router";
const route = useRoute();
base_data.init(); //初始化菜单数据
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
const show_selector_sub = ref(false); //展示弹出框
// 一级菜单mi
const menu_1_type = computed(() => {
  return current_menu.mi;
});

const pop_main_select_items = ref([]); //弹出框数据
const show_favorite_list = ref(false); //是否收藏
// 获取主菜单列表  main_select_items 弹出的一级 菜单数据   main_menu_list_items 一级菜单数据
watch(base_data.base_data_version, () => {
  const { mew_menu_list_res } = base_data; //获取主数据
  const m_list = menu_h5_data.recombine_menu(mew_menu_list_res);
  console.error("m_list", m_list);
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
  menu_list.value = [];
  pop_main_select_items.value = [];
  m_list.forEach((m_m) => {
    // 滚球 虚拟体育 電競 放入一级菜单
    if ([1, 7, 8].includes(m_m.mi)) {
      menu_list.value.push(cloneDeep(m_m));
    } else {
      pop_main_select_items.value.push(cloneDeep(m_m));
    } // 中间的 一级菜单
  });
  //插入中间项 第二项是  弹出框的
  menu_list.value.splice(1, 0, pop_main_select_items.value[0]);
  current_menu.value = menu_list.value[0];
});
/**
 * 一级菜单事件
 */
function set_menu_lv1(item, index) {
  current_menu.value = item;
  menu_h5_data.set_current_lv1_menu(item);
  set_menu_lv2(item.sl[0]);
}

/**
 * 二级菜单事件
 */
async function set_menu_lv2(item, index) {
  menu_h5_data.set_current_lv2_menu(item);

  // 早盘,串关,电竞拉取接口更新日期菜单 3,6,7
  const three_menu = await menu_h5_data.get_date_menu_api_when_subchange();
  console.error(item, three_menu);
  // if ([3, 6, 7].includes(menu_h5_data.get_current_sub_menuid())) {
  //   const threedata =await menu_h5_data.get_date_menu_api_when_subchange();
  //   console.error(threedata);
  //   select_result_date_menu();
  // } else {
  //   menu_h5_data.set_current_lv3_menu(null);
  // }
}
/**
 * 三级菜单事件
 */
function set_menu_lv3(item, index) {
  menu_h5_data.set_current_lv3_menu(item);
}
// 设置日期选中项
function select_result_date_menu() {
  //设置日期选中下标
  let date_m_c_i;
  if (
    this.get_current_menu &&
    this.get_current_menu.date_menu &&
    this.get_prev_menu_type == this.menu_type &&
    this.get_current_menu.sub == this.get_current_sub_menuid
  ) {
    date_m_c_i = findIndex(this.date_menu_list, {
      menuId: this.get_current_menu.date_menu.menuId,
    });
    if (date_m_c_i == -1) {
      date_m_c_i = 0;
    }
  } else {
    date_m_c_i = 0;
  }
  this.date_menu_clicked(date_m_c_i, "init_data");
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
  if (item.mi == 28) {
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
