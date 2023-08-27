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
        <div class="filter-button" v-if="lodash.get(get_user, 'settleSwitch') == 1">
          <!-- 提前结算筛选按钮 -->
          <i class="yb_fontsize12" @click.stop="change_early" :class="{'select':is_early}">
            {{ $root.$t('early.btn2') }}<i class="early yb_ml4" :class="{'early2': is_early}"></i>
          </i>
        </div>
        <!-- 订单内容 -->
        {{is_all_early_flag + '-----' + is_early}}
        <template v-if="!is_all_early_flag">
          <div v-for="(value,name,index) in list_data" :key="index">
            <template v-if="!is_early|| (is_early && clac_is_early(value.data))">
              <p class="tittle-p row justify-between yb_px4" :class="index == 0 && 'tittle-p2'" @click="toggle_show(value)">
                <span>{{(new Date(name)).Format($root.$t('time2'))}}</span>
                <span v-if="!value.open && index != 0"><img class="icon-down-arrow" src="image/wwwassets/bw3/list/league-collapse-icon.svg" /></span>
              </p>
              <!--线-->
              <div class="line" :class="!value.open && (index != Object.keys(list_data).length-1) && 'line2'"></div>
              <q-slide-transition>
                <div v-show="value.open">
                  <!--投注记录的页每一条注单-->
                  <common-cathectic-item :item_data="item2" v-for="(item2,key) in value.data" :key="key" class="my-4" :key2="key" :len="value.data.length" :is_early="is_early"></common-cathectic-item>
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
import commonCathecticItem from "project_path/src/components/common/common-cathectic-item.vue"; 
import settleVoid from "./settle-void.vue";
import scroll from "project_path/src/components/common/record-scroll/scroll.vue"; 
// import skt_order from "src/public/mixins/websocket/data/skt-data-order.js"
import SRecord from "project_path/src/components/skeleton/record.vue";
// import { mapGetters, mapMutations } from 'vuex';
import { ref, watch, onMounted, onUnmounted } from 'vue'
import {useMittOn, MITT_TYPES} from  "src/core/mitt/"
import store from 'src/store'

    // mixins: [skt_order]
    
    let store_data = ref(store.getState())
    // 锚点
    let myScroll = ref(null)
  //是否在加载中
  let is_loading = ref(false)
  //列表数据
  let list_data = ref([])
  //list_data里面最后的一条数据的日期 '2020-11-17'
  let last_record = ref('')
  //是否没有数据
  let no_data = ref(true)
  // 提前结算图标是否选中
  let is_early = ref(false)
  // 是否存在下一页
  let is_hasnext = ref(false)
  //判断提前结算按钮是否选中，并且选中状态下所有订单是否存在已提前结算
  let is_all_early_flag = ref(false)
  // 接口是否返回错误码为0401038限频
  let is_limit = ref(false)
  //需要查绚提前结算金额的订单集合
  let orderNumberItemList = ref([])
  //错误码为0401038拉取接口次数
  let count = ref(0)
  //服务器返回错误为0401038拉取接口次数
  let count2 = ref(0)
  // 延时器
  let timer_1 = ref(null)
  let timer_2 = ref(null)    
  // computed: {
  //   ...mapGetters(['get_user', 'get_main_item'])
  // },
  
  /**
     * @description 判断所有订单是否有结算注单
     * @param {undefined} undefined
     * @returns {null} null
     */
  watch(() => is_early.value, (_new) => {
    console.error(_new);
    /**判断所有订单是否有结算注单*/
      is_all_early_flag.value = _new ? clac_all_is_early() : false
  })

  onMounted(() => {
    // 首次进入获取数据
    init_data()
    /**先清除计时器，再使用*/
    clearInterval(timer_2)
    timer_2 = setInterval(()=>{
      if (store_data.main_item == 0 && document.visibilityState == 'visible') {
        check_early_order()
        search_early_money()
      }
    },10000)
    useMittOn(MITT_TYPES.EMIT_GET_ORDER_LIST, refreshOrderList);
  })
    // ...mapMutations(['set_early_moey_data']),
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
    const data = lodash.values(list_data)
    return lodash.find(data,(item)=>{
      return lodash.some(item.data,{is_show_early_settle:true})
    }) ? false : true
  }
  /**
   * @description 查询提前结算金额
   */
  const search_early_money = () => {
    let params = {orderNo:orderNumberItemList.join(',')}
    // if(orderNumberItemList.length === 0){return}
    api_betting.oderPreSettleMoney(params).then(res=>{
      if(res.code == 200 && res.data){
        set_early_moey_data( res.data)
      }
    })
  }
  /**
   * @description 检查订单中是否存在符合条件的提前结算订单号
   */
  const check_early_order = () => {
    if(!get_user.settleSwitch){
      orderNumberItemList = []
      return;
    }
    let tempList = []
    lodash.forEach(list_data, (value, key)=> {
      lodash.forEach(value.data,(item)=>{
        if(item.enablePreSettle){
          tempList.push(item.orderNo)
        }
      })
    })
    orderNumberItemList = tempList
  }
  /**
     * @description 重新请求主单记录数据
     * @param {Undefined} Undefined
     * @return {Undefined} undefined
     */
  const refreshOrderList = () => {
    last_record = ''
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
      orderStatus: 0,
    }
    is_loading = !flag
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
      
      is_limit = false
      if (res.code == 200) {
        let { record, hasNext } = lodash.get(res, "data");
        is_hasnext = hasNext
        // record为空时
        if (lodash.isEmpty(record)) {
          is_loading = false;
          no_data = false;
          return;
        }
        no_data = true;
        for (let item of Object.values(record)) {
          item.open = true
          size += item.data.length
        }
        last_record = lodash.findLastKey(record);
        // 弹框起来需要300毫秒，这期间用骨架图展示
        clearTimeout(timer_1)
        // console.error(record);
        timer_1 = setTimeout(() => {
          if (size < 5 && size > 0 && res.data.hasNext == true) {
          } else {
            is_loading = false;
          }
          // 合并数据
          let obj = lodash.cloneDeep(list_data)
          list_data = lodash.merge(obj, record)
          // console.error(list_data);
        }, 380);
        
      }else if(res.code == '0401038'){
        is_limit = true
        no_data = false
        is_loading = false
        return
      } else if (res.code == '0401013') {
        is_loading = false;
        no_data = false
        return;
      } else {
        is_loading = false;
        return;
      }
      //容错处理，接口再调一次
      if (size < 5 && size > 0 && res.data.hasNext == true) {
        init_data()
      }
    }).catch(err => {
      is_loading = false;
      no_data = false;
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
      searchAfter: last_record || undefined,
      orderStatus: 0,
    };
    let ele = myScroll
    if (!is_hasnext || last_record === undefined) {
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
      is_hasnext = hasNext
      if (res.code == 200 && res.data && lodash.isPlainObject(record) && lodash.keys(record).length>0) {
        for (let item of Object.values(record)) {
          item.open = true
        }
        last_record = lodash.findLastKey(record);

        // 合并数据
        let obj = lodash.cloneDeep(list_data);
        list_data = lodash.merge(obj, record)
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
    
    clearTimeout(timer_1)
    clearTimeout(timer_2)
    clearInterval(timer_1)
    clearInterval(timer_2)
  }
  onUnmounted(() => {
    clear_timer();
    useMittOn(MITT_TYPES.EMIT_GET_ORDER_LIST, refreshOrderList).off;
    set_early_moey_data([])
    // for (const key in $data) {
    //   $data[key] = null
    // }
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
  }
  /**订单标题*/
  .tittle-p {
    width: 3.55rem;
    height: 0.54rem;
    line-height: 0.66rem;
    margin: 0 auto;
    padding: 0 0 0 0.04rem;
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
  background: var(--q-color-com-img-bg-69) no-repeat center / contain;
  vertical-align: text-bottom;
  width: 0.14rem;
  height: 0.14rem;
}
/**提前结算*/
.early2 {
  background-image: var(--q-color-com-img-bg-68);
}
</style>