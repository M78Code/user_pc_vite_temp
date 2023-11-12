<!--
 * @Desc: 投注记录弹框未结算页
 * @Author: Router
-->
<template>
  <div class="cathectic">
    <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
    <!-- 加载中 -->
    <SRecord v-if="is_loading" />
    <scroll ref="myScroll" :on-pull="onPull" v-else>
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
import { itemSimpleBody, itemMultipleBody, earlySettle, earlySettledDetail, cancelReserve } from "src/base-h5/components/common/cathectic-item/app-h5/index";
import settleVoid from "src/base-h5/components/cathectic/app-h5/settle-void.vue";
import scroll from "src/base-h5/components/common/record-scroll/scroll.vue";
import SRecord from "src/base-h5/components/skeleton/record.vue";
import { ref, watch, onMounted, onUnmounted } from 'vue'
import UserCtr from "src/core/user-config/user-ctr.js";
import {useMittEmit, useMittOn, MITT_TYPES} from  "src/core/mitt/index.js"
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

  // 未结算时，轮询获取提前结算列表金额
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
    case 0: //未结算
      params = {
        searchAfter: last_record.value || undefined,
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
        searchAfter: last_record.value || undefined,
        orderStatus: '1',
        orderBy: 2,  // 按什么排序  2-默认排序（结算时间） 1-投注时间  3-开赛时间
        timeType: 3
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
 * @description 查询提前结算金额
 */
const search_early_money = () => {
  let params = { orderNo: orderNumberItemList.value.join(',') }
  if (orderNumberItemList.value.length === 0) { return }
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
        // 如果是预约中、已失效，数据多余处理下
        if(_index === 1 || _index === 2) {
          for (var i = 0; i < item.data.length; i++) {
            item.data[i].orderVOS = item.data[i].detailList
          }
        }
      }
      last_record.value = lodash.findLastKey(record);
      // 赋值
      BetRecordClass.set_list_data(record)
      // 如果是未结算页面, 先获取提前结算列表金额
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
      // 如果是预约中、已失效，数据多余处理下
      for (let item of Object.values(record)) {
        for (var i = 0; i < item.data.length; i++) {
          item.data[i].orderVOS = item.data[i].detailList
        }
      }
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
</script>
    
<style lang="scss" scoped>
template {
  display: block;
}

.cathectic-item {
  width: 100%;
  border-radius: 0.1rem;
  background: var(--q-gb-bg-c-15);
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