
    /**
     * @description:获取预约投注预约额度接口合并
     * @param {*} callback
     * @return {undefined} undefined
     */
    query_pre_bet_amount(callback, type='', oid = "") {
        let bet_obj;
        //是单关
        if (BetData.is_bet_single) {
          bet_obj = BetData.get_bet_single_obj;
        } else {
          bet_obj = this.get_bet_obj;
        }
        //获取额度接口合并 参数
        let param = this.get_bet_amount_param(bet_obj, oid);
        this.send_gcuuid = uid();
        param.gcuuid = this.send_gcuuid;
        console.log('preparam===', JSON.stringify(param));
        api_betting.query_pre_bet_amount(param).then(res=>{
          // console.log('prepreparam===', this.send_gcuuid === res.config.gcuuid);
          // if(this.send_gcuuid != res.config.gcuuid) {
          //   return;
          // }
          let gcuuid = _.get(res,'config.gcuuid')
          if(gcuuid && this.send_gcuuid != gcuuid) {
            return;
          }
          let code = _.get(res, "data.code");
          let data = _.get(res, "data.data") || { latestMarketInfo:[],betAmountInfo: [] };
          //原有获取额度返回结构体 betAmountInfo
          let {latestMarketInfo,betAmountInfo} = data;
          //原有最新盘口信息结构体 latestMarketInfo
          if(latestMarketInfo && _.isArray(latestMarketInfo)) {
            this.get_bet_single_list.forEach((item, i) => {
              // 调用vuex中的http_upd_data方法同步数据
              this.http_upd_data({
                i: i,
                http_data_list: latestMarketInfo,
                self: this
              });
            });
          } else {
            this.get_bet_list.forEach((item, i) => {
              // 调用vuex中的http_upd_data方法同步数据
              this.http_upd_data({
                i: i,
                http_data_list: latestMarketInfo,
                self: this
              });
            });
          }
          // 设置预约押注信息
          this.set_pre_bet_list(latestMarketInfo[0])
          if(_.isFunction(callback)) {
            callback(code, betAmountInfo);
          }
        });
      }
 /**
     * @description: 预约投注拉单,预约注单状态
     * @param {Object} params 预约投注拉单入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
 get_book_status_data(params, callback) {
    api_betting.get_book_status_list(params).then(res => {
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
  


      
    /**
     * @description: 预投投注取消
     * @param {Object} params 投注记录入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    cancel_book_record_order(params, callback) {
        api_betting.cancel_book_order(params).then(res => {
          let code = _.get(res, "data.code");
          let msg = _.get(res, "data.msg");
          let data = _.get(res, "data.data");
          if (!code) {
            code = _.get(res, "data.data.code");
            msg = _.get(res, "data.data.msg");
            data = _.get(res, "data.data.data");
          }
          let status = _.get(res, "status");
          if (code == 200 && status) {
            let data = _.get(res, "data.data");
            if (_.isFunction(callback)) {
              callback(code, data, msg);
            }
          } else {
            if (_.isFunction(callback)) {
              callback(code, '', msg);
            }
          }
        }).catch(error=> {
          console.error(error);
          if (_.isFunction(callback)) {
            callback(-999, '', msg);
          }
        });
      },


      /**
     * @description: 获取预投住注单记录
     * @param {Object} params 投注记录入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
     get_book_record_data(params, callback) {
        this.send_gcuuid = uid();
        params.gcuuid = this.send_gcuuid;
        // console.log('get_book_record_data====',JSON.stringify(params));
        api_betting.post_book_list(params).then(res => {
          let code = _.get(res, "data.code");
          let status = _.get(res, "status");
  
  
          // console.log('get_book_record_data====res===', this.send_gcuuid == res.config.gcuuid);
          // if(this.send_gcuuid != res.config.gcuuid) return;
  
          let gcuuid = _.get(res,'config.gcuuid')
          if(gcuuid && this.send_gcuuid != gcuuid) {
            return;
          }
  
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
     