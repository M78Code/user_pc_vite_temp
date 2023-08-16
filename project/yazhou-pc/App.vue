<template>
  <div id="q-app" class="full-height">
    <appload v-if="init_load"></appload>
    <!-- <div :style="compute_css({ label: 'image01', theme: 'day' })"></div>
    <div
      :style="
        compute_css({ label: 'bet-menu-icon', theme: 'day', key: 'item_6' })
      "
      style="width: 36px; height: 36px"
    ></div> -->
  </div>
</template>
<script setup>
import { init_load, init_domain } from "./app.js";
// import { compute_css } from "src/core/server-img/";
import appload from "./app-load.vue";
init_domain();
</script>
