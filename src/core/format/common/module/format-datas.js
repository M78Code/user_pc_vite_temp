export const format_datas = (match) => {
    let { msc } = match;
    // 比分
    let score_list = [];
    /** 赛果 L：负 D：平 W：胜 ******/
    // 主队
    let result_home = [];
    // 客队
    let result_away = [];
    // 主队赢的次数
    let win_home = 0;
    //  客队赢的次数
    let win_away = 0;

    if (Array.isArray(msc)) {
      msc.map((item) => {
        let score = item.split(":");
        let { 0: home, 1: away } = score;
        let home_rs = home - away;

        score_list.push({
          home,
          away,
        });

        // 主胜、客负
        if (home_rs > 0) {
          result_home.push("W");
          result_away.push("L");
          win_home += 1;
          // 主负、客胜
        } else if (home_rs < 0) {
          result_home.push("L");
          result_away.push("W");
          win_away += 1;
          // 平
        } else {
          result_home.push("D");
          result_away.push("D");
        }
      });
    }

    // 比赛总轮次
    let match_total = 5;
    let _win_home = (win_home / match_total) * 100;
    let _win_away = (win_away / match_total) * 100;

    return {
      score_list,
      result_home,
      result_away,
      win_home: _win_home,
      win_away: _win_away,
    };
  }