// 比分榜列表头

// 引入国际化
import { i18n_t } from "src/boot/i18n.js";;
export const sport_columns = {
  1: [
    {
      name: "name",
      label: "Q4 07:31",
      align: "left",
      field: "name",
      headerStyle: {
        "margin-left": "15px",
        display: "block",
        height: "30px",
        "line-height": "30px",
      },
    },
    {
      name: "q1",
      align: "left",
      label: "Q1",
      field: "q1",
      icon: "jiao_ball",
      headerStyle: "width: 33px",
    },
    {
      name: "q2",
      align: "left",
      label: "Q2",
      field: "q2",
      // 48360 【SIT】【欧洲版二期】【PC】足球，比分板，黄牌和红牌的图标位置，需要对调
      // icon: "red_card",
      icon: "y_card",
      headerStyle: "width: 33px",
    },
    {
      name: "ht",
      align: "left",
      label: "HT",
      field: "ht",
      //48360 【SIT】【欧洲版二期】【PC】足球，比分板，黄牌和红牌的图标位置，需要对调
      // icon: "y_card",
      icon: "red_card",
      headerStyle: "width: 33px",
    },
    {
      name: "q3",
      align: "left",
      label: "Q3",
      field: "q3",
      icon: "detail_point",
      headerStyle: "width: 33px",
    },
    {
      name: "q4",
      align: "left",
      label: "Q4",
      field: "q4",
      icon: "part_ball",
      headerStyle: "width: 33px",
    },
    {
      name: "t",
      align: "left",
      label: "T",
      field: "t",
      icon: "in_ball",
      headerStyle: { width: "33px", color: "#ff7000" },
    },
  ],
  2: [
    {
      name: "name",
      label: "Q4 07:31",
      align: "left",
      field: "name",
      headerStyle: {
        "margin-left": "15px",
        display: "block",
        height: "30px",
        "line-height": "30px",
      },
    },
    {
      name: "q1",
      align: "left",
      label: "Q1",
      course: "Q1",
      courseIndex: 1,
      field: "q1",
      headerStyle: "width: 33px",
    },
    {
      name: "q2",
      align: "left",
      label: "Q2",
      course: "Q2",
      courseIndex: 2,
      field: "q2",
      headerStyle: "width: 33px",
    },
    {
      name: "ht",
      align: "left",
      courseIndex: 'HT',
      course: "HT",
      label: i18n_t("common.half_"),
      language:'common.half_',
      field: "ht",
      headerStyle: "width: 33px",
    },
    {
      name: "q3",
      align: "left",
      label: "Q3",
      courseIndex: 4,
      course: "Q3",
      field: "q3",
      headerStyle: "width: 33px",
    },
    {
      name: "q4",
      align: "left",
      course: "Q4",
      courseIndex: 5,
      label: "Q4",
      field: "q4",
      headerStyle: "width: 33px",
    },
    {
      name: "t",
      align: "left",
      label: i18n_t("common.total"),
      language:'common.total',
      field: "t",
      headerStyle: { width: "33px", color: "#ff7000" },
    },
  ],
  3: [
    {
      name: "name",
      label: "Q4 07:31",
      align: "left",
      field: "name",
      headerStyle: {
        "margin-left": "15px",
        display: "block",
        height: "30px",
        "line-height": "30px",
      },
    },
    {
      name: "q1",
      align: "left",
      label: "Q1",
      field: "q1",
      icon: "jiao_qiu",
      headerStyle: "width: 33px",
    },
    {
      name: "q2",
      align: "left",
      label: "Q2",
      field: "q2",
      icon: "red_card",
      headerStyle: "width: 33px",
    },
    {
      name: "ht",
      align: "left",
      label: "HT",
      field: "ht",
      icon: "y_card",
      headerStyle: "width: 33px",
    },
    {
      name: "q3",
      align: "left",
      label: "Q3",
      field: "q3",
      icon: "jin_quan",
      headerStyle: "width: 33px",
    },
    {
      name: "q4",
      align: "left",
      label: "Q4",
      field: "q4",
      icon: "part_qiu",
      headerStyle: "width: 33px",
    },
    {
      name: "t",
      align: "left",
      label: "T",
      field: "t",
      icon: "quan_qiu",
      headerStyle: { width: "33px", color: "#ff7000" },
    },
  ],
  4: [
    {
      name: "name",
      label: "Q4 07:31",
      align: "left",
      field: "name",
      headerStyle: {
        "margin-left": "15px",
        display: "block",
        height: "30px",
        "line-height": "30px",
      },
    },
    {
      name: "q1",
      align: "left",
      label: "1",
      course: "Q2",
      field: "q1",
      headerStyle: "width: 33px",
    },
    {
      name: "q2",
      align: "left",
      label: "2",
      course: "Q3",
      field: "q2",
      headerStyle: "width: 33px",
    },
    {
      name: "q3",
      align: "left",
      label: "3",
      field: "q3",
      course: "Q4",
      headerStyle: "width: 33px",
    },
    // {
    //   name: "set",
    //   align: "left",
    //   label: "Set",
    //   field: "set",
    //   language:'common.dish',
    //   headerStyle: "width: 33px",
    // },
    {
      name: "p",
      align: "left",
      label: "P",
      field: "p",
      language:'common.total',
      headerStyle: { width: "33px", color: "#ff7000" },
    },
  ],
  5: [
    {
      name: "name",
      label: "Q4 07:31",
      align: "left",
      field: "name",
      headerStyle: {
        "margin-left": "15px",
        display: "block",
        height: "30px",
        "line-height": "30px",
      },
    },
    {
      name: "q1",
      align: "left",
      label: "1",
      course: "Set 1",
      field: "q1",
      headerStyle: "width: 33px",
    },
    {
      name: "q2",
      align: "left",
      label: "2",
      course: "Set 2",
      field: "q2",
      headerStyle: "width: 33px",
    },
    {
      name: "q3",
      align: "left",
      label: "3",
      field: "q3",
      course: "Set 3",
      headerStyle: "width: 33px",
    },
    {
      name: "set",
      align: "left",
      label: "Set",
      field: "set",
      language:'common.dish',
      headerStyle: "width: 33px",
    },
    {
      name: "p",
      align: "left",
      label: "P",
      field: "p",
      language:'common.score_',
      headerStyle: { width: "33px", color: "#ff7000" },
    },
  ],
  8: [
    {
      name: "name",
      label: "Q4 07:31",
      align: "left",
      field: "name",
      headerStyle: {
        "margin-left": "15px",
        display: "block",
        height: "30px",
        "line-height": "30px",
      },
    },
    {
      name: "q1",
      align: "left",
      label: "1",
      field: "q1",
      course: "Babak 1",
      headerStyle: "width: 33px",
    },
    {
      name: "q2",
      align: "left",
      label: "2",
      field: "q2",
      course: "Babak 2",
      headerStyle: "width: 33px",
    },
    {
      name: "q3",
      align: "left",
      label: "3",
      field: "q3",
      course: "Babak 3",
      headerStyle: "width: 33px",
    },
    {
      name: "q4",
      align: "left",
      label: "4",
      field: "q4",
      course: "Babak 4",
      headerStyle: "width: 33px",
    },
    {
      name: "q5",
      align: "left",
      label: "5",
      field: "q5",
      course: "Babak 5",
      headerStyle: "width: 33px",
    },
    {
      name: "q6",
      align: "left",
      label: "6",
      field: "q6",
      course: "Babak 6",
      headerStyle: "width: 33px",
    },
     {
      name: "q7",
      align: "left",
      label: "7",
      field: "q7",
      course: "Babak 7",
      headerStyle: "width: 33px",
    },
    {
      name: "set",
      align: "left",
      label: "G",
      language:'common.bureau_',
      field: "set",
      headerStyle: "width: 33px",
    },
    {
      name: "p",
      align: "left",
      label: "T",
      language:'common.total',
      field: "p",
      headerStyle: { width: "33px", color: "#ff7000" },
    },
  ],
  9: [
    {
      name: "name",
      label: "Q4 07:31",
      align: "left",
      field: "name",
      headerStyle: {
        "margin-left": "15px",
        display: "block",
        height: "30px",
        "line-height": "30px",
      },
    },
    {
      name: "q1",
      align: "left",
      course: "Set 1",
      label: "1",
      field: "q1",
      headerStyle: "width: 33px",
    },
    {
      name: "q2",
      align: "left",
      label: "2",
      field: "q2",
      course: "Set 2",
      headerStyle: "width: 33px",
    },
    {
      name: "q3",
      align: "left",
      label: "3",
      field: "q3",
      course: "Set 3",
      headerStyle: "width: 33px",
    },
    {
      name: "q4",
      align: "left",
      label: "4",
      field: "q4",
       course: "Set 4",
      headerStyle: "width: 33px",
    },
    {
      name: "q5",
      align: "left",
      label: "5",
      field: "q5",
      course: "Set 5",
      headerStyle: "width: 33px",
    },
    {
      name: "set",
      align: "left",
      label: "G",
      language:'common.bureau_',
      field: "set",
      headerStyle: "width: 33px",
    },
    {
      name: "p",
      align: "left",
      label: "T",
      language:'common.total',
      field: "p",
      headerStyle: { width: "33px", color: "#ff7000" },
    },
  ],
  7: [
    {
      name: "name",
      label: "Q4 07:31",
      align: "left",
      field: "name",
      headerStyle: {
        "margin-left": "15px",
        display: "block",
        height: "30px",
        "line-height": "30px",
      },
    },
    {
      name: "q1",
      align: "left",
      label: "1",
      field: "q1",
      headerStyle: "width: 33px",
    },
    {
      name: "q2",
      align: "left",
      label: "2",
      field: "q2",
      headerStyle: "width: 33px",
    },
    {
      name: "q3",
      align: "left",
      label: "3",
      field: "q3",
      headerStyle: "width: 33px",
    },
    {
      name: "q4",
      align: "left",
      label: "4",
      field: "q4",
      headerStyle: "width: 33px",
    },
    {
      name: "q5",
      align: "left",
      label: "5",
      field: "q5",
      headerStyle: "width: 33px",
    },
    {
      name: "set",
      align: "left",
      label: "G",
      field: "set",
      headerStyle: "width: 33px",
    },
    {
      name: "p",
      align: "left",
      label: "T",
      field: "p",
      headerStyle: { width: "33px", color: "#ff7000" },
    },
  ],
  10: [
    {
      name: "name",
      label: "Q4 07:31",
      align: "left",
      field: "name",
      headerStyle: {
        "margin-left": "15px",
        display: "block",
        height: "30px",
        "line-height": "30px",
      },
    },
    {
      name: "q1",
      align: "left",
      label: "1",
      field: "q1",
      course: "Babak 1",
      headerStyle: "width: 33px",
    },
    {
      name: "q2",
      align: "left",
      label: "2",
      field: "q2",
      course: "Babak 2",
      headerStyle: "width: 33px",
    },
    {
      name: "q3",
      align: "left",
      label: "3",
      field: "q3",
      course: "Babak 3",
      headerStyle: "width: 33px",
    },
    {
      name: "set",
      align: "left",
      label: "G",
      language:'common.bureau_',
      field: "set",
      headerStyle: "width: 33px",
    },
    {
      name: "p",
      align: "left",
      label: "T",
      language:'common.total',
      field: "p",
      headerStyle: { width: "33px", color: "#ff7000" },
    },
  ],
};

/**
 * @赛事阶段
 *
 */
// 假数据
export const socre_dict = (csid) => {
  // 3棒、4冰、5网、6美足、7斯诺克、8乒乓、9排球、10羽毛球
  var dict = {
    //棒球
    3: {
      401: "S120", // "第1局上",
      // 421: "S120",// 第一局中场休息
      402: "S120", // "第1局下",

      // 422: "S121",// 第一，二局局间休息
      403: "S121", // "第2局上",
      // 423: "S121",// 第二局中场休息
      404: "S121", // "第2局下",

      // 424: "S122",// 第二，三局间休息
      405: "S122", // "第3局上",
      // 425: "S122",// 第三局中场休息
      406: "S122", // "第3局下",

      // 426: "S123",// 第三、四局间休息
      407: "S123", // "第4局上",
      // 427: "S123",// 第四局中场休息
      408: "S123", // "第4局下",

      // 428: "S124",// 第四，五局局间休息
      409: "S124", // "第5局上",
      // 429: "S124",// 第五局中场休息
      410: "S124", // "第5局下",

      // 430: "S125",// 第五，六局局间休息
      411: "S125", // "第6局上",
      // 431: "S125",// 第六局中场休息
      412: "S125", // "第6局下",

      // 432: "S126",// 第六，七局局间休息
      413: "S126", // "第7局上",
      // 433: "S126",// 第七局中场休息
      414: "S126", // "第7局下",

      // 434: "S127",// 第七，八局局间休息
      415: "S127", // "第8局上",
      // 435: "S127",// 第八局中场休息
      416: "S127", // "第8局下",

      // 436: "S128",// 第八，九局局间休息
      417: "S128", // "第9局上",
      // 437: "S128",// 第九局中场休息
      418: "S128", // "第9局下",

      // 438: "S129",//等待加时赛
      41910: "S129", // "第10局上",
      // 43910: "S129",// 第十局中场休息
      42010: "S129", // "第10局下",

      // 43810: "S130",// 第十，十一局局间休息
      41911: "S130", // "第11局上",
      // 43911: "S130",// 第十一局中场休息
      42011: "S130", // "第11局下",

      // 43811: "S131",// 第十一，十二局局间休息
      41912: "S131", // "第12局上",
      // 43912: "S131",// 第十二局中场休息
      42012: "S131", // "第12局下",

      // 41812: "S132",// 第十二，十三局局间休息
      41913: "S132", // "第13局上",
      // 43913: "S132",// 第十三局中场休息
      42013: "S132", // "第13局下",

      // 41813: "S133",// 第十三，十四局局间休息
      41914: "S133", // "第14局上",
      // 43914: "S133",// 第十四局中场休息
      42014: "S133", // "第14局下",

      // 41814: "S134",// 第十四，十五局局间休息
      41915: "S134", // "第15局上",
      // 43915: "S134",// 第十五局中场休息
      42015: "S134", // "第15局下",

      // 41815: "S135",// 第十五，十六局局间休息
      41916: "S135", // "第16局上",
      // 43916: "S135",// 第十六局中场休息
      42016: "S135", // "第16局下",

      // 41816: "S136",// 第十六，十七局局间休息
      41917: "S136", // "第17局上"
      // 43917: "S136",// 第十七局中场休息
      42017: "S136", // "第17局下"

      // 41817: "S137",// 第十七，十八局局间休息
      41918: "S137", // "第18局上"
      // 43918: "S137",// 第十八局中场休息
      42018: "S137", // "第18局下"

      // 41818: "S138",// 第十八，十九局局间休息
      41919: "S138", // "第19局上"
      // 43919: "S138",// 第十九局中场休息
      42019: "S138", // "第19局下"

      // 41819: "S139",// 第十九，二十局局间休息
      41920: "S139", // "第20局上"
      // 43920: "S139",// 第二十局中场休息
      42020: "S139", // "第20局下"
    },
    //冰球
    4: {
      1: "S120",
      301: "S121", //第1节休息
      2: "S121",
      302: "S122", //第2节休息
      3: "S122",
    },
    //【网球】——根据mmp
    5: {
      8: "S23",
      9: "S39",
      10: "S55",
      11: "S71",
      12: "S87",
    },
    //美足
    6: {
      13: "S19",
      301: "S20", //第1节休息
      14: "S20",
      302: "S21", //第2节休息
      15: "S21",
      303: "S22", //第3节休息
      16: "S22",
    },
    //【斯诺克】——根据mct
    7: {
      1: "S120",
      2: "S121",
      3: "S122",
      4: "S123",
      5: "S124",
      6: "S125",
      7: "S126",
      8: "S127",
      9: "S128",
      10: "S129",
      11: "S130",
      12: "S131",
      13: "S132",
      14: "S133",
      15: "S134",
      16: "S135",
      17: "S136",
      18: "S137",
      19: "S138",
      20: "S139",
      21: "S140",
      22: "S141",
      23: "S142",
      24: "S143",
      25: "S144",
      26: "S145",
      27: "S146",
      28: "S147",
      29: "S148",
      30: "S149",
      31: "S150",
      32: "S151",
      33: "S152",
      34: "S153",
      35: "S154",
      36: "S155",
      37: "S156",
      38: "S157",
      39: "S158",
      40: "S159",
    },
    //【乒乓球】——根据mmp
    8: {
      // 第1局
      8: "S120",
      // 第1局间休息|第2局
      301: "S121",
      9: "S121",
      // 第2局间休息|第3局
      302: "S122",
      10: "S122",
      // 第3局间休息|第4局
      303: "S123",
      11: "S123",
      // 第4局间休息|第5局
      304: "S124",
      12: "S124",
      // 第5局间休息|第6局
      305: "S125",
      441: "S125",
      // 第6局间休息|第7局
      306: "S126",
      442: "S126",
    },
    //排球
    9: {
      // 第1局
      8: "S120",
      // 第1局间休息|第2局
      301: "S121",
      9: "S121",
      // 第2局间休息|第3局
      302: "S122",
      10: "S122",
      // 第3局间休息|第4局
      303: "S123",
      11: "S123",
      // 第4局间休息|第5局
      304: "S124",
      12: "S124",
      // 第5局间休息|第6局
      305: "S125",
      441: "S125",
      // 第6局间休息|第7局
      306: "S126",
      442: "S126",
    },
    //【羽毛球】——根据mmp
    10: {
      // 第1盘
      8: "S120",
      // 第1盘间休息、第2盘
      301: "S121",
      9: "S121",
      // 第2盘间休息、第3盘
      302: "S122",
      10: "S122",
      // 第3盘间休息、第4盘
      303: "S123",
      11: "S123",
      // 第4盘间休息、第5盘
      304: "S124",
      12: "S124",
    },
  };
  return dict[csid];
};

// title 用方法返回解决国际化文字需要刷新才能生效的问题
// Bug单号：49705
export const allBallObj = {
  2: [
    {
      title: () => `2 ${i18n_t("common.score")}`,
      value_key: "S107",
    },
    {
      title: () => `3 ${i18n_t("common.score")}`,
      value_key: "S108",
    },
    {
      title: () => i18n_t("common.foul"),
      value_key: "S106",
    },
  ],
  5: [
    {
      title: () => `${i18n_t("msc.S114")}`,
      value_key: "S114",
    },
    {
      title: () => `${i18n_t('common.fault')}`,
      value_key: "S202",
    },
    {
      title: () => `${i18n_t('common.ace')}`,
      value_key: "S4",
    },
  ],
  7: [
    {
      title: () => `${i18n_t('common.ace')}`,
      value_key: "S4",
    },
    {
      title: () => `${i18n_t('common.sigle_fault')}`,
      value_key: "S113",
    }
  ],
  9: [
    {
      title: () => `${i18n_t('common.ace')}`,
      value_key: "S4",
    },
    {
      title: () => `${i18n_t('common.sigle_fault')}`,
      value_key: "S113",
    }
  ],
  10: [
    {
      title: () => `${i18n_t('common.score_')}`,
      value_key: "S115",
    },
    {
      title: () => `${i18n_t("common.receiving_point_score")}`,
      value_key: "S116",
    },
    {
      title: () => `${i18n_t('common.ace')}`,
      value_key: "S117",
    },
  ],
};
