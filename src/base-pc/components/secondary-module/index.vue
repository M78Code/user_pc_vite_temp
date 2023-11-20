<template>
  <div class="secondary_dialog">
    <q-dialog v-model="LayOutMain_pc.layout_secondary_dialog" persistent full-width full-height>
      <!-- <q-card class="q-card dialog_card"> -->
       <div class="dialog_content">
        <!-- 头部 -->
        <header class="header">
          <div class="row items-center justify-between">
            <p>personal</p>
            <p>x</p>
          </div>
        </header>
        <!-- 内容 -->
        <section></section>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { LayOutMain_pc } from "src/core/index.js";
import { ref } from "vue";
const layout_secondary_dialog = ref();
</script>
<style lang="scss" scoped>
.secondary_dialog {
  width: 100%;
  height: 100%;
  .dialog_content {
    width: 12rem;
    height: 4.2rem;
    .header {
      padding: 10px;
      width: 12rem;
      height: 4.2rem;
    }
  }
}
</style>