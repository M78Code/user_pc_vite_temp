<template>
  <div class="bet-box-info" ref="pondModel" id="drag" >
    <div v-show="false"> {{UserCtr.user_version}} -- {{BetData.bet_data_class_version}}{{BetViewDataClass.bet_view_version}}</div>
    <!-- 头部信息 -->
    <betTitle />
    <!-- 展开项 -->
    <div v-show="BetData.bet_state_show" class="bet-box-content">

      <div class="f-b-c px-12 h40 font14 bet-delete-all" v-if="(BetData.bet_single_list.length || BetData.bet_s_list.length) && BetViewDataClass.bet_order_status == 1 ">
        <div class="cursor">
          <span class="icon-delete"></span>
          <span class="ml-16">删除全部</span>
        </div>
        <div class="cursor re" @click="show_single_change()">
          <div class="f-e-c">
            <!-- {{ BetData.is_bet_single }}-{{ BetData.is_bet_merge }} -->
            <span v-if="BetData.is_bet_single && !BetData.is_bet_merge">{{ i18n_t('bet.bet_one_') }}</span>
            <span v-if="BetData.is_bet_single && BetData.is_bet_merge">{{ i18n_t('bet.merge') }}</span>
            <span v-if="!BetData.is_bet_single">{{ i18n_t('bet.bet_series') }}</span>

            <span class="icon-arrow" :class="ref_data.show_single ?'arrow':''"></span>
          </div>
          <div class="show_single" v-if="ref_data.show_single">
            <!-- 单关 -->
            <div :class="BetData.is_bet_single && !BetData.is_bet_merge?'active':''" class="bet-li" @click="set_single_change('single')">{{i18n_t('bet.bet_one_')}}</div>
            <!-- 串关 -->
            <div :class="BetData.is_bet_single?'':'active'" class="bet-li" @click="set_single_change('series')">{{i18n_t('bet.bet_series')}}</div>
            <!-- 单关合并 -->
            <div :class="BetData.is_bet_single && BetData.is_bet_merge?'active':''" class="bet-li" @click="set_single_change('merge')">{{i18n_t('bet.merge')}}</div>
          </div>
        </div>
      </div>

      <!-- {{BetData.is_bet_single}}-{{BetViewDataClass.bet_order_status}}-{{ BetViewDataClass.orderNo_bet_obj}} -->
      <!-- 单关 投注 -->
      <div>
        <div v-if="BetViewDataClass.bet_order_status == 1">
          <template v-if="BetData.is_bet_single">
            <div v-for="(item,index) in BetData.bet_single_list" :key="item.playOptionsId">
                <betItem :items="item" :key="index" :index="index" />
            </div>
          </template>
          <template v-else>
            <div v-for="(item,index) in BetData.bet_s_list" :key="item.playOptionsId">
              <betItem :items="item" :key="index" :index="index" />
            </div>
            <!-- 串关投注 限额 -->
            <template v-if="BetData.bet_s_list.length > 1">
              <div v-for="(item,index) in BetViewDataClass.bet_special_series" :key="index" class="bor-b">
                <betSpecialInput :items="item" />
              </div>
            </template>
          </template>
        </div>
  
        <!-- 投注后的结果 -->
        <template v-else>
          <template v-if="BetData.is_bet_single">
            <div v-for="(item,index) in BetViewDataClass.orderNo_bet_obj" :key="item.orderNo">
              <betResult :items="item" :key="index" :index="index" />
            </div>
          </template>
        </template>
      </div>
       
       <!-- 底部投注信息 -->
       <betFooter v-show="BetData.bet_single_list.length || BetData.bet_s_list.length"/>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { UserCtr} from "src/output/index.js"
import BetData from "src/core/bet/class/bet-data-class.js"
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js"
import betTitle from "./components/bet-title.vue"  // 投注头部
import betItem from "./components/bet-item.vue"  // 投注列表
import betFooter from "./components/bet-footer.vue"  // 投注底部信息
import betResult from "./components/bet-result.vue"  // 投注结果
import betSpecialInput from "./components/bet-special-input.vue"

const ref_data = reactive({
  show_single: false,
})

const show_single_change = () => {
  ref_data.show_single = !ref_data.show_single
}

// 投注类型切换
const set_single_change = val => {
  switch(val){
    case "single":
      BetData.set_is_bet_single('single')
      BetData.set_is_bet_merge('no')
      break
    
    case "series":
      BetData.set_is_bet_single('series')
      break
    
    case "merge":
      BetData.set_is_bet_single('single')
      BetData.set_is_bet_merge('merge')
      break
  }
}



</script>

<style scoped lang="scss">
  @import "./css/bet.scss";

  .bet-box-info{
    min-height: 55px;
  }

  .bet-box-content{
    background: var(--q-gb-bg-c-4);
    border: 1px solid var(--q-gb-bd-c-1);
    border-top: none;
  }
  .bet-delete-all{
    background: var(--q-gb-bg-c-15);
  }
  .icon-arrow{
    background: var(--q-gb-bg-c-1);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--q-gb-t-c-1);
    margin-left: 10px;
    transition: 0.3s;
    transform: rotate(180deg);
    &.arrow{
      transform: rotate(0deg);
    }
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
</style>