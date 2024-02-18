<template>
  <div class="component odd-hl-wrap" :class="[type,'hpt-'+hpt]"
  >
    <slot name="title"></slot>
    <slot>
      <div class="odd-ol-wrap">
        <template v-for="item in data.ol" :key="item.oid">
          <OddOlItem :value="item" :type="type"></OddOlItem>
        </template>
      </div>
    </slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import OddOlItem from "./OddOlItem.vue";

const props = withDefaults(defineProps<{
  data:TYPES.Hl
  hpt: number
  type?:TYPES.OlItemType
  oddInfo?:TYPES.OddInfo
}>(),{
  type: 'default'
})
const hasTitle = computed(()=>props.oddInfo?.title.length)
const olName = `'${props.data.ol[0].on}'`

</script>

<style scoped lang="scss">
.odd-hl-wrap{
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .odd-ol-wrap{
    display: flex;
    flex-wrap: wrap;
    // padding-bottom: 30px;
  }
  &.fill{
    .odd-ol-wrap{
      flex-direction: column;
    }
  }
  &.hpt-5{
    --odd-template-before-content: v-bind(olName);
  }
  &.hpt-4{
    .odd-ol-wrap{
      flex-direction: column;
    }
  }
}

</style>

<style lang="scss">
.component.odd-hl-wrap{
  &.hpt-1,&.hpt-3.have-title,&.hpt-5.dis{
    .ol-name,.separate{
      display: none;
    }
    .ol-content{
      justify-content: center;
    }
  }
  &.hpt-3:not(.have-title){
    .component.odd-ol-item{
      flex-basis: calc(100%/3);
    }
  }
  &.hpt-5{
    .component.odd-ol-item{
      flex-basis: 50%;
      &:nth-last-child(2){
        flex-basis: 100%;
      }
      &:nth-child(-n+2){
        flex-basis: 50%;
      }
    }
  }
  &.hpt-10,&.hpt-15{
    .component.odd-ol-item{
      flex-basis: calc(100%/3);
      padding: 10px 4px;
    }
    .icontainer{
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .separate{
        display: none;
      }
      .item{
        text-align: center;
      }
    }
  }
  &.hpt-15{
    .component.odd-ol-item{
      flex-basis: 25%;
    }
  }
}
</style>