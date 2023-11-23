<template>
	<div class="matches_header_wrap">
		<div v-show="false">{{MenuData.menu_data_version}}-{{ MenuData.current_ball_type }}-{{MenuData.menu_root}}-{{ MenuData.is_collect}}-{{ MenuData.is_top_events()}}-{{MenuData.is_left_today()}}-{{MenuData.is_left_zaopan()}}</div>
		<div class="matches_header">
			<div class="header_banne header_banner" :style="compute_css_obj({ key: 'pc-home-featured-image', position: MenuData.current_ball_type })"></div>
			<div class="matches-title">
				<div class="current_match_title" :class="MenuData.is_scroll_ball() ?'all_matches':''">{{ matches_header_title }}</div>
				<div class="match_all_matches" v-if="MenuData.is_scroll_ball()">{{ i18n_t('ouzhou.match.all_matches')}}</div>
				<div v-else class="matches_tab" >
					<div v-for="item in tab_list" :key="item.value" @click="checked_current_tab(item)"
						:class="{ 'checked': item.value == MenuData.mid_menu_result.filter_tab }">
						{{ item.label }}
					</div>
					<!-- 点击联赛后出现的时间筛选 -->
					<div v-if=" MenuData.mid_menu_result.filter_tab === 4002" class="leagues_filrer" @click.stop="set_show_leagues">
						Next 24 Hours
						<div class="yb-icon-arrow"></div>
						<div class="leagues_filrer_item" v-show="show_leagues">
							<div v-for="item in ouzhou_time_list" :key="item.value" @click="set_active_time(item)" :class="item.value == active_time ? 'item_acitve': ''">
								{{ item.title }}
								<div class="leagues_filrer_item_line" v-if="item.value !== ouzhou_time_list[ouzhou_time_list.length -1].value"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<MatchesFilterTab v-if=" MenuData.is_scroll_ball() || MenuData.is_hot() || MenuData.is_collect || MenuData.is_top_events()"  />
		<MatchesDateTab v-if="MenuData.is_left_today() || MenuData.is_left_zaopan()" />
	</div>
</template>

<script setup>
import { ref,onMounted,onUnmounted, watch } from 'vue';
import lodash_ from "lodash"
import { compute_css_obj } from 'src/core/server-img/index.js'
import MatchesFilterTab from "./matches_filter_tab_ball_species.vue";
import MatchesDateTab from "./matches_filter_tab.vue";
import { MenuData, useMittOn,MITT_TYPES, useMittEmit,i18n_t } from "src/core/index.js"
import BaseData from "src/core/base-data/base-data.js";

const tab_list = ref([])

// 头部高度 包含 teb切换
const match_list_top = ref('80px')

const show_leagues = ref (false)
// 是否选中联赛时间
const active_time = ref(24)

const matches_header_title = ref(i18n_t("ouzhou.match.matches"));

let mitt_list = null

const ouzhou_filter_config = {
	// 首页   i18n_t('ouzhou.match.featured')    i18n_t('ouzhou.match.top_events')
	home_tab: [
		{ label: i18n_t('ouzhou.match.featured'), value: 1001 },
		{ label: i18n_t('ouzhou.match.top_events'), value: 1002 },
	],
	// 左侧菜单 i18n_t('ouzhou.match.matches')  i18n_t('ouzhou.match.top_leagues'
	sport_tab: [
		{ label: i18n_t('ouzhou.match.matches'), value: 4001 },
		{ label: i18n_t('ouzhou.match.top_leagues'), value: 4002 },
		// { label: 'Next 24 Hours', value: 4003 },
	], 
	// 收藏 i18n_t('ouzhou.match.inplay')  i18n_t('ouzhou.match.today')  i18n_t('ouzhou.match.early')
	favouritse_tab: [
		{ label: i18n_t('ouzhou.match.inplay'), value: 3001 },
		{ label: i18n_t('ouzhou.match.today'), value: 3002 },
		{ label: i18n_t('ouzhou.match.early'), value: 3003 }
	],
	// i18n_t('ouzhou.match.inplay')   i18n_t('ouzhou.match.all_matches')
	inplay:{
		title: i18n_t('ouzhou.match.inplay'),
		name: i18n_t('ouzhou.match.all_matches')
	}
}
const ouzhou_time_list = [
	{ label: i18n_t('ouzhou.filter.select_time.12h'), title:'12小时', value: 12 }, 
	{ label: i18n_t('ouzhou.filter.select_time.24h'), title:'24小时', value: 24 }, 
	{ label: i18n_t('ouzhou.filter.select_time.36h'), title:'3天', value: 36 }, 
	{ label: i18n_t('ouzhou.filter.select_time.84h'), title:'7天', value: 84 }, 
]

onMounted(()=>{
	set_tab_list(MenuData.menu_root)
	mitt_list = [ useMittOn(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE,set_tab_list).off ]
})

onUnmounted(()=>{
	mitt_list.forEach(item => item());
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
	active_time.value = item.value
}

// 设置 头部信息配置
const set_tab_list = (news_) =>{
	tab_list.value = []
	// 首页
	if(news_ == 0 ){
		tab_list.value = lodash_.get( ouzhou_filter_config,'home_tab', [])  
		matches_header_title.value = i18n_t('ouzhou.match.matches')
	}
	// 滚球
	if( news_ == 1 ){
		matches_header_title.value = i18n_t('ouzhou.match.inplay')
   		match_list_top.value = '146px'
	}
	
	// 左侧菜单
	if(MenuData.is_left_today() || MenuData.is_left_zaopan()){
		tab_list.value = lodash_.get( ouzhou_filter_config,'sport_tab', [])  
		// 设置赛种名称
		matches_header_title.value = BaseData.menus_i18n_map[MenuData.left_menu_result.lv1_mi] 
	}

	// 收藏
	if (MenuData.is_collect) {
		console.error(MenuData);
		matches_header_title.value = i18n_t('ouzhou.menu.collect')
		tab_list.value = lodash_.get( ouzhou_filter_config,'favouritse_tab', [])  
	}

	if (tab_list.value.length) {
		checked_current_tab(tab_list.value[0])
	}
}

const checked_current_tab = payload => {

	let obj = {
		...MenuData.mid_menu_result,
		filter_tab: payload.value*1,
	}
	// 判断头部高度
	if ([1001,4002].includes(payload.value*1)) {
		match_list_top.value = '80px'
	} else if([4001].includes(payload.value*1)){
		match_list_top.value = '134px'
	} else {
		match_list_top.value = '146px'
	}

	// 点击热门赛种 切换到 500
	if ([1002].includes(payload.value*1)) {
		MenuData.set_menu_root(500)
		obj.current_mi = 5001
		MenuData.set_current_ball_type(1)
	}
	// 还原top_event热门赛种 和 常规赛事的切换
	if (1001 == payload.value) {
		MenuData.set_menu_root(0)
    useMittEmit(MITT_TYPES.EMIT_SET_HOME_MATCHES,payload.value*1)
	}

	// 收藏切换tab
	if(MenuData.is_collect){
		if( payload.value == 3001){
			obj.current_mi = 1011
		}
		if( payload.value == 3002){
			obj.current_mi = 1012
		}
		if( payload.value == 3003){
			obj.current_mi = 1013
		}
		MenuData.set_menu_current_mi(obj.current_mi)
	}
	// get_sport_banner()
	MenuData.set_mid_menu_result(obj)
}

</script>

<style lang="scss" scoped>
.matches_header_wrap {
	height: v-bind('match_list_top');
	// padding-right: 7px;
	box-sizing: border-box;
}

.matches_header {
	width: 100%;
	padding-top: 10px;
	box-sizing: border-box;
	border-bottom: 2px solid var(--q-gb-bd-c-1);
	background: var(--q-gb-bg-lg-8);
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
		color: var(--q-gb-t-c-1);
		margin-bottom: 21px;
		height: 20px;
		&.all_matches{
			margin-bottom: 12px;
		}
	}
	.match_all_matches{
		color: var(--q-gb-t-c-1);
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
			color: var(--q-gb-t-c-3);
			margin-right: 40px;
			cursor: pointer;
			// border-bottom: 3px solid red;
		}

		.checked {
			border-bottom: 3px solid var(--q-gb-bd-c-1);
			color: var(--q-gb-t-c-2);
		}
	}
}

.leagues_filrer {
	position: relative;
	display: flex;
	align-items: center;
	margin-left: -28px;
	margin-top: -8px;
	color: #fff !important;
	font-weight: 400 !important;
	font-size: 14px !important;
	.yb-icon-arrow {
		color: var(--q-gb-t-c-8) !important;
		margin-left: 10px !important;
		transform: rotate(90deg) !important;
		width: 7px !important;
		height: 7px !important;
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