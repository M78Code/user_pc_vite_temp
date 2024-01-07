<!--  @Description: 搜索输入框 -->

<template>
    <div
        class="wrap-input"
        @click.stop
    >
        <div class="search-icon-container">
            <icon-wapper
                class="search-icon"
                color="#ABBAC8"
                name="search"
                size="14px"
            />
        </div>
        <div class="input-wrap col">
            <!-- 搜索输入框 -->
            <input
                type="search"
                ref="inputRef"
                v-model="store.keyword"
                class="search-input col"
                :class="{ 'key-is-empty': !store.keyword }"
                @keyup.enter="submit"
                @input="change_txt"
                @click="input_click"
                :key="'search-input-0001'"
                :placeholder="i18n_t('common.search')"
            />
            <!-- 清空输入框按钮 -->
            <span
                class="clear_input"
                @click="clear_input"
            >
                <icon-wapper
                    class="cursor-pointer clear_input_btn"
                    name="icon-failure"
                    v-if="store.keyword != ''"
                    size="12px"
                />
            </span>
        </div>
        <!-- 关闭搜索 -->
        <div
            class="close-wrap"
            @click.stop="on_Close"
        >{{ i18n_t('common.close') }}</div>
    </div>
</template>
  
<script setup>
import { defineComponent, ref, nextTick, watch, onUnmounted, onMounted } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
import { IconWapper } from 'src/components/icon/index.js'
import {SearchPCClass} from 'src/output/project/common/pc-common.js'
import { i18n_t } from "src/boot/i18n.js"
import {store} from "./index";

const inputRef = ref(null)

// const vFocus = {
//     update: (el, value) => value && el.focus()
// }

// const props = defineProps({
//     show_type: {
//         type: String,
//         default: ''
//     }
// })

// const emit = defineEmits(['update:set_show_type', 'get_search_result'])

/** 输入关键字 */
// const keyword = ref('')
//监听输入框内容改变
// watch(
//     () => store.keyword,
//     (val) => {
//         let trimVal = val.trim();
//         if (is_focus.value) {
//             SearchPCClass.set_search_type(1)
//         }
//         // set_search_keyword(trimVal)
//         SearchPCClass.set_keyword(trimVal)
//     }
// )

/** 输入框是否获得焦点 */
// const is_focus = ref(true)
/** 进入搜索的页面 */
// const route_name = ref('')
/**
 * @Description:替换输入框非法字符为空串
 * @return {undefined} undefined
 */
function change_txt() {
    store.keyword = store.keyword.replace(/#/g, "");
    if (store.keyword.length > 20) store.keyword = store.keyword.slice(0, 20);
}

/**
 * @Description:提交搜索
 * @return {undefined} undefined
 */
function submit() {
    // const res = store.keyword.trim();
    store.keyword = store.keyword.trim();
    // if (!res) return;
    // set_search_type(1) 替换为 SearchPCClass.set_search_type(1)
    // SearchPCClass.set_search_type(1)
    // set_search_keyword(res) 替换为 SearchPCClass.set_keyword(res)
    // SearchPCClass.set_keyword(res)
}

/**
 * @Description:输入框获得焦点
 * @return {undefined} undefined
 */
// function focusclick() {
//     // is_focus.value = true
//     if (store.show_type == 'none') {
//         // emit('update:set_show_type', 'init')
//         store.show_type = 'init'
//     }
// }

/**
 * @Description 输入框点击
 * @param {undefined} undefined
 */
// function input_click() {
    // is_focus.value = true
    // const val = store.keyword.trim();
    // SearchPCClass.set_search_type(1)
    // set_search_keyword(val)
    // SearchPCClass.set_keyword(val)
// }

// const route = useRoute()
//从搜索页面跳转其他页面
// watch(
//     () => route.name,
//     (res) => {
//         if (res != 'search') {
//             set_search_status(false)
//         }
//     }
// )

// const router = useRouter()
/**
 * @Description:点击关闭搜索按钮
 * @return {undefined} undefined
 */
function on_Close() {
    // set_search_status(false)
    SearchPCClass.set_search_isShow(false)
    // 是搜索结果页时点 关闭 需要返回上一页
    // if (route.name == "search") {
    //     router.push({
    //         name: route_name.value
    //     })
    // }
    // set_unfold_multi_column(false)
}

/** 清空输入框 */
function clear_input() {
    // is_focus.value = true
    store.keyword = ""
}

/**
 * @Description:组件初始化
 * @return {undefined} undefined
 */
// function init() {
    //记录进入搜索页面
    // if (route.name == "search") {
    //     route_name.value = 'home'
    // } else {
    //     route_name.value = route.name;
    // }
    // set_search_type(2)
    // set_click_keyword(route.params.keyword || '')
    // if (search.back_keyword.keyword) {
    //     set_search_type(1)
    //     set_click_keyword(search.back_keyword.keyword)
    // }
    //输入框获得焦点
    // nextTick(() => {
        // focusclick()
    // });
// }
/** 钩子触发 */
onMounted(() => {
    nextTick(() => {
        inputRef.value.focus()
    })
})

/** stroe仓库 */
// const { searchReducer, globalReducer } = {}
/** 
 * 点击的关键字 default: ''
 * 路径: project/src/store/module/search.js
 */
// const click_keyword = ref({})
/** 
 * global_click 全局点击事件数 default: 0
 * 路径: project_path\src\store\module\global.js
 */
// const global_click = ref({})

// const unsubscribe = store.subscribe(() => {
//     const { searchReducer: new_searchReducer, globalReducer: new_globalReducer } = {};
//     click_store._keyword = ''
//     global_click.value = ''
// })
/** 销毁监听 */
// onUnmounted(unsubscribe)

/** 保存显示搜索组件状态 */
// const set_search_status = (data) => store.dispatch({ type: 'SET_SEARCH_STATUS', data })
/** 保存联想搜索关键字 */
// const set_related_keyword = (data) => store.dispatch({ type: 'SET_RELATED_KEYWORD', data })
/** 保存搜索关键字 */
// const set_search_keyword = (data) => store.dispatch({ type: 'SET_SEARCH_KEYWORD', data })
/** 保存搜索的联赛名 */
// const set_click_keyword = (data) => store.dispatch({ type: 'SET_CLICK_KEYWORD', data })
/** 保存搜索类型 */
// const set_search_type = (data) => store.dispatch({ type: 'SET_SEARCH_TYPE', data })
/** 是否展开多列玩法 */
// const set_unfold_multi_column = (data) => store.dispatch({ type: 'SET_UNFOLD_MULTI_COLUMN', data })

//监听点击搜索关键词改变
// watch(
//     () => click_store._keyword,
//     (val) => {
//         let res = val.substr(5);
//         if (res == store._keyword) {
//             // set_search_keyword(res)
//             SearchPCClass.set_keyword(res)
//         } else {
//             store._keyword = res
//         }
//     }
// )

//点击任何地方关闭搜素
// watch(
//     () => global_click.value,
//     () => {
//         if (route.name != 'search') {
//             on_Close()
//         }
//     }
// )

</script>

<script>
export default defineComponent({
    name: "search_input",
})

</script>
  
<style lang="scss" scoped>
.wrap-input {
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: var(--q-gb-bg-c-11);
    border-top: 1px solid var(--q-header-search-color-3);
    border-bottom: 1px solid var(--q-header-search-color-3);
    margin-bottom: 5px;

    .search-icon-container {
        padding-left: 15px;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .search-icon {
        margin-right: 10px;
    }

    .input-wrap {
        display: flex;
        align-items: center;

        .search-input {
            outline: none;
            background: none;
            border: none;
            color: var(--q-header-search-color-1);
            font-size: 12px;
            caret-color: #999999;

            // &.key-is-empty {
            //   color: #0089e1 !important;
            // }
            &::placeholder {
                font-size: 12px;
                color: #999 !important;
                opacity: 0.5;
            }
        }

        .clear_input {
            width: 40px;
            height: 21px;
            display: flex;
            justify-content: center;
            align-items: center;
            // .clear_input_btn {
            //   &:before {
            //     color: #5a6074;
            //   }
            // }
        }
    }

    .close-wrap {
        height: 18px;
        line-height: 18px;
        cursor: pointer;
        border-left: 1px solid var(--q-gb-bd-c-4); // #999999
        padding: 0 20px;
        color: var(--q-gb-t-c-10); // #888888

        &:hover {
            color: var(--q-gb-t-c-6); // #555555
        }
    }
}
</style>
  