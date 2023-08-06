<template>
    <div class="rule-wrap" v-if="source.toLocaleUpperCase() == 'PC'">
        <simple-header-wapper :source="source">
            <span>{{ $root.$t("common.sports_betting_rules") }}</span>
        </simple-header-wapper>
        <iframe class="rule-content" :src="rule_url" frameborder="0"></iframe>
    </div>

    <div class="description-main" v-if="source.toLocaleUpperCase() == 'H5'">
        <simple-header-wapper :source="source">
            {{ $root.$t('common.rule_description') }}
        </simple-header-wapper>
        <div class="description-content" v-if="true">
            <iframe style="width:100%;height: 100%" allow="autoplay" frameborder="0" scrolling="no" :src="more_lang"
                v-if="more_lang.length > 0"></iframe>
        </div>
    </div>
</template>

<script setup>
//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper, useProps, useComputed } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "src/components/rule/config/index.js"
import { computed } from 'vue'
// TODO: 待处理store
// import { mapGetters, mapActions } from "vuex";
import { SimpleHeaderWapper } from "src/components/simple-header";

useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({
    ...useProps,
    /** 区分 PC H5 */
    source: {
        type: String,
        default: 'PC',
    },
})
const tableClass_computed = useComputed.tableClass_computed(props)
const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 


/** store仓库数据 */
const store = useStore()
// ...mapGetters({
//             lang: "get_lang",
//             get_theme: "get_theme"
//         }),

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
    let lang = lang_map[store.lang] || 'zh_cn';
    console.log(`================lang:${lang}`, store.lang);
    let url = '';
    const theme = store.get_theme.split('_')[0]
    const get_merchant_style = store.get_theme.split('_')[1]
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
}

/** 体育规则地址-H5 */
const more_lang = computed(get_h5_rule_url)
/** 获取h5体育规则地址 */
const get_h5_rule_url = () => {
    if (props.source.toLocaleUpperCase() != 'H5') return
    //参数对应关系
    let lang_obj = {
        'zh': 'zh-cn',
        'tw': 'zh-tw',
        'en': 'en-gb',
        'vi': 'en-gb', //越南文暂时对应英文显示
    }
    let lang = lang_obj[store.lang] || 'zh-cn'
    if (current_env == 'idc_online' || current_env == 'idc_sandbox' || current_env == 'idc_pre') {
        // 生产环境
        let domain = this.$lodash.get(window, `env.config.static_serve[0]`)
        more_lang.value = domain + '/sports-rules/#/' + lang + `/sport/common?v=h5_${window.env.config.FINAL_TARGET_PROJECT_NAME}&themeColors=` + store.get_theme
    } else {
        // 非生产环境
        more_lang.value = 'http://sports-rules-dev.sportxxx3pk.com/#/' + lang + `/sport/common?v=h5_${window.env.config.FINAL_TARGET_PROJECT_NAME}&themeColors=` + store.get_theme
    }
    // this.$forceUpdate()
}
/** 钩子触发 */
onMounted(get_h5_rule_url)
/** 监听语言变化 */
watch(
    () => store.lang,
    () => get_h5_rule_url()
)

/** 监听窗口变化 */
// const client_height = ref(window_resize_handle())
// const window_resize_handle = () => {
//     client_height.value = document.documentElement.clientHeight
// }

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
  