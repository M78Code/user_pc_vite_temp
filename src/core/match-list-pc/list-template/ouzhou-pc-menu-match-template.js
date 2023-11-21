import { PROJECT_NAME } from 'src/core/index.js';

/**
 * 通过菜单id 来映射显示每个菜单下边的默认模板
 * 需要自己计算的用 custom
 *
 */
const menu_to_match_templte = {
  // 常规
  101201: { label: "足球-今日-让球&大小", value: "1101" },
  105201: { label: "网球-今日-让球&大小", value: "109" },
  105301: { label: "网球-早盘-让球&大小", value: "109" },
  102201: { label: "篮球-今日-让球&大小", value: "102" },
  102301: { label: "篮球-早盘-让球&大小", value: "7" },
  108201: { label: "乒乓球-今日-让球&大小", value: "111" },
  108301: { label: "乒乓球-早盘-让球&大小", value: "111" },
  103201: { label: "棒球-今日-让球&大小", value: "117" },
  109201: { label: "排球-今日-让球&大小", value: "111" },
  109301: { label: "排球-早盘-让球&大小", value: "111" },
  111201: { label: "手球-今日-让球&大小", value: "101" },
  112201: { label: "拳击-今日-所有盘口", value: "119" },
  106201: { label: "美式足球-今日-让球&大小", value: "120" },
  106301: { label: "美式足球-早盘-让球&大小", value: "120" },
  // 电竞
  2100: { label: "电竞-英雄联盟", value: "24" },
  2101: { label: "电竞-Dota2", value: "24" },
  2101: { label: "电竞-Dota2", value: "24" },
  2103: { label: "电竞-王者荣耀", value: "24" },

  // 滚球
  101: { label: "滚球-足球", value: "101" },
  102: { label: "滚球-篮球", value: "102" },
  103: { label: "滚球-棒球", value: "117" },
  104: { label: "滚球-冰球", value: "104" },
  105: { label: "滚球-网球", value: "109" },
  106: { label: "滚球-美式足球", value: "101" },
  107: { label: "滚球-斯诺克", value: "111" },
  108: { label: "滚球-乒乓球", value: "111" },
  109: { label: "滚球-排球", value: "111" },
  110: { label: "滚球-羽毛球", value: "111" },
};
/**
 *
 * @param {String | Number} data_tpl_id
 * @description 这里接收的是原始id 然后 去模板中拿对应的赛事模板
 * @returns 返回出去对应的模板id
 */
export const computed_menu_to_match_templte_ouzhou = (data_tpl_id) => {
  let default_template_value = 101;
  let current_data_tpl_id = menu_to_match_templte[data_tpl_id]?.value || default_template_value;
  return current_data_tpl_id;
};
