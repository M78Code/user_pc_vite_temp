<template>
  <div class="bet-box-info" ref="pondModel" id="drag" >
    <div v-show="false"> {{UserCtr.user_version}} -- {{BetData.bet_data_class_version}}</div>
    <!-- 头部信息 -->
    <betTitle />
    <!-- 展开项 -->
    <div  v-show="BetData.bet_state_show" class="bet-box-content">
     
      <!-- 单关 投注 -->
      <template v-if="BetData.is_bet_single">
        <div v-for="(item,index) in BetData.bet_single_list" :key="item.playOptionId">
            <betItem :items="item" :key="index" />
        </div>
      </template>

      <!-- 底部投注信息 -->
      <betFooter />
      
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { UserCtr} from "src/core/"
import BetData from "src/core/bet/class/bet-data-class.js"
import betTitle from "./components/bet-title.vue"  // 投注头部
import betItem from "./components/bet-item.vue"  // 投注列表
import betFooter from "./components/bet-footer.vue"  // 投注底部信息

</script>

<style scoped lang="scss">
  @import "./css/bet.scss";

  .bet-box-info{
    min-height: 55px;
  }

  .bet-box-content{
    background: var(--q-gb-bg-c-11);
  }
</style>