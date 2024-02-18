<!--
 * @Author: Iverson
 * @Date: 2022-06-18 
 * @Description: 
-->
<template>
    <div class="tips-main">
        <p class="text-left yb_fontsize14">{{ cancel_book_msg(matchInfo, i18n_t('pre_record.confirm_matchinfo')) }}</p>
        <footer class="yb_fontsize16">
            <span class="cancle-button button" @click.self="emit('cancel')">{{ i18n_t("common.cancel") }}</span>
            <span class="confirm-button button" @click.self="cancle_pre_order">{{ i18n_t("common.ok") }}</span>
        </footer>
    </div>
</template>
  
<script setup>
import { api_betting } from "src/api/index.js";
import { i18n_t } from 'src/output/index.js'
import { ref, onMounted, computed } from 'vue'
import { useMittEmit, MITT_TYPES } from  "src/core/mitt/index.js"
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
const props = defineProps({
    matchInfo: {
        type: String,
        default: ''
    },
    orderNo: {
        type: String,
        default: ''
    },
})
/**
 *@descript 取消预约投注项
*@param {String} orderNumer 订单号
*/
const emit = defineEmits(['cancel'])
const cancle_pre_order = () => {
    api_betting.cancle_pre_order({ orderNo: props.orderNo }).then((result) => {
        let res = result.status ? result.data : result;
        if (res.code == 200) {
            emit('cancel')
            // 通知 cathectic-item-all, 重新获取预约数据 
            BetRecordClass.last_record = ''
            useMittEmit(MITT_TYPES.EMIT_BET_RECORD_SELECTED_CHANGE, 2)
        } else {

        }
    }).catch(() => {})
}

const cancel_book_msg = (match, msg) => {
  if(match) {
    let match_ = match.replace(/ v /i, ' VS ')
    const arr = msg.split('{0}')
    return arr[0] + match_ + arr[1];
  }
}
</script>
<style lang="scss" scoped>

.tips-main {
    width: 3.2rem;
    border-radius: 0.1rem;
    padding: 0.42rem 0.2rem 0;
    background-color: var(--q-gb-bg-c-2);

    p {
        line-height: 0.24rem;
        margin-bottom: 0.3rem;
        text-align: center;
    }

    footer {
        display: flex;
        margin-bottom: 0.2rem;
        justify-content: space-between;

        .button {
            border-radius: 0.18rem;
            flex: 1;
            font-size: 0.16rem;
            text-align: center;
            height: 0.36rem;
            line-height: 0.36rem;
        }

        .cancle-button {
            margin-right: 0.2rem;
            border: 1px solid var(--q-gb-bg-c-14);
        }
        .confirm-button {
            background-color: var(--q-gb-bg-c-1);
            color: var(--q-gb-t-c-2);
        }
    }
}
</style>