<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 单住投注项信息组件
-->
<template>
  <q-card flat class="bet-single-record">
    <q-card-section
      class="bet-item"
      :class="{
        'bet-fail-bg':(single_record_obj.orderStatusCode==0),
        'bet-success-bg':(single_record_obj.orderStatusCode==1),
        'bet-confirm-bg':(single_record_obj.orderStatusCode==2)
      }">
      <!--虚拟足球,虚拟篮球,英雄联盟,刀塔2,CSGO,王者荣耀-->
      <template v-if="[
        play_mapping.VIURTUAL_SPORT.football,
        play_mapping.VIURTUAL_SPORT.basketball,
        play_mapping.ESPORTS_SPORT.lol,
        play_mapping.ESPORTS_SPORT.dota2,
        play_mapping.ESPORTS_SPORT.csgo,
        play_mapping.ESPORTS_SPORT.king
      ].includes(sport_id)">
        <div class="row">
          <div class="col bet-name-info">
            <!--联赛名称 轮次 批次号-->
            <span>{{single_record_obj.matchName}}</span><span>{{single_record_obj.matchDay}} {{single_record_obj.batchNum}}</span>
          </div>
          <div class="col-auto bet-icon-info">
            <template v-if="single_record_obj.orderStatusCode==0">
              <icon name="icon-failure" size="18px"/>
            </template>
            <template v-if="single_record_obj.orderStatusCode==1">
              <icon name="icon-success" size="18px"/>
            </template>
            <template v-if="single_record_obj.orderStatusCode==2">
              <span class="bet-confirm-handle"><img :src="(`${$g_image_preffix}/image/wwwassets/yabo/gif/${vx_get_theme}/${vx_get_theme}_confirming.gif`)" style="height:18px;width:18px" /></span>
            </template>
          </div>
        </div>
        <template v-if="show_home_away">
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
      <!--虚拟赛马,虚拟赛狗,虚拟摩托,泥地摩托-->
      <template v-else-if="[
        play_mapping.VIURTUAL_SPORT.horse,
        play_mapping.VIURTUAL_SPORT.dog,
        play_mapping.VIURTUAL_SPORT.mudland_motorcycle,
        play_mapping.VIURTUAL_SPORT.motorcycle
      ].includes(`${sport_id}`)">
        <div class="row">
          <div class="col bet-name-info2">
            <!--联赛名称 批次号-->
            <span>{{single_record_obj.matchName}}</span><span>{{single_record_obj.batchNum}}</span>
          </div>
        </div>
      </template>
      <div class="bet-content">
        <div class="row no-wrap">
          <div class="col bet-play-game">
            <label class="bet-play-text">{{single_record_obj.playName}}
              <label class="bet-handicap-name">[{{$root.$t('odds')[single_record_obj.marketType]}}]</label>
            </label>
          </div>
        </div>
        <!--队名及盘口区域-->
        <div class="row">
          <div class="col bet-play-team yb-fontsize14">
            <!--虚拟赛马,虚拟赛狗,虚拟摩托,泥地摩托-->
            <template v-if="[
              play_mapping.VIURTUAL_SPORT.horse,
              play_mapping.VIURTUAL_SPORT.dog,
              play_mapping.VIURTUAL_SPORT.mudland_motorcycle,
              play_mapping.VIURTUAL_SPORT.motorcycle
            ].includes(`${sport_id}`) && !play_mapping.VIRTUAL_PLAY_NOT_NUMBER2.includes(play_id)">
              <!--卡赫利赛哈特-->
              <template v-for="num in get_numbers()">
                <div :key="num" :class="[`ranking-icon ranking-bg-style1-${num}`, `csid-${sport_id}`]"></div>
              </template>
            </template>
            <template v-if="!play_mapping.VIRTUAL_PLAY_NOT_NUMBER.includes(play_id) && !_.isEmpty(single_record_obj.playOptionName)">
              <!--投注项名称-->
              <span class="part-one">{{part1}}</span><span class="part-two">{{_.trim(part2)}}</span>
            </template>
          </div>
        </div>
        <div class="row">
          <div
              class="col yb-fontsize16 bet-odds-value"
              :class="{
                'up-red': odds_change_up,
                'down-green': odds_change_down
              }"
            ><span class="odds-value yb-number-bold"><!--赔率--><span>@</span>{{single_record_obj.oddsValues | format_odds}}</span></div>
        </div>
      </div>
      <div class="row bet-win yb-fontsize12">
        <div class="col">
          <!--投注额-->
          {{$root.$t('common.bets_val')}}
        </div>
        <div class="col-auto">
         {{$root.$t('common.maxn_amount_val')}}
         <!-- 最高可赢额 -->
        </div>
      </div>
      <div class="row bet-win2 yb-fontsize12">
        <div class="col black-money-text">
           {{(parseFloat(single_record_obj.betMoney)/100)|format_currency}}
        </div>
        <!--¥300.00-->
        <div class="col-auto black-money-text">
          {{(parseFloat(single_record_obj.maxWinMoney)/100)|format_currency}}
        </div>
        <!--¥180.00-->
      </div>
      <template v-if="is_indonesia">
        <div class="row bet-win-money yb-fontsize12">
          <div class="col">
            <div class="bet-addition">
              [
              {{(parseFloat(single_record_obj.addition)/100)|format_currency}}
              ]
            </div>
          </div>
          <!--¥300.00-->
          <div class="col-auto"></div>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>
<script>
import bet_single_record from "src/public/mixins/virtual_bet/bet_single_record";
export default {
  mixins: [bet_single_record],
  data() {
    return {
      
    }
  },
};
</script>
<style lang="scss" scoped>
/*  卡片失去焦点时的样式 */
.bet-single-record {
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
    .row {
      margin: 0;
      padding-left: 10px;
      padding-right: 10px;
      .col {
        margin: 0;
        padding: 0;
      }
    }
  }
  .bet-item {
    padding-top:10px;
    margin-top: 0px;
    ::v-deep i.con-bet_fail,
    ::v-deep i.icon-bet_success,
    ::v-deep i.icon-bet_confirm {
      margin-left: -20px;
    }

    /*  确认中的样式 */
    .bet-confirm-handle {
      position: relative;
      margin-right: 5px;
      top: -2px;
    }

    /*  玩法及队名部分样式 */
    .bet-play-game {
      display: flex;
      align-items: flex-start;
      word-break: break-word;

      .bet-match-playing {
        margin-right: 5px;
        margin-top: 2px;
        white-space: nowrap;
      }
      /*  盘口名称 */
      .bet-handicap-name {
        margin-left: 5px;
        margin-top: 2px;
        white-space: pre-wrap;
      }
    }

    /*  队伍名称 */
    .bet-play-team {
     /* display: flex;
      align-items: flex-start;*/
      .ranking-icon {
        width: 20px;
        height: 20px;
        margin-right: 2px;
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
