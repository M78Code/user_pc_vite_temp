/*
 * @Author: Cable
 * @Date: 2021-06-18 17:45:18
 * @Description: ws调用接口节流工具类
 * 
 * --------作用--------
 * 本节流文件主要是对列表页面ws推送相关的bymids接口structureMatchBaseInfoByMidsPB进行节流处理
 * 节流操作分为两类:1-菜单和球种关联逻辑节流,2-使用自定义的节流函数类进行数据节流
 * 备注:
 * 1-菜单和球种关联逻辑节流: 例如在今日菜单下足球菜单时,ws推送来的数据,ws仅仅只处理足球球种的ws命令
 * 2-使用自定义的节流函数类进行数据节流: 例如在某个菜单下1秒钟的时间内收到需要请求多个赛事信息时,节流类可以将其请求的所有赛事的mid,一次性进下数据请求,避免高频率多次请求赛事信息
 *   (本工具类主要实现2的功能)
 * ---------------------------------------------------------
 * 2021-11-09 功能说明
 * 目前列表页面使用到该节流功能
 * 关联的节流命令:C303,C102,C104,C114
 * 球种节流规则: 足球3s,非足球1s
 * 操作函数: debounce()函数中增加和修正需要节流的球种时间
 * 使用到的文件: skt_data_list_zhuanye.js(列表页面非滚球菜单使用),skt_data_list.js(列表页面滚球菜单使用)
 * ---------------------------------------------------------
 * 
 */
export default class WsDebounce {
  /**
   * @description: 构造函数
   * @param {Object} view Vue实例
   * @return {undefined} undefined
   */
  constructor(view) {
    // 视图对象
    this.view = view
    // 赛事ID
    this.mids = []
    // 球种ID
    this.csids = [],
    // 同步投注
    this.sync_bet_obj_list = []
    // 是否发送初始化玩法信息消息
    this.is_emit_init_play_info = false
  }
  /**
   * @Description 添加赛事ID 
   * @param {object} match 赛事信息
   * @param {object} sync_bet_obj 同步投注
   * @param {boolean} is_emit_init_play_info 是否发送初始化玩法信息消息
   * @param {undefined} undefined
  */
  add_mid(match,sync_bet_obj,is_emit_init_play_info){
    if(!this.mids.includes(match.mid)){
      this.mids.push(match.mid)
      this.csids.push(match.csid*1)
    }
    // 同步投注
    if(sync_bet_obj){
      this.sync_bet_obj_list.push(sync_bet_obj)
    }
    // 是否发送初始化玩法信息消息
    if(is_emit_init_play_info){
      this.is_emit_init_play_info = true
    }
    this.debounce()
  }

  /**
   * @description: 检测是否只有足球球种
   * @param {Array} csids 球种数组
   * @return {Boolean}
   */
     is_check_all_football(csids){
      let ret = false;
      let len = csids.length;
      if(csids && len){
        ret = true;
        for (let i = 0; i < len; i++) {
          if(csids[i] != 1){
            ret = false;
            break;
          }
        }
      }
      return ret;
    }

  /**
   * @Description 节流函数  3秒内重复调用只调用一次
   * @param {undefined} undefined
  */
  debounce(){
    let time_ = 1000;
    if(this.is_check_all_football(this.csids)){
      time_ = 3000
    }
    this.interval_id = setTimeout(() => {
      this.run_id = false
      this.call_api()
    },time_)

    if(!this.run_id){
      this.run_id = this.interval_id 
    }

    if(this.run_id != this.interval_id){
      clearTimeout(this.interval_id)
    }

  }
  /**
   * @Description 调用接口 
   * @param {undefined} undefined
  */
  call_api() {
    let mids = this.mids
    this.mids = []
    this.csids = []
    let params = {
      mids: mids
    }
    this.view.api_bymids(params,() => {
      // 同步投注
      this.sync_bet_obj_list.forEach( obj => {
        this.view.yabo_common.sync_bet_obj(this.view,obj);
      })
      // 发送初始化玩法信息消息
      if(this.is_emit_init_play_info){
        this.view.$root.$emit(this.view.emit_cmd.EMIT_INIT_PLAY_INFO_CMD);
      }
      this.sync_bet_obj_list = []
      this.is_emit_init_play_info = false
    });
  }
}