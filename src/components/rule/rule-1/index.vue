<template>
    <div class="rule-wrap">
        <simple-header :source="source">
            <span>{{ $root.$t("common.sports_betting_rules") }}</span>
        </simple-header>
        <iframe class="rule-content" :src="rule_url" frameborder="0"></iframe>
    </div>
</template>

<script setup>
//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper, useProps, useComputed } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "src/components/rule/config/index.js"
import { computed, ref, onUnmounted } from 'vue'
import lodash from 'lodash'
import store from "src/store-redux/index.js";
import simpleHeader from "./simple-header.vue";

useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({
    ...useProps,
})
const tableClass_computed = useComputed.tableClass_computed(props)
const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 


/** 国际化 */
const lang = ref()
/** 主题 */
const theme = ref()
/** stroe仓库 */
const unsubscribe = store.subscribe(() => {
    const new_state = store.getState()
    lang.value = new_state.lang
    theme.value = new_state.theme
})
onUnmounted(unsubscribe)

/** 体育规则地址-PC */
const rule_url = computed(get_pc_rule_url)
// TODO: 环境变量怎么获取
/** 环境变量 */
const current_env = ''

/** 获取pc体育规则地址 */
const get_pc_rule_url = () => {
    let lang_map = {
        'en': 'en_gb',
        'zh': 'zh_cn',
        'tw': 'zh_tw',
        'vi': 'vi_vn',
        'th': 'th_th',
        'ms': 'ms_my',
        'ad': 'id_id',
    }
    let lang = lang_map[lang.value] || 'zh_cn';
    console.log(`================lang:${lang}`, lang.value);
    let url = '';
    // const theme = theme.value.split('_')[0]
    // const get_merchant_style = theme.value.split('_')[1]
    const [theme, get_merchant_style] = theme.value.split('_')
    // TODO: 环境变量待修改
    let domain = lodash.get(window, `env.config.static_serve[0]`)
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
}


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
  