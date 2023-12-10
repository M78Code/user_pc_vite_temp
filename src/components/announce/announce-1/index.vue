<!-- @Description: 公告页面 -->
<template>
    <div class="announce-wrap">
        <!-- <simple-header :title="i18n_t('common.notice')"> -->
            <!-- <span>{{ i18n_t('common.notice') }}</span> -->
        <!-- </simple-header> -->
        <div class="announce-content">
            <!-- 头部菜单开始 -->
            <top-menu :data="announce_title" @tabs_click="tabs_click"  />
            <!-- 头部菜单结束 -->
            <q-scroll-area class="announce-area" visible>
                <div class="main-page">
                    <div class="announce-title">{{ current_title }}</div>
                    <div class="ann-item" v-for="(item, i) of class_list_ary" :key="i">
                        <!-- <div class="ann-title" >[{{ item.noticeTypeName }}]</div> -->
                        <div class="ann-content" v-html="item.context"> 
                        </div>
                        <div class="ann-time">
                            {{ timestr(item.sendTimeOther) }}
                        </div>
                    </div>
                    <load-data state="notice-empty" :no_data_msg="i18n_t('common.notice_no_data')"
                        v-if="lodash.get(class_list_ary, 'length', 0) <= 0 && loadd_finish"></load-data>
                </div>
            </q-scroll-area>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import lodash from 'lodash'
import { i18n_t } from "src/boot/i18n.js"
import { SimpleHeaderWapper as simpleHeader} from "src/components/common/simple-header/index.js";
import topMenu from "./top-menu.vue";
import loadData from "src/components/load_data/load_data.vue"
import { api_home } from "src/api/index.js"
import { format_str } from "src/output/index.js";
import UserCtr from 'src/core/user-config/user-ctr.js'

//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "src/components/announce/config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({})
// const computed_props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 

/** 返回的大列表 */
let res_list = reactive([])
/** 左侧菜单 */
let announce_title = ref([])
/** 大列表 */
// let announce_list = ref([])
let class_list_ary = ref([])
/** 全部分类数据 */
let class_list = reactive([])
/** 当前标题 */
const current_title = ref('')
/** 当前选中公告分类索引 */
const index = ref(0)
/** 接口请求完成 */
const loadd_finish = ref(false)


/**
* @Description:切换菜单
* @param {object} item 切换的菜单对象
* @param {number} index 切换的菜单索引
* @return {undefined} undefined
*/
function tabs_click(item, i) {
    index.value = i;
    current_title.value = announce_title.value[i].nen;
    class_list_ary.value =  announce_title.value[i].mtl;
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
    if (['vi', 'en', 'th', 'ms', 'ad'].includes(UserCtr.lang)) {
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
    api_home.post_announce_list().then((res) => {
        let code = lodash.get(res, "code");
        const data = lodash.get(res, "data");
        if (code == 200 && data) {
            // data.nt.unshift({
            //     id: 0,
            //     type: i18n_t('common.all_notice'),
            // });
            // for (let i in data.nt) {
            //     data.nt[i].title = data.nt[i].type;
            // }
            // announce_title.value = data.nt; //左侧菜单
            class_list = data.nl || []; //分类
            announce_title.value = class_list.filter(item => item.mtl.length > 0)
            if(announce_title.value.length > 0 ){
                class_list_ary.value = announce_title.value[0].mtl
                current_title.value = announce_title.value[0].nen;
            }else {
                class_list_ary.value = []
                current_title.value = ""
            }
            // res_list = data.nb;
            // announce_list.value = data.nb; //大列表
        }
    }).finally(() => loadd_finish.value = true)
}
/** 钩子触发 */
onMounted(() => {
    get_list()
})
</script>

<style lang="scss" scoped>
.announce-area{
    width: 100%;
    height: calc(100% - 80px);
    padding-top: 6px;
    padding-bottom: 50px;
}
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
    // background: var(--q-gb-bg-c-4);

    .main-page {
        color: #5a6074;
        padding-top: 14px;
        :deep(.load-data-wrap ) {
            height: 75vh !important;

            .empty-wrap {
                .text-center {
                    color: #414655 !important;
                }
            }
        }

        .announce-title{
            font-size: 16px;
            color: #191c24;
            font-weight: 600;
            padding: 8px 30px;
            // border-bottom: 1px solid var(--q-gb-bd-c-1);
            border-bottom:1px solid #ff7000;
        }
        .announce-btn{
            padding: 2px 15.5px;
            border: 0.5px solid #dbdbdb;
            border-radius: 12px;
            background: none;
        }

        .ann-item {
            border-bottom: 1px solid #d0d8de;
            margin: 5px 0;
            padding:0px 30px;
            .ann-title {
                color: #191c24;
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
                display: flex;
                justify-content: space-between;
            }

        }
    }
}

/** 公告栏内容 -E*/
</style>