<template>
  <div class="bet-pre-appoint">
    <div v-if="item.show_edit_market" class="row yb-flex-center book-content">
      <!--预-->
      <div class="col-2 center yb-fontsize12">{{ i18n_t('bet.bet_dish') }}</div>
      <!--此处为盘口区域，-->
      <div class="input-number">
        <!-- 盘口减- -->
        <div class="sub-number disabled" v-if="ref_pre_book.appoint_ball_head <= check_ball_min(item)">-</div>
        <div class="sub-number " v-else v-touch-repeat:0:300.mouse.enter.space="() => {
          sub_handle(item)
          }">-</div>
        <input class="pre-input" v-model="ref_pre_book.appoint_ball_value" @blur="appoint_odds_head_handle" v-if="item.sportId == 1"   @mousedown.stop="">
        <input class="pre-input" ref="ball-head-input" v-model="ref_pre_book.appoint_ball_value"  @mousedown.stop=""
          @blur="appoint_odds_head_handle" v-if="item.sportId == 2">
        <!-- 盘口加+-->
        <div class="add-number disabled" v-if="ref_pre_book.appoint_ball_head >= check_ball_max(item)">+</div>
        <div class="add-number" v-else v-touch-repeat:0:300.mouse.enter.space="() => {
            add_handle(item)
            }">+</div>

      </div>
    </div>
    <div class="row yb-flex-center book-content">
      <div class="col-2 mt5 center yb-fontsize12">{{ i18n_t('bet.bet_odds') }}</div>
      <!--减号 赔率输入框 加号-->
      <div class="input-number mt5">
        <div class="sub-number" :class="{ 'disabled': ref_pre_book.min_odds_value == ref_pre_book.appoint_odds_value }"
          v-touch-repeat:0:300.mouse.enter.space="() => {
            btn_reduce(item)
          }">-</div>

        <input class="pre-input" v-model="ref_pre_book.appoint_odds_value" @blur="pre_input_handle"  @mousedown.stop="" ref="currency_input">

        <div class="add-number" :class="{ 'disabled': ref_pre_book.appoint_odds_value >= 355 }"
          v-touch-repeat:0:300.mouse.enter.space="() => {
            btn_add(item)
          }">+</div>
      </div>
      <div class="col-1"></div>
      <div class="col-1 cancel" @click="cancel_operate">
      <icon-wapper size="13px" name="icon-delete" />
    </div>
    </div>
    <!--取消-->
    <!-- <div class="col-1 cancel" @click="cancel_operate">
      <icon-wapper size="13px" name="icon-delete" />
    </div> -->
  </div>
</template>

<script setup>
import { btn_reduce, btn_add, ref_pre_book,add_handle,sub_handle,computed_keyboard_odds } from "src/core/bet/common/appoint-data.js"
import { BASKETBALL_BY_APPOINTMENT_let,MARKET_RANG_FLAG_LIST,BASKETBALL_BY_APPOINTMENT_total } from "src/output/index.js";
import { IconWapper } from 'src/components/icon'

const emit = defineEmits(["cancel_operate"]);

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  item: {}
})

// 取消预约
const cancel_operate = () => {
  emit("cancel_operate");
}

const check_ball_max = (_item) =>{
  if( _item.sportId == 1){
    if(MARKET_RANG_FLAG_LIST.includes(_item.playId)){
      return 10
    }else{
      return 30
    }
  }else{
    if(BASKETBALL_BY_APPOINTMENT_let.includes(_item.playId)){
      return 99.5
    }
    if(BASKETBALL_BY_APPOINTMENT_total.includes(_item.playId)){
      return 400.5
    }
  }
}


const check_ball_min = (_item) =>{
    if( _item.sportId == 1){
      if(MARKET_RANG_FLAG_LIST.includes(_item.playId)){
        return -10
      }else{
        return _item.score_home*1 + _item.score_away*1 + 0.5
      }
    }else{
      if(BASKETBALL_BY_APPOINTMENT_let.includes(_item.playId)){
        return -99.5
      }
      if(BASKETBALL_BY_APPOINTMENT_total.includes(_item.playId)){
        return 50.5
      }
    }
  }
const pre_input_handle = ()=>{
  computed_keyboard_odds(ref_pre_book.appoint_odds_value)
}

const appoint_odds_head_handle = ()=>{
  if( ref_pre_book.appoint_ball_value > check_ball_max(props.item)){
    ref_pre_book.appoint_ball_value = check_ball_max(props.item)
  }
  if( ref_pre_book.appoint_ball_value < check_ball_min(props.item)){
    ref_pre_book.appoint_ball_value = check_ball_min(props.item)
  }
  ref_pre_book.appoint_ball_head = ref_pre_book.appoint_ball_value 
  
}





</script>

<style lang="scss" scoped>
.pre-input {
  border: 1px solid var(--q-gb-bd-c-5);
}

.m-b-8 {
  margin-bottom: 8px;
}

// .center {
//   height: 26px;
//   line-height: 23px;
// }

.bet-pre-appoint {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 34px 12px 34px;
  justify-content: space-between;
  position: relative;
  .cancel {
    // position: absolute;
    // right: 22px;
  }
}

//预约投注内容
.book-content {
  color: var(--q-gb-t-c-8);
  flex-wrap: nowrap;

  .input-number {
    display: flex;

    //预约加
    .sub-number {
      font-size: 16px;
      color: var(--q-gb-bd-c-5);
      text-align: center;
      width: 24px;
      height: 28px;
      line-height: 28px;
      margin-left: 6px;
      background: var(--q-gb-bg-c-15);
      // border: 0.5px solid var(--q-gb-bd-c-7);
      border-radius: 4px 0px 0px 4px;
      border: 1px solid var(--q-gb-bd-c-5);
      border-right: 0;
      cursor: pointer;
    }

    //预约投注输入框样式
    input {
      color: var(--q-gb-t-c-5);
      border-radius: 0;
      background-color: var(--q-gb-bg-c-4);
      // border: 0.5px solid var(--q-gb-bd-c-7);
      border-left: 0;
      border-right: 0;
      width: 74px;
      height: 28px;
      text-align: center;
      outline: none;
      font-weight: bold;
    }

    //预约减
    .add-number {
      font-size: 16px;
      color: var(--q-gb-bd-c-5);
      text-align: center;
      width: 24px;
      height: 28px;
      line-height: 28px;
      background: var(--q-gb-bg-c-15);
      // border: 0.5px solid var(--q-gb-bd-c-7);
      border-radius: 0px 4px 4px 0px;
      cursor: pointer;
      border: 1px solid var(--q-gb-bd-c-5);
      border-left: 0;
    }
  }

  //预约删除图标样式
  .icon-delete {
    margin-top: 5px;
    color: #999999;
  }
}
</style>