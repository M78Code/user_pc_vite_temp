/*
 * @Author: Cable
 * @Date: 2021-08-04 17:13:55
 * @Description: 菜单配置
 */

// 类型对应的菜单名称
export const menu_type_to_menu_name = {
  // 滚球
  menu_type_1:'play',
  // 热门赛事
  menu_type_12:'hot',
  // 虚拟体育
  menu_type_900:'virtual_sport',
  // 冠军聚合页
  menu_type_100:'winner_top',
  // 体育菜单
  menu_type_9:'sport_menu',
  // 今日
  menu_type_3:'today',
  // 早盘
  menu_type_4:'early',
  // 串关
  menu_type_11:'bet',
  // 电竞
  menu_type_3000:'esports',
}

// 菜单名称列表
export const menu_name_arr = Object.values(menu_type_to_menu_name)


//新上球种标识id 
//102------- CSGO
//1009------- 虚拟泥地摩托车
export const NEW_PITCHES_IDS = []

// 一个菜单对象模板
const menu_template = {
  menuId:0,
  count:0,
}

// 菜单ID到菜单对象映射的数据模板
export const menu_obj_template = {
  menu_id_0:{...menu_template, subList:[]},
  play:{...menu_template, subList:[], topMenuList:[]},
  hot:{...menu_template, subList:[], topMenuList:[]},
  virtual_sport:{...menu_template, subList:[]},
  winner_top:{...menu_template, subList:[], topMenuList:[]},
  sport_menu:{...menu_template, subList:[]},
  today:{...menu_template, subList:[]},
  early:{...menu_template, subList:[]},
  bet:{...menu_template, subList:[]},
  esports:{...menu_template, subList:[]},
}

