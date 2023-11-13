<!--
 * @Author: 
 * @Date: 2021-09-30 19:02:07
 * @Description: 
 * @Path: 
-->
<template>
  <!-- 弹窗封装 -->
  <q-dialog v-model="is_show" :persistent="backDrop">
    <div class="dialog_content">
      <div class="confirm-wrap">        
        <div class="row items-center">
          <!-- 左侧文案           -->
          <ul class="text-left">
            <li>{{text}}</li>
          </ul>
          <!-- 关闭按钮 -->
          <div class="btn" @click="confirm">{{$root.$t("login.logout_alert_close")}}</div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      is_show: false,//弹窗是否显示
      text: "",//弹窗内容
      btn_text:"", //弹层按钮文字
      backDrop: false // 是否允许点击背景关闭弹窗
    };
  },
  created() {
    this.$root.$on(this.emit_cmd.EMIT_SHOW_CONFIRM_CMD, this.show_confirm);
    // 判断是非内嵌模式
    if (window.frames.length == parent.frames.length) {
      this.backDrop = true;
    }
  },

  methods: {
    /**
     * @Description:显示弹窗
     * @param {object} data 弹窗内容
     * @return {undefined} undefined
     */
    show_confirm(data) {
      this.text = data.text || "";
      if (this.text == "" || this.is_show) return;
      this.is_show = true;

      this.btn_text = data.btn_text || this.$root.$t('common.confirm')
      // this.callback = data.callback || function(){}
    },
    /**
     * @Description:关闭弹窗
     * @return {undefined} undefined
     */
    close_confirm(){
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
    /**
     * @Description:确认弹窗
     * @return {undefined} undefined
     */
    confirm(){
      this.is_show = false;
      this.text = "";
      // this.callback()
    }
  },
  destroyed() {
    this.$root.$off(this.emit_cmd.EMIT_SHOW_CONFIRM_CMD, this.show_confirm);
  }
};
</script>

<style lang="scss" scoped>
/** 弹窗样式 -S*/
.dialog_content {
  box-shadow: none !important;
}
.confirm-wrap {
  text-align: center;
  border-radius: 4px;
  width: 280px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  .items-center {
    padding: 3px 0 20px;
    background-color: #fff;
    position: relative;
    border-radius: 4px;
    width: 280px;
  }
  .text {
    padding: 10px 20px 0;
    color: #343434;
    font-size: 14px;
    font-family: PingFangSC-Medium;
    position: relative;
    width: 100%;
    text-align: center;
    font-weight: 600;
  }
  .text-left {
    width: 100%;
    font-size: 14px;
    text-align: center;
    color: #3c4551;
    list-style: none;
    padding: 30px 20px 20px 30px;
    margin: 0;
    li {
      position: relative;
      margin-bottom: 13px;
      font-family: PingFangSC-Regular;
    }
  }
  .btn {
    width: 184px;
    height: 36px;
    line-height: 36px;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin: 0 auto;
    background: #FF7000 !important;
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


