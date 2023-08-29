<template>
    <div class="rule-wrap">
        <simple-header>
            <span>{{ t("common.sports_betting_rules") }}</span>
        </simple-header>
        <iframe class="rule-content" :src="rule_url" frameborder="0"></iframe>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { t } from "src/core/index.js";
import lodash from 'lodash'
import store from "src/store-redux/index.js";
import simpleHeader from "project_path/src/components/site-header/simple-header.vue";

//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "src/components/rule/config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({})
// const computed_props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 

/** 国际化 */


/** stroe仓库 */
const { langReducer, themeReducer } = store.getState()
const unsubscribe = store.subscribe(() => {
    theme.value = themeReducer.theme
    lang.value = userReducer.lang
   
})
/** 销毁监听 */
onUnmounted(unsubscribe)
/** 
* 用户余额是否展示状态 default: theme01
* 路径: project_path/src/store/module/theme.js
*/
const theme = ref(themeReducer.theme)
/** 
 * 语言
 * 路径: src\store-redux\module\languages.js
 */
 const lang = ref(langReducer.lang)

// TODO: 环境变量怎么获取
/** 环境变量 */
const current_env = ''
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
    const lang2 = lang_map[lang.value] || 'zh_cn';
    console.error(`================lang:${lang2}`, lang.value);
    let url = '';
    const [theme2, get_merchant_style] = theme.value.split('_')
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
        url = `${domain}/#/${lang2}?themeColors=${theme2}&sty=${get_merchant_style}&rdm=${new Date().getTime()}`;
    } else {
        url = `${domain}/#/${lang2}?themeColors=${theme2}&rdm=${new Date().getTime()}`;
    }
    console.log(`===========体育规则iframe的url值:${url}`, theme2);
    rule_url.value = url
    return url;
}
onMounted(get_pc_rule_url)

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
  