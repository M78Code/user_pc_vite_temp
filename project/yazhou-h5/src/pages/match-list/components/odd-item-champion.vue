<!--
 * @Description: 冠军赛事投注项组件
-->
<template>
  <div class="ol-li-item flex items-center justify-between" :data-oid="ol_item.oid"
    :id="DOM_ID_SHOW && `list-${lodash.get(ol_item, 'oid')}`"
    v-if="odd_status !== 3"> <!--关盘 odd_status === 3 移除-->
    <div class="on">
      {{ol_item.on}}
    </div>

    <!--封盘-->
    <div class="icon-lock-wrapper" v-if="odd_status === 2">
      <img class="icon-lock" v-if="get_theme.includes('theme01')"
         src="public/image/common/match-icon-lock.svg" />
      <img class="icon-lock" v-if="get_theme.includes('theme02')"
         src="public/image/common/match-icon-lock-theme02.svg" />

    </div>
    <!--开盘|锁盘-->
    <div v-else class="odds" :class="{red:red_green_status === 1,green:red_green_status === -1,}">
      <span class="change-icon" v-show="red_green_status"
            :class="{'icon-red':red_green_status === 1,'icon-green':red_green_status === -1}">
      </span>
      {{get_odds_value(ol_item)}}
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import store from "src/store-redux/index.js"
import lodash from 'lodash'
// import odd_convert from "/mixins/odds_conversion/odds_conversion.js";

const props = defineProps({
  ol_item:Object,
  // 0:开, 1:封, 2:关, 11:锁
  hs:Number,        
  csid:String|Number,
})

const store_state = store.getState()
const timer_ = ref(null)
const red_green_status = ref(0)
const get_theme = ref(store_state.get_theme)

// TODO: 其他模块得 store  待添加
// mixins:[odd_convert],

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
  get_theme.value = new_state.get_theme
})

onMounted(() => {
  // 设置是否显示投注项dom的id属性值
  DOM_ID_SHOW =  window.BUILDIN_CONFIG.LOCAL_FUNCTION_SWITCH.DOM_ID_SHOW;
})

watch(() => ol_item.ov, () => {
  let curr = Number(v1);
  let old = Number(v0);

  clearTimeout(timer_.value);
  if(curr > old){
    red_green_status.value = 1;
  }else if(curr < old){
    red_green_status.value = -1;
  }
 timer_.value = setTimeout(() => {
    red_green_status.value = 0;
  },3000);
})

const odd_status = computed(() => {
  if(!ol_item) return 3;
  return $common.odds.get_odds_active(ol_item.ms,hs,ol_item.os);
})

const get_odds_value = (ol_item,hsw) => {
  let ov = ol_item.ov;hsw='1';  //冠军玩法只支持欧赔
  let csid = csid;
  let r1 = compute_value_by_cur_odd_type(ov / 100000,null, hsw,null,csid);
  return r1 || 0;
}

onUnmounted(() => {
  unsubscribe()
})

</script>

<style lang="scss" scoped>

.ol-li-item {
  width: 1.72rem;
  height: 0.4rem;
  padding: 0 0.1rem;
  margin-bottom: 0.02rem;
  border-radius: 0.04rem;
  overflow: hidden;

  &:nth-child(2n-1) {
    width: 1.73rem;
    margin-right: 0.02rem;
  }

  .on {
    max-width: 1.06rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .icon-lock-wrapper {
    line-height: 1;

    .icon-lock {
      width: 0.12rem;
    }
  }

  .odds {
    position: relative;
    font-weight: 600;

    &.red {
      color: var(--q-color-com-fs-color-9) !important;
    }

    &.green {
      color: var(--q-color-com-fs-color-10) !important;
    }

    .change-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -0.09rem;
      width: 0.06rem;
      height: 0.05rem;
      display: inline-block;
      margin-right: 0.03rem;
      background-repeat: no-repeat;
      background-size: contain;

      &.icon-green {
        background-image: var(--q-color-com-img-bg-18);
      }

      &.icon-red {
        background-image: var(--q-color-com-img-bg-19);
      }
    }
  }
}
</style>
