<!--
 * @Description: 列表赛事比分行-复刻版 新手版支持
-->

<template>
     <!--  standard: get_newer_standard_edition == 2,  -->
    <div v-show="show_score_match_line(match)" class="score-section"

      :class="{ 
        'flex-star': [3].includes(+match.csid), 
        result: get_menu_type == 28 
      }">
      <div class="scroll-container-w" :class="{'bq-ball': match.csid == 3, }"
        :ref="`match_score_scroll_w_${match.mid}`">
        <!-- 需求：棒球3，斯诺克7，拳击12 不显示比分  get_newer_standard_edition == 2 && -->
        <div class="score-se-inner" ref='scoreWrapScroller' v-if="![3].includes(+match.csid)" :class="{
          standard: get_menu_type != 28,
          result: get_menu_type == 28,
          'is-foot-ball': match.csid == 1 || match.csid == 11,
          'is-basket-ball': match.csid == 2,
          'sport-puck-ball': match.csid == 4,
          'is-tennis': match.csid == 5,
          'badminton': match.csid == 10,
          'is-table-tennis': match.csid == 8,
          'is-volley-ball': match.csid == 9 || match.csid == 13
        }" @scroll="score_inner2_scrolling($event, match)">
          <div class="score-se-inner2" style="display: flex;" :ref="`score_se_inner2_${match.mid}`">
            <div class="row items-center whitespace-nowrap" :class="{ 'b-score-wrapper': match.csid != 14 }" v-if="[2, 5, 6, 7, 8, 9, 10, 13, 14, 15, 16].includes(+match.csid)">
              <!--分差-->
              <div class="row color18" style="margin-right:.2rem" v-if="[2].includes(+match.csid) && get_total_scores">
                <div style="margin-right:.03rem">
                  {{ i18n_t('list.score-disparity') }}
                </div>
                <div class="important-color-number sub">
                  {{ get_total_scores.score_sub ? get_total_scores.score_sub : 0 }}
                </div>
              </div>
              <!--总分-->
              <div class="row color18" v-if="[2, 6].includes(+match.csid)">
                <div style="margin-right:.03rem">
                  {{ i18n_t('list.total_pp_score_count') }}
                </div>
                <div class="important-color-number total">
                  <span>
                    {{ get_total_scores.total }}
                  </span>
                </div>
              </div>
              <!-- 赛事回合数mfo -->
              <div v-if="match.mfo" class="mfo-title" :class="{ 'is-ms1': match.ms == 1 }">
                {{ match.mfo }}
              </div>
              <div class="score last" v-if='![1, 2, 3, 11].includes(+match.csid)'>
                <!-- 总局数 -->
                <span v-if="![4, 6, 7, 8, 9, 10, 13, 14, 15, 16].includes(+match.csid)">
                  <span class="total-play-count" > {{ i18n_t('list.total_play_count') }} </span> 
                  <span class="total-games"> {{ total_games }} </span>
                </span>
                
                <!-- 总分   5--网球， 5--美式足球， 7--斯诺克， 8--乒乓球， 9--排球， 10--羽毛球，-->
                <span class="total-play-count" v-if="[7, 8, 9, 10, 13, 15, 16].includes(+match.csid) && get_total_scores">
                  {{ i18n_t('list.total_pp_score_count') }}
                </span>
                <span v-if="[7, 8, 9, 10, 13, 14, 15, 16].includes(+match.csid) && get_total_scores" class="score-important">
                  <!-- {{ get_total_scores }} --> {{ total_games }}
                </span>
              </div>
  
            </div>
            <!-- 比分 -->
            <div class="row items-center score-fle-container-1"
              :class="{ result: get_menu_type == 28 && main_source !== 'detail_match_list', }">
              <template v-for="(score, i) of msc_converted">
                <div v-if="is_show_score(match, score)" class="score row items-start"
                  :class="{
                    //  'basket-ball': match.csid == 2, 
                    'important-color-number': i == msc_converted.length - 1 && match.csid == 2 && get_menu_type != 28
                  }"
                  :key="i" :data-scores="`${i}-${msc_converted.length}-${match.csid}`">
                  <!--角球图标-->
                  <img class="kk-icon" alt="" v-if="match.csid == 1 && score[0] == 'S5' && score[4]"
                    :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/m-list-jiaoqiu.svg`" />
                  <!--HT(半场)或FT(全场)或OT-->
                  <span class="f-ht-ot" style="margin-right:.02rem" :score="`${match.csid}-${score[4]}`"
                    v-show="[1, 11, 14, 15, 16].includes(+match.csid) && score[4] && score[0] != 'S5'">
                    {{ score[4] }}
                  </span>
                  <!--比分-->
                  <span class="score-value" :class="{
                    'jiaoqiu-score-value': [1, 11, 14].includes(+match.csid) && score[0] == 'S5' && score[4],
                    'orange': ([1, 11, 14].includes(+match.csid) && score[4] && score[0] != 'S5') || ([3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 16].includes(+match.csid) && msc_converted.length == i + 1 && match.mo != 1),
                    'last-color': i == msc_converted.length - 1,
                  }">
                    {{ score[1] }}-{{ score[2] }}
                  </span>
                    <!-- <div class="divider"></div> -->
                </div>
              </template>
            </div>
            <!-- <div class="row items-center basket-ball" :class="{ 'b-score-wrapper': match.csid != 14 }" -->
            
          </div>
        </div>
        <!--滚动条遮罩层-->
        <!--<div class="scroll-cover-f" :class="{simple:get_newer_standard_edition == 1}">-->
        <!--</div>-->
      </div>
      <div class="score-scroll-fixed" :class="{ 'is-baseball': [3].includes(+match.csid) }"
        v-if="[3, 8, 9, 10, 13].includes(+match.csid)" :ref="`score_scroll_fixed_${match.mid}`">
        <div class="score-important2" v-if="![1, 2, 3, 7, 8, 9, 10, 11, 12, 13].includes(+match.csid)">
          {{ last_list_score }}
        </div>
        <div class="score last score-important" v-if="![1, 2, 3, 4, 6, 7, 8, 9, 10, 13, 11, 12].includes(+match.csid)">
          {{ all_s1 || $filters.score_format(all_s1) }}
        </div>
        <!-- 棒球3 出局 -->
        <!-- <div class="poi-des" v-if="[3].includes(+match.csid)" style="flex-shrink: 0;">
          {{ i18n_t('match_info.strike_out') }}&nbsp; <span class="score">{{ match.mbcn }}</span>
        </div> -->
        <div class="baseball-poi-ia" v-if="match.csid == 3" :data-csid="match.csid">
          <template v-if="get_menu_type != 28">
            <div class="baseball-poi-w">
              <div class="poi" :class="{p:match.mbtlp == 1}"></div>
              <div class="poi" :class="{p:match.mbolp == 1}"></div>
              <div class="poi" :class="{p:match.mbthlp == 1}"></div>
            </div>
            <div class="poi-des">
              {{i18n_t('match_info.strike_out')}}&nbsp;<span>{{match.mbcn}}</span>
            </div>
          </template>
        </div>
      </div>
    
    </div>
  </template>
   
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
 //import store from "src/store-redux/index.js";
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
  
  // const get_newer_standard_edition = ref(store_state.get_newer_standard_edition)
  
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
    }, 300);
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
  
  /**
   * @description 总局数
   */
  const total_games = computed(() => {
    const length = lodash.get(msc_converted.value, 'length', 0)
    if (length < 1) return ''
    let home_game = 0
    let away_game = 0
    msc_converted.value.forEach(t => {
      home_game += +t[1]
      away_game += +t[2]
    })
    return `${home_game}-${away_game} (${home_game + away_game})`
  })
  
  // 总比分（大比分s1）斯洛克列表页的大比分不在这里计算
  const all_s1 = computed(() => {
    if (props.match.msc && props.match.msc.toString().includes('S1|')) {
      return '[' + props.match.msc[0].split('S1|')[1] + ']'
    } else {
      return '[0:0]'
    }
  })
  
  // 胜者与输者分数差
  const score_sub_win_faild = computed(() => {
    let r = 0;
    let scores = get_total_scores;
    if (scores.value) {
      if (typeof scores.value.score_sub != 'undefined') {
        r = scores.value.score_sub;
      }
      else {
        r = scores.value;
      }
    }
    return scores.value;
  })
  
  
  // 所有盘/局加起来的总比分
  const get_total_scores = computed(() => {
    let msc_format = get_msc_converted();
    //4冰球 8乒乓球 9排球 10羽毛球 13 16不统计S1
    let csid = Number(props.match.csid);
    let { home, away } = get_match_total_score();
   
    // let { home_score = 0, away_score = 0 } = props.match;
    if (msc_format && msc_format.length) {
      let t = home + away;
      let total_sum = t ? `(${t})` : '';
      // 斯诺克
      if (props.match.csid == 7 || props.match.csid == 12) {
        return get_snooker_score_space_data();
      }
      //2篮球;4冰球;5网球;6美足;
      if ([2, 4, 5, 6].includes(csid)) {
        return {
          total: t,
          score_sub: Math.abs(home - away),
        };
      }
      //
      if ([14, 15].includes(csid)) {
        if (props.match.msc && props.match.msc.length) {
          let flag = 'S1|'
          let found = props.match.msc.filter(score => score.indexOf(flag) > -1)[0];
          if (found) {
            let score_str = found.split(flag)[1];
            home = score_str.split(':')[0];
            away = score_str.split(':')[1];
  
            t = Number(home) + Number(away);
            total_sum = t ? `[${t}]` : '';
          }
        }
        else {
          home = 0;
          away = 0;
          total_sum = 0;
        }
      }
  
      let result = '';
      if (!home && !away && !total_sum) {
        result = '';
      }
      else {
        result = `${home}-${away}${total_sum}`;
      }
      if ([14].includes(csid)) {
        result = `${total_sum}`;
      }
      return result;
    }
    return "";
  })
  
  /**
   * 判断单个比分是否显示
   */
  const is_show_score = (match, score) => {
    let f = false;
    // 红猫赛事屏蔽角球总比分S5,黄牌比分S12,红牌比分S11,点球比分S10
    if (match.cds == 'RC' && match.csid == 1 && ['S5', 'S10', 'S11', 'S12'].includes(lodash.get(score, '[0]'))) {
      return f;
    }
    if (score[1] && score[2] && score[1] != '-' && score[2] != '-') {
      if ([1, 11, 14, 15, 16].includes(+match.csid)) {
        f = true;
      }
      if ((match.csid != 1 || match.csid != 11) && score[0] !== 'S1') {
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
    let h = 0, a = 0;
    try {
      h = msc_converted[i][1] * 1;
      a = msc_converted[i][2] * 1;
    } catch (e) { console.error(e); }
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
    // ms -> 1进行中
    result = match.ms == 1 && [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(csid);
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
    if (scoreWrapScroller.value) {
      // 根据dom 判断 初始值是否应该显示三角
      show_right_triangle.value = scoreWrapScroller.value.scrollWidth > scoreWrapScroller.value.clientWidth;
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
    if (msc && msc.length) {
      let f = score_switch_handle(props.match);
      if (props.match.csid == 7 || props.match.csid == 12) {
        if (f.msc_list && f.msc_list.length) {
          r0 = f.msc_list;
        }
        if (f.s1_score) {
          snoocker_s1.value = f.s1_score;
        }
      }
      else {
        if (f && f.length) {
          r0 = f;
        }
      }
      msc_converted.value = r0;
    }
  
    if (!msc_converted.value || !msc_converted.value.length) {
      msc_converted.value = [[0, 0, 0]];
    }
    if (!r0 || !r0.length) {
      r0 = [[0, 0, 0]];
    }
  
    if (!msc_converted.value || !msc_converted.value.length) {
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
      let m = 0, a = 0;
      msc_format.forEach(score => {
        if ([4, 8, 9, 10, 13, 16].includes(csid)) {
          if (score[0] != 'S1') {
            m += isNaN(score[1] * 1) ? 0 : score[1] * 1;
            a += isNaN(score[2] * 1) ? 0 : score[2] * 1;
          }
        }
        else {
          m += isNaN(score[1] * 1) ? 0 : score[1] * 1;
          a += isNaN(score[2] * 1) ? 0 : score[2] * 1;
        }
      });
      result = { home: m, away: a };
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
    } else {
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
   .score-section {
    font-size: 0.12rem;
    height: 0.14rem;
    bottom: 0;
    right: 0;
    line-height: 1;
    display: flex;
    // justify-content: flex-end;
    z-index: 2;
    position: relative;
    // padding: 0 0 0 0.08rem;
    align-items: center;
    width: 100%;
  
    .bq-ball{
      flex-shrink: 1!important;
    }
    &.standard {
      justify-content: flex-start;
      padding-left: 0.21rem !important;
    }
  
    &.result {
      justify-content: flex-end;
      padding-left: 0 !important;
    }
  
    &.flex-star {
      justify-content: flex-start;
    }
    .score-scroll-fixed {
      line-height: 1;
      display: flex;
      flex-shrink: 0;
  
      &.is-baseball {
        margin-left: 0.05rem;
      }
  
      .baseball-poi-ia {
        display: flex;
        align-items: center;
        justify-content: space-between;
  
        .baseball-poi-w {
          width: 0.16rem;
          height: 0.16rem;
          display: flex;
          flex-wrap: wrap;
          overflow: hidden;
          align-content: flex-start;
          transform: translateX(-0.02rem) translateY(0.04rem) rotateZ(45deg);
          .poi {
            width: 0.06rem;
            height: 0.06rem;
            margin: 0 1px 1px 0;
            flex-shrink: 0;
            background: var(--q-gb-t-c-6);
            &.p {
             background: var(--q-gb-t-c-25);
            }
          }
  
          .icon-b {
            width: 100%;
            height: 100%;
          }
        }
        .poi-des {
          color: var(--q-gb-t-c-17);
              height: auto;
              display: flex;
              align-items: flex-start;
              font-size: 0.12rem;
            margin-left: 0.04rem;
            .score{
              color: var(--q-gb-t-c-1);
            }
        }
       
      }
    }
  
    .scroll-container-w {
      position: relative;
      flex-shrink: 0;
      width: 100%;
  
      .scroll-cover-f {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0.07rem;
        z-index: 10;
  
        &.simple {
          height: 0.08rem;
        }
      }
  
      &.left_scroll {
        &:before {
          visibility: visible;
        }
      }
  
      &.right_scroll {
        &:after {
          visibility: visible;
        }
      }
  
                                                                                                                                                                                                                                                                  &:before,
                                                                                                                                                                                                                                                                  &:after {
        content: ' ';
        width: 0;
        height: 0;
        visibility: hidden;
        top: 50%;
        transform: translateY(-50%);
        border-top: 0.03rem solid transparent;
        border-bottom: 0.03rem solid transparent;
        position: absolute;
      }
  
      &:before {
        left: -0.04rem;
      }
  
      &:after {
        right: -0.04rem;
      }
    }
  
    .score-se-inner {
    //   height: 0.3rem;
    //   line-height: 1;
    //   overflow-x: auto;
    //   overflow-y: hidden;
  
      &.result {
        max-width: 2.33rem;
        width: auto !important;
      }
  
      &.standard {
        height: 0.23rem;
        width: auto !important;
      }
  
      &.is-volley-ball {
        max-width: 1.8rem;
      }
  
      &.is-foot-ball {
        max-width: 2.07rem;
      }
  
      &.is-tennis {
        max-width: 1.8rem;
      }
  
      &.is-basket-ball {
        // max-width: 1.8rem;
      }
  
      &.is-table-tennis {
        // max-width: 1.8rem;
      }
  
      .score-se-inner2 {
        // width: 366px;
        // line-height: 1;
        display: flex;
        // flex-shrink: 0;
        // justify-content: space-between;
  
        .basket-ball {
          // color: var(--q-color-com-fs-color-29);
          flex-shrink: 0;
          font-size: 0.1rem;
        }
  
        .score-fle-container-1 {
          flex-wrap: nowrap;
          flex-shrink: 0;
          color: var(--q-gb-t-c-18);
          font-family: Akrobat;
          font-size: 10px;
          font-weight: 700;
          margin-left: 0.08rem;
          &.result {
            .score {
              &:last-child {
                color: var(--q-color-com-fs-color-29) !important;
              }
            }
          }
        }
  
        .b-score-wrapper {
          // margin-left: 0.05rem;
          color: var(--q-gb-t-c-18);
            font-family: PingFang SC;
            font-size: 11px;
            font-weight: 400;
          
            .important-color-number {
              color: var(--q-gb-bd-c-1);
              text-align: right;
              font-family: Akrobat;
              font-size: 11px;
              font-weight: 700;
            }
        }
      }
  
      .score {
        flex-shrink: 0;
        margin-right: 0.04rem;
        font-size: 0.11rem;
        color: var(--q-color-com-fs-color-29);
        align-items: center;
        // margin-left: 3px;
  
        .total-play-count{
          color: var(--q-gb-t-c-18);
          margin: 0 3px;
        }
        .total-games{
          color: var(--sys-brand-primary-primary-300, #74C4FF) !important;
  
        }
        .score-value {}
        
          .divider {
            width: 1px;
            height: 10px;
            background: var(--sys-brand-secodary-secondary-50, #F2F2F6);
            margin: 0 2px;
        }
  
        .kk-icon {
          margin-right: 0.06rem;
          width: 0.14rem;
  
        }
  
        &.last {
          margin-right: 0;
          position: relative;
          // top: 1px;
        }
  
        &:last-child {
          border: none !important;
          margin-right: 0.02rem;
          color: var(--sys-brand-primary-primary-300, var(--q-gb-bd-c-1)) !important;
        }
      }
  
      .kk-icon {
        margin-right: 0.06rem;
      }
  
      &.last {
        margin-right: 0;
      }
  
      &:last-child {
        border: none !important;
        font-size: 0.1rem;
        margin-right: 0.02rem;
      }
    }
  
    .score-important {
      height: 0.1rem;
      color: var(--sys-brand-primary-primary-300, #74C4FF) !important;
      // border: none !important;
    }
  
    .score-important2 {
  
      border: none !important;
    }
    .color18{
      color: var(--q-gb-t-c-18);
    }
    /* ******比分区域样式********* -E*/
  }
  
  .row {
    display: flex;
    flex-wrap: nowrap;
  }
  
  .whitespace-nowrap {
    white-space: nowrap;
  }
  </style>