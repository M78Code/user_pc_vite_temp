<template>
	<div class="matches_header_wrap">
		<div v-show="false">{{ BaseData.base_data_version }}</div>
		<div class="matches_header">
			<div class="header_banne header_banner" :style="compute_css_obj({ key: 'pc-home-featured-image', position: route.params.sportId })"></div>
			<div class="matches-title">
				<div class="match_all_matches">
					<span class="sports" @click="jumpTo()">{{ BaseData.menus_i18n_map[get_sportId] || "" }}</span>
					<img class="t_left" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/t_left.png`" alt="">
					<span class="leagues_name">{{ getName() }}</span>
				</div>
			</div>
			<div  class="leagues_filrer" @click.stop="set_show_leagues">
				{{ getName() }}
				<span class="yb-icon-arrow"></span>
				<div class="leagues_filrer_item" v-show="show_leagues">
					<div v-for="item in league_list" :key="item.id" @click="set_active_league(item)" class="leagues_item" :class="item.id == active_league ? 'league_acitve': ''">
						{{ item.nameText }}
						<div class="leagues_filrer_item_line" v-if="item.id !== league_list[league_list.length -1].id"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref,onMounted,onUnmounted, watch, computed } from 'vue';
import lodash_ from "lodash"
import { compute_css_obj } from 'src/core/server-img/index.js'
import { MenuData,useMittOn,MITT_TYPES, LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import BaseData from "src/core/base-data/base-data.js";
import { useRoute, useRouter } from 'vue-router';
import { get_ouzhou_leagues_data, un_mounted } from "src/base-pc/components/match-list/list-filter/index.js"

// route.params.type  1 从联赛列表进入 2 从普通赛事详情进入
const route = useRoute();
const router = useRouter()
const show_leagues = ref (false)
const active_league = ref(route.params.tid)
const league_list = ref([])
// const league_list2 = ref([]) // for fix 49882
const set_show_leagues = () => {
	if (!league_list.value.length) return;
	show_leagues.value = !show_leagues.value
	if (show_leagues.value) {
		window.addEventListener('click', (e) => {
			show_leagues.value = false
		}, { once: true })
	}
}

const get_sportId = computed(() => {
	let sportId = 1
	if ([100, 101, 102, 103].includes(+route.params.sportId)) {
		sportId = 2000
	} else {
		sportId = +route.params.sportId + 100
	}
	return sportId
})

async function get_league(){
	// 搜索进来查询7天数据 详情进来查询 12小时
	let date = route.params.type == 1 ? localStorage.getItem('league_hours') : route.params.type == 2 ? 12 : 168
  	const list = await get_ouzhou_leagues_data(date, route.params.sportId)
	league_list.value=[]
	list?.map(item => {
		if (route.params.type == 1) {
			if (item.id == localStorage.getItem('league_id')) {
				league_list.value = item.tournamentList
			}
		} else {
			item.tournamentList?.map(leagues => {
				league_list.value.push(leagues)
			})
		}
	})

  // for fix 49882
//   const list2 = await get_ouzhou_leagues_data(120, route.params.sportId)
//   league_list2.value=[]
//   list2?.map(item => {
//     item.tournamentList?.map(leagues => {
//       league_list2.value.push(leagues)
//     })
//   })

}
const off= useMittOn(MITT_TYPES.EMIT_LANG_CHANGE,()=>get_league()).off
watch(() => route.params.type, async () => {
	get_league()
}, { immediate: true })

const set_active_league = (item) => {
	active_league.value = item.id
	localStorage.setItem('league_name', item.nameText)
	router.push(`/league/${route.params.sportId}/${item.id}/${route.params.type}`)
}
onUnmounted(()=>{
	un_mounted()
	off()
})
const getName = () => {
	let name = ''
	league_list.value.map(item => {
		if (item.id == route.params.tid) {
			name = item.nameText
		}
	})
	return name || localStorage.getItem('league_name')
}
const jumpTo = ()=>{
	// let route_name = lodash_.get(MenuData.router_info,'pre_route') || 'home'
	// console.log(route_name, 'route_name')
		let obj = {
			lv1_mi : route.params.sportId*1 +100,
			has_mid_menu: true, // 有中间菜单
			lv2_mi: route.params.sportId*1 +100 +''+ 2, // 二级菜单id
			menu_type: 1, // 左侧热门或者赛种
		}

		let mid_config = {
			...MenuData.mid_menu_result,
			md: '',
			filter_tab: 4001
		}
  
		MenuData.set_menu_root(202, true)
		MenuData.set_left_menu_result(obj)
		MenuData.set_menu_current_mi(route.params.sportId*1 +100)
  	MenuData.set_current_ball_type(route.params.sportId)
		MenuData.set_mid_menu_result(mid_config)
		
		router.push({name:'home'})
}

</script>

<style lang="scss" scoped>
.matches_header_wrap {
	height:80px;
	// padding-right: 7px;
	box-sizing: border-box;
	margin-bottom: 10px;
}
.sports {
	color: #B5B5B5;
	font-family: PingFang SC;
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	cursor: pointer;
}
.t_left {
	height: 8px;
	margin: 0 8px;
}
.leagues_name {
	color: #FFF;
	font-family: PingFang SC;
	font-size: 14px;
	font-style: normal;
	font-weight: 500;
}
.matches_header {
	width: 100%;
	padding-top: 10px;
	box-sizing: border-box;
	border-bottom: 2px solid var(--q-gb-bd-c-1);
	background: var(--q-gb-bg-lg-8);
	position: relative;
	height: 100%;
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
		font-size: 18px;
		font-weight: 500;
		line-height: 25px;
		letter-spacing: 0px;
		text-align: left;
		margin-bottom: 8px;
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
	color: #fff !important;
	font-weight: 400 !important;
	font-size: 18px !important;
	padding-left: 20px;
	cursor: pointer;
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
		left: 20px;
		border-radius: 2px;
		background: #FFF;
		box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
		max-width: 300px;
		z-index: 9;
		max-height: 185px;
		padding: 12px 0;
		overflow-y: auto;
		.leagues_item {
			height: 41px;
			margin: 0px !important;
			line-height: 40px;
			color: #1A1A1A !important;
			font-size: 14px;
			font-weight: 400 !important;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			padding: 0 16px;
		}
		.leagues_item:hover {
			background: #FFF1E6;
			color: #1A1A1A !important;
		}
		.league_acitve {
			color: #FF7000 !important;
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