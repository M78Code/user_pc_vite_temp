/*
 * @Description: 国际化比赛阶段比分转换工具
 */
import { ref } from "vue";

export const useMsc = () => {
  {
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
      if (!window.msc_map) {
        window.msc_map = i18n.t("msc");
      }
      let list_ = str.split(/[:|]/);
      for (let i = 0, l = 3 - list_.length; i < l; i++) {
        list_.push("");
      }
      list_.push(window.msc_map[list_[0]]);
      return list_;
    };
    /**
     *@description msc比分数组转化为对象
     *@param {Undefined}  val 赛事对象
     *@return {Undefined} undefined
     */
    const transform_score = (val) => {
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
    /**
     * @Description:格式化比赛阶段名称
     * @Author success
     * @param: sport_id
     * @param: mmp
     * @return: 比赛阶段名称
     * @Date 2020/02/03 21:44:58
     */
    const get_mmp_name = (sport_id, mmp) => {
      if (!sport_id) {
        return "";
      }
      if (!window.mmp_map) {
        window.mmp_map = i18n.t("mmp");
      }
      return window.mmp_map[parseInt(sport_id)][mmp];
    };
    /**
     * @description: 获取S1比分
     * @param {Object} match
     * @return {Array}
     */
    const get_match_s1 = (match) => {
      let result = [];
      match.msc.forEach((f_score) => {
        if (f_score.indexOf("S1|") > -1) {
          this.format_msc(f_score);
        }
      });
      return result;
    };

    /**
     * @description: 获取红牌数
     * @param {Object} match
     * @return {Undefined}
     */
    const get_punish_score = (match) => {
      match.msc.forEach((f_score) => {
        if (f_score.indexOf("S11|") > -1) {
          let score2 = f_score.split("S11|")[1];
          match.home_red_score = score2.split(":")[0] * 1;
          match.away_red_score = score2.split(":")[1] * 1;
        }
      });
    };
    /**
     * @description: 在match对象上添加  msc_list_dict 数组字段
     * @param {Object} match
     * @param {Object} msc_dict
     * @return {Undefined}
     */
    const full_msc = (match, msc_dict) => {
      if (!match.msc) match.msc = [];
      match.msc_list_dict = [];
      msc_dict.forEach((msc_d) => {
        let found = null;
        match.msc.forEach((m_msc) => {
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
    };
    /**
     * @description: 网球比分处理
     * @param {Object} match 赛事对象
     * @return {Undefined}
     */
    const tennis_score_handle = (match) => {
      let msc_dict = ["S1", "S23", "S39", "S55"]; //全场大比分 第一盘 第二盘 第三盘比分
      this.full_msc(match, msc_dict);

      let msc_list = [],
        dict_msc_list = [];
      let current_score_split = "S103|";
      if (match.msc && match.msc.length) {
        match.msc.forEach((f_score) => {
          if (f_score.indexOf(current_score_split) > -1) {
            let score2 = f_score.split(current_score_split)[1];
            match.home_score = score2.split(":")[0];
            match.away_score = score2.split(":")[1];
          } else {
            let code = f_score.split("|")[0];
            if (["S23", "S39", "S55", "S71", "S87"].includes(code)) {
              msc_list.push(this.format_msc(f_score));
            }
          }
        });
        msc_list.sort((a, b) => {
          let a_code, b_code;
          try {
            a_code = a[0].split("S")[1] * 1;
            b_code = b[0].split("S")[1] * 1;
          } catch (e) {
            console.error(e);
          }
          return a_code - b_code;
        });
        if (this.menu_type == 28) {
          //赛果选总分数
          let s1_score = match.msc.filter(
            (msc_item) => msc_item.indexOf("S1|") > -1
          )[0];
          if (s1_score) {
            let score_str = s1_score.split("S1|")[1];
            match.home_score = score_str.split(":")[0];
            match.away_score = score_str.split(":")[1];
          }
        }
        if (!match.home_score) match.home_score = 0;
        if (!match.away_score) match.away_score = 0;
        match.msc_format = msc_list;
      }
      match.msc_list_dict.forEach((dict) => {
        dict_msc_list.push(this.format_msc(dict));
      });
      match.msc_s_format = dict_msc_list;
      return msc_list;
    };
    /**
     * @description: 羽毛球比分处理
     * @param {Object} match 赛事对象
     * @return {Undefined}
     */
    const badminton_score_handle = (match) => {
      let score_index_map = {
        8: 1,
        301: 2,
        9: 2,
        302: 3,
        10: 3,
        303: 4,
        11: 4,
        304: 5,
        12: 5,
      };
      let number_code_map = {
        1: "8",
        2: "9",
        3: "10",
        4: "11",
        5: "12",
      };
      let max_index = score_index_map[match.mmp];

      let msc_dict = ["S1", "S120", "S121", "S122", "S123", "S124"];

      //region 判断是否为七局五胜制
      let is_7;
      if (match.mft == 7) {
        is_7 = true;
      } else {
        if (match.mfo) {
          is_7 = match.mfo.indexOf("7") > -1;
          if (!is_7) {
            is_7 = match.mfo.indexOf("七") > -1;
          }
        }
        if (!is_7) is_7 = match.msc.length > 7;
      }
      if (is_7) {
        msc_dict = [
          "S1",
          "S120",
          "S121",
          "S122",
          "S123",
          "S124",
          "S125",
          "S126",
        ];
      }
      //endregion

      this.full_msc(match, msc_dict);

      let msc_list = [],
        dict_msc_list = [];

      if (match.msc) {
        let found_dict_i = -1;
        // 按照球类取出得分(出去犯规比分等)
        msc_dict.forEach((dict, dict_i) => {
          let msc_code = dict + "|";
          match.msc.forEach((f_score) => {
            if (f_score.indexOf(msc_code) > -1) {
              found_dict_i = dict_i;
              msc_list.push(this.format_msc(f_score));
            }
          });
        });
        // 赛事到达局间休息时,初始化下一局比分为0-0并显示
        let max_count = max_index + 1;
        if (msc_list.length < max_count) {
          for (let i = msc_list.length; i < max_count; i++) {
            if (msc_dict[i]) {
              let f_score = `${msc_dict[i]}|0:0`;
              msc_list.push(this.format_msc(f_score));
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
        } else if (msc_list && msc_list.length) {
          let f_score = msc_list[msc_list.length - 1];
          if (this.menu_type == 28) {
            //赛果选总分数
            f_score = msc_list[0];
          }
          match.home_score = f_score[1];
          match.away_score = f_score[2];
        }
        match.msc_format = msc_list;
      }

      match.msc_list_dict.forEach((dict) => {
        dict_msc_list.push(this.format_msc(dict));
      });
      match.msc_s_format = dict_msc_list;

      return msc_list;
    };
    /**
     * @description: 乒乓球比分处理
     * @param {Object}  match 赛事对象
     * @return {Object}
     */
    const pingpong_score_handle = (match) => {
      let score_index_map = {
        8: 1,
        301: 2,
        9: 2,
        302: 3,
        10: 3,
        303: 4,
        11: 4,
        304: 5,
        12: 5,
        305: 6,
        441: 6,
        306: 7,
        442: 7,
      };
      let number_code_map = {
        1: "8",
        2: "9",
        3: "10",
        4: "11",
        5: "12",
        6: "441",
        7: "442",
      };

      let max_index = score_index_map[match.mmp];

      let msc_dict = ["S1", "S120", "S121", "S122", "S123", "S124"];

      //region 判断是否为七局五胜制
      let is_7;
      if (match.mft == 7) {
        is_7 = true;
      } else {
        if (match.mfo) {
          is_7 = match.mfo.indexOf("7") > -1;
          if (!is_7) {
            is_7 = match.mfo.indexOf("七") > -1;
          }
        }
        if (!is_7) is_7 = match.msc.length > 7;
      }

      if (is_7) {
        msc_dict = [
          "S1",
          "S120",
          "S121",
          "S122",
          "S123",
          "S124",
          "S125",
          "S126",
        ];
      }
      //endregion

      this.full_msc(match, msc_dict);

      let msc_list = [],
        dict_msc_list = [];

      // 按从小到大顺序获取比分序列
      if (match.msc) {
        let found_dict_i = -1;
        // 按照球类取出得分(出去犯规比分等)
        msc_dict.forEach((dict, dict_i) => {
          let msc_code = dict + "|";
          match.msc.forEach((f_score) => {
            if (f_score.indexOf(msc_code) > -1) {
              found_dict_i = dict_i;
              msc_list.push(this.format_msc(f_score));
            }
          });
        });
        // 赛事到达局间休息时,初始化下一局比分为0-0并显示
        let max_count = max_index + 1;
        if (msc_list.length < max_count) {
          for (let i = msc_list.length; i < max_count; i++) {
            if (msc_dict[i]) {
              let f_score = `${msc_dict[i]}|0:0`;
              msc_list.push(this.format_msc(f_score));
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
        } else if (msc_list.length) {
          let f_score = msc_list[msc_list.length - 1];
          if (this.menu_type == 28) {
            //赛果选总分数
            f_score = msc_list[0];
          }
          match.home_score = f_score[1];
          match.away_score = f_score[2];
        }
        match.msc_format = msc_list;
      }

      match.msc_list_dict.forEach((dict) => {
        dict_msc_list.push(this.format_msc(dict));
      });
      match.msc_s_format = dict_msc_list;

      return msc_list;
    };
    /**
     * @description: 斯诺克比分处理
     * @param {Object} match 赛事对象
     * @return {Object}
     */
    const snoocker_score_handle = (match) => {
      let key_str =
        "1,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140";
      let key_array = key_str.split(",");

      let count = 0;
      try {
        count = match.mfo.match(/\d*/)[0] * 1;
      } catch (e) {
        console.error(e);
      }
      if (isNaN(count) || count < 6) {
        count = 6;
      } else {
        count = 12;
      }

      key_array = key_array.slice(0, count);

      let msc_dict = key_array.map((k) => `S${k}`);
      this.full_msc(match, msc_dict);

      let msc_list = [],
        s1_score = null,
        dict_msc_list = [];
      if (match.msc && match.msc.length) {
        let score_list = [];
        match.msc.forEach((f_score) => {
          if (f_score.indexOf("S1|") > -1) {
            s1_score = this.format_msc(f_score);
          } else {
            score_list.push(this.format_msc(f_score));
          }
        });
        score_list.forEach((f_score) => {
          let code = f_score[0];
          if (key_array.includes(code.replace("S", ""))) {
            msc_list.push(f_score);
          }
        });

        msc_list.forEach((f_score, i) => {
          if (i == msc_list.length - 1) {
            match.home_score = f_score[1];
            match.away_score = f_score[2];
          }
        });

        msc_list.sort((a, b) => {
          let a_code, b_code;
          try {
            a_code = a[0].split("S")[1] * 1;
            b_code = b[0].split("S")[1] * 1;
          } catch (e) {
            console.error(e);
          }
          return a_code - b_code;
        });
        if (this.menu_type == 28) {
          //赛果选总分数
          let s1_score = match.msc.filter(
            (msc_item) => msc_item.indexOf("S1|") > -1
          )[0];
          if (s1_score) {
            let score_str = s1_score.split("S1|")[1];
            match.home_score = score_str.split(":")[0];
            match.away_score = score_str.split(":")[1];
          }
        }
        if (!match.home_score) match.home_score = 0;
        if (!match.away_score) match.away_score = 0;
        match.msc_format = msc_list;
      }

      match.msc_list_dict.forEach((dict) => {
        dict_msc_list.push(this.format_msc(dict));
      });
      match.msc_s_format = dict_msc_list;
      return { msc_list, s1_score };
    };
    /**
     * 附加足球比分编号
     * @param {Object} match 赛事对象
     * @return {Array}
     */
    const football_score_no = (match, list_) => {
      if (match.csid == 1) {
        // 角球
        if (list_[0] == "S5") {
          list_.push("KK");
        }
        // 上半场进球数
        else if (list_[0] == "S2") {
          list_.push("HT");
        }
        //上下半场总进球数
        else if (list_[0] == "S1") {
          list_.push("FT");
        }
        //加时赛比分
        else if (list_[0] == "S7") {
          list_.push("OT");
        }
        //点球大战比分
        else if (list_[0] == "S170") {
          list_.push("PEN");
        }
      }
      return list_;
    };
    /**
     * @description: 足球篮球
     * @param {Object} match
     * @return {Array}
     */
    const foot_basket_ball = (match) => {
      let msc_list = [];
      if (match.msc && match.msc.length) {
        let split = "S1|";
        if ([41, 32, 33, 42, 110].includes(match.mmp * 1)) {
          split = "S7|";
        } else if ([34, 50, 120].includes(match.mmp * 1)) {
          split = "S170|";
        }
        if (this.menu_type == 28) {
          split = "S1|";
        }
        let found_full_score = false;
        match.msc.forEach((f_score) => {
          if (f_score.indexOf(split) > -1) {
            let sliced = this.format_msc(f_score);
            match.home_score = sliced[1];
            match.away_score = sliced[2];
            found_full_score = true;
          }
          msc_list.push(this.format_msc(f_score));
        });
        if (!found_full_score) {
          match.home_score = 0;
          match.away_score = 0;
        }
        match.msc_format = msc_list;
      }
      let msc_dict_list = [];
      if (match.msc_list_dict && match.msc_list_dict.length) {
        match.msc_list_dict.forEach((f_score) => {
          // if(this.menu_type == 28){
          let formated_msc = this.format_msc(f_score);
          formated_msc = this.football_score_no(match, formated_msc);
          msc_dict_list.push(formated_msc);
          // }
          // else{
          //   msc_dict_list.push(this.format_msc(f_score));
          // }
        });
        match.msc_s_format = msc_dict_list;
      }
      match.msc_s_format = msc_dict_list;
      return msc_dict_list;
      return msc_list;
    };
    /**
     * @description: 篮球比分处理
     * @param {Object} match 赛事对象
     * @return {Object}
     */
    const basket_ball_score_handle = (match) => {
      // 全场比分/1/2/上半场/3/4/下半场;
      let msc_dict = ["S1", "S2", "S3"];

      let found_msc = false;
      if (match.msc && match.msc.length) {
        match.msc.forEach((msx_d) => {
          if (
            msx_d.indexOf("S19") > -1 ||
            msx_d.indexOf("S20") > -1 ||
            msx_d.indexOf("S21") > -1 ||
            msx_d.indexOf("S22") > -1
          ) {
            found_msc = true;
          }
        });
      }
      if (found_msc) {
        msc_dict = ["S19", "S20", "S21", "S22", "S7"];
      } else {
        msc_dict = ["S2", "S3", "S7"];
      }
      //中场休息
      if (match.mmp == 31) {
        msc_dict = ["S2"];
      }

      this.full_msc(match, msc_dict);
      let result = this.foot_basket_ball(match); // 篮球足球比分处理

      if (match.msc_s_format && match.msc_s_format.length > 2) {
        let sorted = [];
        msc_dict.forEach((key) => {
          let r = match.msc_s_format.filter((msc_s) => key === msc_s[0])[0];
          if (!r) {
            r = [key, "", "", ""];
          }
          sorted.push(r);
        });
        match.msc_s_format = sorted;
      } else {
        match.msc_s_format = msc_dict.map((dic) => {
          let title = window.msc_map[dic];
          return [dic, "", "", title];
        });
      }

      match.msc_format = match.msc_s_format;
      return result;
    };
    /**
     * @description: 足球比分处理
     * @param {Object} match 赛事对象
     * @return {Object}
     */
    // foot_ball_score_handle(match){
    //   // 全场比分/上半场/下半场/角球/红牌/黄牌/点球/加时/点球大战
    //   let msc_dict = ["S1","S2","S3","S5","S11","S12","S10","S7","S170"];

    //   this.full_msc(match,msc_dict);
    //   let result = this.foot_basket_ball(match);

    //   if(match.msc_s_format){
    //     let sorted = [];
    //     msc_dict.forEach(key => {
    //       let r = match.msc_s_format.filter( msc_s => key === msc_s[0] )[0];
    //       sorted.push(r);
    //     });
    //     match.msc_s_format = sorted;
    //   }else{
    //     match.msc_s_format = msc_dict.map(dic => {
    //       let title = window.msc_map[dic];
    //       return [dic,'','',title];
    //     });
    //   }
    //   return result;
    // },
    /**
     * @description: 足球比分处理
     * @param {Object} match 赛事对象
     * @return {Object}
     */
    const foot_ball_score_handle = (match) => {
      // 角球:S5 上半场:S2 全场比分:S1 下半场:S3 红牌:S11 黄牌:S12 点球:S10 加时:S7 点球大战:S170
      let msc_dict = ["S5", "S1", "S7"];
      if ([0, 6].includes(match.mmp * 1)) {
        //上半场 加时赛上半场
        msc_dict = ["S5"];
      } else if (match.mmp == 31) {
        // 中场休息
        msc_dict = ["S5", "S2"];
      } else if (match.mmp == 7) {
        // 下半场
        msc_dict = ["S5", "S2"];
      } else if ([41, 42].includes(match.mmp * 1)) {
        // 加时下半场
        msc_dict = ["S5", "S2", "S1"];
      } else if (match.mmp == 50) {
        // 点球大战
        msc_dict = ["S5", "S1", "S7"];
      }
      this.full_msc(match, msc_dict);
      let result = this.foot_basket_ball(match);
      if (match.msc_s_format) {
        let sorted = [];
        msc_dict.forEach((key) => {
          let r = match.msc_s_format.filter((msc_s) => key === msc_s[0])[0];
          sorted.push(r);
        });
        match.msc_s_format = sorted;
      } else {
        match.msc_s_format = msc_dict.map((dic) => {
          let title = window.msc_map[dic];
          return [dic, "", "", title];
        });
      }
      match.latest_score = result;
      return result;
    };
    /**
     * @description: 棒球比分处理
     * @param {Object} match 赛事对象
     * @return {Object}
     */
    const baseball_score_handle = (match) => {
      // 假数据
      // let fake_data = ["S1|2:1", "S3014|2"];
      // if(Array.isArray(match.msc)){
      //   if(!match.msc.length){
      //     fake_data.forEach(item => match.msc.push(item));
      //   }
      // }else{
      //   match.msc = fake_data;
      // }

      let msc_dict = ["S1", "S3014"];
      this.full_msc(match, msc_dict);
      let msc_list = [],
        dict_msc_list = [];

      // 按从小到大顺序获取比分序列
      if (match.msc) {
        // 按照球类取出得分(除去犯规比分等)
        msc_dict.forEach((dict, dict_i) => {
          let msc_code = dict + "|";
          match.msc.forEach((f_score) => {
            if (f_score.indexOf(msc_code) > -1) {
              msc_list.push(this.format_msc(f_score));
            }
          });
        });

        //获取当前比分
        if (msc_list && msc_list.length) {
          let f_score = msc_list[0];
          match.home_score = f_score[1];
          match.away_score = f_score[2];
        } else {
          match.home_score = 0;
          match.away_score = 0;
        }

        match.msc_format = msc_list;
      }

      match.msc_list_dict.forEach((dict) => {
        dict_msc_list.push(this.format_msc(dict));
      });
      match.msc_s_format = dict_msc_list;

      return msc_list;
    };
    /**
     * @description: 冰球比分处理
     * @param {Object} match 赛事对象
     * @return {Object}
     */
    const ice_hockey_score_handle = (match) => {
      //S170 点球大战
      let msc_dict = [
        "S1",
        "S120",
        "S121",
        "S122",
        "S123",
        "S124",
        "S7",
        "S170",
      ]; //全场大比分 第一局 第二局 第三局... 以此类推
      let score_index_map = {
        0: 1,
        1: 1,
        301: 2,
        2: 2,
        302: 3,
        3: 3,
      };

      let max_index = score_index_map[match.mmp];

      this.full_msc(match, msc_dict);

      let msc_list = [],
        dict_msc_list = [];

      // 按从小到大顺序获取比分序列
      if (match.msc) {
        let found_dict_i = -1;
        // 按照球类取出得分(除去犯规比分等)
        msc_dict.forEach((dict, dict_i) => {
          let msc_code = dict + "|";
          match.msc.forEach((f_score) => {
            if (f_score.indexOf(msc_code) > -1) {
              found_dict_i = dict_i;
              msc_list.push(this.format_msc(f_score));
            }
          });
        });
        // 赛事到达局间休息时,初始化下一局比分为0-0并显示
        let max_count = max_index + 1;
        if (msc_list.length < max_count) {
          for (let i = msc_list.length; i < max_count; i++) {
            if (msc_dict[i]) {
              let f_score = `${msc_dict[i]}|0:0`;
              msc_list.push(this.format_msc(f_score));
            }
          }
        }

        //获取当前比分
        if (msc_list && msc_list.length) {
          let f_score = msc_list[msc_list.length - 1];
          if (this.menu_type == 28) {
            //赛果选总分数
            f_score = msc_list[0];
          }
          match.home_score = f_score[1];
          match.away_score = f_score[2];
        } else {
          match.home_score = 0;
          match.away_score = 0;
        }

        match.msc_format = msc_list;
      }

      match.msc_list_dict.forEach((dict) => {
        dict_msc_list.push(this.format_msc(dict));
      });
      match.msc_s_format = dict_msc_list;

      return msc_list;
    };
    /**
     * @description: 美式足球比分处理
     * @param {Object} match 赛事对象
     * @return {Object}
     */
    const us_football_score_handle = (match) => {
      let msc_dict = ["S19", "S20", "S21", "S22"]; //第一局 第二局 第三局比分

      this.full_msc(match, msc_dict);

      let msc_list = [],
        dict_msc_list = [];

      // 假数据
      // let fake_data = ["S1|1:0","S19|99:88","S20|88:87","S21|66:77","S22|68:30"];
      // if(Array.isArray(match.msc)){
      //   if(!match.msc.length){
      //     let data = fake_data;
      //     data.forEach(item => match.msc.push(item));
      //   }
      // }else{
      //   match.msc = fake_data;
      // }

      // 按从小到大顺序获取比分序列
      if (match.msc) {
        let found_dict_i = -1;
        // 按照球类取出得分(除去犯规比分等)
        msc_dict.forEach((dict, dict_i) => {
          let msc_code = dict + "|";
          match.msc.forEach((f_score) => {
            if (f_score.indexOf(msc_code) > -1) {
              found_dict_i = dict_i;
              msc_list.push(this.format_msc(f_score));
            }
          });
        });
        let s1_list = null;
        match.msc.forEach((score) => {
          if (score.indexOf("S1|") > -1) {
            s1_list = score.split("S1|")[1].split(":");
          }
        });
        //获取当前比分
        if (s1_list && s1_list.length) {
          match.home_score = s1_list[0];
          match.away_score = s1_list[1];
        } else {
          match.home_score = 0;
          match.away_score = 0;
        }

        match.msc_format = msc_list;
      }

      match.msc_list_dict.forEach((dict) => {
        dict_msc_list.push(this.format_msc(dict));
      });
      match.msc_s_format = dict_msc_list;

      return msc_list;
    };
    /**
     * @description: 排球比分处理
     * @param {Object} match 赛事对象
     * @return {Object}
     */
    const volleyball_score_handle = (match) => {
      let msc_dict = ["S1", "S120", "S121", "S122", "S123", "S124"]; //全场大比分 第一局 第二局 第三局比分

      this.full_msc(match, msc_dict);

      let msc_list = [],
        dict_msc_list = [];

      // 按从小到大顺序获取比分序列
      if (match.msc) {
        let found_dict_i = -1;
        // 按照球类取出得分(除去犯规比分等)
        msc_dict.forEach((dict, dict_i) => {
          let msc_code = dict + "|";
          match.msc.forEach((f_score) => {
            if (f_score.indexOf(msc_code) > -1) {
              found_dict_i = dict_i;
              msc_list.push(this.format_msc(f_score));
            }
          });
        });

        //获取当前比分
        if (msc_list && msc_list.length) {
          let f_score = msc_list[msc_list.length - 1];
          if (this.menu_type == 28) {
            //赛果选总分数
            f_score = msc_list[0];
          }
          match.home_score = f_score[1];
          match.away_score = f_score[2];
        } else {
          match.home_score = 0;
          match.away_score = 0;
        }

        match.msc_format = msc_list;
      }

      match.msc_list_dict.forEach((dict) => {
        dict_msc_list.push(this.format_msc(dict));
      });
      match.msc_s_format = dict_msc_list;

      return msc_list;
    };
    /**
     * @description: 比分处理
     * @param {Object} match 赛事对象
     * @return {Array}
     */
    const score_switch_handle = (match) => {
      const current_sport_id = match.csid * 1;
      if (!match.msc) return [];
      //红牌数
      this.get_punish_score(match);
      switch (current_sport_id) {
        case 5:
          return this.tennis_score_handle(match);
        case 10:
          return this.badminton_score_handle(match);
        case 8:
          return this.pingpong_score_handle(match);
        case 7:
          return this.snoocker_score_handle(match);
        case 2:
          return this.basket_ball_score_handle(match);
        case 1:
          return this.foot_ball_score_handle(match);
        // 3、4、6、9棒冰美排
        case 3:
          return this.baseball_score_handle(match);
        case 4:
          return this.ice_hockey_score_handle(match);
        case 6:
          return this.us_football_score_handle(match);
        case 9:
          return this.volleyball_score_handle(match);
      }
    };
  }
};
