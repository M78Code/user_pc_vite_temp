<template>
    <div class="rule-wrap">
        <simple-header>
            <span>{{ $root.$t("common.sports_betting_rules") }}</span>
        </simple-header>
        <iframe class="rule-content" :src="rule_url" frameborder="0"></iframe>
    </div>
</template>

<script setup>
import { computed } from 'vue'
// TODO: 待处理store
import { mapGetters, mapActions } from "vuex";
import simpleHeader from "src/public/components/rule/simple_header.vue";

const store = useStore()
// ...mapGetters({
//             lang: "get_lang",
//             vx_get_theme: "get_theme"
//         }),

/** 体育规则地址 */
const rule_url = computed(() => {
    let lang_map = {
        'en': 'en_gb',
        'zh': 'zh_cn',
        'tw': 'zh_tw',
        'vi': 'vi_vn',
        'th': 'th_th',
        'ms': 'ms_my',
        'ad': 'id_id',
    }
    let lang = lang_map[store.lang] || 'zh_cn';
    console.log(`================lang:${lang}`, store.lang);
    // TODO: 环境变量怎么获取？
    const current_env = window.env.config.current_env;
    let url = '';
    const theme = store.vx_get_theme.split('_')[0]
    const get_merchant_style = store.vx_get_theme.split('_')[1]
    let domain = _.get(window, `env.config.static_serve[0]`)
    if (current_env == 'idc_online' || current_env == 'idc_ylcs') {
        // 生产环境
    } else if (current_env == 'idc_sandbox' || current_env == 'idc_pre') {
        // 试玩环境
        domain = "https://sports-rules-new-shiwan.sportxxx3pk.com"

    } else {
        // 其他环境，测试和开发 等
        domain = "http://sports-rules-new-test.sportxxx3pk.com"

    }
    if (!!get_merchant_style) {
        url = `${domain}/#/${lang}?themeColors=${theme}&sty=${get_merchant_style}&rdm=${new Date().getTime()}`;
    } else {
        url = `${domain}/#/${lang}?themeColors=${theme}&rdm=${new Date().getTime()}`;
    }
    console.log(`===========体育规则iframe的url值:${url}`, theme);
    return url;
})

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
  