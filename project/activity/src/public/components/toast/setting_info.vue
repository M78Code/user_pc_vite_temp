<!--
 * @Author: Tyrone
 * @Date: 2023-10-08
 * @Description: 弹窗组件
-->


<template>
  <q-dialog v-model="is_show" :persistent="backDrop">
    <div class="dialog_content setting-container">
      <div class="alert-wrap">
        <img :src="imgInfo.bg" class="sc-bg" />
        <div class="sc-title"><img :src="imgInfo.title" />{{$root.$t('common.touzhumoshi')}}</div>
        <div class="choose-container">
          <div
            :class="standard_edition == 1 ? 'on' : ''"
            @click="set_standard_edition(1)"
          >
            <img :src="imgInfo.item0" />
            <div>
              <h3>{{$root.$t('common.zhuanye')}}</h3>
              <p>{{$root.$t('common.gongnengwanshan')}}</p>
              <span v-if='standard_edition == 1' @click="confirm_standard_edition()">{{
                old_vesion == standard_edition ? $root.$t('common.continue') : $root.$t('common.change_to')+$root.$t('common.zhuanye')
              }}</span>
            </div>
            <i></i>
          </div>
          <div
            :class="standard_edition == 2 ? 'on' : ''"
            @click="set_standard_edition(2)"
          >
            <img :src="imgInfo.item1" />
            <div>
              <h3>{{$root.$t('common.xinshou')}}</h3>
              <p>{{$root.$t('common.yemianjianjie')}}</p>
              <span v-if='standard_edition == 2' @click="confirm_standard_edition()">{{
                old_vesion == standard_edition ? $root.$t('common.continue') : $root.$t('common.change_to')+$root.$t('common.xinshou')
              }}</span>
            </div>
            <i></i>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

const y0_bg = require("public/image/common/setting/bg_switch_day.png"); //蓝色版背景 y0
const y0_title = require("public/image/common/setting/icon_betmode_blue.png"); //蓝色版title y0
const y0_item0 = require("public/image/common/setting/sc_item0.png"); //蓝色版item 左侧 y0
const y0_item1 = require("public/image/common/setting/sc_item1.png"); //蓝色版item 左侧 y0

const y2_bg = require("public/image/common/setting/bg_switch_night_blue.png"); //蓝色版背景
const y2_title = require("public/image/common/setting/icon_betmode_blue.png"); //蓝色版title
const y2_item0 = require("public/image/common/setting/sc_item0_y2.png"); //蓝色版item 左侧
const y2_item1 = require("public/image/common/setting/sc_item1_y2.png"); //蓝色版item 左侧

const bg = require("public/image/common/setting/bg_switch_night_yellow.png"); //橙色版背景
const title = require("public/image/common/setting/icon_betmode_yellow.png");
const item0 = require("public/image/common/setting/sc_01.png");
const item1 = require("public/image/common/setting/sc_02.png");
export default {
  data() {
    return {
      is_show: false, //弹窗是否显示
      text: "", //弹窗内容
      btn_text: "", //弹层按钮文字
      backDrop: false, // 是否允许点击背景关闭弹窗
      lang: "zh",
      imgSrc: y0_bg,
      imgInfo: {
        bg: y0_bg,
        item0: y0_item0,
        item1: y0_item1,
        title: y0_title,
      },
      is_domain_error: false, // 是否域名错误弹窗
      old_vesion: localStorage.getItem("version_now"),
      standard_edition: "",
    };
  },
  computed: {
    ...mapGetters({
      // 登录是否失效
      vx_get_is_invalid: "get_is_invalid",
      //获取当前主题
      get_theme: "get_theme",
      //获取当前版本状态  // 1专业  2 新手
      get_version: "get_version",
    }),
  },
  created(){
    const userid = sessionStorage.getItem("user_id");
    let data = JSON.parse(localStorage.getItem("setting_modal_info")) || {};
    if (data[userid]) {
      this.is_show = false;
    } else {
      this.is_show = true;
    }
  },
  mounted() {
    this.standard_edition = this.get_version;
    if(this.get_theme=='theme02_y0'){//蓝色黑夜版本
      this.imgInfo= {
        bg: y2_bg,
        item0: y2_item0,
        item1: y2_item1,
        title: y2_title,
      }
    }
     if(this.get_theme=='theme02'){//橙色色黑夜版本
      this.imgInfo= {
        bg: bg,
        item0: item0,
        item1: item1,
        title: title,
      }
    }
  },

  methods: {
    ...mapActions({
      set_version: "set_version", // 设置专业版、新手版切换
    }),
    set_standard_edition(e) {
      this.standard_edition = e;
    },
    /**
     * @Description:显示弹窗
     * @param {object} data 弹窗内容
     * @return {undefined} undefined
     */
    show_alert(data) {
      this.text = data.text || "";
      if (this.text == "" || this.is_show) return;
      this.is_show = true;

      this.btn_text = data.btn_text || this.$root.$t("common.confirm");
      // 弹框时,关闭视频播放窗口
      this.$root.$emit("VIDEO_ZONE_EVENT_CMD", { cmd: "colse" });
      // this.callback = data.callback || function(){}
    },
    /**
     * @Description:关闭弹窗
     * @return {undefined} undefined
     */
    close_alert() {
      this.is_show = false;
      this.text = "";
    },
    /**
     * @Description:确认弹窗回调
     * @return {undefined} undefined
     */
    callback() {
      if (window.frames.length != parent.frames.length) {
        console.log("在iframe里面");
      } else {
        console.log("不在 iframe里");
        this.backDrop = true;
        window.close();
      }
    },
    confirm_standard_edition() {
      this.close_animate = true;
      const userid = sessionStorage.getItem("user_id");
      let data = JSON.parse(localStorage.getItem("setting_modal_info")) || {};
      if (!data[userid]) {
        data[userid] = {};
      }
      data[userid].is_show = false;
      localStorage.setItem("setting_modal_info", JSON.stringify(data));
      setTimeout(() => {
        this.is_show = false;
        this.set_version(this.standard_edition);
        if (this.menu_data.match_tpl_number != 18) {
          setTimeout(() => {
            this.$emit("on_refresh");
          }, 300);
        }
      }, 1000);
    },
    refresh() {
      location.reload();
    },
    /**
     * @Description:确认弹窗
     * @return {undefined} undefined
     */
    confirm() {
      this.is_show = false;
      this.text = "";
      this.callback();
    },
  },
  destroyed() {
    // this.$root.$off(this.emit_cmd.EMIT_SHOW_ALERT_CMD, this.show_alert);
    // this.$root.$off("domain_error_alert", this.domain_error_alert);
  },
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
  .page-lost {
    text-align: center;
    margin: auto;
    img {
      width: 170px;
    }
    .text1 {
      color: #666;
      font-size: 14px;
    }
    .text2 {
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
@keyframes scaleAnimation {
  // 动画设置
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
    top: 100px !important;
  }
}

.setting-modal {
  background: rgba(40, 40, 40, 0.8);
  &.close_animate {
    animation-name: scaleAnimation; // 动画名
    animation-duration: 1s; // 动画时长
    animation-iteration-count: infinite; // 永久动画
    transition-timing-function: ease-in-out; // 动画过渡
  }
}
.txt-info {
  width: 3.335rem;
  height: 3.36rem;
  .choose-item {
    // display: flex;
    height: 200px;
    position: relative;
    top: 60px;
    z-index: 99;
    text-align: center;
    p {
      color: #000;
      margin-bottom: 20px;
      word-break: break-all;
      white-space: initial;
      line-height: 1;
    }
    b {
      font-size: 16px;
    }
    // justify-content:space-between;
    div {
      display: inline-block;
      vertical-align: top;
      width: 45%;
      margin: 0 2%;
      position: relative;
      background: #fff;
      border-radius: 20px;
      background: #fff;
      border: 2px solid #fff;
      padding: 10px;
      &.on {
        border: 2px solid #3d72fa;
      }
      .all-bg {
        width: 80%;
      }
      .pro-bg {
        position: absolute;
        bottom: 10px;
        left: 0;
      }
      .new-bg {
        position: absolute;
        bottom: 10px;
        left: 0;
      }
      img {
        width: 100%;
      }
    }
  }
  h2 {
    font-size: 22px;
    text-align: center;
    position: absolute;
    top: 20px;
    left: 50%;
    height: 22px;
    color: #000;
    font-weight: bold;
    line-height: 22px;
    display: inline-block;
    z-index: 99;
    transform: translateX(-50%);
  }
  .cs-bg {
    position: absolute;
    width: 100%;
    height: auto;
    top: 0;
    left: 0;
  }
  .cs-btn {
    text-align: center;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    span {
      display: inline-block;
      color: #fff;
      border-radius: 8px;
      background: #3662ec;
      min-width: 160px;
      min-height: 42px;
      line-height: 42px;
      text-align: center;
    }
  }
}
.setting-container {
  width: 980px;
  height: 460px;
  max-width: 980px;
  position: relative;
  background: #fff;
  overflow: hidden;
  border-radius: 20px;
  .sc-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 0;
  }
  .sc-title {
    height: 40%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 20px;
    text-align: center;
    color:var(--qq--popup-setting-text-color-active);
    img {
      width: 40px;
      height: auto;
      position: relative;
      top: 12px;
      margin-right: 10px;
    }
    font-size: 30px;
  }
  .choose-container {
    position: absolute;
    z-index: 99;
    width: 980px;
    left: 0;
    bottom: 50px;
    padding: 0 20px;
    display: flex;
    & > div {
      width: 460px;
      height: 310px;
      border-radius: 20px;
      background: var(--qq--popup-setting-item-color);
      padding: 10px;
      text-align: left;
      border:2px solid var(--qq--popup-setting-item-border-color);
      cursor: pointer;
      position: relative;
      overflow: hidden;
      h3 {
        font-size: 20px;
        margin: 0;
        color:var(--qq--popup-setting-text-color-active);
        font-weight: 550;
      }
      p {
        font-size: 14px;
        color:var(--qq--popup-setting-item-p-color);
        margin-top:-6px;
      }
      & > div {
        position: relative;
        top: -10px;
        margin: 0 40px;
        span {
          display: inline-block;
          background: var(--qq--popup-wrap-text-color-active);
          color: #fff;
          height: 30px;
          line-height: 30px;
          padding: 0px 20px;
          border-radius: 20px;
          position: absolute;
          right: 0;
          bottom: 0;
        }
      }
      img {
        height: 218px;
        width: 100%;
      }
      &:last-child {
        margin-left: 20px;
      }
      border-width: 2px;
      .text{
        color: var(--qq--popup-setting-item-text-color);
      }
      &.on {
        border: 2px solid var(--qq--popup-wrap-text-color-active);
        background: var(--qq--popup-setting-item-on-color);
        h3 {
          color: var(--qq--popup-wrap-text-color-active);
        }
        p{
          color:var(--qq--popup-setting-item-p-on-color);
        }
        i {
          width: 26px;
          height: 26px;
          background: var(--qq--popup-wrap-text-color-active);
          border-top-left-radius: 20px;
          position: absolute;
          right: 0;
          bottom: 0;
        }
      }
    }
  }
}
</style>
