/*
 * @Description: 注单历史 store
 */

const initialState = {
  // 0未结算/筛选 1已结算/搜索
  main_item: 0,
  // 0筛选 1搜索
  search_for_choose: 0,
  // 搜索 去到 详情页的记录
  search_term: '',
  //提前结算金额集合
  early_moey_data: [],

}

export default function cathecticReducer(state = initialState, action) {
  switch (action.type) {
    // 记录点击的tab--0未结算/筛选 1已结算/搜索
    case "SET_MAIN_ITEM":
      return { ...state, main_item: action.data };
    // 记录是筛选还是搜索--0筛选 1搜索
    case "SET_SEARCH_FOR_CHOOSE":
      return { ...state, search_for_choose: action.data };
    // 搜索 去到 详情页的记录
    case "SET_EARCH_TERM":
      return { ...state, search_term: action.data };
    //提前结算金额集合
    case "SET_EARLY_MOEY_DATA":
      return { ...state, early_moey_data: action.data };
    // 默认
    default:
      return state;
  }
}
