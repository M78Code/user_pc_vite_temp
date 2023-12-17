
<template>
  <q-card flat class="bet-mix-input-card" @click="click_handle">
    <div style="display:none;">{{ BetData.bet_data_class_version }}</div>
    {{ BetData.bet_data_class_version }} ------1111-----
    <q-card-section>
      <!--线 2串1 金额-->
      <div class="odds-wrap row">
        <div class="line"></div>
        <div class="col bet-mix-info">
          <!--单注-->
          {{ i18n_t('bet')[`bet_${id}`] }}
        </div>
        <span v-if="index == 0" class="odds-value yb-number-bold">
          <!--串关赔率(欧赔)-->
          {{ item.oddFinally }}
          <!-- {{ '@' + format_odds(item.oddFinally,item.csid) }} -->
        </span>
      </div>
     

    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from "vue"
import BetKeyboard from "../common/bet-keyboard.vue"
import { useCurrencyInput } from 'vue-currency-input'

import lodash_ from 'lodash'
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { format_odds, format_currency } from "src/output/index.js"

import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";

const is_empty_money = ref(false)
const money = ref('')
const input_max = ref(100000)

const ref_data = reactive({
  max_money: "",
  min_money: '',
  win_money: 0.00,
})

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  item: {}
})


onMounted(() => {
  // 监听 限额变化
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).on
})

onUnmounted(() => {
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off
})

// 输入判断
const set_win_money = () => {
  // 输入控制 在2位小数 todo
  if (money.value > ref_data.max_money) {
    // 超出最大限额 使用 最大限额 作为投注金额
    money.value = ref_data.max_money
    // 修改页面提示 1: 输入金额超出最大限额时
    BetViewDataClass.set_input_money_state(1)
  }
  // 计算最高可赢金额
  ref_data.win_money = money.value * props.item.oddFinally
}

// 限额改变 修改限额内容
const set_ref_data_bet_money = () => {
  const { min_money = 10, max_money = 8888 } = lodash_.get(BetViewDataClass.bet_min_max_money, `${props.item.playOptionsId}`, {})

  ref_data.min_money = min_money
  ref_data.max_money = max_money
}

// 串关数量
const count = computed(() => {
  return 1
})

// 快捷金额
const set_click_keybord = obj => {
  // 快捷金额 max 使用限额最大金额作为投注金额
  if (obj.text == 'MAX') {
    money.value = ref_data.max_money
  } else {
    // 投注金额 = 快捷金额 加上 原有的投注金额
    let max_money = money.value * 1 + obj.value
    // 投注金额 大于 最大投注限额 则 使用最大限额作为投注金额
    if (max_money > ref_data.max_money) {
      money.value = ref_data.max_money
    } else {
      money.value = max_money
    }
    // 记录投注金额 单关 不合并
    BetData.set_bet_amount(money.value)
  }
}

</script>
<style lang="scss" scoped>
/*  卡片获取焦点时的样式 */
.bet-mix-input-card {
  padding: 17px 10px 15px 10px;

  /*  卡片组件样式重写 */
  :deep(.q-card__section) {
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