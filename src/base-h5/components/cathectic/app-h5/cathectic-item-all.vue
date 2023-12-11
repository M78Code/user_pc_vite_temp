<!--
 * @Desc: 投注记录弹框未结算页
 * @Author: Router
-->
<template>
  <div class="cathectic">
    <!-- 加载中 -->
    <!-- <SRecord v-if="BetRecordClass.is_loading" /> -->
    <scroll ref="myScroll" :on-pull="onPull">
      <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
      <template v-if="!lodash.isEmpty(BetRecordClass.list_data)">
        <!-- 订单内容 -->
        <div v-for="(value, name, index) in BetRecordClass.list_data" :key="index" class="cathectic-list">
          <q-slide-transition>
            <template>
              <div v-for="(item2, key) in value.data" :key="key" :item_data="item2" class="cathectic-item">
              <!-- 单关、串关内容显示 -->
              <template>
                <item-simple-body v-if="item2.seriesType == '1'" :data_b="item2"></item-simple-body>
                <item-multiple-body v-else :data_b="item2"></item-multiple-body>
              </template>
              <template>
                <!-- 未结算列表 => 投注记录页提前结算的按钮、滑块 -->
                <early-settle v-if="BetRecordClass.selected === 0" :item_data="item2"></early-settle>
                <!-- 已结算列表 => 提前结算详情 -->
                <early-settled-detail v-else-if="BetRecordClass.selected === 3" :item_data="item2"></early-settled-detail>
                <!-- 预约列表 => 取消预约 -->
                <cancel-reserve v-else-if="BetRecordClass.selected === 1" :orderNumber="item2.orderNo" @success="init_data(1)"></cancel-reserve>
              </template>
            </div>
            </template>
          </q-slide-transition>
        </div>
      </template>
      <!-- 没有数据 -->
      <settle-void v-else></settle-void>
    </scroll>
  </div>
</template>

<script setup>
import lodash from 'lodash';
import { api_betting } from "src/api/index.js";
import BetRecordClass from "src/core/bet-record/bet-record.js";
import BetRecordWs from "src/core/bet-record/bet-record-ws.js";
import { enum_order_by, enum_time_type } from "src/core/bet-record/util.js";
import { itemSimpleBody, itemMultipleBody, earlySettle, earlySettledDetail, cancelReserve } from "src/base-h5/components/common/cathectic-item/app-h5/index";
import settleVoid from "src/base-h5/components/cathectic/app-h5/settle-void.vue";
import scroll from "src/base-h5/components/common/record-scroll/scroll.vue";
import SRecord from "src/base-h5/components/skeleton/record.vue";
import { ref, watch, onMounted, onUnmounted } from 'vue'
import UserCtr from "src/core/user-config/user-ctr.js";
import {useMittEmit, useMittOn, MITT_TYPES} from  "src/core/mitt/index.js"
// 锚点
const myScroll = ref(null)

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
  //请求注单记录接口
  // 预约中、已失效(数据需加工)
  const prevData = (_index === 1 || _index === 2)
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
    case 0: //未结算
      params = {
        searchAfter: (_isOnPull && BetRecordClass.last_record) || undefined,
        orderStatus: '0',
      }
      url_api = api_betting.post_getH5OrderList      
      break;
    case 1: //预约中
      params = {
        preOrderStatusList: [0]
      }
      url_api = api_betting.get_preOrderList_news
      break;
    case 2: // 已失效
      params = {
        preOrderStatusList: [2, 3, 4]
      }
      url_api = api_betting.get_preOrderList_news
      break;
    case 3: //已结算
      params = {
        searchAfter: (_isOnPull && BetRecordClass.last_record) || undefined,
        orderStatus: '1',
        orderBy: enum_order_by[1],  // 默认排序（结算时间）
        timeType: enum_time_type[2]  //七日内
      }
      url_api = api_betting.post_getH5OrderList
      break;
  }
  return {
    params,
    url_api
  }
}

/**
 * @description 页面上推分页加载
 * @param {Undefined} Undefined
 * @return {Undefined} undefined
 */
const onPull = () => {
  const ele = myScroll.value
  const _index = BetRecordClass.selected
  const { params, url_api } = init_params_api(_index, true)
  // 预约中、已失效(数据需加工)
  const prevData = (_index === 1 || _index === 2)
  BetRecordClass.onPull(params, url_api, ele, prevData)
}
</script>
    
<style lang="scss" scoped>
template {
  display: block;
}

.cathectic-item {
  width: 100%;
  border-radius: 0.1rem;
  //background: var(--q-gb-bg-c-15);
  background: url($SCSSPROJECTPATH + "/image/png/cathectic-item-all_bg.png");
  background-size: cover;
  overflow: hidden;
  margin: 0 0 0.1rem;
  padding-bottom: 0.2rem;
}

/**投注记录弹框未结算*/
.cathectic {
  height: 100%;
  border-radius: 0.1rem;
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