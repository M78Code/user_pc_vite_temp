<!--
 * @Description: yazhou-h5 赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div class="match-container" :style="{ marginTop: is_hot ? '0' : '' }" :class='{
    first: i == 0,
    match_status_bar: match.is_show_no_play,
    is_league_tail: get_league_show(i + 1),
    is_division_league: match.is_show_league,
    started_un_started_next: get_m_status_show(i + 1),
    started_and_un_started: match.is_show_no_play,
    favorite_un_start_title: favorite_un_start_title(i, match_of_list.ms),
  }'>
  <template v-if="match" >
    <!-- <div style="display: none;">{{ MatchDataBaseH5.data_version.version }}</div> -->
    <!--体育类别 -- 标题  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
    <div v-if="get_sport_show"
      :class="['sport-title match-indent', { home_hot_page: is_hot, is_gunqiu: [1].includes(+menu_type), first: i == 0, }]"
      @click="handle_ball_seed_fold">
      <!-- 首页热门 -->
      <template v-if="is_hot">
        <div v-if="is_hot && lodash.get(MenuData.hot_tab_menu, 'index') == 0" class="ball_img">
          <div class='img' :style="compute_css_obj({key:'polular-spirite',position:match_of_list.csid})" style="--per:-0.60754rem;background-size: 100%;">
          </div>
          <span> <i :style="compute_css_obj({key:'h5-hot-jinxuan', position: `item_${match_of_list.csid}` })"></i>  <span>{{ match_of_list.csna }}</span> </span>
        </div>
      </template>
      <span class="score-inner-span" v-else>
        {{ match_of_list.csna }}
        <!-- {{match_of_list.csna || get_current_menu.sub.menuName}} -->
      </span>
      <!-- 折叠收起不用消失 -->
      <div v-if="!is_hot">
        <img class="league-collapse-dir" :class="{ 'collapsed': !league_collapsed }" :src='compute_img_url("icon-collapse")' />
      </div>
    </div>
    <!-- 未开赛标题  -->
    <div class="match-status-fixed flex items-center" v-if="match.is_show_no_play">
      <img src='image/list/list-red.svg' />
      <span class="din-regular">
        {{ i18n_t('list.match_no_start') }}&nbsp;&nbsp;<span v-show="no_start_total">(0)</span>
      </span>
    </div>
    <!-- 首页热门才有的样式  -->
    <div
      v-if="is_hot && match_of_list.time_title && lodash.get(MenuData.hot_tab_menu, 'index') != 0"
      class="hot_time_change">
      <span>{{ time_change }}</span>
      <!-- 热门模块的 榜单页 和 赛程列表页面 的切换    menuId == "30101"是 竞彩足球的 唯一字段  ['1','2'].includes(MenuData.hot_tab_menu.field1) 表示只在篮球足球下显示时间-->
      <span @click="leaderboard_switch"
        v-show="i == 0 && !MenuData.hot_tab_menu.chinaBetting && ['1', '2'].includes(MenuData.hot_tab_menu.field1)">{{
          i18n_t('home_popular.ranking') }}</span>
    </div>


    <!-- 最核心的div模块     标题 + 倒计时 + 比分 + 赔率盘口模块 -->
    <div class="match-inner-container">
      <!--联赛标题 -->
      <div @click="handle_league_fold" v-if="match.is_show_league || (is_hot && get_league_show(i))"
        :class="[('league match-indent hairline-border'), { 'no-radius': get_sport_show && is_hot, 'home-hot': is_hot }]">
        <div class="league-t-wrap">
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
          <div class="league-icon-mini" v-else>
            <image-cache-load :csid="match_of_list.csid" :path="match_of_list.lurl" type="league"></image-cache-load>
          </div>
          <span class="league-title-text row justify-between">
            <span :class="['league-t-wrapper', { 'league-t-main-wrapper': menu_type !== 28, export: is_esports }]">
              <span class="match-league ellipsis-2-lines" :class="{ 'match-main-league': menu_type !== 28 }">
                {{ match.tn }}
              </span>
            </span>
            <!--标准版 赔率标题栏-->
            <div class="odd-title-wraper row " :style="{width: !collapsed ? '100%' : 0}">
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
          </span>
          <template v-if="!(is_hot || is_detail) && collapsed">
            <img class="league-collapse-dir" :class="{ 'collapsed': collapsed }"  :src='compute_img_url("icon-collapse")'  />
          </template>
        </div>
      </div>
      <!-- 卡片主内容 -->
      <q-slide-transition>
        <div style="width: 100%" v-if="!collapsed">
          <!--  间隔,因为要求不能用 marginTop,因此加上此元素  -->
          <div style="height: 0.04rem " />
          <!--  一整块赛事的 div 内容 ： 1. 左边 【时间，队名，比分】   2. 右边 【赔率 模块】  -->
          <div class="match-odds-container study_height_s hairline-border" :ref="'mid-' + match.mid">
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
                      <counting-down-start :match="match" :index="i" :mgt_time="match.mgt"></counting-down-start>
                    </div>
                    <!--倒计时或正计时-->
                    <div v-if="match.ms != 110 && show_counting_down(match)" 
                      :class="['counting-down-up-container relative-position', { 'special-match-container': match.mfo || [0, 31].includes(+match.mmp) }]"
                      :style="{ width: counting_down_up_wrapper_width === 'auto' ? 'auto' :  match.mfo ? 'auto' : counting_down_up_wrapper_width + 'rem' }">
                      <!--足球csid:1 冰球csid:4 橄榄球csid:14 DotaCsid:101 累加 排球csid:9 倒计时-->
                      <counting-down-second ref="counting-down-second" :title="mmp_map_title" :mmp="match.mmp"
                        :is_add="[1, 4, 11, 14, 100, 101, 102, 103].includes(+match.csid)" :m_id="match.mid"
                        :second="match.mst" :match="match" @counting-wrapper-width="update_counting_down_up_wrapper_width">
                      </counting-down-second>
                    </div>
                  </div>
                  <!-- mng 是否中立场   1:是中立场，0:非中立场-->
                  <div class="live-i-b-wrap v-mode-span row items-center"
                    v-if="![5, 10, 7, 8, 13].includes(Number(match.csid)) && match.mng * 1">
                    <img class="neutral-icon-btn l-bottom" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/m-list-neutral.svg`" />
                  </div>

                  <!-- 电竞串关标识 -->
                  <div v-if="menu_type == 3000 && match.ispo" class="flag-chuan"
                    :class="{ 'special-lang': ['zh', 'tw', 'hk'].includes(get_lang) }">{{ i18n_t('match_info.match_parlay') }}
                  </div>
                </div>
                <!-- 标准版 比分组件 -->
                <!-- 电竞中，如果是比分判定中，则不显示该比分 -->
                <div class="eports_scoring_tip" v-if="eports_scoring">{{ i18n_t('mmp.eports_scoring') }}</div>
                <score-list v-else-if="!is_hot" :match="match"></score-list>
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
                        <!-- 1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 -->
                        <div class="team-icon row no-wrap" v-if="!([5, 10, 7, 8].includes(Number(match.csid)))">
                          <image-cache-load :csid="+match.csid" :path="match.mhlu" type="home"></image-cache-load>
                        </div>
                        <div class='team-t-title-w' :class="{
                          'is-handicap': match.handicap_index == 1,
                          'is-handicap-1': match.handicap_index == 2,
                        }">
                          {{ match.mhn }}
                        </div>
                        <!-- 进球动画 -->
                        <div class="yb-flex-center" v-if="is_show_home_goal && is_new_init2 && (!is_show_away_goal)">
                          <div class="yb-goal-gif" :class="{ 'yb-goal-yo': theme.includes('y0') }"></div>
                          <div class="gif-text">{{ i18n_t('match_result.goal') }}</div>
                        </div>
                        <!-- 主队红牌 -->
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
                        <!-- 1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 -->
                        <div v-if="!([5, 10, 7, 8].includes(Number(match.csid)))" class="team-icon row no-wrap">
                          <image-cache-load :csid="match.csid ? match.csid : match.sportId"
                            :path="match.malu ? match.malu : match.picUrl" type="away"></image-cache-load>
                        </div>
                        <div class='team-t-title-w' :class="{
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
                  <div class="score full-score" v-show="match_of_list.ms > 0 && !is_results && !eports_scoring"
                    :class="{ 'visibility-hidden': match_of_list.ms == 110 }">
                    {{ away_score }}
                  </div>
                  <!--发球方绿点-->
                  <span class="serving-party" :class="{ 'simple': standard_edition == 1 }"
                    v-show="set_serving_side(match_of_list, 'away')">
                  </span>
                </div>
                <!--赛果收藏-->
                <div class="row" v-if="is_results">
                  <!--赛果收藏-->
                  <div class="result fav-i-wrap-match row items-center"> </div>
                  <!--赛果开赛时间-->
                  <div class="m-result-time date-time">
                    {{ format_time_zone(+match.mgt).Format(i18n_t('time4')) }}
                  </div>
                  <!-- v-if="match_of_list.playBack && is_replay_switch" -->
                  <div class="flex play-icon">
                    <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/replay_y0.svg`" />
                  </div>
                </div>
                <!--  左边收藏  视频动画 图标 玩法数量  赛事分析图标 提前结算图标  -->
                <div class="score-wrapper flex items-center" v-if="!show_newer_edition && !is_results"
                  v-show="MenuData.footer_sub_menu_id != 114">
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

                          <!--玩法数量-->
                          <div class="goto-detail" @click='goto_details(match)'>
                            <span class="count_span" :class="{ esports: 3000 == menu_type }">
                              <span class="mc-n">
                                {{GlobalAccessConfig.get_handicapNum()? get_match_mc(match) :
                                  i18n_t('footer_menu.more') }}
                              </span>
                              <span class="add_text" v-if="GlobalAccessConfig.get_handicapNum()">+</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--  赛果 比分和图标 -->
                  <div class="match-result-w-c column items-end auto-full-width-100" v-if="is_results">
                    <div class="row justify-end auto-full-width-100 match-result-score-wrap" @click="goto_details(match)">
                      <div class="score-result-wrapper">
                        <div class="score-row row items-center justify-end" :class="{ 'win-way': +home_score > +away_score }">
                          {{ home_score }}
                        </div>
                        <div class="score-row row items-center justify-end" :class="{ 'win-way': +away_score > +home_score }">
                          {{ away_score }}
                        </div>
                      </div>
                      <div class="go-to-d-detail-w">
                        <div @click="goto_details(match)" class="go-to-i-detail-i row items-center justify-center">
                          <div class='word'>
                            {{ i18n_t('list.go_to_details') }}
                          </div>
                          <div>
                            <img class="go-to-d-icon" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/m-list-way-more.svg`" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 右边盘口组件 -->
                  <odd-list-wrap v-else :main_source="main_source" :match="match_of_list" />
                </div>
                <!-- 比分组件 -->
                <div class="w-score-result row justify-end">
                  <score-list v-if="is_results" :match="match"></score-list>
                </div>
              </div>

              <!--  新手版才有的  倒计时  玩法数量  底部比分 组件  -->
              <div class="date-container simple match-indent"
                :class="{ 'no-running-timer-wrapper': !show_counting_down(match) }"
                v-if="show_newer_edition && !is_results">
                <div class='l test-match-mf'>
                  <!--收藏图标-->
                  <div v-if="!GlobalAccessConfig.get_collectSwitch()" class="go-container-w flex no-wrap favorite">
                    <div class="fav-i-wrap-match row items-center" @click.stop="handle_match_collect">
                      <div class="favorite-icon match">
                        <!-- 未收藏图标 -->
                        <img v-if="!match_collect_state" :src="compute_img_url('icon-favorite')" alt="">
                        <!-- 收藏图标 -->
                        <img v-if='match_collect_state' :src="compute_img_url('icon-favorite-s')">
                      </div>
                    </div>
                  </div>
                  <!--竞彩足球 星期与编号-->
                  <div class="week-mcid row items-center" v-if="menu_type == 30">
                    <span class="din-regular" style="font-size:.14rem">
                      {{ match.mcid }}
                    </span>
                  </div>
                  <!--开赛时间-->
                  <div class="timer-wrapper-c newer">
                    <!--即将开赛 ms = 110-->
                    <div class="coming-soon" v-show="match.ms == 110">
                      {{ i18n_t(`ms[${match.ms}]`) }}
                    </div>
                    <!--开赛日期 ms != 110 (不为即将开赛)  subMenuType = 13网球(进行中不显示，赛前需要显示)-->
                    <div class="date-time" v-show="match.ms != 110 && !show_start_counting_down(match) && !show_counting_down(match)">
                      {{ format_time_zone(+match.mgt).Format(i18n_t('time4')) }}
                    </div>
                    <!--一小时内开赛 -->
                    <div class="start-counting-down" v-show="match.ms != 110 && show_start_counting_down(match)">
                      <counting-down-start :match="match" :index="i" :mgt_time="match.mgt">
                      </counting-down-start>
                    </div>
                    <!--倒计时或正计时-->
                    <div class="counting-down-up-container relative-position"
                      :class="{ 'long-time': match.mst >= 6000, 'intermission': match.mmp == 31, 'special-match-container': match.mfo || [0, 31].includes(+match.mmp) }"
                      :style="{ width: counting_down_up_wrapper_width === 'auto' ? 'auto' : counting_down_up_wrapper_width + 'rem' }"
                      v-if="match.ms != 110 && show_counting_down(match)">
                      <!--csid足球1冰球4手球11累加  排球csid:9 倒计时-->
                      <counting-down-second ref="counting-down-second-simple" :title="mmp_map_title" :mmp="match.mmp"
                        :is_add="[1, 4, 11, 14, 100, 101, 102, 103].includes(+match.csid)" :m_id="match.mid"
                        :second="match.mst" :match="match" @counting-wrapper-width="update_counting_down_up_wrapper_width">
                      </counting-down-second>
                    </div>
                  </div>
                  <!-- 直播 主播 视频 动画  icon 栏目   -->
                  <!-- 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画 -->
                  <div class="live-i-b-wrap v-mode-span row items-center" v-if="media_button_state_obj.icon_path"
                    @click="media_button_handle()">
                    <img class="live-icon-btn" :src='media_button_state_obj.icon_path' />
                  </div>
                  <!--中立场图标-->
                  <div class="live-i-b-wrap newer" v-show="match.mng * 1 && ![5, 10, 7, 8].includes(Number(match.csid))">
                    <img class="neutral-icon-btn" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/list/m-list-neutral.svg`" />
                  </div>
                  <!--玩法数量-->
                  <div class="go-container-w mcount flex">
                    <div class='goto-detail' @click='goto_details(match)'>
                      <div class="count_span">
                        <span class="mc-n">
                          {{ GlobalAccessConfig.get_handicapNum() ? get_match_mc(match) : i18n_t('footer_menu.more') }}
                        </span>
                        <span class="add_text" v-if="GlobalAccessConfig.get_handicapNum()">+</span>
                      </div>
                    </div>
                  </div>
                </div>
                <!--比分栏-->
                <div class="r row no-wrap">
                  <div class="score-wrapper flex" v-show="match.ms != 0 && (match.csid != 1 || MenuData.footer_sub_menu_id != 114)">
                    <score-list :main_source="main_source" :match="match"></score-list>
                  </div>
                </div>
                <!-- 简版 比分组件 -->
                <!-- 电竞中，如果是比分判定中，则不显示该比分 -->
                <div class="eports_scoring_tip" v-if="eports_scoring">{{ i18n_t('mmp.eports_scoring') }}</div>
              </div>
              <!--角球，罚牌，晋级，加时赛，点球大战玩法-->
              <!-- cisd:1 足球， 2 篮球， 5 网球， 7 斯诺克， 8 乒乓球 -->
              <match-overtime-pen 
                v-if="!is_hot && !is_detail && !is_results && [1, 2, 5, 7, 8].includes(+match.csid) && standard_edition != 1"
                :main_source="main_source" 
                :mid="match_of_list.mid" />
            </div>
          </div>
        </div>
      </q-slide-transition>
    </div>
  </template>
  </div>
</template>

<script>

import { ref, computed, watch, nextTick } from 'vue'

import { IconWapper } from 'src/components/icon'
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import ScoreList from 'src/base-h5/components/match-list/components/score-list.vue';
import OddListWrap from 'src/base-h5/components/match-list/components/odd-list-wrap.vue';
import ImageCacheLoad from "src/core/public-cache-image/public-cache-image.vue";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"

import { i18n_t, compute_img_url, LOCAL_PROJECT_FILE_PREFIX, format_time_zone } from "src/output/index.js"
import { mearlys_icon } from 'src/base-h5/core/utils/local-image.js'

import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2, is_detail, is_esports, is_results } from 'src/base-h5/mixin/menu.js'

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
    const footer_sub_menu_id = ''
    return { 
      lang, theme, i18n_t, menu_lv2, menu_type, compute_img_url, format_time_zone, GlobalAccessConfig, footer_sub_menu_id,LOCAL_PROJECT_FILE_PREFIX,
      is_hot, menu_type, menu_lv2, is_detail, is_esports, is_results, standard_edition, mearlys_icon
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

.match-container {
  width: 100%;
  height: auto;
  position: relative;

  .match-status-fixed {
    width: 3.75rem;
    height: 0.17rem;
    line-height: 1;
    font-size: 0.11rem;
    margin-left: -0.07rem;
    color: var(--q-color-com-fs-color-38);
    padding: 0.03rem 0.03rem 0.03rem 0.15rem;

    img {
      margin-right: .06rem;
      width: .13rem;
      height: .13rem;
    }
  }

  .v-mode-span {
    margin-right: 0.1rem;
  }

  .match-inner-container {
    margin: 0 auto;
    margin: 0 .069rem;
    /* 兼容iPhone11边框显示不全 */
    //width: 100%;
    background: var(--q-color-com-bg-color-40);
    display: flex;
    flex-direction: column;
    align-items: center;

    // padding-top: 0.05779rem;  /* 兼容iPhone11边框显示不全 */
    &.show-sport {
      border-top-left-radius: 0.08rem;
      border-top-right-radius: 0.08rem;
    }
  }

  &.started_and_un_started {
    display: block;

    &.match_status_bar {
      /*margin-top: 0.07rem;*/
    }
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
    margin-bottom: 0.03rem;
    transition: max-height 0.3s;

    .match-odds-container-border-radius {
      border-radius: .08rem;
      overflow: hidden;
    }

    .eports_scoring_tip {
      color: var(--q-gb-t-c-13);
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

  &.match_status_bar {
    .league {

      //overflow: hidden;
      margin-top: 0.08rem;
    }
  }

  .match-indent {
    width: 100%;
    margin: 0 auto;
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
    width: 96%;
    display: flex;
    align-items: center;
    padding-left: 0.1rem;
    height: 0.26rem;
    line-height: 0.26rem;
    font-size: 0.11rem;
    // gb-bg-lg-28 还未配置
    background-image: var(--q-gb-bg-lg-28);
    margin-top: 0.11rem;
    border-radius: 0.06rem;

    &.first {
    }

    .score-inner-span {
      width: 100%;
      //transform: translateY(-3px);
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
    border-radius: 0.08rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.4rem;
    margin: 0.03rem;

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
        width: 0.3rem;
        height: 100%;
        padding-left: 10px;
        position: relative;
        top: 1px;
        flex-shrink: 0;
        > img {
          width: 0.14rem;
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
    height: 0.23rem;
    position: relative;
    flex-wrap: nowrap;
    // transition: width 0.2s ease-in;

    .odd-title-i-w {

      margin-right: 2%;
      overflow: hidden;

      .odd-t-i-wrapper {
        padding-top: 0.01rem;

        flex-shrink: 0;
        transition: transform 0.2s;

        &.status2 {
          transform: translateX(-1.84rem);
        }
      }
    }

    .row {
      height: 100%;
    }

    .hpl-title {
      width: 0.6rem;
      height: auto;
      line-height: 1;
      margin-left: 0.01rem;
      font-size: 0.11rem;
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
    height: 100%;

    // transform: calc(0, 0.01rem);
    transform: translateY(1px);
    text-overflow: ellipsis;
    width: 3.18rem;
    flex-wrap: nowrap;
    align-items: center;
    overflow: hidden;

    .league-t-wrapper {
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
      padding-top: 0.02rem;
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
  min-height: 1.11rem;

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
    padding: 0.1rem 2% 0 2%;
    display: flex;
    justify-content: space-between;
    position: relative;
    overflow: hidden;

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
      padding-bottom: 0.05rem;

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
      width: 1.61rem;
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
        margin-top: 0.04rem;
        height: 0.3rem;
        padding-left: 0.05rem;

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

          &.new-standard {
            .live-i-b-wrap {
              width: 0.18rem;
              margin-right: 0.05rem;

              img {
                height: 0.14rem;
                width: 0.18rem;
              }

              .live-icon-btn {
                width: 100%;
              }

              .live-icon-play-btn {
                width: 100%;
                height: 0.14rem;
              }
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
        height: 0.31rem;
        display: flex;
        justify-content: space-between;
        position: relative;

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

            font-size: 0.14rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 0.2rem;
            height: 0.2rem;

            &.is-handicap {
              font-weight: bold;
            }
          }
        }

        .score-punish {
          width: 0.12rem;
          height: 0.14rem;
          color: var(--q-gb-t-c-18);
          flex-shrink: 0;
          background: var(--q-color-com-bg-color-43);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.1rem;
          border-radius: 0.02rem;
          margin-left: 0.04rem;

          &.yellow {
            background: var(--q-color-com-bg-color-23);
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
          height: 0.3rem;
          font-size: 0.14rem;
          display: flex;
          align-items: center;
          position: absolute;
          right: 0.12rem;
          top: 0;

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
  background-color: var(--q-color-com-bg-color-12);
  width: 100%;
  padding: 0 0.08rem;
  height: 0.34rem;
  display: flex;
  align-items: center;
  margin: 0 auto;
  font-size: 0.12rem;
  justify-content: space-between;

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
    padding-top: 0.03rem;
    height: 0.3rem;
    position: relative;

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

    .goto-detail {
      .count_span {
        .mc-n {
          width: 0.14rem;
        }
      }
    }
  }

  &.match-indent {
    padding-left: 0.1rem;
    position: relative;
  }

  .timer-wrapper-c {
    height: 100%;

    &.newer {
      margin-left: 0;
    }

    &>div {
      height: auto;
    }
  }

  .favorite-icon-top {
    width: 0.14rem;
    height: 100%;
    height: 0.13rem;
    flex-shrink: 0;
    margin-right: .07rem;

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
    line-height: 1.2;
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
      width: 0.8rem;
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
 src/output/index.js