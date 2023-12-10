<template>
    <div class="current-filter-wrap" ref="area_obj_wrap">
      <div class="current-filter-list" @scroll="on_scroll" ref="area_obj">
        <!-- 常规体育 -->
        <div v-for="(item, index) in sports_list" :key="item.id" @click.stop="change_tabs(index)"
            :class="['tab', sports_tab_index === index ? 'active' : '']">
            {{ item.sportName }}
        </div>
      </div>
      <div class="prev-btn-box" v-show="show_left_btn" @click.stop="filter_tab_scroll('prev')">
        <div class="prev-btn">
            <div class="yb-icon-arrow"></div>
        </div>
        <div class="shadow-box"></div>
      </div>
      <div class="next-btn-box" v-show="show_right_btn" @click.stop="filter_tab_scroll('next')">
        <div class="shadow-box"></div>
        <div class="next-btn">
            <div class="yb-icon-arrow"></div>
        </div>
      </div>
    </div>
    
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
  
  let area_obj = ref();
  let area_obj_wrap = ref();
  let for_count
  // 滚动定时器
  let interval_id = null;
  
  // 是否显示左边按钮
  const show_left_btn = ref(false);
  // 是否显示右边按钮
  const show_right_btn = ref(false);
  
  
  const props = defineProps({
    sports_list: {
        type: Array,
        default: () => []
    },
    sports_tab_index: {
        type: Number,
        default: 0
    }
  });

  /**
   * tabs点击事件
   */
  const emit = defineEmits(["change_tabs"]);
  const change_tabs = (index) => {
    emit('change_tabs', index)
  }
    
  onMounted(() => {
    nextTick(() => {
      if (area_obj.value?.scrollWidth > area_obj_wrap.value?.clientWidth) {
        show_right_btn.value = true;
      } else {
        show_right_btn.value = false;
      }
    })
  })
  
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
  

  .tab {
		background-color: var(--q-gb-bg-c-4);
		border-radius: 40px;
		text-align: center;
		font-size: 14px;
		flex-shrink: 0;
		padding: 6px 16px;
    cursor: pointer;
    margin-right: 10px;

		&:last-child {
			margin-right: 0;
		}

		&.active {
			background-color: var(--q-gb-bg-c-1);
			color: var(--q-gb-t-c-1);
		}

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
  }
  .prev-btn-box {
    left: 0;
    .prev-btn {
      .yb-icon-arrow {
        transform: rotate(180deg);
      }
    }
  }
  .next-btn-box {
    right: 0;
  }
  </style>