<!--
 * app-h5 复刻版 赛事 item
-->

<template>
  <template v-if="is_show">
     <MatchContainerMainTemplate1
       :i="index"
       :match_of_list="item">
     </MatchContainerMainTemplate1>
   </template>
</template>

<script setup>
import { computed } from 'vue';
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
// import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/ouzhou/match-container-main-template1.vue"; 
import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/app/match-container-main-template1.vue"; 

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