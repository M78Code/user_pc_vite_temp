<template>
  <div class="component">
    <OddsTitle :data="data" v-if="hasTitle"></OddsTitle>
      <template v-for="item in data.hl">
        <OddHlWrap :data="item" :type="olType" :hpt="data.hpt">
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

const len = props.data.title.length
const hasTitle = len > 1 && len <= 3
const olType = common.getOlType(props.data)

</script>

<style scoped lang="scss">

</style>