<!--  @Description: 搜索输入框 -->

<template>
    <div class="wrap-input" @click.stop>
        <div class="search-icon-container">
            <icon class="search-icon" color="#ABBAC8" name="icon-search" size="14px" />
        </div>
        <div class="input-wrap col">
            <!-- 搜索输入框 -->
            <input type="search" v-model="keyword" class="search-input col" v-focus="is_focus"
                :class="{ 'key-is-empty': !keyword }" @blur="is_focus = false" @keyup.enter="submit" @input="change_txt"
                @click="input_click" :key="'search-input-0001'" :placeholder="$root.$t('common.search')" />
            <!-- 清空输入框按钮 -->
            <span class="clear_input" @click="clear_input">
                <icon class="cursor-pointer clear_input_btn" name="icon-failure" v-if="keyword != ''" size="12px" />
            </span>
        </div>
        <!-- 关闭搜索 -->
        <div class="close-wrap" @click.stop="onClose">{{ $root.$t('common.close') }}</div>
    </div>
</template>
  
<script>
import { defineComponent, ref, nextTick, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from "src/store-redux/index.js";
// TODO: 待确认
import search from "src/public/utils/searchClass/search.js"


export default defineComponent({
    name: "search_input",
    directives: {
        focus: {
            //根据focusState的状态改变是否聚焦focus
            update: function (el, value) {    //第二个参数传进来的是个json
                if (value) {
                    el.focus()
                }
            }
        }
    },
    props: {
        show_type: {
            type: String,
            default: ''
        }
    },
    setup(props, { emit }) {
        /** 输入关键字 */
        const keyword = ref('')
        //监听输入框内容改变
        watch(
            () => keyword.value,
            () => {
                let trimVal = val.trim();
                if (is_focus.value) {
                    set_search_type(1)
                }
                set_search_keyword(trimVal)
            }
        )

        /** 输入框是否获得焦点 */
        const is_focus = ref(false)
        /** 进入搜索的页面 */
        const route_name = ref('')
        /**
         * @Description:替换输入框非法字符为空串
         * @return {undefined} undefined
         */
        function change_txt() {
            keyword.value = keyword.value.replace(/#/g, "");
            if (keyword.value.length > 20) keyword.value = keyword.value.slice(0, 20);
        }

        /**
         * @Description:提交搜索
         * @return {undefined} undefined
         */
        function submit() {
            const keyword = keyword.value.trim();
            if (!keyword) return;
            set_search_type(1)
            set_search_keyword(keyword);
        }

        /**
         * @Description:输入框获得焦点
         * @return {undefined} undefined
         */
        function focusclick() {
            is_focus.value = true
            if (show_type.value == 'none') {
                emit('set_show_type', 'init')
            }
        }

        /**
         * @Description 输入框点击
         * @param {undefined} undefined
         */
        function input_click() {
            is_focus.value = true
            const keyword = keyword.value.trim();
            set_search_type(1)
            set_search_keyword(keyword)
        }

        const route = useRoute()
        //从搜索页面跳转其他页面
        watch(
            () => route.name,
            (res) => {
                if (res != 'search') {
                    set_search_status(false)
                }
            }
        )

        const router = useRouter()
        /**
         * @Description:点击关闭搜索按钮
         * @return {undefined} undefined
         */
        function onClose() {
            set_search_status(false)
            // 是搜索结果页时点 关闭 需要返回上一页
            if (route.name == "search") {
                router.push({
                    name: route_name.value
                })
            }
            set_unfold_multi_column(false)
        }

        /** 清空输入框 */
        function clear_input() {
            is_focus.value = true
            keyword.value = ""
        }

        /**
         * @Description:组件初始化
         * @return {undefined} undefined
         */
        function init() {
            //记录进入搜索页面
            if (route.name == "search") {
                route_name.value = 'home'
            } else {
                route_name.value = route.name;
            }
            set_search_type(2)
            set_click_keyword(route.params.keyword || '')
            // TODO: search.js
            if (search.back_keyword.keyword) {
                set_search_type(1)
                set_click_keyword(search.back_keyword.keyword)
            }
            //输入框获得焦点
            nextTick(() => {
                if (route.name != 'search') {
                    focusclick()
                }
            });
        }
        /** 钩子触发 */
        onMounted(init)

        //监听点击搜索关键词改变
        watch(
            () => click_keyword.value,
            () => {
                let keyword = res.substr(5);
                if (keyword == keyword.value) {
                    set_search_keyword(keyword)
                } else {
                    keyword.value = res.substr(5);
                }
            }
        )

        //点击任何地方关闭搜素
        watch(
            () => global_click.value,
            () => {
                if (route.name != 'search') {
                    onClose()
                }
            }
        )

        /** 搜索点击的关键字 */
        const click_keyword = ref()
        /** 用户token */
        const global_click = ref()
        /** stroe仓库 */
        const unsubscribe = store.subscribe(() => {
            const new_state = store.getState()
            click_keyword.value = new_state.click_keyword
            global_click.value = new_state.global_click
        })
        onUnmounted(unsubscribe)

        /** 保存显示搜索组件状态 */
        const set_search_status = (data) => store.dispatch({ type: 'set_search_status', data })
        /** 保存联想搜索关键字 */
        const set_related_keyword = (data) => store.dispatch({ type: 'set_related_keyword', data })
        /** 保存搜索关键字 */
        const set_search_keyword = (data) => store.dispatch({ type: 'set_search_keyword', data })
        /** 保存搜索的联赛名 */
        const set_click_keyword = (data) => store.dispatch({ type: 'set_click_keyword', data })
        /** 保存搜索类型 */
        const set_search_type = (data) => store.dispatch({ type: 'set_search_type', data })
        /** 是否展开多列玩法 */
        const set_unfold_multi_column = (data) => store.dispatch({ type: 'set_unfold_multi_column', data })

        return {
            keyword,
            is_focus,
            route_name,
            change_txt,
            submit,
            focusclick,
            input_click,
            onClose,
            clear_input
        }
    } 
})

</script>
  
<style lang="scss" scoped>
.wrap-input {
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: var(--qq--theme-bg-search-match);
    border-top: 1px solid var(--qq--theme-bd-color-notice);
    border-bottom: 1px solid var(--qq--theme-bd-bottom-searchBox);
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
            color: var(--qq--theme-color-text-activeOrSearch);
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
        border-left: 1px solid var(--qq--theme-bd-color-close);
        padding-left: 10px;
        color: var(--qq--theme-color-text-close);

        &:hover {
            color: var(--qq--theme-color-text-close-hover);
        }
    }
}
</style>
  