<!--
 * @Author: Router
 * @Date: 2020-08-20 18:35:53
 * @Description: bw3新版混合投注成功底部横条
-->

<template>
    <div class="bet-success-bar yb_px14 yb_py14">
      <!-- 上 -->
      <div class="row justify-between items-center">
        <p style="font-weight:600" class="yb_fontsize16 p-left">
          {{item_.seriesValue}}&thinsp;X&thinsp;{{item_.seriesSum}}<template v-if="mix_odds">&thinsp;&nbsp;@{{mix_odds}}</template>
        </p>
        <p class="yb_fontsize14 text-right status-mark" :style="calc_color">
          <!-- 投注成功 -->
          <span v-if="order_tatus == 1" class="color1"><img  src="image/wwwassets/bw3/svg/bet_chengg.svg">{{ i18n_t('bet.bet_suc')}}</span>
          <!-- 投注失败 -->
          <span v-if="order_tatus == 0" class="color3"><img  src="image/wwwassets/bw3/svg/bet_shib.svg">{{ i18n_t('bet.bet_err')}}</span>
           <!-- 提交成功 -->
          <!-- <span v-if="order_tatus == 2" class="color2">
             <img class="img" :style="compute_img_url('icon-tojiao')">
           
            {{ i18n_t('bet.submitted_successfully')}}</span> -->
        </p>
      </div>
      <!-- 下 -->
      <div class="row justify-between items-center yb_fontsize14 money-d">
        <!-- 最高可赢 -->
        <p>{{ i18n_t('bet.total_win2')}}：<span :class="len == 1?'color4':'color5'"><template v-if="len == 1"></template>{{max_win_money}}</span></p>
        <!-- 投注金额 -->
        <p class="text-right">{{ i18n_t('bet.bet_val')}}：<span class="color6"><template v-if="len == 1"></template>{{(item_.seriesBetAmount / 100).toFixed(2)}}</span> </p>
    </div>
  </div>
</template>

<script setup>
// import bettinglist from 'src/project/mixins/betting/betting.js';
import { UserCtr ,compute_img_url} from "src/output/index.js";
import { ref, onMounted,watch,computed,onUnmounted } from 'vue';
import lodash from 'lodash'


// mixins: [bettinglist],

const order_tatus =  ref(1)   //1-投注成功  2-投注确认中  0-投注失败
const max_win_money2 = ref()  //订单确认后的最高可赢或者自己计算的最高可赢
const finally_winmoney = ref(0)   //订单确认后的最高可赢
const counter_= ref()   //计时器

const store_state = store.getState()

const get_s_count_data = ref(store_state.get_s_count_data)


// const update_state = () => {
//   const new_state = store.getState()
//   const get_s_count_data = new_state.get_s_count_data
// }

 //串关总赔率
 const mix_odds = computed(() =>{//当前串关赔率
    const s_count_data = get_s_count_data.value
    const has_sum_odds = lodash.find(s_count_data,(o)=>{//判断串关列表中是否有总赔率
      return o.orderno == item_.orderNo
    })
    return lodash.get(has_sum_odds,'odds') || ''
  })
  const calc_color = computed(()=>{
    if (order_tatus.value == 1) {
      return { color: "#66A754" }
    } else if (order_tatus.value == 2) {
      return { color: "#FF9124" }
    } else {
      return { color: "#FF2A2A" }
    }
  })
  const max_win_money = computed(()=>{
    max_win_money2.value = finally_winmoney || (item_.maxWinAmount / 100).toFixed(2);
    return max_win_money2;
  })

  onnounted(()=>{
    if (order_tatus.value == 0) {
      $emit('update_money', -max_win_money2, -(item_.seriesBetAmount / 100).toFixed(2));   //投注失败后，要从总最高可赢和总投注额剔除
    };
  })

</script>
<style lang="scss" scoped>
.bet-success-bar {
  .status-mark {
    img {
      width: 0.158rem;
      margin-right: 0.08rem;
      transform: translateY(16%);
    }
  }
}
</style>