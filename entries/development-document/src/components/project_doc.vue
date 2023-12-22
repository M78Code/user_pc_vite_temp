<!--
 * @Description: 项目配置文档
 * @FilePath: \user-pc-vite\entries\development-document\src\components\project_doc.vue
 * @Date: 2023-08-04 15:45:30
-->

<template>
  <div class="project-doc">
    <!-- 项目说明 -->
    <template v-if="isComp == 'project-doc'">
    <div class="row project-doc-header">
      <div class="col-3">命令</div>
      <div class="col-9">说明</div>
    </div>
      <div
        v-for="(item, idx) in docData"
        :key="`project-${idx}`"
        class="project-doc-table row"
      >
      <div class="col-3">{{ item.script }}</div>
      <div class="col-9">{{ item.descriptions?.join("") }}</div>
    </div>
    </template>
    <!-- 项目版本 -->
    <template v-else>
      <div>
        <div class="row project-doc-header">
          <div class="col-1">类型</div>
          <div class="col-2">目录</div>
          <div class="col-3">脚本</div>
          <div class="col-6">描述</div>
        </div>
        <div
          v-for="(item, idx) in docData"
          :key="idx"
          class="row project-doc-table"
        >
          <div class="col-1">{{ item.type }}</div>
          <div class="col-2">{{ item["directory-name"] }}</div>
          <div class="col-3" style="height: 100%">
            <div v-for="(v, i) in item.scripts" :key="i">
              {{ v }}
            </div>
          </div>
          <div class="col-6">
            <div v-for="(v, i) in item.descriptions" :key="i">
              {{ v }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  docData: {
    type: Array,
    default: () => [],
  },
  isComp: String,
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