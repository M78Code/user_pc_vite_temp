<!--
 * @Description: 左侧菜单
 * @FilePath: \user-pc-vite\entries\development-document\src\components\left_menu.vue
 * @Date: 2023-07-31 13:35:37
-->

<template>
  <div class="container">
    <div v-for="(menu, index) in menudata" :key="`menu-${index}`">
      <!-- 有子节点，显示折叠按钮 -->
      <template v-if="menu.children && menu.children.length > 0">
        <q-expansion-item
          :icon="menu.icon"
          :label="menu.fatherName"
          :content-inset-level="0.5"
        >
          <!-- 如果有子节点递归当前组件 -->
          <left_menu
            :menudata="menu.children"
            @changeMenu="change_menu"
          ></left_menu>
        </q-expansion-item>
      </template>
      <!-- 没有子节点，不显示折叠按钮 -->
      <template v-else>
        <q-expansion-item
          @click="change_menu(menu.path)"
          :icon="menu.icon"
          :label="menu.menuName"
          hide-expand-icon
          expand-separator
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

defineProps({
  menudata: Array,
});

const emit = defineEmits(["changeMenu"]);

/**
 * 当前点击的菜单
 * @param {*} path 路径
 */
const change_menu = (path) => {
  emit("changeMenu", path);
};

</script>

<style lang="scss" scoped>
</style>