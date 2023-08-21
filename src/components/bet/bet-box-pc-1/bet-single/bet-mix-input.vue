
<template>
  <q-card flat class="bet-mix-input-card" @click="click_handle">
    <q-card-section>
      <!--线 2串1 金额-->
      <div class="odds-wrap row">
        <div class="line"></div>
        <div class="col bet-mix-info">
          <!--单注-->
          {{ i18n.t('bet')[`bet_${id}`] }}
        </div>
        <span v-if="index == 0" class="odds-value yb-number-bold">
          <!--串关赔率(欧赔)-->
          {{ '@' + get_series_odds }}
        </span>
      </div>
      <!--金额输入区域包括键盘 -->
      <div class="row bet-mix-input" :data-check-money="view_ctr_obj.mix_range_money">
        <!--金额输入区-->
        <currency-input :ref="'input-money-' + id" class="bet-input input-border"
          :class="{ 'input-money': !is_empty_money, 'input-border-red': (![-4, 0].includes(view_ctr_obj.mix_range_money) && money != null) || view_ctr_obj.error_code == 'M400005' }"
          :placeholder="`${i18n.t('bet.money_range')} ${min_money.replace(/\B(?=(\d{3})+$)/g, ',')} ~ ${max_money.replace(/\B(?=(\d{3})+$)/g, ',')}`"
          v-model="money" :value="money" @keyup="keyup_handle" :distractionFree="{
            hideCurrencySymbol: true
          }" :precision="{
  min: 0,
  max: 2
}" :valueRange="{
  min: 0,
  max: input_max
}" :currency="null" autocomplete="off" maxLength="11" locale="zh" />
        <!-- 输入框中最右侧 *1-->
        <div class="bet-max-btn">X{{ count }}</div>
        <!-- 输入框中最右侧的一个叉叉-->
        <div :class="`bet-input-close-${count.length}`" @click.stop="bet_clear_handle" v-show="!is_empty_money">
          <icon name="icon-failure" size="12px" />
        </div>
      </div>
      <!--最高可赢以及金额-->
      <template v-if="is_show_keyboard">
        <div class="row bet-win yb-fontsize12">
          <div class="col df-jb">
            <!--最高可赢额-->
            {{ i18n.t('common.maxn_amount_val') }}
          </div>
          <!--最高可赢金额-->
          <div class="col-auto bet-win-money yb-number-bold">{{ get_max_win_money() || four_five_six_double(2) ||
            format_currency }}</div>
        </div>
        <div class="row input-keyboard">
          <!--投注键盘-->
          <bet-keyboard ref="bet-keyboard" @keypress_handle="keypress_handle" :keyboard_data="keyboard_data"
            :number="max_money"></bet-keyboard>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref } from "vue"
import BetKeyboard from "../common/bet-keyboard.vue";

const keyboard = [
  {
    text: "5",
    value: 5,
    disabled: false
  },
  {
    text: "10",
    value: 10, // 数值
    disabled: false // 禁用
  },
  {
    text: "25",
    value: 25,
    disabled: false
  },
  {
    text: "50",
    value: 50,
    disabled: false
  },
  {
    text: "100",
    value: 100,
    disabled: false
  },
  {
    text: "200",
    value: 200,
    disabled: false
  }
]
// 输入框金额
const money = ref(null)
// 可赢额
const win_money = ref('')
// 键盘是否显示
const is_show_keyboard = ref(false)
// 赔率
const odds_value = ref(1.00)
// 键盘数据集合
const keyboard_data = ref(keyboard)
// 可输入的最大值
const input_max = ref(null)
// 串关设置信息
const setup_mix_info = ref({})
// 获得焦点定时器
const timer_input_focus = ref(null)


 /**
     * @description: 获取串关赔率(欧赔)
     * @param {undefined} undefined
     * @return {Number} 赔率
     */
    const get_series_odds = () => {
      let series_odds = 1;
      vx_get_bet_list.forEach(item => {
        let obj = _.get(vx_get_bet_obj, `${item}.cs`);
        let odds_value = (obj && obj.odds_value) || 1;
         // 此处乘以100然后除以100是为了保证精度
        series_odds = ((Math.floor(odds_value / 1000)) / 100) * series_odds;
      });
      // 此处乘以100然后除以100是为了保证精度
      return ((Math.floor(series_odds * 100)) / 100).toFixed(2);
    }
    /**
     * @description: 获取串关个数
     * @param {undefined} undefined
     * @return {String} 个数
     */
     const count = () => {
      let count =  _.get(vx_get_bet_s_obj,`${id}.cs.count`);
      if(count) {
        return `${count}`;
      }
      return '';
    }
    /**
     * @description: 最大值
     * @param {undefined} undefined
     * @return {String}
     */
     const max_money = () =>  {
      let max_money =  _.get(vx_get_bet_s_obj,`${id}.cs.max_money`);
      if(max_money) {
        return `${max_money}`;
      }
      return '';
    }
    /**
     * @description: 最小值
     * @param {undefined} undefined
     * @return {String}
     */
     const min_money = () =>  {
      let min_money =  _.get(vx_get_bet_s_obj,`${id}.cs.min_money`);
      if(min_money) {
        return `${min_money}`;
      }
      return '';
    }
    /**
     * @description: 金额是否为空
     * @param {undefined} undefined
     * @return {Boolean}
     */
     const is_empty_money = () => {
      let is_empty_money_ = money == null;
      // 金额为空
      view_ctr_obj.is_empty_money = is_empty_money_;
      return is_empty_money_;
    }


</script>
<style lang="scss" scoped>
/*  卡片获取焦点时的样式 */
.bet-mix-input-card {
  padding: 17px 10px 15px 10px;

  /*  卡片组件样式重写 */
  ::v-deep .q-card__section {
    margin: 0;
    padding: 0;
    line-height: 0;
  }

  /*线 2串1 金额*/
  .odds-wrap {
    justify-content: space-between;
    align-items: center;

    .line {
      width: 3px;
      height: 14px;
    }

    .bet-mix-info {
      height: 18px;
      line-height: 20px;
      padding-left: 10px;
    }

    /* *赔率的样式* */
    .odds-value {
      padding: 2px 3px;
      height: 18px;
      line-height: 16px;
    }
  }

  /* 金额输入区域包括键盘 */
  .bet-mix-input {
    margin-top: 10px !important;
    margin-bottom: 5px !important;

    /*  输入金额的样式 */
    input {
      width: 100%;
      padding: 4px 6px;
      margin-top: 2px;
      height: 32px;
      line-height: 18px;
      outline: none;
      caret-color: #1286da;

      /*  输入金额 */
      &.bet-input-money {
        outline: none;
      }

      &.input-border-red {
        animation: mymove 200ms;
        animation-delay: 0ms;
        -webkit-animation: mymove 200ms;
        -webkit-animation-delay: 0ms;
      }
    }

    /*  MAX 几串样式 输入框中*1 */
    .bet-max-btn {
      position: absolute;
      right: 8px;
      top: 47px;
      z-index: 9;
      cursor: pointer;
    }

    /*  生成几串数字长度对应清空按钮样式 叉叉图标*/
    .bet-input-close-1,
    .bet-input-close-2,
    .bet-input-close-3,
    .bet-input-close-4 {
      position: absolute;
      top: 41px;
      cursor: pointer;
      width: auto;
      height: auto;
      display: inline;
    }

    .bet-input-close-1 {
      right: 28px;
    }

    .bet-input-close-2 {
      right: 32px;
    }

    .bet-input-close-3 {
      right: 37px;
    }

    .bet-input-close-4 {
      right: 45px;
    }
  }

  /*  最高可赢额 */
  .bet-win {
    line-height: 1;
    margin-top: 10px;

    /*  输入无效的样式 */
    .valid-color {
      margin-top: -1px;
      padding-bottom: 1px;
    }
  }

  /*  最低限额 */
  .bet-win-info {
    line-height: 1;
    align-items: center;
    margin-top: 15px !important;
    padding-bottom: 5px !important;
  }

  /*  额度及可赢区域 */
  .bet-win-info2 {
    line-height: 1;
  }

  /*  输入键盘样式 */
  .input-keyboard {
    margin-top: 10px;
    padding-left: 3px;
    padding-right: 3px;
  }

  .mb12 {
    margin-bottom: -12px !important;
  }
}

/*  输入错误时抖动的动画效果 */
@keyframes mymove {
  0% {
    left: -4px;
  }

  33% {
    left: 0px;
  }

  66% {
    left: 4px;
  }

  100% {
    left: 0px;
  }
}
</style>