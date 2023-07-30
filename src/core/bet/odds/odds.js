/*
 * @Author: 押注项公共操作函数
 * @Description: 押注项公共操作函数
 */

 /**
   * @Description:获取押注项逻辑转换后的最新状态(通过赛事状态,押注状态,押注项状态进行转换)
   * @Author 押注项公共操作函数
   * @param:matchHandicapStatus - 赛事状态mhs  0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
   * @param:status - 盘口级别状态hs   0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
   * @param:active - 投注项级别状态os  1:开盘(激活)，2:封盘(未激活)，3投注项隐藏(不会有4 锁盘 的值返回)
   * @return:1.开盘，2封盘，3关盘 ，4 锁盘
 */
const get_odds_active = (matchHandicapStatus, status, active)=>{
  var active_ = 1;
  if (matchHandicapStatus) { // 赛事盘口有操作变化时
    if (matchHandicapStatus == 1) { //赛事封盘
      active_ = 2;
    } else if (matchHandicapStatus == 11) { //赛事锁盘
      active_ = 4;
    } else if (matchHandicapStatus == 2) { //赛事关盘
      active_ = 3;
    }
    return active_;
  }

  if (status) { // 盘口有操作变化时
    if (status == 1) { //盘口封盘
      if(active==3){
        active_ = active;
      } else {
        active_ = 2;
      }
    } else if (status == 2) { //盘口关盘
      active_ = 3;
    } else if (status == 11) { //盘口锁盘
      if(active!=1){
        active_ = active;
      } else {
        active_ = 4;
      }
    }
    return active_;
  }
  return active
}

export {
  get_odds_active
}
