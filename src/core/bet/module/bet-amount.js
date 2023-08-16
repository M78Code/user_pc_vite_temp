


    /**
     * @description: 获取押注项最大和最小的金额
     * @param {Array} item_list 列表
     * @param {Number} seriesType-串关类型, 串关类型(1：单关(默认) 、2：双式投注,例如1/2  、3：三式投注,例如1/2/3   、4：N串1,例如4串1   、5：N串F,例如5串26 )
     * @param {Function} callback -回调函数
     * @return {undefined} undefined
     */
    get_min_max_money(item_list,seriesType, callback) {
        if(seriesType==2 && (!_.isArray(item_list) || (_.isArray(item_list) && _.get(item_list,'length',0)==0))) {
          return;
        }
        // 获取押注项最大和最小的金额
        let bet_list = this.is_bet_single? this.get_bet_single_list : this.get_bet_list
        // 获取押注项最大和最小的金额
        let parm_obj = {
          orderMaxBetMoney: []
        };
        bet_list.forEach(id => {
          let obj, item_bs, item_cs;
          if (this.is_bet_single) {
            obj = "get_bet_single_obj";
          } else {
            obj = "get_bet_obj";
          }
          if(_.has(this[obj],`${id}.bs`) && _.has(this[obj],`${id}.cs`)) {
            item_bs = _.get(this,`${obj}.${id}.bs`,{});
            item_cs = _.get(this,`${obj}.${id}.cs`,{});
          } else {
            return;
          }
          let parm = {};
          // 设置用户Id
          if (this.get_user) {
            parm.userId = this.get_user.uid;
          }
          //设备类型
          parm.deviceType = 2;
          //盘口id
          parm.marketId = _.get(item_bs, 'hps[0].hl[0].hid');
          //盘口值
          // parm.marketValue = _.get(item_cs, 'handicap_value');
  
          //赛事id
          parm.matchId = _.get(item_bs, 'mid');
          //最终赔率
          parm.oddsFinally = this.compute_value_by_cur_odd_type((_.get(item_cs, 'odds_value') / 100000), (_.get(item_cs, 'break_odds_value') / 100000));
  
          //赔率
          parm.oddsValue = _.get(item_cs, 'odds_value');
          //玩法id
          parm.playId = _.get(item_bs, 'hps[0].hpid') || _.get(item_bs, 'hps[0].hl[0].hpid');
  
          //投注项id
          parm.playOptionId = _.get(item_cs, 'oid');
  
          //投注类型
          parm.playOptions = _.get(item_bs, 'hps[0].hl[0].ol[0].ot');
  
          //串关类型
          parm.seriesType = seriesType;
  
          //球类id
          parm.sportId = _.get(item_bs, 'csid');
  
          //比赛阶段id
          parm.matchProcessId = _.get(item_bs, 'mmp');
          let msc = this.yabo_common.msc_obj_arry(item_bs.msc);
          let ms = _.get(item_bs, 'ms');
          //基准分
          parm.scoreBenchmark = this.yabo_common.calc_bifen(msc, parm.sportId, ms, parm.playId);
          if (parm.scoreBenchmark && parm.scoreBenchmark == "") {
            parm.scoreBenchmark = "0:0";
          }
          //商户id
          parm.tenantId = 1;
  
          //最终盘口类型
          parm.marketTypeFinally = this.get_cur_odd;
          // 联赛级别
          parm.tournamentLevel = item_bs.tlev;
          // 联赛id
          parm.tournamentId = item_bs.tid;
          // 数据来源
          parm.dataSource = _.get(item_bs, 'hps[0].hl[0].ol[0].cds');
          // 赛事类型 赛前，滚球，冠军(3)
          parm.matchType =  _.get(item_cs, 'match_type');
          if(this.is_bet_single) {
            // 是否开启 多单关投注模式
            parm.openMiltSingle = this.get_is_bet_merge?1:0;
          }
  
          parm_obj.orderMaxBetMoney.push(parm);
        });
        // 20016steven# 客户端-偶现market_id，PC前端取值异常(针对此问题进行market_id检查)
        if(_.get(parm_obj,'orderMaxBetMoney.length', 0)==0) {
          return;
        }
        this.send_gcuuid = uid();
        parm_obj.gcuuid = this.send_gcuuid;
        // console.log('get_min_max_money===', JSON.stringify(parm_obj));
  
        api_betting.post_getBetMinAndMaxMoney(parm_obj).then(res => {
  
          // console.log('get_min_max_money===', this.send_gcuuid === res.config.gcuuid);
          // if(this.send_gcuuid != res.config.gcuuid) {
          //   return;
          // }
          
          let gcuuid = _.get(res,'config.gcuuid')
          if(gcuuid && this.send_gcuuid != gcuuid) {
            return;
          }
          let code = _.get(res, "data.code");
          let data = _.get(res, "data.data");
          
          if (_.isFunction(callback)) {
            callback(code, data);
          }
        
          // 自动化测试 接口数据 
          let bet_amount_info = data[0] || {}
          let bet_amount = {
            code,
            global_id : bet_amount_info.globalId,
            min_bet : bet_amount_info.minBet,
            order_max_pay : bet_amount_info.orderMaxPay,
          }
  
          this.set_bet_amount(bet_amount)
  
        });
      },

         /**
     * @description:获取额度接口合并
     * @param {*} callback
     * @return {undefined} undefined
     */
    query_bet_amount(callback, type='') {
        let bet_obj;
        //是单关
        if (this.is_bet_single) {
          bet_obj = this.get_bet_single_obj;
        } else {
          bet_obj = this.get_bet_obj;
        }
        // console.log('bet_obj====',JSON.stringify(bet_obj));
        //获取额度接口合并 参数
        let param = this.get_bet_amount_param(bet_obj);
        this.send_gcuuid = uid();
        param.gcuuid = this.send_gcuuid;
        // console.log('param====',JSON.stringify(param));
        api_betting.query_bet_amount(param).then(res=>{
          // console.log('param====res===', res);
          // if(this.send_gcuuid != res.config.gcuuid) return;
  
          let gcuuid = _.get(res,'config.gcuuid')
          if(gcuuid && this.send_gcuuid != gcuuid) {
            return;
          }
          let code = _.get(res, "data.code");
          let data = _.get(res, "data.data") || { latestMarketInfo:[],betAmountInfo: [] };
  
          // 自动化测试 接口数据 
          let bet_amount_info = data.betAmountInfo[0] || {}
          let bet_amount = {
            code,
            global_id : bet_amount_info.globalId,
            min_bet : bet_amount_info.minBet,
            order_max_pay : bet_amount_info.orderMaxPay,
          }
  
          this.set_bet_amount(bet_amount)
  
          //网络错误时设置默认最大最小值
          if(code == '0401038'){
            this.$root.$emit(this.emit_cmd.EMIT_NET_ERR);
            return;
          }
         
          //原有获取额度返回结构体 betAmountInfo
          let {latestMarketInfo,betAmountInfo} = data;
          //存储是否能预约
          // this.set_is_pre(_.get(latestMarketInfo, '[0].pendingOrderStatus', -1));
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
          if(_.isFunction(callback)) {
            callback(code, betAmountInfo);
          }
        }).catch(err => {
            this.$root.$emit(this.emit_cmd.EMIT_NET_ERR);
        });
      },
  
      /**
       * @description:获取额度接口合并 参数
       * @param {*} bet_obj oid
       * @return {undefined} undefined
       */
      get_bet_amount_param(bet_obj, oid = "") {
        let param = {
          orderMaxBetMoney:[]
        };
        for(let obj of Object.values(bet_obj)) {
          let temp = {};
          temp.deviceType = 2;
          temp.marketId = _.get(obj, 'bs.hps[0].hl[0].hid') || _.get(obj, 'bs.hps[0].hl[0].ol.hid');
          // 赛事id
          temp.matchId = _.get(obj, 'bs.mid');
          let odds_js = this.$mathjs.divide(_.get(obj, 'cs.odds_value'), 100000);
          let break_js = this.$mathjs.divide(_.get(obj, 'cs.break_odds_value'), 100000);
          // 最终赔率
          temp.oddsFinally = this.compute_value_by_cur_odd_type(odds_js, break_js);
          // 赔率
          temp.oddsValue = _.get(obj, 'cs.odds_value');
          // 玩法id
          temp.playId = _.get(obj, 'cs.play_id');
          // 投注项id
          temp.playOptionId = _.get(obj, 'cs.oid');
          // 投注项类型
          temp.playOptions = _.get(obj, 'bs.hps[0].hl[0].ol[0].ot') || _.get(obj, 'bs.hps[0].hl[0].ol.ot');
          // 串关类型 1: 单关 2：串关
          temp.seriesType = this.is_bet_single? 1: 2;
          // 球种id
          temp.sportId = _.get(obj,'cs.sport_id');
          // 赛事阶段
          temp.matchProcessId = _.get(obj, 'bs.mmp');
          let msc = this.yabo_common.msc_obj_arry(_.get(obj,'bs.msc',[]));
          //基准分
          temp.scoreBenchmark = this.yabo_common.calc_bifen(msc, _.get(obj,'bs.csid'),  _.get(obj,'bs.ms'), _.get(obj,'bs.hps[0].hpid'));
          if (temp.scoreBenchmark && temp.scoreBenchmark == "") {
            temp.scoreBenchmark = "0:0";
          }
          temp.tenantId = 1;
          // 联赛级别
          temp.tournamentLevel = _.get(obj, 'bs.tlev');
          // 联赛id
          temp.tournamentId =  _.get(obj,'bs.tid');
          // 数据来源
          temp.dataSource = _.get(obj, 'bs.hps[0].hl[0].ol[0].cds') || _.get(obj, 'bs.hps[0].hl[0].ol.cds');
          // 赛事类型 如果为3的话是冠军赛事
          temp.matchType = _.get(obj, 'cs.match_type');
          // 坑位值 1标识主盘, 2表还是第一附盘...
          temp.placeNum = _.get(obj, 'hps[0].hl[0].hn') || _.get(obj, 'bs.hps[0].hl[0].ol.hn');
          if(this.is_bet_single) {
            // 是否开启 多单关投注模式
            temp.openMiltSingle = this.get_is_bet_merge?1:0;
          }
          // 判断如果存在oid，则只请求对应oid的预约投注的数据
          if (oid && oid == _.get(obj, 'cs.oid')) {
            param.orderMaxBetMoney = [{
              ...temp
            }]
            return param;
          }
          param.orderMaxBetMoney.push(temp);
        }
        return param;
      },
    
     