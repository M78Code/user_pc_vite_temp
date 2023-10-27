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
    </navigation-bar>

    <div class="slide-box">
        <div v-for="(item, index) in slideMenu" @click="slideHandle(index)" :class="['slide-item', state.currentSlideValue === index &&
            'slide-item-active']" :key="'slide-' + index">
            <span>{{ item }}</span>
        </div>
    </div>

    <div class="match-options">
        <div class="option" v-for="( item, index ) in MenuData.get_menu_lvmi_list(MenuData.current_lv_1_menu_mi.value)"
            :key="lodash.get(item, 'mi')">
            <span class="sport-icon-wrap"
                :style="compute_css_obj({ key: MenuData.current_lv_2_menu_mi == item.mi ? 'menu-sport-active-image' : 'menu-sport-icon-image', position: format_type(item) })"></span>
            <div class="title" :class="{
                esport: is_export,
                'din-regular': is_export
            }
                ">
                {{ item.name || MenuData.get_menus_i18n_map(item.mi) }}
            </div>
        </div>
    </div>

    <!-- <ScrollMenu /> -->
</template>
<script setup>
import lodash from "lodash";
import { onMounted, onBeforeMount, reactive } from "vue";
import navigationBar from 'src/base-h5/components/tutorial/navigation-bar/index.vue'
import { compute_css_obj, MenuData } from "src/core/index.js";
import BaseData from "src/core/base-data/base-data.js";

const switchMenu = ['普通赛果', '冠军赛果']
const slideMenu = ['11/16', '11/15', '11/14', '11/13', '11/12', '11/11', '11/10', '11/09', '11/08', '11/07', '11/06', '11/05', '11/04']
const props = defineProps({})
const state = reactive({
    currentSwitchValue: 0, // 让球：0 大小球：1 对应switchMenu index
    currentSlideValue: 0, // 球数 目前slideMenu写死
})

const switchHandle = (val) => {
    state.currentSwitchValue = val
}
const slideHandle = (val) => {
    state.currentSlideValue = val
}

/**
 * @description: 球类id转化背景
 * @param {String} id 球类id
 * @return {}
 */
const format_type = (item = {}) => {
    if (MenuData.is_results()) {
        let type = +item.menuId
        // 赛果电竞图标
        if ([100, 101, 103, 102].includes(type)) {
            type += 2000
        }
        // 赛果 我的投注
        if (item.menuType && item.menuType == 29) {
            type = item.menuType
        }
        // 赛果冠军
        if (type == 10000) {
            type = 100
        }
        return type
    }
    //电竞背景处理
    if (BaseData.sports_mi.includes(+item.mi)) return +item.mi
    return MenuData.recombine_menu_bg(item, true)
}


// onBeforeMount(() => {
// })
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
