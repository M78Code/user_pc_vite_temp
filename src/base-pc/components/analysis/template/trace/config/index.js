// 当前 系列组件 对外注册 的组件名字
export  const  component_symbol = 'Trace'
//公用的 需要注册的一些对接参数
export  const need_register_props = {
  event_data: {
    type: Array,
    default: () => []
  },
  match: {
    type: Object,
    default: () => {}
  },
}


 