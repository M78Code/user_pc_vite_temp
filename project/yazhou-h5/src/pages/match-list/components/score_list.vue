<!--
 * @Author: Cronus
 * @Date: 2020-07-14 17:46:47
 * @Description: 列表赛事比分行
-->

<template>
  <div v-show="show_score_match_line(match)" class="score-section"
    :class="{
      'flex-star':[3].includes(+match.csid),
      standard:get_newer_standard_edition == 2,
      result:get_menu_type == 28
      }">

    <div class="scroll-container-w" :class="{
        'left_scroll':show_left_triangle,
        'right_scroll':show_right_triangle}"
      :ref="`match_score_scroll_w_${match.mid}`">
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
          <div class="row items-center score-fle-container-1" :class="{
              result:get_menu_type == 28 && main_source !== 'detail_match_list',
              }">
            <template v-for="(score,i) of msc_converted">
              <div class="score row items-start" :key="i"
                :class="{
                  'basket-ball':match.csid == 2,
                  'important-color-number':
                    i == msc_converted.length - 1 && //蓝球时取对应比分高亮
                    match.csid == 2 &&
                    get_menu_type != 28,
                }"
                :data-scores="`${i}-${msc_converted.length}-${match.csid}`"
                v-if="is_show_score(match,score)">
                <!--角球图标-->
                <img class="kk-icon" alt=""
                  v-if="match.csid == 1 && score[0] == 'S5' && score[4]"
                  src="image/wwwassets/bw3/list/m-list-jiaoqiu.svg" />
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
                {{$root.$t('list.score-disparity')}}
              </div>
              <div class="important-color-number sub">
                {{score_sub_win_faild.score_sub?score_sub_win_faild.score_sub:score_sub_win_faild}}
              </div>
            </div>
            <!--总分-->
            <div class="row" v-if="[2,6].includes(+match.csid)">
              <div style="margin-right:.03rem">
                {{$root.$t('list.total_pp_score_count')}}
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
                {{$root.$t('list.total_play_count')}}
              </span>
              <!-- 总分   5--网球， 5--美式足球， 7--斯诺克， 8--乒乓球， 9--排球， 10--羽毛球，-->
              <span class="score-l-total2" v-if="[8,9,10,13,15,16].includes(+match.csid) && get_total_scores">
                {{$root.$t('list.total_pp_score_count')}}
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
      <div class="score last score-important"
        v-if="![1,2,3,4,6,7,8,9,10,13,11,12].includes(+match.csid)">
        {{all_s1 | score_format}}
      </div>

      <!--棒球-->
      <!-- <div class="baseball-poi-ia" v-if="match.csid == 3" :data-csid="match.csid">
        <template v-if="get_menu_type != 28 && !['result_details', 'match_result'].includes(this.$route.name)">
          <div class="baseball-poi-w">
            <div class="poi" :class="{p:match.mbtlp == 1}"></div>
            <div class="poi" :class="{p:match.mbolp == 1}"></div>
            <div class="poi" :class="{p:match.mbthlp == 1}"></div>
          </div>
          <div class="poi-des">
            {{$root.$t('match_info.strike_out')}}&nbsp;<span style="color:#C84D4D">{{match.mbcn}}</span>
          </div>
        </template>
      </div> -->

    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import msc from "src/project/mixins/match_list/msc-bw3.js";

export default {
  name: "score_list",
  props: {
    match: Object,
    main_source: String,
  },
  mixins: [msc],
  data() {
    return {
      snoocker_s1: null,    //斯诺克比分编号为S1的结果
      last_list_score:'',   //当前最新的盘/局比分
      msc_converted:[],     //比分转换为数组的数据
      inner_dom_width:0,    //比分区域宽度
      show_left_triangle:false,
      show_right_triangle:false,
    };
  },
  mounted() {
    this.get_last_list_score();
    //获取最新比分延迟时钟对象
    this.timer_1 = setTimeout(() => {
      this.get_last_list_score();
    }, 100);

    //比分区域div布局延迟，以使其刚打开页面就能左右滚动
    this.timer_2 = setTimeout(() => {
      this.score_layout_init();
    },300);
  },
  destroyed(){
    clearTimeout(this.timer_1);
    this.timer_1 = null;

    clearTimeout(this.timer_2);
    this.timer_2 = null;
  },
  methods: {
    /**
     * 判断单个比分是否显示
     */
    is_show_score(match,score){
      let f = false;
      // 红猫赛事屏蔽角球总比分S5,黄牌比分S12,红牌比分S11,点球比分S10
      if(match.cds=='RC' && match.csid == 1 && ['S5','S10','S11','S12'].includes(_.get(score,'[0]'))){
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
    },
    /**
     * @description: 获取最新比分赋值给last_list_score
     * @param {Undefined} Undefined
     * @return {Undefined} Undefined
     */
    get_last_list_score() {
      const msc_converted = this.get_msc_converted();
      let i = msc_converted.length - 1;
      let h = 0,a = 0;
      try {
        h = msc_converted[i][1] * 1;
        a = msc_converted[i][2] * 1;
      } catch (e) {console.error(e);}
      if (!isNaN(h) && !isNaN(a)) {
        this.last_list_score = `${h}-${a}`;
      }
    },
    /**
     * @description: 比分区域是否显示
     * @param {Object} match 赛事对象
     * @return {Boolean} 比分区域是否显示
     */
    show_score_match_line(match) {
      // 网斯乒羽(5,7,8,10)  棒冰美排(3、4、6、9)
      let csid = +match.csid;
      let result = false;
      result = match.ms == 1 && [1,2,3,4,5,7,8,9,10,11,12,13,14,15,16].includes(csid);
      if(this.get_menu_type == 28){
        result = true;
      }
      return result;
    },
    /**
     * @description: 比分容器横向滚动
     * @param {Object} $event 事件对象
     * @return {Undefined} Undefined
     */
    score_inner2_scrolling($event) {
      this.show_left_triangle = $event.target.scrollLeft;
      let remaining = $event.target.scrollWidth - $event.target.scrollLeft;
      let client_width = $event.target.clientWidth;

      this.show_right_triangle = Math.floor(remaining) > Math.floor(client_width);
    },
    /**
     * @description: 比分容器横向滚动
     * @param {Undefined} Undefined
     * @return {Undefined} Undefined
     */
    score_layout_init() {
      const scroller= this.$refs['scoreWrapScroller'];
      if(scroller){
        // 根据dom 判断 初始值是否应该显示三角
        this.show_right_triangle = scroller.scrollWidth>scroller.clientWidth;
      }
    },
    /**
     * @description: 比分转换
     * @param {Undefined} Undefined
     * @return {Undefined} Undefined
     */
    get_msc_converted(){
      let msc = this.match.msc;
      let r0 = [];
      if(msc && msc.length){
        let f = this.score_switch_handle(this.match);
        if (this.match.csid == 7 || this.match.csid ==12) {
          if (f.msc_list && f.msc_list.length) {
            r0 = f.msc_list;
          }
          if (f.s1_score) {
            this.snoocker_s1 = f.s1_score;
          }
        }
        else{
          if (f && f.length) {
            r0 = f;
          }
        }
        this.msc_converted = r0;
      }

      if(!this.msc_converted || !this.msc_converted.length){
        this.msc_converted = [[0,0,0]];
      }
      if(!r0 || !r0.length){
        r0 = [[0,0,0]];
      }

      if(!this.msc_converted || !this.msc_converted.length){
        this.show_right_triangle = false;
      }

      return r0;
    },
    /**
     * 获取赛事总比分
     */
    get_match_total_score(){
      let result = {};
      let match = this.match;
      let msc_format = this.get_msc_converted();
      //4冰球 8乒乓球 9排球 10羽毛球 13 16不统计S1
      let csid = Number(match.csid);
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
    },
    /**
     * 获取斯诺克总比分栏显示的数据
     */
    get_snooker_score_space_data(){
      let result = '';
      if (this.snoocker_s1) {
        result = `${this.snoocker_s1[1]}-${this.snoocker_s1[2]}[${+this.snoocker_s1[1] + +this.snoocker_s1[2]}]`;
      }
      else{
        let f = this.score_switch_handle(this.match);
        if (f.s1_score) {
          this.snoocker_s1 = f.s1_score;
        } else {
          result = this.snoocker_s1 = [0, 0, 0];
        }
        result = `${this.snoocker_s1[1]}-${this.snoocker_s1[2]}[${+this.snoocker_s1[1] + +this.snoocker_s1[2]}]`;
      }
      return result;
    }
  },
  computed:{
    ...mapGetters({
      footer_sub_menu_id:'get_footer_sub_menu_id',
      current_main_menu:'get_current_main_menu',
    }),
    ...mapGetters(['get_newer_standard_edition','get_menu_type','get_current_menu']),
    /**
     * @description: 总比分（大比分s1）斯洛克列表页的大比分不在这里计算
     * @param {Undefined} Undefined
     * @return {Undefined} Undefined
     */
    all_s1(){
      if(this.match.msc && this.match.msc.toString().includes('S1|')){
        return '['+this.match.msc[0].split('S1|')[1]+']'
      }else{
        return '[0:0]'
      }
    },
    /**
     * 胜者与输者分数差
     * @param {Undefined} Undefined
     * @return {String} String
     */
    score_sub_win_faild(){
      let r = 0;
      let scores = this.get_total_scores;
      if(scores){
        if(typeof scores.score_sub != 'undefined'){
          r = scores.score_sub;
        }
        else{
          r = scores;
        }
      }
      return r;
    },
    /**
     * @description: 所有盘/局加起来的总比分
     * @param {Undefined} Undefined
     * @return {String} String
     */
    get_total_scores() {
      let match = this.match;
      let msc_format = this.get_msc_converted();
      //4冰球 8乒乓球 9排球 10羽毛球 13 16不统计S1
      let csid = Number(match.csid);
      let {home,away} = this.get_match_total_score();
      if (msc_format && msc_format.length) {
        let t = home + away;
        let total_sum = t ? `[${t}]` : '';
        // 斯诺克
        if (match.csid == 7 || this.match.csid ==12) {
          return this.get_snooker_score_space_data();
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
          if(match.msc && match.msc.length){
            let flag = 'S1|'
            let found = match.msc.filter(score => score.indexOf(flag) > -1)[0];
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
    },
  },
  watch: {
    /**
     * @description: 监听赛事比分变化
     * @param {Undefined} Undefined
     * @return {Undefined} Undefined
     */
    "match.msc"() {
      this.get_last_list_score();
    },
    /**
     * @description: 监听赛事阶段变化
     * @param {Undefined} Undefined
     * @return {Undefined} Undefined
     */
    "match.mmp"(){
      this.get_msc_converted();
      this.get_last_list_score();
    }
  }
};
</script>

<style lang="scss" scoped>
/* ******比分区域样式********* -S*/
.score-section {
  font-size: 0.12rem;
  height: 0.14rem;
  bottom: 0;
  right: 0;
  line-height: 1;
  display: flex;
  justify-content: flex-end;
  z-index: 2;
  position: relative;
  padding: 0 0 0 0.08rem;
  align-items: center;

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
      width: 1.92rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .baseball-poi-w {
        width: 0.14rem;
        height: 0.14rem;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        align-content: flex-start;
        transform: translateX(-0.02rem) translateY(0.04rem) rotateZ(45deg);

        .poi {
          width: 0.05rem;
          height: 0.05rem;
          margin: 0 1px 1px 0;
          flex-shrink: 0;
          background: var(--q-color-com-bg-color-46);

          &.p {
            background: var(--q-color-com-bg-color-23);
          }
        }

        .icon-b {
          width: 100%;
          height: 100%;
        }
      }

      .poi-des {
        color: var(--q-color-com-fs-color-40);
        height: auto;
        display: flex;
        align-items: flex-start;
        font-size: 0.12rem;
        margin-left: 0.04rem;
      }
    }
  }

  .scroll-container-w {
    position: relative;
    flex-shrink: 0;

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

    &:before, &:after {
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
    height: 0.3rem;
    line-height: 1;
    overflow-x: auto;
    overflow-y: hidden;

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
      max-width: 1.8rem;
    }

    &.is-table-tennis {
      max-width: 1.8rem;
    }

    .score-se-inner2 {
      width: auto;
      height: 100%;
      line-height: 1;
      display: flex;
      flex-shrink: 0;

      .basket-ball {
        color: var(--q-color-com-fs-color-29);
        flex-shrink: 0;
        font-size: 0.1rem;
      }

      .score-fle-container-1 {
        flex-wrap: nowrap;
        flex-shrink: 0;

        &.result {
          .score {
            &:last-child {
              color: var(--q-color-com-fs-color-29) !important;
            }
          }
        }
      }

      .b-score-wrapper {
        margin-left: 0.05rem;
      }
    }

    .score {
      flex-shrink: 0;
      margin-right: 0.1rem;
      font-size: 0.1rem;
      color: var(--q-color-com-fs-color-29);
      align-items: center;

      .score-value {
        font-size: 0.1rem;
        line-height: 0.1rem;
      }

      .kk-icon {
        margin-right: 0.06rem;
        width: 0.14rem;
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

    border: none !important;
  }

  .score-important2 {

    border: none !important;
  }

  /* ******比分区域样式********* -E*/
}
</style>
