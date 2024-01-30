/* 
 处理详情ws逻辑
 useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS) 触发3个接口的更新  details cateragy  oddinfo
 useMittEmit(MITT_TYPES.EMIT_MATCH_DETAIL_SOCKET) 触发1个接口的更新盘口更新  oddinfo
useMittEmit(MITT_TYPES.EMIT_GET_ODDS_LIST)    触发玩法集接口     cateragy
*/

import {  useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { MatchDataWarehouse_H5_Detail_Common,MatchDataWarehouse_PC_Detail_Common } from "src/output/module/match-data-base.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { PROJECT_NAME } = BUILDIN_CONFIG ;
console.log(PROJECT_NAME,'PROJECT_NAME');
export const details_ws = () => {
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
  const handler_ws_cmd = (cmd, data,mid) => {
    // 如果mid与我们的赛事id不一致 不处理  
    if (lodash.get(data, "cd.mid") != mid ) return;
    // console.log(cmd, data, "datacmd");
    switch (cmd) {
      // 赛事订阅(C8)-新增玩法/新增盘口(C303)
      case "C303":
        if(PROJECT_NAME == 'app-h5'){
          useMittEmit(MITT_TYPES.EMIT_GET_ODDS_LIST)
        }
        useMittEmit(MITT_TYPES.EMIT_MATCH_DETAIL_SOCKET)
        break;
       // 赛事开赛状态(C302)  
      case "C302":
        // 赛事状态变化
        useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS)
        break;
      case "C104":
        RCMD_C104(data);
        break;
      case "C109":
        RCMD_C109(data);
        break;
       //  玩法集变更(C112)    
      case "C112":
        if(PROJECT_NAME == 'app-h5'){
          useMittEmit(MITT_TYPES.EMIT_GET_ODDS_LIST)
        }
        useMittEmit(MITT_TYPES.EMIT_MATCH_DETAIL_SOCKET)
        break; 
       case "C102":
          RCMD_C102(data);
          break;
       case "C110":
         RCMD_C110(data);
         break;  
       case "C105":
          RCMD_C105(data);
          break;        
      default:
        break;
    }
  }
  /**
   * @description: 处理玩法更新
   * @param {*} obj
   * @return {*}
   */
  function RCMD_C105(obj){
     // 足球赛事投注玩法，基准分的动态更新
     try {
        if(Array.isArray(obj.hls) && obj.hls.length){
          useMittEmit(MITT_TYPES.EMIT_CHANGE_BASE_SCORE, obj.hls)
        };
      } catch (err) {
        console.error(err);
      }
  
  }
    /**
   * @description: RCMD_C109
   * @return {*}
   */
    function RCMD_C109(obj) {
      if (!obj) {
        return;
      }
      let skt_data = obj.cd;
      if (!skt_data || skt_data.length < 1) return;
      // 重新拉取数据; 因为
      if(PROJECT_NAME.includes('pc')){
        useMittEmit(MITT_TYPES.EMIT_GET_ODDS_LIST)
      }else{
        useMittEmit(MITT_TYPES.EMIT_GET_ODDS_LIST)
        useMittEmit(MITT_TYPES.EMIT_MATCH_DETAIL_SOCKET)
      }
      
    }
    /**
     * @description: 赛事级别盘口状态(C104)  hs: 0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态
     * @param {*} obj
     * @return {*}
     */
    function RCMD_C104(obj) {
      let skt_data = obj.cd;
      // 赛事级别盘口状态 0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
      if (skt_data.mhs == 0 || skt_data.mhs == 11) {
        // 重新拉取数据;
          // 重新拉取数据; 因为
      if(PROJECT_NAME.includes('pc')){
        useMittEmit(MITT_TYPES.EMIT_GET_ODDS_LIST)
      }else{
        useMittEmit(MITT_TYPES.EMIT_GET_ODDS_LIST)
        useMittEmit(MITT_TYPES.EMIT_MATCH_DETAIL_SOCKET)
      }
      } else if (skt_data.mhs == 1) {
        // 设置盘口状态
      } else if (skt_data.mhs == 2) {

        set_match_details(obj.cd.mid)
      }
    }
    /**
     * @description: 赛事事件C102)  
     * @param {*} obj
     * @return {*}
     */
    function RCMD_C102(obj) {
      let skt_data = obj.cd;
      if (skt_data.mmp == 999) {
        //切换赛事
        // useMittEmit(MITT_TYPES.EMIT_CHANGE_DETAILS_MATCH)
      }  
    }
   //赛事玩法数量
   /**
    * @description: RCMD_C110 锁盘 mc==0
    * @param {*} obj
    * @return {*}
    */
   function RCMD_C110(obj){
      if(obj.cd.mc == 0){
        if(PROJECT_NAME.includes('pc')){
          MatchDataWarehouse_PC_Detail_Common.set_match_details()
        }else{
          MatchDataWarehouse_H5_Detail_Common.set_match_details()
        }
        
        set_match_details(obj.cd.mid)
        //清除玩法缓存
        sessionStorage.removeItem("match_oddinfo")
      }
    }
   /**
    * @description:  // 视频/动画状态推送（C107  暂时不单独处理
    * @param {*} obj
    * @return {*}
    */
   function RCMD_C107(obj) {
      if (!obj || this.matchid != obj.cd.mid) {
        return;
      }
      let skt_data = obj.cd;
      /**
       * mvs - 赛事动画状态   0:不可用 1:可用，暂未播放 2：可用，播放中
       * mms - 赛事视频动态   0:不可用 1:可用，暂未播放 2：可用，播放中
       */
      // this.updata_detail_data(skt_data);
    }
  /**
   * @description: 设置盘口状态
   * @param {*} mid
   * @return {*}
   */
  function set_match_details(mid,odds_info){
    if(PROJECT_NAME.includes('pc')){
      MatchDataWarehouse_PC_Detail_Common.set_match_details(MatchDataWarehouse_PC_Detail_Common.get_quick_mid_obj(mid),odds_info)
    }else{
      MatchDataWarehouse_H5_Detail_Common.set_match_details(MatchDataWarehouse_H5_Detail_Common.get_quick_mid_obj(mid),odds_info)
    }
    
  }  
  return {
    handler_ws_cmd,
  };
};
