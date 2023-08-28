<!-- @Description: 公告页面 -->
<template>
    <div class="announce-wrap">
        <simple-header>
            <span>{{ t('common.notice') }}</span>
        </simple-header>
        <div class="announce-content">
            <!-- 左侧菜单开始 -->
            <left-menu :data="announce_title" @tabs_click="tabs_click" class="relative-position" />
            <!-- 左侧菜单结束 -->
            <q-scroll-area class="col rule-scroll-area" visible>
                <div class="main-page">
                    <div class="announce-title">{{ current_title }}</div>
                    <div class="ann-item" v-for="(item, i) of announce_list" :key="i">
                        <div class="ann-title" v-show="index == 0">[{{ item.noticeTypeName }}]</div>
                        <div class="ann-content" v-html="item.context"></div>
                        <div class="ann-time">{{ timestr(item.sendTimeOther) }}</div>
                    </div>
                    <load-data state="notice-empty" :no_data_msg="t('common.notice_no_data')"
                        v-if="lodash.get(announce_list, 'length', 0) <= 0 && loadd_finish"></load-data>
                </div>
            </q-scroll-area>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import lodash from 'lodash'
import { t } from "src/boot/i18n";
import simpleHeader from "project_path/src/components/site-header/simple-header.vue";
import leftMenu from "./left-menu.vue";
import loadData from "src/components/load_data/load_data.vue"
import { api_announce } from "src/api/index"
import store from "src/store-redux/index.js";
import { format_str } from "src/core/format/index.js";

//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "src/components/announce/config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({})
// const computed_props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 

/** 国际化 */


/** 返回的大列表 */
let res_list = reactive([])
/** 左侧菜单 */
let announce_title = ref([])
/** 大列表 */
let announce_list = reactive([])
/** 全部分类数据 */
let class_list = reactive([])
/** 当前标题 */
const current_title = ref('')
/** 当前选中公告分类索引 */
const index = ref(0)
/** 接口请求完成 */
const loadd_finish = ref(false)


/** stroe仓库 */
const store_data = store.getState()
const unsubscribe = store.subscribe(() => {
    lang.value = store_data.langReducer.lang
})
/** 销毁监听 */
onUnmounted(unsubscribe)
/** 国际化语言 default: zh */
const lang = ref(store_data.langReducer.lang)

/**
* @Description:切换菜单
* @param {object} item 切换的菜单对象
* @param {number} index 切换的菜单索引
* @return {undefined} undefined
*/
function tabs_click(item, index) {
    index.value = index;
    current_title.value = announce_title.value[index].type;
    announce_list = index
        ? class_list[index - 1].mtl
        : res_list;
}
/**
* @Description:时间戳转字符串时间格式
* @param {number} time1 时间戳 13位
* @return {string} 转换后的时间
*/
function timestr(time1) {
    time1 = parseInt(time1);
    if (!time1) return "";
    let time = new Date(time1);
    if (['vi', 'en', 'th', 'ms', 'ad'].includes(lang)) {
        return (
            format_str(time.getHours()) +
            ":" +
            format_str(time.getMinutes()) + " " +

            format_str(time.getDate()) + "/" +
            format_str(time.getMonth() + 1) + "/" +
            time.getFullYear()
        );
    } else {
        return (
            time.getFullYear() +
            "-" +
            format_str(time.getMonth() + 1) +
            "-" +
            format_str(time.getDate()) +
            " " +
            format_str(time.getHours()) +
            ":" +
            format_str(time.getMinutes())
        );
    }
}
/**
* @Description:获取公告栏数据
* @return {undefined} undefined
*/
function get_list() {
    api_announce.post_announce_list().then((res) => {
        let code = lodash.get(res, "data.code");
        let status = lodash.get(res, "status");
        const data = lodash.get(res, "data.data");

        if (code == 200 && status && data) {
            data.nt.unshift({
                id: 0,
                type: t('common.all_notice'),
            });
            for (let i in data.nt) {
                data.nt[i].title = data.nt[i].type;
            }
            announce_title.value = data.nt; //左侧菜单
            class_list = data.nl; //分类
            res_list = data.nb;
            announce_list = data.nb; //大列表
            current_title.value = data.nt[0].type || "";
        }
    }).finally(() => loadd_finish.value = true)
}
/** 钩子触发 */
onMounted(get_list)
</script>

<style lang="scss" scoped>
.announce-wrap {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    user-select: text;
    overflow: hidden;
}

/** 公告栏内容 -S*/
.announce-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    background: #fff;

    .main-page {
        color: #5a6074;
        padding: 30px;

        ::v-deep .load-data-wrap {
            height: 75vh !important;

            .empty-wrap {
                .text-center {
                    color: #414655 !important;
                }
            }
        }

        .announce-title {
            font-size: 16px;
            color: #191c24;
            font-weight: 600;
        }

        .ann-item {
            border-bottom: 1px solid #d0d8de;
            margin-bottom: 5px;

            .ann-title {
                color: #191c24;
                margin-top: 15px;
                font-weight: 600;
            }

            .ann-content {
                margin-top: 10px;
                line-height: 20px;
            }

            .ann-time {
                margin-top: 8px;
                margin-bottom: 10px;
                color: #99a3b1;
            }
        }
    }
}

/** 公告栏内容 -E*/
</style>
