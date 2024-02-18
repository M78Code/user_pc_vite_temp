<!--
 * @Author:
 * @Date:
 * @Description: 投注记录页无数据时展示去投注的界面
-->
<template>
  <div class="settle-void" @touchmove.prevent>
    <div class="main">
      <div class="img-s" :style="compute_css_obj('no-record')"></div>
      <div class="text-s">
        <p style="line-height: 0.18rem">{{ calc_text }}</p>
        <p @click="go_bet" class="go-bet">
          {{ get_main_item == 2 ? i18n_t('msg.msg_nodata_19') : i18n_t('msg.msg_nodata_05') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
//import store from 'src/store-redux/index.js'
import { MITT_TYPES,compute_css_obj,i18n_t, useMittEmit } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
// let { themeReducer, cathecticReducer } = store.getState()
// let store_cathectic = cathecticReducer

const props = defineProps({
  // 提前结算图标是否选中
  is_early: {
    type: Boolean,
    defalut: false,
  },
  // 接口是否返回错误码为0401038限频
  is_limit: {
    type: Boolean,
    defalut: false,
  },
})
const get_main_item = ref(0)
const calc_text = computed(() => {
  if (props.is_limit) {
    // 如果结算图标被选中
    return 'msg.msg_nodata_22' //i18n_t('msg.msg_nodata_22')
  }
  // if (store_cathectic.main_item == 0) {
  //   // 如果是未结算
  //   return props.is_early ? i18n_t('msg.msg_nodata_15') : i18n_t('msg.msg_nodata_12')
  // } else {
  //   if (props.is_early) {
  //     // 如果被限频
  //     return i18n_t('msg.msg_nodata_16')//  i18n_t('msg.msg_nodata_16')
  //   } else {
  //     return store_cathectic.main_item == 2 ? i18n_t('msg.msg_nodata_18') : i18n_t('msg.msg_nodata_13')
  //   }
  // }
})
//页面跳转逻辑
const go_bet = () => {
  useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, false)
}
</script>

<style lang="scss" scoped>
.settle-void {
  width: 100%;
  display: flex;
  flex: 1;
}

.main {
  width: 1.65rem;
  height: 3.6rem;
  margin: auto;
}

.img-s {
  width: 1.65rem;
  height: 1.65rem;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.text-s {
  width: 100%;
  height: 0.42rem;
  line-height: 0.42rem;
  font-size: 0.14rem;
  color: var(--q-cathectic-color-8);
  letter-spacing: 0;
  text-align: center;
}

.go-bet {
  background: var(--q-gb-bg-lg-22);
  border-radius: 4px;
  color: #fff;
  margin-top: 0.1rem;
}
</style>