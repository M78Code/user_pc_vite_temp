/*
 * @Author: land land@itcom888.com
 * @Date: 2023-11-11 18:03:53
 * @LastEditors: land land@itcom888.com
 * @LastEditTime: 2023-11-11 18:54:19
 * @FilePath: \user-pc-vite\src\base-h5\hooks\useLeagueAndMatchCollect.js
 * @Description: 联赛收藏、赛事收藏
 */

import { api_common } from "src/api/index.js";
import { UserCtr } from "src/core";
import MatchCollect from "src/core/match-collect";
import { MenuData } from "src/core/index.js";

import MatchMeta from "src/core/match-list-h5/match-class/match-meta";

const useLeagueAndMatchCollect = () => {
  /**
   * @description: 设置 联赛收藏与否
   */
  const handle_league_collect = async (tid) => {
    // console.log("match_of_list: ", match_of_list);
    // const { tid } = match_of_list;
    const league_collect = MatchCollect.get_league_collect_state(tid);
    api_common
      .add_or_cancel_tournament({
        tid,
        cf: league_collect ? 0 : 1,
        cuid: UserCtr.get_cuid(),
      })
      .then((res) => {
        if (+res.code !== 200) return;
      });
    // 收藏页手动处理数据
    // MenuData.is_collect() && MatchMeta.set_collect_match(match_of_list, 1);
    MatchCollect.handle_league_collect_state(tid);
  };

  /**
   * @description: 设置 赛事收藏与否
   */
  const handle_match_collect = async (mid) => {
    // const { mid } = match_of_list;
    // const match_state = MatchCollect.get_match_collect_state(match_of_list);
    api_common
      .add_or_cancel_match({
        mid,
        cf: match_state ? 0 : 1,
        cuid: UserCtr.get_cuid(),
      })
      .then((res) => {
        if (+res.code !== 200) return;
      });
    // 收藏页手动处理数据
    // MenuData.is_collect() && MatchMeta.set_collect_match(match_of_list, 2);
    // MatchCollect.set_match_collect_state(match_of_list, !match_state);
  };

  return {
    handle_league_collect,
    handle_match_collect,
  };
};

export default useLeagueAndMatchCollect;
