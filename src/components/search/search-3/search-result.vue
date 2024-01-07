<!-- @Description: 搜索结果 -->

<template>
    <div class="result-wrap">
        <!-- 无数据 -->
        <div class="serach-background" v-show="store.load_data_state != 'data'" @click.stop>
            <loadData class="fit" :state="store.load_data_state" :no_data_msg="i18n_t('search.null1')"
                :no_data_msg2="i18n_t('search.null2')" />
        </div>
        <!-- 滚动区域 -->
        <q-scroll-area v-show="store.load_data_state == 'data'" class="fit rule-scroll-area" ref="scrollRef">
            <div class="serach-background" @click.stop>
                <div style="height:70px"></div>
                <!-- 赛种 -->
                <div class="type-item" :class="{ active: type.is_active, inplay: type.is_inplay }"
                    v-for="(type, type_index) in store.res_list" :key="type_index">
                    <div class="type-wrap" @click="type.is_active = !type.is_active">
                        <div class="line"></div>
                        <div class="type-name">
                            {{ type.type_name }}
                        </div>
                    </div>
                    <!-- 联赛 -->
                    <div class="league-item" :class="{ active: league.is_active }"
                        v-for="(league, league_index) in type.children" :key="league_index">
                        <div class="league-wrap" @click="league.is_active = !league.is_active">
                            <div class="name-wrap" @click.stop="league_click(league)">
                                <div class="league-name">{{ league.league_name }}</div>
                                <div class="league-total">{{ league.league_total }}</div>
                            </div>
                            <div class="yb-icon-arrow" v-if="league.league_total > 3"></div>
                        </div>
                        <!-- 赛事 -->
                        <div class="match-item" :class="{ 'hide-match': match_index > 2 }"
                            v-for="(match, match_index) in league.children" :key="match_index">
                            <div class="text-wrap">
                                <div class="team" @click="match_click(match)">{{ match.mhn }}&ensp;v&ensp;{{ match.man }}
                                </div>
                            </div>
                            <div class="text-wrap">
                                <match-process :match="match" show_page="match-list" :rows="1" />
                                <div class="score" v-if="type.is_inplay">{{ match.msc.S1.home }}-{{ match.msc.S1.away }}
                                </div>
                            </div>
                        </div>
                        <!-- 点点点 -->
                        <div class="point-wrap" v-if="league.league_total > 3 && !league.is_active">
                            <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/point.svg`">
                        </div>
                    </div>
                </div>
            </div>
        </q-scroll-area>
    </div>
</template>
  
<script setup>
import { ref, reactive, watch, onBeforeUnmount ,nextTick} from 'vue'
import { SearchPCClass } from 'src/output/index.js'
import { project_name, i18n_t } from 'src/output/index.js';
import { MatchProcessFullVersionWapper as matchProcess } from "src/components/match-process/index.js"
import lodash from "lodash";
import details from "src/core/match-list-pc/details-class/details.js"
import search from "src/core/search-class/search.js"
import {store, mutations} from './index.js'

import loadData from "src/components/load_data/load_data.vue"

const props = defineProps({
    show_type: {
        type: String,
        default: ''
    },
    search_csid: {
        type: [Number, String],
        default: ''
    }
})

const emit = defineEmits(['update:show_type'])
const update_show_type = (data) => emit('update:show_type', data)

/** 国际化 */


/** 数据加载状态 */
// const load_data_state = ref('data')
/** 搜索结果数据 */
// let res_list = reactive([])

// const router = useRouter()

/** stroe仓库 */
// const { searchReducer } = {}
/**
 * 获取搜索内容 default: ''
 * 路径: project_path\src\store\module\search.js
 */
// const keyword = ref(SearchPCClass.keyword)
// 监听搜索关键词改变
watch(
    () => store.keyword,
    lodash.debounce((res) => {
        // if (search_type.value == 2) {
        //     update_show_type('none')
        // } else {
        //     get_search_result(res.substr(5))
        // }
            get_search_result(res)
    }, 300)
)

/**
 * 获取搜索类型 default: 1
 * 路径: project_path\src\store\module\search.js
 */
const search_type = ref(1)
// const unsubscribe = store.subscribe(() => {
//     const { searchReducer: new_searchReducer } = {};
//     keyword.value = ''
//     search_type.value = ''
// })
// onBeforeUnmount(unsubscribe)

/** 设置搜索联赛关键字 */
// const set_click_keyword = (data) => store.dispatch({ type: 'set_click_keyword', data })
/** 设置搜索状态 */
// const set_search_status = (data) => store.dispatch({ type: 'set_search_status', data })
/** 设置搜索类型 */
// const set_search_type = (data) => store.dispatch({ type: 'set_search_type', data })

/**
 * @Description:点击联赛搜索
 * @param {string} league 点击的联赛
 * @return {undefined} undefined
 */
function league_click(league) {
    search.insert_history(league.league_name)
    update_show_type('none')
    // router.push({
    //     name: 'search',
    //     params: {
    //         keyword: league.league_name,
    //     },
    //     query: {
    //         csid: props.search_csid
    //     }
    // })
    set_search_type(2)
    set_click_keyword(league.league_name)
}

const scrollRef = ref(null)
/**
 * @Description:点击赛事搜索
 * @param {object} match 点击的赛事
 * @return {undefined} undefined
 */
function match_click(match) {
    search.result_scroll = scrollRef.value.getScrollPosition()
    search.insert_history(match.name)
    details.on_go_detail(match, keyword.value.substr(5),router)
    set_search_status(false)
}

const timer = ref(null)
/**
 * @Description:获取搜索结果数据
 * @param {string} keyword 搜索关键字
 * @return {Undefined} Undefined
 */
function get_search_result() {
    if (!store.keyword) {
        // update_show_type('init')
        store.show_type = 'init'
        return
    }
    // //调用接口前先设置加载状态
    // if (is_loading) {
    //     load_data_state.value = 'loading'
    // }
    mutations.get_search_result_handle()
    // const { state, list } = results
    // update_show_type('result')
    // load_data_state.value = 'data'
    let _ref_scroll = scrollRef.value;
    timer.value = setTimeout(() => {
        // 如果是从详情页返回
        if (search.back_keyword.keyword) {
            nextTick(() => {
                //重新设置滚动高度
                _ref_scroll && _ref_scroll.setScrollPosition && _ref_scroll.setScrollPosition('vertical', search.result_scroll.top);
            })
        } else {
            //重新设置滚动高度
            _ref_scroll && _ref_scroll.setScrollPosition && _ref_scroll.setScrollPosition('vertical', 0);
        }
    })

    //调用接口获取获取搜索结果数据
    // search.get_search_result(keyword, props.search_csid).then(res => {
    //     const { state, list } = res
    //     update_show_type('result')
    //     load_data_state.value = state
    //     res_list = list
    //     let _ref_scroll = scrollRef.value;
    //     timer.value = setTimeout(() => {
    //         // 如果是从详情页返回
    //         if (search.back_keyword.keyword) {
    //             nextTick(() => {
    //                 //重新设置滚动高度
    //                 _ref_scroll && _ref_scroll.setScrollPosition && _ref_scroll.setScrollPosition('vertical', search.result_scroll.top);
    //             })
    //         } else {
    //             //重新设置滚动高度
    //             _ref_scroll && _ref_scroll.setScrollPosition && _ref_scroll.setScrollPosition('vertical', 0);
    //         }
    //     })
    // })
}
onBeforeUnmount(() => {
    if (timer.value) {
        clearTimeout(timer.value)
        timer.value = null
    }
})

// 监听搜索球种变化
watch(
    () => store.search_csid,
    () => {
        if (store.keyword) {
            get_search_result()
        } else {
        }
        // const keword = keyword.value.substr(5)
        // store.keyword = ''
        // get_search_result()
    }
)

</script>
  
<style lang="scss" scoped>
.result-wrap {
    width: 100%;
    height: 100%;

    .load-data-wrap {
        height: 400px !important;
        min-height: 0;

        :deep(.empty-wrap) {
            img {
                margin-bottom: 0;
            }

            .nodata-text2 {
                font-size: 12px;
                margin-top: 2px;
            }
        }
    }

    :deep(.q-scrollarea__thumb) {
        z-index: 1000;
    }

    /** 类型 -S*/
    .type-item {
        margin: 0 30px;

        &.inplay {
            .league-item {
                margin-top: 20px !important;

                .match-item {
                    .score {
                        display: block !important;
                    }

                    .text-wrap .c-match-process :deep(.date-wrap) {
                        color: #99a3b1;
                    }
                }

                .league-wrap {
                    display: none;
                }
            }
        }

        &.active {
            .league-item {
                display: block;
            }
        }

        .type-wrap {
            display: flex;
            align-items: center;
            height: 34px;
            border-bottom: 1px solid #282b37;
            cursor: pointer;

            .line {
                width: 3px;
                height: 14px;
                margin-right: 10px;
                border-radius: 1.5px;
            }

            .type-name {
                color: var(--q--gb-t-c-18);
                position: relative;

                .tip-direct {
                    width: 12px;
                    height: 10px;
                    position: absolute;
                    top: 4px;
                    right: -16px;
                    transition: transform 0.3s;

                    &.accordion-on {
                        transform: rotateZ(180deg);
                    }

                    &:before {
                        color: var(--q--gb-t-c-18);
                    }
                }
            }
        }

        /** 联赛 -S*/
        .league-item {
            margin-top: 10px;
            margin-bottom: 20px;
            display: none;

            &.active {
                .hide-match {
                    display: block !important;
                }

                .yb-icon-arrow {
                    transform: rotate(270deg);
                }
            }

            .yb-icon-arrow {
                transform: rotate(90deg);
            }

            .point-wrap {
                height: 20px;
                display: flex;
                align-items: center;
            }

            .league-wrap {
                height: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                cursor: pointer;
                margin-bottom: 10px;

                .name-wrap {
                    display: flex;
                    height: 100%;
                    align-items: center;

                    .league-name {
                        color: var(--q--gb-t-c-18);
                        padding-right: 10px;
                        font-weight: 600;
                    }
                }
            }

            /** 赛事 -S*/
            .match-item {
                padding: 5px 0;
                margin-top: 5px;

                &.hide-match {
                    display: none;
                }

                .text-wrap {
                    display: flex;
                    height: 22px;
                    line-height: 22px;

                    .team {
                        cursor: pointer;
                    }

                    .score {
                        margin-left: 10px;
                        display: none;
                    }

                    .c-match-process {
                        :deep(.date-wrap) {
                            padding: 0;
                            color: #5a6074;
                            display: flex;

                            span {
                                margin-right: 5px;
                                white-space: nowrap;
                            }
                        }

                        :deep(.timer-layout2) {
                            margin-right: 5px;
                        }

                        :deep(.jingcai) {
                            display: none;
                        }

                        :deep(.process-name) {
                            margin-right: 5px;
                        }
                    }
                }
            }

            /** 赛事 -E*/
        }

        /** 联赛 -E*/
    }

    /** 类型 -E*/
}
</style>
  src/output/index.js