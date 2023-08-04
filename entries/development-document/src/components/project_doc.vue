<!--
 * @Description: 项目配置文档
 * @FilePath: \user-pc-vite\entries\development-document\src\components\project_doc.vue
 * @Date: 2023-08-04 15:45:30
-->

<template>
  <div class="project-doc">
    <div v-for="(item, idx) in docData" :key="`project-${idx}`" class="row">
      <div class="col-2">{{ item.category }}</div>
      <div class="col-6">{{ item.script }}</div>
      <div class="col-4">{{ item.descriptions }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, onMounted } from "vue";

const props = defineProps({
  docData: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
</style>