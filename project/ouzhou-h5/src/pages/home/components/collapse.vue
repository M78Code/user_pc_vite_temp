
<!--
* @Author: Dolphin
* @Description: 折叠面板； 适应范围参考个人页语言设置、首页国家级赛事
-->
<template>
  <div class="collapse_page">
    <!-- 标题 -->
    <div class="title" @click="onExpend">
      <span class="left">
        <slot name="title_icon"></slot>
        <span>{{ title }}</span>
      </span>
      <slot name="title_right">
        <!-- <img :class="['arrow', { expend: visible }]" src="~assets/images/menu/arrow.png" alt="" /> -->
      </slot>
      <div class="line"></div>
    </div>
    <!-- 内容 -->
    <div class="content">
      <q-slide-transition>
        <div v-show="visible">
          <slot name="content"></slot>
        </div>
      </q-slide-transition>
    </div>
  </div>
</template>
 
<script setup>
import { onMounted, ref } from 'vue'
  const visible = ref(false)
  const emits = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => ''
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  })
  onMounted(() => {
    visible.value = props.modelValue
  })
  const onExpend = () => {
    if (props.disabled) return
    visible.value = !visible.value
    emits('update:modelValue', visible.value)
  }
</script>
  
<style scoped lang="scss">
  .title{
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    padding: 0 15px;
    position: relative;
    justify-content: space-between;
    .left{
      display: flex;
      align-items: baseline;
      span {
        width: 3rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .line{
      display: none;
      position: absolute;
      bottom: 0;
      left: 15px ;
      height: 1px;
      width: 340px;
      background: #F3F3F3;
    }
    .arrow{
      width: 18px;
      height: 18px;
      transition: transform 0.3s ease;
      &.expend{
        transform: rotate(90deg)
      }
    }
  }
</style>
