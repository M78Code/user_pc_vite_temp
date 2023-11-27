<template>
	<div class="matches_header_wrap">
		<div class="matches_header">
			<div class="header_banne header_banner" :style="compute_css_obj({ key: 'pc-home-featured-image', position: route.params.sportId })"></div>
			<div class="matches-title">
				<div class="match_all_matches">
					<span class="sports" @click="jumpTo()">{{ BaseData.menus_i18n_map[+route.params.sportId + 100] || "" }}</span>
					<img class="t_left" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/t_left.png`" alt="">
					<span class="leagues_name">{{ getName() }}</span>
				</div>
			</div>
			<div  class="leagues_filrer" @click.stop="set_show_leagues">
				{{ getName() }}
				<span class="yb-icon-arrow"></span>
				<div class="leagues_filrer_item" v-show="show_leagues">
					<div v-for="item in active_league_list" :key="item.id" @click="set_active_league(item)" :class="item.id == active_league ? 'league_acitve': ''">
						{{ item.nameText }}
						<div class="leagues_filrer_item_line" v-if="item.id !== active_league_list[active_league_list.length -1].id"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref,onMounted,onUnmounted, watch } from 'vue';
import { compute_css_obj } from 'src/core/server-img/index.js'
import { MenuData,i18n_t, LOCAL_PROJECT_FILE_PREFIX } from "src/core/index.js"
import BaseData from "src/core/base-data/base-data.js";
import { useRoute, useRouter } from 'vue-router';
import MatchLeagueData from 'src/core/match-list-pc/match-league-data.js'
import { get_ouzhou_leagues_data } from "src/base-pc/components/match-list/list-filter/index.js"

// const props = defineProps({
//   list: Array,
// });

const route = useRoute();
const router = useRouter()
const show_leagues = ref (false)
const active_league = ref(route.params.tid)
const active_league_list = JSON.parse(localStorage.getItem("league_list"))
console.log(active_league_list, 'active_league_list')

const set_show_leagues = () => {
	if (!active_league_list.length) return;
	if (!active_league_list.filter(item => item.id == active_league.value)?.length) return;
	show_leagues.value = !show_leagues.value
	if (show_leagues.value) {
		window.addEventListener('click', (e) => {
			show_leagues.value = false
		}, { once: true })
	}
}

const set_active_league = (item) => {
	active_league.value = item.id
	router.push(`/league/${route.params.sportId}/${item.id}`)
}

const getName = () => {
	let name = ''
	active_league_list.map(item => {
		if (item.id == route.params.tid) {
			name = item.nameText
		}
	})
	return name || MatchLeagueData.league_name.value
}
const jumpTo = ()=>{
	router.go(-1)
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
		font-family: "PingFang SC";
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
		width: 300px;
		z-index: 9;
		height: 185px;
		padding: 12px 0;
		overflow-y: auto;
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
		.league_acitve {
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