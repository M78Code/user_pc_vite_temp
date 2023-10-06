// 当前 系列组件 对外注册 的组件名字
export  const  component_symbol = 'BasePanel'
//公用的 需要注册的一些对接参数
export  const need_register_props = {
  match:{
    type: Object
  },

  baseData: {
    type: Object,
    default: () => {},
  },
  tournamentTypeFinish: {
    type: Boolean,
    default: () => false,
  },
  vs_info: {
    type: Object,
    default: () => [],
  },
  team_vs_history: {
    type: Object,
    default: () => [],
  },
  team_vs_other_team: {
    type: Object,
    default: () => {},
  },
  team_vs_history_result: {
    type: Object,
    default: () => {},
  },
  team_vs_other_team_result: {
    type: Object,
    default: () => {},
  },
}


 