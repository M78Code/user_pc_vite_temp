<!--
 * @Author: rise
 * @Date: 2023-11-07 16:16:01
 * @LastEditors: rise
 * @LastEditTime: 2023-11-07 17:49:29
 * @Description:  
-->
<template>
    <scroll-menu menu_type="1" @changeMenu="changeMenu"/>
    <!-- 赛事列表 -->
    <div class="match_page">
      <MatchContainer />
    </div>
</template>
<script setup>
import scrollMenu from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-menu.vue';
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import { MenuData } from "src/core/index.js";
import { onMounted, onUnmounted, ref } from 'vue';
import { useMittOn, MITT_TYPES } from "src/core/mitt";
import BaseData from 'src/core/base-data/base-data.js'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';

const emitters = ref({})
onMounted(() => {
  // 元数据有缓存的情况下 立即执行 set_origin_match_data 能拿到数据， 没数据的情况下拿不到则掉接口
  if (BaseData.is_emit) {
    MatchMeta.set_origin_match_data()
    // BaseData.set_is_emit(false)
  } else {
    MatchMeta.get_target_match_data({})
  }
})
onUnmounted(() => {
  Object.values(emitters.value).map((x) => x());
})
/**
 * 球种点击
 * @param {*} mi 
 */
const changeMenu = (mi) =>{
  MenuData.get_match_render_list();
}
</script>
<style lang="scss" scoped>
  .match_page{
    height: calc(100% - 76px - 122px);
    overflow-y: hidden;
    position: relative;
    .match-list-container{
      height: 100%;
      background-color: var(--q-gb-bg-c-2) !important;
      :deep(.scroll-wrapper){
        background-color: var(--q-gb-bg-c-2) !important;
        .s-w-item{
          background-color: var(--q-gb-bg-c-2) !important;
        }
      }
    }
  }
</style>