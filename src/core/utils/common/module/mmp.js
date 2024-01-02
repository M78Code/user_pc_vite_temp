
import lodash from 'lodash'
import {   i18n_t   } from "src/boot/i18n.js";

// 获取比赛阶段是否需要查询接口
export const get_phase_result = (csid, mmp) => {
  let check_result = false;
  if (csid == 2) {  // 篮球
    if (mmp > 0 && mmp < 3) { // 上下半场
      check_result = true;
    } else if (mmp > 12 && mmp < 17) { // 第一节~第四节
      check_result = true;
    } else if (mmp == 40) { // 加时赛
      check_result = true;
    } else if (mmp == 303) { // 第三节休息
      check_result = true;
    }
  } else if (csid == 3) { // 棒球
    if (mmp > 400 && mmp < 421) { // 第一局上,第一局下~加时上,加时下
      check_result = true;
    }
  } else if (csid == 4) { // 冰球
    if (mmp > 0 && mmp < 4) { // 第一节~第三节
      check_result = true;
    } else if (mmp == 40) { // 加时赛
      check_result = true;
    }
  } else if (csid == 5) { // 网球
    if (mmp > 7 && mmp < 13) { // 第一盘~第五盘
      check_result = true;
    }
  } else if (csid == 6) { // 美式足球
    if (mmp > 12 && mmp < 17) { // 第一节~ 第四节 加时赛
      check_result = true;
    } else if (mmp == 40) { // 加时赛
      check_result = true;
    }
  } else if (csid == 7) { // 斯洛克
    if (mmp == 21) {    // 进行中
      check_result = true;
    }
  } else if (csid == 8) { // 乒乓球
    if ((mmp > 7 && mmp < 13) || (mmp > 440 && mmp < 443)) { // 第一局~第七局
      check_result = true;
    }
  } else if (csid == 9) { // 排球
    if ((mmp > 7 && mmp < 13) || mmp == 17 || (mmp > 440 && mmp < 443)) { // 第一局~第七局
      check_result = true;
    } else if (mmp == 17) { // 第五局
      check_result = true;
    }
  } else if (csid == 10) { // 羽毛球
    if ((mmp > 7 && mmp < 13)) { // 第一局~第五局
      check_result = true;
    }
  }
  return check_result;
}

/**
* @Description:格式化比赛阶段名称
* @Author success
* @param: sport_id
* @param: mmp
* @return: 比赛阶段名称
* @Date 2020/02/03 21:44:58
*/
export const get_mmp_name = (sport_id, mmp) => {
  try {
    if (!sport_id) {
      return "";
    }
    if (mmp) {
      return lodash.get(i18n_t('msc'), `${parseInt(sport_id)}.${mmp}`, "");
    }
  } catch (error) {
    console.error(error);
  }
};