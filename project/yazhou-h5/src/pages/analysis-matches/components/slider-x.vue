<template>
  <div class="slider-x" ref="slider_x" v-show="slider_list&&slider_list.length">
    <div
      ref="item_wrapper"
      class="item-wrapper"
      :class="{
        'active': i === item_index,
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

<script>
export default {
  name: "slider_x",
  props: {
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
  },
  data() {
    return {
      item_index: 0
    }
  },
  methods: {
    handle_item_click(item, index) {
      this.item_index = index
      this.$emit('click', {item, index})
    },
    handle_img_load_error(e, index) {
      this.$refs.item_wrapper[index].classList.add('bg-default')
      e.target.onerror = null
    }
  }
}
</script>

<style scoped lang="scss">
.slider-x {
  display: flex;
  .item-wrapper {
    display: flex;
    &.active {
      border: 1px solid var(--q-color-border-color-3);
    }
    &.bg-default {
      background: var(--q-color-com-bg-color-34) !important;
    }
  }
}
</style>