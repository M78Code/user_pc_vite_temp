// 当前 系列组件 对外注册 的组件名字
export  const  component_symbol = 'MatchHandicap'
//公用的 需要注册的一些对接参数
export  const need_register_props = {
  // 盘口列表
  handicap_list: {
    type: Array,
    default: () => [],
  },
  // 赛事
  match: {
    type: Object,
    default: () => {},
  },
  // 是否显示比分
  is_show_score: {
    type: Boolean,
    default: () => false,
  },
  // 是否显示比分内容
  is_show_score_content: {
    type: Boolean,
    default: () => false,
  },
  // 是否主球次要玩法
  other_play: {
    type: Boolean,
    default: () => false,
  }
}


 