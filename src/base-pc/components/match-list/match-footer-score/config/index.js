// 当前 系列组件 对外注册 的组件名字
export  const  component_symbol = 'MatchFooterScore'
//公用的 需要注册的一些对接参数
export  const need_register_props = {
  // 赛事
  match: {
    type: Object,
    default: () => {},
  },
  // 是否显示比分内容
  is_show_score_content: {
    type: Boolean,
    default: () => true,
  },
  //比分容器宽度
  score_wrap_width: {
    type: Number,
    default: () => 0,
  },
}


 