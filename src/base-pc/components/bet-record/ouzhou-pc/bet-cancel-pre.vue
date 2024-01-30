<!--
 * @Desc: 取消预约
 * @Author:
-->
<template>
  <span class="cancel" @click="alertTips=true;">{{ i18n_t('select.cancel') }}</span>
  <div class="tips-bg" v-if="alertTips"></div>
  <!-- 取消预约弹框 -->
  <div class="tips-main" v-if="alertTips">
    <p>{{ cancel_book_msg(item.detailList[0].matchInfo, i18n_t('bet.bet_book_cancel_msg')) }}</p>
    <div class="confirm">
      <span @click="alertTips=false;">{{ i18n_t('common.cancel') }}</span>
      <span class="ok" @click="cancle_pre_order">{{ i18n_t('common.confirm') }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api_betting } from "src/api/index.js";
import { i18n_t } from "src/output/index.js";
import { useMittOn, MITT_TYPES, useMittEmit } from "src/core/mitt/"

const props = defineProps({
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
    border: 1px solid var(--q-gb-t-c-5);
    border-radius: 10px;
    width: 50px;
    text-align: center;
    margin-top: 10px;
    cursor: pointer;
  }
.tips-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,.3);
  z-index: 99;
}
.tips-main {
  width: 360px;
  height: 200px;
  background-color: var(--q-gb-bg-c-4);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 100;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
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
      border-radius: 20px;
      margin: 0 12px;
      color: var(--q-gb-t-c-5);
      border: 1px solid var(--q-gb-t-c-5);
      &.ok {
        background-color: var(--q-gb-bg-c-1);
        border-color: var(--q-gb-bg-c-1);
        color: var(--q-gb-t-c-1);
      }
     }
  }
}
</style>