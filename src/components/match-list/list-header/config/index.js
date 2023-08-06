// 当前 系列组件 对外注册 的组件名字
export  const  component_symbol = 'ListHeader'
//公用的 需要注册的一些对接参数
export  const need_register_props = {
  collect_count: {
    type: Number,
    default: () => null,
  },
  load_data_state: {
    type: String,
    default: () => '',
  },
  is_show_input: {
    type: Boolean,
    default: () => false,
  },
  is_show_hot: {
    type: Boolean,
    default: () => false,
  },
  NewMenu: {
    type: Object,
    default: {  },
  }
}


 