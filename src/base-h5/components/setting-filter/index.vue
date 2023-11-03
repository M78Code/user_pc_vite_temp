<!--
 * @Description:设置弹出框内 滑动组件
    style中已经计算出最大高度，直接内容撑开即可
-->
<template>
    <div class="setting-filter">
        <div class="setting-top setting-item">
            <div class="title">
                {{i18n_t('footer_menu.league_filter')}}<span>{{'(' + i18n_t('footer_menu.selected') + '16' + ')'}}</span>
            </div>
            <div class="more">
                {{ i18n_t('app_h5.filter.more') }}
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
                    {{ i18n_t('app_h5.cathectic.handicap_tutorial') }}
                </div>
                <div class="more">
                    >
                </div>
            </div>
            <div class="setting-item">
                <div class="title">
                    {{ i18n_t('app_h5.filter.go_old_version') }}
                </div>
                <div class="goto-website">
                    {{ i18n_t('app_h5.filter.go_web_version') }}
                </div>
            </div>
        </div>
        <div class="closed-btn" @click="closedHandle">
            <span>{{ i18n_t('common.close') }}</span>
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
//   i18n_t('footer_menu.bet_model')
const setting_list = ref([
    { name: i18n_t('footer_menu.bet_model'), leftVal: i18n_t('footer_menu.new_v'), rightVal: i18n_t('footer_menu.pro_v'), switchValue: 'rightVal' },
    { name: i18n_t('footer_menu.sort_title'), leftVal: i18n_t('footer_menu.hot'), rightVal: i18n_t('footer_menu.time'), switchValue: 'rightVal' },
    { name: i18n_t('footer_menu.odds_set'), leftVal: i18n_t('setting_menu.odd_europe2'), rightVal: i18n_t('setting_menu.odd_hong_kong2') },
    { name: i18n_t('app_h5.filter.font_size'), leftVal: i18n_t('app_h5.filter.default'), rightVal: i18n_t('app_h5.filter.enlarge') },
    { name: i18n_t('footer_menu.theme'), leftVal: i18n_t('footer_menu.daytime'), rightVal: i18n_t('footer_menu.night') },
    { name: i18n_t('app_h5.filter.daily_activities'), leftVal: i18n_t('app_h5.filter.turn_on'), rightVal: i18n_t('common.close') },
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