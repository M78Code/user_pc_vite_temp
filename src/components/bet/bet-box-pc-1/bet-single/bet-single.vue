<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 正常赛事单关组件
-->
<template>
  <!-- 单关组件 -->
  <div class="bet-single" data-container="single-container" ref="single-container">
    <!--未投注-->
    <template v-if="bet_flag">
      <!--投注信息-->
      <bet-single-info
        :item="item"
        :index="index"
        :key="`single-${index}`"
        @get_lock_index="get_lock_index"
        @get_button_text="get_button_text"
        v-for="(item, index) in BetData.bet_single_list"
      ></bet-single-info>

      <div style="display:none;" >{{ BetData.bet_data_class_version }}</div>
      
    </template>

  </div>
</template>
<script setup>
import { ref,onMounted,computed } from "vue"
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
// 单关投注信息
import BetSingleInfo from "./bet-single-info.vue";


const get_lock_index = (val) =>{
  console.error('sa',val)
}

const get_button_text = (val) =>{
  console.error('get_button_text',val)
}
/**
 * @description: 这里预约投注成功后处理页面跳转
 * @param {undefined} undefined
 * @return {Boolean} 是否未投注: true, 已投注: false
 */
 const bet_flag = computed(() => {
      if(BetData.bet_mode == 0) {
        return false;
      }
      return BetData.bet_mode == -1 || (BetData.bet_mode == 1 && BetViewDataClass.view_ctr_obj.order_confirm_complete != 2);
    })

</script>
