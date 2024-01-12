<!--
 * @Description:盘口教程头部复用操作组件
-->
<template>
    <div class="navigation-bar-header">
    <div class="navigation-bar" :style="{ borderBottomColor: borderBottomNoShow && 'transparent' }">
        <div class="navigation-bar-left">
            <div class="navigation-bar-close" @click="set_back">
                <div class="img" :style="compute_css_obj({ key: 'h5_back_img' })"></div>
                <!-- <img
                    class="img"
                    :src="compute_local_project_file_path('/image/svg/go-back-icon1.svg')"
                    alt=""
                /> -->
            </div>
        </div>
        <div v-if="centerContentType === 'text'" class="navigation-bar-center font-weight-bold text-no-wrap">
            <span>{{ title }}</span>
        </div>
        <div v-else :style="{ 'flex': ['switch', 'select'].includes(centerContentType) && centerFlex }"
            class="navigation-bar-center navigation-bar-center-slot">
            <slot name="center"></slot>
        </div>
        <div class="navigation-bar-right">
            <slot name="right"></slot>
        </div>
    </div>
    </div>
</template>
<script setup>
import { compute_css_obj } from "src/output/index.js";
import { useRouter, useRoute } from "vue-router";
import {compute_local_project_file_path,PageSourceData} from "src/output/index.js";
import { MenuData } from "src/output/project/index.js"
import BetData from 'src/core/bet/class/bet-data-class.js'
// import setectLeague from './setect-league.vue'
import { ref } from "vue";
defineOptions({
    name: 'navigationBar' // 设置组件名称
})

const router = useRouter();
const emit = defineEmits(['goBackHandle'])


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
    },
    centerFlex: {
        type: Number,
        default: 3
    },
    useCustomGoBack: {
        type: Boolean,
        default: false
    }
})
//筛选窗口
const select_dialog = ref(false);
// // 视口高度
// const inner_height = window.innerHeight;

const set_back = () => {
    if (props.useCustomGoBack) {
        emit('goBackHandle')
        return
    }
    const hash = location.hash //可能是url 直接跳进来 有返回按钮 那就先保存hash
    try{
        MenuData.set_current_lv1_menu('');
        MenuData.set_top_menu_title({})
        MenuData.set_init_menu_list()
        if (props.goBackAssign !== null) {
            props.goBackAssign()
        }
        router.push({name: PageSourceData.from_page_source || 'matchList'})
    }finally{
        setTimeout(() => {
            if (hash == location.hash) { //跳转过后如果过hash相同 就直接跳回首页
                router.replace("/")
            }
        }, 100);
    }
    BetData.set_is_bet_single('single')
    BetData.set_clear_bet_info()
}
// /**
//  * 打开联赛筛选框
//  */
// const searchClick = () => {
//     select_dialog.value = true
// }
</script>
<style scoped lang="scss">
// 组件样式
.navigation-bar-header{
    height: .44rem;
    display: block;
}
.navigation-bar {
    max-height: .6rem;
    height: .44rem;
    display: flex;
    justify-content: space-between;
    border-bottom: .01rem solid var(--q-gb-bd-c-6);

    &-close {
            width: 0.3rem;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex: 1 1;
            .img {
              width: 0.3rem;
              height: 100%;
              background-position: center ;
              //background: url($SCSSPROJECTPATH + '/image/common/go_back.svg') no-repeat center / 96% 96%;
              background-size: 0.1rem auto;
              margin-left: 0.05rem;
             
            }
        
    }

    &-center,
    &-left,
    &-right {
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

.select-mask {
    position: fixed;
    width: 100vw;
    background: rgba(0, 0, 0, 0.4);
    top: 0;
    z-index: 2000;
    left: 0
}</style>