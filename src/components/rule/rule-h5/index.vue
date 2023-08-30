<template>
    <div class="description-main">
        <simple-header :source="source">
            {{ i18n_t('common.rule_description') }}
        </simple-header>
        <div class="description-content">
            <iframe style="width:100%;height: 100%" allow="autoplay" frameborder="0" scrolling="no" :src="more_lang"
                v-if="more_lang.length > 0"></iframe>
        </div>
    </div>
</template>

<script setup>
import { i18n_t } from "src/boot/i18n.js"
import UserCtr from 'src/core/user-config/user-ctr.js'

//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper} from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "src/components/rule/config/index.js"
import { computed, onUnmounted, ref, getCurrentInstance } from 'vue'
import simpleHeader from "project_path/src/components/site-head/simple-header.vue";

useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({
    ...useProps,
})
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 

/** 体育规则地址-H5 */
const more_lang = ref('')
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
    let lang = lang_obj[UserCtr.lang] || 'zh-cn'
    if (current_env == 'idc_online' || current_env == 'idc_sandbox' || current_env == 'idc_pre') {
        // 生产环境
        let domain = this.$lodash.get(window, `env.config.static_serve[0]`)
        more_lang.value = domain + '/sports-rules/#/' + lang + `/sport/common?v=h5_${window.BUILDIN_CONFIG.FINAL_TARGET_PROJECT_NAME}&themeColors=` + UserCtr.theme
    } else {
        // 非生产环境
        more_lang.value = 'http://sports-rules-dev.sportxxx3pk.com/#/' + lang + `/sport/common?v=h5_${window.BUILDIN_CONFIG.FINAL_TARGET_PROJECT_NAME}&themeColors=` + UserCtr.theme
    }
    const { ctx } = getCurrentInstance()
    ctx.$forceUpdate()
}
/** 钩子触发 */
onMounted(get_h5_rule_url)
/** 监听语言变化 */
watch(UserCtr.lang, get_h5_rule_url)

/** 监听窗口变化 */
// const client_height = ref(window_resize_handle())
// const window_resize_handle = () => {
//     client_height.value = document.documentElement.clientHeight
// }

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
  