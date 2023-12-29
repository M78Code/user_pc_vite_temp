<!--
 * @Description: 骨骼
-->
<template>
  <div class="skeleton" :style="skeleton_style" :class="`radius_${radius}`"></div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  width: [Boolean, Number],
  height: [Boolean, Number],
  radius: [Boolean, Number],
})

const skeleton_style = computed(() => {
  return {
    width: props.width ? `${props.width}rem` : '100%',
    height: `${props.height}rem`
  }
})

</script>

<style lang="scss" scoped>
.skeleton {
  animation: skeletonLoading 2s ease-out infinite;
  -webkit-animation: skeletonLoading 2s ease-out infinite;
  background-size: 400% 100%;
  background-image: var(--q-gb-bg-lg-29);

  &.radius_50 {
    border-radius: 50%;
  }

  &.radius_2 {
    border-radius: 0.02rem;
  }

  &.radius_4 {
    border-radius: 0.04rem;
  }

  &.radius_5 {
    border-radius: 0.05rem;
  }

  &.radius_6 {
    border-radius: 0.065rem;
  }

  &.radius_8 {
    border-radius: 0.08rem;
  }

  &.radius_10 {
    border-radius: 0.1rem;
  }

  &.radius_12_5 {
    border-radius: 0.125rem;
  }

  &.radius_20 {
    border-radius: 0.2rem;
  }
}

@keyframes skeletonLoading {
  0% {
    background-position: 100% 50%;
  }

  to {
    background-position: 0 50%;
  }
}
</style>
