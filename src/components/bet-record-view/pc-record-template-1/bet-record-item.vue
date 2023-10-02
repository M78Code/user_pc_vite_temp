<!--
 * @Description: 投注记录投注项部分
-->
<template>
  <div>
    <!--足球或者篮球，预约显示预约字样-->
    <template v-if="order.sportId == 1 || order.sportId == 2">
      <div class="row appoint-status" v-if="preOrder">
        <!--预约-->
        <div class="col">{{ $root.$t('bet.bet_book_confirm') }}</div>
      </div>
    </template>
    <!--如果是虚拟体育-->
    <template v-if="VIRTUAL_SPORT_ID.includes(`${order.sportId}`)">
      <div class="row">
        <div class="col bet-name-info">
          <template v-if="order_status == 1">
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
          <span>{{ order.matchName }}</span>
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
              <span v-if="order.matchInfo" @mouseover="show_score_info = true"
                @mouseout="show_score_info = false">{{ '(' + order.matchInfo.split('(')[1] }}</span>
              <!--对阵信息后面加的那个提示-->
              <q-tooltip content-class="bet-bg-tooltip" anchor="bottom left" self="top left" :offset="[-100, 5]"
                v-if="show_score_info == true">
                <!--投注时的实时比分(提示)-->
                <div style="padding-top:5px;padding-bottom:5px;padding-left:5px;word-break:break-all;">
                  {{ $root.$t('bet.score_info') }}
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
        && item.order_status == 1">
        <div class="row">
          <div class="col bet-against">
            <!--赛果 比分-->
            {{ $root.$t('bet.bet_result') }} {{ order.settleScore }}
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
            <span class="part-one">{{ part1 }}</span><span class="part-two">{{ lodash_.trim(part2) }}</span>
            <!-- <span>{{order.marketValue}}</span> -->
          </template>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <!--赔率-->
          <label class="bet-odds-value"><span>@</span>{{ odds_value }}</label>
        </div>
        <!--结算是显示投注结果: 输,赢,半输,半赢,比赛异常的各种显示(比赛取消,比赛延期等等)--->
        <div class="col-auto bet-result">
          <template v-if="pre_bet_amount > 0 && selected == 1">
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
    <div class="row justify-between deadline" v-if="order.matchType === 3">
      <span>{{ $root.$t('list.bet_close') }}</span>
      <span>{{
        formatTime(
          order.closingTime,
          ['zh', 'tw'].includes(lang) ? "yyyy-mm-dd hh:MM" : "dd/mm/yyyy hh:MM") }}</span>
    </div>
  </div>
</template>
<script setup>
import { VIURTUAL_SPORT, VIRTUAL_PLAY_NOT_NUMBER2, VIRTUAL_SPORT_ID } from "src/core/constant/config/play-mapping.js";
import { format_odds, format_currency, formatTime } from "src/core/format/index.js"
import { i18n_t } from "src/boot/i18n.js"
import UserCtr from "src/core/user-config/user-ctr.js"
import lodash_ from "lodash"
const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  item: {},
  order: {},

})

const socre_format = () => {

}

const show_score_info = () => {
}
const handicap_name = () => { }


const bet_result = () => { }

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
      text = i18n_t(`common_lang.zh.bet.morning_session`); //"早盘赛事";
      break;
    case 2:
      text = i18n_t(`common_lang.zh.bet.bowls`); //"滚球盘赛事";
      break;
  }
  return text;
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
  white-space: normal;
  word-break: break-all;
}

/**对阵信息后面加的那个提示*/
.bet-bg-tooltip {
  background: #A3AFBF;
  color: #FFFFFF;
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

