<!--
 * 滚球页面
-->

<template>
  <scroll-menu menu_type="1" @changeMenu="changeMenu"/>
  <!-- 赛事列表 -->
  <div class="match_page">
    <MatchContainer />
  </div>
</template>

<script>
// 注册 name 用于缓存
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'inPlay'
})
</script>

<script setup>
import lodash from 'lodash'
import scrollMenu from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-menu.vue';
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import { onMounted, onUnmounted, ref } from 'vue';
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt";
import BaseData from 'src/core/base-data/base-data.js'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import * as ws_message_listener from "src/core/utils/common/module/ws-message.js";;
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { MenuData } from "src/output/index.js";

const emitters = ref({})
let message_fun = null
let timer = null
onMounted(() => {
  MatchMeta.set_prev_scroll(0)
  // 元数据 有缓存得情况下获取数据
  BaseData.is_emit && MatchMeta.set_origin_match_data()
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_UPDATE_CURRENT_LIST_METADATA, () => {
      // 元数据无缓冲得情况
      if (!BaseData.is_emit) {
        MatchMeta.set_origin_match_data()
      }
    }).off
  }

  // 增加监听接受返回的监听函数
  message_fun = ws_message_listener.ws_add_message_listener((cmd, data) => {
    if (['C101', 'C102', 'C104', 'C901'].includes(cmd)) {
      MatchMeta.handle_remove_match(data)
    } else {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        MatchMeta.handle_ws_directive({ cmd, data })
        clearTimeout(null)
        timer = null
      }, 1500)
    }
  })

  // 重置所选 球种默认玩法 hpid
  MatchResponsive.reset_match_hpid_by_csid()
  
})
onUnmounted(() => {
  // 组件销毁时销毁监听函数
  ws_message_listener.ws_remove_message_listener(message_fun)
  message_fun = null
  Object.values(emitters.value).map((x) => x());
})
/**
 * 球种点击
 * @param {*} mi 
 */
const changeMenu = (mi) =>{
  useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP)
  MenuData.get_match_render_list();
  // 重置所选 球种默认玩法 hpid
  MatchResponsive.reset_match_hpid_by_csid()
}
</script>
<style lang="scss" scoped>
  .match_page{
    // height: calc(100% - 76px - 97px);
    // height: calc(100% - 116px - 54px);
    height: 100%;
    overflow-y: hidden;
    position: relative;
    .match-list-container{
      height: 100%;
      background-color: var(--q-gb-bg-c-2) !important;
      :deep(.scroll-wrapper){
        // background-color: var(--q-gb-bg-c-2) !important;
        .s-w-item{
          background-color: var(--q-gb-bg-c-2) !important;
        }
      }
    }
  }
</style>src/core/utils/common/module/ws-message.js