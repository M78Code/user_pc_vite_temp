<!--
 * @Author: Router
 * @Description: 普通赛事的投注弹框
-->
<template>
  <div class="component bet-mix-box-chid ouzhou-h5 bet-mix-box-child2">
    <!-- 多注顶部蒙层 -->
    <div class="full-shadow" @click.self="pack_up" @touchmove.prevent v-if="BetData.bet_state_show"></div>
    <!-- 投注中的蒙层，所有不能点击 -->
    <!-- <div v-if="BetViewDataClass.bet_order_status != 1" class="fixed full-shadow2" @touchmove.prevent></div> -->

    <div v-show="false">{{ BetData.bet_data_class_version }} {{BetViewDataClass.bet_view_version}}-{{BetData.is_bet_single}}-{{BetData.is_bet_merge}}</div>

   <div class="content-box" :class="BetData.bet_state_show?'bet_state_show':''">
        <!-- 头部 -->
        <bet-bar></bet-bar>
        
        <div v-show="BetData.bet_state_show">
          <!-- 删除全部和选择type -->
          <bet-all-detele :is_dropdown="is_dropdown" v-if="BetViewDataClass.bet_order_status == 1"></bet-all-detele>
          <!-- --------{{BetViewDataClass.bet_order_status}} - {{BetData.is_bet_single}} -->
          <!-- 单关  -->
          <template v-if="BetData.is_bet_single ">
            <template v-if="BetViewDataClass.bet_order_status == 1">
              <!-- 单关单注  -->
              <template v-if="!BetData.is_bet_merge">
                <template v-if="BetViewDataClass.bet_order_status == 1 && BetData.bet_single_list.length ">
                    <!-- 单关投注项列表  -->
                    <bet-mix-box-child1 :items="BetData.bet_single_list[0]" :index="1"></bet-mix-box-child1>
                    <!-- 单关的输入框 -->
                    <bet-input-info :item="BetData.bet_single_list[0]" :index="1" ></bet-input-info>
                </template>
              </template>
              <!-- 单关合并 -->
              <template v-else>
                  <!-- 合并单关  -->
                  <div class="scroll-box scroll-box-center" ref="scroll_box" :style="{ 'max-height': `${ref_min_height_max}rem` }">
                    <template v-if="BetData.is_bet_single && BetData.bet_single_list.length">
                      <div v-for="(items,index) in BetData.bet_single_list" :key="items.playOptionsId">
                        <bet-mix-box-child1 :items="items" :index="index"></bet-mix-box-child1>
                        <bet-input-info2 :item="items" :index="index"></bet-input-info2>
                      </div>
                      <div v-if="BetData.bet_single_list.length > 1">
                        <bet-input-multiple></bet-input-multiple>
                      </div>
                    </template>
                  </div>
              </template>
              <!-- 合并投注 常用金额 -->
              <bet-merge />
              <!-- 键盘 -->
              <key-board></key-board>
            </template>

            <bet-mix-box-child4 v-else :item="BetData.bet_single_list[0]" :index="0" ></bet-mix-box-child4>
          </template>

          <!-- 串关 -->
          <template v-if="!BetData.is_bet_single">
            <!-- 串关投注项列表  -->
            <!-- <div class="scroll-box scroll-box-center" ref="scroll_box" :style="{ 'max-height': `${ref_min_height_max}rem` }"> -->
            <q-scroll-area ref="scrollAreaRef" :visible="false" :style="{ 'height': `${ref_min_height_max}rem` }" :thumb-style="{ opacity: 0}">

              <template v-if="BetViewDataClass.bet_order_status == 1">
                <template v-for="(item, index) in BetData.bet_s_list" :key="index">
                  <bet-mix-box-child1 :items="item" :index="index"></bet-mix-box-child1>
                </template>

                <!-- 串关投注 限额 -->
                <!-- 复式连串过关投注 限额 -->
                <template v-if="BetData.bet_s_list.length > 1"  >
                  <template v-for="(item, index) in BetViewDataClass.bet_special_series" :key="index" >
                    <template v-if="(BetData.special_type || !index || BetData.bet_s_list.length > 2) && BetData.special_type || !index">
                      <bet-special-input :items="item" :index="index" />
                    </template>
                  </template>
                </template>

                <template v-else>
                  <div class="bet-title bet-error">{{i18n_t("bet.bet_min_item").replace('{num}',BetData.mix_min_count)}}</div>
                </template>
              </template>
              
              <template v-else>
                <!-- 串关投注项结果 -->
                <template v-for="(item, index) in BetViewDataClass.orderNo_bet_obj" :key="item.orderNo">
                  <bet-special-result :items="item" :index="index" />
                </template>
                <!-- 串关投注项类型结果 -->
                <template v-for="(item, index) in BetViewDataClass.orderNo_bet_single_obj" :key="item.orderNo">
                  <bet-special-state :items="item" :index="index" />
                </template>
              </template>
            </q-scroll-area>

            <!-- 串关最高可赢金额 合计投注金额 -->
            <bet-special-winning />

            <!-- 键盘 -->
            <key-board v-if="BetData.bet_keyboard_show && BetViewDataClass.bet_order_status == 1"></key-board>
          </template>

          <!-- 按钮 -->
          <bet-btn v-if="BetViewDataClass.bet_order_status == 1"></bet-btn>
          <bet-btn1 v-else></bet-btn1>

        </div>
   </div>
  </div>
</template>

<script setup>
import betBtn from './bet-btn.vue';
import betBtn1 from './bet-btn1.vue';
import keyBoard from './keyboard.vue';
import betInputInfo from "./bet_input_info.vue";
import betMixBoxChild1 from "./bet_mix_box_child1.vue";
import betMixBoxChild4 from "./bet_mix_box_child4.vue";

import betSpecialInput from "./bet-special-input.vue";
import betSpecialState from "./bet-special-state.vue";
import betSpecialResult from "./bet-special-result.vue";
import betSpecialWinning from "./bet-special-winning.vue";

import betInputInfo2 from "./bet_input_info2.vue";
import betInputMultiple from "./bet_input_multiple.vue";
import betMerge from "./bet-merge.vue"

import betAllDetele from "./bet_all_detele.vue";
import betBar from "./bet-bar.vue";
//import betInputInfo from "//bet_input_info";
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { ref, onMounted, reactive ,onUnmounted ,watch,computed} from 'vue';
import {MITT_TYPES,useMittOn,formatMoney,UserCtr } from "src/output/index.js"
import lodash from "lodash";
// 键盘收起的高度
let ref_min_height_max = ref('3.6') // rem 高长屏幕

//串单列表定位高度
const scrollAreaRef = ref(0)

//串关的按钮
const scroll_box = ref()
const award_total = ref()

const get_bet_status = ref(0) // 投注状态
const btn_show = ref(0) // 投注状态2
const max_height1 = ref(2.5) // 投注赛事高度
const max_height2 = ref(3.5)
const is_dropdown = ref(false)
const aclientHeight = document.body.clientHeight
// 蒙版点击 收起投注栏 事件
const pack_up = (val) => {
  BetData.set_bet_state_show(false)
  is_dropdown.value = false
}
const ref_data = reactive({
  emit_lsit: {}
})

const scrollAreaPo = () => {

  if(!BetData.is_bet_single){
    if(!BetData.special_type){
      scrollAreaRef.value.setScrollPercentage ('vertical',1)
    }else{
      scrollAreaRef.value.setScrollPosition('vertical', BetData.bet_s_list.length * 139 + 100)
    }
  }
}

const set_W_H = () => {
  ref_min_height_max.value = document.body.clientHeight > 580 ? '2.5' : '2'
  ref_min_height_max.value = document.body.clientHeight > 650 ? '2.4' : '1.9'
  ref_min_height_max.value = document.body.clientHeight > 700 ? '2.3' : '1.8'
  ref_min_height_max.value = document.body.clientHeight > 750 ? '2.2' : '1.7'
  ref_min_height_max.value = document.body.clientHeight > 800 ? '2.1' : '1.6'
  ref_min_height_max.value = document.body.clientHeight > 850 ? '2' : '1.5'
}


onMounted(() => {

  set_W_H();

  scrollAreaPo();

  ref_data.emit_lsit = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_SET_NOTSINGLE_SHOW_LIST,scrollAreaPo).off,
  }
  
})

onUnmounted(()=>{

  Object.values(ref_data.emit_lsit).map((x) => x());

})

</script>
<style lang="scss" scoped>
.yb_delete{
  width: 0.5rem;
  height: 0.5rem;
  background: var(--q-gb-t-c-7);
  color: var(--q-gb-t-c-1);
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 0.1rem;
}
.yb-dan-btn{
  width: 0.5rem;
  height: 0.5rem;
  padding: 0 0.13rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: 0.1rem;
  background: var(--q-gb-t-c-7);
  color: var(--q-gb-t-c-1);
  font-weight: bold;
}
.yb-nostrand{
  margin-left: 0.1rem;
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.2rem;
  color: var(--q-gb-t-c-9);
  background: var(--q-gb-t-c-7);
}
.yb-strand{
  margin-left: 0.1rem;
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.2rem;
  color: var(--q-gb-t-c-1);
  background: var(--q-gb-t-c-7);
}
.yb-info{
  background: var(--q-gb-t-c-1) !important;
  display: flex;
  justify-content: space-between;
  padding: 0 0.3rem;
  border-radius: 0.7rem;
  color: var(--q-gb-t-c-2);
  font-size: 0.14rem;
}
.yb-info-hui{
background: var(--q-gb-t-c-3) !important;
}
.yb-info-money{
  font-size: 0.12rem;
  color: var(--q-gb-bg-c-9);
}

.yb-info-one{
  color: var(--q-gb-t-c-6);
}
.yb-info-two{
  color: var(--q-gb-t-c-7);
}
.nonebox4-sub{
    padding: 0.08rem 0;
    margin-top: 0.08rem;
    width: 100%;
    font-size: 16px;
    text-align: center;
    color: #FFFFFF;
    background-color: var(--q-gb-t-c-1);
    border-radius: 12px;
    margin-bottom: .2rem ;
}
.bet-mix-box-child2 {
  /** tabbar z-index 已经10000， 该项需要大于其 */
  --private-bet-mix-box-child-z-index: 100000;
  .used-money {
    color: var(--q-gb-t-c-2);
  }

  .err-msg3 {
    height: 0.3rem;
    line-height: 0.3rem;

    img {
      vertical-align: -0.026rem;
      width: 0.14rem;
    }
  }
}

.content-box {
  position: relative;
  bottom: 0;
  z-index: 1000;
  // left: 50%;
  // transform: translateX(-50%);
  overflow: hidden;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  background-color: var(--q-gb-t-c-2);
  &.bet_state_show{
    position: fixed;
    bottom: 0;

    z-index: var(--private-bet-mix-box-child-z-index);

   //z-index: 16000;

  }
  .yb_pl14 {
    margin-right: 0.01rem;

    img {
      width: 0.11rem;
    }
  }
}

.dele-wrap2 {
  justify-content: flex-start;
  width: 100%;
}

.full-shadow {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1100;
  backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.5);
}

.scroll-box {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  margin-bottom: -1px;
  //background-color: var(--q-gb-t-c-7);
  //padding: 12px;
  //border-radius: 12px;
}

.full-shadow2 {
  opacity: 0;
  width: 100%;
  max-width: 3.78rem;
  height: calc(var(--vh, 1vh) * 100);
  bottom: 0;
  z-index: 7100;

  .opacity-m {
    opacity: 0.4;
  }
}

/* ************** 底部左侧按钮 ************** -S */
.add-box {
  font-size: 0.16rem;
  height: 0.5rem;
  line-height: 0.5rem;
  width: 0.85rem;
  border: 1px solid;
  border-radius: 4px;
  margin-right: 0.1rem;
  text-align: center;

  img {
    margin-left: 0.02rem;
    width: 0.12rem;
  }
}

/* ************** 底部左侧按钮 ************** -E */

/* ************** 底部左侧投注成功后保留选项按钮 ************** -S */
.add-box2 {
  font-size: 0.14rem;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0.14rem;
}

/* ************** 底部左侧投注成功后保留选项按钮 ************** -E */

/* ************** 底部右侧按钮 ************** -S */
.bet-box {
  flex: auto;
  border-radius: 4px;
  height: 0.5rem;
  line-height: 0.51rem;
  overflow: hidden;
}

.bet-box>p {
  height: 100%;
  text-align: center;
  line-height: 0.52rem;
}

/* ************** 底部右侧按钮 ************** -E */

/* ************** 删除全部图标 ************** -S */
.img1 {
  vertical-align: text-bottom;
  width: 0.14rem;
}

/* ************** 接收更好赔率图标 ************** -S */
.img2 {
  display: inline-block;
  background: url($SCSSPROJECTPATH+"/image/bet/select_b.svg") no-repeat center / contain;
  // background: var(--q-color-com-img-bg-69) no-repeat center / contain;
  vertical-align: text-bottom;
  width: 0.14rem;
  height: 0.14rem;
}

/* ************** 选中状态 **************  */
.img3 {
  background-image: url($SCSSPROJECTPATH+"/image/bet/select_a.svg");
  // background-image: var(--q-color-com-img-bg-68);
}

/* ************** 接收更好赔率按钮 ************** -E */

/* ************** 串关双箭头图标 ************** -S */
.arrow {
  display: inline-block;
  width: 0.08rem;
  height: 0.08rem;
  background: var(--q-color-com-img-bg-67) no-repeat center / contain;
}

.arrow2 {
  transform: scaleY(-1);
}

/* ************** 串关双箭头图标 ************** -E */

/* ************** 串关+号图标 ************** -S */
.bet-add {
  display: inline-block;
  width: 0.12rem;
  height: 0.12rem;
  background: no-repeat center;
}

/* ************** 串关+号图标 ************** -E */

/* ************** 移除投注项删除图标 ************** -S */
.bet-add-box {
  font-size: 0.16rem;
  height: 0.5rem;
  line-height: 0.5rem;
  width: 0.85rem;
  border: 1px solid;
  border-radius: 4px;
  margin-left: 0.1rem;
  text-align: center;

}

.bet-add-new {
  display: inline-block;
  width: 24px;
  height: 44px;
  border: 0.5px solid;
}

.bet_text_left {
  margin-left: 13px;
}

.bet_margin_left {
  margin-left: 3px;
  background: #CBCED8;
  box-shadow: 0px 1px 2px 0px #00000033;
}

.bet_text_right {
  margin: 0 13px;
}

.display_center {
  display: flex;
  align-items: center;
}

.one_text_color {
  color: #99A3B1 !important;
  border: 1px solid #CBCED8;
}

.linkUp_text_color {
  color: #99A3B1 !important;
  border: 1px solid #CBCED8;
}

.close {
  display: inline-block;
  vertical-align: -0.026rem;
  width: 0.14rem;
  height: 0.14rem;
  background: var(--q-color-img-bg-98) no-repeat center / contain;
}

/* ************** 移除投注项删除图标 ************** -E */
.yellow-color {
  color: var(--q-color-fs-color-116);
}
.set-opacity{
  background:var(--q-gb-bg-c-9)
}

.bet-title {
  color: var(--q-gb-bd-c-4);
    text-align: center;
    font-size: 0.14rem;
    width: 100%;
    height: 0.36rem;
    line-height: 0.36rem;

  &.bet-error {
      color: var(--q-gb-t-c-17);
  }
}
</style>