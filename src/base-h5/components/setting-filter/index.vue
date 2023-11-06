<!--
 * @Description:设置弹出框内 滑动组件
    style中已经计算出最大高度，直接内容撑开即可
-->
<template>
    <div class="setting-filter">
        <div class="setting-top setting-item">
            <div class="title">
                联赛筛选<span> (已选16)</span>
            </div>
            <div class="more">
                更多>
            </div>
        </div>
        <div class="setting-list">
            <div class="setting-item border" v-for="item in setting_list" :key="item.name">
                <div class="title">
                    {{ item.name }}
                </div>
                <div class="more">
                    <Switch v-model:value="item.switchValue" :leftVal="item.leftVal" :rightVal="item.rightVal" @click="switch_hanle(item)"/>
                </div>
            </div>
            <div class="setting-item" @click="jumpHandle">
                <div class="title">
                    盘口教程
                </div>
                <div class="more">
                    >
                </div>
            </div>
            <div class="setting-item">
                <div class="title">
                    前往旧版
                </div>
                <div class="goto-website">
                    前往网页版
                </div>
            </div>
        </div>
        <div class="closed-btn" @click="closedHandle">
            <span>关闭</span>
        </div>
    </div>
</template>
<script setup>
import { i18n_t, compute_css_obj } from "src/core/index.js";
import { useRouter, useRoute } from "vue-router";
import { ref, watch, computed, nextTick, onBeforeUnmount, onMounted } from 'vue';
import Switch from './components/switch.vue';


defineOptions({
    name: 'settingFilter' // 设置组件名称
})

const router = useRouter();

const jumpHandle = () => {
    router.push({ name: "handicapTutorial" }); // 此处跳转至盘口教程
    closedHandle()
}

defineProps({

})

const emit = defineEmits(["closedHandle"]);

const setting_list = ref([
    { name: '投注模式', leftVal: '新手版', rightVal: '专业版', switchValue: 'rightVal',mark:'version' },
    { name: '排序规则', leftVal: '热门', rightVal: '时间', switchValue: 'rightVal',mark:'sort' },
    { name: '盘口设置', leftVal: '欧洲盘', rightVal: '香港盘',mark:'Handicap' },
    { name: '字号大小', leftVal: '默认', rightVal: '放大',mark:'size' },
    { name: '主题风格', leftVal: '日间', rightVal: '夜间',mark:'theme'},
    { name: '每日活动', leftVal: '开启', rightVal: '关闭',mark:'activity' },
])

const closedHandle = () => {
    emit("closedHandle");
}
/**
 *@description 设置菜单改变
 *@return {Undefined} undefined
 */
const switch_hanle = (item) => {
    const type = item.mark
    const typeMap = {
    version: version_hanle,
    sort: sort_hanle,
    Handicap: Handicap_hanle,
    size: size_hanle,
    theme: theme_hanle,
    activity: activity_hanle,
  }
  typeMap[type] && typeMap[type](item)
}
/**
 *@description 处理版本改变
 *@return {Undefined} undefined
 */
const version_hanle = (item) => {
    console.log('item',item)
}
/**
 *@description 处理排序规则
 *@return {Undefined} undefined
 */
const sort_hanle = (item) => {
    console.log('item',item)
}
/**
 *@description 处理盘口设置
 *@return {Undefined} undefined
 */
const Handicap_hanle = (item) => {
    console.log('item',item)
}
/**
 *@description 处理字号大小
 *@return {Undefined} undefined
 */
const size_hanle = (item) => {
    console.log('item',item)
}
/**
 *@description 处理主题风格
 *@return {Undefined} undefined
 */
const theme_hanle = (item) => {
    console.log('item',item)
}
/**
 *@description 处理每日活动
 *@return {Undefined} undefined
 */
const activity_hanle = (item) => {
    console.log('item',item)
}

</script>
<style scoped lang="scss">
// 组件样式
.setting-filter {
    width: 100%;
    max-width: unset !important;
    /*  兼容性问题,高度的调整影响到安卓手机的软键盘弹出 */
    max-height: calc(var(--vh, 1vh) * 100 - 80px) !important;
    //   border-radius: 0.16rem 0.16rem 0 0;
    position: absolute;
    bottom: 0;
    background: var(--q-gb-bd-c-1);
    backdrop-filter: blur(5px);

    .setting-top.setting-item {
        border-bottom: .08rem solid var(--q-gb-t-c-8);
        padding: 0.14rem;
        margin: 0;
    }

    .setting-item {
        height: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.14rem;
        padding: 0.14rem 0;
        margin: 0 0.14rem;

        &.border {
            border-bottom: 1px solid var(--q-gb-t-c-8);
        }

        .title {
            color: var(--q-gb-bd-c-2);

            span {
                color: var(--q-gb-bd-c-4);
            }
        }

        .more {
            color: var(--q-gb-bd-c-4);
        }

        .goto-website {
            width: 1.04rem;
            height: 0.28rem;
            line-height: 0.28rem;
            background-color: #F3FAFF;
            border-radius: 0.18rem;
            text-align: center;
            color: #7981a4;
            font-weight: 500;
        }
    }

    .closed-btn {
        display: flex;
        padding: .13rem;
        align-items: center;
        justify-content: center;
        border-top: .08rem solid var(--q-gb-t-c-8);

        span {
            font-size: .18rem;
        }
    }
}
</style>