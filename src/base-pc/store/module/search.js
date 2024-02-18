import lodash from "lodash";
import { nextTick } from "vue";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt'

const initialState = {
	related_keyword: "", //联想关键字
	keyword: "", //搜索关键字
	click_keyword: "", //点击的关键字
	search_league_name: "", //搜索联赛名
	search_isShow: false, //是否显示搜索组件
	search_type: 1, //搜索类型  1组件搜索   2页面搜索
};

export default function searchReducer(state = initialState, action) {
	const { type, data } = action;
	switch (type) {
		// 保存搜索关键字
		case "SET_SEARCH_KEYWORD":
			return { ...state, keyword: "a" + lodash.random(1000, 9999) + data };
		// 保存联想搜索关键字
		case "SET_RELATED_KEYWORD":
			return {
				...state,
				related_keyword: "a" + lodash.random(1000, 9999) + data,
			};
		// 保存搜索的联赛名
		case "SET_CLICK_KEYWORD":
			return {
				...state,
				search_league_name: data,
				click_keyword: "a" + lodash.random(1000, 9999) + data,
			};
		// 保存显示搜索组件状态
		case "SET_SEARCH_STATUS":
			nextTick(() => useMittEmit(MITT_TYPES.EMIT_LAYOUT_HEADER_SEARCH_ISSHOW, data))
			return { ...state, search_isShow: data };
		// 保存搜索类型
		case "SET_SEARCH_TYPE":
			return { ...state, search_type: data };
		default:
			return state;
	}
}
