/**
 * 通过菜单id 来映射显示每个菜单下边的默认模板
 * 需要自己计算的用 custom
 *
 */
const menu_to_match_templte = {
  101201: { label: "足球-今日-让球&大小", value: "1" },
  101202: { label: "足球-今日-波胆", value: "1" },
  101203: { label: "足球-今日-15分钟", value: "28" },
  101204: {
    label: "足球-今日-独赢/让球胜平负/双重机会",
    value: "22",
  },
  101205: { label: "足球-今日-半/全场", value: "2" },
  101206: { label: "足球-今日-进球单/双", value: "3" },
  101207: { label: "足球-今日-下一/最后进球", value: "23" },
  101208: { label: "足球-今日-进球区间", value: "5" },
  101209: { label: "足球-今日-净胜分", value: "6" },
  101210: { label: "足球-今日-角球", value: "1" },
  101211: { label: "足球-今日-罚牌", value: "29" },
  101301: { label: "足球-早盘-让球&大小", value: "1" },
  101302: { label: "足球-早盘-波胆", value: "1" },
  101303: { label: "足球-早盘-15分钟", value: "28" },
  101304: {
    label: "足球-早盘-独赢/让球胜平负/双重机会",
    value: "22",
  },
  101305: { label: "足球-早盘-半/全场", value: "2" },
  101306: { label: "足球-早盘-进球单/双", value: "3" },
  101307: { label: "足球-早盘-下一/最后进球", value: "23" },
  101308: { label: "足球-早盘-进球区间", value: "5" },
  101309: { label: "足球-早盘-净胜分", value: "6" },
  101310: { label: "足球-早盘-角球", value: "1" },
  101311: { label: "足球-早盘-罚牌", value: "29" },

  105201: { label: "网球-今日-让球&大小", value: "9" },
  105202: { label: "网球-今日-准确盘数", value: "10" },

  105301: { label: "网球-早盘-让球&大小", value: "9" },
  105302: { label: "网球-早盘-准确盘数", value: "10" },
};

/**
 * 
 * @param {String | Number} data_tpl_id 
 * @description 这里接收的是原始id 然后 去模板中拿对应的赛事模板
 * @returns 返回出去对应的模板id
 */
export const computed_menu_to_match_templte = (data_tpl_id) => {
  let default_template_value = 1;
    return menu_to_match_templte[data_tpl_id]?.value || default_template_value
}
