/**
 * @description: 获取投注项状态
 * @param {Number} matchHandicapStatus 赛事盘口状态 0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
 * @param {Number} status 盘口状态0-5。 0：有效，1：暂停，2：停用，3：已结算，4：已取消，5：移交
 * @param {Number} active 投注项状态 1.开盘，2封盘，3关盘 ，4 锁盘
 * @return {Number} 投注项状态 1.开盘，2封盘，3关盘 ，4 锁盘
 */
export const get_odds_active = (matchHandicapStatus, status, active) => {
  var active_ = 1;
  // console.log(`matchHandicapStatus==${matchHandicapStatus}, ${status}, ${active}`);
  if (matchHandicapStatus) {
    // 赛事盘口有操作变化时
    if (matchHandicapStatus == 1) {
      //赛事封盘状态
      active_ = 2;
    } else if (matchHandicapStatus == 11) {
      //赛事锁盘
      if (active != 1) {
        active_ = active;
      } else {
        active_ = 4;
      }
    } else if (
      matchHandicapStatus == 2 ||
      matchHandicapStatus == 3 ||
      matchHandicapStatus == 4 ||
      matchHandicapStatus == 5
    ) {
      //赛事关盘
      active_ = 3;
    }
    return active_;
  }

  if (status) {
    // 盘口有操作变化时
    if (status == 1) {
      //盘口封盘
      active_ = 2;
    } else if (status == 2 || status == 3 || status == 4 || status == 5) {
      //盘口关盘
      active_ = 3;
    } else if (status == 11) {
      //盘口锁盘
      active_ = 4;
    }
    return active_;
  }
  return active;
};
