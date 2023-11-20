<template>
	<div class="matches_header_wrap">
		<div v-show="false">{{MenuData.menu_data_version}}-{{MenuData.menu_root}}-{{MenuData.mid_menu_result }}-{{ MenuData.is_collect}}-{{ MenuData.is_top_events()}}-{{MenuData.is_left_today()}}-{{MenuData.is_left_zaopan()}}</div>
		<div class="matches_header">
			<div class="header_banne header_banner" :style="compute_css_obj({ key: 'pc-home-featured-image', position: current_ball_type})"></div>
			<div class="matches-title">
				<div class="current_match_title" :class="MenuData.is_scroll_ball() ?'all_matches':''">{{ matches_header_title }}</div>
				<div class="match_all_matches" v-if="MenuData.is_scroll_ball()">All Matches</div>
				<div v-else class="matches_tab" >
					<div v-for="item in tab_list" :key="item.value" @click="checked_current_tab(item)"
						:class="{ 'checked': item.value == MenuData.mid_menu_result.filter_tab }">
						{{ item.label }}
					</div>
					<!-- 点击联赛后出现的时间筛选 -->
					<!-- <div>
						Next 24 Hours
						<div>
							<div v-for="item in MenuData.ouzhou_time_list" :key="item.value">
								{{ item.title }}
							</div>
						</div>
					</div> -->
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
import { MenuData, useMittOn,MITT_TYPES, useMittEmit } from "src/core/index.js"
import BaseData from "src/core/base-data/base-data.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";

const tab_list = ref([])
// 获取当前header展示背景图
const current_ball_type = ref(0)
// 头部高度 包含 teb切换
const match_list_top = ref('80px')

const matches_header_title = ref(i18n_t("ouzhou.match.matches"));

let mitt_list = null
onMounted(()=>{
	set_tab_list(MenuData.menu_root)
	mitt_list = [ useMittOn(MITT_TYPES.EMIT_SET_LEFT_MENU_CHANGE,set_tab_list).off ]
})

onUnmounted(()=>{
	mitt_list.forEach(item => item());
	current_ball_type.value = 0
})


// 设置 头部信息配置
const set_tab_list = (news_) =>{
	tab_list.value = []
	// 首页
	if(news_ == 0 ){
		tab_list.value = lodash_.get(MenuData.ouzhou_filter_config,'home_tab', [])  
		matches_header_title.value = "Matches"
		// current_ball_type.value = 0
	}
	// 滚球
	if( news_ == 1 ){
		matches_header_title.value = "In Play"
   		match_list_top.value = '146px'
		// current_ball_type.value = 1
	}
	
	// 左侧菜单
	if(MenuData.is_left_today() || MenuData.is_left_zaopan()){
		tab_list.value = lodash_.get(MenuData.ouzhou_filter_config,'sport_tab', [])  
		// current_ball_type.value = 1
		// 设置赛种名称
		matches_header_title.value = BaseData.menus_i18n_map[MenuData.left_menu_result.lv1_mi] 
	}

	// 收藏
	if (MenuData.is_collect) {
		matches_header_title.value = "Favouritse"
		tab_list.value = lodash_.get(MenuData.ouzhou_filter_config,'favouritse_tab', [])  
		// current_ball_type.value = 1
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
	}
	// 还原top_event热门赛种 和 常规赛事的切换
	if (1001 == payload.value) {
		MenuData.set_menu_root(0)
    	useMittEmit(MITT_TYPES.EMIT_SET_HOME_MATCHES,payload.value*1)
		current_ball_type.value = 0
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
watch(MatchListCardDataClass.list_version, (list_version) => {
	if (MenuData.mid_menu_result.filter_tab !== 1001) {
		get_sport_banner();
	}
});
// 监听球种导航变化 切换精灵图
const get_sport_banner = () => {
	let arr = MatchListCardDataClass.match_list_card_key_arr
	if (arr.length) {
		let length = arr[0].split("_").length
		let sport_id = arr[0].split("_")[length - 1]
		current_ball_type.value = sport_id
	// console.log(sport_id, 'MenuData.mid_menu_result')
	}
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

@media (max-width: 1450px) { 
	.matches_header_wrap {
	padding-right: 3px;
	}
  }
</style>