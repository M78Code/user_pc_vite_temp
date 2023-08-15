
<!--
 * @Author: lamp
 * @Description: 投注栏收起后的底部条
-->
<template>
  <!-- 头部 -->
  <div class="bet-bar row justify-between items-center" @touchmove.prevent @click="menu_click"
    :class="{ 'fixed-bottom': $route.name != 'matchList' && get_bet_status == 0 }">
    <div>
      <span class="bet-num">{{ get_bet_list.length }}</span>
      <!-- 投注单 -->
      <span class="yb_fontsize16 yb_ml8">
        <template v-if="get_bet_status != 0"><span>{{}}</span></template>
        <template v-else>
          <span class="odds-wrapper">{{}}
            <span class='odds'>{{ mix_sum_odds }}</span>
          </span>
        </template>
      </span>
    </div>
    <img src="image/wwwassets/bw3/svg/bet_close.svg" v-if="[3, 6, 8].includes(+get_bet_status)" alt="">
    <div class="row items-center" v-else>
      <div class="account-wrap yb_pr16 text-right relative-position" @click.stop="get_balance">
        <!-- 账户余额 -->
        <p class="text-right account-p">{{}}</p>
        <p class="yb_fontsize16">{{ format_money2(get_user.balance) }}</p>
      </div>
      <!-- 金额刷新按钮 -->
      <div class="refesh yb_mr8" :class="{ 'refesh2': is_loading_balance }" @click.stop="get_balance"></div>
      <div class="yb_pl14 yb_pt4"><img src="image/wwwassets/bw3/svg/doubleleft2.svg"
          :class="{ 'arrow': get_bet_status == 0 }" /></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { format_money2 } from 'src/core/utils/global-filters.js'
import lodash from "lodash"
import store from "src/store-redux/index.js";


let balance_timer = null // 延时器


const store_state = store.getState()
const get_bet_list = ref(store_state.get_bet_list)
const get_s_count_data = ref(store_state.get_s_count_data)
const get_lang = ref(store_state.get_lang)
const get_mix_bet_flag = ref(store_state.get_mix_bet_flag)
const get_bet_status = ref(store_state.get_bet_status)
const get_menu_type = ref(store_state.get_menu_type) // 当前主菜单的menu_type
const get_bet_obj = ref(store_state.get_bet_obj)  // 投注相关对象
const get_is_combine = ref(store_state.get_is_combine)  //是不是冠军
const get_is_mix = ref(store_state.get_is_mix) // 是否串关
const get_money_total = ref(store_state.get_money_total)  // 总金额

const unsubscribe = store.subscribe(() => {
  update_state()
})

const update_state = () => {
  const new_state = store.getState()
  get_bet_list = new_state.get_bet_list
  get_s_count_data = new_state.get_s_count_data
  get_lang = new_state.get_lang
  get_mix_bet_flag = new_state.get_mix_bet_flag
  get_bet_status = new_state.get_bet_status
  get_menu_type = new_state.get_menu_type
  get_bet_obj = new_state.get_bet_obj
  get_is_combine = new_state.get_is_combine
  get_is_mix = new_state.get_is_mix
  get_money_total = new_state.get_money_total
}

let bet_headle_info = reactive({
  quantity: 1,
  amount: 98684.32
}); // 头部金额

// 悬浮条点击 
const menu_click = () => {
  // 至少选择几场比赛
  let min_num = lodash.get(get_user.value, 'configVO.minSeriesNum', 2)
  // 投注数组信息
  let bet_list = get_bet_list.value

  if (get_mix_bet_flag.value && bet_list.length < min_num) {
    set_toast({ 'txt': this.$root.$t('bet.match_min', [min_num]) });
    return
  }

  if (get_bet_status.value.value != 0) {
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
    let _money = +lodash.get(get_bet_obj.value[get_bet_list[0]], 'money')
    if (!_money || _money < 0.01 || _money > +get_user.value.balance) {
      set_money_total('clear_')
    }
  }

  if (
    get_is_combine.value &&
    ![3000, 900, 11].includes(+get_menu_type.value) &&
    !get_is_mix.value
  ) {
    let _money = 0,
      _money_total = get_money_total.value
    lodash.forIn(get_bet_obj.value, function (item, key) {
      if (+item.money > 0.01) {
        _money = _money + +item.money
      }
    })
    set_money_total(_money - _money_total)
  }
}

// 获取用户余额
const get_balance = () => {
  if (is_loading_balance.value) { return };

  is_loading_balance.value = true;
  // 清除延时器
  clearTimeout(balance_timer);
  balance_timer = setTimeout(() => {
    is_loading_balance.value = false;
  }, 800);

  fetch_balance()
}

const mix_sum_odds = computed(() => {
  if (get_is_mix.value) {
    const mix_data = get_s_count_data.value
    let S = ''
    if (mix_data.length == 0 || mix_data.length == 1 && this.get_bet_list.length == 1) {//串关，但是投注项数量为1，取当前投注项赔率
      const odds = _.get(_.values(this.get_bet_obj.value)[0], 'bs.hps.0.hl.0.ol.0.ov')
      const hsw = _.get(_.values(this.get_bet_obj.value)[0], 'bs.hps[0].hsw') || 0
      const csid = _.get(_.values(this.get_bet_obj.value)[0], 'bs.csid') || 0
      S = this.compute_value_by_cur_odd_type(odds / 100000, null, hsw, null, csid)
    } else {
      S = mix_data.length > 0 ? mix_data[0].odds : ''
    }
    if (S && this.get_bet_list.length > 1) {
      S = S + ''
      if (S.length > 9) {//超过9位数，显示前六位，后面小数点代替
        return '@' + S.substring(0, 6) + '...'
      } else {
        return '@' + S
      }
    } else {
      return ''
    }
  }
  return ''
})
// 卸载清除计时器
onUnmounted(() => {
  clearInterval(balance_timer)
  balance_timer = null
  unsubscribe()
})


</script>


<style lang="scss" scoped></style>
