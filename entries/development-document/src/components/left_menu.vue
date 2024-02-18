<!--
 * @Description: 左侧菜单
 * @FilePath: \user-pc-vite\entries\development-document\src\components\left_menu.vue
 * @Date: 2023-07-31 13:35:37
-->

<template>
  <div class="container">
    <div v-for="(menu, index) in menudata" :key="`menu-${index}`">
      <!-- 有子节点，显示折叠按钮 -->
      <template v-if="menu.childs && menu.childs.length > 0">
        <q-expansion-item
          :icon="menu.icon"
          :label="menu.name"
          :content-inset-level="0.5"
        >
          <!-- 如果有子节点递归当前组件 -->
          <left_menu
            :menudata="menu.childs"
            @changeMenu="change_menu"
          ></left_menu>
        </q-expansion-item>
      </template>
      <!-- 没有子节点，不显示折叠按钮 -->
      <template v-else>
        <q-expansion-item
          @click="change_menu(menu)"
          :icon="menu.icon"
          :label="menu.name"
          hide-expand-icon
          expand-separator
        />
      </template>
    </div>
  </div>
</template>

<script setup>

defineProps({
  menudata: Array,
});

const emit = defineEmits(["changeMenu"]);

/**
 * 当前点击的菜单
 * @param {*} row 点击项 
 */
const change_menu = (row) => {
  emit("changeMenu", row);
};

</script>

<style lang="scss" scoped>
</style>