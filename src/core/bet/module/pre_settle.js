 /**
     * @description:查询待确认中的提前结算单
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
 order_pre_settle_confirm(callback) {
    let param = {};
    this.send_gcuuid = uid();
    param.gcuuid = this.send_gcuuid;
    // console.log('init_data==order_pre_settle_confirm==',JSON.stringify(param));
    api_betting.query_order_pre_settle_confirm(param).then(res => {
      // console.log('init_data==order_pre_settle_confirm==res===', this.send_gcuuid == res.config.gcuuid);
      let gcuuid = _.get(res,'config.gcuuid')
      if(gcuuid && this.send_gcuuid != gcuuid) {
        return;
      }
      let code = _.get(res, "data.code");
      if (code == 200) {
        let data = _.get(res, "data.data");
        if (_.isFunction(callback)) {
          callback(code, data);
        }
      } else {
        if (_.isFunction(callback)) {
          callback(code, '');
        }
      }
    }).catch(err => {
      if(_.isFunction(callback)) {
        // 异常code吗给-999
        callback(-999, '');
      }
    });
  }

      /**
     * @description: 提前结算实时查询最高返还批量,每5秒请求一次
     * @param {Object} params 投注记录入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
      get_bet_cashout_max_amount(params, callback) {
        api_betting.get_cashout_max_amount_list(params).then(res => {
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
        }).catch(error=> {
          console.error(error);
          if (_.isFunction(callback)) {
            callback(-999, '');
          }
        });
      },
     
   