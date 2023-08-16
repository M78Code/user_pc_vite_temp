
  
    /**
     * @description: 初始化单关数据
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    init_bet_single_data() {
        _.forEach(this.get_bet_single_list, item => {
          let bs = _.cloneDeep(_.get(this,`get_bet_single_obj[${item}].bs`,{}));
          let cs = _.cloneDeep(_.get(this,`get_bet_single_obj[${item}].cs`,{}));
          if (_.get(cs,'submit_status')) {
            let obj = JSON.parse('{"key":"", "bs":{}, "cs":{}}');
            obj.key = item;
            obj.bs = bs;
            Object.assign(cs, {
              money: "", // 投注额
              win_money: "", // 可赢额
              min_money: "", // 最大值
              max_money: "", // 最小值
              submit_status: false
            });
            obj.cs = cs;
            this.bet_single_obj_attr(obj);
          }
        });
        // 清除押注成功的投注想
        this.clear_bet_single_list();
      },
  

            /**
       * @description: 添加单关投注项对象
       * @param {*} this.
       * @param {*} obj 要添加的对象
       */
            bet_single_obj_attr(obj) {
                let new_obj = _.cloneDeep(this.bet_obj);
                // if(obj.key && (Object.keys(new_obj).indexOf(obj.key) > -1) && !(_.get(obj, 'is_update_single', false))) return;
                console.log('添加单关投注项对象----------',obj);
                if(obj.key && !obj.mode) {
                  if(obj.cs.source == 'is_chat_room' || obj.cs.play_name == ''){  
                    if(obj.cs.play_name == '' && this.bet_single_obj[obj.key] && this.bet_single_obj[obj.key].cs && this.bet_single_obj[obj.key].bs){
                    let _cs = _.cloneDeep(this.bet_single_obj[obj.key].cs)
                    let _bs = _.cloneDeep(this.bet_single_obj[obj.key].bs)
                      obj.cs.play_name = _cs.play_name;
                      obj.bs.hps[0].hl[0].ol.hpn = _bs.hps[0].hl[0].ol.hpn
                    }
                    this.bet_single_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
                    this.bet_single_obj = _.cloneDeep(this.bet_single_obj);
                  }else{
                    this.bet_single_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
                    this.bet_single_obj = _.cloneDeep(this.bet_single_obj);
                  }
                } else if (obj.key && obj.mode=='clear_and_add') {
                  this.bet_single_obj = {};
                  this.bet_single_obj[obj.key] = { cs: obj.cs, bs: obj.bs };
                  this.bet_single_obj = _.cloneDeep(this.bet_single_obj);
                } else if(obj && !obj.key) {
                  this.bet_single_obj = obj;
                }
              }