/*
 * @Author: Success
 * @Date: 2020-12-31 18:08:19
 * @Description: 虚拟体育公共工具类(自动下发实时数据工具类,部分公共函数)
 * 
 * 使用demo
    let data={"csid":"1001","mgt":"1609469351434","mid":"9218879570202626","thirdMatchVideoUrl":"https://hls.mixmoon.net/hls-service/gg/master/spain2020/254/478/65-0-1/86-0-1/26-0-1/130-0-0/113-1-1/11-0-0.m3u8/-/CMYnwnJz9MHd-RJY3UWWvQ/1609469521","list":[{"away":"0","awayName":"osasuna","home":"1","homeName":"athletic_bilbao","updateTime":"10"},{"away":"0","awayName":"osasuna","home":"2","homeName":"athletic_bilbao","updateTime":"20"},{"away":"0","awayName":"osasuna","home":"3","homeName":"athletic_bilbao","updateTime":"30"}]};
    data.mgt = new Date().getTime()
    let vsport = new VSport(data,function(res){
      console.log(`${JSON.stringify(res)}`)
    });
    // 页面关闭时调用销毁函数
    vsport.destroy();
 *
 */
import { api_v_sports } from "src/api/index.js";
import LoopCallback from "src/core/vr/vr-sports/loop_callback.js";
import PageSourceData from "src/core/page-source/page-source.js";
import {sleep} from "licia";
export default class VSport {
  /**
   * @Description:构造函数
   * @param {Object} sport_data // 虚拟体育赛事信息  
   * @param {Function} callback // 回调函数
   */  
  constructor(sport_data, callback) {
    // 消费开关
    this.run = true;
    // 目前加载时间(毫秒)
    this.current_time = 0;
    // 最新数据中的时间
    this.update_time = 0;
    // 定时current_time更新定时器
    this.interval_current_time = null;
    // 比赛的总时长 默认20s
    this.total_time = 20;
    // 更新数据列表 
    this.upd_list = null;
    // 赛事播放中联赛所有信息
    this.match_play_data_obj = {};
    // 赛事播放中的单场数据
    this.match_info = null;
    // 循环调用接口对象
    this.loop_callback = null;
    // 赛事状态
    this.match_status = 0;
    if(sport_data && callback){
      // 赛事信息对象,消费数据
      this.sport_data = sport_data;
      if(sport_data.list){
        this.upd_list = lodash.cloneDeep(sport_data.list);
      }
      // 设置比赛的总时长 默认90s
      if(sport_data.totalTime){
        this.total_time = parseFloat(sport_data.totalTime);
      }
      // 回调函数
      this.callback = callback;
      // 启动定时器
      this.start();
    }
    // 记录上一次的回调数据对象
    this.item_obj_old = null;
  }

  /**
   * @description: 销毁函数(vue组件销毁时关闭)
   */  
  destroy(){
    // 赛事状态
    this.match_status = 0;
    // 消费开关
    this.run = false;
    // 初始化时间
    this.current_time = 0;
    this.update_time = 0;
    // 赛事信息对象,消费数据
    this.sport_data = null;
    // 回调函数
    this.callback = null;
    // 赛事播放中联赛所有信息
    this.match_play_data_obj = {};
    // 赛事播放中的单场数据
    this.match_info = null;
    // 清除定时器
    if(this.interval_current_time){
      clearInterval(this.interval_current_time);
      this.interval_current_time = null;
    }

    // 循环调用接口对象销毁
    if(this.loop_callback){
      this.loop_callback.destroy();
    }
    this.loop_callback = null;
    // 记录上一次的回调数据对象
    this.item_obj_old = null;
  }

  /**
   * @Description:重新设置数据信息,重新启动定时器
   * @param {Object} sport_data // 虚拟体育赛事信息  
   * @param {Function} callback // 回调函数
   */ 
  set_data(sport_data,callback){
    this.stop();
    this.$nextTick(() => {
      // 设置定时器开关
      this.run = true;
      // 初始化时间
      this.current_time = 0;
      this.update_time = 0;
      // 赛事状态
      this.match_status = 0;
      // 赛事信息对象,消费数据
      this.sport_data = sport_data;
      if(sport_data && sport_data.list){
        this.upd_list = lodash.cloneDeep(sport_data.list);
      }
      // 记录上一次的回调数据对象
      this.item_obj_old = null;
      // 设置比赛的总时长 默认90s
      if(sport_data && sport_data.totalTime){
        this.total_time = parseFloat(sport_data.totalTime);
      }
      // 回调函数
      this.callback = callback;
      // 启动定时器
      this.start();
    })
  }


  /**
   * @description: 实时同步最新时间
   */  
  upd_current_time(){
    if (this.sport_data) {
      let mgt = Number(this.sport_data.mgt);
      let remote_time = Number(PageSourceData.init_time.server_time);
      let local_time = Number(PageSourceData.init_time.local_time);
      this.current_time = (remote_time + (new Date().getTime() - local_time) - mgt);
    }
  }


  /**
   * @description: 停止计时器
   */  
  stop() {
    this.run = false;
  }

  /**
   * @description: 获取当前最新实时数据,调用callback函数回调动作
   * @param {Array} list 赛事所有数据列表
   * @param {Number} upd_time 目前更新的时间
   */  
  work(list, upd_time){
    if(this.sport_data){
      // 获取需要更新的赛事数据
      let ret = this.get_upd_time_obj_data(this.upd_list, this.current_time/1000);
      if(this.callback){
        // 进行回调下发数据操作
        this.callback(ret);
      }
    }
  }

  /**
   * @description: 启动定时器
   */  
  start() {
    this.upd_current_time();
    // 实时同步最新时间
    if(this.interval_current_time){
      clearInterval(this.interval_current_time);
    }
    this.interval_current_time = setInterval(() => {
      this.upd_current_time();
    }, 1000*30);
    (async () => {
      let time = 0;
      while (this.run) {
        time = new Date().getTime();
        // 消费一条记录
        this.work();
        await sleep(800);
        this.current_time += (new Date().getTime()-time);
      }
    })();
  }

  /**
   * @description: 赛事进行中显示的比赛时间
   * @return {Number}
   */  
  get_match_show_time(){
    let show_time = 0;
    if(this.sport_data && this.sport_data.csid && this.total_time){
      switch (parseInt(this.sport_data.csid)) {
        case 1001: // 虚拟足球
        case 1004: // 虚拟篮球
          show_time = Math.round((90*(this.current_time/1000))/this.total_time);
          break;
        default:
          break;
      }
    }
    return show_time;
  }

  /**
   * @description: 获取指定时间戳需要更新的数据信息
   * @param {*} list 所有需要刷新的数据信息集合(本函数会自行删掉过期的无用数据)
   * @param {*} upd_time 更新的时间戳
   * @return {Object} 数据结构{index, item_obj, upd_time, upd},
   *                  index为-1时upd_time间戳比list中最小的时间戳还小, 
   *                  index为-2时,upd_time时间戳比list中最大的时间戳还大,
   *                  index值大于-1时,为正常的list中的索引位置
   *                  upd标识item_obj返回的数据是否较上次有变化
   *                  upd_time标识目前进行的时间
   *                  item_obj标识当前最新的数据
   *                  end标识赛事是否结束
   *                  show_time 当前赛事进行中的显示时间(足球使用)
   *                  match_status 0-未开始,1-进行中,2-比赛结束
   */  
  get_upd_time_obj_data(list, upd_time){
    let index = -1;
    let item_obj = null;
    let item_upd_time = 0;
    // 数据是否较上次有更新
    let upd = 0;
    // 赛事结束
    let end = 0;
    // 比赛状态
    let match_status = 0;
    if(list && list.length){
      let len1 = list.length;
      for(let i = 0; i < list.length; i++){
        const item = list[i];
        if(item && item.updateTime){
          item_upd_time = parseFloat(item.updateTime);
          if(upd_time == item_upd_time){
            index = i;
            break;
          } else if(upd_time < item_upd_time)
          {
            if(i==0){
              index = -1;
            } else {
              index = i-1;
            }
            break;
          }
          if(i == (list.length-1)){
            index = -2;
          }
        }
      }
      
      // 删除多用的无用数据
      if(index>-1){
        item_obj = list[index];
        if(item_obj){
          let update_time_ = item_obj.updateTime
          if(this.update_time !=  update_time_){
            upd = 1;
          }
          this.update_time = update_time_;
        }
        list.splice(0,index);
        index = 0;
      } else if(index == -1){
        item_obj = null;
        // item_obj = list[0];
        // if(item_obj){
        //   let update_time_ = item_obj.updateTime
        //   if(this.update_time !=  update_time_){
        //     upd = 1;
        //   }
        //   this.update_time = update_time_;
        // }
      } else if(index == -2){
        if(list.length > 1){
          item_obj = list[list.length-1];
          if(item_obj){
            let update_time_ = item_obj.updateTime
            if(this.update_time !=  update_time_){
              upd = 1;
            }
            this.update_time = update_time_;
          }
          list.splice(0,1);
        } else{
          item_obj = list[0];
        }
      }
    }
    

    if(upd_time >= 0){
      if(this.match_status==0){
        this.match_status = 1;
        // this.get_match_new_data();
      } else{
        this.match_status = 1;
      }
    }

    if(this.sport_data.totalTime){
      this.total_time = parseFloat(this.sport_data.totalTime);
    } else if(this.match_info && this.match_info.totalTime){
      this.total_time = parseFloat(this.match_info.totalTime);
    }
    if(upd_time>=this.total_time){
      this.match_status = 2;
      end = 1;
      this.run = false;
    }
    //upd值修正
    if((!this.item_obj_old) && item_obj){
      upd = 1;
    } else if(this.item_obj_old && item_obj){
      if(this.item_obj_old.updateTime != item_obj.updateTime){
        upd = 1;
      }
    }
    this.item_obj_old = item_obj;
    let show_time = this.get_match_show_time();
    // console.log(`${this.sport_data.no}****${this.sport_data.mid}****${JSON.stringify({index, item_obj, upd_time, upd, end, show_time, match_status:this.match_status,total_time:this.total_time,match_info:this.match_info})}`);
    return {index, item_obj, upd_time, upd, end, show_time, match_status:this.match_status,sport_data:this.sport_data,match_info:this.match_info};
  }
  /**
   * @description: 当赛事开始时拉取最新的赛事信息
   */  
  get_match_new_data(){
    let mid = this.sport_data.mid;
    let params = {
      "csid": this.sport_data.csid,
      "tid": this.sport_data.tid,
      "mid": this.sport_data.mid,
      "batchNo": this.sport_data.batchNo,
      "orderNo": this.sport_data.orderNo,
    }
    // 实例化循环调用接口对象
    this.loop_callback = new LoopCallback(async(n)=>{
      let res_ = false;
      await api_v_sports.get_virtual_video_process(params).then(res => {
        if(res.code == 200){
          if(res.data && res.data.detail && Object.keys(res.data.detail).length){
            let match_play_data = lodash.cloneDeep(res.data);
            if(match_play_data){
              this.upd_match_play_data(match_play_data, mid)
            }
            res_ = true;
          }
        }
      });
      return res_;
    }, {loop_count: 20, step: 1000,});
    
  }

  /**
   * @description: 同步数据到当前数据赛事中
   * @param {Object} match_play_data 赛事的所有进行中的信息
   * @param {String} mid 赛事编号
   */  
  upd_match_play_data(match_play_data, mid){
    this.match_play_data_obj[match_play_data.batchNo] = match_play_data;
    if(mid){
      this.match_info = lodash.get(match_play_data,`detail[${mid}]`)
      if(this.match_info){
        this.upd_list = lodash.cloneDeep(this.match_info.list);
        this.total_time = parseFloat(this.match_info.totalTime);
      }
    }
  }
}