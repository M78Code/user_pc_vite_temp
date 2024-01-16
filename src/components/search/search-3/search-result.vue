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
                        <div class="point-wrap">
                            <img :src="compute_local_project_file_path('/image/svg/point.svg')">
                        </div>
                    </div>
                </div>
            </div>
        </q-scroll-area>
    </div>
</template>
  
<script setup>
import { ref, reactive, watch, onBeforeUnmount ,nextTick} from 'vue'
import { useRouter } from 'vue-router'
import { SearchPCClass } from 'src/output/index.js'
import { project_name, i18n_t } from 'src/output/index.js';
import { useMittOn, MITT_TYPES, useMittEmit } from 'src/core/mitt';
import { MatchProcessFullVersionWapper as matchProcess } from "src/components/match-process/index.js"
import lodash from "lodash";
import details from "src/core/match-list-pc/details-class/details.js"
import search from "src/core/search-class/search.js"
import {store, mutations} from './index.js'
import loadData from "src/components/load_data/load_data.vue"
import { compute_local_project_file_path } from "src/output/index.js";
const router = useRouter()
const scrollRef = ref(null)
const timer = ref(null)

/**
 * @Description:点击联赛搜索
 * @param {string} league 点击的联赛
 * @return {undefined} undefined
 */
function league_click(league) {
    if(!league) return
    search.insert_history(league.league_name)
    const { csid } = league.children[0]
    store.show_type = 'none'
	router.push(`/search/${league.league_name}/${csid}`)
    // SearchPCClass.set_search_isShow(false);
	useMittEmit(MITT_TYPES.EMIT_SET_SEARCH_CHANGE_WIDTH, {
		focus: false,
		text: ''
	})
    // mutations.clear_handle()
}

/**
 * @Description:点击赛事搜索
 * @param {object} match 点击的赛事
 * @return {undefined} undefined
 */
function match_click(match) {
    console.log('match_clickmatch_clickmatch_clickmatch_click', match)
	if(!match) return;
    search.result_scroll = scrollRef.value.getScrollPosition()
    search.insert_history(match.name)
	const { mid, tid, csid } = match
    // details.on_go_detail(match, keyword.value.substr(5),router)
    // router.push(`/details/${mid}/${csid}/${tid}?keyword=${store.keyword}`)
    router.push({path:`/details/${mid}/${csid}/${tid}`, query: { keyword: store.keyword}})
    SearchPCClass.set_search_isShow(false);
    useMittEmit(MITT_TYPES.EMIT_SET_SEARCH_CHANGE_WIDTH, {
		focus: false,
		text: ''
	})
    // mutations.clear_handle()
}

/**
 * @Description:获取搜索结果数据
 * @param {string} keyword 搜索关键字
 * @return {Undefined} Undefined
 */
function get_search_result() {
    if (!store.keyword) {
        store.show_type = 'init'
        return
    }
    mutations.get_search_result_handle()
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
}
onBeforeUnmount(() => {
    if (timer.value) {
        clearTimeout(timer.value)
        timer.value = null
    }
})

// 监听搜索关键词改变
watch(
    () => store.keyword,
    lodash.debounce((res) => {
            get_search_result(res)
            console.log(117887278)
    }, 300)
)

// 监听搜索球种变化
watch(
    () => store.search_csid,
    () => {
        if (store.keyword) {
            get_search_result()
            console.log('jhkjksajk')
        }
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