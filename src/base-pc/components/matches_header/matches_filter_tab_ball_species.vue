<!--
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-15 19:17:42
 * @LastEditors: lowen pmtylowen@itcom888.com
 * @LastEditTime: 2023-11-08 19:21:01
 * @FilePath: \user-pc-vue3\src\components\matches_header\matches_filter_tab_ball_species.vue
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: lockie
 * @Date: 2023-07-03 16:29:15
 * @FilePath: \user-pc-vue3\src\components\matches_header\matches_filter_tab_ball_species.vue
 * @Description: 
-->
<template>
  <div class="current-filter-wrap">
    <div class="current-filter-list" @scroll="on_scroll">
      <div
        class="current-filter-tab"
        v-for="(item, index) in top_events" :key="index"
      >
        <div class="filter-label" @click="choose_filter_tab(item.mi)" :class="{ checked: current_choose_tab == item.mi }">
          <div class="filter-tab-item">
            <div class="filter-icon">
              <sport_icon :sport_id="compute_sport_id(item.mi)" :status="current_choose_tab == item.i"  size="24px" class="icon" />
              <div class="filter-count">{{ item.count }}</div>
            </div>
            <div :class="{ checked_text: current_choose_tab == item.mi }" class="label-text">
              <!-- {{ (menus_i18n_map || {} )[item.mi] || "" }} -->
            </div>
          </div>
          <img class="current-mark" :class="{ 'show-mark': current_choose_tab == item.mi }" src="../../../assets/images/mask_group.png" alt="">
        </div>
        <div class="filter-tab-split-line" v-show="index != top_events.length - 1"></div>
      </div>
    </div>
    <div class="prev-btn-box" v-show="show_left_btn" @click="filter_tab_scroll('prev')">
      <div class="prev-btn">
        <img src="../../../assets/images/tr_right_arrow.png" alt="">
      </div>
      <div class="shadow-box"></div>
    </div>
    <div class="next-btn-box" v-show="show_right_btn" @click="filter_tab_scroll('next')">
      <div class="shadow-box"></div>
      <div class="next-btn">
        <img src="../../../assets/images/tr_right_arrow.png" alt="">
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import MatchListOuzhouClass from 'src/core/match-list-pc/match-ouzhou-list.js'
import sport_icon from "src/base-pc/components/sport_icon.vue";
import { use_base_data,useMenuI18n } from "src/base-pc/components/menus/base_data";
import _ from "lodash"
const { compute_sport_id,mi_euid_map_res } = use_base_data()

// 国际化
// const { data:menus_i18n_map } = useMenuI18n()

const top_events = ref(MatchListOuzhouClass.redux_menu.in_play)

let area_obj = null;
let area_obj_wrap = null;
let for_count
// 默认选中当前第一个tab
let current_choose_tab = ref(101);
// 滚动定时器
let interval_id = null;

// 是否显示左边按钮
const show_left_btn = ref(false);
// 是否显示右边按钮
const show_right_btn = ref(false);
// tab页面数据
const menu_tab_list = ref([])

// const top_events = ref([ 101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115,114, 104, 106, 118, 400, 300,]);

onMounted(() => {
  area_obj = document.querySelector('.current-filter-list');
  area_obj_wrap = document.querySelector('.current-filter-wrap');
  if (area_obj.scrollWidth >= area_obj_wrap.clientWidth) {
    show_right_btn.value = true;
  }
  console.log('lockie_test_console', area_obj.scrollWidth);
  top_events.value = MatchListOuzhouClass.redux_menu.in_play;
  current_choose_tab.value = MatchListOuzhouClass.redux_menu.mid_tab_menu_type;
})

// 监听左侧变化
// store.subscribe(() => {
//   state = store.getState()
//   console.error('ssasda',state.menusReducer.redux_menu.in_play)
// });

/**
 * 
 * @param {Number} payload 
 * @description 当前选择的tab高亮 通过id属性映射
 */

 
const choose_filter_tab = payload => {

  current_choose_tab.value = payload;

  // 获取最新的 数据
  let redux_menu = _.cloneDeep(MatchListOuzhouClass.redux_menu) 
  // 修改菜单数据  header tab切换对应的 
  redux_menu.mid_tab_menu_type = payload
  // 存储
  MatchListOuzhouClass.set_menu(redux_menu)

 
};

/**
 * 
 * @param {Element} e
 * @description 滚动条滚动事件 
 */
const on_scroll = (e) => {
  let scrollLeft = e.target.scrollLeft;
  if(scrollLeft > 0){
    show_left_btn.value = true;
  }else{
    show_left_btn.value = false;
  }
  if(scrollLeft == (area_obj.scrollWidth - area_obj.clientWidth)){
    show_right_btn.value = false;
  }else{
    show_right_btn.value = true;
  }
}

/**
 * 
 * @param {String} payload
 * @description 控制筛选tab栏左右滚动，当无法滚动时隐藏滚动按钮 
 */
const filter_tab_scroll = payload => {
  clearInterval(interval_id)
  let scrollLeft = area_obj.scrollLeft;
  for_count = 0
  // 滚动动画
  interval_id = setInterval(() => {
    for_count ++;
    if(for_count > 18){
      clearInterval(interval_id)
    }
    if(payload == 'prev') {
      scrollLeft -= 15;
    } else {
      scrollLeft += 15;
    }
    area_obj.scrollLeft = scrollLeft;
  }, 16)
}

onBeforeUnmount(() => {
  clearInterval(interval_id);
  interval_id = null;
})
</script>

<style lang="scss" scoped>
.current-filter-wrap {
  position: relative;
  width: 100%;
}
.current-filter-list {
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 20px;
  height: 56px;
  background: #FFFFFF;
  padding-left: 18.25px;
  box-sizing: border-box;
  overflow-x: auto;
  flex-wrap: nowrap;
  white-space: nowrap;
  &::-webkit-scrollbar {
    display: none;
  }
}

.current-filter-tab {
  height: 100%;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.filter-label {
  display: flex;
  height: 100%;
  position: relative;
  align-items: center;
  font-size: 13px;
  color: #8a8986;
  &.checked{
    .filter-count{
      background: #FF7000;
    }
  }
}

.filter-tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .filter-icon{
    position: relative;
    .icon{
      position: relative;
      z-index: 3;
    }
  }
  .filter-count{
    position: absolute;
    top: 0px;
    left: 21px;
    height: 16px;
    border-radius: 8px;
    padding: 0 4px;
    background: #BDBDBD;
    font-family: "DIN";
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0px;
    display: flex;
    color: #fff;
    justify-content: center;
    align-content: center;
    z-index: 2;
  }

}
.label-text {
  display: flex;
  align-items: center;  
}
.checked {
  font-size: 13px;
}
.checked_text {
  font-weight: 500;
  color: #1a1a1a;
  &::before {
    content: '';
    font-weight: 500;
    visibility: hidden;
    height: 1px;
    color: transparent;
    margin-bottom: -1px;
    overflow: hidden;
    display: block;
  }
}
.filter-tab-split-line {
  width: 1px;
  height: 12px;
  background: #d9d9d9;
  margin: 0 16px;
  position: relative;
  top: 12px;
}

.current-mark {
  width: 10px;
  height: 4px;
  // border-radius: 4px 4px 0 0;
  position: absolute;
  bottom: 0px;
  left: 50%;
  display: none;
  margin-left: -5px;
}
.show-mark {
  display: block;
}

.prev-btn-box, .next-btn-box {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  .shadow-box {
    width: 10px;
    height: 55px;
    background: linear-gradient(270deg, #D9D9D9 0%, rgba(217, 217, 217, 0) 100%);
    opacity: 0.1;
  }
}
.prev-btn, .next-btn {
  background: #FFFFFF;
  width: 16px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    width: 5px;
    height: 8px;
  }
}
.prev-btn-box {
  left: 0;
  .prev-btn {
    img {
      transform: rotate(180deg);
    }
  }
}
.next-btn-box {
  right: 0;
}
</style>
