<template>
  <div v-show="false"> {{ UserCtr.user_version }} -- {{ BetData.bet_data_class_version }}-{{ BetViewDataClass.bet_view_version}}-{{ BetData.bet_box_h5_show }}</div>
  <div v-if="BetData.bet_box_h5_show">
    <div class="full-shadow" @click.self="pack_up" @touchmove.prevent></div>
    <div class="bet-box-info">
      <!-- 头部信息 -->
      <betTitle v-if="BetViewDataClass.bet_order_status == 1"/>
      <!-- 投注状态 -->
      <bet-after-title v-else />
      <!-- 展开项 -->
      <div class="bet-box-content">
        <!-- {{BetData.is_bet_single}}-{{BetViewDataClass.bet_order_status}}-{{ BetViewDataClass.orderNo_bet_obj}}-{{ BetData.bet_s_list.length > 1 }}-{{ BetViewDataClass.bet_special_series }} -->
        <!-- 单关 投注 -->
        <div class="bet-scroll" :class="!BetData.is_bet_single && BetData.bet_keyboard_show && BetViewDataClass.bet_order_status == 1  ?'h188':''">
          <div v-if="BetViewDataClass.bet_order_status == 1">
            <template v-if="BetData.is_bet_single">
              <div
                v-for="(item, index) in BetData.bet_single_list"
                :key="item.playOptionsId"
              >
                <betItem :items="item" :key="index" :index="index" />
              </div>
            </template>
            <!-- 串关 投注 -->
            <template v-else>
              <div
                v-for="(item, index) in BetData.bet_s_list"
                :key="item.playOptionsId"
              >
                <betItem :items="item" :key="index" :index="index" />
              </div>

              <!-- 串关投注 限额 -->
              <!-- 复式连串过关投注 限额 -->
              <template v-if="BetData.bet_s_list.length > 1"  >
                <template v-for="(item, index) in BetViewDataClass.bet_special_series" :key="index">
                  <div class="bor-b">
                    <betSpecialInput :items="item" :key="index+'_'+item.id"/>
                  </div>
                </template>
              </template>

              <div class="add-match fw-c-c cursor h44 pl-30" @click="set_show_single()">
                <sapn class="fon12 font500 f-e-c">
                  <span class="re icon-mid mx-6">
                    <i class="icon-del1 icon-add" />
                  </span> 
                  添加赛事  
              </sapn>
              </div>
             
            </template>
          </div>

          <!-- 投注后的结果 -->
          <template v-else>
            <div v-show="false"> {{ UserCtr.user_version }} -- {{ BetData.bet_data_class_version }}-{{ BetViewDataClass.bet_view_version}}-{{ BetData.bet_box_h5_show }}</div>
           
            <template v-if="BetData.is_bet_single">
              <div v-for="(item, index) in BetViewDataClass.orderNo_bet_obj" :key="item.orderNo" >
                <betResult :items="item" :key="index" :index="index" />
              </div>
            </template>

            <template v-else>
              <div v-for="(item, index) in BetViewDataClass.orderNo_bet_obj" :key="item.orderNo">
                <bet-special-result :items="item" :key="index" :index="index" />
              </div>

              <div v-for="(item, index) in BetViewDataClass.orderNo_bet_single_obj" :key="item.orderNo">
                <bet-special-state :items="item" :key="index" :index="index" />
              </div>

            </template>
          </template>
        </div>

        <!-- 串关投注 键盘 -->
        <template v-if="!BetData.is_bet_single && BetViewDataClass.bet_order_status == 1">
          <div class="re">
            <keyboard  class="bet-key-board" v-if="BetData.bet_keyboard_show"/>
            <div class="scroll-down">
              <img :src="compute_local_project_file_path('/image/common/slide_icon_y1.svg')" alt="">
            </div>
          </div>
        </template>

        <!-- 底部投注信息 -->
        <betFooter />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { UserCtr, compute_local_project_file_path } from "src/output/index.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import betTitle from "./components/bet-title.vue"; // 投注头部
import betAfterTitle from "./components/bet-after-title.vue";
import betItem from "./components/bet-item.vue"; // 投注列表
import betFooter from "./components/bet-footer.vue"; // 投注底部信息
import betResult from "./components/bet-result.vue"; // 投注结果
import betSpecialResult from "./components/bet-special-result.vue"; // 串关投注结果
import betSpecialState from "./components/bet-special-state.vue"; // 串关投注结果状态
import betSpecialInput from "./components/bet-special-input.vue";
import keyboard from "./components/bet-keyboard.vue";

// 隐藏投注栏
const pack_up = () => {
  let sss = !BetData.bet_box_h5_show;
  console.error("sss", sss);
  BetData.set_bet_box_h5_show(sss);
};

// 关闭弹窗
const set_show_single = () => {
  BetData.set_bet_box_h5_show(false)
};

// 单关/串关 切换
const show_single_change = () => {
  if (BetData.is_bet_single) {
    return BetData.set_is_bet_single("series");
  }
  BetData.set_is_bet_single("single");
};

// 单关/ 合并切换
const show_merge_change = () => {
  if (BetData.is_bet_merge) {
    return BetData.set_is_bet_merge("no");
  }
  BetData.set_is_bet_merge("merge");
};
</script>

<style scoped lang="scss">
@import "./css/bet.scss";

.bet-box-info {
  position: fixed;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 600;
  overflow: hidden;
  width: 100%;
  padding: 0 0.14rem;
  -webkit-overflow-scrolling: touch;
  border-radius: .24rem .24rem 0 0;
  //border: 1px solid;
  background-color: var(--q-gb-bg-c-15);
  z-index: 1999;
  padding-bottom: .2rem;
}

.bet-scroll {
  max-height: 4rem;
  overflow-y: auto;
  &.h188{
    height: 1.8rem;
  }
}

.bet-key-board{
  position: relative;
  z-index: 999;
}
.scroll-down {
  position: absolute;
  left: 50%;
  top: -0.1rem;
  width: .2rem;
  height: .2rem;
  z-index: 99;
  transition: .3s;
  img {
    width: 100%;
    height: 100%;
  }
}

.bet-box-content {
  background: var(--q-gb-bg-c-15);
  border-top: none;
}

.bet-text {
  color: var(--q-gb-t-c-8);
}

.full-shadow {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 550;
  // backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.5);
}
.icon-mid{
  position: relative;
  transform: rotate(45deg);
}
.add-match {
  width: 100%;
  font-size: .16rem;
  color: var(--q-gb-t-c-1);
  background: var(--q-gb-bg-c-22);
  border-radius: 0.12rem;
  height: 0.44rem;
  margin-top: 0.1rem;
  padding: 0 .12rem;
  .icon-add:before {
    color: var(--q-gb-t-c-1);
  }
}
</style>
