import { i18n_t } from "src/boot/i18n.js";


// 输赢状态
export const ITEM_STATUS = {
  2: i18n_t("bet_record.effective_water_"), //"走水";
  3: i18n_t("bet_record.lose"), //输
  4: i18n_t("bet_record.win"), //赢
  5: i18n_t("bet_record.win_half"), //"赢半";
  6: i18n_t("bet_record.lose_half"), //"输半";
  7: i18n_t("bet_record.match_cancel2"), //"赛事取消";
  8: i18n_t("bet_record.match_delay"), //"赛事延期";
  11: i18n_t("bet_record.match_delay2"), //"比赛延迟";
  12: i18n_t("bet_record.match_interrupt"), //"比赛中断";
  13: i18n_t("bet.invalid"), //"无效";
  16: i18n_t("bet.invalid"), //"无效";
  15: i18n_t("bet_record.match_give_up"), //"比赛放弃";
};

// 取消原因
export const CANCEL_TYPE = {
  1: i18n_t("bet_record.match_cancel2"), //"比赛取消";
  2: i18n_t("bet_record.match_delay"), //"比赛延期";
  3: i18n_t("bet_record.match_interrupt"), //"比赛中断";
  4: i18n_t("bet_record.match_rematch"), //比赛重赛
  5: i18n_t("bet_record.match_waist"), //"比赛腰斩";
  6: i18n_t("bet_record.match_give_up"), //"比赛放弃";
  17: i18n_t("bet_record.match_advance"), //"赛事提前";
  20: i18n_t("bet_record.match_delay2"), //"比赛延迟";
};

// 输赢状态(颜色)
export const ITEM_CLASS = {
    2: "lose-color", //"走水";
    3: "lose-color", //"输";
    4: "win-color", //"赢";
    5: "win-color", //"赢半";
    6: "lose-color", //"输半";
    7: "lose-color", //"赛事取消";
    8: "lose-color", //"赛事延期";
    11: "lose-color", //"比赛延迟";
    12: "lose-color", //"比赛中断";
    13: "lose-color", //"无效";
    15: "lose-color", //"比赛放弃";
    16: "lose-color", //"无效";  
  };
// 订单状态
export const ORDER_STATUS = {
    0: i18n_t("bet.bet_suc"), //"投注成功";
    1: i18n_t("bet.bet_suc"), //"投注成功";
    2: i18n_t("bet.betting_cancel"), //"注单无效";
    3: i18n_t("bet.bet_loading"), //"确认中";
    4: i18n_t("bet.bet_fail"), //"投注失败";
  };