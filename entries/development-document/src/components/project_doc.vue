<!--
 * @Description: 项目配置文档
 * @FilePath: \user-pc-vite\entries\development-document\src\components\project_doc.vue
 * @Date: 2023-08-04 15:45:30
-->

<template>
  <div class="project-doc">
    <div class="row project-doc-header">
      <div class="col-3">命令</div>
      <div class="col-9">说明</div>
    </div>
    <div v-for="(item, idx) in docData" :key="`project-${idx}`" class="project-doc-table row">
      <div class="col-3">{{ item.script }}</div>
      <div class="col-9">{{ item.descriptions?.join("") }}</div>
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

<style lang="scss" scoped >
.project-doc {
  font-size: 15px;
  padding: 15px;

  &-header {
      padding: 5px;
      font-size: 16px;
      font-weight: bold;
      border: 1px solid #000;
  }

  &-table {
      padding: 5px;
      border: 1px solid #000;
      border-top: 0;
  }
}
</style>