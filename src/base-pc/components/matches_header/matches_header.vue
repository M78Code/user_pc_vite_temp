<template>
	<div class="matches_header_wrap">
		<div v-show="false">{{MenuData.menu_data_version}}-{{MenuData.mid_menu_result.filter_tab }}-{{MenuData.menu_current_mi }}-{{MenuData.menu_root}}-{{MenuData.is_kemp()}}- {{ MenuData.is_collect_kemp() }}-{{MenuData.is_common_kemp() }}-{{ MenuData.is_collect}}-{{ MenuData.is_top_events()}}-{{MenuData.is_left_today()}}-{{MenuData.is_left_zaopan()}}--{{ BaseData.base_data_version }}</div>
		<div class="matches_header">
			<div class="header_banne header_banner" :style="compute_css_obj({ key: 'pc-home-featured-image', position: MenuData.is_kemp() ? 400 : MenuData.current_ball_type })"></div>
			<div :class="['matches-title', (MenuData.is_kemp() && !MenuData.is_common_kemp() && !MenuData.is_collect) ? 'matches_outrights' : '']">
				<div class="current_match_title" :class="MenuData.is_scroll_ball() ?'all_matches':''">{{ is_left_sports ?  BaseData.menus_i18n_map[MenuData.left_menu_result.lv1_mi] : i18n_t(matches_header_title) }}</div>
				<div class="match_all_matches" v-if="MenuData.is_scroll_ball()">{{ i18n_t('ouzhou.match.all_matches')}}</div>
				<div v-else class="matches_tab" >
					<template v-if="tab_list.length">
						<div v-for="item in tab_list" :key="item.value" @click="checked_current_tab(item,'change')"
							:class="{ 'checked': item.value == MenuData.mid_menu_result.filter_tab }">
							{{ item.not_i18n_t?item.label:i18n_t(item.label) }}
							<!-- 点击联赛后出现的时间筛选 -->
							<div 
								v-if="MenuData.is_leagues() && item.value === 4002"
								class="leagues_filrer" 
								@click.stop="set_show_leagues"
							>
								{{ i18n_t(ouzhou_time_list.filter(times => times.value === active_time )[0].label) }}
								<span class="yb-icon-arrow"></span>
								<div class="leagues_filrer_item" v-show="show_leagues">
									<div v-for="item in ouzhou_time_list" :key="item.value" @click="set_active_time(item)" :class="item.value == active_time ? 'item_acitve': ''">
										{{ i18n_t(item.label) }}
										<div class="leagues_filrer_item_line" v-if="item.value !== ouzhou_time_list[ouzhou_time_list.length -1].value"></div>
									</div>
								</div>
							</div>
						</div>
					</template>
				</div>
				<!-- 虚拟体育菜单，单独的一套逻辑 -->
				<virtualSportsTab v-if="MenuData.is_vr()" />
			</div>
		</div>
		<MatchesFilterTab v-if="MenuData.is_scroll_ball() || MenuData.is_hot() || (MenuData.is_kemp() && !MenuData.is_common_kemp() && !MenuData.is_collect_kemp()) || MenuData.is_collect || MenuData.is_top_events()"  />
		<MatchesDateTab v-else-if="(MenuData.is_left_today() || MenuData.is_left_zaopan()) && !MenuData.is_leagues() || MenuData.is_esports()" />
		<MatchesLeaguesTab v-else-if="MenuData.is_leagues()" :date="active_time" />
	</div>
</template>

<script setup>
import { ref,onMounted,onUnmounted, reactive, watch, nextTick } from 'vue';
import lodash_ from "lodash"
import { compute_css_obj } from 'src/core/server-img/index.js'
import MatchesFilterTab from "./matches_filter_tab_ball_species.vue";
import MatchesDateTab from "./matches_filter_tab.vue";
import MatchesLeaguesTab from "./matches_filter_tab_leagues.vue"
import { MenuData, useMittOn,MITT_TYPES, useMittEmit,i18n_t, UserCtr} from "src/output/index.js"
import BaseData from "src/core/base-data/base-data.js";
import MatchLeagueData from 'src/core/match-list-pc/match-league-data.js'
import { resolve_mew_menu_res, un_mounted } from "src/base-pc/components/match-list/list-filter/index.js";
import virtualSportsTab from "./virtual_sports_tab.vue"

const tab_list = ref([])

// 头部高度 包含 teb切换
const match_list_top = ref('80px')

const show_leagues = ref (false)
// 是否选中联赛时间
const active_time = ref(24)

const is_left_sports = ref(false)

const matches_header_title = ref("ouzhou.match.matches");

let mitt_list = null
const ref_data = reactive({
	ouzhou_filter_config :{
		// 首页   i18n_t('ouzhou.match.featured')    i18n_t('ouzhou.match.top_events')
		home_tab: [
			{ label: ('ouzhou.match.featured'), value: 1001 },
			{ label: ('ouzhou.match.top_events'), value: 1002 },
		],
		// 左侧菜单 i18n_t('ouzhou.match.matches')  i18n_t('ouzhou.match.top_leagues'
		sport_tab: [
			{ label: ('ouzhou.match.matches'), value: 4001 },
			{ label: ('ouzhou.match.top_leagues'), value: 4002 },
			{ label: ('menu.match_winner'), value: 4003 },
			// { label: 'Next 24 Hours', value: 4003 },
		], 
		// 收藏 i18n_t('ouzhou.match.inplay')  i18n_t('ouzhou.match.today')  i18n_t('ouzhou.match.early')
		favouritse_tab: [
			{ label: ('ouzhou.match.inplay'), value: 3001 },
			{ label: ('ouzhou.match.today'), value: 3002 },
			{ label: ('ouzhou.match.early'), value: 3003 },
			{ label: ('menu.match_winner'), value: 3004 },
			{ label: (BaseData.menus_i18n_map || {})[2000] || "" , value: 2000,not_i18n_t:true }
		],
		// i18n_t('ouzhou.match.inplay')   i18n_t('ouzhou.match.all_matches')
		inplay:{
			title: ('ouzhou.match.inplay'),
			name: ('ouzhou.match.all_matches')
		},
		esports:[
			{ label: 'ouzhou.match.lol', value: 2100 },
			{ label: 'ouzhou.match.dota', value: 2101 },
			{ label: 'ouzhou.match.csgo', value: 2102 },
			{ label: 'ouzhou.match.kog', value: 2103 },
		],
		// vr_sports: [
      	// 	{ label: 'ouzhou.match.vr_football', value: 30301 }, //vr足球
		// 	{ label: 'ouzhou.match.vr_basketball', value: 30304 }, //vr篮球
		// 	{ label: 'ouzhou.match.vr_horse_racing', value: 30311 }, //vr赛马
		// 	{ label: 'ouzhou.match.vr_greyhounds', value: 30302 }, //vr赛狗
		// 	{ label: 'ouzhou.match.vr_motorbike', value: 30312 }, //vr摩托车
		// 	{ label: 'ouzhou.match.vr_speedway', value: 30313 }	//vr泥地摩托车
		// ]
	},
	
}) 
const ouzhou_time_list = [
	{ label: ('ouzhou.filter.select_time.12h'), value: 12 }, 
	{ label: ('ouzhou.filter.select_time.24h'), value: 24 }, 
	{ label: ('ouzhou.filter.select_time.36h'), value: 3*24 }, 
	{ label: ('ouzhou.filter.select_time.84h'), value: 7*24 }, 
]

onMounted(()=>{
	set_tab_list(MenuData.menu_root)
	mitt_list = [ 
		useMittOn(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE,set_tab_list).off,
		useMittOn(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE_OUTRIGHTS,set_tab_list).off,
		useMittOn(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE_FAVOURITES,set_tab_list).off,
	]
})

onUnmounted(()=>{
	mitt_list.forEach(item => item());
	un_mounted()
})

const set_show_leagues = () => {
	show_leagues.value = !show_leagues.value
	if (show_leagues.value) {
		window.addEventListener('click', (e) => {
			show_leagues.value = false
		}, { once: true })
	}
}

const set_active_time = (item) => {
	MatchLeagueData.set_select_hours(item.value)
	active_time.value = item.value
}

// 设置 头部信息配置
const set_tab_list = (news_) =>{
	tab_list.value = []
	is_left_sports.value = false
	// 首页  500 5000都是热门
	if(news_ == 0 || news_ == 500 || news_ == 5000){
		tab_list.value =  lodash_.get( ref_data.ouzhou_filter_config,'home_tab', [])
		matches_header_title.value = 'ouzhou.match.matches'
		// top evnets
		if (news_ == 500 || news_ == 5000) {
			checked_current_tab(tab_list.value[1])
			return
		}
	}
	// 滚球
	if( news_ == 1 ){
		matches_header_title.value = 'ouzhou.match.inplay'
		match_list_top.value = '146px'
		resolve_mew_menu_res()
		MenuData.set_menu_root(1)
	}
	
	// 左侧菜单
	if(MenuData.is_left_today() || MenuData.is_left_zaopan() || MenuData.is_common_kemp()){
		let sport_tab = lodash_.get( ref_data.ouzhou_filter_config,'sport_tab', [])  
		if ([90, 91].includes(+MenuData.current_ball_type)) {
			sport_tab = sport_tab.filter((n)=>{return n.value != 4003 && n.value != 4002})
		}
		// if(IS_FOR_NEIBU_TEST){
			tab_list.value = sport_tab; 
		// }else{
		// 	sport_tab = sport_tab.filter((n)=>{return n.value != 4003})
		// 	tab_list.value = sport_tab
		// }
		if(!MenuData.is_collect){
			is_left_sports.value = true
			// 设置赛种名称
			// matches_header_title.value = BaseData.menus_i18n_map[MenuData.left_menu_result.lv1_mi] 
		}
	}

	// 收藏
	if (MenuData.is_collect) {
		matches_header_title.value = 'ouzhou.menu.collect';
		let ouzhou_filter_config = lodash_.get( ref_data.ouzhou_filter_config,'favouritse_tab', [])  
		// if(IS_FOR_NEIBU_TEST){
			tab_list.value = ouzhou_filter_config; 
		// }else{
		// 	ouzhou_filter_config = ouzhou_filter_config.filter((n)=>{return n.value != 3004})
		// 	 tab_list.value = ouzhou_filter_config
		// }
		
	}
	// 冠军
	if (MenuData.is_kemp() && !MenuData.is_common_kemp() && !MenuData.is_collect) {
		matches_header_title.value = 'list.outright'
		match_list_top.value = '146px'
		tab_list.value = []
		resolve_mew_menu_res()
	}
	// 电竞
	if (MenuData.is_esports() && !MenuData.is_collect) {
		is_left_sports.value = true
		// matches_header_title.value = BaseData.menus_i18n_map[2000]
		match_list_top.value = '134px'
		let ouzhou_filter_config = lodash_.get( ref_data.ouzhou_filter_config,'esports', [])  
		tab_list.value = ouzhou_filter_config
	}

	// vr体育
	if (MenuData.is_vr()) {
		// matches_header_title.value = 'VR体育'
		is_left_sports.value = true
		match_list_top.value = '134px'
		let ouzhou_filter_config = lodash_.get( ref_data.ouzhou_filter_config,'vr_sports', [])  
		tab_list.value = ouzhou_filter_config
	}

	if (tab_list.value.length) {
		if(MenuData.mid_menu_result.filter_tab){
			checked_current_tab({value:MenuData.mid_menu_result.filter_tab})
		}else{
			checked_current_tab(tab_list.value[0])
		}
	}
}
watch(BaseData.base_data_version,()=>{
	//元数据变化后 需要改变球种的ii8n 翻译是i18n来的
	if(MenuData.is_left_today() || MenuData.is_left_zaopan() || MenuData.is_common_kemp()){
		is_left_sports.value = true
		// matches_header_title.value = BaseData.menus_i18n_map[MenuData.left_menu_result.lv1_mi] 
	}
})
const checked_current_tab = (payload,type) => {
	let obj = {
		...MenuData.mid_menu_result,
		md: "",
		filter_tab: payload.value*1,
	}

	let root = MenuData.menu_root || 1
	// 判断头部高度
	if ([1001,4003].includes(payload.value*1)) {
		match_list_top.value = '80px'
	} else if([4001, 4002, 2100, 2101, 2102, 2103].includes(payload.value*1)){
		match_list_top.value = '134px'
	} else {
		match_list_top.value = '146px'
	}

	// 点击热门赛种 切换到 500
	if ([1002].includes(payload.value*1)) {
		root = 5000
		obj.current_mi = 5001
		UserCtr.set_sort_type(1);
		MenuData.set_current_ball_type(1)
	} else {
		UserCtr.set_sort_type(2);
	}
	// 还原top_event热门赛种 和 常规赛事的切换
	if (1001 == payload.value) {
		root = 0
    useMittEmit(MITT_TYPES.EMIT_SET_HOME_MATCHES,payload.value*1)
	}

	// 左侧菜单点击后 tab切换
	if (4001 == payload.value) {
		// 有时间为 早盘
		if(obj.md){
			root = 203
		}else{
			root = 202
		}
	}
	// 热门联赛
	if(4002 == payload.value){
		root = 202
		MenuData.set_menu_current_mi('')
	}
	// 冠军
	if(4003 == payload.value){
		root = 400
		obj.current_mi = 400 + MenuData.current_ball_type*1
		MenuData.set_menu_current_mi(obj.current_mi)
	}

	// 收藏切换tab
	if(MenuData.is_collect){
		//切换滚球 今日 早盘  球种初始化为足球背景
	 	// MenuData.set_current_ball_type(1)
	 	// MenuData.set_current_ball_type(MenuData.menu_current_mi - 400 || 1)
		if( payload.value == 3001){
			obj.current_mi = 1011;
			root = 2;
		}
		if( payload.value == 3002){
			obj.current_mi = 1012;
			root = 2;
		}
		if( payload.value == 3003){
			obj.current_mi = 1013;
			root = 2;
		}
		if( payload.value == 2000){
			obj.current_mi = 2100
			obj.current_ball_type = 100;
			root = 2000
		}
		if( payload.value == 3004){
			obj.current_mi = 401;
			root = 400;
		}

		if(type){
			MenuData.set_current_ball_type(obj.current_ball_type || 1)
			MenuData.set_menu_current_mi(obj.current_mi)
		}else{
			MenuData.set_current_ball_type(MenuData.current_ball_type || 1)
			MenuData.set_menu_current_mi(MenuData.menu_current_mi || obj.current_mi)
		}
	}

	// 刷新页面 使用数据
	if(!type){
		obj.current_mi = MenuData.menu_current_mi
	}

	MenuData.set_mid_menu_result(obj)
	MenuData.set_menu_root(root)

	// 电子竞技
	if (MenuData.is_esports() && !MenuData.is_collect) {
		obj.current_mi = payload.value*1
		MenuData.set_menu_current_mi(obj.current_mi)
		MenuData.set_current_ball_type(obj.current_mi)
		useMittEmit(MITT_TYPES.EMIT_LANG_CHANGE)
	}
	// get_sport_banner()

	if(MenuData.is_collect || [1002].includes(payload.value*1)){
		resolve_mew_menu_res()
	}
}

</script>

<style lang="scss" scoped>
.matches_header_wrap {
	//height: v-bind('match_list_top');
	// padding-right: 7px;
	min-height: 0.8rem;
	padding-bottom: 0.08rem;
	box-sizing: border-box;
}

.matches_outrights {
	height: 80px;
    line-height: 80px;
	.current_match_title {
		padding-top: 0px !important;
	}
}

.matches_header {
	width: 100%;
	box-sizing: border-box;
	border-bottom: 2px solid var(--q-gb-bd-c-1);
	background: var(--q-gb-bg-lg-8);
	position: relative;

	.header_banner {
		position: absolute;
		right: 0;
		top: 0;
		width: 226px;
		height: 80px;
		background-size: 226px ;
	}

	.matches-title {
		padding-left: 20px;
		min-height: 80px;
	}

	.current_match_title {
		font-size: 18px;
		font-weight: 500;
		color: var(--q-gb-t-c-1);
		margin-bottom: 21px;
		height: 30px;
		padding-top: 10px;
		&.all_matches{
			margin-bottom: 12px;
		}
	}
	.match_all_matches{
		color: var(--q-gb-t-c-1);
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
			color: var(--q-gb-t-c-3);
			margin-right: 40px;
			cursor: pointer;
			// border-bottom: 3px solid red;
		}

		.checked {
			border-bottom: 3px solid var(--q-gb-bd-c-1);
			color: var(--q-gb-t-c-2);
			display: flex;
		}
	}
}

.leagues_filrer {
	position: relative;
	display: flex;
	align-items: center;
	margin: -8px 0px 0px 12px !important;
	color: #fff !important;
	font-weight: 400 !important;
	font-size: 14px !important;
	.yb-icon-arrow {
		color: var(--q-gb-t-c-8) !important;
		margin-left: 10px !important;
		transform: rotate(90deg) !important;
		width: 7px !important;
		height: 7px !important;
		display: inline-block;
	}
	.leagues_filrer_item {
		position: absolute;
		top: 33px;
		left: 0;
		border-radius: 2px;
		background: #FFF;
		box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
		width: 200px;
		z-index: 9;
		min-height: 185px;
		padding: 12px 0;
		div {
			height: 41px;
			margin: 0px !important;
			line-height: 40px;
			color: #1A1A1A !important;
			font-size: 14px;
			font-weight: 400 !important;
			padding: 0 16px;
		}
		div:hover {
			color: #FF7000 !important;
		}
		.item_acitve {
			background: #FFF1E6;
			color: #1A1A1A !important;
		}
		.leagues_filrer_item_line {
			height: 1px !important;
			background-color: #E2E2E2 !important;
		}
	}
}

@media (max-width: 1450px) { 
	.matches_header_wrap {
	padding-right: 3px;
	}
  }
</style>