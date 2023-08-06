<!--
 * @Description: 自动接受更好赔率规则弹框
-->
<template>
  <!-- 自动接受更好赔率规则 -->
  <div class="accept-rules fullscreen" >
    <div class="fixed-center content-box">
      <header>自动接受更好赔率</header>

      <footer @click="change_show">我知道了</footer>
    </div>
  </div>
</template>

<script setup>
import {ref ,reactive,provide,onMounted,watch,computed} from 'vue'
import EMITTER from  "src/global/mitt.js"

// 点击键盘
const change_show = () => {
  EMITTER.emit("change_accept", false)
}



</script>

<style lang="scss" scoped>
.accept-rules {
  text-align: center;
  z-index: 800000 !important;
  white-space: pre-wrap;
  background: rgba(0, 0, 0, 0.9);
}
.content-box {
  border-radius: 0.16rem;
  width: 30rem;
  padding: 0.16rem 0;
  &.hengping-content-box {
    height: 3rem;
    overflow: auto;
    * {
      // color: #999 !important;
    }
    p {
      :first-child {
        color: #fff !important;
      }
    }
  }
}
.content-box > p {
  margin: 0.12rem 0.2rem;
  font-size: 0.14rem;
  text-align: left;
}
.content-box > header {
  font-size: 0.16rem;
  letter-spacing: 0;
  margin: 0 0.2rem;
  font-weight: 600;
  color: salmon;
}
.content-box > footer {
  font-size: 0.16rem;
  margin-bottom: -0.06rem;
  padding: 0.13rem 0.2rem 0;
  color: yellow;
}

p > span:not(.chu) {
  text-align: center;
  display: inline-block;
  width: 0.16rem;
  height: 0.16rem;
  line-height: 0.18rem;
  border-radius: 8px 0 8px 0;
  margin-right: 0.08rem;
}
.chu {
  font-weight: bold;
}
</style>
