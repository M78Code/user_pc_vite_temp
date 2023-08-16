    /**
       * @description: 初始化串关数据
       * @param {undefined} undefined
       * @return {undefined} undefined
       */
    init_bet_mix_data() {
        //所有串关的金额
        this.get_bet_s_list.forEach(item => {
          let bs = _.cloneDeep(_.get(this,`get_bet_s_obj[${item}].bs`,{}));
          let cs = _.cloneDeep(this,`get_bet_s_obj[${item}].cs`,{});
          let obj = JSON.parse('{"key":"", "bs":{}, "cs":{}}');
          obj.key = item;
          obj.bs = bs;
          Object.assign(cs, {
            ...bs,
            money: "", // 投注额
            win_money: "", // 可赢额
            min_money: "", // 最大值
            max_money: "" // 最小值
          });
          obj.cs = cs;
          this.bet_obj_add_attr(obj);
        });
      },


      

    /**
     * @description: 获取投注模块-统计串关数
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    getSeriesCountJointNumbe(callback) {
        let data = BetCountJointNumber.getBetCountJoint(this.get_bet_list.length);
        let min_num = this.get_mix_min_count;
        if(min_num <= 10) {
          data = data.filter((item) => {
            return Number(item.id.slice(0, 1)) >= min_num ||  ['10串1','10串1013'].includes(item.name) }
            );
        }else if(this.get_bet_list.length == 10){
          data = [data[0]];
        }else {
          data = [];
        }
        console.log(JSON.stringify(data));
        if (_.isFunction(callback)) {
          callback(200, data);
        }
      },
  
  