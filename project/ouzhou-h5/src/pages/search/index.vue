<template>
	<div class="page search-index search-container">
		<!-- 头部搜索 -->
		<div class="top_info_search">
			<input ref="input_ref" type="search" maxlength="15" :placeholder="`${i18n_t('search.search_title')}`"
				v-model="input_value" @input="get_search_data(store.tabIndex, sport_kind_data[store.tabIndex]?.id, input_value)" />
			<img :src="compute_local_project_file_path('image/home/top_seach.png')" alt="" />
			<img :src="compute_local_project_file_path('image/svg/bet_close3.svg')" alt="" class="clear_value"
				@click.stop.prevent.self="clear_value" v-show="input_value.length > 0" />
			<span class="close_btn" @click="go_back">{{ i18n_t('ouzhou.search.close') }}</span>
		</div>
		<!-- 搜索 历史 -->
		<div class="content" v-if="(show_history && history_data && is_empty_data) || !input_value">
			<!-- <div class="middle_info_tab">EXAMPLE SEARCHES</div> -->
			<!-- 球类 tabs -->
			<div class="middle_info_tab top_tab" ref="tab_growp" v-if="sport_kind_data.length">
				<div v-for="(item, index) in sport_kind_data" :key="item.id" @click="get_search_data(index, item.id)"
					:class="['tab', store.tabIndex === index ? 'active' : '']">
					{{ item.sportName }}
					<span class="round"></span>
				</div>
			</div>
			<ul class="list1" v-if="history_data && history_data.length > 0">
				<div class="middle_info_tab diff text">
					<div>{{ i18n_t('ouzhou.search.search_history') }}</div>
				</div>
				<li class="list-item" v-for="(item, index) in history_data" :key="item.cuid">
					<span class="inner-text" @click="get_search_data(store.tabIndex, sport_kind_data[store.tabIndex]?.id, item.keyword)">
						{{item.keyword }}
					</span>
					<img class="inner-delete" :src="compute_local_project_file_path('/image/svg/close10.svg')" alt=""
						@click="_delete_history_search(item.keyword)" />
				</li>
				<li class="del" @click="_delete_history_search('')">{{ i18n_t('ouzhou.search.clear_search_history') }}</li>
			</ul>
 
			<!-- 热门搜索 -->
			<div class='searchHot' v-if="hot_list && hot_list.length > 0">
				<div>
					<div class="text-bol" :class="[(history_data.length > 0) ? '' : 'mt0']">{{ i18n_t('ouzhou.search.search_hot') }}</div>
					<!-- 热门内容 -->
					<ul>
						<li class="hotItem" v-for="(item, index) in hot_list" :key="index"
							@click="get_search_data(store.tabIndex, sport_kind_data[store.tabIndex]?.id, item.keyWord)">
							{{ index + 1 }}.{{ item.keyWord }}
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 搜索展示 -->
		<div v-if="search_loading" class="loading search_loading"><img :src="compute_local_project_file_path('/image/gif/loading_ou.gif')" alt=""></div>
		<div style="height: 100%; overflow-y: auto;" v-if="(search_data?.bowling && search_data?.bowling.length > 0) ||
			(search_data?.teamH5 && search_data?.teamH5.length > 0) ||
			(search_data?.league && search_data?.league.length > 0)">
			<div class="content">
				<!-- 球类 tabs -->
				<div class="middle_info_tab top_tab" ref="tab_growp" v-if="sport_kind_data.length">
					<div v-for="(item, index) in sport_kind_data" :key="item.id" @click="get_search_data(index, item.id)"
						:class="['tab', store.tabIndex === index ? 'active' : '']">
						{{ item.sportName }}
						<span class="round"></span>
					</div>
				</div>
				<template v-if="is_results">
					<div class="match-results-list" >
						<match-container/>
					</div>
				</template>
				<template v-else>
					<ul class="list">
						<div class="title" @click="to_all_matchs">{{ i18n_t('ouzhou.search.view_all_match') }}</div>
						<!-- 滚球 -->
						<div v-if="search_data?.bowling && search_data?.bowling.length > 0">
							<div class="middle_info_tab diff" @click="expand_bowling = !expand_bowling">
								<div class="color">{{ i18n_t('ouzhou.search.underway') }}</div>
							</div>
							<div v-if="expand_bowling">
								<li v-for="(item, index) in show_bowling_list" :key="index">
									<div class="list_top">
										<span v-html="red_color(item.tn)"></span><img
											:src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
									</div>
									<div class="list_bottom" v-for="(i, idx) in item.children" @click="suggestion_bowling_click(i, idx)">
										<div style="width: 52%; word-break: break-all">
											<p>
												<span class="home" v-html="red_color(i.mhn)"></span>
												<span class="middle">v</span>
												<span class="away" v-html="red_color(i.man)"></span>
											</p>
											<p>{{ formatTime(i.mgt, 'mm/dd hh:MM') }}</p>
										</div>
										<div style="display: flex;flex-direction: row; flex: 1">
											<div class="flex_1 1"
												v-if="lodash.get(i, 'hps[0].hl.length', 0) > 0 && lodash.get(i, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(i, 'hps[0].hl[0].ol[1].os', '') === 1">
												<div>{{ sports_id.includes(i.csid) ? lodash.get(i, 'hps[0].hl[0].ol[0].ot') === '1' ? i18n_t('ouzhou.bet_col.bet_col_1.bet_col_1') : i18n_t('ouzhou.bet_col.bet_col_1.bet_col_2') : lodash.get(i, 'hps[0].hl[0].ol[0].on', '') }}</div>
												<div class="red">{{ get_odd_os(lodash.get(i, 'hps[0].hl[0].ol[0]')) }}</div>
											</div>
											<div class="flex_1 2" v-else>
												<img class="lock" :src="odd_lock_ouzhou" alt="lock">
											</div>
											<template v-if="!sports_id.includes(i.csid) && get_odd_os(lodash.get(i, 'hps[0].hl[0].ol[2]', '')) != 0">
												<div class="flex_1"
													v-if="lodash.get(i, 'hps[0].hl.length', 0) > 0 && lodash.get(i, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(i, 'hps[0].hl[0].ol[1].os', '') === 1">
													<div>{{ i18n_t('ouzhou.search.dogfall') }}</div>
													<div class="red">{{ get_odd_os(lodash.get(i, 'hps[0].hl[0].ol[2]', '')) }}</div>
												</div>
												<div class="flex_1" v-else>
													<img class="lock" :src="odd_lock_ouzhou" alt="lock">
												</div>
											</template>
											<div class="flex_1 3"
												v-if="lodash.get(i, 'hps[0].hl.length', 0) > 0 && lodash.get(i, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(i, 'hps[0].hl[0].ol[1].os', '') === 1">
												<div>{{ sports_id.includes(i.csid) ? lodash.get(i, 'hps[0].hl[0].ol[1].ot', '') === '1' ? i18n_t('ouzhou.bet_col.bet_col_1.bet_col_1') : i18n_t('ouzhou.bet_col.bet_col_1.bet_col_2') : lodash.get(i, 'hps[0].hl[0].ol[1].on', '') }}</div>
												<div class="red">{{ get_odd_os(lodash.get(i, 'hps[0].hl[0].ol[1]', '')) }}</div>
											</div>
											<div class="flex_1 4" v-else>
												<img class="lock" :src="odd_lock_ouzhou" alt="lock">
											</div>
										</div>
									</div>
								</li>
							</div>
						</div>
						<!-- 搜索 联赛 -->
						<div v-if="search_data?.league && search_data?.league.length > 0">
							<div class="middle_info_tab diff" @click="expand_league = !expand_league">
								<div class="color">{{ i18n_t('ouzhou.search.league') }}</div>
							</div>
							<div v-if="expand_league">
								<li v-for="(item, index) in search_data?.league" :key="index">
									<div class="list_top">
										<!-- 联赛icon -->
										<!-- <img class="match_logo"
										:src="item.matchList[0] ? get_server_file_path(item.matchList[0].lurl) : compute_img_url('match-cup')"
										@error="league_icon_error" /> -->
										<span v-html="red_color(item.leagueName)"></span><img
											:src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
									</div>
									<div class="list_bottom" v-for="(i, idx) in item.matchList" @click="go_detail_or_reslut(item.matchList[idx], idx)">
										<div style="width: 52%; word-break: break-all">
											<p>
												<span class="home" v-html="red_color(i.mhn)"></span>
												<span class="middle">v</span>
												<span class="away" v-html="red_color(i.man)"></span>
											</p>
											<p>{{ formatTime(i.mgt, 'mm/dd hh:MM') }}</p>
										</div>
										<div style="display: flex;flex-direction: row; flex: 1">
											<div class="flex_1"
												v-if="lodash.get(i, 'hps[0].hl.length', 0) > 0 && lodash.get(i, 'hps[0].hl[0].ol[0].ov', '') && lodash.get(i, 'hps[0].hl[0].ol[0].os', '') === 1">
												<div v-show="sports_id.includes(i.csid)">
												{{lodash.get(i, 'hps[0].hl[0].ol[0].ot', '') === '1' ? i18n_t('ouzhou.bet_col.bet_col_1.bet_col_1') : i18n_t('ouzhou.bet_col.bet_col_1.bet_col_2') }}
												</div>
												<div v-show="!sports_id.includes(i.csid)">
												{{lodash.get(i, 'hps[0].hl[0].ol[0].on', '') }}
												</div>
												
												<div class="red">{{ get_odd_os(lodash.get(i, 'hps[0].hl[0].ol[0]', '')) }}</div>
											</div>
											<div class="flex_1" v-else>
												<img class="lock" :src="odd_lock_ouzhou" alt="lock">
											</div>
											<template v-if="!sports_id.includes(i.csid) && get_odd_os(lodash.get(i, 'hps[0].hl[0].ol[2]', '')) != 0">
												<div class="flex_1"
													v-if="lodash.get(i, 'hps[0].hl.length', '') > 0 && lodash.get(i, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(i, 'hps[0].hl[0].ol[1].os', '') === 1">
													<div>{{ i18n_t('ouzhou.search.dogfall') }}</div>
													<div class="red">{{ get_odd_os(lodash.get(i, 'hps[0].hl[0].ol[2]', '')) }}</div>
												</div>
												<div class="flex_1" v-else>
													<img class="lock" :src="odd_lock_ouzhou" alt="lock">
												</div>
											</template>
											<div class="flex_1"
												v-if="lodash.get(i, 'hps[0].hl.length', 0) > 0 && lodash.get(i, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(i, 'hps[0].hl[0].ol[1].os', '') === 1">
												<div v-show="sports_id.includes(i.csid)">
												  {{lodash.get(i, 'hps[0].hl[0].ol[1].ot', '') === '1' ? i18n_t('ouzhou.bet_col.bet_col_1.bet_col_1') : i18n_t('ouzhou.bet_col.bet_col_1.bet_col_2')}}
												</div>
												<div v-show="!sports_id.includes(i.csid)">
												  {{lodash.get(i, 'hps[0].hl[0].ol[1].on', '')}}
												</div>
												<div class="red">{{ get_odd_os(lodash.get(i, 'hps[0].hl[0].ol[1]', '')) }}</div>
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
						<div v-if="search_data?.teamH5 && search_data.teamH5?.length > 0">
							<div class="middle_info_tab diff" @click="expand_team = !expand_team">
								<div class="color">{{ i18n_t('ouzhou.search.team') }}</div>
							</div>
							<div v-if="expand_team">
								<li v-for="(item, index) in search_data?.teamH5" :key="index">
									<div v-if="item.tn">
										<div class="list_top">
											<span v-html="red_color(item.tn)"></span><img
												:src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
										</div>
									</div>
									<div class="list_bottom" @click="go_detail_or_reslut(item, index)">
										<div style="width:52%; word-break: break-all">
											<p>
												<span class="home" v-html="red_color(item.mhn)"></span>
												<span class="middle">v</span>
												<span class="away" v-html="red_color(item.man)"></span>
											</p>
											<p>{{ formatTime(item.mgt, 'mm/dd hh:MM') }}</p>
										</div>
										<div style="display: flex;flex-direction: row; flex: 1">
											<div class="flex_1"
												v-if="lodash.get(item, 'hps[0].hl.length', 0) > 0 && lodash.get(item, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(item, 'hps[0].hl[0].ol[1].os', '') === 1">
												<div v-show="sports_id.includes(item.csid)">
												 {{lodash.get(item, 'hps[0].hl[0].ol[0].ot', '') === '1' ? i18n_t('ouzhou.bet_col.bet_col_1.bet_col_1') : i18n_t('ouzhou.bet_col.bet_col_1.bet_col_2')}}
												</div>
												<div v-show="!sports_id.includes(item.csid)">
												 {{lodash.get(item, 'hps[0].hl[0].ol[0].on', '') }}
												</div>
												<div class="red">{{ get_odd_os(lodash.get(item, 'hps[0].hl[0].ol[0]', '')) }}</div>
											</div>
											<div class="flex_1" v-else>
												<img class="lock" :src="odd_lock_ouzhou" alt="lock">
											</div>
											<template v-if="!sports_id.includes(item.csid) && get_odd_os(lodash.get(item, 'hps[0].hl[0].ol[2]', '')) != 0">
												<div class="flex_1"
													v-if="lodash.get(item, 'hps[0].hl.length', 0) > 0 && lodash.get(item, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(item, 'hps[0].hl[0].ol[1].os', '') === 1">
													<div>{{ i18n_t('ouzhou.search.dogfall') }}</div>
													<div class="red">{{ get_odd_os(lodash.get(item, 'hps[0].hl[0].ol[2]', '')) }}</div>
												</div>
												<div class="flex_1" v-else>
													<img class="lock" :src="odd_lock_ouzhou" alt="lock">
												</div>
											</template>
											<div class="flex_1"
												v-if="lodash.get(item, 'hps[0].hl.length', 0) > 0 && lodash.get(item, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(item, 'hps[0].hl[0].ol[1].os', '') === 1">
												<div v-show="sports_id.includes(item.csid)">
												  {{lodash.get(item, 'hps[0].hl[0].ol[1].ot', '') === '1' ? i18n_t('ouzhou.bet_col.bet_col_1.bet_col_1') : i18n_t('ouzhou.bet_col.bet_col_1.bet_col_2')}}
												</div>
												<div v-show="!sports_id.includes(item.csid)">
												  {{lodash.get(item, 'hps[0].hl[0].ol[1].on', '')}}
												</div>
												
												<div class="red">{{ get_odd_os(lodash.get(item, 'hps[0].hl[0].ol[1]', '')) }}</div>
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
				</template>
			</div>
		</div>
		<!-- 搜索 无结果 -->
		<div class="content not-data" v-if="(is_empty_data &&
			(!show_hot || !show_history) &&
			!search_loading)">
			<!-- 球类 tabs -->
			<div class="middle_info_tab top_tab" ref="tab_growp" v-if="sport_kind_data.length">
				<div v-for="(item, index) in sport_kind_data" :key="item.id" @click="get_search_data(index, item.id)"
					:class="['tab', store.tabIndex === index ? 'active' : '']">
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
import { onMounted, ref, watch, computed, onUnmounted, reactive, nextTick } from 'vue';
import { compute_local_project_file_path,  compute_img_url, SearchData, MenuData, compute_value_by_cur_odd_type } from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
import router from "../../router";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt";
import { get_delete_history_search, get_history_search, get_search_result, get_search_sport } from "src/api/module/search/index.js";
import { api_search } from 'src/api/';
import tabMove from 'src/core/tab-move/tab-move.js'
import { api_common, api_match_list } from "src/api/index.js";
import { odd_lock_ouzhou } from 'src/base-h5/core/utils/local-image.js'
import NoData from './components/no-data.vue'// 无数据组件
import { store } from "./index.js"
const { insert_history, get_fetch_hot_search } = api_search || {};
import { is_results } from 'src/base-h5/mixin/menu.js'
import matchContainer from "src/base-h5/components/match-list/index.vue";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import { formatTime } from 'src/output/index.js';
import BaseData from "src/core/base-data/base-data.js";

const input_ref = ref(null)
const input_value = ref('');
const tab_growp = ref(null);
const show_history = ref(true);
const show_hot = ref(true);
const uid = UserCtr.get_uid();

// 展开/收起 bowling 滚球 league 联赛 team 队伍
const expand_bowling = ref(true);
const expand_league = ref(true);
const expand_team = ref(true)

// 不展示平局的球种csid
const sports_id = ['2', '5'];

//定时器
let go_detail_or_result_timer;

const clear_value = () => {
	input_value.value = '';
	get_hot_search()
	get_history()
}
/**
 * 关闭清除tab
 */
const go_back = () => {
	router.go(-1)
	store.tabIndex = 0;
}
/**
 * 查看所有赛事 测试同步不做跳转
 */
const to_all_matchs = () => {
	// router.push({name: 'matchList'})
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
	let i_color = '#FF7000';
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
const sport_kind_id = ref(1);
let search_loading = false
const get_search_data = lodash.debounce((index = 0, sport_id = 1, keyword) => {
	expand_bowling.value = true;
	expand_league.value = true;
	expand_team.value = true
	show_history.value = false;
	show_hot.value = false;
	store.tabIndex = index
	// tabIndex.value = index;
	sport_kind_id.value = sport_id;
	// tab 默认居中及移动动画
	tabMove.tab_move2(index, tab_growp.value);
	// 如果是电竞需要设置menu_type==2000 match-stage组件走电竞详情组件
		if (sport_id == 100) {
			MenuData.set_menu_type(2000)
	}
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
	if (is_results.value) params.from = 2
	search_loading = true
	get_search_result(params).then(res => {
		if (res.code === '200') {
			search_data.value = res.data.data;
			search_loading = false
			// 插入搜索历史
			insert_history({ keyword })
			// 搜索前清空会话仓库数据
			sessionStorage.removeItem('search_params');
			if (is_results.value) {
				MatchMeta.clear_match_info()
				render_match_results_list(res)
				return
			}
			get_match_base_hps_by_mids()
		}
	}).catch((e) => {
		search_loading = false
		console.log(e);
	});
}, 500)


// 判断数据为空
const is_empty_data = () => {
	if(!(search_data?.teamH5 && search_data?.teamH5.length > 0) &&
	!(search_data?.bowling && search_data?.bowling.length > 0) &&
	!(search_data.league && search_data.league.length > 0)) return true
}

const render_match_results_list = (res) => {
	// MatchMeta.match_mids = []
	if (+res.code !== 200) return MatchMeta.set_page_match_empty_status({ state: true, type: res.code == '0401038' ? 'noWifi' : 'noMatch' });
    // 避免接口慢导致的数据错乱
    const teamH5 = lodash.get(res.data.data, 'teamH5', [])
    const league = lodash.get(res.data.data, 'league', [])
    const team = lodash.get(res.data.data, 'team', [])
    const bowling = lodash.get(res.data.data, 'bowling', [])

	const merge = league.map(item => item.matchList).concat(team.map(item => item.matchList))
	const results = [].concat(...merge, teamH5, bowling)
    const length = lodash.get(results, 'length', 0)
    if (length < 1) return MatchMeta.set_page_match_empty_status({ state: true });
    MatchMeta.handler_match_list_data({ list: results, type: 1 })
}


// 进行中同联赛下的赛事放在一起
const show_bowling_list = computed(() => {
	const obj = {}
	const bowling = search_data.value?.bowling || []
	bowling.forEach(item => {
		const {csid, tn } = item;
		if(!obj[tn]) {
			obj[tn] = {
				tn,
				csid,
				children: [item]
			}
		} else {
			obj[tn].children.push(item)
		}
	})
	return obj;
});

// 获取球赛的种类
const sport_kind_data = ref([]);
const get_sport_kind = () => {
	get_search_sport().then(res => {
		let data = lodash.get(res, "data") || [];
		if (data.length > 0) {
			// sport_kind_data.value = data.filter(item => MenuData.menu_list.map((item)=>{return +item.mi}).includes(+item.id + 100))
			//放开限制球种 电子竞技100
			sport_kind_data.value = data;
			// .filter(n => {
			// 	MenuData.menu_list.map((item)=>{return +item.mi}).includes(+n.id + 100)
			// })
		}
	});
}

// 图标出错时
function league_icon_error($event) {
	$event.target.src = compute_img_url('match-cup')
	$event.target.onerror = null
}

function resultsJumpDetailHandle(item) {
	sessionStorage.setItem('search_params', JSON.stringify({
		keyword: input_value.value,
		csid: item.csid
	}));
}

// 滚球跳转
function suggestion_bowling_click(item, index) {
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
		go_detail_or_reslut(item, index)
		useMittEmit(MITT_TYPES.EMIT_CHANGE_SELECT_DIALOG, false)
	}, 200)
}

/**
 * @Description:点击滚球搜索
 * @param {string} league 点击联赛标题
 * @return {undefined} undefined
 */

// 跳转到 详情页 或者 赛果页面
function go_detail_or_reslut(item, index) {
	sessionStorage.setItem('search_params', JSON.stringify({
		keyword: input_value.value,
		csid: item.csid
	}));
	//>=100 电竞
	if(+item.csid >= 100){
		MenuData.set_current_lv1_menu(2000)
		MenuData.set_menu_mi(`2${item.csid}`)
	}else{
		MenuData.set_current_lv1_menu(1)
		MenuData.set_menu_mi(+item.csid+100)
	}
	const query = get_search_txt ? { search_term: get_search_txt } : {}
	if (get_menu_type.value == 28) {
		router.push({
			name: 'match_result',
			params: {
				mid: item.mid ? item.mid : item.matchList[index].mid,
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
const get_hot_search = () => {
	get_fetch_hot_search().then((res) => {
		let data = lodash.get(res, "data") || [];
		hot_list.value = data;
		if (data.length > 0) {
			show_hot.value = true;
		}
	})
}

/**
 * @description 获取赛事赔率
 */
let match_mid_Arr = [];
const get_match_base_hps_by_mids = async () => {
	if (!is_empty_data()) return;
	// 拿到所有滚球，联赛，队伍 mid
	match_mid_Arr = []
	if (search_data.value) {
	// if (search_data.value.length > 0) {
		search_data.value?.teamH5?.forEach((item, index) => {
			match_mid_Arr.push(item.mid)
		})
		search_data.value?.league?.forEach((item, index) => {
			item.matchList.forEach((i, idx) => {
				match_mid_Arr.push(i.mid)
			})
		})
		search_data.value?.bowling?.forEach((item, index) => {
			match_mid_Arr.push(item.mid)
		})
	}
	
	// console.log('match_mid_Arr', match_mid_Arr);
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
	let api_name = null
	//电竞走电竞查询
	if (MenuData.is_esports()) {
     api_name = api_common.get_esports_match_by_mids
    }else { 
		api_name = api_common.get_match_base_info_by_mids
	}
	// 获取所有搜索结果的赔率信息
	await api_name(params).then((res) => {
		if (res.code === '200') {
			const { data } = res;
			// 使用获得比分的 mid 和搜索结果的 mid 做比较，将赔率信息返回给搜索结果
			for (let i = 0; i < data.length; i++) {
				for (let j = 0; j < search_data.value.teamH5.length; j++) {
					if (data[i].mid === search_data.value.teamH5[j].mid) {
						search_data.value.teamH5[j] = data[i]
					}
				}
				for (let k = 0; k < search_data.value.league.length; k++) {
					search_data.value.league[k].matchList.forEach((item, index) => {
						if (data[i].mid === item.mid) {
							search_data.value.league[k].matchList[index] = data[i]
						}
					})
				}
				for (let l = 0; l < search_data.value.bowling.length; l++) {
					if (data[i].mid === search_data.value.bowling[l].mid) {
						search_data.value.bowling[l] = data[i]
					}
				}
			}
		}
	})
}

// 显示的赔率
const get_odd_os = (ov) => {
	console.error('ov',ov)
	return compute_value_by_cur_odd_type(ov.ov, '', '', sport_kind_id)
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
let mitt_list=[]
onMounted(() => {
	// console.log('fdsfdsafdsaf', input_ref.value.focus())
	if (input_ref.value) input_ref.value.focus()
	get_hot_search();
	get_history();
	get_sport_kind();
	// 从详情返回时原搜索结果会丢失
	// 所以需要从会话仓库拿到搜索字段，重新搜索
	if (sessionStorage.getItem('search_params')) {
		const search_params = JSON.parse(sessionStorage.getItem('search_params'))
		input_value.value = search_params.keyword
		get_search_data(store.tabIndex, search_params.csid, search_params.keyword)
	}
	if (is_results.value) {
		VirtualList.set_is_show_ball(false)
		mitt_list.push(useMittOn(MITT_TYPES.EMIT_GO_TO_DETAIL_HANDLE, resultsJumpDetailHandle).off)
	}
	nextTick(() => {
		// 隐藏loading动画 
		useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD,0);
	})
})

onUnmounted(() => {
	clearTimeout(go_detail_or_result_timer)
	go_detail_or_result_timer = null
	input_value.value = ''
	if (is_results.value) {
		
		VirtualList.set_is_show_ball(true)
		mitt_list.forEach(i=>i())
	}
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
	background-color: var(--q-gb-bg-c-1);

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
	height: 100%;
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
	// position: fixed;
	width: 100%;
	// z-index: 1;
	color: var(--q-gb-t-c-4);

	&.top_tab {
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
		// margin-top: 8px;
	}

	.color {
		//color: #FF7000;
		color: var(--q-gb-t-c-1);
	}
}

li {
	padding: 8px 10px;
	background-color: var(--q-gb-bg-c-2);
	// border-radius: 6px;
	font-size: 14px;
	border-bottom: 1px solid #E2E2E2;

	// border-image: linear-gradient(to bottom,transparent 50%, #E2E2E2 50%) 0 0 100%/1px 0;
	.list_top {
		font-size: 14px;
		font-weight: 500;
		height: 36px;
		line-height: 32px;

		img {
			// margin-left: 5px;
			float: right;
			margin-top: 10px;
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
			// color: red;
			color: var(--q-gb-t-c-1);
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
			font-weight: 600;
		}
	}

	.list_bottom:last-child {
		margin-bottom: 0;
	}
}

.list1 {
	// margin-top: 50px;
	.list-item {
		margin-bottom: 0;
		padding: 12px 10px;
		display: flex;
		.inner-text{
			flex: 1;
			width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.inner-delete{
			padding: 0 10px;
		}
	}
	.del {
		width: 100%;
		background-color: #fff;
		text-align: center;
		color: #8A8986;
		font-size: 12px;
	}


	.text {
		border-color: var(--q-gb-bd-c-1);
		padding-left: 10px;
	}
}

.match-results-list {
	// padding-top: .5rem;
	height: 100%;
	.match-list-container {
		z-index: 0;
		overflow: hidden;
		height: 100%;
    	position: relative;
	}
}

.list {
	overflow-y: scroll;
	// padding-top: 40px;

	.title {
		height: 26px;
		line-height: 16px;
		padding-left: 20px;
		font-weight: 500;
		font-size: 14px;
		// margin-bottom: -8px;
		color: #A1A3A5;
		text-align: center;

	}
}

.teams {
	.middle_info_tab {
		font-size: 12px;
		font-weight: 600;
		//color: #FF7000;
		color: var(--q-gb-t-c-1);

		&.top_tab {
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
		margin-top: 0.09rem;
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
	text-align: center;
}

.mt0{
	margin-top: 0 !important;
}
.search_loading {
	background-color: rgba(255, 255, 255, 1);
	position: unset;
}
</style>
  
