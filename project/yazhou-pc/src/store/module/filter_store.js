/*
 * @Author: cooper
 * @Date: 2023-08-12 17:13:55
 * @Description: 筛选功能数据操作使用
 */
const initialState = {
  //即将开赛筛选时间
  open_select_time: null,
  // 显隐联赛筛选弹层
  show_filter_popup: false,
  // 选择的筛选数据
  filter_select_obj: [],
  // 上次筛选信息
  pre_filter_select_obj: [],
  //联赛筛选是否全选
  filter_checked_all: true,
  pre_filter_checked_all: true,
  // 获取选中的赛事数量(列表右上角赛选功能)
  checked_count: 0,
};
export default function detailsReducer(state = initialState, action) {
  switch (action.type) {
    //保存显示搜索组件状态
    case "set_show_filter_popup":
      return { ...state, show_filter_popup: action.data };
       //保存选择的筛选数据
    case "set_filter_select_obj":
      const params = {
        checked_count: action.data.length,
        filter_select_obj: action.data,
        pre_filter_select_obj: action.data,
      };
      return { ...state, ...params };
      //设置联赛筛选全选状态
    case "set_filter_checked_all":
      const obj = {
        pre_filter_checked_all:state.filter_checked_all,
        filter_checked_all: action.data,
      };
      return { ...state, ...obj };
       //清空筛选数据 设置全选
    case "set_remove_filter_condition":
      const obj_ = {
        filter_select_obj:[],
        filter_checked_all: true,
        pre_filter_checked_all:true,
        checked_count:0
      };
      return { ...state, ...obj_};
       // 清空上次筛选数据
    case "remove_pre_filter_select_obj":
      return { ...state, pre_filter_select_obj:[] };
       //保存赛事选中数量
    case "set_checked_count":
      return { ...state, checked_count: action.data };
  }
}
