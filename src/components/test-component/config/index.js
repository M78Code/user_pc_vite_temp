/**
 * TestComponent 多个版本的 一些 公用 配置 
 */

// 当前 系列组件 对外注册 的组件名字
export  const  component_symbol = 'TestComponent'
//公用的 需要注册的一些对接参数
export  const need_register_props = {
  tableClass: {
    type: String,
    default: "bg-red",
  },
  title: {
    type: String,
    default: "bg-red测试组件",
  },
  title2: {
    type: String,
    default: "888组件",
  },
}


 