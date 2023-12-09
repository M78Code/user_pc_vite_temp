<template>
  <div class="component result-ol-item" v-if="value.result != (void 0)"
    :class="[state,'hpt-'+hpt]" @click.stop
  >
    <slot>
      <div class="icontainer">
        <span class="item content" :alt="value.on||value.ott"> {{ value.on||value.ott }} </span>
        <span class="separate"></span>
        <span class="item state">{{ i18n_t('bet_record.bet_no_status0'+value.result) }}</span>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { calcOlResult } from 'src/output/index'

const props = withDefaults(defineProps<{
  value: TYPES.OlResult,
  /** 玩法模板 */ hpt?: -1|0|1|3,
}>(),{
  hpt: -1
})
let state:TYPES.OlResultState = calcOlResult(props.value.result)


</script>

<style lang="scss" scoped>

.left{
  text-align: right;
}
.right{
  text-align: left;
}
.overflow{
  flex: 1;
  width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}
.content-overflow{
  .icontainer{
    .item{
      flex: none;
      &.content{
        @extend .overflow;
      }
    }
  }
}
.result-ol-item{
  --private-state-color: #8A8986; //#TODO: css var
  --privete-flex-direction: row;
  --private-inner-container-padding: 0px 0px;
}
.component.result-ol-item{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  &.r-win,&.r-win-half{
    --private-state-color: #FF4646; //#TODO: css var
    background-color: #FFC8C8; //#TODO: css var
  }
  >.icontainer{
    padding: var(--private-inner-container-padding);
  }
}
.icontainer{
  display: flex;
  text-wrap: nowrap;
  align-items: center;
  flex-direction: var(--privete-flex-direction);
  width: 100%;
  >.item{
    flex: 1;
  }
  .separate{
    width: 8px;
  }
  >.state{
    @extend .right;
    font-weight: 700;
    color: var(--private-state-color);
  }
  >.content{
    @extend .left;
    color: #000000;
  }
}
.hpt-1{
  &.component.result-ol-item{
    --privete-flex-direction: row-reverse;
  }
}

.hpt-1{
  height: 100%;
  /** play-template-1继承来的css 变量 */
  padding: var(--private-container-padding);
  font-size: 14px;
  @extend .content-overflow;
  .icontainer{
    height: 100%;
  }
}
.hpt-0{
  --private-inner-container-padding: 0px 0px;
  justify-content: center;
  @extend .overflow;
  // @extend .content-overflow;
  .icontainer{
    @extend .overflow;
    display: block;
    text-align: center;
    width: auto;
    max-width: 100%;
    justify-content: center;
    .item{
      flex: none;
    }
    .content{
      @extend .overflow;
      padding-right: -10px;
    }
    .separate{
      padding: 0 4px;
    }
  }
}
.hpt-1{
  --private-inner-container-padding: 0px 4px;
}
/** 兼容了模板4的情况, 但是呢不符合UI */
.hpt-4{
  justify-content: center;
  .icontainer{
    width: auto;
    flex-wrap: wrap;
    justify-content: center;
    flex-basis: 68px;
    .state,.content{
      flex: 0;
      flex-basis: 50%;
      text-align: center;
    }
    .content{
      padding: 0px 8px;
      box-sizing: border-box;
    }
    .separate{
      width: 0;
      display: none;
    }
  }
}
.hpt-3{
  --private-inner-container-padding: 0px 20px;
}
</style>/index