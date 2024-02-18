<!-- @Description: token失效弹框 -->
<template>
  <div class="token-invalid fullscreen" @click.self="isgo_vender_url(false)" @touchmove.prevent>
    <div class="fixed-center">
      <div :class="token_bg" :style="{ 'background-image': `url(${token_bg_url})` }"></div>
      <div class="txt-info">
        <div class="dear-user">{{ i18n_t("token_inv.dear_user") }}</div>
        <!-- 您的登录信息已失效, 请关闭本页面 -->
        <img :src="token_bg_middle_url">
        <!-- 再次重新进入本场馆 -->
        <span class="head-text">{{ i18n_t("msg.msg_nodata_20") }}</span>
        <!-- 别紧张 -->
        <span>{{ i18n_t("msg.msg_nodata_21") }}</span>
        <!-- 知道了 -->
        <p class="know" @click="refresh()">{{ i18n_t("footer_menu.refresh") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
// TODO:
import { invalid_url } from 'src/output/index.js'
;
//国际化


const emit = defineEmits(['isgo_vender_url'])
// TODO: 改为真实的store替换
const { get_settle_dialog_bool, get_lang } = useStore()

/** 失效国际化背景图对应 */
const token_bg = computed(() => {
  switch (get_lang) {
    case 'vi':
      return 'token-vietnam'
    case 'zh':
    case 'hk':
    case 'tw':
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
/** 失效国际化背景图对应(base64) */
const token_bg_url = computed(() => invalid_url.top[get_lang])
/** 失效背景（中间） */
const token_bg_middle_url = computed(() => invalid_url.middle)

/**
  * @description 返回app壳或者返回到商户登录页
  * @param {Boolean} value 是否返回到登录或首页
  * @return {Undefined} undefined
  */
function refresh() {
  location.reload();
}

</script>

<style lang="scss" scoped>
.token-invalid {
  z-index: 800000 !important;

  .fixed-center {
    padding-top: 1.23rem;
    width: 2.9rem;
    border-radius: 0.16rem;
    background-color: #ffffff;
  }

  //  使用css变量统一管理，所以废弃这里代码，转为不遍历
  // @each $expires in expires, vietnam, english, thai {
  //   .token-#{$expires} {
  //     position: absolute;
  //     top: -5.3%;
  //     left: -7.45%;
  //     width: 3.335rem;
  //     height: 1.4rem;
  //     background-image: url($SCSSPROJECTPATH + "/image/bw3/png/token_#{$expires}.png");
  //     background-size: 100% 100%;
  //   }
  // }
 
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
    padding-bottom: 0.2rem;
    background-color: #ffffff;
    border-radius: 0 0 6px 6px;

    img {
      width: 1.7rem;
      height: 1.2rem;
    }

    .head-text {
      font-family: PingFangSC-Medium;
      font-size: .14rem;
      color: #666666;
    }

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center
  }

  .dear-user {
    margin-left: 0.26rem;
    margin-bottom: 0.14rem;
    font-size: 18px;
    color: #333333;
    height: 0.3rem;
    line-height: 0.3rem;
    font-weight: 600;
    text-align: left;
    width: 100%;

    &:after {
      content: "";
      display: block;
      position: absolute;
      width: 0.34rem;
      height: 0.03rem;
      left: 0.43rem;
      transform: translateX(-50%);
      background-image: linear-gradient(-45deg, #ffebc3 0%, #fffcf6 100%);
      border-radius: 1.5px;
    }
  }

  .know {
    background-image: linear-gradient(0deg,
        #f7f8f8 0%,
        #e3e3e3 31%,
        #ffffff 100%);
    border: 1px solid #d3d3d3;
    width: 1.59rem;
    height: 0.43rem;
    line-height: 0.43rem;
    margin: 0 auto;
    margin-top: 0.16rem;
    text-align: center;
    font-size: 0.16rem;
    color: #333333;
    border-radius: 0.215rem;
    font-weight: 600;
  }
}
</style>