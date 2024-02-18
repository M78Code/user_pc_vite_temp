import lodash from 'lodash'

import { addWsMessageListener } from "src/core/utils/common/module/ws-message.js";
import { api_bymids } from "./match-list-featch.js";
import MatchListCardClass from "src/core/match-list-pc/match-card/match-list-card-class.js";
import { MatchDataWarehouse_PC_List_Common } from 'src/output/module/match-data-base.js';
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { get_phase_result, match_list_handle_set } from '../match-handle-data.js'
import { MenuData } from 'src/output/project/index.js'
import { socket_remove_match } from "src/core/match-list-pc/match-list-composition.js";
import { match_collect_status } from './match-list-collect.js'
import MatchListScrollClass from 'src/core/match-list-pc/match-scroll.js'
import { PROJECT_NAME } from 'src/output/module/constant-utils.js'

const ws_keys_map = {} //ws map对应表
function use_match_list_ws(MatchListData = MatchDataWarehouse_PC_List_Common, remove) {
	//如果已经创建过ws返回原来的
	if (ws_keys_map[MatchListData.name_code]) {
		return ws_keys_map[MatchListData.name_code]
	}
	let remove_fun = [];
	window.MenuData=MenuData
	const ws_obj = {
		mids: [],
		set_inactive_mids(_mids = []) {
			MatchListData.set_inactive_mids(_mids)
		},
		set_active_mids: (_mids = []) => {
			ws_obj.mids = _mids;
			MatchListData.set_active_mids(_mids)
		},
		set_list(match_list) {
			match_list.forEach(match => {
				match_collect_status(match)
			})
			MatchListData.set_list(match_list)
		},
		/**
		 * 添加订阅
		 * @param {boolean} clear 是否情况订阅的mid
		 */
		addWsMessageListener(clear = true) {
			clear && ws_obj.ws_destroyed()
			remove_fun = [addWsMessageListener(lodash.throttle((cmd, data) => {
				const mids = ws_obj.mids;
				// 赛事新增
				if (["C109"].includes(cmd)) {
					const { cd = [] } = data;
					if (cd.length < 1) return;
					let csid_map={
						90:1,//电子足球
						91:2//电子篮球
					}
					let csid=csid_map[MenuData.current_ball_type]||MenuData.current_ball_type
					const item = cd.find((t) => t.csid ==csid);
					if (MenuData.is_home()) {
						// useMittEmit(MITT_TYPES.EMIT_SET_HOME_MATCHES)
					} else {
						if (item) useMittEmit(MITT_TYPES.EMIT_FETCH_MATCH_LIST, { is_socket: true });
					}
				}
				// 调用 mids  接口 303是盘口赔率变更
				if (["C303", "C114"].includes(cmd)) {
					const { mid = '' } = data.cd || {};
					let _mids = mid.split(',')
					let _ws_mids = mids || [];
					//这是公用的就拿可视区域的ID去判断
					if (MatchListData.name_code == 'MatchDataWarehouse_PC_List_Common') {
						_ws_mids = MatchListScrollClass.show_mids || []
					}
					//只有当前订阅的mids里包括推送的mid才获取数据 
					if (_mids.some(_mid => _ws_mids.includes(_mid))) {
						api_bymids({ mids: _ws_mids }, null, MatchListData)
					}
				}
			}, 1000)), addWsMessageListener((cmd, data) => {
				// 调用 matchs  接口
				if (['C101', 'C102', 'C104', 'C901'].includes(cmd)) {
					const { cd: { mid = '', mhs = 0, mmp = 1 } } = data
					if (mhs == 2 || mmp == '999') {
						// mhs === 2 为关盘
						socket_remove_match(data.cd, MatchListData);
						remove && remove(mid);
					}
				}
				if (['new-pc'].includes(PROJECT_NAME)) { //有附加盘口
					updata_match(cmd, data, MatchListData)
				}
			})]


		},
		// 将新的可视区域赛事id 设置为活跃
		ws_destroyed: () => {
			delete ws_keys_map[MatchListData.name_code]
			remove_fun.forEach(i => i())
			remove_fun = []
			// MatchListData.clear()//清除数仓数据
		}
	}
	ws_obj.addWsMessageListener()
	ws_keys_map[MatchListData.name_code] = ws_obj
	return ws_keys_map[MatchListData.name_code];
}

/**
 * ws断线重连 会把订阅搞掉 所以需要 重新订阅
 */
useMittOn(MITT_TYPES.EMIT_WS_STATUS_CHANGE_EVENT, ({ ws_status, ws_status_old }) => {
	// ws_status 链接状态变化 (0-断开,1-连接,2-断网续连状态)
	if (ws_status == 1 && ws_status_old == 2) {
		for (key in ws_keys_map) {
			const ws_map = ws_keys_map[key];
			ws_map.addWsMessageListener(false)
			if (key == 'MatchDataWarehouse_PC_List_Common') {
				ws_map.set_active_mids(MatchListScrollClass.show_mids)
			}
			else {
				ws_map.set_active_mids(ws_map.mids)
			}
		}
	}
})

function updata_match(cmd, data, MatchListData) {
	const { cd: { mid = '', mhs = 0, mmp = 1 } } = data
	const cur_match = MatchListData.get_quick_mid_obj(mid)
	//当前赛事数据不存在
	if (!cur_match) {
		return;
	}
	const skt_data = data.cd;
	//更新表征
	if (['C101', 'C102', 'C104', 'C901'].includes(cmd)) {
		if (skt_data.mmp == "999") {return}
		match_list_handle_set([cur_match])
		MatchListCardClass.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs([cur_match.mid])
	}
	if (['C102'].includes(cmd)) {
		if (skt_data.mmp != "999") {
			// 篮球更新当前局盘口
			// if (cur_match.csid == 2) {
			// 	match_list_handle_set([cur_match])
			// 	MatchListCardClass.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs([cur_match.mid])
			// }
			// 更新比分
			// 如果是模拟发送C102且补时开关是打开的且为足球赛事则同步时间 
			if (cur_match.csid == 1 && skt_data.mststs == 1) {
				useMittEmit(MITT_TYPES.EMIT_INIT_FILL_TIME_CMD, skt_data.mid);
			}
			// 非足球,而且赛事阶段切换的时候拉取接口(并且不是内部发送的命令,内部发送会有send字段值为my_self)    
			let check_result = get_phase_result(cur_match.csid, skt_data.mmp); // 获取该阶段是否进行接口查询
			// 足球加时赛开始需要调用一次接口
			if (((cur_match.csid == 1 && skt_data.mmp == 32) ||
				(cur_match.csid != 1 && check_result)) &&
				skt_data.mmp != mmp &&
				!skt_data.send) {
				useMittEmit(MITT_TYPES.EMIT_FETCH_MATCH_LIST, { is_socket: true }) //请求列表
			}
		}
	}
}


/**
 * 返回创建的ws对象
 * @param {*} name_code 
 * @returns 
 */
export function get_ws_name_code_ws(name_code) {
	if (!ws_keys_map[name_code]) {
		console.error(`还未创建该仓库[${name_code}]的ws监听`)
	}
	return ws_keys_map[name_code]
}
export default use_match_list_ws;