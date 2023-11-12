<template>
  <div class="current-filter-wrap">
    <div class="current-filter-list" @scroll="on_scroll">
      <!-- 常规体育 -->
      <div
        class="current-filter-tab"
        v-for="(item, index) in mi_100_arr" :key="index"
      >
        <div class="filter-label" @click="choose_filter_tab(item, '1')" :class="{ checked: current_choose_tab == item.mi }">
          <div class="filter-tab-item">
            <div class="filter-icon">
              <sport_icon :sport_id="compute_sport_id(item.mif)" :status="current_choose_tab == item.mif"  size="24px" class="icon" />
              <div class="filter-count">{{ item.ct || 0 }}</div>
            </div>
            <div :class="{ checked_text: current_choose_tab == item.mif }" class="label-text">
              {{ menus_i18n_map[item.mif] || "" }}
            </div>
          </div>
          <img class="current-mark" :class="{ 'show-mark': current_choose_tab == item.mif }" src="../../../assets/images/mask_group.png" alt="">
        </div>
        <div class="filter-tab-split-line"></div>
      </div>
      <!-- 电竞 -->
      <div
        class="current-filter-tab"
        v-for="(item, index) in mi_2000_arr" :key="index"
      >
        <div class="filter-label" @click="choose_filter_tab(item, '2000')" :class="{ checked: current_choose_tab == item.mi }">
          <div class="filter-tab-item">
            <div class="filter-icon">
              <sport_icon :sport_id="compute_sport_id(item.mif)" :status="current_choose_tab == item.mif"  size="24px" class="icon" />
              <div class="filter-count">{{ item.ct || 0 }}</div>
            </div>
            <div :class="{ checked_text: current_choose_tab == item.mif }" class="label-text">
              {{ menus_i18n_map[item.mif] || "" }}
            </div>
          </div>
          <img class="current-mark" :class="{ 'show-mark': current_choose_tab == item.mif }" src="../../../assets/images/mask_group.png" alt="">
        </div>
        <div class="filter-tab-split-line"></div>
      </div>
       <!-- vr -->
       <div
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
import { use_base_data } from "src/base-pc/components/menus/base_data";
import _ from "lodash"
import menu_i18n_default from "src/core/base-data/config/menu-i18n.json";
import BaseData from "src/core/base-data/base-data.js";
import { compute_css_obj } from "src/core/server-img/index.js";
import SportsDataClass from "src/base-pc/components/match-list/list-filter/sports-data-class.js"

const { compute_sport_id,mi_euid_map_res } = use_base_data()


// 国际化
// const { data:menus_i18n_map } = useMenuI18n()

// const top_events = ref(MatchListOuzhouClass.redux_menu.in_play)

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
//常规体育
const mi_100_arr = ref([]);
//电竞
const mi_2000_arr = ref([]);
// vr
const vr_menu_data = ref([]);

// 菜单多语言
const menus_i18n_map = ref(menu_i18n_default.data)

// const top_events = ref([ 101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115,114, 104, 106, 118, 400, 300,]);

onMounted(() => {
  area_obj = document.querySelector('.current-filter-list');
  area_obj_wrap = document.querySelector('.current-filter-wrap');
  if (area_obj?.scrollWidth >= area_obj_wrap?.clientWidth) {
    show_right_btn.value = true;
  }
  // top_events.value = MatchListOuzhouClass.redux_menu.in_play;
  // current_choose_tab.value = MatchListOuzhouClass.redux_menu.mid_tab_menu_type;
  let { mi_100_list, mi_2000_list, vr_menu_obj } = SportsDataClass.resolve_mew_menu_res_mi_100_2000()
  console.log(mi_100_list,mi_2000_list, vr_menu_obj )
  //常规体育
  mi_100_arr.value = mi_100_list;
  // 默认选中当前第一个tab
  current_choose_tab.value = mi_100_list.length ? mi_100_list[0].mif : 101
  //电竞
  mi_2000_arr.value = mi_2000_list;
  //vr
  vr_menu_data.value = vr_menu_obj
  
})

/**
 * 
 * @param {Number} item.mif 
 * @description 当前选择的tab高亮 通过id属性映射
 */

 
const choose_filter_tab = (item, root) => {
  current_choose_tab.value = item.mif || item.menuId;
  // 获取最新的 数据
  let redux_menu = _.cloneDeep(MatchListOuzhouClass.redux_menu) 
  // 修改菜单数据  header tab切换对应的 
  redux_menu.mid_tab_menu_type = item.mif || item.menuId
  // 存储
  MatchListOuzhouClass.set_menu(redux_menu)
  // 中间导航菜单设置
  if (root === "1") {
    SportsDataClass.handle_click_menu_mi_1({
      mi: item.mi,
      root: '1',
      mif: item.mif,
      sports: 'common',
      guanjun: '',
    })
  } else if (root === "2000") {
    SportsDataClass.handle_click_menu_mi_1({
      mi: item.mi,
      mif: item.mif,
      root: '2000',
      sports: 'dianjing',
      guanjun: '',
    })
  } else {
    SportsDataClass.handle_click_menu_mi_1({
      mi: item.menuId,
      menu: item.mi,
      root: '300',
      sports: 'vr',
      guanjun: '',
    })
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
