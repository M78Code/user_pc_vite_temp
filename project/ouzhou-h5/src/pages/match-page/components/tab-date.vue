<template>
    <!-- <div class="header" :style="{ height: tabActive == 'league' ? '0.56rem' : '1.0rem' }"> -->
    <div class="header">
        <div class="tabs">
            <div v-for="(item, index) in tabList" :key="'tabs' + index" class="tabs-item"  
                >
                <span :class="['tabs-item-text', store.tabActive === item ? 'active' : '']" @click="changeTab(item, index)">{{
                    i18n_t(`ouzhou.match.${item?.toLowerCase()}`)
                }}</span>
                <template v-if="item === 'League'">
                    <!-- league的下拉项 -->
                    <div class="select" v-if="store.tabActive == 'League'" ref="dateOptionsRef" @click.stop="toggerModel">
                        <span class="select-text">{{
                            i18n_t(store.curSelectedOption.label)   
                        }}</span>
                        <span :class="['down_arrow', store.tabModel && 'down_arrow_active']"></span>
                    </div>
                    <template v-if="store.tabModel && store.tabActive == 'League'">
                        <ul class="option-list" :style="DateOptionsOffset">
                            <template v-for="(item, index) in store.selectOptions" :key="index">
                                <li :class="store.dateIndex == index ? 'active' : ''
                                    " @click="changeDate(index)">
                                    {{ i18n_t(item.label) }}
                                </li>
                            </template>
                        </ul>
                    </template>
                </template>
            </div>
         
        </div>
        <span class="sport-bg" :style="compute_css_obj({key:'eu-menu-sport-bg-image', position:format_type(MenuData.menu_mi.value)})"></span>
        <!-- :class="'store.current_menu_mi_' + store.current_menu_mi" -->
        <div :style="{ backgroundPositionY: `${farmatSportImg(store.current_menu_mi)}px` }"
            class="menu_list_top_tab_background"></div>
        <!-- 七天时间 -->
        <div class="date_time" v-if="store.tabActive == 'Matches' && week.length > 0">
            <q-virtual-scroll ref="scrollDateRef" :items="week" virtual-scroll-horizontal v-slot="{ item, index }">
                <div @click="changeDatetab(item, index)" class="week"
                    :class="store.second_tab_index == index ? 'active' : ''">
                    <span>
                        <span>{{ item.name }}</span>
                    </span>
                    <span class="border_right"></span>
                </div>
            </q-virtual-scroll>
        </div>
        <!-- 联赛的区域选择 -->
        <div class="date_time" v-if="store.tabActive == 'League' && store.areaList.length > 0">
            <q-virtual-scroll ref="scrollRefArea" :items="store.areaList" virtual-scroll-horizontal
                v-slot="{ item }">
                <div @click="areaListChange(item)" class="week"
                    :class="store.selectArea.id == item.id ? 'active' : ''">
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
    watch,
    onMounted,
    onUnmounted,
    defineEmits,
    computed
} from "vue";
import { dateWeekMatchesFormat, farmatSportImg } from '../utils';
import { MenuData ,compute_css_obj} from "src/output/index.js";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import { store } from "project_path/src/pages/match-page/index.js"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
import STANDARD_KEY from "src/core/standard-key";
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
import { api_common } from "src/api";
import MatchFold from 'src/core/match-fold/index.js'
import { oz_sprite_bg_images_postion } from "src/output/module/constant-utils.js";
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
const menu_h5 = STANDARD_KEY.get("menu_h5");
const emitters = ref({})
const emit = defineEmits(["changeDate", "changeTab", "changeArea"]);
const scrollDateRef = ref(null);
const scrollRefArea = ref(null);
const dateOptionsRef = ref(null);
// const week = dateWeekMatchesFormat();
const week = ref([]);
const tabList = computed(()=>{
    //赛事列表tab
    const list = MenuData.match_tab_list || [
      'Matches',
      'League',
      'Outrights'
    ];
    const menu_list = MenuData.menu_list.map((item)=>{return +item.mi});
    const matches = list.filter(n=>{return n ==='Matches'});//电足电篮不展示冠军和联赛
    const not_outrights = list.filter(n=>{return n !=='Outrights'});
    return [190,191].includes(+store.current_menu_mi)?matches:menu_list.includes(400)?list:not_outrights;
})
const DateOptionsOffset = computed(() => {
    const domWidth = document.body.clientWidth || document.documentElement.clientWidth
    const selfWitdh = 160
    const offset = dateOptionsRef.value[0].offsetLeft
    const exceed = domWidth - (selfWitdh + offset)
    let result = offset
    if (exceed < 0) { // 超出
        result = offset + exceed
    }
    return {
        'left': result + 'px'
    }
})
/**
 * @description: 球类id转化背景
 * @param {String} id 球类id
 * @return {}
 */
 const format_type = ( id ) => {
  return oz_sprite_bg_images_postion[id]
}
/**
 * 获取对应日期
 */
const getDateList = async () =>{
    const euid = MenuData.get_euid(`${MenuData.menu_mi.value}3`);
    if(!euid || [190,191].includes(+MenuData.menu_mi.value)){
        return [{name:i18n_t('ouzhou.match.today'),val:'',type:0}];
    };
    // 3020212  118  娱乐
    const params = {
        euid:MenuData.get_euid(`${MenuData.menu_mi.value}3`),
    };
    const res = await api_common.post_date_menu(params);
    if(res?.code == '200'){
        const data = res?.data?.filter((n)=>{return !!n.field1}).map((item)=>{
            return {
                name: item.menuName,
                val: item.field1,
                type: 1
            }
        })||[];
        return [...[{name:i18n_t('ouzhou.match.today'),val:'',type:0}],...data]
    }
    return [];
};
/**
 * tab点击
 * @param {*} name 
 */
const changeTab = (name, index) => {
    store.tabActive = name;
    store.tabModel = false;
    store.curSelectedOption = store.selectOptions[0]
    store.dateIndex = 0
    emit("changeTab", name);
    if (name === 'Matches') {
        changeDatetab(week.value[0], 0)
    }else if(name != 'League'){
        MatchResponsive.set_is_league_detail(false)
    }
    if(name === 'League'){
        MatchFold.clear_fold_info()
    }
}
/**
 * 下拉框
 */
const toggerModel = () => {
    store.tabModel = !store.tabModel;
}

/**
 * 下拉框选择
 * @param {*} index 
 */
const changeDate = (index) => {
    store.dateIndex = index;
    store.tabModel = false;
    emit("changeDate", store.selectOptions[index].timestamp);
    store.curSelectedOption = store.selectOptions[index]
}

/**
 * 时间选择tab-赛事列表筛选
 * @param {*} item 
 * @param {*} index 
 */
const changeDatetab = (item, index) => {
    if (store.menu_time === item?.val) return
    useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP)
    store.tabModel = false;
    MatchFold.clear_fold_info()
    const move_index = week.value.findIndex((t, _index) => _index === index);
    scrollDateRef.value && scrollDateRef.value.scrollTo(move_index - 2, "start-force");
    store.second_tab_index = index;
    // MenuData.set_date_time(item.val, item.type);
    store.menu_time = item?.val

    MenuData.set_current_lv1_menu(item.type ? '3' : '2');
    MenuData.set_menu_mi(store.current_menu_mi);

    let time = ''
    if (!item?.val) {
        const cureent_date = new Date()
        cureent_date.setHours(12, 0, 0, 0)
        const today_time = cureent_date.getTime()
        time = today_time
    } else {
      time = item?.val
    }
    // 设置菜单对应源数据
    // MatchMeta.set_origin_match_data({md: store.menu_time})
    // 根据时间筛选列表
    MatchMeta.filter_match_by_time(time)
    MatchMeta.get_target_match_data(!item?.val ? {} : { md: item?.val })
    
    emit("changeDate", item.val);
};
/**
 * 默认请求数据
 * @param {*} val 
 */
const setDefaultData = async (obj) => {
    const val = obj.mi || "";
    const type = obj.type ||0;
    // 刷新or更换球种 重置
    if(!type){
        MenuData.set_current_lv1_menu(2);
        store.tabActive = 'Matches';
        store.second_tab_index = 0;
        store.menu_time = week.value[0].val;
    }
    store.current_menu_mi = val;
    week.value = await getDateList();
    //滚动到缓存位置
    const index =  week.value.findIndex((item)=>{return item.val === store.menu_time});
    scrollDateRef.value && scrollDateRef.value.scrollTo(index?index-2:0, "start-force");
    
}

const click_tabs = ()=> {
    if(store.tabModel){
       return !store.tabModel;
    };
}

onMounted(async () => {
    //当前激活球种id  如果本地有存储值就取本地存储的值
    const session_info = LocalStorage.get(menu_h5);
    setDefaultData({
        mi:session_info?.menu_mi || MenuData.menu_mi.value || '101',
        type:1
    });//默认足球
    store.curSelectedOption = store.selectOptions[0]
    // week.value = await getDateList();
    emitters.value = {
        emitters_1: useMittOn(MITT_TYPES.EMIT_OUZHOU_LEFT_MENU_CHANGE, setDefaultData).off
    }

    const el = document.querySelector('.ouzhou-h5-layout')
    el.addEventListener('click', () => {
        store.tabModel = false
    });

})
onUnmounted(() => {
    Object.values(emitters.value).map((x) => x());
})
/**
 * 地区选择tab
 * @param {*} index 
 */
const areaListChange = (item) => {
    store.tabModel = false;
    const index = store.areaList.findIndex(i => i.id === item.id)
    if (item) {
        scrollRefArea.value.scrollTo(index - 2, "start-force");
        store.selectArea = item
        emit("changeArea", item);
    }
}

</script>
  
<style lang="scss" scoped>
.header {
    font-size: 16px;
    font-family: Roboto;
    .sport-bg{
      --per:-0.5rem;
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
      width: 141.25px;
      height: 50px;
      background-size: 100% auto;
      background-position: right;
    }

    // 头部tab样式
    .tabs {
        width: 100%;
        height: 49px;
        padding: 0px 0 0px 21px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-bottom: 1px solid var(--q-gb-bg-c-1);
        position: relative;
        box-sizing: border-box;

        div {
            font-weight: 500;
            // padding: 11px 0 11px;
            color: rgba(138, 137, 134, 1);
            border-bottom: 3px solid rgba(255, 255, 255, 0);
            height: .49rem;
            display: flex;
            align-items: center;
        }
        .tabs-item-text {
            height: .5rem;
            display: flex;
            align-items: center;
            padding-top: .14rem;
            border-bottom: 3px solid transparent;
        }

        .select {
            display: flex;
            align-items: center;
            z-index: 2;
            font-weight: 400;
            padding-top: 0.14rem;
            justify-content: flex-start;
            margin-left: 0.05rem;
            padding-bottom: 0.03rem;

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

            .down_arrow_active {
                transform: rotate(180deg);
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

        .tabs-item {
            margin-right: 22px;
        }

        // .league {
        //     margin-right: 10px;
        // }

        .active {
            font-weight: 500;
            color: rgba(255, 112, 0, 1);
            border-bottom: 3px solid rgba(255, 112, 0, 1);
        }
    }

    // .menu_list_top_tab_background {
    //     width: 140px;
    //     height: 49px;
    //     position: absolute;
    //     top: 50px;
    //     right: 0;
    //     background-size: cover;
    //     background: url($SCSSPROJECTPATH+"/image/list/league_bg.png") no-repeat;
    // }

    // 七天时间tabs样式
    .date_time {
        height:55px;
        min-width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // padding-left: 2px;
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

        :deep(.scroll) {
            width: 100%;
            height:100%;
            border-bottom: 10px solid #E2E2E2;
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
}</style>
  src/output