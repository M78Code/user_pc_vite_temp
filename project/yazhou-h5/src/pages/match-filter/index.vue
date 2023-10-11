<!--
 * @Author:
 * @Date: 2022-09-01 18:35:53
 * @Description: 筛选页  1974 【客户端】H5联赛排序和筛选功能逻辑优化
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
          <!-- 联赛名称部分 -->
          <q-slide-transition>
            <div v-if="!item1.hide">
              <div :key="index + 'League-name'" class="row  items-center content_box1">
                <div class="row justify-between items-center content_box2"
                  :class="{ 'content_box3': item1.title && item1.spell }" @click.stop.prevent="select_li_ctr(item1)">
                  <div class="row items-center">
                    <div class="row items-center">
                      <!-- 联赛icon -->
                      <img
                        :src="item1.picUrlthumb ? get_file_path(item1.picUrlthumb) :compute_img('match-cup')"
                        @error="league_icon_error" class="match_logo" />
                      <div class="name-overhide">{{ item1.nameText }}</div>
                      <div class="nums"
                        v-show="!(type == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(get_curr_sub_menu_type))">
                        {{ item1.num }}</div>
                    </div>
                  </div>
                  <img  class="icon-search"
                  :src="compute_img(item1.select?'checkbox-box-s':'checkbox-box')"
                     />
                </div>
              </div>
            </div>
          </q-slide-transition>
        </div>
      </div>
    </q-scroll-area>

    <!-- 右边字母切换按钮 quasar提供的平移上下左右操作v-touch-pan.-->
    <ul class="right-side" v-touch-pan.vertical.prevent="handler" v-show="!no_find_content && !list_data_loading">
      <li @click.stop.prevent="bar_click(item)" :class="{ actived: active_index == item, hot: item == $t('search.hot') }"
        v-for="(item, index) in anchor_arr" :key="index + 'letter'">
        <template v-if="item == $t('search.hot')">
          <img style="width: 28px;"
            :src="compute_img(active_index == item?'match-filter-s':'match-filter')"
            alt="">
        </template>
        <div class="t-wrap" v-else>{{ item }}</div>
      </li>
    </ul>

    <!-- 字母悬浮图标 -->
    <div v-if="is_show" class="active-point"  :style="[{ top: fixed_top + 150 + 'px' },compute_css('work-s')]">
      <span>{{ active_index }}</span>
    </div>

    <!-- 底部固定部分 -->
    <!-- 全选/反选/确定 -->
    <div class="allCheck row justify-between items-center" v-if="change && !list_data_loading">
      <div class="row items-center"
        :style="{ lineHeight: ['vi', 'en', 'th', 'ms', 'ad'].includes(get_lang) ? '1' : 'unset' }">
        <!-- <template> -->
        <img  class="icon-search" @click="all_checked_click"
        :src="compute_img(all_checked?'checkbox-box-s':'checkbox-box')" />
        <span class="txt ellipsis-2-lines" @click="all_checked_click">{{ $t('common.all_select') }}</span>
        <!-- </template> -->
        <span class="txt ellipsis-3-lines" @click="select_btn_click">{{ $t('filter.reverse_election') }}</span>
      </div>
      <!-- 确定选择按钮 -->
      <div class="right-box" @click="search_btn">
        <p class="confirm">{{ $t('common.ok') }}</p>
        <p class="round-box">{{ select_num }}</p>
      </div>
    </div>
    <!-- 无数据展示 -->
    <no-data which="noMatch" style="margin-top: 0.26rem" :height="100"
      v-if="!list_data_loading && no_find_content"></no-data>
  </div>
</template>

<script setup>
// import { mapGetters, mapMutations } from "vuex";
import { api_filter } from "src/api/index.js";
// 无网络展示组件
import NoData from "project_path/src/components/common/no-data.vue";
import SFilter from "project_path/src/components/skeleton/filter.vue";
import lodash from 'lodash';
import { i18n_t, MITT_TYPES,compute_css, useMittEmit, MenuData,compute_img, UserCtr, get_file_path } from 'src/core/'
import { ref, watch, computed, nextTick, onBeforeUnmount } from 'vue';
const default_url = "/yazhou-h5/image/svg/match_cup.svg"  //默认图片地址
// 无联赛logo图标黑色版
const none_league_icon_black = "/yazhou-h5/image/svg/match_cup_black.svg"

const list_data_loading = ref(false)     //数据加载中
const list = ref([]) //数据列表整个赛事
const type = MenuData.menu_type  //筛选类型 1-滚球 3-今日  4-早盘  100-冠军 28 赛果
const anchor_arr = ref([i18n_t('search.hot'), "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]) //右边字母数组
const active_index = ref("")  //活动的下标
const active_index_position = ref("")   // 活动的下标对应的position，在右侧字母的时候，scroll 不支持传float，这个值用于记录
const is_show = ref(false) //悬浮图标是否展示
const is_scroll_right = ref(false) //是否滚动到正确位置
const scroll_obj = ref({})  //滚动对象集合
const scroll_obj2 = ref({}) //滚动对象集合
const scroll_obj2_val = ref([]) //滚动对象集合备份
const fixed_top = ref(0)   //到顶部的距离
const no_find_content = ref(false) //是否显示未查找到相关搜索
const change = ref(true) //是否显示全选按钮
const selected = ref({})   //选中的赛事集合 //TODO get_filter_list
const select_num = ref(0) //选中的赛事数量

//ref对象
const scrollArea = ref(null);
const tittle_text = ref(null);
const scroll_area1 = ref(null);
const bg_f6f7f8 = ref(null);
let timer2;
// computed: {
// ...mapGetters([
const get_lang = ref(UserCtr.lang)
const get_curr_sub_menu_type = ref(MenuData.get_current_lv_2_menu_type())
const get_req_match_list_params = ref({})//TODO

const get_uid = ref(UserCtr.get_uid())//userid
const get_current_menu = ref(MenuData.current_lv_1_menu)
const get_md = ref(MenuData.current_lv_3_menu)    //三级日期菜单时间戳
const get_theme = ref(UserCtr.theme)
// ]),
const all_checked = computed(() => {
  return list.value.every(({ select }) => select); // 选中所有
})


watch(active_index, (newVal) => {
  // 活动的下标监听
  let dom_scrollArea = scrollArea.value
  if (is_scroll_right.value && scroll_obj2.value.hasOwnProperty(newVal) && dom_scrollArea) {
    active_index_position.value = scroll_obj2.value[newVal]
    dom_scrollArea.setScrollPosition(scroll_obj2.value[newVal]);
  }
})
// 监听选中的赛事数量
watch(select_num, (new_) => {
  if (new_ < 0) {
    select_num.value = 0
  }
})

// ...mapMutations([
//   "set_filter_list", // 联赛筛选入参tid
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
  $event.target.src =compute_img('match-cup')
  $event.target.onerror = null
}

/**
 *@description 初始化默认不选中
 *@return {Number} undefined
 */
// default_selected() {
//   list.value.forEach(i=>i.select=false);
//   this.$forceUpdate()
// },
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
    let dom_title = tittle_text.value && tittle_text.value[index_num]
    let dom_bg = bg_f6f7f8.value
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
        // scrollY += scroll_area1.value && scroll_area1.value[index2] && scroll_area1.value[index2].offsetHeight
        scrollY += scroll_area1.value && scroll_area1.value[index2] && (+window.getComputedStyle(scroll_area1.value[index2], null).height.split('px')[0])
        // console.log(scrollY,"scrollY");
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
  timer2 = setTimeout(() => {
    is_show.value = false;
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
  if (list.value.filter(i => i.select).length == 0) {
    $toast(i18n_t('filter.please_select_league'), 2000)
    return
  }
  let data = {};
  if (all_checked.value) {
    data = i18n_t('footer_menu.all');
  } else {
    if (list.value && list.value.length) {
      list.value.map(item => {
        if (item.select) {
          data[item.tournamentId] = true;
        }
      });
    }
  }
  //TODO 筛选前重置联赛折叠状态
  // set_collapse_csid_map({})
  // set_collapse_map_match({});
  //this.set_filter_list(data);
  useMittEmit(MITT_TYPES.EMIT_CHANGE_SELECT_DIALOG, false)
  //触发列表页监听事件，调接口拉取指定赛事
  useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
    text: "filter"
  });
}
//全选按钮事件
function all_checked_click() {
  if (!(list.value && list.value.length)) {
    return;
  }
  const check_value = !all_checked.value;
  let number_of_filters = 0;
  list.value.forEach(item => {
    item.select = check_value;
    number_of_filters += item.num
  });
  //设置全选//反选 数量 
  select_num.value = all_checked.value ? number_of_filters : 0;
}
// 反选按钮事件
function select_btn_click() {
  if (!(list.value && list.value.length)) {
    return;
  }
  // 如果是 全选
  if (all_checked.value) {
    list.value.forEach(item => {
      item.select = false
    });
    select_num.value = 0;
  } else { // 如果不是 全选
    list.value.forEach(item => {
      item.select = !item.select;
    });
    let cumulative_quantity = 0
    list.value.forEach(item => {
      if (item.select) {
        cumulative_quantity += item.num
      }
    });
    select_num.value = cumulative_quantity
  }
}
// @Description:单个选择
function select_li_ctr(li_item) {
  if (li_item.select) {
    select_num.value -= li_item.num;
  } else {
    select_num.value += li_item.num;
  }
  li_item.select = !li_item.select;
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
  // 如果是赛果，并且是 虚拟体育
  if (MenuData.is_results_virtual_sports()) {
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
      // 29 是代表 赛果里边的 我的投注的选项
      type: m_type == 28 && get_curr_sub_menu_type.value == 29 ? '29' : type.value,
      euid: m_type == 30 ? m_id : MenuData.get_current_sub_menuid(), // menuType 30竞足
      inputText: '',
      cuid: get_uid.value,
      device: 'v2_h5',
      md: lodash.get(get_current_menu.value, 'date_menu.field1')
    };
    api_match_filter = api_filter.get_fetch_filter_match
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
      //排序
      data.sort((a, b) => {
        if (a.spell == 'HOT' || b.spell == 'HOT') {
          if (a.spell == b.spell) {
            return 0;
          }
          return a.spell == 'HOT' ? -1 : 1;
        } else {
          return a.spell.localeCompare(b.spell)
        }
      }
      );
      list.value = (data || []).map(i => ({ ...i, select: i.id in selected.value })); // 初始化select
      // 筛选时，把首字母相同的集合 放在第一个item 上,
      filter_alphabet(list.value)
      // 动态生成有联赛的字母，并非A - Z 全量字母；
      dynamic_letters(list.value)
      scroll_obj_fn(-1);
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
      arr[i].spell == "HOT" ? arr[i].title = i18n_t('search.hot_league') : arr[i].title = arr[i].spell[0]
      return arr[i].title
    } else {
      // 如果数组大于一个以上
      for (let j = 1; j < arr.length; j++) {
        // 如果下标是第1个之后才执行下边
        if (i > 0) {
          // 如果第一个和后边的其中一个相等，并且 第一个和上一个相比，不一样，title 塞进当前元素
          if ((arr[i].spell == arr[j].spell) && (arr[i].spell !== arr[i - 1].spell)) {
            arr[i].title = arr[i].spell
          }
        } else { // 代表第0个元素，
          arr[i].title = arr[i].spell == "HOT" ? i18n_t('search.hot_league') :
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
get_top();
fetch_filter_match();
// 如果是 竟足，则初始化 二级菜单的值为 null，解决赛果我的投注 切换到竞足时的  22690 bug单号
if (type.value == 30) {
  MenuData.set_current_lv2_menu();
}
</script>
<style lang="scss" scoped>
.boss-box {
  padding: 0.5rem 0 0.64rem;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-top: 1px solid transparent;

  .allCheck {
    width: 3.78rem;
    position: absolute;
    bottom: 0;
    height: 0.64rem;
    line-height: 0.64rem;
    padding-right: 0.2rem;
    padding-left: 0.2rem;
    text-align: right;
    font-size: 0.14rem;
    z-index: 999;

    i {
      position: relative;
      top: 1px;
    }

    .icon_selected-no {
      position: relative;
      top: -0.01rem;
    }

    .txt {
      margin-left: 0.05rem;
      margin-right: 0.1rem;
      font-size: 0.14rem;

      text-align: center;
      max-width: 0.59rem;
    }
  }

  .right-side {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.1rem;
    z-index: 200;
    list-style: none;
    text-align: center;

    li {
      width: 0.14rem;
      height: 0.14rem;
      /*line-height: 0.14rem;*/
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.12rem;
      box-sizing: content-box;
      border: 2px solid transparent;

      .t-wrap {
        width: 0.14rem;
        height: 0.13rem;
        margin-bottom: 0.03rem;
      }

      &.hot {

        border-radius: 50%;

        font-size: 0.09rem;
      }

      &.actived {


        background-clip: content-box;
        border-radius: 50%;

        font-size: 0.12rem;
      }
    }
  }

  .active-point {
    position: fixed;
    top: 3.4rem;
    right: 0.85rem;
    z-index: 100;
    width: 0.7rem;
    height: 0.6rem;
    font-size: 0.28rem;
    background: var(--q-color-img-bg-96) no-repeat center / 98%;



    span {
      display: inline-block;
      width: 0.65rem;
      height: 0.6rem;
      line-height: 0.6rem;
      text-align: center;
    }
  }
}

/* overflow-y: scroll; */
.tittle_text {
  height: 0.56rem;
  line-height: 0.56rem;
  margin-right: 0.46rem;
  margin-left: 0.2rem;

  font-weight: bold;
}

.content_box1 {
  height: 0.56rem;

  font-size: 12px;

  .content_box2 {
    width: 100%;
    margin-right: 0.46rem;
    font-size: 0.16rem;
    position: relative;
    margin-left: 0.08rem;

    &:before {
      content: "";
      display: block;
      position: absolute;
      top: -0.16rem;
      width: 2.89rem;
      left: 0.43rem;
      height: 1px;
      transform: scaleY(0.5);
      transform-origin: 0 0;
    }

    &.content_box3 {
      &:before {
        display: none;
      }
    }
  }

  img {
    width: 0.2rem;
    height: 0.2rem;
    margin-left: 0.08rem;
  }

  .nums {

    font-size: 0.14rem;
    margin-left: 0.05rem;
    position: absolute;
    right: 0.31rem;
  }

  i {
    position: relative;
  }
}

.right-box {
  flex-shrink: 0;
  width: 1.6rem;
  height: 0.44rem;
  text-align: center;

  border-radius: 0.04rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .round-box {
    width: 0.28rem;
    height: 0.17rem;
    line-height: 0.17rem;

    margin-left: 0.1rem;
    border-radius: 0.13rem;

    font-size: 0.12rem;
  }

  .confirm {

    font-size: 0.16rem;
  }
}

.name-text {

  font-size: 0.16rem;
  margin-left: 0.2rem;
}

.arrow_up {
  transform: translateY(-0.03rem) rotateZ(180deg);
  transition: transform 0.3s;

  &.collapse {
    transform: translateY(-0.03rem) rotateZ(0deg);
  }
}

.scroll-area {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.q-scrollarea__thumb--v) {
    display: none;
    width: 5px;
  }
}

.scroll-area1 {

  border-radius: 0.1rem;

  &:nth-last-child(1) {
    margin-bottom: 0.3rem;
  }

  .bg-f6f7f8 {
    height: 0.3rem;
    line-height: 0.3rem;

    padding-left: 0.2rem;

    font-size: 0.14rem;
  }
}

.name-overhide {
  max-width: 2.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 0.15rem;

  font-size: 0.16rem;
}

.icon-search {
  width: 0.2rem;
  height: 0.2rem;
}

.icon_selected-no:before {
  content: "\e939";


  border-radius: 50%;
}

.icon-search:before {}
</style>
