<template>
  <div class="component template-14 template14">
    <template v-for="hl in data.hl" :key="hl.hid">
      <div class="main ol-list-container">
        <template v-for="title in data.title" :key="title.otd">
          <div class="ol-column">
            <OddsTitle class="ol-title" :list="[title]"></OddsTitle>
            <template v-for="item in hl.ol">
              <OddOlItem :value="item" v-if="item.otd == title.otd" :key="item.oid"
                :type="olType"
              >
              </OddOlItem>
            </template>
          </div>
        </template>
      </div>
      <div class="other" ref="otherEl">
        <template v-for="item in hl.ol">
          <OddOlItem :value="item" v-if="config.otherOtd.includes(Number(item.otd))" :key="item.oid"
            :type="olType"
          >
          </OddOlItem>
        </template>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import OddHlWrap from "./OddHlWrap.vue";
import OddsTitle from "./OddsTitle.vue";
import OddOlItem from "./OddOlItem.vue";
import common, { config } from './common'
const props = defineProps<{
  data:TYPES.OddInfo
}>()

const olType:TYPES.OlItemType = 'column'

</script>

<style scoped lang="scss">
.component.template14{
  display: flex;
  flex-direction: column;
  >.main{
    display: flex;
    .ol-column{
      flex: 1;
    }
  }
}
</style>