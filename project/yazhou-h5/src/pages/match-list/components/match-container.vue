<!-- 
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
                        v-if="media_button_state_obj.icon_path"
                         @click="media_button_handle()"
                       >  
                            <slot></slot> 
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
 
<script setup name="match-container">
 import { normal_img_not_favorite_white, normal_img_not_favorite_black, normal_img_is_favorite, y0_img_favorite_black, lvs_icon_theme01, lvs_icon_theme02, animationUrl_icon_theme01, 
  animationUrl_icon_theme02, muUrl_theme01, muUrl_theme01_y0, muUrl_theme02, muUrl_theme02_y0 } from 'src/boot/local-image'
import { computed, onMounted, onUnmounted } from 'vue'
// TODO: 其他模块得 store  待添加
// mixins: [formartmixin, odd_convert, bettings, match_list_mixin, msc_bw3, common],

const props = defineProps({
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
})

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
// 上次的页脚子菜单id
const prev_footer_sub_menu_id = ref(null)
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

onMounted(() => {
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

  this.run_new_init_timer();
  this.score_value();
  this.$root.$on(this.emit_cmd.EMIT_SET_SCROLL_TOP, this.set_scroll_top);
  this.match_period_map(this.match);
  this.media_button_button_type_check()
})
// 精彩回放视频开关是否开启
const is_replay_switch = computed(() => {
  const { configValue, eventSwitch } = _.get(this.get_user, 'merchantEventSwitchVO', {})
  return configValue == 1 && eventSwitch == 1
})
//  动画按钮
const animationUrl_icon = computed(() => {
  let is_theme01 = this.get_theme.includes('theme01')
  // let is_theme02 = this.get_theme.includes('theme02')
  // let is_y0 = this.get_theme.includes('y0')
  let animationUrl_icon = is_theme01? this.animationUrl_icon_theme01 : this.animationUrl_icon_theme02
  return animationUrl_icon
})
//  视频按钮
const muUrl_icon = computed(() => {
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
})

const get_sport_show = computed(() => {
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
})

onUnmounted(() => {
  this.debounce_throttle_cancel(this.hide_home_goal);
  this.debounce_throttle_cancel(this.hide_away_goal);
  this.debounce_throttle_cancel(this.hide_home_red);
  this.debounce_throttle_cancel(this.hide_away_red);
  this.$root.$off(this.emit_cmd.EMIT_SET_SCROLL_TOP, this.set_scroll_top);

  this.clear_timer();
})

</script>
 
<style scoped lang="scss">
  @import "../styles/match-container";
</style>