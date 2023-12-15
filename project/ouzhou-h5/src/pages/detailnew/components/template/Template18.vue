<template>
  <div class="component template-18 template18">
    <!-- <template v-for="hl in data.hl" :key="hl.hid">
      <div class="main ol-list-container">
        <template v-for="titles,i in data.title" :key="i">
          <div class="ol-column">
            <template v-for="title in titles" :key="title.otd">
              <OddsTitle class="ol-title" :list="[title]"></OddsTitle>
              <template v-for="item in hl.ol">
                <OddOlItem :value="item" v-if="item.otd == title.otd" :key="item.oid"
                  :type="olType"
                >
                </OddOlItem>
              </template>
            </template>
          </div>
        </template>
      </div>
    </template> -->
    <div class="main ol-list-container">
      <template v-for="titles,i in data.title" :key="i">
        <template v-for="title in titles" :key="title.otd">
          <div class="ol-column">
            <OddsTitle class="ol-title" :list="[title]"></OddsTitle>
            <template v-for="item in list[title.otd]" :key="item.oid">
              <OddOlItem :value="item" :type="olType">
              </OddOlItem>
            </template>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import OddHlWrap from "./OddHlWrap.vue";
import OddsTitle from "./OddsTitle.vue";
import OddOlItem from "./OddOlItem.vue";
import common from './common'
const props = defineProps({
  data:Object
})
const olType = 'column'
/** 多写个计算代码也没见渲染时间有什么减少, 还不如模板v-if.... */
const list = computed(()=>{
  /** @type {Array<Array<TYPES.Ol>>} */ const arr = []
  /** @type {Array<TYPES.Ol>} */ const ols = props.data.hl[0].ol
  for (const key in ols) {
    /** @type {TYPES.Ol} */ const item = ols[key]
    if(arr[item.otd] == (void 0)){
      arr[item.otd] = []
    }
    arr[item.otd].push(item)
  }
  return arr
})

</script>

<style scoped lang="scss">
.component.template18{
  display: flex;
  flex-direction: column;
  >.main{
    display: flex;
    flex-wrap: wrap;
    .ol-column{
      flex: 1;
      flex-basis: calc(100%/3);
    }
  }
}
</style>