<template>
   <div v-show="false">{{ LayOutMain_pc.layout_version }}</div>
    <q-dialog v-model="LayOutMain_pc.layout_secondary_dialog" class="ssssssss" persistent full-width full-height>
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
</template>

<script setup>
import { LayOutMain_pc } from "src/core/index.js";
import { ref } from "vue";
const layout_secondary_dialog = ref();
</script>
<style lang="scss">
.ssssssss .q-dialog__inner .dialog_content{
  width: 1200px !important;
  height: 420px !important;
  background: #fff;
  .header {
    padding: 10px;
    width: 100%;
    height: 42px;
  }
}
</style>