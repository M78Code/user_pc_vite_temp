<!--
 * ouzhou-h5 欧洲版 赛事 item
-->

<template>
  <template v-if="is_show">
    <template v-if="is_kemp">
      <MatchContainerMainTemplate2
        :i="index"
        :match_of_list="item">
      </MatchContainerMainTemplate2>
    </template>
    <template v-else>
      <MatchContainerMainTemplate5
        :i="index"
        :match_of_list="item">
      </MatchContainerMainTemplate5>
    </template>
   </template>
</template>

<script setup>
import { computed } from 'vue';
import { is_results, is_kemp } from 'src/base-h5/mixin/menu.js'
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import MatchContainerMainTemplate2 from "src/base-h5/components/match-container/template/app/match-container-main-template2.vue"; 
import MatchContainerMainTemplate5 from "src/base-h5/components/match-container/template/app/match-container-main-template5.vue"; 

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