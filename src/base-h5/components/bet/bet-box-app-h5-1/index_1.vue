<template>
  <div v-show="false"> {{ UserCtr.user_version }} -- {{ BetData.bet_data_class_version }}-{{ BetViewDataClass.bet_view_version}}-{{ BetData.bet_box_h5_show }}</div>
  <div v-if="BetData.bet_box_h5_show && (BetData.bet_single_list.length || BetData.bet_s_list.length)">
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
        <div class="bet-scroll" ref="bet_scroll" @scroll="handle_bet_scroll"
        :class="!BetData.is_bet_single && BetData.bet_keyboard_show && BetViewDataClass.bet_order_status == 1  ?'h344':''">
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
                  <div>
                    <betSpecialInput :items="item" @input_click="handle_input_click" :index="index" :key="index+'_'+item.id"/>
                  </div>
                </template>
              </template>

              <div class="add-match fw-c-c cursor h44 pl-30" @click="set_show_single()">
                <span class="fon12 font500 f-e-c">
                  <span class="re icon-mid mx-6">
                    <i class="icon-del1 icon-add" />
                  </span> 
                  添加赛事  
              </span>
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
                <betSpecialResult :items="item" :key="index" :index="index" />
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
            <div class="scroll-down" v-show="show_img" @click="scrollTo">
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
import { watch, ref,nextTick } from "vue";
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
  let box_show = !BetData.bet_box_h5_show;
  BetData.set_bet_box_h5_show(box_show);
  // 单关 隐藏投注 需要清空数据 复刻版需要
  if(BetData.is_bet_single){
    BetData.set_clear_bet_info()
    BetViewDataClass.set_clear_bet_view_config()
  }
};

// 关闭弹窗
const set_show_single = () => {
  BetData.set_bet_box_h5_show(false)
};
//如果隐藏了滚动到底部  再重新展开的话 滚动条会在头部 得重新计算是否显示
watch(BetData.bet_data_class_version,()=>{
  if(BetData.bet_box_h5_show){
    handle_bet_scroll({target:bet_scroll.value})
  }
})
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
const bet_scroll=ref(null)
function handle_input_click(e){
  setTimeout(() => {
   const _h=bet_scroll.value.offsetHeight
   const diff=e.target.offsetParent.offsetTop - _h + e.target.offsetParent.offsetHeight;
   if(diff>0&&bet_scroll.value.scrollTop<diff){
      bet_scroll.value.scrollTo({
        top: diff,
        behavior: "smooth",
      })
      handle_bet_scroll({target:bet_scroll.value})
    }
  },50);
}
let show_img = ref(true);
/**
 * 滚动到一定高度就隐藏
*/
const handle_bet_scroll=lodash.debounce((e)=>{
  if(!e.target)return
  const {offsetHeight,scrollHeight,scrollTop}=e.target;
  if(scrollTop<(scrollHeight-offsetHeight)*0.5){
    show_img.value=true;
  }else{
    show_img.value=false;
  }
},100)
// 滑动到底部滚动区域的底部
const scrollTo = () => {
  nextTick(() => {
    bet_scroll.value.scrollTo({
      top: 999,
      behavior: "smooth",
    })
    show_img.value = false
  })
}
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
  background-color: var(--q-gb-bg-c-23);
  z-index: 1999;
  padding-bottom: .3rem;
}

:deep(.bet-scroll) {
  max-height: 4rem;
  }
.bet-scroll {
  max-height: 4rem;
  overflow-y: auto;
  &.h344{
    min-height: 1.8rem;
    max-height: 3.44rem;
  }
  .bet_single_info:nth-last-child(2) {
    border-radius: .12rem .12rem 0 0;
  }
}

.bet-key-board{
  position: relative;
  z-index: 999;
}
.scroll-down {
  position: absolute;
  left: 50%;
  top: -0.17rem;
  width: .2rem;
  height: .2rem;
  z-index: 1000;
  transition: .3s;
  animation: up-and-down 2.5s ease-in-out infinite;
  img {
    width: 100%;
    height: 100%;
  }
}
@keyframes up-and-down {
  from {
    top: -.17rem;
  }
  50% {
    top: -.14rem;
  }
  to {
    top: -.17rem;
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
