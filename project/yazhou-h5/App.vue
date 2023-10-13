<!--
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 项目页面入口
-->

<template>
  <div id="q-app" class="theme0">
    <appload v-if="init_load"></appload>
  </div>
</template>
<script setup>



import _ from "lodash";
import appload from "./app-load.vue";
import apiDomain from "./apiDomain.js";
import STANDARD_KEY from "src/core/standard-key";

import { enter_params, compute_css_variables } from "src/core/index.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import MenuData from "src/core/menu-h5/menu-data-class.js";
import { http, AllDomain } from "src/core/http/";
import { loadLanguageAsync } from "src/core/index.js";
import { Quasar } from "quasar";
import { ref } from "vue";

const token_key = STANDARD_KEY.get("token"); //token键


const { DEFAULT_VERSION_NAME } = window.BUILDIN_CONFIG;
const init_load = ref(false); //用于加载是否完成

(async () => {
  try {
    // // 检测目前的系统类型ios,android,h5
    // window.platform_type = (Quasar.$q.platform.is.ios ? 'ios' : '') || (Quasar.$q.platform.is.android ? 'android' : '') || 'h5';

    let languageName = "zh";
    await loadLanguageAsync(languageName);
  } catch (error) {
    console.error('init', error);
  } finally {
    console.log(" init_domain --  开始执行:");
    // 实例化域名检测类对象
    AllDomain.create(() => {
      // 首次进入,发现最快的域名
      // http初始化方法 会调用 setApiDomain
      // ws和http域名切换逻辑
      http.setApiDomain();
   
      MenuData.init();
      BetData.init_core()
      BetViewDataClass.init()
      BetViewDataClass.init()
      enter_params()
      init_load.value = true;
    });
    AllDomain.run();
  }
})();
</script>

<style lang="scss"></style>
