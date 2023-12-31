 
<template>
  <q-dialog v-model="isShow">
    <div class="dialog_content">
      <!-- <div class="alert-wrap">
        <img  :src="`${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/image/image/logout_notice.png`"  alt="" width="100%">

        <div class="row items-center relative-position">
          <div class="text">{{i18n_t("login.login_out_dear_user")}}</div>
          <ul class="text-left relative-position" v-if="!isMaintaining">
            <li>{{i18n_t("login.login_out_text1")}}</li>
            <li>{{i18n_t("login.login_out_text2")}}</li>
            <li>{{i18n_t("login.login_out_text3")}}</li>
          </ul>
          <ul class="text-left" v-else>
            <li>活动现已维护，感谢您的支持</li>
          </ul>
          <div class="btn" @click="confirm">{{i18n_t("login.logout_alert_close")}}</div>
        </div>
      </div> -->
    </div>
  </q-dialog>
</template>
<script>
import { MITT_TYPES, useMittEmit } from "project_path/src/core/index.js";
export default {
  name: 'Alert',
  props: {
    text: {
      type: String,
      default: '账户信息已过期,请重新登录'
    },
    is_show: {
      type: Boolean,
      default: false
    },
    isMaintaining: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    is_show: {
      handler(n) {
        this.isShow = n;
        if(n){
          // 隐藏loading动画背景
          useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD, 0);
        }
      }
    },
    text: {
      handler(n) {
        this.alertText = n == '' ? '账户信息已过期,请重新登录' : n;
      }
    }
  },
  data() {
    return {
      isShow: false,
      alertText: '账户信息已过期,请重新登录'
    }
  },
  methods: {
    close_alert(){
      this.isShow = false;
      this.alertText = "";
      window.close()
    },
    confirm(){
      if (this.isMaintaining) {
   
      }
      this.isShow = false;
      this.alertText = "";
    }
  }
}
</script>

<style lang="scss" scoped>
/** 弹窗样式 -S*/
.dialog_content {
  box-shadow: none !important;
}
.alert-wrap {
  text-align: center;
  border-radius: 4px;
  width: 380px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-position: top center;
  background-size: 100%;
  background-repeat: no-repeat;
  .items-center {
    width: 320px;
    padding: 12px 0 20px;
    background-color: #fff;
    position: relative;
    top: -27px;
    border-radius: 0 0 8px 8px;
  }
  .text {
    width: 320px;
    padding: 0 20px;
    color: #333;
    font-size: 18px;
    font-family: PingFangSC-Medium;
    position: relative;
    text-align: left;
    font-weight: 600;
    &::before {
      content: "";
      display: block;
      width: 34px;
      height: 3px;
      background-image: linear-gradient(-45deg, #ff7000 0%, #FF7000 100%);
      position: absolute;
      top: 33px;
      border-radius: 2px;
      z-index: 9;
    }
  }
  .text-left {
    font-size: 16px;
    color: #3c4551;
    list-style: none;
    padding: 30px 20px 20px 30px;
    margin: 0;
    li {
      position: relative;
      margin-bottom: 13px;
      font-family: PingFangSC-Regular;
    }
    li::before {
      content: "";
      display: block;
      background-image: linear-gradient(-45deg, #ff7000 0%, #FF7000 100%);
      width: 5px;
      height: 5px;
      position: absolute;
      border-radius: 50%;
      top: 9px;
      left: -10px;
    }
  }
  .btn {
    width: 159px;
    height: 43px;
    line-height: 43px;
    color: #fff;
    border-radius: 22px;
    cursor: pointer;
    font-size: 18px;
    background-image: linear-gradient(-45deg, #ff7000 0%, #FF7000 100%);
    margin: 0 auto;
  }
  .close {
    cursor: pointer;
    position: absolute;
    right: 17.6px;
    top: 17.6px;
  }
}
/** 弹窗样式 -E*/
</style>
