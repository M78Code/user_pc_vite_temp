<!--
 * @Author: 输入框
 * @Description: 自定义输入框
-->

<template>


</template>



<script setup>
import {ref ,reactive,provide,onMounted,computed} from 'vue'

const bet_tabs = [
  {
    name: "Single Bet", // 单关
    label: 'Single',
    active: true,
    badge: false,
  },
  {
    name: "bets", // 串关
    label: 'My Bets',
    active: false,
    badge: false,
  },
]

</script>

<style lang="scss" scoped>


</style>