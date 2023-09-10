<!--
 * @Description: 单关投注项信息组件 正常
-->
<template>
  <!--单关投注项信息组件-->
  <q-card flat class="relative-position bet-card bet-single-item-card"
    :class="{ 'bet-no-effect': !(ref_data.active == 1 || ref_data.active == 4) }">
    <!--这个地方是个遮罩层，单关合并只能有一个能预约，其余用遮罩遮住-->
    <!-- <div class="cathectic-ref_data.appoint"
      v-if="!_.isEmpty(BetData.bet_appoint_obj) && BetData.bet_appoint_obj.bet_appoint_id != id"></div> -->
    <!--玩法,提示及删除区域-->
    
    <div style="display:none;" >{{ BetData.bet_data_class_version }}</div>

    <q-card-section>
      <!--不是冠军-->
      <div class="row" v-if="ref_data.match_type != 3">
        <div class="col bet-league-name">
          <!--联赛名称-->
          {{ item.tid_name }}
        </div>
        <!--删除按钮-->
        <div class="col-auto col-delete">
          <icon size="12px" name="icon-del" class="bet-del" @click="del_bet_item" />
        </div>
      </div>
      <div class="row">
        <div class="col" :class="{ 'bet-against': ref_data.match_type != 3, 'bet-outweight': ref_data.match_type == 3 }">
          <!--是冠军且来源是列表-->
          <!-- match_type 盘口类型 1:赛前盘，2: 滚球盘 3: 冠军盘 -->
          <template v-if="ref_data.match_type == 3 && ref_data.source == 'match_list'">
            <!-- 冠军玩法联赛赛季名称 -->
            {{ ref_data.season }}
          </template>
          <template v-if="ref_data.match_type != 3">
            <span class="home-vs-away">
              {{ item.home }}<span class='bet-pk'> v </span>{{ item.away }}
            </span>
            <!--足,蓝,棒,乒,排[1,2,3,8,9]-->
            <span v-if="[1, 2, 3, 8, 9].includes(item.csid * 1) && ref_data.timerly_basic_score"
              class="score">({{ ref_data.timerly_basic_score }})</span>
          </template>
        </div>
        <!--删除按钮-->
        <div class="col-auto col-delete" v-if="ref_data.match_type == 3">
          <icon size="12px" name="icon-del" class="bet-del" @click="del_bet_item" />
        </div>
      </div>
      <!--不是滚球-->
      <div class="row" v-if="ref_data.market_type != 0">
        <div class="col match-time">
          {{ ref_data.match_time }}
        </div>
      </div>
      <div class="bet-content">
        <div class="row">
          <!--玩法及队名部分样式-->
          <div class="col bet-play-game">
            <!--market_type: 0:滚球 若有比分是显示比分 以及盘口名称-->
            <label class="bet-play-text">
              <template v-if="ref_data.market_type == 0">
                <label class="bet-match-playing">[{{ $t('menu.match_playing') }}]</label>
              </template>
              {{ item.playName }} 
              <label v-if="ref_data.basic_score" class="score">({{ ref_data.basic_score }})</label>
              <label class="bet-handicap-name">[{{ odds_type_name[item.marketTypeFinally] }}] </label>
            </label>
          </div>
        </div>
        <!--队名及盘口区域-->
       
        <template v-if="!ref_data.appoint">
          <div class="row">
            <div class="col bet-odds-value" :class="{
              'up-red': ref_data.odds_change_up,
              'down-green': ref_data.odds_change_down
            }">
              <!--投注赔率1.87-->
              <span class="odds-value yb-number-bold">
                <span>@</span>{{ format_odds(item.oddFinally,item.csid) }}
              </span>
            </div>
            <div class="auto-col" v-if="!(ref_data.active == 1 || ref_data.active == 4)">
              <span class="invalid">
                {{ $t('common.invalid') }}
              </span>
            </div>
          </div>
        </template>
      </div>
      <!--金额输入区域 'pr32': is_show_keyboard, 'input-focus':is_show_keyboard,-->
      <div class="row bet-single-input">
        <div class="col relative-position" >
          <!-- <template v-if="!(active == 1 || active == 4)">
            <div class="cathectic-shade"></div>
          </template> -->
          <!--投注金额输入框-->
          <input v-model="money" type="number" @input="set_win_money" :placeholder="`${$t('bet.money_range')} ${ref_data.min_money} ~ ${ref_data.max_money}`" maxLength="11" class="bet-input input-border" />
          <!--清除输入金额按钮-->
          <div class="bet-input-close" @click.stop="bet_clear_handle" >
            <icon name="icon-failure" size="12px" />
          </div>
        </div>
      </div>
      <div class="row bet-win yb-fontsize12">
        <div class="col df-jb">
          <!--最高可赢额-->
          {{ $t('common.maxn_amount_val') }}
        </div>
        <!--金额-->
        <div class="col-auto bet-win-money yb-number-bold">{{ format_currency(ref_data.win_money) }}</div>
      </div>
    </q-card-section>
    <q-card-section class="bet-keyboard-zone">
      <!--键盘区域-->
      <div class="row bet-keyboard bet-keyboard-content">
        <div class="col">
          <bet-keyboard ref="bet-keyboard" @keypress_handle="set_click_keybord"  :input_max_money="ref_data.max_money" :status="ref_data.active"></bet-keyboard>
        </div>
      </div>
    </q-card-section>

    
    <!-- <div class="mask-appointment" v-if="is_forward != index && is_forward != -1"></div> -->

    <!-- <tips v-if='is_show_tip' type="hps15Minutes" :tipstatus="true" :offset="getArr()" /> -->
  </q-card>
</template>
<script setup>
import { ref,toRefs, defineComponent, reactive, onMounted, onUnmounted } from "vue"
import _ from 'lodash'
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { format_odds,format_currency } from "src/core/format/index.js"
import { odds_type_name } from "src/core/constant/index.js"
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js"


import BetKeyboard from "../common/bet-keyboard.vue"
import BetData from "src/core/bet/class/bet-data-class.js";

const props = defineProps({
  index: {
      type: Number,
      default: 0
    },
    item: {}
})

onMounted(()=>{
  // 监听 限额变化
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).on
})

onUnmounted(()=>{
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off
})


// 限额改变 修改限额内容
const set_ref_data_bet_money = () =>{
  const { min_money = 10,max_money = 8888 } = _.get(BetViewDataClass.bet_min_max_money,`${props.item.playOptionsId}`,{})

  ref_data.min_money = min_money
  ref_data.max_money = max_money
}

// 快捷金额
const set_click_keybord = obj => {
  // 快捷金额 max 使用限额最大金额作为投注金额
  if(obj.text == 'MAX'){
    money.value = ref_data.max_money
  }else{
    // 投注金额 = 快捷金额 加上 原有的投注金额
    let max_money =  money.value * 1 + obj.value
    // 投注金额 大于 最大投注限额 则 使用最大限额作为投注金额
    if(max_money > ref_data.max_money){
      money.value = ref_data.max_money
    }else{
      money.value = max_money
    }
    // 记录投注金额 单关 不合并
    BetData.set_bet_amount(money.value)
  }
}

 // 投注金额
const money = ref('')

const ref_data = reactive({
  DOM_ID_SHOW: false, 
  match_type: 1,  // match_type 盘口类型 1:赛前盘，2: 滚球盘 3: 冠军盘 
  active: 1,    //投注项状态
  season: '',   // 赛季
  timerly_basic_score: "",   // 计时比分 返回比分格式为: (主队得分-客队得分)
  market_type: '' ,     // 赛事状态 0未开赛 滚球:进行中
  basic_score: "",    /// 赛事比分 返回比分格式为: (主队得分-客队得分)
  handicap_name: '',  // 当前盘口名称 欧洲盘/香港盘
  appoint: true, // 是否预约
  odds_change_up: false,  // 赔率上升
  odds_change_down: false, // 赔率下降
  min_money: 10, // 最小投注金额
  max_money: 8888, // 最大投注金额
  win_money: 0.00 , // 最高可赢
  value_range: {
    min:0,
    max:0
  }
})

// 输入判断
const set_win_money = () =>{
  // 输入控制 在2位小数 todo
  if(money.value > ref_data.max_money){
    // 超出最大限额 使用 最大限额 作为投注金额
    money.value = ref_data.max_money
    // 修改页面提示 1: 输入金额超出最大限额时
    BetViewDataClass.set_input_money_state(1)
  }
  // 计算最高可赢金额
  ref_data.win_money = money.value * props.item.oddFinally
}


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
:deep(.q-card__section) {
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
  word-break: break-all;
}

.ie-browser {

  /*  输入框中的关闭按钮样式 */
  .bet-input-close {
    top: 9.5px;
  }
}

.ref_data.appoint {
  height: 50px;
}
//谷歌
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {-webkit-appearance: none;
}//火狐
input[type="number"]{-moz-appearance: textfield;
}

</style>