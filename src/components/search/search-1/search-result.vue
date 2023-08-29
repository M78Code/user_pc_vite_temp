<!-- @Description: 搜索结果 -->

<template>
    <div class="result-wrap">
        <!-- 无数据 -->
        <div class="serach-background" v-show="load_data_state != 'data'" @click.stop>
            <loadData class="fit" :state="load_data_state" :no_data_msg="t('search.null1')"
                :no_data_msg2="t('search.null2')" />
        </div>
        <!-- 滚动区域 -->
        <q-scroll-area v-show="load_data_state == 'data'" class="fit rule-scroll-area" ref="scroll">
            <div class="serach-background" @click.stop>
                <div style="height:70px"></div>
                <!-- 赛种 -->
                <div class="type-item" :class="{ active: type.is_active, inplay: type.is_inplay }"
                    v-for="(type, type_index) in list" :key="type_index">
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
                                <match-process :match_props="{ match }" show_page="match-list" :rows="1" />
                                <div class="score" v-if="type.is_inplay">{{ match.msc.S1.home }}-{{ match.msc.S1.away }}
                                </div>
                            </div>
                        </div>
                        <!-- 点点点 -->
                        <div class="point-wrap" v-if="league.league_total > 3 && !league.is_active">
                            <img src="project-path/image/svg/point.svg">
                        </div>
                    </div>
                </div>
            </div>
        </q-scroll-area>
    </div>
</template>
  
<script setup>
import { ref, reactive, watch, onUnmounted, onBeforeUnmount } from 'vue'
import loadData from "src/components/load_data/load_data.vue"
import { t } from "src/core/index.js";
import { useRouter } from 'vue-router'

import { MatchProcessFullVersionWapper as matchProcess } from "src/components/match-process/index.js"
import store from "src/store-redux/index.js";
// import details from "src/core/match-list-pc/details-class/search.js"
// import search from "src/core/search-class/search.js"

const props = defineProps({
    search_csid: {
        type: [Number, String],
        default: ''
    }
})

const emit = defineEmits(['set_show_type'])

/** 国际化 */


/** 数据加载状态 */
const load_data_state = ref('data')
/** 搜索结果数据 */
const list = reactive([])

const router = useRouter()

/** stroe仓库 */
const new_state = store.getState()
const { searchReducer } = new_state
/**
 * 获取搜索内容 default: ''
 * 路径: project_path\src\store\module\search.js
 */
const keyword = ref(searchReducer.keyword)
/**
 * 获取搜索类型 default: 1
 * 路径: project_path\src\store\module\search.js
 */
 const search_type = ref(searchReducer.search_type)
/**  */
/**
 * 获取搜索联赛关键字 default: ''
 * 路径: project_path\src\store\module\search.js
 */
 const related_keyword = ref(searchReducer.related_keyword)

/** 设置搜索联赛关键字 */
const set_click_keyword = (data) => store.dispatch({ type: 'set_click_keyword', data })
/** 设置搜索状态 */
const set_search_status = (data) => store.dispatch({ type: 'set_search_status', data })
/** 设置搜索类型 */
const set_search_type = (data) => store.dispatch({ type: 'set_search_type', data })

/**
 * @Description:点击联赛搜索
 * @param {string} league 点击的联赛
 * @return {undefined} undefined
 */
function league_click(league) {
    // search.insert_history(league.league_name)
    emit('set_show_type', 'none')
    router.push({
        name: 'search',
        params: {
            keyword: league.league_name,
        },
        query: {
            csid: props.search_csid
        }
    })
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
    // search.result_scroll = scroll.value.scrollPosition
    // search.insert_history(match.name)
    // details.on_go_detail(match, keyword.value.substr(5))
    set_search_status(false)
}

const timer = ref(null)
/**
 * @Description:获取搜索结果数据
 * @param {string} keyword 搜索关键字
 * @return {Undefined} Undefined
 */
function get_search_result(keyword, is_loading) {
    if (!keyword) {
        emit('set_show_type', 'init')
        return
    }
    //调用接口前先设置加载状态
    if (is_loading) {
        load_data_state.value = 'loading'
    }
    // emit('set_show_type','result')
    //调用接口获取获取搜索结果数据
    // search.get_search_result(keyword, props.search_csid, (load_data_state, list) => {
    //     emit('set_show_type', 'result')
    //     load_data_state.value = load_data_state
    //     list.value = list
    //     let _ref_scroll = scroll.value;
    //     timer.value = setTimeout(() => {
    //         // 如果是从详情页返回
    //         if (search.back_keyword.keyword) {
    //             nextTick(() => {
    //                 //重新设置滚动高度
    //                 _ref_scroll && _ref_scroll.setScrollPosition && _ref_scroll.setScrollPosition(search.result_scroll, 0);
    //             })
    //         } else {
    //             //重新设置滚动高度
    //             _ref_scroll && _ref_scroll.setScrollPosition && _ref_scroll.setScrollPosition(0, 0);
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
    () => props.search_csid,
    () => {
        const keword = keyword.value.substr(5)
        get_search_result(keword, true)
    }
)
// 监听搜索关键词改变
watch(
    () => keyword.value,
    (res) => {
        if (search_type.value == 2) {
            emit('set_show_type', 'none')
        } else {
            get_search_result(res.substr(5))
        }
    }
)

</script>
  
<style lang="scss" scoped>
$hover-color: #FF7000;

.result-wrap {
    width: 100%;
    height: 100%;

    .load-data-wrap {
        height: 400px !important;
        min-height: 0;

        ::v-deep .empty-wrap {
            img {
                margin-bottom: 0;
            }

            .nodata-text2 {
                font-size: 12px;
                margin-top: 2px;
            }
        }
    }

    ::v-deep .q-scrollarea__thumb {
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

                    .text-wrap .c-match-process ::v-deep .date-wrap {
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
                color: #fff;
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
                        color: #fff;
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
                        color: #fff;
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
                        ::v-deep .date-wrap {
                            padding: 0;
                            color: #5a6074;
                            display: flex;

                            span {
                                margin-right: 5px;
                                white-space: nowrap;
                            }
                        }

                        ::v-deep .timer-layout2 {
                            margin-right: 5px;
                        }

                        ::v-deep .jingcai {
                            display: none;
                        }

                        ::v-deep .process-name {
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
  