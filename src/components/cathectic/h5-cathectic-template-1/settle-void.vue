<!--
 * @Author:
 * @Date: 
 * @Description: 投注记录页无数据时展示去投注的界面
-->
<template>
    <div class="settle-void" @touchmove.prevent>
      <div class="main">
        <div class="img-s" :class="{'img-s2': get_theme.includes('theme02')}"></div>
        <div class="text-s">
          <p style="line-height: 0.18rem">{{ calc_text }}</p>
          <p @click="go_bet" class="go-bet">
            {{get_main_item == 2 ? i18n_t('msg.msg_nodata_19') : i18n_t('msg.msg_nodata_05')}}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
//   import { mapGetters } from "vuex";
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"

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
  // computed: {
  //   ...mapGetters([
  //     'get_main_item',
  //     'get_theme'
  //   ]),
  const calc_text = () => {
  if (is_limit) {
    return i18n_t('msg.msg_nodata_22')
  }
  if (get_main_item == 0) {
      return is_early ? i18n_t('msg.msg_nodata_15') : i18n_t('msg.msg_nodata_12')
  } else {
    if (is_early) {
      return i18n_t('msg.msg_nodata_16')
    } else {
      return get_main_item == 2 ? i18n_t('msg.msg_nodata_18') : i18n_t('msg.msg_nodata_13')
    }
  }
}
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
    background:  var(--q-color-com-img-bg-83) no-repeat center / contain;
    }

    .img-s2 {
    background:  var(--q-color-com-img-bg-84) no-repeat center / contain;
    }

    .text-s {
    width: 100%;
    height: 0.42rem;
    line-height: 0.42rem;
    font-size: 0.14rem;
    color: var(--q-color-fs-color-146);
    letter-spacing: 0;
    text-align: center;
    }

    .go-bet {
    background: var(--q-color-linear-gradient-bg-22);
    border-radius: 4px;
    color: #fff;
    margin-top: 0.1rem;
    }
</style>
