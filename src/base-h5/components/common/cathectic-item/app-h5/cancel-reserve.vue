<!--
 * @Desc: 取消预约
 * @Author:
-->
<template>
    <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
    <div class="odd-finnally" v-if="show_appoint">
      <span v-touch-repeat:0:300:200.mouse.enter.space.72.104="gtouchstart(1)">—</span>
      @ {{ odds_value_edit }}
      <span class="plus" v-touch-repeat:0:300:200.mouse.enter.space.72.104="gtouchstart(2)">+</span>
    </div>
    <div class="cancel-warp">
      <template v-if="show_appoint">
        <div class="cancel-btn" @click.stop="change_show_appoint(false)">{{i18n_t('common.cancel')}}</div>
        <div class="change-btn" @click.stop="sure">{{i18n_t('app_h5.bet.confirm')}}</div>
      </template>
      <template v-else>
        <div class="cancel-btn" @click="alertTips=true;">{{i18n_t('app_h5.bet.cancel_appoint')}}</div>
        <div class="change-btn" @click.stop="change_show_appoint(true)">{{i18n_t('common.edit')}}</div>
      </template>
    </div>
    <!--复制样式 已复制-->
    <div class="toast fit-center" v-if="toast">{{toast_msg}}</div>
    <!-- 取消预约弹框 -->
    <q-dialog v-model="alertTips">
      <div class="tips-main">
        <h2>{{ i18n_t('app_h5.cathectic.kind_tips') }}</h2>
        <p>{{ i18n_t('app_h5.cathectic.confirm_cancel_reservation') }}</p>
        <div class="confirm">
          <span @click="alertTips=false;">{{ i18n_t('common.cancel') }}</span>
          <span @click="cancle_pre_order">{{ i18n_t('common.ok') }}</span>
        </div>
      </div>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api_betting } from "src/api/index.js";
import { i18n_t } from "src/output/index.js";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import mathJs from 'src/core/bet/common/mathjs.js'
const props = defineProps({
  orderNo: {
    type: String,
    default: ''
  },
  oddFinally: {
    type: String,
    default: ''
  },
  marketType: {
    type: String,
    default: ''
  },
  show_appoint: {
    type: Boolean,
    default: false
  }
})
// 取消预约
let alertTips = ref(false)

/**
 *@descript 取消预约投注项
*@param {String} orderNumer 订单号
*/
const emit = defineEmits(['success', 'change_show_appoint'])
const cancle_pre_order = () => {
    api_betting.cancle_pre_order({ orderNo: props.orderNo }).then((result) => {
        let res = result.status ? result.data : result;
        if (res.code == 200) {
            alertTips.value = false
            emit('success')
        } else {
          alertTips.value = false
          useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, res.msg)
        }
    }).catch(() => {
      alertTips.value = false
    })
}

/**
 * 修改赔率
 */
// 修改赔率
let odds_value_edit = ref(0)

onMounted(() => {
  odds_value_edit.value = props.oddFinally
})

//长按事件（起始）
const gtouchstart = (type) => {
  if(type==1){
    return reduce_odd
  }else if(type==2){
    return add_odd
  }
}

const change_show_appoint = (bol) => {
  emit('change_show_appoint', bol)
}


/**
*@description 点击减号减少赔率
*/
const reduce_odd = () => {
    const num = step(props.oddFinally)
    // 最小值
    if(parseFloat(odds_value_edit.value) <= 0 ){
        return
      }
    odds_value_edit.value = format_money(acc_sub(odds_value_edit.value, num))
}
/**
* @description 预约投注点击加号增加赔率
*/
const add_odd = () => {
    const max_odds = 355
    const num = step(props.oddFinally)
    // 最大值
    if( parseFloat(odds_value_edit.value) >= max_odds ){
      return
    }
    odds_value_edit.value = format_money(acc_add(odds_value_edit.value, num))
}


const sure = () => {
  let params = {
    orderNo: props.orderNo, // 订单编号
    odds: mathJs.multiply(odds_value_edit.value, 100000), //投注赔率
    marketType: props.marketType // 盘口类型(EU:欧盘 HK:香港盘 US:美式盘 ID:印尼盘 MY:马来盘 GB:英式盘）
  }
  api_betting.set_update_pre_bet_odds(params).then(res=>{
    let code = lodash.get(res,'code')
    if(code == 200){
      emit('success')
      toast_tips(i18n_t('bet.edit_success'))
    } else {
      toast_tips(i18n_t('bet.edit_fail'))
    }
  })
}

// < 3.00的：0.01
// ≥3 且＜5.00的：0.05
// ≥5 且 ＜10.00的：0.1
// ≥10 且 ＜20.0的：0.5
// ≥20 ～355：1
const step = (val) => {
  let odds = parseFloat(val)
  let num = 0.01
  if(odds >= 3 && odds < 5){
      num = 0.05
  }else if( odds >= 5 && odds < 10 ){
      num = 0.1
  }else if ( odds >= 10 && odds < 20 ){
      num = 0.5
  }else if (odds >= 20){
      num = 1
  }
  return num
}

/**
 *@description 将金额转化为千位符格式保留2位小数
 *@param {Number} num 待格式化的金额
 *@return {String} 转化后的金额 比如 '64,464.95'
 */
 const format_money = (num) => {
  let number = 2

  if(  num < 10 ){
    number = 2
  }else if ( num >= 10 && num < 20 ){
    number = 1
  }else if (num >= 20){
    number = 0
  }

  try {
    if (num && num < 0) {
      num = 0;
    }
    num = (num || 0).toString();
    let result = "";
    let [num1, num2 = "00"] = num.split(".");
    num2 = num2.padEnd(number, "0").slice(0,number);
  
    if (num1) {
      num1 = num1 + result;
    }
    let count = num1 + (num2 ? ( "." + num2) : "");

    return count
  } catch (error) {
    console.error(error);
    return "";
  }
};

// 两个浮点数求和
const acc_add = (num1, num2) => {
  var r1, r2, m;
  try {
    if (num1.toString().split('.')[1]) {
      r1 = num1.toString().split('.')[1].length;
    } else {
      r1 = 0;
    }
    if (num2.toString().split(".")[1]) {
      r2 = num2.toString().split(".")[1].length;
    } else {
      r2 = 0;
    }
  } catch (e) {
    console.error(e);
  }
  m = Math.pow(10, Math.max(r1, r2));
  return Math.round(num1 * m + num2 * m) / m;
}
// 两个浮点数相减
const acc_sub = (num1, num2 = num1) => {
  var r1, r2, m;
  try {
    if (num1.toString().split('.')[1]) {
      r1 = num1.toString().split('.')[1].length;
    } else {
      r1 = 0;
    }
    if (num2.toString().split(".")[1]) {
      r2 = num2.toString().split(".")[1].length;
    } else {
      r2 = 0;
    }
  } catch (err) {
    console.error(err);
  }
  m = Math.pow(10, Math.max(r1, r2));
  let n = (r1 >= r2) ? r1 : r2;
  return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
}

// 提示弹出窗
let toast_msg = ref('')
let toast = ref(false)
let timeout_toast = null
const toast_tips = (msg) => {
  toast_msg.value = msg
  toast.value = true;
  clearTimeout(timeout_toast);
  timeout_toast = setTimeout(() => {
    toast.value = false;
  }, 1500);
}

</script>

<style lang="scss" scoped>
.odd-finnally {
  margin: 0 0.14rem;
  line-height: 0.4rem;
  font-size: 0.14rem;
  background-color: var(--q-gb-bg-c-23);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.06rem;
  margin-bottom: 0.1rem;
  font-weight: bold;
  span {
    width: 0.5rem;
    text-align: center;
    font-size: 0.16rem;
    color: var(--q-gb-bg-c-6);
    &.plus {
      font-size: 0.18rem;
    }
  }
}
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 0 6px 0 12px;
  height: 38px;
  border-radius: 6px;
  text-align: center;
  line-height: 38px;
  font-size: 0.15rem;
  transform: translate(-50%, -50%);
  color: #fff;
  background-color: rgba(0,0,0,.6);
}
.cancel-warp {
  margin: 0 0.14rem;
  line-height: 0.4rem;
  font-size: 0.14rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cancel-btn, .change-btn {
  width: 48%;
  text-align: center;
  border-radius: 0.1rem;
  box-sizing: border-box;
}
.cancel-btn {
    border: 1px solid var(--q-gb-bg-c-13);
    color: var(--q-gb-bg-c-13);
  }
.change-btn {
  background-color: var(--q-gb-bg-c-13);
  color: var(--q-gb-t-c-14);
}
.tips-main {
  background-color: var(--q-gb-bg-c-23);
  border-radius: 0.1rem;
  width: 90%;
  h2 {
    font-size: 0.2rem;
    font-weight: bold;
    text-align: center;
    line-height: 3;
    color: var(--q-gb-t-c-18);
  }
  p {
    font-size: 0.16rem;
    padding: 0.1rem 0;
    margin-bottom: 0.2rem;
    text-align: center;
    color: var(--q-gb-t-c-24);
  }
  .confirm {
    font-size: 0.20rem;
    color: var(--q-gb-t-c-1);
    line-height: 2.5;
    border-top: 1px solid var(--q-gb-bd-c-20);
    display: flex;
    span {
      width: 50%;
      text-align: center;
      &:first-child {
        color: var(--q-gb-t-c-24);
        border-right: 1px solid var(--q-gb-bd-c-20);
      }
    }
  }
  
}
</style>