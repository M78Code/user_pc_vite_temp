/*
 * @Description: 根据时间检查是否进行数据和字段合并
 * 赛事级别需要处理的ws推送业务命令C101, C102, C103, C104, C107, C110
 * C101==>ms
 * C102==>mst, mmp, mess, mat
 * C103==>msc
 * C104==>ms, mhs
 * C110==>mc
 * http获取赛事信息也需要进行处理
 */
export default class MatchDataUpdTime
{
  /**
   * @description: 构造函数
   */  
  constructor(key)
  {
    // 赛事列表对象
    this.match_many_obj = {}
    // 启动初始化方法
    this.init()

    //数据模板
    this.obj_ = {
      ms:0, // 赛事状态 0 赛事未开始 1 进行中 2暂停 3结束 4关闭 5取消 6 放弃 7延迟 8未知  9延期 10中断	
      mst:0, // 赛事进行时间
      mmp:0, // 比赛阶段
      mess:0, // mess 开始结束状态 1、start 0、stop（此字段只适用于特定事件编码）篮球暂停事件编码=time_start   
      mat:0, // 发球方  home 主队 away 客队
      msc:0, // 各种比分 [{S1|21:30},{S2|21:30},{S3|21:30}] --比分（比分类型|比分）
      mhs:0, // 0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态
      mc:0, // 赛事玩法总数
      ts:0  // 收到数据时的时间戳
    }
  }

  /**
   * @description: 初始化方法
   */  
  init(){
    // 启动定时清空数据的功能
    this.interval_id = setInterval(() => {
      let time_ = new Date().getTime();
      let max_time = 5*60*60*1000;
      for (const key in this.match_many_obj) {
        if (this.match_many_obj[key]) {
          if((time_- this.match_many_obj[key].upd_time_) > max_time)
          {
            delete this.match_many_obj[key];
          }
        }
      }
    }, 2*60*60*1000);
  }
  /**
   * @Description 销毁 
   * @param {undefined} undefined
  */
  destroy(){
    clearInterval(this.interval_id)
  }
  /**
   * @description: 获取超出指定时间最新需要更新的数据对象
   * @param {String} mid 赛事id
   * @param {Object} obj 需要设置的字段数据对象
   * @param {Number} time 时间戳
   * @return {Object} 需要更新和不更新的数据对象
   */  
  get_need_upd_obj(mid, obj, time){
    let res = {upd:{}, no_upd:_.cloneDeep(this.obj_)};
    if(mid && obj && time){
      let match_many_obj_ = this.match_many_obj[mid];
      if(match_many_obj_){
        for (const key in this.obj_) {
          if (obj.hasOwnProperty(key)) {
            if(match_many_obj_[key]>=time)
            {
              res.upd[key]=obj[key];
              delete res.no_upd[key]
            }
          }
        }
      }
    }
    return res
  }

  /**
   * @description: 设置赛事信息时间对象
   * @param {String} mid 赛事id
   * @param {Object} obj 需要设置的字段数据对象(只参考key值)
   * @param {Number} time 时间戳
   */  
  set_match_obj(mid, obj, time){
    if(obj && mid && time){
      let match_many_obj_ = this.match_many_obj[mid];
      let obj_ = _.cloneDeep(this.obj_);
      if(!match_many_obj_){
        obj_.mid = mid;
        this.match_many_obj[mid] = obj_;
        match_many_obj_ = obj_;
      }
      for (const key in obj_) {
        if (obj.hasOwnProperty(key)) {
          match_many_obj_[key] = time;
        }
      }
      match_many_obj_.mid=mid
      match_many_obj_.upd_time_=new Date().getTime()
    }
  }

  /**
   * @description: 设置赛事信息时间对象
   * @param {String} mid 赛事id
   * @param {String} key 需要检测的值
   * @param {Number} time 时间戳
   * @return {Boolean} 是否允许设置,true:允许, false:不允许
   */ 
  check_can_upd_data(mid, key, time){
    let res = true;
    if(key && mid && time){
      let match_many_obj_ = this.match_many_obj[mid];
      if(match_many_obj_){
        if(match_many_obj_[key] && time<match_many_obj_[key]){
          res = false;
        }
      }
    }
    return res;
  }
}

// let aa = new MatchDataUpdTime();
// aa.set_match_obj(55,{mmp:1,ms:9},9999)
// aa.set_match_obj(55,{ms:9},999)

// aa.set_match_obj(556,{mmp:1,ms:9},9999)
// console.log(aa.match_many_obj)
// aa.check_can_upd_data(55,'ms',90000)

// let ss=aa.get_need_upd_obj(55,{ms:12,mmp:3234}, 1000)
// console.log(JSON.stringify(ss))

