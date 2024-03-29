<!--
 * @Desc: 投注记录弹框未结算页
 * @Author: Router
-->
<template>
  <div class="cathectic">
    <!-- 加载中 -->
    <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
    <loading v-if="BetRecordClass.is_loading" />
    <scroll ref="myScroll" :on-pull="onPull" v-else>
      <!-- 未结算 -->
      <div v-if="UserCtr.user_info.settleSwitch == 1 && BetRecordClass.selected === 0 && !lodash.isEmpty(BetRecordClass.list_data)" 
        :class="['cashout', 'unsellteCashout', BetRecordClass.is_early ? 'active': '']"
        @click="BetRecordClass.set_is_early(!BetRecordClass.is_early)"
      >{{ i18n_t('early.btn2') }}</div>

      <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>

      <!-- 已结算筛选、提前结算按钮 -->
      <div class="settled-select flex" v-if="BetRecordClass.selected === 1">
          <div class="select-item">
            <custom-select type="date" :init_index="2" @changeSelect="(val) => changeSelect('date', val)"></custom-select>
            <custom-select init_type="order" :init_index="0" @changeSelect="(val) => changeSelect('order', val)"></custom-select>
          </div>
          <!-- 未结算 提前结算按钮 1期隐藏 -->
          <div :class="['cashout', BetRecordClass.is_early ? 'active': '']" 
            @click="BetRecordClass.set_is_early(!BetRecordClass.is_early)"
            v-if="UserCtr.user_info.settleSwitch == 1 && !lodash.isEmpty(BetRecordClass.list_data)"
            >{{ i18n_t('early.btn2') }}</div>
      </div>

      <!-- 预约 -->
      <div v-if="BetRecordClass.selected === 2" class="is_invalid" 
        @click="BetRecordClass.set_is_invalid(!BetRecordClass.is_invalid)">
        {{ i18n_t('bet.disabled') }} <span :class="{'active': BetRecordClass.is_invalid }"></span> 
      </div>
      <template v-if="!lodash.isEmpty(BetRecordClass.early_money_list)">
        <!-- 订单内容 -->
        <div v-for="(value, name, index) in BetRecordClass.early_money_list" :key="name" class="cathectic-list">
          <q-slide-transition>
            <template>
              <div class="date-header flex">
                <span class="date"><span>{{ formatTime(new Date(name).getTime(), ['zh', 'hk'].includes(lang)?'mm/DD': 'DD/mm')}}</span></span>
                <!-- 当前日期的已结算信息总和 -->
                <div class="settled-date" v-if="BetRecordClass.selected === 1">
                  {{ i18n_t('bet_record.number') }} <span>{{value.totalOrders}}</span>
                  {{ i18n_t('bet_record.bet') }} <span>{{value.betAmount}}</span>
                  {{ i18n_t('bet_record.l/w') }} <span :class="{'oringe': value.profit > 0}">
                    <template v-if="value.profit > 0">+</template>  
                    {{value.profit}}
                  </span>
                </div>
              </div>
              <div v-for="(item2, key) in value.data" :key="item2.betTime" class="cathectic-item">
                <item-multiple-body :data_b="item2"></item-multiple-body>
              </div>
            </template>
          </q-slide-transition>
        </div>
      </template>
      <!-- 没有数据 -->
      <settle-void v-if="!BetRecordClass.is_loading && lodash.isEmpty(BetRecordClass.early_money_list)"></settle-void>
    </scroll>
  </div>
</template>

<script setup>
import lodash from 'lodash';
import { api_betting } from "src/api/index.js";
import BetRecordClass from "src/core/bet-record/h5/bet-record.js";
import BetRecordWs from "src/core/bet-record/bet-record-ws.js";
import { enum_order_by, enum_time_type } from "src/core/bet-record/h5/util.js";
import { itemMultipleBody } from "src/base-h5/components/common/cathectic-item/ouzhou-h5/index";
import settleVoid from "src/base-h5/components/cathectic/ouzhou-h5/settle-void.vue";
import scroll from "src/base-h5/components/common/record-scroll/scroll.vue";
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import UserCtr from "src/core/user-config/user-ctr.js";
import {useMittEmit, useMittOn, MITT_TYPES} from  "src/core/mitt/index.js"
import { formatTime } from 'src/output/index.js'
import { i18n_t } from "src/boot/i18n.js";
import loading from "src/components/loading/loading.vue"
import customSelect from "src/base-h5/components/cathectic/ouzhou-h5/custom-select.vue"
//语言设置
const lang = ref(UserCtr.lang)
// 锚点
const myScroll = ref(null)

// 按什么排序  [1, 2, 3]
const sort_active = ref(enum_order_by[1])
// 展示多长时间的注单记录  [1, 2, 3, 4]
const timeType = ref(enum_time_type[2])

let useMitt = null
let wsObj = null

// 延时器
let timer = null

onMounted(() => {
  // 首次进入获取数据
  init_data(BetRecordClass.selected)
  // 监听BetRecordClass.selected改变，获取数据
  useMitt = useMittOn(MITT_TYPES.EMIT_BET_RECORD_SELECTED_CHANGE, function (val) {
    init_data(val)
  }).off;
  // ws监听
  wsObj = new BetRecordWs()
})

onUnmounted(() => {
  timer && clearInterval(timer)
  useMitt && useMitt()
  // 初始化BetRecordClass状态
  BetRecordClass.init_core()
  // 取消ws监听
  wsObj && wsObj.destroy()
  wsObj = null
})

/**
   * @description 初始请求注单记录数据
   * @param {Undefined} Undefined
   * @return {Undefined} undefined
   */
const init_data = (_index) => {
  const { params, url_api } = init_params_api(_index)
  // 请求注单记录接口
  // 预约(数据需加工)
  const prevData = _index === 2
  BetRecordClass.get_order_list(params, url_api, prevData)

  // 未结算时，轮询获取提前结算列表金额
  timer && clearInterval(timer)
  if(_index === 0) {
    timer = setInterval(() => {
      if (document.visibilityState == 'visible') {
        BetRecordClass.check_early_order()
      }
    }, 5000)
  }
}

/**
 * 获取请求接口的api和params
 * @param {*} _index 当前索引
 * @param {*} _isOnPull 是否是pull分页加载(确定searchAfter要不要传参)
 */
const init_params_api = (_index, _isOnPull=false) => {
  let params = {}
  let url_api = Promise.resolve();
  switch (_index) {
    case 0:  //未结算
      params = {
        searchAfter: (_isOnPull && BetRecordClass.last_record) || undefined,
        orderStatus: '0',
      }
      url_api = api_betting.post_getH5OrderList      
      break;
    case 1:  //已结算
      params = {
        searchAfter: (_isOnPull && BetRecordClass.last_record) || undefined,
        orderStatus: '1',
        orderBy: sort_active.value,  // 按什么排序  2-默认排序（结算时间） 1-投注时间  3-开赛时间
        timeType: timeType.value
      }
      url_api = api_betting.post_getH5OrderList
      break;
    case 2: // 预约
      params = {
        searchAfter: (_isOnPull && BetRecordClass.last_record) || undefined,
        preOrderStatusList: [0, 2, 3, 4],
      }
      url_api = api_betting.get_preOrderList_news
      break;
  }
  return {
    params,
    url_api
  }
}

// 已结算页面，排序改变  2-默认排序（结算时间） 1-投注时间
const changeSelect = (type, value) => {
  if(type === 'date') {
    if(value === timeType.value) return //点击当前项
    timeType.value = value
  }
  if(type === 'order') {
    if(value === sort_active.value) return //点击当前项
    sort_active.value = value
  }
  init_data(1)
}

/**
   * @description 页面上推分页加载
   * @param {Undefined} Undefined
   * @return {Undefined} undefined
   */
const onPull = () => {
  let ele = myScroll.value
  const { params, url_api } = init_params_api(BetRecordClass.selected, true)
  BetRecordClass.onPull(params, url_api, ele)
}

</script>
    
<style lang="scss" scoped>
template {
  display: block;
}
.cathectic-item {
  width: 100%;
  background: #fff;
  overflow: hidden;
  margin-top: 0.1rem;
  padding-bottom: 0.2rem;
}
.settled-select {
  height: 0.6rem;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.14rem;
  background: #fff;
  .select-item {
    display: flex;
  }
  .select {
    height: 0.46rem;
    padding: 0.04rem;
    border-radius: 0.46rem;
    background-color: var(--q-gb-bg-c-5);
    color: var(--q-gb-bg-c-14);
    align-items: center;
    span {
      height: 0.38rem;
      line-height: 0.38rem;
      font-size: 0.14rem;
      font-weight: bold;
      border-radius: 0.5rem;
      padding: 0 0.14rem;
      &.active {
        color: var(--q-gb-bg-c-13);
        background-color: #fff;
        border: 1px solid var(--q-gb-bg-c-18);
      }
    }
  }
}
.is_invalid {
  display: flex;
  align-items: center;
  position: absolute;
  z-index: 999;
  top: 0.15rem;
  right: 0.1rem;
  font-size: 0.14rem;
  color: var(--q-gb-t-c-3);
  span {
        width: 0.17rem;
        height: 0.17rem;
        background-color: transparent;
        border-radius: 2px;
        border:1px solid var(--q-gb-t-c-3);
        position: relative;
        margin-left: 0.04rem;
        &.active {
          border: none;
          background-color: var(--q-gb-bg-c-1);
          border-color: var(--q-gb-bg-c-1);
          &:after {
            position: absolute;
            content: "";
            left: 0.04rem;
            width: 0.08rem;
            height: 0.06rem;
            top: 0.04rem;
            border-top: 2px solid #fff;
            border-right: 2px solid #fff;
            transform: rotate(135deg);
          }
        }
      }
}
.date-header {
  margin-top: 0.1rem;
  height: 0.3rem;
  align-items: center;
  padding: 0 0.14rem;
  justify-content: space-between;
  .date {
    font-size: 0.18rem;
    font-weight: bold;
  }
  .settled-date {
    font-size: 0.14rem;
    color: var(--q-gb-bg-c-14);
    span {
      font-weight: bold;
      margin-right: 0.06rem;
      color: var(--q-gb-bg-c-12);
      &.oringe {
        color: var(--q-gb-bg-c-1);
        margin-right: 0;
      }
    }
  }
}
.cashout {
    font-size: 0.14rem;
    background-color: #fff;
    height: 0.34rem;
    line-height: 0.34rem;
    width: 1rem;
    text-align: center;
    border-radius: 0.5rem;
    border: 1px solid var(--q-gb-bg-c-14);
    &.active {
      color: #fff;
      background-color: var(--q-gb-bg-c-1);
      border-color: var(--q-gb-bg-c-1);
    }
    &.unsellteCashout {
      position: absolute;
      z-index: 999;
      top: 0.08rem;
      right: 0.1rem;
    }
}
/**投注记录弹框未结算*/
.cathectic {
  height: 100%;
  overflow: hidden;

  /**提前结算筛选按钮*/
  .filter-button {
    display: flex;
    justify-content: flex-end;
    padding-top: 0.1rem;
    position: absolute;
    right: 0;
    top: 0.15rem;

    .select {
      color: var(--q-gb-t-c-12);
    }
  }

  /**订单标题*/
  .tittle-p {
    width: 3.55rem;
    height: 0.54rem;
    line-height: 0.66rem;
    margin: 0 auto;
    padding: 0 0 0 0.04rem;
    color: var(--q-cathectic-color-1);

    /**订单内容*/
    span {
      font-size: 0.18rem;
      letter-spacing: 0;
      font-weight: bold;
    }
  }

  /**订单标题2*/
  .tittle-p2 {
    width: 3.55rem;
    margin: 0 auto;
    padding: 0 0 0 0.04rem;
  }

  .icon-down-arrow {
    transform: scaleY(-1);
  }

  /**线*/
  .line {
    height: 0.5px;
  }
}

/**提前结算默认*/
.early {
  display: inline-block;
  background: url($SCSSPROJECTPATH + "/image/svg/select_b.svg") no-repeat center / contain;
  vertical-align: text-bottom;
  width: 0.14rem;
  height: 0.14rem;
}

/**提前结算*/
.early2 {
  background-image: url($SCSSPROJECTPATH + "/image/svg/select_a.svg");
}</style>