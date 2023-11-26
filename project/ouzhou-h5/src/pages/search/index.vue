<template>
	<div class="search-container">
		<!-- 头部搜索 -->
		<div class="top_info_search">
			<input ref="input_ref" type="search" maxlength="15" :placeholder="`${i18n_t('search.search_title')}`" v-model="input_value" />
			<img :src="compute_local_project_file_path('image/home/top_seach.png')" alt="" />
			<img :src="compute_local_project_file_path('image/svg/bet_close3.svg')" alt="" class="clear_value"
			  @click.stop.prevent.self="clear_value" v-show="input_value.length > 0"/>
			<span class="close_btn" @click="to_home">{{ i18n_t('ouzhou.search.close') }}</span>
		</div>
		<!-- 搜索 历史 -->
		<div class="content" v-show="(show_history && history_data &&
				!(search_data.teamH5 && search_data.teamH5.length > 0) &&
				!(search_data.league && search_data.league.length > 0) > 0) || !input_value">
			<!-- <div class="middle_info_tab">EXAMPLE SEARCHES</div> -->
			<!-- 球类 tabs -->
			<div class="middle_info_tab top_tab" ref="tab_growp">
				<div v-for="(item, index) in sport_kind_data" :key="item.id" @click="get_search_data(index, item.id)"
					:class="['tab', tabIndex === index ? 'active' : '']">
					{{ item.sportName }}
					<span class="round"></span>
				</div>
			</div>
			<ul class="list1" v-show="history_data && history_data.length > 0">
				<div class="middle_info_tab diff text">
					<div>{{ i18n_t('ouzhou.search.search_history') }}</div>
				</div>
				<li v-for="(item, index) in history_data" :key="item.cuid">
					<span style="display: inline-block; width: 90%;" @click="get_search_data(0, 1, item.keyword)">{{ item.keyword }}</span><img :src="compute_local_project_file_path('/image/svg/close10.svg')" alt="" @click="_delete_history_search(item.keyword)">
				</li>
				<li class="del" @click="_delete_history_search('')">{{ i18n_t('ouzhou.search.clear_search_history') }}</li>
			</ul>

			<!-- 热门搜索 -->
			<div class='searchHot' :class="[(history_data.length > 0) ? '' : 'mt50']" v-show="show_hot && 
				(hot_list && hot_list.length > 0) &&
				!(search_data.teamH5 && search_data.teamH5.length > 0) &&
				!(search_data.league && search_data.league.length > 0) ||
				!input_value">
				<div>
					<div class="text-bol">{{ i18n_t('ouzhou.search.search_hot') }}</div>
					<!-- 热门内容 -->
					<ul>
						<li class="hotItem" v-for="(item, index) in hot_list" :key="index"
							@click="get_search_data(0, 1, item.keyWord)">
							{{ index + 1 }}.{{ item.keyWord }}
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 搜索展示 -->
		<div style="height: 100%; overflow-y: auto;" v-show="(search_data?.teamH5 && search_data?.teamH5.length > 0) ||
			(search_data?.league && search_data?.league.length > 0)">

			<div class="content">
			<!-- 球类 tabs -->
			<div class="middle_info_tab top_tab" ref="tab_growp">
				<div v-for="(item, index) in sport_kind_data" :key="item.id" @click="get_search_data(index, item.id)"
					:class="['tab', tabIndex === index ? 'active' : '']">
					{{ item.sportName }}
					<span class="round"></span>
				</div>
			</div>
			<ul class="list">
				<div class="title">{{ i18n_t('ouzhou.search.view_all_match') }}</div>
				<!-- 滚球 -->
				<div v-show="search_data?.bowling && search_data?.bowling.length > 0">
					<div class="middle_info_tab diff" @click="expand_bowling = !expand_bowling">
						<div class="color">{{ i18n_t('ouzhou.search.underway') }}</div>
					</div>
					<div v-show="expand_bowling">
						<li v-for="(item, index) in search_data?.bowling" :key="index" @click="suggestion_bowling_click(item)">
							<div class="list_top">
								<span v-html="red_color(item.tn)"></span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
							</div>
							<div class="list_bottom">
								<div style="width: 60%; word-break: break-all">
									<p>
										<span class="home" v-html="red_color(item.mhn)"></span>
										<span class="middle">v</span>
										<span class="away" v-html="red_color(item.man)"></span>
									</p>
									<p>{{ format_date_overseas(item.mgt) }}</p>
								</div>
								<div style="display: flex;flex-direction: row; flex: 1">
									<div class="flex_1" v-if="item?.hps?.[0]?.hl.length > 0 && item?.hps?.[0]?.hl?.[0]?.ol?.[1]?.ov && item?.hps?.[0]?.hl?.[0]?.ol?.[1]?.os === 1">
										<div>{{ item?.hps?.[0].hl?.[0].ol?.[0].on }}</div>
										<div class="red">{{ get_odd_os(item?.hps?.[0].hl?.[0].ol?.[0]?.ov) }}</div>
									</div>
									<div class="flex_1" v-else>
										<img class="lock" :src="odd_lock_ouzhou" alt="lock">
									</div>
									<div class="flex_1" v-if="item?.hps?.[0]?.hl.length > 0 && item?.hps?.[0]?.hl?.[0]?.ol?.[1]?.ov && item?.hps?.[0]?.hl?.[0]?.ol?.[1]?.os === 1">
										<div>{{ i18n_t('ouzhou.search.dogfall') }}</div>
										<div class="red">{{ get_odd_os(item?.hps?.[0].hl?.[0].ol?.[2]?.ov) }}</div>
									</div>
									<div class="flex_1" v-else>
										<img class="lock" :src="odd_lock_ouzhou" alt="lock">
									</div>
									<div class="flex_1" v-if="item?.hps?.[0]?.hl.length > 0 && item?.hps?.[0]?.hl?.[0]?.ol?.[1]?.ov && item?.hps?.[0]?.hl?.[0]?.ol?.[1]?.os === 1">
										<div>{{ item?.hps?.[0].hl?.[0].ol?.[1].on }}</div>
										<div class="red">{{ get_odd_os(item?.hps?.[0].hl?.[0].ol?.[1]?.ov) }}</div>
									</div>
									<div class="flex_1" v-else>
										<img class="lock" :src="odd_lock_ouzhou" alt="lock">
									</div>
								</div>
							</div>
						</li>
					</div>
				</div>
				<!-- 搜索 联赛 -->
				<div v-show="search_data?.league && search_data?.league.length > 0">
					<div class="middle_info_tab diff" @click="expand_league = !expand_league">
						<div class="color">{{ i18n_t('ouzhou.search.league') }}</div>
					</div>
					<div v-show="expand_league">
						<li v-for="(item, index) in search_data?.league" :key="index"
						@click="default_method_jump(item.leagueName, item.matchList[index])">
							<div class="list_top">
								<!-- 联赛icon -->
								<!-- <img class="match_logo"
									:src="item.matchList[0] ? get_server_file_path(item.matchList[0].lurl) : compute_img_url('match-cup')"
									@error="league_icon_error" /> -->
								<span v-html="red_color(item.leagueName)"></span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')"
									alt="">
							</div>
							<div class="list_bottom" v-for="(i, idx) in item.matchList">
								<div style="width: 60%; word-break: break-all">
									<p>
										<span class="home" v-html="red_color(i.mhn)"></span>
										<span class="middle">v</span>
										<span class="away" v-html="red_color(i.man)"></span>
									</p>
									<p>{{ format_date_overseas(i.mgt) }}</p>
								</div>
								<div style="display: flex;flex-direction: row; flex: 1">
									<div class="flex_1" v-if="i?.hps?.[0]?.hl.length > 0 && i?.hps?.[0]?.hl?.[0]?.ol?.[1]?.ov && i?.hps?.[0]?.hl?.[0]?.ol?.[1]?.os === 1">
										<div>{{ i?.hps?.[0].hl?.[0].ol?.[0]?.on }}</div>
										<div class="red">{{ get_odd_os(i?.hps?.[0].hl?.[0].ol?.[0]?.ov) }}</div>
									</div>
									<div class="flex_1" v-else>
										<img class="lock" :src="odd_lock_ouzhou" alt="lock">
									</div>
									<div class="flex_1" v-if="i?.hps?.[0]?.hl.length > 0 && i?.hps?.[0]?.hl?.[0]?.ol?.[1]?.ov && i?.hps?.[0]?.hl?.[0]?.ol?.[1]?.os === 1">
										<div>{{ i18n_t('ouzhou.search.dogfall') }}</div>
										<div class="red">{{ get_odd_os(i?.hps?.[0].hl?.[0].ol?.[2]?.ov) }}</div>
									</div>
									<div class="flex_1" v-else>
										<img class="lock" :src="odd_lock_ouzhou" alt="lock">
									</div>
									<div class="flex_1" v-if="i?.hps?.[0]?.hl.length > 0 && i?.hps?.[0]?.hl?.[0]?.ol?.[1]?.ov && i?.hps?.[0]?.hl?.[0]?.ol?.[1]?.os === 1">
										<div>{{ i?.hps?.[0].hl?.[0].ol?.[1]?.on }}</div>
										<div class="red">{{ get_odd_os(i?.hps?.[0].hl?.[0].ol?.[1]?.ov) }}</div>
									</div>
									<div class="flex_1" v-else>
										<img class="lock" :src="odd_lock_ouzhou" alt="lock">
									</div>
								</div>
							</div>
						</li>
					</div>
				</div>
				<!-- 搜索 队伍 -->
				<div v-show="search_data?.teamH5 && search_data.teamH5?.length > 0">
					<div class="middle_info_tab diff" @click="expand_team = !expand_team">
						<div class="color">{{ i18n_t('ouzhou.search.team') }}</div>
					</div>
					<div v-show="expand_team">
						<li v-for="(item, index) in search_data?.teamH5" :key="index" @click="default_method_jump(item.name, item)">
							<div v-if="item.tn">
								<div class="list_top">
									<span v-html="red_color(item.tn)"></span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
								</div>
							</div>
							<div class="list_bottom">
								<div style="width: 60%; word-break: break-all">
									<p>
										<span class="home" v-html="red_color(item.mhn)"></span>
										<span class="middle">v</span>
										<span class="away" v-html="red_color(item.man)"></span>
									</p>
									<p>{{ format_date_overseas(item.mgt) }}</p>
								</div>
								<div style="display: flex;flex-direction: row; flex: 1">
									<div class="flex_1" v-if="item?.hps?.[0]?.hl.length > 0 && item?.hps?.[0]?.hl?.[0]?.ol?.[1]?.ov && item?.hps?.[0]?.hl?.[0]?.ol?.[1]?.os === 1">
										<div>{{ i18n_t('bet.home_win') }}</div>
										<div class="red">{{ get_odd_os(item?.hps?.[0].hl?.[0].ol?.[0]?.ov) }}</div>
									</div>
									<div class="flex_1" v-else>
										<img class="lock" :src="odd_lock_ouzhou" alt="lock">
									</div>
									<div class="flex_1" v-if="item?.hps?.[0]?.hl.length > 0 && item?.hps?.[0]?.hl?.[0]?.ol?.[1]?.ov && item?.hps?.[0]?.hl?.[0]?.ol?.[1]?.os === 1">
										<div>{{ i18n_t('ouzhou.search.dogfall') }}</div>
										<div class="red">{{ get_odd_os(item?.hps?.[0].hl?.[0].ol?.[2]?.ov) }}</div>
									</div>
									<div class="flex_1" v-else>
										<img class="lock" :src="odd_lock_ouzhou" alt="lock">
									</div>
									<div class="flex_1" v-if="item?.hps?.[0]?.hl.length > 0 && item?.hps?.[0]?.hl?.[0]?.ol?.[1]?.ov && item?.hps?.[0]?.hl?.[0]?.ol?.[1]?.os === 1">
										<div>{{ i18n_t('bet.away_win') }}</div>
										<div class="red">{{ get_odd_os(item?.hps?.[0].hl?.[0].ol?.[1]?.ov) }}</div>
									</div>
									<div class="flex_1" v-else>
										<img class="lock" :src="odd_lock_ouzhou" alt="lock">
									</div>
								</div>
							</div>
						</li>
					</div>
				</div>
			</ul>
		</div>
		</div>
		<!-- 搜索 无结果 -->
		<div class="content not-data" v-show="(!(search_data?.teamH5 && search_data.teamH5?.length > 0) &&
			!(search_data?.league && search_data.league?.length > 0) &&
			(!show_hot || 
			!show_history))"
		>
			<!-- 球类 tabs -->
			<div class="middle_info_tab top_tab" ref="tab_growp">
				<div v-for="(item, index) in sport_kind_data" :key="item.id" @click="get_search_data(index, item.id)"
					:class="['tab', tabIndex === index ? 'active' : '']">
					{{ item.sportName }}
					<span class="round"></span>
				</div>
			</div>
			<div class="not_found">
				<no-data :code="400"></no-data>
			</div>
		</div>
	</div>
</template>
<script setup>
import lodash from 'lodash'
import { onMounted, ref, watch, onUnmounted } from 'vue';
import { UserCtr, compute_local_project_file_path, utils, compute_img_url, SearchData, MenuData } from "src/core/";
import { format_date_overseas } from "src/core/format/module/format-date.js";
import { get_server_file_path } from "src/core/file-path/file-path.js";
import router from "../../router";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt";
import { get_delete_history_search, get_history_search, get_search_result, get_search_sport } from "src/api/module/search/index.js";
import { api_search } from 'src/api/';
import { compute_value_by_cur_odd_type } from "src/core/index.js";
import { api_common, api_match_list } from "src/api/index.js";
import { odd_lock_ouzhou } from 'src/base-h5/core/utils/local-image.js'
import NoData from './components/no-data.vue'// 无数据组件
const { get_insert_history, get_fetch_hot_search } = api_search || {};

const input_value = ref('');
const tabIndex = ref(0);
const tab_growp = ref(null);
const show_history = ref(true);
const show_hot = ref(true);
const uid = UserCtr.get_uid();

// 展开/收起 bowling 滚球 league 联赛 team 队伍
const expand_bowling = ref(true);
const expand_league = ref(true);
const expand_team = ref(true)

//定时器
let go_detail_or_result_timer;

const clear_value = () => {
	input_value.value = '';
	get_history()
	get_hot_search()
}
const to_home = () => {
	router.push('/')
}

/**
 * @Description:获取搜索历史数据
 */
const history_data = ref([]);
const get_history = () => {
	let params = {
		cuid: uid,
		// cuid: '509823602117100010',
		isPc: 0
	}
	get_history_search(params).then(res => {
		let data = lodash.get(res, "data") || [];
		history_data.value = data;
		if (data.length > 0) {
			show_history.value = true;
		}
	});
}

const get_search_txt = SearchData.search_txt;
const get_menu_type = MenuData.menu_type;
//  文字特殊处理，颜色操作
const red_color = (item) => {
	const reg = new RegExp(input_value.value, "ig");
	let i_color = 'red';
	return item?.replace(reg, `<span style="color:${i_color}">${input_value.value}</span>`)
}

/**
 * @description 搜索
 * pramas
 * index: tab 下标
 * sport_id: 球类id
 * keyword搜索的关键字
 */
const search_data = ref([]);
let sport_kind_id = null;
const get_search_data = lodash.debounce((index = 0, sport_id = 1, keyword) => {
	expand_bowling.value = true;
	expand_league.value = true;
	expand_team.value = true
	// console.log('111');
	show_history.value = false;
	show_hot.value = false;
	tabIndex.value = index;
	sport_kind_id = sport_id;
	// tab 默认居中及移动动画
	utils.tab_move2(index, tab_growp.value);
	if (keyword) {
		input_value.value = keyword
	}
	if (!input_value.value) {
		show_history.value = true;
		show_hot.value = true;
		search_data.value = [];
		return;
	}
	let params = {
		cuid: uid,
		device: 'v2_h5_st',
		keyword: input_value.value,
		searchSportType: sport_id || 1,
		isPc: false
	}
	get_search_result(params).then(res => {
		if (res.code === '200') {
			search_data.value = res.data.data;
			// 插入搜索历史
			get_insert_history({keyword})
			// 搜索前清空会话仓库数据
			sessionStorage.removeItem('search_txt');
			get_match_base_hps_by_mids()
		}
	}).catch((e) => {
		console.log(e);
	});
}, 500)

//监听输入框内容改变，并搜索
watch(
	() => input_value.value,
	(val) => {
		let trimVal = val.trim();
		get_search_data(0, 1, trimVal);
	}
)

// 获取球赛的种类
const sport_kind_data = ref([]);
const get_sport_kind = () => {
	get_search_sport().then(res => {
		let data = lodash.get(res, "data") || [];
		if (data.length > 0) {
			sport_kind_data.value = data.slice(0, 3)
		}
	});
}

// 图标出错时
function league_icon_error($event) {
	$event.target.src = compute_img_url('match-cup')
	$event.target.onerror = null
}

// 联赛 和 队名 默认跳转方法,去到详情页
function default_method_jump(name, item) {
	if (!item) return;

	/*
	if (item.mid) {
		set_goto_detail_matchid(item.mid);
	} else {
		set_goto_detail_matchid(item.matchList[0].mid);
	}
	*/

	// 手机键盘收起动画完成后才跳转
	clearTimeout(go_detail_or_result_timer)
	go_detail_or_result_timer = setTimeout(() => {
		//set_details_item(0);
		SearchData.set_search_term(get_search_txt)
		go_detail_or_reslut(item)
		useMittEmit(MITT_TYPES.EMIT_CHANGE_SELECT_DIALOG, false)
	}, 200)
}

// 滚球跳转
function suggestion_bowling_click(item) {
	let item_name;

	if (item.type == 'tour') {
		item_name = item.tn
	} else {
		item_name = item.name
	}

	// 手机键盘收起动画完成后才跳转
	clearTimeout(go_detail_or_result_timer)
	go_detail_or_result_timer = setTimeout(() => {
		//set_goto_detail_matchid(item.mid);
		//set_details_item(0);
		SearchData.set_search_term(get_search_txt)
		go_detail_or_reslut(item)
		useMittEmit(MITT_TYPES.EMIT_CHANGE_SELECT_DIALOG, false)
	}, 200)
}

// 跳转到 详情页 或者 赛果页面
function go_detail_or_reslut(item) {
	sessionStorage.setItem('search_txt', input_value.value);
	const query = get_search_txt ? { search_term: get_search_txt } : {}
	if (get_menu_type.value == 28) {
		router.push({
			name: 'match_result',
			params: {
				mid: item.mid ? item.mid : item.matchList[0].mid,
			},
			query
		})
	} else {
		router.push({
			name: 'category',
			params: { 
				mid: item.mid,
				tid: item.tid,
				csid: item.csid,
				mcid: item.mcid,
			},
			query
		})
	}
}

const hot_list = ref([]);  //热门搜索列表
// 获取热门搜索
function get_hot_search() {
	get_fetch_hot_search().then(({ data }) => {
		hot_list.value = data || [];
	})
}

/**
 * @description 获取赛事赔率
 */
let match_mid_Arr = [];
const get_match_base_hps_by_mids = async () => {
	if (!(search_data.value?.teamH5 && search_data.value?.teamH5.length > 0) &&
			!(search_data.value?.league && search_data.value?.league.length > 0) && 
			!(search_data.value?.bowling && search_data.value?.bowling.length > 0) 
			) return;
	// 拿到所有滚球，联赛，队伍 mid
	search_data.value?.teamH5.forEach((item, index) => {
		match_mid_Arr.push(item.mid)
	})
	search_data.value?.league.forEach((item, index) => {
		item.matchList.forEach((i, idx) => {
			match_mid_Arr.push(i.mid)
		})
	})
	search_data.value?.bowling.forEach((item, index) => {
		match_mid_Arr.push(item.mid)
	})
	if (match_mid_Arr.length < 1) return;
	// match_mid_Arr 数组去重
	match_mid_Arr = Array.from(new Set(match_mid_Arr))
	const match_mids = match_mid_Arr.join(',')
	// 竞足409 不需要euid
	const params = {
		mids: match_mids,
		cuid: uid,
		sort: 1,
		device: ['', 'v2_h5', 'v2_h5_st'][UserCtr.standard_edition],
	};
	// 获取所有搜索结果的赔率信息
	await api_common.get_match_base_info_by_mids(params).then((res) => {
		if(res.code === '200') {
			const { data } = res;
			// 使用获得比分的 mid 和搜索结果的 mid 做比较，将赔率信息返回给搜索结果
			for(let i = 0; i < data.length; i++) {
				for(let j = 0; j < search_data.value.teamH5.length; j++) {
					if(data[i].mid === search_data.value.teamH5[j].mid) {
						search_data.value.teamH5[j] = data[i]
					}
				}
				for(let k = 0; k < search_data.value.league.length; k++) {
					search_data.value.league[k].matchList.forEach((item, index) => {
						if(data[i].mid === item.mid) {
							search_data.value.league[k].matchList[index] = data[i]
						}
					})
				}
				for(let l = 0; l < search_data.value.bowling.length; l++) {
					if(data[i].mid === search_data.value.bowling[l].mid) {
						search_data.value.bowling[l] = data[i]
					}
				}
			}
		}
	})
}

// 显示的赔率
const get_odd_os = (ov) => {
  return  compute_value_by_cur_odd_type(ov,'','',sport_kind_id)
}

// 删除单个历史
const _delete_history_search = (keyword) => {
	get_delete_history_search({
		keyword,
		cuid: uid
	}).then(() => {
		get_history()
	})
}

onMounted(() => {
	get_hot_search();
	get_history();
	get_sport_kind();
	// 从详情返回时原搜索结果会丢失
	// 所以需要从会话仓库拿到搜索字段，重新搜索
	if(sessionStorage.getItem('search_txt')) {
		const search_txt = sessionStorage.getItem('search_txt')
		input_value.value = search_txt
	}
})

onUnmounted(() => {
	clearTimeout(go_detail_or_result_timer)
	go_detail_or_result_timer = null
	input_value.value = ''
})
</script>
<style lang="scss" scoped>
.search-container {
	background-color: #E2E2E2;
	height: inherit;
	overflow: hidden;
}

.top_info_search {
	position: fixed;
	z-index: 1;
	padding-left: 20px;
	height: 50px;
	line-height: 50px;
	width: 100%;
	-background-color: var(--q-gb-bg-c-1);
	background: url('/src/base-h5/components/top-menu/top-menu-ouzhou-1/img/top_bg.png') no-repeat;

	img {
		position: absolute;
		left: 35px;
		top: 20px;
		width: 12px;
		height: 12px;
	}

	input {
		border: none;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.2);
		width: 85%;
		height: 30px;
		box-shadow: 0 0 0 .5px #ffffff;
		padding-left: 30px;
		outline: none;
		//color: #fff;
		color: var(--q-gb-t-c-2);
		margin-right: 16px;
		font-weight: 500;
	}

	::-webkit-input-placeholder {
		//color: #ffffff;
		color: var(--q-gb-t-c-2);
		font-size: 14px;
		padding-left: 5px;
	}

	.clear_value {
		position: absolute;
		top: 20px;
		//color: #fff;
		color: var(--q-gb-t-c-2);
		font-size: 12px;
		left: 80%;
	}

	.close_btn {
		//color: #fff;
		color: var(--q-gb-t-c-2);
		opacity: .8;
		font-size: 12px;
	}
}

.content {
	color: var(--q-gb-t-c-4);
	padding-top: 50px;
}
.content.not-data {
	background-color: var(--q-gb-bg-c-2);
}

.middle_info_tab {
	padding: 9px 18px;
	display: flex;
	border-bottom: 1px solid var(--q-gb-bg-c-1);
	background-color: var(--q-gb-bg-c-2);
	font-size: 14px;
	font-weight: 500;
	overflow-x: scroll;
	position: fixed;
	width: 100%;
	z-index: 1;
	color: var(--q-gb-t-c-4);
	&.top_tab{
		border-bottom: 10px solid #E2E2E2;
	}
	.tab {
		background-color: var(--q-gb-bg-c-2);
		border-radius: 40px;
		text-align: center;
		font-size: 12px;
		flex-shrink: 0;
		padding: 3px 10px;
		position: relative;
		// &:first-child {
		// 	padding-left: 0;
		// }

		&:last-child {
			margin-right: 0;
		}
		.round {
			position: absolute;
			width: 0;
			height: 8px;
			bottom: -14px;
			border-radius: 50%;
			//background: linear-gradient(180deg, #FF7000 0%, #FF9440 50%);
			background: var(--q-gb-bg-lg-8);
			left: 50%;
			margin-left: -4px;
		}

		// &.active {
		// 	background-color: var(--q-gb-bg-c-1);
		// 	color: var(--q-gb-t-c-2);
		// }
		&.active {
			.round {
				width: 8px;
			}
			color: var(--q-gb-t-c-1);
		}

	}

	&.diff {
	  	padding: 11px 0 11px 20px;
		position: unset;
		margin-top: 8px;
	}		
	.color {
		//color: #FF7000;
		color: var(--q-gb-t-c-1);
	}
}

li {
	padding: 7px 10px;
	background-color: var(--q-gb-bg-c-2);
	// border-radius: 6px;
	font-size: 14px;

	.list_top {
		margin-bottom: 19px;
		font-size: 14px;
		font-weight: 500;

		img {
			margin-left: 5px;
		}
	}

	.list_bottom {
		display: flex;
		margin-bottom: 16px;

		div p:first-child {
			font-size: 14px;
			margin-right: 10px;
		}

		div p:last-child {
			color: var(--q-gb-t-c-3);
		}

		.middle {
			color: red;
			margin: 0 5px;
		}
		.lock {
			width: 16px;
			height: 16px;
		}
		.center {
			margin-left: 8px;
		}
		.red {
			//color: #FF7000;
			color: var(--q-gb-t-c-1);
		}
	}
	.list_bottom:last-child {
		margin-bottom: 0;
	}
}

.list1 {
	margin-top: 50px;

	li {
		margin-bottom: 0;
		padding: 12px 10px;
	}

	.del {
		width: 100%;
		background-color: #fff; 
		text-align: center;
		color: #8A8986;
		font-size: 12px;
	}

	img {
		margin-left: 10px;
	}
	.text {
		border-color: var(--q-gb-bd-c-1);
		padding-left: 10px;
	}
}

.list {
	overflow-y: scroll;
	padding-top: 40px;
	.title {
		height: 36px;
		line-height: 36px;
		padding-left: 20px;
		font-weight: 500;
		font-size: 14px;
		margin-bottom: -8px;
	}
}

.teams {
	.middle_info_tab {
		font-size: 12px;
		font-weight: 600;
		//color: #FF7000;
		color: var(--q-gb-t-c-1);
		&.top_tab{
		border-bottom: 10px solid #E2E2E2;
	}
	}
}

.not_found {
	height: calc(100% - 90px);
	text-align: center;
	padding: 2rem 0 1rem;

	p {
		font-size: 16px;
		font-weight: 500;
	}
}

.searchHot {
	min-height: 1.83rem;
	// margin: 0 auto 0.18rem;
	font-size: 0.14rem;
	background-color: var(--q-gb-bg-c-2);
	position: relative;


	.text-bol {
		margin-top: .1rem;
		font-size: 0.14rem;
		height: 0.44rem;
		line-height: 0.44rem;
		border-bottom: 1px solid var(--q-gb-bd-c-1);
		text-indent: 0.18rem;
		font-weight: 500;
	}

	.hotItem {
		height: 0.44rem;
		line-height: 0.44rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.12rem;
		padding: 0;
		border-bottom: 1px solid var(--q-gb-bd-c-1);
		text-indent: 0.15rem;

		.defaultText {
			letter-spacing: 0;
			font-size: 0.14rem;

			// &.normal-1 {
			// 	font-weight: bold;
			// }
		}

		// .redText {
		// 	font-weight: bold;
		// }

		.q-ml-sm {
			font-size: 0.14rem;

			// &.keyWordText {
			// 	font-weight: bold;
			// }
		}
	}
	.hotItem:last-child {
		border-radius: 0px 0px 6px 6px;
	}
}
.flex_1 {
	flex: 1;
}
.mt50 {
	margin-top: 50px;
}
</style>
  
  