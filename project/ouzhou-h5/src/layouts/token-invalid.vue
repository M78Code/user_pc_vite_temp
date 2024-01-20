<!-- @Description: token失效弹框 -->
<template>
  <div class="token-invalid fullscreen" @touchmove.prevent>
    <div class="box">
      <div class="tips">
        <img :src="ouzhou_token_tips" alt="">
      </div>

      <!-- 知道了 -->
      <!-- <footer>
        <p class="know" @click="is_go_vender_url(true)">{{ i18n_t("token_inv.confrim") }}</p>
      </footer> -->
    </div>
  </div>
</template>

<script setup>
import UserCtr from 'src/core/user-config/user-ctr.js'
import { computed } from 'vue';
import { useMittEmit, MITT_TYPES } from "src/core/mitt"
import { i18n_t } from "src/boot/i18n.js";;

import { invalid_url } from 'src/base-h5/assets/base64/index.js'

import { ouzhou_token_bg, ouzhou_token_tips } from 'src/base-h5/core/utils/local-image.js'

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
  // z-index: 800000 !important;
  background-size: cover;
  // background-image: url($SCSSPROJECTPATH+"/image/login/bg.png");
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

    .box{
      width: 320px;
      height: 320px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-image: url($SCSSPROJECTPATH+"/image/list/ouzhou_token_bg.png");
      background-size: 100% 100%;


      .tips{
        >img{
          width: 220px;
        }
      }
    }
  }


  footer{
    .know {
      background: rgba(23, 156, 255, 1);
      border: 1px solid #d3d3d3;
      width: 2.4rem;
      height: 0.32rem;
      line-height: 0.32rem;
      margin: 0 auto;
      margin-top: 0.26rem;
      text-align: center;
      font-size: 0.13rem;
      color: #fff;
      border-radius: 0.215rem;
    }
  }

</style>