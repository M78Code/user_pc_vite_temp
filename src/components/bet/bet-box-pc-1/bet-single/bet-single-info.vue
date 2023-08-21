<!--
 * @Description: 单关投注项信息组件 正常
-->
<template>
  <!--单关投注项信息组件-->
  <q-card flat class="relative-position bet-card bet-single-item-card"
    :class="{'bet-no-effect':!(active == 1 || active == 4)}">
    <!--这个地方是个遮罩层，单关合并只能有一个能预约，其余用遮罩遮住-->
    <div class="cathectic-appoint" v-if="!_.isEmpty(vx_get_bet_appoint_obj) && vx_get_bet_appoint_obj.bet_appoint_id != id"></div>
    <!--玩法,提示及删除区域-->
    <q-card-section>
      <!--不是冠军-->
      <div class="row" v-if="match_type !=3 ">
        <div class="col bet-league-name">
          <!--联赛名称-->
          {{league_name}}
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
      <div class="row">
        <div class="col" :class="{'bet-against':match_type != 3, 'bet-outweight': match_type == 3}">
          <!--是冠军且来源是列表-->
          <!-- match_type 盘口类型 1:赛前盘，2: 滚球盘 3: 冠军盘 -->
          <template v-if="match_type == 3 && source == 'match_list'">
          <!-- 冠军玩法联赛赛季名称 -->
            {{season}}
          </template>
          <template v-if="match_type != 3">
            <span class="home-vs-away">
              {{home}}<span class='bet-pk'>v</span>{{away}}
            </span>
            <!--足,蓝,棒,乒,排[1,2,3,8,9]-->
            <span v-if="[1,2,3,8,9].includes(sport_id*1) && timerly_basic_score" class="score">({{timerly_basic_score}})</span>
          </template>
        </div>
        <!--删除按钮-->
        <div class="col-auto col-delete" v-if="match_type == 3">
          <icon
            size="12px"
            name="icon-del"
            class="bet-del"
            @click="del_bet_item"
          />
        </div>
      </div>
      <!--不是滚球-->
      <div class="row" v-if="market_type != 0">
        <div class="col match-time">
          {{match_time}}
        </div>
      </div>
      <div class="bet-content">
        <div class="row">
          <!--玩法及队名部分样式-->
          <div class="col bet-play-game">
            <!--market_type: 0:滚球 若有比分是显示比分 以及盘口名称-->
            <label class="bet-play-text">
                <template v-if="market_type===0">
                    <label class="bet-match-playing">[{{i18n.t('menu.match_playing')}}]</label>
                </template>
                {{play_name}}
                <label v-if="basic_score" class="score">({{basic_score}})</label>
                <label class="bet-handicap-name">{{handicap_name}}</label>
            </label>
          </div>
        </div>
        <!--队名及盘口区域-->
        <div class="row no-wrap">
          <div
            class="col bet-play-team yb-fontsize13"
          >
            <!--卡赫利赛哈特 -->
            <div class="bet-team-handicap">
              <template v-if="handicap!==''">
                {{_.trim(team_name)}}
                <template v-if="team_name != handicap && !['225','224','235','27','362'].includes(play_id)">
                  <label class="yb-number-bold " :class="{'margin-left-0': team_name=='','bet-handicap': handicap_change ,'handicap': !(['341','342','7','20','102','13'].includes(play_id))}">{{_.trim(handicap)}}
                  </label>
                </template>
              </template>
              <template v-else>
                {{_.trim(team_name)}}
              </template>
              <!--【预约】-->
              <label v-if="active == 1 && (sport_id == 1 || sport_id == 2)&& pending_order_status == 1 && appoint">{{`[${i18n.t('bet.bet_book2')}]`}}</label>
            </div>
            
            <!--+/1.5-->
          </div>
        </div>
        <template v-if="!appoint">
          <div class="row">
            <div
              class="col bet-odds-value"
              :class="{
                'up-red': odds_change_up,
                'down-green': odds_change_down
              }"
            >
              <!--投注赔率1.87-->
              <span class="odds-value yb-number-bold">
                  <span>@</span>{{odds_value || format_odds}}
              </span>
            </div>
            <div class="auto-col" v-if="!(active == 1 || active == 4)">
              <span class="invalid">
                {{i18n.t('common.invalid')}}
              </span>
            </div>

            <!--足球且pending_order_status==1时可以进行预约（锁盘的情况下也是可以预约的）-->
            <div class="auto-col" v-if="(sport_id == 1 || sport_id == 2) && pending_order_status == 1">
              <span class="appoint" @click.stop="appoint_handle" @mouseleave="img_mouseleave" @mouseenter="img_mouseenter">
                +{{i18n.t('bet.bet_book2')}}
              </span>
            </div>
          </div>
        </template>
        <template v-else-if="(play_mapping.MARKET_FLAG_LIST.includes(play_id) || play_mapping.BASKETBALL_BY_APPOINTMENT.includes(play_id)) && (appoint && (_.trim(team_name)!='' && handicap != '' ) || handicap=='0') && get_open_value">
          <div class="row yb-flex-center book-content">
            <!--预-->
            <div class="col-2">{{i18n.t('bet.bet_dish')}}</div> 
            <!--此处为盘口区域，-->
            <div class="col-9 input-number" >
              <!-- 盘口减- -->
                <div 
                 v-touch-repeat:0:300.mouse.enter.space="()=>{
                    sub_handle('ball_head')
                 }"
                  class="sub-number" 
                  :class="{'disabled':head_sub_style}">
                    -
                </div>
                <input      
                  v-model="computed_appoint_ball_head"
                  v-if="sport_id == 1"
                  readonly
                 >
                 <input     
                  ref="ball-head-input" 
                  v-model="computed_appoint_ball_head"
                  @blur="appoint_odds_head_handle"
                  v-if="sport_id == 2"
                 >
                 <!-- 盘口加+-->

                <div class="add-number"
                  :class="{'disabled':head_add_style}"
                  v-touch-repeat:0:300.mouse.enter.space="()=>{
                  add_handle('ball_head')
                  }"
                >+</div>
            </div>
            <!--取消-->
            <div class="col-1" @click="cancel_operate"><icon name="icon-delete" size="13px"/></div>
          </div>
          <div class="row yb-flex-center book-content">
            <div class="col-2 mt5">{{i18n.t('bet.bet_odds')}}</div>
            <!--减号 赔率输入框 加号-->
            <div class="col-9 input-number mt5">
            <div 
            v-touch-repeat:0:300.mouse.enter.space="()=>{
                sub_handle('odds_value')
            }"
            class="sub-number" :class="{'disabled': min_odds_value==appoint_odds_value}">-</div>
            <currency-input 
              ref="currency_input"
              class="bet-input input-border"
              v-model="appoint_odds_value"
              :value="appoint_odds_value"
              @keyup="appoint_odds_value_handle"              
              :distractionFree="{
                hideCurrencySymbol: false
              }"
              :precision="{
                min:2,
                max:2
              }"
              :currency="null"
              :valueRange="{
                min: min_odds_value, //输入最小值限制
                max: 355 //预约赔率可输入最大值
              }"
              autocomplete="off"
              maxLength="11"
              locale="zh"/>
              <div class="add-number" :class="{'disabled': appoint_odds_value>=355}"
              v-touch-repeat:0:300.mouse.enter.space="()=>{
                add_handle('odds_value')}"
              >+</div>
              </div>
             <div class="col-1"></div>   
          </div>
        </template>
        <template v-else-if="appoint">
          <div class="row yb-flex-center book-content">
            <!--赔率-->
            <div class="col-2">{{i18n.t('bet.bet_odds')}}</div> 
            <!--减号 赔率输入框 加号-->
            <div class="col-9 input-number">
            <div 
             v-touch-repeat:0:300.mouse.enter.space="()=>{
                sub_handle('odds_value', 0)
            }"
            class="sub-number" :class="{'disabled': min_odds_value == appoint_odds_value}">-</div>
              <currency-input     
                ref="currency_input_single" 
                class="bet-input input-border"
                v-model="appoint_odds_value"
                :value="appoint_odds_value"
                @keyup="appoint_odds_value_handle"              
                :distractionFree="{
                  hideCurrencySymbol: false
                }"
                :precision="{
                  min:2,
                  max:2
                }"
                :currency="null"
                :valueRange="{
                  min: min_odds_value,//输入最小值限制
                  max: 355 //预约赔率可输入最大值
                }"
                autocomplete="off"
                maxLength="11"
                locale="zh"/>
                <div class="add-number" 
                :class="{'disabled': (355 == appoint_odds_value)}"
                v-touch-repeat:0:300.mouse.enter.space="()=>{
                  add_handle('odds_value',0)
                  }">+</div>
              </div>
            <div class="col-1" @click="cancel_operate"><icon name="icon-delete" size="13px"/></div>
          </div>
        </template>
      </div>
      <!--金额输入区域 'pr32': is_show_keyboard, 'input-focus':is_show_keyboard,-->
      <div class="row bet-single-input">
        <div class="col relative-position" :data-check-money="view_ctr_obj.single_range_money">
          <template v-if="!(active==1 || active==4)">
            <div class="cathectic-shade"></div>
          </template>
          <!--投注金额输入框-->
          <currency-input
            :id="DOM_ID_SHOW && `but-bet-single-${index}`"
            :ref="'input-'+id"
            class="bet-input input-border"
            :class="{
              'input-money': !is_empty_money,
              'input-border-red':![-4,0].includes(view_ctr_obj.single_range_money)
              }"
            :placeholder="`${i18n.t('bet.money_range')} ${ min_money.replace(/\B(?=(\d{3})+$)/g, ',')} ~ ${max_money.replace(/\B(?=(\d{3})+$)/g, ',')}`"
            v-model="money"
            :value="money"
            @keyup="keyup_handle"
            :distractionFree="{
              hideCurrencySymbol: true
            }"
            :precision="{
              min:0,
              max:2
            }"
            :currency="null"
            :valueRange="value_range"
            autocomplete="off"
            maxLength="11"
            locale="zh"/>
          <!--清除输入金额按钮-->
          <div class="bet-input-close" @click.stop="bet_clear_handle" v-show="!is_empty_money">
              <icon name="icon-failure" size="12px"/>
          </div>
        </div>
      </div>
      <div class="row bet-win yb-fontsize12">
        <div class="col df-jb">
          <!--最高可赢额-->
          {{i18n.t('common.maxn_amount_val')}}
        </div>
        <!--金额-->
        <div class="col-auto bet-win-money yb-number-bold">{{win_money || format_currency}}</div>
      </div>
    </q-card-section>
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
            :status="active"
          ></bet-keyboard>
        </div>
      </div>
    </q-card-section>

    <!-- <div class="mask-appointment" v-if="is_forward != index && is_forward != -1"></div> -->

    <tips v-if='is_show_tip' type="hps15Minutes" :tipstatus="true" :offset="getArr()"/>
  </q-card>
</template>
<script setup>
// import bet_single_info from "src/public/mixins/bet/bet_single_info";
const props = defineProps({
  is_forward: {
      type:Number,
      default: -1
    }
})
</script>
<style lang="scss" scoped>
/**预约投注遮罩*/
.mask-appointment {
  background: #F0F5FC !important;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10000 !important;
  opacity: 0.6;
}

/**投注卡片*/
.bet-card {
  line-height: 0 !important;

  /* *蒙层* */
  .cathectic-shade {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    opacity: 0;
  }
  .mt5 {
    margin-top: 5px;
  }
}
/* *卡片获取焦点时的样式background #FFD9D9 * */
/* *卡片组件样式重写* */
::v-deep .q-card__section {
  margin: 0;
  padding: 0;
  line-height: 1;
}

/* *玩法及队名部分样式* */
.bet-play-game {
  display: flex;
  align-items: flex-start;
  word-break: break-word;
  /**玩法队名盘口*/
  .bet-play-text {
    line-height: 1.3;
    /**玩法*/
    .bet-match-playing {
      margin-right: 5px;
      white-space: nowrap;
    }
    /**盘口*/
    .bet-handicap-name {
      white-space: pre-wrap;
    }
  }
}
/*  玩法部分样式 */
.bet-play-team {
  display: flex;
  align-items: flex-start;
  padding-right: 5px !important;
  /*  投注项盘口样式 */
  .bet-team-handicap {
    display: block;
    word-break: break-all;
    line-height: 1.2;

    label {
      margin-left: 5px;
      word-break: break-word;
      /*  盘口样式 */
      &.bet-handicap {
        text-align: center;
        padding: 0px 5px;
      }
      &.margin-left-0 {
        margin-left: 0px;
      }
    }
  }
}
/* *赔率的样式* */
.bet-odds-value {
  display: inline-block;
  text-align: right;
  /*  赔率 */
  .odds-value {
    position: relative;
    padding: 1px 3px;
  }

  /*  显示无效时的样式 */
  .invalid {
    padding: 2px 5px;
  }
}

/*  删除按钮列的样式 */
.col-delete {
  display: flex;
  align-items: flex-start;

  /*  删除按钮 */
  .bet-del {
    z-index: 20;
    font-size: 6px;
  }
}
.text-right {
  text-align: right;
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
/* 最高可赢额 */
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
}
/* 最高可赢额 */
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
// 赔率换行
.book-content>div {
    word-break:break-all;
}
.ie-browser {
    /*  输入框中的关闭按钮样式 */
  .bet-input-close {
    top: 9.5px;
  }
}
 .appoint {
  height: 50px;
 }
</style>