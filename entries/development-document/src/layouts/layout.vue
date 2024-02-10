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
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
  
<script setup>
import { ref, onBeforeMount } from "vue";
// import file_path_keys from "app/job/output/doc/key.json";
// import file_path_base_obj from "app/job/output/doc/obj.json"; // 数据
import leftMenu from "basesrc/components/left_menu.vue"; // 左侧菜单
// import left_menu from "app/job/output/doc/left_menu.json"; // 左侧菜单配置
import docApi from "basesrc/pages/doc_api/index.vue"; // API文档
import axios from "axios";

// 菜单折叠展开
const drawerLeft = ref(false);
// 右侧.doc数据
const file_data = ref({});
// 左侧菜单配置
const left_menu = ref([]);
/**
 * 获取菜单
 */
const get_left_menus = async () => {
  const res = await axios.get(
    "https://api-doc-server-new.dbsporxxxw1box.com/openapi/componentKey/menus"
  );
  left_menu.value = res.data?.data || [];
};
/**
 * 当前点击的菜单
 * @param {*} menu 点击项
 */
const chang_menu = async (menu = {}) => {
  const version =
    menu.enable_version || left_menu.value[0]?.childs[0].enable_version;
  const project = menu.project || left_menu.value[0]?.project;
  const res = await axios.get(
    `https://api-doc-server-new.dbsporxxxw1box.com/openapi/componentDoc/findDetailsByProjectAndVersion?project=${project}&version=${version}`
  );
  file_data.value = res.data?.data || {};
};


onBeforeMount(async () => {
  await get_left_menus();
  await chang_menu();
});
</script>
  