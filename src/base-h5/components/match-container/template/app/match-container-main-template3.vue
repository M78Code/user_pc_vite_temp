<!--
 * @Description:   app-h5   赛果
-->
<template>
    <div :class="['match-inner-container', {'collapsed': !collapsed}]">
         <!-- 缓冲容器， 避免滚动时骨架屏漏光问题 -->
        <div class="buffer-container" v-if="match.is_show_league && i !== 0"></div>
        <!--联赛标题 -->
        <div @click="handle_league_fold" v-if="match.is_show_league || (is_hot && get_league_show(i))"
          :class="[('league match-indent hairline-border'), { 'no-radius': get_sport_show, 'no-border': !collapsed}]">
          <div class="league-t-wrap right-border">
          <!-- <div class="league-t-tubiao"></div> -->
            <!-- 联赛收藏 -->
            <div v-if="![3000, 900].includes(menu_type)" class="favorited-icon" @click.stop="handle_league_collect">
              <!-- 未收藏 -->
              <img v-if="!league_collect_state" :src="compute_img_url('icon-favorite')" alt="">
              <!-- 收藏图标 -->
              <img v-if='league_collect_state' :src="compute_img_url('icon-favorite-s')">
            </div>
            <!-- 电竞图标 写死 -->
            <div class="esport" v-if="match_of_list.csid == 101" :style="compute_css_obj('menu-sport-active-image', 2101)"></div>
            <div class="esport" v-else-if="match_of_list.csid == 103" :style="compute_css_obj('menu-sport-active-image', 2103)"></div>
            <div class="esport" v-else-if="match_of_list.csid == 102" :style="compute_css_obj('menu-sport-active-image', 2102)"></div>
            <div class="esport" v-else-if="match_of_list.csid == 100" :style="compute_css_obj('menu-sport-active-image', 2100)"></div>
            <span class="league-title-text row justify-between">
              <span :class="['league-t-wrapper', { 'league-t-main-wrapper': menu_type !== 28, export: is_export }]">
                <span class="match-league ellipsis-2-lines" :class="{ 'match-main-league': menu_type !== 28 }">
                  {{ match.tn }}
                </span>
              </span>
              <icon-wapper color="#c9c9c9" name="icon-arrow" size="15px" :class="['icon-wapper', {'close': collapsed}]" />
            </span>
          </div>
          
        </div>
        <!-- 卡片主内容 -->
        <!-- <q-slide-transition> -->
        <div style="width: 100%;" v-if="collapsed">
          <!--标准版 赔率标题栏-->
          <div class="odd-title-wraper row " v-if="match.is_show_league" @click.stop :style="{width: collapsed ? '100%' : 0}">
            <div class="odd-title-i-w flex">
              <div class="odd-t-i-wrapper flex items-center"
                :class="{ 'status2': get_standard_odd_status == 1 && match_of_list_ascertain.length > 3 }">
                <div class="hpl-title row items-center justify-center" :class="{ 'boxing': match_of_list.csid == 12 }"
                  :key="i" v-for="(hpl_title, i) of i18n_t('list_title.' + match.csid + '.title')">
                  <div class="hpl-t-inner">
                    {{ hpl_title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--  一整块赛事的 div 内容 ： 1. 左边 【时间，队名，比分】   2. 右边 【赔率 模块】  -->
            <!-- <div style="border-top: 1px solid #000; width: 96%;"></div>  ！-->
          <div :class="['match-odds-container study_height_s hairline-border', {'border-top': !match.is_show_league}]">
            <div class="match-odds-container-border-radius">
              <!-- 上边的 赛事日期标准版,包含 比分组件 -->
              <div class="date-container match-indent" :class="{ 'n-s-edition': !show_newer_edition }"
                v-if="!show_newer_edition && !is_results">
                <div class='l standard'>
                  <!--竞彩足球 星期与编号-->
                  <div class="week-mcid row items-center" v-if="menu_type == 30">
                    <span class="din-regular"> {{ lodash.get(match,'mcid')}} </span>
                  </div>
                  <!--赛事列表收藏-->
                  <div class="favorite-icon-top match list-m" @click.stop="handle_match_collect">
                    <!-- 未收藏图标 -->
                    <img v-if="!match_collect_state" :src="compute_img_url('icon-favorite')" alt="">
                    <!-- 收藏图标 -->
                    <img v-if='match_collect_state' :src="compute_img_url('icon-favorite-s')">
                  </div>
                  <!-- 赛事日期标准版 -->
                  <div :class="['timer-wrapper-c flex items-center', { esports: is_export, 'din-regular': is_export }]">

                    <!-- 赛事回合数mfo -->
                    <div v-if="match.mfo" class="mfo-title" :class="{ 'is-ms1': match.ms == 1 }">
                      {{ match.mfo }}
                    </div>

                    <!--即将开赛 ms = 110-->
                    <div class="coming-soon" v-if="match.ms" v-show="match.ms == 110">
                      {{ $t(`ms[${match.ms}]`) }}
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
                  <!-- mng 是否中立场   1:是中立场，0:非中立场-->
                  <div class="live-i-b-wrap v-mode-span row items-center"
                    v-if="![5, 10, 7, 8, 13].includes(Number(match.csid)) && match.mng * 1">
                    <img class="neutral-icon-btn l-bottom" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/m-list-neutral.svg`" />
                  </div>

                  <!-- 电竞串关标识 -->
                  <div v-if="menu_type == 3000 && match.ispo" class="flag-chuan"
                    :class="{ 'special-lang': ['zh', 'tw'].includes(get_lang) }">{{ $t('match_info.match_parlay') }}
                  </div>
                </div>
                <!--玩法数量-->
                <div class="goto-detail" style="margin-right: 0.03rem;" @click='goto_details(match)'>
                  <span class="count_span" :class="{ esports: 3000 == menu_type }">
                    <span class="mc-n">
                      {{GlobalAccessConfig.get_handicapNum()? get_match_mc(match) :
                        i18n_t('footer_menu.more') }}
                    </span>
                    <span class="add_text" v-if="GlobalAccessConfig.get_handicapNum()">
                      <icon-wapper color="#888" name="icon-triangle1" size="14px" class="icon-wapper-more" />
                    </span>
                  </span>
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
                      result: is_results
                    }">
                      <div class="team-title-inner-con">
                        <div class='team-t-title-w' :class="{
                          'is-handicap': match.handicap_index == 1,
                          'is-handicap-1': match.handicap_index == 2,
                        }">
                          {{ match.mhn }}
                        </div>
                        <!-- 进球动画 -->
                        <div class="yb-flex-center" v-if="is_show_home_goal && is_new_init2 && (!is_show_away_goal)">
                          <div class="yb-goal-gif" :class="{ 'yb-goal-yo': theme.includes('y0') }"></div>
                          <div class="gif-text">{{ $t('match_result.goal') }}</div>
                        </div>
                        <span class='score-punish' v-show="home_red_score"
                          :class="{ flash: is_show_home_red && !is_results }">
                          {{ home_red_score }}
                        </span>
                      </div>
                      <!--进行中的赛事显示比分 ,如果是比分判定中，则不显示比分-->
                      <div class="score full-score" v-show="match_of_list.ms > 0 && !is_results && !eports_scoring"
                        :class="{ 'visibility-hidden': match_of_list.ms == 110 }">
                        {{ home_score }}
                      </div>
                      <!--发球方绿点-->
                      <span class="serving-party" :class="{ 'simple': standard_edition == 1 }"
                        v-show="set_serving_side(match_of_list, 'home')">
                      </span>
                    </div>
                    <!--客队图片和名称-->
                    <div class='team-title-container' :class="{
                      simple: show_newer_edition,
                      standard: !show_newer_edition && !is_results,
                      result: is_results
                    }">
                      <div class="team-title-inner-con">
                        <div class='team-t-title-w' :class="{
                          'is-handicap': match.handicap_index == 2,
                          'is-handicap-1': match.handicap_index == 1,
                        }">
                          {{ match.man }}
                        </div>
                        <!-- 进球动画 -->
                        <div class="yb-flex-center" v-if="is_show_away_goal && is_new_init2 && (!is_show_home_goal)">

                      <div class="yb-goal-gif yb-goal-yo"></div>
                      <div class="gif-text">{{ $t('match_result.goal') }}</div>
                    </div>
                    <!--进行中的赛事显示比分-->
                    <span class='score-punish' v-show="away_red_score"
                      :class="{ flash: is_show_away_red && !is_results }">
                      {{ away_red_score }}
                    </span>
                  </div>
                  <!--进行中的赛事显示比分 ,如果是比分判定中，则不显示比分-->
                  <div class="score full-score" v-show="match_of_list.ms > 0 && !is_results && !eports_scoring"
                    :class="{ 'visibility-hidden': match_of_list.ms == 110 }">
                    {{ away_score }}
                  </div>
                  <!--发球方绿点-->
                  <span class="serving-party" :class="{ 'simple': standard_edition == 1 }"
                    v-show="set_serving_side(match_of_list, 'away')">
                  </span>
                  </div>
                  <!--  左边收藏  视频动画 图标 玩法数量  赛事分析图标 提前结算图标  -->
                  <div class="score-wrapper flex items-center" v-if="!show_newer_edition && !is_results"
                    v-show="footer_menu_id != 114">
                    <div class="r row no-wrap">
                      <div class="go-container-w flex no-wrap new-standard">
                        <!-- 直播 主播 视频 动画  icon 栏目   -->
                        <!-- 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画 -->
                        <div class="live-i-b-wrap v-mode-span row items-center"
                          v-if="media_button_state_obj.icon_path" @click="media_button_handle()">
                          <slot></slot>
                          <img class="live-icon-btn" :src='media_button_state_obj.icon_path' />
                        </div>
                        <!-- 足篮球展示赛事分析图标 -->
                        <div class="column justify-center yb_px4"
                          v-if="[1, 2].includes(+match.csid) && GlobalAccessConfig.get_statisticsSwitch()"
                          @click='goto_details(match, 1)'>
                          <img :src="compute_img_url('data-analysis')" alt="" style="width:0.12rem">
                        </div>
                        <!-- 此赛事支持提前结算 -->
                        <div class="column justify-center yb_px2" v-if="match_of_list.mearlys == 1">
                          <img :src="mearlys_icon" alt="" style="width:0.2rem">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 右边盘口组件 -->
                <odd-list-wrap :main_source="main_source" :match="match_of_list" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- </q-slide-transition> -->
      </div>
</template>

<script>

import { ref, computed, watch, nextTick } from 'vue'
import { LOCAL_PROJECT_FILE_PREFIX } from  "src/core"

import { IconWapper } from 'src/components/icon'
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import ScoreList from 'src/base-h5/components/match-list/components/score-list.vue';
import OddListWrap from 'src/base-h5/components/match-list/components/odd-list-wrap.vue';
import ImageCacheLoad from "src/base-h5/components/match-list/components/public-cache-image.vue";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"

import { i18n_t, compute_img_url, compute_css_obj  } from "src/core/index.js"
import { format_time_zone } from "src/core/format/index.js"
import { mearlys_icon } from 'src/base-h5/core/utils/local-image.js'

import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2, is_detail, is_export, is_results, footer_menu_id } from 'src/base-h5/mixin/menu.js'

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
  components: {
    ScoreList,
    IconWapper,
    OddListWrap,
    ImageCacheLoad,
    CountingDownStart,
    CountingDownSecond,
  },
  setup () {
    return { 
      lang, theme, i18n_t, compute_img_url, format_time_zone, GlobalAccessConfig, footer_menu_id,LOCAL_PROJECT_FILE_PREFIX,
      is_hot, menu_type, menu_lv2, is_detail, is_export, is_results, standard_edition, mearlys_icon, compute_css_obj
    }
  }
}

</script>

<style scoped lang="scss">

</style>
  