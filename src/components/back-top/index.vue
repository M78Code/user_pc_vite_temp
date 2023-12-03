<!--
 * @Description: 返回顶部组件
 * scrollEle 是滚动的HTML元素，可以传HTMLElement对象，或window。
 * onClick 是点击按钮的回调，如果在这里执行了滚动操作，则不要传scrollEle
-->
<template>
  <div class="back-top">
    <div class="btn-back" @click="backTop">
      <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/t-arrow.svg`">
      <span class="txt">{{i18n_t("common.back_top") || ""}}</span>
    </div>
  </div>
</template>

<script setup>
import { i18n_t } from "src/core/index.js"
import { LOCAL_PROJECT_FILE_PREFIX } from "src/core/index.js";

const props = defineProps({
  scrollEle: {
    type: Element,
    default: undefined
  },
  onClick: {
    type: Function,
    default: undefined
  }
})

const backTop = () => {
  if (props.onClick) {
    props.onClick()
  }
  if (props.scrollEle && props.scrollEle.scrollTo) {
    props.scrollEle.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

</script>

<style lang="scss" scoped>
.back-top{
  padding-top: 19px;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  .btn-back{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 108px;
    height: 36px;
    padding: 10px 0;
    border-radius: 100px;
    cursor: pointer;
    background: #FFF;
    img{
      margin-right: 4px;
    }
    .txt{
      color: #8A8986;
      text-align: right;
      font-size: 12px;
      font-weight: 400;
    }
  }
}
</style>
