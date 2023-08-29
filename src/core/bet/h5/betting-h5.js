/*
 * @Description: 押注动作相关的方法
 */
// import { mapGetters, mapMutations, mapActions } from "vuex";
// import { api_betting } from "src/project/api/index.js";
// import { football_score_map, basketball_score_map, table_tennis_score_map, volleyball_score_map, baseball_score_map } from "src/project/mixins/betting/timely_score.js"
// import chuanguan_map from "src/project/mixins/betting/chuanguan_map";
// import { HANDICAP_ODDS, HANDICAP_PLACEHOLDER, TIPS_INFO1, TIPS_INFO2, MOCK_C105_C106 } from "src/project/mixins/betting/status_code_map";
import {odd_convert} from "src/core/format/index.js";   // 此文件 主要是应对 赔率转换(在转换为其他赔率时候，必须做欧洲赔率的配分)
// import { WsRev } from "src/public/utils/ws/wsCtr.js";
import UserCtr from "src/core/user-config/user-ctr.js";
export default {
  mixins: [odd_convert],
  data() {
    return {
      tips_msg : ""//公共消息体
    }
  },
  created () {
    // 延时器
    this.timer = null
  },
  computed: {
    ...mapGetters([
      //盘口集合
      'get_pre_market_data',
      //玩法集Id
      'get_details_item',
      //串关并且投注项大于1
      "get_mix_bet_flag",
      // 投注项id集合
      "get_bet_list",
      // 押注信息对象
      "get_bet_obj",
      // 当前选中的一级菜单, 二级菜单, 三级菜单对象
      "get_current_menu",
      // 统计串关数数据
      "get_s_count_data",
      // 是否接受更好赔率
      "get_is_accept",
      // 当前选中的主菜单菜单menu_type
      "get_menu_type",
      // 是否串关
      "get_is_mix",
      /**
       * 押注状态0-隐藏状态 1-初始弹出状态,2-注单处理中状态,3-投注成功,
       * 4-投注失败(bet接口没返回200),5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）,
       * 7-有投注项锁盘，8-单关投注失败(bet接口返回200)
       */
      "get_bet_status",
    
      // 值为 1简版 2标准版
      "get_newer_standard_edition",
      // 是否是冠军玩法
      "get_is_champion",
      // 投注框选中的赛事id集合
      "get_mids",
      "get_is_combine",
      "get_lang"
    ]),
  },
  methods: {
    ...mapMutations([
      //预约盘口信息
      'set_pre_market_data',
      //更新提示消息
      'set_update_tips',
      // 设置投注成功的赛事id
      'set_match_id_bet_success',
      // 设置提醒内容
      'set_toast',
      // 设置是否在串关页面里
      "set_is_mix",
      // 设置押注信息对象
      "set_bet_obj",
      // 设置投注项id集合
      "set_bet_list",
      /**
       * 押注状态0-隐藏状态 1-初始弹出状态,2-注单处理中状态,3-投注成功,
       * 4-投注失败(bet接口没返回200),5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）,
       * 7-有投注项锁盘，8-单关投注失败(bet接口返回200)
       */
      "set_bet_status",
      // 设置统计串关数数据
      "set_s_count_data",
      //设置总投注额
      "set_money_total",
      // 投注前拉取HTTP更新数据
      "set_http_update",
      // 设置用户信息,用户金额,userId 需要监听变化
      "set_user",
    ]),
    ...mapActions(['get_balance']),
      /**
   
    /**
     *@description 校验串关投注项数量是否小于最小串关数量
     * @param {*} value 不为空表示是删除某个投注项，undefined表示校验所有
     * @returns
     */
    vilidata_mix_count(value) {
      const bet_length  = this.get_bet_list.length
      if(value && bet_length <= 2){
        return true
      }
      const min_num = _.get(UserCtr.user_info, 'configVO.minSeriesNum', 2)
      if((bet_length - (value ? 1 : 0)) < min_num){
        this.set_toast({ 'txt': i18n.t('bet.match_min', [min_num]) });
        return false
      }else{
        return true
      }
    },
    /**
     *@description 更新提示信息
     * @param {*} value 需要更新的内容
     * @returns
     */
     tips_msg_update(value) {
       this.set_update_tips(value||'')
     },
    /**
     *@description 点击押注小方块
     *@param {Object} match 组合的数据
     *@param {Object} odd_field 组合的数据
     *@param {Object} odd_item 组合的数据
     *@return {Undefined} undefined
     */
    bet_click(match, odd_field, odd_item) {
      if (!odd_item.id_) {
        odd_item.id_ = odd_field.hl[0] && odd_field.hl[0].hn ? `${match.mid}_${odd_field.hpid}_${odd_item.ot}_${odd_field.hl[0].hn}` : odd_item.oid  //id_是坑位hn或者oid
      }

      if (this.get_bet_list.includes(odd_item.id_)) {
        this.remove_item(odd_item.id_);
        return;
      }

      // 投注项数量已达上限
      let _maxunm = _.get(UserCtr.user_info, 'configVO.maxSeriesNum', 10)
      if (this.get_bet_list.length >= _maxunm) {
        this.set_toast({ 'txt': i18n.t('bet.match_max2') });
        return;
      }

      let hps, flag = 'hps';
      let flag2 = this.get_newer_standard_edition == 2 && ['matchList', 'home'].includes(this.$route.name);

      if (match.csid == '1' && flag2) {  //足球列表页有几类玩法，数据不在hps里面，特殊处理
        switch (true) {
          case [111, 113, 114, 119, 121, 122].includes(odd_field.hpid * 1):  //角球玩法
            flag = 'hpsCorner'
            break;
          case [310, 306, 307, 311, 308, 309].includes(odd_field.hpid * 1):  //罚牌玩法
            flag = 'hpsPunish'
            break;
          case [32,33,34].includes(odd_field.hpid * 1):  //十五分钟玩法
            flag = 'hps15Minutes'
            break;
          case [135].includes(odd_field.hpid * 1):  //晋级玩法
            flag = 'hpsPromotion'
            break;
          case [136].includes(odd_field.hpid * 1):  //冠军玩法
            flag = 'hpsOutright'
            break;
          case [333, 334, 335].includes(odd_field.hpid * 1):  //点球大战玩法
            flag = 'hpsPenalty'
            break;
          case [7, 20, 74, 341, 342].includes(odd_field.hpid * 1):  // 波胆玩法
            flag = 'hpsBold'
            break;
          case [361, 362].includes(odd_field.hpid * 1):  // 5分钟玩法
            flag = 'hps5Minutes'
            break;
          case match.hpsOvertime && match.hpsOvertime.length && [126, 128, 127, 129, 130, 332].includes(odd_field.hpid * 1):  //加时赛玩法
            flag = 'hpsOvertime'
            break;
          default:
            break;
        }
      }

      // 特殊处理放在该map中维护
      const hps_add_map = new Map([
          ['2', ['45', '46', '48', '43', '19', '18', '57', '58', '60'].includes(odd_field.hpid)], // 篮球小节类的6个玩法，数据不在hps里面，特殊处理
          ['5', ['162', '163', '164'].includes(odd_field.hpid)],   // 网球 第x盘独赢 第x盘让局 第x盘总局数，特殊处理
          ['7', ['184', '185', '186', '190', '191'].includes(odd_field.hpid)],  // 斯洛克 第x局独赢、第x局让分、第x局总分、单杆最高分、单杆破百 特殊处理
          ['8', ['175', '176', '177'].includes(odd_field.hpid)],  // 乒乓球 第x局独赢、第x局让分、第x局总分，特殊处理
      ])
      const hps_add_check = hps_add_map.get(match.csid)
      if (flag2 && hps_add_check) {
        flag = 'hpsAdd'
      }

      match = _.cloneDeep(match);
      odd_field = _.cloneDeep(odd_field);
      odd_item = _.cloneDeep(odd_item);
      match.id_ = odd_item.id_ || odd_item.oid;
      //value1和value2是投注弹框左上角的展示值
      let ol,
          bet_bs = { value1: '', value2: '' },
          index1 = match.id_.toString();   //id_是坑位hn或者oid

      if (match[flag].length > 1) {
        hps = match[flag].filter(item => {
          if(item.hSpecial){
            // 足球15分钟时,增加对比特n阶段
            return item.hpid == odd_field.hpid && item.hSpecial == odd_field.hSpecial;
          } else {
            return item.hpid == odd_field.hpid;
          }
        })
      } else {
        hps = match[flag];
      }

      let item_index;

      // 若锁盘则提前退出
      if (!hps[0] || !hps[0].hl[0].ol) {
        console.error('qwe error hps not found！！')
        return
      }

      // 获取 玩法集合 下边 的  盘口集合（主盘） hl 有没有值，有值就继续走流程，没有值，则return 掉
      for (let item of hps[0].hl) {
        let ol_list = item.ol;

        if (!item.ol || !item.ol.length) {
          ol_list = [odd_item];
        }



        _.forEach(ol_list, item_ => {
          //没有id_的在这里拼一个
          if (!item_.id_) {
            item_.id_ = odd_field.hl[0] && odd_field.hl[0].hn ? `${match.mid}_${odd_field.hpid}_${item_.ot}_${odd_field.hl[0].hn}` : item_.oid
          }


          if (item_.id_ == odd_item.id_) {   //数据提取
            bet_bs.value2 = item_.on;
            ol = [item_];
            item_index = hps[0].hl.indexOf(item);
          }
        })
      }

      if (item_index == undefined) {
        console.log('qwe error item_index 未找到！')
        return
      }

      if (ol[0].otv) {    //在详情页
        /*  详情页以下玩法特殊对应value1取otv，vlaue2取"",
            3-全场让球赛果  69-上半场让球赛果  71-下半场让球赛果
            220-球员得分 221-球员三分球 271-球员助攻 272-球员篮板
            171-独赢&总局数 13-独赢&进球大小 101-独赢&两队都进球  106-下半场独赢&下半场两队都进球 105-上半场独赢&上半场两队都进球 216-独赢&总分 102-进球大小&两队都进球
            107-双重机会&两队都进球 351-进球单双&进球大小 345-独赢&进球大小-上半场 346-独赢&进球大小-下半场 347-双重机会&进球大小 348-半场/全场&进球大小 349-半场/全场&上半场进球大小
            339-拳击的独赢&准确回合数
        */
        if (['3', '69', '71', '220', '221', '271', '272', '171', '13', '101', '351', '345', '346', '347', '348', '349',
        '105', '106', '216', '102', '107', '339'].includes(hps[0].hpid)) {
          bet_bs.value1 = ol[0].otv;
          bet_bs.value2 = '';
        } else {
          bet_bs.value1 = ol[0].ott;
          bet_bs.value2 = ol[0].on;
        }
      } else {    //在列表页
        if (ol[0].ot == 'Other' && flag == 'hpsBold') {  // 波胆的'其他'特殊处理
          if(['zh', 'tw'].includes(this.get_lang)){
            bet_bs.value2 = '其他'
          } else {
            bet_bs.value2 = 'Other'
          }
        }
        if ([i18n.t("bet.home_win"), i18n.t("bet.away_win")].includes(bet_bs.value2)) bet_bs.value2 = "";
        if (ol[0].ots == 'T1') {
          bet_bs.value1 = match.mhn;
        } else if (ol[0].ots == 'T2') {
          bet_bs.value1 = match.man;
        }
        // 这几个特殊对应，避免重复显示
        let wfid = ['2', '38', '114', '173', '18'].includes(hps[0].hpid);
        if (wfid) bet_bs.value1 = '';

        // 列表接口的 hps[0]没有 hps 字段， 需要跟据 hSpecial 来判断取什么比分, 把数据合进去,方便后面取基准分
        // 33 - 15分钟进球-让球(6个时间段，取S1001-S1006)   232 - 15分钟角球-让球(6个时间段，取S5001-S5006) 这2个玩法特殊需要动态获取比分
        let flag1 = hps[0].hpid == '33'
        let flag2 = hps[0].hpid == '232'
        let flag3 = hps[0].hpid == '371'
        if ((flag1 || flag2||flag3) && hps[0].hSpecial && !hps[0].hps) {
          hps[0].hps = (flag1 ? 'S100' : 'S500') + hps[0].hSpecial
        }

      }

      Object.assign(hps[0].hl[item_index], { ol });
      Object.assign(hps[0], { "hl": [hps[0].hl[item_index]] });
      Object.assign(bet_bs, match, { hps });

      let bet_item = _.cloneDeep(this.get_bet_obj)
      let bet_list = _.cloneDeep(this.get_bet_list);
      if ([11, 900, 3000].includes(+this.get_menu_type)) {  // 虚拟体育、串关和电竞
        if (this.get_is_mix) {    //是串关
          this.remove_item2(odd_field, bet_item, bet_list);

          // 电竞有的盘口不支持串关，需要弹框提示
          if (this.get_menu_type == 3000 && !this.get_mids.includes(match.mid)) {
            let _hipo = _.get(hps, '[0].hl[0].hipo')
            if (_hipo != 1) {
              this.set_toast({ 'txt': i18n.t('bet.err_msg12') })
              return
            }
          }

          bet_item[index1] = {
            cs: _.cloneDeep(ol[0]),
            bs: _.cloneDeep(bet_bs),
            mid: bet_bs.mid,
            orderMaxPay: '',
          }
          bet_list.push(odd_item.id_);
          this.set_bet_obj(bet_item);
          this.set_bet_list(bet_list)
          if(this.get_bet_list.length == bet_list.length){
            this.calc_mixcount(false)
          }
        } else {    //是单关
          let bet_item = {};
          bet_item[index1] = {
            cs: _.cloneDeep(ol[0]),
            bs: _.cloneDeep(bet_bs),
            mid: bet_bs.mid,
            orderMaxPay: '',
          }
          this.set_bet_obj(bet_item);
          this.set_bet_list([odd_item.id_]);
          this.set_bet_status(1);
        }
      } else {
        let bet_list_len1 = bet_list.length
        if (this.get_is_combine) {
          this.remove_item3(odd_item, bet_item, bet_list);
        } else {
          if (this.get_is_mix) {
            this.remove_item2(odd_field, bet_item, bet_list);
          } else {
            bet_item = {}
            bet_list = []
          }
        }

        bet_item[index1] = {
          cs: _.cloneDeep(ol[0]),
          bs: _.cloneDeep(bet_bs),
          mid: bet_bs.mid,
          orderMaxPay: '',
        }
        bet_list.push(odd_item.id_);
        this.set_bet_list(bet_list);
        this.set_bet_obj(bet_item);
        if(this.get_bet_list.length == bet_list.length){
          this.calc_mixcount(false)
        }
        let bet_list_len2 = bet_list.length
        if (bet_list_len2 == 1 && bet_list_len1 == 0) {
          this.set_bet_status(1)
        }
      }

      this.zhuge_track_bet_click()
    },
    /**
     *@description 虚拟体育点击押注小方块
     *@param {Object} match 组合的数据
     *@param {Object} odd_field 组合的数据
     *@param {Object} odd_item 组合的数据
     *@return {Undefined} undefined
     */
    bet_click3(match, odd_field, odd_item) {

      if (this.get_bet_list.includes(odd_item.oid)) {
        this.remove_item(odd_item.oid);
        return;
      }

      // 投注项数量已达上限
      let _maxunm = _.get(UserCtr.user_info, 'configVO.maxSeriesNum', 10)
      if (this.get_bet_list.length >= _maxunm) {
        this.set_toast({ 'txt': i18n.t('bet.match_max2') });
        return;
      }

      match = _.cloneDeep(match);
      odd_field = _.cloneDeep(odd_field);
      odd_item = _.cloneDeep(odd_item);
      match.oid = odd_item.oid;

      //value1和value2是投注弹框左上角的展示值
      let hps, ol, bet_bs = { value1: '', value2: '' }, index1 = match.oid.toString();   //id_是坑位hn或者oid
      if (match.hps.length > 1) {
        hps = match.hps.filter(item => {
          return item.hpid == odd_field.hpid;
        })
      } else {
        hps = match.hps;
      }

      let item_index;
      for (let item of hps[0].hl) {
        item.ol.forEach(item_ => {
          if (item_.oid == odd_item.oid) {   //数据提取
            bet_bs.value2 = item_.on;
            ol = [item_];
            item_index = hps[0].hl.indexOf(item);
          }
        })
      }

      if (this.$route.name == 'virtual_sports_details') {    //在详情页
        //参照pc,详情页玩法id  3-全场让球赛果 平局玩法  特殊对应取otv字段
        if (hps[0].hpid == '20003' && ol[0].ot == 'X' || hps[0].hpid == '20024') {
          bet_bs.value1 = ol[0].otv;
          bet_bs.value2 = '';
        } else {
          bet_bs.value1 = ol[0].ott;
          bet_bs.value2 = ol[0].on;
        }
      } else {    //在列表页
        if ([i18n.t("bet.home_win"), i18n.t("bet.away_win")].includes(bet_bs.value2)) bet_bs.value2 = "";

        if (ol[0].ots == 'T1') {
          bet_bs.value1 = match.teams[0];
        } else if (ol[0].ots == 'T2') {
          bet_bs.value1 = match.teams[1];
        }

        let flag = ['2', '38', '173', '20002', '20044', '20046'].includes(hps[0].hpid)
        if (flag) bet_bs.value1 = '';
      }

      Object.assign(hps[0].hl[item_index], { ol });
      Object.assign(hps[0], { "hl": [hps[0].hl[item_index]] });
      Object.assign(bet_bs, match, { hps });

      if (this.get_is_mix) {    //是串关
        let bet_item = _.cloneDeep(this.get_bet_obj)
        let bet_list = _.cloneDeep(this.get_bet_list);

        this.remove_item2(odd_field, bet_item, bet_list);

        bet_item[index1] = {
          cs: _.cloneDeep(ol[0]),
          bs: _.cloneDeep(bet_bs),
          mid: bet_bs.mid,
          orderMaxPay: ''
        }

        bet_list.push(odd_item.oid);

        this.set_bet_obj(bet_item);
        this.set_bet_list(bet_list);
        if(this.get_bet_list.length == bet_list.length){
          this.calc_mixcount(false)
        }
      } else {    //单关
        let bet_item = {};
        bet_item[index1] = {
          cs: _.cloneDeep(ol[0]),
          bs: _.cloneDeep(bet_bs),
          mid: bet_bs.mid,
          orderMaxPay: ''
        }

        this.set_bet_obj(bet_item);
        this.set_bet_list([odd_item.oid]);
        this.set_bet_status(1);
      }

      this.zhuge_track_bet_click()
    },
    /**
     *@description 冠军玩法 点击押注小方块
     *@param {Object} match 组合的数据
     *@param {Object} odd_field 组合的数据
     *@param {Object} odd_item 组合的数据
     *@return {Undefined} undefined
     */
    bet_click2(match, hp, ol_item) {
      match = _.cloneDeep(match)
      hp = _.cloneDeep(hp)
      ol_item = _.cloneDeep(ol_item)

      let hps = [], index1 = ol_item.oid;

      match.value2 = ol_item.on;
      match.id_ = index1;

      Object.assign(hp, { ol: [ol_item] })

      hps.push({ hl: [hp], hsw: hp.hsw, mid: hp.mid, hpid: hp.hpid })
      Object.assign(match, { hps })

      let bet_item = {};
      bet_item[index1] = {
        bs: match,
        cs: ol_item,
        orderMaxPay: '',
      }

      this.set_bet_obj(bet_item);
      this.set_bet_list([index1]);
      this.set_bet_status(1);

      this.zhuge_track_bet_click()
    },
    /**
     *@description 投注项点击埋点跟踪
     */
    zhuge_track_bet_click() {
      let routeName = this.$route.name, eventLabel = '';
      if (['category', 'virtual_sports_details'].includes(routeName)) {
        eventLabel = '详情'
      } else if ('match_result' == routeName) {
        eventLabel = '赛果精选赛事'
      } else if ('home' == routeName) {
        eventLabel = '热门赛事'
      } else {
        eventLabel = '列表'
      }
      if (eventLabel) {
        this.$utils.zhuge_event_send('H5_列表页_投注点击分类', UserCtr.user_info, {'详情区域': eventLabel});
      }
    },
    /**
     * 获取预约投注限额合最新盘口赔率信息
     */
    fetch_pre_limit_money_and_odd_info() {
      //判断是否有预约投注单
      this.fetch_limit_money_params(1)
        .then(res => {
          return api_betting.query_pre_bet_amount(res)
        })
        .then(res => {
          let res2 = {
            code: res.code,
            data: res.data.betAmountInfo,
            data2: res.data.latestMarketInfo
          }
          this.fetch_pre_limit_money(res2)
        })
    },
    // 针对PA操盘的赛事，将获取限额接口和获取最新盘口赔率信息接口合并到一起调用，暂时不考虑冠军、电竞和虚拟赛事
    fetch_limit_money_and_odd_info() {
      this.fetch_limit_money_params(1)
        .then(res => {
          return api_betting.query_bet_amount(res)
        })
        .then(res => {
          if (res && res.data) {
            let res1 = {
              code: res.code,
              data: res.data.latestMarketInfo
            }
            let res2 = {
              code: res.code,
              data: res.data.betAmountInfo
            }
            res1.data && this.check_odds_beforebet(res1)
            res2.data && this.fetch_limit_money(res2)
          }
        }).catch(err => {
          console.error(err)
        })
    },
    /**
     *@description 是否存在PA操盘的赛事
     *@return {Boolean} flag
     */
    is_exist_pa_operate() {
      let flag = false;
      _.forIn(this.get_bet_obj, function(item) {
        if (item.bs.mprmc == 'PA') {
          flag = true
        }
      });
      return flag
    },

    /**
     *@description 投注前拉取最新的盘口赔率状态,应对socket推送不及时
     *@param {Object} res_obj 有值时表示是从合并的接口调用的
     *@return {Undefined} undefined
     */
    check_odds_beforebet(res_obj) {
      if (this.get_menu_type == 3000 || this.get_bet_list.length == 0) {   // 电竞不需要调用这个接口
        return Promise.resolve()
      }

      //  获取参数
      let param = {
        idList: []
      };
      let flag_map = [];  //接口返回的坑位值 placeNum 不准确 要先把有坑位值的 mid 存进去，再判断后面的 id_ 的赋值

      this.get_bet_list.forEach(item => {
        if (this.get_bet_obj[item]) {
          let bet_obj = this.get_bet_obj[item].bs;
          let temp = {
            marketId: bet_obj.hps[0].hl[0].hid,
            matchInfoId: bet_obj.mid,
            sportId: bet_obj.csid,
            oddsId: this.get_bet_obj[item].cs.oid,
            playId: bet_obj.hps[0].hpid,  //玩法id
            oddsType: bet_obj.hps[0].hl[0].ol[0].ot,  //投注项类型ot
            placeNum: bet_obj.hps[0].hl[0].hn,//坑位hn
            matchType: (function (vm) {  //赛事类型标识
              if (vm.get_is_champion(vm)) {return 3}; //冠军
              if (vm.get_menu_type == 900) {return 4}; //虚拟赛事
              if (vm.get_menu_type == 3000) {return 5}; // 电竞
              if (bet_obj.hps[0].hl[0].hmt == 1) {return 1};  //早盘赛事
              if (bet_obj.hps[0].hl[0].hmt == 0) {return 2};  //滚球赛事
            })()
          }
          bet_obj.hps[0].hl[0].hn && flag_map.push(bet_obj.mid)
          param.idList.push(temp);
        }
      })
      if (res_obj) {
        result_handle.bind()(res_obj)
        return Promise.resolve()
      }

      function result_handle(res) {

        let code = _.get(res, "code");
        let data = _.get(res, "data");

        if (code == 200 && data.length) {
          let index = 0;
          for (const item of data) {
            if (!Array.isArray(item.marketList)) {return};

            //数据组装
            let _c106 = {
              cd: {
                hls: [],
                mid: item.matchInfoId
              },
              cmd: "C106",
              flag_: true,
              route_: this.$route.name,
            }

            let marketlistarr = item.marketList.filter(val => {
              return val.marketOddsList && val.marketOddsList.length
            })

            for (const item2 of marketlistarr) {
              let _hls = {
                hid: item2.id,
                hn: item2.placeNum,
                hpid: item.playId,
                hps: item2.score,
                hs: item2.status,
                hv: item2.marketValue,
                mid: item.matchInfoId,
                marketType: item2.marketType,
                ol: [],
              }
              for (const ol of item2.marketOddsList) {
                let _ol = {
                  id_: (item.matchInfoId && (item.chpid || item.playId) && ol.oddsType && item2.placeNum && flag_map.includes(item.matchInfoId)
                    ? `${item.matchInfoId}_${item.chpid || item.playId}_${ol.oddsType}_${item2.placeNum}`
                    : ol.id),
                  oid: ol.id,
                  os: ol.oddsStatus,
                  ot: ol.oddsType,
                  ov: ol.oddsValue,
                  on: ol.playOptions,
                  hid: item2.id,
                  dfrom: 'check_odds_beforebet',
                }
                _hls.ol.push(_ol)
              }
              _c106.cd.hls.push(_hls)
            }
            this.set_http_update({pre_switch:item.pendingOrderStatus,pre_key:this.get_bet_list[index]})
            index++
            if (this.get_bet_status == 0) {
              //投注框收起状态 专用于对应英文状态跟新玩法名称、主队名和客队名
              this.set_http_update({ hpn: item.playName, mid: item.matchInfoId, man: item.away, mhn: item.home })
            } else {
              window.ws && WsRev.wsRevMsg(window.ws, _c106);
              this.set_http_update({ mmp: item.matchPeriodId, mid: item.matchInfoId, mhs: item.matchHandicapStatus })
            }
          }

          // this.synchronize_odds();
        }
      }

      let result_promise = null;

      if (_.get(param, 'idList.length')) {
        result_promise = new Promise((resolve) => {
          api_betting.query_last_market_info(param).then((res) => {
            result_handle.bind()(res)
            resolve()
          })
        })
      } else {
        result_promise = Promise.resolve()
      }

      return result_promise
    },
    /**
     * 同步获取到的最新赔率
     */
    synchronize_odds() {
      let data_dict = {},
          hl_dict = {};

      Object.keys(this.get_bet_obj).forEach(oid => {
        let cs_obj = this.get_bet_obj[oid].cs;

        let hid = cs_obj.hid;
        if (!(hid in hl_dict)) {
          hl_dict[hid] = {};
        }

        if (!hl_dict[hid].ol) hl_dict[hid].ol = [];

        hl_dict[hid].ol.push({
          oid: cs_obj.oid,
          ov: cs_obj.ov,
          on: cs_obj.on,
          onb: cs_obj.onb,
          os: cs_obj.os,
          ot: cs_obj.ot,
          otd: cs_obj.otd,
          ots: cs_obj.ots,
        });
        hl_dict[hid].hs = cs_obj.hs;

        let mid = this.get_bet_obj[oid].mid;
        hl_dict[hid].mid = mid;

        if (!(mid in data_dict)) {
          data_dict[mid] = {};
        }

        if (!data_dict[mid].hls) data_dict[mid].hls = [];
      });

      Object.keys(hl_dict).forEach(hid => {
        let mid = hl_dict[hid].mid;
        data_dict[mid].mid = mid;
        data_dict[mid].hls = [hl_dict[hid]];
      });

      useMittEmit(MITT_TYPES.EMIT_BET_ODD_SYNCHRONIZE, data_dict);
    },
    /**
     *@description 用于为 fetch_limit_money 和 fetch_limit_money_and_odd_info 方法获取参数
     *@param {Number} flag 有值的时候代表是用于 fetch_limit_money_and_odd_info 的参数获取
     *@return {Undefined} undefined
     */
    fetch_limit_money_params(flag) {
      let parm_obj = {
        orderMaxBetMoney: []
      };
      let list = this.get_bet_list,
          obj = this.get_bet_obj;

      list.forEach(item => {
        let param = {}, bet_obj = obj[item].bs
        // 是否开启 多单关投注模式，1：是 0 否
        param.openMiltSingle = this.get_is_combine && !this.get_is_mix ? 1 : 0;
        //设备类型
        param.deviceType = '1';
        //盘口id
        param.marketId = bet_obj.hps[0].hl[0].hid;
        //赛事id
        param.matchId = bet_obj.mid;
        //比赛进程id
        param.matchProcessId = bet_obj.mmp;

        //最终赔率
        if (this.get_is_champion()) {
          param.oddsFinally = this.compute_value_by_cur_odd_type(_.get(bet_obj,'hps[0].hl[0].ol[0].ov') / 100000, null, [], 'no_format', bet_obj.csid);   //冠军,不用转换赔率
        } else {
          param.oddsFinally = this.compute_value_by_cur_odd_type(_.get(bet_obj,'hps[0].hl[0].ol[0].ov') / 100000, null, _.get(bet_obj,'hps[0].hsw'), 'no_format', bet_obj.csid);
        }

        //赔率
        param.oddsValue = _.get(bet_obj,'hps[0].hl[0].ol[0].ov')
        //玩法ID
        param.playId =  _.get(bet_obj,'hps[0].hpid') || 0
        //投注项ID
        param.playOptionId = _.get(bet_obj,'hps[0].hl[0].ol[0].oid')
        //投注类型
        param.playOptions = _.get(bet_obj,'hps[0].hl[0].ol[0].ot')
        //基准分
        param.scoreBenchmark = this.$options.filters.calc_bifen(bet_obj, 2);
        //串关类型 1:单关，串关数字算法：M串N，M*100，与N拼接，如3串4 ==> 3004
        param.seriesType = this.get_mix_bet_flag ? this.get_s_count_data[this.get_s_count_data.length - 1].id : '1';
        //球类ID
        param.sportId = bet_obj.csid;
        //商户ID
        param.tenantId = '1';
        //用户id 未登录不填，登录必填
        param.userId = UserCtr.user_info ? UserCtr.user_info.userId : "";
        //联赛级别（风控使用）
        param.tournamentLevel = bet_obj.tlev;
        //联赛id（风控使用）
        param.tournamentId = bet_obj.tid;
        //数据来源（风控使用）
        param.dataSource = bet_obj.hps[0].hl[0].ol[0].cds;_.get(bet_obj,'hps[0].hl[0].ol[0].cds')

        const temp_hmt = _.get(bet_obj,'hps[0].hl[0].hmt')
        //赛事类型标识
        if (temp_hmt == 1) {
          param.matchType = 1;   //早盘赛事
        }
        if (temp_hmt == 0) {
          param.matchType = 2;   //滚球赛事
        }
        if (this.get_is_champion()) {
          param.matchType = 3;   //冠军
        }
        if (this.get_menu_type == 900) {
          param.matchType = 4;   //虚拟赛事
          delete param.matchProcessId;
        }
        if (this.get_menu_type == 3000) {
          param.matchType = 5;   // 电竞
          delete param.matchProcessId;
        }
        param.placeNum = flag ? bet_obj.hps[0].hl[0].hn : undefined

        parm_obj.orderMaxBetMoney.push(param);
      })

      return parm_obj.orderMaxBetMoney.length ? Promise.resolve(parm_obj) : Promise.reject('参数为空')
    },
    /**
     *@description 获取预约投注限额信息
     *@param {Object} res_obj 预约限额信息
     */
    fetch_pre_limit_money(res_obj) {
      if (this.get_bet_list.length == 0) {return}

      if (res_obj) {
        result_handle.bind()(res_obj)
        return
      }

      function result_handle(res) {
        if (!_.get(res, 'data[0]') || res.code != 200) {return}
        if (!this.get_mix_bet_flag) {  // 只有单关才支持
          this.set_http_update({ money_obj: res.data })
          this.set_pre_market_data(res.data2)
        }
      }
    },
    /**
     *@description 获取押注最大最小金额,除了用户id，其他都是必传字段
     *@param {Object} res_obj 有值时表示是从合并的接口调用的
     */
    fetch_limit_money(res_obj) {
      if (this.get_bet_list.length == 0) {return}

      if (res_obj) {
        result_handle.bind()(res_obj)
        return
      }

      function result_handle(res) {

        if (!_.get(res, 'data[0]') || res.code != 200) {return}

        if (this.get_mix_bet_flag) {  // 串关
          let S = _.cloneDeep(this.get_s_count_data);
          S.forEach(item => {
            res.data.forEach(item2 => {
              if (item.id == item2.type) {
                item.minBet = item2.minBet;
                item.orderMaxPay = item2.orderMaxPay;
              }
            })
          })
          this.set_s_count_data(S);
        } else {  // 单关
          this.set_http_update({ money_obj: res.data })
        }
      }

      this.fetch_limit_money_params()
        .then(api_betting.post_getBetMinAndMaxMoney)
        .then(result_handle.bind())
        .catch(err => {
          console.error('fetch_limit_money', err)
        })
    },
    /**
     *@description 提交押注订单
     *@param {String} money 单注的投注金额
     *@param {Number} full_bet 单关是否满额投注，1：是，0：否
     *@param {Function} callbackfn 回调函数
     *@return {Undefined} undefined
     */
    submit_betlist(callbackfn) {

      if (!this.get_bet_list.length) {
        return
      };

      let param = {};
      //币种
      param.currencyCode = 'CNY';
      //设备imei码，只有手机有，没有不添加
      param.deviceImei = '';
      //设备类型 1是h5
      param.deviceType = '1';
      //商户id
      param.tenantId = 1;
      // 是否开启 多单关投注模式，1：是 0 否
      param.openMiltSingle = this.get_is_combine && !this.get_is_mix ? 1 : 0;
      //用户id
      param.userId = UserCtr.user_info ? UserCtr.user_info.userId : "";
      // 设置注单集合列表数组 seriesOrders
      param.seriesOrders = [];
      // 浏览器指纹id
      param.fpId = localStorage.fingerprint;

      if (this.get_mix_bet_flag) {   // 串关
        this.get_s_count_data.forEach(item => {
          if (item.money > 0) {
            param.seriesOrders.push({
              seriesSum: item.count,   // 串关数量
              seriesType: item.id,   // 串关值
              fullBet: item.fullBet,   // 是否满额投注，1：是，0：否
              orderDetailList: this.fetch_orderDetailList(item.money)
            });
          }
        })
      } else {    // 单关
        //判断是否有预约投注单
        const has_pre = _.findKey(this.get_bet_obj, function(o) {
          return o.show_pre
        })
        let is_ok_odds = true//是否符合赔率条件或盘口条件
        for (const [name, value] of Object.entries(this.get_bet_obj)) {
          // 单关多注（单关一个投注项的流程不会走到这里）锁盘的投注项不提交
          let _locked = (_.get(value, 'bs.hps[0].hl[0].hs') == 11 || _.get(value, 'bs.mhs') == 11) && this.get_bet_list.length > 1
          if (value.money > 0 && !_locked) {
            if(has_pre){
              if(has_pre == name) {
                const orderDetailListData = this.fetch_orderDetailList(value.money, name,has_pre)
                if(!orderDetailListData){
                  is_ok_odds = false
                }
                param.seriesOrders.push({
                  seriesSum: 1, // 串关数量
                  seriesType: 1, // 串关值
                  fullBet: value.full_bet, // 是否满额投注，1：是，0：否
                  orderDetailList: orderDetailListData
                })
              }
            }else{
              param.seriesOrders.push({
                seriesSum: 1,
                seriesType: 1,
                fullBet: value.full_bet,
                orderDetailList: this.fetch_orderDetailList(value.money, name)
              });
            }
          }
        }
        if(!is_ok_odds){
          return
        }
        if(has_pre){
          param.preBet = 1
        }
      }
      this.set_bet_status(2);
      let http_bet = api_betting.post_submit_bet_list;
      http_bet(param).then(res => {
        let code = _.get(res, "code"),
            msg = _.get(res, "msg"),
            data = _.get(res, "data", "");

        if (callbackfn) callbackfn(code, data, msg);
      })
    },
    /**
     *@description 获取押注详情数据对象
     *@param {String} money 金额
     *@param {String} name 单关时需要传
     *@return {Object} 押注详情数据对象
     */
    fetch_orderDetailList(money, name, has_pre) {
      let temp_list = [];
      for (const item of this.get_bet_list) {
        if (name && item != name) {
          continue
        }

        let temp = {},
        bet_obj =  _.get(this.get_bet_obj[item],'bs'),
        bet_obj_item = this.get_bet_obj[item]
        const ol_obj = _.get(bet_obj,'hps[0].hl[0].ol[0]') || {}
        const hl_obj = _.get(bet_obj,'hps[0].hl[0]') || {}
        const hps_obj = _.get(bet_obj,'hps[0]') || {}
        const temp_on = ol_obj.on || ''
        if(has_pre){//当为预约投注单的时候得处理
          //找出当前玩法所有的盘口值
          //坑位（盘口位置，1：表示主盘，2：表示第一副盘）
          temp.placeNum = hl_obj.hn
          const market_list = this.get_pre_market_data.filter((o)=>{
            return o.matchInfoId == hps_obj.mid && o.playId == hps_obj.hpid
          })
          const market_obj = market_list.length>0 ? market_list[0] : {}
          let pre_market = bet_obj_item.pre_market_value + ''
          //篮球，大小盘口值小于0
          if(bet_obj.csid == 2 && ['Over','Under'].includes(ol_obj.ot)){
            let temp_bet_obj = _.cloneDeep(this.get_bet_obj)
            if(pre_market.indexOf('.') > -1 && !pre_market.split('.')[1]){
              pre_market = pre_market.split('.')[0]
            }
            if(pre_market < 0.5){
              temp_bet_obj[item].pre_market_value = '0.5'
              temp_bet_obj[item].market_tips = 1
              this.set_bet_obj(temp_bet_obj)
              return false
            }
          }
          //是否显示盘口对应的玩法id集合
          const market_flag_list= bet_obj.csid == 1 ? [
            '2','3','4','10','11','18','19','26','33','34','71','87','88','97','98','113','114','115',
            '116','121','122','123','124','127','128','130','134','143','232','233','269','270',
            '69','306','307','308','309','314','315','316','317','324','325','327','328','331','332','334','335'
          ] : [
            '2','4','10','11','18','19','26','38','39','45','46','51','52','57','58',
            '63','64','87','88','97','98','143','145','146','198','199','220','221','271','272'
          ]
          //判断是否有相同得盘口
          let squarl_market = {
            flag : false, //是否有相同盘口
            has_market: false,//是否有盘口
            value: 0
          }
          //有盘口值的处理
          if(market_flag_list.includes(hps_obj.hpid)){
            squarl_market.has_market = true
            //盘口值
            temp.marketValue = pre_market
            //玩法投注项名称
            if(ol_obj.otv){//在详情页
              temp.playOptionName = ol_obj.ott + pre_market
            }else{
              if(['Over','Under'].includes(ol_obj.ot)){//大小类玩法需要拼接大小字符
                temp.playOptionName = temp_on.split(' ')[0] + ' ' + pre_market
              }else if(temp_on.includes('+') || temp_on.includes('-') || temp_on == 0){
                if(ol_obj.ots == 'T1'){//主队
                  temp.playOptionName = bet_obj.mhn +' ' +  pre_market
                }else{//客队
                  temp.playOptionName = bet_obj.man + ' ' +  pre_market
                }
              }
            }
            //所有盘口集合
            let tempList = market_obj.marketList || []
            //找到当前投注项对应的玩法数据
            const FOOTBALL_PLAY_LET_BALL = bet_obj.csid == 1 ? [
              '3', // 全场让球胜平负
              '4', // 全场让球
              '19', // 上半场让球
              '33', // 15分钟进球-让球({a}-{b})
              '69', // 上半场让球胜平负
              '71', // 下半场让球胜平负
              '113',// 角球让球盘
              '121', // 上半场角球让球
              '128', // 加时赛上半场
              '130', // 加时赛-上半场让球
              '143', // 下半场让球
              '232', // 15分钟角球让球
              '269', // 全场让球
              '270', // 半场让球
              '334' // 点球大战-让球
            ] : [
              '4',
              '19',
              '39',
              '46',
              '52',
              '58',
              '64',
              '143'
            ]
            if(tempList.length> 0){
              tempList.map((item)=>{
                  //找到当前投注项所对应的主队客队位置
                  const ot_obj = _.find(item.marketOddsList, function(o) {
                    return o.oddsType == ol_obj.ot
                  })
                  if(!FOOTBALL_PLAY_LET_BALL.includes(hps_obj.hpid)){//大小比较方式
                    if(item.marketValue == pre_market && ot_obj){
                      //盘口id
                      temp.marketId = item.id;
                      //投注项id
                      temp.playOptionsId = ot_obj.id
                      //坑位
                      temp.placeNum = item.placeNum
                      squarl_market.flag = true
                      squarl_market.value = ot_obj.oddsValue
                    }
                  }else{//让球比较方式
                    if(ot_obj && ot_obj.playOptions == pre_market){
                      //盘口id
                      temp.marketId = item.id;
                      //投注项id
                      temp.playOptionsId = ot_obj.id
                      //坑位
                      temp.placeNum = item.placeNum
                      squarl_market.flag = true
                      squarl_market.value = ot_obj.oddsValue
                    }
                  }
              })
            }else{//只有一个盘口
              temp.marketId = ''
              temp.playOptionsId = ''
              if(FOOTBALL_PLAY_LET_BALL.includes(hps_obj.hpid)){//让球比较
                if(ol_obj.on == pre_market){
                  temp.playOptionsId = ol_obj.oid;
                  temp.marketId = hl_obj.hid
                }
              }else{
                if(hl_obj.hv == pre_market){
                  temp.playOptionsId = ol_obj.oid
                  temp.marketId =  hl_obj.hid
                }
              }
            }
          }else{
            //无盘口值
            temp.marketId = hl_obj.hid
            temp.playOptionsId = ol_obj.oid;
            if(ol_obj.otv){//在详情页
              temp.playOptionName =ol_obj.ott + ol_obj.on
            }else{//在列表页面，独赢
              if(!hl_obj.hv && hl_obj.hv != 0){
                  if(ol_obj.ots == 'T1'){
                    temp.playOptionName = bet_obj.mhn
                  }else if(ol_obj.ots == 'T2'){
                    temp.playOptionName = bet_obj.man
                  }else{
                    temp.playOptionName = ol_obj.on
                  }
              }
            }
          }
          //赔率
          temp.odds = bet_obj_item.pre_odds
          let temp_bet_obj = _.cloneDeep(this.get_bet_obj)
          //判断预约赔率是否大于调整盘口后的最低赔率
          if(squarl_market.flag){
            if(temp.odds < squarl_market.value){//有相同盘口的情况
              temp_bet_obj[item].pre_odds = squarl_market.value
              this.set_bet_obj(temp_bet_obj)
              return false
            }
          }else{
            if(squarl_market.has_market){//有盘口值，无相同盘口的情况
              if(temp.odds < 101000){
                temp_bet_obj[item].pre_odds = 101000
                this.set_bet_obj(temp_bet_obj)
                return false
              }
            }else{//无盘口值，只有赔率的情况
              if(temp.odds < ol_obj.ov){
                temp_bet_obj[item].pre_odds = ol_obj.ov
                this.set_bet_obj(temp_bet_obj)
                return false
              }
            }
          }
          //最终赔率
          temp.oddFinally = this.compute_value_by_cur_odd_type(bet_obj_item.pre_odds/100000, null, bet_obj.hps[0].hsw, 'no_format', bet_obj.csid);
        }else{
          temp.odds = ol_obj.ov;
          temp.marketId = hl_obj.hid
          temp.playOptionsId = ol_obj.oid;
          temp.playOptionName = ol_obj.on;
          //坑位（盘口位置，1：表示主盘，2：表示第一副盘）
          temp.placeNum = hl_obj.hn;
          //最终赔率
          if (this.get_is_champion()) {
            temp.oddFinally = this.compute_value_by_cur_odd_type(ol_obj.ov / 100000, null, [], 'no_format', bet_obj.csid);   //冠军的时候，投注传值不用转换赔率
          } else {
            temp.oddFinally = this.compute_value_by_cur_odd_type(ol_obj.ov / 100000, null, hps_obj.hsw, 'no_format', bet_obj.csid);
          }
        }
        //投注金额
        temp.betAmount = String(money);
        //最终盘口类型(冠军玩法固定传 EU)
        let oddsTable = { EU: '1', HK: '2', MY: '3', GB: '4', US: '5', ID: '6', };
        temp.marketTypeFinally = hps_obj.hsw && !hps_obj.hsw.includes(oddsTable[BetData.cur_odd]) || this.get_is_champion() ? "EU" : BetData.cur_odd;
        //赛事id
        temp.matchId = bet_obj.mid;
        //对阵信息
        temp.matchInfo = bet_obj.mhn + " v " + bet_obj.man;
        //玩法名称  hpn, hpid, csid
        temp.playName = bet_obj.hps[0].hpnb || bet_obj.hps[0].hpn;
        //球类名称
        temp.sportName = bet_obj.csna ? bet_obj.csna : i18n.t('sport.football');
        //赛事名称
        temp.matchName = bet_obj.tn;

        //玩法id
        temp.playId =hps_obj.hpid || 0;
        //投注类型
        temp.playOptions = ol_obj.ot;
        //基准分(比分)
        temp.scoreBenchmark = this.$options.filters.calc_bifen(bet_obj, 2);
        //球类id
        temp.sportId = bet_obj.csid;
        //联赛id
        temp.tournamentId = bet_obj.tid;
        //联赛等级（风控使用）
        temp.tournamentLevel = bet_obj.tlev;
        //数据来源（风控使用）
        temp.dataSource = ol_obj.cds;
        //赛事阶段Id
        temp.matchProcessId = bet_obj.mmp;

        //赛事类型标识
        if (hl_obj.hmt == 1) {
          temp.matchType = 1;   //早盘赛事
        }

        if (hl_obj.hmt == 0) {
          temp.matchType = 2;   //滚球赛事
        }

        if (this.get_is_champion()) {
          temp.matchType = 3;   // 冠军赛事
          temp.matchProcessId = '0';
          temp.matchInfo = bet_obj.seoy;
          temp.matchName = bet_obj.onTn;
        }

        if (this.get_menu_type == 900) {
          temp.matchType = 4;   //虚拟赛事
          delete temp.matchProcessId;
        }

        if ([100, 101, 102, 103, 104].includes(+bet_obj.csid)) { // 电竞
          temp.matchDetailType = temp.matchType; // 只有电竞需要传这个字段
          temp.matchType = 5;
          delete temp.matchProcessId; // 电竞没有阶段只有局
        }

        temp_list.push(temp);
      }
      return temp_list;
    },
    /**
     *@description 串关再次点击删除投注项
     *@param {String} id_ 投注项标识
     *@return {Undefined} undefined
     */
    remove_item(id_) {
      let I = this.get_bet_list.indexOf(id_),
        L = _.cloneDeep(this.get_bet_list),
        O = _.cloneDeep(this.get_bet_obj);

      delete O[id_];

      L.splice(I, 1);

      this.set_bet_list(L);
      this.set_bet_obj(O);
    },
    /**
     *@description 同一个赛事不能选2个投注项
     *@param {Object} odd_field 组合的数据
     *@param {Object} bet_item 组合的数据
     *@param {Array} bet_list 投注项id集合
     *@return {Undefined} undefined
     */
    remove_item2(odd_field, bet_item, bet_list) {
      let id;
      for (let index in bet_item) {
        if (bet_item[index].mid == odd_field.mid) {
          id = bet_item[index].cs.id_ || bet_item[index].cs.oid;
        }
      }

      if (!id) {return};

      delete bet_item[id]

      bet_list.splice(this.get_bet_list.indexOf(id), 1);
    },
    /**
     *@description 同一个盘口不能选2个投注项, 或者当玩法有坑位时，赛事id，玩法id，坑位都一致时不能同时选中2个
     *@param {Object} odd_item 组合的数据
     *@param {Object} bet_item 组合的数据
     *@param {Array} bet_list 投注项id集合
     *@return {Undefined} undefined
     */
    remove_item3(odd_item, bet_item, bet_list) {
      try {
        let mid, hpid, hn, mid2, hpid2, hn2, ot;

        if (odd_item.id_.includes('_')) {
          [mid, hpid, ot, hn] = odd_item.id_.split('_')
        }

        let id;
        for (let index in bet_item) {
          let cs_obj = bet_item[index].cs
          let flag = cs_obj.id_.includes('_'), flag2;

          if (flag) {
            [mid2, hpid2, ot, hn2] = cs_obj.id_.split('_')
            flag2 = mid == mid2 && hpid == hpid2 && hn == hn2
          }

          if ((cs_obj.hid && cs_obj.hid == odd_item.hid) || flag2) {
            id = cs_obj.id_ || cs_obj.oid;
          }
        }

        if (!id) {return};

        delete bet_item[id]

        bet_list.splice(this.get_bet_list.indexOf(id), 1);
      } catch (error) {
        console.error(error)
      }
    },
    /**
     *@description 只保留一个投注项
     *@param {String} val 为 first 时表示只保留第一个，否则只保留最后一个
     */
    remove_item4(val) {
      // 点击取消合并时单关只保留一个投注项
      if (!this.get_is_combine && this.get_bet_list.length > 1) {
        let bet_item = _.cloneDeep(this.get_bet_obj)
        let bet_list = _.cloneDeep(this.get_bet_list);
        let _key = val == 'first' ? bet_list.shift() : bet_list.pop()
        let total = 0

        Object.keys(bet_item).map((key) => {
          if (_key != key) {
            total += (bet_item[key].money || 0) * 1
          }
        })

        if (!_key) {return}

        this.set_money_total(0 - total)
        this.set_bet_list([_key])
        this.set_bet_obj({ [_key]: bet_item[_key] })
      }
    },
    /**
     *@description 计算统计串关数
     *@param {Boolean} flag 为true的时候才调用获取最大最小值的接口
     *@return {Undefined} undefined
     */
    calc_mixcount(flag) {
      let res = this.calc_mixcount_data(this.get_bet_list.length)
      let data = _.get(res, "data");
      let _minunm = _.get(UserCtr.user_info, 'configVO.minSeriesNum', 2)

      if (!data || !data[0]) {return};
      const bet_obj = this.get_bet_obj || {}

      let odds_sum = 1
      for(let keys in bet_obj){  //获取投注项里面的hsw，赔率，球种类型
        const csid = _.get(bet_obj[keys],'bs.csid', '1')  // 赛事类型
        const temp_odds = _.get(bet_obj[keys],'bs.hps[0].hl[0].ol[0].ov', 0)  // 原始赔率
        const temp_odds2 = Number(this.calc_odds(temp_odds / 100000, csid))   // 格式化后的欧赔
        odds_sum = this.$mathjs.multiply(temp_odds2 , odds_sum) // 相乘
      }
      const tempData = _.cloneDeep(data.filter((item)=>{
        return item.type >= _minunm
      }))
      if(tempData.length){

          if(this.get_menu_type == 3000){
            tempData[0].odds = odds_sum.toFixed(3)
          }else{
            tempData[0].odds = odds_sum.toFixed(2)
          }

      }
      this.set_s_count_data(tempData);

      if (flag && tempData.length > 0) {
        this.fetch_limit_money();
      }

      let S = [], O = {};
      data.forEach(item => {
        S.push(item.id);
        O[item.id] = { bs: {}, cs: {} };
        O[item.id].bs = item;
      })
    },
    /**
     * @description: 获取串关数量
     * @param {Number} count 串关数量
     * @return {Array} 串关组合列表
     */
    calc_mixcount_data(count) {
      let ret = chuanguan_map[count] || { "data": [] };

      if (this.get_menu_type == 3000 && count >= 6) {
        ret.data = ret.data.splice(0, ret.data.length - 1)
      }

      return ret;
    },
    /**
     *@description 串关时缓存金额
     *@param {Number} item 下标
     *@param {String} money 金额
     *@param {Number} full_bet 是否满额投注，1：是，0：否
     *@return {Undefined} undefined
     */
    set_s_money(item, money, full_bet) {
      let S = _.cloneDeep(this.get_s_count_data);

      if (S[item]) {
        S[item].money = money;
        S[item].fullBet = full_bet;
      }

      this.set_s_count_data(S)
    },
    /**
     *@description 投注失败后不同的返回码，对应不同的提示
     * 这里的拉接口是指拉取verifyOddsBeforeBet接口！！
     * 拉接口的code码不要强制红字提示，只能给"投注失败"的弹框提示，因为接口返回的赔率盘口可能跟现有选中的投注项是一致的
     *@param {String} code bet的返回code码
     *@param {(Array | Object)} data bet的返回data
     *@param {Function} callbackfn 回调函数
     *@return {Undefined} undefined
     */
    back_msg({ code, data, msg }, callbackfn) {
      // 拉取接口,对应盘口值和赔率变更,点击重新发起投注
      let handicap_odds_check = HANDICAP_ODDS.includes(code);

      // 拉取接口，对应坑位变化，点击重新发起投注
      let handicap_placeholder_check = HANDICAP_PLACEHOLDER.includes(code);

      // 不拉接口，给红字提示, 按钮变成确定，点击确定移除投注项 (8位数的是电竞相关的code码)
      let tips_info1_check = TIPS_INFO1.includes(code);

      // 不拉接口，给红字提示, 点击重新发起投注
      let tips_info2_check = TIPS_INFO2.includes(code);

      // 不拉接口，应对投注项失效的场景，模拟发送C106,不用管C105
      let mock_c105_c106_check = MOCK_C105_C106.includes(code)

      if (mock_c105_c106_check) {
        if (Array.isArray(data)) {
          for (const item of data) {
            if (MOCK_C105_C106.includes(item.code)) {
              let obj = {
                "cd": {
                  "send": "my_self",
                  "hls": [
                    {
                      "hid": item.data.marketId,
                      "hpid": item.data.playId,
                      "hs": 2,
                      "mid": item.data.matchId
                    }
                  ],
                  "mid": item.data.matchId
                },
                "cmd": "C106"
              }

              if (['0400469', '0400480', '0400481'].includes(item.code)) {   //0400469这个code码不需要联动触发C105
                obj.cmd = "C106"
                obj.flag_2 = true
              }

              this.set_bet_status(1);
              window.ws && WsRev.wsRevMsg(window.ws, obj);   //模拟发送C106
            }
          }
        } else {
          // bet 接口响应体返回有误时容错处理
          callbackfn(3, i18n.t(`error_msg_info.0401999.client_msg`));
        }

        return;
      }

      if (tips_info1_check) {
        if (['111111', '0400538', '0400539'].includes(code) && msg) {  //此情况前端直接读取msg展示,信用网专属，暂不考虑国际化
          callbackfn(2, msg)

          if(['0400538', '0400539'].includes(code)){
            // 提示信息展示3秒
            clearTimeout(this.timer)
            this.timer = setTimeout(()=>{
              this.tips_msg = ''
            },3000)
          }
        } else {
          callbackfn(2, i18n.t(`error_msg_info.${code}.client_msg`));
          if (code == '0400455') {  // 提示余额不足时拉接口更新余额
            this.get_balance && this.get_balance()
          }
        }

        return;
      }

      if (tips_info2_check) {
        callbackfn(3, i18n.t(`error_msg_info.${code}.client_msg`));
        //这2个特殊对应，拉限额接口
        if (['0400475', '0400517'].includes(code)) {
          this.fetch_limit_money()
        }

        // 需要拉接口，强制提示语
        if (code == "0400532") {
          this.check_odds_beforebet()
          this.is_0400532 = true
        }

        return;
      }

      if (!(handicap_odds_check || handicap_placeholder_check)) {  // 对应其他没有列出的code码
        callbackfn(2, i18n.t(`error_msg_info.0401999.client_msg`));
        return;
      }

      this.check_odds_beforebet().then(() => {
        if (handicap_odds_check) {
          callbackfn(1, i18n.t(`error_msg_info.${code}.client_msg`));

          // 电竞这2个码特殊对应
          if (!Array.isArray(data) || this.get_menu_type != 3000) {return}

          for (const item of data) {
            if (!["0402027", "0402009"].includes(item.code)) continue

            let obj = {
              "cd": {
                "send": "my_self",
                "mid": item.data.matchId,
                "hls": [
                  {
                    "hid": item.data.marketId,
                    "hpid": item.data.playId,
                    "mid": item.data.matchId,
                    "ol": [
                      {
                        "oid": item.data.playOptionsId,
                        "ov": item.data.odds,
                      }
                    ]
                  }
                ],
              },
              "cmd": "C106",
              flag_: true,
            }

            window.ws && WsRev.wsRevMsg(window.ws, obj);   //模拟发送C106
          }
        }

        if (handicap_placeholder_check) callbackfn(4);
      });
    },
    // 两个浮点数求和
    acc_add(num1, num2) {
      var r1, r2, m;
      try {
        if (num1.toString().split('.')[1]) {
          r1 = num1.toString().split('.')[1].length;
        } else {
          r1 = 0;
        }
        if (num2.toString().split(".")[1]) {
          r2 = num2.toString().split(".")[1].length;
        } else {
          r2 = 0;
        }
      } catch (e) {
        console.error(e);
      }
      m = Math.pow(10, Math.max(r1, r2));
      return Math.round(num1 * m + num2 * m) / m;
    },
    // 两个浮点数相减
    acc_sub(num1, num2 = num1) {
      var r1, r2, m;
      try {
        if (num1.toString().split('.')[1]) {
          r1 = num1.toString().split('.')[1].length;
        } else {
          r1 = 0;
        }
        if (num2.toString().split(".")[1]) {
          r2 = num2.toString().split(".")[1].length;
        } else {
          r2 = 0;
        }
      } catch (err) {
        console.error(err);
      }
      m = Math.pow(10, Math.max(r1, r2));
      let n = (r1 >= r2) ? r1 : r2;
      return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
    },

    /**
     *@description 玩法的主副盘变更时，或者详情页触发 getMatchOddsInfo 接口拉取时,需要更新投注盘口值及赔率
     *@param {Object} new_obj 组合过的列表页接口数据
     *@param {Array} new_obj_2 组合过的详情页数据
     *@return { Undefined} undefined
     */
    update_ol(new_obj, new_obj_2) {
      return
      // 投注框弹起或者锁盘状态才对应更新数据,电竞玩法不需要将列表或者详情页的数据覆盖到投注框
      if (
          !this.get_bet_list.length ||
          this.get_menu_type == 3000 ||
          ![1, 5, 7].includes(+this.get_bet_status)
      ) {
        return
      }

      if (!new_obj) {   //在详情页的话需要处理下数据
        let S = {};
        for (const item of new_obj_2) {
          for (const item2 of item.hl) {
            for (const item3 of item2.ol) {
              let id_ = item2.hn ? `${item.mid}_${item.hpid}_${item3.ot}_${item2.hn}` : item3.oid;
              item3.id_ = id_;
              S[id_] = { ...item3, hid: item2.hid, hs: item2.hs, mid: item.mid };
            }
          }
        }
        new_obj = S;
      }

      for (const [index, item] of Object.entries(this.get_bet_obj)) {
        for (const [index1, item2] of Object.entries(new_obj)) {
          let flag = index == index1;

          if (flag) {
            let obj = {
              "cd": {
                "send": "my_self",
                "hls": [
                  {
                    "hid": item2.hid,
                    "hs": item2.hs,
                    "mid": item2.mid,
                    "ol": [
                      {
                        ...item2,
                        "dfrom": new_obj_2 && 'xiangqing' || 'liebiao'    //数据来自列表还是详情
                      }
                    ]
                  }
                ],
                "mid": item2.mid
              },
              "cmd": "C106"
            };

            window.ws && WsRev.wsRevMsg(window.ws, obj);   //模拟发送C106
          }
        }

      }
    },

    /**
     *@description 计算串关最大可赢金额
     * N串1：赔率相乘再乘以投注金额 ,计算得出的金额再减去本金，再四舍六入五成双,保留2位小数
     * M串N最高可赢: 每个最小单位的n串1，赔率相乘再乘以投注金额,计算得出的金额再减去本金，四舍六入五成双，保留2位小数，每个最小的N串1得出的值再相加
     *@param {String} name 2串1 3串1 3串2···
     *@param {Number} money 投注金额
     *@param {String} csid 赔率需要保留3位小数的话，传csid为 '101' 否则不传值
     *@return {String} max_winmoney
     */
    calc_maxwin_money(name, money, csid) {
      if (isNaN(money) || money == 0) {
        return 0;
      }

      let max_winmoney = 0;
      let bet_list = this.get_bet_list;   //注单投注项id集合

      if (bet_list && bet_list.length && name) {
        let chs = [];
        for (let i = 0; i < bet_list.length; i++) {
          chs.push(i);
        }

        let series_assemble = this.calc_mix_assemble(chs);
        let temp_ = name.split('串');
        let p0 = parseInt(temp_[0]);
        let p1 = parseInt(temp_[1]);
        let seriesList = [];

        if (p0 < p1) {
          seriesList = series_assemble;
        } else {
          let strSum = 0;

          if (p0 == chs.length) {
            strSum = chs.length;
          } else {
            strSum = p0;
          }

          for (let i = 0; i < series_assemble.length; i++) {
            const key = series_assemble[i];
            if (key.length == strSum) {
              seriesList.push(key)
            }
          }
        }

        for (let i = 0; i < seriesList.length; i++) {
          const keys = seriesList[i];
          let odds_value = 1;
          let maxWinMoney = 0;

          for (let j = 0; j < keys.length; j++) {
            const index = keys[j];
            //这里把每个欧赔都做了直接保留两位小数的处理再次相乘
            let index2 = bet_list[index];
            let ov_ = this.get_bet_obj[index2].bs.hps[0].hl[0].ol[0].ov;
            odds_value *= this.calc_odds(parseFloat(ov_) / 100000, csid) * 1;
          }
          //串关所有赔率相乘，直接保留两位小数
          // maxWinMoney = (odds_value * 100000 * money - money * 100000)//押注金额*赔率-押注金额
          // maxWinMoney = maxWinMoney / 100000;
          maxWinMoney = this.$mathjs.subtract(this.$mathjs.multiply(odds_value, money), money)
          if (!isNaN(maxWinMoney)) {
            // 使用4舍6入5成双
            maxWinMoney = this.$options.filters.four_five_six_double(maxWinMoney, 2) * 1;
          }
          max_winmoney = this.acc_add(max_winmoney, maxWinMoney);
        }
      } else {
        console.error('数据异常');
      }

      max_winmoney = this.calc_odds(max_winmoney);
      return max_winmoney;
    },
    /**
     *@description 计算该串关所有组合
     *@param {Array} chs 数组
     *@return {Array} series_list
     */
    calc_mix_assemble(chs) {
      let len = chs.length;

      if (len == 1) {
        return [[0, 1]];
      }

      let nbits = 1 << len;
      let series_list = [];

      for (let i = 0; i < nbits; i++) {
        let t = 0;
        let sb = [];

        for (let j = 0; j < len; j++) {
          t = 1 << j;
          if ((t & i) != 0) // 与运算，同为1时才会是1
          {
            sb.push(chs[j]);
          }
        }

        if (sb.length > 1) {
          series_list.push(sb);
        }
      }

      return series_list;
    },
    /**
     *@description 虚拟体育赛事倒计时小于10秒时，手动触发盘口失效
     *@param {String} hid 盘口id
     *@param {String} mid 赛事id
     *@return {Undefined} undefined
     */
    invalid_c106(hid, mid) {
      let obj = {
        "cd": {
          "send": "my_self",
          "hls": [
            {
              "hid": hid,
              "hs": 1,
            }
          ],
          "mid": mid
        },
        "flag_2": true, //不联动触发C105
        "cmd": "C106",
      };
      window.ws && WsRev.wsRevMsg(window.ws, obj);   //模拟发送C106
    },
    /**
     *@description 依据最低可投金额，给最高投注金额取整
     *@param {String} min_money 最低投注金额
     *@param {String} max_money 原始最高投注金额
     *@return {Number} max_money
     */
    round_money(min_money, max_money) {
      let money_integral,
          integral_len = 0;

      if (min_money && max_money) {
        let min_money_parts = ('' + min_money).split('.');
        integral_len = min_money_parts[0].length; // 最小值整数部分长度

        let max_money_parts = ('' + max_money).split('.');
        money_integral = max_money_parts[0]; // 最大值整数部分

        if (integral_len >= 4) {  //最低投注金额整数位>=4的情况
          integral_len = 4
        }

        if (money_integral.length == integral_len) {  //最低投注金额和最高投注金额整数位相同时，取整减少1位
          integral_len -= 1
        }

        if (money_integral.length > integral_len) {
          let part_int = money_integral.substr(0, money_integral.length - integral_len);
          let str = _.padEnd(part_int, (part_int.length + integral_len), '0');

          if (+str >= +min_money) {  //转化后的最高投注额大于最低投注额时才做处理
            max_money = str
          }
        } else {
          return +max_money
        }
      }

      return +max_money
    },
    /**
     *@description 阻止滑动穿透触摸开始事件
     *@param {Object} evt 事件对象
     */
    touchstart_handle(evt) {
      // 临时记录值，不做视图刷新
      this.per_clientY = evt.changedTouches[0].clientY
    },
    /**
     *@description 阻止滑动穿透触摸移动事件
     *@param {Object} evt 事件对象
     */
    touchmove_handle(evt) {
      let ele = this.scroll_box_ele
      this.direction = evt.changedTouches[0].clientY - this.per_clientY > 0 ? 'down' : 'up'
      this.per_clientY = evt.changedTouches[0].clientY

      if (!ele) {return}

      let ch = ele.clientHeight, sh = ele.scrollHeight, st = ele.scrollTop;

      if (!evt.cancelable) {return}

      if (ch == sh) {
        evt.preventDefault()
        return
      }

      if (this.direction == 'down' && st == 0) {
        evt.preventDefault()
        return
      }

      if (this.direction == 'up' && st + ch - sh > -3) {
        evt.preventDefault()
        return
      }
    },
    /**
     * @description 检查锁盘的投注项数量
     * @param {undefined} undefined
     * @returns {number}  锁盘的投注项数量
     */
    check_locked_num() {
      let num = 0;
      for (const item of Object.values(this.get_bet_obj)) {
        if (_.get(item, 'bs.hps[0].hl[0].hs') == 11 || _.get(item, 'bs.mhs') == 11) {
          num++
        }
      }
      return num
    },
    /**
     *@description 1.玩家投注时，在对阵后增加比分显示。
                   2.本次优化的球种：足球、篮球、乒乓球、排球、棒球。
                   3.只在滚球阶段展示
      *@param {Object} bs_obj 赛事数据对象
     */
    calc_now_score(bs_obj) {
      try {
        if (_.get(bs_obj, 'hps[0].hl[0].hmt') != 0) {return ''}

        let score = ''
        let {
          msc = [], // 比分数组
          csid,     // 球类（赛种）id
          mmp,      // 赛事阶段
          hps       // 基准分SX|x:x
        } = bs_obj
        mmp = Number(mmp)

        let hpid = _.get(bs_obj, 'hps[0].hpid')
        hpid = Number(hpid)

        let str = ''

        let params = {
          csid,
          hpid,
          mmp,
          hps
        }
        switch (csid) {
          case '1': str = this.handle_ball_score(football_score_map[hpid], params); break;      // 足球
          case '2': str = this.handle_ball_score(basketball_score_map[hpid], params); break;    // 篮球
          case '3': str = this.handle_ball_score(baseball_score_map[hpid], params); break;      // 棒球
          case '8': str = this.handle_ball_score(table_tennis_score_map[hpid], params); break;  // 乒乓球
          case '9': str = this.handle_ball_score(volleyball_score_map[hpid], params); break;    // 排球
          default : str = 'S1'; break;                                                           // 默认取S1比分
        }
        if (str) {
          score = msc.toString().match(new RegExp(str + '\\|\\d+:\\d+'))
        }

        if (score && Array.isArray(score)) {
          return '(' + score[0].split('|')[1].replace(':', '-') + ')';
        } else {
          return ''
        }
      } catch (error) {
        console.error(error)
        return ''
      }
    },
    // 比分-阶段对应处理
    handle_ball_score(map_val, params) {
      let { csid, hpid, mmp, hps } = params
      let str = 'S1'

      // 所有比分情况放在该map中维护
      // 注意需将变量类型key放在第一个，若key值相同，取值时会取最后一个匹配
      const map_val_map = new Map([
        [map_val, () => map_val],  // 取玩法对应的比分
        [1, this.handle_target_obj(csid)],   // 动态取比分
        [2, this.handle_target_obj(csid)],   // 动态取比分
        [null, () => ''],                    // 不展示比分
        [undefined, () => 'S1']              // 未匹配到map_val, 则默认取S1
      ])

      const handle_current_map_val = map_val_map.get(map_val)
      if (handle_current_map_val) {
        str = handle_current_map_val({hpid, mmp, hps, map_val})
      } else {
        // map中未匹配到，则默认取S1比分
        str = 'S1'
      }

      return str
    },
    // 目标球类处理映射表
    handle_target_obj(csid) {
      let handle_hpid_mmp_balls

      switch (csid) {
        case '1': handle_hpid_mmp_balls = this.handle_hpid_mmp_football; break;      // 足球
        case '2': handle_hpid_mmp_balls = this.handle_hpid_mmp_basketball; break;    // 篮球
        case '3': handle_hpid_mmp_balls = this.handle_hpid_mmp_baseball; break;      // 棒球
        case '8': handle_hpid_mmp_balls = this.handle_hpid_mmp_table_tennis; break;  // 乒乓球
        case '9': handle_hpid_mmp_balls = this.handle_hpid_mmp_volleyball; break;    // 排球
        default: handle_hpid_mmp_balls = () => 'S1'; break;                          // 默认取S1比分
      }

      return handle_hpid_mmp_balls
    },
    // 部分玩法动态取比分（足球）
    handle_hpid_mmp_football({hpid, mmp, hps}) {
      const S2_S3_hpid_check = [17, 18, 19, 270].includes(hpid)
      const S_other_hpid_check = [32, 33, 34, 231, 232, 233].includes(hpid)
      let str = 'S1'

      if (S2_S3_hpid_check) {
        if (mmp == 6) {
          str = 'S2'
        }
        else if ([31, 7].includes(mmp)) {
          str = 'S3'
        }
      }
      else if (S_other_hpid_check) {
        if(_.get(hps[0],'hSpecial')){//hSpecial有值处理
          str = 'S100' + _.get(hps[0],'hSpecial')
        }else if(!hps[0].hl[0].ol[0].otv){//列表页处理
          str = ''
        }else{
          str = hps[0].hps && hps[0].hps.split("|")[0]
        }
      }

      return str
    },
    // 部分玩法动态取比分（篮球）
    handle_hpid_mmp_basketball({mmp}) {
      let str = 'S1'

      // 动态的根据阶段来取比分 S19、S20、S21、S22
      if (mmp == 13) {
        str = 'S19'
      } else if ([301, 14].includes(mmp)) {
        str = 'S20'
      } else if ([302, 15].includes(mmp)) {
        str = 'S21'
      } else if ([303, 16].includes(mmp)) {
        str = 'S22'
      }

      return str
    },
    // 部分玩法动态取比分（棒球）
    handle_hpid_mmp_baseball({mmp, map_val}) {
      let str = 'S1'

      // 第一局到第十局取不同比分
      if ([401, 402, 421].includes(mmp)) {
        str = ['S120', 'S1200']
      } else if ([403, 404, 422, 423].includes(mmp)) {
        str = ['S121', 'S1210']
      } else if ([405, 406, 424, 425].includes(mmp)) {
        str = ['S122', 'S1220']
      } else if ([407, 408, 426, 427].includes(mmp)) {
        str = ['S123', 'S1230']
      } else if ([409, 410, 428, 429].includes(mmp)) {
        str = ['S124', 'S1240']
      } else if ([411, 412, 430, 431].includes(mmp)) {
        str = ['S125', 'S1250']
      } else if ([413, 414, 432, 433].includes(mmp)) {
        str = ['S126', 'S1260']
      } else if ([415, 416, 434, 435].includes(mmp)) {
        str = ['S127', 'S1270']
      } else if ([417, 418, 436, 437].includes(mmp)) {
        str = ['S128', 'S1280']
      } else if ([419, 420, 438, 439].includes(mmp)) {
        str = ['S129', 'S1290']
      }

      str = map_val == 1 ? str[0] : str[1]

      return str
    },
    // 部分玩法动态取比分（乒乓球）
    handle_hpid_mmp_table_tennis({mmp}) {
      let str = 'S1'

      // 动态的根据阶段来取比分 S19、S20、S21、S22
      if (mmp == 8) {
        str = 'S120'
      } else if ([9, 301].includes(mmp)) {
        str = 'S121'
      } else if ([10, 302].includes(mmp)) {
        str = 'S122'
      } else if ([11, 303].includes(mmp)) {
        str = 'S123'
      } else if ([12, 304].includes(mmp)) {
        str = 'S124'
      } else if ([441, 305].includes(mmp)) {
        str = 'S125'
      } else if ([442, 306].includes(mmp)) {
        str = 'S126'
      }

      return str
    },
    // 部分玩法动态取比分（排球）
    handle_hpid_mmp_volleyball({mmp}) {
      let str = 'S1'

      if (mmp == 8) {
        str = 'S120'
      } else if ([9, 301].includes(mmp)) {
        str = 'S121'
      } else if ([10, 302].includes(mmp)) {
        str = 'S122'
      } else if ([11, 303].includes(mmp)) {
        str = 'S123'
      } else if ([12, 304].includes(mmp)) {
        str = 'S124'
      }

      return str
    },
    /**
     *@description 诸葛埋点跟踪
     */
    zhuge_track_is_combine() {
      this.$utils.zhuge_event_send('H5_合并', UserCtr.user_info);
    }
  },


  filters: {
  
    /**
     *@description 计算显示基准分,只有足球滚球展示基准分
     *@param {Object} obj 比分集合
     *@param {Array} msc 比分集合
     *@param {String} csid 赛种id
     *@param {Number} ms 赛事阶段
     *@param {String} hpid 玩法id
     *@param {String} hps 接口返回的基准分
     *@param {Number} type 返回的字符串格式 1 - '(1-2)'  2 - '1:2'
     *@return {String}
     */
    calc_bifen(obj, type = 1) {
      let { msc, csid, ms } = obj,
          { hpid, hps } = _.get(obj, 'hps[0]', {}),
          flag = msc && msc[0] && csid == 1 && ms,
          S;
      S = String(msc)

      if (!flag) {return ""}

      // 比分正则字符串
      const reg_score_str = '\\|[0-9]+:[0-9]+'

      // 将玩法-比分放在该map中维护
      const hpid_map = new Map([
          ['128', new RegExp('S7' + reg_score_str)],
          ['130', new RegExp('S701' + reg_score_str)],
          ['19', new RegExp('S2' + reg_score_str)],
          ['143', new RegExp('S3' + reg_score_str)],
          ['113', new RegExp('S5' + reg_score_str)],  //角球让球
          ['121', new RegExp('S15' + reg_score_str)], //上半场角球让球
          ['4', new RegExp('S1' + reg_score_str)],
          ['27', new RegExp('S1' + reg_score_str)],
          ['29', new RegExp('S1' + reg_score_str)],
          ['306', new RegExp('S10102' + reg_score_str)],  //罚牌让分
          ['308', new RegExp('S10103' + reg_score_str)],  //上半场罚牌让分
          ['324', new RegExp('S12001' + reg_score_str)],  //黄牌让分
          ['327', new RegExp('S14' + reg_score_str)],   //上半场黄牌让分

      ])

      // 33 - 15分钟进球-让球(6个时间段，取S1001-S1006)   232 - 15分钟角球-让球(6个时间段，取S5001-S5006) 这2个玩法特殊需要动态获取比分
      if (['33', '232','371'].includes(hpid) && hps) {
        let _str = hps.split('|')[0]
        let regexp = new RegExp(_str + reg_score_str)
        S = S.match(regexp);
      } else {
        const current_hpid_reg = hpid_map.get(hpid)

        if (current_hpid_reg) {
          S = S.match(current_hpid_reg)
        }
      }

      try {
        if (S && Array.isArray(S)) {
          if (type == 1) {
            return '(' + S[0].split('|')[1].replace(':', '-') + ')';
          } else {
            return S[0].split('|')[1];
          }
        }
      } catch (error) {
        console.error('error', error)
        return ""
      }
      return "";
    },
  },
  destroyed () {
    clearTimeout(this.timer);
    this.timer = null;
  },
}
