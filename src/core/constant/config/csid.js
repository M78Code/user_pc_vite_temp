 const {PROJECT_NAME}  = window.BUILDIN_CONFIG
 let project_name = PROJECT_NAME
 let football = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/football.png`; //足球
let basketball = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/basketball.png`; //篮球
let baseball = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/baseball.png`; //棒球
let ice_hockey = `${LOCAL_PROJECT_FILE_PREFIX}/image/jpg/ice_hockey.jpg`; //冰球
let tennis = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/tennis.png`; //网球
let usa_football = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/usa_football.png`; // 美足
let snooker = `${LOCAL_PROJECT_FILE_PREFIX}/image/jpg/snooker.jpg`; //斯诺克
let ping_pong = `${LOCAL_PROJECT_FILE_PREFIX}/image/jpg/ping_pong.jpg`; //乒乓球
let volleyball = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/volleyball.png`; // 排球
let badminton = `${LOCAL_PROJECT_FILE_PREFIX}/image/jpg/badminton.jpg`; //羽毛球
let handball = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/png/handball.png`; //手球
let boxing = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/png/boxing.png`; //拳击
let beach_volleyball = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/png/beach_volleyball.png`; //沙滩排球
let rugby = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/png/rugby.png`; //橄榄球
let hockey = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/png/hockey.png`; //曲棍球
let polo = `${LOCAL_PROJECT_FILE_PREFIX}/image/common/png/polo.png`; //水球
let virtual_dog = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/virtual_dog.png`; //赛狗
let virtual_racing = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/virtual_racing.png`; //赛马
let motorcycle = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/motorcycle.png`; // 虚拟摩托车
let virtual_dirt_bike_details = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/virtual_dirt_bike_details.png`; // 虚拟泥地摩托车
 


import { useMittEmit, MITT_TYPES } from "src/core/mitt/";
/**
 * @description: 获取各球种背景图片
 * @param {String} csid 球种id
 * @return {String} 返回各球种背景图片
 */
export const computed_background = (csid) => {
  let background_img = "";
  // 3棒、4冰、5网、7斯诺克、8乒乓、10羽毛球 1001虚拟足球、1002赛狗、1011赛马
  switch (csid) {
    case "1": // 足球
    case "1001": // 虚拟足球
      background_img = football;
      break;
    case "2": // 篮球
    case "1004": // 虚拟篮球
      background_img = basketball;
      break;
    case "3": // 棒球
      background_img = baseball;
      break;
    case "4": // 冰球
      background_img = ice_hockey;
      break;
    case "5": // 网球
      background_img = tennis;
      break;
    case "6": // 美足
      background_img = usa_football;
      break;
    case "7": // 斯诺克
      background_img = snooker;
      break;
    case "8": // 乒乓
      background_img = ping_pong;
      break;
    case "9": // 排球
      background_img = volleyball;
      break;
    case "10": // 羽毛球
      background_img = badminton;
      break;
    case "11": //手球
      background_img = handball;
      break;
    case "12": //拳击
      background_img = boxing;
      break;
    case "13": //沙滩排球
      background_img = beach_volleyball;
      break;
    case "14": //橄榄球
      background_img = rugby;
      break;
    case "15": //曲棍球
      background_img = hockey;
      break;
    case "16": //水球
      background_img = polo;
      break;
    case "1002": // 虚拟赛狗
      background_img = virtual_dog;
      break;
    case "1011": // 虚拟赛马
      background_img = virtual_racing;
      break;
    case "1010": // 虚拟摩托
      background_img = motorcycle;
      break;
    case "1009": // 虚拟泥地摩托车
      background_img = virtual_dirt_bike_details;
      break;
  }
  if (background_img)
    useMittEmit(MITT_TYPES.EMIT_GET_BACKGROUND_IMG, background_img);
  return background_img;
};

/**
 * 球种id枚举
 * H5/PC  对应配置文件 新增 csid_map_name 对应以下国际化
 * 例： name: i18n_t('csid_map_name.xxx')
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

// 精灵图对应的位置
export const sprite_images_postion = {
  0: 0, //下标从0开始
  1: 1,
  2: 3,
  3: 28,
  4: 2,
  5: 19,
  6: 4,
  7: 15,
  8: 7,
  9: 6,
  10: 22,
  11: 13,
  12: 10,
  13: 12,
  14: 20,
  15: 8,
  16: 14,
  17: 17,
  18: 26,
  19: 21,
  20: 16,
  21: 18,
  23: 29,
  24: 30,
  25: 31,
  28: 33,
  29: 32,
  40: 35,
  50: 9,
  100: 41,
  101: 38,
  102: 40,
  103: 39,
  10001: 36,
  10002: 37,
  10003: 38,
  30: 42,
  31: 43,
  32: 44,
  26: 45,
  27: 46,
  33: 47,
  34: 48,
  35: 49,
  36: 50,
  37: 51,
  38: 52,
  39: 53,
  22: 55,
  1010: 56,
  1002: 11,
  1001: 36,
  1004: 37,
  1011: 23,
  1009: 24,
}