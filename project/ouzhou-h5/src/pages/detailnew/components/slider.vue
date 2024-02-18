<template>
    <div class="slider" ref="slider" @touchstart="handel_click" :style="{
      width: `${props.width}px`,
    }">
      <div class="progress" :style="{
          width: `${(volumn + start_percentage) * 100}%`
      }"></div>
      <div class="start" ref="start" 
           :style="{
              left: `${volumn * 100}%`
           }"
           @touchstart="handle_start" @touchmove="handle_move" @touchend="handle_end">
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, nextTick, onMounted, ref, watch } from 'vue';
  const props = defineProps({
      width: {
          type: Number,
          default: 200
      },
  })
  /** 回传进度小数 */
  const emits = defineEmits(['change'])
  /** @type {import('vue').Ref<HTMLElement|null>} */
  const start = ref(null); // 移动节点
  /** @type {import('vue').Ref<HTMLElement|null>} */
  const slider = ref(null); // 整体节点
  const slider_size = ref({
      width: 0,
      height: 0
  })
  const start_size = ref({
      width: 0,
      height: 0
  })
  const left = ref(0);
  const is_start = ref(false);
  
  const volumn = computed(() => left.value / slider_size.value.width);
  
  const start_percentage = computed(() => start_size.value.width / slider_size.value.width / 2)
  
  watch(volumn, (value) => {
      console.log(value, "value");
  })
  /**
   * 点击进度条
   * @param {TouchEvent} e 
   */
  const handel_click = (e) => {
      const { clientX } = e.touches[0];
      // 获取手指点击的距离
      const start_x = slider.value.getBoundingClientRect().x;
      console.log(start_x, clientX);
      left.value = clientX - start_x;
  }
  
  /**
   * 
   * @param {TouchEvent} e 
   */
  const handle_start = (e) => {
      const { clientX } = e.touches[0];
      // 获取手指点击的距离
      const start_x = start.value.getBoundingClientRect().left;
      console.log(start_x);
      left.value = clientX - start_x;
      is_start.value = true;
  }
  /**
   * 
   * @param {TouchEvent} e 
   */
  const handle_move = (e) => {
      const { clientX } = e.touches[0];
      
      // 计算距离
      const client_left = slider.value.getBoundingClientRect().left;
      // 计算边界
      const move_x = clientX - client_left 
      if (move_x <= slider_size.value.width - start_size.value.width&& move_x >= 0) {
          left.value = move_x;
      }
      console.log(left.value, "clientX");
  }
  
  const handle_end = () => {
      emits('change', volumn.value)
      is_start.value = false;
  }
  
  onMounted(() => {
      nextTick(() => {
          const {width, height } = slider.value.getBoundingClientRect();
          slider_size.value = {
              width: props.width || width,
              height
          }
          const start_size_value = start.value.getBoundingClientRect();
          start_size.value = {
              width: start_size_value.width,
              height: start_size_value.height
          }
      })
  })
  </script>
  
  <style lang="scss" scoped>
  .slider {
    width: 200px;
    height: 10px;
    border-radius: 10px;
    background-color: #e7e9e27e;
    position: relative;
  }
  .start {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #E7E9E2;
    top: -5px;
    z-index: 999;
  }
  
  .progress {
      background: #E7E9E2;
      height: 100%;
      border-radius: 10px;
  }
  </style>
  