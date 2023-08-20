/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注记录
 */
export default {
  name: "bet-mix-record",
  props: {
 
    is_close: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    /**
     * @description: 是否还有确认中的状态
     * @param {undefined} undefined 
     * @return {Boolean}  
     */
    has_confirm_status() {
      return _.findIndex(this.view_ctr_obj.series_order_data, item=> item.orderStatusCode == 2) > -1;
    },
    // 总投注
    allBetAmount(){
      let count = 0
      this.view_ctr_obj.series_order_data.forEach(item=>{
        count+=Number(item.seriesBetAmount)
      })
      return count
    },
     //  预计总收益
    all_max_win_amount(){
      let count = 0
      this.view_ctr_obj.series_order_data.forEach(item=>{
        count+=Number(item.maxWinAmount)
      })
      return count
    },
  },
 
  watch: {
     /**
     * @description: 监控是否还有确认中的状态
     * @param {Boolean} new_ 是否还有确认中的状态 
     * @return {undefined} undefined 
     */
    has_confirm_status(new_) {
      if(!new_) {
        let success_count = 0; // 注单提交成功的个数
        let fail_count = 0; // 注单失败的个数
        _.forEach(this.view_ctr_obj.series_order_data, item=>{
          if(item.orderStatusCode == 0) {
            fail_count++;
          } else if(item.orderStatusCode == 1) {
            success_count++;                    
          }
        });

        // 全部成功
        if(success_count == this.view_ctr_obj.series_order_data.length) {
          this.view_ctr_obj.order_confirm_complete = 2;           
          clearTimeout(this.view_ctr_obj.timer_);
        }

        // 全部失败
        if(fail_count == this.view_ctr_obj.series_order_data.length) {
          this.view_ctr_obj.order_confirm_complete = 3;
          clearTimeout(this.view_ctr_obj.timer_);
        }
        // 有成功有失败的
        if(fail_count>0 && success_count > 0 && ((fail_count+success_count) == this.view_ctr_obj.series_order_data.length)) {
          this.view_ctr_obj.order_confirm_complete = 4;
          clearTimeout(this.view_ctr_obj.timer_);
        }
      }
    }
  }
}