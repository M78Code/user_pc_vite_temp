// 当前 系列组件 对外注册 的组件名字
export  const  component_symbol = 'EsportsHeader'
//公用的 需要注册的一些对接参数
export  const need_register_props = {
  load_data_state: {
    type: String,
    default: () => '',
  },
  NewMenu: {
    type: Object,
    default: () => {},
  }
}


 