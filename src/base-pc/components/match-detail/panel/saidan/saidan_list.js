/*
 * @Author: 
 * @Date: 2022-08-26 21:41:25
 * @Description: 晒单列表控制类
 */
import {
    // api_common,
    api_betting,
    api_details
    // api_account,
  } from "src/api/index";
import utils from 'src/public/utils/js'
import { mapGetters, mapActions } from "vuex";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
export default {
    name: "saidan_list",
    data() {
        return {
            toast:false,
            show_loading:false,
            
            // class_foter: 'red',//订单状态的颜色类名
            params: {
                page: 1, //当前页
                size: 50, //每页显示大小
                orderStatus: 0, //(0:未结算 1:已结算)
                // timeType: 4, //查询类型	(1:今天 2:昨日 3:七日内 4:一月内)
                // userId: "", //用户ID
                orderBy: 1, // 排序 1投注时间,2 结算时间,3 开赛时间
            },
            bet_records: [
              // {
              //   langCode: 'zh',
              //   orderAmountTotal: 10,
              //   maxWinAmount: 8.5,
              //   outcome: 4,
              //   orderStatus: '0',
              //   orderVOS: [
              //     // {
              //     //   batchNo: "",
              //     //   beginTime: "1661491200000",
              //     //   betResult: 4,
              //     //   betStatus: 1,
              //     //   cancelType: 0,
              //     //   closingTime: null,
              //     //   hs: 2,
              //     //   langCode: "",
              //     //   marketId: "142821815725830405",
              //     //   marketType: "EU",
              //     //   marketValue: "云达不莱梅 -2.5",
              //     //   matchDay: "",
              //     //   matchId: "2161962",
              //     //   matchInfo: "骑士 v 海军(7-10)",
              //     //   matchName: "火箭篮球联盟",
              //     //   matchType: 2,
              //     //   oddFinally: "1.85",
              //     //   oddsValue: "",
              //     //   outrightYear: "",
              //     //   playId: 59,
              //     //   playName: "第3节单/双",
              //     //   playOptions: "Odd",
              //     //   playOptionsId: "140419827125900251",
              //     //   scoreBenchmark: "",
              //     //   settleScore: "第三节比分 22-29",
              //     //   sportId: 2,
              //     //   sportName: "篮球",
              //     //   tournamentId: "16523",
              //     //   tournamentPic: "group1/M00/15/F8/CgURtWJo05-AabewAAANVNZwAwE909.png"
              //     // }
              //   ]
              // },
            ],
            select_arr:[],
            is_clear_unclick:true,
            is_saidan_unclick:true,
            // 注单状态配置
            statusObj: {},
            // 结算状态配置
            bet_result: {},
            current:1,
            is_hasnext: true,
            pageSize: 10,
            hasSharedIdList: [],  // 已经晒单的orderID列表
            tabs:[
              {
                id:1,
                tab_name: i18n_t("common.no_settlement")
              },
              {
                id:2,
                tab_name: i18n_t("common.settlement_")
              },
            ],
            currentIndex: 0
        }
    },
    props: {
      // 晒单时间
      share_order_time: {
        type: Number,
        default: 0
      },
      color: {
        type: String,
        default: "dark", //dark深色  light浅色
      },
    },
    filters: {
        //赔率展示格式化
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
        },
        format_money2(num) {
          try {
            num = (num || 0).toString();
            let result = '';
            let [num1, num2 = '00'] = num.split('.');
            num2 = num2.padEnd(2, '0')
            while (num1.length > 3) {
              result = ',' + num1.slice(-3) + result;
              num1 = num1.slice(0, num1.length - 3);
            }
            if (num1) { num1 = num1 + result; }
            return num1 + '.' + num2;
          } catch (error) {
            console.error(error)
            return ''
          }
      },
        /**
         * @description: 金额格式化带货币符号
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
      },
    created() {
      // 注单状态默认配置
      this.statusObj = {
        '0':  i18n_t("bet.bet_suc"), // 投注成功
        '1':  '', // 已结算
        '2':  i18n_t("bet.betting_cancel"), // 注单无效
        '3':  i18n_t("bet.bet_loading"), // 确认中
        '4':  i18n_t("bet.bet_fail"), // 投注失败
      }
      // 结算状态默认配置
      this.bet_result = {
        '4': i18n_t("bet_record.win"), // '赢'
        '5': i18n_t("bet_record.win_half"), // '赢半'
        '3': i18n_t("bet_record.lose"), // '输'
        '6': i18n_t("bet_record.lose_half"), // '输半'
        '2': i18n_t("bet_record.effective_water_"), // '走水
      }
      this.get_data();
    },
    destroyed() {
        
    },
    watch:{
      'get_match_details_params.mid'(){
          this.clear_handler();
      }
    },
    computed: {
      // ...mapGetters({
      //   lang: "get_lang",
      //   get_chatroom_id:'get_chatroom_id',  // 聊天室ID
      //   get_match_details_params:'get_match_details_params'
      // }),  
    },
    methods: {
      on_switch({index}){
        if(index !==this.currentIndex){
          this.currentIndex = index
          this.get_data()
        }
      },
      // 获取晒单历史接口数据
      async get_data(){
        this.show_loading = true
        this.bet_records = []
      setTimeout(async() => {
        this.show_loading = false
        await api_details.roomBetRecord({orderStatus: this.currentIndex, page:1,size:10, matchId:this.get_match_details_params.mid}).then((res)=>{
          console.log(res)
            let records = lodash.get(res,'data.data.records')
            if(res.data.code == 200){
              this.bet_records = records || []
             // 假如请求被限频了，则再次发起请求
            }else if (res.data.code == '0401038') {
              this.get_data()
            }
          })
      }, 1000);
      },
    /**
    * @description 页面上推分页加载
    * @param {Undefined} undefined
    * @return {Undefined} undefined
    */
    onPull() {
      // console.log('分页处理', this.current);
      let ele = this.$refs.myScroll
      if (!this.is_hasnext) {
        ele.setState(7);  //没有更多
        return;
      }
      ele.setState(4);  //加载中
      api_details.roomBetRecord({ page: this.current + 1, size: this.pageSize, matchId: this.get_match_details_params.mid }).then((res) => {
        ele.setState(5);  //加载完成
        let records = lodash.get(res,'data.data.records')
        if(res.data.code == 200){
          if (records.length < this.pageSize) {
            this.is_hasnext = false
          }
          this.current += 1
          // 合并数据
          let list = lodash.cloneDeep(this.bet_records);
          this.bet_records = lodash.concat(list, records)
        } else {
          ele.setState(7);  //没有更多
        }
      }).catch(err => { console.error(err) });
    },
      /**
       * @点击复制单号
       * @param data：单号
       */
      copy(data) {
        let oInput = document.createElement("input");
        oInput.value = data;
        document.body.appendChild(oInput);
        oInput.select();
        this.toast = true;
        clearTimeout(this.timeout_toast);
        this.timeout_toast = setTimeout(() => {
          this.toast = false;
        }, 1500);
        document.execCommand("Copy");
        oInput.remove();
      },
      //返回订单状态
      calc_text(item) {
        // 已结算
        if(item.orderStatus == 1) {
          let flag = item.seriesType == '1' && item.detailList[0]
          if (flag) {   //单关
            if (+item.preBetAmount > 0) {  // 提前结算的输赢单独一套逻辑算
              let difference = item.detailList[0].backAmount - item.detailList[0].orderAmountTotal
              if (difference > 0) {     // 赢
                return this.bet_result[4]
              } else if (difference < 0) {  // 输
                return this.bet_result[3]
              } else {  // 走水
                return this.bet_result[2]
              }
            }
            let betresult = item.detailList[0].betResult
            if (betresult == 13 || betresult == 16) {
              // '无效'
              return this.statusObj['2']
            }else {
              return this.bet_result ? this.bet_result[betresult] || '' : '';
            }
          }else {  //串关
            // 投注成功
            return this.outcome[this.data.outcome] || this.statusObj['0']
          }
        }else {
          // 非已结算
          return this.statusObj[item.orderStatus]
        }
      },
      // 订单状态颜色
      get_class(item) {
        if(item.orderStatus == 1) {
          // 已结算
          let flag = item.seriesType == '1' && item.detailList[0]
          if(flag) {
            // 单关
            if(item.preBetAmount > 0) {
              // 提前结算
              let difference = item.detailList[0].backAmount - item.detailList[0].orderAmountTotal
              if (difference > 0) {
                // 赢
                return 'color-4'
              }
            }else {
              // 非提前结算
              let betresult = item.detailList[0].betResult
              if([4,5].includes(betresult)) {
                // 赢 赢半
                return 'color-4'
              }
            }
          }else {
            // 串关
            if([4,5].includes(this.data.outcome)) {
              // 赢 赢半
              return 'color-4'
            }
          }
        }else {
          // 其他状态
          return `color-${item.orderStatus}`
        }
      },
      clear_handler(){
        this.$emit('qingkong')
      },
      /**
       * @description: 赛事类型
       * @param {String} type 类型
       * @param {String} lang_code 语种信息
       * @return {String} 需要显示的类型文本
      */
      match_type(type, langCode = this.$i18n.locale) {
        let text = '';
        switch (parseInt(type)) {
          case 1:
            text = i18n_t(`common_lang.${langCode}.bet.morning_session`); //"早盘赛事";
            break;
          case 2:
            text = i18n_t(`common_lang.${langCode}.bet.bet_inplay`); //"滚球盘赛事";
            break;
        }
        return text;
      },
      /**
       * @description: 当前盘口名称 欧洲盘/香港盘
       * @param {undefined} undefined
       * @return {String}
       */
      handicap_name(type, langCode='zh') {
        var res = "";
        if(type && langCode) {
          switch (type) {
            case "EU":
              res = i18n_t(`common_lang.${langCode}.odds.EU`); //"欧洲盘";
              break;
            case "HK":
              res = i18n_t(`common_lang.${langCode}.odds.HK`); //"香港盘";
              break;
            case "US":
              res = i18n_t(`common_lang.${langCode}.odds.US`); //"美式盘";
              break;
            case "ID":
              res = i18n_t(`common_lang.${langCode}.odds.ID`); //"印尼盘";
              break;
            case "MY":
              res = i18n_t(`common_lang.${langCode}.odds.MY`); //"马来盘";
              break;
            case "GB":
              res = i18n_t(`common_lang.${langCode}.odds.GB`); //"英式盘";
              break;
            default:
              res = "";
              break;
          }
        }
        return res;
      },
      /**
       * 输赢状态calss
       * @param betResult: records.orderVOS.betResult
       */
      item_class(betResult) {
        switch (parseInt(betResult)) {
          case 2: //"走水";
            return "lose";
          case 3: //输
            return "lose";
          case 4: //赢
            return "win";
          case 5: //"赢半";
            return "win";
          case 6: //"输半";
            return "lose";
          case 7: //"赛事取消";
            return "lose";
          case 8: //"赛事延期";
            return "lose";
          case 11: //"比赛延迟";
            return "lose";
          case 12: //"比赛中断";
            return "lose";
          case 13: //"无效";
            return "lose";
          case 16:  //"无效";
            return "lose";
          case 15: //"比赛放弃";
            return "lose";
        }
        return "";
      },
      /**
       * 输赢状态
       * @param type: records.orderVOS.betResult
       */
      item_status(type) {
        switch (parseInt(type)) {
          case 2:
            return i18n_t("bet_record.effective_water_"); //"走水";
          case 3:
            return i18n_t("bet_record.lose"); //输
          case 4:
            return i18n_t("bet_record.win"); //赢
          case 5:
            return i18n_t("bet_record.win_half"); //"赢半";
          case 6:
            return i18n_t("bet_record.lose_half"); //"输半";
          case 7:
            return i18n_t("bet_record.match_cancel2"); //"赛事取消";
          case 8:
            return i18n_t("bet_record.match_delay"); //"赛事延期";
          case 11:
            return i18n_t("bet_record.match_delay2"); //"比赛延迟";
          case 12:
            return i18n_t("bet_record.match_interrupt"); //"比赛中断";
          case 13:
            return i18n_t("bet.invalid"); //"无效";
          case 16:
            return i18n_t("bet.invalid"); //"无效";
          case 15:
            return i18n_t("bet_record.match_give_up"); //"比赛放弃";
        }
      },
      clear_select_handler(){
        if(this.is_clear_unclick) return;
        this.is_clear_unclick = true
        this.is_saidan_unclick = true
        this.select_arr = [];
      },
      click_select(evt) {
        console.log('evt===', evt);
        if(this.select_arr.includes(evt)) {
          let index = this.select_arr.indexOf(evt);
          this.select_arr.splice(index, 1)
        }else{
          this.select_arr.push(evt)
        }
        if(this.select_arr.length > 0){
          this.is_clear_unclick = false
          this.is_saidan_unclick = false
        }else {
          this.is_clear_unclick = true
          this.is_saidan_unclick = true
        }
        console.log('this.select_arr===', this.select_arr);
      },
      saidan_handler() {
        if(this.is_saidan_unclick) return;

        // 每次发布晒单需间隔3秒，当3秒内连续晒单会触发轻提示
        if (Date.now() - this.share_order_time < 3000) {
          useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t('chatroom.fast_share'))
          return
        }
        
        console.log('saidan_handler===', this.select_arr);
        let value_arr = [];
        this.select_arr.map((index) => {
          value_arr.push(this.bet_records[index]);
        })

        let params = [];
        console.log('value_arr===', value_arr);
        value_arr.map((item) => {
          const dataListItem = item.detailList[0] || {}
          /**
           * langCode
           * 前端  简体 zh 后端 zs
           * 前端  繁体 tw 后端 zh  tw
           */
          const langCode = ['zs', 'hk'].includes(item.langCode) ? 'zh' : 'tw'
          console.log(item)
          params.push({
            chatRoomId: this.get_chatroom_id,
            orderId: item.orderNo,
            matchName: dataListItem.matchName,
            matchInfo: dataListItem.matchInfo,
            sportName: dataListItem.sportName,
            matchType: dataListItem.matchType,
            marketType: dataListItem.marketType,
            playOptionName: dataListItem.playOptionName,
            originalOrderAmountTotal: item.orderAmountTotal,
            createTime: dataListItem.createTime,
            settleAmount: item.settledAmount,
            outcome: item.outcome,
            tournamentId: dataListItem.tournamentId,
            matchId: dataListItem.matchId,
            playId: dataListItem.playId,
            marketId: dataListItem.marketId,
            playOptionsId: dataListItem.playOptionsId,
            placeNum: dataListItem.placeNum,
            playOptions: dataListItem.playOptions,
            marketValue: dataListItem.marketValue,
            oddFinally: dataListItem.oddFinally,
            playName:dataListItem.playName,
            originalMaxWinAmount:item.maxWinAmount,
            langCode: langCode,
          })
        })
        api_details.shareOrder(params).then((res) =>{
          // this.$emit('qingkong')
          console.log('晒单数据===', res);
          if(res.data.code == 0){
            // this.bet_records = records || []
            this.$emit('qingkong')
            this.$emit('update:share_order_time', Date.now())
          }else{
            useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, res.data.msg);
          }
        })
      }
    },
    mounted() {
       
    },
}