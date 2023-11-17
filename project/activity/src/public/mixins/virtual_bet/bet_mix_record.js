/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注记录
 */
import betting from "src/public/mixins/betting/betting2.js";
import skt_data_mix_order from "src/public/mixins/websocket/data/skt_data_mix_order.js";
import { api_betting } from "src/public/api/index.js";
export default {
  name: "bet-mix-record",
  mixins: [betting, skt_data_mix_order],
  data() {
    return {
      order_detail_data: [],
      series_order_data: []
    }
  },
  props: {
    view_ctr_obj: {
      type: Object,
      default: {}
    },
    is_close: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.order_detail_data = _.cloneDeep(this.view_ctr_obj.order_detail_data);
    this.series_order_data = _.cloneDeep(this.view_ctr_obj.series_order_data);
    if(this.view_ctr_obj.order_confirm_complete==1) {
      this.get_timed_task();
    }
  },
  computed: {
    /**
     * @description: 是否还有确认中的状态
     * @param {undefined} undefined 
     * @return {Boolean}  
     */
    has_confirm_status() {
      return _.findIndex(this.series_order_data, item=> item.orderStatusCode==2)>-1;
    }
  },
  /**
     * @description: 监控是否还有确认中的状态
     * @param {Boolean} new_ 是否还有确认中的状态 
     * @return {undefined} undefined 
     */
  watch: {
    has_confirm_status(new_) {
      if(!new_) {
        let success_count = 0; // 注单提交成功的个数
        let fail_count = 0; // 注单失败的个数
        _.forEach(this.series_order_data, item=>{
          if(item.orderStatusCode==0) {
            fail_count++;
          } else if(item.orderStatusCode==1) {
            success_count++;                    
          }
        });

        // 全部成功
        if(success_count==this.series_order_data.length) {
          this.view_ctr_obj.order_confirm_complete = 2;           
          clearTimeout(this.view_ctr_obj.timer_);
        }

        // 全部失败
        if(fail_count==this.series_order_data.length) {
          this.view_ctr_obj.order_confirm_complete = 3;
          clearTimeout(this.view_ctr_obj.timer_);
        }
        // 有成功有失败的
        if(fail_count>0 && success_count>0 && ((fail_count+success_count)==this.series_order_data.length)) {
          this.view_ctr_obj.order_confirm_complete = 4;
          clearTimeout(this.view_ctr_obj.timer_);
        }
      }
    }
  },
  methods: {
    /**
     * @description: 定时任务
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_timed_task() {
      //console.log('=================================get_timed_task');   
      if([1,4].includes(this.view_ctr_obj.order_confirm_complete)) {
        if (this.view_ctr_obj.timer_) {
          clearTimeout(this.view_ctr_obj.timer_);
          this.view_ctr_obj.timer_ = undefined;
        }
        this.view_ctr_obj.timer_ = setTimeout(() => {
          //console.log('======================before call get_order_result');
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
      //console.log('=================================get_order_result========interval_time:'+this.interval_time());
      if(this.interval_time()) return;
      let orderNos = [];
      // 调用接口获取订单的最新数据
      _.forEach(this.series_order_data, item => {
        if((item.orderStatusCode==2)&&!orderNos.includes(item.orderNo)) {
          orderNos.push(item.orderNo);
        }
      });

      if(orderNos.length>0) {
        orderNos = orderNos.join(',');
        api_betting.query_order_status({orderNos}).then(res=>{
          let code = _.get(res, "data.code");
          let data = _.get(res, "data.data");
          let handle_time = _.get(res, 'data.ts');
          let status;
          //console.log(`=====================================${JSON.stringify(data)}`);
          if(this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          if(code==200 && data && data.length) {
            _.forEach(data, item => {
              status = this.change_status(item.status);
              let series_index = _.findIndex(this.series_order_data, item2=>item.orderNo==item2.orderNo);
              if(series_index>-1) {
                // 如果C201和接口拉取都同时进行,则优先最晚的执行
                if(this.series_order_data[series_index].handle_time && this.series_order_data[series_index].handle_time>handle_time) {
                  return;
                }
                Object.assign(this.series_order_data[series_index], {orderStatusCode: status, handle_time});
                if((status==1) && item.oddsChangeList && item.oddsChangeList.length) {
                  Object.assign(this.series_order_data[series_index], {maxWinMoney: parseFloat(item.newMaxWinAmount).toFixed(2)});	 
                  _.forEach(item.oddsChangeList, item2=> {
                      if(item2) {
                        _.forEach(this.order_detail_data, (detail_item, detail_index)=> {
                          if(item2.playOptionsId == detail_item.playOptionsId) {
                            // 赔率数据合并
                            Object.assign(this.order_detail_data[detail_index], {oddsValues: item2.usedOdds});
                          }
                        });  
                      }
                  });
                }
              }
            });            
          }
          let success_count = 0; // 注单提交成功的个数
          let confirm_count = 0; // 注单确认中的个数
          let fail_count = 0; // 注单失败的个数
          _.forEach(this.series_order_data, item=>{
            if(item.orderStatusCode==0) {
              fail_count++;
            } else if(item.orderStatusCode==1) {
              success_count++;
            } else if(item.orderStatusCode==2) {
              confirm_count++;
            }
          });
          // 全部成功
          if(success_count==this.series_order_data.length) {
            this.view_ctr_obj.order_confirm_complete = 2;
          }
          // 全部失败
          if(fail_count==this.series_order_data.length) {
            this.view_ctr_obj.order_confirm_complete = 3;
          }
          // 确认中的
          if(confirm_count>0) {
            this.view_ctr_obj.order_confirm_complete = 1;
          }
          // 有成功有失败的
          if(fail_count>0 && success_count>0 && ((fail_count+success_count)==this.series_order_data.length)) {
            this.view_ctr_obj.order_confirm_complete = 4
          }
          // 是否继续轮询
          if(this.interval_time()) return;
          if (this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          this.view_ctr_obj.timer_ = setTimeout(() => {
            this.get_order_result();
          }, 2 * 1000); // 5s 改为 2s
        }).catch((err)=>{
          console.error(err)
          console.log("获取订单状态和最新赔率最高可盈接口调用异常");
          if (this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
          this.view_ctr_obj.timer_ = setTimeout(() => {
            this.get_order_result();
          }, 2 * 1000); // 5s 改为 2s
        });
      }
    },
     /**
     * @description: 重置定时任务标志
     * @param {undefined} undefined 
     * @return {undefined} undefined 
     */
    interval_time() {
      let result = false;
      // 没有确认中状态则中断定时调用
      let index = _.findIndex(this.series_order_data, item=>item.orderStatusCode==2);
      if(index==-1) {
        clearTimeout(this.view_ctr_obj.timer_); 
        this.view_ctr_obj.timer_ = undefined;
        result = true;
      }
      return result;
    },
    /**
     * @description: 将接口状态跟投注结果状态进行转换匹配
     * @param {Number} status 状态
     * @return {type} 
     */
    change_status(status) {
      let bet_status = 0;
      switch(status) {
        case 0:
          bet_status = 1;
        break;
        case 3:
          bet_status = 2;
          break;
        case 4:
          bet_status = 0;
          break;
      }
      return bet_status;
    }
  },
  destroyed() {
    //清除定时器
    if(this.view_ctr_obj.timer_) {
      clearTimeout(this.view_ctr_obj.timer_);
      this.view_ctr_obj.timer_ = undefined;
    }
  }
}