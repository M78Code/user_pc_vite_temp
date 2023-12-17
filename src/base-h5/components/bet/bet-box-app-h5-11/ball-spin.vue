<!--
 * @Author: Router
 * @Description: 圆形loading  外形大小用 la-sm 来调整
-->
<template>
  <!-- 旋转loading -->
  <div class="ball-spin la-ball-spin-clockwise la-sm">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script setup>


</script>
<style lang="scss" scoped>
.la-ball-spin-clockwise,
.la-ball-spin-clockwise > div {
  position: relative;
  pointer-events: none;
  // @include webkit(box-sizing, border-box);
}
.la-ball-spin-clockwise {
  display: block;
  font-size: 0;
  color: #fff;
}
.la-ball-spin-clockwise > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}
.la-ball-spin-clockwise {
  width: 32px;
  height: 32px;
}

.la-ball-spin-clockwise > div {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  margin-top: -4px;
  margin-left: -4px;
  border-radius: 100%;
  // @include webkit(animation, ball-spin-clockwise 1s infinite ease-in-out);
}
.la-ball-spin-clockwise > div:nth-child(1) {
  top: 5%;
  left: 50%;
  // @include webkit(animation-delay, -0.875s);
}
.la-ball-spin-clockwise > div:nth-child(2) {
  top: 18.1801948466%;
  left: 81.8198051534%;
  // @include webkit(animation-delay, -0.75s);
}
.la-ball-spin-clockwise > div:nth-child(3) {
  top: 50%;
  left: 95%;
  // @include webkit(animation-delay, -0.625s);
}
.la-ball-spin-clockwise > div:nth-child(4) {
  top: 81.8198051534%;
  left: 81.8198051534%;
  // @include webkit(animation-delay, -0.5s);
}
.la-ball-spin-clockwise > div:nth-child(5) {
  top: 94.9999999966%;
  left: 50.0000000005%;
  // @include webkit(animation-delay, -0.375s);
}
.la-ball-spin-clockwise > div:nth-child(6) {
  top: 81.8198046966%;
  left: 18.1801949248%;
  // @include webkit(animation-delay, -0.25s);
}
.la-ball-spin-clockwise > div:nth-child(7) {
  top: 49.9999750815%;
  left: 5.0000051215%;
  // @include webkit(animation-delay, -0.125s);
}
.la-ball-spin-clockwise > div:nth-child(8) {
  top: 18.179464974%;
  left: 18.1803700518%;
  // @include webkit(animation-delay, 0s);
}
.la-ball-spin-clockwise.la-sm {
  width: 16px;
  height: 16px;
}
.la-ball-spin-clockwise.la-sm > div {
  width: 4px;
  height: 4px;
  margin-top: -2px;
  margin-left: -2px;
}
/*
 * Animation
 */
// @include keyframes(ball-spin-clockwise) {
//   0%,
//   100% {
//     opacity: 1;
//     @include webkit(transform, scale(1));
//   }
//   20% {
//     opacity: 1;
//   }
//   80% {
//     opacity: 0;
//     @include webkit(transform, scale(0));
//   }
// }
</style>
