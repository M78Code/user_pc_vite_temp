<template>
  <div class="component">
    <OddsTitle :data="data"></OddsTitle>
      <template v-for="item in data.hl">
        <OddHlWrap :data="item" :type="olType" :hpt="data.hpt" :oddInfo="data">
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

const olType = common.getOlType(props.data)

</script>

<style scoped lang="scss">

</style>