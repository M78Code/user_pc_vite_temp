/*
 * @Description: 押注相关功能
 */
// import { api_betting, api_common} from "src/public/api/index.js";
// import oddsConversion from "src/public/mixins/odds_conversion/odds_conversion_mixin.js";
// import BetCountJointNumber from "src/public/utils/bet/betCountJointNumber.js"
// import inducitve from "src/public/mixins/common/inductive.js";
// import msc from "src/public/mixins/common/msc";
// import { mapGetters, mapActions } from "vuex";
import play_mapping from "../common-helper/play_mapping.js";
import { uid } from 'quasar';
import { reactive } from "vue"

import store from "src/store-redux/index.js"
const {
  userReducer,
  menuReducer,
  layoutReducer,
  globalReducer,
  betInfoReducer,
  detailsReducer,
} = store.getState();



const computed_data = reactive({
    // 押注扁平化对象扁平
  vx_get_bet_obj: betInfoReducer.bet_obj,
  is_invalid: userReducer.is_invalid,
  // 搜索状态
  get_search_status: detailsReducer.search_isShow,
  // 获取用户信息
  user: userReducer.user,
  // 当前语言
  lang: userReducer.lang,
  // 单关部分 是否为串关
  vx_is_bet_single: betInfoReducer.is_bet_single,
  // 串关是否正在处理中
  is_handle: betInfoReducer.is_handle,
  // 单关是否正在处理中
  is_single_handle: betInfoReducer.is_single_handle,
  // 是否为虚拟体育投注
  is_virtual_bet: betInfoReducer.is_virtual_bet,
  // 虚拟投注是否正在进行
  is_virtual_handle: betInfoReducer.is_virtual_handle,
  // 获取虚拟投注列表
  virtual_bet_list: betInfoReducer.virtual_bet_list,
  vx_get_bet_list: betInfoReducer.bet_list,
  bet_single_list: betInfoReducer.bet_single_list,
  vx_get_bet_single_obj: betInfoReducer.bet_single_obj,

  vx_get_bet_appoint_obj:betInfoReducer.bet_appoint_obj,
  vx_get_pre_bet_list: betInfoReducer.pre_bet_list,
  vx_get_is_bet_merge: betInfoReducer.is_bet_merge,


  vx_layout_left_show: layoutReducer.layout_left_show,
  vx_get_cur_odd: globalReducer.odds.cur_odds,
  left_menu_toggle: layoutReducer.left_menu_toggle,
  // 当前菜单类型
  vx_cur_menu_type: menuReducer.cur_menu_type,
  vx_main_menu_toggle: menuReducer.main_menu_toggle,
  // 获取项目主题
  // theme:userReducer.theme,
  // 全局点击事件
  get_global_click: globalReducer.global_click,
  layout_size: layoutReducer.layout_size,
  menu_collapse_status: menuReducer.menu_collapse_status,
  //收起右侧详情 展开多列玩法
  get_unfold_multi_column: globalReducer.is_unfold_multi_column,
  //全局开关
  get_global_switch: globalReducer.global_switch,
});


const data_ref = {
  send_gcuuid:''
}

// export default {
//   mixins: [inducitve, oddsConversion, msc],
//   computed: {
//     ...mapGetters({
//       //获取当前盘口下所有的投注项
//       vx_get_pre_bet_list: "get_pre_bet_list",
//       //获取预约投注最小限制额
//       vx_get_pre_min_odd_value: "get_pre_min_odd_value"
//     })
//   },
//   methods: {
    // ...mapActions({
    //   vx_set_pre_bet_list: "set_pre_bet_list",  // 预约押注信息
    //   //vx_set_is_pre:"set_is_pre" //设置预约
    // }),
    /**
     * @description: 投注前拉取最新的盘口赔率状态(应对socket推送不及时)
     * @param {Founction} callback
     * @return {undefined} undefined
     */
   const check_odds_beforebet = (callback) => {
      let param = {
        idList: []
      };
      //单关
      if (computed_data.vx_is_bet_single) {
        //单关数据为空
        if (computed_data.vx_get_bet_single_list.length == 0) return;
        // 单关投注前校验接口参数组装
        for(let obj of Object.values(computed_data.vx_get_bet_single_obj)) {
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
        if (computed_data.vx_get_bet_list.length == 0) return;
        // 串关投注前校验接口参数组装
        for(let obj of Object.values(computed_data.vx_get_bet_obj)) {
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
      data_ref.send_gcuuid = uid();
      param.gcuuid = data_ref.send_gcuuid;
      // console.log('query_last_market_info====',param);
      // 查询最新的盘口数据
      api_betting.query_last_market_info(param).then((res) => {
        // console.log('query_last_market_info=======',data_ref.send_gcuuid === res.config.gcuuid);
        // if(data_ref.send_gcuuid != res.config.gcuuid) return;

        let gcuuid = _.get(res,'config.gcuuid')
        if(gcuuid && data_ref.send_gcuuid != gcuuid) {
          return;
        }
        //code码
        let code = _.get(res, "data.code");
        //返回数据
        let data = _.get(res, "data.data", []);
        if (data && data instanceof Array && data[0]) {
          //存储是否能预约
          // this.vx_set_is_pre(_.get(data[0], 'pendingOrderStatus', -1));
          if (computed_data.vx_is_bet_single) {

            computed_data.vx_is_bet_single.forEach((item, i) => {
              // 调用vuex中的http_upd_data方法同步数据
              this.vx_http_upd_data({
                i: i,
                http_data_list: data,
                self: this
              });
            });
          } else {
            computed_data.vx_get_bet_list.forEach((item, i) => {
              // 调用vuex中的http_upd_data方法同步数据
              this.vx_http_upd_data({
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
    }
    /**
     * @description:获取额度接口合并
     * @param {*} callback
     * @return {undefined} undefined
     */
    const query_bet_amount = (callback, type='') => {
      let bet_obj;
      //是单关
      if (computed_data.vx_is_bet_single) {
        bet_obj = computed_data.vx_get_bet_single_obj;
      } else {
        bet_obj = computed_data.vx_get_bet_obj;
      }
      // console.log('bet_obj====',JSON.stringify(bet_obj));
      //获取额度接口合并 参数
      let param = this.get_bet_amount_param(bet_obj);
      data_ref.send_gcuuid = uid();
      param.gcuuid = data_ref.send_gcuuid;
      // console.log('param====',JSON.stringify(param));
      api_betting.query_bet_amount(param).then(res=>{
        // console.log('param====res===', res);
        // if(data_ref.send_gcuuid != res.config.gcuuid) return;

        let gcuuid = _.get(res,'config.gcuuid')
        if(gcuuid && data_ref.send_gcuuid != gcuuid) {
          return;
        }
        let code = _.get(res, "data.code");
        //网络错误时设置默认最大最小值
        if(code == '0401038'){
          this.$root.$emit(this.emit_cmd.EMIT_NET_ERR);
          return;
        }
        let data = _.get(res, "data.data") || { latestMarketInfo:[],betAmountInfo: [] };
        //原有获取额度返回结构体 betAmountInfo
        let {latestMarketInfo,betAmountInfo} = data;
        //存储是否能预约
        // this.vx_set_is_pre(_.get(latestMarketInfo, '[0].pendingOrderStatus', -1));
        //原有最新盘口信息结构体 latestMarketInfo
        if(latestMarketInfo && _.isArray(latestMarketInfo)) {
          computed_data.vx_is_bet_single.forEach((item, i) => {
            // 调用vuex中的http_upd_data方法同步数据
            this.vx_http_upd_data({            
              i: i,
              http_data_list: latestMarketInfo,
              self: this
            });
          });
        } else {
          computed_data.vx_get_bet_list.forEach((item, i) => {
            // 调用vuex中的http_upd_data方法同步数据
            this.vx_http_upd_data({
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
    }
    /**
     * @description:获取预约投注预约额度接口合并
     * @param {*} callback
     * @return {undefined} undefined
     */
    const  query_pre_bet_amount = (callback, type='') => {
      let bet_obj;
      //是单关
      if (computed_data.vx_is_bet_single) {
        bet_obj = computed_data.vx_get_bet_single_obj;
      } else {
        bet_obj = computed_data.vx_get_bet_obj;
      }
      //获取额度接口合并 参数
      let param = get_bet_amount_param(bet_obj);
      data_ref.send_gcuuid = uid();
      param.gcuuid = data_ref.send_gcuuid;
      console.log('preparam===', JSON.stringify(param));
      api_betting.query_pre_bet_amount(param).then(res=>{
        // console.log('prepreparam===', data_ref.send_gcuuid === res.config.gcuuid);
        // if(data_ref.send_gcuuid != res.config.gcuuid) {
        //   return;
        // }
        let gcuuid = _.get(res,'config.gcuuid')
        if(gcuuid && data_ref.send_gcuuid != gcuuid) {
          return;
        }
        let code = _.get(res, "data.code");
        let data = _.get(res, "data.data") || { latestMarketInfo:[],betAmountInfo: [] };
        //原有获取额度返回结构体 betAmountInfo
        let {latestMarketInfo,betAmountInfo} = data;
        //原有最新盘口信息结构体 latestMarketInfo
        if(latestMarketInfo && _.isArray(latestMarketInfo)) {
          computed_data.vx_is_bet_single.forEach((item, i) => {
            // 调用vuex中的http_upd_data方法同步数据
            this.vx_http_upd_data({
              i: i,
              http_data_list: latestMarketInfo,
              self: this
            });
          });
        } else {
          computed_data.vx_get_bet_list.forEach((item, i) => {
            // 调用vuex中的http_upd_data方法同步数据
            this.vx_http_upd_data({
              i: i,
              http_data_list: latestMarketInfo,
              self: this
            });
          });
        }
        // 设置预约押注信息
        this.vx_set_pre_bet_list(latestMarketInfo[0])
        if(_.isFunction(callback)) {
          callback(code, betAmountInfo);
        }
      });
    }
    /**
     * @description:获取额度接口合并 参数
     * @param {*} bet_obj
     * @return {undefined} undefined
     */
    const get_bet_amount_param = (bet_obj) => {
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
        temp.seriesType = computed_data.vx_is_bet_single? 1: 2;
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
        if(computed_data.vx_is_bet_single) {
          // 是否开启 多单关投注模式
          temp.openMiltSingle = computed_data.vx_get_is_bet_merge ? 1 : 0;
        }
        param.orderMaxBetMoney.push(temp);
      }
      return param;
    }
    /**
     * @description:删除盘口中的垃圾盘口
     * @param {Founction} callback
     * @return {undefined} undefined
     */
    const remove_close_handicap = (callback) => {
      if (computed_data.vx_is_bet_single) {
        let len = computed_data.vx_is_bet_single.length;
        for (let index = 0; index < len; index++) {
          let id = computed_data.vx_is_bet_single[index];
          // 投注服务器对象
          let item_bs = _.get(computed_data.vx_get_bet_single_obj, `${id}.bs`,{});
          // 投注客户端对象
          let item_cs = _.get(computed_data.vx_get_bet_single_obj, `${id}.cs`,{});
          // match_over: 1赛事结束
          if ((!_.isEmpty(item_bs) && this.get_item_disable(item_bs)) || (!_.isEmpty(item_cs) && item_cs.match_over==1)) {
            this.vx_bet_single_obj_remove_attr(id);
            // 关盘时,删除该子项
            this.vx_bet_single_list_remove(index, 1);
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
    const remove_mix_match_end = (callback) => {
      //串关
      if (!computed_data.vx_is_bet_single) {
        let is_remove_match = false;
        let len = computed_data.vx_get_bet_list.length;
        for (let index = 0; index < len; index++) {
          let id = computed_data.vx_get_bet_list[index];
          // 投注服务器对象
          let item_bs = _.get(computed_data.vx_get_bet_obj, `${id}.bs`,{});
          //投注客户端对象
          let item_cs = _.get(computed_data.vx_get_bet_obj, `${id}.cs`,{});
          // match_over: 1赛事结束 或者不支持串关
          if ((!_.isEmpty(item_bs) && get_item_disable(item_bs)) || (!_.isEmpty(item_cs) && (item_cs.match_over==1 || !item_cs.serial_type))) {
            // 删除投注对象
            this.vx_bet_obj_remove_attr(id);
            // 关盘时,删除该子项
            this.vx_bet_list_remove(index, 1);
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
    /**
     * @description:清空押注成功的信息
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const clear_bet_single_list = () => {
      let len = computed_data.vx_is_bet_single.length;
      for (let index = 0; index < len; index++) {
        let id = _.get(this,`vx_get_bet_single_list[${index}]`);
        // 投注客户端对象
        let item_cs = _.get(computed_data.vx_get_bet_single_obj ,`${id}.cs`, {});
        // 提交状态为已提交(submit_status=true)
        if (_.get(item_cs,'submit_status')) {
          // 移除单关投注项对象
          this.vx_bet_single_obj_remove_attr(id);
          // 从单关列表中移除投注项id
          this.vx_bet_single_list_remove(index, 1);
          index--;
        }
      }
    }
    /**
     * @description: 押注显示时判断是否禁用状态
     * @param {Object} item_  投注项对象
     * @return {Boolean} undefined
     */
    const  get_item_disable = (item_) => {
      let ret = false;
      let active = get_odds_active(_.get(item_, 'mhs'),
        _.get(item_, 'hps[0].hl[0].hs'),
        _.get(item_, 'hps[0].hl[0].ol[0].os'));
      // 判断盘口是否可用
      if (active != 1 && active != 4) {
        ret = true;
      }
      return ret;
    }
    /**
     * @description: 获取押注数据列表模板数据
     * @param {Number} seriesType  1-单关, 2-串关 3, 冠军
     * @param {Number} seriesBetAmount 串关投注金额, 1-单关时,该字段值失效
     * @param {Number} is_pre  是不是预约投注 默认false
     * @return {undefined} undefined
     */
    const bet_submit_data_template = (seriesType, seriesBetAmount, item, is_pre=false) => {
      console.log('正常投注参数playOptionName处理------------1', );
      let tempList = [];
      let bet_list_array = computed_data.vx_is_bet_single ? [item] : ( computed_data.computed_data || []);
      bet_list_array.forEach(id => {
        let item_bs, item_cs;
        //单关
        if (computed_data.vx_is_bet_single) {
          item_bs = _.get(computed_data.vx_get_bet_single_obj ,`${id}.bs`,{}); //列表的数据
          item_cs = _.get(computed_data.vx_get_bet_single_obj ,`${id}.cs`,{}); //组装的数据
        } else {
          //串关
          item_bs = _.get(computed_data.vx_get_bet_obj,`${id}.bs`,{});
          item_cs = _.get(computed_data.vx_get_bet_obj,`${id}.cs`,{});
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

          let msc = this.yabo_common.msc_obj_arry(_.get(item_bs,'msc',[]));
          //基准分
          temp.scoreBenchmark = this.yabo_common.calc_bifen(msc, _.get(item_bs,'csid'),  _.get(item_bs,'ms'), _.get(item_bs,'hps[0].hpid'));
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
          //查找当前玩法下盘口符合调整的球头对应值的，并且是当前投注项类型 over对象，取里面的marketId 和playOptionId，
          //是预约 计算marketId和playOptionsId
          if(is_pre && computed_data.vx_get_bet_appoint_obj && !_.isUndefined(computed_data.vx_get_bet_appoint_obj.appoint_ball_head)) {
             let dl = computed_data.vx_get_pre_bet_list;
             if(dl) {
              if(play_mapping.MARKET_RANG_FLAG_LIST.includes(_.get(item_cs, 'play_id'))
              ||play_mapping.BASKETBALL_BY_APPOINTMENT.includes(_.get(item_cs, 'play_id'))//这里是篮球让球
              ){  //让球过滤数据 过滤出盘口 和oddsType 对应数据
                let cur_i = -1;
                let ml_len = dl.marketList.length;
                for(let i = 0; i < ml_len; i++) {
                  let ml_item = dl.marketList[i];
                  let odd_len = ml_item.marketOddsList.length;
                  for(let j = 0; j < odd_len; j++) {
                    let odd_item = ml_item.marketOddsList[j];
                    if(_.get(dl, 'currentMarket.marketOddsList[0].oddsType',-1) == odd_item.oddsType && odd_item.playOptions == computed_data.vx_get_bet_appoint_obj.computed_appoint_ball_head) {
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
               let dl_fillter = dl.marketList.filter(item => item.marketValue == computed_data.vx_get_bet_appoint_obj.computed_appoint_ball_head)[0];
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
            if(_.isNull(computed_data.vx_get_bet_appoint_obj.appoint_ball_head) || computed_data.vx_get_bet_appoint_obj.is_head_eq_hadicap || _.isNaN(computed_data.vx_get_bet_appoint_obj.appoint_ball_head)) {
              temp.marketValue = _.get(computed_data.vx_get_pre_bet_list, 'currentMarket.marketValue', '')
               //盘口id
              temp.marketId = _.get(item_bs, 'hps[0].hl[0].hid') || _.get(item_bs, 'hps[0].hl.hid') || _.get(item_bs, 'hps[0].hl[0].ol[0].hid');;
              //投注项id
              temp.playOptionsId = _.get(item_cs, 'oid');
            }else{
              temp.marketValue = computed_data.vx_get_bet_appoint_obj.appoint_ball_head;  //盘口值
            }
          }
          let hsw = _.get(item_bs, 'hps[0].hsw') || _.get(item_bs, 'hps[0].hl[0].hsw');
          // this.vx_http_upd_data({
          //   i: i,
          //   http_data_list: data,
          //   self: this
          // });
          //赔率
          if (hsw && hsw != '') {
            let support_odds = [];
            if(typeof(hsw) == 'string'){
              hsw = hsw.split(',');
            }
            let hsw_len = hsw.length;
            for (let i = 0; i < hsw_len; i++) {
              for (let [key, value] of Object.entries(this.oddsTable)) {
                if (value == hsw[i]) {
                  support_odds.push(key);
                }
              }
            }
            if (support_odds.includes(computed_data.vx_get_cur_odd)) {
              //最终盘口类型
              temp.marketTypeFinally = computed_data.vx_get_cur_odd;
            } else {
              //最终盘口类型
              temp.marketTypeFinally = "EU";
            }
          } else {
            //最终盘口类型
            temp.marketTypeFinally = computed_data.vx_get_cur_odd;
          }
          let appoint_value;
          //如果是预约 
          if(is_pre) {
            //赔率计算调用this.$mathjs里面的方法，保证精度
            appoint_value = this.$mathjs.multiply(computed_data.vx_get_bet_appoint_obj.appoint_odds_value,100000);
          }
          // console.log('this.get_cur_odd =', this.get_cur_odd );

          //如果是预约还要判断本身这个赛事支不支持香港盘，如果不是预约投注直接取odds_value
          temp.odds = !is_pre?_.get(item_cs, 'odds_value'): this.cur_odd == 'EU' ? appoint_value : (temp.marketTypeFinally == "EU" ? appoint_value: this.$mathjs.add(appoint_value, 100000));
          //最终赔率 这个值不能是负的，负的话就有问题了
          let odds_js = this.$mathjs.divide(temp.odds, 100000);

          let break_odds_js = this.$mathjs.divide(_.get(item_cs, 'break_odds_value'), 100000);
          if (hsw != 1) {
            temp.oddFinally = this.compute_value_by_cur_odd_type(odds_js, break_odds_js, hsw);
          } else {
            temp.oddFinally = this.compute_value_by_cur_odd_type(odds_js, null, []);
          }
          // 玩法名称
          temp.playName = _.clone(_.get(item_bs, 'hps[0].hpn')) ||  _.get(item_bs, 'hps[0].hl[0].ol[0].hpn') || _.get(item_cs, 'play_name');

          // 球类名称
          temp.sportName = this.yabo_common.play_name_mapping(temp.sportId);
          // 赛事类型 如果为3的话是冠军赛事
          temp.matchType = _.get(item_cs, 'match_type');
          // 赛事名称
          temp.matchName = _.get(item_bs, 'tn');
          this.id = _.get(item_cs, 'id');
          //队伍名
          let team_name = this.yabo_common.get_team_name(this);
          //盘口名
          let handicap = this.yabo_common.get_handicap(this);
          // 预约的赔率，球头 当前赛事 预约投注需要参数playOptionName处理
          if(computed_data.vx_get_bet_appoint_obj && computed_data.vx_get_bet_appoint_obj.bet_appoint_id==this.id && is_pre) {
            let new_name = ''
            //队伍名如果是加号或者减号开头去除符号
            if(team_name.startsWith('+') || team_name.startsWith('-')){
              new_name = team_name.substr(1,handicap.length);
            }
            // let n_name = new_name ? new_name : team_name;
            let {computed_appoint_ball_head, appoint_ball_head} = computed_data.vx_get_bet_appoint_obj;
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
    const bet_submit_data = (seriesType, callback) => {
      if (computed_data.vx_is_bet_single) {
        if (!_.isArray(computed_data.vx_is_bet_single)) return;
      } else {
        if (!_.isArray(computed_data.vx_get_bet_list)) return;
      }
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
        parm.openMiltSingle = computed_data.vx_get_is_bet_merge?1:0;
        // 有预约id的时候只提交
        if(computed_data.vx_get_bet_appoint_obj && computed_data.vx_get_bet_appoint_obj.bet_appoint_id) {
          let { bet_appoint_id } = computed_data.vx_get_bet_appoint_obj;
          let cs = _.get(computed_data.vx_get_bet_single_obj,`[${bet_appoint_id}].cs`,{});
          let temp_bat = {};
          if(cs && cs.money) {
            // 串关数量
            temp_bat.seriesSum = 1;
            // 串关类型
            temp_bat.seriesType = seriesType;
            // 串关值
            temp_bat.seriesValues = (seriesType == 1) ? this.$root.$t('bet.bet_one_') : this.$root.$t('bet.bet_winner');//'单关' , 冠军
            temp_bat.fullBet = _.get(cs,'full_bet',0);
            //赔率没变，球头没变的情况视为普通注单 preBet传0
            if(computed_data.vx_get_bet_appoint_obj.appoint_init_odds_value == computed_data.vx_get_bet_appoint_obj.appoint_odds_value && computed_data.vx_get_bet_appoint_obj.is_head_eq_hadicap) {
              parm.preBet = 0  //没调整赔率和球头是为普通投注
            }else{
              parm.preBet = 1 //是预约投注
            }
            //设置注单集合
            temp_bat.orderDetailList = this.bet_submit_data_template(seriesType, null, bet_appoint_id, parm.preBet ? true : false);
            parm.seriesOrders.push(temp_bat);
          }
        } else {
          computed_data.vx_is_bet_single.forEach(item=>{
            let cs = _.get(computed_data.vx_get_bet_single_obj,`[${item}].cs`,{});
            let temp_bat = {};
            if(cs && cs.money) {
              // 串关数量
              temp_bat.seriesSum = 1;
              // 串关类型
              temp_bat.seriesType = seriesType;
              // 串关值
              temp_bat.seriesValues = (seriesType==1)?this.$root.$t('bet.bet_one_') : this.$root.$t('bet.bet_winner');//'单关' , 冠军

              temp_bat.fullBet = _.get(cs,'full_bet',0);
              //设置注单集合
              temp_bat.orderDetailList = this.bet_submit_data_template(seriesType, null, item);
              parm.preBet = 0 //不是预约投注
              parm.seriesOrders.push(temp_bat);
            }
          });
        }
      } else if (seriesType == 2) { // 串关
        this.vx_get_bet_s_list.forEach(id => {
          let x1 = _.get(this.vx_get_bet_s_obj,`${id}.cs`);
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
            temp_bat.orderDetailList = this.bet_submit_data_template(seriesType, x1.money);
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
      data_ref.send_gcuuid = uid();
      parm.gcuuid = data_ref.send_gcuuid;
      // console.log('post_submit_Bet_list====',parm);
      // debugger
      // 押注项调用提交接口
      api_betting.post_submit_Bet_list(parm).then(res => {
        // console.log('post_submit_Bet_list=======',data_ref.send_gcuuid === res.config.gcuuid);
        // if(data_ref.send_gcuuid != res.config.gcuuid) {
        //   return;
        // }

        let gcuuid = _.get(res,'config.gcuuid')
        if( gcuuid && data_ref.send_gcuuid != gcuuid) {
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
           //投注设置诸葛埋点
           this.bet_send_zhuge_event()
          // console.log('api_betting:'+JSON.stringify(data));
          // 设置提交成功标识符
          data.orderDetailRespList.forEach(order_item => {
            //设置提交状态
            this.set_submit_status(order_item);
            //预约投注状态转换
            if(!_.isNull(order_item.preOrderDetailStatus)) {
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
          this.vx_get_bet_s_list.forEach(id => {
            let obj = _.cloneDeep(_.get(this.vx_get_bet_s_obj, `${id}`));
            if (_.has(obj,'cs')) {
              obj.cs.money = '';
              this.vx_bet_s_obj_add_attr(obj);
            }
          });
          if (_.isFunction(callback)) {
            callback(code, data);
          }
          //这里增加一个调用余额的接口
          // this.$root.$emit(this.emit_cmd.EMIT_GET_BALANCE_CMD);
        } else {
          if (_.isFunction(callback)) {
            callback(code, data, msg);
          }
        }
      })
    }
    /**
     *  @description: 投注设置诸葛埋点
     *  @param {undefined} undefined 
     *  @return {undefined} undefined
     */
    const bet_send_zhuge_event = () =>{
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
    }
    /**
     * @description: 设置提交状态
     * @param {Object} order_item 订单数据
     * @return {undefined} undefined
     */
    const set_submit_status = (order_item) => {
      if (computed_data.vx_is_bet_single) {
        // 设置押注成功后的标识符
        computed_data.vx_is_bet_single.forEach(id => {
          let item = _.cloneDeep(_.get(computed_data.vx_get_bet_single_obj,`[${id}]`,{}));
          let oid = _.get(item, 'bs.hps[0].hl[0].ol[0].oid');
          if (oid == _.get(order_item,'playOptionsId')) {
            // 提交投注项id并设置key
            item.key = id;
            // 提交状态
            item.cs.submit_status = true;
            this.vx_bet_single_obj_attr(item);
          }
        });
      } else {
        // 设置押注成功后的标识符
        computed_data.vx_get_bet_list.forEach(id => {
          let item = _.cloneDeep(computed_data.vx_get_bet_obj[id]);
          let oid = _.get(item, 'bs.hps[0].hl[0].ol[0].oid');
          if (oid == _.get(order_item,'playOptionsId')) {
            // 提交投注项id并设置key
            item.key = id;
            // 提交状态
            item.cs.submit_status = true;
            // 判断是否提交成功
            this.vx_bet_obj_add_attr(item);
          }
        });
      }
    }
    /**
     * @description: 获取押注项最大和最小的金额
     * @param {Array} item_list 列表
     * @param {Number} seriesType-串关类型, 串关类型(1：单关(默认) 、2：双式投注,例如1/2  、3：三式投注,例如1/2/3   、4：N串1,例如4串1   、5：N串F,例如5串26 )
     * @param {Function} callback -回调函数
     * @return {undefined} undefined
     */
    const get_min_max_money = (item_list,seriesType, callback) => {
      if(seriesType==2 && (!_.isArray(item_list) || (_.isArray(item_list) && _.get(item_list,'length',0)==0))) {
        return;
      }
      // 获取押注项最大和最小的金额
      let bet_list = computed_data.vx_is_bet_single? computed_data.vx_is_bet_single : computed_data.vx_get_bet_list
      // 获取押注项最大和最小的金额
      let parm_obj = {
        orderMaxBetMoney: []
      };
      bet_list.forEach(id => {
        let obj, item_bs, item_cs;
        if (computed_data.vx_is_bet_single) {
          obj = computed_data.vx_get_bet_single_obj;
        } else {
          obj = "vx_get_bet_obj";
        }
        if(_.has(this[obj],`${id}.bs`) && _.has(this[obj],`${id}.cs`)) {
          item_bs = _.get(this,`${obj}.${id}.bs`,{});
          item_cs = _.get(this,`${obj}.${id}.cs`,{});
        } else {
          return;
        }
        let parm = {};
        // 设置用户Id
        if (this.vx_get_user) {
          parm.userId = this.vx_get_user.uid;
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
        if(computed_data.vx_is_bet_single) {
          // 是否开启 多单关投注模式
          parm.openMiltSingle = computed_data.vx_get_is_bet_merge?1:0;
        }

        parm_obj.orderMaxBetMoney.push(parm);
      });
      // 20016steven# 客户端-偶现market_id，PC前端取值异常(针对此问题进行market_id检查)
      if(_.get(parm_obj,'orderMaxBetMoney.length', 0)==0) {
        return;
      }
      data_ref.send_gcuuid = uid();
      parm_obj.gcuuid = data_ref.send_gcuuid;
      // console.log('get_min_max_money===', JSON.stringify(parm_obj));

      api_betting.post_getBetMinAndMaxMoney(parm_obj).then(res => {

        // console.log('get_min_max_money===', data_ref.send_gcuuid === res.config.gcuuid);
        // if(data_ref.send_gcuuid != res.config.gcuuid) {
        //   return;
        // }

        let gcuuid = _.get(res,'config.gcuuid')
        if(gcuuid && data_ref.send_gcuuid != gcuuid) {
          return;
        }
        let code = _.get(res, "data.code");
        let status = _.get(res, "status");
        let data = _.get(res, "data.data");
        if (code == 200 && status) {
          if (_.isFunction(callback)) {
            callback(code, data);
          }
        } else {
          if (_.isFunction(callback)) {
            callback(code, data);
          }
        }
      });
    }
    /**
     * @description: 获取投注模块-统计串关数
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    const getSeriesCountJointNumbe = (callback) => {
      let data = BetCountJointNumber.getBetCountJoint(computed_data.vx_get_bet_list.length);
      let min_num = this.vx_get_mix_min_count;
      if(min_num <= 10) {
        data = data.filter((item) => {
          return Number(item.id.slice(0, 1)) >= min_num ||  ['10串1','10串1013'].includes(item.name) }
          );
      }else if(computed_data.vx_get_bet_list.length == 10){
        data = [data[0]];
      }else {
        data = [];
      }
      console.log(JSON.stringify(data));
      if (_.isFunction(callback)) {
        callback(200, data);
      }
    }
    /**
     * @description: 获取投注项状态
     * @param {Number} matchHandicapStatus 赛事盘口状态 0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
     * @param {Number} status 盘口状态0-5。 0：有效，1：暂停，2：停用，3：已结算，4：已取消，5：移交
     * @param {Number} active 投注项状态 1.开盘，2封盘，3关盘 ，4 锁盘
     * @return {Number} 投注项状态 1.开盘，2封盘，3关盘 ，4 锁盘
     */
    const get_odds_active = (matchHandicapStatus, status, active) => {
      var active_ = 1;
      // console.log(`matchHandicapStatus==${matchHandicapStatus}, ${status}, ${active}`);
      if (matchHandicapStatus) { // 赛事盘口有操作变化时
        if (matchHandicapStatus == 1) { //赛事封盘状态
          active_ = 2;
        } else if (matchHandicapStatus == 11) { //赛事锁盘
          if(active!=1){
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
    }
    /**
     * @description: 初始化单关数据
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const init_bet_single_data = () => {
      _.forEach(computed_data.vx_is_bet_single, item => {
        let bs = _.cloneDeep(_.get(this,`vx_get_bet_single_obj[${item}].bs`,{}));
        let cs = _.cloneDeep(_.get(this,`vx_get_bet_single_obj[${item}].cs`,{}));
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
          this.vx_bet_single_obj_attr(obj);
        }
      });
      // 清除押注成功的投注想
      this.clear_bet_single_list();
    }
    /**
     * @description: 初始化串关数据
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    const init_bet_mix_data = () => {
      //所有串关的金额
      this.vx_get_bet_s_list.forEach(item => {
        let bs = _.cloneDeep(_.get(this,`vx_get_bet_s_obj[${item}].bs`,{}));
        let cs = _.cloneDeep(this,`vx_get_bet_s_obj[${item}].cs`,{});
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
        this.vx_bet_obj_add_attr(obj);
      });
    }
    /**
     * @description: 获取投注记录数据
     * @param {Object} params 投注记录入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    const get_bet_record_data = (params, callback) => {
      data_ref.send_gcuuid = uid();
      params.gcuuid = data_ref.send_gcuuid;
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
          // console.log('get_bet_record_data=======',data_ref.send_gcuuid === res.config.gcuuid);
          // if(data_ref.send_gcuuid != res.config.gcuuid) {
          //   return;
          // }

          let gcuuid = _.get(res,'config.gcuuid')
          if(gcuuid && data_ref.send_gcuuid != gcuuid) {
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
    }
    /**
     * @description: 获取预投住注单记录
     * @param {Object} params 投注记录入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    const get_book_record_data = (params, callback) => {
      data_ref.send_gcuuid = uid();
      params.gcuuid = data_ref.send_gcuuid;
      // console.log('get_book_record_data====',JSON.stringify(params));
      api_betting.post_book_list(params).then(res => {
        let code = _.get(res, "data.code");
        let status = _.get(res, "status");
       

        // console.log('get_book_record_data====res===', data_ref.send_gcuuid == res.config.gcuuid);
        // if(data_ref.send_gcuuid != res.config.gcuuid) return;

        let gcuuid = _.get(res,'config.gcuuid')
        if(gcuuid && data_ref.send_gcuuid != gcuuid) {
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
    }
    /**
     * @description: 预约投注拉单,预约注单状态
     * @param {Object} params 预约投注拉单入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    const get_book_status_data = (params, callback) => {
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
    }
    /**
     * @description: 预投投注取消
     * @param {Object} params 投注记录入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    const cancel_book_record_order = (params, callback) => {
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
    }
    /**
     * @description: 提前结算实时查询最高返还批量,每5秒请求一次
     * @param {Object} params 投注记录入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    const get_bet_cashout_max_amount = (params, callback) => {
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
    }
    /**
     * @description:查询待确认中的提前结算单
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    const order_pre_settle_confirm = (callback) => {
      let param = {};
      data_ref.send_gcuuid = uid();
      param.gcuuid = data_ref.send_gcuuid;
      // console.log('init_data==order_pre_settle_confirm==',JSON.stringify(param));
      api_betting.query_order_pre_settle_confirm(param).then(res => {
        // console.log('init_data==order_pre_settle_confirm==res===', data_ref.send_gcuuid == res.config.gcuuid);
        let gcuuid = _.get(res,'config.gcuuid')
        if(gcuuid && data_ref.send_gcuuid != gcuuid) {
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
     * @description:获取赛事是否存在赛果
     * @param {*} params    参数
     * @param {*} callback  回调函数
     * @return {undefined} undefined
     */
    const get_exist_match_result = (params, callback) => {
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
     * @description: 获取服务器时间戳
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    const get_server_time = (callback) => {
      let param = {};
      data_ref.send_gcuuid = uid();
      param.gcuuid = data_ref.send_gcuuid;
      // console.log('get_server_time===',JSON.stringify(param));

      api_common.get_server_time(param).then(res => {
        // console.log('get_server_time===res===', data_ref.send_gcuuid == res.config.gcuuid);
        // if(data_ref.send_gcuuid != res.config.gcuuid) return;

        let gcuuid = _.get(res,'config.gcuuid')
        if(gcuuid && data_ref.send_gcuuid != gcuuid) {
          return;
        }

        let code = _.get(res, "data.code");
        if (code == 200) {
          let data = new Date(parseInt(_.get(res, "data.data")));
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
     * @description: 四舍六入五成双
     * @param {Number} num 金额
     * @param {Number} digit
     * @return {Number} 转换后的金额
     */
    const four_five_six_double = (num, digit) => {
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
    }
    
    /**
     * @description: 赔率展示格式化
     * @param {string} val 赔率值
     * @return {String} 
     */
    const format_odds = (val) => {
      if(val=='' || val == undefined){
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
              ret = val.substring(0,len-2);
            } else {
              ret = val;
            }
          }
        } else if (val >= 10) {
          if (val.split('.')[1][1] == '0') {
            ret = val.slice(0,val.length-1);
          } else {
            ret = val;
          }
        }
      }
      return ret;
    }

    export {
      check_odds_beforebet,
      query_bet_amount,
      query_pre_bet_amount,
      get_bet_amount_param,
      remove_close_handicap,
      remove_mix_match_end,
      clear_bet_single_list,
      get_item_disable,
      bet_submit_data_template,
      bet_submit_data,
      bet_send_zhuge_event,
      set_submit_status,
      get_min_max_money,
      getSeriesCountJointNumbe,
      get_odds_active,
      init_bet_single_data,
      init_bet_mix_data,
      get_bet_record_data,
      get_book_record_data,
      get_book_status_data,
      cancel_book_record_order,
      get_bet_cashout_max_amount,
      order_pre_settle_confirm,
      get_exist_match_result,
      get_server_time,
      four_five_six_double,
      format_odds
    }