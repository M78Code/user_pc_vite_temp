<!--
 * @Description: 列表赛事比分行
-->

<template>
  <div v-show="show_score_match_line(match)" class="score-section"
    :class="{ 'flex-star':[3].includes(+match.csid), standard:get_newer_standard_edition == 2, result:get_menu_type == 28 }">
    <div class="scroll-container-w" :class="{ 'left_scroll':show_left_triangle, 'right_scroll':show_right_triangle}" :ref="`match_score_scroll_w_${match.mid}`">
      <!-- 需求：棒球，斯诺克，拳击 不显示比分  -->
      <div class="score-se-inner" ref='scoreWrapScroller' v-if="![3,7,12].includes(+match.csid)"
        :class="{
          standard:get_newer_standard_edition == 2 && get_menu_type != 28,
          result:get_menu_type == 28,
          'is-foot-ball':match.csid == 1 || match.csid == 11,
          'is-basket-ball':match.csid == 2,
          'sport-puck-ball':match.csid == 4,
          'is-tennis':match.csid == 5,
          'badminton':match.csid == 10,
          'is-table-tennis':match.csid == 8,
          'is-volley-ball':match.csid == 9 || match.csid == 13}"
          @scroll="score_inner2_scrolling($event,match)">
        <div class="score-se-inner2" :ref="`score_se_inner2_${match.mid}`">
          <div class="row items-center score-fle-container-1" :class="{ result:get_menu_type == 28 && main_source !== 'detail_match_list', }">
            <template v-for="(score,i) of msc_converted">
              <div v-if="is_show_score(match,score)" class="score row items-start"
                :class="{ 'basket-ball':match.csid == 2, 'important-color-number':  i == msc_converted.length - 1 &&  match.csid == 2 && get_menu_type != 28}"
                :key="i" :data-scores="`${i}-${msc_converted.length}-${match.csid}`">
                <!--角球图标-->
                <img class="kk-icon" alt="" v-if="match.csid == 1 && score[0] == 'S5' && score[4]" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/m-list-jiaoqiu.svg`" />
                <!--HT(半场)或FT(全场)或OT-->
                <span class="f-ht-ot" style="margin-right:.02rem"
                  :score="`${match.csid}-${score[4]}`"
                  v-show="[1,11,14,15,16].includes(+match.csid) && score[4] && score[0] != 'S5'" >
                  {{score[4]}}
                </span>
                <!--比分-->
                <span class="score-value" :class="{
                  'jiaoqiu-score-value' : [1,11,14].includes(+match.csid) && score[0] == 'S5' && score[4],
                  'orange': ([1,11,14].includes(+match.csid) && score[4] && score[0] != 'S5') || ([3,4,5,6,7,8,9,10,12,13,15,16].includes(+match.csid) && msc_converted.length == i + 1 && match.mo != 1),
                  'last-color':i == msc_converted.length - 1,
                  }">
                  {{score[1]}}-{{score[2]}}
                </span>
              </div>
            </template>
          </div>

          <div class="row items-center basket-ball"
            :class="{'b-score-wrapper':match.csid != 14}"
            v-if="[2,6,8,9,10,13,14,15,16].includes(+match.csid)">
            <!--分差-->
            <div class="row" style="margin-right:.05rem"
              v-if="[2].includes(+match.csid) && score_sub_win_faild">
              <div style="margin-right:.03rem">
                {{ i18n_t('list.score-disparity')}}
              </div>
              <div class="important-color-number sub">
                {{score_sub_win_faild.score_sub?score_sub_win_faild.score_sub:0}}
              </div>
            </div>
            <!--总分-->
            <div class="row" v-if="[2,6].includes(+match.csid)">
              <div style="margin-right:.03rem">
                {{ i18n_t('list.total_pp_score_count')}}
              </div>
              <div class="important-color-number total">
                <span>
                  {{get_total_scores.total}}
                </span>
              </div>
            </div>

            <div class="score last" v-if='![1,2,3,11].includes(+match.csid)'>
              <!-- 总局数 -->
              <span v-if="![4,5,6,8,9,10,13,14,15,16].includes(+match.csid)">
                {{ i18n_t('list.total_play_count')}}
              </span>
              <!-- 总分   5--网球， 5--美式足球， 7--斯诺克， 8--乒乓球， 9--排球， 10--羽毛球，-->
              <span class="score-l-total2" v-if="[8,9,10,13,15,16].includes(+match.csid) && get_total_scores">
                {{ i18n_t('list.total_pp_score_count')}}
              </span>
              <span v-if="[8,9,10,13,14,15,16].includes(+match.csid) && get_total_scores" class="score-important">
                {{get_total_scores}}
              </span>
            </div>

          </div>

        </div>
      </div>

      <!--滚动条遮罩层-->
      <!--<div class="scroll-cover-f" :class="{simple:get_newer_standard_edition == 1}">-->
      <!--</div>-->

    </div>
    <div class="score-scroll-fixed" :class="{'is-baseball':[3].includes(+match.csid)}"
      v-if="[3,8,9,10,13].includes(+match.csid)" :ref="`score_scroll_fixed_${match.mid}`">

      <div class="score-important2" v-if="![1,2,3,7,8,9,10,11,12,13].includes(+match.csid)">
        {{last_list_score}}
      </div>
      <div class="score last score-important" v-if="![1,2,3,4,6,7,8,9,10,13,11,12].includes(+match.csid)">
        {{all_s1 || $filters.score_format(all_s1)}}
      </div>
    </div>
  </div>
</template>
 
<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import store from "src/store-redux/index.js";
import lodash from 'lodash'
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import { MenuData, score_switch_handle, score_format } from "src/output/index.js"

const props = defineProps({
  match: Object,
  main_source: String,
})

const scoreWrapScroller = ref(null)
// const store_state = store.getState()
const timer_1 = ref(null)   
const timer_2 = ref(null)   
//斯诺克比分编号为S1的结果
const snoocker_s1 = ref(null)   
//当前最新的盘/局比分
const last_list_score = ref('')   
//比分转换为数组的数据
const msc_converted = ref([])     
const show_left_triangle = ref(false)
const show_right_triangle = ref(false)
const get_menu_type = ref(MenuData.get_menu_type())

const get_newer_standard_edition = ref(store_state.get_newer_standard_edition)

// const unsubscribe = store.subscribe(() => {
//   const new_state = store.getState()
//   get_newer_standard_edition.value = new_state.get_newer_standard_edition
// })


onMounted(() => {
  get_last_list_score();
  //获取最新比分延迟时钟对象
  timer_1.value = setTimeout(() => {
    get_last_list_score();
  }, 100);

  //比分区域div布局延迟，以使其刚打开页面就能左右滚动
  timer_2.value = setTimeout(() => {
    score_layout_init();
  },300);
})

watch(() => props.match.msc, () => {
  get_msc_converted();
})

// 监听赛事比分变化
watch(() => props.match.ms, () => {
  get_last_list_score()
})

// 监听赛事阶段变化
watch(() => props.match.mmp, () => {
  get_msc_converted();
  get_last_list_score();
})

// 总比分（大比分s1）斯洛克列表页的大比分不在这里计算
const all_s1 = computed(() => {
  if(props.match.msc && props.match.msc.toString().includes('S1|')){
    return '['+props.match.msc[0].split('S1|')[1]+']'
  }else{
    return '[0:0]'
  }
})

// 胜者与输者分数差
const score_sub_win_faild = computed(() => {
  let r = 0;
  let scores = get_total_scores;
  if(scores){
    if(typeof scores.score_sub != 'undefined'){
      r = scores.score_sub;
    }
    else{
      r = scores;
    }
  }
  return r;
})


// 所有盘/局加起来的总比分
const get_total_scores = computed(() => {
  let msc_format = get_msc_converted();
  //4冰球 8乒乓球 9排球 10羽毛球 13 16不统计S1
  let csid = Number(props.match.csid);
  let {home,away} = get_match_total_score();
  if (msc_format && msc_format.length) {
    let t = home + away;
    let total_sum = t ? `[${t}]` : '';
    // 斯诺克
    if (props.match.csid == 7 || props.match.csid ==12) {
      return get_snooker_score_space_data();
    }
    //2篮球;4冰球;5网球;6美足;
    if([2,4,5,6].includes(csid)){
      return {
        total:t,
        score_sub:Math.abs(home - away),
      };
    }
    //
    if([14,15].includes(csid)){
      if(props.match.msc && props.match.msc.length){
        let flag = 'S1|'
        let found = props.match.msc.filter(score => score.indexOf(flag) > -1)[0];
        if(found){
          let score_str = found.split(flag)[1];
          home = score_str.split(':')[0];
          away = score_str.split(':')[1];

          t = Number(home) + Number(away);
          total_sum = t ? `[${t}]` : '';
        }
      }
      else{
        home = 0;
        away = 0;
        total_sum = 0;
      }
    }

    let result = '';
    if(!home && !away && !total_sum){
      result = '';
    }
    else{
      result = `${home}-${away}${total_sum}`;
    }
    if([14].includes(csid)){
      result = `${total_sum}`;
    }
    return result;
  }
  return "";
})

/**
 * 判断单个比分是否显示
 */
const is_show_score = (match,score) =>{
  let f = false;
  // 红猫赛事屏蔽角球总比分S5,黄牌比分S12,红牌比分S11,点球比分S10
  if(match.cds=='RC' && match.csid == 1 && ['S5','S10','S11','S12'].includes(lodash.get(score,'[0]'))){
    return f;
  }
  if(score[1] && score[2] && score[1] != '-' && score[2] != '-'){
    if([1,11,14,15,16].includes(+match.csid)){
      f = true;
    }
    if((match.csid != 1 || match.csid != 11) && score[0] !== 'S1'){
      f = true;
    }
  }
  return f;
}
/**
 * @description: 获取最新比分赋值给last_list_score
 * @param {Undefined} Undefined
 * @return {Undefined} Undefined
 */
const get_last_list_score = () => {
  const msc_converted = get_msc_converted();
  let i = msc_converted.length - 1;
  let h = 0,a = 0;
  try {
    h = msc_converted[i][1] * 1;
    a = msc_converted[i][2] * 1;
  } catch (e) {console.error(e);}
  if (!isNaN(h) && !isNaN(a)) {
    last_list_score.value = `${h}-${a}`;
  }
}
/**
 * @description: 比分区域是否显示
 * @param {Object} match 赛事对象
 * @return {Boolean} 比分区域是否显示
 */
const show_score_match_line = (match) => {
  // 网斯乒羽(5,7,8,10)  棒冰美排(3、4、6、9)
  let csid = +match.csid;
  let result = false;
  result = match.ms == 1 && [1,2,3,4,5,7,8,9,10,11,12,13,14,15,16].includes(csid);
  // if(get_menu_type.value == 28){
  //   result = true;
  // }
  return result;
}
/**
 * @description: 比分容器横向滚动
 * @param {Object} $event 事件对象
 * @return {Undefined} Undefined
 */
const score_inner2_scrolling = ($event) => {
  show_left_triangle.value = $event.target.scrollLeft;
  let remaining = $event.target.scrollWidth - $event.target.scrollLeft;
  let client_width = $event.target.clientWidth;

  show_right_triangle.value = Math.floor(remaining) > Math.floor(client_width);
}
/**
 * @description: 比分容器横向滚动
 * @param {Undefined} Undefined
 * @return {Undefined} Undefined
 */
const score_layout_init = () => {
  if(scoreWrapScroller.value){
    // 根据dom 判断 初始值是否应该显示三角
    show_right_triangle.value = scoreWrapScroller.value.scrollWidth>scoreWrapScroller.value.clientWidth;
  }
}
/**
 * @description: 比分转换
 * @param {Undefined} Undefined
 * @return {Undefined} Undefined
 */
const get_msc_converted = () => {
  let msc = props.match.msc;
  let r0 = [];
  if(msc && msc.length){
    let f = score_switch_handle(props.match);
    if (props.match.csid == 7 || props.match.csid ==12) {
      if (f.msc_list && f.msc_list.length) {
        r0 = f.msc_list;
      }
      if (f.s1_score) {
        snoocker_s1.value = f.s1_score;
      }
    }
    else{
      if (f && f.length) {
        r0 = f;
      }
    }
    msc_converted.value = r0;
  }

  if(!msc_converted.value || !msc_converted.value.length){
    msc_converted.value = [[0,0,0]];
  }
  if(!r0 || !r0.length){
    r0 = [[0,0,0]];
  }

  if(!msc_converted.value || !msc_converted.value.length){
    show_right_triangle.value = false;
  }
  return r0;
}
/**
 * 获取赛事总比分
 */
const get_match_total_score = () => {
  let result = {};
  let msc_format = get_msc_converted();
  //4冰球 8乒乓球 9排球 10羽毛球 13 16不统计S1
  let csid = Number(props.match.csid);
  if (msc_format && msc_format.length) {
    let m = 0,a = 0;
    msc_format.forEach(score => {
      if([4,8,9,10,13,16].includes(csid)){
        if(score[0] != 'S1'){
          m += isNaN(score[1] * 1) ? 0 : score[1] * 1;
          a += isNaN(score[2] * 1) ? 0 : score[2] * 1;
        }
      }
      else{
        m += isNaN(score[1] * 1) ? 0 : score[1] * 1;
        a += isNaN(score[2] * 1) ? 0 : score[2] * 1;
      }
    });
    result = {home:m,away:a};
  }
  return result;
}
/**
 * 获取斯诺克总比分栏显示的数据
 */
const get_snooker_score_space_data = () => {
  let result = '';
  if (snoocker_s1.value) {
    result = `${snoocker_s1.value[1]}-${snoocker_s1.value[2]}[${+snoocker_s1.value[1] + +snoocker_s1.value[2]}]`;
  }
  else{
    let f = score_switch_handle(props.match);
    if (f.s1_score) {
      snoocker_s1.value = f.s1_score;
    } else {
      result = snoocker_s1.value = [0, 0, 0];
    }
    result = `${snoocker_s1.value[1]}-${snoocker_s1.value[2]}[${+snoocker_s1.value[1] + +snoocker_s1.value[2]}]`;
  }
  return result;
}

onUnmounted(() => {
  // unsubscribe()
  clearTimeout(timer_1.value);
  timer_1.value = null;

  clearTimeout(timer_2.value);
  timer_2.value = null;
})
</script>
 
<style scoped lang="scss">
 @import "../styles/score-list.scss";
</style>