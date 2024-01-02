

<!--
 * @Author: lamp
 * @Description: 投注栏收起后的底部条
-->
<template>
  <!-- 头部 -->
  <div class="bet-bar row justify-between items-center" @touchmove.prevent @click="menu_click"
    :class="{ 'fixed-bottom': $route.name != 'matchList' && get_bet_status == 0 }">
    <div>
      <span class="bet-num">{{ BetData.bet_single_list.length}}</span>
      <!-- 投注单 -->
      <span class="yb_fontsize16 yb_ml8">
        <template v-if="get_bet_status != 0"><span>{{i18n_t('bet.bet_record')}}</span></template>
        <template v-else>
          <span class="odds-wrapper">{{i18n_t("footer_menu.bet_record")}}
            <span class='odds'>{{ mix_sum_odds }}</span>
          </span>
        </template>
      </span>
    </div>
    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/bet/bet_close.svg`" v-if="[3, 6, 8].includes(+get_bet_status)" alt="">
    <div class="row items-center" v-else>
      <div class="account-wrap yb_pr16 text-right relative-position" @click.stop="get_balance">
        <!-- 账户余额 -->
        <p class="text-right account-p">{{i18n_t("bet.account_balance")}}</p>
        <p class="yb_fontsize16">{{ format_money2(userData.balance) }}</p>
      </div>
      <!-- 金额刷新按钮 -->
      <div class="refesh yb_mr8" :class="{ 'refesh2': is_loading_balance }" @click.stop="get_balance"></div>
      <div class="yb_pl14 yb_pt4"><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/bet/doubleleft2.svg`"
          :class="{ 'arrow': get_bet_status == 0 }" /></div>
    </div>
  </div>
</template>

<script setup>
import lodash from "lodash"
////import store from "src/store-redux/index.js";
// import { UserCtr } from "src/output/index.js";
import { format_money2 } from 'src/output/index.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import { ref,computed,onUnmounted } from 'vue';
import userData from "src/core/user-config/user-ctr.js"
import { project_name } from "src/output/index.js"




let balance_timer = null // 延时器


const get_bet_status = ref(true)
const is_loading_balance = ref(false) // 金额刷新中？


// const store_state = store.getState()
// const get_s_count_data = ref(store_state.get_s_count_data)
// const get_mix_bet_flag = ref(store_state.get_mix_bet_flag)
// const get_menu_type = ref(store_state.get_menu_type) // 当前主菜单的menu_type
// // const get_bet_obj = ref(store_state.get_bet_obj)  // 投注相关对象
// // const get_is_combine = ref(store_state.get_is_combine)  //是不是冠军

// const unsubscribe = store.subscribe(() => {
//   update_state()
// })



// 悬浮条点击 
const menu_click = () => {
  return
  // 至少选择几场比赛
  let min_num = lodash.get(UserCtr, 'configVO.minSeriesNum', 2)
  // 投注数组信息
  let bet_list = BetData.bet_list

  if (get_mix_bet_flag.value && bet_list.length < min_num) {
    set_toast({ 'txt': i18n_t('bet.match_min', [min_num]) });
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
    let _money = +lodash.get(view_ctr_obj[BetData.bet_list[0]], 'money')
    if (!_money || _money < 0.01 || _money > +UserCtr.balance) {
      set_money_total('clear_')
    }
  }

  if (
    get_is_combine.value &&
    ![3000, 900, 11].includes(+get_menu_type.value) &&
    !BetData.bet_is_mix.value
  ) {
    let _money = 0,
      _money_total = BetData.bet_money_total.value
    lodash.forIn(view_ctr_obj, function (item, key) {
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

  userData.get_balance()
}

const mix_sum_odds = computed(() => {
  if (BetData.bet_is_mix.value) {
    const mix_data = get_s_count_data.value
    let S = ''
    if (mix_data.length == 0 || mix_data.length == 1 && this.BetData.bet_list.length == 1) {//串关，但是投注项数量为1，取当前投注项赔率
      const odds = lodash.get(lodash.values(this.view_ctr_obj)[0], 'bs.hps.0.hl.0.ol.0.ov')
      const hsw = lodash.get(lodash.values(this.view_ctr_obj)[0], 'bs.hps[0].hsw') || 0
      const csid = lodash.get(lodash.values(this.view_ctr_obj)[0], 'bs.csid') || 0
      S = this.compute_value_by_cur_odd_type(odds / 100000, null, hsw, null, csid)
    } else {
      S = mix_data.length > 0 ? mix_data[0].odds : ''
    }
    if (S && this.BetData.bet_list.length > 1) {
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
})


</script>


<style lang="scss" scoped>
.bet-bar {
  width: 100%;
  height: 0.5rem;
  padding: 0 0.2rem 0 0.12rem;
  border-radius: 0.16rem 0.16rem 0 0;
  border-width: 1px 1px 0 1px;
  border-style: solid;
  position: relative;

  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 50%;
    right: 0.48rem;
    transform: translateY(-50%);
    width: 1px;
    height: 0.2rem;
    border-radius: 0.5px;
    background: rgba(0, 0, 0, 0.1);
  }

  .odds-wrapper {
    display: inline-flex;
    align-items: center;

    .odds {
      margin-left: 0.04rem;
    }
  }

  img {
    width: 0.12rem;
    height: 0.12rem;
    opacity: 0.7;
  }
}

.fixed-bottom {
  position: fixed;
  z-index: 400;
  bottom: -2px;
}

.bet-num {
  width: 0.2rem;
  line-height: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  padding-top: 1px;
  text-align: center;
  font-size: 0.14rem;
  border-radius: 100%;
  display: inline-block;
}

.account-p {
  font-size: 0.11rem;
  margin-bottom: -0.04rem;
}

// 刷新按钮
@keyframes loading-ring-animate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.refesh {
  width: 0.12rem;
  height: 0.12rem;
  background: url($SCSSPROJECTPATH + "/image/bet/shuaxin.svg") no-repeat center / 100% 100%;
  // background: var(--q-color-com-img-bg-58) no-repeat center / 100% 100%;
}

.refesh2 {
  animation: loading-ring-animate 0.5s linear;
}

.arrow {
  transform: scale(-1);
}</style>
