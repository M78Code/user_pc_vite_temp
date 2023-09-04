import {  MenuData  } from "src/core/index.js";
import {  PageSourceData  } from "src/core/index.js";
import UserCtr from  "src/core/user-config/user-ctr.js";
import BetData from "../class/bet-data-class.js";
// import { compute_value_by_cur_odd_type } from "src/core/format/index.js";
// import { get_bet_amount_param } from "./bet-amount.js";
import { http_upd_data } from "./upd_data.js";
import { set_submit_status } from "./status.js";
import mathjs from "src/core/utils/mathjs.js";
import yabo_common from "src/core/bet/common-helper/index.js";
import uid from "src/core/uuid/index.js";
import { ref } from "vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import lodash from "lodash";
import * as play_mapping from "src/core/constant/config/play-mapping.js";


const  post_submit_bet_list_gcuuid = ref(uid())


   /**
     * @description: 获取押注数据列表模板数据
     * @param {Number} seriesType  1-单关, 2-串关 3, 冠军
     * @param {Number} seriesBetAmount 串关投注金额, 1-单关时,该字段值失效
     * @param {Number} is_pre  是不是预约投注 默认false
     * @return {undefined} undefined
     */
   export const bet_submit_data_template=(seriesType, seriesBetAmount, item, is_pre=false)=> {
    console.log('正常投注参数playOptionName处理------------1', );
    let tempList = [];
    let bet_list_array = BetData.is_bet_single ? [item] : _.get(BetData,'get_bet_list',[]);
    bet_list_array.forEach(id => {
      let item_bs, item_cs;
      //单关
      if (BetData.is_bet_single) {
        item_bs = _.get(BetData,`get_bet_single_obj.${id}.bs`,{}); //列表的数据
        item_cs = _.get(BetData,`get_bet_single_obj.${id}.cs`,{}); //组装的数据
      } else {
        //串关
        item_bs = _.get(BetData,`get_bet_obj.${id}.bs`,{});
        item_cs = _.get(BetData,`get_bet_obj.${id}.cs`,{});
      }
      //1-单关, 2-串关 3, 冠军
      if ((seriesType == 1 && _.has(item_cs,'money')) || seriesType == 2) {
        let temp = {};
        //球类id
        temp.sportId = _.get(item_bs,'csid');
        //赛程id
        temp.matchId = _.get(item_bs,'mid');
        //联赛id
        temp.tournamentId = _.get(item_bs,'tid');

        let msc =  yabo_common.msc_obj_arry(_.get(item_bs,'msc',[]));
        //基准分
        temp.scoreBenchmark =  yabo_common.calc_bifen(msc, _.get(item_bs,'csid'),  _.get(item_bs,'ms'), _.get(item_bs,'hps[0].hpid'));
        if (temp.scoreBenchmark && temp.scoreBenchmark == "") {
          temp.scoreBenchmark = "0:0";
        }
        //投注金额
        if (seriesType == 1) {
          let bet_amount = _.get(item_cs,'money','0');
          temp.betAmount = _.toString(bet_amount);
        } else if (seriesType == 2) {
          temp.betAmount = _.toString(seriesBetAmount);
        }

        //当前点的是哪个投注项 例如over
        let mt;
        if(typeof(item) == 'string') {
          let marr = item.split('_');
          mt = marr[marr.length - 1];
        }
        // 坑位值 1标识主盘, 2表还是第一附盘...
        // 由于数据在外层组装不合理，这里hn要一层一层找
        temp.placeNum = _.get(item_bs, 'hps[0].hl[0].hn') || _.get(item_bs, 'hps[0].hl.hn') || _.get(item_bs, 'hps[0].hl[0].ol[0].hn') || _.get(item_bs, 'hps[0].hl[0].ol.hn');
        console.warn('ssssssss',_.get(item_bs, 'hps'))
        //查找当前玩法下盘口符合调整的球头对应值的，并且是当前投注项类型 over对象，取里面的marketId 和playOptionId，
        //是预约 计算marketId和playOptionsId
        if(is_pre && BetData.bet_appoint_obj && !_.isUndefined(BetData.bet_appoint_obj.appoint_ball_head)) {
           let dl =  BetData.pre_bet_list;
           if(dl) {
            let play_mapping_market = _.get(item_bs, 'hps[0].hl[0].ol[0].csid') == 1 ? play_mapping.MARKET_RANG_FLAG_LIST.includes(_.get(item_cs, 'play_id')) : play_mapping.BASKETBALL_BY_APPOINTMENT_let.includes(_.get(item_cs, 'play_id'))
           
            // if(play_mapping.MARKET_RANG_FLAG_LIST.includes(_.get(item_cs, 'play_id'))
            // ||play_mapping.BASKETBALL_BY_APPOINTMENT.includes(_.get(item_cs, 'play_id'))//这里是篮球让球
            // )

            //让球过滤数据 过滤出盘口 和oddsType 对应数据
            if( play_mapping_market ){  
              let cur_i = -1;
              let ml_len = dl.marketList.length;
              for(let i = 0; i < ml_len; i++) {
                let ml_item = dl.marketList[i];
                let odd_len = ml_item.marketOddsList.length;
                for(let j = 0; j < odd_len; j++) {
                  let odd_item = ml_item.marketOddsList[j];
                  if(_.get(dl, 'currentMarket.marketOddsList[0].oddsType',-1) == odd_item.oddsType && odd_item.playOptions == BetData.bet_appoint_obj.computed_appoint_ball_head) {
                      temp.playOptionsId = odd_item.id; //投注项id
                      cur_i = i;
                      break;
                  }
                }
              }
              //找到对应位置 开始取值
              if(cur_i != -1) {
                temp.marketId = dl.marketList[cur_i].id;
                temp.placeNum = dl.marketList[cur_i].placeNum
              }else{ // 取不到值就为空
                temp.marketId = '';
                temp.playOptionsId = '';
                temp.placeNum = '';
              }
            }else{ //大小球过滤数据
             //第一步过滤出当前盘口值对应的盘口
             let dl_fillter = dl.marketList.filter(item => item.marketValue == BetData.bet_appoint_obj.computed_appoint_ball_head)[0];
             //盘口id 预约需要筛选
             temp.marketId = _.get(dl_fillter, 'id', '');
             //取出marketOddsList
             let parr = _.get(dl_fillter, 'marketOddsList', []);
             //第二部再过滤出当前点击项对应的oddsType的值 如over under
             let filter_arr = parr.filter(item => item.oddsType == mt || item.id == mt);
             //第三步取值   投注项id 预约需要筛选
             temp.playOptionsId = filter_arr[0] ? filter_arr[0]['id'] : '';
             if(_.get(dl_fillter, 'placeNum')) {
               temp.placeNum = _.get(dl_fillter, 'placeNum')
             }
            }
           }else{//如果没找到对应得，传空字符串即可
            temp.marketId = '';     //盘口id
            temp.playOptionsId = '';//投注项id
            temp.placeNum = '';     //坑位id
           }
          //  console.log('参数temp.marketId=', temp.marketId);
          //  console.log('参数temp.playOptionId=', temp.playOptionId);
        }else { //不是预约走默认
           //盘口id
          temp.marketId = _.get(item_bs, 'hps[0].hl[0].hid') || _.get(item_bs, 'hps[0].hl[0].ol.hid')
          //投注项id
          temp.playOptionsId = _.get(item_cs, 'oid');
        }

         //是预约 传递marketValue 这个值正常投注没有，预约投注才有
         if(is_pre) {
          if(_.isNull(BetData.bet_appoint_obj.appoint_ball_head) || BetData.bet_appoint_obj.is_head_eq_hadicap || _.isNaN(BetData.bet_appoint_obj.appoint_ball_head)) {
            temp.marketValue = _.get(BetData.pre_bet_list, 'currentMarket.marketValue', '')
             //盘口id
            temp.marketId = _.get(item_bs, 'hps[0].hl[0].hid') || _.get(item_bs, 'hps[0].hl.hid') || _.get(item_bs, 'hps[0].hl[0].ol[0].hid');;
            //投注项id
            temp.playOptionsId = _.get(item_cs, 'oid');
          }else{
            temp.marketValue = BetData.bet_appoint_obj.appoint_ball_head;  //盘口值
          }
        }
        let hsw = _.get(item_bs, 'hps[0].hsw') || _.get(item_bs, 'hps[0].hl[0].hsw');
      
        //赔率
        if (hsw && hsw != '') {
          let support_odds = [];
          if(typeof(hsw) == 'string'){
            hsw = hsw.split(',');
          }
          let hsw_len = hsw.length;
          for (let i = 0; i < hsw_len; i++) {
            for (let [key, value] of Object.entries(BetData.oddsTable)) {
              if (value == hsw[i]) {
                support_odds.push(key);
              }
            }
          }
          if (support_odds.includes(_.get(BetData,'cur_odd'))) {
            //最终盘口类型
            temp.marketTypeFinally = _.get(BetData,'cur_odd');
          } else {
            //最终盘口类型
            temp.marketTypeFinally = "EU";
          }
        } else {
          //最终盘口类型
          temp.marketTypeFinally = _.get(BetData,'cur_odd');
        }
        let appoint_value;
        //如果是预约
        if(is_pre) {
          //赔率计算调用this.$mathjs里面的方法，保证精度
          appoint_value = mathjs.multiply(BetData.bet_appoint_obj.appoint_odds_value,100000);
        }
        // console.log('BetData.cur_odd =', BetData.cur_odd );

        //如果是预约还要判断本身这个赛事支不支持香港盘，如果不是预约投注直接取odds_value
        temp.odds = !is_pre?_.get(item_cs, 'odds_value'): BetData.cur_odd == 'EU' ? appoint_value : (temp.marketTypeFinally == "EU" ? appoint_value:  mathjs.add(appoint_value, 100000));
        //最终赔率 这个值不能是负的，负的话就有问题了
        let odds_js = mathjs.divide(temp.odds, 100000);

        let break_odds_js = mathjs.divide(_.get(item_cs, 'break_odds_value'), 100000);
        if (hsw != 1) {
          temp.oddFinally = compute_value_by_cur_odd_type(odds_js, break_odds_js, hsw);
        } else {
          temp.oddFinally =  compute_value_by_cur_odd_type(odds_js, null, []);
        }
        // 玩法名称
        temp.playName = _.clone(_.get(item_bs, 'hps[0].hpn')) ||  _.get(item_bs, 'hps[0].hl[0].ol[0].hpn') || _.get(item_cs, 'play_name');

        // 球类名称
        temp.sportName =  yabo_common.play_name_mapping(temp.sportId);
        // 赛事类型 如果为3的话是冠军赛事
        temp.matchType = _.get(item_cs, 'match_type');
        // 赛事名称
        temp.matchName = _.get(item_bs, 'tn');
        
        let item_cs_id = _.get(item_cs, 'id');
        this.item_cs_id = item_cs_id
        //队伍名
        let team_name = yabo_common.get_team_name();
        //盘口名
        let handicap = yabo_common.get_handicap();
        // 预约的赔率，球头 当前赛事 预约投注需要参数playOptionName处理
        if(BetData.bet_appoint_obj && BetData.bet_appoint_obj.bet_appoint_id==item_cs_id && is_pre) {
          let new_name = ''
          //队伍名如果是加号或者减号开头去除符号
          if(team_name.startsWith('+') || team_name.startsWith('-')){
            new_name = team_name.substr(1,handicap.length);
          }
          // let n_name = new_name ? new_name : team_name;
          let {computed_appoint_ball_head, appoint_ball_head} = BetData.bet_appoint_obj;
          //team_name队名不为空，不为nan， handicap不为nan
          if(!_.isEmpty(team_name) &&  !_.isNaN(team_name) && !_.isNaN(handicap)) {
            //预约投注也有可能没有球头，没有的话就传默认得，如果不传投注项和投注记录那里就是空的，服务端是透传的
            if(!_.isNaN(appoint_ball_head)  && _.trim(team_name) != _.trim(computed_appoint_ball_head)) {
              let head = computed_appoint_ball_head;
              // if(_.startsWith(computed_appoint_ball_head, "+")) {
                // head = '+' + head
              // }else if(play_mapping.BASKETBALL_BY_APPOINTMENT_let.includes(_.get(item_cs, 'play_id')) && computed_appoint_ball_head > 0 && !_.startsWith(computed_appoint_ball_head, "+")){
              //    head = '+' + head
              // }
              temp.playOptionName = _.trim(`${team_name}${head}`);
            }else if(!_.isEmpty(team_name) && _.trim(team_name) != _.trim(handicap)){
              temp.playOptionName = _.trim(`${team_name}${handicap}`);
            }else if(_.isEmpty(team_name)) {
              temp.playOptionName = _.trim(`${handicap}`);
            } else if(_.isEmpty(handicap)) {
              temp.playOptionName = _.trim(`${team_name}`);
            } else if(!_.isNaN(computed_appoint_ball_head) && computed_appoint_ball_head != "NaN/NaN") { //这里做一个兜底，防止playoptionname 为空不传递
              temp.playOptionName = _.trim(`${computed_appoint_ball_head}`);
            }else{//这里做一个兜底
              temp.playOptionName = _.trim(`${handicap}`);
            }
          } else if(_.isEmpty(team_name)) {
            temp.playOptionName = _.trim(`${handicap}`);
          } else if(_.isEmpty(handicap)) {
            temp.playOptionName = _.trim(`${team_name}`);
          }
          // 预约的赔率
          // temp.appointOddsValue = appoint_odds_value * 100000;
          // 预约的赔率
          // temp.appointOddFinally = `${appoint_odds_value}`;
        } else {//正常投注参数playOptionName处理
          console.log('正常投注参数playOptionName处理------------81',  team_name ,handicap);
          if(!_.isEmpty(team_name) &&( _.trim(team_name) != _.trim(handicap))) {
            console.log('正常投注参数playOptionName处理------------82',);
            temp.playOptionName = _.trim(`${team_name}${handicap}`);
            console.log('正常投注参数playOptionName处理------------83',temp.playOptionName);
          } else if(_.isEmpty(team_name)) {
            console.log('正常投注参数playOptionName处理------------84',);
            temp.playOptionName = _.trim(`${handicap}`);
          } else if(_.isEmpty(handicap)) {
            console.log('正常投注参数playOptionName处理------------85',);
            temp.playOptionName = _.trim(`${team_name}`);
          }
        }
        //投注类型
        temp.playOptions = _.get(item_bs, 'hps[0].hl[0].ol[0].ot') || _.get(item_bs, 'hps[0].hl[0].ol.ot');


        // 联赛级别
        temp.tournamentLevel = _.get(item_bs, 'tlev');
        // 联赛id
        temp.tournamentId = _.get(item_bs, 'tid');

        console.log('正常投注参数playOptionName处理-----------1211-1',item_bs);

        //玩法id
        temp.playId = _.get(item_bs, 'hps[0].hpid') || _.get(item_bs, 'hps[0].hl[0].ol.hpid') || _.get(item_bs, 'hps[0].hl[0].ol[0]._hpid') ;
        if(!temp.matchType) {
          //比赛阶段id
          temp.matchProcessId = _.get(item_bs,'mmp');
          if(_.has(item_cs,'home') && _.has(item_cs, 'away')) {
            //对阵信息
            temp.matchInfo = item_cs.home + '  v  ' + item_cs.away;
          }
        }
        if(temp.matchType && temp.matchType==3) {
          temp.matchProcessId = "0";
          // 标准冠军赛事赛季名称
          temp.matchInfo = _.get(item_bs, 'tn');
        }

        // 数据来源
        temp.dataSource = _.get(item_bs, 'hps[0].hl[0].ol[0].cds') || _.get(item_bs, 'hps[0].hl[0].ol.cds');


        tempList.push(temp)
      }
    });
    return tempList;
  }



    /**
     * @description: 提交押注订单
     * @param {Number} seriesType 1-单关, 2-串关, 3-冠军
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    export const bet_submit_data=(seriesType, callback)=> {
        if (BetData.is_bet_single) {
          if (!_.isArray(BetData.bet_single_list)) return;
        } else {
          if (!_.isArray(BetData.bet_list)) return;
        }
        let parm = {};
        //用户id
        parm.userId = ''; //后台userId可以为空 2020-06-09joken
        //接受赔率变化情况
        parm.acceptOdds = _.get(BetData.user,'userBetPrefer');
        //商户id
        parm.tenantId = 1;
        //设备类型
        parm.deviceType = 2;
        //币种
        parm.currencyCode = 'CNY';
        //设备标识
        parm.deviceImei = '';
        // 指纹id
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
  
    console.log('正常投注参数playOptionName处理------------00' );
          parm.openMiltSingle = BetData.is_bet_merge?1:0;
          // 有预约id的时候只提交
          if(BetData.bet_appoint_obj && BetData.bet_appoint_obj.bet_appoint_id) {
            let { bet_appoint_id } = BetData.bet_appoint_obj;
            let cs = _.get(BetData,`get_bet_single_obj[${bet_appoint_id}].cs`,{});
            let temp_bat = {};
            if(cs && cs.money) {
              // 串关数量
              temp_bat.seriesSum = 1;
              // 串关类型
              temp_bat.seriesType = seriesType;
              // 串关值
              temp_bat.seriesValues = (seriesType == 1) ?  i18n_t('bet.bet_one_') : i18n_t('bet.bet_winner');//'单关' , 冠军
              temp_bat.fullBet = _.get(cs,'full_bet',0);
              //赔率没变，球头没变的情况视为普通注单 preBet传0
              if(BetData.bet_appoint_obj.appoint_init_odds_value == BetData.bet_appoint_obj.appoint_odds_value && BetData.bet_appoint_obj.is_head_eq_hadicap) {
                parm.preBet = 0  //没调整赔率和球头是为普通投注
              }else{
                parm.preBet = 1 //是预约投注
              }
              //设置注单集合
              temp_bat.orderDetailList =  bet_submit_data_template(seriesType, null, bet_appoint_id, parm.preBet ? true : false);
              parm.seriesOrders.push(temp_bat);
            }
          } else {
            BetData.bet_single_list.forEach(item=>{
              let cs = _.get(BetData,`get_bet_single_obj[${item}].cs`,{});
              let temp_bat = {};
              if(cs && cs.money) {
                // 串关数量
                temp_bat.seriesSum = 1;
                // 串关类型
                temp_bat.seriesType = seriesType;
                // 串关值
                temp_bat.seriesValues = (seriesType==1)? i18n_t('bet.bet_one_') :  i18n_t('bet.bet_winner');//'单关' , 冠军
  
                temp_bat.fullBet = _.get(cs,'full_bet',0);
                //设置注单集合
                temp_bat.orderDetailList =  bet_submit_data_template(seriesType, null, item);
                parm.preBet = 0 //不是预约投注
                parm.seriesOrders.push(temp_bat);
              }
            });
          }
        } else if (seriesType == 2) { // 串关
          BetData.bet_s_list.forEach(id => {
            let x1 = _.get(BetData.bet_s_obj,`${id}.cs`);
            if (_.has(x1,'money') && x1.money !== null && x1.money !== '') {
              let temp_bat = {};
              // 串关类型
              temp_bat.seriesType = _.get(x1,'id');
              //是否满额投注，1：是，0：否
              temp_bat.fullBet = _.get(x1,'full_bet', 0);
              // 串关数量
              temp_bat.seriesSum = _.get(x1,'count');
              // 串关值
              // temp_bat.seriesValues = x1.id;
              //设置注单集合
              temp_bat.orderDetailList =  bet_submit_data_template(seriesType, x1.money);
              parm.preBet = 0 //不是预约投注
              parm.seriesOrders.push(temp_bat);
            }
          });
        }
  
        if(parm.seriesOrders && _.isArray(parm.seriesOrders)) {
          let pos = -1;
          let len = parm.seriesOrders.length;
          for(let ii = 0; ii < len; ii++) {
            let obj1 = parm.seriesOrders[ii];
            if(obj1 && obj1.orderDetailList && _.isArray(obj1.orderDetailList)) {
              pos = _.findIndex(obj1.orderDetailList, item=>_.includes(item.marketId,'_'))
              if(pos > -1) return;
            }
          }
          if(pos > -1) {
            return;
          }
        }
        post_submit_bet_list_gcuuid.value = uid();
        parm.gcuuid = post_submit_bet_list_gcuuid.value ;
        // console.log('post_submit_bet_list====',parm);
        // debugger
        // 押注项调用提交接口
        api_betting.post_submit_bet_list(parm).then(res => {
        
  
          let gcuuid = _.get(res,'config.gcuuid')
          if( gcuuid && post_submit_bet_list_gcuuid.value  != gcuuid) {
            return;
          }
          let code = _.get(res, "data.code");
          let msg = _.get(res, "data.msg");
          let data = _.get(res, "data.data") || {};
          if (!code) {
            code = _.get(res, "data.data.code");
            msg = _.get(res, "data.data.msg");
            data = _.get(res, "data.data.data") || {};
          }
          // 自动化测试 接口数据 
          let order_detail_resp_list = (data.orderDetailRespList || {})[0] || {}
          let bet_info = {
            code,
            global_id : data.globalId,
            order_no : order_detail_resp_list.orderNo,
            order_status_code : order_detail_resp_list.orderStatusCode,
            msg,
          }
          BetData.auto_test_bet_info = bet_info
 
          
          if (code == 200) {
             //投注设置诸葛埋点
              // bet_send_zhuge_event()
            // console.log('api_betting:'+JSON.stringify(data));
            // 设置提交成功标识符
            data.orderDetailRespList.forEach(order_item => {
              //设置提交状态
            set_submit_status(order_item);
              //预约投注状态转换
              if(_.hasIn(order_item,'preOrderDetailStatus' )&&!_.isNull(order_item.preOrderDetailStatus)) {
                switch(order_item.preOrderDetailStatus) {
                  case 0:
                  case 1: //0 预约中 ;1 预约成功 ; 2.预约取消
                    order_item.orderStatusCode = 1;
                    break;
                  default: //默认失败
                    order_item.orderStatusCode = 0;
                    break;
                }
              }
            });
            // 清除串关的缓存钱数
            BetData.bet_s_list.forEach(id => {
              let obj = _.cloneDeep(_.get(BetData.bet_s_obj, `${id}`));
              if (_.has(obj,'cs')) {
                obj.cs.money = '';
                BetData.bet_s_obj_add_attr(obj);
              }
            });
            if (_.isFunction(callback)) {
              callback(code, data);
            }
            //这里增加一个调用余额的接口
            useMittEmit(MITT_TYPES.EMIT_GET_BALANCE_CMD);
          } else {
            if (_.isFunction(callback)) {
              callback(code, data, msg);
            }
          }
        })
      }