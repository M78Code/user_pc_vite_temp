<template>
	<div class="matches_header_wrap">
		<div v-show="false">{{MenuData.router_root_version}} ---{{MenuData.router_root_lv_1}}-{{MenuData.router_root_lv_2}}-{{MenuData.router_root_lv_3}}</div>
		<div class="matches_header">
			<div class="header_banne header_banner" :style="`background-position:0 -${current_ball_type}px`"></div>
			<div class="matches-title">
				<div class="current_match_title" :class="MenuData.router_root_lv_1 == 2 ?'all_matches':''">{{ matches_header_title }}</div>
				<div class="match_all_matches" v-if="MenuData.router_root_lv_1 == 2">All Matches</div>
				<div v-else class="matches_tab" >
					<div v-for="item in tab_list" :key="item.value" @click="checked_current_tab(item)"
						:class="{ 'checked': item.value == current_value }">
						{{ item.label }}
					</div>
				</div>
			</div>
		</div>
		<MatchesFilterTab v-if="(MenuData.router_root_lv_1 == 2 && MenuData.router_root_lv_2 == 1002 ) || MenuData.router_root_lv_1 == 2"  />
		<MatchesDateTab  v-if="MenuData.router_root_lv_2 == 4000 && MenuData.router_root_lv_3 == 4001" />
	</div>
</template>

<script setup>
 // 菜单的 router_root 节点   router_root ： 1 首页  2 滚球  3 my bets   // 4000 左侧赛种 1001 fetured  10002 top events  4001 matches  4002 langue   
import { ref,onMounted,onUnmounted, watch } from 'vue';
import { useRouter } from "vue-router";
import lodash_ from "lodash"

import MatchesFilterTab from "./matches_filter_tab_ball_species.vue";
import MatchesDateTab from "./matches_filter_tab.vue";
import { MenuData, UserCtr } from "src/core/index.js"
import menu_i18n_default from "src/core/base-data/config/menu-i18n.json";

const router = useRouter();
const tab_list = ref([])

// 获取当前header展示背景图
const current_ball_type = ref(630)

const matches_header_title = ref(i18n_t("ouzhou.match.matches"));
const current_value = ref(i18n_t("ouzhou.match.featured"));


onMounted(()=>{
	set_tab_list(MenuData.router_root_lv_1)
})

watch(()=>MenuData.router_root,(news_)=>{
	set_tab_list(news_)
})

// 设置 头部信息配置
const set_tab_list = (news_) =>{
	// 首页
	if(news_ == 1 ){
		tab_list.value = lodash_.get(MenuData.ouzhou_filter_config,'home_tab', [])  
	}
	// 滚球
	if( news_ ==2 ){
		matches_header_title.value = "In Play"
	}
	// 左侧菜单
	if(news_ ==4){
		tab_list.value = lodash_.get(MenuData.ouzhou_filter_config,'sport_tab', [])  
	}
}


// 头部高度 包含 teb切换
const match_list_top = ref('80px')

const b_menu_root = ref(0)

// 菜单多语言
const menus_i18n_map = ref(menu_i18n_default.data)


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