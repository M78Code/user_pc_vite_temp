<template>
    <div class="rule-wrap" :class="project_name">
        <simple-header :title="i18n_t('common.sports_betting_rules')">
            <!-- <span>{{ i18n_t("common.sports_betting_rules") }}</span> -->
        </simple-header>
        <iframe v-if="sports_rules_domain" class="rule-content" :src="rule_url" frameborder="0"></iframe>
        <error01 v-else></error01>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import lodash from 'lodash'
import UserCtr from 'src/core/user-config/user-ctr.js'
import { i18n_t } from "src/boot/i18n.js"
import { SimpleHeaderWapper as simpleHeader} from "src/components/common/simple-header/index.js";
import error01 from "src/components/error/error01.vue";

//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "src/components/rule/config/index.js"
import { PROJECT_NAME } from "src/output/index.js"
import { loadLanguageAsync } from "src/output/index.js";
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({})
// const computed_props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 
const project_name = PROJECT_NAME
/** 环境变量 */
const current_env = window.BUILDIN_CONFIG.CURRENT_ENV
/** 体育规则地址-PC */
const rule_url = ref('')
const sports_rules_domain = UserCtr.get_topic_key_url('sports_rules');
/** 获取pc体育规则地址 */
const get_pc_rule_url = () => {
    const lang_map = {
        'en': 'en_gb',
        'zh': 'zh_cn',
        'hk': 'zh_cn',
        'tw': 'zh_tw',
        'vi': 'vi_vn',
        'th': 'th_th',
        'ms': 'ms_my',
        'ad': 'id_id',
        'ru': 'ru_ru',
    }
    const lang2 = lang_map[LocalStorage.get('lang')] || 'zh_cn';
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
    if (!!get_merchant_style) {
        obj.sty = get_merchant_style;
        obj.themeColors = theme2;
    } else {
        obj.themeColors = theme2;
    }
    const theme_map = {
        'theme-2': 'theme01&sty=y0',
        'theme-1': 'theme02&sty=y0',
    }
    if (['app-h5'].includes(window.BUILDIN_CONFIG.PROJECT_NAME)) {
        obj.themeColors = theme_map[theme2] //theme2.replace('theme-2', 'theme02&sty=y0').replace('theme-1', 'theme01_y0&sty=y0')

    }
    let param = UserCtr.get_user_url_parames(obj);
    url = `${domain}/#/${lang2}?${param}`;
    
    rule_url.value = url
    return url;
}
onMounted(()=>{
 get_pc_rule_url()
})

</script>
  
<style lang="scss" scoped>
.rule-wrap {
    width: 100%;
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    // padding-bottom: 100px;
    .rule-content {
        width: 100%;
        flex: 1;
        background-color: var(--q-gb-bg-c-27);
    //   padding: 0 15px;
        
    }
}
// ========复刻版=======
.app-h5.rule-wrap {
    height: calc(100vh - 46px);
    position: fixed;
    top: 46px;
}
</style>
