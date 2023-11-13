<!--
 * @Author: Cable
 * @Date: 2021-01-29 17:21:36
 * @Description: 体育规则页面
-->
<template>
  <div class="rule-wrap">
    <simple-header>
      <span>{{$root.$t("common.sports_betting_rules")}}</span>
    </simple-header>
    <iframe class="rule-content" :src="rule_url" frameborder="0"></iframe>
  </div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import simpleHeader from "src/public/components/rule/simple_header.vue";

export default {
  name: "rule",
  components: {
    simpleHeader,
  },
  computed: {
    ...mapGetters({
      lang: "get_lang",
      vx_get_theme: "get_theme"
    }),
    /**
     * @Description 体育规则地址
     * @param {string}
    */
    rule_url(){
      let lang_map = {
        'en': 'en_gb',
        'zh': 'zh_cn',
        'tw': 'zh_tw',
        'vi': 'vi_vn',
        'th': 'th_th',
        'ms': 'ms_my',
        'ad': 'id_id',
        'es': 'en_gb',
        'pt': 'en_gb',
        'ko': 'en_gb',
        'mya':'en_gb',
      }
      let lang = lang_map[this.lang] || 'zh_cn';
      console.log(`================lang:${lang}`, this.lang);
      const current_env = window.env.config.current_env;
      let url = '';
      const theme = this.vx_get_theme.split('_')[0]
      const get_merchant_style = this.vx_get_theme.split('_')[1]
      let domain = _.get(window,`env.config.static_serve[0]`)
      if(current_env == 'idc_online'   || current_env == 'idc_ylcs'){
        // 生产环境 
        domain =  "https://sports-rules-new2-pro.8tx4s6g.com"
      } else if(current_env == 'idc_sandbox' || current_env == 'idc_pre' ){
        // 试玩环境
        domain ="https://sports-rules-new-shiwan.sportxxx3pk.com"

      }  else {
        // 其他环境，测试和开发 等
        // domain ="https://sports-rules-new-test.sportxxx3pk.com"
        domain ="https://sports-rules-new2-test.8tx4s6g.com"

      }
      if (!!get_merchant_style) {
        url = `${domain}/#/${lang}?themeColors=${theme}&sty=${get_merchant_style}&rdm=${new Date().getTime()}`;
      } else {
        url = `${domain}/#/${lang}?themeColors=${theme}&rdm=${new Date().getTime()}`;
      }
      console.log(`===========体育规则iframe的url值:${url}`, theme);
      return url;
    }
  }
};
</script>

<style lang="scss" scoped>
.rule-wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .rule-content {
    width: 100%;
    flex: 1;
    background-color: #fff;
  }
}
</style>
