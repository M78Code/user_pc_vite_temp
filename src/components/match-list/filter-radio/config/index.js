// 当前 系列组件 对外注册 的组件名字
export  const  component_symbol = 'FilterRadio'
//公用的 需要注册的一些对接参数
export  const need_register_props = {
  check_list: {
    type: Array,
    default: () => [],
  },
  //初始化选中
  default_value: {
    type: String,
    default: () => "",
  },
  //赛果单选框样式
  checkbox_style: {
    type: Object,
    default: () => {},
  },
}


 