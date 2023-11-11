<template>
    <scroll-menu menu_type="1" :is_show_badge="false"  v-if="MenuData.menu_list.length" />
    <div class="match-container">
        <date-tab :reverse="1"/>
        <match-container />
    </div>
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
import { watch,onMounted, onBeforeMount, reactive } from "vue";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import setectLeague from 'src/base-h5/components/setect-league/index.vue'
import { scrollMenuEvent } from "src/base-h5/components/menu/app-h5-menu/utils.js"
import matchContainer from "src/base-h5/components/match-list/index.vue";
import { i18n_t, compute_css_obj, MenuData } from "src/core/index.js";
import { is_results, is_kemp } from 'src/base-h5/mixin/menu.js'
import scrollMenu from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-menu.vue';
import dateTab from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/date-tab/date-tab.vue';

// watch(() => MenuData.update_time.value, () => {
//   console.log("菜单id-球类id-对应euid",`${MenuData.menu_type.value}-${MenuData.menu_mi.value}-${MenuData.get_euid()}`)
// })

// import matchContainer2 from "src/base-h5/components/match-list/components/match-container-2.vue";
const inner_height = window.innerHeight;  // 视口高度
const props = defineProps({})
const state = reactive({
    select_dialog:false,
})

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
    // MenuData.get_results_menu();
    setTimeout(() => {
        MatchMeta.get_results_match()
    }, 2000)
}

// onBeforeMount(() => {
// })
</script>
<style scoped lang="scss">
@import "./index.scss";
.match-container{
    height: calc(100% - 1.71rem);
    overflow: hidden;
    overflow-y: auto;
}
</style>
