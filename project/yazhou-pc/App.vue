<template>
  <div id="q-app">
    <appload v-if="init_load"></appload>
    <MainLayOut></MainLayOut>
  </div>
</template>
<script setup>
import { init_load, init_domain } from "./app.js";
import MainLayOut from "./src/pages/main_layout.vue";
import appload from "./app-load.vue";
init_domain();
</script>
