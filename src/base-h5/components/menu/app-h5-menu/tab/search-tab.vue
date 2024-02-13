<!--
 * @Author: rise
 * @Date: 2023-10-20 16:27:18
 * @LastEditors: jamison pmtyjamison@itcom888.com
 * @LastEditTime: 2023-11-08 16:50:41
 * @Description:  
-->
<template>
    <!-- <div class="search-tab-wap" v-show="!Array.isArray(menu_lv2) && [401,1016,1013,1011,1012].includes(+menu_lv2?.mi)"> -->
    <div class="search-tab-wap">
    <!-- <div class="search-tab-wap"> -->
        <div class="search-tab-content">
            <ul class="search-tab-content-ul" v-show="!drawerRight">
                <li ref="searchTab" v-for="(item, index) in dataList" :class="{ active: activeOn === index }"  :key="index"
                    @click="changeTab(index,$event,item)">
                    <!-- <img v-show="item.img" :src="item.img" /> -->
                    <!--黑夜版图片目前也用的日间版 -->
                    <!-- :style="compute_css_obj({key: activeOn === index ? 'league-sport-active-image' :UserCtr.theme == 'theme-1'?'league-sport-icon-atnight-image':'league-sport-icon-image', position:format_type(item)})"></span> -->
                    <span v-if="item.tid !== '0'" class="sport-icon-wrap"
                      :style="compute_css_obj({key: activeOn === index ? 'league-sport-active-image' :'league-sport-icon-image', position:format_type(item)})"></span>
                    {{ item.name }}
                </li>
                <div v-show="!drawerRight" class="search-tab-content-img" @click="handler_search"
                >
                        <img :src="search" />
                </div>
            </ul>
            <div class="search" v-show="drawerRight">
                <input class="search-input" type="text" v-model="keyword" @input="handler_search_match" :placeholder="i18n_t('ouzhou.search.placeholder')" />
                <img class="clear_search" @click="clear_input" :src="icon_cancel " alt="">
                <span @click="reset">{{ i18n_t('common.cancel') }}</span>
            </div>
            <!-- <div class="search-tab-content-img" @click="searchClick">
                <img :src="search" />
            </div> -->
        <!-- <q-drawer
            side="right"
            v-model="drawerRight"
            show-if-above
            bordered
            :width="290"
            :breakpoint="500"
            class="bg-grey-3 search-tab-content-img"
            elevated
        >
        <q-scroll-area class="fit">
            <screenModal class="screenModal" @select_change="select_change"></screenModal>
        </q-scroll-area>
      </q-drawer> -->
        </div>
    </div>
</template>

<script setup>
import { ref  } from "vue";
import lodash from 'lodash'
import search from "./img/search.svg";
import icon_cancel from "./img/icon_cancel.png";
import {scrollMenuEvent} from "../utils";
// import {  menu_lv2 } from 'src/base-h5/mixin/menu.js'
// import  screenModal from './screen-modal.vue';
// import { MenuData } from "src/output/index.js";
// import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
// import { theme_list, theme_map } from "src/core/theme/"
import UserCtr from "src/core/user-config/user-ctr.js"
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { i18n_t, compute_css_obj,league_sprite_images_postion,MenuData  } from "src/output/index.js";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
const props = defineProps({
    dataList: {
        type: Array,
        default: [
            {
                name: "全部",
                val: 0,
                img: "",
                tid: '0',
                alias: 'all'
            },
            // {
            //     // 世界杯2022(在卡塔尔) FIFA World Cup 2022 (In Qatar) - 10011003169
            //     // FIFA足球(10分钟比赛) - 世界杯 FIFA Efootball (10 mins) - World Cup - 10011003541
            //     name: "世界杯",
            //     val: 1,
            //     img: "",
            //     tid: '10011003169,10011003541'
            // },
            {
                name: "欧冠",
                val: 2,
                tid: '6408',
                img: "",
                alias: 'european_league'
            },
            {
                // 英格兰超级联赛 England Premier League - 10011000
                // FIFA 2023 - 英格兰超级联赛 (8分钟) FIFA 2023 - England Premier League (8mins) - 1292581040691029461
                name: "英超",
                val: 3,
                img: "",
                tid: '180',
                alias: 'english_league'

            },
            {
                name: "意甲",
                val: 4,
                tid: '239',
                img: "",
                alias: 'serie_league'
            },
            {
                name: "西甲",
                val: 5,
                img: "",
                tid: '320',
                alias: 'spanish_league'
            },
            {
                name: "德甲",
                val: 6,
                tid: "276",
                alias: 'german_league'
            },
            {
                name: "法甲",
                val: 7,
                img: "",
                tid: '79',
                alias: 'french_league'
            },
            {
                // 中国超级联赛 China Super League - 10011006344 
                // SRL中国超级联赛 SRL China Super League - 10011020404
                name: "中超",
                val: 8,
                tid: "10011006344",
                alias: 'china_league'
            }
        ]
    },
    activeOn: {
        type: Number,
        default: 0
    }
});
const drawerRight = ref(false)
const searchTab = ref(null)
const keyword = ref('')
// const emitters = ref({});

const activeOn = ref(0);//默认值
// const league_data = ref([])
/**
 * @description 搜索赛事
 */
const handler_search_match = lodash.debounce(() => {
    MatchMeta.filter_match_by_name(keyword.value)
}, 1000)
/**
 * @description 搜索
 */
const handler_search = ()=>{
    drawerRight.value = true;
    MatchResponsive.set_is_search(true)
}
/**
 * @description: 清空搜索框
 */
const clear_input = ()=>{
    keyword.value = '';
}

/**
 * @description: 联赛转化背景
 * @param {String} id 球类id
 * @return {}
 */
 const format_type = ( item = {} ) => {
    return league_sprite_images_postion[+item.val]
}
/**
 * 选中的数据
 * @param {*} val
 */
const select_change = (value) => {
    // drawerRight = !drawerRight
    console.log('valuevalue',value)
}

/**
 * @description 获取联赛 id
 */
const get_leagues_tid = (league) => {
    let target_tid = league.tid
    const popular_league_data = lodash.get(MatchResponsive, 'popular_league.value', {})
    if (!lodash.isEmpty(popular_league_data) && league.alias !== 'all') {
        const item = popular_league_data[league.alias]
        const length = lodash.get(item.tids, 'length', 0)
        if (length > 0) target_tid = item.tids.join(',')
    }
    return target_tid
}


/**
 * 选中事件
 * @param {*} val
 */
const changeTab = (i, event, item) => {
    if(activeOn.value === i)return;
    activeOn.value = i;
    const tid = get_leagues_tid(item)
    event && scrollMenuEvent(event,".search-tab-content-ul",".active");
    MatchMeta.clear_match_info()
    if (tid === '0') {
        MenuData.search_data_tab_index(i,'')
        MatchMeta.set_origin_match_data({})
    } else {
        MenuData.search_data_tab_index(i,tid)
        MatchMeta.filter_hot_match_by_tid(tid)
    }
}
/**
 * 初始化滚动条
 */
 const searchTabMenu = (val) =>{
    activeOn.value = val;
    scrollMenuEvent(searchTab.value[activeOn.value||0],".search-tab-content-ul",".active");
}
defineExpose({searchTabMenu,changeTab});
/**
 * 搜索足球事件
 */
const searchClick = () => {
    // console.log(`搜索足球`)
    // useMittEmit(MITT_TYPES.EMIT_CHANGE_SEARCH_FILTER_SHOW, {
    //   open: true,
    // });
    // emit('searchHandle')
    is_show.value = true
    console.log('is_showis_showis_showis_show',is_show)
}
const reset = () => {
	drawerRight.value = false;
	keyword.value = '';
    MatchMeta.filter_match_by_name('')
    MatchResponsive.set_is_search(false)
}
// 键入回车换行
function key_down(event) {
  event = event || window.event;
  if (event.keyCode == 13) {
    event.returnValue = false;
  }
}
</script>
<style lang="scss" scoped>
.search-tab-wap {
    width: 100%;
    height: 0.32rem;
    overflow: hidden;
    padding: 0 0.06rem;
    position: relative;
    background-color: var(--q-gb-bg-c-27);
    .search-tab-content {
        width: 100%;
        height: 0.32rem;
        line-height: 0.32rem;
        display: flex;
				position: relative;

        ul {
            flex: 1;
            width: 100%;
            overflow: hidden;
            overflow-x: auto;
            display: flex;
            padding-right: 0.3rem;
            &::-webkit-scrollbar {
                display: none;
            }
            li {
                width: 0.6rem;
                height: 100%;
                flex-shrink: 0;
                text-align: center;
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                //color: #7981A4;
                color: var(--q-gb-t-c-20);
                &:first-child {
                    width: 0.4rem;
                }

                &.active {
                    color: var(--q-gb-t-c-1);
                    font-family: 'PingFang SC';
                    font-style: normal;
                    font-weight: 400;
                }

                img {
                    width: 0.18rem;
                    height: 0.18rem;
                    vertical-align: middle;
                    margin-top: -2px;
                }
                .sport-icon-wrap {
                    --per: -0.255rem;
                    display: inline-block;
                    width: auto;
                    height: 0.18rem;
                    width: 0.18rem;
                    vertical-align: middle;
                    margin-top: -2px;
                    background-position: 0 0;
                    background-size: 0.18rem auto;
                }
                span {
                    font-size: 12px;
                    color: #7981A4;
                }
            }
        }

        .search-tab-content-img {
            width: 0.3rem;
            text-align: center;
						position: absolute;
						right: 0;
						background-color: var(--q-gb-bg-c-27);
            img {
                width: 0.18rem;
                height: 0.18rem;
                vertical-align: middle;
                margin-top: -2px;
            }
        }

    }
}
.search {
	width: 100%; 
	flex: 1 1;
    font-size: 12px;
	font-family: PingFang SC;
	color: var(--q-gb-t-c-17);
    display: flex;
    align-items: center;
	.search-input {
		width: 90%;
		border-radius: .25rem;
		outline: none;
		border: 1px solid var(--q-gb-bg-c-18);
		height: 0.25rem;
		padding-left: 0.12rem;
        background: var(--q-gb-bg-c-41);
        color: var(--q-gb-t-c-18);

	}
    .clear_search{
        position: absolute;
        right: 45px;
        top: 11px;
    }
	::placeholder {
		color: var(--q-gb-t-c-16);
	}
	span {
    margin-left: 0.12rem;
    font-size: 12px;
    color: var(--q-gb-t-c-19);
	}
}
</style>
 