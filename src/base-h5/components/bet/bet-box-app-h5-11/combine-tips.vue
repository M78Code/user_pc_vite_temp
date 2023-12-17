<!--
 * @Description: 合并投注项提示框
-->
<template>
  <div class="combine-tips fullscreen" @click.self="show_hebing_alert" @touchmove.prevent>
    <div class="main-box fixed-center text-center">
      <header class="text-bold yb_fontsize16">{{ i18n_t('tips.msg1') }}</header>
      <p class="text-left yb_fontsize14"></p>
      <footer class="yb_fontsize16"><span class="padding10" @click.self="show_hebing_alert"></span></footer>
    </div>
  </div>
</template>

<script setup>
import EMITTER from  "src/global/mitt.js"


// 点击合并投注项的弹窗
const show_hebing_alert = () => {
  EMITTER.emit("change_combine_tips", false)
}

</script>



<style lang="scss" scoped>
.combine-tips {
  z-index: 8000 !important;
  background: rgba(0, 0, 0, 0.8);
}
.main-box {
  // width: 3.2rem;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  border-radius: 0.1rem;
  padding: 0.3rem 0.2rem 0;
  color: #fff;
  p {
    line-height: 0.24rem;
    margin: 0.2rem 0;
    text-indent: 0.28rem;
  }

  footer {
    margin-bottom: 0.3rem;
  }
}
</style>