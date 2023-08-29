
<template>
  <!--active 1 开盘 4 锁盘-->
  <q-card
    flat
    class="relative-position bet-mix-item-card"
    :class="{'bet-no-effect':!(active == 1 || active == 4) || !(is_serial && serial_type) || match_update}"
  >
    <!--玩法,提示及删除区域-->
    <q-card-section>
      <!--不是冠军-->
      <div class="row" v-if="match_type != 3">
        <div class="col bet-league-name">
          <!--联赛名称-->
          {{league_name}}
        </div>
        <div class="col-auto">
          <!--删除按钮-->
          <icon
            size="12px"
            name="icon-del"
            class="bet-del"
            @click="del_bet_item"
            v-if="is_close"
          />
        </div>
      </div>
      <div class="row">
        <div class="col bet-against">
          <!--冠军赛的模板id为18-->
          <template v-if="match_type == 3">
            {{season}}
          </template>
          <template v-else>
            <!--主队v客队-->
            <span class="home-vs-away">
              <!--主客队队名-->
              {{home}}<span class='bet-pk'>v</span>{{away}}
            </span>
            <!--足,蓝,棒,乒,排-->
            <span v-if="[1,2,3,8,9].includes(sport_id*1) && timerly_basic_score">({{timerly_basic_score}})</span>
          </template>
        </div>
      </div>
      <div class="row" v-if="market_type!=0">
        <div class="col match-time">
          <!--赛事时间-->
          {{match_time}}
        </div>
      </div>
      <div class="bet-content">
        <div class="row">
          <div class="col bet-play-game">
            <!--盘口类型，盘口名称，比分的显示 market_type 0 滚球-->
            <label class="bet-play-text"><template v-if="market_type === 0"><label class="bet-match-playing">{{i18n.t('menu.match_playing')}}</label></template>{{play_name}}<template v-if="basic_score">({{basic_score}})</template><label class="bet-handicap-name">{{handicap_name}}</label></label>
          </div>
        </div>
        <!--队名及盘口区域-->
        <div class="row no-wrap">
          <div class="col bet-play-team">
            <!--卡赫利赛哈特 -0.5-->
            <label class="bet-team-handicap">
              <template v-if="handicap!==''">{{_.trim(team_name)}}<template v-if="team_name!=handicap"><label class="handicap yb-number-bold bet-text-nowrap" :class="{'margin-left-0': team_name=='','bet-handicap': handicap_change}">{{handicap}}</label></template>
              </template>
              <template v-else>
                <!--所选的投注项名称-->
                {{_.trim(team_name)}}
              </template>
            </label>
          </div>
        </div>
        <div class="row">
          <div
            class="col bet-odds-value"
            :class="{
              'up-red': odds_change_up,
              'down-green': odds_change_down
            }"
          >
            <!--@1.87-->
            <span class="odds-value yb-number-bold">
              <span>@</span>{{odds_value || format_odds}}
            </span>
          </div>
          <!--右侧无效按钮  当active不是激活和锁盘时-->
          <div class="auto-col" v-if="!(active == 1 || active == 4)">
            <span class="invalid">
              {{i18n.t('common.invalid')}}
              <!-- 无效 -->
            </span>
          </div>
          <div class="auto-col" v-else-if="!serial_type">
            <span class="invalid serial-msg">
                <!--不支持串关-->
                {{i18n.t('bet.no_support_serial')}}
              </span>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import {format_odds} from'src\core\format\index.js'
</script>
<style lang="scss" scoped>
/*  卡片样式 总的*/
.bet-mix-item-card {
  padding: 15px 10px;
  padding-bottom: 0px;
  /* *卡片组件样式重写* */
  ::v-deep .q-card__section {
    margin: 0;
    padding: 0;
    line-height: 1;
    .row {
      /*  玩法及队名部分样式 */
      .bet-play-game {
        display: flex;
        align-items: flex-start;
        padding: 0;
        margin: 0;
        word-break: break-word;
        /*  弹出tips的样式 */
        .bet-play-text {
          .bet-match-playing {
            margin-right: 5px;
            margin-top: 2px;
            white-space: nowrap;
          }

          /*  盘口名称设置 */
          .bet-handicap-name {
            margin-top: 2px;
            white-space: pre-wrap;
          }
        }
      }
      /*  队伍名称 */
      .bet-play-team {
        display: flex;
        align-items: center;
        padding-right: 5px !important;
        min-height: 20px;
        /*  队伍名称 和 盘口值 */
        .bet-team-handicap {
          display: block;
          word-break: break-all;
          line-height: 1.3;
          /* 盘口值 -0.5 */
          label {
            margin-left: 5px;
            word-break: break-word;
            &.bet-handicap {
              text-align: center;
              padding: 0px 5px;
            }
            &.margin-left-0 {
              margin-left: 0px;
            }
            &.bet-text-nowrap {
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  /*  删除按钮  */
  .bet-del {
    z-index: 20;
    top: 0px;
  }
}
</style>
