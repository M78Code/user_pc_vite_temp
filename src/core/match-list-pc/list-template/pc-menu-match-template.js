import BUILDIN_CONFIG from "app/job/output/env/index.js";;
export const { PROJECT_NAME } = BUILDIN_CONFIG ;

/**
 * 通过菜单id 来映射显示每个菜单下边的默认模板
 * 需要自己计算的用 custom
 *
 */
const menu_to_match_templte = {
  // 常规
  101201: { label: "足球-今日-让球&大小", value: "1" },
  101202: { label: "足球-今日-波胆", value: "21" },
  101203: { label: "足球-今日-15分钟", value: "24" },
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
  101303: { label: "足球-早盘-15分钟", value: "24" },
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

  102201: { label: "篮球-今日-让球&大小", value: "7" },
  102202: { label: "篮球-今日-净胜分", value: "8" },

  191201: { label: "电子篮球-今日-让球&大小", value: "7" },
  191202: { label: "电子篮球-今日-净胜分", value: "8" },


  

  102301: { label: "篮球-早盘-让球&大小", value: "7" },
  102302: { label: "篮球-早盘-净胜分", value: "8" },
  108201: { label: "乒乓球-今日-让球&大小", value: "11" },
  108202: { label: "乒乓球-今日-准确局数", value: "15" },

  108301: { label: "乒乓球-早盘-让球&大小", value: "11" },
  108302: { label: "乒乓球-早盘-准确局数", value: "15" },

  103201: { label: "棒球-今日-让球&大小", value: "17" },
  103301: { label: "棒球-早盘-让球&大小", value: "17" },

  109201: { label: "排球-今日-让球&大小", value: "11" },
  109202: { label: "排球-今日-准确局数", value: "10" },

  109301: { label: "排球-早盘-让球&大小", value: "11" },
  109302: { label: "排球-早盘-准确局数", value: "10" },

  111201: { label: "手球-今日-让球&大小", value: "1" },
  111301: { label: "手球-早盘-让球&大小", value: "1" },

  112201: { label: "拳击-今日-所有盘口", value: "19" },
  112301: { label: "拳击-早盘-所有盘口", value: "19" },
  106201: { label: "美式足球-今日-让球&大小", value: "1" },
  106202: { label: "美式足球-今日-总分单/双", value: "3" },
  106301: { label: "美式足球-早盘-让球&大小", value: "1" },
  106302: { label: "美式足球-早盘-总分单/双", value: "3" },

  

  // 滚球
  1011: { label: "滚球-足球", value: "1" },
  1021: { label: "滚球-篮球", value: "2" },
  1031: { label: "滚球-棒球", value: "17" },
  104201: { label: "滚球-冰球", value: "16" },
  1051: { label: "滚球-网球", value: "9" },
  1061: { label: "滚球-美式足球", value: "1" },
  107201: { label: "滚球-斯诺克", value: "11" },
  1081: { label: "滚球-乒乓球", value: "11" },
  1091: { label: "滚球-排球", value: "11" },
  110201: { label: "滚球-羽毛球", value: "11" },


  //以上的配置 暂时没有用到哦 走的 orpt / csid匹配 //

  // 热门
  500: { label: "热门-热门赛事", value: "12" },
  50101: { label: "热门-竞足", value: "12" },
  502132: { label: "热门-NBA", value: "2" },
  502180: { label: "热门-英超", value: "1" },
  502239: { label: "热门-意甲", value: "1" },
  502244: { label: "热门-欧足锦2024外", value: "1" },
  502276: { label: "热门-德甲", value: "1" },
  502295: { label: "热门-MLB美职棒", value: "17" },
  502320: { label: "热门-西甲", value: "1" },
  502359: { label: "热门-巴甲", value: "1" },
  502563: { label: "热门-美职联", value: "1" },
  5026344: { label: "热门-中超", value: "1" },
  5026408: { label: "热门-欧冠", value: "1" },
  50231511: { label: "热门-WNBA - 季后赛", value: "2" },
};

// 这里的话
// 因为我们会有多个版本
// 需要映射到不同的赔率模板
// 所以加一个配置
// 欧洲版从100开始
// 亚洲版从0开始
const different_version_config = {
  "ouzhou-pc": 100,
  "yazhou-pc": 0,
  "new-pc": 0,
};
/**
 *
 * @param {String | Number} data_tpl_id
 * @description 这里接收的是原始id 然后 去模板中拿对应的赛事模板
 * @returns 返回出去对应的模板id
 */
export const computed_menu_to_match_templte = (data_tpl_id) => {
  let default_template_value = 1;
  let current_data_template_value =
    Number(menu_to_match_templte[data_tpl_id]?.value) +
    Number(different_version_config[PROJECT_NAME]);
  let current_data_tpl_id =
    current_data_template_value || default_template_value;
  return current_data_tpl_id;
};
