// 当前 系列组件 对外注册 的组件名字
export  const  component_symbol = 'MatchProcess'
//公用的 需要注册的一些对接参数
export  const need_register_props = {
  rows: {
    type: Number,
    default: () => null,
  },
  match: {
    type: Object,
    default: () => {},
  },
  match_list_data: {
    type: Object,
    default: () => {},
  },
  show_page: {
    type: String,
    default: () => '',
  },
  date_rows: {
    type: Number,
    default: () => 1,
  },
  source:{
    type:String,
    default:() => null
  }
}


 