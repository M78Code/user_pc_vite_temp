<template>
  <div class="component template-column">
    <div class="main ol-list-container">
      <template v-for="title in data.title" :key="title.otd">
        <div class="ol-column">
          <OddsTitle class="ol-title" :list="[title]"></OddsTitle>
          <template v-for="item in data.hl[0].ol">
            <OddOlItem :value="item" v-if="item.otd == title.otd" :key="item.oid"
            :type="olType"
            >
            </OddOlItem>
          </template>
        </div>
      </template>
    </div>
    <div class="other ol-item">
      <template v-for="item in data.hl[0].ol" >
        <OddOlItem :value="item" v-if="item.otd == -1" :key="item.oid"
          :type="olType"></OddOlItem>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref,computed } from 'vue'
import OddHlWrap from "./OddHlWrap.vue";
import OddsTitle from "./OddsTitle.vue";
import OddOlItem from "./OddOlItem.vue";
import common from './common'
const props = defineProps<{
  data:TYPES.OddInfo
}>()

const olType = common.getOlTypeOfTemplate4(props.data)

/** @type {} */
const titles = ref(new Map())
const other = ref([])
props.data.title.forEach(item=>titles.value.set(item.otd,[]))

const list = computed(()=>{
  props.data.hl.forEach(hl=> {
    hl.ol.forEach(ol=> {
      if(titles.value.has(ol.otd)){
        titles.value.get(ol.otd)
      }else {

      }
    })
  })
})

</script>

<style scoped lang="scss">
.component.template-column{
  display: flex;
  flex-direction: column;
  background-color: #fff;
  >.main{
    display: flex;
    .ol-column{
      flex: 1;
    }
  }
}
</style>