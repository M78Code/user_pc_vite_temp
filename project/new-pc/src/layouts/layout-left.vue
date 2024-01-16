<template>
  <!-- 左侧 菜单区域 -->
  <div
    class="layout-left row relative-position full-height"
    :style="`width:${LayOutMain_pc.layout_left_width}`" >
  
   <div style="display: none;"> {{ LayOutMain_pc.layout_version }}</div>

    <div class="cathectic-shade" v-show="bet_loadding && LayOutMain_pc.layout_left_menu_status == 'normal'">
      <div class="shade-fixed">
        <!-- 确认中转圈圈 -->
        <div class="loading-wrap">
          <div class="img-loading"></div>
          <div class="text-center loading-text flex items-end justify-center">
            {{ i18n_t("bet.bet_loading") + "..." }}
            <!-- 内容加载中... -->
          </div>
        </div>
      </div>
    </div>
    <!-- 左侧 mini -->
    <!-- <left-main-min v-show="LayOutMain_pc.layout_left_menu_status == 'mini'" /> -->
    <!-- 左侧 -->
    <left-main v-show="LayOutMain_pc.layout_left_menu_status == 'normal'" />
    <left-main-min v-show="LayOutMain_pc.layout_left_menu_status == 'mini'" />
  </div>
</template>

<script setup>
import { onUnmounted,onMounted, reactive, ref } from "vue";
import leftMain from "../pages/left-main/index.vue";
import leftMainMin from "../pages/left-main/index-min.vue";

import { useRoute } from "vue-router";
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";

const route = useRoute();
const bet_loadding = ref(false);

const ref_data = reactive({
  emit_lsit: {}
})

// 设置投注loading
const set_bet_loadding = (val) =>{
  bet_loadding.value = val
}

onMounted(()=>{
  ref_data.emit_lsit = {
    emitter_1: useMittOn( MITT_TYPES.EMIT_BET_LOADING,  set_bet_loadding ).off
  }
})

onUnmounted(()=>{
  Object.values(ref_data.emit_lsit).map((x) => x());
})

</script>
