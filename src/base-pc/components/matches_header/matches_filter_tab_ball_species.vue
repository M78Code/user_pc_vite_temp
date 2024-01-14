<template>
  <div class="current-filter-wrap" ref="area_obj_wrap">
    <div class="current-filter-list" @scroll="on_scroll" ref="area_obj">
      <div v-show="false">{{UserCtr.user_version}}-{{BaseData.base_data_version}}-{{MenuData.menu_data_version}}</div>
      <!-- 常规体育 -->
      <template v-for="(item, index) in MenuData.top_menu_list" :key="index">
        <div class="current-filter-tab" v-if="!MenuData.is_scroll_ball() || item.ct > 0 " >
          <div class="filter-label" @click="choose_filter_tab(item)" :class="{ checked:  MenuData.menu_current_mi == item.mi }">
            <div class="filter-tab-item">
              <div class="filter-icon">
                <sport-icon :sport_id="BaseData.compute_sport_id(MenuData.is_kemp()? item.mif : item.mif || item.mi)" :key_name="MenuData.menu_current_mi == item.mi ?'pc-left-menu-bg-active-image':'pc-left-menu-bg-image'"  size="22" class="icon" />
                <div class="filter-count" v-if="!MenuData.is_collect">{{ item.ct || 0 }}</div>
              </div>
              <div :class="{ checked_text: MenuData.menu_current_mi == item.mi }" class="label-text">
                {{  BaseData.menus_i18n_map[MenuData.is_kemp()? item.mi : item.mif||item.mi] || "" }}
              </div>
            </div>
            <!-- <img class="current-mark" :class="{ 'show-mark': MenuData.mid_menu_result.current_mi == item.mi }" :style="compute_css_obj({key: 'pc-home-mask-group'})" alt=""> -->
            <div class="current-mark" :class="{'show-mark':  MenuData.menu_current_mi == item.mi}"></div>
          </div>
          <div class="filter-tab-split-line" v-show="index != MenuData.top_menu_list.length - 1"></div>
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
          <img class="current-mark" :class="{ 'show-mark': current_choose_tab == item.mi }" :style="compute_css_obj({key: 'pc-home-mask-group'})" alt="">
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
          <img class="current-mark" :class="{ 'show-mark': current_choose_tab == item.mif }" :style="compute_css_obj({key: 'pc-home-mask-group'})" alt="">
        </div>
        <div class="filter-tab-split-line" v-show="index != vr_menu_data.length - 1"></div>
      </div> -->

    </div>
    <div class="prev-btn-box" v-show="show_left_btn" @click="filter_tab_scroll('prev')">
      <div class="prev-btn">
        <img :src="compute_img_url('pc-home-right-arrow')" alt="">
      </div>
      <div class="shadow-box"></div>
    </div>
    <div class="next-btn-box" v-show="show_right_btn" @click="filter_tab_scroll('next')">
      <div class="shadow-box"></div>
      <div class="next-btn">
        <img :src="compute_img_url('pc-home-right-arrow')" alt="">
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive, nextTick, watch } from "vue";
import sportIcon from "src/components/sport_icon/sport-icon.vue";
import BaseData from "src/core/base-data/base-data.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { mi_100_arr,mi_2000_arr,handle_click_menu_mi_1,handle_click_menu_mi_400,resolve_mew_menu_res, un_mounted } from "src/base-pc/components/match-list/list-filter/index.js"
import { MenuData ,useMittOn,MITT_TYPES, } from "src/output/index.js"
import { compute_img_url } from 'src/core/server-img/index.js'
import lodash_ from "lodash"
let area_obj = ref();
let area_obj_wrap = ref();
let for_count
// 滚动定时器
let interval_id = null;

// 是否显示左边按钮
const show_left_btn = ref(false);
// 是否显示右边按钮
const show_right_btn = ref(false);

const ref_data = reactive({
  emit_lsit:''
}) 

// const top_events = ref([ 101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115,114, 104, 106, 118, 400, 300,]);

onMounted(() => {
  //判断接口是否正常返回数据
  const { current_mi } = MenuData.mid_menu_result
  if (!current_mi) {
    // 默认选中当前第一个tab
    if(MenuData.is_kemp()){
      handle_click_menu_mi_400({mi:401,mif:101})
    }else{
      handle_click_menu_mi_1({mi:1011,mif:101})
      if(MenuData.is_scroll_ball()){
        resolve_mew_menu_res()
      }
    }
    return
  }
  if(MenuData.is_kemp()){
    handle_click_menu_mi_400({mi: current_mi ,mif: current_mi -300 })
  }else{
    handle_click_menu_mi_1({mi: current_mi ,mif: current_mi -100 })
  }

  ref_data.emit_lsit = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_SET_BESE_MENU_COUNT_CHANGE, set_ref_base_menu).off,
  }
  un_mounted()
})

watch(() => mi_100_arr.value , () => {
  nextTick(() => {
    if (area_obj.value?.scrollWidth > area_obj_wrap.value?.clientWidth) {
      show_right_btn.value = true;
    } else {
      show_right_btn.value = false;
    }
  })
})

// 菜单数量修改
const set_ref_base_menu = (list=[] ) => {
  // 欧洲版 滚球/冠军  不是收藏
  if((MenuData.is_scroll_ball() || MenuData.is_kemp()) && !MenuData.is_collect){
    let top_menu_list = lodash_.cloneDeep(MenuData.top_menu_list)
    list.forEach(item=>{
      top_menu_list.filter(obj=>{
        if(item.mi == obj.mi){
          obj.ct = item.count
        }
      })
    })

    MenuData.set_top_menu_list(top_menu_list)
  }
}
/**
 * 
 * @param {Number} item.mif 
 * @description 当前选择的tab高亮 通过id属性映射
 */

 
const choose_filter_tab = (item) => {
  // 获取最新的 数据
  const current_ball_type=BaseData.compute_sport_id(item.mif)
  if(MenuData.is_kemp()){
    handle_click_menu_mi_400(item)
    MenuData.set_current_ball_type(current_ball_type||(item.mif-400))
  }else{
    handle_click_menu_mi_1(item)
    MenuData.set_current_ball_type(current_ball_type)
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
  if((scrollLeft + 2) >= (area_obj.value.scrollWidth - area_obj.value.clientWidth)){
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
  let scrollLeft = area_obj.value.scrollLeft;
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
    area_obj.value.scrollLeft = scrollLeft;
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
  color: var(--q-gb-t-c-8);
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
    left: 23px;
    height: 16px;
    line-height: 16px;
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
  color: var(--q-gb-t-c-5);
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
  background: var(--q-gb-bg-c-10);
  margin: 0 16px;
  position: relative;
  top: 12px;
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
    background: var(--q-gb-bg-c-1);
    clip-path: circle(50% at 50% 100%);
  }
.show-mark {
  display: block;
}

.prev-btn-box, .next-btn-box {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 3;
  .shadow-box {
    width: 10px;
    height: 55px;
    background: var(--q-gb-bg-lg-12);
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