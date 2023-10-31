<!--
 * @Description:   yazhou-h5       新手版 赛事组件，用于赛事列表展示赛事信息
           
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
          {{ $t('list.match_no_start') }}&nbsp;&nbsp;<span v-show="no_start_total">(0)</span>
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
              <span :class="['league-t-wrapper', { 'league-t-main-wrapper': menu_type !== 28, export: is_export }]">
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
                      :class="{ 'special-lang': ['zh', 'tw'].includes(get_lang) }">{{ $t('match_info.match_parlay') }}
                    </div>
                  </div>
                  <!-- 标准版 比分组件 -->
                  <!-- 电竞中，如果是比分判定中，则不显示该比分 -->
                  <div class="eports_scoring_tip" v-if="eports_scoring">{{ $t('mmp.eports_scoring') }}</div>
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
                              {{ $t('list.go_to_details') }}
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
                        {{ $t(`ms[${match.ms}]`) }}
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
                  <div class="eports_scoring_tip" v-if="eports_scoring">{{ $t('mmp.eports_scoring') }}</div>
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

export default {
    mixins:[],
    setup(){},
    data() {
        return {
           
        }
    },
}

    
  </script>
  <style scoped lang="scss">
    @import "../styles/match-container";
  </style>
  