<!--
 * @Description: bw3新版混合过关投注选项
-->
<template>
  <div class="bet-mix-detail half-border-bottom" ref="bet_mix_detail" v-if="index_ == 0 || get_is_spread" :class="{'bet-mix-detail2':get_bet_list.length -1 == index_}">
    <div class="content-box2 yb_px14 row items-center">
      <!-- 左 -->
      <div class="content-t">
        <p class="yb_fontsize16">{{$root.$t(`bet.bet_${value_.id}`)}} X {{value_.count}}&nbsp;&nbsp;&nbsp;{{mix_odds}}</p>
        <p style="font-size:0.11rem">{{$root.$t('bet.total_win2')}} <span :class="{'red-color':!(max_win_money == '0.00' || money_ok),'yellow-color':money_ok && money}"
            class="yb_fontsize12">&thinsp;{{ max_win_money | format_money2 }}</span></p>
      </div>
      <!-- 右 -->
      <div class="content-b" :class="{'red-color':!money_ok,'content-b2':!(get_active_index == index_ && [1, 7].includes(+get_bet_status))}" @click="change_kbdshow">
        <span v-if="money" class="yb_fontsize20 money-number">{{money | format_money3}}</span>
        <span class="money-span" ref="money_span" :class="{'money-span2':!(get_active_index == index_ && [1, 7].includes(+get_bet_status))}"></span>
        <span v-if="!money && max_money_back" class="yb_fontsize14 limit-txt">{{get_money_format()}}</span>
        <span @click.stop="clear_money" class="money-close" :style="{opacity:money>0?'1':'0'}">x</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import betting from 'src/project/mixins/betting/betting.js';
const licia_format = require('licia/format');
import global_filters from 'src/boot/global_filters.js';



</script>
<style lang="scss" scoped>

</style>
