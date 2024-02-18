<!--
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 正常赛事单关组件
-->
<template>
  <!-- 单关组件 -->
  <div class="bet-single" data-container="single-container" ref="single-container">

    <div v-show="false">{{ BetData.bet_data_class_version }}-{{BetViewDataClass.bet_view_version}}</div>

    <!--未投注-->
    <template v-if="BetViewDataClass.bet_order_status == 1">
      <!--投注信息-->
      <bet-item :items="item" :index="index" :key="`single_${index}`" v-for="(item, index) in BetData.bet_single_list"></bet-item>
      
      <!-- 多项单注 -->
      <div v-if="BetData.is_bet_merge && BetData.bet_single_list.length>1">
        <q-card flat class="relative-position bet-multiple bet-card q-card q-card--flat no-shadow">
          <BetMultipleInput />
        </q-card>
      </div>

    </template>
 
    <!-- 已投注 -->
    <template v-else>
      <!--投注后信息-->
      <bet-single-record></bet-single-record>
    </template>

  </div>
</template>
<script setup>
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
// 单关投注信息
import BetItem from "./bet-item.vue";
// 单关投注后信息
import BetSingleRecord from "./bet-single-record.vue";
import BetMultipleInput from "./bet-multiple-input.vue"


</script>
