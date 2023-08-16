


    /**
     * @description: 获取投注记录数据
     * @param {Object} params 投注记录入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    get_bet_record_data(params, callback) {
        this.send_gcuuid = uid();
        params.gcuuid = this.send_gcuuid;
        // console.log('get_bet_record_data====',JSON.stringify(params));
        let obj_ = {
          // axios api对象
          axios_api: api_betting.post_order_list,
          // axios api对象参数
          params: params,
          // 轮询次数
          max_loop: 2,
          // axios中then回调方法
          fun_then: res => {
            // console.log('get_bet_record_data=======',this.send_gcuuid === res.config.gcuuid);
            // if(this.send_gcuuid != res.config.gcuuid) {
            //   return;
            // }
  
            let gcuuid = _.get(res,'config.gcuuid')
            if(gcuuid && this.send_gcuuid != gcuuid) {
              return;
            }
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
          },
          // axios中catch回调方法
          fun_catch: err => {
            console.error(err);
            if (_.isFunction(callback)) {
              callback(-999, '');
            }
          }
        }
        this.$utils.axios_api_loop(obj_);
      },
      
  