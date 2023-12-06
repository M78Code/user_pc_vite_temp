<template>
  <div class="component odd-hl-wrap"
    :class="[type,'hpt-'+hpt]"
  >
    <slot>
      <template v-for="item in data.ol" :key="item">
        <OddOlItem :value="item" :type="type"></OddOlItem>
      </template>
    </slot>
  </div>
</template>
<script setup lang="ts">
import OddOlItem from "./OddOlItem.vue";

const props = withDefaults(defineProps<{
  data:TYPES.Hl
  hpt: number
  type?:TYPES.OlItemType
}>(),{
  type: 'default'
})

</script>

<style scoped lang="scss">
.component{
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  &.fill{
    flex-direction: column;
  }
}

</style>

<style lang="scss">
.component{
  &.hpt-1,&.hpt-3{
    .ol-name,.separate{
      display: none;
    }
    .ol-content{
      justify-content: center;
    }
  }
  &.hpt-5{
    .component.odd-ol-item{
      flex-basis: 50%;
    }
  }
  &.hpt-10{
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
      .odd-image{
        position: absolute;
        transform: translateX(100%);
      }
    }
  }
}
</style>