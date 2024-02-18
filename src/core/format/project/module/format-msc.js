/*
 * @Description: H5 各球种比分处理
 */
import { ref } from 'vue'
import lodash from 'lodash'
import { i18n_t } from "src/boot/i18n.js";
import { MenuData} from "src/output/project/index.js"

import PageSourceData from "src/core/page-source/page-source.js";

// TODO: 待替换菜单模块 store
const get_current_menu = ref(MenuData.current_menu)
const footer_sub_menu_id = ref(MenuData.footer_sub_menu_id)
const get_newer_standard_edition = ref(PageSourceData.get_newer_standard_edition())
/**
 * @Description:格式化比分数据
 * @Author success
 * @param: key   (S151)
 * @return: 返回分隔后的数组
 * @Date 2020/02/03 21:44:58
 */
export const format_msc = (str) => {
  if (!str) {
    return [];
  }
  let list_ = str.split(/[:|]/);
  for (let i = 0, l = 3 - list_.length; i < l; i++) {
    list_.push('');
  }
  list_.push(i18n_t('msc')[list_[0]]);

  return list_;
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
  if (!sport_id) {
    return '';
  }
  return i18n_t(`mmp.${parseInt(sport_id)}.${mmp}`);
}
/**
 * @description: 获取S1比分
 * @param {Object} match
 * @return {Array}
 */
export const get_match_s1 = (match) => {
  let result = [];
  match.msc.forEach(f_score => {
    if (f_score.indexOf('S1|') > -1) {
      format_msc(f_score)
    }
  });
  return result;
}
/**
 * @description: 获取红牌数
 * @param {Object} match
 * @return {Undefined}
 */
export const get_punish_score = (match) => {
  if (!match || !match.msc || !match.msc.forEach) return;
  match.msc.forEach(f_score => {
    //红牌
    if (f_score.indexOf('S11|') > -1) {
      let score2 = f_score.split('S11|')[1];
      match.home_red_score = score2.split(':')[0] * 1;
      match.away_red_score = score2.split(':')[1] * 1;
    }
    //黄牌
    if (f_score.indexOf('S12|') > -1) {
      let score2 = f_score.split('S12|')[1];
      match.home_yellow_score = score2.split(':')[0] * 1;
      match.away_yellow_score = score2.split(':')[1] * 1;
    }
  });
}
/**
 * @description: 在match对象上添加  msc_list_dict 数组字段
 * @param {Object} match
 * @param {Object} msc_dict
 * @return {Undefined}
 */
export const full_msc = (match, msc_dict) => {
  if (!match.msc) match.msc = [];
  match.msc_list_dict = [];
  msc_dict.forEach(msc_d => {
    let found = null;
    match.msc.forEach(m_msc => {
      if (m_msc.indexOf(`${msc_d}|`) > -1) {
        found = m_msc;
      }
    });
    if (found) {
      match.msc_list_dict.push(found);
    } else {
      match.msc_list_dict.push(`${msc_d}|-:-`);
    }
  });
}
/**
 * @description: 网球比分处理
 * @param {Object} match 赛事对象
 * @return {Undefined}
 */
export const tennis_score_handle = (match) => {
  let msc_dict = ['S1', 'S23', 'S39', 'S55'];  //全场大比分 第一盘 第二盘 第三盘比分
  full_msc(match, msc_dict);

  let msc_list = [], dict_msc_list = [];
  let current_score_split = 'S1|';
  if (match.msc && match.msc.length) {
    match.msc.forEach(f_score => {
      if (f_score.indexOf(current_score_split) > -1) {
        let score2 = f_score.split(current_score_split)[1];
        match.home_score = score2.split(':')[0];
        match.away_score = score2.split(':')[1];
      }
      else {
        let code = f_score.split('|')[0];
        if (['S23', 'S39', 'S55', 'S71', 'S87'].includes(code)) {
          msc_list.push(format_msc(f_score));
        }
      }
    });
    msc_list.sort((a, b) => {
      let a_code, b_code;
      try {
        a_code = a[0].split('S')[1] * 1;
        b_code = b[0].split('S')[1] * 1;
      } catch (e) { console.error(e); }
      return a_code - b_code;
    });
    if (!match.home_score) match.home_score = 0;
    if (!match.away_score) match.away_score = 0;
    match.msc_format = msc_list;
  }
  match.msc_list_dict && match.msc_list_dict.length && match.msc_list_dict.forEach(dict => {
    dict_msc_list.push(format_msc(dict));
  });
  match.msc_s_format = dict_msc_list;

  // 标准版只显示当前局比分
  if (get_newer_standard_edition.value == 2 && msc_list.length > 0) {
    let found_valid_msc = [];
    msc_list.forEach(msc => {
      if (msc && msc.length > 1) {
        if (msc[1] && msc[1] != '-') {
          found_valid_msc.push(msc);
        }
      }
    });
    match.latest_score = found_valid_msc.slice(found_valid_msc.length - 1, found_valid_msc.length);
  }
  return msc_list;
}
/**
 * @description: 羽毛球比分处理
 * @param {Object} match 赛事对象
 * @return {Undefined}
 */
export const badminton_score_handle = (match) => {
  let score_index_map = {
    "8": 1,
    "301": 2,
    "9": 2,
    "302": 3,
    "10": 3,
    "303": 4,
    "11": 4,
    "304": 5,
    "12": 5
  };
  let number_code_map = {
    1: '8',
    2: '9',
    3: '10',
    4: '11',
    5: '12',
  };
  let max_index = score_index_map[match.mmp];

  let msc_dict = ['S1', 'S120', 'S121', 'S122', 'S123', 'S124'];

  //region 判断是否为七局五胜制
  let is_7;
  if (match.mft == 7) {
    is_7 = true;
  }
  else {
    if (match.mfo) {
      is_7 = match.mfo.indexOf('7') > -1;
      if (!is_7) {
        is_7 = match.mfo.indexOf('七') > -1;
      }
    }
    if (!is_7) is_7 = match.msc.length > 7;
  }
  if (is_7) {
    msc_dict = ['S1', 'S120', 'S121', 'S122', 'S123', 'S124', 'S125', 'S126'];
  }
  //endregion

  full_msc(match, msc_dict);

  let msc_list = [], dict_msc_list = [];

  if (match.msc) {
    let found_dict_i = -1;
    // 按照球类取出得分(出去犯规比分等)
    msc_dict.forEach((dict, dict_i) => {
      let msc_code = dict + '|';
      match.msc.forEach(f_score => {
        if (f_score.indexOf(msc_code) > -1) {
          found_dict_i = dict_i;
          msc_list.push(format_msc(f_score));
        }
      });
    });
    // 赛事到达局间休息时,初始化下一局比分为0-0并显示
    let max_count = max_index + 1;
    if (msc_list.length < max_count) {
      for (let i = msc_list.length; i < max_count; i++) {
        if (msc_dict[i]) {
          let f_score = `${msc_dict[i]}|0:0`;
          msc_list.push(format_msc(f_score));
        }
      }
    }

    // 如果下一局比分先到达,mmp后到达,则根据比分来确定当前局数mmp的值
    if (found_dict_i >= max_index) {
      match.mmp = number_code_map[found_dict_i];
    }

    //获取当前比分
    let mmp_num = match.mmp * 1;
    if ([301, 302, 303, 304, 305, 306].includes(mmp_num)) {
      match.home_score = 0;
      match.away_score = 0;
    }
    else {
      msc_list.forEach((f_score, i) => {
        if (f_score[0] == 'S1') {
          match.home_score = f_score[1];
          match.away_score = f_score[2];
        }
      });
    }
    match.msc_format = msc_list;
  }

  match.msc_list_dict.forEach(dict => {
    dict_msc_list.push(format_msc(dict));
  });
  match.msc_s_format = dict_msc_list;

  // 标准版只显示当前局比分
  if (get_newer_standard_edition.value == 2 && msc_list.length > 1) {
    let found_valid_msc = [];
    msc_list.forEach(msc => {
      if (msc && msc.length > 1) {
        if (msc[1] && msc[1] != '-') {
          found_valid_msc.push(msc);
        }
      }
    });
    match.latest_score = found_valid_msc.slice(found_valid_msc.length - 1, found_valid_msc.length);
  }
  return msc_list;
}
/**
 * @description: 乒乓球比分处理
 * @param {Object}  match 赛事对象
 * @return {Object}
 */
export const pingpong_score_handle = (match) => {
  let score_index_map = {
    "8": 1,
    "301": 2,
    "9": 2,
    "302": 3,
    "10": 3,
    "303": 4,
    "11": 4,
    "304": 5,
    "12": 5,
    "305": 6,
    "441": 6,
    "306": 7,
    "442": 7,
  };
  let number_code_map = {
    1: '8',
    2: '9',
    3: '10',
    4: '11',
    5: '12',
    6: '441',
    7: '442',
  };

  let max_index = score_index_map[match.mmp];

  let msc_dict = ['S1', 'S120', 'S121', 'S122', 'S123', 'S124'];

  //region 判断是否为七局五胜制
  let is_7;
  if (match.mft == 7) {
    is_7 = true;
  }
  else {
    if (match.mfo) {
      is_7 = match.mfo.indexOf('7') > -1;
      if (!is_7) {
        is_7 = match.mfo.indexOf('七') > -1;
      }
    }
    if (!is_7) is_7 = match.msc.length > 7;
  }

  if (is_7) {
    msc_dict = ['S1', 'S120', 'S121', 'S122', 'S123', 'S124', 'S125', 'S126'];
  }
  //endregion

  full_msc(match, msc_dict);

  let msc_list = [], dict_msc_list = [];

  // 按从小到大顺序获取比分序列
  if (match.msc) {
    let found_dict_i = -1;
    // 按照球类取出得分(出去犯规比分等)
    msc_dict.forEach((dict, dict_i) => {
      let msc_code = dict + '|';
      match.msc.forEach(f_score => {
        if (f_score.indexOf(msc_code) > -1) {
          found_dict_i = dict_i;
          msc_list.push(format_msc(f_score));
        }
      });
    });
    // 赛事到达局间休息时,初始化下一局比分为0-0并显示
    let max_count = max_index + 1;
    if (msc_list.length < max_count) {
      for (let i = msc_list.length; i < max_count; i++) {
        if (msc_dict[i]) {
          let f_score = `${msc_dict[i]}|0:0`;
          msc_list.push(format_msc(f_score));
        }
      }
    }

    // 如果下一局比分先到达,mmp后到达,则根据比分来确定当前局数mmp的值
    if (found_dict_i >= max_index) {
      match.mmp = number_code_map[found_dict_i];
    }

    //获取当前比分
    // let mmp_num = match.mmp * 1;
    // if([301,302,303,304,305,306].includes(mmp_num)){
    //   match.home_score = 0;
    //   match.away_score = 0;
    // }
    // else
    // {
    // }
    msc_list.forEach((f_score, i) => {
      if (f_score[0] == 'S1') {
        match.home_score = f_score[1];
        match.away_score = f_score[2];
      }
    });
    match.msc_format = msc_list;
  }
  match.msc_list_dict.forEach(dict => {
    dict_msc_list.push(format_msc(dict));
  });
  match.msc_s_format = dict_msc_list;

  // 标准版只显示当前局比分
  if (get_newer_standard_edition.value == 2 && msc_list.length > 1) {
    let found_valid_msc = [];
    msc_list.forEach(msc => {
      if (msc && msc.length > 1) {
        if (msc[1] && msc[1] != '-') {
          found_valid_msc.push(msc);
        }
      }
    });
    match.latest_score = found_valid_msc.slice(found_valid_msc.length - 1, found_valid_msc.length);
  }
  return msc_list;
}
/**
 * @description: 斯诺克比分处理
 * @param {Object} match 赛事对象
 * @return {Object}
 */
export const snoocker_score_handle = (match) => {

  let key_str = '1,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140';
  // let key_array = key_str.split(',');

  // let count = 0;
  // try {
  //   if (match.mfo) {
  //     count = match.mfo.match(/\d*/)[0] * 1;
  //   }
  // } catch (e) { console.error(e); }
  // if (isNaN(count) || count < 6) {
  //   count = 6;
  // } else {
  //   count = 12;
  // }

  // key_array = key_array.slice(0, count);

  const msc_array = []
  for(let i = 120; i<= 159; i ++){
    msc_array.push(`${i}`);
  }

  let msc_dict = msc_array.map(k => `S${k}`);
  full_msc(match, msc_dict);

  let msc_list = [], s1_score = null, dict_msc_list = [];
  if (match.msc && match.msc.length) {
    let score_list = [];
    match.msc.forEach(f_score => {
      if (f_score.indexOf('S1|') > -1) {
        s1_score = format_msc(f_score);
      } else {
        score_list.push(format_msc(f_score));
      }
    });
    score_list.forEach((f_score) => {
      let code = f_score[0];
      if (msc_array.includes(code.replace('S', ''))) {
        msc_list.push(f_score);
      }
    });

    if (s1_score && s1_score[1] && s1_score[2]) {
      match.home_score = s1_score[1];
      match.away_score = s1_score[2];
    }

    msc_list.sort((a, b) => {
      let a_code, b_code;
      try {
        a_code = a[0].split('S')[1] * 1;
        b_code = b[0].split('S')[1] * 1;
      } catch (e) { console.error(e); }
      return a_code - b_code;
    });

    if (!match.home_score) match.home_score = 0;
    if (!match.away_score) match.away_score = 0;
    match.msc_format = msc_list;

  }

  match.msc_list_dict.forEach(dict => {
    dict_msc_list.push(format_msc(dict));
  });
  match.msc_s_format = dict_msc_list;
  return { msc_list, s1_score };
}
/**
 * 足球比分类型无加时赛无点球大战:0, 有点球大战:1, 无点球大战有加时赛:2 .
 */
export const foot_ball_score_type = (match) => {
  //常规赛全场(S1)比分
  let result = 'S1|';
  let penalty_shoot = 'S170|', is_penalty = false;
  let is_overtime_f = 'S7|', is_overtime = false;
  if (match.csid == 1 || match.csid == 11) {
    if (lodash.get(get_current_menu.value, 'main.menuType') == 28) {
      //有点球大战 S170
      match.msc.forEach(f_score => {
        if (f_score.indexOf(penalty_shoot) > -1) is_penalty = true;
      });
      if (is_penalty) result = penalty_shoot;
      //无点球有加时赛 S7
      if (!is_penalty) {
        match.msc.forEach(f_score => {
          if (f_score.indexOf(is_overtime_f) > -1) is_overtime = true;
        });
        if (is_overtime) result = is_overtime_f;
      }
    }
  }
  return result;
}
/**
 * @description: 足球篮球
 * @param {Object} match
 * @return {Array}
 */
export const foot_basket_ball = (match) => {
  if (match.msc && match.msc.length) {
    //常规赛全场(S1)比分
    let split = 'S1|';
    if ([41, 32, 33, 42, 110].includes(match.mmp * 1)) {
      split = 'S7|';
    } else if ([34, 50, 120].includes(match.mmp * 1)) {
      split = 'S170|';
    }
    if (match.csid == 1 || match.csid == 11) {
      if (footer_sub_menu_id.value == 114) { // 角球玩法
        split = 'S5|';
      }
      if (lodash.get(get_current_menu.value, 'main.menuType') == 28) { //赛果只显示S1 单号8410
        split = 'S1|';
      }
    }
    let found_full_score = false;
    match.msc.forEach(f_score => {
      if (f_score.indexOf(split) > -1) {
        let sliced = format_msc(f_score);
        match.home_score = sliced[1];
        match.away_score = sliced[2];
        found_full_score = true;
      }
    });
    if (!found_full_score) {
      match.home_score = 0;
      match.away_score = 0;
    }
  }

  let msc_list_dict = [];
  if (match.msc_list_dict && match.msc_list_dict.length) {
    match.msc_list_dict.forEach(f_score => {
      let formated_msc = format_msc(f_score);
      formated_msc = football_score_no(match, formated_msc);
      msc_list_dict.push(formated_msc);
    });
    match.msc_s_format = msc_list_dict;
  }
  match.msc_format = msc_list_dict;
  return msc_list_dict;
}
/**
 * 附加足球比分编号
 * @param {Object} match 赛事对象
 * @return {Array}
 */
export const football_score_no = (match, list_) => {
  if ([1, 11, 14, 15, 16].includes(+match.csid)) {
    // 角球
    if (list_[0] == 'S5') {
      list_.push('KK');
    }
    // 上半场进球数
    else if (list_[0] == 'S2') {
      list_.push('HT');
    }
    //上下半场总进球数
    else if (list_[0] == 'S1') {
      list_.push('FT');
    }
    //加时赛比分
    else if (list_[0] == 'S7') {
      list_.push('OT');
    }
    //点球大战比分
    else if (list_[0] == 'S170') {
      list_.push('PEN');
    }
  }
  return list_;
}
/**
 * @description: 篮球比分处理
 * @param {Object} match 赛事对象
 * @return {Object}
 */
export const basket_ball_score_handle = (match) => {
  // 全场比分/1/2/上半场/3/4/下半场;
  let msc_dict = ["S1", "S2", "S3"];
  // 标准四节比分S2 = S19 + S20  S3 = S21 + S22
  // S2/S3 上下半场
  let is_four_sections = false;  //按四节返回比分
  if (match.msc && match.msc.length) {
    match.msc.forEach(msx_d => {
      if (msx_d.indexOf('S19|') > -1 || msx_d.indexOf('S20|') > -1 ||
        msx_d.indexOf('S21|') > -1 || msx_d.indexOf('S22|') > -1) {
        is_four_sections = true;
      }
    });
  }
  if (is_four_sections) {
    msc_dict = ["S19", "S20", "S21", "S22", "S7"];
  }
  else {
    msc_dict = ["S2", "S3", "S7"];
  }
  //中场休息
  if (match.mmp == 31) {
    msc_dict = ["S2"];
  }
  if (match.mle == 73) {
    msc_dict = ["S1", "S2", "S3"];
  }
  full_msc(match, msc_dict);
  let result = foot_basket_ball(match); // 篮球足球比分处理
  if (match.msc_s_format && match.msc_s_format.length > 2) {
    let sorted = [];
    msc_dict.forEach(key => {
      let r = match.msc_s_format.filter(msc_s => {
        if (msc_s && msc_s[0]) {
          return key === msc_s[0];
        }
        return false;
      })[0];

      if (!r) {
        r = [key, '', '', ''];
      }
      sorted.push(r);
    });
    match.msc_s_format = sorted;
  }
  else {
    match.msc_s_format = msc_dict.map(dic => {
      let title = i18n_t('msc')[dic];
      return [dic, '', '', title];
    });
  }
  match.msc_format = match.msc_s_format;

  // 标准版只显示当前局比分
  if (get_newer_standard_edition.value == 2 && result.length > 1) {
    let found_valid_msc = [];
    result.forEach(msc => {
      if (msc && msc.length > 1) {
        if (msc[1] && msc[1] != '-') {
          found_valid_msc.push(msc);
        }
      }
    });
    match.latest_score = found_valid_msc.slice(found_valid_msc.length - 1, found_valid_msc.length);
  }
  return result;
}
/**
 * @description: 足球比分处理
 * @param {Object} match 赛事对象
 * @return {Object}
 */
export const foot_ball_score_handle = (match) => {
  // 角球:S5 上半场:S2 全场比分:S1 下半场:S3 红牌:S11 黄牌:S12 点球:S10 加时:S7 点球大战:S170
  let msc_dict = ["S5", "S2", "S3", "S1", "S7"];
  // 110-加时结束的时候，显示：角球、半场（HT）、全场（FT）、加时比分（OT）
  // 34-等待点球大战的是，显示：角球、半场（HT）、全场（FT）、加时比分（OT）
  // 50-点球大战的时候，显示：角球、半场（HT）、全场（FT）、加时比分（OT） 
  if ([110, 34, 50].includes(match.mmp * 1)) {
    msc_dict = ["S5", "S2", "S1", "S7"];
  }
  else if ([100, 32, 33].includes(match.mmp * 1)) {
    msc_dict = ["S5", "S2", "S1"];
  }
  else if ([0, 6].includes(match.mmp * 1)) { //上半场 加时赛上半场
    msc_dict = ["S5"];
  }
  else if (match.mmp == 31) { // 中场休息
    msc_dict = ["S5", "S2"];
  }
  else if (match.mmp == 7) { // 下半场
    msc_dict = ["S5", "S2"];
  }
  else if ([41, 42].includes(match.mmp * 1)) { // 加时下半场
    msc_dict = ["S5", "S2", "S1"];
  }
  else if (match.mmp == 50) { // 点球大战
    msc_dict = ["S5", "S1", "S7"];
  }
  // 手球 点球大战结束
  if (match.csid == 11) {
    msc_dict = ['S2', "S1"];
    if (match.mmp == 120) {
      msc_dict = ['S2', "S1", "S7", "S170"];
    }
  }
  // 英式橄榄球
  if (match.csid == 14) {
    msc_dict = ['S2', "S7", "S170", "S1"];
  }
  // 曲棍球
  if (match.csid == 15) {
    msc_dict = ['S19', "S20", "S21", "S22", "S7", "S170"];
  }
  // 赛果
  if (lodash.get(get_current_menu.value, 'main.menuType') == 28) {
    let splited_type = foot_ball_score_type(match);
    if (splited_type == "S1|") { //无点球大战无加时赛
      msc_dict = ["S5", "S2"];
    }
    else if (splited_type == "S170|") { //有点球大战
      msc_dict = ["S5", "S2", "S1", "S7", "S170"];
    }
    else if (splited_type == "S7|") { //有加时赛无点球大战
      msc_dict = ["S5", "S2", "S1", "S7"];
    }
  }
  full_msc(match, msc_dict);
  let result = foot_basket_ball(match);
  if (match.msc_s_format) {
    let sorted = [];
    msc_dict.forEach(key => {
      let r = match.msc_s_format.filter(msc_s => key === msc_s[0]);
      r && r.length && sorted.push(r[0]);
    });
    match.msc_s_format = sorted;
  } else {
    match.msc_s_format = msc_dict.map(dic => {
      let title = i18n_t('msc')[dic];
      return [dic, '', '', title];
    });
  }
  match.latest_score = result;
  return result;
}
/**
 * @description: 棒球比分处理
 * @param {Object} match 赛事对象
 * @return {Object}
 */
export const baseball_score_handle = (match) => {
  let msc_dict = ['S1', 'S3014'];
  msc_dict = ['S120', 'S121', 'S122', 'S123', 'S124', 'S125', 'S126', 'S127', 'S128', 'S129', 'S130', 'S131', 'S132',
    'S133', 'S134', 'S135', 'S136', 'S137', 'S138', 'S139', 'S140', 'S141', 'S142',
    'S143', 'S144', 'S145', 'S146'];
  // H5使用了这个方法
  full_msc(match, msc_dict);
  let msc_list = [], dict_msc_list = [];

  // 按从小到大顺序获取比分序列
  if (match.msc) {
    // 按照球类取出得分(除去犯规比分等)
    msc_dict.forEach((dict, dict_i) => {
      let msc_code = dict + '|';
      match.msc.forEach(f_score => {
        if (f_score.indexOf(msc_code) > -1) {
          msc_list.push(format_msc(f_score));
        }
      });
    });

    let msc_a0 = null;
    match.msc.forEach(f_score => {
      if (f_score.indexOf('S1|') > -1) {
        msc_a0 = format_msc(f_score);
      }
    });

    //获取当前比分
    if (msc_a0 && msc_a0.length) {
      match.home_score = msc_a0[1];
      match.away_score = msc_a0[2];
    }
    else {
      match.home_score = 0;
      match.away_score = 0;
    }

    match.msc_format = msc_list;
  }

  match.msc_list_dict.forEach(dict => {
    dict_msc_list.push(format_msc(dict));
  });
  match.msc_s_format = dict_msc_list;
  match.latest_score = msc_list;
  return msc_list;
}
/**
 * @description: 冰球比分处理
 * @param {Object} match 赛事对象
 * @return {Object}
 */
export const ice_hockey_score_handle = (match) => {
  //S170 点球大战
  let msc_dict = ['S1', 'S120', 'S121', 'S122', 'S123', 'S124', 'S7', 'S170'];  //全场大比分 第一局 第二局 第三局... 以此类推
  let score_index_map = {
    "0": 1,
    "1": 1,
    "301": 2,
    "2": 2,
    "302": 3,
    "3": 3
  };

  let max_index = score_index_map[match.mmp];

  full_msc(match, msc_dict);

  let msc_list = [], dict_msc_list = [];

  // 按从小到大顺序获取比分序列
  if (match.msc) {
    let found_dict_i = -1;
    // 按照球类取出得分(除去犯规比分等)
    msc_dict.forEach((dict, dict_i) => {
      let msc_code = dict + '|';
      match.msc.forEach(f_score => {
        if (f_score.indexOf(msc_code) > -1) {
          found_dict_i = dict_i;
          msc_list.push(format_msc(f_score));
        }
      });
    });
    // 赛事到达局间休息时,初始化下一局比分为0-0并显示
    let max_count = max_index + 1;
    if (msc_list.length < max_count) {
      for (let i = msc_list.length; i < max_count; i++) {
        if (msc_dict[i]) {
          let f_score = `${msc_dict[i]}|0:0`;
          msc_list.push(format_msc(f_score));
        }
      }
    }

    //获取当前比分
    if (msc_list && msc_list.length) {
      let f_score = msc_list[0];
      match.home_score = f_score[1];
      match.away_score = f_score[2];
    }
    else {
      match.home_score = 0;
      match.away_score = 0;
    }

    match.msc_format = msc_list;
  }

  match.msc_list_dict.forEach(dict => {
    dict_msc_list.push(format_msc(dict));
  });
  match.msc_s_format = dict_msc_list;

  // 标准版只显示当前局比分
  if (get_newer_standard_edition.value == 2 && msc_list.length > 1) {
    let found_valid_msc = [];
    msc_list.forEach(msc => {
      if (msc && msc.length > 1) {
        if (msc[1] && msc[1] != '-') {
          found_valid_msc.push(msc);
        }
      }
    });
    match.latest_score = found_valid_msc.slice(found_valid_msc.length - 1, found_valid_msc.length);
  }
  return msc_list;
}
/**
 * @description: 美式足球比分处理
 * @param {Object} match 赛事对象
 * @return {Object}
 */
export const us_football_score_handle = (match) => {
  let msc_dict = ['S19', 'S20', 'S21', 'S22'];  //第一局 第二局 第三局 第四局比分

  full_msc(match, msc_dict);

  let msc_list = [], dict_msc_list = [];

  // 按从小到大顺序获取比分序列
  if (match.msc) {
    let found_dict_i = -1;
    // 按照球类取出得分(除去犯规比分等)
    msc_dict.forEach((dict, dict_i) => {
      let msc_code = dict + '|';
      match.msc.forEach(f_score => {
        if (f_score.indexOf(msc_code) > -1) {
          found_dict_i = dict_i;
          msc_list.push(format_msc(f_score));
        }
      });
    });
    let s1_list = null;
    match.msc.forEach(score => {
      if (score.indexOf('S1|') > -1) {
        s1_list = score.split('S1|')[1].split(':');
      }
    });
    //获取当前比分
    if (s1_list && s1_list.length) {
      match.home_score = s1_list[0];
      match.away_score = s1_list[1];
    }
    else {
      match.home_score = 0;
      match.away_score = 0;
    }

    match.msc_format = msc_list;
  }

  match.msc_list_dict.forEach(dict => {
    dict_msc_list.push(format_msc(dict));
  });
  match.msc_s_format = dict_msc_list;

  // 标准版只显示当前局比分
  if (get_newer_standard_edition.value == 2 && msc_list.length > 1) {
    let found_valid_msc = [];
    msc_list.forEach(msc => {
      if (msc && msc.length > 1) {
        if (msc[1] && msc[1] != '-') {
          found_valid_msc.push(msc);
        }
      }
    });
    match.latest_score = found_valid_msc.slice(found_valid_msc.length - 1, found_valid_msc.length);
  }
  return msc_list;
}
/**
 * @description: 排球比分处理
 * @param {Object} match 赛事对象
 * @return {Array}
 */
export const volleyball_score_handle = (match) => {
  let msc_dict = ['S1', 'S120', 'S121', 'S122', 'S123', 'S124'];  //全场大比分 第一局 第二局 第三局比分

  full_msc(match, msc_dict);

  let msc_list = [], dict_msc_list = [];

  // 按从小到大顺序获取比分序列
  if (match.msc) {
    let found_dict_i = -1;
    // 按照球类取出得分(除去犯规比分等)
    msc_dict.forEach((dict, dict_i) => {
      let msc_code = dict + '|';
      match.msc.forEach(f_score => {
        if (f_score.indexOf(msc_code) > -1) {
          found_dict_i = dict_i;
          msc_list.push(format_msc(f_score));
        }
      });
    });

    //获取当前比分
    // if(msc_list && msc_list.length){
    //   let f_score = msc_list[msc_list.length - 1];
    //   match.home_score = f_score[1];
    //   match.away_score = f_score[2];
    // }
    // else{
    //   match.home_score = 0;
    //   match.away_score = 0;
    // }
    msc_list.forEach((f_score, i) => {
      if (f_score[0] == 'S1') {
        match.home_score = f_score[1];
        match.away_score = f_score[2];
      }
    });

    match.msc_format = msc_list;
  }

  match.msc_list_dict.forEach(dict => {
    dict_msc_list.push(format_msc(dict));
  });
  match.msc_s_format = dict_msc_list;

  // 标准版只显示当前局比分
  if (get_newer_standard_edition.value == 2 && msc_list.length > 1) {
    let found_valid_msc = [];
    msc_list.forEach(msc => {
      if (msc && msc.length > 1) {
        if (msc[1] && msc[1] != '-') {
          found_valid_msc.push(msc);
        }
      }
    });
    match.latest_score = found_valid_msc.slice(found_valid_msc.length - 1, found_valid_msc.length);
  }
  return msc_list;
}
/**
 * 曲棍球
 * @param {Object} match 赛事对象
 * @returns {Array} 比分数组
 */
export const hockey_score_handle = (match) => {
  let msc_dict = ['S19', 'S20', 'S21', 'S22', 'S7', 'S170'];  //第一局 第二局 第三局 第四局 点球比分
  full_msc(match, msc_dict);
  let msc_list = [], dict_msc_list = [];

  // 按从小到大顺序获取比分序列
  if (match.msc) {
    let found_dict_i = -1;
    // 按照球类取出得分(除去犯规比分等)
    msc_dict.forEach((dict, dict_i) => {
      let msc_code = dict + '|';
      match.msc.forEach(f_score => {
        if (f_score.indexOf(msc_code) > -1) {
          found_dict_i = dict_i;

          let formated_msc = format_msc(f_score);
          formated_msc = football_score_no(match, formated_msc);
          msc_list.push(formated_msc);

        }
      });
    });

    match.msc.forEach(f_score => {
      if (f_score.indexOf('S1|') > -1) {
        let full_score = format_msc(f_score);
        match.home_score = full_score[1];
        match.away_score = full_score[2];
      }
    });

    match.msc_format = msc_list;
  }
  match.msc_list_dict.forEach(dict => {
    dict_msc_list.push(format_msc(dict));
  });
  match.msc_s_format = dict_msc_list;
  // 标准版只显示当前局比分
  if (get_newer_standard_edition.value == 2 && msc_list.length > 1) {
    let found_valid_msc = [];
    msc_list.forEach(msc => {
      if (msc && msc.length > 1) {
        if (msc[1] && msc[1] != '-') {
          found_valid_msc.push(msc);
        }
      }
    });
    match.latest_score = found_valid_msc.slice(found_valid_msc.length - 1, found_valid_msc.length);
  }
  return msc_list;
}
/**
 * 水球比分处理
 * @param {Object} match 赛事对象
 * @returns {Array} 比分数组
 */
export const water_polo_score_handle = (match) => {
  let msc_dict = ['S19', 'S20', 'S21', 'S22', 'S170'];  //第一局 第二局 第三局 第四局 点球比分
  full_msc(match, msc_dict);
  let msc_list = [], dict_msc_list = [];

  // 按从小到大顺序获取比分序列
  if (match.msc) {
    let found_dict_i = -1;
    // 按照球类取出得分(除去犯规比分等)
    msc_dict.forEach((dict, dict_i) => {
      let msc_code = dict + '|';
      match.msc.forEach(f_score => {
        if (f_score.indexOf(msc_code) > -1) {
          found_dict_i = dict_i;

          let formated_msc = format_msc(f_score);
          formated_msc = football_score_no(match, formated_msc);
          msc_list.push(formated_msc);

        }
      });
    });

    match.msc.forEach(f_score => {
      if (f_score.indexOf('S1|') > -1) {
        let full_score = format_msc(f_score);
        match.home_score = full_score[1];
        match.away_score = full_score[2];
      }
    });

    match.msc_format = msc_list;
  }

  match.msc_list_dict.forEach(dict => {
    dict_msc_list.push(format_msc(dict));
  });
  match.msc_s_format = dict_msc_list;

  // 标准版只显示当前局比分
  if (get_newer_standard_edition.value == 2 && msc_list.length > 1) {
    let found_valid_msc = [];
    msc_list.forEach(msc => {
      if (msc && msc.length > 1) {
        if (msc[1] && msc[1] != '-') {
          found_valid_msc.push(msc);
        }
      }
    });
    match.latest_score = found_valid_msc.slice(found_valid_msc.length - 1, found_valid_msc.length);
  }
  return msc_list;
}
/**
 * Dota 赛事比分获取
 * @param {Object} match 
 */
export const dota_score_handle = (match) => {
  let msc_dict = ['S19', 'S20', 'S21', 'S22', 'S170'];  //第一局 第二局 第三局 第四局 点球比分
  full_msc(match, msc_dict);
  let msc_list = [], dict_msc_list = [];

  // 按从小到大顺序获取比分序列
  if (match.msc) {
    let found_dict_i = -1;
    // 按照球类取出得分(除去犯规比分等)
    msc_dict.forEach((dict, dict_i) => {
      let msc_code = dict + '|';
      match.msc.forEach(f_score => {
        if (f_score.indexOf(msc_code) > -1) {
          found_dict_i = dict_i;

          let formated_msc = format_msc(f_score);
          formated_msc = football_score_no(match, formated_msc);
          msc_list.push(formated_msc);

        }
      });
    });

    match.msc.forEach(f_score => {
      if (f_score.indexOf('S1|') > -1) {
        let full_score = format_msc(f_score);
        match.home_score = full_score[1];
        match.away_score = full_score[2];
      }
    });

    match.msc_format = msc_list;
  }

  match.msc_list_dict.forEach(dict => {
    dict_msc_list.push(format_msc(dict));
  });
  match.msc_s_format = dict_msc_list;

  // 标准版只显示当前局比分
  if (get_newer_standard_edition.value == 2 && msc_list.length > 1) {
    let found_valid_msc = [];
    msc_list.forEach(msc => {
      if (msc && msc.length > 1) {
        if (msc[1] && msc[1] != '-') {
          found_valid_msc.push(msc);
        }
      }
    });
    match.latest_score = found_valid_msc.slice(found_valid_msc.length - 1, found_valid_msc.length);
  }
  return msc_list;
}
/**
 * @description: 比分处理
 * @param {Object} match 赛事对象
 * @return {Array}
 */
export const score_switch_handle = (match) => {
  const current_sport_id = match.csid * 1;
  if (!match.msc || (match.msc && match.msc.length == 0)) return [];
  //红牌数
  get_punish_score(match);
  let res = '';
  switch (current_sport_id) {
    case 5:
      res = tennis_score_handle(match);
      break;
    case 10:
      res = badminton_score_handle(match);
      break;
    case 8:
      res = pingpong_score_handle(match);
      break;
    case 7:  //斯诺克
      res = snoocker_score_handle(match);
      break;
    case 2:
      res = basket_ball_score_handle(match);
      break;
    case 1:
      res = foot_ball_score_handle(match);
      break;
    // 3、4、6、9棒冰美排
    case 3:
      res = baseball_score_handle(match);
      break;
    case 4:
      res = ice_hockey_score_handle(match);
      break;
    case 6:
      res = us_football_score_handle(match);
      break;
    case 9:
      res = volleyball_score_handle(match);
      break;
    case 11:
      res = foot_ball_score_handle(match);
      break;
    case 12: //拳击
      res = snoocker_score_handle(match);
      break;
    case 13:
      res = volleyball_score_handle(match);
      break;
    case 14: //英式橄榄球
      res = foot_ball_score_handle(match);
      break;
    case 15: //曲棍球
      res = hockey_score_handle(match);
      break;
    case 16: //水球
      res = water_polo_score_handle(match);
      break;
    case 101: //dota比分获取
    case 100: //lol比分获取
    case 102: //Cs go比分获取
    case 103: //王者荣耀比分获取
      res = dota_score_handle(match);
      break;
  }
  return res;
}
/**
*@description msc比分数组转化为对象
 *@param {Undefined}  val 赛事对象
 *@return {Undefined} undefined
 */
export const transform_score = (val) => {
  if (!val.msc) return;
  try {
    let api_msc = val.msc,
      obj = {};
    if (api_msc.length > 0) {
      for (let i in api_msc) {
        let format = api_msc[i].split("|");
        if (format[1] && format[1].split(":")) {
          obj[format[0]] = {
            home: format[1].split(":")[0],
            away: format[1].split(":")[1],
          };
        }
      }
    }
    val.msc = obj;
  } catch (error) {
    console.error(error);
  }
};