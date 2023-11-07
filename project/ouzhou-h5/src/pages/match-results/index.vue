<template>
    <navigation-bar centerContentType="switch" borderBottomNoShow>
        <template v-slot:center>
            <div class="switch-box">
                <div v-for="(item, index) in switchMenu" :key="'swtich-' + index" @click="switchHandle(index)"
                    :class="['switch-item', state.currentSwitchValue === index && 'switch-item-active']"><span>{{ item
                    }}</span>
                </div>
            </div>
        </template>
        <template v-slot:right>
            <div class="right-icon" @click="state.select_dialog = true"></div>
        </template>
    </navigation-bar>

    <div class="slide-box">
        <div v-for="(item, index) in slideMenu" @click="slideHandle(index,$event)" :class="['slide-item', state.currentSlideValue === index &&
            'slide-item-active']" :key="'slide-' + index">
            <span>{{ item }}</span>
        </div>
    </div>

    <ScrollMenu />

    <match-container />

    <!--  弹窗  -->
    <div v-if="state.select_dialog" position="bottom" class="select-mask" :style="`height:${inner_height}px`">
        <div style="height:100%;width: 100%" @click="state.select_dialog = false"></div>
        <!-- 搜索联赛 -->
        <setect-league @closedHandle="state.select_dialog = false" @finishHandle="selectFinishHandle"></setect-league>
    </div>

    <!-- 设置 -->
    <!-- <match-container2 /> -->

</template>
<script setup>
import { onMounted, onBeforeMount, reactive } from "vue";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import { ScrollMenu } from 'src/base-h5/components/menu/app-h5-menu/index'
import navigationBar from 'src/base-h5/components/tutorial/navigation-bar/index.vue'
import settingFilter from 'src/base-h5/components/setting-filter/index.vue'
import setectLeague from 'src/base-h5/components/setect-league/index.vue'
import { scrollMenuEvent } from "src/base-h5/components/menu/app-h5-menu/utils.js"
import matchContainer from "src/base-h5/components/match-list/index.vue";
import { i18n_t, compute_css_obj, MenuData } from "src/core/index.js";
import { is_results, is_kemp } from 'src/base-h5/mixin/menu.js'


// import matchContainer2 from "src/base-h5/components/match-list/components/match-container-2.vue";
const inner_height = window.innerHeight;  // 视口高度
const switchMenu = [i18n_t('app_h5.match.normal_results'), i18n_t('app_h5.match.championship_results')]
const slideMenu = ['11/16', '11/15', '11/14', '11/13', '11/12', '11/11', '11/10', '11/09', '11/08', '11/07', '11/06', '11/05', '11/04']
const props = defineProps({})
const state = reactive({
    currentSwitchValue: 0, // 普通赛果：0  冠军赛果：1
    currentSlideValue: 0, // 日期数 目前slideMenu写死
    select_dialog:false,
    setting_dialog: false
})

const switchHandle = (val) => {
    state.currentSwitchValue = val
    if (val) {
        set_menu_lv1({mi:400})
    } else {
        set_menu_lv1({mi:2})
    }
    console.log(MenuData,'--------------------is_results------------------是否 赛果', is_results.value, is_kemp.value)
}
const slideHandle = (val, e) => {
    if (state.currentSlideValue === val) return
    state.currentSlideValue = val
    scrollMenuEvent(e, ".slide-box", ".switch-item-active");
}

const selectFinishHandle = (val) => {
    console.log('选择完成')
    state.select_dialog = false
}

onMounted(()=>{
    set_menu_lv1({mi:28})
})

const set_menu_lv1 = item => {
    MenuData.set_current_lv1_menu(item.mi);
    MenuData.get_menu_lvmi_list(item.mi)
    MenuData.get_results_menu();
    setTimeout(() => {
        MatchMeta.get_results_match()
    }, 2000)
}

// onBeforeMount(() => {
// })
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
