
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
  2100: { label: "电竞-英雄联盟", value: "124" },
  2101: { label: "电竞-Dota2", value: "124" },
  2102: { label: "电竞-CS·GO", value: "124" },
  2103: { label: "电竞-王者荣耀", value: "124" },

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

  // 冠军
  404: { label: "冰球-冠军-冠军", value: "18" },
  407: { label: "斯诺克-冠军-冠军", value: "18" },
  408: { label: "乒乓球-冠军-冠军", value: "18" },
  409: { label: "排球-冠军-冠军", value: "18" },
  410: { label: "羽毛球-冠军-冠军", value: "18" },
  411: { label: "手球-冠军-冠军", value: "18" },
  413: { label: "沙滩排球-冠军-冠军", value: "18" },
  414: { label: "橄榄球-冠军-冠军", value: "18" },
  415: { label: "曲棍球-冠军-冠军", value: "18" },
  416: { label: "水球-冠军-冠军", value: "18" },
  418: { label: "娱乐-冠军-冠军", value: "18" },
  402: { label: "篮球-冠军-冠军", value: "18" },
  412: { label: "拳击-冠军-冠军", value: "18" },
  403: { label: "棒球-冠军-冠军", value: "18" },
  401: { label: "冠军-足球", value: "18" },
  405: { label: "冠军-网球", value: "18" },
  400: { label: "冠军", value: "18" },
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
