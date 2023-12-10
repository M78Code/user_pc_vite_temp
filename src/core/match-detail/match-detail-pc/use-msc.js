/*
 * @Author: cooper cooper@123.com
 * @Date: 2023-08-01 18:31:01
 * @LastEditors: cooper cooper@123.com
 * @LastEditTime: 2023-08-01 19:02:40
 * @FilePath: \user-pc-vite\src\core\match-detail\use-msc.js
 * @Description:国际化比赛阶段比分转换工具
 */

// import details from "src/public/utils/detailsClass/details.js"
import { ref } from "vue";
import _ from "lodash";
import { get_match_status } from 'src/output/module/constant-utils.js'
export const useMsc = () => {
  let many_key = [];
  // S120~S159
  for (let i = 120; i <= 159; i++) {
    many_key.push(`S${i}`);
  }
  let score_dict = {
    // 【足球】下半场，点球大战比分
    1: ["S7", "S170"],
    // 【篮球半场】上半场，下半场，加时赛比分
    2: ["S2", "S3", "S7"],
    // 【棒球】第1局比分 ~ 第40局比分
    3: [...many_key, "S7", "S170"],
    // 【冰球】第1局比分 ~ 第40局比分，点球大战比分
    4: [...many_key, "S7", "S170"],
    // 【网球】第1盘比分 ~ 第5盘比分
    5: ["S23", "S39", "S55", "S71", "S87"],
    // 【斯诺克】第1局比分 ~ 第40局比分
    7: many_key,
    // 【乒乓球】第1局比分 ~ 第40局比分
    8: many_key,
    // 【排球】第1局比分 ~ 第40局比分
    9: many_key,
    // 【羽毛球】第1局比分 ~ 第40局比分
    10: many_key,
    // 【手球】下半场，点球大战比分
    11: ["S7", "S170"],
    // 【沙滩排球】第1局比分 ~ 第40局比分
    13: many_key,
    // 【曲棍】第1节~第4节，加时赛比分，点球大战
    15: ["S19", "S20", "S21", "S22", "S7", "S170"],
    // 【水球】第1节~第4节，加时赛比分，点球大战
    16: ["S19", "S20", "S21", "S22", "S7", "S170"],
  };

  /** 根据mmp 或是 mct 匹配比分*/
  let state_convert_dict = {
    //【篮球】——根据mmp
    2: {
      // 上半场比分
      1: "S2",
      // 下半场比分
      2: "S3",
      // 等待加时,加时赛
      32: "S7",
      40: "S7",
      // 第1节
      13: "S19",
      // 第1节间休息、第2节
      301: "S20",
      14: "S20",
      // 第2节间休息、第3节
      302: "S21",
      15: "S21",
      // 第3节间休息、第4节、全场结束
      303: "S22",
      16: "S22",
      100: "S22",
    },
    //【冰球】——根据mmp
    4: {
      // 未开赛、第1局
      0: "S120",
      1: "S120",
      // 第1局间休息、第2局
      301: "S121",
      2: "S121",
      // 第2局间休息、第3局
      302: "S122",
      3: "S122",
      // 等待加时,加时赛
      32: "S7",
      40: "S7",
      // 等待点球，点球
      34: "S170",
      50: "S170",
    },

    //【网球】——根据mmp
    5: {
      // 未开赛、第一盘
      0: "S23",
      8: "S23",
      // 第二盘
      9: "S39",
      // 第三盘
      10: "S55",
      // 第四盘
      11: "S71",
      // 第五盘
      12: "S87",
    },

    //【美式足球】——根据mmp
    6: {
      // 未开赛、第1节
      0: "S19",
      13: "S19",
      // 第1节间休息、第2节
      301: "S20",
      14: "S20",
      // 第2节间休息、第3节
      302: "S21",
      15: "S21",
      // 第3节间休息、第4节、全场结束
      303: "S22",
      16: "S21",
      100: "S22",
      // 加时赛
      40: "S7",
    },

    //【排球】——根据mmp
    9: {
      // 未开赛、第1局
      0: "S120",
      8: "S120",
      // 第1局间休息、第2局
      301: "S121",
      9: "S121",
      // 第2局间休息、第3局
      302: "S122",
      10: "S122",
      // 第3局间休息、第4局
      303: "S123",
      11: "S123",
      // 第4局间休息、第5局
      304: "S124",
      12: "S124",
      // 第5局间休息、第6局
      305: "S124",
      441: "S124",
      // 第6局间休息、第7局
      306: "S124",
      442: "S124",
    },

    //【羽毛球】——根据mmp
    10: {
      // 未开赛、第1盘
      0: "S120",
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
    //【斯诺克】——根据mct
    7: ["S120", ...many_key],

    //【乒乓球】——根据mmp
    8: {
      // 未开赛、第1局
      0: "S120",
      8: "S120",
      // 第1局间休息、第2局
      301: "S121",
      9: "S121",
      // 第2局间休息、第3局
      302: "S122",
      10: "S122",
      // 第3局间休息、第4局
      303: "S123",
      11: "S123",
      // 第4局间休息、第5局
      304: "S124",
      12: "S124",
      // 第5局间休息、第6局
      305: "S125",
      441: "S125",
      // 第6局间休息、第7局
      306: "S126",
      442: "S126",
    },
    //【曲棍球】——根据mmp
    15: {
      // 未开赛、第1节
      0: "S19",
      13: "S19",
      // 第1节间休息、第2节
      301: "S20",
      14: "S20",
      // 第2节间休息、第3节
      302: "S21",
      15: "S21",
      // 第3节间休息、第4节、全场结束
      303: "S22",
      16: "S22",
      100: "S22",
      // 加时赛
      40: "S7",
    },
    //【水球】——根据mmp
    16: {
      // 未开赛、第1节
      0: "S19",
      13: "S19",
      // 第1节间休息、第2节
      301: "S20",
      14: "S20",
      // 第2节间休息、第3节
      302: "S21",
      15: "S21",
      // 第3节间休息、第4节、全场结束
      303: "S22",
      16: "S22",
      100: "S22",
      // 加时赛
      40: "S7",
    },
  };

  /**
   * @Description:格式化比分数据
   * @Author success
   * @param: key   (S151)
   * @return: 返回分隔后的数组
   * @Date 2020/02/03 21:44:58
   */
  const format_msc = (str) => {
    if (!str) {
      return [];
    }

    let list_ = str.split(/[:|]/);
    for (let i = 0, l = 3 - list_.length; i < l; i++) {
      list_.push("");
    }
    list_.push(this.msc_map[list_[0]]);
    return list_;
  };

  /**
   * @description: 设置基准分key值
   * @param {Object} match
   * @return {type}
   */
  const set_basic_key = (match) => {
    let key = "S1";
    // 足球 | 手球
    if ([1, 11].includes(Number(match.csid))) {
      // S7:加时赛比分
      if ([32, 33, 41, 42, 110].includes(Number(match.mmp))) {
        key = "S7";
      }
      // S170:点球大战比分
      if ([34, 50, 120].includes(Number(match.mmp))) {
        key = "S170";
      }
    }
    match.basic_key = key;
    return key;
  };
  /**
   * @description 设置总比分
   * @param  {object} match  当场赛事信息
   * @return {undefined} undefined
   */
  const set_main_score = (match) => {
    let _home_score = "";
    let _away_score = "";
    if (this.$get_match_status(match.ms)) {
      let key = "S1";
      _home_score = "0";
      _away_score = "0";

      // 足球 | 手球
      if ([1, 11].includes(Number(match.csid))) {
        // S7:加时赛比分
        if ([32, 33, 41, 42, 110].includes(Number(match.mmp))) {
          key = "S7";
        }
        // S170:点球大战比分
        else if ([34, 50, 120].includes(Number(match.mmp))) {
          key = "S170";
        }
      }

      let main_score = match.msc_obj[key];

      if (main_score) {
        _home_score = _.get(main_score, "1");
        _away_score = _.get(main_score, "2");
      }

      match.basic_key = key;
    }

    match.home_score = _home_score;
    match.away_score = _away_score;
  };
  /**
   * @description 获取实时比分
   * @param  {object} match  当场赛事信息
   * @return {undefined} undefined
   */
  const get_match_score = (match) => {
    let _home_score = "";
    let _away_score = "";
    if (get_match_status(match.ms)) {
      let key = "S1";
      _home_score = "0";
      _away_score = "0";

      // 足球
      if (match.csid == 1) {
        // S7:加时赛比分
        if ([32, 33, 41, 42, 110].includes(Number(match.mmp))) {
          key = "S7";
        }
        // S170:点球大战比分
        if ([34, 50, 120].includes(Number(match.mmp))) {
          key = "S170";
        }
      }

      _home_score = match.msc[key].home;
      _away_score = match.msc[key].away;
    }
    return {
      home_score: _home_score,
      away_score: _away_score,
    };
  };
  /**
   * @description 历史比分处理
   * @param  {object} match  当场赛事信息
   * @return {undefined} undefined
   */
  const score_switch_handle = (match) => {
    const csid = Number(match.csid);
    if (!_.has(match, "home_red_score")) {
      match.home_red_score = "";
    }
    if (!_.has(match, "away_red_score")) {
      match.away_red_score = "";
    }
    if (!_.has(match, "home_yellow_score")) {
      match.home_yellow_score = "";
    }
    if (!_.has(match, "away_yellow_score")) {
      match.away_yellow_score = "";
    }
    // 不是 即将开赛(ms=110)时才格式化比分
    if (Array.isArray(match.msc) && match.ms != 110) {
      // 将服务器返回的比分转换成 {"S1":["S1", "2", "1", "全场比分"]}
      let remote_score = Object.create(null);

      match.msc.map((score) => {
        let _score = this.format_msc(score);

        let _key = _score[0];
        remote_score[_key] = _score;

        //【足球红牌】S11
        if (_key == "S11") {
          match.home_red_score = Number(_score[1]);
          match.away_red_score = Number(_score[2]);
        }
        //【足球黄牌】S12
        if (_key == "S12") {
          match.home_yellow_score = Number(_score[1]);
          match.away_yellow_score = Number(_score[2]);
        }
      });

      match.msc_obj = remote_score;
      // 存放最终需显示的比分
      let msc_format = [];
      // 是否存在当前比分
      let had_cur_score = false;
      // 需显示的比分集
      let score_dict = score_dict[csid] || [];
      // 篮球
      if ([2].includes(csid)) {
        // 全场
        if (match.mle != 17) {
          // 第1节~第4节，加时赛比分，点球大战
          score_dict = ["S19", "S20", "S21", "S22", "S7", "S170"];
        }
      }

      let _key = match.mmp;
      //斯诺克
      if (csid == 7) {
        _key = match.mct;
      }
      // 赛事阶段对应的 比分 key
      let cur_score_key = _.get(state_convert_dict, `${csid}.${_key}`);

      // 遍历需显示比分集
      score_dict.map((key) => {
        let cur_score = remote_score[key];
        // 服务器有返回对应比分
        if (cur_score) {
          msc_format.push(cur_score);

          // 当前局服务器没有返回默认为 0-0
        } else if (key == cur_score_key) {
          msc_format.push([key, "0", "0"]);
        }
      });

      match.msc_format = msc_format;
      //网球当前局得分
      if (csid == 5) {
        match.score = BetCommonHelper.msc_array_obj(match.msc);
        let is_zero = this.$get_match_status(match.ms);
        details.init_score(match.score, ["S103"], is_zero);
      }

      // 总比分
      this.set_main_score(match);
    } else {
      match.msc_format = [];
      match.home_score = "";
      match.away_score = "";
      return [];
    }
  };
  return;
  {
  }
};
