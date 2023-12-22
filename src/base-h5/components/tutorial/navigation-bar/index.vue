<!--
 * @Description:盘口教程头部复用操作组件
-->
<template>
    <div class="navigation-bar" :style="{borderBottomColor: borderBottomNoShow && 'transparent'}">
        <div class="navigation-bar-left">
            <div class="navigation-bar-close" @click="set_back">
                <!-- <div class="img" :style="compute_css_obj('menu-go-back-icon')"></div> -->
                    <img
                    class="img"
                    :src="compute_local_project_file_path('/image/svg/go-back-icon.svg')"
                    alt=""
                />
            </div>
        </div>
        <div v-if="centerContentType === 'text'" class="navigation-bar-center font-weight-bold text-no-wrap">
            <span>{{ title }}</span>
        </div>
        <div v-else :style="{'flex' : ['switch', 'select'].includes(centerContentType) && 3}" class="navigation-bar-center navigation-bar-center-slot">
            <slot name="center"></slot>
        </div>
        <div class="navigation-bar-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script setup>
import { i18n_t, compute_css_obj } from "src/output/index.js";
import { useRouter,useRoute } from "vue-router";
import {compute_local_project_file_path} from "src/output/index.js";
import { MenuData } from "src/output/module/menu-data.js"

defineOptions({
    name: 'navigationBar' // 设置组件名称
})

const router = useRouter();

const props = defineProps({
    centerContentType: {
        type: String,
        default: 'text' // switch (顶部菜单切换) select（顶部选择）都使用slot方式  text（顶部title） 使用直接展示
    },
    title: {
        type: String,
        default: '请在组件中设置title值'
    },
    borderBottomNoShow: {
        type: Boolean,
        default: false
    },
    goBackAssign: {
        type: Function,
        default: null
    }
})

const set_back = () => {
    MenuData.set_current_lv1_menu('');
    MenuData.set_top_menu_title({})
    MenuData.set_init_menu_list()
    router.back()
    if (props.goBackAssign !== null) {
        props.goBackAssign()
    }
}

</script>
<style scoped lang="scss">
// 组件样式
.navigation-bar {
    max-height: .6rem;
    height: .44rem;
    display: flex;
    justify-content: space-between;
    border-bottom: .01rem solid var(--q-gb-bd-c-6);
    &-close {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding-left: .14rem;
        .img {
            height: .14rem;
            width: .08rem;
        }
    }
    &-center, &-left, &-right {
        flex: 1;
        display: flex;
        align-items: center;
       
    }
    &-center {
        justify-content: center;
        overflow: hidden;
        color: var(--q-gb-t-c-18);
        flex: 2;
        span {
            font-size: .18rem;
            width: 100%;
            overflow: hidden;
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
        }
    }
    &-left {
        justify-content: flex-start;
    }
    &-right {
        justify-content: flex-end;
    }
}
</style>