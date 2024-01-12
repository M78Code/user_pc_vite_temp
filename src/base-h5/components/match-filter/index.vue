<!--
 * @Author:
 * @Date: 2022-09-01 18:35:53
 * @Description: 筛选页  1974 【客户端】H5联赛排序和筛选功能逻辑优化
-->
<template>
  <div class="boss-box" >
    <!--  筛选骨架屏  -->
    <SFilter v-if="list_data_loading" />
    <!-- 全选 -->
      <div class="scroll-setect-all" v-if="!no_find_content && !list_data_loading">
          <span>{{ i18n_t('common.all_select') }}</span>
          <div @click="all_checked_click" class="scroll-setect-options">
           <img :src="compute_local_project_file_path(all_checked ? '/image/list/icon_selected_theme_type.svg' : '/image/list/icon_unselected_onlight.svg' )" alt="">
          </div>
        </div>
    <!-- 中间滚动选择项 -->
    <q-scroll-area class="scroll-area scroll-bar-display-none" v-if="!no_find_content && !list_data_loading" ref="scrollArea">
      <div v-if="list.length" v-scroll="scrolled" class="yb_mb18">
        <!-- 循环整个后台返回数据 -->
        <div class="scroll-area1" v-for="(item, index) in list" :key="index" ref="scroll_area1">
          <div class="bg-f6f7f8 scroll-title" ref="bg_f6f7f8" v-if="item.title">
            <div class="scroll-title-text">
              <img class="scroll-title-icon"  
                   :class="{'is_fold':item.hide}" 
                   @click="is_fold_fn(item)"
                   :src="compute_local_project_file_path('/image/list/league-collapse-icon-top.svg')" alt="">
              <span>{{ item.title }}</span>
            </div>
            <div class="scroll-setect">
              <div class="scroll-setect-options"
                   @click="type_select(item)">
                   <img :src="compute_local_project_file_path(item.checked ? '/image/list/icon_selected_theme_type.svg' : '/image/list/icon_unselected_onlight.svg')" alt=""></div>
            </div>
          </div>
          <!-- 联赛名称部分 -->
          <q-slide-transition>
            <div v-if="!item.hide">
              <div :key="index + 'League-name'" class="row  items-center content_box1">
                <div class="row justify-between items-center content_box2" :class="{ 'content_box3': item.title && item.spell, 'content_box4': !item.title}">
                  <div class="left">
                    <ImageCacheLoad :path="item.picUrlthumb" type="default_league_icon"></ImageCacheLoad>
                    <div class="name-overhide">{{ item.nameText }}</div>
                  </div>
                  <div>
                    <div 
                      class="nums" 
                      v-show="!(type == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(get_curr_sub_menu_type))"
                    >
                      <span>({{ item.num }})</span>
                      <div @click="select_li_ctr(item)">
                        <img 
                          :src="compute_local_project_file_path(item.select ? '/image/list/icon_selected_theme_type.svg' : '/image/list/icon_unselected_onlight.svg')" 
                          alt=""
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-slide-transition>
        </div>
      </div>
    </q-scroll-area>

    <!-- 右边字母切换按钮 quasar提供的平移上下左右操作v-touch-pan.-->
    <ul class="right-side" v-touch-pan.vertical.prevent="handler" v-show="!no_find_content && !list_data_loading">
      <li @click.stop.prevent="bar_click(item,$event)" :class="{ actived: active_index == item, hot: item == i18n_t('search.hot') }"
        v-for="(item, index) in anchor_arr" :key="index + 'letter'">
        <template v-if="item == i18n_t('search.hot')">
          <img style="width: 28px;" :src="compute_img_url(active_index == item ? 'h5-kyapp-match-fliter-s' : 'match-filter')" alt="">
        </template>
        <div class="t-wrap" v-else>{{ item }}</div>
      </li>
    </ul>

    <!-- 字母悬浮图标 -->
    <div v-if="is_show" class="active-point" :style="[{ top: fixed_top + 100 + 'px' }, compute_css_obj('work-s')]">
      <span>{{ active_index }}</span>
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
import NoData from "src/base-h5/components/common/no-data.vue";
import SFilter from "src/base-h5/components/skeleton/filter.vue";
import lodash from 'lodash';
import {LOCAL_PROJECT_FILE_PREFIX,compute_local_project_file_path} from "src/output/index.js";
import PageSourceData from "src/core/page-source/page-source.js";

import { i18n_t, MITT_TYPES, compute_css_obj, useMittEmit, MenuData, compute_img_url, UserCtr, get_server_file_path } from "src/output/index.js"
import { ref, watch, computed, nextTick, onBeforeUnmount, onMounted, toRefs } from 'vue';
import search from "src/core/search-class/search.js"
import { api_search } from 'src/api/'

import ImageCacheLoad from "src/core/public-cache-image/public-cache-image.vue";

const default_url = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match_cup.svg` //默认图片地址
// 无联赛logo图标黑色版
const none_league_icon_black = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/match_cup_black.svg`

const list_data_loading = ref(false)     //数据加载中
const list = ref([]) //数据列表整个赛事
let list_copy = [] //初始化的数据列表整个赛事
let hot_list = ref([])  //初始化的数据列表整个赛事
const type = MenuData.menu_type  // 100（冠军）  3000（电竞） 赛果29  滚球:1 今日:3 早盘:4 串关:11 冠军:100  竞足 30
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
// const { get_hotselect3 } = api_search || {};

// 热门联赛只展示九大联赛 其余联赛需要塞到 地域级List 或  球种级list
const orderArray = [
  { id: "28206" },
  { id: "6408" },
  { id: "18031" },
  { id: "32070" },
  { id: "180" },
  { id: "320" },
  { id: "239" },
  { id: "276" },
  { id: "79" },
]; //固定排序数组

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

const get_current_menu = ref(MenuData.current_lv_1_menu)
const get_md = ref(MenuData.current_lv_3_menu)    //三级日期菜单时间戳
// ]),
const all_checked = computed(() => {
  return list.value.every(({ select }) => select); // 选中所有
})
const emit = defineEmits(["selectHandle"]);
//暴露出去的方法和数据
defineExpose({list})
const props = defineProps({
  search_val: {
    type: String,
    default: "",
  },
  league_select_list:{
    type: Array,
    default:[],
  }
});

watch(()=>props.search_val, (newVal) => {
  get_search_result(newVal)
}
)
watch(active_index, (newVal) => {   
  // 活动的下标监听
  let dom_scrollArea = scrollArea.value
  if (is_scroll_right.value && scroll_obj2.value.hasOwnProperty(newVal) && dom_scrollArea) {
    active_index_position.value = scroll_obj2.value[newVal]
    dom_scrollArea.setScrollPosition('vertical', active_index_position.value);
  }
})
// 监听选中的赛事数量
watch(select_num, (new_) => {
  if (new_ < 0) {
    select_num.value = 0
  }else {
    emit("selectHandle",select_num);
  }
})

const get_pic_url_thumb = (item) => {

}

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
  $event.target.src = compute_img_url('match-cup')
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
function bar_click(item,event) {
  is_scroll_right.value = true;
  active_index.value = item;
  is_show.value = true;

  timer2 = setTimeout(() => {
    is_show.value = false;
  }, 500);
  if (window.screen.availHeight > 700) {
    fixed_top.value = (window.innerHeight - 351) / 2 + 80+ event.layerY;
  } else {
    fixed_top.value = (window.innerHeight - 351) / 2 + 114 + event.layerY;
  }
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
  //
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
  
  PageSourceData.set_page_source("matchList-filter");

  PageSourceData.set_query_params({
    filter_list: data
  })
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
    item.checked = check_value;
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
  //处理单个选择 关联字母选择
  const is_all_select = list.value.some(i => (!i.select && i.spell==li_item.spell))
  list.value = list.value.map(item=>{
    if (item.spell==li_item.spell){
       item.checked = !is_all_select;
    }
    return item
  })
}
// @Description:字母选择
function type_select(li_item) {
  li_item.checked = !li_item.checked;
  list.value = (list.value || []).map(i => {
    if (i.spell === li_item.title){
       i.select = li_item.checked
    }
    //筛选热门联赛
    if (li_item.title === i18n_t('search.hot_league') && i.spell === 'HOT'){
        i.select = li_item.checked
     }
     return i
  }); // 初始化select
}
// 获取已选择的联赛数据
const get_league_select_list = ()=>{
  list.value = list.value.map(sub=>{
    props.league_select_list?.forEach(item=>{
      if (sub.id === item.id){
        nextTick(()=>{
          sub.select = item.select
        })
      }
    })
     return sub
  })
  // 如果全部勾选 再次进来 全部取消勾选 
  if (list.value.every(({ select }) => select)) {
    list.value.forEach(item => item.select = false)
  }
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
      // 29 是代表 赛果里边的 我的投注的选项  筛选type入参 1滚球 3今日 4早盘 滚球走index_old.vue
      type: MenuData.is_results(m_type) && get_curr_sub_menu_type.value == 29 ? '29' : MenuData.menu_id_map(type.value),
      euid: MenuData.is_jinzu(m_type) ? m_id : MenuData.get_euid(MenuData.get_current_sub_menuid()), // menuType 30竞足
      inputText: props.search_val,
      cuid: UserCtr.get_uid(),
      device: 'v2_h5',
      showem:1, // 新增的参数 区分电子赛事
      md: lodash.get(MenuData.current_lv_3_menu, 'field1') || new Date().setHours(0, 0, 0, 0)
    };
    api_match_filter = api_filter.get_fetch_filter_match
    //三级日期菜单时间戳
    get_md.value > -1 && m_type != 1 && Object.assign(params, { md: get_md.value });
  }
  //
  if (!MenuData.get_euid(lodash.get(MenuData, 'current_lv_2_menu_i'))){
    params.euid = '1';
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
      //过滤热门联赛
      data = data.map(item=>{
        if (orderArray.some(sub => sub.id == item.id)) {
          item.spell = 'HOT'
        } 
        return item
      })
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
      // 取出list中的热门联赛元素 需要按照orderArray重新排序
      let hot_list = lodash.cloneDeep(data).filter(item => item.spell == 'HOT')
      // 这个是经过排序之后的数据 需要用这个数据去替换原来的热门联赛的数据
      let sort_hot_list = customSortAndMerge(hot_list);
      let un_hot_list = lodash.cloneDeep(data).filter(item => item.spell != 'HOT')
      list.value = ([...sort_hot_list, ...un_hot_list] || []).map(i => ({ ...i, select: i.id in selected.value })); // 初始化select
      // 筛选时，把首字母相同的集合 放在第一个item 上,
      filter_alphabet(list.value)
      // 动态生成有联赛的字母，并非A - Z 全量字母；
      dynamic_letters(list.value)

    //拷贝一份数据做筛选用
     list_copy = list.value
      scroll_obj_fn(-1);
      get_league_select_list()
  
      //排序
      // hot_list.value = customSortAndMerge(hot_list.value)
    } catch (e) {
      list_data_loading.value = false;
      console.error(e);
    }
  }).catch(err => {
    list_data_loading.value = false;
    no_find_content.value = true;
    console.error(err)
  });
}
/**
 * 热门数组排序
 */
function customSortAndMerge(hot_real_list) {
  // 使用映射将 orderArray 中的元素与其索引关联起来
  const orderIndexMap = new Map();
  orderArray.forEach((item, index) => {
    orderIndexMap.set(item.id, index);
  });
  // 对过滤后的数组进行排序
  hot_real_list.sort((a, b) => {
    const indexA = orderIndexMap.get(a.id);
    const indexB = orderIndexMap.get(b.id);

    // 如果元素在 orderArray 中找不到，则默认按原始顺序排列
    if (indexA === undefined) return 1;
    if (indexB === undefined) return -1;

    return indexA - indexB;
  });

  return hot_real_list;
}
/**
 * @Description:获取搜索结果数据
 * @param {string} keyword 搜索关键字
 * @return {Undefined} Undefined
 */
function get_search_result(keyword) {
      //去除所有空格
      keyword = keyword.replace(/\s*/g,"");
        list.value = (list_copy || []).filter(item=>{
        if (item.nameText.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) != -1){
          return item
        }
      })
}
// 首字母过滤放在放在第一个item 上
function filter_alphabet(arr) {
  for (let i = 0; i < arr.length; i++) {
    // 如果数组只有一个的话
    if (arr.length == 1) {
      arr[i].spell == "HOT" ? arr[i].title = i18n_t('search.hot_league') : arr[i].title = arr[i].spell[0]
       //补充一个状态 做字母全选
      arr[i].checked = false
      return arr[i].title
    } else {
      // 如果数组大于一个以上
      for (let j = 1; j < arr.length; j++) {
        // 如果下标是第1个之后才执行下边
        if (i > 0) {
          // 如果第一个和后边的其中一个相等，并且 第一个和上一个相比，不一样，title 塞进当前元素
          if ((arr[i].spell == arr[j].spell) && (arr[i].spell !== arr[i - 1].spell)) {
            arr[i].title = arr[i].spell
            //补充一个状态 做字母全选
            arr[i].checked = false
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
/*
 * @Description: 是否折叠联赛
 */
const is_fold_fn = (item)=>{
  item.hide = item.hide ? false : true
  list.value = (list.value || []).map(i => {
    if (i.spell === item.title){
       i.hide = item.hide
    }
    //热门联赛处理
    if (item.title == i18n_t('search.hot_league') && i.spell === 'HOT'){
       i.hide = item.hide
    }
     return i
  });
}
// 组件销毁时
onBeforeUnmount(() => {
  clearTimeout(timer2)
})
get_top();
onMounted(() => {
  fetch_filter_match();
})
// 如果是 竟足，则初始化 二级菜单的值为 null，解决赛果我的投注 切换到竞足时的  22690 bug单号
if (type.value == 30) {
  MenuData.set_current_lv2_menu();
}
</script>
<style lang="scss" scoped>
.boss-box {
  // padding: 0.5rem 0 0.64rem;
  //margin-top: 1.03rem;
  position: absolute;
  top: 1.03rem;
  left: 0;
  bottom: 0;
  right: 0;
  // border-top: 1px solid transparent;

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
    right: 0.02rem;
    z-index: 200;
    list-style: none;
    text-align: center;
    color: var(--q-gb-t-c-24);

    li {
      width: 0.14rem;
      height: 0.14rem;
      /*line-height: 0.14rem;*/
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.10rem;
      box-sizing: content-box;
      border: 2px solid transparent;
      color:var(--q-gb-t-c-10);

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
        background:var(--q-gb-t-c-1);
        color: var(--q-gb-t-c-14);
      }
    }
  }

  .active-point {
    position: fixed;
    top: 3.6rem;
    right: 0.25rem;
    z-index: 100;
    width: 0.48rem;
    height: 0.48rem;
    font-size: 0.28rem;
    background: var(--q-gb-bg-c-44) no-repeat center / 98%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: .48rem;
    color: var(--q-gb-t-c-14);
    &::after {
      content: ' ';
      border-top:  .20rem solid transparent;
      border-bottom:  .20rem solid transparent;
      border-left:  .20rem solid var(--q-gb-bg-c-44);
      position: absolute;
      right: -0.1rem;
      border-radius: 0.16rem;
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

.scroll-setect-all {
  display: flex;
  justify-content: flex-end;
  padding: 0 0.46rem 0 0.14rem;
  height: .48rem;
  align-items: center;
  font-size: .14rem;
  color: var(--q-gb-bg-c-6);
  position: relative;
  z-index: 11;
  background:var(--q-gb-bg-c-25);
  span {
    margin-right: .04rem;
    color: #AFB3C8;
  }
}

.scroll-setect-options {
  width: .16rem;
  height: .16rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  // position: relative;
}
.sso-active{
  border: .01rem solid var(--q-gb-t-c-1);
  &::after {
    content: ' ';
    position: absolute;
    width: .10rem;
    height: .10rem;
    background-color: var(--q-gb-t-c-1);
    border-radius: 50%;
  }
}
  
.content_box1 {
  height: 0.48rem;

  font-size: 12px;
  .content_box4 {
    position: relative;
    &::after {
      content: ' ';
      width: 100%;
      position: absolute;
      border-top:  0.005rem solid var(--q-gb-bd-c-18);
      top: 0;
      left: 0;
      right: 0;
    }
  }
  .content_box2 {
    width: 100%;
    font-size: 0.16rem;
    padding: 0 0.44rem 0 0.14rem;
    height: 100%;
    position: relative;
    color: var(--q-gb-t-c-18);
    background-color: var(--q-gb-bg-c-25) !important;
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
    .left{
      display: flex;
      align-items: center;
      
    }

    .name-overhide {
      font-size: .12rem;
    }
    .nums {
      display: flex;
      align-items: center;
      font-size: .1rem;
      span {
        display: inline-block;
        font-size: 0.14rem;
      }
      div {
        width: 0.28rem;
        height: 0.2rem;
      }
    }
  }

  img {
    width: 0.2rem;
    height: 0.2rem;
    margin-left: 0.08rem;
  }
  i {
    position: relative;
  }
}

.right-box {
  flex-shrink: 0;
  width: 1.6rem;
  height: 0.48rem;
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
  height: calc(100% - 40px);
  // min-width: 400px;
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
    height: 0.48rem;
    line-height: 0.3rem;
    padding-right: 0.46rem;
    font-size: 0.14rem;
    // margin-left: 0.14rem;
    position: relative;
    &::after {
      content: ' ';
      width: 100%;
      position: absolute;
      border-bottom: 0.005rem solid var(--q-gb-bd-c-18);
      bottom: 0;
      left: 0;
      right: 0;
    }
  }

  .scroll-title {
    height: .48rem;
    background: var(--q-gb-bg-c-20);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 .46rem 0 .14rem;
    color: var(--q-gb-t-c-18);
    .scroll-title-text {
      display: flex;
      align-items: center;
      .scroll-title-icon {
        width: .16rem;
        height: .16rem;
        // -background-color: var(--q-gb-t-c-1);
        margin-right: .12rem;
      }
    }
    .scroll-setect {
      display: flex;
    }
  }
}

.name-overhide {
  max-width: 2.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.is_fold{
  transform: rotate(270deg);
}
</style>


<style lang="scss">
/*  白色 */
.boss-box {
  .allCheck {
    border-top: 0.01rem solid var(--q-color-page-bg-color-31);
    color: var(--q-color-com-fs-color-5);
    background: var(--q-color-page-bg-color-95);

    .txt {
      color: var(--q-color-fs-color-136);
    }
  }

  .right-side {
    color: var(--q-color-fs-color-30);

    li {
      &.hot {
        //background:  var(--q-color-page-bg-color-31);
        color: var(--q-color-fs-color-8);
      }

      &.actived {
        // color: var(--q-gb-t-c-14);
        // background: var(--q-gb-bg-c-12);
        // border: 1px solid var(--q-gb-bd-c-10);
      }
    }
  }

  .active-point {
    color: var(--q-color-com-fs-color-8);
  }
}

.tittle_text {
  color: var(--q-color-fs-color-29);
  // border-bottom: 1px solid var(--q-color-com-border-color-11);
}

.content_box1 {
  background: var(--q-gb-bg-c-23);
  color: var(--q-color-fs-color-3);

  .content_box2 {
    &:before {
      background: var(--q-color-border-color-5);
    }
  }

  .nums {
    color: var(--q-gb-t-c-19);
  }

  .round-box {
    background: var(--q-color-page-bg-color-2);
    color: var(--q-color-fs-color-50);
  }

  .confirm {
    color: var(--q-color-com-fs-color-8);
  }
}

.right-box {
  // background: var(--q-color-page-bg-color-13);
  background: var(--q-gb-bg-lg-2);

  .round-box {
    background-color: var(--q-gb-bg-c-15);
    color: var(--qgb-t-c-1);
  }

  .confirm {
    color: var(--q-gb-t-c-14);
  }
}

.scroll-area1 {
  background: var(--q-color-page-bg-color-2);

  .bg-f6f7f8 {
    background-color: var(--q-color-page-bg-color-94);
    color: var(--q-color-fs-color-13);
  }
}

.name-overhide {
  color: var(--q-color-fs-color-1);
}

.icon_selected-no:before {
  color: var(--q-color-fs-color-17);
  background: var(--q-color-page-bg-color-28);
}

.icon_keep:before {
  color: var(--q-color-fs-color-50);
}
</style>