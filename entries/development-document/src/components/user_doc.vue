<!--
 * @Description: API配置文档
 * @FilePath: \user-pc-vite\entries\development-document\src\components\user_doc.vue
 * @Date: 2023-08-04 16:08:04
-->

<template>
  <div class="user-doc">
    <div class="text-center q-py-md" style="fontsize: 20px">
      当前分类：
      {{ docData[0]["leftmenu"].sonName || docData[0]["leftmenu"].menuName }}
    </div>
    <div>
      <json-viewer
        style="max-height: calc(100vh - 100px); overflow: scroll"
        :value="docData"
        :expand-depth="5"
        expanded
        copyable
        sort
      ></json-viewer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, onMounted } from "vue";
import JsonViewer from "vue-json-viewer";

const props = defineProps({
  docData: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
</style>