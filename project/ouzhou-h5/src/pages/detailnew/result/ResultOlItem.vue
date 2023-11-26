<template>
  <div class="component result-ol-item" v-if="value.result != (void 0)||true"
    :class="[state,'hpt-'+hpt]" @click.stop
  >
    <slot>
      <div class="icontainer">
        <span class="item state">{{ i18n_t('bet_record.bet_no_status0'+value.result) }}</span>
        <span class="separate"></span>
        <span class="item content"> {{ value.on||value.ott }} </span>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">

import { utils } from 'src/core/index'

const props = withDefaults(defineProps<{
  value: TYPES.OlResult,
  /** 玩法模板 */ hpt: 0|1|3,
}>(),{
  hpt: 0
})

let state:TYPES.OlResultState = utils.calcOlResult(props.value.result)


</script>

<style lang="scss" scoped>
.component.result-ol-item{
  width: 100%;
  --private-state-color: #8A8986; //#TODO: css var
  &.r-win,&.r-win-half{
    --private-state-color: #FF4646; //#TODO: css var
    background-color: #FFC8C8; //#TODO: css var
  }
}
.left{
  text-align: right;
}
.right{
  text-align: left;
}
.icontainer{
  display: flex;
  text-wrap: nowrap;
  align-items: center;
  width: 100%;
  >.item{
    flex: 1;
  }
  .separate{
    width: 8px;
  }
  >.state{
    @extend .left;
    font-weight: 700;
    color: var(--private-state-color);
  }
  >.content{
    @extend .right;
    color: #000000;
  }
}
.hpt-3,.hpt-1{
  height: 100%;
  .icontainer{
    height: 100%;
    padding: 0px 20px;
    flex-direction: row-reverse;
  }
}
</style>