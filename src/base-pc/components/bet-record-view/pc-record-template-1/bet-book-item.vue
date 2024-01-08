<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 投注记录投注项部分
-->
<template>
  <div>
      <!--
      appoint_order_status为投注预约时取值为 0: 进行中 2: 已失效
      appoint_status(0预约中 ;1预约成功;2.风控预约失败;3.风控取消预约注单.4.用户手动取消预约投注)
        -->
    <template v-if="order.sportId==1 || order.sportId==2">
      <div class="row appoint-status" v-if="appoint_status==0 && appoint_order_status==0">
        <!--预约中-->
        <div class="col">{{i18n_t('bet.bet_booking')}}</div>
        <div class="cursor-pointer col right" @click.stop="cancel_appoint">{{i18n_t('select.cancel')}}</div>
      </div>
      <div class="row appoint-status" v-if="[2, 3].includes(appoint_status) && appoint_order_status==2">
        <!--预约失败-->
        <div class="col">{{i18n_t('bet.bet_book_failed')}}</div>
      </div>
      <div class="row appoint-status" v-if="appoint_status==4 && appoint_order_status==2">
        <!--已取消-->
        <div class="col">{{i18n_t('bet.bet_book_canceled')}}</div>
      </div>
    </template>
    
    <template v-if="VIRTUAL_SPORT_ID.includes(`${order.sportId}`)">
      <div class="row">
        <div class="col bet-name-info">
          <template v-if="order_status == 1">
            <!--球种名称-->
            <span class="bet-play-name">[{{order.sportName}}]</span>
          </template>
          <!--联赛名称-->
          <span>{{order.matchName}}</span>
          <!--虚拟足球,篮球-->
          <template v-if="[
            VIURTUAL_SPORT.football,
            VIURTUAL_SPORT.basketball
          ].includes(_.trim(order.sportId))">
            <!--批次号-->
            <span>{{order.matchDay}} {{order.batchNo}}</span>
          </template>
          <template v-else>
            <!--批次号-->
            <span>{{order.batchNo}}</span>
          </template>
        </div>
      </div>
      <!--虚拟足球,篮球-->
      <template v-if="[
        VIURTUAL_SPORT.football,
        VIURTUAL_SPORT.basketball
      ].includes(_.trim(order.sportId))">
        <div class="row">
          <div class="col bet-against">
            <!--主队 v 客队-->
            <span class="home-vs-away">
              {{home}}<span class='bet-pk'>v</span>{{away}}
            </span>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <!--冠军或者电竞需要展示联赛名称-->
      <template>
        <div class="row">
          <div class="col bet-league-name" :class="{'champion': order.matchType==3}">
            <!--联赛名称-->
            <span>{{order.matchName}}</span>
          </div>
        </div>
      </template>
      <template v-if="order.matchType!=3">
        <div class="row">
          <div class="col bet-against">
            <!--主队 v 客队-->
            <span class="home-vs-away">
              {{home}}<span class='bet-pk'>v</span>{{away}}
            </span>
          </div>
        </div>
      </template>
    </template>
    <div class="row">
        <div class="col match-time">
          {{match_time}}
        </div>
      </div>
    <div class="bet-content">
      <div class="row">
        <div class="col bet-play-game yb-fontsize13">
          <!--虚拟体育-->
          <template v-if="VIRTUAL_SPORT_ID.includes(`${order.sportId}`)">
            <template v-if="order_status==0">
              <label class="bet-play-name">
                <!--球种名称-->
                [{{order.sportName}}]
                <label class="bet-play-text margin-left-5">
                  <!--玩法名称-->
                  {{order.playName}}
                  <label class="bet-handicap-name">
                    <!--盘口名称-->
                    [{{handicap_name(order.marketType,lang_code)}}]
                  </label>
                </label>
              </label>
            </template>
            <template v-else>
              <!--非虚拟体育-->
              <label class="bet-play-text">
                <!--玩法名称-->
                {{order.playName}}
                <label class="bet-handicap-name">
                  <!--盘口名称-->
                  [{{handicap_name(order.marketType,lang_code)}}]
                </label>
              </label>
            </template>
          </template>
          <template v-else> 
            <label class="bet-play-handicap">
              <!--球种名称 盘口类型 玩法名称-->
              <label class="sport-name">[{{order.sportName}}]</label>{{match_type(order.matchType,lang_code)}}{{order.playName}}
              <template v-if="is_display_score()">
                <!--基本分-->
                {{ socre_format(order.scoreBenchmark )}}
              </template>
              <template v-if="!['1','2','4','8','16'].includes(ac_code)">
                <!--盘口名称-->
                <label class="bet-handicap-name">[{{handicap_name(order.marketType,lang_code)}}]</label>
              </template>
            </label>
          </template>
        </div>
      </div>    
      <!--虚拟赛狗,赛马,摩托车,泥地摩托车-->
      <template v-if="[
        VIURTUAL_SPORT.horse,
        VIURTUAL_SPORT.dog,
        VIURTUAL_SPORT.mudland_motorcycle,
        VIURTUAL_SPORT.motorcycle
        ].includes(`${order.sportId}`) 
        && order_status==1">
        <div class="row">
          <div class="col bet-against">
            <!--赛果 比分-->
            {{i18n_t('bet.bet_result')}} {{order.settleScore}}
          </div>
        </div>
      </template>    
      <div class="row">
        <div class="col bet-play-team">
          <!--虚拟赛马,虚拟赛狗,虚拟摩托车,泥地摩托车玩法显示数字样式-->
          <template v-if="[
            VIURTUAL_SPORT.horse,
            VIURTUAL_SPORT.dog,
            VIURTUAL_SPORT.mudland_motorcycle,
            VIURTUAL_SPORT.motorcycle
          ].includes(`${order.sportId}`)">
            <template v-if="!VIRTUAL_PLAY_NOT_NUMBER2.includes(`${order.playId}`)">
              <template v-for="num in get_numbers()" :key="num">
                <div :class="[`ranking-icon ranking-bg-style1-${num}`, `csid-${order.sportId}`]"></div>              
              </template>
            </template>
            <!--盘口值-->
            <template v-if="order.marketValue && !order.marketValue.includes('/')">
              <div class="bet-team-name">{{order.marketValue}}</div>
            </template>
          </template>
          <template v-else>
            <!--非赛狗/非赛马时显示盘口值 赔率-->
            <span class="part-one">{{part1}}</span><span class="part-two">{{_.trim(part2)}}</span>
          </template> 
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label class="bet-odds-value"><span>@</span>{{odds_value | format_odds}}</label>
        </div>
        <!--结算是显示投注结果: 输,赢,半输,半赢,比赛异常的各种显示(比赛取消,比赛延期等等)--->
        <div class="col-auto bet-result">
          <template v-if="pre_bet_amount>0 && selected==1">
            <span :class="item_class(out_come)" v-text="item_status(out_come)"></span> 
          </template>
          <template v-else>
            <span v-html="bet_result(order.betStatus,order.betResult,order.cancelType)"></span> 
          </template>
        </div>
      </div>
      <q-dialog v-model="bookShow" persistent>
        <q-card class="book-dialog">
          <q-card-section class="row items-center">
            <!--确认取消 [x] 预约吗?-->
            <div class="book-msg">{{ cancel_book_msg(order.matchInfo, i18n_t('bet.bet_book_cancel_msg')) }}</div>
          </q-card-section>

          <q-card-actions align="center">
            <div class="cursor-pointer book-record book-record-cancel" :disabled="book_loading" @click="close_book_dialog">
              <!--确认中-->
              {{i18n_t('select.cancel')}}
            </div>
            <div class="cursor-pointer book-record book-record-submit" :disabled="book_loading" @click="cancel_book_handle">
              <!--确认中-->
              {{i18n_t('select.confirm')}}
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </div>
</template>
<script setup>
import { ref } from "vue"
import { VIURTUAL_SPORT, VIRTUAL_PLAY_NOT_NUMBER2, VIRTUAL_SPORT_ID,CANCEL_TYPE } from "src/output/module/constant-utils.js";
 
import { i18n_t, i18n_tc } from "src/boot/i18n.js"
import UserCtr from "src/core/user-config/user-ctr.js"
import  BetRecordLeft  from "src/core/bet-record/pc/bet-record-left.js"
import { formatTime } from 'src/output/index.js'

import lodash_ from "lodash"
const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  item: {},
  order: {},

})
/**
  * @description: 比分格式
  * @param {String} value 比分
  * @return {String} 转换后的比分格式
  */
const socre_format = (value) => {
  return `(${value.replace(':', '-')})`
}
const show_score_info = ref(false)


/**
   * @description: 输赢结算状态
   * @param {Number} bet_status 投注项状态
   * @param {Number} bet_result 投注结果
   * @param {Number} cancel_type 取消类型
   * @return {String} 需要显示的html 
   */
const bet_result = (bet_status, bet_result, cancel_type) => {
  let html = "";
  if (BetRecordLeft.selected == 0) {
    // 未结算
    if (props.item.orderStatus == 0) {
      //串关
      if (props.item.seriesType != 1) {
        if (bet_status == 1) {
          switch (bet_result) {
            case 2:
              html = "<span class='lose'>" + i18n_t("bet_record.effective_water_") + "</span>"; //"走水";
              break;
            case 3:
              html = "<span class='lose'>" + i18n_t("bet_record.lose") + "</span>"; // "输"      
              break;
            case 4:
              html = "<span class='win'>" + i18n_t("bet_record.win") + "</span>"; // "赢"
              break;
            case 5:
              html = "<span class='win'>" + i18n_t("bet_record.win_half") + "</span>"; //"赢半";
              break;
            case 6:
              html = "<span class='lose'>" + i18n_t("bet_record.lose_half") + "</span>"; //"输半";
              break;
            case 7:
              html = "<span class='lose'>" + i18n_t("bet_record.match_cancel2") + "</span>"; //"赛事取消";
              break;
            case 8:
              html = "<span class='lose'>" + i18n_t("bet_record.match_delay") + "</span>";//"赛事延期";
              break;
            case 11:
              html = "<span class='lose'>" + i18n_t("bet_record.match_delay2") + "</span>"; //"比赛延迟";
              break;
            case 12:
              html = "<span class='lose'>" + i18n_t("bet_record.match_interrupt") + "</span>"; //"比赛中断";
              break;
            case 13:
              html = "<span class='lose'>" + i18n_t("bet.invalid") + "</span>"; //"未知" 显示无效; 
              break;
            case 15:
              html = "<span class='lose'>" + i18n_t("bet_record.match_give_up") + "</span>"; //"比赛放弃";
              break;
            case 16:
              html = "<span class='lose'>" + i18n_t("bet.invalid") + "</span>"; //"盘口异常" 显示无效;
              break;
          }
        } else if (bet_status == 3 || bet_status == 4) {
          if (CANCEL_TYPE.includes(cancel_type)) {
            //比赛类型
            html = cancel_type_msg(cancel_type);
          } else {
            html = "<span class='lose'>" + i18n_t("bet.invalid") + "</span>";
          }
        }
      }
    }
  } else if (BetRecordLeft.selected == 1) { // 已结算
    if (props.item.orderStatus == 1) { // 投注成功
      switch (bet_result) {
        case 2:
          html = "<span class='lose'>" + i18n_t("bet_record.effective_water_") + "</span>"; //"走水";
          break;
        case 3:
          html = "<span class='lose'>" + i18n_t("bet_record.lose") + "</span>"; // "输"      
          break;
        case 4:
          html = "<span class='win'>" + i18n_t("bet_record.win") + "</span>"; // "赢"
          break;
        case 5:
          html = "<span class='win'>" + i18n_t("bet_record.win_half") + "</span>"; //"赢半";
          break;
        case 6:
          html = "<span class='lose'>" + i18n_t("bet_record.lose_half") + "</span>"; //"输半";
          break;
        case 7:
          html = "<span class='lose'>" + i18n_t("bet_record.match_cancel2") + "</span>"; //"赛事取消";
          break;
        case 8:
          html = "<span class='lose'>" + i18n_t("bet_record.match_delay") + "</span>";//"赛事延期";
          break;
        case 11:
          html = "<span class='lose'>" + i18n_t("bet_record.match_delay2") + "</span>"; //"比赛延迟";
          break;
        case 12:
          html = "<span class='lose'>" + i18n_t("bet_record.match_interrupt") + "</span>"; //"比赛中断";
          break;
        case 13:
          html = "<span class='lose'>" + i18n_t("bet.invalid") + "</span>"; //"未知" 显示无效; 
          break;
        case 15:
          html = "<span class='lose'>" + i18n_t("bet_record.match_give_up") + "</span>"; //"比赛放弃";
          break;
        case 16:
          html = "<span class='lose'>" + i18n_t("bet.invalid") + "</span>"; //"盘口异常" 显示无效;
          break;
      }
      if (props.item.seriesType != 1 && (bet_status == 3 || bet_status == 4)) {
        if (CANCEL_TYPE.includes(cancel_type)) {
          //比赛类型
          html = cancel_type_msg(cancel_type);
        } else {
          // 无效
          html = "<span class='lose'>" + i18n_t("bet.invalid") + "</span>";
        }
      }
    } else if (props.item.orderStatus == 2) { // 注单无效
      if (props.item.seriesType == 1) {
        if (bet_status == 1) {
          switch (bet_result) {
            case 7:
              html = "<span class='lose'>" + i18n_t("bet_record.match_cancel2") + "</span>"; //"赛事取消";
              break;
            case 8:
              html = "<span class='lose'>" + i18n_t("bet_record.match_delay") + "</span>";//"赛事延期";
              break;
            case 11:
              html = "<span class='lose'>" + i18n_t("bet_record.match_delay2") + "</span>"; //"比赛延迟";
              break;
            case 12:
              html = "<span class='lose'>" + i18n_t("bet_record.match_interrupt") + "</span>"; //"比赛中断";
              break;
            case 15:
              html = "<span class='lose'>" + i18n_t("bet_record.match_give_up") + "</span>"; //"比赛放弃";
              break;
          }
        }
      } else {
        if (bet_status == 1) {
          switch (bet_result) {
            case 7:
              html = "<span class='lose'>" + i18n_t("bet_record.match_cancel2") + "</span>"; //"赛事取消";
              break;
            case 8:
              html = "<span class='lose'>" + i18n_t("bet_record.match_delay") + "</span>";//"赛事延期";
              break;
            case 11:
              html = "<span class='lose'>" + i18n_t("bet_record.match_delay2") + "</span>"; //"比赛延迟";
              break;
            case 12:
              html = "<span class='lose'>" + i18n_t("bet_record.match_interrupt") + "</span>"; //"比赛中断";
              break;
            case 15:
              html = "<span class='lose'>" + i18n_t("bet_record.match_give_up") + "</span>"; //"比赛放弃";
              break;
            default:
              html = "<span class='lose'>" + i18n_t("bet.invalid") + "</span>";  // 无效
              break;
          }
        }
      }
      if (bet_status == 3 || bet_status == 4) {
        if (CANCEL_TYPE.includes(cancel_type)) {
          //比赛类型
          html = cancel_type_msg(cancel_type);
        } else if (props.item.seriesType != 1) {
          html = "<span class='lose'>" + i18n_t("bet.invalid") + "</span>";
        }
      }
    }
  }
  return html;
}
/**
 * 输赢状态calss
 * @param betResult: records.orderVOS.betResult
 */
const item_class = (betResult) => {
  switch (parseInt(betResult)) {
    case 2:
      return "lose"; //"走水";
    case 3:
      return "lose"; //输
    case 4:
      return "win"; //赢
    case 5:
      return "win"; //"赢半";
    case 6:
      return "lose"; //"输半";
    case 7:
      return "lose"; //"赛事取消";
    case 8:
      return "lose"; //"赛事延期";
    case 11:
      return "lose"; //"比赛延迟";
    case 12:
      return "lose"; //"比赛中断";
    case 13:
      return "lose"; //"无效";
    case 16:
      return "lose"; //"无效";
    case 15:
      return "lose"; //"比赛放弃";
  }
  return "";
}
/**
 * 输赢状态
 * @param type: records.orderVOS.betResult
 */
const item_status = (type) => {
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
    default:
      return '';
  }
}
/**
 * @description:  比赛类型
 * @param {*} cancel_type
 * @return {*}
 */
const cancel_type_msg = (cancel_type) => {
  let html = '';
  switch (cancel_type) {
    case 1:
      html = "<span class='lose'>" + i18n_t("bet_record.match_cancel2") + "</span>"; //"比赛取消";
      break;
    case 2:
      html = "<span class='lose'>" + i18n_t("bet_record.match_delay3") + "</span>"; //"比赛延期";
      break;
    case 3:
      html = "<span class='lose'>" + i18n_t("bet_record.match_interrupt") + "</span>"; // "比赛中断	"      
      break;
    case 4:
      html = "<span class='lose'>" + i18n_t("bet_record.match_rematch") + "</span>"; // "比赛重赛"
      break;
    case 5:
      html = "<span class='lose'>" + i18n_t("bet_record.match_waist") + "</span>"; //"比赛腰斩";
      break;
    case 6:
      html = "<span class='lose'>" + i18n_t("bet_record.match_give_up") + "</span>"; //"比赛放弃";
      break;
    case 17:
      html = "<span class='lose'>" + i18n_t("bet_record.match_advance") + "</span>"; //"赛事提前";
      break;
    case 20:
      html = "<span class='lose'>" + i18n_t("bet_record.match_delay2") + "</span>"; //"比赛延迟";
      break;
  }
  return html;
}
/**
 * @description: 赛事类型
 * @param {String} type 类型
 * @param {String} lang_code 语种信息
 * @return {String} 需要显示的类型文本
 */
const match_type = (type, langCode = UserCtr.lang) => {
  let text = '';
  switch (parseInt(type)) {
    case 1:
      text = `common_lang.${langCode}.bet.morning_session`; //"早盘赛事";
      break;
    case 2:
      text = `common_lang.${langCode}.bet.bet_inplay`; //"滚球盘赛事";
      break;
  }
  return i18n_t(text);
}
/**
  * @description: 获取编码序号
  * @param {*}
  * @return {*}
  */
const get_numbers = () => {
  if (props.order.playOptions) {
    if (props.order.playOptions.includes('/')) {
      return props.order.playOptions.split('/');
    }
    return [props.order.playOptions];
  }
  return [];
}
</script>
<style lang="scss" scoped>
// 英文和泰语可能会换行
.bet-name-info {
  white-space:normal; 
  word-break:break-all;
}
</style>

