<!-- @Description: h5首页跑马灯点击进去的 公告页 -->
<template>
    <div class="notice_main">
        <!-- 公共标题 -->
        <!-- <simple-header :title="i18n_t('common.notice')" use_component_key="SimpleHeader_H5"> -->
            <!-- {{ i18n_t('common.notice') }} -->
        <!-- </simple-header> -->
        <!-- tab 组件 及 下边内容 滚动部分 -->
        <tabs v-if="istab" :tabList="tabList" :tabIndex="tab_index" :rightDistance="false" class="notice_tabs" @changeTab="changeTab"
            :class="{ loading: loading_page }">
            <!-- 滚动区域组件,切换tab 回到顶部 -->
            <q-scroll-area class="notice_scroll" ref="scrollArea" :thumb-style="{ opacity: 0 }">
                <div class="ann-title">{{ current_title }}</div>
                <div class="main-page">
                    
                    <div class="ann-item" v-for="(item, i) of announce_list" :key="i">
                        <!-- <div class="flex justify-between align_items">
                            <div class="ann-title">[{{ current_title }}]</div>
                            <div class="ann-time">{{ new Date(+item.sendTimeOther).Format(i18n_t('time6')) }}</div>
                            <div class="ann-time">{{ DateForMat(new Date(+item.sendTimeOther), 'yyyy-MM-dd hh:mm') }}</div>
                        </div> -->
                        <div class="ann-content" v-html="item.context" :class="{ is_long_word: ['en'].includes(UserCtr.lang) }"></div>
                        <div class="ann-time">{{ DateForMat(new Date(+item.sendTimeOther), 'yyyy-MM-dd hh:mm') }}</div>
                    </div>
                    <!-- 没有数据 组件 -->
                    <no-data v-show="no_data_list" which='noMessage' height='500px'></no-data>
                </div>
            </q-scroll-area>
        </tabs>
        <load-page v-if="loading_page" @touchmove.prevent></load-page>
    </div>
</template>
  
<script setup>
import { ref, reactive, watch, nextTick, onMounted, onUnmounted, defineComponent } from 'vue'
import { i18n_t } from "src/boot/i18n.js"
import { useRoute } from "vue-router"
import { api_home } from "src/api/index";
import { LoadingWapper as loadPage } from "src/components/common/loading";
import noData from "src/components/common/no-data/no-data-h5/index.vue";
import { SimpleHeaderWapper as simpleHeader} from "src/components/common/simple-header/index.js";
import tabs from "./tab.vue";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import UserCtr from 'src/core/user-config/user-ctr.js'
import { DateForMat } from 'src/output/index.js'

//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "src/components/announce/config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({})
// const computed_props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 
// 解决渲染问题
const istab = ref(false)
/** 返回的大列表 */
// let res_list = reactive([])
/** 左侧菜单 */
let tabList = reactive([])
/** 大列表 */
let announce_list = reactive([])
/** 全部分类数据 */
let class_list = reactive([])
/** 当前标题 */
const current_title = ref('')

/** 当前选中公告分类索引 */
const tab_index = ref(0)
// 监听 index 下标变化
// watch(
//     () => tab_index.value,
//     (o) => changeTab(tabList[o])
// )
const scrollArea = ref(null)
// 切换tab 选项卡
const changeTab = (tab,i) => {
    // TODO:
    // if (scrollArea.value) scrollArea.value.setScrollPosition(0, 100)
    tab_index.value = i;
    current_title.value = tabList[i].nen;
    announce_list = tabList[i].mtl
    has_data_list()
}

/** 有没有公告数据 */
const no_data_list = ref(false)
const loading_page = ref(true)

/** 判断接口是否有数据 */
function has_data_list() {
    no_data_list.value = announce_list.length <= 0
}

/** 路由参数 */
const route = useRoute()
/** 定时器 */
const timer1 = ref(null)
/** 清除定时器 */
onUnmounted(() => {
    if (timer1.value) {
        clearTimeout(timer1.value)
        timer1.value = null
    }
})
/**
 * @Description:获取公告栏数据
 * @return {undefined} undefined
 */
function get_list() {
    istab.value = false
    api_home.post_announce_list().then(({ code, data }) => {
        if (code == 200 && data) {
            // data.nt.unshift({ id: 0, type: i18n_t('common.all_notice') });
            // for (let i in data.nt) {
            //     data.nt[i].name = data.nt[i].type
            //     data.nt[i].index = Number(i)
            // }
            // tabList = data.nt; //tab菜单
            class_list = data.nl || []; //分类
            tabList = class_list.filter(item => item.mtl.length > 0)
            // res_list = data.nb;
            if(tabList.length > 0){
                announce_list = tabList[0].mtl; // 大列表 默认进来第一个
                current_title.value = tabList[0].nen || "";
                // current_title.value = data.nt[0].type || "";
            }else {
                announce_list = []; 
                current_title.value = "";
            }
                
            timer1.value = setTimeout(() => {
                istab.value = true
                loading_page.value = false
            },1000)
            has_data_list()
        }
    }).catch(err => {
        console.error(err);
        loading_page.value = false
        has_data_list()
        if (!UserCtr.get_user_token()) {
            useMittEmit(MITT_TYPES.EMIT_GO_TO_VENDER)
        }
    })
}
/** 钩子触发 */
onMounted(get_list)

</script>

<script>
export default defineComponent({
    name: 'announce_h5'
})
</script>
  
<style lang="scss" scoped>
.notice_main {
    overflow: hidden;
    height: 51px;
    :deep(.notice_tabs) {
        &.loading {
            opacity: 0;
        }

        .tabs-bar {
            padding-left: 0.16rem;
        }

        .notice_scroll {
            width: 100%;
        }
    }
    .ann-title {
        font-weight: 600;
        font-size: 0.14rem;
        padding: 0rem 0.2rem;
        height: 0.38rem;
        line-height: 0.38rem;
        border-bottom: 1px solid #e2e2e2;
    }

    .main-page {
        width: 100%;
        padding-top: 0.18rem;

        .ann-item {
            width: 100%;
            margin-bottom: 0.2rem;
            border-bottom: 1px solid #e2e2e2;
            .justify-between {
                margin: 0 0.1rem 0.2rem;
            }

            

            .ann-content {
                word-break: break-all;
                margin: 0 0.2rem 0;
                line-height: 0.2rem;
                font-size: 0.12rem;
                text-align: justify;

                &.is_long_word {
                    // max-width: 3.3rem;
                }
            }

            .ann-time {
                font-size: 0.12rem;
                margin: 0.08rem 0 0.1rem 0.2rem;
            }
        }
    }
}
</style>
  
  src/core/format/common/module/format-date.js