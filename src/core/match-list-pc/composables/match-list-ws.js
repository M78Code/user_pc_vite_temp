import { ref } from "vue";
// import MatchListData from "src/core/match-list-pc/match-data/match-list-data-class.js";
import use_featch_fn from "./match-list-featch.js";
import {utils } from 'src/core/index.js';

//  订阅所需 赛事ID

const skt_mid = ref({});
//  可视区域赛事ID
const show_mids = ref([]);
// ** WS 相关 *********************************/
const socket_name = ref("match_list");
// 是否静默运行(socket、refresh按钮)
const backend_run = ref(false);
const load_data_state = ref('data');
// 订阅所需 盘口ID
const skt_hpid = ref("");
const { api_bymids } = use_featch_fn();


const ws_c8_subscribe = () => {
	let match_list = [];
	show_mids.value.forEach((mid) => {
		let match = MatchListData.list_to_obj.mid_obj[mid+'_'];
		if (match) {
			match_list.push(match);
		}
	});
	if (match_list.length == 0) return;
	let _skt_mid_obj = utils.ws_c8_obj_format(match_list);
	match_list.map((match) => {
		let match_c8 = null;
		match.hpsPns &&
			match.hpsPns.map((item) => {
				match_c8 = _skt_mid_obj[match.mid];
				if (match_c8) {
					if (match.tpl_id == 18) {
						match_c8.hpids.push("*");
					} else {
						match_c8.hpids.push(item.hpid);
					}
				}
			});
		if (match.cosCorner) {
			_.forEach(["113", "114", "111", "119", "121", "122"], (item) => {
				if (!match_c8.hpids.includes(item)) {
					match_c8.hpids.push(item);
				}
			});
			// match_c8.hpids.push(...[113,114,111,119,121,122]); // 角球玩法
		}
		if (match.cosOvertime) {
			// 加时赛玩法
			_.forEach(["126", "128", "127", "129", "130", "332"], (item) => {
				if (!match_c8.hpids.includes(item)) {
					match_c8.hpids.push(item);
				}
			});
			// match_c8.hpids.push(...[126,128,127,129,130,332]);
		}
		if (match.cosPenalty) {
			// 点球大战玩法
			_.forEach(["333", "335", "334"], (item) => {
				if (!match_c8.hpids.includes(item)) {
					match_c8.hpids.push(item);
				}
			});
			// match_c8.hpids.push(...[1333,335,334]);
		}
		if (match.cosPromotion) {
			// 晋级赛玩法
			_.forEach(["135", "136"], (item) => {
				if (!match_c8.hpids.includes(item)) {
					match_c8.hpids.push(item);
				}
			});
			// match_c8.hpids.push(...[135,136]);
		}
		if (match.cosPunish) {
			// 罚牌玩法
			_.forEach(["310", "306", "307", "311", "308", "309"], (item) => {
				if (!match_c8.hpids.includes(item)) {
					match_c8.hpids.push(item);
				}
			});
			// match_c8.hpids.push(...[310,306,307,311,308,309]);
		}
	});
	// console.log(`===22222====专业版订阅的赛事=============skt_mid_obj:${JSON.stringify(_skt_mid_obj)}`);
	return _skt_mid_obj;
};
const refresh_c8_subscribe = () => {
	if (this.SCMD_C8) {
		const skt_mid_obj = ws_c8_subscribe();
		// 订阅赛事
		//  this.SCMD_C8(skt_mid_obj);
	}
};
/**
		 * @Description 可视赛事ID改变
		 * @param {undefined} undefined
		 */
const show_mids_change = () => {
	// 列表没加载完 不执行
	if (load_data_state != "data") {
		return;
	}
	// 重新订阅C8
	refresh_c8_subscribe();
	api_bymids({ is_show_mids_change: true });
}

const ws_composable_fn = () => {
	return {
		// 订阅所需  赛事ID
		skt_mid,
		// ** WS 相关 *********************************/
		socket_name,
		// 可视区域赛事ID
		show_mids,
		// 是否静默运行(socket、refresh按钮)
		backend_run,
		// 订阅所需 盘口id
		skt_hpid,
		refresh_c8_subscribe,
		// 可视区域id变更
		show_mids_change,
	}
}

export default ws_composable_fn
