// 当前 系列组件 对外注册 的组件名字
export  const  component_symbol = 'MatchListTem1'
//公用的 需要注册的一些对接参数
export  const need_register_props = {
  // 是否显示中立场 盘口数
  is_show_more: {
    type: Boolean,
    default: () => true, 
  },
  //阶段后缀
  is_suffix: {
    type: Boolean,
    default: () => true,
  }
}


 