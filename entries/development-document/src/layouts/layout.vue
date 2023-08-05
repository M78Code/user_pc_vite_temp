<!--
 * @Description: 首页
 * @FilePath: \user-pc-vite\entries\development-document\src\layouts\layout.vue
 * @Date: 2023-07-30 18:44:53
-->
<template>
  <div class=" ">
    <q-layout
      view="hHh Lpr lff"
      container
      style="height: 100vh"
      class="shadow-2"
    >
      <q-header
        elevated
        :class="$q.dark.isActive ? 'bg-secondary' : 'bg-primary'"
      >
        <q-toolbar>
          <q-btn
            flat
            @click="drawerLeft = !drawerLeft"
            round
            dense
            icon="menu"
          />
          <q-toolbar-title>项目内部开发文档</q-toolbar-title>
          <!-- <q-btn flat @click="drawerRight = !drawerRight" round dense icon="menu" /> -->
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="drawerLeft"
        show-if-above
        :width="300"
        :breakpoint="700"
        elevated
      >
        <q-scroll-area class="fit">
          <leftMenu :menudata="left_menu" @change-menu="chang_menu"></leftMenu>
        </q-scroll-area>
      </q-drawer>
      <q-page-container>
        <q-page padding>
          <docApi :docdata="file_data"></docApi>
          <!-- <json-viewer
            style="max-height: calc(100vh - 100px); overflow: scroll"
            :value="file_path_base_obj[current_menu]"
            :expand-depth="5"
            expanded
            copyable
            sort
          ></json-viewer> -->
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
  
<script setup>
import { ref, onBeforeMount } from "vue";
import file_path_keys from "app/job/output/doc/key.json";
import file_path_base_obj from "app/job/output/doc/obj.json"; // 数据
import leftMenu from "basesrc/components/left_menu.vue"; // 左侧菜单
import left_menu from "app/job/output/doc/left_menu.json"; // 左侧菜单配置
import docApi from "basesrc/pages/doc_api/index.vue";       // API文档
console.log("--file_path_keys-----", file_path_keys);
console.log("--file_path_base_obj----", file_path_base_obj);
// 菜单折叠展开
const drawerLeft = ref(false);
// 当前选中项
const current_menu = ref("");
// 右侧.doc数据
const file_data = ref([]);
/**
 * 当前点击的菜单
 * @param {*} menu 路径
 */
const chang_menu = (menu) => {
  current_menu.value = menu || file_path_keys[0];
  file_data.value = file_path_base_obj[current_menu.value] || [];
};
onBeforeMount(() => {
  chang_menu();
});
</script>
  