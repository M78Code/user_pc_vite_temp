<!--
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-15 19:17:42
 * @LastEditors: nico
 * @LastEditTime: 2023-07-17 12:22:38
 * @FilePath: \user-pc-vue3\src\components\matches_header\matches_header.vue
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
	<div class="matches_header_wrap">
		<div class="matches_header">
			<div class="header_banne header_banner" :style="`background-position:0 -${current_ball_type}px`"></div>
			<div class="matches-title">
				<div class="current_match_title" :class="redux_menu.menu_root == 2 ?'all_matches':''">{{ matches_header_title }}</div>
				<div class="match_all_matches" v-if="redux_menu.menu_root == 2">All Matches</div>
				<div v-else class="matches_tab" >
					<div v-for="item in tab_list" :key="item.value" @click="checked_current_tab(item)"
						:class="{ 'checked': item.value == current_value }">
						{{ item.label }}
					</div>
				</div>
			</div>
		</div>
		<MatchesFilterTab v-show="(current_value == 'top_events' && redux_menu.menu_root == 1 && !coom_soon_state) || redux_menu.menu_root == 2 "  />
		<MatchesDateTab v-show="redux_menu.menu_root == 4 && current_value == 'matches'" />
	</div>
</template>

<script setup>

import { ref,onMounted,onUnmounted } from 'vue';
import { useRouter } from "vue-router";
import _ from "lodash"
import MatchListOuzhouClass from 'src/core/match-list-pc/match-ouzhou-list.js'

import MatchesFilterTab from "./matches_filter_tab_ball_species.vue";
import MatchesDateTab from "./matches_filter_tab.vue";

// import { use_new_menu } from "@/components/menus/menu.js"
// import store from "src/store-redux-vuex/redux_menu.js";
// import { useMenuI18n } from "src/base-pc/components/menus/base_data";

// let state = store.getState()
const router = useRouter();

// 首页 header menu_root  == 1
const home_tab = [
	{ label: 'Featured', value: 'featured' },
	{ label: 'Top Events', value: 'top_events' },
]

// 左侧菜单 header menu_root  == 4
const sport_tab = [
	{ label: 'Matches', value: 'matches' },
	{ label: 'League', value: 'league' },
]

const tab_list = ref(home_tab)

// 国际化
// const { data: menus_i18n_map } = useMenuI18n()

// 获取当前header展示背景图
const current_ball_type = ref(630)

const matches_header_title = ref('Matches');
const current_value = ref('featured');

// 头部高度 包含 teb切换
const match_list_top = ref('80px')

const b_menu_root = ref(0)

let menu_info = MatchListOuzhouClass?.redux_menu || {}
const redux_menu = ref(menu_info);
const coom_soon_state =ref(false)

// const { set_mid_menu_top_result } = use_new_menu()

const sport_ball = {
	0:7,
	1:0,
	2:1,
	3:5,
	4:10,
	5:6,
	6:8,
	7:13,
	8:2,
	9:3,
	10:4,
	11:12,
	12:9,
	13:14,
	14:15,
	15:16,
	16:21,
	17:20,
	18:'',
	19:12,
	20:25,
	21:13,
	22:1,
	23:1,
	24:1,
	25:1,
	26:1,
	27:1,
	28:1,
	29:1,
	30:1,
	31:1,
	32:1,
	37:1,
	38:1,
	100:1,
	101:1,
	102:1,
	103:1,
}

onMounted(()=>{
  const { menu_root } = MatchListOuzhouClass?.redux_menu
  set_header_tab(menu_root)
})

// // 菜单切换 右侧背景图片变化
let un_subscribe = () => {
	redux_menu.value = MatchListOuzhouClass.redux_menu;
	const { menu_root,menu_left,mid_tab_menu_type } = MatchListOuzhouClass.redux_menu;
	coom_soon_state.value= MatchListOuzhouClass.coom_soon.value
	// console.error('header ', menu_root,mid_tab_menu_type,menu_left)
	let ball_number = 0
	if( menu_root == 1 ){
		ball_number = sport_ball[0] * 90
	}
	// In-play页面头部背景球种图计算
	if( menu_root == 2 ){
		let sport_id = mid_tab_menu_type - 100
		ball_number = sport_ball[sport_id] * 90
	}

	if( menu_root == 4 ){
		let sport_id = menu_left - 100
		ball_number = sport_ball[sport_id] * 90
		if(menus_i18n_map.value){
			matches_header_title.value = (menus_i18n_map || {}).value[menu_left]
		}
	}

	current_ball_type.value = ball_number

}

// 切换 header 信息 
const set_header_tab = val => {
	let obj = {}
	if ( val == 1) {
		tab_list.value = home_tab
		obj = home_tab[0]
		current_ball_type.value = 630
		matches_header_title.value = 'Matches'
	}
	if (val == 2 ) {
		current_ball_type.value = 0
		matches_header_title.value = 'In-Play'
	}
	if (val == 4) {
		tab_list.value = sport_tab
		obj = sport_tab[0]
		current_ball_type.value = 0
		const { menu_left } = MatchListOuzhouClass?.redux_menu;
		// console.error('menu_left',menu_left);
		if(menus_i18n_map.value){
			matches_header_title.value = (menus_i18n_map || {}).value[menu_left]
		}
		
	}

	checked_current_tab(obj)
}

const checked_current_tab = payload => {
	// 获取最新的 数据
	let redux_menu = _.cloneDeep(MatchListOuzhouClass.redux_menu) 
	// 暂时不做 
	if (['top_events', 'league'].includes(payload.value)) {
		// 修改菜单数据
		MatchListOuzhouClass.coom_soon.value = true

		
	}else{
		// 修改菜单数据
		MatchListOuzhouClass.coom_soon.value = false
	}

	redux_menu.mid_tab_type = payload.value

	MatchListOuzhouClass.set_menu(redux_menu)

	current_value.value = payload.value;
	
	// 判断头部高度
	if (['featured','league','top_events'].includes( payload.value) ) {
		match_list_top.value = '80px'
	} else if(['matches'].includes(payload.value)){
		match_list_top.value = '134px'
	} else {
		match_list_top.value = '146px'
	}
	
	// set_mid_menu_top_result.value = data
};


onUnmounted(()=>{
  b_menu_root.value = 0
  current_ball_type.value = 630
  un_subscribe()
})


</script>

<style lang="scss" scoped>
.matches_header_wrap {
	height: v-bind('match_list_top');
	padding-right: 7px;
	box-sizing: border-box;
}

.matches_header {
	width: 100%;
	padding-top: 10px;
	box-sizing: border-box;
	border-bottom: 2px solid #FF7000;
	background: linear-gradient(270deg, #9C9C9C 0.04%, #3B3B3B 99.96%);
	position: relative;

	.header_banner {
		position: absolute;
		right: 0;
		top: 0;
		width: 226px;
		height: 78px;
		background-size: 226px ;
	}

	.matches-title {
		padding-left: 20px;
	}

	.current_match_title {
		font-size: 18px;
		font-weight: 500;
		color: #FFFFFF;
		margin-bottom: 21px;
		height: 20px;
		&.all_matches{
			margin-bottom: 12px;
		}
	}
	.match_all_matches{
		color: #FFFFFF;
		font-family: "PingFang SC";
		font-size: 18px;
		font-weight: 500;
		line-height: 25px;
		letter-spacing: 0px;
		text-align: left;
		margin-bottom: 12px;
	}


	.matches_tab {
		display: flex;
		align-items: center;

		div {
			height: 28px;
			font-size: 16px;
			font-weight: 500;
			color: #C2C2C2;
			margin-right: 40px;
			cursor: pointer;
			// border-bottom: 3px solid red;
		}

		.checked {
			border-bottom: 3px solid #FF7000;
			color: #FF7000;
		}
	}
}

@media (max-width: 1450px) { 
	.matches_header_wrap {
	padding-right: 3px;
	}
  }
</style>