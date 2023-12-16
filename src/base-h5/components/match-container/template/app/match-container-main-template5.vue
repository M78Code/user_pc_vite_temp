<!--
 * @Description:  app-h5   新手版 
-->
<template>
  <div :style="{ marginTop: is_hot ? '0' : '' }" class="match-container component app-match-container-main-template5" :class="{ collect: isCollectMenuTab }">
    <template v-if="match">
      <!-- <div style="display: none;">{{ MatchDataBaseH5.data_version.version }}</div> -->
     <!-- 开赛标题  -->
      <div v-if="is_show_opening_title" @click.stop="handle_ball_seed_fold"
        :class="['match-status-fixed', { progress: +match.start_flag === 1, not_begin: +match.start_flag === 2 }, i !== 0 && 'mt5px']" >
        <!-- 进行中 -->
        <template v-if="+match.start_flag === 1">
          <div class="match-status-title">
            <img :src="in_progress" /> <span class="din-regular"> 进行中</span>
          </div>
          <img :class="['expand_item', {collapsed: collapsed}]" :src="expand_item" alt="">
        </template>
        <!-- 未开赛 -->
        <template v-else>
          <div class="match-status-title">
            <img :src="not_begin" /> <span class="din-regular"> {{ i18n_t('list.match_no_start') }}</span>
          </div>
          <img :class="['expand_item', {collapsed: collapsed}]" :src="expand_item" alt="">
        </template>
      </div>
      <!-- 已开赛标题  -->
      <!-- <div class="match-status-fixed flex items-center" v-else>
        <img src='../../../../../base-h5/assets/match-list/icon_started.svg' />
        <span class="din-regular">
          {{ i18n_t('list.match_start') }}&nbsp;&nbsp;
          <span v-show="in_progress_total">(0)</span>
        </span>
      </div> -->
      <!--体育类别 -- 标题  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
      <div v-if="show_sport_title" @click="handle_ball_seed_fold" :class="['sport-title match-indent', { home_hot_page: is_hot, is_gunqiu: [1].includes(+menu_type), first: i == 0, }]">
        <span class="score-inner-span"> {{ match_of_list.csna }}{{ '(' + menu_lv2.ct + ')' }} </span>
      </div>

      <!-- 最核心的div模块     标题 + 倒计时 + 比分 + 赔率盘口模块 -->
      <div :class="['match-inner-container', { 'collapsed': !collapsed }]">
        <!--联赛标题 -->
        <div @click="handle_league_fold" v-if="match.is_show_league || (is_hot && get_league_show(i))"
          :class="[(' match-indent league')]">
          <div class="league-t-wrap right-border">
            <!-- 联赛收藏 -->
            <template v-if="![3000, 900].includes(menu_type)" @click.stop="handle_league_collect">
              <img v-if="!league_collect_state" class="favorited-icon"
                src="/src/base-h5/assets/match-list/ico_fav_nor.png" alt="" @click.stop="handle_league_collect" />
              <img v-if='league_collect_state' class="favorited-icon" src="/src/base-h5/assets/match-list/ico_fav_sel.png"
                @click.stop="handle_league_collect" />
            </template>
            <!-- 电竞图标 写死 -->
            <div class="esport" v-if="match_of_list.csid == 101"
              :style="compute_css_obj('menu-sport-active-image', 2101)"></div>
            <div class="esport" v-else-if="match_of_list.csid == 103"
              :style="compute_css_obj('menu-sport-active-image', 2103)"></div>
            <div class="esport" v-else-if="match_of_list.csid == 102"
              :style="compute_css_obj('menu-sport-active-image', 2102)"></div>
            <div class="esport" v-else-if="match_of_list.csid == 100"
              :style="compute_css_obj('menu-sport-active-image', 2100)"></div>
            <span class="league-title-text row justify-between">
              <span :class="['league-t-wrapper', { 'league-t-main-wrapper': menu_type !== 28, export: is_esports }]">
                <span class="match-league ellipsis-2-lines" :class="{ 'match-main-league': menu_type !== 28 }">
                  {{ match.tn }}
                </span>
              </span>
              <icon-wapper color="#c9c9c9" name="icon-arrow" size="15px"
                :class="['icon-wapper', { 'close': collapsed }]" />
            </span>
          </div>

        </div>
        <!-- 赛事内容 -->
        <div class="match-content" v-if="collapsed">
          <!-- 比分版 | 视频 icon | 赛事阶段 | 比分| 盘口 -->
          <div class="title-details">
            <div class="details">
              <!-- 图标 -->
              <div class="operate-icon">
                <!-- 直播 主播 视频 动画  icon 栏目   -->
                <!-- 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画 -->


                <!-- mvs动画状态：-1：没有配置动画源 | 0 ：已配置，但是不可用 | 1：已配置，可用，播放中 | 2：已配置，可用，播放中 -->
                <template v-if="match.mvs > -1 || (match.mms > 1 && [1, 2, 7, 10, 110].includes(match.ms * 1))">
                  <!-- 动画状态大于-1时，显示动画按钮 i18n_t('match_info.animation')是国际化取值 -->

                  <!-- icon_click_animationUrl media_button_handle -->
                  <img v-if="match.mvs > -1" class="" src='/src/base-h5/assets/match-list/ico_animate_nor.png'
                    @click="media_button_handle_by_type(ButtonTypes.animationUrl)" />
                  <!-- 视频状态大于1时，显示视频按钮 i18n_t('match_info.video')是国际化取值 -->
                  <img v-if="match.mms > 1" class="live-icon-btn" src='/src/base-h5/assets/match-list/ico_live_nor.png'
                    @click="media_button_handle_by_type(ButtonTypes.muUrl)" />
                  <!--icon_click_muUrl  -->
                  <!--  match["lvs"] == 2，显示直播按钮 i18n_t('match_info.lvs')是国际化取值 -->
                  <img v-if="match.lvs == 2" class="" src='/src/base-h5/assets/match-list/ico_liveshow_nor.png'
                    @click="media_button_handle_by_type(ButtonTypes.lvs)" />
                  <!-- icon_click_lvs -->
                </template>
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
                <div class="date-time"
                  v-show="match.ms != 110 && !show_start_counting_down(match) && !show_counting_down(match)">
                  {{ format_time_zone(+match.mgt).Format(i18n_t('time4')) }}
                </div>
                <!--一小时内开赛 -->
                <div class="start-counting-down" v-show="match.ms != 110 && show_start_counting_down(match)">
                  <CountingDownStart :match="match" :index="i" :mgt_time="match.mgt"></CountingDownStart>
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
              <!-- 比分版 -->
              <div class="score-title-text" v-if="home_score == 0 || away_score == 0 || home_score || away_score">{{ home_score }} - {{
                away_score }}</div>
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
                <span>
                  {{ match.man }}
                </span>
                <!--发球方绿点-->
                <span class="serving-party" :class="{ 'simple': standard_edition == 1 }"
                  v-show="set_serving_side(match, 'home')">
                </span>

                <!-- 1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 -->
                <image-cache-load v-if="match?.mhlu?.length && !([5, 10, 7, 8].includes(Number(match.csid)))"
                  :csid="+match.csid" :path="match.mhlu" type="home"></image-cache-load>
                <!-- <img v-if="match?.mhlu?.length" class="logo" v-img="([match.mhlu[0], match.frmhn[0], match.csid])" /> -->
              </div>
              <span class="vs">VS</span>
              <div class='right'>
                <image-cache-load v-if="match?.malu?.length && !([5, 10, 7, 8].includes(Number(match.csid)))"
                  :csid="+match.csid" :path="match.malu" type="home"></image-cache-load>

                <!-- <img v-if="match?.malu?.length" class="logo" v-img="([match.malu[0], match.frman[0], match.csid])" /> -->
                <!--发球方绿点-->
                <span class="serving-party" :class="{ 'simple': standard_edition == 1 }"
                  v-show="set_serving_side(match, 'away')">
                </span>
                <span>
                  {{ match.mhn }}
                </span>

              </div>
            </div>
            <!-- 比分选项 -->
            <div class="odds">
              <!-- <div class="favorite-icon-top match list-m" @click.stop="handle_match_collect">
                <img v-if="!match_collect_state" class="favorited-icon"
                  src="/src/base-h5/assets/match-list/ico_fav_nor.png" alt="" @click.stop="handle_match_collect" />
                <img v-if='match_collect_state' class="favorited-icon"
                  src="/src/base-h5/assets/match-list/ico_fav_sel.png" @click.stop="handle_match_collect" />
              </div>
              <div class="bet_btn">
                <template v-if="curMatchOdds?.length">
                  <div v-for="item in curMatchOdds" :key="item.oid" class="item"
                    :class="{ active: active_score === `${item._mid}${item.oid}` }" @click="go_to_bet(item)">
                    <div v-if='item.onb || item.on' class='on'>{{ item.onb || item.on }}</div>
                    <div class='num'>{{ format_odds_value(item) }}</div>
                  </div>
                </template>
                <template v-else>
                  <div v-for="item in 3" :key="item.oid" class="item">
                    <div class='num'>
                      <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/common/match-icon-lock2.svg`" />

                    </div>
                  </div>
                </template>
              </div> -->
              <OddListWrap :main_source="main_source" :match="match_of_list" />
            </div>


          </div>
          <!--  新手版-赛事比分信息 -->
          <div class="match-score-info">
            <div v-show="match?.ms != 0 && match?.csid != 1">
              <score-list :main_source="main_source" :match="match"></score-list>
            </div>

          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

import { IconWapper } from 'src/components/icon'
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import ScoreList from 'src/base-h5/components/match-container/template/app/components/score-list-5/index.vue';
import OddListWrap from 'src/base-h5/components/match-list/components/odd-list-wrap.vue';
import ImageCacheLoad from "src/base-h5/components/match-list/components/public-cache-image.vue";
import GlobalAccessConfig from "src/core/access-config/access-config.js"

import { i18n_t, compute_img_url } from "src/output/index.js"
import { format_time_zone } from "src/output/index.js"

import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2, is_detail, is_esports, is_results, footer_menu_id } from 'src/base-h5/mixin/menu.js'

import default_mixin from '../../mixins/default.mixin.js'
import { compute_value_by_cur_odd_type } from "src/output/index.js";
import lodash from 'lodash';
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { MITT_TYPES, LOCAL_PROJECT_FILE_PREFIX, useMittOn, compute_css_obj } from "src/output/index.js"
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'

import { in_progress, not_begin, animation_icon, video_icon, icon_date, expand_item,
  normal_img_not_favorite_white, not_favorite_app, normal_img_is_favorite, corner_icon, mearlys_icon_app, midfield_icon_app } from 'src/base-h5/core/utils/local-image.js'

export default {
  name: "match-container-main-template8",
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
      console.log(' active_score.value: ', active_score.value);
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
      active_score,
      go_to_bet,
      ButtonTypes,
      format_odds_value,
      curMatchOdds,
      isCollectMenuTab,
      lang, theme, i18n_t, compute_img_url, format_time_zone, GlobalAccessConfig, footer_menu_id, LOCAL_PROJECT_FILE_PREFIX,
      is_hot, menu_type, menu_lv2, is_detail, is_esports, is_results, standard_edition, footer_menu_id,
      in_progress, not_begin, animation_icon, video_icon, icon_date, expand_item, show_sport_title, compute_css_obj,
      normal_img_not_favorite_white, not_favorite_app, normal_img_is_favorite, corner_icon, mearlys_icon_app, midfield_icon_app
    }
  }
}

</script>
  
   
<style scoped lang="scss">
/* ********赛事容器相关********** -S*/

.counting-down-up-container {
  width: 0.8rem;

  :deep(.counting-down-wrap) {
    /* width: auto !important; */
    // gap: 4px;

    /* width:0.9rem!important; */
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
  background: var(--q-gb-bg-c-18);

  .match-status-fixed {
    width: 100%;
    height: 0.25rem;
    line-height: 1;
    font-size: 0.11rem;
    padding-left: 0.17rem;
    display: flex;
    align-items: center;
    color: var(--q-gb-t-c-20);
    background: var(--q-gb-bg-c-15);
    justify-content: space-between;
    &.progress{
      border-top: 2px solid rgba(116, 196, 255, 0.5);
    }
    &.not_begin{
      border-top: 2px solid rgba(233, 91, 91, 0.51);
    }

    &.mt5px {
      margin-top: .05rem;
    }

    img {
      margin-right: .06rem;
      width: .13rem;
      height: .13rem;
    }
    .expand_item{
      transition: transform 0.25s ease;
      transform: rotate(-180deg);
      width: 20px;
      height: 16px;
    }
    .collapsed{
      transform: rotate(0);
    }
  }

  .match-status-title {
    display: flex;
    align-items: center;
  }

  .match-inner-container {
    margin: 0 0.05rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--q-gb-bg-c-18) !important;
    // box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.04);
    // border-radius: .04rem;
    .buffer-container {
      background: var(--q-gb-bg-c-17);
      height: 5px;
      width: 100%;
    }
    .match-content{
      border-radius: 0 0 8px 8px;
      &.collapsed{
        border-top: none;
      }
    }
    &.collapsed{
      > .match-indent{
        border-radius: 8px !important;
        border-bottom: 1px solid #fff !important;
        border: 1px solid #fff;
      }
    }
    > .match-indent{
      border: 1px solid #fff;
      border-radius: 8px 8px 0 0 !important;
      border-bottom: 1px solid #E4E6ED !important;
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
    color: #999;
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
          color: var(--sys-brand-secodary-secondary-300, #AFB3C8);
          text-align: right;
          font-family: Akrobat;
          font-size: 10px;
          font-weight: 500;

          .mc-n {
            width: 0.14rem;
          }
        }
      }
    }

    .timer-wrapper-c {
      height: 100%;
      color: #999;

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
    border-bottom: 1px solid var(--q-gb-bg-c-19);
    border-top: 1px solid var(--q-gb-bg-c-19);
    border-color: var(--q-gb-bg-c-19) !important;
    margin-top: 0.05rem;
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
    padding: 0 5px 0 20px;
    background: var(--q-gb-bg-c-18);
    line-height: 19px;
    font-size: 11px;
    margin-bottom: -.05rem;
    margin-top: 0;
    border-bottom: 0;

    .score-inner-span {
      width: 100%;
      //transform: translateY(-3px);
    }
  }

  /* **************体育展示********************** -E*/

  /* **************联赛展示********************** -S*/
  .league {
    height: 0.26rem;
    border-radius: .08rem .08rem 0 0;
    background-color: var(--q-gb-bg-c-17) !important;

    .league-t-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;

      .favorited-icon {
        width: 14px;
        height: 14px;
        margin: 0 4px 0 0.11rem;
        /* position: relative;
        top: 1px; */
        flex-shrink: 0;

      }
    }

    .league-title-text {
      font-size: 0.13rem;
      width: 100%;
      height: 100%;
      padding-right: 5px;
      // transform: translateY(1px);
      text-overflow: ellipsis;
      flex-wrap: nowrap;
      align-items: center;
      overflow: hidden;
      color: var(--q-color-com-fs-color-26);
      font-weight: 600;

      .icon-wapper {
        transform: rotate(90deg);
      }

      .close {
        transform: rotate(180deg);
      }

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
        line-height: 0.14rem;
        color: var(--sys-brand-secodary-secondary-800, #303442);
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 600;
      }
    }
  }

  .match-content {
    width: 100%;
    background: var(--q-gb-bg-c-17);
    padding: 4px 9px 0;

    .event-team {
      padding: 8px 0;

      .name {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #303442;
        font-size: 12px;
        font-weight: 400;

        .serving-party {
          border-radius: 2px;
          background: var(--sys-feedback-success-success-400, #4AB06A);
          width: 4px;
          height: 4px;
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
          }

          &.right {
            justify-content: flex-start;
          }
        }
      }

      .odds {
        display: flex;
        align-items: center;
        justify-content: center;
        /* justify-content: space-between; */
        /* padding-right: 46px; */
        margin: .08rem 0;

        .bet_btn {
          display: flex;
          align-items: center;
          width: 274px;
          gap: 2px;
          justify-content: center;

          .active {
            background: var(--sys-neutral-white-white, #FFF);
          }

          .item {
            padding: 2px 0px;
            flex: 1;
            height: 32px;
            flex-shrink: 0;
            border-radius: 2px;
            background: var(--q-gb-bg-c-15);
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.04);
            &.active {
              background: var(--sys-brand-secodary-secondary-200, #C9CDDB);
            }

            .on {
              color: var(--sys-brand-secodary-secondary-300, #AFB3C8);
              text-align: center;
              font-size: 10px;
              font-weight: 500;
            }

            .num {
              color: var(--sys-brand-secodary-secondary-800, #303442);
              text-align: center;
              font-size: 10px;
              font-weight: 700;
            }
          }
        }
      }



    }

    .match-score-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: .01rem solid var(--q-gb-bg-c-19);
      // padding: 4px 0 0;

      .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
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

        .score-title-text {
          height:100%;
          display: flex;
          align-items: center;
          // margin-top: .02rem;
        }

        .timer-wrapper-c {
          height: 100%;
          color: #999;
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
          font-size: 10px;
          font-weight: 500;
          color: #afb3c8;
          display: flex;
          align-items: center;
        }

        .icon-wapper-more {
          position: relative;
          transform: rotate(-90deg);
        }
      }
    }
  }
}

/* ********赛事容器相关********** -E*/
</style>
 src/output/index.js