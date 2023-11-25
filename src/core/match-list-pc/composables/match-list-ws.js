import lodash from 'lodash'

// import MatchListData from "src/core/match-list-pc/match-data/match-list-data-class.js";
import { addWsMessageListener } from "src/core/utils/module/ws-message.js";
import { api_bymids } from "./match-list-featch.js";
// import { fetch_match_list } from '../match-list-composition.js'
import { useMittEmit, MITT_TYPES, MenuData, MatchDataWarehouse_PC_List_Common } from 'src/core/index.js';
import { socket_remove_match } from "src/core/match-list-pc/match-list-composition.js";
import MatchListScrollClass from 'src/core/match-list-pc/match-scroll.js'
const ws_keys_map = {} //ws map对应表
function use_match_list_ws(MatchListData = MatchDataWarehouse_PC_List_Common) {
	//如果已经创建过ws返回原来的
	if (ws_keys_map[MatchListData.name_code]) {
		return ws_keys_map[MatchListData.name_code]
	}
	let mids = []
	console.log('use_match_list_ws', MatchListData.name_code, mids)
	let remove_fun = addWsMessageListener(lodash.throttle((cmd, data) => {
		// 赛事新增
		if (["C109"].includes(cmd)) {
			const { cd = [] } = data;
			if (cd.length < 1) return;
			const item = cd.find((t) => t.csid == MenuData.menu_csid);
			if (item) useMittEmit(MITT_TYPES.EMIT_FETCH_MATCH_LIST);
		}
		// 调用 matchs  接口
		if (["C104"].includes(cmd)) {
			// mhs === 2 为关盘
			if (data.mhs == 2) {
				socket_remove_match(data.cd, MatchListData);
			}
		}
		// 调用 mids  接口 303是盘口赔率变更
		if (["C303", "C114"].includes(cmd)) {
			const { mid = '' } = data.cd || {};
			let _mids = mid.split(',')
			let _ws_mids = mids||[];
			//这是公用的就拿可视区域的ID去判断
			if (MatchListData.name_code == 'MatchDataWarehouse_PC_List_Common') {
				_ws_mids = MatchListScrollClass.show_mids||[]
			}
			//只有当前订阅的mids里包括推送的mid才获取数据 
			if (_mids.some(_mid => _ws_mids.includes(_mid))) {
				api_bymids({ mids: _ws_mids }, null, MatchListData)
			}
		}
	}, 1000))
	ws_keys_map[MatchListData.name_code]  = {
		set_inactive_mids(_mids = []) {
			MatchListData.set_inactive_mids(_mids)
		},
		set_active_mids: (_mids = []) => {
			mids = _mids;
			MatchListData.set_active_mids(_mids)
		},
		set_list(match_list) {
			MatchListData.set_list(match_list)
		},
		// 将新的可视区域赛事id 设置为活跃
		ws_destroyed: () => {
			delete ws_keys_map[MatchListData.name_code]
			mids = null;
			remove_fun && remove_fun()
			// MatchListData.clear()//清除数仓数据
		}
	}
	return ws_keys_map[MatchListData.name_code] 
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