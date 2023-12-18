<!--
 * @Author: ledron
 * @Date: 2020-11-20 18:35:53
 * @Description: 筛选页 以前的排序逻辑不变
-->
<template>
  <div class="boss-box">
    <!--  筛选骨架屏  -->
    <SFilter v-if="list_data_loading" />
    <!-- 中间滚动选择项 -->
    <q-scroll-area class="scroll-area" v-if="!no_find_content && !list_data_loading" ref="scrollArea">
      <div v-if="list.length" v-scroll="scrolled" class="yb_mb18">
        <!-- 循环整个后台返回数据 -->
        <div class="scroll-area1" v-for="(item1, index) in list" :key="index" ref="scroll_area1">
          <div class="bg-f6f7f8" ref="bg_f6f7f8" v-if="item1.title">{{ item1.title }}</div>
          <!-- 联赛国家Tab栏目 -->
          <div class="row justify-between tittle_text items-center half-border-bottom" ref="tittle_text"
            v-if="item1.title !== i18n_t('search.hot_league')" @click.stop.prevent="is_hide(item1, index)">
            <!-- 左边联赛箭头及名称  -->
            <span>
              <img class="arrow_up" :class="{ collapse: !item1.hide }"
                :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/league-collapse-icon-black.svg`" alt="">
              <span class="name-text">{{ ((type == 1 && get_sport_all_selected == true) || (type == 28 &&
                get_curr_sub_menu_type == 29)) ? item1.nameText : item1.introduction }}</span>
            </span>
            <!-- 右边选择icon -->
            
            <img class="icon-search" @click.stop.prevent="select_sport_ctr(item1, index)"
              v-if="(item1.select || (((type != 1 && get_curr_sub_menu_type != 29) || (type == 1 && get_sport_all_selected == false)) && item1.sportVOs[0].select))"
              :src="compute_img_url('checkbox-box-s')"
              />
            <img alt="" class="icon-search"
              @click.stop.prevent="select_sport_ctr(item1, index)"
              :src="compute_img_url('checkbox-box')"
              v-else>
          </div>
          <!-- 联赛名称部分 -->
          <q-slide-transition>
            <div v-if="!item1.hide">
              <div v-for="(item2, index) in computed_item(item1)" :key="index + 'League-name'"
                class="row  items-center content_box1">
                <div class="row justify-between items-center content_box2"
                  :class="{ 'content_box3': index == computed_item(item1).length - 1 }"
                  @click.stop.prevent="select_li_ctr(item2, computed_item(item1), item1)">
                  <div class="row items-center">
                    <div class="row items-center">
                      <!-- 联赛icon -->
                      <img
                        :src="item2.picUrlthumb ? get_server_file_path(item2.picUrlthumb) : compute_img_url('match-cup')"
                        @error="league_icon_error" class="match_logo" />
                      <div class="name-overhide">{{ item2.nameText }}</div>
                      <div class="nums"
                        v-show="!(type == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(get_curr_sub_menu_type))">
                        {{ item2.num }}</div>
                    </div>
                  </div>
                  
                  <img v-if="item2.select" class="icon-search"
                  :src="compute_img_url(item2.select?'checkbox-box-s':'checkbox-box')" />
                </div>
              </div>
            </div>
          </q-slide-transition>
        </div>
      </div>
    </q-scroll-area>

    <!-- 右边字母切换按钮 quasar提供的平移上下左右操作v-touch-pan.-->
    <ul class="right-side" v-touch-pan.vertical.prevent="handler" v-show="!no_find_content && !list_data_loading">
      <li @click.stop.prevent="bar_click(item)" :class="{ actived: active_index == item, hot: item == i18n_t('search.hot') }"
        v-for="(item, index) in anchor_arr" :key="index + 'letter'">
        <template v-if="item == i18n_t('search.hot')">
          <img style="width: 28px;"
          :src="compute_img_url(active_index == item?'match-filter-s':'match-filter')"
            alt="">
        </template>
        <div class="t-wrap" v-else>{{ item }}</div>
      </li>
    </ul>
    <!-- 字母悬浮图标 -->
    <div class="active-point" v-if="is_show" :style="[{ top: fixed_top + 150 + 'px' },compute_css_obj('work-s')]"
     >
      <span>{{ active_index }}</span>
    </div>
    <!-- 底部固定部分 -->
    <!-- 全选/反选/确定 -->
    <div class="allCheck row justify-between items-center" v-if="change && !list_data_loading">
      <div class="row items-center"
        :style="{ lineHeight: ['vi', 'en', 'th', 'ms', 'ad'].includes(get_lang) ? '1' : 'unset' }">
        <!-- <template> -->
        <img class="icon-search" @click="all_checked_click"
        :src="compute_img_url(all_checked?'checkbox-box-s':'checkbox-box')"  />
        <span class="txt ellipsis-2-lines" @click="all_checked_click">{{ i18n_t('common.all_select') }}</span>
        <!-- </template> -->
        <span class="txt ellipsis-3-lines" @click="select_btn_click">{{ i18n_t('filter.reverse_election') }}</span>
      </div>
      <!-- 确定选择按钮 -->
      <div class="right-box" @click="search_btn">
        <p class="confirm">{{ i18n_t('common.ok') }}</p>
        <p class="round-box">{{ select_num }}</p>
      </div>
    </div>
    <!-- 无数据展示 -->
    <no-data which="noMatch" style="margin-top: 0.26rem" :height="100"
      v-if="!list_data_loading && no_find_content"></no-data>
  </div>
</template>

<script setup>
import { api_filter } from "src/api/index.js";
// 无网络展示组件
import noData from "src/base-h5/components/common/no-data.vue";
import SFilter from "src/base-h5/components/skeleton/filter.vue"
import { UserCtr, compute_img_url,MenuData, i18n_t, get_server_file_path, useMittEmit, MITT_TYPES } from "src/output/index.js"
import { ref, watch, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import lodash from 'lodash'
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";

// 构建版本
// BUILD_VERSION:window.env.config.BUILD_VERSION,
const list_data_loading = ref(false);    //数据加载中
const default_url = `/project_name/image/svg/match_cup.svg`  //默认图片地址 // 无联赛logo图标黑色版
const none_league_icon_black = `/project_name/image/svg/match_cup_black.svg`
const list = ref([]); //数据列表整个赛事
const type = MenuData.menu_type;  //筛选类型 1-滚球 3-今日  4-早盘  100-冠军 28 赛果
const all_checked = ref(false); //是否全选
const anchor_arr = ref([i18n_t('search.hot'), "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]) //右边字母数组
const active_index = ref(null)      //活动的下标
const active_index_position = ref(null)   // 活动的下标对应的position，在右侧字母的时候，scroll 不支持传float，这个值用于记录
const is_show = ref(false); //悬浮图标是否展示
const is_scroll_right = ref(false); //是否滚动到正确位置
const is_on_clicking = ref(false); //是否正在点击
const scroll_obj = ref({});  //滚动对象集合
const scroll_obj2 = ref({}); //滚动对象集合
const scroll_obj2_val = ref([]); //滚动对象集合备份
const fixed_top = ref(0);   //到顶部的距离
const no_find_content = ref(false); //是否显示未查找到相关搜索
const change = ref(true); //是否显示全选按钮
const selected = ref({});   //选中的赛事集合
const select_num = ref(0); //选中的赛事数量



//ref对象
const scrollArea = ref(null);
const tittle_text = ref(null);
const scroll_area1 = ref(null);
const bg_f6f7f8 = ref(null);
let timer2;




// ...mapGetters([
const get_lang = UserCtr.lang
const get_theme = UserCtr.theme
// TODO
const get_curr_sub_menu_type = ref(MenuData.get_current_lv_2_menu_type())
const get_menu_type = MenuData.menu_type;
const get_req_match_list_params = ref({})
const get_filter_list = ref({})
const get_uid = ref()  //uid????
const get_current_menu = ref(MenuData.current_lv_1_menu)
const get_sport_all_selected = MenuData.get_sport_all_selected
const get_md = ref(MenuData.current_lv_3_menu)    //TODO三级日期菜单时间戳

// ]),
const emit = defineEmits(["selectHandle"]);
//暴露出去的方法和数据
defineExpose({list})
const props = defineProps({
  search_val: {
    type: String,
    default: "",
  },
});


// 活动的下标监听
watch(active_index, (newVal) => {

  let dom_scrollArea = scrollArea.vlaue
  if (is_scroll_right.value && scroll_obj2.value.hasOwnProperty(newVal) && dom_scrollArea) {
    active_index_position.value = scroll_obj2.value[newVal]
    dom_scrollArea.setScrollPosition('vertical',scroll_obj2.value[newVal]);
  }
})

// 监听选中的赛事数量
watch(select_num, (new_) => {
  if (new_ < 0) {
    select_num.value = 0
  }
}
)

// ...mapMutations([
//   "set_filter_list",
//   // "set_toast",
//   "set_curr_sub_menu_type",
//   'set_collapse_csid_map',
//   'set_collapse_map_match',
// ]),
/**
 * @description: 联赛联赛图标出错
 * @param {Object} $event 错误事件对象
 */
function league_icon_error($event) {
  $event.target.src =compute_img_url('match-cup')
  $event.target.onerror = null
}

/**
 *@description 初始化默认选中
 *@return {Number} undefined
 */
function default_selected() {
  // 如果选中的是全部
  if (selected.value == i18n_t('footer_menu.all')) {
    all_checked.value = true;
    list.value.length > 0 && list.value.forEach((item, index) => {
      if (((type.value == 1 && get_sport_all_selected.value == true) || (type.value == 28 && get_curr_sub_menu_type.value == 29)) || type.value == 2) {
        item && item.tournamentList.length && item.tournamentList.forEach(item2 => {
          item2.select = true;
          if (item2.select) {
            select_num.value += item2.num
          } else {
            select_num.value -= item2.num
          }
        })
        item.select = true

      } else {
        item.sportVOs && item.sportVOs[0].tournamentList.length && item.sportVOs[0].tournamentList.forEach(item2 => {
          item2.select = true;
          if (item2.select) {
            select_num.value += item2.num
          } else {
            select_num.value -= item2.num
          }
        })
        item.sportVOs[0].select = true
      }
    })
  } else {
    all_checked.value = false;
    list.value.length > 0 && list.value.forEach((item, index) => {
      let selected_num = 0;
      if (((type.value == 1 && get_sport_all_selected.value == true) || (type.value == 28 && get_curr_sub_menu_type.value == 29)) || type.value == 2) {
        item.tournamentList && item.tournamentList.forEach(item2 => {
          if (selected.value[item2.tournamentId]) {
            ++selected_num;
            item2.select = true;
            if (item2.select) {
              select_num.value += item2.num
            } else {
              select_num.value -= item2.num
            }
          }
        })
        if (item.tournamentList && (selected_num == item.tournamentList.length)) {
          item.select = true;
        }
      } else {
        item.sportVOs && item.sportVOs[0].tournamentList && item.sportVOs[0].tournamentList.forEach(item2 => {
          if (selected.value[item2.tournamentId]) {
            ++selected_num;
            item2.select = true;
            if (item2.select) {
              select_num.value += item2.num
            } else {
              select_num.value -= item2.num
            }
          }
        })
        if (item.sportVOs[0].tournamentList && (selected_num == item.sportVOs[0].tournamentList.length)) {
          item.sportVOs[0].select = true;
        }
      }

    })
  }
  // this.$forceUpdate()
}
function get_top() {
  if (window.screen.availHeight > 700) {
    fixed_top.value = (window.innerHeight - 351) / 2;
  } else {
    fixed_top.value = (window.innerHeight - 351) / 2 + 34;
  }
}
/**
 *@description quasar滚动事件
 *@param {Number} 滚动的距离
 *@return {Undefined} undefined
 */
function scrolled(position) {
  // 存在 active_index_position 证明点击右侧字母，在前面的逻辑已经赋值了 active_index.value
  // 所以不需要走下面的逻辑
  if (active_index_position.value) {
    active_index_position.value = '' // 复原数据
    return
  }


  is_scroll_right.value = false;
  let position2;
  for (let i = 0; i < scroll_obj2_val.value.length; i++) {
    if (scroll_obj2_val.value[i + 1] > position && scroll_obj2_val.value[i] < position) {
      position2 = scroll_obj2_val.value[i];
    }
  }
  if (position >= scroll_obj2_val.value[scroll_obj2_val.value.length - 1]) {
    position2 = scroll_obj2_val.value[scroll_obj2_val.value.length - 1];
  }
  let key = lodash.findKey(scroll_obj2.value, function (val) {
    return val == position2;
  });
  if (key) {
    if (is_on_clicking.value) {
      return; // 正在点击 不设置滚动中获取的
    }
    active_index.value = key;
  }
}
/**
 *@description 根据list计算出字母对应的滚动高度
 *@param {Number} index_num 在this.list中的下标
 *@return {Undefined} undefined
 */
function scroll_obj_fn(index_num) {
  scroll_obj.value = {};
  let scrollY = 0;
  // 页面渲染后执行
  nextTick(() => {
    let dom_title = tittle_text.vlaue && tittle_text.vlaue[index_num]
    let dom_bg = bg_f6f7f8.vlaue
    list.value.map((item, index2) => {
      if (index2 == index_num) {
        // scrollY += 86;
        if (dom_title) {
          scrollY += (dom_title).offsetHeight
        }
        if (dom_bg) {
          scrollY += dom_bg[0].offsetHeight
        }
      } else {
        //动态获取元素的高度offsetHeight 返回元素的高度（包括元素高度、内边距和边框，不包括外边距）+10 是因为外边距是10px
        // scrollY += scroll_area1.vlaue && scroll_area1.vlaue[index2] && scroll_area1.vlaue[index2].offsetHeight
        scrollY += scroll_area1.vlaue && scroll_area1.vlaue[index2] && (+window.getComputedStyle(scroll_area1.vlaue[index2], null).height.split('px')[0])
      }
      let index = item.spell == "HOT" ? i18n_t('search.hot') : (item.spell ? item.spell[0] : item.nameText[0]);
      // toFixed 存在精度问题，因为不是特别长的列表，所以暂时不会出现滚动到差异的地方。
      scroll_obj.value[index] = +scrollY.toFixed(2);
    });
    let keys = Object.keys(scroll_obj.value);
    let values = Object.values(scroll_obj.value);
    let obj = {};
    for (let i = 0; i < keys.length; i++) {
      if (i == 0) {
        obj[keys[i]] = 0;
      } else {
        obj[keys[i]] = values[i - 1];
      }
    }
    scroll_obj2.value = obj;
    scroll_obj2_val.value = Object.values(scroll_obj2.value);
    if (index_num == -1) {
      active_index.value = Object.keys(scroll_obj.value)[0];
    }
  })
}
/**
 *@description 点击左边字母或滑动时出现悬浮警示图文显示时间
 *@param {String} item 字母
 *@return {Undefined} undefined
 */
function bar_click(item) {
  is_scroll_right.value = true;
  active_index.value = item;
  is_show.value = true;
  is_on_clicking.value = true;
  timer2 = setTimeout(() => {
    is_show.value = false;
    is_on_clicking.value = false;
  }, 500);
}
/**
 *@description 根据高度计算绑定左边按钮所在的位置
 *@param {Object} obj 触摸事件对象
 *@return {Undefined} undefined
 */
function handler(obj) {
  let Y = obj.position.top - fixed_top.value, distance = 15;
  is_scroll_right.value = true;
  obj.isFirst && (is_show.value = true);
  obj.isFinal && (is_show.value = false);
  // 滑动 动态 字母对应到左边赛选列表内容
  for (let i = 0; i < anchor_arr.value.length; i++) {
    if (Y > (338 - ((anchor_arr.value.length - 1 - i) * distance))) {
      active_index.value = anchor_arr.value[i]
    }
  }
  if (Y < distance) {
    active_index.value = i18n_t('search.hot');
  }
}
/**
 *@description 右上角确定按钮事件,更新vuestore 中的 filter_list
 *@return {Undefined} undefined
 */
function search_btn() {
  if (select_num.value == 0) {
    i18n_toast(i18n_t('filter.please_select_league'), 2000)
    return
  }
  let data = {};
  if (all_checked.value) {
    data = i18n_t('footer_menu.all');
  } else {
    if (list.value && list.value.length) {
      list.value.map(item => {
        if ((type.value == 1 && get_sport_all_selected.value == true) || (type.value == 28 && get_curr_sub_menu_type.value == 29)) {
          if (item.tournamentList) {
            item.tournamentList.map(item2 => {
              item2.select && (data[item2.tournamentId] = true);
            });
          }
        } else {
          if (item.sportVOs[0].tournamentList) {
            item.sportVOs[0].tournamentList.map(item2 => {
              item2.select && (data[item2.tournamentId] = true);
            });
          }
        }

      });
    }
  }

  //TODO  筛选前重置联赛折叠状态
  // this.set_collapse_csid_map({})
  // this.set_collapse_map_match({});
  // this.set_filter_list(data);

  useMittEmit(MITT_TYPES.EMIT_CHANGE_SELECT_DIALOG, false)
  //触发列表页监听事件，调接口拉取指定赛事
  useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
    text: "filter"
  });
}
/**
 *@description 数据处理，不同的菜单返回的结构不一样
 *@param {Object} value list.value 中的每一项
 *@return {Undefined} undefined
 */
function computed_item(value) {
  if ((type.value == 1 && get_sport_all_selected.value == true) || (type.value == 28 && get_curr_sub_menu_type.value == 29)) {
    return value.tournamentList;
  } else {
    return value.sportVOs[0].tournamentList;
  }
}
//全选按钮事件
function all_checked_click() {
  select_num.value = 0;
  all_checked.value = !all_checked.value;
  if (!(list.value && list.value.length)) {
    return;
  }
  list.value.forEach(item => {
    if ((type.value != 1 && get_curr_sub_menu_type.value != 29) || ((type.value == 1 && get_sport_all_selected.value == false))) {
      item = item.sportVOs[0];
    }
    item.select = all_checked.value;

    if (item.tournamentList && item.tournamentList.length) {
      item.tournamentList.forEach(item2 => {
        item2.select = all_checked.value;
        if (item2.select) {
          select_num.value += item2.num
        } else {
          select_num.value -= item2.num
        }
      });
    }
  });
  // this.$forceUpdate(); //强制刷新页面，解决页面不会重新渲染的问题
}
// 反选按钮事件
function select_btn_click() {
  if (select_num.value == 0) return
  if (all_checked.value) {
    select_num.value = 0;
    all_checked.value = false;
  }
  if (!(list.value && list.value.length)) {
    return;
  }
  list.value.forEach(item => {
    if ((type.value != 1 && get_curr_sub_menu_type.value != 29) || (type.value == 1 && get_sport_all_selected.value == false)) {
      item = item.sportVOs[0];
    }
    if (item.tournamentList && item.tournamentList.length) {
      item.tournamentList.forEach(item2 => {
        item2.select = !item2.select

        if (item2.select) {
          select_num.value += item2.num
        } else {
          select_num.value -= item2.num
        }

      });
      item.select = lodash.every(item.tournamentList, item2 => {
        return item2.select == true
      })
    }
  });
  // this.$forceUpdate(); //强制刷新页面，解决页面不会重新渲染的问题
}
/**
 * @Description:选择/取消联赛
 * sport_item 赛事信息
 * status-false-取消,true-选中
 */
function select_sport_ctr(sport_item) {
  let list;
  //不在滚球
  if ((type.value != 1 && get_curr_sub_menu_type.value != 29) || (type.value == 1 && get_sport_all_selected.value == false)) {
    list = lodash.map(list.value, "sportVOs");
    list = lodash.map(list, item => {
      return item[0];
    });
    sport_item.sportVOs[0].spell = sport_item.spell || '';
    sport_item = sport_item.sportVOs[0];
  } else {
    list = list.value;
  }
  let status = !sport_item.select;
  sport_item.select = status;
  if (sport_item.tournamentList && sport_item.tournamentList.length) {

    sport_item.tournamentList.forEach(item2 => {
      item2.select = status;
      if (status) {
        select_num.value += item2.num;
      } else {
        select_num.value -= item2.num;
      }
    });
  }
  if (status) {
    if (all_true_select_item(list)) {
      all_checked.value = true;
    }
  } else {
    if (all_false_select_item(list)) {
      all_checked.value = false;
    }
  }
  // this.$forceUpdate();
}
// @Description:单个选择
function select_li_ctr(li_item, wrapItem, item1) {
  let list;
  if ((type.value != 1 && get_curr_sub_menu_type.value != 29) || (type.value == 1 && get_sport_all_selected.value == false)) {
    list = lodash.map(list.value, "sportVOs");
    list = lodash.map(list, item => {
      return item[0];
    });
    item1.sportVOs[0].spell = item1.spell || '';
  } else {
    list = list.value;
  }
  if (li_item.select) {
    li_item.select = false;
    select_num.value -= li_item.num;
    if (this.part_false_select_item(wrapItem)) {
      if ((type.value != 1 && get_curr_sub_menu_type.value != 29) || (type.value == 1 && get_sport_all_selected.value == false)) {
        item1 = item1.sportVOs[0];
      }
      item1.select = false;
    }
    all_checked.value = false;
  } else {
    li_item.select = true;
    select_num.value += li_item.num;
    if (this.part_true_select_item(wrapItem)) {
      if ((type.value != 1 && get_curr_sub_menu_type.value != 29) || (type.value == 1 && get_sport_all_selected.value == false)) {
        item1 = item1.sportVOs[0];
      }
      item1.select = true;
      if (all_true_select_item(list)) {
        all_checked.value = true;
      }
    }
  }
  // this.$forceUpdate();
}
function all_true_select_item(wrapItem) {
  return lodash.every(wrapItem, ["select", true]);
}
function all_false_select_item(wrapItem) {
  return lodash.some(wrapItem, ["select", false]);
}
function part_true_select_item(wrapItem) {
  return lodash.every(wrapItem, ["select", true]);
}
function part_false_select_item(wrapItem) {
  return lodash.some(wrapItem, ["select", false]);
}
// 设置是否隐藏
function is_hide(sport_item, index) {
  sport_item.hide = !sport_item.hide;
  // this.$forceUpdate();
  scroll_obj_fn(index);
}
// 获取筛选数据外层列表
function fetch_filter_match() {
  let m_type = -1, m_id = -1;
  if (get_current_menu.value && get_current_menu.value) {
    //TODO 老逻辑
    // m_type = this.get_current_menu.main;
    //m_id = this.get_current_menu.main.menuId;
    m_type = get_current_menu.value.mi;
    m_id = get_current_menu.value.mi;
  }
  let params = {}, api_match_filter;
  if (m_type == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(get_curr_sub_menu_type.value)) {
    params = {
      sportType: get_req_match_list_params.value.sportType,
      startTime: get_req_match_list_params.value.startTime,
      endTime: get_req_match_list_params.value.endTime,
      isVirtualSport: 1,
      page: {
        size: 100,
        current: 1
      }
    };
    api_match_filter = api_filter.get_filter_match_list
  } else {
    params = {
      type: m_type == 28 && get_curr_sub_menu_type.value == 29 ? '29' : type.value, // 29 是代表 赛果里边的 我的投注的选项
      euid: MenuData.is_jinzu(m_type) ? m_id : MenuData.get_euid(MenuData.get_current_sub_menuid()), // menuType 30竞足
      inputText: props.search_val,
      cuid: UserCtr.get_uid(),
      device: 'v2_h5',
      md: lodash.get(MenuData.current_lv_3_menu, 'field1')
    };
    console.log('asdnushfafaf', params);
    api_match_filter = api_filter.get_fetch_filter_match_old
    //三级日期菜单时间戳
    get_md.value > -1 && m_type != 1 && Object.assign(params, { md: get_md.value });
  }
  list_data_loading.value = true;
  //调用：v1/m/getFilterMatchList接口
  api_match_filter(params).then(({ code, data }) => {
    try {
      list_data_loading.value = false;
      if (data && data.length > 0) {
        no_find_content.value = false;
        change.value = true;
      } else {
        no_find_content.value = true;
        change.value = false;
        return
      }
      //数据过滤,过滤出那些有数据的
      data = data.filter(item => {
        // 过滤掉热门赛事：item.spell != 'HOT'
        if (item.sportVOs && item.sportVOs[0].tournamentList) {
          return item
        }
      })
      //滚球的话取第一个全部里的sportVOs
      if ((type.value == 1 && get_sport_all_selected.value == true) || (type.value == 28 && get_curr_sub_menu_type.value == 29)) {
        let data2 = [];
        data.length > 0 && data.map(item => {
          if (item.spell == 'HOT' && item.sportVOs) {
            let data3 = {};
            data3.id = item.id;
            data3.nameText = item.introduction;
            data3.spell = item.spell;
            data3.tournamentList = [];
            item.sportVOs.map(item2 => {
              if (item2.tournamentList) {
                data3.tournamentList.push(...item2.tournamentList)
              }
              // item2.tournamentList && data3.tournamentList.concat(item2.tournamentList)
            })
            data2.push(data3)
          }
          if (item.spell == 'ALL' && item.sportVOs) {
            item.sportVOs.map(item3 => {
              data2.push(item3)
            })
          }
        })
        list.value = data2;
      } else {
        list.value = data || [];
      }
      // 筛选时，把首字母相同的集合 放在第一个item 上,
      filter_alphabet(list.value)
      // 动态生成有联赛的字母，并非A - Z 全量字母；
      dynamic_letters(list.value)
      scroll_obj_fn(-1);
      if (JSON.stringify(selected.value) !== "{}") {
        //初始化默认选中
        default_selected();
      }
    } catch (e) {
      console.error(e);
    }
  }).catch(err => {
    list_data_loading.value = false;
    no_find_content.value = true;
    console.error(err)
  });
}
// 首字母过滤放在放在第一个item 上
function filter_alphabet(arr) {
  for (let i = 0; i < arr.length; i++) {
    // 如果数组只有一个的话
    if (arr.length == 1) {
      arr[i].spell === 'HOT' ? arr[i].title = i18n_t('search.hot_league') : arr[i].title = arr[i].spell[0]
      return arr[i].title
    } else {
      // 如果数组大于一个以上
      for (let j = 1; j < arr.length; j++) {
        // 如果下标是第1个之后才执行下边
        if (i > 0) {
          // 如果第一个和后边的其中一个相等，并且 第一个和上一个相比，不一样，title 塞进当前元素
          if ((arr[i].spell[0] == arr[j].spell[0]) && (arr[i].spell[0] !== arr[i - 1].spell[0])) {
            arr[i].title = arr[i].spell[0]
          }
        } else { // 代表第0个元素，
          arr[i].spell === 'HOT' ? arr[i].title = i18n_t('search.hot_league') :
            arr[i].title = arr[i].spell[0]
        }
      }
    }
  }
}
// 动态生成有联赛的字母，并非A - Z 全量字母；
function dynamic_letters(arr) {
  try {
    let arr_initials = []
    arr.forEach((item) => {
      if (item.title == i18n_t('search.hot_league')) {
        arr_initials.push(i18n_t('search.hot'))
      } else if (item.title) {
        arr_initials.push(item.title)
      }
    })
    anchor_arr.value = arr_initials
  } catch (e) {
    console.error(e);
  }
}

// 组件销毁时
onBeforeUnmount(() => {
  clearTimeout(timer2)
})
// 当前二级菜单选中的菜单类型
// type.value = lodash.get(get_current_menu.value, 'main');
get_top();
fetch_filter_match();
// selected.value = get_filter_list.value || {};
// 如果是 竟足，则初始化 二级菜单的值为 null，解决赛果我的投注 切换到竞足时的  22690 bug单号
if (get_menu_type.value == 30) {
  //this.set_curr_sub_menu_type(null);
}
</script>
<style lang="scss" scoped>
@import url('./index_old.scss');
</style>src/output