<!--
 * @Description: 文档.doc展示
 * @FilePath: \user-pc-vite\entries\development-document\src\pages\doc_api\index.vue
 * @Date: 2023-08-02 16:56:09
-->
<template>
  <div class="doc-api q-my-md">
    <isComponent :docData="docDataTable" :isComp="isComp"></isComponent>
  </div>
</template>
  
<script setup>
import { ref, watch } from "vue";
import isComponent from "basesrc/pages/doc_api/is_compont.vue";

const props = defineProps({
  docdata: {
    type: Array,
    default: () => [],
  },
});
// table数据
const docDataTable = ref([]);
// 展示组件
const isComp = ref("");

/**
 * 格式化数据
 * @param {*} val 当前点击分类数据
 */
const formatData = (val) => {
  Object.keys(val)?.forEach((key) => {
    switch (key) {
      case "project": {
        docDataTable.value = val[key];
        isComp.value = "project-doc";
        break;
      }
      case "entriesdoc": {
        docDataTable.value = val[key];
        isComp.value = "entries-doc";
        break;
      }
      case "jobdoc": {
        docDataTable.value = val[key];
        isComp.value = "job-doc";
        break;
      }
      default:
        docDataTable.value = [val];
        isComp.value = "user-doc";
        break;
    }
  });
  console.log(`-1-${isComp.value}--`, docDataTable.value);
};

watch(
  () => props.docdata,
  (val) => {
    formatData(val);
  },
  { immediate: true }
);
</script>
  
<style lang="scss" scoped>
</style>