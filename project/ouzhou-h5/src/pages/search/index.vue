<template>
	<div class='search-container'>
		<!-- 头部搜索 -->
		<div class="top_info_search">
			<input ref="input_ref" type="search" maxlength="15" placeholder="Search" v-model="input_value"
				@keyup.enter="get_search_data(input_value)" />
			<img :src="compute_local_project_file_path('image/home/top_seach.png')" alt="" />
			<span class="clear_value" @click="clear_value">X</span>
			<span class="close_btn" @click="to_home">Close</span>
		</div>
		<!-- 搜索 历史 -->
		<div class="content" v-if="history_data.length > 0 || !search_data">
			<div class="middle_info_tab">EXAMPLE SEARCHES</div>
			<ul class="list">
				<li v-for="(item, index) in history_data" :key="item.cuid">
					{{ item.keyword }}<img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
				</li>
			</ul>
		</div>
		<!-- 搜索 队伍 -->
		<div class="content" v-if="search_data.length > 0">
			<div class="middle_info_tab" ref="tab_growp">
				<div v-for="(item, index) in sport_kind_data" :key="item.id" @click="get_search_data(index, item.id)" :class="['tab', tabIndex === index ? 'active' : '']"     
				 >{{ item.sportName }}</div>
			</div>
			<ul class="list">
				<li>
					<div class="list_top">
						<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
					</div>
					<div class="list_bottom">
						<div>
							<p>Man City v Inter Milan</p>
							<p>Sun 11 Jun 03:00</p>
						</div>
						<div>
							<div>
								1
							</div>
							<div>
								2
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="list_top">
						<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
					</div>
					<div class="list_bottom">
						<div>
							<p>Man City v Inter Milan</p>
							<p>Sun 11 Jun 03:00</p>
						</div>
						<div>
							<div>
								1
							</div>
							<div>
								2
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="list_top">
						<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
					</div>
					<div class="list_bottom">
						<div>
							<p>Man City v Inter Milan</p>
							<p>Sun 11 Jun 03:00</p>
						</div>
						<div>
							<div>
								1
							</div>
							<div>
								2
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<!-- 搜索 联赛 -->
		<div class="content" v-if="0">
			<div class="middle_info_tab">
				<div @click="tabIndex = 1" :class="['tab', tabIndex === 1 ? 'active' : '']">Soccer</div>
				<div @click="tabIndex = 2" :class="['tab', tabIndex === 2 ? 'active' : '']">Gaming</div>
			</div>
			<div class="teams">
				<div class="title">View all soccer</div>
				<div class="middle_info_tab">TEAMS</div>
				<ul class="list1">
					<li>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City v Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City v Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City v Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="teams">
				<div class="middle_info_tab">TEAMS</div>
				<ul class="list1">
					<li>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City v Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City v Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City v Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City v Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City v Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City v Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<!-- 搜索 无结果 -->
		<div class="content" v-if="!search_data">
			<div class="middle_info_tab">No results found. please try a different search term.</div>
			<div class="not_found">
				<img :src="compute_local_project_file_path('image/png/not_found.png')" alt="">
				<p>No results</p>
			</div>
		</div>
	</div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import { compute_local_project_file_path, utils } from "src/core/";
import router from "../../router";
import UserCtr from "src/core/user-config/user-ctr.js";
import { get_history_search, get_search_result, get_search_sport } from "src/api/module/search/index.js";

const input_value = ref('');
const tabIndex = ref(1);
const tab_growp = ref(null);

const clear_value = () => {
	input_value.value = '';
}
const to_home = () => {
	router.push('/')
}
// /hotSearch/queryHistory 搜索历史 pramas: {isPC: 0; cuid: 509823602117100010; t: 1699586846419}
// /hotSearch/hotSelect3 搜索 pramas: {isPC: 0; searchSportType: 1; keyword: 英国; device: v2_h5_st; cuid: 509823602117100010; t: 1699586846419}

/**
 * @Description:获取搜索历史数据
 */
const history_data = ref([]);
const get_history = () => {
	let params = {
		cuid: UserCtr.get_uid(),
		isPc: 0
	}
	get_history_search(params).then(res => {
		let data = lodash.get(res, "data") || [];
		if (data.length > 0) {
			// console.log('his_data', data);
			history_data.value = data
		}
	});
}
// 搜索
const search_data = ref([]);
const get_search_data = (index = 1, sport_id = '') => {
	tabIndex.value = index;
	utils.tab_move2(index, tab_growp.value);
	if (!input_value.value) {
		return;
	}
	let params = {
		cuid: UserCtr.get_uid(),
		isPc: 0,
		searchSportType: sport_id || 1,
		keyword: input_value.value || '',
		device: 'v2_h5_st'
	}
	get_search_result(params).then(res => {
		let data = lodash.get(res, "data") || [];
		if (data.length > 0) {
			// console.log('sear_data', data.data);
			search_data.value = data.data
		}
	});
}
// 获取球赛的种类
const sport_kind_data = ref([]);
const get_sport_kind = () => {
	get_search_sport().then(res => {
		let data = lodash.get(res, "data") || [];
		if (data.length > 0) {
			// console.log('spo_data', data);
			sport_kind_data.value = data
		}
	});
}
onMounted(() => {
	get_history();
	get_sport_kind();
})
//监听输入框内容改变
watch(
	() => input_value.value,
	(val) => {
		let trimVal = val.trim();
	}
)
</script>
<style lang="scss" scoped>
.search-container {
	background-color: #E2E2E2;
}

.top_info_search {
	position: relative;
	padding-left: 20px;
	height: 50px;
	line-height: 50px;
	width: 100%;
	background-color: #ff8b33;

	img {
		position: absolute;
		left: 35px;
		top: 20px;
		width: 12px;
		height: 12px;
		color: #fff;
	}

	input {
		border: 1px solid #CE5B00;
		border-radius: 20px;
		width: 300px;
		height: 30px;
		padding-left: 30px;
		background: #CE5B00;
		outline: none;
		color: #fff;
		margin-right: 6px;
		font-weight: 500;
	}

	::-webkit-input-placeholder {
		color: #ffffff;
		font-size: 14px;
		padding-left: 5px;
	}

	.clear_value {
		position: absolute;
		right: 70px;
		top: 0px;
		color: #fff;
		font-size: 14px;
	}

	.close_btn {
		color: #fff;
		opacity: .8;
		font-size: 14px;
	}
}

.content {
	color: #1A1A1A;
}

.middle_info_tab {
	padding: 9px 18px;
	display: flex;
	border-bottom: 1px solid #FF7000;
	background-color: #fff;
	font-size: 14px;
	font-weight: 500;
	overflow-x: scroll;
	box-sizing: border-box;

	.tab {
		background-color: #FFf;
		border-radius: 40px;
		text-align: center;
		font-size: 12px;
		flex-shrink: 0;
		padding: 3px 10px;

		&:last-child {
			margin-right: 0;
		}

		&.active {
			background-color: #FF7000;
			color: #fff;
		}
	}
}

li {
	margin: 8px 0;
	padding: 14px 10px;
	background-color: #fff;
	border-radius: 6px;
	font-size: 14px;

	// img {
	// 	vertical-align: text-top;
	// }
	.list_top {
		margin-bottom: 19px;
		font-size: 14px;
		font-weight: 500;
	}

	.list_bottom {
		display: flex;

		div p:first-child {
			font-size: 14px;
		}

		div p:last-child {
			color: #8A8986;
		}
	}
}

.list1 {
	margin-bottom: 8px;

	li {
		margin: 0;
		border-radius: 0;
	}
}

.list {
	padding: 0 10px;
	height: 100vh;
}

.teams {
	.title {
		height: 36px;
		line-height: 36px;
		padding-left: 18px;
		font-weight: 500;
		font-size: 14px;
	}

	.middle_info_tab {
		font-size: 12px;
		font-weight: 600;
		color: #FF7000;
	}
}

.not_found {
	height: 100vh;
	text-align: center;
	margin: 86px 0;

	p {
		font-size: 16px;
		font-weight: 500;
	}
}</style>
  
  