<!--
 * @Desc: 投注记录弹框未结算页
 * @Author: Router
-->
<template>
  <div class="mx-10 unsettle" ref="unsettle">
    <!-- 加载中 -->
    <SRecord v-if="is_loading"/>
    <scroll ref="myScroll" :on-pull="onPull" v-else>
      <template v-if="no_data">
        <div class="filter-button" v-if="UserCtr.user_info.settleSwitch == 1">
          <!-- 提前结算筛选按钮 TODO: 主题色背景图 -->
          <i class="yb_fontsize12" @click.stop="change_early" :class="{'select':is_early}">
            {{ i18n_t('early.btn2') }}<i class="early yb_ml4" :class="{'early2': is_early}"></i>
          </i>
        </div>
        <!-- 订单内容 -->
        <template v-if="!is_all_early_flag">
          <div v-for="(value,name,index) in list_data" :key="index">
            <template v-if="!is_early|| (is_early && clac_is_early(value.data))">
              <p class="tittle-p row justify-between yb_px4" :class="index == 0 && 'tittle-p2'" @click="toggle_show(value)">
                <!-- (new Date(name)).Format(i18n_t('time2')) -->
                <span>{{ format_M_D(new Date(name).getTime())}}</span>
                <span v-if="!value.open && index != 0"><img class="icon-down-arrow" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/league-collapse-icon.svg`" /></span>
              </p>
              <!--线-->
              <div class="line" :class="!value.open && (index != Object.keys(list_data).length-1) && 'line2'"></div>
              <q-slide-transition>
                <div v-show="value.open">
                  <!--投注记录的页每一条注单-->
                  <common-cathectic-item :main_item="main_item" :item_data="item2" v-for="(item2,key) in value.data" :key="key" class="my-4" :key2="key" :len="value.data.length" :is_early="is_early"></common-cathectic-item>
                </div>
              </q-slide-transition>
            </template>
          </div>
        </template>
      </template>
      <!-- 去投注 -->
      <settle-void :is_early="is_all_early_flag" v-if="(!no_data || is_all_early_flag)" :is_limit="is_limit"></settle-void>
    </scroll>
  </div>
</template>

<script setup>
import lodash from 'lodash';
import { api_betting } from "src/api/index.js";
import commonCathecticItem from "src/base-h5/components/common/common-cathectic-item.vue";
import settleVoid from "./settle-void.vue";
import scroll from "src/base-h5/components/common/record-scroll/scroll.vue";
// import skt_order from "src/base-h5/mixins/websocket/data/skt-data-order.js"
import SRecord from "src/base-h5/components/skeleton/record.vue";
// import { mapGetters, mapMutations } from 'vuex';
import { ref, watch, onMounted, onUnmounted } from 'vue'
import {useMitt, MITT_TYPES} from  "src/core/mitt/index.js"
import { format_M_D } from 'src/output/index.js'
import { i18n_t } from "src/boot/i18n.js";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
//国际化
//import store from 'src/store-redux/index.js'
    // mixins: [skt_order]

  // const store_data = store.getState()
  // 锚点
  const myScroll = ref(null)
  //是否在加载中
  const is_loading = ref(false)
  //列表数据
  const list_data = ref({})
  //list_data里面最后的一条数据的日期 '2020-11-17'
  const last_record = ref('')
  //是否没有数据
  const no_data = ref(true)
  // 提前结算图标是否选中
  const is_early = ref(false)
  // 是否存在下一页
  const is_hasnext = ref(false)
  //判断提前结算按钮是否选中，并且选中状态下所有订单是否存在已提前结算
  const is_all_early_flag = ref(false)
  // 接口是否返回错误码为0401038限频
  const is_limit = ref(false)
  //需要查绚提前结算金额的订单集合
  const orderNumberItemList = ref([])
  //错误码为0401038拉取接口次数
  const count = ref(0)
  //服务器返回错误为0401038拉取接口次数
  const count2 = ref(0)
  // 延时器
  const timer_1 = ref(null)
  const timer_2 = ref(null)
  // computed: {
  //   ...mapGetters(['UserCtr', 'get_main_item'])
  // },
const props = defineProps({
  main_item: {
    type: [String, Number],
  }
})
  /**
     * @description 判断所有订单是否有结算注单
     * @param {undefined} undefined
     * @returns {null} null
     */
  watch(() => is_early.value, (_new) => {
    /**判断所有订单是否有结算注单*/
      is_all_early_flag.value = _new ? clac_all_is_early() : false
  })

  onMounted(() => {
    // 首次进入获取数据
    init_data()
    /**先清除计时器，再使用*/
    clearInterval(timer_2.value)
    timer_2.value = setInterval(()=>{
      if (store_data.main_item == 0 && document.visibilityState == 'visible') {
        check_early_order()
        search_early_money()
      }
    },10000)
    useMitt(MITT_TYPES.EMIT_GET_ORDER_LIST, refreshOrderList);
  })
  /**
     * @description 筛选所有提前结算注单
     * @param {undefined} undefined
     * @returns {null} null
     */
  const change_early = () => {
    is_early.value = !is_early.value
  }
  /**
     * @description 判断单个订单是否有结算注单
     * @param {value} 金额
     * @returns {boolean} 是否显示提前结算
     */
  const clac_is_early = (value = []) => {
    return lodash.some(value,{is_show_early_settle:true})
  }
  /**
     * @description 判断所有订单是否有结算注单
     * @param {undefined} undefined
     * @returns {boolean} 是否有结算注单
     */
  const clac_all_is_early = () => {
    const data = lodash.values(list_data.value)
    return lodash.find(data,(item)=>{
      return lodash.some(item.data,{is_show_early_settle:true})
    }) ? false : true
  }
  /**
   * @description 查询提前结算金额
   */
  const search_early_money = () => {
    let params = {orderNo:orderNumberItemList.value.join(',')}
    if(orderNumberItemList.length === 0){return}
    api_betting.get_cashout_max_amount_list(params).then(reslut=>{
      let res = {}
      if (reslut.status) {
        res = reslut.data
      } else {
        res = reslut
      }
      if(res.code == 200 && res.data){
        // store.dispatch({
        //   type: "SET_EARLY_MOEY_DATA",
        //   data: res,data
        // })
      }
    })
  }
  /**
   * @description 检查订单中是否存在符合条件的提前结算订单号
   */
  const check_early_order = () => {
    if(!UserCtr.user_info.settleSwitch){
      orderNumberItemList.value = []
      return;
    }
    let tempList = []
    lodash.forEach(list_data.value, (value, key)=> {
      lodash.forEach(value.data,(item)=>{
          if(item.seriesType === '1') { //单关、足篮才有提前结算
            tempList.push(item.orderNo)
          }
      })
    })
    orderNumberItemList.value = tempList
  }
  /**
     * @description 重新请求主单记录数据
     * @param {Undefined} Undefined
     * @return {Undefined} undefined
     */
  const refreshOrderList = () => {
    last_record.value = ''
    init_data(true)
  }
  /**
     * @description 初始请求注单记录数据
     * @param {Undefined} Undefined
     * @return {Undefined} undefined
     */
  const init_data = (flag) => {
    var params = {
      searchAfter: last_record.value || undefined,
      orderStatus: '0',
    }
    is_loading.value = !flag
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
    // 请求接口
    api_betting.post_getH5OrderList(params).then(reslut => {
      let res = ''
      if (reslut.status) {
        res = reslut.data
      } else {
        res = reslut
      }
      is_limit.value = false
      if (res.code == 200) {
        let { record, hasNext } = lodash.get(res, "data");
        is_hasnext.value = hasNext
        // record为空时
        if (lodash.isEmpty(record)) {
          is_loading.value = false;
          no_data.value = false;
          return;
        }
        no_data.value = true;
        for (let item of Object.values(record)) {
          item.open = true
          size += item.data.length
        }
        last_record.value = lodash.findLastKey(record);
        // 弹框起来需要300毫秒，这期间用骨架图展示
        clearTimeout(timer_1.value)
        // let obj = lodash.cloneDeep(list_data.value)
          // list_data.value = lodash.merge(obj, record)
        // console.error(lodash.merge(obj, record));
        timer_1.value = setTimeout(() => {
          if (size < 5 && size > 0 && res.data.hasNext == true) {
          } else {
            is_loading.value = false;
          }
          // 合并数据
          let obj = lodash.cloneDeep(list_data.value)
          console.error(obj, record);
          list_data.value = Object.assign(obj, record)
        }, 380);
      }else if(res.code == '0401038'){
        is_limit.value = true
        no_data.value = false
        is_loading.value = false
        return
      } else if (res.code == '0401013') {
        is_loading.value = false;
        no_data.value = false
        return;
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
      no_data.value = false;
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
      if (res.code == 200 && res.data && lodash.isPlainObject(record) && lodash.keys(record).length>0) {
        for (let item of Object.values(record)) {
          item.open = true
        }
        last_record.value = lodash.findLastKey(record);

        // 合并数据
        let obj = lodash.cloneDeep(list_data.value);
        list_data.value = lodash.merge(obj, record)
      } else {
        //没有更多
        ele.setState(7);
      }
    }).catch(err => { console.error(err) });
  }
  /**
   *@description 展开与收起切换
    *@param {Boolean} val 展开-true  收起-false
    *@return {Undefined} undefined
    */
  const toggle_show = (val) => {
    val.open = !val.open
    $forceUpdate()
  }
  /**
     * @description 清除当前组件所有定时器
     * @param {Undefined} Undefined
     * @return {Undefined} undefined
     */
  const clear_timer = () => {

    clearTimeout(timer_1.value)
    clearTimeout(timer_2.value)
    clearInterval(timer_1.value)
    clearInterval(timer_2.value)
  }
  onUnmounted(() => {
    clear_timer();
    // store.dispatch({
    //   type: "SET_EARLY_MOEY_DATA",
    //   data: []
    // })
    // for (const key in $data) {
    //   $data[key] = null
    // }
  })
  defineExpose({
    check_early_order,
    search_early_money
  })
</script>

<style lang="scss" scoped>
/**投注记录弹框未结算*/
.unsettle {
  height: 100%;
  /**提前结算筛选按钮*/
  .filter-button{
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
}
</style>