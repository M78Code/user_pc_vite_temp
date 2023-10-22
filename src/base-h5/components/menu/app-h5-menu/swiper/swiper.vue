<!--
 * @Author: rise
 * @Date: 2023-10-22 13:33:28
 * @LastEditors: rise
 * @LastEditTime: 2023-10-22 16:45:14
 * @Description:  
-->
<template>
  <q-carousel
    color="white"
    arrows
    height="100px"
    width="200px"
  >
    <q-carousel-slide img-src="statics/mountains.jpg">
      <div class="absolute-bottom custom-caption">
        <div class="q-display-1">First stop</div>
        <div class="q-headline">Mountains</div>
      </div>
    </q-carousel-slide>
    <q-carousel-slide img-src="statics/parallax1.jpg">
      <div class="absolute-bottom custom-caption">
        <div class="q-display-1">Second stop</div>
        <div class="q-headline">Famous City</div>
      </div>
    </q-carousel-slide>
    <q-carousel-slide img-src="statics/parallax2.jpg">
      <div class="absolute-bottom custom-caption">
        <div class="q-display-1">Third stop</div>
        <div class="q-headline">Famous Bridge</div>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<style>
.custom-caption {
  text-align: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.5);
}
</style>