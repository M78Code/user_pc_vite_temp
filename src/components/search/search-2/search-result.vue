<!-- @Description: 搜索结果 -->

<template>
	<div class="result-wrap">
		<!-- 滚动区域 -->
		<div v-if="search_loading" class="loading search_loading">
			<img :src="compute_local_project_file_path('/image/gif/loading1.gif')" alt="">
			<div>
				{{ i18n_t('common.loading')}}
			</div>
		</div>
		<q-scroll-area v-if="load_data_state === 'data'" class="fit rule-scroll-area" ref="scrollRef">
			<div class="serach-background">
				<!-- 搜索展示 -->
				<div class="content">
					<ul class="list">
						<!-- <div class="title">{{ i18n_t('ouzhou.search.view_all_match') }}</div> -->
						<!-- 滚球 -->
						<div  v-if="search_data.bowling.length > 0">
							<div @click="expand_bowling = !expand_bowling">
								<div class="middle_info_tab diff">
									<div class="color">{{ i18n_t('ouzhou.search.underway') }}</div>
								</div>
								<div v-show="expand_bowling">
									<li v-for="(value, name, index) in show_bowling_list(search_data.bowling)" :key="name">
										<div class="list_top" @click="bowling_top_click(value)">
											<span v-html="red_color(value.tn)"></span><img
												:src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
										</div>
										<div class="list_bottom" v-for="(item, i) in value.children" @click="bowling_click(item)">
											<div style="width: 60%; word-break: break-all">
												<p>
													<span class="home" v-html="red_color(item.mhn)"></span>
													<span class="middle">v</span>
													<span class="away" v-html="red_color(item.man)"></span>
												</p>
												<p class="flex"> 
													<!-- 比赛时间 -->
													<match-process style="cursor:pointer" v-if="item" :match="item" :rows="1" :date_rows="1" date_show_type="inline" periodColor="gray" />
													<span class="red">{{ get_match_score_result(item).home_score }}-{{ get_match_score_result(item).away_score }}</span> 
												</p>
											</div>
											<div style="display: flex;flex-direction: row; flex: 1">
												<div class="flex_1"
													v-if="lodash.get(item, 'hps[0].hl.length', 0) > 0 && lodash.get(item, 'hps[0].hl[0].ol[0].ov', '') && lodash.get(item, 'hps[0].hl[0].ol[1].os', '') === 1">
													<div v-html="red_color(item?.mhn)"></div>
													<div class="red">{{ get_odd_os(lodash.get(item, 'hps[0].hl[0].ol[0].ov', '')) }}</div>
												</div>
												<div class="flex_1" v-else>
													<img class="lock" :src="odd_lock_ouzhou" alt="lock">
												</div>
												<template v-if="!sports_id.includes(item.csid)">
													<div class="flex_1"
														v-if="lodash.get(item, 'hps[0].hl.length', 0) > 0 && lodash.get(item, 'hps[0].hl[0].ol[0].ov', '') && lodash.get(item, 'hps[0].hl[0].ol[1].os', '') === 1">
														<div>{{ i18n_t('ouzhou.search.dogfall') }}</div>
														<div class="red">{{ get_odd_os(lodash.get(item, 'hps[0].hl[0].ol[2].ov', '')) }}</div>
													</div>
													<div class="flex_1" v-else>
														<img class="lock" :src="odd_lock_ouzhou" alt="lock">
													</div>
												</template>
												<div class="flex_1"
													v-if="lodash.get(item, 'hps[0].hl.length', 0) > 0 && lodash.get(item, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(item, 'hps[0].hl[0].ol[1].os', '') === 1">
													<div v-html="red_color(item?.man)"></div>
													<div class="red">{{ get_odd_os(lodash.get(item, 'hps[0].hl[0].ol[1].ov', '')) }}</div>
												</div>
												<div class="flex_1" v-else>
													<img class="lock" :src="odd_lock_ouzhou" alt="lock">
												</div>
											</div>
										</div>
									</li>
								</div>
							</div>
						</div>
						<!-- 搜索 联赛 -->
						<div v-if="search_data.league.length > 0">
							<div @click="expand_league = !expand_league">
								<div class="middle_info_tab diff">
									<div class="color">{{ i18n_t('ouzhou.search.league') }}</div>
								</div>
							</div>
							<div v-show="expand_league">
								<li v-for="(item, index) in search_data.league" :key="index">
									<div class="list_top" @click="league_click(item)">
										<span v-html="red_color(item.leagueName)"></span><img
											:src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
									</div>
									<div class="list_bottom" v-for="(i, idx) in item.matchList"  @click="league_item_click(i)">
										<div style="width: 60%; word-break: break-all">
											<p>
												<span class="home" v-html="red_color(i.mhn)"></span>
												<span class="middle">v</span>
												<span class="away" v-html="red_color(i.man)"></span>
											</p>
											<p>{{ (new Date(+i.mgt)).Format('MM/dd hh:mm') }}</p>
										</div>
										<div style="display: flex;flex-direction: row; flex: 1">
											<div class="flex_1"
												v-if="lodash.get(i, 'hps[0].hl.length', 0) > 0 && lodash.get(i, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(i, 'hps[0].hl[0].ol[1].os', '') === 1">
												<div v-html="red_color(i?.mhn)"></div>
												<div class="red">{{ get_odd_os(lodash.get(i, 'hps[0].hl[0].ol[0].ov', '')) }}</div>
											</div>
											<div class="flex_1" v-else>
												<img class="lock" :src="odd_lock_ouzhou" alt="lock">
											</div>
											<template v-if="!sports_id.includes(i.csid)">
												<div class="flex_1"
													v-if="lodash.get(i, 'hps[0].hl.length', 0) > 0 && lodash.get(i, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(i, 'hps[0].hl[0].ol[1].os', '') === 1">
													<div>{{ i18n_t('ouzhou.search.dogfall') }}</div>
													<div class="red">{{ get_odd_os(lodash.get(i, 'hps[0].hl[0].ol[2].ov', '')) }}</div>
												</div>
												<div class="flex_1" v-else>
													<img class="lock" :src="odd_lock_ouzhou" alt="lock">
												</div>
											</template>
											<div class="flex_1"
												v-if="lodash.get(i, 'hps[0].hl.length', 0) > 0 && lodash.get(i, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(i, 'hps[0].hl[0].ol[1].os', '') === 1">
												<div v-html="red_color(i?.man)"></div>
												<div class="red">{{ get_odd_os(lodash.get(i, 'hps[0].hl[0].ol[1].ov', '')) }}</div>
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
						<div v-if="search_data.team.length > 0">
							<div @click="expand_team = !expand_team">
								<div class="middle_info_tab diff">
									<div class="color">{{ i18n_t('ouzhou.search.team') }}</div>
								</div>
							</div>
							<div v-show="expand_team">
								<li v-for="(item, index) in search_data.team" :key="index">
									<!-- <div v-if="item.matchList[0].tn">
										<div class="list_top" @click="match_top_click(item)">
											<span v-html="red_color(item.matchList[0].tn)"></span>
											<img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
										</div>
									</div> -->
									<div class="list_top">
											<span v-html="red_color(item.teamName)"></span>
										</div>
									<div class="list_bottom"  v-for="(list, i) in item?.matchList" @click.stop="match_click(item)">
										<div style="width: 60%; word-break: break-all">
											<p>
												<span class="home" v-html="red_color(list.mhn)"></span>
												<span class="middle">v</span>
												<span class="away" v-html="red_color(list.man)"></span>
											</p>
											<p>{{ (new Date(+list.mgt)).Format('MM/dd hh:mm') }}</p>
										</div>
										<div style="display: flex;flex-direction: row; flex: 1">
											<div class="flex_1"
												v-if="lodash.get(list, 'hps[0].hl.length', 0) > 0 && lodash.get(list, 'hps[0].hl[0].ol[0].ov', '') && lodash.get(list, 'hps[0].hl[0].ol[1].os', '') === 1">
												<div v-html="red_color(list.mhn)"></div>
												<div class="red">{{ get_odd_os(lodash.get(list, 'hps[0].hl[0].ol[0].ov', '')) }}</div>
											</div>
											<div class="flex_1" v-else>
												<img class="lock" :src="odd_lock_ouzhou" alt="lock">
											</div>
											<template v-if="!sports_id.includes(list.csid)">
												<div class="flex_1"
													v-if="lodash.get(list, 'hps[0].hl.length', 0) > 0 && lodash.get(list, 'hps[0].hl[0].ol[2].ov', '') && lodash.get(list, 'hps[0].hl[0].ol[1].os', '') === 1">
													<div>{{ i18n_t('ouzhou.search.dogfall') }}</div>
													<div class="red">{{ get_odd_os(lodash.get(list, 'hps[0].hl[0].ol[2].ov', '')) }}</div>
												</div>
												<div class="flex_1" v-else>
													<img class="lock" :src="odd_lock_ouzhou" alt="lock">
												</div>
											</template>
											<div class="flex_1"
												v-if="lodash.get(list, 'hps[0].hl.length', 0) > 0 && lodash.get(list, 'hps[0].hl[0].ol[1].ov', '') && lodash.get(list, 'hps[0].hl[0].ol[1].os', '') === 1">
												<div v-html="red_color(list.man)"></div>
												<div class="red">{{ get_odd_os(lodash.get(list, 'hps[0].hl[0].ol[1].ov', '')) }}</div>
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
		</q-scroll-area>
		<div v-else="is_empty_data &&
			!search_loading"
			 class="no-result-warp">
			 <!-- <p>{{ i18n_t('ouzhou.search.no_search_rezult') }}</p> -->
			 <div class="result">
				<img :src="compute_local_project_file_path('/image/svg/no-result.svg')" />
				<div>{{ i18n_t('ouzhou.search.null1') }}</div>
			 </div>
		</div>
		<!--   -->
	</div>
</template>
  
<script setup>
import { ref, watch, onBeforeUnmount, nextTick, reactive } from 'vue'
import { useRouter } from 'vue-router'
import lodash from 'lodash'

import search from "src/core/search-class/search.js"
import { get_search_result } from "src/api/module/search/index.js";
import { MenuData,compute_local_project_file_path, compute_value_by_cur_odd_type } from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { useMittOn, MITT_TYPES, useMittEmit } from 'src/core/mitt';
import { odd_lock_ouzhou } from 'src/base-h5/core/utils/local-image.js';
import { api_common, api_match_list } from "src/api/index.js";
import SearchPCClass from 'src/core/search-class/seach-pc-ouzhou-calss.js';
import { get_match_score_result } from 'src/core/match-list-pc/match-handle-data.js'
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
const props = defineProps({
	show_type: {
		type: String,
		default: ''
	},
	search_csid: {
		type: [Number, String],
		default: ''
	}
})

const emit = defineEmits(['update:show_type'])
const update_show_type = (data) => emit('update:show_type', data)

const router = useRouter()

/**
 * 获取搜索内容 default: ''
 * 路径: project_path\src\store\module\search.js
 */
let timer = null
const search_type = ref(null)
const keyword = ref('')
const get_props = (props) => {
	keyword.value = props.text
	search_type.value = props.type
	_get_search_result(keyword.value, true)
}
// 展开/收起 bowling 滚球 league 联赛 team 队伍
const expand_bowling = ref(true);
const expand_league = ref(true);
const expand_team = ref(true)


/**
 * @Description:点击滚球搜索
 * @param {string} league 点击联赛标题
 * @return {undefined} undefined
 */
 function bowling_top_click(match) {
	update_show_type('none')
	const { csid, tn } = match;
	const { tid } = match.children[0];
	//设置左侧菜单联动
	MenuData.set_left_menu_result({
		...MenuData.left_menu_result,
		lv1_mi: `${+csid+100}`,
		lv2_mi: `${+csid+100}1`
	})
	MenuData.set_current_ball_type(csid);
	// MenuData.set_menu_current_mi(`${+csid+100}2`)
	// router.push(`/search/${tn}/${csid}`)
	localStorage.setItem('league_name', tn)
	router.push(`/league/${csid}/${tid}/3`)
	SearchPCClass.set_search_isShow(false);
	useMittEmit(MITT_TYPES.EMIT_SET_SEARCH_CHANGE_WIDTH, {
		focus: false,
		text: ''
	})
}
/**
 * @Description:点击联赛搜索
 * @param {object} match 点击联赛标题
 * @return {undefined} undefined
 */
 function league_click(match) {
	if(!match) return;
	search.insert_history(match.leagueName)
	const { csid, tid } = match.matchList[0];
	//设置左侧菜单联动
	MenuData.set_left_menu_result({
		...MenuData.left_menu_result,
		lv1_mi: `${+csid+100}`,
		lv2_mi: `${+csid+100}2`
	})
	MenuData.set_current_ball_type(csid);
	// MenuData.set_menu_current_mi(`${+csid+100}2`)
	// router.push(`/search/${match.leagueName}/${csid}`)
	localStorage.setItem('league_name', match.leagueName)
	router.push(`/league/${csid}/${tid}/3`)
	SearchPCClass.set_search_isShow(false);
	useMittEmit(MITT_TYPES.EMIT_SET_SEARCH_CHANGE_WIDTH, {
		focus: false,
		text: ''
	})
	// PageSourceData.set_route_name('search')
}
/**
 * @Description:点击队伍搜索
 * @param {object} match 点击联赛标题
 * @return {undefined} undefined
 */
 function match_top_click(match) {
	if(!match) return;
	search.insert_history(match.name)
	const { tn, csid } = match.matchList[0]
	router.push(`/search/${tn}/${csid}`)
	SearchPCClass.set_search_isShow(false);
	useMittEmit(MITT_TYPES.EMIT_SET_SEARCH_CHANGE_WIDTH, {
		focus: false,
		text: ''
	})
}

/**
 * @Description:点击滚球搜索
 * @param {string} league 点击的滚球
 * @return {undefined} undefined
 */
function bowling_click(match) {
	search.insert_history(match.mhn + 'vs' + match.man)
	update_show_type('none')
	const { mid, tid, csid,ms } = match
	router.push({
      name: 'details',
      params: {
        mid,
        tid,
        csid
      },
      query: {ms}  // 传多个ms  提前判断是否需要显示右侧
    });
	// router.push(`/details/${mid}/${csid}/${tid}`)
	SearchPCClass.set_search_isShow(false);
	useMittEmit(MITT_TYPES.EMIT_SET_SEARCH_CHANGE_WIDTH, {
		focus: false,
		text: ''
	})
}
const scrollRef = ref(null)
/**
 * @Description:点击队伍搜索
 * @param {object} match 点击的赛事
 * @return {undefined} undefined
 */
function match_click(match) {
	if(!match) return;
	search.insert_history(match.name)
	const { mid, tid, csid } = match.matchList[0];
	//设置左侧菜单联动
	MenuData.set_left_menu_result({
		...MenuData.left_menu_result,
		lv1_mi: `${+csid+100}`,
		lv2_mi: `${+csid+100}2`
	})
	MenuData.set_current_ball_type(csid);
	// MenuData.set_menu_current_mi(`${+csid+100}2`)
	router.push({
      name: 'details',
      params: {
        mid,
        tid,
        csid
      },
      query: {ms}  // 传多个ms  提前判断是否需要显示右侧
    });
	SearchPCClass.set_search_isShow(false);
	useMittEmit(MITT_TYPES.EMIT_SET_SEARCH_CHANGE_WIDTH, {
		focus: false,
		text: ''
	})
}
/**
 * @Description:点击联赛搜索
 * @param {object} match 点击联赛下的具体赛事
 * @param {*} match 
 */
function league_item_click(match) {
	if(!match) return;
	const { mid, tid, csid } = match;
	//设置左侧菜单联动
	MenuData.set_left_menu_result({
		...MenuData.left_menu_result,
		lv1_mi: `${+csid+100}`,
		lv2_mi: `${+csid+100}2`
	})
	MenuData.set_current_ball_type(csid);
	// MenuData.set_menu_current_mi(`${+csid+100}2`)
	router.push(`/details/${mid}/${csid}/${tid}`)
	SearchPCClass.set_search_isShow(false);
	useMittEmit(MITT_TYPES.EMIT_SET_SEARCH_CHANGE_WIDTH, {
		focus: false,
		text: ''
	})
}

/**
 * @Description:获取搜索结果数据
 * @param {string} keyword 搜索关键字
 * @return {Undefined} Undefined
 */

/** 数据加载状态 */
const load_data_state = ref('data')
/** 搜索结果数据 */
const search_data = reactive({
	team: [],
	bowling: [],
	league: []
})
let search_loading = false;
const _get_search_result = lodash.debounce((keyword, is_loading) => {
	if (!keyword) {
		update_show_type('init')
		return
	}
	//调用接口前先设置加载状态
	if (is_loading) {
		load_data_state.value = 'loading'
	}
	let params = {
		keyword,
		cuid: UserCtr.get_uid(),
		pageNumber: 1,
		rows: 200,
		isPc: true,
		searchSportType: props.search_csid
	}
	search_loading = true
	//调用接口获取获取搜索结果数据
	get_search_result(params).then(res => {
		search_loading = false
		update_show_type('result')
		const o_data = res.data.data
		search_data.team = o_data?.team || []
		search_data.bowling = o_data?.bowling || []
		search_data.league = o_data?.league || []
		if (is_empty_data()) {
			load_data_state.value = 'empty'
			return
		}
		expand_bowling.value = true;
		expand_league.value = true;
		expand_team.value = true
		load_data_state.value = 'data'
		// console.log('res', search_data);
		get_match_base_hps_by_mids();
		let _ref_scroll = scrollRef.value;
		clearTimeout(timer)
		timer = setTimeout(() => {
			// 如果是从详情页返回
			if (search.back_keyword.keyword) {
				nextTick(() => {
					//重新设置滚动高度
					_ref_scroll && _ref_scroll.setScrollPosition && _ref_scroll.setScrollPosition('vertical', search.result_scroll.top);
				})
			} else {
				//重新设置滚动高度
				_ref_scroll && _ref_scroll.setScrollPosition && _ref_scroll.setScrollPosition('vertical', 0);
			}
		},0)
	}).catch(err => {
		search_loading = false
		console.log(err);
	})
}, 500)

// 不展示平局的球种csid
const sports_id = ['2', '5'];

// 判断数据为空
const is_empty_data = () => {
	if(!(search_data.team.length > 0) &&
	!(search_data.bowling.length > 0) &&
	!(search_data.league.length > 0)) return true
}

/**
 * @description 获取赛事赔率
 */
let match_mid_Arr = [];
const get_match_base_hps_by_mids = async () => {
	if (is_empty_data()) return;
	// 拿到所有滚球，联赛，队伍 mid
	match_mid_Arr = []
	search_data.team.forEach((item, index) => {
		item.matchList.forEach((i, idx) => {
			match_mid_Arr.push(i.mid)
		})
	})
	search_data.league.forEach((item, index) => {
		item.matchList.forEach((i, idx) => {
			match_mid_Arr.push(i.mid)
		})
	})
	search_data.bowling.forEach((item, index) => {
		match_mid_Arr.push(item.mid)
	})
	if (match_mid_Arr.length < 1) return;
	// match_mid_Arr 数组去重
	match_mid_Arr = Array.from(new Set(match_mid_Arr))
	const match_mids = match_mid_Arr.join(',')
	// 竞足409 不需要euid
	const params = {
		mids: match_mids,
		cuid: UserCtr.get_uid(),
		sort: 1,
	};
	// 获取所有搜索结果的赔率信息
	await api_common.get_match_base_info_by_mids(params).then((res) => {
		if (res.code === '200') {
			const { data } = res;
			// 使用获得比分的 mid 和搜索结果的 mid 做比较，将赔率信息返回给搜索结果
			for (let i = 0; i < data.length; i++) {
				for (let j = 0; j < search_data.team.length; j++) {
					search_data.team[j].matchList.forEach((item, index) => {
						if (data[i].mid === item.mid) {
							search_data.team[j].matchList[index] = data[i]
						}
					})
				}
				for (let k = 0; k < search_data.league.length; k++) {
					search_data.league[k].matchList.forEach((item, index) => {
						if (data[i].mid === item.mid) {
							search_data.league[k].matchList[index] = data[i]
						}
					})
				}
				for (let l = 0; l < search_data.bowling.length; l++) {
					if (data[i].mid === search_data.bowling[l].mid) {
						search_data.bowling[l] = data[i]
					}
				}
			}
		}
	})
}

// 进行中同联赛下的赛事放在一起
function show_bowling_list(search_data_bowling=[]) {
  const obj = {}
	search_data_bowling.forEach(item => {
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
}

//  文字特殊处理，颜色操作
const red_color = (item) => {
	const reg = new RegExp(keyword.value, "ig");
	let i_color = 'red';
	return item?.replace(reg, `<text style="color:${i_color}">${keyword.value}</text>`)
}

// 显示的赔率
const get_odd_os = (ov) => {
	return compute_value_by_cur_odd_type(ov, '', '', props.search_csid)
}

const {off}=useMittOn(MITT_TYPES.EMIT_SET_SEARCH_CHANGE, get_props);
onBeforeUnmount(() => {
	if (timer) {
		clearTimeout(timer)
		timer = null
	}
	off()
	useMittEmit(MITT_TYPES.EMIT_SET_SEARCH_CHANGE_WIDTH, {
		focus: false,
		text: ''
	})
})

// 监听搜索球种变化
watch(
	() => props.search_csid,
	() => {
		const keword = keyword.value.trim()
		_get_search_result(keword, true)
	}
)

</script>
  
<style lang="scss" scoped>
.result-wrap {
	width: 100%;
	height: 100%;
	.search_loading{
		flex-direction: column;
		img {
			width: 100px;
			height: auto;
		}
		div {
			font-size: 16px;
			margin-top: 24px;
		}
	} 
	.load-data-wrap {
		// height: 400px !important;
		// min-height: 0;

		:deep(.empty-wrap) {
			img {
				margin-bottom: 0;
			}

			.nodata-text2 {
				font-size: 12px;
				margin-top: 2px;
			}
		}
	}

	:deep(.q-scrollarea__thumb) {
		z-index: 1000;
	}

	/** 类型 -S*/
	.type-item {
		margin: 0 30px;

		&.inplay {
			.league-item {
				margin-top: 20px !important;

				.match-item {
					.score {
						display: block !important;
					}

					.text-wrap .c-match-process :deep(.date-wrap) {
						color: #99a3b1;
					}
				}

				.league-wrap {
					display: none;
				}
			}
		}

		&.active {
			.league-item {
				display: block;
			}
		}

		.type-wrap {
			display: flex;
			align-items: center;
			height: 34px;
			border-bottom: 1px solid #282b37;
			cursor: pointer;

			.line {
				width: 3px;
				height: 14px;
				margin-right: 10px;
				border-radius: 1.5px;
			}

			.type-name {
				color: var(--q--gb-t-c-18);
				position: relative;

				.tip-direct {
					width: 12px;
					height: 10px;
					position: absolute;
					top: 4px;
					right: -16px;
					transition: transform 0.3s;

					&.accordion-on {
						transform: rotateZ(180deg);
					}

					&:before {
						color: var(--q--gb-t-c-18);
					}
				}
			}
		}

		/** 联赛 -S*/
		.league-item {
			margin-top: 10px;
			margin-bottom: 20px;
			display: none;

			&.active {
				.hide-match {
					display: block !important;
				}

				.yb-icon-arrow {
					transform: rotate(270deg);
				}
			}

			.yb-icon-arrow {
				transform: rotate(90deg);
			}

			.point-wrap {
				height: 20px;
				display: flex;
				align-items: center;
			}

			.league-wrap {
				height: 30px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 14px;
				cursor: pointer;
				margin-bottom: 10px;

				.name-wrap {
					display: flex;
					height: 100%;
					align-items: center;

					.league-name {
						color: var(--q--gb-t-c-18);
						padding-right: 10px;
						font-weight: 600;
					}
				}
			}

			/** 赛事 -S*/
			.match-item {
				padding: 5px 0;
				margin-top: 5px;

				&.hide-match {
					display: none;
				}

				.text-wrap {
					display: flex;
					height: 22px;
					line-height: 22px;

					.team {
						cursor: pointer;
					}

					.score {
						margin-left: 10px;
						display: none;
					}

					.c-match-process {
						:deep(.date-wrap) {
							padding: 0;
							color: #5a6074;
							display: flex;

							span {
								margin-right: 5px;
								white-space: nowrap;
							}
						}

						:deep(.timer-layout2) {
							margin-right: 5px;
						}

						:deep(.jingcai) {
							display: none;
						}

						:deep(.process-name) {
							margin-right: 5px;
						}
					}
				}
			}

			/** 赛事 -E*/
		}

		/** 联赛 -E*/
	}

	/** 类型 -E*/

	// 搜索结果
	.content {
		color: var(--q-gb-t-c-5);

		.title {
			height: 50px;
			line-height: 50px;
			font-size: 18px;
			font-weight: 500;
			background-color: #e2e2e2;
		}

		.list {
			margin: 0 auto;
			background-color: #e2e2e2;
			padding-bottom: 40px;
		}
	}
}

.middle_info_tab {
	padding: 9px 18px;
	display: flex;
	border-bottom: 1px solid var(--q-gb-bg-c-15);
	background-color: var(--q-gb-bg-c-15);
	font-size: 14px;
	font-weight: 500;
	overflow-x: scroll;
	position: fixed;
	width: 100%;
	z-index: 1;
	color: var(--q-gb-t-c-5);
	&.diff {
		padding: 10px 20px;
		position: unset;
		overflow: auto;
	}
	.color {
		color: #FF7000;
		// color: var(--q-gb-t-c-1);
	}
}
.no-result-warp {
	background-color: #fff;
	height: 500px;
	p {
		padding: 14px;
		border-bottom: 1px solid #FF7000;
	}
	.result {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		div {
			margin-top: 39px;
			font-weight: 500;
			font-size: 16px;
		}
	}
}

li {
	padding: 13px 20px 0;
	background-color: #fff;
	// border-radius: 6px;
	font-size: 14px;
	cursor: pointer;

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

		div p:first-child {
			font-size: 14px;
			margin-bottom: 0;
		}

		div p:last-child {
			color: var(--q-gb-t-c-8);
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
			color: #FF7000;
			// color: var(--q-gb-t-c-1);
		}
	}
}

.flex_1 {
	flex: 1;
	text-align: center;
}
</style>
  src/output