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


const route = useRoute();
const router = useRouter()

const getName = () => {
	let list = MatchLeagueData.get_league_list()
	let name = ''
	list.map(item => {
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

@media (max-width: 1450px) { 
	.matches_header_wrap {
	padding-right: 3px;
	}
  }
</style>