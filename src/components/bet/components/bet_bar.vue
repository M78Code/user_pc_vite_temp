
<!--
 * @Author: lamp
 * @Description: 投注栏收起后的底部条
-->
<template>
  <!-- 头部 -->
    <div class="bet_content_header">
      <div class="header_info_left">
        <span>{{ bet_headle_info.quantity }}</span>
        <span>Bet Slip</span>
      </div>

      <div class="header_info_right">
        <span>{{ format_money2(bet_headle_info.amount) }}</span>
      </div>
    </div>
</template>

<script setup>
import {ref , reactive} from 'vue'
import { format_money2 } from 'src/core/utils/global-filters.js'



const amount = ref('999999')


let bet_headle_info = reactive({
  quantity:1,
  amount:98684.32
}); // 头部金额
  
</script>


<style lang="scss" scoped>


</style>
