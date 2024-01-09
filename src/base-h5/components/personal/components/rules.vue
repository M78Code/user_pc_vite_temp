<template>
    <div class="rule_page">
      <iframe class="rules-iframe" :src="rule_url" frameborder="0" />
      <!-- <section>
        <div class="title">General Sports Explanation</div>
        <q-scroll-area style="height: 100%;">
          <collapse v-for="(item,index) in rules_list" :key="index" :title="item.title">
            <template v-slot:content>
              <div class="content">
                {{ item.content }}
              </div>
            </template>
            <div>{{ item.content }}</div>
          </collapse>
        </q-scroll-area>
      </section> -->
    </div>
  </template>
   
  <script setup>
  import { ref, onMounted } from 'vue'
  import UserCtr from 'src/core/user-config/user-ctr.js'
    /** 环境变量 */
    const current_env = window.BUILDIN_CONFIG.CURRENT_ENV
    /** 体育规则地址-PC */
    const rule_url = ref('')
    /** 获取pc体育规则地址 */
    const get_pc_rule_url = () => {
        const lang_map = {
            'en': 'en_gb',
            'zh': 'zh_cn',
            'tw': 'zh_tw',
            'vi': 'vi_vn',
            'th': 'th_th',
            'ms': 'ms_my',
            'ad': 'id_id',
        }
        const lang2 = lang_map[UserCtr.lang] || 'zh_cn';
        let url = '';
        const [theme2, get_merchant_style] = UserCtr.theme.split('_')
        let domain = UserCtr.get_topic_key_url('sports_rules');
        // if (current_env == 'idc_online' || current_env == 'idc_ylcs') {
        //     // 生产环境
        //     domain = "https://9wutrx6jpfaslmvi.9ps7bak.com"
        // } else if (current_env == 'idc_sandbox' || current_env == 'idc_pre') {
        //     // 试玩环境
        //     // domain = "https://sports-rules-new-shiwan.sportxxx3pk.com"
        //     domain = "http://sports-rules-ouzhou-test.sportxxx3pk.com"

        // } else {
        //     // 其他环境，测试和开发 等
        //     domain = "http://sports-rules-ouzhou-test.sportxxx3pk.com"

        // }
        let obj = {rdm:(new Date().getTime())};
        obj.source = 'ouzhou';
        if (!!get_merchant_style) {
            obj.sty = get_merchant_style;
            obj.themeColors = theme2;
        } else {
            obj.themeColors = theme2;
        }
        let param = UserCtr.get_user_url_parames(obj);
        url = `${domain}/#/${lang2}?${param}`;
        rule_url.value = url
        return url;
    }
    onMounted(get_pc_rule_url)

  </script>
   
  <style scoped lang="scss">
  .rule_page{
    height: 100%;
    background: #E2E2E2;
    .rules-iframe {
      width: 100%;
      height: 100%;
    }
  }
  
  </style>
  