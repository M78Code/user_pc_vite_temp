<!-- @Description: 搜索面板初始化 -->

<template>
    <div
        class="wrap-init"
        @click.stop
    >
        <div style="height:50px"></div>
        <div
            class="init-wrap "
            v-if="histroy_data.length > 0"
        >
            <div class="init-row">
                <div class="line"></div>
                <div class="row-title col">
                    {{ i18n_t('search.search_record') }}
                    <!-- 搜索记录 -->
                </div>
                <div
                    class="clear-history"
                    @click="delete_histroy('')"
                    v-if="histroy_data.length"
                >
                    {{ i18n_t('search.clear_search_history') }}
                    <!-- 清除历史记录 -->
                </div>
            </div>
            <div
                class="histroy-item"
                v-for="(item, index) in histroy_data"
                :key="index"
                @click="click_keyword(item.keyword)"
            >
                <div class="ellipsis">{{ item.keyword }}</div>
                <div @click.stop="delete_histroy(item.keyword, index)">
                    <icon-wapper
                        class="search_deleteIcon"
                        name="icon-del"
                        size="8px"
                    />
                </div>
            </div>
        </div>

        <div class="init-wrap">
            <div class="init-row">
                <div class="line"></div>
                <div class="row-title col">
                    {{ i18n_t('search.search_hot') }}
                    <!-- 热词搜索 -->
                </div>
                <div
                    class="clear-history"
                    @click="get_hot_search"
                >
                    {{ i18n_t('search.change') }}
                    <!-- 换一换 -->
                </div>
            </div>
            <div
                class="hot histroy-item"
                v-for="(item, index) in hot_data"
                v-show="index < 3"
                :key="index"
                @click="click_keyword(item.keyWord, true)"
            >
                {{ index + 1 }}&ensp;&ensp;{{ item.keyWord }}
            </div>
        </div>
        <!-- 其他搜索   本期不做 -->
        <div
            class="init-wrap"
            v-if="false"
        >
            <div class="init-row">
                <div class="line"></div>
                <div class="row-title col">
                    {{ i18n_t('search.other') }}
                    <!-- 其他搜索 -->
                </div>
            </div>
            <div
                class="histroy-item other"
                @click="other_search('sports')"
            >
                <!-- 搜球类 -->
                <div>{{ i18n_t('search.search_sports') }}</div>
                <div class="yb-icon-arrow"></div>
            </div>
            <div
                class="histroy-item other"
                @click="other_search('play')"
            >
                <!-- 搜玩法 -->
                <div>{{ i18n_t('search.search_play') }}</div>
                <div class="yb-icon-arrow"></div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, watch, onMounted } from 'vue'
import lodash from 'lodash'
import { i18n_t } from "src/boot/i18n.js"
import search from "src/core/search-class/search.js"
import { IconWapper } from 'src/components/icon/index.js'
import {store, mutations} from './index.js'


// const props = defineProps({
//     show_type: {
//         type: String,
//         default: ''
//     }
// })
// const emit = defineEmits(['update:set_show_type'])

/** 历史搜索数据 */
const histroy_data = ref([])
/** 热门搜索数据 */
const hot_data = ref([])

//显示类型改变
watch(
    () => store.show_type,
    (bool) => {
        if (bool == 'init') {
            init()
        }
    }
)

// const set_click_keyword = (data) => store.dispatch({
//     type: 'SET_CLICK_KEYWORD',
//     data
// })
// const set_search_type = (data) => store.dispatch({
//     type: 'SET_SEARCH_TYPE',
//     data
// })
/**
 * @Description:点击搜索关键词
 * @param {string} keyword 点击的关键词
 * @param {boolean} is_insert_history 是否插入历史
 * @return {undefined} undefined
 */
function click_keyword(keyword, is_insert_history) {
    if (!keyword) return
    if (is_insert_history) {
        search.insert_history(keyword)
    }
    store.keyword = keyword
    // set_search_type(1)
    // set_click_keyword(keyword);
}

/**
 * @Description:获取热门搜索
 * @return {Undefined} Undefined
 */
function get_hot_search() {
    search.get_hot_search(res => {
        hot_data.value = res
    })
}

/**
 * @Description:获取搜索历史数据
 * @return {Undefined} Undefined
 */
function get_history() {
    search.get_history(data => {
        histroy_data.value = data
    })

}

/**
 * @Description:删除搜索历史
 * @param {string} keyword 删除的关键字
 * @param {number} index 删除的关键字索引
 * @return {Undefined} Undefined
 */
const delete_histroy = lodash.debounce((keyword, index) => {
    search.delete_histroy(keyword, () => {
        if (keyword) {
            histroy_data.value.splice(index, 1);
        } else {
            histroy_data.value = [];
        }
    })
}, 300)

/**
 * @Description:点击其他搜索
 * @param {string} type 搜索类型
 * @return {undefined} undefined
 */
function other_search(type) {
    // emit('update:show_type', type)
    store.show_type = type
}

/**
 * @Description:组件初始化
 * @return {undefined} undefined
 */
function init() {
    get_hot_search();
    get_history();
}
/** 钩子触发 */
onMounted(init)

</script>
  
<style lang="scss" scoped>
.wrap-init {
    padding: 5px 15px 15px 15px;
    color: #99a3b1;
    overflow: hidden;
}

.init-wrap {
    margin-bottom: 25px;

    .init-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        border-bottom: 1px solid #282b37;
        height: 42px;
        margin-bottom: 8px;

        .line {
            height: 14px;
            width: 3px;
            border-radius: 1.5px;
            margin-right: 10px;
        }

        .row-title {
            display: flex;
            align-items: center;
            line-height: 14px;
        }

        .clear-history {
            color: #5a6074;
            cursor: pointer;

            &:hover {
                color: #99a3b1;
            }
        }
    }

    .histroy-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
        padding: 0 10px;
        border-radius: 2px;
        cursor: pointer;

        &:hover {
            color: var(--q-gb-t-c-2);
            background-color: #262933;

            .yb-icon-arrow:before {
                border-color: #abbac8;
            }
        }

        .search_deleteIcon {
            cursor: pointer;

            &:before {
                color: #5a6074;
            }

            &:hover:before {
                color: #abbac8;
            }
        }

        .yb-icon-arrow {
            margin-left: 10px;
        }
    }
}</style>