<!--
 * @Author: 
 * @Description: 
-->
<template>
  <div class="skeleton-wrap filter">
    <div class="title">
      <skeleton :width="1.22" :height="0.1" :radius="5"/>
    </div>
    <div class="f_row" v-for="(item, index) in 3" :key="`first-${index}`">
      <skeleton :width="0.2" :height="0.2" :radius="50"/>
      <skeleton :width="index*2?2:1.5" :height="0.1" :radius="5"/>
    </div>

    <div class="title">
      <skeleton :width="1.22" :height="0.1" :radius="5"/>
    </div>
    <div class="f_row" v-for="(item, index) in 10" :key="index">
      <skeleton :width="0.2" :height="0.2" :radius="50"/>
      <skeleton :width="index*2?2:1.5" :height="0.1" :radius="5"/>
    </div>
  </div>
</template>

<script setup>
import skeleton from './index.vue'
import { ref, onMounted,watch,computed,onUnmounted } from 'vue';
const thumbStyle = ref({background: "transparent"})
</script>

<style lang="scss" scoped>
.filter {
  position: unset;
  transform: unset;
  height: 100%;

  .title {
    height: 0.31rem;
    display: flex;
    align-items: center;
    padding: 0 0.15rem;
  }

  .f_row {
    padding: 0 0.15rem;
    height: 0.56rem;
    display: flex;
    align-items: center;

    & > div:first-child {
      margin-right: 0.15rem;
    }
  }
}
</style>