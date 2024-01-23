<!--
 * @Description: ouzhou-h5 赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div class="component match-container-main-template1 match-container" 
    :style="{ marginTop: is_hot ? '0' : '' }">
    <template v-if="match" >
      <!-- 体育类别 -->
      <header class="match-header" v-if="show_sport_title" @click.stop="handle_ball_seed_fold">
        <div>
          <!-- <SportIcon size="20"  :status="false" :sport_id="String(Number(match.csid ) + 100)" />
          <span>{{ match.csna }}</span> -->
          <SportIcon size="20"  :status="false" :sport_id="[190, 191].includes(+MenuData.menu_mi.value)?menu_sport.menu_sport_id:MenuData.is_esports()?`2${match.csid}`:String(Number(match.csid ) + 100)" />
          <span>{{[190, 191].includes(+MenuData.menu_mi.value) ? menu_sport.menu_sport_name || match.csna : match.csna }}</span>
        </div>
        <div class="select_time">
          <span @click.stop>
            <q-btn-dropdown flat outline style="color: #FF7000"  padding="0" :label="select_label"
              dropdown-icon="expand_more" content-class="select_time_style" v-model="showDropdown"
              :persistent="true"
            >
            </q-btn-dropdown>
            <!-- <span>{{ select_label }}</span>
            <q-icon name="expand_more"></q-icon> -->
            <Transition>
              <div class="dropdown-list q-menu" v-show="showDropdown">
                <q-list>
                  <q-item v-for="item in hps_play_data" :key="item.hpid" @click.stop="on_select_play(item)"
                      :class="{active: select_play === item.hpid}"
                      >
                    <q-item-section @click.stop="on_select_play(item)">
                      <q-item-label>{{ item.label || i18n_t(`ouzhou.match.play_map.${item.hpid}`)}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </Transition>
          </span>
        </div>
      </header>
      <!-- 缓冲容器， 避免滚动时骨架屏漏光问题 -->
      <!-- <div class="buffer-container" v-if="match.is_show_league && !is_show_opening_title && i !== 0"></div> -->
      
      <!-- 最核心的div模块     标题 + 倒计时 + 比分 + 赔率盘口模块 -->
      <div :class="['match-inner-container', {'collapsed': !collapsed}]">
        <!--联赛标题 -->
        <div @click="handle_league_fold" v-if="match.is_show_league || (is_hot && get_league_show(i))"
          :class="[('league match-indent hairline-border'), { 'no-radius': show_sport_title, 'no-border': !collapsed}]">
          <div :class="['league-t-wrap', { 'league-collapsed': !collapsed }]">
            <!-- <div class="league-t-tubiao"></div> -->
            <div :class="['league-title']">
              <!-- 联赛收藏 -->
              <div v-if="![3000, 900].includes(menu_type)" class="favorited-icon" @click.stop="handle_league_collect">
                <!-- 未收藏 compute_img_url('icon-favorite')-->
                <img v-if="!league_collect_state" :src="no_collect_ouzhou" alt="">
                <!-- 收藏图标 compute_img_url('icon-favorite-s')-->
                <img v-if='league_collect_state' :src="have_collect_ouzhou">
              </div>
              <!-- 电竞图标 写死 -->
              <div v-if="match.csid == 101" class="league-icon-mini league-icon-mini2" style="--num:39"></div>
              <div v-else-if="match.csid == 103" class="league-icon-mini league-icon-mini2" style="--num:40"></div>
              <div v-else-if="match.csid == 102" class="league-icon-mini league-icon-mini2" style="--num:41"></div>
              <div v-else-if="match.csid == 100" class="league-icon-mini league-icon-mini2" style="--num:42"></div>
              <div v-else :class="['league-icon-mini']">
                <ImageCacheLoad :csid="match.csid" :path="match.lurl" type="league" ></ImageCacheLoad>
              </div>
              <span class="league-title-text row justify-between">
                <span :class="['league-t-wrapper', { 'league-t-main-wrapper': menu_type !== 28, export: is_esports }]">
                  <span class="match-league ellipsis-2-lines" :class="{ 'match-main-league': menu_type !== 28 }">
                    {{ match.tn }}
                  </span>
                </span>
              </span>
            </div>
            <!-- 玩法标题 -->
            <div class="play-title">
              <template v-if="collapsed">
                <div class="title">
                  <span v-for="p in get_match_panel" :key="`${match_hpid}_${p.ot}`">{{ p.title }}</span>
                </div>
              </template>
              <template v-else>
                <span class="number">{{ get_ball_seed_league_count }}</span>
              </template>
            </div>
          </div>
          
        </div>
        <div :class="['league-line', {'collapsed': !collapsed}]"></div>
        <!-- 卡片主内容 -->
        <!-- <q-slide-transition> -->
          <div style="width: 100%;" v-if="collapsed">
            <!--  一整块赛事的 div 内容 ： 1. 左边 【时间，队名，比分】   2. 右边 【赔率 模块】  -->
            <div :class="['match-odds-container study_height_s hairline-border']">
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
                          <!--中立场图标-->
                          <div class="live-i-b-wrap newer" v-show="match.mng * 1 && ![5, 10, 7, 8].includes(Number(match.csid))">
                            <img class="neutral-icon-btn" :src="neutral_site" />
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
                      <!--主队图片和名称-->
                      <div class='team-title-container' :class="{
                        simple: show_newer_edition && !is_results,
                        standard: !show_newer_edition && !is_results,
                        result: is_results
                      }">
                        <!-- 网球csid: 5   兵乓球csid: 8-->
                        <ImageCacheLoad :class="{ 'team_icon2': match.mhlu[1] && [5].includes(+match.csid)}" :csid="match.csid" :path="match.mhlu" type="home" ></ImageCacheLoad>
                        <ImageCacheLoad v-if="match.mhlu.length > 1 && [5].includes(+match.csid)" :csid="match.csid" :path="match.mhlu[1]" type="home" ></ImageCacheLoad>
                        <div class="team-title-inner-con">
                          <div class="right-content">
                            <!-- 红、黄牌， 发球方绿点 -->
                            <div class="team-left" v-if="home_red_score || home_yellow_score">
                              <!-- 红牌 -->
                              <span class='score-punish red' v-show="home_red_score" :class="{ flash: is_show_home_red && !is_results }">
                                {{ home_red_score }}
                              </span>
                              <!-- 黄牌 -->
                              <span class='score-punish yellow' v-show="!home_red_score && home_yellow_score">
                                {{ home_yellow_score }}
                              </span>
                            </div>
                            <!-- 主队事件动画-->
                            <div class="yb-flex-center" v-if="is_new_init2">
                              <!-- 进球图标 -->
                              <template v-if="is_show_home_goal">
                                <div class="yb-goal-gif yb-goal-yo"></div>
                                <div class="gif-text">{{i18n_t('match_result.goal')}}</div>
                              </template>
                              <!-- VAR事件 -->
                              <!-- <template v-if="is_show_home_var && is_show_var_event">
                                <div class="gif-text"> {{ var_text }} </div>
                              </template> -->
                            </div>
                          </div>
                          <div class='team-t-title-w' :class="{
                            'is-handicap': match.handicap_index == 1,
                            'is-handicap-1': match.handicap_index == 2,
                            'is-show-goal': is_show_home_goal
                          }">
                            {{ match.mhn }} 
                          </div>
                        </div>
                        <!--进行中的赛事显示比分 ,如果是比分判定中，则不显示比分-->
                        <div class="score full-score" v-show="match.ms > 0 && !is_results && !eports_scoring"
                          :class="{ 'visibility-hidden': match.ms == 110 }">
                          <span class="serving-party" :class="{ 'simple': standard_edition == 1 }" v-show="set_serving_side(match, 'home')"></span>
                          <span>{{ home_score }}</span>
                        </div>
                      </div>
                      <!--客队图片和名称-->
                      <div class='team-title-container'>
                        <!-- 网球csid: 5   兵乓球csid: 8-->
                        <ImageCacheLoad :class="{ 'team_icon2': match.mhlu[1] && [5].includes(+match.csid) }" :csid="match.csid" :path="match.malu" type="away" ></ImageCacheLoad>
                        <ImageCacheLoad v-if="match.malu.length > 1 && [5].includes(+match.csid)" :csid="match.csid" :path="match.malu[1]" type="home" ></ImageCacheLoad>
                        <div class="team-title-inner-con">
                          <div class="right-content">
                            <!-- 红、黄牌， 发球方绿点 -->
                            <div class="team-left" v-if="away_red_score || away_yellow_score">
                              <!-- 红牌 -->
                              <span class='score-punish red' v-show="away_red_score" :class="{ flash: is_show_away_red && !is_results}">
                                {{ away_red_score }}
                              </span>
                              <!-- 黄牌 -->
                              <span class='score-punish yellow' v-show="!away_red_score && away_yellow_score">
                                {{ away_yellow_score }}
                              </span>
                            </div>
                            <!-- 客队事件动画 -->
                            <div class="yb-flex-center" v-if="is_new_init2">
                              <!-- 进球图标 -->
                              <template v-if="is_show_away_goal">
                                <div class="yb-goal-gif yb-goal-yo"></div>
                                <div class="gif-text">{{i18n_t('match_result.goal')}}</div>
                              </template>
                              <!-- VAR事件 -->
                              <!-- <template v-if="is_show_away_var && is_show_var_event">
                                <div class="gif-text"> {{ var_text }} </div>
                              </template> -->
                            </div>
                          </div>
                          <div class='team-t-title-w visiting' :class="{
                            'is-handicap': match.handicap_index == 2,
                            'is-handicap-1': match.handicap_index == 1,
                            'is-show-goal': is_show_away_goal
                          }">
                            {{ match.man }}
                          </div>
                        </div>
                        <!--进行中的赛事显示比分 ,如果是比分判定中，则不显示比分-->
                        <div class="score full-score" v-show="match_of_list.ms > 0 && !is_results && !eports_scoring"
                          :class="{ 'visibility-hidden': match_of_list.ms == 110 }">
                          <!--发球方绿点-->
                          <span class="serving-party" :class="{ 'simple': standard_edition == 1 }" v-show="set_serving_side(match, 'away')"> </span>
                          <span>{{ away_score }}</span>
                        </div>
                      </div>
                    </div>
                    <!-- 右边盘口组件 -->
                    <template v-if="match_of_list">
                      <ScoreList :match_info="match_of_list"></ScoreList>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <!-- </q-slide-transition> -->
      </div>
    </template>
  </div>
</template>
  
<script>

import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { LOCAL_PROJECT_FILE_PREFIX } from  "src/output/index.js"

import { IconWapper } from 'src/components/icon'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import OddListWrap from 'src/base-h5/components/match-list/components/odd-list-wrap.vue';
import SportIcon from "src/base-h5/components/top-menu/top-menu-ouzhou-1/components/left-menu/sport-icon.vue"
import ScoreList from 'src/base-h5/components/match-container/template/ouzhou/components/score-list.vue';
import ImageCacheLoad from "src/core/public-cache-image/public-cache-image.vue";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import PageSourceData  from  "src/core/page-source/page-source.js";
import { i18n_t, compute_img_url, compute_css_obj, use_sports_play_data, use_sports_play_title, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5  } from "src/output/index.js"
import { format_time_zone } from "src/output/index.js"
import { MenuData } from "src/output/project/index.js"
import { have_collect_ouzhou, no_collect_ouzhou, neutral_site } from 'src/base-h5/core/utils/local-image.js'
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';

import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2, is_detail, is_esports, is_results, footer_menu_id } from 'src/base-h5/mixin/menu.js'
import lodash from 'lodash'
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
    SportIcon,
    ScoreList,
    IconWapper,
    OddListWrap,
    ImageCacheLoad,
    CountingDownStart,
    CountingDownSecond,
  },
  data(){
    return {}
  },
  setup (ctx) {
    const match_hpid = ref('')
    const hps_play_data = ref([])
    const select_label = ref('')
    const sports_play_title = use_sports_play_title()
    const sports_play_data = use_sports_play_data()

    const select_play = computed(() => {
      const { csid } = ctx.match_of_list
      return lodash.get(MatchResponsive.match_hpid_info.value, `csid_${csid}`, '1')
    })
    // 是否显示球种标题
    const show_sport_title = computed(() => {
      const { is_show_ball_title } = ctx.match_of_list
      return is_show_ball_title
    })
    // 玩法
    const get_match_panel = computed(() => {
      const { csid, hps } = ctx.match_of_list
      const hpid = lodash.get(MatchResponsive.match_hpid_info.value, `csid_${csid}`, '1')
      const plays = lodash.get(sports_play_title, `${csid}`, [])
      const length = lodash.get(plays, 'length', 0)
      const play_item = length > 0 && plays.find(t => t.hpid === hpid)
      let target = []
      if (play_item) {
        match_hpid.value = play_item.hpid
        target = play_item.ol
      } else {
        // 切换左侧菜单 则默认第一个
        target = plays ? plays[0]?.ol : []
      }
      return target
    })
    // 计算有玩法的hps
    const get_hps_play_data = () => {
      // let target_hps = []
      const { csid } = ctx.match_of_list
      const sports_play = sports_play_data[csid] || []
      hps_play_data.value = sports_play
      const default_label = i18n_t(`ouzhou.match.play_map.${select_play.value}`)
      // target_hps = MatchResponsive.ball_seed_play_methods.value[`hps_csid_${csid}`]
      if (!select_label.value) {
        select_label.value = sports_play && sports_play[0] && sports_play[0]?.label || default_label
      } else {
        select_label.value = default_label
      }
    }

    watch(() => ctx.match_of_list?.hps, () => {
      const { is_show_league } = ctx.match_of_list
      if (!is_show_league) return
      get_hps_play_data()
    }, { deep: true, immediate: true })

    // 切换玩法赔率
    const on_select_play = (item) => {
      const { hps, csid, mid, hn } = ctx.match_of_list
      // select_play.value = item.hpid
      select_label.value = item.label
      MatchResponsive.set_match_hpid(item.hpid, csid)
      showDropdown.value = false;
    }
    const showDropdown = ref(false)

    // 是否元数据
    const is_compute_origin = computed(() => {
      return MatchResponsive.is_compute_origin.value
    })

    return { 
      lang, theme, i18n_t, compute_img_url, format_time_zone, GlobalAccessConfig, footer_menu_id,LOCAL_PROJECT_FILE_PREFIX, have_collect_ouzhou,
      is_hot, menu_type, menu_lv2, is_detail, is_esports, is_results, standard_edition, compute_css_obj, show_sport_title, no_collect_ouzhou,
      PageSourceData, get_match_panel, hps_play_data, on_select_play, select_play, match_hpid, neutral_site, MenuData, is_compute_origin, select_label,
      showDropdown,
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
    font-size: .13rem;
    position: relative;
    .dropdown-list{
      position: absolute !important;
      z-index: 999;
      background-color: #fff;
      color: #414655;
      font-size: 12px;
      right: 0;
      top: 100%;
      .active{
        color: #FF7000;
      }
      .z-index{
        position: relative;
        z-index: 999;
      }
    }
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
        background: #e1e1e1;
        // background: var(--q-gb-bg-c-6);
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
    padding: 10px 0 10px 10px;
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
    padding-left: 10px;
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
      > div {
        flex: 1;
        flex-shrink: 0;
        .title{
          flex: 1;
          display: flex;
          align-items: center;
          font-size: 13px;
          font-weight: 600;
          > span {
            flex: 1;
            text-align: center;
          }
        }
        .number{
          width: 100%;
          text-align: right;
          font-size: 14px;
          font-weight: 600;
          padding-right: 27px;
          display: inline-block;
        }
      }
      .league-title{
        display: flex;
        align-items: center;
         .favorited-icon{
          width: 15px;
          height: 14px;
          margin: 0 4px 0 0;
          position: relative;
          flex-shrink: 0;
          > img {
            width: 100%;
            height: 100%;
          }
        } 
      }
      &.league-collapsed{
        > div {
          flex: auto;
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
      font-size: .12rem;
      &.export {
        min-width: 1.1rem;
      }
    }
     // 添加 line-height: 0.14rem 解决42682 生产BUG--malick
    .match-league {
      max-width: 2.8rem;
      line-height: 0.14rem;
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
      width: 50%;
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
      padding-right:5px;
      border-right: 1px solid rgba(88,88,88,.1);

      &.simple {
        transform: translateY(-1px);
      }

      &.team_title {
        .team-title-inner-con {
          width: 1.8rem !important;
        }
      }

      .team-title-container {
        display: flex;
        align-items: center;
        position: relative;
        .team-left{
          margin-left: 2px;
          display: flex;
          align-items: center;
        }
        .team_icon2{
          width: 0.18rem;
          height: 0.18rem;
          margin-right:-8px;
          flex-shrink: 0;
          justify-content: center;
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
          width: 1.2rem;
          position: relative;
          line-height: 0.14rem;
          display: flex;
          align-items: center;
          flex-direction: row-reverse;
          .right-content{
            flex: 1;
            display: flex;
            align-items: center;
            background: transparent !important;
            .yb-flex-center{
              justify-content: start;
            }
           
          }
          .yb-goal-gif{
            background-image: url($SCSSPROJECTPATH+"/image/common/goal_gif.png");
          }
          .gif-text{
            color: #FF7000 !important;
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
            font-size: 14px;
            height: 24px;
            line-height: 24px;
            overflow: hidden;
            align-items: center;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 500;
            // color: #8a8986;
            &.is-show-goal{
              max-width: 0.9rem;
            }
            &.visiting {
              // color: #8a8986;
            }
            &.is-handicap {
              color: #7A0F25 !important;
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
          border-radius: 2px;
          background: var(--sys-feedback-success-success-400, #4AB06A);
          width: 4px;
          height: 4px;
          margin-right: 4px;
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
  color: #999;
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
      font-size: 12px;
      .mc-n{
        color: #1A1A1A;
      }
    }
  }
  :deep(.start-counting-down){
    flex: 1;
    .counting-down-start{
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 74px;
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
    flex: 1;
    font-size: 12px;
    .counting-down-wrap{
      font-size: 12px;
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
    margin-right: .08rem;
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
    height: 0.12rem;
    width: auto;
    display: flex;
    margin-right: 0.08rem;

    .live-icon-btn,
    .live-icon-play-btn {
      width: 0.12rem;
      height: 0.12rem;
    }

    .neutral-icon-btn {
      width: 0.12rem;
      height: 0.12rem;
      /*margin-left: 0.08rem;*/
    }
  }

  .l {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    flex: 1;

    .favorite-icon {
      position: relative;
      top: -.01rem;
    }

    .date-time {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--q-color-com-fs-color-37);
    }

    .counting-down-up-container {
      // width: 1rem;
      height: .14rem;
      display: flex;
      flex: 1;
      :deep(.counting-down-wrap){
        width: auto !important;
        .title-space-1{
          font-size: 12px;
        }
        .counting{
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          color: #1A1A1A;
          position: relative;
          // top: -1px;
          font-weight: 500;
        }
        .special{
          font-size: 12px;
          color: #1A1A1A;
        }
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
    margin-right: .03rem;
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
:deep(.q-item){
  min-height: 42px;
  border-bottom: 1px solid #e2e2e2;
}
/* **************日期********************** -E*/
/* ********赛事容器相关********** -E*/
</style>
 