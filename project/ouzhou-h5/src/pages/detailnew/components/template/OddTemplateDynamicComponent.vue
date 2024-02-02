<template>
  <component :is="Template" :data="data" @click.capture="onClick"
    class="component"
    :class="['template-'+data.hpt,'title-' + titleLen]"
  ></component>
</template>
<script setup lang="ts">
import common from './common.js'

const props = defineProps<{
  data:TYPES.OddInfo
}>()

const Template = common.computedTemplate(props.data.hpt)
const titleLen = props.data.title?.length

function onClick(){
  common.setPlayName(props.data.hpn)
}

</script>

<style scoped lang="scss">
.component{
  --odd-template-ol-item-flex-basis-count: v-bind(titleLen);
  --odd-template-before-content:'';
  background-color: #fff;
}
</style>
<style lang="scss">
.component.template-{
  &0{
    .component.odds-title{
      display: none;
    }
  }
  &4{
    &.title-3{
      .component.odd-ol-item{
        flex-basis: calc(100%/var(--odd-template-ol-item-flex-basis-count));
      }
    }
  }
  &5.dis{
    .odd-ol-wrap,.odds-title{
      &::before{
        content: var(--odd-template-before-content);
        display: flex;
        flex: 1;
        text-align: center;
        justify-content: center;
        align-items: center;
        box-shadow: 0 -1px 1px 1px #F5F5F5;
      }
    }
    .odd-ol-wrap::before{
      flex-basis: calc(100%/3);
    }
  }
  &13{
    .ol-name-ou{
      display: inline;
    }
  }
  &14{
    .component.odd-ol-item{
      flex-basis: calc(100%/var(--odd-template-ol-item-flex-basis-count));
    }
  }
}
</style>