import { ref } from "vue";
import lodash from 'lodash'

// import MatchListData from "src/core/match-list-pc/match-data/match-list-data-class.js";
import * as ws_message_listener from "src/core/utils/module/ws-message.js";
import {api_bymids} from "./match-list-featch.js";
// import { fetch_match_list } from '../match-list-composition.js'
import {utils,useMittEmit,MITT_TYPES, MenuData } from 'src/core/index.js';
import useMatchListMx from "src/core/match-list-pc/match-list-composition.js";

//  订阅所需 赛事ID
const { socket_remove_match } = useMatchListMx
const skt_mid = ref({});
//  可视区域赛事ID
// ** WS 相关 *********************************/
const socket_name = ref("match_list");
// 是否静默运行(socket、refresh按钮)
const backend_run = ref(false);
const load_data_state = ref('data');
// 订阅所需 盘口ID
const skt_hpid = ref("");
let message_fun = null;

const refresh_c8_subscribe = () => {
	ws_destroyed()//先取消之前的订阅 不然重复了咋办
	message_fun = ws_message_listener.ws_add_message_listener((cmd,data)=>{
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
				socket_remove_match(data.cd);
			}
		}
		// 调用 mids  接口
		if (["C303", "C114"].includes(cmd)) {
			api_bymids();
		}
	})
};


/**
		 * @Description 可视赛事ID改变
		 * @param {undefined} undefined
		 */
const show_mids_change = lodash.debounce(() => {
	// 列表没加载完 不执行
	if (load_data_state.value != "data") {
		return;
	}
	// 重新订阅C8
	refresh_c8_subscribe();
	api_bymids({ is_show_mids_change: true })
}, 1000)

const ws_destroyed = () => {
	ws_message_listener.ws_remove_message_listener(message_fun)
}
export {
	// 订阅所需  赛事ID
	skt_mid,
	// ** WS 相关 *********************************/
	socket_name,
	// 是否静默运行(socket、refresh按钮)
	backend_run,
	// 订阅所需 盘口id
	skt_hpid,
	refresh_c8_subscribe,
	ws_destroyed,
	// 可视区域id变更
	show_mids_change,
}
