<template>
  <div class="slider-x" ref="slider_x" v-show="slider_list&&slider_list.length">
    <div
      ref="item_wrapper"
      class="item-wrapper"
      :class="{
        'active': i == item_index,
        'bg-default': backgroundImage && !item[image_key]
      }"
      v-for="(item, i) in slider_list"
      :key="i"
      @click="handle_item_click(item, i)"
      :style="backgroundImage && item[image_key] ? {background: `url(${item[image_key]}) no-repeat center / cover`} : {}"
    >
      <img v-if="backgroundImage && item[image_key]" :src="backgroundImage && item[image_key] ? item[image_key] : ''" hidden @error="handle_img_load_error($event, i)" />
      <slot v-bind:item="item"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
  const props = defineProps({
    slider_list: {
      type: Array,
      default: () => ([])
    },
    backgroundImage: {
      type: Boolean,
      default: false
    },
    image_key: {
      type: String,
    }
  })
  let item_index = ref(0)
  let item_wrapper = ref(null)
  const handle_item_click = (item, index) => {
    item_index.value = index
    // TODO: emit后续修改调整
    // emit('click', {item, index})
  }
  const handle_img_load_error = (e, index) => {
    item_wrapper.value[index].classList.add('bg-default')
    e.target.onerror = null
  }

</script>

<style scoped lang="scss">
.slider-x {
  display: flex;
  .item-wrapper {
    display: flex;
    &.active {
      border: 1px solid var(--q-match-fs-color-135);
    }
    &.bg-default {
      background: var(--q-color-com-bg-color-34) !important;
    }
  }
}
</style>