<!--
 * @Description: 单关投注项信息组件 正常
-->
<template>
  <!--单关投注项信息组件-->
  <q-card flat class="relative-position bet-card bet-single-items-card">
    <!--这个地方是个遮罩层，单关合并只能有一个能预约，其余用遮罩遮住-->
    <!-- <div class="cathectic-ref_data.appoint"
      v-if="!_.isEmpty(BetData.bet_appoint_obj) && BetData.bet_appoint_obj.bet_appoint_id != id"></div> -->
    <!--玩法,提示及删除区域-->
    <div v-show="false">{{ BetData.bet_data_class_version }}</div>
    <q-card-section>

      <div class="col bet-league-name">
        <!--联赛名称-->
        {{ items.tid_name }}-{{ items.matchType }}
      </div>
      <!--删除按钮-->
      <div class="col-auto col-delete">
        <icon-wapper color="#ffffff" name="icon-del" class="bet-del" @click="del_bet_item" size="12px" />
      </div>

      <div class="row">
        <div class="col">
          <!--足,蓝,棒,乒,排[1,2,3,8,9]-->
          <div v-if="items.home">{{ items.home }} <span class="mx-4">v</span> {{ items.away }} {{ items.matchType == 2 && items.sportId == 1 ? items.mark_score : ''}}</div>

          <!--不是滚球-->
          <!--1 ：早盘赛事 ，2： 滚球盘赛事， -->
          <div class="row" v-if="items.matchType == 1">
            <div class="col match-time">
              <!--赛事时间-->
              {{ formatTime(items.match_time, "mm月DD日 HH:MM") }}
            </div>
          </div>
        </div>
      </div>

      <div class="bet-content">
        <div class="row">
          <!--玩法及队名部分样式-->
          <span class="mr-4 text-009 text-flow-none" v-if="items.matchType == 2">{{'[' + i18n_t("bet.bowls") + ']'}}</span>

          <span>{{ items.playName }}</span>

          <span v-if="UserCtr.is_cur_odds(items.odds_hsw)">[{{ i18n_t(`odds.${UserCtr.odds.cur_odds}`) }}] </span> 
          <span v-else>[{{ i18n_t(`odds.EU`) }}]</span> 

        </div>

        <!-- vr 单独处理 -->
        <div class="text-flow-none" v-if="items.bet_type== 'vr_bet' && ['1002','1011','1009','1010'].includes(items.sportId) && [20033,20034,20035,20036,20037,20038].includes(items.playId*1)">
          <div v-for="page in items.handicap" :key="page" class="f-s-c">
              <span class="virtual-count" :class="`virtual-num-${page.hv} csid-${items.sportId}`" ></span> {{page.text}} 
          </div>
        </div>

        <div class="text-flow-none" v-else>{{items.handicap}} <em v-if="items.handicap_hv" class="ty-span">{{items.handicap_hv}}</em></div> 

        <!-- 预约投注组件 -->
        <!-- <div v-if="ref_data.show_appoint">
          <bet-pro-appoint :items="items" @cancel_operate="cancel_operate" />
        </div> -->

        <!-- 赔率 -->
        <div class="bet-team-handicap-odd">
          <div class="col bet-odds-value" :class="{
            'up-red': items.red_green == 'red_up',
            'down-green': items.red_green == 'green_down'
          }">
            <!--投注赔率1.87-->
            <span class="odds-value yb-number-bold">
              <span>@</span>{{ items.oddFinally }}
            </span>
          </div>
          <!--【预约】-->
          <label class="appoint appoint_cursor" v-if="pending_order_status(items.playOptionsId)" @click="set_show_appoint">
            +{{ `${i18n_t('bet.bet_book2')}` }}
          </label>
        </div>
       
      </div>
      <!--金额输入区域 'pr32': is_show_keyboard, 'input-focus':is_show_keyboard,-->
      <div class="row">
        <bet-input :items="items" />
      </div>
    </q-card-section>

  </q-card>
</template>
<script setup>
import { reactive, computed } from "vue"
import { formatTime, UserCtr } from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import { i18n_t } from "src/boot/i18n.js"
import { get_query_bet_amount_pre } from "src/core/bet/class/bet-box-submit.js"
import BetInput from "./bet-input.vue"
import { IconWapper } from 'src/components/icon'
import BetProAppoint from "./bet-pre-appoint.vue"

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  id: {   //赛事id
    type: String,
    default: "0"
  },
  items: {}
})

/**
* @description:是否支持预约 0 关闭 1 支持
* @param {undefined} undefined
* @returns {number}
*/
const pending_order_status = computed(() => options_id => {
  // 判断投注项列表中 那些是可以预约的
  let bet_obj = BetData.bet_pre_list.find(items => items == options_id) || '';
  if (bet_obj && ref_data.active == 1 && [1, 2].includes(Number(props.items.sportId))) {
    return 1
  }
  return 0;
})

const ref_data = reactive({
  DOM_ID_SHOW: false,
  matchType: 1,  // matchType 盘口类型 1:赛前盘，2: 滚球盘 3: 冠军盘 
  active: 1,    //投注项状态
  season: '',   // 赛季
  timerly_basic_score: "",   // 计时比分 返回比分格式为: (主队得分-客队得分)
  market_type: '',     // 赛事状态 0未开赛 滚球:进行中
  basic_score: "",    /// 赛事比分 返回比分格式为: (主队得分-客队得分)
  show_appoint:false, // 是否显示预约 点击预约后其他地方需要显示
})

// 删除当前投注项
const del_bet_item = () => {
  BetData.set_delete_bet_info(props.items.playOptionsId,props.index)
}
// 预约投注
const set_show_appoint = () =>{
  // 预约投注点击后展示后 需要请求预约限额接口
  if(!ref_data.show_appoint){
    get_query_bet_amount_pre()
  }
  // 显示预约投注内容
  ref_data.show_appoint = !ref_data.show_appoint
 
}

const cancel_operate = () =>{
  ref_data.show_appoint = !ref_data.show_appoint
}

</script>


<style lang="scss" scoped>
/**预约投注遮罩*/
.mask-appointment {
  background: var(--q-gb-bg-c-21) !important;
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
  //line-height: 0 !important;

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

    .bet-handicap-color {
      color: var(--q-gb-t-c-16);
      margin-right: 5px;
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
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  position: absolute;
  top: -14px;
  right: -14px;
  border-radius: 0 4px 0 10px;
  background-color: var(--q-gb-t-c-16);

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

.bet-team-handicap-odd {
  display: flex;
  justify-content: space-between;
  height: 20px;
  align-items: center;
}
.appoint_cursor{
  cursor: pointer;
}
</style>