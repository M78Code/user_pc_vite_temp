<!--
 * @Description: 单住投注项信息组件 正常
-->
<template>
  <q-card flat class="bet-single-record">
    <q-card-section class="bet-item">
      <div class="row first-row no-wrap" v-if="match_type != 3">
        <div class="col bet-league-name">
          <!--联赛名称-->
          {{league_name}}
        </div>
        <!--orderStatusCode: 0:投注失败 1:投注成功 2:确认中-->
        <div class="col-auto bet-icon-info">
          <template v-if="single_record_obj.orderStatusCode == 0">
            <!--投注失败图标-->
            <icon name="icon-failure" size="18px"/>
          </template>
          <template v-if="single_record_obj.orderStatusCode == 1">
            <!--投注成功图标 绿色的勾勾-->
            <icon name="icon-success" size="18px"/>
          </template>
          <template v-if="single_record_obj.orderStatusCode == 2">
            <!--投注确认中转圈，滚球才有的转圈圈-->
            <span class="bet-confirm-handle"><img :src="(`${$g_image_preffix}/image/wwwassets/yabo/gif/${vx_get_theme}/${vx_get_theme}_confirming.gif`)" style="height:18px;width:18px" /></span>
          </template>
        </div>
      </div>
      <div class="row">
        <div class="col bet-against" :class="{'bet-outweight':match_type == 3}">
          <!--如果是冠军显示赛季-->
          <template v-if="match_type == 3">{{season}}</template>
          <template v-else>
            <!--不是冠军显示 主队 v 客队-->
            <span class="home-vs-away">
              {{home}}<span class='bet-pk'>v</span>{{away}}
            </span>
          </template>
        </div>
      </div>
      <div class="row" v-if="match_type != 3">
        <!--时间例如 06月22日-->
        <div class="col match-time">{{match_time}}</div>
      </div>
      <div class="bet-content">
        <div class="row">
          <!--match_type 1: 早盘 2: 滚球  玩法名称  比分  盘口类型-->
          <label class="bet-play-text"><template v-if="match_type === 2"><label class="bet-match-playing">[{{i18n.t('menu.match_playing')}}]</label></template>{{single_record_obj.playName}}
            <template v-if="single_record_obj.scoreBenchmark!=''
            && match_type===2 &&
            !((single_record_obj.preOrderDetailStatus != null) && play_mapping.MARKET_RANG_FLAG_LIST.includes(vx_get_pre_bet_list.playId.toString())) &&!
            play_mapping.MARKET_NO_SCORE_LIST.includes(play_id)">
              ({{single_record_obj.scoreBenchmark.replace(':','-')}})
            </template>
             <!--盘口类型-->
            <label class="bet-handicap-name">[{{i18n.t('odds')[single_record_obj.marketType]}}]</label>
          </label>
        </div>
        <!--队名及盘口区域-->
        <div class="row">
          <div class="col bet-play-team yb-fontsize14">
            <!--投注项名称(可能待盘口值或者比分等)-->
            <template v-if="!_.isEmpty(single_record_obj.playOptionName)">
              <div class="bet-team-handicap">
                {{part1}} {{_.trim(part2)}}
              </div>
              <!-- <span class="part-one">{{part1}}</span><span class="part-two">{{_.trim(part2)}}</span> -->
            </template>
          </div>
        </div>
        <div class="row">
          <!--赔率-->
          <div
            class="col-auto yb-fontsize16 bet-odds-value"
            :class="{
              'up-red': odds_change_up,
              'down-green': odds_change_down
            }"
          ><span class="odds-value yb-number-bold"><span>@</span>{{single_record_obj.oddsValues || format_odds}}</span></div>
        </div>
      </div>

      <div class="row bet-win yb-fontsize12">
        <div class="col" v-if="single_record_obj.preOrderDetailStatus == 0 || single_record_obj.preOrderDetailStatus == 1">
          <!--投注额-->
          {{i18n.t("bet.bet_book_stake")}}
        </div>
        <div class="col" v-else>
          <!--投注额-->
          {{i18n.t('common.bets_val')}}
        </div>
        <div class="col-auto">
         {{i18n.t('common.maxn_amount_val')}}
         <!-- 最高可赢额 -->
        </div>
      </div>
      <div class="row bet-win2 yb-fontsize12">
        <!--投注额值-->
        <div class="col black-money-text">
           {{(parseFloat(single_record_obj.betMoney)/100)||format_currency}}
        </div>
        <!-- 最高可赢额值 -->
        <div class="col-auto black-money-text">
          {{(parseFloat(single_record_obj.maxWinMoney)/100)||format_currency}}
        </div>
      </div>
      <template v-if="is_indonesia">
        <div class="row bet-win-money yb-fontsize12">
          <div class="col">
            <div class="bet-addition">
              [
              {{(parseFloat(single_record_obj.addition)/100)||format_currency}}
              ]
            </div>
          </div>
          <div class="col-auto"></div>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>
<script>
// import bet_single_record from "src/public/mixins/bet/bet_single_record";

</script>
<style lang="scss" scoped>
.mt5 {
  margin-top: 5px;
}
.fillet {
  border-radius: 4px;
}
/**最后一个投注项*/
.last-item {
  .bet-item {
    border-radius: 4px 4px 0px 0px !important;
  }
}
/*  卡片失去焦点时的样式 */
.bet-single-record {
  padding: 0 15px 15px;
  ::v-deep .q-card__actions {
    display: flex;
    flex-wrap: nowrap;
    padding: 0;
    margin-top: -15px;
    justify-content: space-between;
    cursor: pointer;
    margin-left: -15px;
    margin-right: -15px;
    padding-left: 10px;
    padding-right: 10px;
  }
  /*  单关投注记录标题 */
  .bet-record-title {
    font-size: 13px;
    height: 30px;
    line-height: 30px;
    i {
      margin-top: -1px;
    }
  }
  /*  卡片组件样式重写 */
  ::v-deep .q-card__section {
    margin: 0;
    padding: 0;
    border: 0;
  }
  /**下注失败成功转圈圈图标*/
  .bet-icon-info {
    margin: 0;
    padding: 0;
    height: 18px;
  }
  /**整个投注项*/
  .bet-item {
    margin: -15px;
    margin-top: 0px;
    .row {
      padding: 0;
      margin: 0;
    }
    ::v-deep i.con-bet_fail,
    ::v-deep i.icon-bet_success,
    ::v-deep i.icon-bet_confirm {
      margin-left: -20px;
    }

    /*  确认中的样式 */
    .bet-confirm-handle {
      position: relative;
      top: -2px;
    }

    /*  玩法及队名部分样式 */
    .bet-play-game {
      display: flex;
      align-items: flex-start;
      word-break: break-word;

      /*  盘口名称 */
      .bet-handicap-name {
        margin-top: 2px;
        white-space: pre-wrap;
      }
    }

    /*  队伍名称 */
    .bet-play-team {
      /*display: flex;
      align-items: flex-start; */
      /**第二部分*/
      .part-two{
        width:40px
      }
    }
  }

  /*  最高可赢额值 */
  .bet-win2 {
    padding-bottom: 5px;
  }
  /*  最高可赢额金额  */
  .bet-win-money {
    margin-top: -3px;
  }
}
</style>
