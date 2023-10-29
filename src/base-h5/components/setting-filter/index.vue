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
            <div class="setting-item border" v-for="item in setting_list">
                <div class="title">
                    {{ item.name }}
                </div>
                <div class="more">
                    <Switch v-model:value="item.switchValue" :leftVal="item.leftVal" :rightVal="item.rightVal" />
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
    { name: '投注模式', leftVal: '新手版', rightVal: '专业版', switchValue: 'rightVal' },
    { name: '排序规则', leftVal: '热门', rightVal: '时间', switchValue: 'rightVal' },
    { name: '盘口设置', leftVal: '欧洲盘', rightVal: '香港盘' },
    { name: '字号大小', leftVal: '默认', rightVal: '放大' },
    { name: '主题风格', leftVal: '日间', rightVal: '夜间' },
    { name: '每日活动', leftVal: '开启', rightVal: '关闭' },
])

const closedHandle = () => {
    emit("closedHandle");
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