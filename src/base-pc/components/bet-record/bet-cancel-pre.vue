<!--
 * @Desc: 取消预约
 * @Author:
-->
<template>
  <span :class="[type === 'history' ? 'cancel' : '']" @click="alertTips=true;">{{ i18n_t('select.cancel') }}</span>
  <!-- 取消预约弹框 -->
  <q-dialog v-model="alertTips">
    <div class="tips-main">
      <p>{{ cancel_book_msg(item.detailList[0].matchInfo, i18n_t('bet.bet_book_cancel_msg')) }}</p>
      <div class="confirm">
        <span @click="alertTips=false;">{{ i18n_t('common.cancel') }}</span>
        <span @click="cancle_pre_order">{{ i18n_t('common.confirm') }}</span>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { api_betting } from "src/api/index.js";
import { i18n_t } from "src/output/index.js";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"

const props = defineProps({
type: {
  type: String,
  default: ''
},
item: {
  type: Object,
  default: () => {}
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
  api_betting.cancle_pre_order({ orderNo: props.item.orderNo }).then((result) => {
      let res = result.status ? result.data : result;
      if (res.code == 200) {
          alertTips.value = false
          emit('success')
      } else {
        alertTips.value = false
      }
  }).catch(() => {
    alertTips.value = false
  })
}

const cancel_book_msg = (match, msg) => {
  if(match) {
    let match_ = match.replace(/ v /i, ' VS ')
    const arr = msg.split('[x]')
    return arr[0] + match_ + arr[1];
  }
}

</script>

<style lang="scss" scoped>
  .cancel {
    border: 1px solid var(--q-gb-t-c-7);
    width: 44px;
    text-align: center;
    border-radius: 10px;
    font-size: 12px;
    margin-top: 6px;
    cursor: pointer;
  }
.tips-main {
  width: 360px;
  height: 200px;
  background-color: var(--q-gb-bg-c-14);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    padding: 30px 0;
  }
  .confirm {
    display: flex;
    justify-content: center;
     span {
      width: 100px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
      color: #fff;
      background-color: var(--q-gb-bg-c-4);
      border-radius: 6px;
      margin: 0 12px;
     }
  }
}
</style>