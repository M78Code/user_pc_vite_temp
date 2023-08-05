<!--
 * @Author: Cronus
 * @Date: 2020-07-14 17:46:47
 * @Description: 赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div class="match-container"
    :style="{marginTop: main_source == 'home_hot_page_schedule'?'0':''}"
    :class='{
      first:i == 0,
      match_status_bar:match.is_show_no_play,
      is_league_tail:get_league_show(i + 1),
      is_division_league:match.is_show_league,
      started_un_started_next:get_m_status_show(i+1),
      started_and_un_started:match.is_show_no_play,
      favorite_un_start_title:favorite_un_start_title(i,match_of_list.ms),
      }'
    >
    <!--体育类别 -- 标题  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
    <div class="sport-title match-indent"
      v-if="get_sport_show"
      :class="{home_hot_page : is_it_popular, is_gunqiu: [1].includes(+menu_type) , first:i == 0, }"
      @click="ball_folding_click(match_of_list.csid)">
      <!-- 首页热门 -->
      <template v-if="is_it_popular">
        <div v-if="main_source == 'home_hot_page_schedule' && _.get(get_hot_tab_item, 'index') == 0" class="ball_img">
          <img :src="get_theme.includes('theme01') ? `${ $g_image_preffix }/image/bw3/png/home_page/polular_spirite.png` : `${ $g_image_preffix }/image/bw3/png/home_page/polular_spirite_theme02.png`" alt=""
               :style="{objectPosition:`0 ${calculate_ball_type_picture()}rem`}">
          <span>
            <i :class="'s'+match_of_list.csid"></i>
            <p>{{match_of_list.csna}}</p>
          </span>
        </div>
      </template>
      <span class="score-inner-span" v-else >
        {{match_of_list.csna || get_current_menu.sub.menuName}}
      </span>
      <div >
        <img class="league-collapse-dir" :class="{ 'collapsed': collapsed }" v-if="get_theme.includes('theme01')"
          src='~public/image/wwwassets/bw3/list/league-collapse-icon.svg' />
        <img class="league-collapse-dir" :class="{ 'collapsed': collapsed }" v-if="get_theme.includes('theme02')"
          src='~public/image/wwwassets/bw3/list/league-collapse-icon-black.svg' />
      </div>
    </div>
    <!-- 未开赛标题  -->
    <div class="match-status-fixed flex items-center" v-if="match.is_show_no_play">
      <img src='~public/image/wwwassets/bw3/list/list-red.svg' />
      <span class="din-regular">
        {{$t('list.match_no_start')}}&nbsp;&nbsp;<span v-show="no_start_total">({{no_start_total}})</span>
      </span>
    </div>
    <!-- 首页热门才有的样式  -->
    <div v-if="main_source == 'home_hot_page_schedule' && match_of_list.time_title &&_.get(get_hot_tab_item, 'index') != 0" class="hot_time_change">
      <span>{{ time_change }}</span>
      <!-- 热门模块的 榜单页 和 赛程列表页面 的切换    menuId == "30101"是 竞彩足球的 唯一字段  ['1','2'].includes(get_hot_tab_item.field1) 表示只在篮球足球下显示时间-->
      <span @click="leaderboard_switch" v-show="i == 0 && !get_hot_tab_item.chinaBetting && ['1','2'].includes(get_hot_tab_item.field1)">{{$root.$t('home_popular.ranking')}}</span>
    </div>


    <!-- 最核心的div模块     标题 + 倒计时 + 比分 + 赔率盘口模块 -->
    <div class="match-inner-container">
      <!--联赛标题 -->
      <div class="league match-indent hairline-border"
        :class="{'no-radius': get_sport_show && is_it_popular && !['home_hot_page_schedule'].includes(main_source),'home-hot':main_source == 'home_hot_page_schedule'}"
         v-if="match.is_show_league || (main_source == 'home_hot_page_schedule' && get_league_show(i))"
         @click="league_l_clicked()"
      >
        <div class="league-t-wrap">
          <!-- 电竞图标 写死 -->
          <div v-if="match_of_list.csid == 101" class="league-icon-mini league-icon-mini2" style="--num:39"></div>
          <div v-else-if="match_of_list.csid == 103" class="league-icon-mini league-icon-mini2" style="--num:40"></div>
          <div v-else-if="match_of_list.csid == 102" class="league-icon-mini league-icon-mini2" style="--num:41"></div>
          <div v-else-if="match_of_list.csid == 100" class="league-icon-mini league-icon-mini2" style="--num:42"></div>
          <div class="league-icon-mini" v-else>
            <image-cache-load
                :csid="match_of_list.csid"
                :path="match_of_list.lurl"
                type="league"
            ></image-cache-load>
          </div>
          <span class="league-title-text row justify-between">
            <span class="league-t-wrapper" :class="{'league-t-main-wrapper': get_menu_type !== 28}">
              <span class="match-league ellipsis-2-lines" :class="{'match-main-league': get_menu_type !== 28}">
                {{match.tn}}
              </span>
            </span>
            <!--标准版 赔率标题栏-->
            <div class="odd-title-wraper row " v-if="main_source == 'home_hot_page_schedule' || match.is_show_league"
              v-show="!show_newer_edition && !is_show_result() && !collapsed">
              <div class="odd-title-i-w flex">
                <div class="odd-t-i-wrapper flex items-center"
                  :class="{'status2':get_standard_odd_status == 1 && match_of_list_ascertain.length > 3}">
                  <div class="hpl-title row items-center justify-center" :class="{'boxing':match_of_list.csid == 12}" :key="i"
                    v-for="(hpl_title, i) of $root.$t('list_title.'+match.csid+'.title')">
                    <div class="hpl-t-inner">
                      {{ hpl_title }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </span>
          <template v-if="(!['detail_match_list','home_hot_page_schedule'].includes(main_source)) && collapsed">
            <img class="league-collapse-dir" :class="{'collapsed':collapsed}"
              v-if="get_theme.includes('theme01')"
              src='~public/image/wwwassets/bw3/list/league-collapse-icon.svg' />
            <img class="league-collapse-dir" :class="{'collapsed':collapsed}"
              v-if="get_theme.includes('theme02')"
              src='~public/image/wwwassets/bw3/list/league-collapse-icon-black.svg' />
          </template>
        </div>
      </div>
      <!--  间隔,因为要求不能用 marginTop,因此加上此元素  -->
      <div style="height: 0.06rem " v-show="!collapsed"/>
      <!--  一整块赛事的 div 内容 ： 1. 左边 【时间，队名，比分】   2. 右边 【赔率 模块】  -->
      <div class="match-odds-container study_height_s hairline-border" :ref="'mid-' + match.mid" v-show="!collapsed">
        <div class="match-odds-container-border-radius">
          <!-- 上边的 赛事日期标准版,包含 比分组件 -->
          <div class="date-container match-indent"
               :class="{'n-s-edition':!show_newer_edition}"
               v-if="!show_newer_edition && !is_show_result()">
            <div class='l standard'>
              <!--竞彩足球 星期与编号-->
              <div class="week-mcid row items-center" v-if="menu_type == 30">
                <span class="din-regular">
                  {{match.mcid}}
                </span>
              </div>
              <!--赛事列表收藏-->
              <div 
                  v-if="_.get(get_access_config,'collectSwitch')"
                  class="favorite-icon-top match list-m" @click.stop="toggle_collect(match,i,'mf')">
                <!-- 未收藏图标 -->
                <img v-if="!match_of_list.mf && !get_show_favorite_list"
                      :src="not_favorited_computing_icon" alt="">
                <!-- 收藏图标 -->
                <img v-if='match_of_list.mf || get_show_favorite_list'
                      :src="favorited_computing_icon" />
              </div>
              <!-- 赛事日期标准版 -->
              <div class="timer-wrapper-c flex items-center"
                   :class="{esports:3000 == menu_type,'din-regular':3000 == menu_type}">

                <!-- 赛事回合数mfo -->
                <div v-if="match.mfo" class="mfo-title" :class="{'is-ms1': match.ms == 1}">
                  {{ match.mfo }}
                </div>
                
                <!--即将开赛 ms = 110-->
                <div class="coming-soon" v-if="match.ms" v-show="match.ms == 110">
                  {{$root.$t(`ms[${match.ms}]`)}}
                </div>
                
                <!--开赛日期 ms != 110 (不为即将开赛)  subMenuType = 13网球(进行中不显示，赛前需要显示)-->
                <div class="date-time" v-show="match.ms != 110 &&
                !show_start_counting_down(match) &&
                !show_counting_down(match)">
                  {{format_time_zone(+match.mgt).Format($root.$t('time4'))}}
                </div>
                <!--一小时内开赛 -->
                <div class="start-counting-down"
                     v-show="match.ms != 110 && show_start_counting_down(match)">
                  <counting-down-start :match="match" :index="i"
                                       :mgt_time="match.mgt">
                  </counting-down-start>
                </div>
                <!--倒计时或正计时-->
                <div 
                  class="counting-down-up-container relative-position"
                  :class="{'special-match-container': match.mfo || [0, 31].includes(+match.mmp)}"
                  :style="{width: counting_down_up_wrapper_width === 'auto' ? 'auto' :
                  match.mfo ? 'auto' : counting_down_up_wrapper_width + 'rem'}"
                  v-if="match.ms != 110 && show_counting_down(match)"
                >

                  <!--足球csid:1 冰球csid:4 橄榄球csid:14 DotaCsid:101 累加 排球csid:9 倒计时-->
                  <counting-down-second
                      ref="counting-down-second"
                      :title="mmp_map_title"
                      :mmp="match.mmp"
                      :is_add="[1,4,11,14,100,101,102,103].includes(+match.csid)"
                      :m_id="match.mid"
                      :second="match.mst"
                      :match="match"
                      @counting-wrapper-width="update_counting_down_up_wrapper_width"
                  >
                  </counting-down-second>
                </div>
              </div>
              <!-- mng 是否中立场   1:是中立场，0:非中立场-->
              <div class="live-i-b-wrap v-mode-span row items-center"
                   v-if="![5,10,7,8, 13].includes(Number(match.csid)) && match.mng * 1">
                <img class="neutral-icon-btn l-bottom" src='~public/image/wwwassets/bw3/list/m-list-neutral.svg' />
              </div>
              
              <!-- 电竞串关标识 -->
              <div
                  v-if="menu_type == 3000 && match.ispo"
                  class="flag-chuan"
                  :class="{'special-lang': ['zh', 'tw'].includes(get_lang)}"
              >{{ $root.$t('match_info.match_parlay') }}</div>
            </div>
            <!-- 标准版 比分组件 -->
            <!-- 电竞中，如果是比分判定中，则不显示该比分 -->
            <div class="eports_scoring_tip" v-if="eports_scoring">{{$root.$t('mmp.eports_scoring')}}</div>
            <score-list :match="match" v-else-if="main_source != 'home_hot_page_schedule'"></score-list>
          </div>
          <!-- 下边的模块，左方是  队名和 队比分,  右面是  盘口  模块 -->
          <div class="odd-list match-indent"
               :class="{'simple':show_newer_edition,result:is_show_result()}">
            <div class="odd-list-inner odd" :class="{
              'n-s-edition':!show_newer_edition,
              result:is_show_result()
            }">
              <!--赛果-->
              <div v-if="is_show_result() && match.tonum && get_curr_sub_menu_type == 29"
                   class="triangle-wrapper flex items-center justify-center">
                <div class="t-w-inner">
                  {{match.tonum}}
                </div>
              </div>
              <!--  左边 图片和名称  和 比分 和 视频图标 -->
              <div class="team-wrapper" @click='goto_details(match)'
                   :class="{
                  simple:get_newer_standard_edition == 1,
                  team_title:is_show_result()}">
                <!--主队图片和名称-->
                <div class='team-title-container'
                     :class="{
                  simple:show_newer_edition && !is_show_result(),
                  standard:!show_newer_edition && !is_show_result(),
                  result:is_show_result()
                  }">
                  <div class="team-title-inner-con">
                    <!-- 1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 -->
                    <div class="team-icon row no-wrap"
                         v-if="!([5,10,7,8].includes(Number(match.csid)))">
                      <image-cache-load
                          :csid="+match.csid"
                          :path="match.mhlu"
                          type="home"
                      ></image-cache-load>
                    </div>
                    <div class='team-t-title-w' :class="{
                      'is-handicap':match.handicap_index == 1,
                      'is-handicap-1':match.handicap_index == 2,
                      }">
                      {{match.mhn}}
                    </div>
                    <!-- 进球动画 -->
                    <div class="yb-flex-center" v-if="is_show_home_goal && is_new_init2 && (!is_show_away_goal)">
                      <div class="yb-goal-gif" :class="{'yb-goal-yo':get_theme.includes('y0')}"></div>
                      <div class="gif-text">{{$root.$t('match_result.goal')}}</div>
                    </div>
                    <span class='score-punish' v-show="home_red_score "
                          :class="{flash:is_show_home_red && !is_show_result()}">
                    {{home_red_score}}
                  </span>
                  </div>
                  <!--进行中的赛事显示比分 ,如果是比分判定中，则不显示比分-->
                  <div class="score full-score"
                       v-show="match_of_list.ms > 0  && !is_show_result() && !eports_scoring"
                       :class="{'visibility-hidden':match_of_list.ms == 110}">
                    {{home_score}}
                  </div>
                  <!--发球方绿点-->
                  <span class="serving-party" :class="{'simple':get_newer_standard_edition == 1}"
                        v-show="set_serving_side(match_of_list,'home')">
                  </span>
                </div>
                <!--客队图片和名称-->
                <div class='team-title-container'
                     :class="{
                  simple:show_newer_edition,
                  standard:!show_newer_edition && !is_show_result(),
                  result:is_show_result()
                }">
                  <div class="team-title-inner-con">
                    <!-- 1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 -->
                    <div v-if="!([5,10,7,8].includes(Number(match.csid)))"
                         class="team-icon row no-wrap">
                      <image-cache-load
                          :csid="match.csid ? match.csid : match.sportId"
                          :path="match.malu ? match.malu : match.picUrl"
                          type="away"
                      ></image-cache-load>
                    </div>
                    <div class='team-t-title-w' :class="{
                      'is-handicap':match.handicap_index == 2,
                      'is-handicap-1':match.handicap_index == 1,
                      }">
                      {{match.man}}
                    </div>
                    <!-- 进球动画 -->
                    <div class="yb-flex-center" v-if="is_show_away_goal && is_new_init2  && (!is_show_home_goal)">

                      <div class="yb-goal-gif" :class="{'yb-goal-yo':get_theme.includes('y0')}"></div>
                      <div class="gif-text">{{$root.$t('match_result.goal')}}</div>
                    </div>
                    <!--进行中的赛事显示比分-->
                    <span class='score-punish' v-show="away_red_score"
                          :class="{flash:is_show_away_red && !is_show_result()}">
                      {{away_red_score}}
                    </span>
                  </div>
                  <!--进行中的赛事显示比分 ,如果是比分判定中，则不显示比分-->
                  <div class="score full-score"
                       v-show="match_of_list.ms > 0 && !is_show_result() && !eports_scoring"
                       :class="{'visibility-hidden':match_of_list.ms == 110}">
                    {{away_score}}
                  </div>
                  <!--发球方绿点-->
                  <span class="serving-party" :class="{'simple':get_newer_standard_edition == 1}"
                        v-show="set_serving_side(match_of_list,'away')">
                  </span>
                </div>
                <!--赛果收藏-->
                <div class="row" v-if="is_show_result()">
                  <!--赛果收藏-->
                  <div class="result fav-i-wrap-match row items-center">
                  </div>
                  <!--赛果开赛时间-->
                  <div class="m-result-time date-time">
                    {{format_time_zone(+match.mgt).Format($root.$t('time4'))}}
                  </div>
                  <div class="flex play-icon" v-if="match_of_list.playBack&&is_replay_switch">
                    <!-- <img src="image/bw3/svg/details/replay_y0.svg" /> -->
                  </div>
                </div>
                <!--  左边收藏  视频动画 图标 玩法数量  赛事分析图标 提前结算图标  -->
                <div class="score-wrapper flex items-center"
                     v-if="!show_newer_edition && !is_show_result()"
                     v-show="footer_sub_menu_id != 114">
                  <div class="r row no-wrap">
                    <div class="go-container-w flex no-wrap new-standard">
                       <!-- 直播 主播 视频 动画  icon 栏目   -->
                       <!-- 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画 -->
                       <div class="live-i-b-wrap v-mode-span row items-center"
                        slot=""  v-if="media_button_state_obj.icon_path"
                         @click="media_button_handle()"
                       >
                           <img class="live-icon-btn" :src='media_button_state_obj.icon_path' />
                       </div>
                      <!-- 足篮球展示赛事分析图标 -->
                      <div class="column justify-center yb_px4" v-if="[1, 2].includes(+match.csid) && _.get(get_access_config,'statisticsSwitch')"
                           @click='goto_details(match, 1)'>
                            <img  src="image/bw3/svg/match_analysis.svg" alt="" style="width:0.12rem" v-if="get_theme.includes('theme01')">
                            <img  src="image/bw3/svg/match_analysis2.svg" alt="" style="width:0.12rem" v-else>
                      </div>
                      <!-- 此赛事支持提前结算 -->
                      <div class="column justify-center yb_px2" v-if="match_of_list.mearlys == 1">
                        <img  src="image/wwwassets/bw3/list/mearlys.png" alt="" style="width:0.2rem">
                      </div>

                      <!--玩法数量-->
                      <div class="goto-detail" @click='goto_details(match)'>
                      <span class="count_span" :class="{esports:3000 == menu_type}">
                        <span class="mc-n">
                          {{_.get(get_access_config,'handicapNum') ? get_match_mc(match): $root.$t('footer_menu.more')}}
                        </span>
                        <span class="add_text" v-if="_.get(get_access_config,'handicapNum')">+</span>
                      </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--  赛果 比分和图标 -->
              <div class="match-result-w-c column items-end auto-full-width-100"
                   v-if="is_show_result()">
                <div class="row justify-end auto-full-width-100 match-result-score-wrap" @click="goto_details(match)">
                  <div class="score-result-wrapper">
                    <div class="score-row row items-center justify-end"
                         :class="{'win-way':+home_score > +away_score}">
                      {{home_score}}
                    </div>
                    <div class="score-row row items-center justify-end"
                         :class="{'win-way':+away_score > +home_score}">
                      {{away_score}}
                    </div>
                  </div>
                  <div class="go-to-d-detail-w">
                    <div @click="goto_details(match)" class="go-to-i-detail-i row items-center justify-center">
                      <div class='word'>
                        {{$root.$t('list.go_to_details')}}
                      </div>
                      <div>
                        <img class="go-to-d-icon" src="image/wwwassets/bw3/list/m-list-way-more.svg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 右边盘口组件 -->
              <odd-list-wrap v-else
                :main_source="main_source"
                :match="matchCtr.list[i]"
              />
            </div>
            <!-- 比分组件 -->
            <div class="w-score-result row justify-end">
              <score-list v-if="is_show_result()" :match="match"></score-list>
            </div>
          </div>

          <!--  新手版才有的  倒计时  玩法数量  底部比分 组件  -->
          <div class="date-container simple match-indent"
               :class="{'no-running-timer-wrapper': !show_counting_down(match)}"
               v-if="show_newer_edition && !is_show_result()">
            <div class='l test-match-mf'>
              <!--收藏图标-->
              <div 
                  v-if="!_.get(get_access_config,'collectSwitch')"
                  class="go-container-w flex no-wrap favorite">
                <div class="fav-i-wrap-match row items-center"
                     @click.stop="toggle_collect(match,i,'mf')">
                  <div class="favorite-icon match">
                    <!-- 未收藏图标 -->
                    <img v-if="!match_of_list.mf"
                         :src="not_favorited_computing_icon" alt="">
                    <!-- 收藏图标 -->
                    <img :src="!_.get(get_user, 'favoriteButton') && get_theme.includes('y0') ? y0_img_favorite_black : normal_img_is_favorite" v-if='match_of_list.mf' />
                  </div>
                </div>
              </div>
              <!--竞彩足球 星期与编号-->
              <div class="week-mcid row items-center" v-if="menu_type == 30">
              <span class="din-regular" style="font-size:.14rem">
                {{match.mcid}}
              </span>
              </div>
              <!--开赛时间-->
              <div class="timer-wrapper-c newer">
                <!--即将开赛 ms = 110-->
                <div class="coming-soon" v-show="match.ms == 110">
                  {{$root.$t(`ms[${match.ms}]`)}}
                </div>
                <!--开赛日期 ms != 110 (不为即将开赛)  subMenuType = 13网球(进行中不显示，赛前需要显示)-->
                <div class="date-time" v-show="match.ms != 110 &&
                !show_start_counting_down(match) &&
                !show_counting_down(match)">
                  {{format_time_zone(+match.mgt).Format($root.$t('time4'))}}
                </div>
                <!--一小时内开赛 -->
                <div class="start-counting-down"
                     v-show="match.ms != 110 && show_start_counting_down(match)">
                  <counting-down-start :match="match" :index="i"
                                       :mgt_time="match.mgt">
                  </counting-down-start>
                </div>
                <!--倒计时或正计时-->
                <div class="counting-down-up-container relative-position"
                     :class="{'long-time': match.mst >= 6000, 'intermission': match.mmp == 31, 'special-match-container': match.mfo || [0, 31].includes(+match.mmp)}"
                     :style="{width: counting_down_up_wrapper_width === 'auto' ? 'auto' : counting_down_up_wrapper_width + 'rem'}"
                     v-if="match.ms != 110 && show_counting_down(match)">
                  <!--csid足球1冰球4手球11累加  排球csid:9 倒计时-->
                  <counting-down-second
                      ref="counting-down-second-simple"
                      :title="mmp_map_title"
                      :mmp="match.mmp"
                      :is_add="[1,4,11,14,100,101,102,103].includes(+match.csid)"
                      :m_id="match.mid"
                      :second="match.mst"
                      :match="match"
                      @counting-wrapper-width="update_counting_down_up_wrapper_width"
                  >
                  </counting-down-second>
                </div>
              </div>
               <!-- 直播 主播 视频 动画  icon 栏目   -->
               <!-- 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画 -->
               <div class="live-i-b-wrap v-mode-span row items-center"
               v-if="media_button_state_obj.icon_path"
                   @click="media_button_handle()">
                 <img class="live-icon-btn" :src='media_button_state_obj.icon_path' />
              </div>
              <!--中立场图标-->
              <div class="live-i-b-wrap newer" v-show="match.mng * 1 && ![5,10,7,8].includes(Number(match.csid))">
                <img class="neutral-icon-btn" src='~public/image/wwwassets/bw3/list/m-list-neutral.svg' />
              </div>
              <!--玩法数量-->
              <div class="go-container-w mcount flex">
                <div class='goto-detail' @click='goto_details(match)'>
                  <div class="count_span">
                  <span class="mc-n">
                    {{_.get(get_access_config,'handicapNum') ? get_match_mc(match): $root.$t('footer_menu.more')}}
                  </span>
                    <span class="add_text" v-if="_.get(get_access_config,'handicapNum')">+</span>
                  </div>
                </div>
              </div>
            </div>
            <!--比分栏-->
            <div class="r row no-wrap">
              <div class="score-wrapper flex"
                   v-show="match.ms != 0 && (match.csid != 1 || footer_sub_menu_id != 114)">
                <score-list :main_source="main_source" :match="match"></score-list>
              </div>
            </div>
             <!-- 简版 比分组件 -->
            <!-- 电竞中，如果是比分判定中，则不显示该比分 -->
            <div class="eports_scoring_tip" v-if="eports_scoring">{{$root.$t('mmp.eports_scoring')}}</div>
          </div>
          <!--角球，罚牌，晋级，加时赛，点球大战玩法-->
          <!-- cisd:1 足球， 2 篮球， 5 网球， 7 斯诺克， 8 乒乓球 -->
          <match-overtime-pen
            v-if="!['detail_match_list','home_hot_page_schedule'].includes(main_source) &&
            [1,2,5,7,8].includes(+match.csid) &&
            get_newer_standard_edition != 1"
            :main_source="main_source"
            :matchCtr="matchCtr"
            :i="i" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";
  import formartmixin from 'src/project/mixins/module/formartmixin.js';
  import odd_convert from "src/public/mixins/odds_conversion/odds_conversion.js";
  import bettings from "src/project/mixins/betting/betting";
  import match_list_mixin from "src/project/mixins/match_list/match_list_mixin";
  import common from "src/project/mixins/constant";
  import msc_bw3 from "src/project/mixins/match_list/msc-bw3.js";
  import counting_timer from 'src/project/components/common/counting-down.vue';
  import counting_down_start from 'src/project/components/common/counting_down_start.vue';
  import no_data from "src/project/components/common/no_data.vue";
  import score_list from 'src/project/pages/match-list/components/score_list.vue';
  import odd_list_wrap from 'src/project/pages/match-list/components/odd_list_wrap.vue';
  import match_overtime_pen from 'src/project/pages/match-list/components/match_overtime_pen.vue'
  import ImageCacheLoad from "src/project/pages/match-list/components/public_cache_image.vue";
  export default {
    name: "match_container",
    mixins: [formartmixin, odd_convert, bettings, match_list_mixin, msc_bw3, common],
    props: {
      // 当前组件的赛事数据对应列表的赛事
      match_of_list: Object,
      // 赛事处于列表中的下标
      i: Number,
      // 值为6当前为收藏页
      menu_type: Number | String,
      // 赛事列表相关操作的类型封装对象
      matchCtr: Object,
      //
      main_source:String,
    },
    data() {
      return {
        // 未收藏相关图标
        normal_img_not_favorite_white:"image/wwwassets/bw3/common/m-list-favorite.svg",
        normal_img_not_favorite_black:"image/wwwassets/bw3/common/m-list-favorite-theme02.svg",
        // 已经收藏的图标
        normal_img_is_favorite:"image/wwwassets/bw3/common/m-list-favorite-s.svg",
        y0_img_favorite_black:"image/wwwassets/bw3/common/m-list-favorite-s-y0.svg",
        // 正在直播的
        lvs_icon_theme01 :  "image/wwwassets/bw3/common/zhibo-l.png",
        // 赛前直播的
        lvs_icon_theme02 : "image/wwwassets/bw3/common/zhibo-before.svg",
        animationUrl_icon_theme01 :  "image/wwwassets/bw3/common/donghua-zhichi.svg",
        animationUrl_icon_theme02 : "image/wwwassets/bw3/common/donghua-zhichi.svg",
        muUrl_theme01 :  "image/wwwassets/bw3/list/video_play-button-play.svg",
        muUrl_theme01_y0 :  "image/wwwassets/bw3/list/video_play-button-play_y0.svg",
        muUrl_theme02 : "image/wwwassets/bw3/list/video_play-button-play-theme02.svg",
        muUrl_theme02_y0 :  "image/wwwassets/bw3/list/video_play-button-play_y0.svg" ,
       //  直播 视频  动画  按钮状态 对象
        media_button_state_obj:{},
        // 主队显示分数
        home_score:null,
        // 客队显示分数
        away_score:null,
        // 主队红牌数
        home_red_score:0,
        // 客队红牌数
        away_red_score:0,
        // 主队黄牌数
        home_yellow_score:0,
        // 客队黄牌数
        away_yellow_score:0,
        home_red_first_change:true,
        away_red_first_change:true,
        // 上次的页脚子菜单id
        prev_footer_sub_menu_id:null,
        // 是否显示主队进球动画
        is_show_home_goal:false,
        // 是否显示客队进球动画
        is_show_away_goal:false,
        // 是否显示主队红牌动画
        is_show_home_red:false,
        // 是否显示客队红牌动画
        is_show_away_red:false,
        // 无联赛logo图标
        none_league_icon: "image/wwwassets/bw3/common/match_cup.svg",
        // 无联赛logo图标黑色版
        none_league_icon_black: "image/wwwassets/bw3/common/match_cup_black.svg",
        // 当前组件是否第一次创建
        is_first_coming:false,
        //mmp阶段名称
        mmp_map_title:'',
        //赛事切换中
        match_changing:false,
        // 定时器外层容器宽度
        counting_down_up_wrapper_width: .8,
        // 列表页进球动画和红牌动画要等组件初始化3秒后开始监听变化
        is_new_init2 :false,
        is_on_go_detail:false, // 防抖 防止急速状态下点击两次
      }
    },
    created(){
      this.hide_home_goal = this.debounce(this.hide_home_goal,5000)
      this.hide_away_goal = this.debounce(this.hide_away_goal,5000)
      this.hide_home_red = this.debounce(this.hide_home_red,5000)
      this.hide_away_red = this.debounce(this.hide_away_red,5000)

      this.is_first_coming = true;
      //赛事切换时钟
      this.match_change_timer = null;
      //组件是 刚刚新初始化的 定时器
      this.is_new_init_timer2 = null;
      //防止赛事列表初始显示时大面积红升绿降
      this.timer_super11 = setTimeout(() => {
        this.is_first_coming = false;
      },1000);
    },
    mounted(){
      this.run_new_init_timer();
      this.score_value();
      this.$root.$on(this.emit_cmd.EMIT_SET_SCROLL_TOP, this.set_scroll_top);
      this.match_period_map(this.match);
      this.media_button_button_type_check()
    },
    destroyed(){
      this.debounce_throttle_cancel(this.hide_home_goal);
      this.debounce_throttle_cancel(this.hide_away_goal);
      this.debounce_throttle_cancel(this.hide_home_red);
      this.debounce_throttle_cancel(this.hide_away_red);
      this.$root.$off(this.emit_cmd.EMIT_SET_SCROLL_TOP, this.set_scroll_top);

      this.clear_timer();
    },
    methods: {
      ...mapMutations([
        'set_goto_detail_matchid',
        'set_goto_detail_match_info',
        "set_menu_type",    // 设置当前主菜单menu_type值
        'set_details_item',
        'set_collapse_map_match',
        'set_collapse_csid_map',
        'set_collapse_all_ball',
        'set_last_ball_csid',
        'set_is_in_play',
        'set_show_video',
        'set_play_video',
        'set_video_url',
        'set_match_base_info_obj',
        'set_last_route_info',
        'set_allow_short_scroll',
        'set_not_found_target_dom_count',
        'set_standard_odd_status',
      ]),
      /**
       *启动 组件新初始化后 ，判定组件是否是刚刚新初始化的 定时器
       *主要用于 进球动画 显示 的第一层时间段 屏蔽开关
       *调用时机 :是否组件新初始化或者 key 新变更
       */
      run_new_init_timer() {
        // 用于对应列表的进球动画
        if(this.is_new_init_timer2 ){
          clearTimeout(this.is_new_init_timer2)
        }
        this.is_new_init2 = false;
        this.is_new_init_timer2 = setTimeout(()=>{
          this.is_new_init2 = true
        },3000)
      },
      update_counting_down_up_wrapper_width(width) {
        this.counting_down_up_wrapper_width = width
      },
      /**
       * @description: 获取key对应缓存的图片路径
       * @param {String} key  图片路径
       * @return {String} 返回缓存的路径
       */
      get_img_cache_obj(key){
        // 没有图片缓存的路径就返回空字符串
        let res = '';
        // 判断是否有图片缓存的路径
        if(key && window.img_cache_obj && window.img_cache_obj[this.match_of_list.csid+'_'+key]){
          // 获取图片缓存的路径
          res = window.img_cache_obj[this.match_of_list.csid+'_'+key];
        }
        return res;
      },
      /**
       * @description: 设置key对应缓存的图片路径
       * @param {String} key  图片路径
       * @param {String} event  dom event事件
       */
      set_img_cache_obj(key,event){
        // 判断src属性是否有图片路径
        if(key && event && event.currentTarget && event.currentTarget.src){
          // 判断图片缓存对象是否为空,为空时设置空对象
          if(!window.img_cache_obj){
            // 初始化window.img_cache_obj空对象
            window.img_cache_obj = {};
          }
          // 设置缓存的图片,图片的key为球种csid + '_' +图片路径
          window.img_cache_obj[this.match_of_list.csid+'_'+key] = event.currentTarget.src;
        }
      },
      /**
       * @description:  直播 视频  动画 点击跳转详情播放
       * @param {String} button_type lvs 直播   muUrl 视频  animationUrl 动画
       * @return {Undefined} Undefined
       */
     media_button_handle() {
      // 计算真正回落的点击按钮   直播 视频  动画
      let {final_button_type} = this.media_button_button_type_check();
      switch (final_button_type) {
        case "lvs":
          break;
        case "muUrl":
          this.media_button_handle_when_muUrl();
          break;
        case "animationUrl":
          break;
        default:
          break;
      }
      this.set_is_in_play(final_button_type);
      this.goto_details(this.match);
    },
    /**
     * 计算真正回落的点击按钮   直播 视频  动画
     * @param {*} button_type
     */
    media_button_button_type_check(button_type='lvs') {
      let state_obj = {
        lvs: this.match["lvs"] && this.match["lvs"] != -1,
        muUrl: this.is_show_video_icon,
        animationUrl: this.match.mms <= 1 && this.match.mvs > -1,
        icon_path:'',
        final_button_type:'',
      }
      // 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画
      if (button_type == "lvs") {
        if (state_obj.lvs && ['string', 'number'].includes(typeof _.get(this.match,'lss')) ) {
          // 赛前图标
          if(_.get(this.match,'lss') == 1){
            state_obj.icon_path = this.lvs_icon_theme01
          }else if(_.get(this.match,'lss') == 0 && _.get(this.match,'ms') != 1){
            // 正在直播的图标
            state_obj.icon_path = this.lvs_icon_theme02
          }
          state_obj.final_button_type = "lvs"
          // 如果不是中文和繁体，则隐藏
          if(!['zh','tw'].includes(this.get_lang)){
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
          state_obj.icon_path = this.muUrl_icon
          state_obj.final_button_type = "muUrl"
        } else {
          button_type = "animationUrl";
        }
      }
      if (button_type == "animationUrl") {
        if (state_obj.animationUrl) {
          state_obj.icon_path = this.animationUrl_icon
          state_obj.final_button_type = "animationUrl"
        } else {
        }
      }
      this.media_button_state_obj = {...state_obj}
      return state_obj
    },
    /**
     * 当点击 视频按钮的时候
     */
    media_button_handle_when_muUrl() {
      // PC、安卓优先用varl，如果varl没有值，再用vurl   IOS只用   vurl
      // 判断是否是苹果手机，是则是true
      if (3000 == this.menu_type) {
        let video_url = {
          active: "muUrl",
          media_src: "",
        };
        let ua = navigator.userAgent.toLowerCase();
        let isIos = ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1;
        if (isIos) {
          video_url.media_src = this.match.vurl;
        } else {
          video_url.media_src = this.match.varl || this.match.vurl;
        }
        this.set_video_url(video_url);
      }
      // 代表 播放正常视频 标识, 在 match_icon.vue 组件 watch 监听，监听点击直播事件,触发详情页视频直接播放
      this.set_is_in_play('muUrl');
      //在 match_icon.vue 组件 watch 监听
      this.set_play_video(true);
      this.set_show_video(true);
      this.goto_details(this.match);
    },
      leaderboard_switch() {
        this.$root.$emit(this.emit_cmd.EMIT_HOT_LEADERBOARD_SWITCH)
      },
      is_show_result(){
        let r = false;
        if(_.get(this.get_current_menu, 'main.menuType') == 28){
          r = !['detail_match_list', 'home_hot_page_schedule'].includes(this.main_source)
        }
        return r;
      },
      /**
       * @Description 隐藏主队进球动画
       * @param {undefined} undefined
      */
      hide_home_goal(){
        this.is_show_home_goal = false
      },
      /**
       * @Description 隐藏客队进球动画
       * @param {undefined} undefined
      */
      hide_away_goal(){
        this.is_show_away_goal = false
      },
      /**
       * @Description 隐藏主队红牌动画
       * @param {undefined} undefined
      */
      hide_home_red(){
        this.is_show_home_red = false
      },
      /**
       * @Description 隐藏客队红牌动画
       * @param {undefined} undefined
      */
      hide_away_red(){
        this.is_show_away_red = false
      },
      /**
       * @description: 联赛点击事件，折叠或展开联赛赛事
       * @param {Object} match 点击的赛事
       */
      league_l_clicked(){
        // 首页热门，详情页，不需要用到折叠
        if(['detail_match_list','home_hot_page_schedule'].includes(this.main_source)) return;
        // get_secondary_unfold_map  次要玩法 折叠状态
        let map_collapse = _.cloneDeep(this.get_collapse_map_match);
        let {tid, ms} = this.match_of_list;

        // 如果是折叠, 则展开赛事
        if(map_collapse[tid] == 1){
          if(!this.match_of_list) return;

          //展开联赛
          map_collapse[tid] = 0
        } else{ //  折叠赛事
          map_collapse[tid] = 1
        }

        // 今日下目标联赛折叠前（赛事dom未隐藏前计算）
        if (this.menu_type === 3 && ms === 0 && map_collapse[tid] === 1) {
          const scroll_height = this.need_scroll_height_handle(tid)

          // 使用原生dom操作，this.matchCtr.view.$refs有时会获取不到目标dom
          document.querySelector('.match-list-container').scrollTop -= scroll_height
        }

        // set_collapse_map_match控制赛事dom显示隐藏
        this.set_collapse_map_match(map_collapse);
        this.$emit('unfold_changed',this.match_of_list);

        // 今日下目标联赛展开后（赛事dom显示后计算）
        if (this.menu_type === 3 && ms === 0 && map_collapse[tid] === 0) {
          const scroll_height = this.need_scroll_height_handle(tid)

          clearTimeout(this.need_scroll_height_timer)
          this.need_scroll_height_timer = setTimeout(() => {
            document.querySelector('.match-list-container').scrollTop += scroll_height
          })
        }
      },
      /**
       * @description: 今日菜单下，点击未开赛下的联赛卡片，页面内容上移到已开赛，页面需滚动到点击位置
       */
      need_scroll_height_handle(tid) {
        if (!this.matchCtr.view) {
          return 0
        }

        // 进行中的同tid赛事下标
        const started_index_arr = []
        // 赛事列表
        const match_list = _.cloneDeep(this.matchCtr.match_list_data_sources)
        // 赛事dom块高度映射列表
        const match_height_map_list = _.cloneDeep(this.matchCtr.view.match_height_map_list)
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

        // 计算同联赛进行中的赛事dom高度
        for (let i in match_height_map_list) {
          if (started_index_arr.includes(i)) {
            if (match_height_map_list[i].sport_type_space) {
              sport_type_space = match_height_map_list[i].sport_type_space
            }
            started_match_height += this.get_match_dom_height_by_matchdata(match_height_map_list[i])
          }

          if (started_match_height && !started_index_arr.includes(i)) {
            break
          }
        }

        // 最终赛事dom高度
        started_match_height = started_match_height - league_height_spacing - sport_type_space

        return this.rem_height(started_match_height)
      },
      /**
       * 通过赛事数据获取赛事所占容器高度
       * @param {Object} match_height_map
       */
      get_match_dom_height_by_matchdata(match_height_map) {
        let r = 0;
        Object.keys(match_height_map).forEach(p_key => {
          if (p_key != "" && p_key != "mid") {
            r += match_height_map[p_key];
          }
        });
        return r;
      },
      /**
       * @description: 设置发球方绿点显示
       * @param {Object} match 赛事对象
       * @param {Object} side 'home'主队  'away'客队
       * @return {Boolean} 是否显示发球方
       */
      set_serving_side(match,side){
        if(this.menu_type == 28 && !["detail_match_list"].includes(this.main_source) ){ //赛果不显示发球方绿点
          return false
        }
        return match.ms == 1 && match.mat == side ;
      },
      /**
       * @description: 获取玩法数量
       * @param {Object} match 赛事
       * @return {Number}
       */
      get_match_mc(match){
        return (match.mc * 1) < 1 ? 0 : match.mc;
      },
      /**
       * 包装获取图片路径的方法
       */
      get_file_path_local(path,csid){
        return this.get_file_path(path,csid);
      },
      /**
       * @description: 主队队徽
       * @param {Object} match 赛事对象
       * @return {Number} is_second 0:不是双打  1:双打
       */
      home_avatar(match,is_second){
        if(this.get_img_error_map_mid[match.mid] && this.get_img_error_map_mid[match.mid].home){
          return this.get_img_error_map_mid[match.mid].home;
        }
        // 获取双打第二个头像
        if(is_second){
          if(Array.isArray(match.mhlu) && match.mhlu.length > 1)
            return this.get_file_path_local(match.mhlu[1],match.csid);
          // 如果是字母logo，则返回雪碧图
          return false
        }
        // 获取单打头像或者双打第一个头像
        else{
          // 真实logo
          let match_logo;
          if(Array.isArray(match.mhlu) && match.mhlu.length){
            match_logo = match.mhlu[0];
          }
          else{
            match_logo = match.mhlu;
          }
          if(match_logo)
            return this.get_file_path_local(match_logo,match.csid);
          // 如果是字母logo，则返回雪碧图
          return false
        }
      },
      /**
       * @description: 客队队徽
       * @param {Object} match 赛事对象
       * @return {Number} is_second 0:不是双打  1:双打
       */
      away_avatar(match,is_second){
        if(this.get_img_error_map_mid[match.mid] && this.get_img_error_map_mid[match.mid].away){
          return this.get_img_error_map_mid[match.mid].away;
        }
        // 获取双打第二个头像
        if(is_second){
          if(Array.isArray(match.malu) && match.malu.length > 1)
            return this.get_file_path_local(match.malu[1],match.csid);
          // 如果是字母logo，则返回雪碧图
            return false
        }
        // 获取单打头像或者双打第一个头像
        else{

          // 真实logo
          let match_logo;
          if(Array.isArray(match.malu) && match.malu.length){
            match_logo = match.malu[0];
          }
          else{
            match_logo = match.malu;
          }
          if(match_logo)
            return this.get_file_path_local(match_logo,match.csid);
          // 如果是字母logo，则返回雪碧图
          return false
        }

      },
      /**
       * @description: 收藏与取消收藏
       * @param {Object} match 赛事
       * @param {Number} index 赛事下标
       * @param {Number} item 收藏类型 'tf'联赛  'mf'赛事
       * @return {String}
       */
      toggle_collect(match, index, item) {
        if (item == 'tf') {
          //联赛收藏或取消收藏
          this.$emit('toggle_collect_league',{match,index,type:'tf'});
        } else {
          //赛事收藏或取消收藏
          this.$emit('toggle_collect_match',{match,index,type:'mf'});
        }
      },
      /**
       * @description: 跳转至详情
       * @param {Object} match 赛事
       * @param {*} flag 有值时候代表要去到赛事分析页
       * @return {String}
       */
      goto_details(match, flag) {
        if (!match || !match.mid) return;
        if(this.is_on_go_detail){
         return ; //  防止急速点击两次
        }
        this.is_on_go_detail=true;

        // 如果是非赛果电竞赛事，需要设置菜单类型
        if (this.get_menu_type !== 28 && [100,101,102,103].includes(+match.csid)) {
          this.set_menu_type(3000)
        }
        // console.log({msg:'测试在极度快速的点几下,可以打印两次此消息,证明执行了两次'})

        // 跳转详情页时需清空赛种折叠状态
        this.set_collapse_csid_map({})
        this.set_collapse_map_match({})

        this.set_goto_detail_matchid(match.mid);
        // 进入详情页前，记录目标赛事top值
        this.set_goto_detail_match_info({top: this.$refs['mid-' + match.mid].getBoundingClientRect().top});
        this.set_not_found_target_dom_count(0);
        this.set_details_item(0);
        // 进入详情前，将当前赛事信息存入仓库
        this.set_match_base_info_obj(match)

        if(this.get_current_menu && this.get_current_menu.main && this.is_show_result()){
          this.$router.push(`/result_details/${match.mid}/0`);
        }
        else{
          if(this.$route.name == "category"){
            this.$router.push({name:'category_loading', params: {mid: match.mid}});
          }
          else{
            this.$router.push({name:'category',params:{analysis:flag ? true : false, mid: match.mid, csid: match.csid}});
          }
        }
      },
      /**
       * @description: 多少分钟后开赛显示
       * @param {Object} match 赛事对象
       * @return {String}
       */
      show_start_counting_down(match){
        if(typeof this.match.mcg == 'undefined'){
          return false;
        }
        let r = false;
        // 滚球中不需要显示多少分钟后开赛
        if(match && match.ms == 1){
          return r;
        }
        let start_time = match.mgt * 1;
        let init_server = this.get_local_server_time.server_time * 1;
        let init_local = this.get_local_server_time.local_time_init;
        let now_local = new Date().getTime();
        let sub_local_time = now_local - init_local;
        let now_server_time = init_server + sub_local_time;
        let sub_time = start_time - now_server_time;

        // mcg 1:滚球 2:即将开赛 3:今日赛事 4:早盘
        r = this.match.mcg != 1 && 0 < sub_time && sub_time < 60 * 60 * 1000;
        return r;
      },
      // 赛事状态  0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断
      /**
       * @description: 进行中(但不是收藏页)的赛事显示累加计时|倒计时
       * @param {Object} match 赛事对象
       * @return {Boolean}
       */
      show_counting_down(match) {
        return [1,2,10].includes(match.ms * 1) ;
      },
      /**
       * 判断是否显示进行中|未开赛
       * @param {Object} match 赛事对象
       * @returns {Boolean}
       */
      get_m_status_show(i) {
        let result = false;
        if(this.main_source == 'detail_match_list'){
          return false
        }
        //非今日串关不显示
        if(![3,11].includes(+this.menu_type)){
          return result;
        }else if(this.menu_type == 11){
          let third_m_id = _.get(this.get_current_menu,'date_menu.field1');
          //串关今日id为0或'0'
          if(third_m_id !== 0 && third_m_id !== '0'){
            return result;
          }
        }
        let match = this.matchCtr.list[i];
        if(match){
          if(i > 0){
            let prev_match = this.matchCtr.list[i - 1];
            if([1,110].includes(+match.ms)){
              result = false;
            }
            else if(![1,110].includes(+match.ms) && [1,110].includes(+prev_match.ms)){
              result = true;
            }
          }else if(i == 0 && ![1,110].includes(+match.ms)){
            result = true;
          }
        }
        return result;
      },
      /**
       * @description: 判断是否显示联赛
       * @param {Number} i 赛事下标
       * @return {Boolean}
       */
      get_league_show(i) {
        let flag = true;
        let c = null,p = null;
        if (i) {
          p = this.matchCtr.list[i - 1];
          c = this.matchCtr.list[i];
          if (p && c) {
            if(p.tid != c.tid){
              flag = true;
            }
            else{
              flag = false;
            }
          }
        }
        else{
          flag = true;
        }
        if(this.match.is_show_no_play){
          flag = true;
        }
        return flag;
      },
      /**
       * @description: 未开赛标题展示
       * @param {Number} i 赛事下标
       * @param {Number} ms 赛事状态（1 进行中 0 未开赛）
       * @return {Boolean}
       */
      favorite_un_start_title(i, ms) {
        if (i == 0) {
          return false;
        }
        if (this.menu_type == 6) {
          if (this.match.is_show_no_play && ms == 0) {
            return true;
          }
        }
        return false;
      },
      /**
       * @description: 比分无值时用0占位
       * @param {Undefined}
       * @return {Undefined}
       */
      score_value(){
        if(!this.match){
          this.home_score = 0;
          this.away_score = 0;
          this.home_red_score = 0;
          this.away_red_score = 0;
          this.home_yellow_score = 0;
          this.away_yellow_score = 0;
          return;
        }

        //比分
        if(!this.match.home_score && this.match.home_score != 0){
          this.home_score = 0;
        }else{
          this.home_score = this.match.home_score;
        }
        if(!this.match.away_score && this.match.away_score != 0){
          this.away_score = 0;
        }else{
          this.away_score = this.match.away_score;
        }

        //红牌
        if(!this.match.home_red_score && this.match.home_red_score != 0){
          this.home_red_score = 0;
        }else{
          this.home_red_score = this.match.home_red_score;
        }
        if(!this.match.away_red_score && this.match.away_red_score != 0){
          this.away_red_score = 0;
        }else{
          this.away_red_score = this.match.away_red_score;
        }

        //黄牌
        if(!this.match.home_yellow_score && this.match.home_yellow_score != 0){
          this.home_yellow_score = 0;
        }else{
          this.home_yellow_score = this.match.home_yellow_score;
        }
        if(!this.match.away_yellow_score && this.match.away_yellow_score != 0){
          this.away_yellow_score = 0;
        }else{
          this.away_yellow_score = this.match.away_yellow_score;
        }
        if(this.get_menu_type !=28 && this.match.csid==1 && this.match.cds=='RC' && this.get_newer_standard_edition == 1 && this.footer_sub_menu_id == 114){
          // 红猫足球赛事,简版,角球菜单时屏蔽角球比分显示
          this.home_score = '';
          this.away_score = '';
        }
      },
      gen_collapse_key(match){
        return match.tid;
      },
      /**
       * @description 设置scrollTop最终滚动距离, 保证详情返回的赛事出现在视图窗口内
       */
      set_scroll_top(scrollTop) {
        clearTimeout(this.scroll_top_timer)
        this.$nextTick(()=>{
          this.scroll_top_timer = setTimeout(() => {
            let matchId = 'mid-' + this.get_goto_detail_matchid
            const mid_dom = this.$refs[matchId]
            //若存在赛事dom，则执行相应滚动逻辑
            if (mid_dom) {
              // 获取目标赛事dom视口top
              const top = mid_dom.getBoundingClientRect().top
              // 目标赛事视图top阈值
              let view_top = _.get(this.get_goto_detail_match_info, 'top', 0)
              // view_top = this.get_menu_type === 4 ? 160 : 120

              if (view_top) {
                // 滚动容器
                let match_list_container = document.querySelector('.match-list-container')
                // 容器最终滚动距离
                const final_scroll_top = scrollTop + top - view_top

                match_list_container.scrollTo(0, final_scroll_top)
                this.set_goto_detail_matchid('')

                // 短距离滚动标识
                this.set_allow_short_scroll(true)
                // 已滚动至目标dom时，未滚动至目标计数置为-1
                this.set_not_found_target_dom_count(-1)

                // 第二次延时计算是为了保证滚动距离正确
                clearTimeout(this.scroll_top_timer2)
                this.scroll_top_timer2 = setTimeout(() => {
                  const top2 = mid_dom.getBoundingClientRect().top

                  if (Math.floor(top2) > view_top) {
                    match_list_container.scrollTo(0, final_scroll_top + top2 - view_top)
                  }

                  match_list_container = null
                }, 500)
              }

            } else {
              let not_found_target_dom_count = this.get_not_found_target_dom_count
              if (not_found_target_dom_count >= 0) {
                not_found_target_dom_count++
                this.set_not_found_target_dom_count(not_found_target_dom_count)

                // 当由详情返回后，未滚动至目标计数 和 赛事展示数量相等时，让列表滑动一些距离，防止页面列表展示空白
                if (not_found_target_dom_count === this.matchCtr.list.length) {
                  document.querySelector('.match-list-container').scrollTop += 1
                  this.set_goto_detail_matchid('')
                }
              } else {

              }
            }
          }, 500)
      })
      },
      // 热门模块 精选选项卡 下边的 球种图片
      calculate_ball_type_picture() {
        let csid = +this.match_of_list.csid
        let csid_poz_y = '';
        const per_y=-0.60754 ;  // 1740/(1074/375)/100/rem 根据屏幕宽 和rem计算而来
        switch (csid) {
          case 1:
            csid_poz_y = 0;// 足球
            break;
          case 2:
            csid_poz_y = per_y;// 篮球
            break;
          case 5:
            csid_poz_y = per_y*2;// 网球
            break;
          case 7:
            csid_poz_y = per_y*7;// 斯诺克
            break;
          case 10:
            csid_poz_y = per_y*3;// 羽毛球
            break;
          case 8:
            csid_poz_y = per_y*4;// 乒乓球
            break;
          case 9:
            csid_poz_y = per_y*5;// 排球
            break;
          case 4:
            csid_poz_y = per_y*6;// 冰球
            break;
          case 3:
            csid_poz_y = per_y*8;// 棒球
            break;
          case 6:
            csid_poz_y = per_y*9;// 美式足球
            break;
        }
        return csid_poz_y
      },
      // 清除当前组件所有定时器
      clear_timer() {
        // timeout定时器列表
        const timeout_timer_arr = [
          'timer_super11',
          'match_change_timer',
          'is_new_init_timer2',
          'scroll_top_timer',
          'scroll_top_timer2',
          'need_scroll_height_timer',
        ]


        // 批量清除timeout定时器
        for (const timer of timeout_timer_arr) {
          clearTimeout(this[timer])
          this[timer] = null
        }
      },
    },
    computed:{
      ...mapGetters([
        "get_user",
        "get_uid",
        'get_current_menu',
        'get_local_server_time',
        'get_collapse_map_match',
        'get_secondary_unfold_map',
        'get_collapse_csid_map',
        'get_collapse_all_ball',
        'get_newer_standard_edition',
        'get_sport_all_selected',
        'get_last_ball_csid',
        'get_menu_type',
        'get_curr_sub_menu_type',
        'get_theme','get_sort_type',
        'get_show_favorite_list',
        'get_list_scroll_top',
        'get_img_error_map_mid',
        'get_goto_detail_matchid',
        'get_goto_detail_match_info',
        'get_not_found_target_dom_count',
        'get_standard_odd_status',
        'get_access_config',
        'get_lang',// 当前语言
      ]),
      ...mapGetters({
        footer_sub_menu_id:'get_footer_sub_menu_id',
        get_hot_tab_item:"get_hot_tab_item",
        get_footer_sub_changing:"get_footer_sub_changing",
      }),
      // 精彩回放视频开关是否开启
      is_replay_switch() {
        const { configValue, eventSwitch } = _.get(this.get_user, 'merchantEventSwitchVO', {})
        return configValue == 1 && eventSwitch == 1
      },
      //  动画按钮
      animationUrl_icon(){
      let is_theme01 = this.get_theme.includes('theme01')
      // let is_theme02 = this.get_theme.includes('theme02')
      // let is_y0 = this.get_theme.includes('y0')

       let   animationUrl_icon = is_theme01? this.animationUrl_icon_theme01 : this.animationUrl_icon_theme02

      return animationUrl_icon
      },
      //  视频按钮
      muUrl_icon(){
        let is_theme01 = this.get_theme.includes('theme01')
      // let is_theme02 = this.get_theme.includes('theme02')
       let is_y0 = this.get_theme.includes('y0')

      let muUrl_icon=''

      if(is_y0){
        muUrl_icon =  is_theme01? this.muUrl_theme01_y0 : this.muUrl_theme02_y0
      }else{
        muUrl_icon =  is_theme01? this.muUrl_theme01 : this.muUrl_theme02
      }
      return  muUrl_icon
      },


      /**
       * 判断是否显示体育类型
       * @param {Object} match 赛事对象
       * @returns {Boolean}
       */
      get_sport_show() {
        if(['detail_match_list'].includes(this.main_source)) { return false }
        // 代表是首页模块
        if (!_.get(this.get_current_menu, 'main.menuType')) {
          if (this.i > 0) {
            let p = this.matchCtr.list[this.i - 1], c = this.matchCtr.list[this.i];
            if (p && c) {
              return p.csid !== c.csid;
            }
          } else {
            if(_.get(this.get_hot_tab_item,'index')!=0){return false}
            return true;
          }
        } else if ([1, 2, 3, 4, 11, 12, 28, 30, 3000].includes(+this.menu_type)) {
          if(this.match.show_sport_type){
            return true
          }else{
            return false
          }
        } else {
          return false;
        }
      },
      // 显示收藏 图标
      favorited_computing_icon() {
        let flag = null
        if(!_.get(this.get_user, 'favoriteButton') && this.get_theme.includes('y0')){
          flag = this.y0_img_favorite_black
        }else {
          flag = this.normal_img_is_favorite
        }
        return flag
      },
      // 显示未收藏 图标
      not_favorited_computing_icon() {
        let flag = null
        if(this.get_theme.includes('theme01')){
          flag = this.normal_img_not_favorite_white
        }else {
          flag = this.normal_img_not_favorite_black
        }
        return flag
      },
      // 是否显示视频图标, 点击跳转 去到详情页视频直播
      is_show_video_icon(){
        let r = false;
        let ios_Android = null
        if(3000 == this.menu_type){
          // PC、安卓优先用varl，如果varl没有值，再用vurl   IOS只用   vurl
          // 判断是否是苹果手机，是则是true
          let ua = navigator.userAgent.toLowerCase();
          let isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
          if(isIos){
            ios_Android = this.match.vurl
          }else{
            ios_Android = this.match.varl || this.match.vurl
          }
          r = this.match.mms > 1 && ios_Android && [1,2,7,10,110].includes(+this.match.ms)
        }
        else{
          r = this.match.mms > 1 && [1,2,7,10,110].includes(+this.match.ms);
        }
        return r;
      },
      //未开赛赛事数量
      no_start_total(){
        let r = 0;
        if(this.match.is_show_no_play){
          r = this.matchCtr.match_list_data_sources.length - (this.i);
        }
        return r;
      },
      // 默认联赛图标
      default_league_icon(){
        return this.get_theme.includes('theme02') ? this.none_league_icon_black : this.none_league_icon
      },
      show_newer_edition(){
        return this.get_newer_standard_edition == 1 || this.main_source == 'detail_match_list';
      },
      // 是否是 拳击 或者其他球种
      match_of_list_ascertain() {
        if(this.get_menu_type !=28 && this.match_of_list.csid == 12 && this.match_of_list.hps.length > 1){
          return this.match_of_list.hps.slice(0,2)
        }else{
          return this.match_of_list.hps
        }
      },
      // 是否是热门模块 的 列表页
      is_it_popular() {
        return this.main_source == 'home_hot_page_schedule'
      },
      // 热门模块 球类tab 下边的赛程列表 的 时间转换
      time_change() {
        if(this.match_of_list){
          let time_stamp = +this.match_of_list.mgt
          return (this.format_how_many_days(time_stamp) ? `${this.format_how_many_days(time_stamp)}   `: '') + (new Date(time_stamp)).Format(this.$root.$t('time2')) + '  ' +this.format_week(time_stamp)
        }
      },
      collapsed(){
        if([ 'home_hot_page_schedule'].includes(this.main_source)) return false
        return this.get_collapse_map_match[this.match_of_list.tid];
      },
      /**
       * @description: 当前显示的赛事数据
       * @param {Undefined} Undefined
       * @return {Undefined} Undefined
       */
      match(){
        let result = {};
        result = this.matchCtr.list[this.i];
        if(!result) result = {};
        return result;
      },
      eports_scoring() {
        //比分判断处理
        let scoring = false
        //如果是电竞，则进行比分判定处理
        if(this.menu_type == 3000) {
          const {mmp,home_score,away_score} = this.match
          const mmp_state = mmp || 1
          if(mmp_state != (Number(home_score) + Number(away_score) +1)) {
            scoring = true
          }
        }
        return scoring
      }
    },
    watch:{
      match(c_match){
        this.media_button_button_type_check()
        this.match_period_map(c_match);
      },
      'match.mid'(mid_new,mid_old){
        if(mid_new){
          this.match_changing = true;
          /*
          切换赛事时如果足球比分大于0会触发进球动画,
          变量match_changing延迟置为false可避免触发进球动画
           */
          clearTimeout(this.match_change_timer)
          this.match_change_timer = setTimeout(() => {
            this.match_changing = false;
          },300);
          this.match_period_map(this.match);
        }
      },
      /**
       * @Description 监听主队比分变化
       * @param {undefined} undefined
      */
      home_score(new_,old_){
        if(this.is_first_coming) return;
        if(this.match.csid != 1) return;
        if(this.get_footer_sub_changing) return;
        if(this.match_changing) return;

        if(new_ > 0 && new_ != old_ && old_ !== null && (this.menu_type == 1 || this.menu_type == 3)){
          this.is_show_home_goal = true
          this.hide_home_goal()
        }
      },
      /**
       * @Description 监听客队比分变化
       * @param {undefined} undefined
      */
      away_score(new_,old_){
        if(this.is_first_coming) return;
        if(this.match.csid != 1) return;
        if(this.get_footer_sub_changing) return;
        if(this.match_changing) return;

        if(new_ > 0 && new_ != old_ && old_ !== null && (this.menu_type == 1 || this.menu_type == 3)){
          this.is_show_away_goal = true
          this.hide_away_goal()
        }
      },
      /**
       * @Description 监听主队红牌比分变化
       * @param {undefined} undefined
      */
      home_red_score(new_,old_){
        if(this.match.csid != 1) return
        if(this.home_red_first_change){
          this.home_red_first_change = false;
          return;
        }
        if(new_ > 0 && new_ != old_){
          this.is_show_home_red = true
          this.hide_home_red()
        }
      },
      /**
       * @Description 监听客队红牌比分变化
       * @param {undefined} undefined
      */
      away_red_score(new_,old_){
        if(this.match.csid != 1) return
        if(this.away_red_first_change){
          this.away_red_first_change = false;
          return;
        }
        if(new_ > 0 && new_ != old_){
          this.is_show_away_red = true
          this.hide_away_red()
        }
      },
      /**
       * @description: 监听比分变化
       * @param {Undefined} Undefined
       * @return {Undefined} Undefined
       */
      'match.msc'(){
        this.score_switch_handle(this.match);
        this.score_value();
      },
      'match.mmp'(){
        this.match_period_map(this.match);
      },
      /**
       * @description: 页脚子菜单切换
       * @param {Number} curr 菜单id
       * @return {Undefined} Undefined
       */
      footer_sub_menu_id(curr){
        // 简版玩法之间切换3秒内阻止赔率变化
        this.is_new_init2 = false;
        clearTimeout(this.is_new_init_timer2)
        this.is_new_init_timer2 = setTimeout(()=>{
          this.is_new_init2 = true
        },3000)
        if((this.prev_footer_sub_menu_id != curr && curr == 114) ||
        (this.prev_footer_sub_menu_id != curr && this.prev_footer_sub_menu_id == 114)
        ){
          this.score_value();
        }
        this.prev_footer_sub_menu_id = curr;
      },
    },
    components: {
      "odd-list-wrap":odd_list_wrap,
      "score-list":score_list,
      ImageCacheLoad,
      "no-data": no_data,
      "counting-down-second": counting_timer,
      "counting-down-start": counting_down_start,
      'match-overtime-pen':match_overtime_pen,
    }
  }
</script>

<style lang="scss" scoped>
/* ********赛事容器相关********** -S*/

.play-icon{
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
    img{
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
    margin: 0 .069rem;  /* 兼容iPhone11边框显示不全 */
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
    transition: max-height 0.3s;

    .match-odds-container-border-radius {
      border-radius: .08rem;
      overflow: hidden;
    }
    .eports_scoring_tip {
      color: var(--q-color-fs-color-6);
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
   // margin-top: 0.06rem;  遗留代码,暂时注释掉
   // padding: 0.03rem 0;
    padding-top: 0.06rem;
    &.started_un_started_next {
      .match-odds-container {
        &:after {
          display: inline;
        }
      }
    }

    .league {

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

    > span {
      &:nth-child(2) {
        padding: 0.02rem 0.09rem;
        height: 0.24rem;
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
    background-image: var(--q-color-linear-gradient-bg-19);
    margin-top: 0.11rem;
    transform: translateY(-5px);
    border-radius: 0.06rem;
    &.first{
      margin-top: 0rem;
      transform: translateY(-0.065rem);
      // transform: translateY(-11px);
    }
    &.is_gunqiu{
      transform: translateY(-6px);
    }
    .score-inner-span {
      width: 3.4rem;
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
        height: 0.58rem;
        position: relative;

        > img {
          width: 100%;
          object-fit: cover;
          height: 0.58rem;
          background-color: var(--q-color-page-bg-color-1);
        }

        > span {
          height: 0.58rem;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);

          font-size: 0.16rem;
          display: flex;
          align-items: center;
          justify-content: center;

          > i {
            display: inline-block;
            margin-right: 0.05rem;
            width: 0.18rem;
            height: 0.18rem;
            background: var(--q-color-com-img-bg-13) no-repeat 0 0 / 0.18rem 2.3rem;
            --per: -0.23rem;
          }

          @each $bg, $y in (s2: 1, s5: 2, s7: 3, s10: 4, s8: 5, s9: 6, s4: 7, s3: 8, s6: 9) {
            .#{$bg} {
              background-position-y: calc(var(--per) * #{$y});
            }
          }

          > p {
            position: relative;
            top: 0.02rem;
          }
        }
      }
    }
    &.hidden_sport {
      display: none !important;
    }

    .icon_match_cup, .icon_notstarted {
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
    color: var(--q-color-com-fs-color-28) !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.4rem;
    
    &.show-sport {
      border-radius: 0.12rem 0.12rem 0 0;
    }
    &.home-hot{
      margin-top: .05rem;
    }
    .league-t-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
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
    width: 117%;
    height: 0.23rem;
    position: relative;
    flex-wrap: nowrap;
    margin-left: 0.1rem;

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

  .league-icon-mini {
    width: 0.22rem;
    height: 0.22rem;
    margin: 0.01rem 0.07rem 0 0.09rem;
    position: relative;

    &.league-icon-mini2 {
      --per: -0.32rem;
      background: var(--q-color-com-img-bg-11) no-repeat center / 0.2rem 18.88rem;
      background-position-y: calc(var(--per) * var(--num));
    }

    img {
      width: 0.22rem;
      height: 0.22rem;
      position: absolute;
      top: 0;
      left: 0;
    }
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
      min-width: 1.22rem;
      display: flex;
      font-size: .12rem;
    }

    .match-league {
      max-width: 2.8rem;
      padding-top: 0.02rem;
      &.match-main-league {
        //max-width: 1.4rem;
      }
    }


    color: var(--q-color-com-fs-color-26);

    font-weight: 600;
  }

  .match-type {
    margin-right: 0.04rem;
    transition: opacity 0.3s;
    opacity: 1;
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

.odd-list {
  line-height: 1;
  background-color: var(--q-color-com-bg-color-12);
  height: auto;
  position: relative;
  min-height: 1.11rem;

  &.simple, &.result {
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
        padding-left:0.05rem;

        .score-section {
          padding-left: 0;
          transform: translateX(-0.02rem);
        }

        .go-container-w {
          .goto-detail {
            display: flex;
            height: auto;
            align-items: center;
            transform: translateY(0.01rem);

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
              img{
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

            img, .sprite-div {
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
          color: var(--q-color-com-fs-color-8);
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

    & > div {
      height: auto;
    }
  }
  .favorite-icon-top {
    width: 0.14rem;
    height: 100%;
    margin-right: .07rem;
    img {
      width: 100%;
      height: auto;
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
    .live-icon-btn, .live-icon-play-btn {
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
    .favorite-icon{
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

/* **************日期********************** -E*/

/* ********赛事容器相关********** -E*/
</style>


