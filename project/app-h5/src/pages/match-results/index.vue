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
            <div class="right-icon"></div>
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

    <!-- <match-container2 /> -->

</template>
<script setup>
import { onMounted, onBeforeMount, reactive } from "vue";
import { ScrollMenu } from 'src/base-h5/components/menu/app-h5-menu/index'
import navigationBar from 'src/base-h5/components/tutorial/navigation-bar/index.vue'
import { scrollMenu } from "src/base-h5/components/menu/app-h5-menu/utils.js"
import matchContainer from "src/base-h5/components/match-list/index.vue";
import { i18n_t, compute_css_obj, MenuData } from "src/core/index.js";
import { is_results, is_kemp } from 'src/base-h5/mixin/menu.js'


// import matchContainer2 from "src/base-h5/components/match-list/components/match-container-2.vue";

const switchMenu = ['普通赛果', '冠军赛果']
const slideMenu = ['11/16', '11/15', '11/14', '11/13', '11/12', '11/11', '11/10', '11/09', '11/08', '11/07', '11/06', '11/05', '11/04']
const props = defineProps({})
const state = reactive({
    currentSwitchValue: 0, // 普通赛果：0  冠军赛果：1
    currentSlideValue: 0, // 日期数 目前slideMenu写死
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
    scrollMenu(e, ".slide-box", ".switch-item-active");
}

onMounted(()=>{
    set_menu_lv1({mi:28})
})

const set_menu_lv1 = item => {
    MenuData.set_current_lv1_menu(item.mi);
    MenuData.get_menu_lvmi_list(item.mi)
}

// onBeforeMount(() => {
// })
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
