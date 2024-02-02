<!--
 * @Description: app-h5 赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div class="match-container component match-container-main-template1"
    :class="[{
      jinri: MenuData.is_today(),
      zaopan: MenuData.is_zaopan(),
      gunqiu: MenuData.is_scroll_ball(),
    }]" 
    :style="{ marginTop: is_hot ? '0' : '' }">
    <template v-if="match" >
      <!-- 开赛标题  -->
      <div v-if="is_show_opening_title && !is_mix_no_today" @click.stop="handle_ball_seed_fold"
        :class="['match-status-fixed', { progress: +match.start_flag == 1, not_begin: +match.start_flag == 2 }]" >
        <!-- 进行中 -->
        <template v-if="+match.start_flag === 1">
          <div class="match-status-title">
          <!-- 进行中 -->
            <img :src="in_progress" /> <span class="din-regular">{{ i18n_t('list.match_doing') }}</span>
          </div>
          <!-- <img :class="['expand_item', {collapsed: progress_seed_collapsed}]" :src="expand_item" alt=""> -->
          <div :class="['expand_item', {collapsed: progress_seed_collapsed}]" :style="compute_css_obj({key: 'h5-kyapp-expand-lague'})"></div>
        </template>
        <!-- 未开赛 -->
        <template  v-if="+match.start_flag === 2">
          <div class="match-status-title">
            <img :src="not_begin" /> <span class="din-regular"> {{ i18n_t('list.match_no_start') }}</span>
          </div>
          <!-- <img :class="['expand_item', {collapsed: not_begin_collapsed}]" :src="expand_item" alt=""> -->
          <div :class="['expand_item', {collapsed: not_begin_collapsed}]" :style="compute_css_obj({key: 'h5-kyapp-expand-lague'})"></div>
        </template>
      </div>
      <div class="all-league-title" v-if="is_show_opening_title && is_mix_no_today"  @click.stop="handle_ball_seed_fold">
        <div> <img :src="icon_date" alt=""> <span>{{ is_mix_no_today }}</span> </div>
        <!-- <img :class="['expand_item', {all_ball_seed_collapsed: !all_ball_seed_collapsed}]" :src="expand_item" alt=""> -->
        <div :class="['expand_item', {all_ball_seed_collapsed: not_begin_collapsed}]" :style="compute_css_obj({key: 'h5-kyapp-expand-lague'})"></div>
      </div>
      <!-- 全部 -->
      <div class="all-league-title" v-if="match?.source_index === 0 && is_show_all" @click.stop="handle_all_ball_seed_fold">
        <div> <img :src="icon_date" alt=""> <span>{{ get_date_time }}</span> </div>
        <!-- <img :class="['expand_item', {all_ball_seed_collapsed: !all_ball_seed_collapsed}]" :src="expand_item" alt=""> -->
        <div :class="['expand_item', {all_ball_seed_collapsed: !all_ball_seed_collapsed}]" :style="compute_css_obj({key: 'h5-kyapp-expand-lague'})"></div>
      </div>
      <!-- 缓冲容器， 避免滚动时骨架屏漏光问题 -->
      <div class="buffer-container" v-if="is_show_buffer_container"></div>
      <!--体育类别 -- 标题  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 @click.stop="handle_ball_seed_fold"-->
      <div v-if="show_sport_title" @click.stop
        :class="['sport-title match-indent', { home_hot_page: is_hot, is_gunqiu: [1].includes(+menu_type), first: i == 0, }]">
        <span class="score-inner-span">
          {{ match_of_list.csna || get_current_manu_name() }} ({{ get_match_count }}) 
        </span>
      </div>

      <!-- 最核心的div模块     标题 + 倒计时 + 比分 + 赔率盘口模块 -->
      <div :class="['match-inner-container', {'collapsed': !collapsed}]">
        <!--联赛标题 -->
        <div @click="handle_league_fold" v-if="match.is_show_league || (is_hot && get_league_show(i))"
          :class="[('league match-indent hairline-border'), { 'no-radius': show_sport_title, 'collapsed': !collapsed}]">
          <div class="league-t-wrap right-border">
          <!-- <div class="league-t-tubiao"></div> -->
            <!-- 联赛收藏 -->
            <div v-if="![3000, 900].includes(+menu_type) && !is_esports && !is_mix" class="favorited-icon" @click.stop="handle_league_collect">
              <!-- 未收藏 compute_img_url('icon-favorite')-->
              <img v-if="!league_collect_state" :src="not_favorite_app" alt="">
              <!-- 收藏图标 compute_img_url('icon-favorite-s')-->
              <img v-if='league_collect_state' :src="normal_img_is_favorite">
            </div>
            <span :class="['league-title-text row justify-between', { 'no-favorited': is_mix }]">
              <span :class="['league-t-wrapper', { 'league-t-main-wrapper': menu_type !== 28, export: is_esports }]">
                <span class="match-league ellipsis-2-lines" :class="{ 'match-main-league': menu_type !== 28, 'favorited-icon-hidden': MenuData.is_mix() }">
                  {{ match.tn }}
                </span>
              </span>
              <span class="league-right">
                  <!-- <template v-if="!collapsed">
                    <span> {{ get_ball_seed_league_count }} </span>
                  </template> -->
                  <IconWapper color="#c9c9c9" name="icon-arrow" size="14px"  :class="['icon-wapper', {'close': collapsed}]" />
              </span>
            </span>
          </div>

        </div>
        <!-- 卡片主内容 -->
        <div :class="['match-content', { 'collapsed': collapsed, 'border-raduis': is_show_border_raduis || is_last }]" v-if="collapsed">
          <div class="match-content-line" v-if="!match.is_show_league"></div>
          <!--标准版 赔率标题栏-->
          <div class="odd-title-wraper row " v-if="match.is_show_league" @click.stop :style="{width: collapsed ? '100%' : 0}">
            <div class="odd-title-i-w flex">
              <div class="odd-t-i-wrapper flex items-center"
                :class="{ 'status2': PageSourceData.standard_odd_status.value == 1 && i18n_t('list_title.' + match.csid + '.title').length > 3 }">
                <div class="hpl-title row items-center justify-center" :class="{ 'boxing': match_of_list.csid == 12 }"
                  :key="i" v-for="(hpl_title, i) of i18n_t('list_title.' + match.csid + '.title')">
                  <div class="hpl-t-inner"> {{ hpl_title }} </div>
                </div>
              </div>
            </div>
          </div>
          <!--  一整块赛事的 div 内容 ： 1. 左边 【时间，队名，比分】   2. 右边 【赔率 模块】  -->
          <div :class="['match-odds-container study_height_s hairline-border']">
            <div class="match-odds-container-border-radius">
            
              <!-- 上边的 赛事日期标准版,包含 比分组件 -->
              <div class="date-container match-indent" v-if="!show_newer_edition && !is_results">
                <div class='l standard'>
                
                  <!--竞彩足球 星期与编号-->
                  <div class="week-mcid row items-center" v-if="menu_type == 30">
                    <span class="din-regular"> {{ lodash.get(match,'mcid')}} </span>
                  </div>
                  <!--赛事列表收藏 串关坏境下隐藏-->
                  <div class="favorite-icon-top match list-m" v-if="!is_mix" @click.stop="handle_match_collect">
                    <!-- 未收藏图标 compute_img_url('icon-favorite')-->
                    <img v-if="!match_collect_state" :src="not_favorite_app" alt="">
                    <!-- 收藏图标 compute_img_url('icon-favorite-s')-->
                    <img v-if='match_collect_state' :src="normal_img_is_favorite">
                  </div>
                  <!-- 赛事日期标准版 -->
                  <div :class="['timer-wrapper-c flex items-center', { esports: is_esports }]">

                    <!--开赛日期 ms != 110 (不为即将开赛)  subMenuType = 13网球(进行中不显示，赛前需要显示)-->
                    <div class="date-time" v-show="match.ms != 110 && !show_start_counting_down(match) && !show_counting_down(match)">
                      {{ format_time_zone(+match.mgt).Format(i18n_t('time11')) }}
                    </div>
                    <!-- 赛事回合数mfo match.ms != 1(不为开赛)-->
                    <div v-if="match.mfo && match.ms != 1" class="mfo-title" :class="{ 'is-ms1': match.ms == 1 }">
                      {{ match.mfo }}
                    </div>

                    <!--即将开赛 ms = 110-->
                    <div class="coming-soon" v-if="match.ms" v-show="match.ms == 110">
                      {{ i18n_t(`ms[${match.ms}]`) }}
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
                  <!-- <div v-if="is_esports && match.ispo" class="flag-chuan" -->
                  <div v-if="is_esports && match.ispo"  class="flag-chuan-icon" 
                    :class="{ 'special-lang': ['zh', 'tw', 'hk'].includes(lang) }"
                    :style="compute_css_obj({key:'h5-kyapp-crosstalk-icon'})">
                    <!-- {{ i18n_t('match_info.match_parlay') }} -->
                  </div>
                </div>
                <!--玩法数量-->
                <div class="right-score">
                  <div class="goto-detail" @click='goto_details(match)'>
                    <span class="count_span" :class="{ esports: is_esports }">
                      <span class="mc-n">
                        {{GlobalAccessConfig.get_handicapNum()? get_match_mc(match) : i18n_t('footer_menu.more') }}+
                      </span>
                      <span class="add_text" v-if="GlobalAccessConfig.get_handicapNum()">
                        <IconWapper color="#888" name="icon-triangle1" size="14px" class="icon-wapper-more" />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 下边的模块，左方是  队名和 队比分,  右面是  盘口  模块 -->
              <div class="odd-list match-indent" :class="{ 'simple': show_newer_edition, result: is_results }">
                <div class="odd-list-inner odd" :class="{ 'n-s-edition': !show_newer_edition, result: is_results }">
                  <!--赛果-->
                  <div v-if="is_results && match.tonum && menu_lv2.mi == 29" class="triangle-wrapper flex items-center justify-center">
                    <div class="t-w-inner"> {{ match.tonum }} </div>
                  </div>
                  <!--  左边 图片和名称  和 比分 和 视频图标 -->
                  <div @click='goto_details(match)' :class="['team-wrapper', { simple: standard_edition == 1, team_title: is_results }]">
                    <!--主队图片和名称-->
                    <div class='team-title-container' :class="{
                      simple: show_newer_edition && !is_results,
                      standard: !show_newer_edition && !is_results,
                      result: is_results,
                      column2: ![1,4,16].includes(+match.csid)
                    }">
                      <div class="team-title-inner-con">
                        <div class='team-t-title-w' :class="{
                          'is-handicap': match.handicap_index == 1,
                          'is-handicap-1': match.handicap_index == 2,
                        }">
                          <div class="name"> <span>{{ match.mhn }}</span> </div>
                          <!--发球方绿点-->
                          <span class="serving-party" :class="{ 'simple': standard_edition == 1 }"
                            v-show="set_serving_side(match_of_list, 'home')">
                          </span>
                          <template v-if="home_red_score">
                            <!-- 红牌 -->
                            <span class='score-punish red' :class="{ flash: is_show_home_red && !is_results }"> {{ home_red_score }} </span>
                          </template>
                          <!-- 进球动画 -->
                          <div class="yb-flex-center" v-if="is_show_home_goal && is_new_init2 && (!is_show_away_goal)">
                            <div class="yb-goal-gif" :class="{ 'yb-goal-yo': (theme || []).includes('y0') }"></div>
                            <div class="gif-text">{{ i18n_t('match_result.goal') }}</div>
                          </div>
                        </div>
                      </div>
                      <!--进行中的赛事显示比分 ,如果是比分判定中，则不显示比分-->
                      <div class="score full-score" v-show="match_of_list.ms > 0 && !is_results && !eports_scoring"
                        :class="{ 'visibility-hidden': match_of_list.ms == 110 }">
                        {{ home_score }}
                      </div>

                    </div>
                    <!--客队图片和名称-->
                    <div class='team-title-container' :class="{
                      simple: show_newer_edition,
                      standard: !show_newer_edition && !is_results,
                      result: is_results,
                      column2: ![1,4,16].includes(+match.csid)
                    }">
                      <div class="team-title-inner-con">
                        <div class='team-t-title-w' :class="{
                          'is-handicap': match.handicap_index == 2,
                          'is-handicap-1': match.handicap_index == 1,
                        }">
                          <div class="name"> <span>{{ match.man }}</span> </div>
                          <!--发球方绿点-->
                          <span class="serving-party" :class="{ 'simple': standard_edition == 1 }"
                            v-show="set_serving_side(match_of_list, 'away')">
                          </span>
                          <template v-if="away_red_score">
                            <!-- 红牌 -->
                            <span class='score-punish red' :class="{ flash: is_show_away_red && !is_results}"> {{ away_red_score }}</span>
                          </template>
                          <!-- 进球动画 -->
                          <div class="yb-flex-center" v-if="is_show_away_goal && is_new_init2 && (!is_show_home_goal)">
                            <!-- 进球图标 -->
                            <div class="yb-goal-gif yb-goal-yo"></div>
                            <div class="gif-text">{{ i18n_t('match_result.goal') }}</div>
                          </div>
                        </div>
                      </div>
                    <!--进行中的赛事显示比分 ,如果是比分判定中，则不显示比分-->
                    <div class="score full-score" v-show="match_of_list.ms > 0 && !is_results && !eports_scoring"
                      :class="{ 'visibility-hidden': match_of_list.ms == 110 }">
                      {{ away_score }}
                    </div>

                  </div>
                  
                </div>
                <!--  -->
                <div class="right-content-style">
                  <!-- 右边盘口组件 -->
                  <OddListWrap :match="match_of_list" />
                </div>
                </div>
              </div>
              <div class="card-footer">
                <!--  左边收藏  视频动画 图标 玩法数量  赛事分析图标 提前结算图标  -->
                <div class="score-wrapper flex items-center" v-if="!show_newer_edition && !is_results"
                  v-show="footer_menu_id != 114">
                  <div class="r row no-wrap">
                    <div class="go-container-w flex no-wrap new-standard">
                      <!-- 直播 主播 视频 动画  icon 栏目   -->
                      <!-- 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画 -->
                      <div v-if="lodash.get(UserCtr, 'user_info.ommv')" class="live-i-b-wrap v-mode-span row items-center" @click="media_button_handle">
                        <img :class="['live-icon-btn', { disabled: !media_button_state_obj.animationUrl }]" :src='animation_icon' />
                      </div>
                      <!-- 视频 -->
                      <div class="live-i-b-wrap v-mode-span row items-center" @click="media_button_handle">
                        <img :class="['live-icon-btn', { disabled: !media_button_state_obj.muUrl }]" :src='video_icon' />
                      </div>
                      <!-- mng 是否中立场   1:是中立场，0:非中立场-->
                      <div class="live-i-b-wrap v-mode-span row items-center"
                        v-if="![5, 10, 7, 8, 13].includes(Number(match.csid)) && match.mng * 1">
                        <img class="neutral-icon-btn l-bottom" :src='midfield_icon_app' />
                      </div>
                      <!-- 角球 -->
                      <div class="live-i-b-wrap v-mode-span row items-center" @click="media_button_handle" v-if="match.csid == 1 && get_corner_kick">
                        <img :class="['live-icon-btn']" :src='corner_icon' />
                      </div>
                      <!-- 此赛事支持提前结算 -->
                      <div class="column justify-center " v-if="match_of_list.mearlys == 1" @click.stop>
                        <img :src="mearlys_icon_app" alt="">
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 展示三行的不展示比分 -->
                <template v-if="![1, 4, 11, 14, 15, 16].includes(+match.csid)">
                  <div class="score-content">
                    <ScoreList :class="[[7, 9].includes(+match.csid) && 'score-content-snooker']" :match="match_of_list" />
                  </div>
                </template>
              </div>
            </div>
          </div>
          <!-- 次要玩法 DOM -->
          <div class="secondary-game-play" v-if="[1,2,5,7,8].includes(+match.csid) && standard_edition != 1" @click.stop>
            <MatchContainerSecondTemplate2
              :i="i"
              :match="match_of_list"
            ></MatchContainerSecondTemplate2>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
  
<script>

import { ref, computed, watch, nextTick } from 'vue'
import { IconWapper } from 'src/components/icon'
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import ScoreList from 'src/base-h5/components/match-container/template/app/components/score-list.vue';
import ImageCacheLoad from "src/core/public-cache-image/public-cache-image.vue";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import OddListWrap from 'src/base-h5/components/match-container/template/app/components/odd-list-wrap.vue';
import MatchContainerSecondTemplate2 from 'src/base-h5/components/match-container/second/match-container-second-template2.vue'
import { i18n_t,format_M_D, compute_img_url, compute_css_obj, MenuData, LOCAL_PROJECT_FILE_PREFIX ,PageSourceData, format_time_zone, UserCtr } from "src/output/index.js"
import { in_progress, not_begin, animation_icon, video_icon, icon_date, expand_item,
  normal_img_not_favorite_white, not_favorite_app, normal_img_is_favorite, corner_icon, mearlys_icon_app, midfield_icon_app } from 'src/base-h5/core/utils/local-image.js'

import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2, is_detail, is_esports, is_results, footer_menu_id, is_zaopan, date_time, is_mix } from 'src/base-h5/mixin/menu.js'

import default_mixin from '../../mixins/default.mixin.js'

export default {
  name: "match-container-main-template1",
  mixins: [default_mixin],
  props: {
    // 当前组件的赛事数据对应列表的赛事
    match_of_list: Object,
    // 赛事处于列表中的下标
    i: Number,
  },
  components: {
    ScoreList,
    IconWapper,
    OddListWrap,
    ImageCacheLoad,
    CountingDownStart,
    CountingDownSecond,
    MatchContainerSecondTemplate2,
  },
  setup (ctx) {
    // 是否显示球种标题
    const show_sport_title = computed(() => {
      const { is_show_ball_title } = ctx.match_of_list
      return is_show_ball_title
    })
    const get_date_time = computed(() => {
      return is_zaopan.value&&Number(date_time.value)>0?format_M_D(date_time.value):i18n_t("filter.all_leagues")
    })

    const is_mix_no_today = computed(() => {
      return (is_mix.value && Number(date_time.value)>0) ? format_M_D(date_time.value) : ''
    })

    return { 
      UserCtr, lang, theme, i18n_t, compute_img_url, format_time_zone, GlobalAccessConfig, footer_menu_id,LOCAL_PROJECT_FILE_PREFIX,in_progress,not_begin, MenuData, get_date_time,
      is_hot, menu_type, menu_lv2, is_detail, is_esports, is_results, standard_edition, compute_css_obj, show_sport_title, animation_icon, video_icon,icon_date, is_mix,
      normal_img_not_favorite_white,not_favorite_app, normal_img_is_favorite, PageSourceData, corner_icon, mearlys_icon_app, midfield_icon_app, is_zaopan, expand_item,
      is_mix_no_today,
    }
  }
}

</script>
   
<style scoped lang="scss">
/* ********赛事容器相关********** -S*/
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
.match-status-title {
  display: flex;
  align-items: center;
}
.all-league-title{
  display: flex;
  height: 25px;
  background: var(--q-gb-bg-c-25);
  padding: 0 15px;
  align-items: center;
  justify-content: space-between;
  border-top: 2px solid var(--q-gb-bd-c-3);
  > div {
    display: flex;
    align-items: center;
    > span {
      padding-left: 5px;
      line-height: 30px;
      color:var(--q-gb-t-c-18);
    }
  }
  .expand_item{
    width: 0.2rem;
    height: 16px;
    transition: transform 0.25s ease;
    transform: rotate(-90deg);
  }
  .ball_seed_collapsed{
    transform: rotate(0);
  }
  .all_ball_seed_collapsed {
    transform: rotate(0);
  }
}
.match-content-line {
  width: 100%;
  height: 1px;
  background: var(--q-gb-bd-c-4);
}
.match-container {
  width: 100%;
  height: auto;
  position: relative;
  &.border_top{
    border-top: 1px solid var(--q-gb-bd-c-4);
  }
  &.is_zaopan{
    .progress{
      border-color: #FEBE55;
    }
  }

  .match-status-fixed {
    width: 100%;
    height: 25px;
    line-height: 1;
    font-size: 0.12rem;
    padding-left: 0.17rem;
    display: flex;
    align-items: center;
    color: var(--q-gb-t-c-18);
    background: var(--q-gb-bg-c-25);
    justify-content: space-between;
    &.progress{
      // border-top: 2px solid var(--q-gb-bd-c-1);
      border-top: 2px solid var(--q-gb-bd-c-1);
    }
    &.not_begin{
      // border-top: 2px solid var(--q-gb-bd-c-13);
      border-top: 2px solid rgba(233, 91, 91, 0.51);

    }

    img {
      margin-right: .06rem;
      width: .13rem;
      height: .13rem;
    }
    .expand_item{
      transition: transform 0.25s ease;
      transform: rotate(-90deg);
      width: 20px;
      height: 16px;
      margin-right: 14px;
    }
    .collapsed{
      transform: rotate(0);
    }
  }

  .v-mode-span {
    margin-right: 0.1rem;
  }
  .buffer-container{
    // background: var(--q-gb-bg-c-18);
    height: 5px;
  }
  .match-inner-container {
    padding: 0 0.05rem;
    margin: 0 auto;
    /* 兼容iPhone11边框显示不全 */
    //width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    // background: var(--q-gb-bg-c-15);
    // background: var(--q-gb-bg-c-18);
    // padding-top: 0.05779rem;  /* 兼容iPhone11边框显示不全 */
    &.show-sport {
      border-top-left-radius: 0.08rem;
      border-top-right-radius: 0.08rem;
    }
    .match-content{
      width: 100%;
      padding: 0 10px;
      // border-top: 1px solid  var(--q-gb-bd-c-4);
      background: var(--q-gb-bg-c-18);
      //border-radius: 0 0 8px 8px;
      border: 1px solid var(--q-gb-bd-c-15);
      border-bottom-color: var(--q-gb-bg-c-18);
      &.collapsed{
        border-top: none;
        // border-radius: 0 0 0.08rem 0.08rem;
      }
      &.border-raduis{
        border-bottom: 1px solid var(--q-gb-bd-c-15);
        border-radius: 0 0 0.08rem 0.08rem;
      }
    }
    > .match-indent{
      border: 1px solid var(--q-gb-bd-c-15);
      border-radius: 8px 8px 0 0;
      border-bottom: 1px solid  var(--q-gb-bd-c-4) !important;
      &.collapsed{
        border-radius: 8px;
        border-bottom: 1px solid var(--q-gb-bd-c-15) !important;
        border: 1px solid var(--q-gb-bd-c-15);
      }
    }
    .secondary-game-play{
      position: relative;
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
    display: block;
    position: relative;
    height: 132px;
    // background: var(--q-gb-bg-c-18);

    .match-odds-container-border-radius {
      overflow: hidden;
    }
    &.border-top{
      border-top: 1px solid var(--q-gb-bd-c-4);
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

  .match-indent {
    width: 100%;
    margin: 0 auto;
    // background: var(--q-gb-bg-c-17);
    &.bottom{
      margin-top: 0.05rem;
    }
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

  .sport-title {
    width: 100%;
    height: 20px;
    border-radius: 0;
    font-size: 12px;
    padding: 0 5px 0 17px;
    background: var(--q-gb-bg-c-21);
    line-height: 20px;
    // font-size: 11px;
    .league-collapse-dir{
      display: none;
    }

    &.first {
    }

    .score-inner-span {
      width: 100%;
      //transform: translateY(-3px);
      color: var(--q-gb-t-c-24);
    }

    &.home_hot_page {
      width: 100%;
      // height: unset;
      padding-left: unset;
      // display: unset !important;
      height: 0.5rem !important;
      margin-top: .03rem;
      transform: translateY(0);

      &.first {
        margin-top: 0;
      }

      .ball_img {
        width: 100%;
        text-align: center;
        height: 0.5rem;
        overflow: hidden;
        margin-top: -0.06rem;

        > img,.img {
          width: 100%;
          object-fit: cover;
          height: 100%;
          background-color: var(--q-gb-bg-c-17);
        }

        >span {
          position: absolute;
          top: 56%;
          left: 50%;
          transform: translate(-50%, -50%);

          font-size: 0.16rem;
          display: flex;
          align-items: center;
          justify-content: center;

          >i {
            display: inline-block;
            margin-right: 0.05rem;
            width: 0.18rem;
            height: 0.18rem;
            background-size:  0.18rem 2.3rem;
          }

          @each $bg,
          $y in (s2: 1, s5: 2, s7: 3, s10: 4, s8: 5, s9: 6, s4: 7, s3: 8, s6: 9) {
            .#{$bg} {
              background-position-y: calc(var(--per) * #{$y});
            }
          }

          >p {
            position: relative;
            top: 0.02rem;
          }
        }
      }
    }

    &.hidden_sport {
      display: none !important;
    }

    .icon_match_cup,
    .icon_notstarted {
      margin-right: 0.1rem;
      font-size: 0.12rem;

      &:before {
        color: var(--q-color-com-fs-color-35);
      }
    }

    .icon_notstarted {
      &:before {
        color: var(--q-color-com-fs-color-36);
      }
    }

    &.menu-type-3 {
      height: 0.25rem;
      border-top: 1px solid var(--q-color-com-border-color-19);
      background-color: var(--q-color-com-bg-color-12);
      font-weight: bold;
      box-shadow: var(--q-color-box-shadow-color-3);
      position: relative;
      z-index: 2;
      padding-left: 0;

      &.not-playing {
        &:before {
          background: var(--q-color-com-bg-color-38);
        }
      }

      &:before {
        margin-right: 0.1rem;
        display: block;
        content: ' ';
        width: 0.04rem;
        height: 100%;
        background: var(--q-color-com-bg-color-39);
      }
    }
  }

  /* **************体育展示********************** -E*/

  /* **************联赛展示********************** -S*/
  .league {
    height: 25px;
    border-radius: 0;
    // padding: 0 0.1rem;
    background:var(--q-gb-bg-c-18);
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
        width: 14px;
        height: 14px;
        margin: 0 8px 0 11px;
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
    height: 20px;
    position: relative;
    flex-wrap: nowrap;
    display: flex;
    font-size: 0.1rem;
    color: var(--q-gb-t-c-20);
    flex-direction: row-reverse;
    // background: var(--q-gb-bg-c-18);
    border-bottom: 1px solid var(--q-gb-bd-c-4);

    .odd-title-i-w {
      // width: 1.84rem;
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
    font-weight: 600;
    &.no-favorited{
      padding-left: 15px;
    }
    .icon-wapper{
      margin-right: 6px;
      transform: rotate(90deg);
    }
    .close{
      transform: rotate(180deg);
    }

    .league-t-wrapper {
      line-height: 1;
      min-width: 1.18rem;
      display: flex;
      font-size: 12px;
      &.export {
        min-width: 1.1rem;
        margin-left: 0.1rem;
      }
    }
     // 添加 line-height: 0.14rem 解决42682 生产BUG--malick
    .match-league {
      color: var(--q-gb-t-c-18);
      line-height: 0.14rem;
      &.match-main-league {
        //max-width: 1.4rem;
      }
      &.favorited-icon-hidden{
        // margin-left: 10px;
      }
    }
    .league-right{
      height: 100%;
      display: flex;
      align-items: center;
      > span {
        color: #c9c9c9;
        padding-right: 3px;
        color: #c9c9c9;
      }
      > i {
        // position: relative;
        // top: -1px;
      }
    }
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
  background-color: var(--q-color-com-bg-color-12);
  height: auto;
  position: relative;
  height: 1.12rem;
  z-index: 100;

  .right-content-style {
    position: relative;
    // width: 1.84rem;
    flex: 1;
    flex-shrink: 0;
  }

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
    padding-left: 2px;

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
        padding-top: 0.1rem;
        padding-bottom: 0.1rem;
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
      min-height: 100%;
      height: auto;
      // width: 1.72rem;
      flex: 1;
      position: relative;
      z-index: 1;

      &.simple {
        transform: translateY(-1px);
      }

      &.team_title {
        .team-title-inner-con {
          width: 1.8rem !important;
        }
      }

      .score-wrapper {
        position: absolute;
        bottom: 0;

        .score-section {
          padding-left: 0;
          transform: translateX(-0.02rem);
        }

        .go-container-w {
          .goto-detail {
            display: flex;
            height: auto;
            align-items: center;

            .count_span {
              height: 0.11rem;
              display: flex;
              align-items: flex-end;
              margin-right: 0.04rem;
              line-height: 1;
              top: 2px;
              position: relative;
            }

            .icon_arrow_down {
              width: 0.04rem;
              height: 0.07rem;
              display: block;
            }
          }

          .favorite-icon {
            width: 0.14rem;
            height: 0.14rem;
            margin-right: 0.05rem;

            img {
              width: 100%;
              height: 100%;
            }

            .f-icon {
              display: none;
            }
          }
        }

        .week-mcid {
          margin: 0 0 0 0.09rem;

          span {
            height: 0.12rem;
            line-height: 1;
          }
        }
      }

      .team-title-container {
        height: 0.32rem;
        display: flex;
        justify-content: space-between;
        position: relative;
        text-overflow:ellipsis;
        white-space: wrap;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        &.column2{
          height: 35px;
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
          // width: 1.19rem;
          position: relative;
          line-height: 0.14rem;
          display: flex;
          flex: 1;
          align-items: center;
          color: var(--q-gb-t-c-18);
          .yb-flex-center{
            padding-left: 2px;
            .yb-goal-gif{
              background-image: url($SCSSPROJECTPATH+"/image/common/goal_gif.png");
            }
          }
          

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
            overflow: hidden;
            display: flex;
            align-items: center;
            font-size: 0.12rem;
            color: var(--q-gb-t-c-18);
            &.is-handicap {
              color: var(--q-gb-t-c-34) !important;
            }
            .name{
              overflow: hidden;
              display: flex;
              font-size: 0.12rem;
              flex-shrink: 0;
              flex: 1;
              display: -webkit-box;
              color: var(--q-gb-t-c-18);
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              word-break: break-all;
            }
          }
        }

        .score-punish {
          width: 0.12rem;
          height: 0.14rem;
          flex-shrink: 0;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          font-size: 0.1rem;
          border-radius: 0.02rem;
          margin-left: 0.04rem;
          color: var(--q-gb-t-c-14);
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
        //   display: block;
        //   width: 4px;
        //   height: 4px;
        //   border-radius: 50%;
        //   background: var(--sys-feedback-success-success-400, #4AB06A);
        //   flex-shrink: 0;
        //   position: absolute;
        //   left: 1.25rem;
        //   top: 0.16rem;
          border-radius: 2px;
          background: var(--sys-feedback-success-success-400, #4AB06A);
          width: 4px;
          height: 4px;
          margin-left: 4px;

          &.simple {
            margin-right: 0.03rem;
          }
        }

        .score {
          height: 100%;
          font-size: 0.12rem;
          display: flex;
          align-items: center;
          // position: absolute;
          // right: 0.07rem;
          // bottom: 0;
          font-weight: 600;
          margin: 0 8px;
          color: var(--q-gb-t-c-18);

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

.card-footer{
  position: absolute;
  bottom: 2px;
  width: 100%;
  height: 25px;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .go-container-w {
    width: auto;
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

    .goto-detail {
      width: 30px;
      .count_span {
        .mc-n {
          width: 0.14rem;
        }
      }
    }
  }
  .new-standard {
    .live-i-b-wrap {
      width: 0.18rem;
      margin-right: 0.05rem;

      img {
        height: 0.16rem;
        width: 0.16rem;
      }

      .live-icon-btn {
        width: 100%;
        &.disabled{
          filter: grayscale(100%)
        }
      }

      .live-icon-play-btn {
        width: 100%;
        height: 0.14rem;
      }
    }
  }
}
.score-content{
  flex: 1;
  // width: 80%;
  :deep(.score-section){
    height: 100%;
  }
  :deep(.score-se-inner2){
    display: flex;
    // flex-direction: row-reverse;
  }
  :deep(.scroll-container-w){
    .score-fle-container-1{
      position: relative;
      top: 1px;
      .items-start {
        display: inline-block;
        height: 100%;
        line-height: .25rem;
      }
    }
    .score-se-inner{
        width: 100%;
        height: auto;
        max-width: 100%;
        .score-se-inner2{
          height: 25px;
          justify-content: end;
          margin-left: -5px;
          .b-score-wrapper{
            flex-wrap: nowrap;
            .mfo-title{
              flex-shrink: 0;
            }
          }
        }
      }
    }
  }
  .score-content-snooker {
    :deep(.scroll-container-w){
      .score-fle-container-1{
        display: block;
        flex: 1;
        // width: 1.18rem;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
        text-align:right;
        padding-right: .32rem;
        .items-start {
          &:last-child {
            position: absolute;
            right: .02rem;
          }
        }
      }
    }
  }

/* **************收藏********************** -E*/

/* **************日期********************** -S*/
.date-container {
  background-color: var(--q-color-com-bg-color-12);  
  width: 100%;
  color: var(--q-gb-t-c-19);
  padding-left: 1px;
  height: 0.2rem;
  display: flex;
  align-items: center;
  margin: 0 auto;
  font-size: 0.11rem;
  align-items: center;
  justify-content: space-between;

  .right-score{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
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


  .timer-wrapper-c {
    position: relative;
    top: 0px;
    height: 100%;
    color: var(--q-gb-t-c-19);

    &.newer {
      margin-left: 0;
    }

    &>div {
      height: auto;
    }
    .date-time{
      position: relative;
      top: 1px;
      font-size: 0.12rem,
    }
    .coming-soon{
      position: relative;
      top: 1px;
    }
  }

  .favorite-icon-top {
    width: 0.15rem;
    height: 100%;
    height: 0.15rem;
    flex-shrink: 0;
    margin-right: .07rem;
    position: relative;

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
    }

    .date-time {
      white-space: nowrap;
      color: var(--q-color-com-fs-color-37);
    }
    .coming-soon{
      font-size: 0.12rem;
    }

    :deep(.start-counting-down){
      .counting-down-start{
        font-size: 11px;
      }
    }

    .counting-down-up-container {
      width: 1rem;
      height: .14rem;

      &.intermission {
        width: 0.57rem;
      }

      &.long-time {
        width: 0.86rem;
      }

      .match-type {
        margin-right: 0.14rem;
      }
      
      :deep(.counting-down-wrap){
        color: #AFB3C8 !important;
        width: 150px !important;
        .counting{
          font-size: 0.12rem;
          color: var(--q-gb-t-c-19);
          // margin-bottom: 1px;
        }
        .special{
          font-size: 0.12rem;
        }
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
    // margin-left: .05rem;
    // margin-top: .02rem;
    // margin-right: .02rem;
    margin: .02rem .02rem 0 .05rem;
    font-size: 0.12rem;
  }

  .flag-chuan-icon {
    margin-left: .1rem;
    padding: 0 .01rem;
    height: 0.2rem;
    width: 0.2rem;
    line-height: .16rem;
    border-radius: .03rem;
    // margin-top: 0.6rem;
    background: cover;
    &.special-lang {
      margin-left: .06rem;
    }
  }
}
.match-list-container.jingzu {
  .date-container {
    .l .week-mcid {
      margin: 0 0.06rem 0 0 !important;
    }
  }
}
/* **************日期********************** -E*/

/* ********赛事容器相关********** -E*/
</style>
  
