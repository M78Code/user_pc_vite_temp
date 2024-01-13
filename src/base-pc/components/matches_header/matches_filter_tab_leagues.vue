<template>
  <div class="current-filter-wrap" ref="area_obj_wrap">
    <div class="current-filter-list" @scroll="on_scroll" ref="area_obj">
      <!-- 常规体育 -->
      <template v-for="(item, index) in leagues" :key="index">
        <div class="current-filter-tab">
          <div class="filter-label" @click="choose_filter_tab(item)" :class="{ checked:  select_id == item.id }">
            <div class="filter-tab-item">
              <div :class="{ checked_text: select_id == item.id }" class="label-text">
                {{ item.introduction }}
              </div>
            </div>
            <div class="current-mark" :class="{'show-mark':  select_id == item.id}"></div>
          </div>
          <div class="filter-tab-split-line" v-show="index != leagues.length - 1"></div>
        </div>
      </template>
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
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { get_ouzhou_leagues_data, un_mounted } from "src/base-pc/components/match-list/list-filter/index.js"
import MatchLeagueData from 'src/core/match-list-pc/match-league-data.js'
import { compute_img_url } from 'src/core/server-img/index.js'
import { useMittOn,MITT_TYPES } from 'src/output/index.js';


let area_obj = ref();
let area_obj_wrap = ref();
let for_count
// 滚动定时器
let interval_id = null;

// 是否显示左边按钮
const show_left_btn = ref(false);
// 是否显示右边按钮
const show_right_btn = ref(false);

//leagues
const leagues = ref([])

const select_id = ref(null)

const props = defineProps({
  date: Number,
});


async function get_list () {
  choose_filter_tab([])
  const list = await get_ouzhou_leagues_data(props.date)
  localStorage.setItem('league_hours', props.date)
  leagues.value = list
  if (list?.length) {
    select_id.value = list[0].id
    choose_filter_tab(list[0])
  }
  nextTick(() => {
    if (area_obj.value?.scrollWidth > area_obj_wrap.value?.clientWidth) {
      show_right_btn.value = true;
    } else {
      show_right_btn.value = false;
    }
  })
}

const off= useMittOn(MITT_TYPES.EMIT_LANG_CHANGE,get_list).off
watch(() => props.date, async () => {
  get_list()
}, { immediate: true })

onMounted(() => {
  // if (area_obj.value?.scrollWidth > area_obj_wrap.value?.clientWidth) {
  //   show_right_btn.value = true;
  // }
})
/**
 * 
 * @param {Number} item.mif 
 * @description 当前选择的tab高亮 通过id属性映射
 */
function choose_filter_tab(item) {
  MatchLeagueData.set_league_obj(item)
  // 获取最新的 数据
  select_id.value = item.id
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

onUnmounted(() => {
  clearInterval(interval_id);
  interval_id = null;
  off()
  un_mounted()
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
  height: 44px;
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
</style>