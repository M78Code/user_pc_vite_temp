<!--
 * @Description: 赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div class="match-container" :style="{ marginTop: main_source == 'home_hot_page_schedule' ? '0' : '' }" :class='{
    first: i == 0,
    match_status_bar: match.is_show_no_play,
    is_league_tail: get_league_show(i + 1),
    is_division_league: match.is_show_league,
    started_un_started_next: get_m_status_show(i + 1),
    started_and_un_started: match.is_show_no_play,
    favorite_un_start_title: favorite_un_start_title(i, match_of_list.ms),
  }'>
  <template v-if="match" >
    <div style="display: none;">{{ MatchDataBaseH5.data_version.version }}</div>
    <!--体育类别 -- 标题  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
    <div v-if="get_sport_show" class="sport-title match-indent"
      :class="['sport-title match-indent', { home_hot_page: is_it_popular, is_gunqiu: [1].includes(+menu_type), first: i == 0, }]"
      @click="ball_folding_click(match_of_list.csid)">
      <!-- 首页热门 -->
      <template v-if="is_it_popular">
        <div v-if="main_source == 'home_hot_page_schedule' && lodash.get(MenuData.hot_tab_menu, 'index') == 0" class="ball_img">
          <img :src="global_theme.includes('day') ? polular_spirite : polular_spirite_theme02" alt="" :style="{ objectPosition: `0 ${calculate_ball_type_picture()}rem` }">
          <span> <i :style="compute_css({key:'h5-hot-jinxuan', position: `item_${match_of_list.csid}` })"></i>  <span>{{ match_of_list.csna }}</span> </span>
        </div>
      </template>
      <span class="score-inner-span" v-else>
        {{ match_of_list.csna || '-' }}
        <!-- {{match_of_list.csna || get_current_menu.sub.menuName}} -->
      </span>
      <!-- v-if="(!['detail_match_list', 'home_hot_page_schedule'].includes(main_source)) && collapsed" -->
      <!-- 折叠收起不用消失 -->
      <div v-if="main_source!='home_hot_page_schedule'">
        <img class="league-collapse-dir" :class="{ 'collapsed': collapsed }" v-if="global_theme.includes('day')" src='/yazhou-h5/image/list/league-collapse-icon.svg' />
        <img class="league-collapse-dir" :class="{ 'collapsed': collapsed }" v-if="global_theme.includes('night')" src='/yazhou-h5/image/list/league-collapse-icon-black.svg' />
      </div>
    </div>
    <!-- 未开赛标题  -->
    <div class="match-status-fixed flex items-center" v-if="match.is_show_no_play">
      <img src='image/list/list-red.svg' />
      <span class="din-regular">
        {{ $t('list.match_no_start') }}&nbsp;&nbsp;<span v-show="no_start_total">({{ no_start_total }})</span>
      </span>
    </div>
    <!-- 首页热门才有的样式  -->
    <div
      v-if="main_source == 'home_hot_page_schedule' && match_of_list.time_title && lodash.get(MenuData.hot_tab_menu, 'index') != 0"
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
      <div v-if="match.is_show_league || (main_source == 'home_hot_page_schedule' && get_league_show(i))"
        :class="[('league match-indent hairline-border'), { 'no-radius': get_sport_show && is_it_popular && !['home_hot_page_schedule'].includes(main_source), 'home-hot': main_source == 'home_hot_page_schedule' }]"
        @click="league_l_clicked()">
        <div class="league-t-wrap">
          <!-- 电竞图标 写死 -->
          <div class="esport" v-if="match_of_list.csid == 101" :style="compute_css('menu-sport-active-image', 2101)"></div>
          <div class="esport" v-else-if="match_of_list.csid == 103" :style="compute_css('menu-sport-active-image', 2103)"></div>
          <div class="esport" v-else-if="match_of_list.csid == 102" :style="compute_css('menu-sport-active-image', 2102)"></div>
          <div class="esport" v-else-if="match_of_list.csid == 100" :style="compute_css('menu-sport-active-image', 2100)"></div>
          <div class="league-icon-mini" v-else>
            <image-cache-load :csid="match_of_list.csid" :path="match_of_list.lurl" type="league"></image-cache-load>
          </div>
          <span class="league-title-text row justify-between">
            <span class="league-t-wrapper" :class="{ 'league-t-main-wrapper': menu_type !== 28 }">
              <span class="match-league ellipsis-2-lines" :class="{ 'match-main-league': menu_type !== 28 }">
                {{ match.tn }}
              </span>
            </span>
            <!--标准版 赔率标题栏-->
            <div class="odd-title-wraper row " v-if="get_league_show(i)"
              v-show="!show_newer_edition && !is_show_result() && !collapsed">
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
          <template v-if="(!['detail_match_list', 'home_hot_page_schedule'].includes(main_source)) && collapsed">
            <img class="league-collapse-dir" :class="{ 'collapsed': collapsed }" v-if="global_theme.includes('day')"
              src='public/image/list/league-collapse-icon.svg' />
            <img class="league-collapse-dir" :class="{ 'collapsed': collapsed }" v-if="global_theme.includes('night')"
              src='public/image/list/league-collapse-icon-black.svg' />
          </template>
        </div>
      </div>
      <!--  间隔,因为要求不能用 marginTop,因此加上此元素  -->
      <div style="height: 0.06rem " v-show="!collapsed" />
      <!--  一整块赛事的 div 内容 ： 1. 左边 【时间，队名，比分】   2. 右边 【赔率 模块】  -->
      <div class="match-odds-container study_height_s hairline-border" :ref="'mid-' + match.mid" v-show="!collapsed">
        <div class="match-odds-container-border-radius">
          <!-- 上边的 赛事日期标准版,包含 比分组件 -->
          <div class="date-container match-indent" :class="{ 'n-s-edition': !show_newer_edition }"
            v-if="!show_newer_edition && !is_show_result()">
            <div class='l standard'>
              <!--竞彩足球 星期与编号-->
              <div class="week-mcid row items-center" v-if="menu_type == 30">
                <span class="din-regular"> {{ lodash.get(match,'mcid')}} </span>
              </div>
              <!--赛事列表收藏-->
              <div v-if="GlobalAccessConfig.get_collectSwitch()" class="favorite-icon-top match list-m"
                @click.stop="toggle_collect(match, i, 'mf')">
                <!-- 未收藏图标 -->
                <img v-if="!match_of_list.mf && !get_show_favorite_list" :src="compute_img('icon-favorite')" alt="">
                <!-- 收藏图标 -->
                <img v-if='match_of_list.mf || get_show_favorite_list'  :src="compute_img('icon-favorite-d')">
              </div>
              <!-- 赛事日期标准版 -->
              <div class="timer-wrapper-c flex items-center"
                :class="{ esports: 3000 == menu_type, 'din-regular': 3000 == menu_type }">

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
                <div class="counting-down-up-container relative-position"
                  :class="{ 'special-match-container': match.mfo || [0, 31].includes(+match.mmp) }" :style="{
                    width: counting_down_up_wrapper_width === 'auto' ? 'auto' :
                      match.mfo ? 'auto' : counting_down_up_wrapper_width + 'rem'
                  }" v-if="match.ms != 110 && show_counting_down(match)">
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
                <img class="neutral-icon-btn l-bottom" src='/yazhou-h5/image/list/m-list-neutral.svg' />
              </div>

              <!-- 电竞串关标识 -->
              <div v-if="menu_type == 3000 && match.ispo" class="flag-chuan"
                :class="{ 'special-lang': ['zh', 'tw'].includes(get_lang) }">{{ $t('match_info.match_parlay') }}
              </div>
            </div>
            <!-- 标准版 比分组件 -->
            <!-- 电竞中，如果是比分判定中，则不显示该比分 -->
            <div class="eports_scoring_tip" v-if="eports_scoring">{{ $t('mmp.eports_scoring') }}</div>
            <score-list v-else-if="main_source != 'home_hot_page_schedule'" :match="match"></score-list>
          </div>
          <!-- 下边的模块，左方是  队名和 队比分,  右面是  盘口  模块 -->
          <div class="odd-list match-indent" :class="{ 'simple': show_newer_edition, result: is_show_result() }">
            <div class="odd-list-inner odd" :class="{ 'n-s-edition': !show_newer_edition, result: is_show_result() }">
              <!--赛果-->
              <div v-if="is_show_result() && match.tonum && menu_lv2.mi == 29" class="triangle-wrapper flex items-center justify-center">
                <div class="t-w-inner"> {{ match.tonum }} </div>
              </div>
              <!--  左边 图片和名称  和 比分 和 视频图标 -->
              <div class="team-wrapper" @click='goto_details(match)' :class="{
                simple: standard_edition == 1,
                team_title: is_show_result()
              }">
                <!--主队图片和名称-->
                <div class='team-title-container' :class="{
                  simple: show_newer_edition && !is_show_result(),
                  standard: !show_newer_edition && !is_show_result(),
                  result: is_show_result()
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
                      <div class="yb-goal-gif" :class="{ 'yb-goal-yo': global_theme.includes('y0') }"></div>
                      <div class="gif-text">{{ $t('match_result.goal') }}</div>
                    </div>
                    <span class='score-punish' v-show="home_red_score"
                      :class="{ flash: is_show_home_red && !is_show_result() }">
                      {{ home_red_score }}
                    </span>
                  </div>
                  <!--进行中的赛事显示比分 ,如果是比分判定中，则不显示比分-->
                  <div class="score full-score" v-show="match_of_list.ms > 0 && !is_show_result() && !eports_scoring"
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
                  standard: !show_newer_edition && !is_show_result(),
                  result: is_show_result()
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

                      <div class="yb-goal-gif" :class="{ 'yb-goal-yo': global_theme.includes('y0') }"></div>
                      <div class="gif-text">{{ $t('match_result.goal') }}</div>
                    </div>
                    <!--进行中的赛事显示比分-->
                    <span class='score-punish' v-show="away_red_score"
                      :class="{ flash: is_show_away_red && !is_show_result() }">
                      {{ away_red_score }}
                    </span>
                  </div>
                  <!--进行中的赛事显示比分 ,如果是比分判定中，则不显示比分-->
                  <div class="score full-score" v-show="match_of_list.ms > 0 && !is_show_result() && !eports_scoring"
                    :class="{ 'visibility-hidden': match_of_list.ms == 110 }">
                    {{ away_score }}
                  </div>
                  <!--发球方绿点-->
                  <span class="serving-party" :class="{ 'simple': standard_edition == 1 }"
                    v-show="set_serving_side(match_of_list, 'away')">
                  </span>
                </div>
                <!--赛果收藏-->
                <div class="row" v-if="is_show_result()">
                  <!--赛果收藏-->
                  <div class="result fav-i-wrap-match row items-center"> </div>
                  <!--赛果开赛时间-->
                  <div class="m-result-time date-time">
                    {{ format_time_zone(+match.mgt).Format(i18n_t('time4')) }}
                  </div>
                  <!-- v-if="match_of_list.playBack && is_replay_switch" -->
                  <div class="flex play-icon" >
                    <img src="/yazhou-h5/image/common/replay_y0.svg" />
                  </div>
                </div>
                <!--  左边收藏  视频动画 图标 玩法数量  赛事分析图标 提前结算图标  -->
                <div class="score-wrapper flex items-center" v-if="!show_newer_edition && !is_show_result()"
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
                        <img :src="match_analysis" alt="" style="width:0.12rem"
                          v-if="global_theme.includes('day')">
                        <img :src="match_analysis2" alt="" style="width:0.12rem" v-else>
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
              <div class="match-result-w-c column items-end auto-full-width-100" v-if="is_show_result()">
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
                        <img class="go-to-d-icon" src="/yazhou-h5//image/list/m-list-way-more.svg" />
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
              <score-list v-if="is_show_result()" :match="match"></score-list>
            </div>
          </div>

          <!--  新手版才有的  倒计时  玩法数量  底部比分 组件  -->
          <div class="date-container simple match-indent"
            :class="{ 'no-running-timer-wrapper': !show_counting_down(match) }"
            v-if="show_newer_edition && !is_show_result()">
            <div class='l test-match-mf'>
              <!--收藏图标-->
              <div v-if="!GlobalAccessConfig.get_collectSwitch()" class="go-container-w flex no-wrap favorite">
                <div class="fav-i-wrap-match row items-center" @click.stop="toggle_collect(match, i, 'mf')">
                  <div class="favorite-icon match">
                    <!-- 未收藏图标 -->
                    <img v-if="!match_of_list.mf" :src="compute_img('icon-favorite')" alt="">
                    <!-- 收藏图标 -->
                    <img :src="compute_img('icon-favorite-s')"
                      v-if='match_of_list.mf' />
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
                <img class="neutral-icon-btn" src='/yazhou-h5/image/list/m-list-neutral.svg' />
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
            v-if="!['detail_match_list', 'home_hot_page_schedule'].includes(main_source) && !is_show_result() && [1, 2, 5, 7, 8].includes(+match.csid) && standard_edition != 1"
            :main_source="main_source" 
            :mid="match_of_list.mid" />
        </div>
      </div>
    </div>
  </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import lodash from 'lodash'
import store from "src/store-redux/index.js";
import { useRouter, useRoute } from 'vue-router'
import { useMittOn, useMittEmit, MITT_TYPES,UserCtr } from  "src/core"
import countingDownSecond from 'project_path/src/components/common/counting-down.vue';
import countingDownStart from 'project_path/src/components/common/counting-down-start.vue';
import scoreList from './score-list.vue';
import oddListWrap from './odd-list-wrap.vue';
import matchOvertimePen from './match-overtime-pen.vue'
import ImageCacheLoad from "./public-cache-image.vue";
import PageSourceData from "src/core/page-source/page-source.js";
import { i18n_t,MenuData, score_switch_handle,compute_img, compute_css, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/index.js"
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import matchListClass from 'src/core/match-list-h5/match-class/match-list.js'
import { format_time_zone, format_time_zone_time, format_how_many_days, format_week } from "src/core/format/index.js"

import { normal_img_not_favorite_white, normal_img_not_favorite_black, normal_img_is_favorite, y0_img_favorite_black, lvs_icon_theme01, lvs_icon_theme02, animationUrl_icon_theme01,
  animationUrl_icon_theme02, muUrl_theme01, muUrl_theme01_y0, muUrl_theme02, muUrl_theme02_y0, none_league_icon, none_league_icon_black, match_analysis, match_analysis2, polular_spirite_theme02,
  polular_spirite,  mearlys_icon } from 'project_path/src/core/utils/local-image.js'

import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { lang, standard_edition } from 'project_path/src/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2 } from 'project_path/src/mixin/menu.js'

// TODO: 其他模块得 store  待添加
// mixins: [formatmixin, odd_convert, bettings, match_list_mixin, msc_bw3, common],
const emits = defineEmits(['unfold_changed', 'toggle_collect_league', 'toggle_collect_match'])
const props = defineProps({
  // 当前组件的赛事数据对应列表的赛事
  match_of_list: Object,
  // 赛事处于列表中的下标
  i: Number,
  // 赛事列表相关操作的类型封装对象
  matchCtr: Object,
  main_source:String,
})

const router = useRouter()
const route = useRoute()
const emitters = ref({})
const store_state = store.getState()
const timer_super11 = ref(null)
const match_change_timer = ref(null)
const is_new_init_timer2 = ref(null)
//  直播 视频  动画  按钮状态 对象
const media_button_state_obj = ref({})
// 主队显示分数
const home_score = ref(null)
// 客队显示分数
const away_score = ref(null)
// 主队红牌数
const home_red_score = ref(0)
// 客队红牌数
const away_red_score = ref(0)
// 主队黄牌数
const home_yellow_score = ref(0)
// 客队黄牌数
const away_yellow_score = ref(0)
const home_red_first_change = ref(true)
const away_red_first_change = ref(true)
// 是否显示主队进球动画
const is_show_home_goal = ref(false)
// 是否显示客队进球动画
const is_show_away_goal = ref(false)
// 是否显示主队红牌动画
const is_show_home_red = ref(false)
// 是否显示客队红牌动画
const is_show_away_red = ref(false)
// 当前组件是否第一次创建
const is_first_coming = ref(false)
//mmp阶段名称
const mmp_map_title = ref('')
//赛事切换中
const match_changing = ref(false)
// 定时器外层容器宽度
const counting_down_up_wrapper_width = ref(.8)
// 列表页进球动画和红牌动画要等组件初始化3秒后开始监听变化
const is_new_init2 = ref(false)
// 防抖 防止急速状态下点击两次
const is_on_go_detail = ref(false)

const global_theme = UserCtr.theme

const get_footer_sub_changing = ref(store_state.get_footer_sub_changing)
const get_collapse_map_match = ref(store_state.get_collapse_map_match)
const get_show_favorite_list = ref(store_state.get_show_favorite_list)
const get_img_error_map_mid = ref(store_state.get_img_error_map_mid)
const get_goto_detail_matchid = ref(store_state.get_goto_detail_matchid)
const get_goto_detail_match_info = ref(store_state.get_goto_detail_match_info)
const get_not_found_target_dom_count = ref(store_state.get_not_found_target_dom_count)
const get_standard_odd_status = ref(store_state.get_standard_odd_status)
onMounted(() => {
  is_first_coming.value = true;
  //赛事切换时钟
  match_change_timer.value = null;
  //防止赛事列表初始显示时大面积红升绿降
  timer_super11.value = setTimeout(() => {
    is_first_coming.value = false;
  },1000);
  clear_timer();
  run_new_init_timer();
  score_value();
  media_button_button_type_check()
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_SET_SCROLL_TOP, set_scroll_top).off,
  }
})

// 当前显示的赛事数据
const match = computed(() => {
  return props.match_of_list;
})

// 精彩回放视频开关是否开启
const is_replay_switch = computed(() => {
  const { configValue, eventSwitch } = lodash.get(UserCtr, 'merchantEventSwitchVO', {})
  return configValue == 1 && eventSwitch == 1
})
//  动画按钮
const animationUrl_icon = computed(() => {
  let is_theme01 = global_theme.includes('day')
  // let is_theme02 = global_theme.includes('night')
  // let is_y0 = global_theme.includes('y0')

  let animationUrl_icon = is_theme01 ? animationUrl_icon_theme01 : animationUrl_icon_theme02

  return animationUrl_icon
})
//  视频按钮
const muUrl_icon = computed(() => {
  let is_theme01 = global_theme.includes('day')
  // let is_theme02 = global_theme.includes('night')
  let is_y0 = global_theme.includes('y0')

  let muUrl_icon = ''

  if (is_y0) {
    muUrl_icon = is_theme01 ? muUrl_theme01_y0 : muUrl_theme02_y0
  } else {
    muUrl_icon = is_theme01 ? muUrl_theme01 : muUrl_theme02
  }
  return muUrl_icon
})

// TODO: 判断是否显示体育类型
const get_sport_show = computed(() => {
  if (['detail_match_list'].includes(props.main_source)) { return false }
  if (is_hot.value) {
    // 热门
    if (lodash.get(MenuData.hot_tab_menu, 'index') !== 0) { return false }
    if (props.i === 0) { return true }
    if (props.i > 0) {
      const p = MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[props.i - 1])
      const c = MatchDataBaseH5.get_quick_mid_obj(match.value.mid)
      if (p && c) {
        return p.csid !== c.csid;
      }
    }
  } else if ([1, 2, 3, 4, 11, 12, 28, 30, 3000].includes(+menu_type.value)) {
    if (props.match_of_list.show_sport_type) {
      return true
    } else {
      return false
    }
  } else {
    return false;
  }
})

// 显示收藏 图标
const favorited_computing_icon = computed(() => {
  let flag = null
  if (!lodash.get(UserCtr, 'favoriteButton') && global_theme.includes('y0')) {
    flag = y0_img_favorite_black
  } else {
    flag = normal_img_is_favorite
  }
  return flag
})

 // 显示未收藏 图标
const not_favorited_computing_icon = computed(() => {
  let flag = null
  if (global_theme.includes('day')) {
    flag = normal_img_not_favorite_white
  } else {
    flag = normal_img_not_favorite_black
  }
  return flag
})

// 是否显示视频图标, 点击跳转 去到详情页视频直播
const is_show_video_icon = computed(() => {
  let r = false;
  let ios_Android = null
  if (3000 == menu_type.value) {
    // PC、安卓优先用varl，如果varl没有值，再用vurl   IOS只用   vurl
    // 判断是否是苹果手机，是则是true
    let ua = navigator.userAgent.toLowerCase();
    let isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
    if (isIos) {
      ios_Android = props.match_of_list.vurl
    } else {
      ios_Android = props.match_of_list.varl || props.match_of_list.vurl
    }
    r = props.match_of_list.mms > 1 && ios_Android && [1, 2, 7, 10, 110].includes(+props.match_of_list.ms)
  }
  else {
    r = props.match_of_list.mms > 1 && [1, 2, 7, 10, 110].includes(+props.match_of_list.ms);
  }
      return r;
})

// 未开赛赛事数量
const no_start_total = computed(() => {
  let r = [];
  if (props.match_of_list.is_show_no_play) {
    r = lodash.filter(MatchMeta.match_mids, mid => {
      const match = MatchDataBaseH5.get_quick_mid_obj(mid)
      return !match.ms
    })
  }
  return r.length;
})

// 默认联赛图标
const default_league_icon = computed(() => {
  return global_theme.includes('night') ? none_league_icon_black : none_league_icon
})

const show_newer_edition = computed(() => {
  return standard_edition.value == 1 || props.main_source == 'detail_match_list';
})

// 是否是 拳击 或者其他球种
const match_of_list_ascertain = computed(() => {
  if (MenuData.current_menu != 28 && props.match_of_list.csid == 12 && props.match_of_list.hps.length > 1) {
        return props.match_of_list.hps.slice(0, 2)
  } else {
    return props.match_of_list.hps
  }
})

// 是否是热门模块 的 列表页
const is_it_popular = computed(() => {
  return props.main_source == 'home_hot_page_schedule'
})

// 热门模块 球类tab 下边的赛程列表 的 时间转换 = () => {
const time_change = computed(() => {
  if (props.match_of_list) {
        let time_stamp = +props.match_of_list.mgt
        return (format_how_many_days(time_stamp) ? `${format_how_many_days(time_stamp)}   ` : '') + (new Date(time_stamp)).Format(i18n_t('time2')) + '  ' + format_week(time_stamp)
  }
})

const collapsed = computed(() => {
  if (['home_hot_page_schedule'].includes(props.main_source)) return false
  return get_collapse_map_match.value ? get_collapse_map_match.value[props.match_of_list.tid] : false
})

const eports_scoring = computed(() => {
  //比分判断处理
  let scoring = false
  //如果是电竞，则进行比分判定处理
  if (menu_type.value == 3000) {
    const { mmp, home_score, away_score } = props.match_of_list
    const mmp_state = mmp || 1
    if (mmp_state != (Number(home_score) + Number(away_score) + 1)) {
      scoring = true
    }
  }
  return scoring
})

/**
 *启动 组件新初始化后 ，判定组件是否是刚刚新初始化的 定时器
*主要用于 进球动画 显示 的第一层时间段 屏蔽开关
*调用时机 :是否组件新初始化或者 key 新变更
*/
const run_new_init_timer = () => {
  // 用于对应列表的进球动画
  if (is_new_init_timer2.value) {
    clearTimeout(is_new_init_timer2.value)
  }
  is_new_init2.value = false;
  is_new_init_timer2.value = setTimeout(() => {
    is_new_init2.value = true
  }, 3000)
}
const update_counting_down_up_wrapper_width = (width) => {
  counting_down_up_wrapper_width.value = width
}
/**
 * @description: 获取key对应缓存的图片路径
 * @param {String} key  图片路径
 * @return {String} 返回缓存的路径
 */
const get_img_cache_obj = (key) => {
  // 没有图片缓存的路径就返回空字符串
  let res = '';
  // 判断是否有图片缓存的路径
  if (key && window.img_cache_obj && window.img_cache_obj[props.match_of_list.csid + '_' + key]) {
    // 获取图片缓存的路径
    res = window.img_cache_obj[props.match_of_list.csid + '_' + key];
  }
  return res;
}
/**
 * @description: 设置key对应缓存的图片路径
 * @param {String} key  图片路径
 * @param {String} event  dom event事件
 */
const set_img_cache_obj = (key, event) => {
  // 判断src属性是否有图片路径
  if (key && event && event.currentTarget && event.currentTarget.src) {
    // 判断图片缓存对象是否为空,为空时设置空对象
    if (!window.img_cache_obj) {
      // 初始化window.img_cache_obj空对象
      window.img_cache_obj = {};
    }
    // 设置缓存的图片,图片的key为球种csid + '_' +图片路径
    window.img_cache_obj[props.match_of_list.csid + '_' + key] = event.currentTarget.src;
  }
}
/**
 * @description:  直播 视频  动画 点击跳转详情播放
 * @param {String} button_type lvs 直播   muUrl 视频  animationUrl 动画
 * @return {Undefined} Undefined
 */
const media_button_handle = () => {
  // 计算真正回落的点击按钮   直播 视频  动画
  let { final_button_type } = media_button_button_type_check();
  switch (final_button_type) {
    case "lvs":
      break;
    case "muUrl":
      media_button_handle_when_muUrl();
      break;
    case "animationUrl":
      break;
    default:
      break;
  }
  store.dispatch({ type: 'matchReducer/set_is_in_play',  payload: final_button_type });
  goto_details(props.match_of_list);
}
/**
 * 计算真正回落的点击按钮   直播 视频  动画
 * @param {*} button_type
 */
const media_button_button_type_check = (button_type = 'lvs') => {
  let state_obj = {
    lvs: props.match_of_list["lvs"] && props.match_of_list["lvs"] != -1,
    muUrl: is_show_video_icon,
    animationUrl: props.match_of_list.mms <= 1 && props.match_of_list.mvs > -1,
    icon_path: '',
    final_button_type: '',
  }
  // 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画
  if (button_type == "lvs") {
    if (state_obj.lvs && ['string', 'number'].includes(typeof lodash.get(props.match_of_list, 'lss'))) {
      // 赛前图标
      if (lodash.get(props.match_of_list, 'lss') == 1) {
        state_obj.icon_path = lvs_icon_theme01
      } else if (lodash.get(props.match_of_list, 'lss') == 0 && lodash.get(props.match_of_list, 'ms') != 1) {
        // 正在直播的图标
        state_obj.icon_path = lvs_icon_theme02
      }
      state_obj.final_button_type = "lvs"
      // 如果不是中文和繁体，则隐藏
      if (!['zh', 'tw'].includes(lang.value)) {
        state_obj.lvs = false
        button_type = "muUrl";
        state_obj.icon_path = ''
      }
    } else {
      button_type = "muUrl";
    }
  }
  if (button_type == "muUrl") {
    if (state_obj.muUrl) {
      state_obj.icon_path = muUrl_icon
      state_obj.final_button_type = "muUrl"
    } else {
      button_type = "animationUrl";
    }
  }
  if (button_type == "animationUrl") {
    if (state_obj.animationUrl) {
      state_obj.icon_path = animationUrl_icon
      state_obj.final_button_type = "animationUrl"
    } else {
    }
  }
  media_button_state_obj.value = { ...state_obj }
  return state_obj
}
/**
 * 当点击 视频按钮的时候
 */
const media_button_handle_when_muUrl = () => {
  // PC、安卓优先用varl，如果varl没有值，再用vurl   IOS只用   vurl
  // 判断是否是苹果手机，是则是true
  if (3000 == menu_type.value) {
    let video_url = {
      active: "muUrl",
      media_src: "",
    };
    let ua = navigator.userAgent.toLowerCase();
    let isIos = ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1;
    if (isIos) {
      video_url.media_src = props.match_of_list.vurl;
    } else {
      video_url.media_src = props.match_of_list.varl || props.match_of_list.vurl;
    }
    store.dispatch({ type: 'matchReducer/set_video_url',  payload: video_url });
  }
  // 代表 播放正常视频 标识, 在 match_icon.vue 组件 watch 监听，监听点击直播事件,触发详情页视频直接播放
  set_is_in_play('muUrl');
  //在 match_icon.vue 组件 watch 监听
  store.dispatch({ type: 'matchReducer/set_play_video',  payload: true });
  store.dispatch({ type: 'matchReducer/set_show_video',  payload: true });
  goto_details(props.match_of_list);
}
const leaderboard_switch = () => {
  useMittEmit(MITT_TYPES.EMIT_HOT_LEADERBOARD_SWITCH)
}
const is_show_result = () => {
  let r = false;
  if(menu_type.value == 28){
    r = !['detail_match_list', 'home_hot_page_schedule'].includes(props.main_source)
  }
  return r;
}
/**
 * @Description 隐藏主队进球动画
 * @param {undefined} undefined
*/
const hide_home_goal = () => {
  is_show_home_goal.value = false
}
/**
 * @Description 隐藏客队进球动画
 * @param {undefined} undefined
*/
const hide_away_goal = () => {
  is_show_away_goal.value = false
}
/**
 * @Description 隐藏主队红牌动画
 * @param {undefined} undefined
*/
const hide_home_red = () => {
  is_show_home_red.value = false
}
/**
 * @Description 隐藏客队红牌动画
 * @param {undefined} undefined
*/
const hide_away_red = () => {
  is_show_away_red.value = false
}
/**
 * @description: 联赛点击事件，折叠或展开联赛赛事
 * @param {Object} item 点击的赛事
 */
const league_l_clicked = () => {
  // 首页热门，详情页，不需要用到折叠
  if (['detail_match_list', 'home_hot_page_schedule'].includes(props.main_source)) return;
  // get_secondary_unfold_map  次要玩法 折叠状态
  let map_collapse = lodash.cloneDeep(get_collapse_map_match.value);
  let { tid, ms } = props.match_of_list;

  // 如果是折叠, 则展开赛事
  if (map_collapse[tid] == 1) {
    if (!props.match_of_list) return;

    //展开联赛
    map_collapse[tid] = 0
  } else { //  折叠赛事
    map_collapse[tid] = 1
  }

  // 今日下目标联赛折叠前（赛事dom未隐藏前计算）
  if (menu_type.value === 3 && ms === 0 && map_collapse[tid] === 1) {
    const scroll_height = need_scroll_height_handle(tid)

    // 使用原生dom操作，this.matchCtr.view.$refs有时会获取不到目标dom
    document.querySelector('.match-list-container').scrollTop -= scroll_height
  }

  // set_collapse_map_match控制赛事dom显示隐藏
  store.dispatch({ type: 'matchReducer/set_collapse_map_match',  payload: map_collapse });
  emits('unfold_changed', props.match_of_list)

  // 今日下目标联赛展开后（赛事dom显示后计算）
  if (menu_type.value === 3 && ms === 0 && map_collapse[tid] === 0) {
    const scroll_height = need_scroll_height_handle(tid)

    clearTimeout(need_scroll_height_timer)
    need_scroll_height_timer = setTimeout(() => {
      document.querySelector('.match-list-container').scrollTop += scroll_height
    })
  }
}
/**
 * @description: 今日菜单下，点击未开赛下的联赛卡片，页面内容上移到已开赛，页面需滚动到点击位置
 */
const need_scroll_height_handle = (tid) => {
  if (!props.matchCtr.view) {
    return 0
  }

  // 进行中的同tid赛事下标
  const started_index_arr = []
  // 赛事列表
  const match_list = lodash.cloneDeep(props.matchCtr.match_list_data_sources)
  // 赛事dom块高度映射列表
  const match_height_map_list = lodash.cloneDeep(props.matchCtr.view.match_height_map_list)
  // 展开折叠 未开赛的联赛后 需滚动的距离
  let started_match_height = 0

  // 根据联赛id及赛事状态ms筛选出需计算的赛事下标
  for (let i in match_list) {
    if (match_list[i].tid === tid && [1, 110].includes(match_list[i].ms)) {
      started_index_arr.push(i)
    }

    if (started_index_arr.length && match_list[i].tid !== tid) {
      break
    }
  }

  if (!started_index_arr.length) {
    return 0
  }

  // 联赛及相应间隔高度，需在最终计算中减去
  let league_height_spacing = 0.48,
    sport_type_space = 0
 b
  // 计算同联赛进行中的赛事dom高度
  for (let i in match_height_map_list) {
    if (started_index_arr.includes(i)) {
      if (match_height_map_list[i].sport_type_space) {
        sport_type_space = match_height_map_list[i].sport_type_space
      }
      started_match_height += get_match_dom_height_by_match_data(match_height_map_list[i])
    }

    if (started_match_height && !started_index_arr.includes(i)) {
      break
    }
  }

  // 最终赛事dom高度
  started_match_height = started_match_height - league_height_spacing - sport_type_space

  return rem_height(started_match_height)
}
/**
 * 通过赛事数据获取赛事所占容器高度
 * @param {Object} match_height_map
 */
const get_match_dom_height_by_match_data = (match_height_map) => {
  let r = 0;
  match_height_map && Object.keys(match_height_map).forEach(p_key => {
    if (p_key != "" && p_key != "mid") {
      r += match_height_map[p_key];
    }
  });
  return r;
}
/**
 * @description: 设置发球方绿点显示
 * @param {Object} item 赛事对象
 * @param {Object} side 'home'主队  'away'客队
 * @return {Boolean} 是否显示发球方
 */
const set_serving_side = (item, side) => {
  if (menu_type.value == 28 && !["detail_match_list"].includes(props.main_source)) { //赛果不显示发球方绿点
    return false
  }
  return item.ms == 1 && item.mat == side;
}
/**
 * @description: 获取玩法数量
 * @param {Object} item 赛事
 * @return {Number}
 */
const get_match_mc = (item) => {
  return (item.mc * 1) < 1 ? 0 : item.mc;
}
/**
 * 包装获取图片路径的方法
 */
const get_file_path_local = (path, csid) => {
  return get_file_path(path, csid);
}
/**
 * @description: 主队队徽
 * @param {Object} item 赛事对象
 * @return {Number} is_second 0:不是双打  1:双打
 */
const home_avatar = (item, is_second) => {
  if (get_img_error_map_mid.value[item.mid] && get_img_error_map_mid.value[item.mid].home) {
    return get_img_error_map_mid.value[item.mid].home;
  }
  // 获取双打第二个头像
  if (is_second) {
    if (Array.isArray(item.mhlu) && item.mhlu.length > 1)
      return get_file_path_local(item.mhlu[1], item.csid);
    // 如果是字母logo，则返回雪碧图
    return false
  }
  // 获取单打头像或者双打第一个头像
  else {
    // 真实logo
    let match_logo;
    if (Array.isArray(item.mhlu) &&item.mhlu.length) {
      match_logo = item.mhlu[0];
    }
    else {
      match_logo = item.mhlu;
    }
    if (match_logo)
      return get_file_path_local(match_logo, item.csid);
    // 如果是字母logo，则返回雪碧图
    return false
  }
}
/**
 * @description: 客队队徽
 * @param {Object} item 赛事对象
 * @return {Number} is_second 0:不是双打  1:双打
 */
const away_avatar = (item, is_second) => {
  if (get_img_error_map_mid.value[item.mid] && get_img_error_map_mid.value[item.mid].away) {
    return get_img_error_map_mid.value[item.mid].away;
  }
  // 获取双打第二个头像
  if (is_second) {
    if (Array.isArray(item.malu) && item.malu.length > 1)
      return get_file_path_local(item.malu[1], item.csid);
    // 如果是字母logo，则返回雪碧图
    return false
  }
  // 获取单打头像或者双打第一个头像
  else {

    // 真实logo
    let match_logo;
    if (Array.isArray(item.malu) && item.malu.length) {
      match_logo = item.malu[0];
    }
    else {
      match_logo = item.malu;
    }
    if (match_logo)
      return get_file_path_local(match_logo, item.csid);
    // 如果是字母logo，则返回雪碧图
    return false
  }

}
/**
 * @description: 收藏与取消收藏
 * @param {Object} match 赛事
 * @param {Number} index 赛事下标
 * @param {Number} item 收藏类型 'tf'联赛  'mf'赛事
 * @return {String}
 */
const toggle_collect = (match, index, item) => {
  if (match == 'tf') {
    //联赛收藏或取消收藏
    emits('toggle_collect_league', { match, index, type: 'tf' })
  } else {
    //赛事收藏或取消收藏
    emits('toggle_collect_match', { match, index, type: 'mf' })
  }
}
/**
 * @description: 跳转至详情
 * @param {Object} item 赛事
 * @param {*} flag 有值时候代表要去到赛事分析页
 * @return {String}
 */
const goto_details = (item, flag) => {
  if (!item || !item.mid) return;
  if (is_on_go_detail.value) {
    return; //  防止急速点击两次
  }
  is_on_go_detail.value = true;

  // 如果是非赛果电竞赛事，需要设置菜单类型
  if (MenuData.current_menu !== 28 && [100, 101, 102, 103].includes(+item.csid)) {
    store.dispatch({ type: 'matchReducer/set_menu_type',  payload: 3000 });
  }
  // console.log({msg:'测试在极度快速的点几下,可以打印两次此消息,证明执行了两次'})

  // 跳转详情页时需清空赛种折叠状态
  store.dispatch({ type: 'matchReducer/set_collapse_csid_map',  payload: {} });
  store.dispatch({ type: 'matchReducer/set_collapse_map_match',  payload: {} });

  store.dispatch({ type: 'matchReducer/set_goto_detail_matchid',  payload: item.mid });
  // 进入详情页前，记录目标赛事top值
  // store.dispatch({ type: 'matchReducer/set_goto_detail_match_info',  payload: { top: refs['mid-' + item.mid].getBoundingClientRect().top } });
  store.dispatch({ type: 'matchReducer/set_not_found_target_dom_count',  payload: 0 });
  store.dispatch({ type: 'matchReducer/set_details_item',  payload: 0 });
  // 进入详情前，将当前赛事信息存入仓库
  store.dispatch({ type: 'matchReducer/set_match_base_info_obj',  payload: item });

  if (MenuData.current_menu && MenuData.current_menu.main && is_show_result()) {
    router.push(`/result_details/${item.mid}/0`);
  }
  else {
    if (route.name == "category") {
      router.push({ name: 'category_loading', params: { mid: item.mid } });
    }
    else {
      router.push({ name: 'category', params: { analysis: flag ? true : false, mid: item.mid, csid: item.csid } });
    }
  }
}
/**
 * @description: 多少分钟后开赛显示
 * @param {Object} item 赛事对象
 * @return {String}
 */
const show_start_counting_down = (item) => {
  if (typeof item.mcg == 'undefined') {
    return false;
  }
  let r = false;
  // 滚球中不需要显示多少分钟后开赛
  if (item && item.ms == 1) {
    return r;
  }
  let start_time = item.mgt * 1;
  let init_server = PageSourceData.init_time.server_time * 1;
  let init_local = PageSourceData.init_time.local_time;
  let now_local = new Date().getTime();
  let sub_local_time = now_local - init_local;
  let now_server_time = init_server + sub_local_time;
  let sub_time = start_time - now_server_time;

  // mcg 1:滚球 2:即将开赛 3:今日赛事 4:早盘
  r = item.mcg != 1 && 0 < sub_time && sub_time < 60 * 60 * 1000;
  return r;
}
// 赛事状态  0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断
/**
 * @description: 进行中(但不是收藏页)的赛事显示累加计时|倒计时
 * @param {Object} item 赛事对象
 * @return {Boolean}
 */
const show_counting_down = (item) => {
  return [1, 2, 10].includes(item.ms * 1);
}
/**
 * 判断是否显示进行中|未开赛
 * @param {Object} item 赛事对象
 * @returns {Boolean}
 */
const get_m_status_show = (i) => {
  let item = MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i])
  let result = false;
  if (props.main_source == 'detail_match_list') {
    return false
  }
  //非今日串关不显示
  if (![3, 11].includes(+menu_type.value)) {
    return result;
  } else if (menu_type.value == 11) {
    let third_m_id = lodash.get(MenuData.current_menu, 'date_menu.field1');
    //串关今日id为0或'0'
    if (third_m_id !== 0 && third_m_id !== '0') {
      return result;
    }
  }
  
  if (item) {
    if (i > 0) {
      let prev_match = MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i - 1])
      if ([1, 110].includes(+item.ms)) {
        result = false;
      }
      else if (![1, 110].includes(+item.ms) && [1, 110].includes(+props.match_of_list.ms)) {
        result = true;
      }
    } else if (i == 0 && ![1, 110].includes(+item.ms)) {
      result = true;
    }
  }
  return result;
}
/**
 * @description: 判断是否显示联赛
 * @param {Number} i 赛事下标
 * @return {Boolean}
 */
const get_league_show = (i) => {
  let flag = true;
  let c = null, p = null;
  if (i) {
    p = MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i - 1])
    c = MatchDataBaseH5.get_quick_mid_obj(match.value.mid)
    if (p && c) {
      if (p.tid != c.tid) {
        flag = true;
      }
      else {
        flag = false;
      }
    }
  }
  else {
    flag = true;
  }
  if (props.match_of_list.is_show_no_play) {
    flag = true;
  }
  return flag;
}
/**
 * @description: 未开赛标题展示
 * @param {Number} i 赛事下标
 * @param {Number} ms 赛事状态（1 进行中 0 未开赛）
 * @return {Boolean}
 */
const favorite_un_start_title = (i, ms) => {
  if (i == 0) {
    return false;
  }
  if (menu_type.value == 6) {
    if (props.match_of_list.is_show_no_play && ms == 0) {
      return true;
    }
  }
  return false;
}
/**
 * @description: 比分无值时用0占位
 * @param {Undefined}
 * @return {Undefined}
 */
const score_value = () => {
  if (!props.match_of_list) {
    home_score.value = 0;
    away_score.value = 0;
    home_red_score.value = 0;
    away_red_score.value = 0;
    home_yellow_score.value = 0;
    away_yellow_score.value = 0;
    return;
  }

  //比分
  if (!props.match_of_list.home_score && props.match_of_list.home_score != 0) {
    home_score.value = 0;
  } else {
    home_score.value = props.match_of_list.home_score;
  }
  if (!props.match_of_list.away_score && props.match_of_list.away_score != 0) {
    away_score.value = 0;
  } else {
    away_score.value = props.match_of_list.away_score;
  }

  //红牌
  if (!props.match_of_list.home_red_score && props.match_of_list.home_red_score != 0) {
    home_red_score.value = 0;
  } else {
    home_red_score.value = props.match_of_list.home_red_score;
  }
  if (!props.match_of_list.away_red_score && props.match_of_list.away_red_score != 0) {
    away_red_score.value = 0;
  } else {
    away_red_score.value = props.match_of_list.away_red_score;
  }

  //黄牌
  if (!props.match_of_list.home_yellow_score && props.match_of_list.home_yellow_score != 0) {
    home_yellow_score.value = 0;
  } else {
    home_yellow_score.value = props.match_of_list.home_yellow_score;
  }
  if (!props.match_of_list.away_yellow_score && props.match_of_list.away_yellow_score != 0) {
    away_yellow_score.value = 0;
  } else {
    away_yellow_score.value = props.match_of_list.away_yellow_score;
  }

  if(MenuData.current_menu !=28 && props.match_of_list.csid==1 && props.match_of_list.cds=='1500' && standard_edition.value == 1 && MenuData.footer_sub_menu_id == 114){
    // 红猫足球赛事,简版,角球菜单时屏蔽角球比分显示
    home_score.value = '';
    away_score.value = '';
  }
}
const gen_collapse_key = (item) => {
  return item.tid;
}
/**
 * @description 设置scrollTop最终滚动距离, 保证详情返回的赛事出现在视图窗口内
 */
const set_scroll_top = (scrollTop) => {
  clearTimeout(scroll_top_timer)
  nextTick (() => {
    scroll_top_timer = setTimeout(() => {
      let matchId = 'mid-' + get_goto_detail_matchid.value
      const mid_dom = $refs[matchId]
      //若存在赛事dom，则执行相应滚动逻辑
      if (mid_dom) {
        // 获取目标赛事dom视口top
        const top = mid_dom.getBoundingClientRect().top
        // 目标赛事视图top阈值
        let view_top = lodash.get(get_goto_detail_match_info.value, 'top', 0)
        // view_top = MenuData.current_menu === 4 ? 160 : 120

        if (view_top) {
          // 滚动容器
          let match_list_container = document.querySelector('.match-list-container')
          // 容器最终滚动距离
          const final_scroll_top = scrollTop + top - view_top

          match_list_container.scrollTo(0, final_scroll_top)
          set_goto_detail_matchid('')

          // 短距离滚动标识
          store.dispatch({ type: 'matchReducer/set_allow_short_scroll',  payload: true });
          // 已滚动至目标dom时，未滚动至目标计数置为-1
          store.dispatch({ type: 'matchReducer/set_not_found_target_dom_count',  payload: -1 });

          // 第二次延时计算是为了保证滚动距离正确
          clearTimeout(scroll_top_timer2)
          scroll_top_timer2 = setTimeout(() => {
            const top2 = mid_dom.getBoundingClientRect().top

            if (Math.floor(top2) > view_top) {
              match_list_container.scrollTo(0, final_scroll_top + top2 - view_top)
            }

            match_list_container = null
          }, 500)
        }

      } else {
        let not_found_target_dom_count = get_not_found_target_dom_count.value
        if (not_found_target_dom_count >= 0) {
          not_found_target_dom_count++
          store.dispatch({ type: 'matchReducer/set_not_found_target_dom_count',  payload: not_found_target_dom_count });

          // 当由详情返回后，未滚动至目标计数 和 赛事展示数量相等时，让列表滑动一些距离，防止页面列表展示空白
          if (not_found_target_dom_count === MatchMeta.match_mids.length) {
            document.querySelector('.match-list-container').scrollTop += 1
            store.dispatch({ type: 'matchReducer/set_goto_detail_matchid',  payload: '' });
          }
        } else {

        }
      }
    }, 500)
  })
}
// 热门模块 精选选项卡 下边的 球种图片
const calculate_ball_type_picture = () => {
  let csid = +props.match_of_list.csid
  let csid_poz_y = '';
  const per_y = -0.60754;  // 1740/(1074/375)/100/rem 根据屏幕宽 和rem计算而来
  switch (csid) {
    case 1:
      csid_poz_y = 0;// 足球
      break;
    case 2:
      csid_poz_y = per_y;// 篮球
      break;
    case 5:
      csid_poz_y = per_y * 2;// 网球
      break;
    case 7:
      csid_poz_y = per_y * 7;// 斯诺克
      break;
    case 10:
      csid_poz_y = per_y * 3;// 羽毛球
      break;
    case 8:
      csid_poz_y = per_y * 4;// 乒乓球
      break;
    case 9:
      csid_poz_y = per_y * 5;// 排球
      break;
    case 4:
      csid_poz_y = per_y * 6;// 冰球
      break;
    case 3:
      csid_poz_y = per_y * 8;// 棒球
      break;
    case 6:
      csid_poz_y = per_y * 9;// 美式足球
      break;
  }
  return csid_poz_y
}
// 清除当前组件所有定时器
const clear_timer = () => {
  // timeout定时器列表
  const timeout_timer_arr = [
    'timer_super11.value',
    'match_change_timer.value',
    'is_new_init_timer2.value',
    'scroll_top_timer.value',
    'scroll_top_timer2.value',
    'need_scroll_height_timer.value',
  ]

  // 批量清除timeout定时器
  for (let timer of timeout_timer_arr) {
    clearTimeout(timer)
    timer = null
  }
}

watch(() => props.match_of_list, (c_match) => {
  media_button_button_type_check()
  mmp_map_title.value = matchListClass.match_period_map(props.match_of_list);
}, { deep: true })

watch(() => props.match_of_list?.mid, (mid_new,mid_old) => {
  if (mid_new) {
    match_changing.value = true;
    /*
    切换赛事时如果足球比分大于0会触发进球动画,
    变量match_changing延迟置为false可避免触发进球动画
      */
    clearTimeout(match_change_timer.value)
    match_change_timer.value = setTimeout(() => {
      match_changing.value = false;
    }, 300);
    mmp_map_title.value = matchListClass.match_period_map(props.match_of_list);
  }
})

// 监听主队比分变化
watch(() => home_score.value, (new_,old_) => {
  if (is_first_coming.value) return;
  if (props.match_of_list.csid != 1) return;
  if (get_footer_sub_changing.value) return;
  if (match_changing.value) return;

  if (new_ > 0 && new_ != old_ && old_ !== null && (menu_type.value == 1 || menu_type.value == 3)) {
    is_show_home_goal.value = true
    hide_home_goal()
  }
})

// 监听客队比分变化
watch(() => away_score.value, (new_,old_) => {
  if (is_first_coming.value) return;
  if (props.match_of_list.csid != 1) return;
  if (get_footer_sub_changing.value) return;
  if (match_changing.value) return;

  if (new_ > 0 && new_ != old_ && old_ !== null && (menu_type.value == 1 || menu_type.value == 3)) {
    is_show_away_goal.value = true
    hide_away_goal()
  }
})
// 监听主队红牌比分变化
watch(() => home_red_score.value, (new_, old_) => {
  if (props.match_of_list.csid != 1) return
  if (home_red_first_change.value) {
    home_red_first_change.value = false;
    return;
  }
  if (new_ > 0 && new_ != old_) {
    is_show_home_red.value = true
    hide_home_red()
  }
})
// 监听客队红牌比分变化
watch(() => away_red_score.value, (new_,old_) => {
  if (props.match_of_list?.csid != 1) return
  if (away_red_first_change.value) {
    away_red_first_change.value = false;
    return;
  }
  if (new_ > 0 && new_ != old_) {
    is_show_away_red.value = true
    hide_away_red()
  }
})

// 监听比分变化
watch(() => props.match_of_list.msc, () => {
  score_switch_handle(props.match_of_list);
  score_value();
})

watch(() => props.match_of_list?.mmp, () => {
  mmp_map_title.value = matchListClass.match_period_map(props.match_of_list);
})

// 监听客队红牌比分变化
watch(() => MenuData.footer_sub_menu_id, (curr) => {
  // 简版玩法之间切换3秒内阻止赔率变化
  is_new_init2.value = false;
  clearTimeout(is_new_init_timer2.value)
  is_new_init_timer2.value = setTimeout(() => {
    is_new_init2.value = true
  }, 3000)
  if ((MenuData.prev_footer_sub_menu_id != curr && curr == 114) ||
    (MenuData.prev_footer_sub_menu_id != curr && MenuData.prev_footer_sub_menu_id == 114)
  ) {
    score_value();
  }
  MenuData.prev_footer_sub_menu_id = curr;
})

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
  get_footer_sub_changing.value = new_state.get_footer_sub_changing
  get_collapse_map_match.value = new_state.get_collapse_map_match
  get_show_favorite_list.value = new_state.get_show_favorite_list
  get_img_error_map_mid.value = new_state.get_img_error_map_mid
  get_goto_detail_matchid.value = new_state.get_goto_detail_matchid
  get_goto_detail_match_info.value = new_state.get_goto_detail_match_info
  get_not_found_target_dom_count.value = new_state.get_not_found_target_dom_count
  get_standard_odd_status.value = new_state.get_standard_odd_status
})

onUnmounted(() => {
  unsubscribe()
  Object.values(emitters.value).map((x) => x())
  clear_timer();
})

</script>


<style scoped lang="scss">
  @import "../styles/match-container";
</style>
