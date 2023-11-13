<!--
 * @Date: 2021-05-05 16:45:10
 * @FilePath: /user-pc1/src/public/components/activity/model.vue
 * @Description:
 * @Author:
-->
<template>
  <div class="model">
    <div class="m-wrap">
      <!-- 改为欧洲杯活动的图片 -->
      <div class="model-bg">
        <img :src="imgUrl" style="margin-right: 10px" class="model-bg" @click="openPage" alt="">
        <p class="text-center text-white" style="font-size: 15px;margin-top: 20px">{{imgShowTimer}}</p>
      </div>
      <img src="~public/image/yabo/png/activity-close.png" alt="" class="close-btn" :class="{'btn_monsein': anim_class == 1, 'btn_mouseout': anim_class == 2}" @mouseenter="btn_mouse(1)" @mouseout="btn_mouse(2)">
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed:{
    ...mapGetters({
      vx_get_user:"get_user"
    })
  },
  props: {
    // 图片链接
    imgUrl: {
      type: String,
      default: ''
    },
    // 是否允许点击跳转
    allowClick: {
      type: Boolean,
      default: false,
    },
    // 0：无连接，1：内部导航，2：弹窗连接
    urlType: {
      type: String,
      default: ''
    },
    
    // 首页弹窗配置标识符，多活动并存时用来判断跳转到哪个链接
    hostUrl: {
      type: String,
      default: 'act'
    },
    // 弹窗展示时间文案倒计时
    imgShowTimer: String,
  },
  data() {
    return {
      // 商户名称
      merchantName: _.get(this.vx_get_user,'merchantName'),
      isShow: false,
      anim_class: 0,
    }
  },
  created() {
    this.merchantName = _.get(this.vx_get_user,'merchantName')
    if (this.$route.path == '/home') {
      window.localStorage.setItem('home_url', window.location.origin);
    }
  },
  methods: {
    /**
     * 点击打开新页面
     */
    openPage() {
      // 如果允许点击就发送事件去打开新页面
      if (this.allowClick == true) {
        this.$root.$emit('showModel', this.hostUrl, this.urlType)
      }
    },
    /**
     * 关闭按钮添加动画
     */
    btn_mouse(type) {
      this.anim_class = type;
    }
  },
}
</script>
<style lang="scss" scoped>
.model {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10010;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  .m-wrap {
    display: flex;
    justify-content: center;
    .model-bg {
      width: 720px;
    }
    .close-btn {
      width: 28px;
      height: 28px;
      margin-top: 40px;
    }
    .btn_monsein {
      transform: rotate(90deg);
      transition: all 0.5s;
    }
    .btn_mouseout {
      transform: rotate(0deg);
      transition: all 0.5s;
    }
  }
}
</style>
