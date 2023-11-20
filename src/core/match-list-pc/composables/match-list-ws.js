import { ref } from "vue";
import lodash from 'lodash'

// import MatchListData from "src/core/match-list-pc/match-data/match-list-data-class.js";
import * as ws_message_listener from "src/core/utils/module/ws-message.js";
import { api_bymids } from "./match-list-featch.js";
// import { fetch_match_list } from '../match-list-composition.js'
import { useMittEmit, MITT_TYPES, MenuData, MatchDataWarehouse_PC_List_Common } from 'src/core/index.js';
import { socket_remove_match } from "src/core/match-list-pc/match-list-composition.js";
const bymids = lodash.debounce((mids, MatchListData) => {
	api_bymids({ mids }, null, MatchListData)
}, 300);
function use_match_list_ws(MatchListData = MatchDataWarehouse_PC_List_Common) {
	let mids = []
	console.log('use_match_list_ws', MatchListData.name_code, mids)
	let message_fun = ws_message_listener.ws_add_message_listener((cmd, data) => {
		// 赛事新增
		if (["C109"].includes(cmd)) {
			const { cd = [] } = data;
			if (cd.length < 1) return;
			const item = cd.find((t) => t.csid == MenuData.menu_csid);
			if (item) useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_UPDATE);
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
			console.log('bymids', MatchListData.name_code,Date.now())
			mids.length && bymids(mids, MatchListData)
		}
	})
	return {
		set_inactive_mids(_mids = []) {
			MatchListData.set_inactive_mids(_mids)
		},
		set_active_mids: (_mids = []) => {
			mids = _mids;
			MatchListData.set_active_mids(_mids)
		},
		// 将新的可视区域赛事id 设置为活跃
		ws_destroyed: () => {
			mids = null;
			console.log('ws_destroyed')
			ws_message_listener.ws_remove_message_listener(message_fun)
			MatchListData.clear()//清除数仓数据
		}
	}
}
export default use_match_list_ws;