<!--
 * @Author: Router
 * @Description: 普通赛事的投注弹框
-->
<template>
  <div class="bet-mix-box-child2">
    <!-- 多注顶部蒙层 -->
    <div v-if="true" class="full-shadow" @click.self="pack_up" @touchmove.prevent></div>
    <div class="full-shadow" @click.self="pack_up" @touchmove.prevent></div>
    <!-- 投注中的蒙层，所有不能点击 -->
    <div v-if="get_bet_status == 2" class="fixed full-shadow2" @touchmove.prevent></div>

    <div style="display: none;">{{ BetData.bet_data_class_version }} {{BetViewDataClass.bet_view_version}}</div>
   
   <div class="content-box">
        <!-- 头部 -->
        <bet-bar @click="pack_up"></bet-bar>
        <!-- 删除全部和选择type -->
        <bet-all-detele></bet-all-detele>
        <!-- 单关投注项列表  -->
        <bet-mix-box-child1></bet-mix-box-child1>
        <!-- 单关的输入框 -->
        <bet-input-info></bet-input-info>
        <!-- 键盘 -->
        <key-board></key-board>
        <!-- 按钮 -->
        <bet-btn></bet-btn>

   </div>
   
  </div>
</template>

<script setup>
import betBtn from './bet-btn.vue';
import keyBoard from './keyboard.vue';
import betInputInfo from "./bet_input_info.vue";
import betMixBoxChild1 from "./bet_mix_box_child1.vue";
import betAllDetele from "./bet_all_detele.vue";
import betBar from "./bet-bar.vue";
//import betInputInfo from "//bet_input_info";
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { UserCtr, i18n_t, compute_css_obj,useMittOn, useMittEmit, MITT_TYPES  } from "src/core/index.js";
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import { get_query_bet_amount_common } from "src/core/bet/class/bet-box-submit.js"
import lodash from 'lodash'
import { format_money3, format_money2 } from 'src/core/format/index.js'
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"

//串关的按钮
const is_strand = ref(true)
const scroll_box = ref()
const series_order_respList = ref([])
const award_total = ref()
const bet_list_data = ref([])
const tips_msg = ref('失效')  // 提示信息

let bet_show_single = ref(true)  // 单关显示
const get_bet_status = ref(0) // 投注状态
const btn_show = ref(0) // 投注状态2
const max_height1 = ref(150) // 投注赛事高度
const get_mix_bet_flag = ref(false) // 最小投注开关
const exist_code = ref(555)
const bet_amount = ref(0)

const hide_bet_series_but = () => {
  let res = false;
  // 单关时,获取投注列表数据
  if (!BetData.bet_is_mix && lodash.get(BetData, 'bet_list.length')) {
    // 遍历投注列表数据,检测是否红猫赛事
    for (let i = 0; i < BetData.bet_list.length; i++) {
      // 获取投注项id
      let id = lodash.get(BetData, `bet_list[${i}]`);
      // 获取投注项的数据源
      let cds = lodash.get(BetData, `bet_obj[${id}].bs.cds`);
      if (cds == "C01") {
        // C301赛事时,隐藏串关按钮
        res = true;
        break;
      }
    }
  }
  return res;
}

// 投注成功，最高可赢 滚动条需下拉到底
const update_scroll_top = () => {
  if (scroll_box.value) {
    scrollTop.value = scrollTop.value.scrollHeight
  }
}

const max_win_money_emit = (val) => {
  award_total.value = val
}


/**
    * 串关时检查是否有C01赛事
    */
const is_bet_check_rc = () => {
  let res = false;
  if (this.get_is_mix && this.get_bet_list.length > 1) {
    // 串关时
    for (let i = 0; i < this.get_bet_list.length; i++) {
      // 检测是否C01赛事
      if (_.get(this.get_bet_obj, `[${this.get_bet_list[i]}].cs.cds`) == "C01") {
        res = true;
        break;
      }
    }
  }
  return res;
}

// 单关 串关切换
const set_is_bet_single = () =>{
  BetData.set_is_bet_single()
  useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, false);
}
// 投注事件
const pack_up = (val) => {
  // TODO: 临时调试用
  useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, false);
  // BetData.set_clear_bet_info()
  // BetViewDataClass.set_clear_bet_view_config()
}

const submit_order = (type) => {
  submit_handle()
}

//切换是否接受更好赔率
const toggle_accept = () => {
  BetData.set_bet_is_accept()
}

//更好赔率规则
const change_accept = () => {
  BetData.set_accept_show(true)
}

//是否有重复的球员id或者球队id，有的话要禁止串关
const is_conflict = computed(() => {
  return false
})

// 是否展示不支持串关提示
const is_conflict2 = computed(() => {
  return true
  let flag =
    (get_cannot_mix_len.value || get_invalid_ids.value.length) &&
    BetData.bet_list.length > 1 &&
    ![900, 3000].includes(+get_menu_type)

  if (flag) {
    btn_show.value = 5
  } else if (get_bet_status.value == 1) {
    btn_show.value = 0
  }
  return flag
})

//计算样式，下面几种情况左下角按钮需要置灰不让点击
const calc_class = computed(() => {
  return true
  let flag = [2, 4].includes(+get_bet_status.value)
    || get_is_champion.value() && !BetData.is_bet_success_status
    || get_bet_status.value == 5 && BetData.bet_list.length == 1
    || get_menu_type == 3000 && lodash.get(single_item, 'hps[0].hl[0].hipo') != 1 && !BetData.is_bet_success_status
    || get_menu_type != 3000 && lodash.get(single_item, 'hps[0].hids') == 0 && !BetData.is_bet_success_status
    || btn_show.value == 5;
  return flag
})
// 投注金额赋值
const change_money_handle = (val) => {
  bet_amount.value = format_money2(val.money)
  // console.log("投注金额",bet_amount.value)
}
onMounted(() => {
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money)
  useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY, change_money_handle)
  let munu_type = true
  if (munu_type) {
    // get_query_bet_amount_common()
  }
})

const set_ref_data_bet_money = () => {
  // let markInfo = lodash.get(BetData, 'bet_single_list')
  console.error('bet_single_list', BetData.bet_single_list);
  bet_show_single.value = true
}

// 清空数据
const set_clear = () => {
  // 关闭弹窗 清空数据
  useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX)
  BetData.set_clear_bet_info()
  BetViewDataClass.set_clear_bet_view_config()
}

onUnmounted(() => {
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off
  useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY, change_money_handle).off
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
  color: var(--q-gb-t-c-14);
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
  .used-money {
    color: var(--q-gb-t-c-14);
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
  position: fixed;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 600;
  overflow: hidden;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  background-color: var(--q-gb-t-c-14);

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
  z-index: 550;
  backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.5);
}

.scroll-box {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  margin-bottom: -1px;
  //background-color: var(--q-gb-t-c-7);
  //padding: 12px;
  border-radius: 12px;
}
.scroll-box-center{
  margin: 0 0 0.1rem 0;
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
</style>
