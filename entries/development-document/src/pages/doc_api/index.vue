<!--
 * @Description: 文档.doc展示
 * @FilePath: \user-pc-vite\entries\development-document\src\pages\doc_api\index.vue
 * @Date: 2023-08-02 16:56:09
-->
<template>
  <div>
    <q-card class="doc-api q-my-md" flat bordered>
      <isComponent :docData="docDataTable" :isComp="isComp"></isComponent>
    </q-card>
  </div>
</template>
  
<script setup>
import { ref, watch, computed } from "vue";
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
 * 需要排除的键 ["file_path","meta", "leftmenu", "mixins"]
 */
const formatData = (val) => {
  docDataTable.value = [];
  let data = {};
  if (Array.isArray(val)) {
    data = val[0] || {};
  }
  Object.keys(data)?.forEach((key) => {
    switch (key) {
      case "project": {
      docDataTable.value = data[key];
        isComp.value = "project-doc";
        break;
      }
      case "entriesdoc": {
        docDataTable.value = data[key];
        isComp.value = "entries-doc";
        break;
      }
      case "jobdoc": {
        docDataTable.value = data[key];
        isComp.value = "job-doc";
        break;
      }
      default:
      docDataTable.value = [data];
        isComp.value = "user-doc";
        break;
    }
  });
  console.log(`--${isComp.value}--`, docDataTable.value);
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