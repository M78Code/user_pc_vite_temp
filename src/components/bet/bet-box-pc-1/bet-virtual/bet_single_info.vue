<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 单住投注项信息组件
-->
<template>
  <!--单关投注项信息组件-->
  <q-card 
    flat 
    class="relative-position bet-card"
    :class="{'bet-no-effect':!(active==1 || active==4)}"
  >
    <!--玩法,提示及删除区域-->
    <q-card-section>      
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
          <div class="col bet-name-info ">
            <!-- 冠军玩法联赛赛季名称 批次号 批次-->
            <span>{{season}}</span><span>{{no}} {{batch_no}}</span>
          </div>
          <!--删除按钮-->
          <div class="col-auto col-delete">
            <icon
              size="12px"
              name="icon-del"
              class="bet-del"
              @click="del_bet_item"
            />
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
      <!--虚拟赛马,虚拟赛狗,虚拟摩托车,泥地摩托车-->
      <template v-else-if="[
        play_mapping.VIURTUAL_SPORT.horse,
        play_mapping.VIURTUAL_SPORT.dog,
        play_mapping.VIURTUAL_SPORT.mudland_motorcycle,
        play_mapping.VIURTUAL_SPORT.motorcycle
      ].includes(sport_id)">
        <div class="row">
          <div class="col bet-name-info2">
             <!-- 冠军玩法联赛赛季名称 批次-->
            <span>{{season}}</span><span>{{no}}</span>
          </div>
          <!--删除按钮-->
          <div class="col-auto">          
            <icon
              size="12px"
              name="icon-del"
              class="bet-del"
              @click="del_bet_item"
            />
          </div>
        </div>      
      </template>
      <!--下注内容-->
      <div class="bet-content">
        <div class="row">
          <div class="col bet-play-game">
            <!--玩法名称 盘口名称-->
            <label class="bet-play-text">{{play_name}}<label class="bet-handicap-name">{{handicap_name}}</label></label>       
          </div>        
        </div>
        <!--队名及盘口区域-->
        <div class="row no-wrap" :class="{'mt10':menu_data.is_esports_champion}">
          <div
            class="col bet-play-team  yb-fontsize13"
          >
            <!--虚拟足球,虚拟篮球,英雄联盟,刀塔2,CSGO,王者荣耀-->
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
                  <template v-if="!menu_data.is_esports || (menu_data.is_esports && !_.startsWith(handicap, team_name))">
                    <!--队伍名称-->
                    {{team_name}}
                  </template>
                  <template v-if="team_name!=handicap">
                    <label class="yb-number-bold handicap" :class="{'bet-handicap': handicap_change}">
                      <!--盘口名称-->
                      {{handicap}}               
                    </label>
                  </template>
                </template>
                <template v-else>
                  <!--队伍名称-->
                  {{_.trim(team_name)}}
                </template>              
              </label>
              <!--+/1.5-->
            </template>       
            <template v-else>
              <template v-if="play_mapping.VIRTUAL_PLAY_NUMBER.includes(play_id)">
                <template v-for="num in get_numbers()">
                  <div :key="num" :class="[`ranking-icon ranking-bg-style1-${num}`, `csid-${sport_id}`]"></div>
                </template>
              </template>
              <!--队伍名称-->            
              <div class="ranking-team-name">{{_.trim(team_name)}}</div>
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
            <!--投注赔1.87-->
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
      <!--金额输入区域-->
      <div class="row bet-single-input">
        <div class="col relative-position" :data-check-money="view_ctr_obj.single_range_money">
          <template v-if="!(active==1 || active==4)">
            <div class="cathectic-shade"></div>
          </template>
          <currency-input 
            :ref="'input-'+id"
            :id="DOM_ID_SHOW && `but-bet-single-${index}`"
            class="bet-input input-border"
            :class="{'input-money': !is_empty_money,'input-border-red':![-4,0].includes(view_ctr_obj.single_range_money)}"
            :placeholder="`${$root.$t('bet.money_range')} ${ min_money.replace(/\B(?=(\d{3})+$)/g, ',')} ~ ${max_money.replace(/\B(?=(\d{3})+$)/g, ',')}`"
            v-model="money"
            :value="money"
            @keyup="keyup_handle"  
            :distractionFree="{
              hideCurrencySymbol: true
            }"
            :precision="{
              min:0,
              max:has_input_integer? 0:2
            }"
            :valueRange="value_range"
            :currency="null"
            autocomplete="off"
            maxLength="11"
            locale="zh"/>
          <!--清除输入金额按钮-->
          <div class="bet-input-close" @click.stop="bet_clear_handle" v-show="!is_empty_money"><icon name="icon-failure" size="12px"/></div>      
        </div>           
      </div>
      <div class="row bet-win yb-fontsize12">
        <div class="col df-jb">
          <!--最高可赢额-->
          {{$root.$t('common.maxn_amount_val')}}
        </div>
        <!--最高可赢-->
        <div class="col-auto bet-win-money yb-number-bold">{{get_max_win_money()| four_five_six_double(2) | format_currency}}</div>
      </div>
    </q-card-section>
    <!--投注键盘区域-->
    <q-card-section class="bet-keyboard-zone">
      <!--键盘区域-->
      <div class="row bet-keyboard bet-keyboard-content">
        <div class="col">
          <bet-keyboard
            ref="bet-keyboard"
            @keypress_handle="keypress_handle"
            @update_keyboard="update_keyboard"
            @input_max_money="input_max_money"
            :keyboard_data="keyboard_data"
            :status = "active"
          ></bet-keyboard>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import bet_single_info from "src/public/mixins/virtual_bet/bet_single_info.js";
export default {
  mixins: [bet_single_info]
};
</script>
<style lang="scss" scoped>
/* *卡片获取焦点时的样式background #FFD9D9 * */
/* *卡片组件样式重写* */
::v-deep .q-card__section {
  margin: 0;
  padding: 0;
  line-height: 1;
}
/*  单关输入框样式 */
.bet-single-input {
  margin-top: 8px !important;
  margin-bottom: 10px !important;
  /* *蒙层* */
  .cathectic-shade {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0);
  }
  /* 输入金额的样式 */
  input {
    width: 100%;
    padding: 4px 6px;
    margin-top: 2px;
    color: #191c24;
    height: 32px;
    line-height: 18px;
    outline: none;
    /*  输入金额时的样式 */
    &.bet-input-money {
      outline: none;
    }
  }

  /*  MAX按钮的样式 */
  .bet-max-btn {
    position: absolute;
    top: 12px;
    right: 6px;
    z-index: 9;
    cursor: pointer;
    font-size: 12px;
    padding: 1px 2px;
  }

  /*  输入框中的关闭按钮样式 */
  .bet-input-close {
    position: absolute;
    top: 11px;
    right: 10px;
    cursor: pointer;
    width: auto;
    height: auto;
  }
}
/* *玩法及队名部分样式* */
.bet-play-game {
  display: flex;
  align-items: flex-start;
  word-break: break-word;
  /**玩法投注项**/
  .bet-play-text {
    line-height: 1.3;
    /**盘口名称**/
    .bet-handicap-name {
      white-space: pre-wrap;
    }
  }
}


.bet-play-team {
  display: flex;
  align-items: flex-start;
  padding-right: 5px !important;
  .ranking-icon {
    width: 20px;
    height: 20px;
    margin-top: -4px;
    margin-right: 2px;
  }
}

/**投注可盈**/
.bet-win {
  line-height: 1;
  .bet-win-money {
    margin-top: 2px;
  }
}
/*  输入不在限额范围内错误提示的样式 */
.bet-win-valid {
  line-height: 1;
  margin-top: 3px;
  font-weight: 600;
  /*  错误提示的样式 */
  .valid-color {
    color: #e93d3d;
  }
}

/*  最低限额 */
.bet-win-info {
  align-items: center;
  margin-top: 10px !important;
  margin-bottom: 5px !important;
}
.df-jb {
  height: 12px;
  display: flex;
  align-items: center;
}

/*  投注键盘区域 */
.bet-keyboard-zone {
  padding-top: 8px !important;
  margin-left: -10px !important;
  margin-right: -10px !important;

  /*  键盘按钮之间的间距 */
  .bet-keyboard-content {
    margin-left: 13px !important;
    margin-right: 13px !important;
  }
}
.ie-browser {
  .bet-input-close {
    top: 9.5px;
  }
}
</style>