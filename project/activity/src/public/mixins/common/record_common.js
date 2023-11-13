/*
 * @Author: Sword
 * @Date: 2020-08-04 17:14:24
 * @Description: 投注记录公共部分
 */
import { api_betting } from "project/activity/src/public/api/index.js";

export default {
	methods: {
  /**
   * @description: 检查状态是否从确认中变为已完成
   * @param {undefined} undefined 
   * @return {undefined} undefined 
   */  
		check_confirm_complete() {
			let result = false;
			/* console.log('=========check_confirm_complete===========');
      console.log(`========================record_obj:${JSON.stringify(this.record_obj)}`); */
      for(let obj of Object.values(this.record_obj)) {
         // 是否有确认中状态
         if(obj.orderStatus==3) {
           this.has_confirm_status = true; // 设置确认中状态为true
           result = true;
           break;
         }
      }
      if(!this.has_confirm_status && this.timer) {
        clearTimeout(this.timer);
			}
			//console.log(`=========has_confirm_status===========${this.has_confirm_status}`);
      return result;
    },
    /**
     * @description: 定时任务
     * @param {undefined} undefined 
     * @return {undefined} undefined 
     */
    get_timed_task() {
      //console.log('====================bet_record_view=============get_timed_task');
      if(this.has_confirm_status) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = undefined;
        }
        this.timer = setTimeout(()=>{
					//console.log('====================bet_record_view============ddddadafda');
          this.get_order_result();
        }, 5 * 1000); // 30s拉取接口改为5S
      }
    },
    /**
     * @description: 获取订单结果
     * @param {undefined} undefined 
     * @return {undefined} undefined 
     */
    get_order_result() {
      //console.log('=================================get_order_result========check_confirm_complete:'+this.check_confirm_complete());
      let orderNos =[];
      for(let [orderNo, obj] of Object.entries(this.record_obj)) {
        // 确认中状态则用orderNos收集订单号
        if(obj.orderStatus==3) {
          orderNos.push(orderNo);
        }
      }
      if(orderNos.length>0) {
        orderNos = orderNos.join(',');
        api_betting.query_order_status({orderNos}).then(res=>{
          let code = _.get(res, "data.code");
          let data = _.get(res, "data.data"); 
          let handle_time = _.get(res, 'data.ts');
          //console.log(`=====================================${JSON.stringify(data)}`);
          //清除定时器
          if(this.timer_) {
            clearTimeout(this.timer_);
            this.timer_ = undefined;
          }

          if(code == 200 && data) { 
            _.forEach(data, item=>{
              // 如果C201和接口拉取都同时进行,则优先最晚的执行
              if (this.record_obj[item.orderNo] && 
                this.record_obj[item.orderNo].handle_time && 
                this.record_obj[item.orderNo].handle_time > handle_time) {
                return;
              }
              Object.assign(this.record_obj[item.orderNo], {orderStatus: `${item.status}`, handle_time});
              if(item.status==0) { 
                // 订单状态为成功时 合并一下最新的数据,如果为失败则什么都不做                  
                if(item.oddsChangeList && item.oddsChangeList.length) { 
                  Object.assign(this.record_obj[item.orderNo], { maxWinAmount: ((parseFloat(item.newTotalMaxWinAmount)*100)/10000).toFixed(2)});
                  _.forEach(item.oddsChangeList, item2 => {
                    if(this.record_obj[item.orderNo].orderVOS && this.record_obj[item.orderNo].orderVOS.length) {
                      // 都住单对应的投注项集合获取
                      let order_vos = this.record_obj[item.orderNo].orderVOS;
                      for(let i=0;i<order_vos.length;i++) {
                        // 根据投注单id进行匹配
                        if(order_vos[i].playOptionsId==item2.playOptionsId) {
                          // 如果是单关的话后台返回的是最终赔率不用除10000
                          if(this.record_obj[item.orderNo].seriesType=='1') { 
                            Object.assign(this.record_obj[item.orderNo].orderVOS[i], {oddFinally: item2.usedOdds});                            
                          } else {
                            Object.assign(this.record_obj[item.orderNo].orderVOS[i], {oddFinally: item2.usedOdds});
                          }
                          // 更新vuex里面的数据             
                          let bet_obj = _.cloneDeep(this.yabo_common.get_bet_obj(this, oid));
                          if(bet_obj) {              
                            bet_obj.cs.odds_value = item2.usedOdds;
                            bet_obj.bs.hps[0].hl[0].ol[0].ov = item2.usedOdds;            
                            this.yabo_common.set_bet_obj_value(this, bet_obj);
                            // 同步详情和列表的数据
                            this.yabo_common.update_odds_info(this);        
                          }
                          break;
                        }
                      }
                    }
                  });
                }
              }
            });
          }
          // 是否要继续执行
          if(!this.check_confirm_complete()) return;
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
          }
          this.timer = setTimeout(()=>{           
            this.get_order_result();
          }, 2 * 1000);  // 5s 改为 2s    
        }).catch(()=>{
          console.log("获取订单状态和最新赔率最高可盈接口调用异常");
          //清除定时器
          if(this.timer_) {
            clearTimeout(this.timer_);
            this.timer_ = undefined;
          }
          this.timer = setTimeout(()=>{           
            this.get_order_result();
          }, 2 * 1000); // 5s 改为 2s
        });
      }
    }
  },
  destroyed() {
    //清除定时器
    if(this.timer_) {
      clearTimeout(this.timer_);
      this.timer_ = undefined;
    }
  }
}