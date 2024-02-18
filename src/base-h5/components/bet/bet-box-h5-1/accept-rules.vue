<!--
 * @Author: Router
 * @Description: 自动接受更好赔率规则弹框
-->
<template>
  <!-- 自动接受更好赔率规则 -->
  <div class="accept-rules fullscreen" @click.self="change_show" @touchstart="touchstart_handle($event)">
    <div class="fixed-center content-box" :class="{'hengping-content-box': get_is_hengping}">
      <header>{{ i18n_t("ac_rules.auto")}}</header>
      <p><span>1</span> {{ i18n_t('accept_rules.if_bet_when') }}<span class="chu">{{ i18n_t('accept_rules.increased_odds')}}</span> ，{{ i18n_t('accept_rules.system_default') }}<span class="chu">{{ i18n_t('accept_rules.accept_odds')}}</span>，{{ i18n_t('accept_rules.will_interrupt_behavior') }}</p>
      <p><span>2</span>{{ i18n_t('accept_rules.if_bet_when') }}<span class="chu">{{ i18n_t('accept_rules.lower_odds')}}</span>，{{ i18n_t('accept_rules.system_default') }}<span class="chu">{{ i18n_t('accept_rules.do_not_accept_odds')}}</span>，{{ i18n_t('accept_rules.interrupt_your_betting') }}</p>
      <p><span>3</span>{{ i18n_t('accept_rules.if') }}<span class="chu">{{ i18n_t('accept_rules.feature_not_checked')}}</span>，{{ i18n_t('accept_rules.system_will_think') }}<span class="chu">{{ i18n_t('accept_rules.automatically_odds')}}</span>{{ i18n_t('accept_rules.matter_placing_content') }}</p>
      <p v-if="get_chat_bet"><span>4</span>{{ i18n_t('accept_rules.chat_msg')}}</p>
      <footer @click="change_show">{{ i18n_t("ac_rules.understand")}}</footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BetData from "src/core/bet/class/bet-data-class.js";


const get_is_hengping = ref()
const get_chat_bet = ref()
const change_show = () =>{
  //vuex
  BetData.set_accept_show(false)
}

/**
 *@description 阻止滑动穿透触摸移动事件
  *@param {Object} evt 事件对象 
  */
  const touchstart_handle = (evt)=> {
  if (get_is_hengping.value) {
    evt.preventDefault()
    if (evt.target.classList.contains('accept-rules') || evt.target.tagName == 'FOOTER') {
      change_show()
    }
  }
}

</script>
<style lang="scss" scoped>
.accept-rules {
  text-align: center;
  z-index: 8000 !important;
  white-space: pre-wrap;
  background: rgba(0, 0, 0, 0.3);
}
.content-box {
  border-radius: 0.16rem;
  width: 3.4rem;
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
}
.content-box > footer {
  font-size: 0.16rem;
  margin-bottom: -0.06rem;
  padding: 0.13rem 0.2rem 0;
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
