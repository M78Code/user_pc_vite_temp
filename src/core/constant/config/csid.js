
/**
 * 球种id枚举
 * H5/PC  对应配置文件 新增 csid_map_name 对应以下国际化
 * 例： name: i18n.t('csid_map_name.xxx')
 */
export const CSID_CONFIG= {

  CSID_1: { csid: "1", mark: "足球", name: '' },
  CSID_2: { csid: "2", mark: "篮球" },
  CSID_3: { csid: "3", mark: "棒球" },
  CSID_4: { csid: "4", mark: "冰球" },
  CSID_5: { csid: "5", mark: "网球" },
  CSID_6: { csid: "6", mark: "美式足球" },
  CSID_7: { csid: "7", mark: "斯诺克" },
  CSID_8: { csid: "8", mark: "乒乓球" },
  CSID_9: { csid: "9", mark: "排球" },
  CSID_10: { csid: "10", mark: "羽毛球" },
  CSID_11: { csid: "11", mark: "手球" },
  CSID_12: { csid: "12", mark: "拳击" },
  CSID_13: { csid: "13", mark: "沙滩排球" },
  CSID_14: { csid: "14", mark: "联合式橄榄球" },
  CSID_15: { csid: "15", mark: "曲棍球" },
  CSID_16: { csid: "16", mark: "水球" },
  CSID_17: { csid: "17", mark: "田径" },
  CSID_18: { csid: "18", mark: "政治娱乐" },
  CSID_19: { csid: "19", mark: "游泳" },
  CSID_20: { csid: "20", mark: "体操" },
  CSID_21: { csid: "21", mark: "跳水" },
  CSID_23: { csid: "23", mark: "举重" },
  CSID_24: { csid: "24", mark: "射箭" },
  CSID_25: { csid: "25", mark: "击剑" },
  CSID_26: { csid: "26", mark: "冰壶" },
  CSID_27: { csid: "27", mark: "跆拳道" },
  CSID_28: { csid: "28", mark: "高尔夫" },
  CSID_29: { csid: "29", mark: "自行车" },
  CSID_30: { csid: "30", mark: "赛马" },
  CSID_31: { csid: "31", mark: "帆船" },
  CSID_32: { csid: "32", mark: "划船" },
  CSID_33: { csid: "33", mark: "赛车运动" },
  CSID_34: { csid: "34", mark: "柔道" },
  CSID_35: { csid: "35", mark: "空手道" },
  CSID_36: { csid: "36", mark: "摔跤" },
  CSID_37: { csid: "37", mark: "板球" },
  CSID_38: { csid: "38", mark: "飞镖" },
  CSID_39: { csid: "39", mark: "沙滩足球" },
  CSID_40: { csid: "40", mark: "其他" },
  CSID_100: { csid: "100", mark: "英雄联盟" },
  CSID_101: { csid: "101", mark: "Dota2" },
  CSID_102: { csid: "102", mark: "CS.GO" },
  CSID_103: { csid: "103", mark: "王者荣耀" },
  CSID_1001: { csid: "1001", mark: "VR足球" },
  CSID_1002: { csid: "1002", mark: "VR赛狗" },
  CSID_1007: { csid: "1007", mark: "VR泥地赛车" },
  CSID_1008: { csid: "1008", mark: "VR卡丁车" },
  CSID_1009: { csid: "1009", mark: "VR泥地摩托车" },
  CSID_1010: { csid: "1010", mark: "VR摩托车" },
  CSID_1011: { csid: "1011", mark: "VR赛马" },
  CSID_1012: { csid: "1012", mark: "VR马车赛" },


};

/**
 * 球种id 和 play_name_mapping 对应关系
 *
 */
export const play_name_mapping_csid = {
  1: "足球",
  2: "篮球",
  3: "棒球",
  4: "冰球",
  5: "网球",
  6: "美式足球",
  7: "斯诺克",
  8: "乒乓球",
  9: "排球",
  10: "羽毛球",
  11: "手球",
  12: "拳击",
  13: "沙滩排球",
  14: "橄榄球",
  15: "曲棍球",
  16: "水球",
  100: "英雄联盟",
  101: "dota2",
  102: "csgo",
  103: "王者荣耀",
  1001: "VR足球",
  1002: "VR赛狗",
  1007: "VR泥地赛车",
  1008: "VR卡丁车",
  1009: "VR泥地摩托车",
  1010: "VR摩托车",
  1011: "VR赛马",
  1012: "VR马车赛",
}


/**
 * 电子竞技
 */
export const esports_csid = [100, 101, 103, 102]

/**
 * 电竞子菜单
 */
// { ct: 0, mi: "2100", st: 1, csid: "100" },
// { ct: 0, mi: "2101", st: 2, csid: "101" },
// { ct: 0, mi: "2103", st: 3, csid: "103" },
// { ct: 0, mi: "2102", st: 4, csid: "102" },
export const dianjing_sublist = () => {
  let esport = esports_csid.map((item, index) => {
    return { ct: 0, mi: `2${item}`, st: index + 1, csid: item }
  })
  return esport
}


/**
 * H5 赛事 csid 映射二级菜单 menu_type
 */
export const csid_map_sub_menu_type = {
  1: 5,// 足球"
  2: 7,// 篮球"
  3: 19,// 棒球"
  4: 18,// 冰球"
  5: 13,// 网球"
  6: 20,// 美式足球"
  7: 14,// 斯诺克"
  8: 16,// 乒乓球"
  9: 17,// 排球"
  10: 15,// 羽毛球"
  11: 43,// 手球"
  12: 44,// 拳击"
  13: 45,// 沙滩排球"
  14: 22,// 联合式橄榄球"
  // 14: 45 ,// 橄榄球"
  15: 23,// 曲棍球"
  16: 24,// 水球"
}


/**
 * H5 赛事 csid 映射让球玩法ID
 */
export const csid_map_concede_points_id = {
  1: 4,// 足球"
  2: 39,// 篮球"
  3: 243,// 棒球"
  4: 4,// 冰球"
  5: 154,// 网球"
  6: 39,// 美式足球"
  7: 181,// 斯诺克"
  8: 172,// 乒乓球"
  9: 172,// 排球"
  10: 172,// 羽毛球"
  11: 43,// 手球"
  12: 44,// 拳击"
  13: 45,// 沙滩排球"
  14: 22,// 联合式橄榄球"
  // 14: 45 ,// 橄榄球"
  15: 23,// 曲棍球"
  16: 24,// 水球"
}
