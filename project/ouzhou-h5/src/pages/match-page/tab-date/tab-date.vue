<template>
    <div class="header" :style="{ height: tabActive == 'league' ? '0.59rem' : '1.04rem' }">
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
                    // selectOptions[0].label
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
        <div class="menu_list_top_tab_background" :class="'current_menu_mi_' + current_menu_mi"></div>
        <!-- 七天时间 -->
        <div class="date_time" v-if="tabActive == 'matches'">
            <q-virtual-scroll ref="scrollRef" :items="week" virtual-scroll-horizontal v-slot="{ item, index }">
                <div @click="changeDatetab(item, index)" class="week" :class="second_tab_index == index ? 'active' : ''">
                    <span>
                        <!-- <span>{{ month[new Date().getMonth()] }}</span> -->
                        <!-- <span class="din_font">{{ new Date().getDate() + index }}</span> -->
                        <span>{{ item.name }}</span>
                    </span>
                    <span class="border_right"></span>
                </div>
            </q-virtual-scroll>
        </div>
        <!-- <div class="date_time" v-if="tabActive == 'league'">
            <q-virtual-scroll ref="scrollRefArea" :items="areaList" virtual-scroll-horizontal v-slot="{ item, index }">
                <div @click="areaListChange(index)" class="week" :class="area_tab_index == index ? 'active' : ''">
                    {{ item }}
                </div>
            </q-virtual-scroll>
        </div> -->
    </div>
</template>
  
<script setup>
import {
    ref,
    reactive,
    watch,
    onMounted,
    defineEmits
} from "vue";
import { dateWeekMatchesFormat } from './utils';
import { MenuData } from "src/core/";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";

const route = useRoute();
const sportId = route.query.sportId;
const emit = defineEmits(["changeDate", "changeTab"]);
const tabActive = ref("matches");//tab
const tabModel = ref(false);//下拉框
const dateIndex = ref(0);//下拉框选择
const scrollRef = ref(null);
const scrollRefArea = ref(null);
let second_tab_index = ref(0);//单日选择
let area_tab_index = ref(0);//地区选择
const current_menu_mi = ref("102");
const week = dateWeekMatchesFormat();
// 七天时间
// 地区集合
const areaList = reactive([
    "Europ",
    "Africa",
    "Asia",
    "North Amerrica",
    "South America",
    "Oceania",
]);

// 下拉选
const selectOptions = reactive([
    { label: "Next 12 Hours", time: "12hours", timestamp: dayjs().add(12, 'hour').valueOf() }, //12小时后的时间戳
    { label: "Next 24 Hours", time: "24hours", timestamp: dayjs().add(24, 'hour').valueOf() },
    { label: "3 Day", time: "3day", timestamp: dayjs().add(3, 'day').valueOf() },
    { label: "7 Day", time: "7day", timestamp: dayjs().add(7, 'day').valueOf() },
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
    console.log('selectOptions[index]: ', selectOptions[index]);
}
/**
 * 时间选择tab
 * @param {*} item 
 * @param {*} index 
 */
const changeDatetab = (item, index) => {
    tabModel.value = false;
    const move_index = week.findIndex((t, _index) => _index === index);
    scrollRef.value.scrollTo(move_index - 2, "start-force");
    second_tab_index.value =index;
    MenuData.set_date_time(item.val,item.type);
    emit("changeDate", MenuData.menu_match_date_params);

    // 设置菜单对应源数据
    MatchMeta.set_origin_match_data()

};
watch(() => MenuData.menu_mi.value, () => {
    //球种改变设置今日
    MenuData.set_date_time(week[0].val);
})
onMounted(() => {
    MenuData.set_date_time(week[0].val);
})
/**
 * 默认请求今日数据
 * @param {*} mi 
 */
const setDefaultData = () =>{
    MenuData.set_current_lv1_menu(2);

    // MenuData.set_menu_mi(mi);
    //球种改变设置今日
    MenuData.set_date_time(week[0].val);
    changeDatetab(week[0], 0)
}
watch(() => route.fullPath, () => {
    if (route.name === 'matchList') {
        setDefaultData()
    }
})

watch(()=> MenuData.current_lv_2_menu_mi.value,()=> {
    setDefaultData()
})

onMounted(() => {
    // setDefaultData()
})
/**
 * 地区选择tab
 * @param {*} index 
 */
const areaListChange = (index) => {
    tabModel.value = false;
    const move_index = areaList.findIndex((t, _index) => _index === index);
    scrollRefArea.value.scrollTo(move_index - 2, "start-force");
    area_tab_index.value = index;
}
</script>
  
<style lang="scss" scoped>
.header {
    font-size: 16px;
    font-family: Roboto;
    height: 1.04rem;

    // 头部tab样式
    .tabs {
        width: 100%;
        height: 49px;
        padding: 16px 0 15px 21px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-bottom: 1px solid #FF7000;
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
        width: 100px;
        height: 49px;
        position: absolute;
        top: 50px;
        right: 0;
        background: url("./menu_list_top_background_icon.png") no-repeat;
        background-size: cover;
    }

    // 七天时间tabs样式
    .date_time {
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
    }

    // 头部球类背景图 --- 不同机型像素转换大小不一样采用百分比部分未调整
    .menu_list_top_tab_background.current_menu_mi_101 {
        background-position: 0px 0px;
    }

    .menu_list_top_tab_background.current_menu_mi_102 {
        background-position: 0px -99.6%;
    }

    .current_menu_mi_108 {
        background-position: 0px -97.3%;
    }

    .current_menu_mi_109 {
        background-position: 0px -94.9%;
    }

    .current_menu_mi_110 {
        background-position: 0px -92.6%;
    }

    .current_menu_mi_103 {
        background-position: 0px -90.3%;
    }

    .current_menu_mi_105 {
        background-position: 0px -88%;
    }

    .current_menu_mi_140 {
        background-position: 0px -85.8%;
    }

    .current_menu_mi_106 {
        background-position: 0px -83.5%;
    }

    .current_menu_mi_112 {
        background-position: 0px -80.9%;
    }

    .current_menu_mi_104 {
        background-position: 0px -78.9%;
    }

    .current_menu_mi_26 {
        background-position: 0px -76.6%;
    }

    .current_menu_mi_111 {
        background-position: 0px -74%;
    }

    .current_menu_mi_107 {
        background-position: 0px -71.6%;
    }

    .current_menu_mi_113 {
        background-position: 0px -69.4%;
    }

    .current_menu_mi_114 {
        background-position: 0px -67%;
    }

    .current_menu_mi_115 {
        background-position: 0px -64.7%;
    }

    .current_menu_mi_123 {
        background-position: 0px -62.8%;
    }

    .current_menu_mi_124 {
        background-position: 0px -60.5%;
    }

    .current_menu_mi_125 {
        background-position: 0px -58.2%;
    }

    // 跳一个
    .current_menu_mi_116 {
        background-position: 0px -53.1%;
    }

    .current_menu_mi_119 {
        background-position: 0px -51.3%;
    }

    .current_menu_mi_22 {
        background-position: 0px -49%;
    }

    .current_menu_mi_128 {
        background-position: 0px -46.7%;
    }

    .current_menu_mi_38 {
        background-position: 0px -44.4%;
    }

    .current_menu_mi_37 {
        background-position: 0px -42.1%;
    }

    .current_menu_mi_120 {
        background-position: 0px -39.8%;
    }

    .current_menu_mi_129 {
        background-position: 0px -37.5%;
    }

    .current_menu_mi_30 {
        background-position: 0px -35.2%;
    }

    .current_menu_mi_32 {
        background-position: 0px -32.9%;
    }

    .current_menu_mi_31 {
        background-position: 0px -30.6%;
    }

    .current_menu_mi_27 {
        background-position: 0px -28.3%;
    }

    .current_menu_mi_2100 {
        background-position: 0px -26%;
    }

    .current_menu_mi_2102 {
        background-position: 0px -23.7%;
    }

    // 跳两个
    .current_menu_mi_118 {
        background-position: 0px -19.1%;
    }

    // 跳两个
    .current_menu_mi_35 {
        background-position: 0px -14.5%;
    }

    .current_menu_mi_36 {
        background-position: 0px -12.2%;
    }

    .current_menu_mi_400 {
        background-position: 0px -9.9%;
    }

    .current_menu_mi_121 {
        background-position: 0px -7.6%;
    }

    .current_menu_mi_27 {
        background-position: 0px -5.3%;
    }

    .current_menu_mi_33 {
        background-position: 0px -3%;
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
  