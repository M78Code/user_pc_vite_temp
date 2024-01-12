<!--
 * @Description: 投注记录投注项部分
-->
<template>
  <div class="component bet-record-item">
    <!--足球或者篮球，预约显示预约字样-->
    <template v-if="order.sportId == 1 || order.sportId == 2">
      <!-- <div class="row appoint-status" v-if="preOrder"> -->
        <!--预约-->
        <!-- <div class="col">{{ i18n_t('bet.bet_book_confirm') }}</div>
      </div> -->
    </template>
    <!--如果是虚拟体育-->
    <template v-if="VIRTUAL_SPORT_ID.includes(`${order.sportId}`)">
      <div class="row">
        <div class="col bet-name-info">
          <template v-if="orderStatus == 1">
            <!--球种名称-->
            <span class="bet-play-name">[{{ order.sportName }}]</span>
          </template>
          <!--联赛名称-->
          <span>{{ order.matchName }}</span>
          <!--虚拟足球,篮球-->
          <template v-if="[
            VIURTUAL_SPORT.football,
            VIURTUAL_SPORT.basketball
          ].includes(lodash_.trim(order.sportId))">
            <!--批次号-->
            <span>{{ order.matchDay }} {{ order.batchNo }}</span>
          </template>
          <template v-else>
            <!--批次号-->
            <span>{{ order.batchNo }}</span>
          </template>
        </div>
      </div>
      <!--虚拟足球,篮球-->
      <template v-if="[
        VIURTUAL_SPORT.football,
        VIURTUAL_SPORT.basketball
      ].includes(lodash_.trim(order.sportId))">
        <div class="row">
          <div class="col bet-against">
            <!--主队 v 客队-->
            <span class="home-vs-away">
              {{ order.home }}<span class='bet-pk'>v</span>{{ order.away }}
            </span>
          </div>
        </div>
      </template>
    </template>
    <!--如果不是虚拟体育-->
    <template v-else>
      <!--冠军或者电竞需要展示联赛名称-->
      <div class="row">
        <div class="col bet-league-name" :class="{ 'champion': order.matchType == 3 }">
          <!--联赛名称-->
          <span>{{ order.matchName }}</span>  --- {{ item.orderStatus }}
        </div>
      </div>
      <!--不是冠军-->
      <template v-if="order.matchType != 3">
        <div class="row">
          <div class="col bet-against">
            <!--主队 v 客队-->
            <span class="home-vs-away">
              {{ order.matchInfo.indexOf('(') ? (order.matchInfo.split('(')[0]) : order.matchInfo }}
              <!--有括号就是有比分信息 当鼠标移上去显示，移出去就消失-->
              <span v-if="order.matchInfo" @mouseover="show_score_info = true" @mouseout="show_score_info = false">{{ '('
                + order.matchInfo.split('(')[1] }}</span>
              <!--对阵信息后面加的那个提示-->
              <q-tooltip content-class="bet-bg-tooltip" anchor="bottom left" self="top left" :offset="[-100, 5]"
                v-if="show_score_info == true">
                <!--投注时的实时比分(提示)-->
                <div style="padding-top:5px;padding-bottom:5px;padding-left:5px;word-break:break-all;">
                  {{ i18n_t('bet.score_info') }}
                </div>
              </q-tooltip>
            </span>
          </div>
          <!--提示区域-->

        </div>
      </template>
    </template>
    <!--月日时间-->
    <div class="row">
      <div class="col match-time">
        {{ formatTime(order.beginTime, "mm月DD日 HH:MM") }}
      </div>
    </div>
    <!--中间 球种 玩法 盘口 赔率 等-->
    <div class="bet-content">
      <div class="row">
        <div class="col bet-play-game yb-fontsize13">
          <!--虚拟体育-->
          <template v-if="VIRTUAL_SPORT_ID.includes(`${order.sportId}`)">
            <template v-if="item.orderStatus == 0">
              <label class="bet-play-name">
                <!--球种名称-->
                [{{ order.sportName }}]
                <label class="bet-play-text margin-left-5">
                  <!--玩法名称-->
                  {{ order.playName }}
                  <label class="bet-handicap-name">
                    <!--盘口名称-->
                    [{{ i18n_t(`odds.${order.marketType}`) }}]
                  </label>
                </label>
              </label>
            </template>
            <template v-else>
              <!--非虚拟体育-->
              <label class="bet-play-text">
                <!--玩法名称-->
                {{ order.playName }}
                <label class="bet-handicap-name">
                  <!--盘口名称-->
                  [{{ i18n_t(`odds.${order.marketType}`) }}]
                </label>
              </label>
            </template>
          </template>
          <template v-else>
            <label class="bet-play-handicap">
              <!--球种名称 盘口类型 玩法名称-->
              <label class="sport-name">[{{ order.sportName }}]</label>
              {{ match_type(order.matchType) }}{{ order.playName }}
              <template v-if="order.scoreBenchmark && order.playId != '334'">
                <!--基本分-->
                {{ socre_format(order.scoreBenchmark) }}
              </template>
              <template v-if="!['1', '2', '4', '8', '16'].includes(item.acCode)">
                <!--盘口名称-->
                <label class="bet-handicap-name">
                  [{{ i18n_t(`odds.${order.marketType}`) }}]
                </label>
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
        && item.orderStatus == 1">
        <div class="row">
          <div class="col bet-against">
            <!--赛果 比分-->
            {{ i18n_t('bet.bet_result') }} {{ order.settleScore }}
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
                <div :class="[`ranking-icon ranking-bg-style1-${num}`, `csid-$ {order.sportId}`]"></div>
              </template>
            </template>
            <!--盘口值-->
            <template v-if="order.marketValue && !order.marketValue.includes('/')">
              <div class="bet-team-name">{{ order.marketValue }}</div>
            </template>
          </template>
          <template v-else>
            <!--非赛狗/非赛马时显示盘口值 赔率-->
            <span class="part-one">{{ part().part1 }}</span><span class="part-two">{{ lodash_.trim(part().part2) }}</span>
            <!-- <span>{{order.marketValue}}</span> -->
          </template>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <!--赔率-->
          <label class="bet-odds-value"><span>@</span>{{ order.oddFinally }}</label>
        </div>
        <!--结算是显示投注结果: 输,赢,半输,半赢,比赛异常的各种显示(比赛取消,比赛延期等等)--->
        <div class="col-auto bet-result">
          <template v-if="item.preBetAmount > 0 && BetRecordLeft.selected == 1">
            <!--输赢状态-->
            <span :class="item_class(out_come)" v-text="item_status(out_come)"></span>
          </template>
          <template v-else>
            <!--输赢结算状态-->
            <span v-html="bet_result(order.betStatus, order.betResult, order.cancelType)"></span>
          </template>
        </div>
      </div>
    </div>
    <!-- 截止投注 -->
    <div class="row justify-between deadline" v-if="order.matchType == 3">
      <span>{{ i18n_t('list.bet_close') }}</span>
      <span>{{
        formatTime(
          order.closingTime,
          ['zh', 'tw'].includes(lang) ? "yyyy-mm-dd hh:MM" : "dd/mm/yyyy hh:MM") }}</span>
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
const match_type = (type, langCode=UserCtr.lang) => {
  let res = "";
  if(type && langCode) {
    switch (parseInt(type)) {
      case 1:
        res = i18n_t(`odds.${langCode}.morning_session`); //"赛前";
        break;
      case 2:
        res = i18n_t(`odds.${langCode}.list_today_play_title`);//"滚球";
        break;
      case 3:
        res =i18n_t(`odds.${langCode}.match_winner`); //"冠军";
        break;
    }
  }
  return res;
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

const part = () => {
  let part1 = ''   // 第一部分
  let part2 = ''   // 第二部分
  // 投注项名称获取
  let playOptionName = lodash_.trim(props.order.marketValue);
  let playId = props.order.playId;
  // 投注项中间是否包含空格
  if(props.order.marketValue && lodash_.trim(playOptionName).includes(" ") && ![362].includes(playId)) {      
    // 获取投注项中间最后一个空格所在位置
    let spliter = playOptionName.lastIndexOf(' ');
    // 截取第一部分
    part1 = playOptionName.substring(0,spliter);
    // 截取第二部分
    part2 = playOptionName.substring(spliter,playOptionName.length+1);
  } else {
    // 默认投注项名称为第一部分
    part1 =  lodash_.trim(playOptionName);
  }
  return {
    part1,
    part2
  }
}

</script>
<style lang="scss" scoped>
// 英文和泰语可能会换行
.bet-name-info {
  white-space: normal;
  word-break: break-all;
}

/**对阵信息后面加的那个提示*/
.bet-bg-tooltip {
  background: #A3AFBF;
  color: var(--q-gb-t-c-1);
  border-radius: 2px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
}

.deadline {
  margin-top: 12px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 8px;
  color: var(--qq--yb-text-color4);
}
</style>

src/output/index.js