<template>
    <div class="description-main" :class="{ black_bg: UserCtr.theme == 'night' }">
        <simple-header :title="i18n_t('common.sports_betting_rules')" use_component_key="SimpleHeader_H5">
            <!-- {{ i18n_t('common.rule_description') }} -->
        </simple-header>
        <div v-if="sports_rules_domain" class="description-content">
            <iframe style="width:100%;height: 100%" allow="autoplay" frameborder="0" scrolling="no" :src="more_lang"
                v-if="more_lang.length > 0"></iframe>
        </div>
        <error01 v-else></error01>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, getCurrentInstance, defineComponent } from 'vue'
import lodash from "lodash"
import { i18n_t } from "src/boot/i18n.js"
import UserCtr from 'src/core/user-config/user-ctr.js'
import { SimpleHeaderWapper as simpleHeader} from "src/components/common/simple-header/index.js";
import error01 from "src/components/error/error01.vue";
//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "src/components/rule/config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({})
// const computed_props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 

/** 体育规则地址-H5 */
const more_lang = ref('')
const sports_rules_domain =  UserCtr.get_topic_key_url('sports_rules');
/** 获取h5体育规则地址 */
const get_h5_rule_url = () => {
    //参数对应关系
    let lang_obj = {
        'zh': 'zh-cn',
        'hk': 'zh-cn',
        'tw': 'zh-tw',
        'en': 'en-gb',
        'vi': 'en-gb', //越南文暂时对应英文显示
    }
    let lang = lang_obj[UserCtr.lang] || 'zh-cn'
    const current_env = window.BUILDIN_CONFIG.CURRENT_ENV
    // Y0商户  或者  正常的白色  黑色版
    //这里没有 Y0 和黑白色了 只有后配配置的颜色
    let merchant_or_black_and_white_version =  UserCtr.theme;
    
    let domain = lodash.get(window, `env.config.static_serve[0]`)
    if (current_env == 'idc_online' || current_env == 'idc_ylcs') {
        //生产 和压测
    } else if (current_env == 'idc_sandbox' || current_env == 'idc_pre') {
        // 试玩环境
        domain = "https://sports-rules-new-shiwan.sportxxx3pk.com"
    } else {
        //  其他环境，测试和开发 等
        domain = "http://sports-rules-new-test.sportxxx3pk.com"
    }
    more_lang.value = domain + '/#/' + lang + `?rdm=${new Date().getTime()}&v=h5_${window.BUILDIN_CONFIG.PROJECT_NAME}&themeColors=` + merchant_or_black_and_white_version

    const { ctx } = getCurrentInstance()
    ctx.$forceUpdate()
}
/** 钩子触发 */
onMounted(get_h5_rule_url)
/** 监听语言变化 */
watch(UserCtr.lang, get_h5_rule_url)


</script>

<script>
export default defineComponent({
    name: 'rule-h5'
})
</script>
  
<style lang="scss" scoped>
.description-main {
    background: #fff;
    overflow-x: hidden;

    :deep(.absolute-right) {
        display: none;
    }

    :deep(.tabs-content) {
        padding: inherit !important;
        padding: 0 0.1rem 0 0.1rem;
    }

    .description-content {
        position: fixed;
        top: 0.44rem;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .unwrap-icon {
        position: absolute;
        right: 0;
        top: -0.02rem;
        padding: 0.14rem 0.14rem;
        transition: all 0.3s linear;
        opacity: 0;
        z-index: -1;

        &.unwrap_icon_collapse {
            opacity: 1;
            z-index: 0;

            &>img {
                opacity: 1;
            }
        }

        &>img {
            opacity: 0;
            width: 0.12rem;
            height: 0.12rem;
            display: block;
            position: relative;
            left: -0.05rem;
            transition: all 0.1s;

            &.collapse {
                transform: rotateZ(180deg);
            }
        }

        &:after {
            content: '';
            width: 0.01rem;
            height: 0.2rem;
            position: absolute;
            left: -0.06rem;
            top: 0.1rem;
        }
    }
}
</style>
  