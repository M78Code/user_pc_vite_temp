<template>
  <div class="component default-template">
    <OddsTitle :data="data" v-if="state.title"></OddsTitle>
      <template v-for="item in data.hl">
        <OddHlWrap :data="item" :type="state.olType" :hpt="data.hpt" :oddInfo="data">
          <template #title v-if="state.innerTitle">
            <OddsTitle :data="data"></OddsTitle>
          </template>
          <template #default v-if="data.hpt == 4">
            
          </template>
        </OddHlWrap>
      </template>
  </div>
</template>
<script setup lang="ts">
import OddHlWrap from "./OddHlWrap.vue";
import OddsTitle from "./OddsTitle.vue";
import OddOlItem from "./OddOlItem.vue";
import common from './common'
const props = defineProps<{
  data:TYPES.OddInfo
}>()

const state = common.getTemplateState(props.data)

</script>

<style scoped lang="scss">

</style>