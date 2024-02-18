<!--
 * @Description: 虚拟体育新手版投注项
-->

<template>
  <div class="odd-item-w" 
  :class="BetData.bet_oid_list.includes(ol_item.oid)&& 'active'"
  :data-oid="ol_item.oid" :data-result="ol_item.result">
  <div v-show="false">{{BetData.bet_data_class_version}}</div>
    <div class="result-focus" v-if="ol_item.result == 4">
    </div>
    <div class="o-i-inner flex justify-center items-center">
      <div class="column justify-center items-center">
        <div class="on" :class="{onfocus:ol_item.result == 4 || ol_item.result == 5}" v-if="ol_item.on">
          {{ol_item.on}}
        </div>
        <div class="lock" v-if="is_vr_lock">
          <img src="image/wwwassets/bw3/common/match-icon-lock.svg" class="icon-lock">
        </div>
        <div v-else 
          class="odds-value"
          :class="{
            focus:ol_item.result == 4 || ol_item.result == 5,
            result:ol_item.result !== ''
          }">
          {{get_odd_value(ol_item)}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import virtual_sports_odd_item_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-odd-item-mixin.js";
export default {
  mixins:[virtual_sports_odd_item_mixin],
}
</script>

<style lang="scss" scoped>
.odd-item-w {
  height: 0.32rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  flex: 1;
  // background: var(--q-gb-bg-c-28);
  &.active {
    background: var(--q-gb-bg-c-37) !important;
    :deep(.o-i-inner){
      div {
        color: var(--q-gb-t-c-30)
      }
    }
  }

  .result-focus, .o-i-inner {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;

    .result {
      font-size: 0.14rem;
    }
  }

  .result-focus {
    z-index: 1;
  }

  .on {
    font-size: 0.1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #AFB3C8;
  }
  .odds-value {
    font-size: 0.1rem;
    color: var(--q-gb-t-c-5);
  }

  .lock {
    .icon-lock {
      width: 0.14rem;
      height: 0.14rem;
      display: block;
    }
  }

  &:before {
    content: ' ';
    display: block;
    width: 0.01rem;
    height: 0.24rem;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  &:after {
    content: ' ';
    display: block;
    width: 0.01rem;
    height: 0.24rem;
    position: absolute;
    right: 0;
  }

  &:first-child {
    &:before {
      display: none;
    }
  }

  &:last-child {
    &:after {
      display: none;
    }
  }
}

/* ************** 选中的样式 ************** -S */


/* ************** 选中的样式 ************** -EE */
</style>