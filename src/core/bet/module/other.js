   /**
     * @description:获取赛事是否存在赛果
     * @param {*} params    参数
     * @param {*} callback  回调函数
     * @return {undefined} undefined
     */
   get_exist_match_result(params, callback) {
    api_betting.get_exist_match_result(params).then(res => {
      let code = _.get(res, "data.code");
      let status = _.get(res, "status");
      if (code == 200 && status) {
        let data = _.get(res, "data.data");
        if (_.isFunction(callback)) {
          callback(code, data);
        }
      } else {
        if (_.isFunction(callback)) {
          callback(code, '');
        }
      }
    });
  }



    /**
     * @description: 投注前拉取最新的盘口赔率状态(应对socket推送不及时)
     * @param {Founction} callback
     * @return {undefined} undefined
     */
    check_odds_beforebet(callback) {
        let param = {
          idList: []
        };
        //单关
        if (this.is_bet_single) {
          //单关数据为空
          if (this.get_bet_single_list.length == 0) return;
          // 单关投注前校验接口参数组装
          for(let obj of Object.values(this.get_bet_single_obj)) {
            let temp = {};
            // 盘口id
            temp.marketId = _.get(obj, 'bs.hps[0].hl[0].hid');
            // 赛事id
            temp.matchInfoId = _.get(obj, 'bs.mid');
            // 投注项oid
            temp.oddsId = _.get(obj, 'bs.hps[0].hl[0].ol[0].oid');
            // 投注项类型
            temp.oddsType = _.get(obj, 'bs.hps[0].hl[0].ol[0].ot');
            // 玩法id
            temp.playId = _.get(obj, 'bs.hps[0].hpid');
            // 坑位
            temp.placeNum = _.get(obj, 'bs.hps[0].hl[0].hn');
            // 赛事类型
            temp.matchType= _.get(obj, 'cs.match_type');
            // 球种id
            temp.sportId=_.get(obj,'bs.csid');
            param.idList.push(temp);
          }
        } else { // 串关
          //单关数据为空
          if (this.get_bet_list.length == 0) return;
          // 串关投注前校验接口参数组装
          for(let obj of Object.values(this.get_bet_obj)) {
            let temp = {};
            // 盘口id
            temp.marketId = _.get(obj, 'bs.hps[0].hl[0].hid');
            // 赛事id
            temp.matchInfoId = _.get(obj, 'bs.mid');
            // 投注项oid
            temp.oddsId = _.get(obj, 'bs.hps[0].hl[0].ol[0].oid');
            // 投注项类型
            temp.oddsType = _.get(obj, 'bs.hps[0].hl[0].ol[0].ot');
            // 玩法id
            temp.playId = _.get(obj, 'bs.hps[0].hpid');
            // 坑位
            temp.placeNum = _.get(obj, 'bs.hps[0].hl[0].hn');
            // 赛事类型
            temp.matchType= _.get(obj, 'cs.match_type');
            // 球种id
            temp.sportId=_.get(obj,'bs.csid');
            param.idList.push(temp);
          }
        }
        this.send_gcuuid = uid();
        param.gcuuid = this.send_gcuuid;
        // console.log('query_last_market_info====',param);
        // 查询最新的盘口数据
        api_betting.query_last_market_info(param).then((res) => {
          // console.log('query_last_market_info=======',this.send_gcuuid === res.config.gcuuid);
          // if(this.send_gcuuid != res.config.gcuuid) return;
  
          let gcuuid = _.get(res,'config.gcuuid')
          if(gcuuid && this.send_gcuuid != gcuuid) {
            return;
          }
          //code码
          let code = _.get(res, "data.code");
          //返回数据
          let data = _.get(res, "data.data", []);
          if (data && data instanceof Array && data[0]) {
            //存储是否能预约
            // this.set_is_pre(_.get(data[0], 'pendingOrderStatus', -1));
            if (this.is_bet_single) {
  
              this.get_bet_single_list.forEach((item, i) => {
                // 调用vuex中的http_upd_data方法同步数据
                this.http_upd_data({
                  i: i,
                  http_data_list: data,
                  self: this
                });
              });
            } else {
              this.get_bet_list.forEach((item, i) => {
                // 调用vuex中的http_upd_data方法同步数据
                this.http_upd_data({
                  i: i,
                  http_data_list: data,
                  self: this
                });
              });
            }
          }
          // 如果回调函数存在,则调用
          if (_.isFunction(callback)) callback(code);
        })
      },
   