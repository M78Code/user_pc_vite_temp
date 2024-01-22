<template>
    <div class="esports-page">
        <!-- tab 切换 -->
        <div class="header_tabs">
            <q-tabs v-model="tabValue" dense class="bg-grey-3" align="justify" narrow-indicator
                @update:modelValue="on_update">
                <q-tab v-for="(item, index) in BaseData.dianjing_sublist" :name="item.mi"
                    :label="BaseData.menus_i18n_map[item.mi]" />
            </q-tabs>
            <span class="sport-bg" :style="compute_css_obj({ key: 'eu-menu-sport-bg-image', position: format_type() })"></span>
        </div>
        <tab-date v-if="state.slideMenu.length" :defaultVal="state.currentSlideValue" :dateList="state.slideMenu"
            @changeDate="changeDate" />
        <!--二级赛事列表-->
        <div class="match-list-page">
            <MatchContainer />
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { MenuData, compute_css_obj } from "src/output/index.js";
import BaseData from 'src/core/base-data/base-data.js'
import tabDate from './tab-date.vue';
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { oz_sprite_bg_images_postion } from "src/output/module/constant-utils.js";
const state = reactive({
    slideMenu: [],
    currentSlideValue: ""
})
const tabValue = ref('');
/**
 * @description: 球类id转化背景
 * @param {String} id 球类id
 * @return {}
 */
const format_type = (id) => {
    id = id || MenuData.current_lv_2_menu_mi.value;
    return oz_sprite_bg_images_postion[id]
}
/**
 * 获取时间
 */
const getDateList = async (csid) => {
    const list = await MenuData.getDateList(+csid - 2000);
    state.slideMenu = list;
    state.currentSlideValue = list[MenuData.date_tab_index]?.val || "";
    MatchMeta.get_esports_match()
}
// tabs 切换
const on_update = (val) => {
    // if(tabValue.value == val)return;
    tabValue.value = val;
    MenuData.set_menu_mi(val);
    getDateList(val);
}
/**
 * 时间点击
 * @param {*} item 
 */
const changeDate = (item, index) => {
    if (state.currentSlideValue === item.val) return
    state.currentSlideValue = item.val;
    MenuData.set_current_lv_3_menu({
        field1: item.val,
        menuType: item.menuType,
        index: index
    });
    MatchMeta.get_esports_match();
}
onMounted(() => {
    MenuData.set_current_lv1_menu(2000);
    const tab_value = MenuData.current_lv_2_menu_mi.value || '2100';
    MenuData.set_menu_mi(tab_value);
    tabValue.value = tab_value;
    getDateList(tabValue.value)
})
</script>
<style scoped lang="scss">
.esports-page {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .header_tabs {
        border-bottom: 2px solid #FF7000;
        position: relative;

        .sport-bg {
            --per: -0.5rem;
            position: absolute;
            right: 0;
            top: 0;
            display: inline-block;
            width: 124.25px;
            height: 50px;
            background-size: 141.25px auto;
            background-position: right;
        }

        :deep(.q-tabs--dense) {
            .scroll--mobile {
                height: 50px;
                background-color: var(--q-gb-bg-c-2);
                padding: 0 10px;

                // background-repeat: no-repeat;
                // background-image:url($SCSSPROJECTPATH + "/image/list/mask_group.png");
                // background-size: contain;
                // background-position: right;
                .q-tab {
                    flex: none;
                    padding: 0 0.05rem;
                }

                .q-ripple {
                    display: none;
                }
            }

            .q-tab__label {
                color: var(--q-gb-t-c-3);
                text-transform: capitalize;
                font-weight: 600;
            }

            .q-tab--active .q-tab__label {
                //color: #FF7000;
                color: var(--q-gb-t-c-1);
            }

            .q-tab__indicator {
                height: 3px;
                //background: #FF7000;
                background-color: var(--q-gb-bg-c-1);
            }
        }
    }

    .match-list-page {
        background-color: #e2e2e2 !important;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        position: relative;

        .match-list-container {
            height: 100%;
            background-color: var(--q-gb-bg-c-2) !important;

            :deep(.scroll-wrapper) {
                // background-color: var(--q-gb-bg-c-2) !important;

                .s-w-item {
                    background-color: var(--q-gb-bg-c-2) !important;
                }
            }
        }

    }
}</style>