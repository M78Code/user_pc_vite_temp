  /**
     * @description:删除盘口中的垃圾盘口
     * @param {Founction} callback
     * @return {undefined} undefined
     */
  remove_close_handicap(callback) {
    if (this.is_bet_single) {
      let len = this.get_bet_single_list.length;
      for (let index = 0; index < len; index++) {
        let id = this.get_bet_single_list[index];
        // 投注服务器对象
        let item_bs = _.get(this.get_bet_single_obj, `${id}.bs`,{});
        // 投注客户端对象
        let item_cs = _.get(this.get_bet_single_obj, `${id}.cs`,{});
        // match_over: 1赛事结束
        if ((!_.isEmpty(item_bs) && this.get_item_disable(item_bs)) || (!_.isEmpty(item_cs) && item_cs.match_over==1)) {
          this.bet_single_obj_remove_attr(id);
          // 关盘时,删除该子项
          this.bet_single_list_remove(index, 1);
          index--;
        }
      }
    }
    if (_.isFunction(callback)) {
      callback();
    }
  }

   /**
     * @description:移除串关结束的赛事
     * @param {*} callback
     * @return {undefined} undefined
     */
   remove_mix_match_end(callback) {
    //串关
    if (!this.is_bet_single) {
      let is_remove_match = false;
      let len = this.get_bet_list.length;
      for (let index = 0; index < len; index++) {
        let id = this.get_bet_list[index];
        // 投注服务器对象
        let item_bs = _.get(this.get_bet_obj, `${id}.bs`,{});
        //投注客户端对象
        let item_cs = _.get(this.get_bet_obj, `${id}.cs`,{});
        // match_over: 1赛事结束 或者不支持串关
        if ((!_.isEmpty(item_bs) && this.get_item_disable(item_bs)) || (!_.isEmpty(item_cs) && (item_cs.match_over==1 || !item_cs.serial_type))) {
          // 删除投注对象
          this.bet_obj_remove_attr(id);
          // 关盘时,删除该子项
          this.bet_list_remove(index, 1);
          index--;
          is_remove_match = true;
        }
      }
      if(_.isFunction(callback)) {
        // 在回调中根据is_remove_match判断是否需要移除赛事
        callback(is_remove_match);
      }
    }
  }

