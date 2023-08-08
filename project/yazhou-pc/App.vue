<template>
  <div id="q-app">
    <appload v-if="init_load"></appload>
    <div :style="compute_css({ label: 'image01', theme: 'day' })"></div>
    <div
      :style="
        compute_css({ label: 'img-bg-menu-live', theme: 'day', key: 'item_0' })
      "
      style="width: 200px; height: 200px"
    ></div>
    <!-- <MainLayOut></MainLayOut> -->
  </div>
</template>
<script setup>
import { init_load, init_domain } from "./app.js";
import { compute_css } from "src/core/server-img/";
// import MainLayOut from "./src/pages/main_layout.vue";
import appload from "./app-load.vue";
init_domain();
console.log("compute_css", compute_css);
console.log(
  "test compute_css",
  compute_css({ label: "img-bg-menu-live", theme: "day", key: "item_0" })
);
</script>
