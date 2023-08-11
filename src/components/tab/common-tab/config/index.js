/**
 * SearchComponent 多个版本的 一些 公用 配置 
 */

// 当前 系列组件 对外注册 的组件名字
export  const  component_symbol = 'CommonTab'
//公用的 需要注册的一些对接参数
export  const need_register_props = {
  //tab列表
  list: {
    type: Array,
    default: () => [],
  },
  //下划线显示
  is_show_line: {
    type: Boolean,
    default: () => false,
  },
  //左右按钮显示
  is_show_btn: {
    type: Boolean,
    default: () => false,
  },
  //列表顶部
  is_list_top_menu: {
    type: Boolean,
    default: () => false,
  },
  //item盒子左右padding
  padding: {
    type: Number,
    default: () => 15,
  },
  //当前选中索引
  currentIndex: {
    type: Number,
    default: () => 0,
  },
  tab_name_key: {
    type: String,
    default: () => 'tab_name',
  },
  checked: {
    type: Boolean,
    default: () => true,
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


 