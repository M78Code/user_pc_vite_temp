<template>
  <div class="bet-box-info" ref="pondModel" id="drag" >
    <div v-show="false"> {{UserCtr.user_version}} -- {{BetData.bet_data_class_version}}{{BetViewDataClass.bet_view_version}}</div>
    <!-- 头部信息 -->
    <betTitle />
    <!-- 展开项 -->
    <div v-show="BetData.bet_state_show" class="bet-box-content">
     <!-- {{BetData.is_bet_single}}-{{BetViewDataClass.bet_order_status}}-{{ BetViewDataClass.orderNo_bet_obj}} -->
      <!-- 单关 投注 -->
      <template v-if="BetViewDataClass.bet_order_status == 1">
        <template v-if="BetData.is_bet_single">
          <div v-for="(item,index) in BetData.bet_single_list" :key="item.playOptionId">
              <betItem :items="item" :key="index" :index="index" />
          </div>
        </template>
      </template>

      <!-- 投注后的结果 -->
      <template v-else>
        <template v-if="BetData.is_bet_single">
          <div v-for="(item,index) in BetViewDataClass.orderNo_bet_obj" :key="item.orderNo">
            <betResult :items="item" :key="index" :index="index" />
          </div>
        </template>
      </template>
       
      <!-- 底部投注信息 -->
      <betFooter v-show="BetData.bet_single_list.length || BetData.bet_s_list.length"/>
      
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { UserCtr} from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js"
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js"
import betTitle from "./components/bet-title.vue"  // 投注头部
import betItem from "./components/bet-item.vue"  // 投注列表
import betFooter from "./components/bet-footer.vue"  // 投注底部信息
import BetResult from "./components/bet-result.vue"  // 投注结果

</script>

<style scoped lang="scss">
  @import "./css/bet.scss";

  .bet-box-info{
    min-height: 55px;
  }

  .bet-box-content{
    background: var(--q-gb-bg-c-4);
    border: 1px solid var(--q-gb-bd-c-1);
    border-top: none;
  }
</style>