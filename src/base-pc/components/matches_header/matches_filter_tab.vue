<template>
  <div class="current-filter-wrap">
    <div class="current-filter-list" @scroll="on_scroll">
      <div class="current-filter-tab" v-for="(item, index) in current_filter_list" :key="item.value">
        <div class="filter-label" @click="choose_filter_tab(item)" :class="{ 'checked': current_choose_tab == item.value }">
          {{ item.label }}
          <div class="current-mark" :class="{'show-mark': current_choose_tab == item.value}"></div>
        </div>
        <div class="filter-tab-split-line" v-show="index != current_filter_list.length - 1"></div>
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
  import { ref,onMounted,onUnmounted, watch } from 'vue';
  import _ from "lodash"
  import MatchListOuzhouClass from 'src/core/match-list-pc/match-ouzhou-list.js'
  import BaseData from "src/core/base-data/base-data.js";
  import { UserCtr,MenuData } from 'src/core/index.js'
  import { api_common } from "src/api/index.js";
  import {
    handle_click_menu_mi_3_date,
    get_date_menu_matches_list,
    current_filter_list
  } from "src/base-pc/components/tab/date-tab/index.js"

  const current_choose_tab = ref('');

    // 是否显示左边按钮
  const show_left_btn = ref(false);
  // 是否显示右边按钮
  const show_right_btn = ref(false);
  let area_obj = null;
  let area_obj_wrap = null;
  // 滚动定时器
  let interval_id = null;

  onMounted(()=>{
    area_obj = document.querySelector('.current-filter-list');
    area_obj_wrap = document.querySelector('.current-filter-wrap');
    if (area_obj?.scrollWidth >= area_obj_wrap?.clientWidth) {
      show_right_btn.value = true;
    }
    // 获取最新的 数据
    let redux_menu = _.cloneDeep(MatchListOuzhouClass.redux_menu) 
    // 修改菜单数据
    //redux_menu.mid_tab_menu_type = ''
    MatchListOuzhouClass.set_menu(redux_menu)
    get_date_menu_matches_list()

  })
 
 const menu_id = ref(0)

  // 监听 tab切换变化
let un_subscribe = () => {
  const { menu_id_euid_ealy,mid_tab_menu_type,menu_root,menu_left } = MatchListOuzhouClass.redux_menu

  // 切换赛种后 初始化
  if(!mid_tab_menu_type){
    current_choose_tab.value = ''
  }
  // 左侧菜单切换 并且 赛种id不能相同
  if( menu_root == 4 && (menu_id.value != menu_left )){
    menu_id.value = menu_left
  }

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
  let for_count = 0
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

watch(MenuData.menu_data_version,()=>{
  get_date_menu_matches_list()
})
  /**
   * @param
   */
  const choose_filter_tab = item => {
    // 获取最新的 数据
    let redux_menu = _.cloneDeep(MatchListOuzhouClass.redux_menu) 
    // 修改菜单数据
    redux_menu.mid_tab_menu_type = item.value

    MatchListOuzhouClass.set_menu(redux_menu)

    current_choose_tab.value = item.value

    handle_click_menu_mi_3_date(item)
  }

  onUnmounted(()=>{
    un_subscribe()
    clearInterval(interval_id);
    interval_id = null;
  })

</script>

<style lang="scss" scoped>

  .current-filter-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    height: 44px;
    background: #FFFFFF;
    padding: 0px 18.25px;
    position: relative;
  }
  .current-filter-list {
    display: flex;
    align-items: center;
    width: 100%;
    background: #FFFFFF;
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
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .filter-label {
    display: flex;
    height: 100%;
    position: relative;
    align-items: center;
    font-size: 13px;
    color: #8A8986;
  }

  .checked {
    color: #1A1A1A;
    font-weight: 500;
    font-size: 13px;
  }

  .filter-tab-split-line {
    width: 1px;
    height: 12px;
    background: #D9D9D9;
    margin: 0 16px;
  }

  .current-mark {
    width: 8px;
    height: 8px;
    // border-radius: 4px 4px 0 0;
    position: absolute;
    bottom: 0px;
    left: 50%;
    display: none;
    margin-left: -4px;
    background: #FF7000;
    clip-path: circle(50% at 50% 100%);
  }
  .prev-btn-box, .next-btn-box {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    .shadow-box {
      width: 10px;
      height: 44px;
      background: linear-gradient(270deg, #D9D9D9 0%, rgba(217, 217, 217, 0) 100%);
      opacity: 0.1;
    }
  }
  .prev-btn, .next-btn {
    background: #FFFFFF;
    width: 16px;
    height: 44px;
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
  .show-mark {
    display: block;
  }
</style>