<!--
 * app-h5 复刻版 赛事 item
-->

<template>
  <template v-if="is_show">
    <!-- 赛果玩法 -->
      <template v-if="is_results && !is_kemp">
        <MatchContainerMainTemplate3
          :i="index"
          :match_of_list="item">
        </MatchContainerMainTemplate3>
      </template>
      <template v-else-if="is_results && is_kemp">
        <MatchContainerMainTemplate6
          :i="index"
          :match_of_list="item">
        </MatchContainerMainTemplate6>
      </template>
      <template v-else>
        <MatchContainerMainTemplate1
          :i="index"
          :match_of_list="item">
        </MatchContainerMainTemplate1>
      </template>
   </template>
</template>

<script setup>
import { computed } from 'vue';
import {is_results, is_kemp } from 'src/base-h5/mixin/menu.js'
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/app/match-container-main-template1.vue"; 
import MatchContainerMainTemplate3 from "src/base-h5/components/match-container/template/app/match-container-main-template3.vue"; 
import MatchContainerMainTemplate6 from "src/base-h5/components/match-container/template/app/match-container-main-template6.vue"; 

const props = defineProps({
 item: {
   type: Object
 },
 index: {
   type: Number
 }
})

const is_show = computed(() => {
 if (!props.item || !MatchResponsive.show_match_info.value) return
 const key = `mid_${props.item.mid}`
 return MatchResponsive.show_match_info.value[key]
})

</script>

<style scoped lang="scss">

</style>