<template>
  <component :is="Template" :data="data" @click.capture="onClick"></component>
</template>
<script setup lang="ts">
import DefaultTemplate from './DefaultTemplate.vue';
import common from './common.js'

const props = defineProps<{
  data:TYPES.OddInfo
}>()

const templates = [];

const Template = computedTemplate()

function computedTemplate(){
  return DefaultTemplate
}
function onClick(){
  common.setPlayName(props.data.hpn)
}

</script>

<style scoped lang="scss">

</style>