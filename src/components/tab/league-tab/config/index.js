/**
 * SearchComponent 多个版本的 一些 公用 配置 
 */

// 当前 系列组件 对外注册 的组件名字
export  const  component_symbol = 'LeagueTab'
//公用的 需要注册的一些对接参数
export  const need_register_props = {
  //item盒子左右padding
  padding: {
    type: Number,
    default: () => 15,
  },
  current_mi: {
    type: String,
    default: () => "",
  },
  hasActivity: {
    type: Boolean,
    default: () => true,
  },
  is_drag: {
    type: Boolean,
    default: () => true,
  },
  line_width: {
    type: Number,
    default: () => null,
  },
}


 