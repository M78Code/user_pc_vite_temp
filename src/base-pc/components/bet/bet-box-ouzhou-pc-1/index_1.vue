<template>
  <div class="bet-box-info" ref="pondModel" id="drag" >
    <div v-show="false"> {{UserCtr.user_version}} -{{MenuData.menu_data_version}}- {{BetData.bet_data_class_version}}-{{BetViewDataClass.bet_view_version}}</div>
    <!-- 头部信息 -->
    <betTitle />
    <!-- 展开项 -->
    <div v-show="BetData.bet_state_show" class="bet-box-content">

      <div class="f-b-c px-12 h40 font14 bet-delete-all" v-if="(BetData.bet_single_list.length || BetData.bet_s_list.length) && BetViewDataClass.bet_order_status == 1 ">
        <!-- 删除全部  -->
        <div class="cursor" @click="BetData.set_clear_bet_info()&BetData.set_bet_state_show(false)">
          <span class="icon-delete"></span>
          <span class="ml-16">{{i18n_t('common.del_all')}}</span>
        </div>

        <!-- {{BetData.is_bet_single}}-{{ BetData.is_bet_merge }} -->
        
        <div class="cursor re f-e-c bet-text">
           <!--  单关 合并 切换 -->
          <div class="f-e-c" @click.prevent="show_merge_change()" v-if="BetData.is_bet_single&&!MenuData.is_vr()">
            {{ i18n_t('bet.merge') }} 
            <span v-if="BetData.is_bet_merge" class="icon-arrow icon-arrow-merge ml-4"></span>
            <span v-else class="merge-checkbox ml-4"></span> 
          </div>
          <!-- 单关 串关 切换 -->
          <div class="f-e-c ml-16" @click.prevent="show_single_change()" v-if="!MenuData.is_kemp()">
            <span v-if="BetData.is_bet_single">{{ i18n_t('bet.bet_one_') }}</span>
            <span v-if="!BetData.is_bet_single">{{ i18n_t('bet.bet_series') }}</span>

            <div class="switch-single ml-4" :class="BetData.is_bet_single ? '':'arrow-single'">
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- {{BetData.is_bet_single}}-{{BetViewDataClass.bet_order_status}}-{{ BetViewDataClass.orderNo_bet_obj}}-{{ BetData.bet_s_list.length > 1 }}-{{ BetViewDataClass.bet_special_series }} -->
      <!-- 单关 投注 -->
      <div class="bet-scroll" ref="betScrollView">
        <div ref="betScrollContent" v-if="BetViewDataClass.bet_order_status == 1">
          <template v-if="BetData.is_bet_single && BetData.bet_single_list.length">
            <div v-for="(item,index) in BetData.bet_single_list" :key="item.playOptionsId">
                <betItem :items="item" :key="index" :index="index" />
            </div>
            <div v-if="BetData.bet_single_list.length > 1">
              <BetMultipleInput/>
            </div>
          </template>
          <!-- 串关 投注 -->
          <template v-else>
            <div v-for="(item,index) in BetData.bet_s_list" :key="item.playOptionsId">
              <betItem :items="item" :key="index" :index="index" />
            </div>

            <!-- 串关投注 限额 -->
            <template v-if="BetData.bet_s_list.length > 1">
              <template v-if="BetViewDataClass.bet_special_series.length">
                <betSpecialInput :items="BetViewDataClass.bet_special_series[0]" :index="0" />
              </template>

              <div class="f-s-c cursor h44 pl-30 bor-b" @click="set_show_single()">
                <span class="fon12 font400 text-8a8">{{ i18n_t('bet.bet_n_') }}</span>
                <span class="icon-arrow icon-arrow-series" :class="ref_data.show_single ?'arrow':''"></span>
              </div>
              <!-- 复式连串过关投注 限额 -->
              <template v-if="BetData.bet_s_list.length > 2 && !ref_data.show_single ">
                <template v-for="(item,index) in BetViewDataClass.bet_special_series" :key="index" >
                  <div class="bor-b" v-if="index != 0">
                    <betSpecialInput :items="item" :index="index" />
                  </div>
                </template>
              </template>
            </template>

          </template>
        </div>
  
        <!-- 投注后的结果 -->
        <template v-else>
          <template v-if="BetData.is_bet_single">
            <div v-for="(item,index) in BetViewDataClass.orderNo_bet_obj" :key="item.orderNo">
              <betResult :items="item" :key="'orderNo' + index" :index="index" />
            </div>
          </template>
          <template v-else>
            <div v-for="(item,index) in BetViewDataClass.orderNo_bet_obj" :key="item.orderNo">
              <betResult :items="item" :key="'orderNo' + index" :index="index" />
            </div>
            <div v-for="(item,index) in BetViewDataClass.orderNo_bet_single_obj" :key="item.orderNo">
              <!-- {{ item }} -->
              <betMixResult :items="item" :key="index" :index="index" />
            </div>
          </template>
          
        </template>
      </div>
       
       <!-- 底部投注信息 -->
       <div v-show="BetData.bet_single_list.length || BetData.bet_s_list.length">
        <betFooter />
       </div>
       
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watchEffect, onBeforeUnmount, computed } from "vue"
import { MenuData, UserCtr, format_money2} from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js"
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js"
import betTitle from "./components/bet-title.vue"  // 投注头部
import betItem from "./components/bet-item.vue"  // 投注列表
import betFooter from "./components/bet-footer.vue"  // 投注底部信息
import betResult from "./components/bet-result.vue"  // 投注结果
import betMixResult from "./components/bet-mix-result.vue"  // 串关投注结果
import betSpecialInput from "./components/bet-special-input.vue"
import BetMultipleInput from "./components/bet-multiple-input.vue"
import { nextTick } from "licia"


const ref_data = reactive({
  show_single: false,
  bet_scroll_height: 0
})

const betScrollView = ref(null)
const betScrollContent = ref(null)

// 复合式串关 开关
const set_show_single = () =>{
  // 串关数 大于3条才可以开启 复式串关
  if(BetData.bet_s_list.length > 2){
    ref_data.show_single = !ref_data.show_single
  }
}

// 单关/串关 切换
const show_single_change = () => {
  if(BetData.is_bet_single){
   BetData.set_is_bet_single('series')
   next()
   return
  }
  BetData.set_is_bet_single('single')
  next()
}

const next = () => {
  nextTick(() => {
    BetData.switch_bet_query_bet_amount()
    BetData.set_bet_oid_list()
  })
}

// 单关/ 合并切换
const show_merge_change = () => {
  if(BetData.is_bet_merge){
    BetData.set_is_bet_merge('no')
    next()
    return
  }
  BetData.set_is_bet_merge('merge')
  next()
}
// 判断当前投注项内 是否有不允许串关的 有的话把串关按钮干掉
const is_serial = computed(() => state => {
    return !BetData.bet_single_list.filter(i => i.is_serial == true).length
});

// 使用ResizeObserver来监听高度变化
// const resizeObserver = new ResizeObserver(() => {
//     ref_data.bet_scroll_height = betScrollContent.value?.clientHeight;

//     // 在高度变化时执行一些操作
//     betScrollView.value.scrollTop = ref_data.bet_scroll_height
//   });
  
// watchEffect(() => {
//   if (betScrollContent.value) {
//     // 开始监听
//     resizeObserver.observe(betScrollContent.value);
//   }
// });

// 在组件销毁时停止监听
// onBeforeUnmount(() => {
//   resizeObserver.disconnect();
// });

onMounted(() => {
  // BetData.switch_bet_query_bet_amount()
})


</script>

<style scoped lang="scss">
  @import "./css/bet.scss";

  .bet-box-info{
    min-height: 55px;
  }

  .bet-scroll{
    max-height: 400px;
    overflow-y: auto;
  }

  .bet-box-content{
    background: var(--q-gb-bg-c-4);
    border: 1px solid var(--q-gb-bd-c-1);
    border-top: none;
  }
  .bet-delete-all{
    background: var(--q-gb-bg-c-15);
  }
  .switch-single{
    width: 36px;
    height: 18px;
    border-radius: 18px;
    border: 1px solid var(--q-gb-bd-c-5);
    position: relative;
    transition: .3s;
    &.arrow-single{
      border: 1px solid var(--q-gb-bd-c-1);
      span{
        left: 18px;
        background:var(--q-gb-bg-c-1) ;
      }
    }
    span{
      width: 14px;
      height: 14px;
      top: 1px;
      left: 2px;
      border-radius: 50%;
      position: absolute;
      background: var(--q-gb-bg-c-19);
      transition: .3s;
    }
  }

  .merge-checkbox{
    width: 16px;
    height: 16px;
    border: 1px solid var(--q-gb-bd-c-5);
    display: inline-block;
    border-radius: 4px;
  }


  .icon-arrow-merge{
    background: var(--q-gb-bg-c-1);
    width: 16px;
    height: 16px;
    border-radius: 4px;
    display: flex;
    font-size: 12px;
    justify-content: center;
    align-items: center;
    color: var(--q-gb-t-c-1);
    transition: 0.3s;
    transform: rotate(180deg);
    &.arrow{
      transform: rotate(0deg);
    }
  }

  .icon-arrow-series{
    
  }

  .show_single{
    position: absolute;
    background: var(--q-gb-bg-c-4);
    box-shadow: 0px 0px 12px 0px rgba(0,0,0,.25);
    padding: 0 16px;
    width: 160px;
    top: 30px;
    right: 0;
    z-index: 111;
    .bet-li{
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 0px;
      border-bottom: 1px solid var(--q-gb-bd-c-2);
      &.active{
        color: var(--q-gb-t-c-2);
      }
    }
  }

  .bet-text{
    color: var(--q-gb-t-c-8);
  }
  
</style>