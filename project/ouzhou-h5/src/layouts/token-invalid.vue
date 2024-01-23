<!-- @Description: token失效弹框 -->
<template>
  <div class="token-invalid fullscreen" @touchmove.prevent>
    <div class="box">
      <div class="tips">
        <img :src="ouzhou_login_failure" alt="">
      </div>
    </div>
    <!-- 暂时写死 token失效 页面内容 -->
    <span class="Landing">Landing Failure</span>
    <div class="prompt_relanding">
      <span class="prompt">Your login information is invalid, please close this page, Enter the site again, Wish you a happy life</span>
    </div>
    <div class="relan_ding" @click="is_go_vender_url(true)">
      <span class="relanding">Relanding</span>
    </div>
  </div>
</template>

<script setup>
import UserCtr from 'src/core/user-config/user-ctr.js'
import { computed } from 'vue';
import { useMittEmit, MITT_TYPES } from "src/core/mitt"
import { i18n_t } from "src/boot/i18n.js";;

import { invalid_url } from 'src/base-h5/assets/base64/index.js'

import { ouzhou_login_failure } from 'src/base-h5/core/utils/local-image.js'

const emits = defineEmits(['is_go_vender_url'])
/** 失效国际化背景图对应 */
const token_bg = computed(() => {
  switch (UserCtr.lang) {
    case 'vi':
      return 'token-vietnam'
    case 'zh':
    case 'tw':
    case 'hk':
      return 'token-vietnam'
    case 'en':
    case 'ms':
    case 'ad':
      return 'token-english'
    case 'th':
      return 'token-thai'
    default:
      return ''
  }
})
const token_bg_url = computed(() => invalid_url?.top[UserCtr.lang])

/**
 * @description 返回app壳或者返回到商户登录页
 * @param {Boolean} value 是否返回到登录或首页
 * @return {Undefined} undefined
 */
 const is_go_vender_url = (value) => {
    useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, false)
    //调用安卓或者ios的方法，告知token失效
    if (window.android && window.android.callAndroid || window.callIOSSwitcher) {
      if (/android/i.test(navigator.userAgent) && window.Switcher) {
        Switcher.callAndroidSwitcher({ code: 1, data: "" });
      } else if (/ipad|iphone|iPod|iOS|mac/i.test(navigator.userAgent) && window.callIOSSwitcher) {
        callIOSSwitcher({ code: 1, data: "" });
      }
    } else {
      emits('is_go_vender_url', value)
    }
  }

</script>
<style lang="scss" scoped>
.token-invalid {
  background-color: #fff;
  .box{
    display: flex;
    justify-content: center;
    margin-top: 99px;
  }
  .Landing{
    display: flex;
    justify-content: center;
    color: #A1A3A5;
    font-size: 22px;
    font-weight: 700;
    line-height: 28px;
  }
  .prompt_relanding{
    display: flex;
    justify-content: center;
    margin-top: 30px;
    .prompt{
      width: 300px;
      font-size: 14px;
      line-height: 26px;
      font-weight: 400;
      color: #8A8986;
    }
  }
  .relan_ding{
    display: flex;
    justify-content: center;
    margin-top: 5px;

    .relanding{
      height: 38px;
      width: 300px;
      justify-content: center;
      align-items: center;
      display: flex;
      color: #ffffff;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 1.5px;
      border-radius: 20px;
      background-color: #ff7000;
    }
  }
}
</style>