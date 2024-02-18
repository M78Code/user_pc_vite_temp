<!--
 * @Description: 单独处理二级菜单,全部菜单
-->
<template>
  <div class="component sport-menu-item flex justify-center" ref="scrollItem" @click.capture="emits('click')">
    <div class="inner-w flex justify-between items-center" :class="{ favorite: show_favorite_list }">
      <div></div>
      <div class="sport-w-icon">
        <slot></slot>
        <div class="sport-match-count" v-show="menu_type != 900">{{ show_favorite_list ? '' : count ? count : 0 }}</div>
      </div>
      <div class="s-w-i-title">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { UserCtr, MenuData, useMittOn, MITT_TYPES } from "src/output/index.js"
const { menu_type } = MenuData;
// TODO: 后续修改调整
const props = defineProps({
  count: {
    type: Number,
  },
  title: {
    type: String,
  }
})
const emits = defineEmits(['click'])
const show_favorite_list = ref(UserCtr.show_favorite_list)
const mitt_list = [
  useMittOn(MITT_TYPES.EMIT_FAVORITE_CHANGE_CMD, (v, old) => {
    show_favorite_list.value = v
  }).off
]
onBeforeUnmount(() => {
  mitt_list.forEach(i => i())
})
</script>
<style scoped lang="scss">
.sport-menu-item {
  width: .7rem;
  height: 100%;
  flex-shrink: 0;

  .inner-w {
    height: .41rem;
    flex-direction: column;
    flex-wrap: nowrap;
    position: relative;

    .sport-w-icon {
      width: auto;
      height: .27rem;
      border-radius: 50%;

      position relative svg {
        width: .22rem;
        height: .22rem;
      }

      img {
        width: auto;
        height: .22rem;
      }

      .sport-match-count {
        width: 1px;
        height: 1px;
        line-height: 1;
        position: absolute;
        right: -.03rem;
        top: 0;
        font-size: .11rem;
      }
    }

    .s-w-i-title {
      max-width: .8rem;
      font-size: 0.1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      top: -.01rem;
    }
  }
}
</style>