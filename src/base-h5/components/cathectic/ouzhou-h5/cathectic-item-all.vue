<!--
 * @Desc: 投注记录弹框未结算页
 * @Author: Router
-->
<template>
  <div class="cathectic">
    <!-- 加载中 -->
    <loading v-if="!is_loading" />
    <scroll ref="myScroll" :on-pull="onPull">
      <!-- 未结算 cashout 按钮 -->
      <div v-if="UserCtr.user_info.settleSwitch == 1 && BetRecordClass.selected === 0 && !lodash.isEmpty(BetRecordClass.list_data)" 
      :class="['cashout', 'unsellteCashout', BetRecordClass.is_early ? 'active': '']"
      @click="BetRecordClass.set_is_early(!BetRecordClass.is_early)">{{ i18n_t('early.btn2') }}</div>
      <!-- BetRecordClass.bet_record_version -->
      <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
      <!-- 已结算筛选按钮 -->
      <div class="settled-select flex" v-if="BetRecordClass.selected === 1">
          <div class="select flex">
            <span :class="{'active': sort_active === 2}" @click="sortChange(2)">{{ i18n_t('bet_record.settle_time') }}</span>
            <span :class="{'active': sort_active === 1}" @click="sortChange(1)">{{ i18n_t('bet_record.bet_time') }}</span>
          </div>
          <div 
            :class="['cashout', BetRecordClass.is_early ? 'active': '']" 
            @click="BetRecordClass.set_is_early(!BetRecordClass.is_early)"
            v-if="UserCtr.user_info.settleSwitch == 1 && !lodash.isEmpty(BetRecordClass.list_data)"
            >{{ i18n_t('early.btn2') }}</div>
      </div>
      <template v-if="!lodash.isEmpty(BetRecordClass.early_money_list)">
        <!-- 订单内容 -->
        <div v-for="(value, name, index) in BetRecordClass.early_money_list" :key="name" class="cathectic-list">
          <q-slide-transition>
            <template>
              <div class="date-header flex">
                <span class="date"><span>{{ formatTime(new Date(name).getTime(), 'mm/DD')}}</span></span>
                <!-- 第一项显示 cashout按钮、 已结算信息 -->
                <!-- <div class="settled-date" v-if="BetRecordClass.selected === 1 && index === 0">
                  Number <span>2</span>
                  Bet <span>20</span>
                  Lose/Win <span class="oringe">+20.00</span>
                </div> -->
              </div>
              <div v-for="(item2, key) in value.data" :key="item2.betTime" class="cathectic-item">
                <item-multiple-body :data_b="item2"></item-multiple-body>
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
import { itemMultipleBody } from "src/base-h5/components/common/cathectic-item/ouzhou-h5/index";
import settleVoid from "src/base-h5/components/cathectic/ouzhou-h5/settle-void.vue";
import scroll from "src/base-h5/components/common/record-scroll/scroll.vue";
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import UserCtr from "src/core/user-config/user-ctr.js";
import {useMittEmit, useMittOn, MITT_TYPES} from  "src/core/mitt/index.js"
import { formatTime } from 'src/core/format/index.js'
import { i18n_t } from "src/boot/i18n.js";
import loading from "src/base-h5/components/common/loading.vue"
// 锚点
const myScroll = ref(null)
//是否在加载中
const is_loading = ref(false)
//list_data里面最后的一条数据的日期 '2020-11-17'
const last_record = ref('')
// 是否存在下一页
const is_hasnext = ref(false)
// 接口是否返回错误码为0401038限频
const is_limit = ref(false)
// 按什么排序  2-默认排序（结算时间） 1-投注时间  3-开赛时间
const sort_active = ref(2)
// 展示多长时间的注单记录  (1:今天 2:昨日 3:七日内 4:一月内)
const timeType = ref(1)
//需要查绚提前结算金额的订单集合
const orderNumberItemList = ref([])
let useMitt = null

// 延时器
const timer_1 = ref(null)
const timer_2 = ref(null)

onMounted(() => {
  // 首次进入获取数据
  init_data(BetRecordClass.selected)
  // 监听BetRecordClass.selected改变，获取数据
  useMitt = useMittOn(MITT_TYPES.EMIT_BET_RECORD_SELECTED_CHANGE, function (val) {
    init_data(val)
  }).off;
})

/**
   * @description 初始请求注单记录数据
   * @param {Undefined} Undefined
   * @return {Undefined} undefined
   */
const init_data = (_index) => {
  last_record.value = ''
  const { params, url_api } = init_params_api(_index)
  //请求注单记录接口
  get_order_list(_index, params, url_api)

  // 未结算时，轮休获取提前结算列表金额
  if(_index === 0) {
    clearInterval(timer_2.value)
    timer_2.value = setInterval(() => {
      if (document.visibilityState == 'visible') {
        check_early_order()
      }
    }, 10000)
  }
}
// 根据索引获取当前接口的api和params
const init_params_api = (_index) => {
  let params = {}
  let url_api = null;
  switch (_index) {
    case 0:
      params = {
        searchAfter: last_record.value || undefined,
        orderStatus: '0',
      }
      url_api = api_betting.post_getH5OrderList      
      break;
    case 1:
      params = {
        searchAfter: last_record.value || undefined,
        orderStatus: '1',
        orderBy: sort_active.value,  // 按什么排序  2-默认排序（结算时间） 1-投注时间  3-开赛时间
        timeType: timeType.value
      }
      url_api = api_betting.post_getH5OrderList
      break;
  }
  return {
    params,
    url_api
  }
}

// 已结算页面，排序改变  2-默认排序（结算时间） 1-投注时间
const sortChange = (index, reset) => {
  if(index === sort_active.value) return
  sort_active.value = index
  !reset && init_data(1)
}

/**
 * @description 查询提前结算金额
 */
const search_early_money = () => {
  let params = { orderNo: orderNumberItemList.value.join(',') }
  if (orderNumberItemList.value.length === 0) return
  api_betting.get_cashout_max_amount_list(params).then(reslut => {
    let res = reslut.status ? reslut.data : reslut
    if (res.code == 200 && res.data) {
      // 通知提前结算组件 => 数据金额变化
      useMittEmit(MITT_TYPES.EMIT_EARLY_MONEY_LIST_CHANGE, res.data)
    }
  })
}
/**
 * @description 检查订单中是否存在符合条件的提前结算订单号
 */
const check_early_order = () => {
  if (!UserCtr.user_info.settleSwitch) {
    orderNumberItemList.value = []
    return;
  }
  let tempList = []
  lodash.forEach(BetRecordClass.list_data, (value, key) => {
    lodash.forEach(value.data, (item) => {
      if (item.enablePreSettle) {
        tempList.push(item.orderNo)
      }
    })
  })
  orderNumberItemList.value = tempList
  //  查询提前结算金额
  search_early_money()
}

/**
   * @description 请求注单记录接口
   * @param {Undefined} Undefined
   * @return {Undefined} undefined
  */
const get_order_list = (_index, params, url_api) => {
  //第一次加载时的注单数
  let size = 0
  is_loading.value = true
  // 请求接口
  url_api(params).then(reslut => {
    let res = reslut.status ? reslut.data : reslut
    is_limit.value = false
    if (res.code == 200) {
      let { record, hasNext } = lodash.get(res, "data");
      is_hasnext.value = hasNext
      is_loading.value = false;
      // record 为null时 => 赋值为空对象
      if(!record) record = {}
      for (let item of Object.values(record)) {
        size += item.data.length
      }
      last_record.value = lodash.findLastKey(record);
      console.log(record);
      // 给列表赋值
      BetRecordClass.set_list_data(record)
      // 如果是未结算页面, 获取提前结算列表金额
      _index === 0 && check_early_order()
    } else if (res.code == '0401038') {
      is_limit.value = true
      is_loading.value = false
      return
    } else {
      is_loading.value = false;
      return;
    }
    //容错处理，接口再调一次
    if (size < 5 && size > 0 && lodash.get(res, 'data.hasNext') == true) {
      init_data(_index)
    }
  }).catch(err => {
    is_loading.value = false;
    console.error(err)
    return;
  });
}
/**
   * @description 页面上推分页加载
   * @param {Undefined} Undefined
   * @return {Undefined} undefined
   */
const onPull = () => {
  const api_info = init_params_api(BetRecordClass.selected)
  let ele = myScroll.value
  if (!is_hasnext.value || last_record.value === undefined) {
    //没有更多
    ele.setState(7);
    return;
  }
  //加载中
  ele.setState(4);
  api_info.url_api(api_info.params).then(res => {
    //加载完成
    ele.setState(5);
    let { record, hasNext } = lodash.get(res, "data", {});
    is_hasnext.value = hasNext
    if (res.code == 200 && res.data && lodash.isPlainObject(record) && lodash.keys(record).length > 0) {
      last_record.value = lodash.findLastKey(record);
      // 合并数据
      let obj = lodash.cloneDeep(BetRecordClass.list_data)
      BetRecordClass.set_list_data(Object.assign(obj, record))
    } else {
      //没有更多
      ele.setState(7);
    }
  }).catch(err => { console.error(err) });
}

onUnmounted(() => {
  clearTimeout(timer_1.value)
  clearInterval(timer_2.value)
  useMitt && useMitt()
})

defineExpose({
  timeType,
  init_data,
  sortChange
  })
</script>
    
<style lang="scss" scoped>
template {
  display: block;
}
.cathectic-item {
  width: 100%;
  background: var(--q-gb-bg-c-15);
  overflow: hidden;
  margin-top: 0.1rem;
  padding-bottom: 0.2rem;
}
.settled-select {
  height: 0.7rem;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.14rem;
  background: var(--q-gb-bg-c-15);
  .select {
    height: 0.46rem;
    padding: 0.04rem;
    border-radius: 0.46rem;
    background-color: var(--q-gb-bg-c-18);
    align-items: center;
    span {
      height: 0.38rem;
      line-height: 0.38rem;
      font-size: 0.14rem;
      font-weight: bold;
      border-radius: 0.5rem;
      padding: 0 0.14rem;
      &.active {
        background-color: var(--q-gb-bg-c-15);
        border: 1px solid var(--q-gb-bg-c-12);
      }
    }
  }
}
.date-header {
  margin-top: 0.1rem;
  height: 0.4rem;
  align-items: center;
  padding: 0 0.14rem;
  justify-content: space-between;
  .date {
    font-size: 0.18rem;
    font-weight: bold;
  }
  .settled-date {
    font-size: 0.14rem;
    color: var(--q-gb-bg-c-6);
    span {
      font-weight: bold;
      margin-right: 0.06rem;
      &.oringe {
        color: var(--q-gb-bg-c-12);
        margin-right: 0;
      }
    }
  }
}
.cashout {
    font-size: 0.15rem;
    background-color: var(--q-gb-bg-c-15);
    height: 0.36rem;
    line-height: 0.36rem;
    width: 1rem;
    text-align: center;
    border-radius: 0.5rem;
    border: 1px solid var(--q-gb-bg-c-8);
    &.active {
      color: var(--q-gb-bg-c-15);
      background-color: var(--q-gb-bg-c-12);
      border-color: var(--q-gb-bg-c-12);
    }
    &.unsellteCashout {
      position: absolute;
      top: 0.12rem;
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