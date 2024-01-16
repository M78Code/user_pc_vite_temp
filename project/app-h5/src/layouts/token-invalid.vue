<!-- @Description: token失效弹框 -->
<template>
    <div class="token-invalid fullscreen" @touchmove.prevent>
      <div class="box">
        <div class="tips flex-center">
          <img :src="app_token_tips" alt="">
        </div>
        <div class="center flex-center">
          <img :src="app_token_center" alt="">
        </div>
        <div class="txt-info">
          <div class="dear-user">{{ i18n_t("token_inv.dear_user") }}</div>
          <!-- 您的登录信息已失效, 请关闭本页面 -->
          <p>{{ i18n_t("token_inv.token_dis") }}</p>
          <!-- 再次重新进入本场馆 -->
          <p>{{ i18n_t("token_inv.reaccess") }}</p>
          <!-- 祝您游戏愉快 -->
          <p>{{ i18n_t("token_inv.play_happily") }}</p>
          <p></p>
        </div>
        <!-- 知道了 -->
        <footer>
          <p class="know" @click="is_go_vender_url(true)">{{ i18n_t("token_inv.confrim") }}</p>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
  import UserCtr from 'src/core/user-config/user-ctr.js'
  import { computed } from 'vue';
  import { useMittEmit, MITT_TYPES } from "src/core/mitt"
  import { i18n_t } from "src/boot/i18n.js";;
  
  import { invalid_url } from 'src/base-h5/assets/base64/index.js'
  
  import { app_token_tips, app_token_center } from 'src/base-h5/core/utils/local-image.js'
  
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
    z-index: 800000 !important;
    background-size: cover;
    background-image: url($SCSSPROJECTPATH+"/image/login/bg.png");
    display: flex;
    align-items: center;
    justify-content: center;
    .tips{
      // margin-top: 120px;
      > img{
        width: 150px;
        height: 46px;
      }
    }
    .center{
      margin-top: 20px;
      > img{
        height: 315px;
      }
    }
    .flex-center{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .token-expires {
      position: absolute;
      top: -5.3%;
      left: -7.45%;
      width: 3.335rem;
      height: 1.4rem;
      background-image: var(--q-color-com-img-bg-173);
      background-size: 100% 100%;
    }
  
    .token-vietnam {
      position: absolute;
      top: -5.3%;
      left: -7.45%;
      width: 3.335rem;
      height: 1.4rem;
      background-image: var(--q-color-com-img-bg-174);
      background-size: 100% 100%;
    }
  
    .token-english {
      position: absolute;
      top: -5.3%;
      left: -7.45%;
      width: 3.335rem;
      height: 1.4rem;
      background-image: var(--q-color-com-img-bg-175);
      background-size: 100% 100%;
    }
  
    .token-thai {
      position: absolute;
      top: -5.3%;
      left: -7.45%;
      width: 3.335rem;
      height: 1.4rem;
      background-image: var(--q-color-com-img-bg-176);
      background-size: 100% 100%;
    }
  
  
  
    .txt-info {
      border-radius: 0 0 6px 6px;
      padding-left: 0.4rem;
      margin-top: -10px;
  
      p:not(:last-child) {
        margin: 0 0.26rem 0.1rem 0.36rem;
        position: relative;
        font-size: 0.14rem;
        color: #666666;
        line-height: 0.2rem;
  
        &:after {
          content: "";
          display: block;
          position: absolute;
          width: 0.05rem;
          height: 0.05rem;
          left: -0.07rem;
          top: 0.065rem;
          transform: translateX(-50%);
          border-radius: 50%;
          background-image: linear-gradient(-45deg, #666666 0%, #d6d6d6 100%);
        }
      }
    }
  
    .dear-user {
      margin-left: 0.26rem;
      margin-bottom: 0.14rem;
      font-size: 18px;
      color: #333333;
      height: 0.3rem;
      line-height: 0.3rem;
      font-weight: 600;
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
  }
  </style>