<template>
  <q-layout view="lHh Lpr lFf">
    <!-- 图片预加载 -->
    <div v-if="showPreload" class="preload"></div>
    <!-- 页面实际容器 -->
    <!-- <router-view v-if="is_init_config && show_router_view" :key="$i18n.locale"/> -->
    <router-view />
    <!-- 网络中断组件 -->
    <!-- 网站维护提示组件 -->
    <!-- 网络状态组件 -->
  </q-layout>
</template>

<script setup>
  import { ref } from 'vue'

  const showPreload = ref(false)
</script>