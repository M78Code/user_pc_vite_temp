<!--
 * @Desc: 投注记录弹框未结算页
 * @Author: Router
-->
<template>
  <div style="display: none;">{{ BetRecordClass.bet_record_version }}</div>
  <div class="unsettle" ref="unsettle">
    <!-- 加载中 -->
    <SRecord v-if="is_loading" />
    <scroll ref="myScroll" :on-pull="onPull" v-else>
      <template v-if="!lodash.isEmpty(BetRecordClass.list_data)">
        <!-- 订单内容 -->
        <div v-for="(value, name, index) in BetRecordClass.list_data" :key="index" class="unsettle-list">
          <template>
            <q-slide-transition>
              <div>
                <div v-for="(item2, key) in value.data" :key="key" :item_data="item2" class="cathectic-item">
                  <!-- 单关、串关内容显示 -->
                  <template>
                    <item-simple-body v-if="item2.seriesType == '1'" :data_b="item2"></item-simple-body>
                    <item-multiple-body v-else :data_b="item2"></item-multiple-body>
                  </template>
                  <!-- 未结算列表 => 投注记录页提前结算的按钮、滑块 -->
                  <early-settle :item_data="item2"></early-settle>
                </div>
              </div>
            </q-slide-transition>
          </template>
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
import { itemSimpleBody, itemMultipleBody, earlySettle } from "src/base-h5/components/common/cathectic-item/app-h5/index";
import settleVoid from "src/base-h5/components/cathectic/app-h5/settle-void.vue";
import scroll from "src/base-h5/components/common/record-scroll/scroll.vue";
import SRecord from "src/base-h5/components/skeleton/record.vue";
import { ref, watch, onMounted, onUnmounted } from 'vue'
import UserCtr from "src/core/user-config/user-ctr.js";
//国际化
import store from 'src/store-redux/index.js'

// ws 数据接入  投注记录订单消息推送
// mixins: [skt_order]

const store_data = store.getState()
// 锚点
const myScroll = ref(null)
//是否在加载中
const is_loading = ref(false)
//列表数据
const list_data = ref({})
//list_data里面最后的一条数据的日期 '2020-11-17'
const last_record = ref('')
// 是否存在下一页
const is_hasnext = ref(false)
// 接口是否返回错误码为0401038限频
const is_limit = ref(false)
//需要查绚提前结算金额的订单集合
const orderNumberItemList = ref([])

// 延时器
const timer_1 = ref(null)
const timer_2 = ref(null)

const props = defineProps({
  main_item: {
    type: [String, Number],
  }
})

onMounted(() => {
  // 首次进入获取数据
  init_data()
  /**先清除计时器，再使用*/
  clearInterval(timer_2.value)
  timer_2.value = setInterval(() => {
    if (document.visibilityState == 'visible') {
      check_early_order()
      search_early_money()
    }
  }, 10000)
})

/**
   * @description 判断所有订单是否有结算注单
   * @param {undefined} undefined
   * @returns {boolean} 是否有结算注单
   */
const clac_all_is_early = () => {
  const data = lodash.values(list_data.value)
  return lodash.find(data, (item) => {
    return lodash.some(item.data, { is_show_early_settle: true })
  }) ? false : true
}
/**
 * @description 查询提前结算金额
 */
const search_early_money = () => {
  let params = { orderNo: orderNumberItemList.value.join(',') }
  // if(orderNumberItemList.length === 0){return}
  api_betting.get_cashout_max_amount_list(params).then(reslut => {
    let res = {}
    if (reslut.status) {
      res = reslut.data
    } else {
      res = reslut
    }
    if (res.code == 200 && res.data) {
      store.dispatch({
        type: "SET_EARLY_MOEY_DATA",
        data: res, data
      })
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
  lodash.forEach(list_data.value, (value, key) => {
    lodash.forEach(value.data, (item) => {
      if (item.enablePreSettle) {
        tempList.push(item.orderNo)
      }
    })
  })
  orderNumberItemList.value = tempList
}
/**
   * @description 初始请求注单记录数据
   * @param {Undefined} Undefined
   * @return {Undefined} undefined
   */
const init_data = () => {
  var params = {
    searchAfter: last_record.value || undefined,
    orderStatus: '0',
  }
  //请求注单记录接口
  get_order_list(params)

}
/**
   * @description 请求注单记录接口
   * @param {Undefined} Undefined
   * @return {Undefined} undefined
  */
const get_order_list = (params) => {
  //第一次加载时的注单数
  let size = 0
  is_loading.value = true
  // 请求接口
  api_betting.post_getH5OrderList(params).then(reslut => {
    let res = reslut.status ? reslut.data : reslut
    is_limit.value = false
    if (res.code == 200) {
      let { record, hasNext } = lodash.get(res, "data");
      is_hasnext.value = hasNext
      // record为空时
      if (lodash.isEmpty(record)) {
        is_loading.value = false;
        return;
      }
      for (let item of Object.values(record)) {
        item.open = true
        size += item.data.length
      }
      last_record.value = lodash.findLastKey(record);
      // 弹框起来需要300毫秒，这期间用骨架图展示
      clearTimeout(timer_1.value)
      timer_1.value = setTimeout(() => {
        if (size < 5 && size > 0 && res.data.hasNext == true) {
        } else {
          is_loading.value = false;
        }
        // 合并数据
        let obj = lodash.cloneDeep(BetRecordClass.list_data)
        BetRecordClass.set_list_data(Object.assign(obj, record))
      }, 380);
    } else if (res.code == '0401038') {
      is_limit.value = true
      is_loading.value = false
      return
    } else {
      is_loading.value = false;
      return;
    }
    //容错处理，接口再调一次
    if (size < 5 && size > 0 && res.data.hasNext == true) {
      init_data()
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
  var params = {
    searchAfter: last_record.value || undefined,
    orderStatus: '0',
  };
  let ele = myScroll.value
  if (!is_hasnext.value || last_record.value === undefined) {
    //没有更多
    ele.setState(7);
    return;
  }
  //加载中
  ele.setState(4);
  api_betting.post_getOrderList(params).then(res => {
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
.unsettle {
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