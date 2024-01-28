<!--
 * @Author: Iverson
 * @Date: 2022-06-18 
 * @Description: 
-->
<template>
    <div class="main-box fixed-center text-center">
        <p class="text-left yb_fontsize14">{{ i18n_t("app_h5.cathectic.confirm_cancel_reservation") }}</p>
        <footer class="yb_fontsize16">
            <span class="cancle-button button" @click.self="emit('cancel')">{{ i18n_t("common.cancel") }}</span>
            <span class="confirm-button button" @click.self="cancle_pre_order">{{ i18n_t("common.ok") }}</span>
        </footer>
    </div>
</template>
  
<script setup>
import { api_betting } from "src/api/index.js";
import { i18n_t } from 'src/output/index.js'
const props = defineProps({
    orderNo: {
        type: String,
        default: ''
    },
})

/**
 *@descript 取消预约投注项
*@param {String} orderNumer 订单号
*/
const emit = defineEmits(['success', 'cancel'])
const cancle_pre_order = () => {
    api_betting.cancle_pre_order({ orderNo: props.orderNo }).then((result) => {
        let res = result.status ? result.data : result;
        if (res.code == 200) {
            emit('success')
        } else {
            emit('success')

        }
    }).catch(() => {})
}
</script>
<style lang="scss" scoped>
.main-box {
    width: 3.2rem;
    box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.1);
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
        }
    }
}
</style>