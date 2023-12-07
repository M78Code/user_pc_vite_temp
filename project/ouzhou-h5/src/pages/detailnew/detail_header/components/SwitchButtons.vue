<template>
  <div class="component swtich-buttons detail-header-scope">
    <div class="list">
      <template v-for="item in images">
        <SwitchButton :image="item"></SwitchButton>
      </template>
    </div>
  </div>
</template>

<script setup>
import SwitchButton from './SwitchButton.vue';
import {LOCAL_PROJECT_FILE_PREFIX} from "src/output/index.js"

const images = ['/ouzhou-h5/image/detail/animation.png']



</script>src/output/index