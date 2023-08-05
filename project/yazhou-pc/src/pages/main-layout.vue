<!--
 * @FilePath       : \user-pc-vite\project\yazhou-pc\pages\layout.vue
-->
<template>
  <div class="c-main-scroll window-width window-height main">
    <!-- header -->
    <div class="overflow-hidden relative-position"></div>

    <!-- 主体部分 -->
    <div class="c-main-content c-content-bg">

      <!-- 左侧菜单 -->
      <div  class="page-left row yb-layout-margin-menu relative-position">
        <left-menu />
      </div>
    </div>
  </div>
</template>


<script setup>
  // import leftMenu from "./menu/left-menu.vue"
</script>
<style scoped lang="scss">
.c-main-scroll {
  overflow-x: auto;
  &.window-width {
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100vw !important;
    &.window-height{
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      height: 100vh !important;
    }

  }
}
.main {
  height: 100%;
  &.overflow-hidden{
    overflow: hidden !important;
  }
  .relative-position{
    position: relative;
  }
}

.c-main-content {
  background-position: center;
  background-size: cover;
  display: flex;
  background-color: #f5f5f5;
  border-top: 4px solid #f5f5f5;
  margin-top: 1px;
}


</style>