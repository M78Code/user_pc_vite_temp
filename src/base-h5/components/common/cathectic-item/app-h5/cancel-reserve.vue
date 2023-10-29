<!--
 * @Desc: 取消预约
 * @Author:
-->
<template>
    <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
    <div class="cancel-btn" @click="alertTips=true;">取消预约</div>
    <!-- 取消预约弹框 -->
    <q-dialog v-model="alertTips">
      <div class="tips-main">
        <h2>温馨提示</h2>
        <p>确定取消本场比赛预约？</p>
        <div class="confirm">
          <span @click="alertTips=false;">取消</span>
          <span @click="cancle_pre_order">确定</span>
        </div>
      </div>
    </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { api_betting } from "src/api/index.js";
import BetRecordClass from "src/core/bet-record/bet-record.js";
const props = defineProps({
  orderNumber: {
    type: [ String, Number ]
  }
})
// 取消预约
let alertTips = ref(false)

/**
 *@descript 取消预约投注项
*@param {String} orderNumer 订单号
*/
const emit = defineEmits(['success'])
const cancle_pre_order = () => {
    api_betting.cancle_pre_order({ orderNo: props.orderNumber }).then((result) => {
        let res = result.status ? result.data : result;
        if (res.code == 200) {
            store.dispatch({
                'txt': i18n_t('pre_record.canceled'),
                hide_time: 3000
            })
            alertTips.value = false
            emit('success')
        } else if (['0400546', '0400547'].includes(res.code)) {
          alertTips.value = false
            store.dispatch({
                'txt': res.code == '0400546' ? i18n_t('pre_record.cancle_fail_tips') : i18n_t('pre_record.cancle_fail_tips2'),
                hide_time: 3000
            })
        }
    }).catch(() => {
      alertTips.value = false
    })
}


</script>

<style lang="scss" scoped>
.cancel-btn {
  margin: 0 0.14rem;
    text-align: center;
    border: 1px solid var(--q-gb-bg-c-9);
    color: var(--q-gb-bg-c-9);
    line-height: 0.4rem;
    border-radius: 0.1rem;
    font-size: 0.14rem;
  }
.tips-main {
  background-color: #fff;
  border-radius: 0.1rem;
  width: 90%;
  h2 {
    font-size: 0.2rem;
    font-weight: bold;
    text-align: center;
    line-height: 3;
  }
  p {
    font-size: 0.16rem;
    padding: 0.1rem 0;
    margin-bottom: 0.2rem;
    text-align: center;
  }
  .confirm {
    font-size: 0.20rem;
    color: var(--q-info);
    line-height: 2.5;
    border-top: 1px solid #e5e5e5;
    display: flex;
    span {
      width: 50%;
      text-align: center;
      &:first-child {
        color: rgba(0,0,0,.4);
        border-right: 1px solid #e5e5e5;
      }
    }
  }
  
}
</style>
