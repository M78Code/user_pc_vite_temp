/* 
 处理详情ws逻辑
*/

import { api_match_list } from "src/api/index.js";

import courseData from "src/core/match-detail/match-detail-h5/config/course.js";
import { onMounted, ref, watch, onUnmounted, toRaw } from "vue";
import {
  MatchDetailCalss,
  MatchDataWarehouse_H5_Detail_Common,
  useMittOn,
  useMitt,
  MITT_TYPES,
  utils,
  UserCtr,
  MatchDataWarehouse_H5_List_Common,
} from "src/core/index";
import * as ws_message_listener from "src/core/utils/module/ws-message.js";

export const details_ws = (router, route) => {
  const mid = route.params.mid;
  /**
   * @description: 处理ws指令 与返回来的数据
   * @param {*} cmd
   * @param {*} data
   * @return {*}
   *    *  * `ms` 赛事状态 0:未开赛 1:赛事进行中  2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
   * `mmp` 赛事阶段
   * 赛事结束标志 mmp=999 || ms = "比赛结束"  mhs=2 关盘 移除赛事
   * `mhs` 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘 ,11:锁盘状态）
   * c303  拉取所有数据
   * "C101","C102","C104","C109","C302","C303"
   * "C102"  获取玩法集 获取盘口信息
   * "C109"  获取玩法集 获取盘口信息
   * "C112"  获取玩法集 获取盘口信息
   * "C303"  获取盘口信息 新增玩法/新增盘口/主主盘变更
   */
  const handler_ws_cmd = (cmd, data) => {
    // 如果mid与我们的赛事id不一致 不处理  C105在数据仓库处理
    if (lodash.get(data, "cd.mid") != mid || cmd == "C105") return;
    console.log(cmd, data, "datacmd");
  }
  // 赛事事件(C102)
  /**
   * mid 赛事id
   * mjd 赛事阶段  --- 后面会移除 (已移除)
   * mst 比赛进行时间/比赛剩余时间
   * cmec 事件编码
   * cmes 事件状态 0，未取消 1、被取消
   * mat 发球方,主队发球 home，客队发球：away
   * mgt  此字段取消使用 -- 事件code的主客队，主队home，客队：away (已移除)
   * mmp 赛事阶段
   */
  function RCMD_C102(obj) {
    // if (!obj || this.matchid != obj.cd.mid) {
    //   return;
    // }
    // let skt_data = obj.cd;
    // this.updata_detail_data(skt_data);
    // // var 事件 skt_data.cmec !== 'goal 避免接口返回 goal 事件
    // const var_item = lodash.find(this.get_var_event_i18n, (t) => t.nameCode === skt_data.cmec)
    // var_item && skt_data.cmec !== 'goal' && this.$root.$emit(this.emit_cmd.EMIT_VAR_EVENT, { skt_data, var_item });
  }
  // 赛事订阅(C8)-新增玩法/新增盘口(C303)
  function RCMD_C303(obj) {
    // if (!obj || this.matchid != obj.cd.mid) {
    //   return;
    // }
    // let skt_data = obj.cd;
    // // 新增玩法/新增盘口,重新拉取数据合并;
    // this.socket_upd_list_throttle(skt_data, () => {
    //   this.set_flag_get_ol_list(Math.random());
    // });
  }
  function RCMD_C109(obj) {
    //   if(!obj){return}
    //   let skt_data = obj.cd;
    //   if(!skt_data || skt_data.length<1) return;
    //   const matchIdObj = _.find(obj.cd, (o) => o.mid == this.matchid)
    //   if (!matchIdObj || matchIdObj.ms == '110') {
    //     return;
    //   }
    //   delete matchIdObj.hs;   //hs是无效数据不需要用到
    //   try {
    //     if (this.get_bet_status == 1 || this.get_bet_status == 7 || this.get_bet_status == 5) {
    //       this.set_http_update({mid:matchIdObj.mid,mhs:0})
    //     }
    //   } catch (error) {
    //     console.error(error)
    //   }
    //   // 重新拉取数据;
    //   this.socket_upd_list_throttle();
    //   this.triggle_tabs_update();
  }
  // 玩法集变更(C112)
  function RCMD_C112(obj) {
    // if (!obj || this.matchid != obj.cd.mid) {
    //   return;
    // }
    // let skt_data = obj.cd;
    // try {
    //   this.change_data_list(skt_data);
    // } catch (err) {
    //   console.error(err);
    // }
  }
  return {
    handler_ws_cmd,
  };
};
