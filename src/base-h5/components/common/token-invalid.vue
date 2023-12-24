<!-- @Description: token失效弹框 -->
<template>
  <div class="token-invalid fullscreen" v-if="is_show" @click.self="isgo_vender_url(false)" @touchmove.prevent>
    <div class="fixed-center">
      <div :class="token_bg" :style="{ 'background-image': `url(${token_bg_url})` }"></div>
      <div class="txt-info">
        <div class="dear-user">{{ i18n_t("token_inv.dear_user") }}</div>
        <!-- 您的登录信息已失效, 请关闭本页面 -->
        <p>{{ i18n_t("token_inv.token_dis") }}</p>
        <!-- 再次重新进入本场馆 -->
        <p>{{ i18n_t("token_inv.reaccess") }}</p>
        <!-- 祝您游戏愉快 -->
        <p>{{ i18n_t("token_inv.play_happily") }}</p>
        <!-- 知道了 -->
        <p class="know" @click="isgo_vender_url(true)">{{ i18n_t("token_inv.confrim") }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed,ref,onUnmounted  } from 'vue';
import { useMittEmitterGenerator, useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'

// TODO:
// import { mapMutations, mapGetters } from 'vuex';
// import { invalid_url } from 'src/output/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import { i18n_t} from "src/boot/i18n.js";;
//国际化


export default defineComponent({
  name: 'token_invalid',
  emits:['isgo_vender_url'],
  setup(_,{emit}) {
    // TODO: 改为真实的store替换
    // const { get_settle_dialog_bool, get_lang } = useStore()
    /** 失效国际化背景图对应 */
    const token_bg = computed(() => {
      switch (UserCtr.lang) {
        case 'vi':
          return 'token-vietnam'
        case 'zh':
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
    // invalid_url.top[get_lang]
    const token_bg_url = computed(() => "")
    const is_invalid = ref(UserCtr.is_invalid)
    /* 是否展示 */
    const is_show = ref(false)
    /**
     * @Description:显示弹窗
     * @param {object} data 弹窗内容
     * @return {undefined} undefined
     */
    function show_alert() {
      if (is_show.value) return;
      is_show.value = true;
    }
  /* 监听mitt */
    const { emitters_off } = useMittEmitterGenerator([
      {
        /* 打开弹窗 */
        type: MITT_TYPES.EMIT_SHOW_ALERT_CMD,
        callback: show_alert
      }
    ])

    /**
     * @description 返回app壳或者返回到商户登录页
     * @param {Boolean} value 是否返回到登录或首页
     * @return {Undefined} undefined
     */
    function isgo_vender_url(value) {
      is_show.value=false;
      // TODO: store方法待完善
      // set_bet_obj({});
      // set_bet_list([]);
      // set_show_video(false);
      // //投注记录框出来时，点击让消失
      // if (get_settle_dialog_bool) {
      //   useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, false)
      // }
      //调用安卓或者ios的方法，告知token失效
      if (window.android && window.android.callAndroid || window.callIOSSwitcher) {
        if (/android/i.test(navigator.userAgent) && window.Switcher) {
          Switcher.callAndroidSwitcher({ code: 1, data: "" });
        } else if (/ipad|iphone|iPod|iOS|mac/i.test(navigator.userAgent) && window.callIOSSwitcher) {
          callIOSSwitcher({ code: 1, data: "" });
        }
      } else {
        emit('isgo_vender_url', value)
      }
    }
    onUnmounted(emitters_off)
    return {is_show,
      token_bg,
      token_bg_url,
      isgo_vender_url
    }
  },
  methods: {
    // TODO:
    // ...mapMutations(['set_bet_obj', 'set_bet_list', "set_show_video"]),
  }
})

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
  //     background-image:  url($SCSSPROJECTPATH + "/image/bw3/png/token_#{$expires}.png");
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
    margin-top: 0.26rem;
    text-align: center;
    font-size: 0.16rem;
    color: #333333;
    border-radius: 0.215rem;
    font-weight: 600;
  }
}
</style>