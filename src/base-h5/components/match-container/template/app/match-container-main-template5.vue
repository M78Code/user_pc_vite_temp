<!--
 * @Description:  app-h5   新手版 
-->
<template>
  <div :style="{ marginTop: is_hot ? '0' : '' }" class="match-container component app-match-container-main-template5" :class="{ collect: isCollectMenuTab }">
    <template v-if="match">
      <!-- <div style="display: none;">{{ MatchDataBaseH5.data_version.version }}</div> -->
     <!-- 开赛标题  -->
      <div v-if="is_show_opening_title && !is_mix_no_today" @click.stop="handle_ball_seed_fold"
        :class="['match-status-fixed', { progress: +match.start_flag === 1, not_begin: +match.start_flag === 2 }, i !== 0 && 'mt5px']" >
        <!-- 进行中 -->
        <template v-if="+match.start_flag === 1">
          <div class="match-status-title">
          <!-- 进行中 -->
            <img :src="in_progress" /> <span class="din-regular"> {{ i18n_t('list.match_doing') }}</span>
          </div>
          <!-- <img :class="['expand_item', {collapsed: collapsed}]" :src="expand_item" alt=""> -->
             <div class="img" :class="['expand_item', {collapsed: collapsed}]" :style="compute_css_obj({key: 'h5-kyapp-expand-lague'})"></div>
        </template>
        <!-- 未开赛 -->
        <template v-else>
          <div class="match-status-title">
            <img :src="not_begin" /> <span class="din-regular"> {{ i18n_t('list.match_no_start') }}</span>
          </div>
          <!-- <img :class="['expand_item', {collapsed: collapsed}]" :src="expand_item" alt=""> -->
            <div class="img" :class="['expand_item', {collapsed: not_begin_collapsed}]"  :style="compute_css_obj({key: 'h5-kyapp-expand-lague'})"></div>
        </template>
      </div>
      <div class="all-league-title" v-if="is_show_opening_title && is_mix_no_today"  @click.stop="handle_ball_seed_fold">
        <div> <img :src="icon_date" alt=""> <span>{{ is_mix_no_today }}</span> </div>
        <!-- <img :class="['expand_item', {all_ball_seed_collapsed: !all_ball_seed_collapsed}]" :src="expand_item" alt=""> -->
        <div class="img" :class="['expand_item', {ball_seed_collapsed: not_begin_collapsed}]"  :style="compute_css_obj({key: 'h5-kyapp-expand-lague'})"></div>
      </div>
      <!-- 全部 -->
      <div class="all-league-title" v-if="match?.source_index === 0 && is_show_all" @click.stop="handle_all_ball_seed_fold">
        <div> <img :src="icon_date" alt=""> <span>{{get_date_title}}</span> </div>
        <!-- <img :class="['expand_item', {ball_seed_collapsed: !ball_seed_collapsed}]" :src="expand_item" alt=""> -->
         <div class="img" :class="['expand_item', {ball_seed_collapsed: !all_ball_seed_collapsed}]"  :style="compute_css_obj({key: 'h5-kyapp-expand-lague'})"></div>
      </div>
      <!-- 缓冲容器， 避免滚动时骨架屏漏光问题 -->
      <div class="buffer-container" v-if="is_show_buffer_container"></div>
      <!--体育类别 -- 标题  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
      <div v-if="show_sport_title" @click.stop :class="['sport-title match-indent', { home_hot_page: is_hot, is_gunqiu: [1].includes(+menu_type), first: i == 0, }]">
        <span class="score-inner-span"> {{ match_of_list.csna || get_current_manu_name() }} ({{ get_match_count }}) </span>
      </div>

      <!-- 最核心的div模块     标题 + 倒计时 + 比分 + 赔率盘口模块 -->
      <div :class="['match-inner-container', { 'collapsed': !collapsed }]" :data-is="match_of_list.is_show_league">
        <!--联赛标题 -->
        <div @click="handle_league_fold" v-if="match_of_list.is_show_league"
          :class="[(' match-indent league')]">
          <div class="league-t-wrap right-border">
            <!-- 联赛收藏 -->
            <div v-if="![3000, 900].includes(menu_type) && !is_esports && !is_mix" class="favorited-icon" @click.stop="handle_league_collect">
              <!-- 未收藏 compute_img_url('icon-favorite')-->
              <img v-if="!league_collect_state" :src="not_favorite_app" alt="">
              <!-- 收藏图标 compute_img_url('icon-favorite-s')-->
              <img v-if='league_collect_state' :src="normal_img_is_favorite">
            </div>
            <!-- 电竞图标 写死 -->
            <div class="esport" v-if="match_of_list.csid == 101"
              :style="compute_css_obj('menu-sport-active-image', 2101)"></div>
            <div class="esport" v-else-if="match_of_list.csid == 103"
              :style="compute_css_obj('menu-sport-active-image', 2103)"></div>
            <div class="esport" v-else-if="match_of_list.csid == 102"
              :style="compute_css_obj('menu-sport-active-image', 2102)"></div>
            <div class="esport" v-else-if="match_of_list.csid == 100"
              :style="compute_css_obj('menu-sport-active-image', 2100)"></div>
            <span :class="['league-title-text row justify-between', { 'no-favorited': is_mix }]">
              <span :class="['league-t-wrapper', { 'league-t-main-wrapper': menu_type !== 28, export: is_esports }]">
                <span class="match-league ellipsis-2-lines" :class="{ 'match-main-league': menu_type !== 28 }">
                  {{ match.tn }}
                </span>
              </span>
              <icon-wapper color="#c9c9c9" name="icon-arrow" size="14px"
                :class="['icon-wapper', { 'close': collapsed }]" />
            </span>
          </div>

        </div>
        <!-- 赛事内容 -->
        <div :class="['match-content', { 'collapsed': collapsed, 'border-raduis': match?.is_show_border_radius }]" v-if="collapsed">
          <div class="match-content-line" v-if="!match.is_show_league"></div>
          <!-- 比分版 | 视频 icon | 赛事阶段 | 比分| 盘口 -->
          <div class="title-details">
            <div class="details">
              <!-- 图标 -->
              <!--  左边收藏  视频动画 图标 玩法数量  赛事分析图标 提前结算图标  -->
              <div class="score-wrapper flex items-center" v-if=" !is_results"
                    v-show="footer_menu_id != 114">
                    <div class="r row no-wrap">
                      <div class="go-container-w flex no-wrap new-standard">
                        <!-- 直播 主播 视频 动画  icon 栏目   -->
                        <!-- 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画 -->
                        <div class="live-i-b-wrap v-mode-span row items-center" @click="media_button_handle">
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
                        <div class="column justify-center yb_px2" v-if="match_of_list.mearlys == 1" @click.stop>
                          <img :src="mearlys_icon_app" alt="">
                        </div>
                      </div>
                    </div>
              </div>
              <!-- <div class="operate-icon"> -->
                <!-- 直播 主播 视频 动画  icon 栏目   -->
                <!-- 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画 -->


                <!-- mvs动画状态：-1：没有配置动画源 | 0 ：已配置，但是不可用 | 1：已配置，可用，播放中 | 2：已配置，可用，播放中 -->
                <!-- <template v-if="match.mvs > -1 || (match.mms > 1 && [1, 2, 7, 10, 110].includes(match.ms * 1))"> -->
                  <!-- 动画状态大于-1时，显示动画按钮 i18n_t('match_info.animation')是国际化取值 -->

                  <!-- icon_click_animationUrl media_button_handle -->
                  <!-- <img :class="[!(match.mvs > -1) && 'iconGrayFillStyle']" :src="animation_icon"
                    @click="media_button_handle_by_type(ButtonTypes.animationUrl)" /> -->
                  <!-- 视频状态大于1时，显示视频按钮 i18n_t('match_info.video')是国际化取值 -->
                  <!-- <img :class="['live-icon-btn', !(match.mms > 1) && 'iconGrayFillStyle']" :src="video_icon"
                    @click="media_button_handle_by_type(ButtonTypes.muUrl)" /> -->
                  <!--icon_click_muUrl  -->
                  <!--  match["lvs"] == 2，显示直播按钮 i18n_t('match_info.lvs')是国际化取值 -->
                  <!-- <img :class="[match.lvs !== 2 && 'iconGrayFillStyle']" :src="compute_local_project_file_path('image/list/ico_liveshow_nor.png')"
                    @click="media_button_handle_by_type(ButtonTypes.lvs)" /> -->
                  <!-- icon_click_lvs -->
                <!-- </template>
              </div> -->
              <!-- 赛事日期标准版 -->
              <div :class="['timer-wrapper-c flex items-center', { esports: is_esports, 'din-regular': is_esports }]">
                <!-- 赛事回合数mfo -->
                
                <!--开赛日期 ms != 110 (不为即将开赛)  subMenuType = 13网球(进行中不显示，赛前需要显示)-->
                <div class="date-time"
                  v-show="match.ms != 110 && !show_start_counting_down(match) && !show_counting_down(match)">
                  {{ format_time_zone(+match.mgt).Format(i18n_t('time11')) }}
                </div>
                <!--即将开赛 ms = 110-->
                <div class="coming-soon" v-if="match.ms" v-show="match.ms == 110">
                  {{ i18n_t(`ms[${match.ms}]`) }}
                </div>
                
                <!--一小时内开赛 -->
                <div class="start-counting-down" v-show="match.ms != 110 && show_start_counting_down(match)">
                  <CountingDownStart :match="match" :index="i" :mgt_time="match.mgt"></CountingDownStart>
                </div>
                <div v-if="match.mfo&&!get_match_status(match.ms)" class="mfo-title" :class="{ 'is-ms1': match.ms == 1 }">
                  &nbsp;{{ match.mfo }}
                </div>
                <!--倒计时或正计时-->
                <div v-if="match.ms != 110 && show_counting_down(match)"
                  :class="['counting-down-up-container relative-position', { 'special-match-container': match.mfo || [0, 31].includes(+match.mmp) }]">
                  <!-- :style="{ width: counting_down_up_wrapper_width === 'auto' ? 'auto' : match.mfo ? 'auto' : counting_down_up_wrapper_width + 'rem' }" -->

                  <!--足球csid:1 冰球csid:4 橄榄球csid:14 DotaCsid:101 累加 排球csid:9 倒计时-->
                  <CountingDownSecond ref="counting-down-second" :title="mmp_map_title" :mmp="match.mmp"
                    :is_add="[1, 4, 11, 14, 100, 101, 102, 103].includes(+match.csid)" :m_id="match.mid"
                    :second="match.mst" :match="match" @counting-wrapper-width="update_counting_down_up_wrapper_width">
                  </CountingDownSecond>
                </div>
              </div>
              <!-- 比分版, 即将开赛时不展示比分-->
              <div class="score-title-text" v-if="match.ms != 110 && get_match_status(match.ms)"><span>{{ home_score }} - {{
                away_score }}</span></div>
            </div>
            <!--玩法数量-->
            <div class="more" @click='goto_details(match)'>
              <span class="count_span" :class="{ esports: 3000 == menu_type }">
                <span class="mc-n">
                  {{ i18n_t('footer_menu.more') + `(${get_match_mc(match)})` }}
                </span>
                <span class="add_text" v-if="GlobalAccessConfig.get_handicapNum()">
                  <icon-wapper color="#c9c9c9" name="icon-triangle1" size="17px" class="icon-wapper-more" />
                </span>
              </span>
            </div>
          </div>
          <!-- 赛事队伍 -->
          <div class="event-team">
            <div class="name">
              <div class='left'>
                <span class="match-name" :class="{ 'is-handicap': match.handicap_index == 1, 'is-handicap-1': match.handicap_index == 2 }">
                  {{ match.mhn }}
                </span>


                <!-- 1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 -->
                <!-- <image-cache-load v-if="match?.mhlu?.length && !([5, 7].includes(Number(match.csid)))" -->
                <!-- <image-cache-load v-if="match?.mhlu?.length"
                  :csid="+match.csid" :path="match.mhlu" type="home"></image-cache-load> -->
                <!-- <img v-if="match?.mhlu?.length" class="logo" v-img="([match.mhlu[0], match.frmhn[0], match.csid])" /> -->
                  <team-img
                    :type="0"
                    :csid="match.csid"
                    :url="lodash.get(match,'mhlu[0]')"
                    :fr="lodash.get(match,'frmhn[0]')"
                    :size="18"
                    class="team-icon"
                  ></team-img>
                  <team-img
                    v-if="lodash.get(match,'mhlu.length') > 1&& !lodash.isEmpty(match)"
                    :type="0"
                    :csid="match.csid"
                    :url="match.mhlu[1]"
                    :fr="match.frmhn[1]"
                    :size="18"
                    style="margin-left:-0.09rem;"
                    class="team-icon"
                  ></team-img>
                  <!--发球方绿点-->
                  <span class="serving-party" :class="{ 'simple': standard_edition == 1 }"
                    v-show="set_serving_side(match, 'home')">
                  </span>
              </div>
              <span class="vs">VS</span>
              <div class='right'>
                <!-- <image-cache-load v-if="match?.malu?.length && !([5, 7].includes(Number(match.csid)))" -->
                <!-- <image-cache-load v-if="match?.malu?.length"
                  :csid="+match.csid" :path="match.malu" type="home"></image-cache-load> -->
                 <!-- 右侧双打图标 type 1 表示客队,malu 客队的url -->
                <!--发球方绿点-->
                <span class="serving-party" :class="{ 'simple': standard_edition == 1 }"
                  v-show="set_serving_side(match, 'away')">
                </span>
                <team-img
                  :type="1"
                  :csid="match.csid"
                  :url="lodash.get(match,'malu[0]')"
                  :fr="lodash.get(match,'frman[0]')"
                  :size="18"
                  class="team-icon"
                ></team-img>
                <team-img
                  v-if="lodash.get(match,'malu.length') > 1"
                  :type="1"
                  :csid="match.csid"
                  :url="match.malu[1]"
                  :fr="match.frman[1]"
                  :size="18"
                  style="margin-left:-0.09rem;"
                  class="team-icon"
                ></team-img>
                <!-- <img v-if="match?.malu?.length" class="logo" v-img="([match.malu[0], match.frman[0], match.csid])" /> -->

                <span :class="{ 'is-handicap': match.handicap_index == 2, 'is-handicap-1': match.handicap_index == 1 }">
                  {{ match.man }}
                </span>

              </div>
            </div>
            <!-- 比分选项 -->
            <div class="odds">
              <!--赛事列表收藏-->
              <div class="collect favorite-icon-top match list-m" @click.stop="handle_match_collect" v-if="!is_mix">
                <!-- 未收藏图标 compute_img_url('icon-favorite')-->
                <img v-if="!match_collect_state" :src="not_favorite_app" alt="">
                <!-- 收藏图标 compute_img_url('icon-favorite-s')-->
                <img v-if='match_collect_state' :src="normal_img_is_favorite">
              </div>
              <OddListWrap :main_source="main_source" :match="match_of_list" />
            </div>


          </div>
          <!--  新手版-赛事比分信息 -->
          <div class="match-score-info">
            <template v-if="match.csid != 1">
              <score-list :class="[match.csid == 7 && 'score-content-snooker']" :main_source="main_source" :match="match"></score-list>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import TeamImg from "src/base-h5/components/details/team-img.vue";   // 详情页蓝色背景上的大型字母图标
import { IconWapper } from 'src/components/icon'
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import ScoreList from 'src/base-h5/components/match-container/template/app/components/score-list.vue';
// import OddListWrap from 'src/base-h5/components/match-list/components/odd-list-wrap.vue';
import OddListWrap from 'src/base-h5/components/match-container/template/app/components/odd-list-wrap.vue';
import ImageCacheLoad from "src/base-h5/components/match-list/components/public-cache-image.vue";
import GlobalAccessConfig from "src/core/access-config/access-config.js"

import { i18n_t, compute_img_url } from "src/output/index.js"
import { format_time_zone,format_M_D } from "src/output/index.js"

import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2,date_time, is_detail,is_zaopan, is_esports, is_results, footer_menu_id, is_mix } from 'src/base-h5/mixin/menu.js'

import default_mixin from '../../mixins/default.mixin.js'
import { compute_value_by_cur_odd_type } from "src/output/index.js";
import lodash from 'lodash';
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { MITT_TYPES, LOCAL_PROJECT_FILE_PREFIX,compute_local_project_file_path, useMittOn, compute_css_obj } from "src/output/index.js"
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
import { get_match_status } from 'src/core/utils/common/index'

import { in_progress, not_begin, animation_icon, video_icon, icon_date, expand_item,
  normal_img_not_favorite_white, not_favorite_app, normal_img_is_favorite, corner_icon, mearlys_icon_app, midfield_icon_app } from 'src/base-h5/core/utils/local-image.js'

export default {
  name: "match-container-main-template5",
  mixins: [default_mixin],
  props: {
    // 当前组件的赛事数据对应列表的赛事
    match_of_list: Object,
    // 赛事处于列表中的下标
    i: Number,
    // 赛事列表相关操作的类型封装对象
    matchCtr: Object,
    main_source: String,
  },
  components: {
    TeamImg,
    ScoreList,
    IconWapper,
    OddListWrap,
    ImageCacheLoad,
    CountingDownStart,
    CountingDownSecond,
  },
  setup(props) {
    const active_score = ref(null)

    const ButtonTypes = {
      lvs: 'lvs',
      muUrl: 'muUrl',
      animationUrl: 'animationUrl'
    }

    const isCollectMenuTab = ref(false) //当前是否是收藏菜单

    // 是否显示球种标题
    const show_sport_title = computed(() => {
      const { is_show_ball_title } = props.match_of_list
      return is_show_ball_title
    })

    const go_to_bet = (ol) => {
      if (ol.os !== 1) return
      active_score.value = `${ol._mid}${ol.oid}`
      const { oid, _hid, _hn, _mid } = ol
      const params = {
        oid, // 投注项id ol_obj
        _hid, // hl_obj 
        _hn,  // hn_obj
        _mid,  //赛事id mid_obj
      }
      const other = {
        is_detail: false,
        // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
        // 根据赛事纬度判断当前赛事属于 那种投注类型
        bet_type: 'common_bet',
        // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
        device_type: 1,
        // 数据仓库类型
        match_data_type: "h5_list", // h5_detail
      }
      set_bet_obj_config(params, other)

    };



    //当前赛事比分选项
    const curMatchOdds = ref([])

    watch(() => props.match_of_list, (newVal) => {
      curMatchOdds.value = newVal?.hps?.[0]?.hl?.[0]?.ol || []
    }, { immediate: true })

    /**
   * 赔率转换
   * @param  {number} ov - 赔率值
   * @param  {number} obv - 断档赔率值
   * @return {undefined} undefined
   */
    const format_odds = (ov, obv) => {
      const play_data = props.match_of_list?.hps?.[4] || {}
      // 列表取 hsw
      let hsw = lodash.get(play_data, `hl._play.hsw`) || "";
      let sport_id = lodash.get(props.match_of_list, "csid");
      // 电竞赔率精度处理
      // if (lodash.isUndefined(sport_id) && menu_config.is_esports()) {
      //   sport_id = "101";
      // }
      try {
      const match_odds = compute_value_by_cur_odd_type(
        ov,
        ov._hpid,  //todo
        hsw,
        sport_id
      );
      return match_odds
      } catch (e) {
        console.log('format_oddsformat_oddsformat_odds',e)
      }
    };


    const format_odds_value = (data) => {
      const { ov, obv } = data
      return format_odds(ov, obv)

    }
    const get_date_title =computed(() => {
      return is_zaopan.value&&Number(date_time.value)>0?format_M_D(date_time.value):i18n_t("filter.all_leagues")
    })

    const is_mix_no_today = computed(() => {
      return (is_mix.value && Number(date_time.value)>0) ? format_M_D(date_time.value) : ''
    })

    let mitt_list=[]
    onMounted(() => {
     mitt_list=[useMittOn(MITT_TYPES.EMIT_SCROLL_TOP_NAV_CHANGE, e => {
        isCollectMenuTab.value = e.mi === 50000
      }).off]
      VirtualList.set_is_show_ball(false)
      VirtualList.set_is_change_handicap_height(-20)
    })

    onUnmounted(() => {
      mitt_list.forEach(i=>i())
      VirtualList.set_is_show_ball(true)
      VirtualList.set_is_change_handicap_height(0)
    })
    
    return {
      is_mix,
      get_date_title,
      active_score,
      go_to_bet,
      ButtonTypes,
      format_odds_value,
      curMatchOdds,
      isCollectMenuTab,
      compute_local_project_file_path,
      lang, theme, i18n_t, compute_img_url,format_M_D, format_time_zone, GlobalAccessConfig, footer_menu_id, LOCAL_PROJECT_FILE_PREFIX,
      is_hot, menu_type, menu_lv2, is_detail, is_esports, is_results, standard_edition, footer_menu_id,
      in_progress, not_begin, animation_icon, video_icon, icon_date, expand_item, show_sport_title, compute_css_obj,
      normal_img_not_favorite_white, not_favorite_app, normal_img_is_favorite, corner_icon, mearlys_icon_app, midfield_icon_app,
      get_match_status,
      is_mix_no_today
    }
  }
}

</script>
  
   
<style scoped lang="scss">
.iconGrayFillStyle {
  filter: grayscale(100%);
  -webkit-filter: grayscale(100%);
  pointer-events: none;
}

.buffer-container {
  // background: var(--q-gb-bg-c-17);
  height: 5px;
  width: 100%;
}
/* ********赛事容器相关********** -S*/
.team-icon {
  width: 0.2rem !important;
  height: 0.2rem !important;
  background-size: 100% 100%;
  :deep(.img-style){
    width: 0.2rem !important;
    height: 0.2rem !important;
  }
}
.counting-down-up-container {

  :deep(.counting-down-wrap) {
    // gap: 4px;
    /* width:0.9rem!important; */
    width: auto !important;
    position: static;
    height: 100%;
    >span {
      display: inline-block;
      white-space: nowrap;
    }
  }
}

.match-container {
  width: 100%;
  height: auto;
  position: relative;
  // background: var(--q-gb-bg-c-18);

  .match-status-fixed {
    width: 100%;
    height: 25px;
    line-height: 1;
    font-size: 0.12rem;
    padding-left: 0.17rem;
    display: flex;
    align-items: center;
    color: var(--q-gb-t-c-20);
    background: var(--q-gb-bg-c-25);
    justify-content: space-between;
    &.progress{
      border-top: 2px solid var(--q-gb-bd-c-1);
      // border-top: 2px solid #127DCC;
    }
    &.not_begin{
      border-top: 2px solid rgba(233, 91, 91, 0.51);
    }

    &.mt5px {
      margin-top: .05rem;
    }

    img,.img {
      margin-right: 14px;
      width: .13rem;
      height: .13rem;
    }
    .expand_item{
      transition: transform 0.25s ease;
      transform: rotate(-90deg);
      width: 20px;
      height: 16px;
    }
    .collapsed{
      transform: rotate(0);
    }
  }
  .all-league-title{
    display: flex;
    height: 30px;
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
        color:var(--q-gb-t-c-18);
      }
    }
    .expand_item{
      width: 20px;
      height: 16px;
      transition: transform 0.25s ease;
      transform: rotate(-90deg);
    }
    .ball_seed_collapsed{
      transform: rotate(0deg);
    }
  }

  .match-status-title {
    display: flex;
    align-items: center;
    > img {
      margin-right: 6px;
    }
  }

  .match-inner-container {
    margin: 0 0.05rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    // background: var(--q-gb-bg-c-34) !important;
    // box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.04);
    // border-radius: .04rem;
    .match-content{
      background: var(--q-gb-bg-c-18);
      border: 1px solid var(--q-gb-bd-c-15);
      border-bottom: none;
      &.collapsed{
        border-top: none;
      }
      &.border-raduis{
        border-bottom: 1px solid var(--q-gb-bd-c-15);
        border-radius: 0 0 0.08rem 0.08rem;
      }
    }
    &.collapsed{
      > .match-indent{
        border-radius: 8px !important;
        border-bottom: 1px solid var(--q-gb-bd-c-15) !important;
        border: 1px solid var(--q-gb-bd-c-15);
      }
    }
    > .match-indent{
      border: 1px solid var(--q-gb-bd-c-15);
      border-radius: 8px 8px 0 0 !important;
      border-bottom: 1px solid var(--q-gb-bd-c-4) !important;
      background: var(--q-gb-bg-c-18);
    }
    .match-content-line {
      width: 100%;
      height: 0.005rem;
      background: var(--q-gb-bd-c-4);
    }
  }

  .favorite-icon-top {
    width: 0.14rem;
    height: 0.14rem;
    flex-shrink: 0;
    margin-right: 22px;

    /* position: relative;
      top: 1px; */
    img {
      width: 100%;
      height: 100%;
      /* vertical-align: middle;
        margin-top: -2px; */
    }

    .f-icon {
      display: none;
    }
  }

  .date-container {
    background-color: var(--q-color-com-bg-color-12);
    width: 100%;
    color: var(--q-gb-t-c-4);
    padding: 0 0 0 0.08rem;
    height: 0.2rem;
    display: flex;
    align-items: center;
    margin: 0 auto;
    font-size: 0.1rem;
    align-items: center;
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
          color: var(--sys-brand-secodary-secondary-300, --q-gb-t-c-19);
          text-align: right;
          font-family: Akrobat;
          font-size: 11px;
          font-weight: 500;

          .mc-n {
            width: 0.14rem;
          }
        }
      }
    }

    .timer-wrapper-c {
      height: 100%;
      color: var(--q-gb-t-c-4);

      &.newer {
        margin-left: 0;
      }

      &>div {
        height: auto;
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
      font-size: 0.1rem;

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

      .icon-wapper-more {
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

  .match-indent {
    width: 100%;
    margin: 0 auto;
    // background: var(--q-gb-bg-c-15) !important;
    height: 25px;
    // border-bottom: 1px solid var(--q-gb-bg-c-19);
    // border-top: 1px solid var(--q-gb-bg-c-19);
    // border-color: var(--q-gb-bg-c-19) !important;
    &.bottom {
      margin-top: 0.05rem;
    }
  }

  /* **************体育展示********************** -S*/

  .sport-title {
    width: 100%;
    height: 20px;
    border-radius: 0;
    font-size: 12px;
    padding: 0 5px 0 17px;
    background: var(--q-gb-bg-c-21);
    line-height: 20px;
    font-size: 12px;
    // margin-bottom: -.05rem;
    margin-top: 0;
    border-bottom: 0;
    color: var(--q-gb-t-c-24);
    .score-inner-span {
      width: 100%;
      //transform: translateY(-3px);
    }
  }

  /* **************体育展示********************** -E*/

  /* **************联赛展示********************** -S*/
  .league {
    height: 25px;
    border-radius: .08rem .08rem 0 0;
    // background-color: var(--q-gb-bg-c-34) !important;

    .league-t-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;

      .favorited-icon {
        width: 14px;
        height: 14px;
        margin: 0 8px 0 11px;
        /* position: relative;
        top: 1px; */
        flex-shrink: 0;
        > img {
          width: 100%;
          height: 100%;
        }

      }
    }

    .league-title-text {
      font-size: 0.13rem;
      width: 100%;
      height: 100%;
      padding-right: 5px;
      text-overflow: ellipsis;
      flex-wrap: nowrap;
      align-items: center;
      overflow: hidden;
      font-size: 12px;
      color: var(--q-gb-t-c-18);
      font-weight: 600;
      transform: translateY(1px);
      &.no-favorited{
        padding-left: 15px;
      }

      .icon-wapper {
        margin-right: 6px;
        transform: rotate(90deg);
      }

      .close {
        transform: rotate(180deg);
      }

      .league-t-wrapper {
        min-width: 1.18rem;
        &.export {
          min-width: 1.1rem;
          margin-left: 0.1rem;
        }
      }
    }
  }

  .match-content {
    width: 100%;
    // background: var(--q-gb-bg-c-34);
    padding: 4px 9px 0;

    .event-team {
      padding: 8px 0 0;

      .name {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--q-gb-t-c-18);
        font-size: 12px;
        font-weight: 400;
        .serving-party {
          border-radius: 2px;
          background: var(--sys-feedback-success-success-400, #4AB06A);
          width: 4px !important;
          height: 4px;
          position: absolute;
        }

        .logo {
          width: 20px;
          height: 20px;
        }

        .vs {
          margin: 0 16px;
        }

        >div {
          display: flex;
          align-items: center;
          gap: 4px;
          width: 136px;

          &.left {
            justify-content: flex-end;
            position: relative;
            .is-handicap {
              color: var(--q-gb-t-c-34) !important;
            }
            .match-name {
              width: 1rem;
              text-align: right;
            }
            .serving-party {
              right: -0.1rem;
            }
            .team-img{
              margin: 0 0 0 3px;
            }
            .team-icon {
              margin: 0 0 0 3px;
            }
          }

          &.right {
            justify-content: flex-start;
            position: relative;
            .is-handicap {
              color: var(--q-gb-t-c-34) !important;
            }
            .match-name {
              width: 1rem;
            }
            .serving-party {
              left: -0.1rem;
            }
            .team-img{
              margin: 0 3px 0 0;
            }
            .team-icon {
              margin: 0 3px 0 0;
            }
          }
        }
      }

      .odds {
        margin-top: .1rem;
        margin-bottom: .1rem;
        position: relative;
        :deep(.odd-list-wrap) {
          display: flex;
          justify-content: center;
          .odd-list-container {
            width: 2.74rem;
            height: .32rem;
            .odd-column-item {
              background: var(--q-gb-bg-c-28);
              margin-left: .04rem;
              border-radius: 4px;
            }
            .odd-title {
              font-size: .1rem;
              margin-bottom: .02rem;
            }
            .odd-value {
              font-size: .12rem;
            }
          }
        }
        .collect {
          position: absolute;
          top: 9px;
          left: 3px;
          z-index: 10;
        }
      }
    }

    .match-score-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
      // border-bottom: .01rem solid var(--q-gb-bd-c-4);
      // padding: 4px 0 0;

      .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      :deep(.score-section){
        height: 20px;
        .scroll-container-w{
          height: 100%;
        }
      }
      :deep(.score-se-inner){
        max-width: 100%;
        height: 100%;
        .score-se-inner2{
          display: flex;
          margin-left: -5px;
          overflow-x: auto;
          justify-content: space-between;
          height:100%;
          overflow-y:hidden;
          .score-fle-container-1{
            position: relative;
            top: 1px;
            .items-start {
              display: inline-block;
              height: 100%;
              line-height: .23rem;
            }
          }
          .score-fle-container-snooker {
            display: block;
            width: 1.06rem;
            text-overflow:ellipsis;
            white-space:nowrap;
            overflow:hidden;
            text-align:right;
          }
          .b-score-wrapper{
            flex-wrap: nowrap;
            .mfo-title{
              flex-shrink: 0;
            }
          }
        }
      }
    }

    .score-content-snooker {
      :deep(.scroll-container-w){
        .score-fle-container-1{
          display: block;
          width: 1.06rem;
          text-overflow:ellipsis;
          white-space:nowrap;
          overflow:hidden;
        }
      }
    }

    .title-details {
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 0;

      .details {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;

        .operate-icon {
          height: 100%;
          display: flex;
          align-items: center;
          gap: 4px;

          img {
            display: inline-block;
            height: 16px;
          }
        }

        .score-wrapper {

        .score-section {
          padding-left: 0;
          transform: translateX(-0.02rem);
        }

        .go-container-w {
          .disabled{
            filter: grayscale(100%);
          }
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
                height: 0.16rem;
                width: 0.16rem;
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

        .score-title-text {
          height:100%;
          display: flex;
          align-items: center;
          color:var(--q-gb-t-c-18);
          font-size: 0.12rem;
          // margin-top: .02rem;
        }

        .timer-wrapper-c {
          height: 100%;
          color: var(--q-gb-t-c-4);
          gap: 2px;

          &.newer {
            margin-left: 0;
          }

          &>div {
            height: 100%;
          }
        }
      }

      .more {
        .count_span {
          font-size: 11px;
          font-weight: 500;
          color: var(--q-gb-t-c-19);
          display: flex;
          align-items: center;
          margin-top: 1px;
        }

        .icon-wapper-more {
          position: relative;
          transform: rotate(-90deg);
        }
      }
    }
    :deep(.start-counting-down) {
      .counting-down-start{
        font-size: 0.12rem;
      }
    }
  }
}

/* ********赛事容器相关********** -E*/
</style>