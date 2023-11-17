/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 押注相关功能(虚拟投注部分)
 */
import { api_betting, api_common } from "project/activity/src/public/api/index.js";
import oddsConversion from "project/activity/src/public/mixins/odds_conversion/odds_conversion_mixin.js";
import BetCountJointNumber from "project/activity/src/public/utils/bet/betCountJointNumber.js"
import msc from "project/activity/src/public/mixins/common/msc";
import { uid } from 'quasar';
export default {
  mixins: [oddsConversion, msc],
  methods: {
    /**
     * @description:删除盘口中的垃圾盘口
     * @param {Founction} callbackfn
     * @return {undefined} undefined
     */
    remove_virtual_handicap(callback) {
      let len = this.vx_get_virtual_bet_list.length;
      for (let index = 0; index < len; index++) {
        let id = this.vx_get_virtual_bet_list[index];
        let item = _.get(this.vx_get_virtual_bet_obj, `${id}`,{});
        if (!_.isEmpty(item)) {
          let item_bs = _.get(item, 'bs');
          let item_cs = _.get(item, 'cs');
          if((!_.isEmpty(item_bs) && (this.get_item_disable(item_bs)) ||
             ($menu.menu_data.is_esports && !_.isEmpty(item_cs) && item_cs.serial_type == 0))) {
              this.vx_virtual_bet_obj_del(id);
              // 关盘时,删除该子项
              this.vx_virtual_bet_list_del(index, 1);
              index--;
          }
        }
      }
      if (callback) {
        callback();
      }
    },
    /**
     * @description: 押注显示时判断是否禁用状态
     * @param {Object} item_  投注项对象
     * @return {Boolean} undefined
     */
    get_item_disable(item_) {
      let ret = false;
      //获取投注状态
      let active = this.get_odds_active(_.get(item_, 'mhs'),
        _.get(item_, 'hps[0].hl[0].hs'),
        _.get(item_, 'hps[0].hl[0].ol[0].os'));
      // 判断盘口是否可用
      if (active != 1 && active != 4) {
        ret = true;
      }
      return ret;
    },
    /**
     * @description: 获取押注数据列表模板数据
     * @param {Number} seriesType  1-单关, 2-串关 3, 冠军
     * @param {Number} seriesBetAmount 串关投注金额, 1-单关时,该字段值失效
     * @return {undefined} undefined
     */
    virtual_bet_submit_data_tpl(seriesType, seriesBetAmount) {
      let tempList = [];
      this.vx_get_virtual_bet_list.forEach(id => {
        let item_bs, item_cs;
        item_bs = _.get(this.vx_get_virtual_bet_obj,`${id}.bs`,{});
        item_cs = _.get(this.vx_get_virtual_bet_obj,`${id}.cs`,{});

        if ((seriesType == 1 && _.has(item_cs,'money')) || seriesType == 2) {
          let temp = {};
          //球类id
          temp.sportId = _.get(item_bs,'csid');
          //赛程id
          temp.matchId = _.get(item_bs,'mid');
          //联赛id
          temp.tournamentId = _.get(item_bs,'tid');
          // 赛事类型 如果为3的话是冠军赛事
          temp.matchType = _.get(item_cs, 'match_type');
          //投注金额
          if (seriesType == 1) {
            let bet_amount = _.get(item_cs,'money','0');
            if(temp.matchType == 5) { // 电竞赛事
              bet_amount = parseInt(bet_amount);
            }
            temp.betAmount = _.toString(bet_amount);
          } else if (seriesType == 2) {
            temp.betAmount = _.toString(seriesBetAmount);
          }
          //盘口id
          temp.marketId = _.get(item_bs, 'hps[0].hl[0].hid');
          //投注项id
          temp.playOptionsId = _.get(item_cs, 'oid');
          //盘口值
          temp.marketValue = _.get(item_cs, 'handicap_value');
          //投注项id
          temp.playOptionsId = _.get(item_cs, 'oid');
          //赔率
          temp.odds = _.get(item_cs, 'odds_value');
          let hsw = _.get(item_bs, 'hps[0].hsw') || '1,2,3,4,5,6';
          //最终赔率
          temp.oddFinally = this.compute_value_by_cur_odd_type(_.get(item_cs, 'odds_value') / 100000, _.get(item_cs, 'break_odds_value') / 100000, hsw, temp.sportId);
          // 玩法名称
          temp.playName = _.clone(_.get(item_bs, 'hps[0].hpn'));
          // 球类名称
          temp.sportName = this.virtual_common.play_name_mapping(temp.sportId);
          // 赛事名称
          temp.matchName = _.get(item_bs, 'tn');
          this.id = _.get(item_cs, 'id');
          let team_name = this.virtual_common.get_team_name(this);
          let handicap = this.virtual_common.get_handicap(this);
          if(!_.isEmpty(team_name) && _.trim(team_name) != _.trim(handicap)) {
            // 投注项名称
            temp.playOptionName = _.trim(`${team_name}${handicap}`);
          } else if(_.isEmpty(team_name)) {
            // 投注项名称
            temp.playOptionName = _.trim(`${handicap}`);
          } else if(_.isEmpty(handicap)) {
            // 投注项名称
            temp.playOptionName = _.trim(`${team_name}`);
          }

          //投注类型
          temp.playOptions = _.get(item_bs, 'hps[0].hl[0].ol[0].ot');
          if (hsw && hsw != '') {
            let support_odds = [];
            hsw = hsw.split(',');
            let hlen = hsw.length
            for (let i = 0; i < hlen; i++) {
              for (let [key, value] of Object.entries(this.oddsTable)) {
                if (value == hsw[i]) {
                  support_odds.push(key);
                }
              }
            }
            if (support_odds.includes(this.vx_get_cur_odd)) {
              //最终盘口类型
              temp.marketTypeFinally = _.get(this,'vx_get_cur_odd');
            } else {
              //最终盘口类型
              temp.marketTypeFinally = "EU";
            }
          } else {
            //最终盘口类型
            temp.marketTypeFinally = _.get(this,'vx_get_cur_odd');
          }
          //玩法id
          temp.playId = _.get(item_bs, 'hps[0].hpid');
          tempList.push(temp)
        }
      });
      return tempList;
    },
    /**
     * @description: 提交押注订单
     * @param {Number} seriesType 1-单关, 2-串关, 3-冠军
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    virtual_bet_submit_data(seriesType, callback) {
      if (!_.isArray(this.vx_get_virtual_bet_list)) return;
      let parm = {};
      //用户id
      parm.userId = ''; //后台userId可以为空 2020-06-09joken
      //接受赔率变化情况
      parm.acceptOdds = _.get(this.vx_get_user,'userBetPrefer');
      //商户id
      parm.tenantId = 1;
      //设备类型
      parm.deviceType = 2;
      //币种
      parm.currencyCode = 'CNY';
      //设备标识
      parm.deviceImei = '';
      //指纹id
      parm.fpId = '';
      try{
        let fingerprint = window.localStorage.getItem('fingerprint');
        fingerprint = JSON.parse(fingerprint);
        if(fingerprint) {
          parm.fpId = fingerprint.fpId
        }
      } catch(error) {
        console.error('=====获取指纹失败'+error);
      }
      // 设置注单集合列表对象
      parm.seriesOrders = []

      if (seriesType == 1) { // 单关
        let temp_bat = {};
        // 串关数量
        temp_bat.seriesSum = 1;
        // 串关值
        temp_bat.seriesValues = this.$root.$t('bet.bet_one_');//单关
        // 串关类型
        temp_bat.seriesType = seriesType;
        let id = this.vx_get_virtual_bet_list[0];
        let cs = this.vx_get_virtual_bet_obj[id].cs;
        temp_bat.fullBet = cs.full_bet || 0;
        //设置注单集合
        temp_bat.orderDetailList = this.virtual_bet_submit_data_tpl(seriesType);
        parm.seriesOrders.push(temp_bat);
      } else if (seriesType == 2) { // 串关
        this.vx_get_virtual_bet_s_list.forEach(id => {
          let x1 = _.get(this.vx_get_virtual_bet_s_obj,`${id}.cs`);
          if (_.has(x1,'money') && x1.money !== null && x1.money !== '') {
            let temp_bat = {};
            // 投注类型
            temp_bat.seriesType = x1.id;
            // 是否满额投注1:满额投注 0:未满额投注
            temp_bat.fullBet = x1.full_bet;
            // 串关数量
            temp_bat.seriesSum = x1.count;
            //设置注单集合
            temp_bat.orderDetailList = this.virtual_bet_submit_data_tpl(seriesType, x1.money);
            parm.seriesOrders.push(temp_bat);
          }
        });
      }
      if(parm.seriesOrders && _.isArray(parm.seriesOrders)) {
        let pos = -1;
        for(let ii=0;ii<parm.seriesOrders.length;ii++) {
          let obj1 = parm.seriesOrders[ii];
          if(obj1 && obj1.orderDetailList && _.isArray(obj1.orderDetailList)) {
            pos = _.findIndex(obj1.orderDetailList, item=>_.includes(item.marketId,'_'))
            if(pos>-1) return;
          }
        }
        if(pos>-1) {
          return;
        }
      }
      this.send_gcuuid = uid();
      parm.gcuuid = this.send_gcuuid;
      // console.log('post_submit_Bet_list2====',parm);
      // 押注项调用提交接口
      api_betting.post_submit_Bet_list(parm).then(res => {
        // console.log('post_submit_Bet_list2=======',this.send_gcuuid === res.config.gcuuid);
        // if(this.send_gcuuid != res.config.gcuuid) return;

        
        let gcuuid = _.get(res,'config.gcuuid')
        if(gcuuid && this.send_gcuuid != gcuuid) {
          return;
        }

        
        let code = _.get(res, "data.code");
        let msg = _.get(res, "data.msg");
        let data = _.get(res, "data.data");
        if (!code) {
          code = _.get(res, "data.data.code");
          msg = _.get(res, "data.data.msg");
          data = _.get(res, "data.data.data");
        }
        if (code == 200) {
          // console.log('api_betting:'+JSON.stringify(data));
          //投注设置诸葛埋点
          this.bet_send_zhuge_event()
          // 设置提交成功标识符
          data.orderDetailRespList.forEach(order_item => {
            this.set_virtual_submit_status(order_item);
          });
          // 清除串关的缓存钱数
          this.vx_get_virtual_bet_s_list.forEach(id => {
            let obj = _.cloneDeep(_.get(this, `vx_get_virtual_bet_s_obj.${id}`,{}));
            if (_.has(obj,'cs')) {
              obj.cs.money = '';
              this.vx_virtual_bet_s_obj_add(obj);
            }
          });
          if (callback) {
            callback(code, data);
          }
          //这里增加一个调用余额的接口
          this.$root.$emit(this.emit_cmd.EMIT_GET_BALANCE_CMD);
        } else {
          // this.loading = 2;
          if (callback) {
            callback(code, data, msg);
          }
        }
      })
    },
    /**
     *  @description: 投注设置诸葛埋点
     *  @param {undefined} undefined 
     *  @return {undefined} undefined
     */
    bet_send_zhuge_event(){
      let bet_source =  window.sessionStorage.getItem("_bet_source")
      let lcm_name = ""
      if(bet_source){
         switch (bet_source) {
           case 'hot':
             lcm_name = '热门推荐'
             break;
           case 'recent':
             lcm_name = '近期关注'
             break;
         
           default: 
             break;
         }
      }
      if(lcm_name){
       this.$utils.send_zhuge_event(`PC_${lcm_name}_投注成功`, {"成单栏目类型": lcm_name});
      }
    },
    /**
     * @description: 设置提交状态
     * @param {Object} order_item 订单数据
     * @return {undefined} undefined
     */
    set_virtual_submit_status(order_item) {
      // 设置押注成功后的标识符
      this.vx_get_virtual_bet_list.forEach(id => {
        let item = _.cloneDeep(_.get(this.vx_get_virtual_bet_obj,`${id}`,{}));
        let oid = _.get(item, 'bs.hps[0].hl[0].ol[0].oid');
        if (oid == _.get(order_item,'playOptionsId')) {
          item.key = id;
          // 设置提交状态为true
          item.cs.submit_status = true;
          this.vx_virtual_bet_obj_add(item);
        }
      });
    },
    /**
     * @description: 获取押注项最大和最小的金额
     * @param {Array} item_list 列表
     * @param {Number} seriesType-串关类型, 串关类型(1：单关(默认) 、2：双式投注,例如1/2  、3：三式投注,例如1/2/3   、4：N串1,例如4串1   、5：N串F,例如5串26 )
     * @param {Function} callback -回调函数
     * @return {undefined} undefined
     */
    get_virtual_min_max_money(item_list, seriesType, callback) {
      if(!_.isArray(item_list) || (_.isArray(item_list) && _.get(item_list,'length',0)==0)) {
        return;
      }
      // 获取押注项最大和最小的金额
      let parm_obj = {
        orderMaxBetMoney: []
      };
      item_list.forEach(id => {
        let item_bs, item_cs;
        if(_.has(this.vx_get_virtual_bet_obj,`${id}.bs`) && _.has(this.vx_get_virtual_bet_obj,`${id}.cs`)) {
          item_bs = _.get(this.vx_get_virtual_bet_obj,`${id}.bs`,{});
          item_cs = _.get(this.vx_get_virtual_bet_obj,`${id}.cs`,{});
        } else {
          return;
        }
        let parm = {};
        // 设置用户Id
        if (this.vx_get_user) {
          parm.userId = _.get(this,'vx_get_user.uid');
        }
        //设备类型
        parm.deviceType = 2;
        //盘口id
        parm.marketId = _.get(item_bs, 'hps[0].hl[0].hid');
        //盘口值
        // parm.marketValue = _.get(item_cs, 'handicap_value');

        //赛事id
        parm.matchId = _.get(item_bs, 'mid');

         //球类id
        parm.sportId = _.get(item_bs, 'csid');

        let hsw = _.get(item_bs, 'hps[0].hsw') || '1,2,3,4,5,6';
        //最终赔率
        parm.oddsFinally = this.compute_value_by_cur_odd_type((_.get(item_cs, 'odds_value') / 100000), (_.get(item_cs, 'break_odds_value') / 100000), hsw, parm.sportId);

        //赔率
        parm.oddsValue = _.get(item_cs, 'odds_value');

        //玩法id
        parm.playId = _.get(item_bs, 'hps[0].hpid') || _.get(item_bs, 'hps[0].hl[0].hpid');;

        //投注项id
        parm.playOptionId = _.get(item_cs, 'oid');

        //投注类型
        parm.playOptions = _.get(item_bs, 'hps[0].hl[0].ol[0].ot');

        //串关类型
        parm.seriesType = seriesType;

        //商户id
        parm.tenantId = 1;

        //最终盘口类型
        parm.marketTypeFinally = _.get(this,'get_cur_odd');
        // 联赛级别
        parm.tournamentLevel = _.get(item_bs,'tlev');
        // 联赛id
        parm.tournamentId = _.get(item_bs,'tid');
        // 数据来源
        parm.dataSource = _.get(item_bs, 'hps[0].hl[0].ol[0].cds');
        parm.matchType =  _.get(item_cs, 'match_type');
        parm_obj.orderMaxBetMoney.push(parm);
      });
      // 20016steven# 客户端-偶现market_id，PC前端取值异常(针对此问题进行market_id检查)
      if(_.get(parm_obj,'orderMaxBetMoney.length', 0)==0) {
        return;
      }
      this.send_gcuuid = uid();
      parm_obj.gcuuid = this.send_gcuuid;
      // console.log('get_min_max_money2===', JSON.stringify(parm_obj));
      api_betting.post_getBetMinAndMaxMoney(parm_obj).then(res => {

        // console.log('get_min_max_money2===', this.send_gcuuid === res.config.gcuuid);
        // if(this.send_gcuuid != res.config.gcuuid) return;


        
        let gcuuid = _.get(res,'config.gcuuid')
        if(gcuuid && this.send_gcuuid != gcuuid) {
          return;
        }

        let code = _.get(res, "data.code");
        let status = _.get(res, "status");
        let data = _.get(res, "data.data");
        if (code == 200 && status) {
          if (callback) {
            callback(code, data);
          }
        } else {
          if (callback) {
            callback(code, data);
          }
        }
      });
    },
    /**
     * @description: 获取投注模块-统计串关数
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    getVirtualSeriesCountNumbe(callback) {
      let data = BetCountJointNumber.getBetCountJoint(this.vx_get_virtual_bet_list.length);
      let min_num = this.vx_get_mix_min_count;
      if(min_num <= 10) {
        data = data.filter((item) => {
          return Number(item.id.slice(0, 1)) >= min_num ||  ['10串1','10串1013'].includes(item.name)
        });
      }else if(this.vx_get_virtual_bet_list.length == 10){
        data = [data[0]];
      }else {
        data = [];
      }
      //console.log(JSON.stringify(data));
      if (callback) {
        callback(200, data);
      }
    },
    /**
     * @description: 获取虚拟体育串关数量
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    getEsportsSeriesCountNumbe(callback) {
      let data = BetCountJointNumber.getEsportsBetCountJoint(this.vx_get_virtual_bet_list.length);
      let min_num = this.vx_get_mix_min_count;
      if(min_num <= 10) {
        data = data.filter((item) => {
          return Number(item.id.slice(0, 1)) >= min_num ||  ['10串1','10串1013'].includes(item.name)
        });
      }else if(this.vx_get_virtual_bet_list.length == 10){
        data = [data[0]];
      }else {
        data = [];
      }
      //console.log(JSON.stringify(data));
      if (callback) {
        callback(200, data);
      }
    },
    /**
     * @description: 获取投注项状态
     * @param {Number} matchHandicapStatus 赛事盘口状态 0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
     * @param {Number} status 盘口状态0-5。 0：有效，1：暂停，2：停用，3：已结算，4：已取消，5：移交
     * @param {Number} active 投注项状态 1.开盘，2封盘，3关盘 ，4 锁盘
     * @return {Number} 投注项状态 1.开盘，2封盘，3关盘 ，4 锁盘
     */
    get_odds_active(matchHandicapStatus, status, active) {
      var active_ = 1;
      // 盘口级封盘
      if(status == 2){
        return 3
      }
      // console.log(`matchHandicapStatus==${matchHandicapStatus}, ${status}, ${active}`);
      if (matchHandicapStatus) { // 赛事盘口有操作变化时
        if (matchHandicapStatus == 1) { //赛事封盘状态
          active_ = 2;
        } else if (matchHandicapStatus == 11) { //赛事锁盘
          // active_ = 4;
          if(active != 1){
            active_ = active;
          } else{
            active_ = 4;
          }
        } else if (matchHandicapStatus == 2 || matchHandicapStatus == 3 || matchHandicapStatus == 4 || matchHandicapStatus == 5) { //赛事关盘
          active_ = 3;
        }
        return active_;
      }

      if (status) { // 盘口有操作变化时
        if (status == 1) { //盘口封盘
          active_ = 2;
        } else if (status == 2 || status == 3 || status == 4 || status == 5) { //盘口关盘
          active_ = 3;
        } else if (status == 11) { //盘口锁盘
          active_ = 4;
        }
        return active_;
      }
      return active
    },
    /**
     * @description: 初始化单关数据
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    init_bet_single_data() {
      _.forEach(this.vx_get_virtual_bet_list, item => {
        let bs = _.cloneDeep(_.get(this.vx_get_virtual_bet_obj,`${item}.bs`,{}));
        let cs = _.cloneDeep(_.get(this.vx_get_virtual_bet_obj,`${item}.cs`,{}));
        if (cs.submit_status) {
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
          this.vx_virtual_bet_obj_add(obj);
        }
      });
    },
    /**
     * @description: 获取服务器时间戳
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    get_server_time(callback) {
      let param = {};
      this.send_gcuuid = uid();
      param.gcuuid = this.send_gcuuid;
      // console.log('get_server_time2===',JSON.stringify(param));
      api_common.get_server_time(param).then(res => {
        // console.log('get_server_time2===res===', this.send_gcuuid == res.config.gcuuid);
        // if(this.send_gcuuid != res.config.gcuuid) return;

        
        let gcuuid = _.get(res,'config.gcuuid')
        if(gcuuid && this.send_gcuuid != gcuuid) {
          return;
        }
        let code = _.get(res, "data.code");
        if (code == 200) {
          let data = new Date(parseInt(_.get(res, "data.data")));
          if (callback) {
            callback(code, data);
          }
        } else {
          if (callback) {
            callback(code, '');
          }
        }
      });
    }
  },
  filters: {
    /**
     * @description: 四舍六入五成双
     * @param {Number} num 金额
     * @param {Number} digit
     * @return {Number} 转换后的金额
     */
    four_five_six_double(num, digit) {
      var ratio = Math.pow(10, digit),
        _num = num * ratio,
        mod = _num % 1,
        integer = Math.floor(_num);
      if (mod > 0.5) {
        return ((integer + 1) / ratio).toFixed(2);
      } else if (mod < 0.5) {
        return (integer / ratio).toFixed(2);
      } else {
        return ((integer % 2 === 0 ? integer : integer + 1) / ratio).toFixed(2);
      }
    },
    /**
     * @description: 金额格式化(待两位小数)
     * @param {Number} num 金额
     * @return {String} 转换后的金额
     */
    format_currency(num) {
      if(num) {
        let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/);
        // 保留两位小数
        let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00";
        let _num = _split[1] + '.' + decimal;
        return _num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      }
      return '0.00';
    },
    /**
     * @description: 金额格式化2(整数金额)
     * @param {Number} num 金额
     * @return {String} 转换后的金额
     */
    format_currency2(num) {
      if(num) {
        let _num = num.toString();
        return _num.replace(/\d+/, function(n){ // 先提取整数部分
          return n.replace(/(\d)(?=(\d{3})+$)/g, function($1){
             return $1+",";
           });
        });
      }
      return '0';
    },
    /**
     * @description: 赔率展示格式化
     * @param {String} val 赔率值
     * @return {String} 
     */
    format_odds(val) {
      if(val == '' || val == undefined){
        return '';
      }
      val = (val || '0').toString();
      let ret = val;
      if (val.includes('.')){
        if (val >= 100) {
          if (val.split('.')[1] == '00') {
            ret = val.split('.')[0];
          } else {
            let len = val.length;
            if(val.indexOf('.0') == (len-2)){
              ret = val.substring(0, len-2);
            } else {
              ret = val;
            }
          }
        } else if (val >= 10) {
          if (val.split('.')[1][1] == '0') {
            ret = val.slice(0,val.length - 1);
          } else {
            ret = val;
          }
        }
      }
      return ret;
    }
  }
}
