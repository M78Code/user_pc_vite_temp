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
        <div class="col">{{in8n_t('bet.bet_booking')}}</div>
        <div class="cursor-pointer col right" @click.stop="cancel_appoint">{{in8n_t('select.cancel')}}</div>
      </div>
      <div class="row appoint-status" v-if="[2, 3].includes(appoint_status) && appoint_order_status==2">
        <!--预约失败-->
        <div class="col">{{in8n_t('bet.bet_book_failed')}}</div>
      </div>
      <div class="row appoint-status" v-if="appoint_status==4 && appoint_order_status==2">
        <!--已取消-->
        <div class="col">{{in8n_t('bet.bet_book_canceled')}}</div>
      </div>
    </template>
    
    <template v-if="play_mapping.VIRTUAL_SPORT_ID.includes(`${order.sportId}`)">
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
            play_mapping.VIURTUAL_SPORT.football,
            play_mapping.VIURTUAL_SPORT.basketball
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
        play_mapping.VIURTUAL_SPORT.football,
        play_mapping.VIURTUAL_SPORT.basketball
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
          <template v-if="play_mapping.VIRTUAL_SPORT_ID.includes(`${order.sportId}`)">
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
        play_mapping.VIURTUAL_SPORT.horse,
        play_mapping.VIURTUAL_SPORT.dog,
        play_mapping.VIURTUAL_SPORT.mudland_motorcycle,
        play_mapping.VIURTUAL_SPORT.motorcycle
        ].includes(`${order.sportId}`) 
        && order_status==1">
        <div class="row">
          <div class="col bet-against">
            <!--赛果 比分-->
            {{in8n_t('bet.bet_result')}} {{order.settleScore}}
          </div>
        </div>
      </template>    
      <div class="row">
        <div class="col bet-play-team">
          <!--虚拟赛马,虚拟赛狗,虚拟摩托车,泥地摩托车玩法显示数字样式-->
          <template v-if="[
            play_mapping.VIURTUAL_SPORT.horse,
            play_mapping.VIURTUAL_SPORT.dog,
            play_mapping.VIURTUAL_SPORT.mudland_motorcycle,
            play_mapping.VIURTUAL_SPORT.motorcycle
          ].includes(`${order.sportId}`)">
            <template v-if="!play_mapping.VIRTUAL_PLAY_NOT_NUMBER2.includes(`${order.playId}`)">
              <template v-for="num in get_numbers()">
                <div :key="num" :class="[`ranking-icon ranking-bg-style1-${num}`, `csid-${order.sportId}`]"></div>              
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
            <div class="book-msg">{{ cancel_book_msg(order.matchInfo, in8n_t('bet.bet_book_cancel_msg')) }}</div>
          </q-card-section>

          <q-card-actions align="center">
            <div class="cursor-pointer book-record book-record-cancel" :disabled="book_loading" @click="close_book_dialog">
              <!--确认中-->
              {{in8n_t('select.cancel')}}
            </div>
            <div class="cursor-pointer book-record book-record-submit" :disabled="book_loading" @click="cancel_book_handle">
              <!--确认中-->
              {{in8n_t('select.confirm')}}
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </div>
</template>
<script>
// import bet_book_item from "src/public/mixins/bet_record_view/bet_book_item.js";
import { i18n_t, i18n_tc } from "src/boot/i18n.js"
export default {
  mixins: [bet_book_item]
};
</script>
<style lang="scss" scoped>
// 英文和泰语可能会换行
.bet-name-info {
  white-space:normal; 
  word-break:break-all;
}
</style>

