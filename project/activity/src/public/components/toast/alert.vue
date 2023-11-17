<!--
 * @Author: Cable
 * @Date: 2020-07-31 16:14:55
 * @Description: 弹窗组件
-->

<template>
  <q-dialog v-model="is_show" :persistent="backDrop">
    <div class="dialog_content">
      <div class="alert-wrap">
        <img :src="imgSrc" alt="" width="100%">
        <!-- <icon class="close" name="icon-close" @click="close_alert" size="10px" color="#99A3B1"></icon> -->

        <div class="row items-center  relative-position">
          <div class="text">{{$root.$t("login.login_out_dear_user")}}</div>
          <!-- 域名错误弹窗 -->
          <template v-if="is_domain_error">
            <div class="page-lost">
              <img src="~public/image/common/png/page_lost.png" alt="">
              <div class="text1">{{$root.$t('common.user_api_limited1')}}</div>
              <div class="text2">{{$root.$t('common.user_api_limited2')}}</div>
            </div>
            <div class="btn" @click="refresh">{{$root.$t("common.refresh")}}</div>
          </template>
          <!-- 正确弹窗 -->
          <template v-else>
            <ul class="text-left  relative-position">
              <li>{{$root.$t("login.login_out_text1")}}</li>
              <li>{{$root.$t("login.login_out_text2")}}</li>
              <li>{{$root.$t("login.login_out_text3")}}</li>
            </ul>
            <div class="btn" @click="confirm">{{$root.$t("login.logout_alert_close")}}</div>
          </template>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { EMIT_SHOW_ALERT_CMD } from 'project/activity/src/public/utils/http/emit_cmd.js';

// 退出登录通知-中文
const logout_notice =   require('public/yazhou-pc/image/image/logout_notice.png');
// 退出登录通知-英文
const logout_notice_en = require('public/yazhou-pc/image/image/logout_notice_en.png');
// 退出登录通知-越南语
const logout_notice_vi = require('public/yazhou-pc/image/image/logout_notice_vi.png');
// 退出登录通知-泰语
const logout_notice_th = require('public/yazhou-pc/image/image/logout_notice_th.png');
// 退出登录通知-马来语
const logout_notice_ma = require('public/yazhou-pc/image/image/logout_notice_en.png');


export default {
  data() {
    return {
      is_show: false,//弹窗是否显示
      text: "",//弹窗内容
      btn_text:"", //弹层按钮文字
      backDrop: false, // 是否允许点击背景关闭弹窗
      lang: 'zh',
      imgSrc: logout_notice,
      is_domain_error:false, // 是否域名错误弹窗
    };
  },
  computed: {
    ...mapGetters({
      // 登录是否失效
      vx_get_is_invalid: "get_is_invalid",
    })
  },
  created() {
  	// 用户登录失效时,直接弹出失效框
    this.is_show = this.vx_get_is_invalid;
    this.$root.$on(EMIT_SHOW_ALERT_CMD, this.show_alert);
    this.$root.$on('domain_error_alert', this.domain_error_alert);
    if (window.frames.length == parent.frames.length) {
      console.log('非内嵌')
      this.backDrop = true;
      this.lang = window.vue.lang;
      if (this.lang == 'zh' || this.lang == 'tw') {
        this.imgSrc = logout_notice
      } else if (this.lang == 'vi') {
        this.imgSrc = logout_notice_vi
      } else if (this.lang == 'en') {
        this.imgSrc = logout_notice_en
      } else if (this.lang == 'th') {
        this.imgSrc = logout_notice_th
      } else if (this.lang == 'ms') {
        this.imgSrc = logout_notice_ma
      } else if (this.lang == 'ad') {
        this.imgSrc = logout_notice_en
      } else if(this.lang == 'ko'){
        this.imgSrc = logout_notice_en
      } else if(this.lang == 'mya'){
        this.imgSrc = logout_notice_en
      } else if(this.lang == 'es'){
        this.imgSrc = logout_notice_en
      }else if(this.lang == 'pt'){
        this.imgSrc = logout_notice_en
      }
    }
  },

  methods: {
    /**
     * @Description:显示弹窗
     * @param {object} data 弹窗内容
     * @return {undefined} undefined
     */
    show_alert(data) {
      this.text = data.text || "";
      if (this.text == "" || this.is_show) return;
      this.is_show = true;

      this.btn_text = data.btn_text || this.$root.$t('common.confirm')
      // 弹框时,关闭视频播放窗口
      this.$root.$emit('VIDEO_ZONE_EVENT_CMD',{cmd:"colse"});
      // this.callback = data.callback || function(){}
    },
    /**
     * @Description:域名错误弹窗
     * @return {undefined} undefined
     */
    domain_error_alert() {
      this.is_domain_error = true
      this.is_show = true;
      // 弹框时,关闭视频播放窗口
      this.$root.$emit('VIDEO_ZONE_EVENT_CMD',{cmd:"colse"});
    },

    /**
     * @Description:关闭弹窗
     * @return {undefined} undefined
     */
    close_alert(){
      this.is_show = false;
      this.text = "";
    },
    /**
     * @Description:确认弹窗回调
     * @return {undefined} undefined
     */
    callback(){
      if (window.frames.length != parent.frames.length) {
        console.log('在iframe里面');
      } else {
        console.log('不在 iframe里')
        this.backDrop = true;
        window.close();
      }
    },
    refresh(){
      location.reload()
    },
    /**
     * @Description:确认弹窗
     * @return {undefined} undefined
     */
    confirm(){
      this.is_show = false;
      this.text = "";
      this.callback()
    }
  },
  destroyed() {
    this.$root.$off(EMIT_SHOW_ALERT_CMD, this.show_alert);
    this.$root.$off('domain_error_alert', this.domain_error_alert);
  }
};
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
    padding: 12px 0 20px;
    background-color: #fff;
    position: relative;
    top: -27px;
    border-radius: 0 0 8px 8px;
    width: 320px;
  }
  .text {
    padding: 10px 20px 0;
    color: #343434;
    font-size: 18px;
    font-family: PingFangSC-Medium;
    position: relative;
    width: 100%;
    text-align: left;
    font-weight: 600;
    &::before {
      content: "";
      display: block;
      width: 34px;
      height: 3px;
      background-image: linear-gradient(-45deg, #ffeac0 0%, #fffaef 100%);
      position: absolute;
      top: 37px;
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
      background-image: linear-gradient(-45deg, #848484 0%, #cbcbcb 100%);
      width: 5px;
      height: 5px;
      position: absolute;
      border-radius: 50%;
      top: 9px;
      left: -10px;
    }
  }
  .page-lost{
    text-align: center;
    margin: auto;
    img{
      width: 170px;
    }
    .text1{
      color: #666;
      font-size: 14px;
    }
    .text2{
      color: #999;
      margin-bottom: 10px;
    }
  }
  .btn {
    width: 159px;
    height: 43px;
    line-height: 43px;
    color: #333333;
    border-radius: 22px;
    cursor: pointer;
    font-size: 18px;
    background-image: url("~public/image/wwwassets/yabo/image/btn.svg");
    margin: 0 auto;
    background-size: contain;
    background-color: transparent !important;
    background-repeat: no-repeat;
    background-position: center;
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

