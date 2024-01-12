
<template>
  <q-card flat class="bet-mix-record-item-card">
    <!--玩法,提示及删除区域-->
    <q-card-section>
      <div class="row" v-if="match_type!=3">
        <div class="col bet-league-name">
          <!--联赛名称-->
          {{league_name}}
        </div>
      </div>      
      <div class="row">
        <div class="col bet-against">
          <!--主队 v 客队-->
          <span class="home-vs-away">
            {{home}}<span class='bet-pk'>v</span>{{away}}
          </span>
        </div>
      </div>
      <div class="row" v-if="match_type!=3">
        <div class="col match-time">{{match_time}}</div>
      </div>
      <div class="bet-content">
        <div class="row">
          <div class="col bet-play-game">
            <!--玩法名称以及盘口-->
            <label class="bet-play-text"><template v-if="match_type===2"><label class="bet-match-playing">[{{ i18n_t('menu.match_playing')}}]</label></template>{{lodash.trim(item_obj.playName)}}<template v-if="item_obj.scoreBenchmark!='' && match_type===2">({{item_obj.scoreBenchmark.replace(':','-')}})</template><label class="bet-handicap-name">[{{ i18n_t('odds')[item_obj.marketType]}}]</label></label>
          </div>
          <div class="col-auto"></div>
        </div>
        <div class="row no-wrap">
          <div class="col bet-play-team yb-fontsize14">
            <!--投注项名称(可能待盘口值或者比分等)-->
            <template v-if="!lodash.isEmpty(item_obj.playOptionName)">
              <span class="part-one">{{part1}}</span><span class="part-two">{{lodash.trim(part2)}}</span>
            </template>
          </div>
        </div>
        <div class="row">
          <!--赔率-->        
          <div
            class="col yb-fontsize16 bet-odds-value"
            :class="{
              'up-red': odds_change_up, 
              'down-green': odds_change_down
            }"
          ><span class="odds-value yb-number-bold"><span>@</span>{{  format_odds(odds_value) }}</span></div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
// import bet_mix_record_item from "src/public/mixins/bet/bet_mix_record_item.js";
import { format_odds  } from "src/output/index.js";
import lodash from 'lodash'

const props = defineProps({
  item_obj:{}
})

</script>
<style lang="scss" scoped>
/*  卡片样式 */
:deep(.q-card) {
  border: 0px;
}
/**串关投注项信息组件卡片*/
.bet-mix-record-item-card {
  padding: 15px 10px;

  /* *卡片组件样式重写* */
  :deep(.q-card__section ) {
    margin: 0;
    padding: 0;
    line-height: 1;
  }

  /*  玩法及队名部分样式 */
  .bet-play-game {
    display: flex;
    align-items: flex-start;
    padding: 0;
    margin: 0;
    word-break: break-word;
  }
  /*  投注项名称 */
  .bet-play-team {
    display: flex;
    align-items: center;
    padding-right: 5px !important;
    min-height: 20px;
  }

  /*  赔率的样式 */
  .bet-odds-value {
    display: inline-block;
    text-align: right;
  }
}
</style>