
<!--
 * @Author: lamp
 * @Description: 投注栏收起后的底部条
-->
<template>
  <!-- 头部 -->
  <div class="bet-bar row justify-between items-center" @touchmove.prevent @click="menu_click" :class="{'fixed-bottom':$route.name != 'matchList' && get_bet_status == 0}">
    <div>
      <span class="bet-num">{{get_bet_list.length}}</span>
      <!-- 投注单 -->
      <span class="yb_fontsize16 yb_ml8">
        <template v-if="get_bet_status != 0"><span>{{}}</span></template>
        <template v-else>
          <span class="odds-wrapper">{{}}
          <span class='odds'>{{mix_sum_odds}}</span>
          </span>
        </template>
      </span>
    </div>
    <img  src="image/wwwassets/bw3/svg/bet_close.svg"  v-if="[3, 6, 8].includes(+get_bet_status)" alt="">
    <div class="row items-center" v-else>
      <div class="account-wrap yb_pr16 text-right relative-position" @click.stop="get_balance">
        <!-- 账户余额 -->
        <p class="text-right account-p">{{}}</p>
        <p class="yb_fontsize16">{{ format_money2(get_user.balance)}}</p>
      </div>
      <!-- 金额刷新按钮 -->
      <div class="refesh yb_mr8" :class="{'refesh2':is_loading_balance}" @click.stop="get_balance"></div>
      <div class="yb_pl14 yb_pt4"><img  src="image/wwwassets/bw3/svg/doubleleft2.svg" :class="{'arrow':get_bet_status == 0}"/></div>
    </div>
  </div>
</template>

<script setup>
import {ref , reactive} from 'vue'
import { format_money2 } from 'src/core/utils/global-filters.js'
import lodash from "lodash"


let get_bet_status = ref(0)
let get_bet_list = ref()
let mix_sum_odds = ref()
let is_loading_balance = ref(false)
let balance_timer = null // 延时器
let get_user = ref(0)  // 用户信息
let get_is_combine = true  //是不是冠军
let get_menu_type = 2  // 当前主菜单的menu_type
let get_is_mix = false  // 是否串关
let get_bet_obj = false  // 投注相关对象
let get_money_total = 0  // 总金额


let bet_headle_info = reactive({
  quantity:1,
  amount:98684.32
}); // 头部金额

// 悬浮条点击 
const menu_click = ()=>{
   // 至少选择几场比赛
   let min_num = lodash.get(get_user.value, 'configVO.minSeriesNum', 2)
  // 投注数组信息
  let bet_list = get_bet_list.value

  if (get_mix_bet_flag && bet_list.length < min_num) {
    set_toast({ 'txt': this.$root.$t('bet.match_min', [min_num]) });
    return
  }

  if (get_bet_status.value != 0) {
    return
  }

  if (bet_list.length == 1) {
    set_is_mix(false)
  }
  // 储存到数据仓库
  // set_active_index(0)
  // set_bet_status(1)

  if (bet_list.length == 1) {
    // 单关时若金额不合要求，则清除金额
    let _money =  +lodash.get(get_bet_obj[get_bet_list[0]],'money')
    if (!_money || _money < 0.01 || _money > +get_user.value.balance) {
      set_money_total('clear_')
    }
  }

  if (
      get_is_combine &&
      ![3000, 900, 11].includes(+get_menu_type) &&
      !get_is_mix
  ) {
    let _money = 0,
        _money_total = get_money_total
        lodash.forIn(get_bet_obj, function(item, key) {
      if (+item.money > 0.01) {
        _money = _money + +item.money
      }
    })
  set_money_total(_money - _money_total)
}
}

// 获取用户余额
const get_balance = ()=>{
  if (is_loading_balance.value) {return};

    is_loading_balance.value = true;
    // 清除延时器
    clearTimeout(balance_timer);
    balance_timer = setTimeout(() => {
      is_loading_balance.value = false;
    }, 800);

    fetch_balance()
}
// 卸载清除计时器
onUnmounted(()=>{
  clearInterval(balance_timer)
  balance_timer = null
})

  
</script>


<style lang="scss" scoped>


</style>
