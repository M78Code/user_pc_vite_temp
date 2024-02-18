<template>
  <div v-show="false"> {{ MenuData.menu_data_version }} {{ MenuData.mid_menu_result.md }}</div>
  <div class="current-filter-wrap">
    <div class="current-filter-list" @scroll="on_scroll">
      <div class="current-filter-tab" v-for="(item, index) in current_filter_list" :key="index">
        <div class="filter-label" @click="choose_filter_tab(item, index)" :class="{ 'checked': MenuData.mid_menu_result.md == item.label && mid_index == index }">
          {{item.name}}
          <!-- {{ i18n_t(item.value, {month: i18n_t(`ouzhou.time.month_` + item.month), day: item.day}) }} -->
          <div class="current-mark" :class="{'show-mark':  MenuData.mid_menu_result.md == item.label && mid_index == index }"></div>
        
        </div>
        <div class="filter-tab-split-line" v-show="index != current_filter_list.length - 1"></div>
      </div>
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
  import { ref,onMounted,onUnmounted, watch } from 'vue';
  import { MenuData, useMittOn,MITT_TYPES } from 'src/output/index.js'
  import { get_data_menu_result,handle_click_menu_mi_3_date } from "src/base-pc/components/tab/date-tab/index.js"
  import { compute_img_url } from 'src/core/server-img/index.js'
  import lodash_ from "lodash"
  // import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
    // 是否显示左边按钮
  const show_left_btn = ref(false);
  // 是否显示右边按钮
  const show_right_btn = ref(false);

  const current_filter_list = ref([])

  let area_obj = null;
  let area_obj_wrap = null;
  let mitt_list = null;//监听菜单变化
  let mid_index = ref(0)
  let time = ''
  onMounted(()=>{
    update_time()
    area_obj = document.querySelector('.current-filter-list');
    area_obj_wrap = document.querySelector('.current-filter-wrap');
    if (area_obj?.scrollWidth >= area_obj_wrap?.clientWidth) {
      show_right_btn.value = true;
    }
    // time = LocalStorage.get('server_time') || new Date().getTime()
    mitt_list = [ 
      useMittOn(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE,update_time).off,
      useMittOn(MITT_TYPES.EMIT_LANG_CHANGE,update_time).off ]
  })
  onUnmounted(()=>{
    mitt_list.forEach(item => item());
  })
  /**
   * 获取日期
   */
  const dateWeekFormat = async () =>{
    const res = await get_data_menu_result();
    if(!res || !res?.length)return [];
    if(MenuData.is_esports()){
      return res.map(item=>{
        return {
          name: item.menuName,
          label: item.md,
        }
      })
    }else{
      return res?.filter((n)=>{return !!n.md}).map((item)=>{
        return {
          name: item.menuName,
          label: item.md,
          type: 3
        }
      })
    }
  }
  /**
   * 一周时间
   * @param {*} day 
   * @returns 
   */
  // const dateWeekFormat = (day) => {
  //   let result = [];
  //   Date.prototype.getMonthDay = function (i) {
  //       let date_time = new Date(this.setHours(12, 0, 0, 0))
  //       let month = date_time.getMonth() + 1;
  //       let day = date_time.getDate();
  //       return {
  //         label: date_time.getTime(),
  //         value: i == 0 ? 'ouzhou.match.tomorrow' : 'ouzhou.time.date',
  //         type: 3,
  //         month: month,
  //         day: day
  //       };
  //   }
   
  //   for (let i = 0; i < 6; i++) {
  //       day.setDate(day.getDate() + 1);
  //       result.push(day.getMonthDay(i))
  //   }
  //   return result;
  // };

  const update_time = async (time) => {
    mid_index.value = 0
    if(MenuData.is_left_today() || MenuData.is_left_zaopan() || MenuData.is_esports()){
      let arr = [{label:'',name: i18n_t('ouzhou.match.today'),type:2}]
      // 电子赛事 没有早盘日期
      if(!MenuData.is_electron_match() && !MenuData.is_esports()){
        const week = await dateWeekFormat();
        arr = [...[{label:'',name: i18n_t('ouzhou.match.today'),type:2}],...week];
      }

      // 电子竞技
      if(MenuData.is_esports()){
        const week = await dateWeekFormat();
        // let week_lsit = week.filter(item => item.label != 0)
        arr = week
      }
     
      current_filter_list.value = arr;
      let obj = {
        label: MenuData.mid_menu_result.md,
        type: MenuData.menu_root == 202 ? 2 : 3
      }
     
      handle_click_menu_mi_3_date(obj)
    }
  }

  // watch(
  //   () => window.vue.lang,
  //   () => {
  //     update_time()
  //   }
  // )
 
 const choose_filter_tab = (item ,index) => {
  mid_index.value = index
  handle_click_menu_mi_3_date(item)
 }


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

</script>

<style lang="scss" scoped>

  .current-filter-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    height: 44px;
    background: var(--q-gb-bg-c-4);
    padding: 0px 18.25px;
    position: relative;
  }
  .current-filter-list {
    display: flex;
    align-items: center;
    width: 100%;
    background: var(--q-gb-bg-c-4);
    box-sizing: border-box;
    overflow-x: auto;
    flex-wrap: nowrap;
    white-space: nowrap;
    height: 100%;
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
    color: var(--q-gb-t-c-8);
  }

  .checked {
    color: var(--q-gb-t-c-5);
    font-weight: 500;
    font-size: 13px;
  }

  .filter-tab-split-line {
    width: 1px;
    height: 12px;
    background: var(--q-gb-bg-c-10);
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
    background: var(--q-gb-bg-c-1);
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
      background: var(--q-gb-bg-lg-12);
      opacity: 0.1;
    }
  }
  .prev-btn, .next-btn {
    background: var(--q-gb-bg-c-4);
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
</style>src/core/utils/common/module/web-storage.js