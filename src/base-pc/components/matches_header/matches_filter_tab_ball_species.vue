<template>
  <div class="current-filter-wrap">
    <div class="current-filter-list" @scroll="on_scroll">
      <!-- 常规体育 -->
      <template v-for="(item, index) in mi_100_arr" :key="index">
        <div class="current-filter-tab" v-if=" item.ct > 0 " >
          <div class="filter-label" @click="choose_filter_tab(item)" :class="{ checked: current_choose_tab == item.mi }">
            <div class="filter-tab-item">
              <div class="filter-icon">
                <sport_icon :sport_id="compute_sport_id(item.mif)" :status="current_choose_tab == item.mi"  size="24px" class="icon" />
                <div class="filter-count">{{ item.ct || 0 }}</div>
              </div>
              <div :class="{ checked_text: current_choose_tab == item.mi }" class="label-text">
                {{  BaseData.menus_i18n_map[item.mif] || "" }} {{item.mi}}
              </div>
            </div>
            <img class="current-mark" :class="{ 'show-mark': current_choose_tab == item.mi }" src="../../../assets/images/mask_group.png" alt="">
          </div>
          <div class="filter-tab-split-line"></div>
        </div>
      </template>
      <!-- 电竞 -->
      <!-- <div
        class="current-filter-tab"
        v-for="(item, index) in mi_2000_arr" :key="index"
      >
        <div class="filter-label" @click="choose_filter_tab(item)" :class="{ checked: current_choose_tab == item.mi }">
          <div class="filter-tab-item">
            <div class="filter-icon">
              <sport_icon :sport_id="compute_sport_id(item.mif)" :status="current_choose_tab == item.mi"  size="24px" class="icon" />
              <div class="filter-count">{{ item.ct || 0 }}</div>
            </div>
            <div :class="{ checked_text: current_choose_tab == item.mi }" class="label-text">
              {{ BaseData.menus_i18n_map[item.mif] || "" }}
            </div>
          </div>
          <img class="current-mark" :class="{ 'show-mark': current_choose_tab == item.mi }" src="../../../assets/images/mask_group.png" alt="">
        </div>
        <div class="filter-tab-split-line"></div>
      </div> -->
       <!-- vr -->
       <!-- <div
        class="current-filter-tab"
        v-for="(item, index) in vr_menu_data" :key="index"
      >
        <div class="filter-label" @click="choose_filter_tab(item, '300')" :class="{ checked: current_choose_tab == item.mi }">
          <div class="filter-tab-item">
            <div class="filter-icon">
              <sport_icon :sport_id="compute_sport_id(item.mif)" :status="current_choose_tab == item.mif"  size="24px" class="icon" />
              <div class="filter-count">{{ item.count || 0 }}</div>
            </div>
            <div :class="{ checked_text: current_choose_tab == item.mif }" class="label-text">
              {{ item.name || "" }}
            </div>
          </div>
          <img class="current-mark" :class="{ 'show-mark': current_choose_tab == item.mif }" src="../../../assets/images/mask_group.png" alt="">
        </div>
        <div class="filter-tab-split-line" v-show="index != vr_menu_data.length - 1"></div>
      </div> -->

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
import sport_icon from "src/base-pc/components/sport_icon.vue";
import BaseData from "src/core/base-data/base-data.js";
import { mi_100_arr,mi_2000_arr,handle_click_menu_mi_1 } from "src/base-pc/components/match-list/list-filter/index.js"
import { MenuData } from "src/core/"
import { compute_sport_id } from 'src/core/constant/index.js'

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


// const top_events = ref([ 101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115,114, 104, 106, 118, 400, 300,]);

onMounted(() => {
  area_obj = document.querySelector('.current-filter-list');
  area_obj_wrap = document.querySelector('.current-filter-wrap');
  if (area_obj?.scrollWidth >= area_obj_wrap?.clientWidth) {
    show_right_btn.value = true;
  }
 

  //判断接口是否正常返回数据
  const { current_mi } = MenuData.mid_menu_result

  console.error('current_mi',current_mi)
  if (current_mi) {
    // 默认选中当前第一个tab
    current_choose_tab.value = current_mi
  } else {
    // 默认选中当前第一个tab
    current_choose_tab.value = 1011
    handle_click_menu_mi_1({mi:1011,mif:101})
    return
  }

  handle_click_menu_mi_1({mi: current_mi ,mif: current_mi+''.substring(0,3) })
})
/**
 * 
 * @param {Number} item.mi
 * @description 过滤mi<300
 */

const filter_min_mi_300 = (originalArray)=>{
  return originalArray.filter(item => parseInt(item.mi) < 300&&item.ct>0);
}

/**
 * 
 * @param {Number} item.mi
 * @description 过滤ct=0的列表数据
 */

 const filter_ct_list = (originalArray)=>{
  return originalArray.filter(item => item.ct>0);
}
/**
 * 
 * @param {Number} item.mif 
 * @description 当前选择的tab高亮 通过id属性映射
 */

 
const choose_filter_tab = (item) => {
  current_choose_tab.value = item.mi;
  // 获取最新的 数据
  handle_click_menu_mi_1(item)
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
  background: var(--q-gb-bg-c-4);
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
      background: var(--q-gb-t-c-2);
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
    color: var(--q-gb-t-c-1);
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
  background: var(--q-gb-bg-c-4);
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
