<template>
        <!-- <div class="header" :style="{ height: tabActive == 'league' ? '0.56rem' : '1.0rem' }"> -->
        <div class="header" >
            <div class="tabs">
                <div class="matches" :class="tabActive == 'matches' ? 'active' : ''
                ">
                    <span @click="changeTab('matches', 0)">{{
                        "Matches"
                    }}</span>
                </div>
                <div class="league" :class="tabActive == 'league' ? 'active' : ''
                " @click="changeTab('league', 1)">
                    <span>{{ "League" }}</span>
                </div>
                <!-- league的下拉项 -->
                <div class="select" v-if="tabActive == 'league'">
                                <span class="select-text">{{
                                    curSelectedOption.label
                                }}</span>
                                <span class="down_arrow" @click="toggerModel"></span>
                            </div>
                            <template v-if="tabModel && tabActive == 'league'">
                                <ul class="option-list">
                                    <template v-for="(item, index) in selectOptions" :key="index">
                                        <li :class="dateIndex == index ? 'active' : ''
                                        " @click="changeDate(index)">
                                            {{ item.label }}
                                        </li>
                                    </template>
                                </ul>
                            </template>
                        </div>
                        <!-- :class="'current_menu_mi_' + current_menu_mi" -->
                        <div :style="{backgroundPositionY: `${farmatSportImg(current_menu_mi)}px`}" class="menu_list_top_tab_background" ></div>
                        <!-- 七天时间 -->
                        <div class="date_time" v-if="tabActive == 'matches'">
                            <q-virtual-scroll ref="scrollDateRef" :items="week" virtual-scroll-horizontal v-slot="{ item, index }">
                                <div @click="changeDatetab(item, index)" class="week" :class="second_tab_index == index ? 'active' : ''">
                                    <span>
                                        <span>{{ item.name }}</span>
                                    </span>
                                    <span class="border_right"></span>
                                </div>
                            </q-virtual-scroll>
                        </div>
                        <!-- 联赛的区域选择 -->
                        <div class="date_time" v-if="tabActive == 'league'">
                            <q-virtual-scroll ref="scrollRefArea" :items="areaList" virtual-scroll-horizontal v-slot="{ item, index }">
                                <div @click="areaListChange(item, index)" class="week" :class="area_tab_index == index ? 'active' : ''">
                                    <span>
                                        <span>{{ item.introduction }}</span>
                                    </span>
                                    <span class="border_right"></span>
                                </div>
                            </q-virtual-scroll>
                        </div>
    </div>
</template>
  
<script setup>
import {
    ref,
    reactive,
    watch,
    onMounted,
    onUnmounted,
    defineEmits
} from "vue";
import { dateWeekMatchesFormat ,farmatSportImg } from '../utils';
import { MenuData } from "src/core/";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";

const emitters = ref({})
const route = useRoute();
const sportId = route.query.sportId;
const emit = defineEmits(["changeDate", "changeTab", "changeArea"]);
const tabActive = ref("matches");//tab
const tabModel = ref(false);//下拉框
const dateIndex = ref(0);//下拉框选择
const scrollDateRef = ref(null);
const scrollRefArea = ref(null);
const menu_time = ref('')
let second_tab_index = ref(0);//单日选择
let area_tab_index = ref(0);//地区选择
const current_menu_mi = ref("101");
const week = dateWeekMatchesFormat();
// 七天时间
// 地区集合
const props = defineProps({
    areaList: {
        type: Array,
        default: () => [],
        required: true
    },
})

// 下拉选
const selectOptions = reactive([
    { label: "Next 12 Hours", time: "12hours", timestamp: 12 }, //12小时后的时间戳
    { label: "Next 24 Hours", time: "24hours", timestamp: 24 },
    { label: "3 Day", time: "3day", timestamp: 72 },
    { label: "7 Day", time: "7day", timestamp: 168 },
]);

const curSelectedOption = ref(selectOptions[0])

/**
 * tab点击
 * @param {*} name 
 */
const changeTab = (name, index) => {
    tabActive.value = name;
    tabModel.value = false;
    emit("changeTab", index);
}
/**
 * 下拉框
 */
const toggerModel = () => {
    tabModel.value = !tabModel.value;
}
/**
 * 下拉框选择
 * @param {*} index 
 */
const changeDate = (index) => {
    dateIndex.value = index;
    tabModel.value = false;
    emit("changeDate", selectOptions[index].timestamp);
    curSelectedOption.value = selectOptions[index]
}
/**
 * 时间选择tab-赛事列表筛选
 * @param {*} item 
 * @param {*} index 
 */
const changeDatetab = (item, index) => {
    tabModel.value = false;
    const move_index = week.findIndex((t, _index) => _index === index);
    scrollDateRef.value && scrollDateRef.value.scrollTo(move_index - 2, "start-force");
    second_tab_index.value = index;
    // MenuData.set_date_time(item.val, item.type);
    menu_time.value = item?.val
   
    // //根据时间筛选列表
    // if (!item?.val) {
    //     // 设置菜单对应源数据
    //     MatchMeta.set_origin_match_data()
    // } else {
    //     //根据时间筛选列表
    //     MatchMeta.filter_match_by_time(item.val)
    // }
    MenuData.set_current_lv1_menu(item.type?'3':'2');
    MenuData.set_menu_mi(current_menu_mi.value);
    // 获取数据
    MatchMeta.set_origin_match_data(menu_time.value)
    emit("changeDate", item.val);
};
onMounted(() => {
    setDefaultData(MenuData.menu_mi.value || '101');//默认足球
})

onUnmounted(() => {
  Object.values(emitters.value).map((x) => x());
})
/**
 * 默认请求今日数据
 * @param {*} mi 
 */
const setDefaultData = (val) => {
    MenuData.set_current_lv1_menu(2);
    // MenuData.set_menu_mi(val);
    current_menu_mi.value = val;
    //球种改变设置今日
    // MenuData.set_date_time(week[0].val);
    menu_time.value = week[0]
}
watch(() => MenuData.menu_mi.value, () => {
    setDefaultData(MenuData.menu_mi.value)
}, { immediate: true })

watch(() => props.areaList, () => {
    areaListChange(props.areaList[0], 0)
})

/**
 * 地区选择tab
 * @param {*} index 
 */
const areaListChange = (item,index) => {
    tabModel.value = false;
    const move_index = props.areaList.findIndex((t, _index) => _index === index);
    scrollRefArea.value.scrollTo(move_index - 2, "start-force");
    area_tab_index.value = index;
    emit("changeArea", item.id);
}
</script>
  
<style lang="scss" scoped>
.header {
    font-size: 16px;
    font-family: Roboto;


    // 头部tab样式
    .tabs {
        width: 100%;
        height: 49px;
        padding: 16px 0 15px 21px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-bottom: 1px solid var(--q-gb-bd-c-1);
        position: relative;

        div {
            font-weight: 500;
            padding: 11px 0 11px;
            color: rgba(138, 137, 134, 1);
            border-bottom: 3px solid rgba(255, 255, 255, 0);
            height: 49px;
            display: flex;
            align-items: center;

            span {
                height: 19px;
            }
        }

        .select {
            display: flex;
            align-items: center;
            z-index: 2;
            font-weight: 400;
            padding-top: 0.16rem;
            justify-content: flex-start;

            :deep(.q-field__control) {
                &::before {
                    border-bottom: none;
                }
            }

            .select-text {
                font-size: 14px;
                margin-right: 10px;
                color: rgba(26, 26, 26, 1);
            }

            .down_arrow {
                position: relative;
            }

            .down_arrow::after {
                display: inline-block;
                content: "";
                width: 8px;
                height: 8px;
                border-width: 0 2px 2px 0;
                color: rgba(138, 137, 134, 1);
                border-style: solid;
                transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                position: absolute;
                top: 50%;
                right: -6px;
                margin-top: -6px;
            }
        }

        .matches {
            margin-right: 39px;
        }

        .league {
            margin-right: 10px;
        }

        .active {
            font-weight: 500;
            color: rgba(255, 112, 0, 1);
            border-bottom: 3px solid rgba(255, 112, 0, 1);
        }
    }

    .menu_list_top_tab_background {
        width: 140px;
        height: 49px;
        position: absolute;
        top: 50px;
        right: 0;
        background-size: cover;
        background: url($SCSSPROJECTPATH+"/image/list/league_bg.png") no-repeat;
    }

    // 七天时间tabs样式
    .date_time {
        /* height:44px; */
        min-width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 2px;
        overflow-y: hidden;
        font-size: 14px;

        &::-webkit-scrollbar {
            display: none;
            /* Chrome Safari */
        }

        .week {
            padding-left: 16px;
            text-align: center;
            color: rgba(138, 137, 134, 1);
            font-weight: 400;
            height: 0.45rem;
            white-space: nowrap;
            display: flex;
            align-items: center;
            line-height: 15px;

            .din_font {
                font-family: DIN;
            }

            .border_right {
                margin-left: 16px;
                height: 12px;
                border-right: 1px solid rgba(217, 217, 217, 1);
            }
        }

        .week.active {
            font-weight: 500;
            color: rgba(26, 26, 26, 1);
            position: relative;
        }

        .week.active::after {
            display: block;
            content: "";
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: absolute;
            text-align: center;
            bottom: -4px;
            left: 43%;
            background: linear-gradient(rgba(255, 112, 0, 1), rgba(255, 112, 0, 0));
        }
    }

    .option-list {
        list-style: none;
        position: absolute;
        width: 160px;
        height: 204px;
        top: 49px;
        left: 185px;
        margin: 0;
        padding: 0;
        background-color: rgba(255, 255, 255, 1);
        border-radius: 2px;
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.25);
        padding-left: 17px;
        z-index: 2002;

        li {
            border-bottom: 1px solid rgba(226, 226, 226, 1);
            color: rgba(26, 26, 26, 1);
            padding: 17px 0;
            font-size: 14px;
            font-weight: 400;
            line-height: 16px;
        }

        .active {
            font-size: 14px;
            font-weight: 400;
            line-height: 16px;
            border-bottom: 1px solid rgba(226, 226, 226, 1);
            color: rgba(255, 112, 0, 1);
        }
    }

    .absolute-full {
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0);
        z-index: 2001;
    }

    .tabs,
    .date_time {
        background-color: rgba(255, 255, 255, 1);

        :deep(.q-virtual-scroll__content) {
            border-bottom: 10px solid #E2E2E2;
            min-height: 100%;
        }
    }

}

.top_events_page {
    :deep(.ball_tab) {
        height: unset;

        div:first-child {
            display: none;
        }
    }

    :deep(.game_page) {
        padding-bottom: 45px;
        height: 100%;

        :deep(section:first-child) {
            height: 100%;
        }
    }

    :deep(.game_item) {
        height: 100%;
    }

    :deep(.game_page_list_content) {
        height: calc(100% - 48px);
        overflow: hidden;
        overflow-y: auto;
    }

    section {
        padding: 16px 18px 15px 10px;
    }
}

.top_event {
    :deep(.empty_page) {
        height: calc(100% - 105px);
    }
}
</style>
  