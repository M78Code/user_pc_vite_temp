<!--
 * @Description: ouzhou H5 赛果组件
-->
<template>
  <div class="component match-container-main-template3 match-container m-3" 
    :style="{ marginTop: is_hot ? '0' : '' }">
    <template v-if="match">
      <!-- 最核心的div模块     标题 + 倒计时 + 比分 + 赔率盘口模块 -->
      <div class="match-inner-container" :class="[{'collapsed': !collapsed}]">
        <!--联赛标题 -->
        <div @click="handle_league_fold" v-if="match.is_show_league || (is_hot && get_league_show(i))"
          :class="[('league match-indent hairline-border'), { 'no-border': !collapsed}]">
          <div class="league-t-wrap">
            <span class="league-title-text row justify-between">
              <span :class="['league-t-wrapper', { 'league-t-main-wrapper': menu_type !== 28, export: is_esports }]">
                <span class="match-league ellipsis-2-lines" :class="{ 'match-main-league': menu_type !== 28 }">
                  {{ match.tn }}
                </span>
              </span>
            </span>
          </div>
          
        </div>
        <div class="league-line" :class="[{'collapsed': !collapsed}]"></div>
        <!-- 卡片主内容 -->
          <div style="width: 100%;" v-if="collapsed">
            <!--  一整块赛事的 div 内容 ： 1. 左边 【时间，队名，比分】   2. 右边 【赔率 模块】  -->
            <div class="match-odds-container study_height_s hairline-border">
              <div class="match-odds-container-border-radius">
                <!-- 下边的模块，左方是  队名和 队比分,  右面是  盘口  模块 -->
                <div class="odd-list match-indent" :class="{ 'simple': show_newer_edition, result: is_results }">
                  <div class="odd-list-inner odd" :class="{ 'n-s-edition': !show_newer_edition, result: is_results }">
                    <!--  左边 图片和名称  和 比分 和 视频图标 -->
                    <div @click='goto_details(match)' :class="['team-wrapper', { simple: standard_edition == 1, team_title: is_results }]">
                      <!-- 上边的 赛事日期标准版,包含 比分组件 -->
                      <div class="date-container match-indent" v-if="!show_newer_edition && !is_results">
                        <div class='l standard'>
                          <!--竞彩足球 星期与编号-->
                          <div class="week-mcid row items-center" v-if="menu_type == 30">
                            <span class="din-regular"> {{ lodash.get(match,'mcid')}} </span>
                          </div>
                          <!--赛事列表收藏-->
                          <div class="favorite-icon-top match list-m" @click.stop="handle_match_collect">
                            <!-- 未收藏图标 compute_img_url('icon-favorite')-->
                            <img v-if="!match_collect_state" :src="no_collect_ouzhou" alt="">
                            <!-- 收藏图标 compute_img_url('icon-favorite-s')-->
                            <img v-if='match_collect_state' :src="have_collect_ouzhou">
                          </div>
                          <!-- 赛事日期标准版 -->
                          <div :class="['timer-wrapper-c flex items-center', { esports: is_esports, 'din-regular': is_esports }]">

                            <!-- 赛事回合数mfo -->
                            <div v-if="match.mfo" class="mfo-title" :class="{ 'is-ms1': match.ms == 1 }">
                              {{ match.mfo }}
                            </div>

                            <!--即将开赛 ms = 110-->
                            <div class="coming-soon" v-if="match.ms" v-show="match.ms == 110">
                              {{ i18n_t(`ms[${match.ms}]`) }}
                            </div>

                            <!--开赛日期 ms != 110 (不为即将开赛)  subMenuType = 13网球(进行中不显示，赛前需要显示)-->
                            <div class="date-time" v-show="match.ms != 110 && !show_start_counting_down(match) && !show_counting_down(match)">
                              {{ format_time_zone(+match.mgt).Format(i18n_t('time4')) }}
                            </div>
                            <!--一小时内开赛 -->
                            <div class="start-counting-down" v-show="match.ms != 110 && show_start_counting_down(match)">
                              <CountingDownStart :match="match" :index="i" :mgt_time="match.mgt"></CountingDownStart>
                            </div>
                            <!--倒计时或正计时-->
                            <div v-if="match.ms != 110 && show_counting_down(match)" 
                              :class="['counting-down-up-container relative-position', { 'special-match-container': match.mfo || [0, 31].includes(+match.mmp) }]">
                              <!--足球csid:1 冰球csid:4 橄榄球csid:14 DotaCsid:101 累加 排球csid:9 倒计时-->
                              <CountingDownSecond ref="counting-down-second" :title="mmp_map_title" :mmp="match.mmp"
                                :is_add="[1, 4, 11, 14, 100, 101, 102, 103].includes(+match.csid)" :m_id="match.mid"
                                :second="match.mst" :match="match" @counting-wrapper-width="update_counting_down_up_wrapper_width">
                              </CountingDownSecond>
                            </div>
                          </div>

                          <!-- 电竞串关标识 -->
                          <div v-if="menu_type == 3000 && match.ispo" class="flag-chuan"
                            :class="{ 'special-lang': ['zh', 'tw', 'hk'].includes(get_lang) }">{{ i18n_t('match_info.match_parlay') }}
                          </div>
                        </div>
                        <!--玩法数量-->
                        <div class="goto-detail" @click='goto_details(match)'>
                          <span class="count_span" :class="{ esports: 3000 == menu_type }">
                            <span class="mc-n">
                              {{GlobalAccessConfig.get_handicapNum()? get_match_mc(match) : i18n_t('footer_menu.more') }}
                            </span>
                            <span class="add_text" v-if="GlobalAccessConfig.get_handicapNum()">
                              <IconWapper color="#888" name="icon-triangle1" size="14px" class="icon-wapper-more" />
                            </span>
                          </span>
                        </div>
                      </div>
                      <div class="title-time">
                        <span>{{ format_time_zone(+match.mgt).Format(i18n_t('time4')) }} </span>
                        <!-- 比赛取消： match.ms == 5 -->
                        <span class="title_cancel" v-if="match.ms == 5">{{ i18n_t('match_info.match_cancellation') }}</span>
                      </div>
                      <!--主队图片和名称-->
                      <div class='team-title-container' :class="{
                        simple: show_newer_edition && !is_results,
                        standard: !show_newer_edition && !is_results,
                        result: is_results
                      }">
                        <!-- 红、黄牌， 发球方绿点 -->
                        <div class="team-left">
                          <template v-if="home_red_score || home_yellow_score">
                            <!-- 红牌 -->
                            <span class='score-punish red' v-show="home_red_score" :class="{ flash: is_show_home_red && !is_results }">
                              {{ home_red_score }}
                            </span>
                            <!-- 黄牌 -->
                            <span class='score-punish yellow' v-show="!home_red_score && home_yellow_score">
                              {{ home_yellow_score }}
                            </span>
                          </template>
                          <!--发球方绿点-->
                          <template v-else>
                            <span class="serving-party" :class="{ 'simple': standard_edition == 1 }" v-show="set_serving_side(match, 'home')"></span>
                          </template>
                        </div>
                        <div class="team-title-inner-con">
                          <div class='team-t-title-w' :class="{
                            'is-handicap': match.handicap_index == 1,
                            'is-handicap-1': match.handicap_index == 2,
                          }" style="margin: 5px 0 2px;">
                            {{ match.mhn }}
                          </div>
                          <!-- 进球动画 -->
                          <div class="yb-flex-center" v-if="is_show_home_goal && is_new_init2 && (!is_show_away_goal)">
                            <div class="yb-goal-gif" :class="{ 'yb-goal-yo': theme.includes('y0') }"></div>
                            <div class="gif-text">{{ i18n_t('match_result.goal') }}</div>
                          </div>
                        </div>
                        <!--进行中的赛事显示比分 ,如果是比分判定中，则不显示比分-->
                        <div class="score full-score"
                          :class="{ 'visibility-hidden': match.ms == 110 }">
                          {{ home_score }}
                        </div>
                      </div>
                      <!--客队图片和名称-->
                      <div class='team-title-container'>
                        <!-- 红、黄牌， 发球方绿点 -->
                        <div class="team-left">
                          <template v-if="away_red_score || away_yellow_score">
                            <!-- 红牌 -->
                            <span class='score-punish red' v-show="away_red_score" :class="{ flash: is_show_away_red && !is_results }">
                              {{ away_red_score }}
                            </span>
                            <!-- 黄牌 -->
                            <span class='score-punish yellow' v-show="!away_red_score && away_yellow_score">
                              {{ away_yellow_score }}
                            </span>
                          </template>
                          <!--发球方绿点-->
                          <template v-else>
                            <span class="serving-party" :class="{ 'simple': standard_edition == 1 }" v-show="set_serving_side(match_of_list, 'away')"> </span>
                          </template>
                        </div>
                        <div class="team-title-inner-con">
                          <div class='team-t-title-w visiting' :class="{
                            'is-handicap': match.handicap_index == 2,
                            'is-handicap-1': match.handicap_index == 1,
                          }">
                            {{ match.man }}
                          </div>
                          <!-- 进球动画 -->
                          <div class="yb-flex-center" v-if="is_show_away_goal && is_new_init2 && (!is_show_home_goal)">
                            <div class="yb-goal-gif yb-goal-yo"></div>
                            <div class="gif-text">{{ i18n_t('match_result.goal') }}</div>
                          </div>
                        </div>
                        <!--进行中的赛事显示比分 ,如果是比分判定中，则不显示比分-->
                        <div class="score full-score"
                          :class="{ 'visibility-hidden': match_of_list.ms == 110 }">
                          {{ away_score }}
                        </div>
                      </div>
                    </div>
                    <div class="mcmt-text" @click='goto_details(match)'>
                      {{i18n_t('list.go_to_details')}}
                      <IconWapper color="#888" name="icon-triangle1" size="16px" class="icon-wapper-more" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </template>
  </div>
</template>
  
<script>

import { ref, computed, watch, nextTick, onMounted } from 'vue'

import { IconWapper } from 'src/components/icon'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import OddListWrap from 'src/base-h5/components/match-list/components/odd-list-wrap.vue';
import ImageCacheLoad from "src/core/public-cache-image/public-cache-image.vue";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import PageSourceData  from  "src/core/page-source/page-source.js";
import { i18n_t, compute_img_url, compute_css_obj, LOCAL_PROJECT_FILE_PREFIX, format_time_zone  } from "src/output/index.js"
import { have_collect_ouzhou, no_collect_ouzhou} from 'src/base-h5/core/utils/local-image.js'

import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';

import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2, is_detail, is_esports, is_results, footer_menu_id } from 'src/base-h5/mixin/menu.js'

import default_mixin from '../../mixins/default.mixin.js'

export default {
  name: "match-container-main-template4",
  mixins: [default_mixin],
  props: {
    // 当前组件的赛事数据对应列表的赛事
    match_of_list: Object,
    // 赛事处于列表中的下标
    i: Number,
    // 赛事列表相关操作的类型封装对象
    matchCtr: Object,
    main_source:String,
  },
  data(){
    return {}
  },
  components: {
    IconWapper,
    OddListWrap,
    ImageCacheLoad,
    CountingDownStart,
    CountingDownSecond,
  },
  setup (ctx) {
    return { 
      lang, theme, i18n_t, compute_img_url, format_time_zone, GlobalAccessConfig, footer_menu_id,LOCAL_PROJECT_FILE_PREFIX, have_collect_ouzhou,
      is_hot, menu_type, menu_lv2, is_detail, is_esports, is_results, standard_edition, compute_css_obj, no_collect_ouzhou,
      PageSourceData,
    }
  }
}

</script>
   
<style scoped lang="scss">
/* ********赛事容器相关********** -S*/
.match-header{
  height: 50px;
  display: flex;
  align-items: center;
  padding: 11px 10px;
  background: #fff;
  border-top: 0.027rem solid #FF7000;
  > div{
    flex: 1;
    display: flex;
    color: #1A1A1A;
    font-size: 16px;
    font-weight: 500;
    align-items: center;
    .icon {
      width: 17px;
      height: 17px;
      margin-right: 10px;
      display: inline-block;
    }
    .path{
      width: 15px;
      height: 5px;
    }
  }
  .select_time{
    display: flex;
    align-items: center;
    color: #FF7000;
    justify-content: flex-end;
    padding-right: 5px;
    > img {
      padding-left: 8px;
    }
    :deep(.q-btn){
      &.disabled{
        opacity: 1 !important;
      }
      .q-btn__content{
        text-transform: capitalize;
        .block{
          font-size: 13px;
          font-weight: 500;
        }
        .q-icon{
          color: #333;
          font-size: 14px;
          margin-left: 5px;
        }
      }
      .q-ripple{
        display: none;
        }
      }
    }
  }
.play-icon {
  background-image: var(--q-color-img-bg-103);
  background-repeat: no-repeat;
  width: 0.14rem;
  height: 0.14rem;
  margin-top: 0.07rem;
}

.auto-full-width-100 {
  width: 100%;
}

.match-container {
  width: 100%;
  height: auto;
  position: relative;
  &.border_top{
    border-top: 1px solid rgba(175, 179, 200, 0.1);
  }
  &.is_zaopan{
    .progress{
      border-color: #FEBE55;
    }
  }

  .match-status-fixed {
    width: 100%;
    height: 0.25rem;
    line-height: 1;
    font-size: 0.11rem;
    padding-left: 0.20rem;
    display: flex;
    align-items: center;
    color: var(--q-color-com-fs-color-38);
    background: #fff;
    &.progress{
      border-top: 2px solid rgba(116, 196, 255, 0.5);
    }
    &.not_begin{
      border-top: 2px solid rgba(233, 91, 91, 0.51);
    }

    img {
      margin-right: .06rem;
      width: .13rem;
      height: .13rem;
    }
  }

  .v-mode-span {
    margin-right: 0.1rem;
  }
  .buffer-container{
    background: #fff;
    height: 5px;
  }
  .match-inner-container {
    margin: 0 auto;
    /* 兼容iPhone11边框显示不全 */
    //width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    background: #ffffff !important;
    .league-line{
      height: 1px;
      width: 100%;
      position: absolute;
      bottom: 1px;
      background: #fff;
      &.collapsed{
        background: #e2e2e2;
      }
    }
    // padding-top: 0.05779rem;  /* 兼容iPhone11边框显示不全 */
    &.show-sport {
      border-top-left-radius: 0.08rem;
      border-top-right-radius: 0.08rem;
    }
    .match-content{
      background: #fff;
      padding: 0 0.1rem;
    }
  }

  &.started_and_un_started {
    display: block;
  
  }

  &.show_un_started {
    display: block;

    .match-indent {
      display: flex;
    }
  }

  .match-odds-container {
    width: 100%;
    display: flex;
    height: 90px;
    position: relative;
    padding: .03rem 0 .03rem .03rem;
    border-bottom: 1px solid #eee;
    .match-odds-container-border-radius {
      width: 100%;
    }
    &.border-top{
      border-top: 1px solid #e9e9e9;
    }

    .eports_scoring_tip {
      color: var(--q-gb-t-c-13);
    }
    &.hairline-border{
      border-radius: 0;
    }
  }

  &.is_league_tail {
    .match-inner-container {
      box-shadow: var(--q-color-box-shadow-color-4);
      border-bottom-left-radius: 0.08rem;
      border-bottom-right-radius: 0.08rem;
      //overflow: hidden;
    }
  }

  &.is_division_league {
    margin-bottom: 0.05rem;
    &.started_un_started_next {
      .match-odds-container {
        &:after {
          display: inline;
        }
      }
    }

    .no-radius {
      border-radius: unset;
    }
    .no-border{
      border: none !important;
    }

    .odd-list-inner.odd {
      border-bottom: none !important;
    }
  }

  &.is_division_sport {
    margin-bottom: 0;

    .match-odds-container {
      &:after {
        display: none;
      }
    }
  }


  &.favorite_un_start_title {
    margin-top: 0 !important;
  }

  /* **************体育展示********************** -S*/
  .hot_time_change {
    font-weight: bold;
    width: 100%;
    font-size: 0.14rem;
    padding: 0.1rem 0 0.1rem 0.08rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    >span {
      &:nth-child(2) {
        padding: 0 0.09rem;
        height: 0.24rem;
        line-height: 0.24rem;
        border-radius: 0.115rem;
        box-sizing: border-box;
        font-size: 0.12rem;
        font-weight: 400;
        z-index: 110;
        position: relative;
        left: -0.08rem;
      }
    }
  }

  /* **************体育展示********************** -E*/

  /* **************联赛展示********************** -S*/
  .league {
    width: 100%;
    border-radius: 0;
    display: flex;
    height: 36px;
    padding-left: 20px;
    color: #1a1a1a;
    background: #F1F1F1 !important;
    // padding: 0 0.1rem;

    &.show-sport {
      border-radius: 0.12rem 0.12rem 0 0;
    }

    &.home-hot {
      margin-top: .05rem;
    }

    .league-t-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      //padding-left: 0.08rem;
      .esport {
        margin: 0.01rem 0.07rem 0 0rem;
        position: relative;
        --per: -0.32rem;
        display: block;
        width: auto;
        height: 0.22rem;
        width: 0.22rem;
        background-position: 0 0;
        background-size: 0.22rem 18.88rem;
        flex-shrink: 0;
        img {
          width: 0.22rem;
          height: 0.22rem;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .league-t-tubiao {
        height: 0.15rem;
        width: 0.02rem;
        background-color:var(--q-gb-bg-c-13);
        border-radius: 10px;
        width: 200px; 
      }
      .league-collapse-dir {
        width: 0.12rem;
        height: 0.06rem;
        position: relative;
        right: 0.1rem;

        &.collapsed {
          transform: rotateZ(180deg);
        }
      }
      .favorited-icon{
        width: 15px;
        height: 14px;
        margin: 0 10px 0 0;
        position: relative;
        flex-shrink: 0;
        > img {
          width: 100%;
          height: 100%;
        }
      }
    }
    
    .dir {
      margin-right: 0.09rem;

      i {
        display: block;
        font-size: 0.1rem;
        transition: transform 0.3s;

        &.collapse {
          transform: rotateZ(180deg);
        }
      }
    }
  }

  .odd-title-wraper {
    height: 0.2rem;
    position: relative;
    flex-wrap: nowrap;
    display: flex;
    font-size: 0.1rem;
    color: #303442;
    flex-direction: row-reverse;
    background: var(--q-match-page-bg-color-10);
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;

    .odd-title-i-w {
      width: 50%;
      overflow: hidden;

      .odd-t-i-wrapper {
        flex-shrink: 0;
        transition: transform 0.2s;

        &.status2 {
          transform: translateX(-1.84rem);
        }
      }
    }
      
    .odd-title-wrape-tab {
      border-top: 1px solid #000;
      width: 96%;
    }
    .row {
      height: 100%;
    }

    .hpl-title {
      width: 0.6rem;
      height: auto;
      line-height: 1;
      margin-left: 0.01rem;
      font-size: 0.1rem;
      color: var(--q-color-com-fs-color-1);
      flex-shrink: 0;

      &.boxing {
        width: 0.95rem;
      }

      .hpl-t-inner {
        width: auto;
        max-height: 0.23rem;
        text-align: center;
        font-weight: 400;
      }

      &:first-child {
        margin-left: 0;
      }
    }
  }

  /* **************联赛展示********************** -E*/

  /* **************收藏********************** -S*/
  .fav-icon-wrap {
    width: 0.26rem;
    margin-right: 0.04rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .league-title-text {
    font-size: 0.13rem;
    width: 100%;
    height: 100%;
    padding-right: 5px;
    transform: translateY(1px);
    text-overflow: ellipsis;
    flex-wrap: nowrap;
    align-items: center;
    overflow: hidden;
    .icon-wapper{
      transform: rotate(90deg);
    }
    .close{
      transform: rotate(180deg);
    }
    .number{
      padding-right: 20px;
    }

    .league-t-wrapper {
      flex: 1;
      line-height: 1;
      min-width: 1.18rem;
      display: flex;
      font-size: 14px;
      &.export {
        min-width: 1.1rem;
      }
    }
    .play_title{
      flex: 1;
      display: flex;
      align-items: center;
      > span {
        flex: 1;
        text-align: center;
      }
    }
     // 添加 line-height: 0.14rem 解决42682 生产BUG--malick
    .match-league {
      width: 3rem;
      line-height: 0.14rem;
      white-space: nowrap;
      overflow: hidden;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      display: block;
      &.match-main-league {
        //max-width: 1.4rem;
      }
    }


    color: var(--q-color-com-fs-color-26);

    font-weight: 600;
  }

  .match-type {
    margin-right: 0.04rem;
    transition: opacity 0.2s;
    opacity: 1;
  }
}

.league-collapse-dir {
  width: 0.12rem;
  height: 0.06rem;
  position: relative;
  right: 0.1rem;
  transition: all 0.3s ease-in;

  &.collapsed {
    transform: rotateZ(180deg);
  }
}

.odd-list {
  line-height: 1;
  background: #fff !important;
  height: auto;
  position: relative;

  &.simple,
  &.result {
    min-height: auto;
  }

  .w-score-result {
    position: absolute;
    right: 0.11rem;
    bottom: 0.13rem;
  }

  .odd-list-inner {
    height: 0.2rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    > div {
      width: 80%;
      flex-shrink: 0;
    }

    .triangle-wrapper {
      width: 0.24rem;
      height: 0.18rem;
      border-radius: 0.1rem 0 0 0.1rem;
      position: absolute;
      right: 0;
      top: 0.12rem;

      .t-w-inner {
        font-size: 0.11rem;
      }
    }

    &.n-s-edition {
      padding-top: 0;

      &:before {
        display: none;
      }
    }

    &.odd {
      &:after {
        width: 100%;
        left: 0;
      }

      &.result {
        padding-top: 8px;
        padding-bottom:8px;
      }
    }

    .w-score-result {
      padding-top: 0.17rem;
    }

    .team-wrapper2 {
      margin-left: -2%;
      padding-left: 0.3rem;
      display: flex;
      align-items: center;
      font-size: 0.1rem;
    }

    .team-wrapper {
      padding-right:10px;
      border-right: 1px solid rgba(88,88,88,.1);

      &.simple {
        transform: translateY(-1px);
      }
      .title-time{
        color: #8a8986;
        font-size: 14px;
        padding-left: 20px;
        .title_cancel{
          font-size: 14px;
          margin-left: 10px;
          color: #ff4646;
        }
      }

      &.team_title {
        .team-title-inner-con {
          width: 1.8rem !important;
          display: flex;
          flex-direction: column;
          align-items: start !important;
          span {
            color: #8a8986;
          }
        }
      }

      .team-title-container {
        display: flex;
        position: relative;
        .team-left{
          width: 15px;
          flex-shrink: 0;
          margin-left: 7px;
          display: flex;
          align-items: center;
        }

        &.simple {
          width: 1.72rem;

          &:first-child {
            margin-bottom: -0.04rem !important;
          }
        }

        .visibility-hidden {
          visibility: hidden;
        }

        &:first-child {
          &.standard {
            margin-bottom: 0.02rem;
          }
        }

        .team-title-inner-con {
          width: 1.31rem;
          position: relative;
          line-height: 0.14rem;
          display: flex;
          align-items: center;
          font-size: 14px;

          /*图标*/
          .team-icon {
            width: 0.18rem;
            height: 0.18rem;
            margin-right: 0.06rem;
            flex-shrink: 0;
            justify-content: center;

            &.logo-is-double {
              width: 0.28rem;
            }

            img,
            .sprite-div {
              display: block;
              width: 0.18rem;
              flex-shrink: 0;
              height: 0.18rem;
              margin-left: .06rem;

              &.is-double-first {
                width: 0.18rem;
                transform: translateX(0.04rem);
              }

              &.is-double-second {
                width: 0.18rem;
                transform: translateX(-0.04rem);
              }
            }
          }

          .gif-text {
            white-space: nowrap;
            margin-left: 3px;
            color: var(--q-color-com-fs-color-31);
            animation: 1s text-flash linear infinite normal;
          }

          .team-t-title-w {
            font-size: 14px;
            height: 24px;
            line-height: 24px;
            width: 100%;
            overflow: hidden;
            flex-shrink: 0;
            align-items: center;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 500;
            color: #1A1A1A;
            &.visiting {
              // color: #8a8986;
            }
          }
        }

        .score-punish {
          width: 0.1rem;
          height: 0.14rem;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.1rem;
          border-radius: 0.02rem;
          color: #fff;
          &.yellow {
            background: #FFA800;
          }
          &.red{
            background: #f00;
          }
          &.flash {
            animation: 1s text-flash linear infinite normal;
          }
        }

        .serving-party {
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--q-color-page-bg-color-59);
          flex-shrink: 0;
          margin: 0.13rem 0.05rem 0;

          &.simple {
            margin-right: 0.03rem;
          }
        }

        .score {
          font-size: 0.14rem;
          display: flex;
          align-items: center;
          position: absolute;
          right: 0.07rem;
          bottom: 0;
          height: 24px;
          font-weight: 600;

          &.simple {
            right: 0.08rem;
          }
        }
      }

      .result.fav-i-wrap-match {
        width: 0.2rem;
        height: 0.2rem;
        flex-shrink: 0;
        margin: 0.05rem 0 0 0.02rem;

        .favorite-icon {
          width: 0.14rem;
          height: 0.14rem;

          img {
            width: 100%;
            height: 100%;
          }

          .f-icon {
            display: none;
          }
        }
      }

      .m-result-time {
        min-width: 0.75rem;
        margin-top: 0.08rem;
        padding-left: 0.03rem;
      }
    }

    &.odd {
      height: auto;
    }

    .match-result-score-wrap {
      padding-top: 0.07rem;
    }

    .score-result-wrapper {
      font-size: 0.16rem;

      .score-row {
        height: 0.16rem;

        &:first-child {
          margin-bottom: 0.15rem;
        }
      }
    }

    .go-to-d-detail-w {
      font-size: 0.14rem;
      margin-left: 0.16rem;

      .go-to-i-detail-i {
        width: 0.68rem;
        height: 0.47rem;
        border-left: 1px solid #f5f5f5;

        .word {
          margin-right: 0.08rem;
          font-size: 0.12rem;
        }

        .go-to-d-icon {
          width: 0.05rem;
          height: 0.08rem;
          display: block;
          color: var(--q-color-com-fs-color-29);
        }
      }
    }
  }
}

/* **************收藏********************** -E*/

/* **************日期********************** -S*/
.date-container {
  width: 100%;
  color: var(--q-gb-t-c-3);
  display: flex;
  align-items: center;
  font-size: 14px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  background: #fff !important;
  .goto-detail {
    .count_span {
      display: flex;
      align-items: center;
    }
  }

  &.simple {
    height: 0.34rem;

    .live-icon-play-btn {
      margin-left: 0.08rem;
      margin-top: -0.01rem;
    }

    .counting-down-up-container {
      height: 0.14rem !important;
    }
  }

  &.n-s-edition {
    &:before {
      top: 0;
      left: 0;
      position: absolute;
      content: ' ';
      display: block;
      width: 100%;
      height: 0.01rem;
      background-color: var(--q-color-com-bg-color-41);
      transform: scaleY(0.5);
    }
  }

  .score-wrapper {
    width: auto;
    font-size: 0.12rem;
    color: var(--q-color-com-fs-color-11);
    line-height: 1;
    white-space: nowrap;
    height: 100%;
    flex-wrap: nowrap;

  }

  .go-container-w {
    width: auto;
    margin-left: 0.06rem;
    height: 100%;
    justify-content: flex-end;
    align-items: center;

    &.favorite {
      height: 0.24rem;
      justify-content: center;
      align-items: center;
      margin-left: 0;
      margin-right: .05rem;
    }

    &.no-margin {
      margin-left: 0;
    }

    &.mcount {
      margin-left: 0.08rem;
    }

    .fav-i-wrap-match {
      height: 0.16rem;

      .favorite-icon {
        height: 100%;

        img {
          width: 0.14rem;
          height: 0.14rem;
        }
      }
    }
   
  }

  .timer-wrapper-c {
    height: 100%;
    color: #999;
    .counting-down-wrap{
      font-size: 13px;
    }

    &.newer {
      margin-left: 0;
    }

    &>div {
      height: auto;
    }
  }

  .favorite-icon-top {
    width: 15px;
    height: 100%;
    height: 14px;
    flex-shrink: 0;
    margin-right: .05rem;
    position: relative;
    top: -1px;

    img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
      margin-top: -2px;
    }

    .f-icon {
      display: none;
    }
  }

  &.no-running-timer-wrapper {
    .live-i-b-wrap {
      margin-left: 0.08rem;
    }
  }

  .live-i-b-wrap {
    height: 0.14rem;
    width: auto;
    display: flex;
    margin-left: 0.08rem;

    .live-icon-btn,
    .live-icon-play-btn {
      width: 0.18rem;
      height: 0.14rem;
    }

    .neutral-icon-btn {
      width: 0.18rem;
      height: 0.14rem;
      /*margin-left: 0.08rem;*/
    }
  }

  .l {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    .favorite-icon {
      position: relative;
      top: -.01rem;
    }

    .date-time {
      white-space: nowrap;
      color: var(--q-color-com-fs-color-37);
    }

    .counting-down-up-container {
      width: 1rem;
      height: .14rem;
      :deep(.counting-down-wrap){
        width: auto !important;
      }

      &.intermission {
        width: 0.57rem;
      }

      &.long-time {
        width: 0.86rem;
      }

      .match-type {
        margin-right: 0.14rem;
      }
    }

    .special-match-container {
      .counting-down-wrap {
        position: unset;
        display: inline-flex;
      }
    }

    .week-mcid {
      margin: 0 0 0 0.09rem;

      span {
        height: 0.12rem;
        line-height: 1;
      }
    }

    &.test-match-mf {
      .week-mcid {
        margin: 0 0.06rem 0 0;
      }
    }
  }

  .add_text {
    font-size: 0.12rem;
    .icon-wapper-more{
      transform: rotate(-90deg);
    }
  }

  .mfo-title {
    margin-right: .05rem;
  }

  .flag-chuan {
    margin-left: .1rem;
    padding: 0 .01rem;
    height: 0.16rem;
    line-height: .16rem;
    border-radius: .03rem;

    &.special-lang {
      margin-left: .06rem;
    }
  }
}

.mcmt-text {
  color: #1A1A1A;
  font-size: .12rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  .icon-wapper-more{
      transform: rotate(-90deg);
      margin-left: .04rem;
    }
}
/* **************日期********************** -E*/

/* ********赛事容器相关********** -E*/
</style>
  
