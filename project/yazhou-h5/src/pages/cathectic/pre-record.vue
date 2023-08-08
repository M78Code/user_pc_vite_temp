<!--
 * @Desc: 预约投注记录
 * @Author: Iverson
-->
<template>
    <div class="mx-10 pre_record" ref="pre_record">
        <!-- 加载中 -->
        <SRecord v-if="is_loading"/>
        <scroll ref="myScroll" :on-pull="onPull" v-else>
        <div class="filter-button" v-if="get_user.settleSwitch == 1">
            <!-- 已失效按钮 -->
            <i class="yb_fontsize12" @click.stop="show_cancle_order" :class="{'select':selected_expired}">
            {{$root.$t('pre_record.expired')}}<i class="early yb_ml4" :class="{'early2': selected_expired}"></i>
            </i>
        </div>
        <template v-if="!lodash.isEmpty(list_data)">
            <!-- 订单内容 -->
            <div v-for="(value,name,index) in list_data" :key="index">
                <template v-if="expired_all_flag(value)">
                <p class="tittle-p row justify-between yb_px4" :class="index == 0 && 'tittle-p2'" @click="toggle_show(value)">
                    <span>{{(new Date(name)).Format($root.$t('time2'))}}</span>
                    <span v-if="!value.open && index != 0 && !selected_expired"><img class="icon-down-arrow" src="image/wwwassets/bw3/list/league-collapse-icon.svg" /></span>
                </p>
                <div class="line" :class="!value.open && (index != Object.keys(list_data).length-1) && 'line2'"></div>
                <q-slide-transition>
                    <div v-show="value.open">
                    <common-cathectic-item  :is_pre="true" :item_data="item2" v-for="(item2,key) in value.data" :key="key" class="my-4" :key2="key" :len="value.data.length" :is_show_pre="expired_flag(item2)"></common-cathectic-item>
                    </div>
                </q-slide-transition>
                </template>
            </div>
        </template>
        <!-- 无数据展示 -->
        <settle-void  v-else></settle-void>
        </scroll>
        <cancle-confirm-pop @cancleHanddle="cancle_pre_pop" @confirmHandle="cancle_pre_order" :show="cancle_confirm_pop_visible" :teamname="teamName"></cancle-confirm-pop>
    </div>
</template>

<script setup>
import { defineComponent, ref, getCurrentInstance, watch,  } from 'vue'
import { api_betting } from "src/project/api/index.js";
import commonCathecticItem from "src/project/components/common/common_cathectic_item.vue";
import cancleConfirmPop from 'src/project/pages/cathectic/cancle_confirm_pop.vue';  // 合并投注项提示弹框
import noData from "src/project/components/common/no_data.vue";   // 无数据展示组件
import settleVoid from "src/project/pages/cathectic/settle_void.vue";
import scroll from "src/project/components/record_scroll/scroll.vue";
import SRecord from "src/project/components/skeleton/record.vue"
import lodash from "lodash"
// TODO vuex 待数据调通后删除
// import { mapGetters, mapMutations } from 'vuex';

    // components: {
    //     commonCathecticItem,
    //     settleVoid,
    //     scroll,
    //     SRecord,
    //     noData,
    //     cancleConfirmPop
    // },
// 页面锚点
const myScroll = ref(null)
// 定时器
let timer_2 = ref(null)
let timer_1 = ref (null)
// 确认取消弹框
let cancle_confirm_pop_visible = ref(false)
//要取消的队名
let teamName =  ref('')
//要取消的订单号
let orderNumber = ref('')
//是否在加载中
let is_loading = ref(true)
//列表数据
let list_data = ref({})
//list_data里面最后的一条数据的日期 '2020-11-17'
let last_record = ref('')
// 是否存在下一页
let is_hasnext = ref(false)
//需要查绚提前结算金额的订单集合
let orderNumberItemList = ref([])
//已失效按钮选装状态，默认不选中
let selected_expired = ref(false)
// 强制更新DOM
const instance = getCurrentInstance()

//获取预约订单状态
const change_pre_status = (orderList) => {
    const params = {
        orderNoList : orderList
    }
    api_betting.get_pre_status(params).then(res=>{
        if(res.code == 200){
        const {data} = res
        const listObj = lodash.cloneDeep(list_data)
        for(let key in listObj){
            let listItem = listObj[key]
            for(let i = 0;i<listItem.data.length;i++){
            let tempData = lodash.find(data,(o)=>{return listItem.data[i].orderNo == o.orderNo})
            if(tempData){
                listItem.data[i].preOrderStatus = tempData.preOrderStatus
            }
            }
        }
        list_data.value = listObj
        }
    }).catch(()=>{
        //不处理
    })
}
//点击取消打开弹层，将数据传输到组件
const show_cancle_pop = (params) => {
    cancle_confirm_pop_visible.value = true
    teamName.value = params.name
    orderNumber.value = params.orderNo
}
//判断是否当前日期所有已失效订单状态
const expired_all_flag = (param) => {
    if(!selected_expired){
        return true
    }else{
        return lodash.find(param.data,(data)=>{
        return [2,3,4].includes(data.preOrderStatus)
        }) ? true : false
    }
}
//判断当前订单是否是已失效
const expired_flag = (data) => {
    if(!selected_expired.value){
        return false
    }else{
        return ![2,3,4].includes(data.preOrderStatus)
    }
}
//显示已失效订单
const show_cancle_order = () => {
    selected_expired.value = !selected_expired.value
}
/**
 *@descript 取消预约投注项
*@param {String} orderNumer 订单号
*/
const cancle_pre_order = () => {
    api_betting.cancle_pre_order({orderNo:orderNumber.value}).then((res)=>{
    if(res.code == 200){
        // TODO 从vuex取待改造
        // set_toast({ 'txt': $root.$t('pre_record.canceled'), hide_time: 3000 });
        cancle_confirm_pop_visible.value = false
        timer_2.value = setTimeout(()=>{ change_pre_status([{
        orderNo: orderNumber.value
        }])},1000)
        init_data(true)
    }else if(['0400546','0400547'].includes(res.code)){
        cancle_confirm_pop_visible.value = false
        // TODO 从vuex取待改造
        // set_toast({ 'txt':res.code == '0400546'? $root.$t('pre_record.cancle_fail_tips'):$root.$t('pre_record.cancle_fail_tips2'), hide_time: 3000 });
    }
    }).catch(()=>{
    cancle_confirm_pop_visible.value = false
    })
}
/**
 *@descript 取消预约投注项
*@param {String} orderNumer 订单号
*/
const cancle_pre_pop = () => {
    cancle_confirm_pop_visible.value = false
    teamName.value = ''
    orderNumber.value = ''
}
/**
 *@description 重新请求主单记录数据
*@return {Undefined} undefined
*/
const refreshOrderList = () => {
    init_data(true)
}
/**
 *@description 初始请求注单记录数据
*@return {Undefined} undefined
*/
const init_data = (flag) => {
    var params = {
        preOrderStatusList: [0,2,3,4]
    }
    is_loading.value = !flag
    //第一次加载时的注单数
    let size = 0  
    api_betting.get_preOrderList_news(params).then(res=>{
        if(res.code == 200 && res.data){
        is_loading.value = false
        let { record, hasNext } = lodash.get(res, "data");
            is_hasnext.value = hasNext
            if (lodash.isEmpty(record)) {
            return;
            }
        // 合并数据
        let obj = lodash.cloneDeep(list_data)
        list_data.value = lodash.merge(obj, record)
        for (let item of Object.values(list_data)) {
            item.open = true
            for(var i = 0;i<item.data.length;i++){
            item.data[i].orderVOS = item.data[i].detailList
            }
            size += item.data.length
        }
        last_record.value = lodash.findLastKey(record);
        }else {
        is_loading.value = false;
        return;
        }
    }).catch((err)=>{
        is_loading.value = false;
    })
}
/**
 *@description 页面上推分页加载
*@return {Undefined} undefined
*/
const onPull = () => {
    let ele = myScroll.value
    if (!is_hasnext.value || last_record.value === undefined) {
        //没有更多
        ele.setState(7);  
        return;
    }
    var params = {
        preOrderStatusList: [0,2,3,4],
        searchAfter: last_record.value || undefined,
    };
    //加载中
    ele.setState(4);  
    api_betting.get_preOrderList(params).then(res => {
        // 为 null 时容错处理
        if (!res.data) {  
        is_hasnext.value = false
        //没有更多
        ele.setState(7);  
        return
        }
        //加载完成
        ele.setState(5);  
        let { record, hasNext } = lodash.get(res, "data", {});
        is_hasnext.value = hasNext
        if(res.code == 200 && res.data){
        last_record.value = lodash.findLastKey(record);
        // 合并数据
        let obj = lodash.cloneDeep(list_data);
        list_data.value = lodash.merge(obj, record)
        for (let item of Object.values(list_data)) {
            item.open = true
            for(var i = 0;i<item.data.length;i++){
            item.data[i].orderVOS = item.data[i].detailList
            }
        }

        }else {
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
    instance.proxy.$forceUpdate()
}
/**
     *@description 初次切换到预约时加载数据
    *@return {Undefined} undefined
    */
watch(() => get_main_item, (newVal) => {
        if (newVal == 2) {
            lodash.isEmpty(list_data.value) && init_data()
        }
    })
watch(() => list_data,  () => {
    //监听预约记录数据，是否有预约中的订单，并轮询获取
    handler = function(newVal){
        if(lodash.isEmpty(newVal))return
        let orderNumber = []
        lodash.forIn(newVal,(item,key)=>{
        const tempOrderList = lodash.filter(item.data,(o)=>{
            return o.preOrderStatus === 0
        })
        orderNumber = lodash.concat(orderNumber,tempOrderList);
        })
        if(orderNumber.length>0){
        const orderList = []
        orderNumber.map((item)=>{
            orderList.push(item.orderNo)
        })
        clearTimeout(timer_1)
        timer_1.value = setTimeout(()=>{
            if(get_main_item.value == 2 && document.visibilityState == 'visible'){
            change_pre_status(orderList)
            }
            },5000)
        }else{
        clearTimeout(timer_1)
        }
    }})
onUnmounted(() => {
    clearTimeout(timer_1)
    timer_1.value = null

    clearTimeout(timer_2)
    timer_2.value = null

    // $root.$off(emit_cmd.EMIT_GET_ORDER_LIST, refreshOrderList)
    // $root.$off(emit_cmd.EMIT_SHOW_CANCLE_POP, show_cancle_pop)
    // for (const key in $data) {
    // $data[key] = null
    // }
})

    // computed: {
    //     // ...mapGetters(['get_user', 'get_main_item'])
    // },
   
</script>

<style lang="scss" scoped>
    .pre_record {
    height: 100%;
    .filter-button{
        display: flex;
        justify-content: flex-end;
        position: absolute;
        right: 0;
        top: 0.15rem;
    }
    .pretype-tabs{
        height: 0.28rem;
        border-radius: 0.14rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.1rem auto 0 auto;
        &>div{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.2rem;
        opacity: 0.6;
        font-size: 0.14rem;
        &.selected{
            border-radius: 0.12rem;
            font-size: 0.14rem;
            font-weight: 600;
        }
        }
    }
    .tittle-p {
        width: 3.55rem;
        margin: 0 auto;
        padding: 0 0 0 0.04rem;
        line-height: 0.18rem;
        margin-top: 0.16rem;
        margin-bottom: 0.1rem;
        span {
        font-size: 0.18rem;
        letter-spacing: 0;
        font-weight: bold;
        }
    }

    .tittle-p2 {
        width: 3.55rem;
        padding: 0 0 0 0.04rem;
    }

    .icon-down-arrow {
        transform: scaleY(-1);
    }

    .line {
        height: 0.5px;
    }
    }

    .early {
    display: inline-block;
    background: var(--q-color-com-img-bg-69) no-repeat center / contain;
    vertical-align: text-bottom;
    width: 0.14rem;
    height: 0.14rem;
    }

    .early2 {
    background-image: var(--q-color-com-img-bg-68);
    }
</style>
