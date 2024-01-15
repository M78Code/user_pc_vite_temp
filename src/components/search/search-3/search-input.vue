<!--  @Description: 搜索输入框 -->

<template>
    <div
        class="wrap-input"
        @click.stop
        :style="page_style"
    >
        <div class="search-icon-container" >
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
import { defineComponent, ref, nextTick, onMounted } from 'vue'
import { IconWapper } from 'src/components/icon/index.js'
import {SearchPCClass} from 'src/output/project/common/pc-common.js'
import { i18n_t } from "src/boot/i18n.js"
import {store, mutations} from "./index";
import { useRoute, useRouter } from 'vue-router'
import { compute_css_variables } from "src/core/css-var/index.js"
const page_style = ref('')
const router = useRouter()
const route = useRoute()
const inputRef = ref(null)
page_style.value = compute_css_variables({ category: 'component', module: 'header-search' })
function change_txt() {
    store.keyword = store.keyword.replace(/#/g, "");
    if (store.keyword.length > 20) store.keyword = store.keyword.slice(0, 20);
}

function submit() {
    mutations.get_search_result_handle()
}

function on_Close() {
    if (route.name == "search") {
        router.push({
            name: 'home'
        })
    }
    SearchPCClass.set_search_isShow(false)
}

function input_click() {
    store.show_type = 'result'
}

function clear_input() {
    store.keyword = ""
    store.show_type = 'init'
}

onMounted(() => {
    nextTick(() => {
        inputRef.value.focus()
    })
})
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
    background-color: var(--q-gb-bg-c-30);
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
            color: var(--q-gb-t-c-6);

            // &.key-is-empty {
            //   color: #0089e1 !important;
            // }
            &::placeholder {
                font-size: 12px;
                color: #BACCFC;
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
  