

<!--
 * @Author: lamp
 * @Description: 投注栏收起后的底部条
-->
<template>
  <!-- 头部 -->
  <div class="bet-bar row justify-between items-center" @touchmove.prevent @click="menu_click"
    :class="{ 'fixed-bottom': $route.name != 'matchList' && get_bet_status == 0 }">
    <div v-show="false">{{ userData.user_version }}</div>
    <div class="nonebox4-first">
        <div class="nonebox4-first-left">
            <div class="nonebox4-first-left-img">{{BetData.is_bet_single? i18n_t('app_h5.bet.odd') : i18n_t('app_h5.bet.parlay')}}</div>
            <div class="nonebox4-first-left-text">{{ i18n_t('app_h5.bet.pm_sport') }}</div>
        </div>
        <div class="nonebox4-first-right">
            <div class="nonebox4-first-right-window" @click.stop="get_balance">
                <div class="nonebox4-first-right-window-num">{{ format_money2(userData.balance) }}</div>
                <div class="refesh" :class="{ 'refesh2': is_loading_balance }"></div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import lodash from "lodash"
// import store from "src/store-redux/index.js";
import { compute_local_project_file_path, i18n_t } from "src/output/index.js";
import { format_money2 } from 'src/output/index.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import { ref,computed,onUnmounted } from 'vue';
import userData from "src/core/user-config/user-ctr.js"




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
.nonebox4-first {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.02rem 0;
}
.nonebox4-first-left {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.nonebox4-first-left-img {
    display: flex;
    width: 0.22rem;
    height: 0.22rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--q-gb-t-c-14);
    background: var(--q-gb-bg-c-13);
    border-radius: 50%;
}
.nonebox4-first-left-text {
    margin-left: 0.05rem;
    display: flex;
    font-size: .16rem;
    font-weight: 500;
    font-family: PingFang SC;
}
.nonebox4-first-right {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row;
}
.nonebox4-first-right-window {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: var(--q-gb-bg-c-22);
    padding: .04rem .08rem;
    border-radius: 0.2rem;
    height: 0.28rem;
}
.nonebox4-first-right-window-num {
    display: flex;
    font-size: 20px;
    font-weight: 700;
    color: var(--q-gb-t-c-18);
    font-family: Akrobat;
}
.nonebox4-first-right-window-img {
    display: flex;
    border-radius: 30px;
    width: 24px;
    height: 24px;
}
.nonebox4-first-right-window-img img {
    border-radius: 30px;
    width: 100%;
    height: 100%;
}



.yb-right{
  display: flex;
  padding: 0.01rem 0.02rem 0.01rem 0.06rem;
  border-radius: 0.2rem;
  background: red;
}
.yb-left{
  display: flex;
  width: 100%;
  .yb-left-tag{
    background: linear-gradient(0deg, #179CFF, #179CFF);
    linear-gradient: (0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2));
    border: 2.4rem solid rgba(255, 255, 255, 0.2);
    width: 0.25rem;
    height: 0.25rem;
    border-radius: 50%;
    border: 2.4rem;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .yb-left-title{
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 500;
    color: rgba(48, 52, 66, 1);
    margin-left: 0.05rem;
  }
}
.bet-bar {
  width: 100%;
  height: 0.5rem;
  border-radius: 0.16rem 0.16rem 0 0;
  border-width: 1px 1px 0 1px;
  //border-style: solid;
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
  width: 0.2rem;
  height: 0.2rem;
  background: url( $SCSSPROJECTPATH+"/image/svg/refresh.svg") no-repeat center / 100% 100%;
  // background: var(--q-color-com-img-bg-58) no-repeat center / 100% 100%;
  margin-left: 0.05rem
}

.refesh2 {
  animation: loading-ring-animate 0.5s linear;
}

.arrow {
  transform: scale(-1);
}</style>src/core/format/common/module/format-money.js