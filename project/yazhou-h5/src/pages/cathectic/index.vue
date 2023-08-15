<!--
 * @Author: 
 * @Date: 
 * @Description: bw3新版从底部弹出的投注记录弹框（已结算+未结算）
-->
<template>
    <div class="settle-dialog">
  
      <div class="row items-center yb_fontsize16 head-top" @touchmove.prevent>
        <div class="row col items-center justify-center">
          <p class="yb_mr10" @click="change_record(0)" :class="store_cathectic.main_item == 0 && 'active-p'">{{$root.$t('bet_record.no_account')}}<span></span></p>
          <p class="yb_ml10 yb_mr10" @click="change_record(1)" :class="store_cathectic.main_item == 1 && 'active-p'">{{$root.$t('bet_record.account')}}<span></span></p>
          <p class="yb_ml10" v-if="authorityFlag" @click="change_record(2)" :class="store_cathectic.main_item == 2 && 'active-p'">{{$root.$t('pre_record.book')}}<span></span></p>
        </div>
        <div class="col-2 close">
          <span class="close-click-padding" @click="close_show">
            <template v-if="lodash.get(store_cathectic, `get_theme.includes('theme01')`)"><img  src="image/wwwassets/bw3/svg/bet_close2.svg"></template>
            <template v-else><img  src="image/wwwassets/bw3/svg/bet_close3.svg"></template>
          </span>
        </div>
      </div>
  
      <div class="content-m" ref="record_box">
        <!--未结算  -->
        <unsettle v-show="store_cathectic.main_item == 0" ref="unsettleChild"></unsettle>
        <!--已结算-->
        <!-- <settle v-show="store_cathectic.main_item == 1"></settle> -->
        <!--预约-->
        <!-- <preRecord v-show="store_cathectic.main_item == 2"></preRecord> -->
      </div>
    </div>
  </template>
  
  <script setup>
    import { api_betting } from "src/api/index.js"; 
  //   import { mapGetters, mapMutations } from "vuex"
  import unsettle from "./unsettle.vue" // project\yazhou-h5\src\pages\cathectic\unsettle.vue
  //   import settle from "src/project/pages/cathectic/settle.vue"
  //   import pre_record from "src/project/pages/cathectic/pre_record.vue"
  import { onMounted, onUnmounted, ref, computed } from 'vue'
  import lodash from 'lodash'
  // import { cathecticReducer }  from "../../store/index.js"; // project\yazhou-h5\src\store\index.js
    import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"
  import { useRoute } from 'vue-router'
  import store from 'src/store-redux/index.js'

  
  let { cathecticReducer, userInfoReducer } = store.getState()
  let store_user = userInfoReducer
  let store_cathectic = cathecticReducer
    // provide(){
    //   return {
    //     queryorderpresettleconfirm_data: '',  // 待确认中的提前结算订单
    //   }
    // },
    // let store_cathectic = cathecticReducer()
    console.error(store);
    // 延时器
    let timer_1 = ref(null)
    // 待确认中的提前结算单
    let provided_ = ref({})
    // 锚点
    let unsettleChild = ref(null)
    let record_box = ref(null)
    // computed: {
    //   ...mapGetters(['main_item','get_theme','get_user']),
      
    // },
    //判断该商户是否有权限预约投注
    const authorityFlag = computed(() => {
        const bookBet = lodash.get(store_user.user, 'configVO.bookBet')
        console.error(bookBet, store_user);
        return bookBet == 1
    })
   
    onMounted(() => {
      over_body(true)
      height_calc()
      // TODO: 后续修改调整
      window.onresize = height_calc
        // 查询待确认中的提前结算单
      api_betting.queryOrderPreSettleConfirm().then(res => {
        let {code,data} = res || {}
        if(code == 200 && data) {
          // 待确认中的提前结算单
          provided_.value = {queryorderpresettleconfirm_data:data}
        }
        // 弹窗显示接口获取列表后延迟
        timer_1 = setTimeout(() => {
          unsettleChild.check_early_order()
          unsettleChild.search_early_money()
        }, 800);
        
        
      })
    })
    //   ...mapMutations(['set_main_item']),
      /**
       *@description 高度计算
       *@return {Undefined} undefined
       */
    const height_calc = () => {
        let ele = record_box
        if (!ele) return
        let rem_1 = window.innerWidth * 100 / 375;
        ele.value.style['height'] = window.innerHeight - rem_1 + 'px';
      }
      /**
       *@description 投注记录弹出时解决滑动穿透，记录body的滚动位置
       *@param {Boolean} value 投注记录弹框是否弹出
       *@return {Undefined} undefined
       */
    const over_body = (value) => {
        let dom_ = document
        if (value) {
          // TODO: 如果后续无用再删除
          //记录此时滚动条位置
          // scroll_top = dom_.scrollingElement.scrollTop; 
           // 使body固定定位，脱离文档流   
          // dom_.body.style.position = "fixed";  
          // 把脱离文档流的body拉上去！否则页面会回到顶部！
          // dom_.body.style.top = -scroll_top + 'px';    
        } else {
          // body去除固定定位，回到了文档流中
          // dom_.body.style.position = "static";   
          // dom_.scrollingElement.scrollTop = scroll_top;
        }
      }
      /**
       *@description 关闭弹层
       *@return {Undefined} undefined
       */
    const close_show = () => {
        useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, false)
      }
    const change_record = (key) => {
        //已选中状态下不能点击
        if (store_cathectic.main_item === key) return;
        // set_main_item(key);
        store.dispatch({type: "SET_MAIN_ITEM", data: key})
      }
      // 清除当前组件所有定时器
    const clear_timer = () => {
        clearTimeout(timer_1)
        timer_1= null
      }
    onUnmounted(() => {
      over_body(false)
      set_main_item(0);
      // for (const key in $data) {
    //     $data[key] = null
    //   }
    })
  </script>
  
  <style lang="scss" scoped>
  .settle-dialog {
    border-radius: 16px 16px 0 0;
    position: relative;
    overflow: hidden;
  }
  .head-top {
    height: 0.5rem;
    position: relative;
    .close{
      position: absolute;
      right: 0;
      .close-click-padding{
        padding: 0.08rem 0.04rem;
      }
      img {
        width: 0.24rem;
        opacity: 0.7;
        border: 0.06rem solid transparent;
        transform: translateY(0.02rem);
      }
    }
    & div:last-child {
      text-align: right;
      padding-right: 0.14rem;
      font-size: 0.14rem;
    }
  
    p {
      position: relative;
  
      span {
        position: absolute;
        display: block;
        width: 36%;
        height: 0;
        left: 50%;
  
        transform: translateX(-50%);
        border-radius: 0.08rem;
      }
  
      &.active-p {
        font-weight: 600;
        color: var(--q-color-fs-color-145);
      }
    }
  }
  </style>
  