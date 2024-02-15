<!--
 * @Description: 赛事进行中每秒变化的计时器
-->
<template>
  <div
      class="counting-down-wrap"
      :class="{'counting-down-wrap-no-timer': (!show_time_counting() || counting_time === '00:00') && !home}"
      :style="{width: counting_wrapper_width === 'auto' ? 'auto' : counting_wrapper_width + 'rem'}"
  >
    <!--棒球单独处理-->
    <span class="title-space-1" ref="title-space" v-show="title">
      {{title}}
    </span>
    <span v-if="show_time_counting()" ref="counting" class="counting" v-html="counting_time_ctr_show_format_ouzhou(match,counting_time)"></span>
    <span ref="special-match" class="special" :class="{'mar-l5': u_like}" :data-d="`${match.csid}-${match.mmp}`"
      v-show="[2,4,6,15,16].includes(+match.csid) && [301,302,303].includes(+match.mmp)"><!--csid:16水球-->
      {{match.mlet}}
    </span>
  </div>
</template>
 
<script setup>
import { useRoute } from 'vue-router'
import lodash from 'lodash'
import { ref, computed, watch, nextTick, onActivated, onMounted, onUnmounted, onDeactivated } from "vue"
import { i18n_t, match_vr_step } from 'src/output/index.js'
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { counting_time_ctr_show_format, counting_time_ctr_show_format_ouzhou } from 'src/core/format/common/index.js'
const props = defineProps({
  m_id:String|Number, // 赛事id
  is_add:Boolean,     // 是否为累加计时器
  title:String,       // mmp映射赛事阶段名，国际化语言
  match:Object,       // 赛事数据对象
  mmp: String | Number,   // 赛事阶段
  second: String | Number, // 赛事进行时间
  u_like: Boolean,   // 是否为猜你喜欢卡片定时器
  home: Boolean,     // 是否为首页banner定时器
})

const route = useRoute()
const emits = defineEmits(['counting-wrapper-width'])

const step = ref(1) // 计时器步长
const reduce_second = ref(0)  // 计时器开始计时时间
const is_destroyed = ref(false)     // 本组件是否已销毁
const counting_time = ref('00:00')  // 计时器显示的时间
const goon = ref(true)              // 计时器是否暂停或继续
const counting_wrapper_width = ref(.8)  // 定时器容器宽度
const counting_time_out = ref(null)

// TODO: 代替换
const get_lang = ref('zh')
const hotReqTime = ref(0)

// ...mapGetters(['hotReqTime', 'get_lang']),

onMounted(() => {
  // 初始化修正设置步长
  step.value = match_vr_step(props.match,step.value);
  // 红猫赛事使用mstrc字段数据
  let mstrc = lodash.get(props.match,'mstrc');
  if(lodash.get(props.match,'cds')=='1500' && mstrc){
    props.match.mst = mstrc;
  }
  // 计时器setTimeout对象，可用于clearTimeout
  reduce_second.value = props.match.mst * 1
  counting_frame();
  nextTick(() => {
    counting_down_wrap_width(props.title, counting_time.value)
  })
})
const show_time_counting = () => {
  // console.error('show_time_counting')
  let csid = Number(props.match.csid);
  let mmp = Number(props.match.mmp);
  // 网羽乒斯棒球(3)排球(9)不显示倒计时,只显示状态标题
  if([5, 10, 8, 7, 3, 9, 13].includes(csid)){
    return false;
  }
  // 足球
  else if(csid === 1){
    return ![0,30,31,32,33,34,50,61,80,90,100,110,120,301,302,303,445].includes(mmp);
  }
  // 冰球
  else if(csid == 4){
    // return false;  //临时屏蔽冰球倒计时
    if(!props.match.mlet){
      return false;
    }
    // 第一局 第二局 第三局 加时赛 点球大战
    let mmps = [1,2,3,40,50];
    return mmps.includes(mmp);
  }
  // 美式足球
  else if(csid == 6){
    if(!props.match.mlet){
      return false;
    }
    if(mmp === 40){  // 2843 【SIT】【H5】列表页，美足加时赛阶段，期望优化时间展示
      if(counting_time.value === '00:00'){
        return false
      }
    }
    // 第一节 第二节 第三节 第四节 加时赛
    let mmps = [13, 14, 15, 16, 40];
    return mmps.includes(mmp);
  }
  // dota
  else if([100,101,102,103].includes(+csid)){
    if(mmp > -1){
      return true;
    }
  }
  else
  {
    return ![0,30,31,32,33,34,50,61,80,90,100,110,120,301,302,303,445].includes(mmp);
  }
}
// 赛事阶段title变化时， 更新定时器容器宽度
watch(() => props.title, (curr_tittle, prev_tittle) => {
  if (prev_tittle) {
    counting_down_wrap_width(props.title, counting_time.value)
  }
})
// 赛事时间超过100分钟时， 更新定时器容器宽度
watch(() => counting_time, (counting_time) => {
  if (counting_time.length > 5) {
    counting_down_wrap_width(props.title, counting_time.value)
  }
})
// 时间显示状态变化时， 更新定时器容器宽度
// watch(() => show_time_counting(), () => {
//   counting_down_wrap_width(props.title, counting_time.value)
// })
/**
 * @description: 倒计时总时间变化执行计时
 * @param {Undefined} Undefined
 * @return {Undefined} Undefined
 */
watch(() => props.match.mst, () => {
  reduce_second.value = props.match.mst * 1;
  counting_frame();
})
 /**
 * @description: 赛事阶段变化执行计时
 * @param {Number} mmp 赛事阶段
 * @return {Undefined} Undefined
*/
 watch(() => props.match.mmp, (mmp) => {
  if(mmp == 6 && !(props.match.mst * 1)){
    reduce_second.value = props.match.mst * 1;
    counting_frame();
  }
})
/**
 * @description: 篮球冰球开始(1)或暂停(0)
 * @param {Number} curr 1:；0:暂停
 * @return {Undefined} Undefined
 */
 watch(() => props.match.mess, (curr) => {
  // csid 2-篮球, 4-冰球, 100-LOL, 101-dota2, 102 csgo
  if([2,4,100,101,102,103].includes(+props.match.csid)){
    if(curr == 1){
      counting_frame();
    }
  }
})
// 动态设置定时器容器宽度
const counting_down_wrap_width = (title = '', counting_time = '') => {
  // 当前语言
  const lang = get_lang.value
  // 当前赛事阶段名称
  const title_length = lodash.get(title, 'length')
  // 当前赛事时间
  const time_length = counting_time.length
  // 特殊赛事是否显示时间，如水球
  const special_match_time_show = [2,4,6,15,16].includes(+props.match.csid) && [301,302,303].includes(+props.match.mmp)

  // 中文、繁体定时器容器宽度适配
  if (['zh', 'tw', 'hk'].includes(lang)) {
    // 猜你喜欢
    if (props.u_like && title_length === 3) {
      counting_wrapper_width.value = show_time_counting() ? (0.39 + 0.05 + 0.3) : 'auto'
    }
    // 上半场 xx:xx
    else if (title_length === 3 && time_length === 5) {
      // 水球等赛事，宽度适配
      const time_width = counting_time.value && isNaN(counting_time.value.charAt(0)) ? 0.55 : 0.3
      counting_wrapper_width.value = show_time_counting() ? (0.39 + 0.05 + time_width) : special_match_time_show ? (0.39 + 0.05 + 0.3) : (0.39 + 0.05)
    }
    // 下半场 xxx:xx
    else if (title_length === 3 && time_length === 6) {
      counting_wrapper_width.value = .39 + 0.05 + 0.36
    }
      // 中场休息
    else if (title_length === 4) {
      counting_wrapper_width.value = 0.5 + 0.05
      if(props.match.csid == 4){
        counting_wrapper_width.value = 'auto'
      }
    }
    // 加时上半场 xxx:xx
    else if (title_length === 5 && time_length === 6) {
      counting_wrapper_width.value = 0.63 + 0.05 + 0.36
    }
    // 其他
    else if (title_length === 3 && !show_time_counting()) {
      counting_wrapper_width.value = 0.39 + 0.05
    }
    // 测试假数据情况，如xxxxx:xx这样的时间
    else {
      counting_wrapper_width.value = 0.39 + 0.05 + 0.06 * (time_length || 5)
    }
  }
  // 英文、越南文
  else {
    // 猜你喜欢
    if (props.u_like) {
      counting_wrapper_width.value = show_time_counting() ? 0.54 : 'auto'
    }
    // 其他
    else {
      const {mfo, mmp} = props.match

      counting_wrapper_width.value =
          (
          mfo ||
          mmp == 0 ||
          !show_time_counting() ||
          MenuData.get_menu_type() === 3000 && counting_time.value == '00:00'
          )
          ? 'auto' : ((title_length > 2 ? 0.35 : 0.19) + 0.05 + 0.06 * (time_length || 5))
    }
  }

  emits('counting-wrapper-width', counting_wrapper_width.value)
}
/**
 * @description: 参考iphone6,7,8窗口宽度(375)模拟rem
 * @param {Number} value 需要转换的值
 * @return {Number}
 */
const rem = (value) => {
  let font_size = innerWidth * 100 / 375;
  return Math.ceil(value * font_size);
}
/**
 * @description: 计时器显示实时时间
 * @param {Undefined} Undefined
 * @return {Undefined} Undefined
 */
const counting_frame = () => {
  // 红猫赛事使用mstrc字段数据
  let mstrc = lodash.get(props.match,'mstrc');
  if(lodash.get(props.match,'cds')=='1500' && mstrc){
    props.match.mst = mstrc;
  }
  // 首页轮播左右滑动保持时间同步
  if (route.name === 'home' && hotReqTime.value && props.match.mst !== '0') {
    let runningSeconds = Math.floor((Date.now() - hotReqTime.value) / 1000)
    reduce_second.value = props.match.mst * 1 + (props.is_add ? runningSeconds : -runningSeconds)
  }

  // 获取当前计时时间
  get_counting_time();
  let {mess, csid, mmp, ms} = props.match

  if (
      // 暂停 mess:0
      mess === 0 ||
      // 足球 csid:1 同时赛事为等待加时
      (+csid === 1 && +mmp === 32) ||
      // 0：赛事为未开赛则暂停 或 局间休息暂停
      [0, 301, 302, 303, 304, 305, 306].includes(+mmp) ||
      // 全局暂停|中断
      [2, 10].includes(ms)
  ) {
    goon.value = false;
  } else if (mess === 1) {
    goon.value = true;
  }

  // 不满足暂停条件则递归执行计时器
  if(goon.value){
    clearTimeout(counting_time_out.value);
    counting_time_out.value = setTimeout(() => {
      if(props.is_add){
        reduce_second.value+=step.value;
        // 是足球时 计算特n , 可视区域数据不多,请求3个mid和1一个mid没有区别 因此直接调用页脚刷新
        if(props.match.csid == 1){
          // 15分钟玩法 调用
          set_min15(reduce_second.value,(mmp_15_min)=>{
            useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
              text: "mid-refresh", // 只更新对应的mid
              mid:props.match.mid
            });
          });
          // 5分钟玩法 调用
          set_min5(reduce_second.value,(mmp_5_min)=>{
            useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
              text: "mid-refresh", // 只更新对应的mid
              mid:props.match.mid
            });
          });
        }
      }
      else
      {
        reduce_second.value--;
      }
      counting_frame();
    },1000);
  }
}
  /**
 * @Description 设置十五分钟玩法阶段
 * @param {Object} match 赛事信息
 */
const set_min15 = (mst,callback) => {
  // 如果未开赛 或者 没有15分钟玩法
  if (!props.match.cos15Minutes) {
    return
  }
  // 自定义赛事阶段
  let mmp_15_min
  // mst赛事开始时间
  // mst 小于900 特1 小于1800 特二 小于2700 特三 小于3600 特4 小于4500 特5 否则是特6
  if (mst < 900) {
    mmp_15_min = 1
  }
  else if (mst < 1800) {
    mmp_15_min = 2
  }
  else if (mst < 2700 || [6,41].includes(Number(props.match.mmp))) {    // 中场加时判断
    mmp_15_min = 3
  }
  else if (mst < 3600) {
    mmp_15_min = 4
  }
  else if (mst < 4500) {
    mmp_15_min = 5
  }
  else {
    mmp_15_min = 6
  }
  // 如果默认阶段和接口数据返回的mmp_15_min不一致 重新调用接口获取
  if (props.match.mmp_15_min && mmp_15_min !== props.match.mmp_15_min && callback) {
    callback(mmp_15_min);
  }
  props.match.mmp_15_min = mmp_15_min
}
/**
 * @Description 设置五分钟玩法阶段
 * @param {Object} match 赛事信息
 */
const set_min5 = (mst,callback) => {
  // 如果未开赛 或者 没有15分钟玩法
  if (!props.match.cos5Minutes) {
    return
  }
  // 自定义赛事阶段
  let mmp_5_min
  // mst赛事开始时间
  // mst 小于900 特1 小于1800 特二 小于2700 特三 小于3600 特4 小于4500 特5 否则是特6
  if (mst < 300) {
    mmp_5_min = 1
  }
  else if (mst < 600) {
    mmp_5_min = 2
  }
  else if (mst < 900 || [6,41].includes(Number(props.match.mmp))) {    // 中场加时判断
    mmp_5_min = 3
  }
  else if (mst < 1200) {
    mmp_5_min = 4
  }
  else if (mst < 1500) {
    mmp_5_min = 5
  }
  else if (mst < 1800) {
    mmp_5_min = 6
  }
  else if (mst < 2100) {
    mmp_5_min = 7
  }
  else if (mst < 2400) {
    mmp_5_min = 8
  }
  else if (mst < 2700) {
    mmp_5_min = 9
  }
  else if (mst < 3000) {
    mmp_5_min = 10
  }
  else if (mst < 3300) {
    mmp_5_min = 11
  }
  else if (mst < 3600) {
    mmp_5_min = 12
  }
  else if (mst < 3900) {
    mmp_5_min = 13
  }
  else if (mst < 4200) {
    mmp_5_min = 14
  }
  else if (mst < 4500) {
    mmp_5_min = 15
  }
  else {
    mmp_5_min = 16
  }
  // 如果默认阶段和接口数据返回的mmp_15_min不一致 重新调用接口获取
  if (props.match.mmp_5_min && mmp_5_min !== props.match.mmp_5_min && callback) {
    callback(mmp_5_min);
  }
  props.match.mmp_5_min = mmp_5_min
}
/**
 * @description: 获取计时器时间
 * @param {Undefined} Undefined
 * @return {Undefined} Undefined
 */
const get_counting_time = () => {
  if(typeof reduce_second.value !== 'number' || props.match.mmp == 0) {
    counting_time.value = '00:00';
    return void(0);
  }
  let second_count = parseInt(reduce_second.value);
  let minutes,second;
  minutes = Math.floor(second_count / 60) + '';
  let minutes_to_second = minutes * 60;
  second = String(second_count - minutes_to_second);
  //水球
  if(props.match.csid == 16){
    let water_p_countingdown = i18n_t('list.water_polo_countdown');
    let f_minutes = Math.ceil(second_count / 60);
    f_minutes = f_minutes > 0 ? f_minutes : 1
    counting_time.value = water_p_countingdown.replace('S%',f_minutes);
    counting_time.value =
    counting_time.value.replace('<',
    "<span style='font-family:-apple-system,Helvetica Neue,Helvetica,Arial,sans-serif'><</span>");
  }
  else{
    counting_time.value = `${minutes.padStart(2,'0')}:${second.padStart(2,'0')}`;
  }
  // 防止时间出现负数
  if(counting_time.value.startsWith('-')){
    // 去除负号
    counting_time.value = counting_time.value.slice(1)
    // 不足两位，加'0'处理
    counting_time.value = (counting_time.value.charAt(1) === ':' ? '0' : '') + counting_time.value
  }
}
onActivated(() => {
  counting_down_wrap_width(props.title, counting_time.value)
})
onDeactivated(() => {
  is_destroyed.value = true;
  goon.value = false;
  clearTimeout(counting_time_out.value)
  counting_time_out.value = null
})
onUnmounted(() => {
  is_destroyed.value = true;
  goon.value = false;
  clearTimeout(counting_time_out.value)
  counting_time_out.value = null
})
</script>
 
<style scoped lang="scss">
 .counting-down-wrap {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  color: var(--q-color-fs-color-30);
  font-size: 0.12rem;
  overflow: hidden;

  &.counting-down-wrap-no-timer {
    position: unset;
  }

  .title-space-1 {
    padding-right: 0.03rem;
    margin-right: 0.02rem;
    font-size: 0.12rem;
    color: var(--q-gb-t-c-19);
  }

  .counting, .special {
    color: var(--q-gb-t-c-19);
    //color: #5A6074;
    font-size: 0.12rem;
    font-weight: 500;
    // margin-top: .02rem;
  }

  .mar-l5 {
    margin-left: 0.05rem;
  }
}
</style>