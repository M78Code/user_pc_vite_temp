<!--
 * @Author: MasterJ
 * @Date: 2022-08-26 14:43
 * @Description 晒单信息
-->
<template>
  <div class="bet-list">
    <div
        class="show-bet-wrapper">
      <div class="item-top">
        <div class="home-vs-away">
          {{ lodash.get(bet_records, 'content.matchInfo') }}
        </div>
        <div class="send-time">
          {{ stamp }}
        </div>
      </div>
      <div class="item-middle">
        <div class="item-row row-follow-order">
          <div class="item-row-left item-bet-handicap" v-style>
            [{{match_type(bet_records.content.matchType, bet_records.content.langCode)}}] {{ bet_records.content.playName }}
            [{{ handicap_name(bet_records.content.marketType, bet_records.content.langCode) }}]
          </div>
          <div class="item-row-right">
            <div v-if="!bet_records.content.outcome" class="follow-order" @click="follow_order_handler(bet_records)">{{ i18n_t('chatroom.follow_order') }}</div>
            <div v-else class="item-settlemented" :class="item_class(bet_records.content.outcome)">
              <span v-text="item_status(bet_records.content.outcome)"></span>
            </div>
          </div>
        </div>
        <div class="item-row">
          <div class="item-row-left item-bet-name">
            <template v-if="bet_records.content.playOptionName.includes(' ')">
              <span class="part1">{{ handle_play_option_name(bet_records.content.playOptionName, 'name') }}</span>
              <span class="part2">{{ handle_play_option_name(bet_records.content.playOptionName, 'number') }}</span>
            </template>
            <template v-else>
              {{ bet_records.content.playOptionName }}
            </template>
          </div>
        </div>
        <div class="item-row">
          <div class="item-row-left item-bet-odds">
            @ {{ bet_records.content.oddFinally | format_odds}}
          </div>
          <div class="item-row-right item-follow-heart" :class="{'is-like': bet_records.is_like}" @click="like_count_add">
            <div class="follow-heart"></div> 
            <span class="follow-count">{{ bet_records.like }}</span>
          </div>
        </div>
      </div>
      <div class="item-bottom">
        <div class="item-row">
          <div class="item-row-left">
            <span>{{ i18n_t('common.bets_val') }}:</span>
            <span>{{ bet_records.content.originalOrderAmountTotal | format_currency }}</span>
          </div>
          <div class="item-row-right">
            <!-- 最高可赢 -->
            <template v-if="!bet_records.content.outcome">
              <span>{{ i18n_t('common.maxn_amount_val') }}:</span>
              <span>{{ bet_records.content.originalMaxWinAmount | format_currency }}</span>
            </template>
            <!-- 返还金额 走水/输/赢/赢半/输半 -->
            <template v-else-if="[2, 3, 4, 5, 6].includes(+bet_records.content.outcome)">
              <span>{{ i18n_t('common.donate_win') }}:</span>
              <span :class="[4, 5, 6].includes(+bet_records.content.outcome) ? 'text-win' : 'text-lose'">{{ bet_records.content.settleAmount | format_currency }}</span>
            </template>
          </div>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import { post_chat_likemessage } from "src/public/api/module/chatroom/index.js";
import bet_item_mixin  from "src/public/components/bet_item/bet_item_mixin";
import { api_details } from "src/api/index";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { UserCtr,MatchDetailCalss } from "src/output/index.js";
export default {
  name: "bet_record_info",
  mixins:[bet_item_mixin],
  props: {
    bet_records: {
      type: Object,
      default: () => (
        {

        }
      )
    },
    stamp:{
      type:String,
      default:""
    }
  },
  directives: {
    style: {
      inserted(el, binding){
        // 换行后 点赞喜欢的margin-top设为0
        if (el.clientHeight > 20) {
          el.parentElement.parentElement.lastElementChild.lastElementChild.style.marginTop = 0
        }
      }
    }
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
  watch: {
  /*
  ** 监听MatchDetailCalss的版本号  获取最新的mid
  */
  'details_data_version.version':{
      handler(val){
        if (val) {
        this.get_match_details_params = MatchDetailCalss.params
       }
      },
      immediate: true
  },
  },
  data(){
    return{
       // 获取 uid
       get_uid:UserCtr.get_uid()
      //获取详情参数
      get_match_details_params:MatchDetailCalss.params,
      //详情类版本号 
      details_data_version:MatchDetailCalss.details_data_version, 
    }
  }

  methods: {
    // ...mapActions({
    //   vx_set_chat_room_type: "set_chat_room_type" //设置聊天室来源跟单盘口状况eu
    // }),
    /**
     * 总的跟单需要数据获取
    */
    async follow_order_handler(bet_records) {
      console.log('跟单数据===', bet_records);
      console.log('get_match_details_params===', this.get_match_details_params);
      this.bet_records = bet_records;
      let mid = bet_records.content.matchId;
      mid = this.get_match_details_params.mid;
      let match_inf = {};
      let play_fun = {};
      await api_details
        .get_match_detail_MatchInfo({mid:mid, cuid:this.get_uid}).then(({ data }) => {
          let code = lodash.get(data, "code");
          if (code == 200) {

            match_inf = lodash.get(data, "data") || {};
          }
      })
      let params = {
        mcid: 0, //所有玩法集
        mid: mid, //赛事id
        cuid: this.get_uid, //用户id
        newUser: 0

      }
      await api_details
        .get_match_odds_info(params).then(({ data }) => {
          let code = lodash.get(data, "code");
          if (code == 200) {
            play_fun = lodash.get(data, "data") || {};
          }
      })
      // console.log('match_inf===', match_inf);
      // console.log('play_fun===', play_fun);
      let info = this.search_bet_item(match_inf, play_fun);
      console.log("info-----",info);
      if(info.length){
        this.set_bet_obj_config(match_inf, info, true)
      }
    },
    /**
     * 搜索符合条件得跟单数据
    */
    search_bet_item(match_inf, play_fun) {
      let content = this.bet_records.content
      let play_id =  content.playId;
      let play_num =  content.placeNum;
      let o_id =  content.playOptionsId;
      let o_type =  content.playOptions;

      let info  = match_inf, play_info = play_fun;
      console.log(play_id, '==', play_num, '==', o_id, '==', o_type);
      // play_id = '17';
      // play_num = null,
      // o_id = "143111475633986042",
      // o_type = '1'
      let len = play_info.length;

      //玩法id过滤
      let play_arr = play_info.filter(item => item.hpid == play_id);
      // console.log('play_arr====', play_arr);
      if(play_arr.length == 0){
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("bet_record.follow_tip_play"));
        return;
      }

      let num_arr = [];
      //如果坑位存在
      // if(!lodash.isNull(play_num)) {
      //   for(let i = 0; i < play_arr.length; i++) {
      //      let item = play_arr[i];
      //      for(let j=0;j<item.hl.length;j++){
      //        if(item.hl[j].hn == play_num){
      //         for(let p=0; p < item.hl[j].ol.length;p++){
      //           if(item.hl[j].ol[p].ot == o_type){
      //             item.hl[j].ol[p].hid = item.hl[j].hid
      //             item.hl[j].ol[p].hv = item.hl[j].hv;
      //             item.hl[j].ol[p].hmt = item.hl[j].hmt;
      //             item.hl[j].ol[p].hpid = play_arr[i].hpid
      //             item.hl[j].ol[p].hps =  play_arr[i].hps;
      //             item.hl[j].ol[p].hpn =  play_arr[i].hpn;
      //             item.hl[j].ol[p].hn = item.hl[j].hn;
      //             item.hl[j].ol[p].hs = item.hl[j].hs;
      //             item.hl[j].ol[p].hsw = item.hsw;
      //             num_arr.push(item.hl[j].ol[p])
      //             console.log('num_arr1====', num_arr);
      //             break;
      //           }
      //         }
      //        }
      //      }
      //     }
      //     if(num_arr.length == 0){
      //       useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, '对应坑位不存在，跟单失败');
      //       return;
      //     }
      // }else {//不存在
        for(let i = 0; i < play_arr.length; i++) {
           let item = play_arr[i];
           for(let j=0;j<item.hl.length;j++){
              for(let p=0; p < item.hl[j].ol.length;p++){
                if(item.hl[j].ol[p].oid == o_id){
                //   if(item.hl[j].ol[p].hs == 1 || item.hl[j].ol[p].hs == 2){
                //     // hs 盘口状态 0:开盘 1:封盘 2:关盘 11:锁盘
                //       //封盘或者关盘取第一个
                //       if((p==0 || item.hl[j].ol[p+1])){
                //         item.hl[j].ol[p+1].hid = item.hl[j].hid;
                //         item.hl[j].ol[p+1].hv = item.hl[j].hv;
                //         item.hl[j].ol[p+1].hmt = item.hl[j].hmt;
                //         item.hl[j].ol[p+1].hps =  play_arr[i].hps;
                //         item.hl[j].ol[p+1].hpid = play_arr[i].hpid
                //         item.hl[j].ol[p+1].hn = item.hl[j].hn;
                //         item.hl[j].ol[p+1].hs = item.hl[j].hs;
                //         item.hl[j].ol[p+1].hsw = item.hsw;
                //         item.hl[j].ol[p+1].hpn =  play_arr[i].hpn || this.bet_records.content.playName;;
                //         num_arr.push(item.hl[j].ol[p]);
                //       }else if(p!=0 || item.hl[j].ol[0]){
                //         item.hl[j].ol[0].hid = item.hl[j].hid;
                //         item.hl[j].ol[0].hv = item.hl[j].hv;
                //         item.hl[j].ol[0].hmt = item.hl[j].hmt;
                //         item.hl[j].ol[0].hps =  play_arr[i].hps;
                //         item.hl[j].ol[0].hpid = play_arr[i].hpid
                //         item.hl[j].ol[0].hn = item.hl[j].hn;
                //         item.hl[j].ol[0].hs = item.hl[j].hs;
                //         item.hl[j].ol[0].hsw = item.hsw;
                //         item.hl[j].ol[0].hpn =  play_arr[i].hpn || this.bet_records.content.playName;;
                //         num_arr.push(item.hl[j].ol[p]);
                //       }
                //   }else{
                //     item.hl[j].ol[p].hid = item.hl[j].hid;
                //     item.hl[j].ol[p].hv = item.hl[j].hv;
                //     item.hl[j].ol[p].hmt = item.hl[j].hmt;
                //     item.hl[j].ol[p].hps =  play_arr[i].hps;
                //     item.hl[j].ol[p].hpid = play_arr[i].hpid
                //     item.hl[j].ol[p].hn = item.hl[j].hn;
                //     item.hl[j].ol[p].hs = item.hl[j].hs;
                //     item.hl[j].ol[p].hsw = item.hsw;
                //     item.hl[j].ol[p].hpn =  play_arr[i].hpn || this.bet_records.content.playName;
                //     num_arr.push(item.hl[j].ol[p]);

                //   }
                  if(item.hl[j].hs == 0){
                    // hs 盘口状态 0:开盘 1:封盘 2:关盘 11:锁盘
                    item.hl[j].ol[p].hid = item.hl[j].hid;
                    item.hl[j].ol[p].hv = item.hl[j].hv;
                    item.hl[j].ol[p].hmt = item.hl[j].hmt;
                    item.hl[j].ol[p].hps =  play_arr[i].hps;
                    item.hl[j].ol[p].hpid = play_arr[i].hpid
                    item.hl[j].ol[p].hn = item.hl[j].hn;
                    item.hl[j].ol[p].hs = item.hl[j].hs;
                    item.hl[j].ol[p].hsw = item.hsw;
                    item.hl[j].ol[p].hpn =  play_arr[i].hpn || this.bet_records.content.playName;
                    num_arr.push(item.hl[j].ol[p]);
                    this.vx_set_chat_room_type(this.bet_records.content.marketType)
                    return num_arr;
                  }
                }
              }
           }
        // }
        if(num_arr.length == 0){
            useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("bet_record.follow_tip_item"));
            return [];
          }
      }


  //这里是找到预备数据，准备做第二次筛选
   if(num_arr.length>1){
    let marketValue = content.marketValue
    let find_same = num_arr.find(x=>x.on==marketValue|| x.hv== marketValue)
   //能找到相同投注项
    if(find_same){
      num_arr =[find_same]
    }else{
      //不能找到相同投注项
      if(num_arr[0].hn){
        //带坑位玩法

    if((x.on&& 1*x.on == parseFloat(x.on))|| x.hv&& 1*x.hv == parseFloat(x.hv)   ){
      // 盘口是纯数字
      let arr_sort=[]
        num_arr.map((x,i)=>{
          arr_sort.push(   Math.max( parseFloat(x.on), parseFloat(x.hv)) )

        })
        let find_ndex = lodash.sortedIndex(arr_sort,parseFloat(marketValue))


       //和当前 盘口一样的
       let find = ''
       if(find_ndex == arr_sort.length ){
        find = num_arr[find_ndex-1]
       } else{

        find = num_arr[find_ndex]
       }

       num_arr =[find]

    }else{
      num_arr =[num_arr[0] ]
    }




      }else{

        num_arr =[num_arr[0] ]
      }



    }






   }
      console.log( 'this.bet_records-----------',this.bet_records  );
      console.log( 'num_arr      -----------',num_arr );
      //聊天室来源跟单盘口状况eu
      this.vx_set_chat_room_type(this.bet_records.content.marketType)
      //选到的投注项数据
      return num_arr;
    },
    /**
     * @description: 玩法项名称/数字分割显示
     */
    handle_play_option_name(str, part) {
      if (!str) {
        return ''
      }
      // 正则替换后 分割
      const str_arr = str.replace(/\s(\+|-)?(\d.*)?\d$/, ',$&').split(',')

      if (part === 'name') {
        return str_arr[0].trimEnd()
      } else if (part === 'number' && str_arr[1]) {
        return str_arr[1]
      } else {
        return ''
      }
    },
    /**
     * @description: 点赞喜欢
     */
    like_count_add() {
      const params = {
        chatRoomId: this.bet_records.content.chatRoomId,
        messageId: this.bet_records.messageId,
      }
      post_chat_likemessage(params)
        .then(({data}) => {
          if (data.code === 0) {
            this.$emit('update:bet_records', Object.assign(this.bet_records, {is_like: true}))
          }
        })
        .catch(err => console.error(err))
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
  }
}
</script>

<style scoped lang="scss">
.bet-list {
  user-select: none;
  .item-top {
    height: 28px;
    padding: 7px 0 7px 14px;
    position: relative;
    &::before {
      content: '';
      width: 2px;
      height: 12px;
      display: inline-block;
      margin-right: 4px;
      border-radius: 1.5px;
      vertical-align: middle;
    }
    .home-vs-away {
      display: inline-block;
      vertical-align: middle;
    }
    .send-time{
      display: inline-block;
      position: absolute;
      right: 10px;
      opacity: .6;
    }
  }
  .item-middle {
    height: 66px;
    padding: 8px 10px 8px 20px;
    .row-follow-order {
      align-items: flex-start;
    }
    .item-settlemented {
      white-space: nowrap;
      &.win, &.lose {
        padding: 0 3px;
        border-radius: 4px;
      }
    }
    .follow-order {
      height: 18px;
      line-height: 18px;
      padding: 0 12px;
      box-shadow: 0px 2px 4px 0px rgba(255,112,0,0.5);
      border-radius: 6px;
      cursor: pointer;
      white-space: nowrap;
    }
    .item-bet-handicap {
      align-self: flex-start;
      font-size: 13px;
    }
    .item-bet-name {
      font-size: 14px;
      .part1 {
        display: inline-block;
        height: 14px;
        margin-right: 5px;
      }
      .part2 {
        display: inline-block;
        height: 12px;
        line-height: 12px;
      }
    }
    .item-bet-odds {
      font-size: 14px;
      font-weight: 700;
    }
    .item-follow-heart {
      display: flex;
      margin-top: 10px;
      align-items: center;
      cursor: pointer;
      .follow-heart {
        background-repeat: no-repeat;
        background-size: 100%;
        margin-right: 3px;
        width: 8px;
        height: 8px;
      }
      .follow-count {
        height: 12px;
        line-height: 12px;
        margin-top: 1px;
      }
    }
  }
  .item-bottom {
    height: 28px;
    line-height: 28px;
    padding: 0 10px;
    [class*=item-row-] {
      span {
        display: inline-block;
        height: 12px;
        line-height: 12px;
        &:first-child {
          margin-right: 2px;
        }
      }
    }
  }
  .item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item-row-left {
      line-height: 14px;
    }
  }
}
</style>