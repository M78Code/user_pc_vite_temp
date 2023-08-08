<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注项信息组件 虚拟体育
-->
<template>
  <div :id="'bet_'+id">
  <q-card
    flat
    class="relative-position bet-mix-item-card"
    :class="{'bet-no-effect':!(active==1 || active==4) || serial_type==0 || !is_serial || match_update}"
  >
    <!--玩法,提示及删除区域-->
    <q-card-section>
      
      <!--虚拟足球，虚拟篮球，英雄联盟，刀塔，CSGO, 王者荣耀-->   
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
            <!--赛季 编码 批次-->
            <span>{{season}}</span><span>{{no}} {{batch_no}}</span>
          </div>
          <!--删除按钮-->
          <div class="col-auto">          
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
            <!--主队 v 客队-->
            <span class="home-vs-away">
              {{home}}<span class='bet-pk'>v</span>{{away}}
            </span>
          </div>
        </div>
      </template>
      <!--虚拟赛马,虚拟赛狗,虚拟摩托,泥地摩托-->
      <template v-else-if="[
        play_mapping.VIURTUAL_SPORT.horse,
        play_mapping.VIURTUAL_SPORT.dog,
        play_mapping.VIURTUAL_SPORT.mudland_motorcycle,
        play_mapping.VIURTUAL_SPORT.motorcycle
      ].includes(sport_id)">
        <div class="row">
          <div class="col bet-name-info2">
            <!--赛季 编号-->
            <span>{{season}}</span><span>{{no}}</span>
          </div>
          <!--删除按钮-->
          <div class="col-auto">          
            <icon
              size="12px"
              name="icon-del"
              class="bet-del"
              @click="del_bet_item"
              v-if="is_close"
            />
          </div>
        </div>      
      </template>
      <div class="bet-content">
        <div class="row">
          <div class="col bet-play-game">
            <!--玩法以及盘口名称-->
            <label class="bet-play-text">{{play_name}}<label class="bet-handicap-name">{{handicap_name}}</label></label>          
          </div>
        </div>
        <!--队名及盘口区域-->
        <div class="row no-wrap">
          <div class="col bet-play-team">         
            <!--虚拟足球，虚拟篮球，英雄联盟，刀塔, CSGO, 王者荣耀-->
            <template v-if="[
              play_mapping.VIURTUAL_SPORT.football, 
              play_mapping.VIURTUAL_SPORT.basketball,
              play_mapping.ESPORTS_SPORT.lol,
              play_mapping.ESPORTS_SPORT.dota2,
              play_mapping.ESPORTS_SPORT.csgo,
              play_mapping.ESPORTS_SPORT.king
            ].includes(sport_id)">
              <label class="bet-team-handicap">            
                <template v-if="handicap!==''">
                  <!--投注项名称-->
                  {{team_name}}
                  <template v-if="team_name!=handicap">
                    <label class="yb-number-bold handicap" :class="{'bet-handicap': handicap_change}">
                      <!--盘口-->
                      {{handicap}}               
                    </label>
                  </template>
                </template>
                <template v-else>
                  <!--投注项名称-->
                  {{_.trim(team_name)}}
                </template>              
              </label>
            </template>       
            <template v-else>
              <!--虚拟体育需要显示数字的玩法-->
              <template v-if="play_mapping.VIRTUAL_PLAY_NUMBER.includes(play_id)">
                <template v-for="num in get_numbers()">
                  <!--数字样式显示-->
                  <div :key="num" :class="[`ranking-icon ranking-bg-style1-${num}`, `csid-${sport_id}`]"></div>
                </template>
              </template>
              <!--投注项名称-->
              {{_.trim(team_name)}}
            </template>
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
            <!--1.87-->
            <span class="odds-value yb-number-bold">
              <span>@</span>{{odds_value | format_odds}}
            </span>
          </div>
          <div class="auto-col" v-if="!(active == 1 || active == 4)">
            <span class="invalid">
              {{$root.$t('common.invalid')}}
              <!-- 无效 -->
            </span>
          </div>
        </div>
      </div>      
    </q-card-section>
  </q-card>
  </div>
</template>
<script>
// import bet_mix_item from "src/public/mixins/virtual_bet/bet_mix_item.js";

</script>
<style lang="scss" scoped>
/*  卡片样式 */
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
        .bet-play-text {
          .bet-handicap-name {
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
        /*  盘口值 */
        .bet-team-handicap {
          display: block;
          line-height: 1.3;
          .bet-handicap {
            text-align: center;
            padding: 0px 5px;
          }
        }
        .ranking-icon {
          width: 20px;
          height: 20px;
          margin-right: 2px;
        }
      }
    }
  }

  /*  赔率的样式 */
  .bet-odds-value {
    display: inline-block;
    /*  默认赔率 */
    .odds-value {
      position: relative;
    }

    /*  赔率无效样式 */
    .invalid {
      padding: 2px 5px;
    }
  }

  /*  删除按钮  */
  .bet-del {
    z-index: 20;
    top: 0px;
  }
}
</style>