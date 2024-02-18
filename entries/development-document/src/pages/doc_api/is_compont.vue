<!--
 * @Description: doc文档展示组件
 * @FilePath: \user-pc-vite\entries\development-document\src\pages\doc_api\is_compont.vue
 * @Date: 2023-08-04 16:22:12
-->
<template>
  <div class="is-compont">
    <component :is="compObj[isComp]" :docData="docData" :isComp="isComp" />
  </div>
</template>
    
<script setup>
import projectDoc from "basesrc/components/project_doc.vue"; // 项目文档
import userDoc from "basesrc/components/user_doc.vue"; // api文档
import jobDoc from "basesrc/components/job_doc.vue"; // 脚本配置文档
const props = defineProps({
  // 数据
  docData: {
    type: Array,
    default: () => [],
    required: true,
  },
  // 模板
  isComp: {
    type: String,
  },
});

// 组件map
const compObj = {
  "project-doc": projectDoc,
  "user-doc": userDoc,
  "job-doc": jobDoc,
  "entries-doc": projectDoc,
};
</script>