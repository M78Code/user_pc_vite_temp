<!--
 * @Author:
 * @Date:
 * @Description: 加载中
-->
<template>
  <div class="loading" :style="`top:${top}`">
    <div class="la-line-scale" >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    top: {
      type: String,
      default: () => '46%',
    },
  })
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 7500;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  background-color: transparent;
}
.la-line-scale,
.la-line-scale > div {
  position: relative;
  // @include webkit(box-sizing, border-box);
}
.la-line-scale {
  display: block;
  font-size: 0;
  color:  var(--q-gb-t-c-1);
}
.la-line-scale > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}
.la-line-scale {
  width: 40px;
  height: 32px;
}



.la-line-scale > div {
  width: 4px;
  height: 32px;
  margin: 2px;
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 0;
  // @include webkit(animation, line-scale 1.2s infinite ease);
}

// @for $item from 1 through 5 {
//   .la-line-scale > div:nth-child(#{$item}) {
//     // @include webkit(animation-delay, #{-1.3 + $item * 0.1}s)
//   }
// }

.la-line-scale.la-sm {
  width: 20px;
  height: 16px;
}
.la-line-scale.la-sm > div {
  width: 2px;
  height: 16px;
  margin: 1px;
  margin-top: 0;
  margin-bottom: 0;
}
.la-line-scale.la-2x {
  width: 80px;
  height: 64px;
}
.la-line-scale.la-2x > div {
  width: 8px;
  height: 64px;
  margin: 4px;
  margin-top: 0;
  margin-bottom: 0;
}
.la-line-scale.la-3x {
  width: 120px;
  height: 96px;
}
.la-line-scale.la-3x > div {
  width: 12px;
  height: 96px;
  margin: 6px;
  margin-top: 0;
  margin-bottom: 0;
}

/*
 * Animation
 */
// @include keyframes(line-scale) {
//   0%,
//   40%,
//   100% {
//     @include webkit(transform, scaleY(0.4));
//   }
//   20% {
//     @include webkit(transform, scaleY(1));
//   }
// }
</style>
