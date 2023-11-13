/*
 * @Author: Sword
 * @Date: 2020-09-05 20:13:44
 * @Description: websocket数据页面数据接入 ---- 视频大屏 
 * 视频大屏和右侧详情同步显示，右侧详情已经订阅，所以这里不做订阅
 */

export default {
  methods: {
    /**
     * C101 数据
     * `mid` 赛事Id
     * `ms` 赛事状态 0:未开赛 1:赛事进行中  2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
    * @Description:赛事状态
    * @Author Cable
    * @param {object} 推送内容
    */
    RCMD_C101(obj) {
      //数据不存在不做处理
      if(!obj) {
        return;
      }      
      let skt_data = obj.cd; //指令消息体
      if(skt_data.mid != this.match_info_ctr.match_obj.mid) return;       //赛事id
      // 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断	
      Object.assign(this.match_info_ctr.match_obj, {ms: skt_data.ms});
    },
    /**    
     *  C102 推送数据
     * `mid` 赛事Id
     * `mst` 比赛进行时间/比赛剩余时间
     * `cmec` 事件编码
     * `cmes` 事件状态 0:未取消 1:被取消
     * `mat` 发球方,主队发球 home，客队发球：away
     * `mmp` 
     * `mess` 开始结束状态 1:start 0:stop此字段只适用于特定事件编码）篮球暂停事件编码=time_start  现阶段只关注0、 1 其它值不必关注
     * `mct` 当前节/盘/局
     * `mbhn` 好球数（棒球专用）
     * `mbkn` 坏球数（棒球专用）
     * `mbcn` 出局数（棒球专用）
     * `mbolp` 一垒  0:未占用  1:已占用（棒球专用）
     * `mbtlp` 二垒 0:未占用  1:已占用（棒球专用）
     * `mbthlp` 三垒 0:未占用  1:已占用（棒球专用）
     * `mststs` 是否补时 0未开,1开
     * `mststi` 补时固定时间：比如补5分钟
    * @Description:赛事事件
    * @Author Cable
    * @param {object} 推送内容
    */
    RCMD_C102(obj) {
      //数据不存在不做处理
      if(!obj) {
        return;
      }
      let skt_data = obj.cd; //指令消息体
      if(skt_data.mid != this.match_info_ctr.match_obj.mid) return;
      Object.assign(this.match_info_ctr.match_obj,{...skt_data});
    },
    /**
     * C103 推送数据
     * `mid` 赛事Id
     * `csid` 球种Id
     * `msc` 比分
    * @Description:赛事比分
    * @Author Cable
    * @param {object} 推送内容
    */
    RCMD_C103(obj) {
      //数据不存在或者不是当前赛事不做处理
      if (!obj || (obj && this.match_info_ctr.match_obj.mid != obj.cd.mid)) {
        return;
      }
      let skt_data = obj.cd; //指令消息体
      let cur_match = this.match_info_ctr.match_obj;
      if(skt_data.mid != cur_match.mid) return;
      //console.log(`=============================合并数据前=========${JSON.stringify(cur_match.msc)}`);
      // 将socket推送的比分数组转换为对应,并与原有的赛事比分进行合并
      let score_obj = this.yabo_common.msc_array_obj(skt_data.msc);
      //console.log(`=============================合并数据前=========${JSON.stringify(this.match_infoData.msc)}`);
      Object.assign(cur_match.msc, score_obj); 
      //console.log(`=============================合并数据后=========${JSON.stringify(cur_match.msc)}`);
      return;
         // 足球、篮球、棒球、乒乓球、排球
         if([1,2,3,8,9].includes(skt_data.csid*1)) {
          // 同步比分
          this.yabo_common.update_bet_score(this, skt_data.mid, this.socket_name);
        }
    },
    /**     
     *  C107 推送数据
     * `mvs` 动画状态 -1 没有配置动画源 ，
     *    0 ： 已配置，但是不可用     
     *    1： 已配置，可用，播放中   
     *    2：已配置，可用，播放中
     * `mms` 动画状态 -1 没有配置动画源 ，
     *    0 ： 已配置，但是不可用   
     *    1： 已配置，可用，播放中   
     *    2：已配置，可用，播放中
     *  *   lvs 直播状态  -1 无 2有
    * @Description:视频状态
    * @Author Cable
    * @param {object} 推送内容
    */
    RCMD_C107(obj) {
      //数据不存在
      if(!obj) {
        return;
      }
      let skt_data = obj.cd; //指令消息体
      if(skt_data.mid != this.match_info_ctr.match_obj.mid) return;
      Object.assign(this.match_info_ctr.match_obj,{...skt_data});
    },
    /**
    * @Description:进球事件
    * @Author Cable
    * @param {object} 推送内容
    */
    RCMD_C115(obj) {
      //数据不存在
      if(!obj) {
        return;
      }
      let skt_data = obj.cd; //指令消息体
      if(skt_data.mid != this.match_info_ctr.match_obj.mid) return;
      skt_data.secondsFromStart = parseInt(skt_data.secondsFromStart / 60)
      skt_data.is_show = true
      Object.assign(this.match_info_ctr.match_obj.goal_info,skt_data);
      clearTimeout(this.timer_id_1)
      this.timer_id_1 = setTimeout(()=>{
        this.match_info_ctr.match_obj.goal_info.is_show = false
      }, 6000)
    },
  },

  mounted() {  
    if (window.ws) {   
      // 注册
      window.ws.addQueueViewObj(this.socket_name, this);
    }
  },
  destroyed() {
    //清除延时器
    clearTimeout(this.timer_id_1)
    if (window.ws) {
      //删除
      window.ws.removeQueueViewObj(this.socket_name);
    }
  }
}