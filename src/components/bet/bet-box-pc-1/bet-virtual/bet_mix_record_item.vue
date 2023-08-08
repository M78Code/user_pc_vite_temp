<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注项信息组件
-->
<template>
  <q-card flat class="bet-mix-record-item-card">
    <!--玩法,提示及删除区域-->
    <q-card-section>      
      <!--虚拟足球,虚拟篮球 英雄联盟，dota2，王者荣耀-->      
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
            <span>{{item_obj.matchName}}</span><span>{{item_obj.matchDay}} {{item_obj.batchNum}}</span>
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
      </template>
      <!--虚拟赛马,虚拟赛狗,虚拟摩托车,泥地摩托车-->
      <template v-else-if="[
        play_mapping.VIURTUAL_SPORT.horse,
        play_mapping.VIURTUAL_SPORT.dog,
        play_mapping.VIURTUAL_SPORT.mudland_motorcycle,
        play_mapping.VIURTUAL_SPORT.motorcycle
      ].includes(`${sport_id}`)">
        <div class="row">
          <div class="col bet-name-info2">
            <!--联赛名称 批次号-->
            <span>{{item_obj.matchName}}</span><span>{{item_obj.batchNum}}</span>
          </div>
        </div>      
      </template>
      <div class="bet-content">
        <div class="row">
          <div class="col bet-play-game">
            <!--玩法名称-->
            <label class="bet-play-text">{{_.trim(item_obj.playName)}}<label 
            class="bet-handicap-name"><!--盘口类型-->[{{$root.$t('odds')[item_obj.marketType]}}]</label></label>          
          </div>
          <div class="col-auto"></div>
        </div>
        <!--队名及盘口区域-->
        <div class="row no-wrap">
          <div class="col bet-play-team">
            <!---数字样式-->
            <template v-if="is_individual_play && 
            !play_mapping.VIRTUAL_PLAY_NOT_NUMBER2.includes(play_id)">
              <!--卡赫利赛哈特-->   
              <template v-for="num in get_numbers()">
                <div :key="num" :class="[`ranking-icon ranking-bg-style1-${num}`, `csid-${sport_id}`]"></div>
              </template>
            </template>
            <template v-if="!play_mapping.VIRTUAL_PLAY_NOT_NUMBER.includes(play_id) && !_.isEmpty(item_obj.playOptionName)">
              <!--投注项名称-->
              <span class="part-one">{{part1}}</span><span class="part-two">{{_.trim(part2)}}</span>
            </template>
          </div>
        </div>
        <div class="row">
          <div class="col bet-odds-value"
            :class="{
            'up-red': odds_change_up, 
            'down-green': odds_change_down
            }">
            <!--赔率-->              
            <span class="odds-value yb-number-bold"><span>@</span>{{odds_value | format_odds}}</span>
          </div>
        </div>
      </div>      
    </q-card-section>
  </q-card>
</template>
<script>
// import bet_mix_record_item from "src/public/mixins/virtual_bet/bet_mix_record_item.js";
// export default {
//   // 投注记录投注项组件
//   mixins: [bet_mix_record_item]
// };
</script>
<style lang="scss" scoped>
/*  卡片样式 */
.bet-mix-record-item-card {
  padding: 15px 10px;

  /* *卡片组件样式重写* */
  ::v-deep .q-card__section {
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
    .bet-play-text {
      color: #5a6074;
      /*  盘口名称 */
      .bet-handicap-name {
        color: #58a6ff;
        margin-left: 5px;
        white-space: pre-wrap;
      }
    }
  }
  /*  投注项名称 */
  .bet-play-team {
    display: flex;
    align-items: center;
    padding-right: 5px !important;
    min-height: 20px;
    .ranking-icon {
      width: 20px;
      height: 20px;
      margin-top: -2px;
      margin-right: 2px;
    }
  }
}
</style>