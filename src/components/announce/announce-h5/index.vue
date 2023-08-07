<!-- @Description: h5首页跑马灯点击进去的 公告页 -->
<template>
    <div class="notice_main">
        <!-- 公共标题 -->
        <simple-header>
            {{ $root.$t('common.notice') }}
        </simple-header>
        <!-- tab 组件 及 下边内容 滚动部分 -->
        <my-tabs :tabList="tabList" :tabIndex="index" :rightDistance="false" class="notice_tabs" @changeTab="changeTab"
            :class="{ loading: loading_page }">
            <!-- 滚动区域组件,切换tab 回到顶部 -->
            <q-scroll-area class="notice_scroll" ref="scrollArea" :thumb-style="{ opacity: 0 }">
                <div class="main-page">
                    <div class="ann-item" v-for="(item, i) of announce_list" :key="i">
                        <div class="flex justify-between align_items">
                            <div class="ann-title">[{{ current_title }}]</div>
                            <div class="ann-time">{{ (new Date(+item.sendTimeOther)).Format($root.$t('time6')) }}</div>

                        </div>
                        <div class="ann-content" v-html="item.context" :class="{ is_long_word: ['en'].includes(get_lang) }">
                        </div>
                    </div>
                    <!-- 没有数据 组件 -->
                    <no-data v-show="no_data_list" which='noMessage' height='500'></no-data>
                </div>
            </q-scroll-area>
        </my-tabs>

        <load-page v-if="loading_page" @touchmove.prevent></load-page>
    </div>
</template>
  
<script>
import { defineComponent, ref, nextTick, onMounted, onUnmounted } from 'vue'
//-------------------- 对接参数 prop 注册  开始  -------------------- 
import  { useRegistPropsHelper, useProps,  useComputed  } from "src/composables/regist-props/index.js"
import {component_symbol ,need_register_props} from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({ ...useProps })
const tableClass_computed = useComputed.tableClass_computed(props)
const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 
// TODO:
import { api_home } from "src/project/api/index";
import { mapGetters } from "vuex";
import loading from "src/project/components/common/loading";
import noData from "src/project/yazhou-h5/components/common/no-data/no-data.vue";

import simple_header from '.r/simple_header.vue';
import tabs from "./tab.vue";

export default defineComponent({
    name: "notice",
    components: {
        "simple-header": simple_header,
        'my-tabs': tabs,
        "no-data": noData,
        'load-page': loading
    },
    setup(props) {
        /** 返回的大列表 */
        const res_list = reactive([])
        /** 左侧菜单 */
        const tabList = reactive([])
        /** 大列表 */
        const announce_list = reactive([])
        /** 全部分类数据 */
        const class_list = reactive([])
        /** 当前标题 */
        const current_title = ref('')

        /** 当前选中公告分类索引 */
        const index = ref(0)
        // 监听 index 下标变化
        watch(
            () => index.value,
            changeTab(tabList[o])
        )
        const scrollArea = ref(null)
        // 切换tab 选项卡
        function changeTab(tab) {
            scrollArea.value && scrollArea.value.setScrollPosition(0, 100)
            index.value = tab.index;
            current_title.value = tabList[tab.index].type;
            announce_list = class_list[index.value].mtl
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
            api_home.post_announce_list().then(({ code, data }) => {
                if (code == 200 && data) {
                    // data.nt.unshift({id: 0,type: this.$root.$t('common.all_notice')});
                    for (let i in data.nt) {
                        data.nt[i].name = data.nt[i].type
                        data.nt[i].index = Number(i)
                    }
                    tabList = data.nt; //tab菜单
                    class_list = data.nl; //分类
                    res_list = data.nb;
                    announce_list = data.nl[0].mtl; // 大列表 默认进来第一个
                    current_title.value = data.nt[0].type || "";
                    nextTick(() => {
                        if (route.query) {
                            index.value = $route.query.noticeTypeName
                            data.nl.forEach((item, i) => {
                                if (item.nen == route.query.noticeTypeName) {
                                    let time_out = 1000
                                    index.value = i
                                    if (index.value > 7) time_out = 1000 + ((index.value - 7) * 200)
                                    if (index.value <= 3) time_out = 0
                                    timer1.value = setTimeout(() => {
                                        loading_page.value = false
                                    }, time_out)
                                }
                            })
                        }
                    })
                    has_data_list()
                }
            }).catch(err => {
                console.error(err);
                loading_page.value = false
                has_data_list()
                // TODO:
                if (!this.get_user_token) {
                    this.$root.$emit(this.emit_cmd.EMIT_GO_TO_VENDER);
                }
            })
        }
        /** 钩子触发 */
        onMounted(get_list)

        return {
            res_list,
            tabList,
            announce_list,
            class_list,
            current_title,
            index,
            no_data_list,
            loading_page,
            scrollArea
        }
    },
    computed: {
        ...mapGetters({
            get_lang: 'get_lang',
            get_user_token: 'get_user_token',
        })
    }
})
</script>
  
<style lang="scss" scoped>
.notice_main {
    overflow: hidden;

    ::v-deep.notice_tabs {
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

    .main-page {
        width: 100%;
        padding-top: 0.18rem;

        .ann-item {
            width: 100%;
            padding-bottom: 0.2rem;

            .justify-between {
                margin: 0 0.1rem 0.2rem;
            }

            .ann-title {
                font-weight: 600;
                font-size: 0.14rem;
            }

            .ann-content {
                word-break: break-all;
                margin: 0 0.1rem 0;
                line-height: 0.2rem;
                font-size: 0.12rem;
                text-align: justify;

                &.is_long_word {
                    max-width: 3.3rem;
                }
            }

            .ann-time {
                margin-top: 0.08rem;
                margin-bottom: 0.1rem;

                font-size: 0.12rem;
            }
        }
    }
}
</style>
  
  