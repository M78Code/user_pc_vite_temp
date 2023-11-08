<!--
 * @Description:  app-h5   新手版 
-->
<template>
  <div :style="{ marginTop: is_hot ? '0' : '' }" class="match-container">
    <template v-if="match">
      <!-- <div style="display: none;">{{ MatchDataBaseH5.data_version.version }}</div> -->
      <!-- 未开赛标题  -->
      <div class="match-status-fixed flex items-center" v-if="match.is_show_no_play">
        <img src='../../../../../base-h5/assets/match-list/icon_notstarted.png' />

        <span class="din-regular">
          {{ $t('list.match_no_start') }}&nbsp;&nbsp;<span v-show="no_start_total">(0)</span>
        </span>
      </div>
      <!--体育类别 -- 标题  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
      <div v-if="get_sport_show" @click="handle_ball_seed_fold" :class="['sport-title match-indent', { first: i == 0 }]">
        <span class="score-inner-span"> {{ match_of_list.csna }}{{ '(' + menu_lv2.ct + ')' }} </span>
      </div>

      <!-- 最核心的div模块     标题 + 倒计时 + 比分 + 赔率盘口模块 -->
      <div :class="['match-inner-container', { 'collapsed': !collapsed }]">
        <!--联赛标题 -->
        <div @click="handle_league_fold" v-if="match.is_show_league || (is_hot && get_league_show(i))"
          :class="[(' match-indent league')]">
          <div class="league-t-wrap right-border">
            <!-- 联赛收藏 -->
            <div v-if="![3000, 900].includes(menu_type)" class="favorited-icon" @click.stop="handle_league_collect">
              <!-- 未收藏 -->
              <img v-if="!league_collect_state" :src="compute_img_url('icon-favorite')" alt="">
              <!-- 收藏图标 -->
              <img v-if='league_collect_state' :src="compute_img_url('icon-favorite-s')">
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
            <span class="league-title-text row justify-between">
              <span :class="['league-t-wrapper', { 'league-t-main-wrapper': menu_type !== 28, export: is_export }]">
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
          <!-- TODO match -->
          <!-- 比分版 | 视频 icon | 赛事阶段 | 比分| 盘口 -->
          <div class="title-details">
            <div class="details">
              <!-- 图标 -->
              <div class="operate-icon">
              <!-- 直播 主播 视频 动画  icon 栏目   -->
              <!-- 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画 -->
              <!-- <div class="live-i-b-wrap  v-mode-span row items-center" v-if="media_button_state_obj.icon_path"
                  @click="media_button_handle()">
                                                                                    <slot></slot>
                        <img class="live-icon-btn" :src='video_play_app' />
                      </div> -->
                              <!-- 
                                                                            <img v-if="media_button_state_obj.icon_path" class="live-icon-btn" src='/src/base-h5/assets/match-list/ico_live_nor.png'
                                                                              @click="media_button_handle()" /> -->

              <!-- 足篮球展示赛事分析图标 -->
                              <!-- <img :src="compute_img_url('data-analysis')" alt="" class="analysis"
                                                                              v-if="[1, 2].includes(+match.csid) && GlobalAccessConfig.get_statisticsSwitch()"
                                                                              @click='goto_details(match, 1)' /> -->
              <!-- </div> -->
                              <!-- 此赛事支持提前结算 -->
                              <!-- <img :src="mearlys_icon" alt="" style="width:0.2rem" class="settlement"
                    v-if="match_of_list.mearlys == 1" /> -->
              <!--  match["lvs"] == 2，显示直播按钮 i18n_t('match_info.lvs')是国际化取值 -->
                              <!-- <match-icon v-if="show_lvs" class="fl" which="lvs" icon_class="lvs"
                                                                            :text="lodash.get(match, 'lss') == 1 ? i18n_t('match_info.lvs') : i18n_t('match_info.topic')">
                                                                          </match-icon> -->



                              <!-- mvs动画状态：-1：没有配置动画源 | 0 ：已配置，但是不可用 | 1：已配置，可用，播放中 | 2：已配置，可用，播放中 -->
                              <template v-if="match.mvs > -1 || (match.mms > 1 && [1, 2, 7, 10, 110].includes(match.ms * 1))">
                                <!-- 动画状态大于-1时，显示动画按钮 i18n_t('match_info.animation')是国际化取值 -->
                                <img v-if="match.mvs > -1" class="" src='/src/base-h5/assets/match-list/ico_animate_nor.png'
                                  @click="icon_click_animationUrl" />
                                <!-- 视频状态大于1时，显示视频按钮 i18n_t('match_info.video')是国际化取值 -->
                                <img v-if="match.mms > 1" class="live-icon-btn" src='/src/base-h5/assets/match-list/ico_live_nor.png'
                                  @click="icon_click_muUrl" />
                                <!--  match["lvs"] == 2，显示直播按钮 i18n_t('match_info.lvs')是国际化取值 -->
                                <img v-if="match.lvs == 2" class="" src='/src/base-h5/assets/match-list/ico_liveshow_nor.png'
                                  @click="icon_click_lvs" />
                              </template>
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
                                :class="['counting-down-up-container relative-position', { 'special-match-container': match.mfo || [0, 31].includes(+match.mmp) }]"
                                :style="{ width: counting_down_up_wrapper_width === 'auto' ? 'auto' : match.mfo ? 'auto' : counting_down_up_wrapper_width + 'rem' }">
                                <!--足球csid:1 冰球csid:4 橄榄球csid:14 DotaCsid:101 累加 排球csid:9 倒计时-->
                                <CountingDownSecond ref="counting-down-second" :title="mmp_map_title" :mmp="match.mmp"
                                  :is_add="[1, 4, 11, 14, 100, 101, 102, 103].includes(+match.csid)" :m_id="match.mid"
                                  :second="match.mst" :match="match" @counting-wrapper-width="update_counting_down_up_wrapper_width">
                                </CountingDownSecond>
                              </div>
                            </div>
                            <!-- 比分版 -->
                            <div v-if="home_score == 0 || away_score == 0 || home_score || away_score">{{ home_score }} - {{
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
                            <div>
                              <span>
                                {{ match.man }}
                              </span>
                              <!--发球方绿点-->
                              <span class="serving-party" :class="{ 'simple': standard_edition == 1 }"
                                v-show="set_serving_side(match, 'home')">
                              </span>
                              <img v-if="match?.mhlu?.length" class="logo" v-img="([match.mhlu[0], match.frmhn[0], match.csid])" />
                            </div>
                            <span class="vs">VS</span>
                            <div>
                              <img v-if="match?.malu?.length" class="logo" v-img="([match.malu[0], match.frman[0], match.csid])" />
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
                <!-- <img class='star' /> -->
                <!-- 单个赛事收藏 -->
                <div class="favorite-icon-top match list-m" @click.stop="handle_match_collect">
                  <!-- 未收藏图标 -->
                  <img v-if="!match_collect_state" :src="compute_img_url('icon-favorite')" alt="" />
                  <!-- 收藏图标 -->
                  <img v-if='match_collect_state' :src="compute_img_url('icon-favorite-s')" />
                </div>
                <div class="bet_btn">
                  <div v-for="item in curMatchOdds" :key="item.oid" class="item">
                    <div v-if='item.onb || item.on' class='on'>{{ item.onb || item.on }}</div>
                    <div class='num'>{{ format_odds_value(item) }}</div>
                  </div>
                </div>
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

import { i18n_t, compute_img_url } from "src/core/index.js"
import { format_time_zone } from "src/core/format/index.js"
import { mearlys_icon } from 'src/base-h5/core/utils/local-image.js'

import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2, is_detail, is_export, is_results, footer_menu_id } from 'src/base-h5/mixin/menu.js'

import default_mixin from '../../mixins/default.mixin.js'
import _ from 'lodash'
import { compute_value_by_cur_odd_type } from "src/core/index.js";
import lodash from 'lodash';
import store from "src/store-redux/index.js";
import { computed, ref, watch } from 'vue';
import { api_common } from 'src/api/index.js';
import video from "src/core/video/video.js"   // 视频相关公共方法
import uid from "src/core/uuid/index.js"
import { MatchDetailCalss, useMittEmit, MITT_TYPES, LOCAL_PROJECT_FILE_PREFIX } from "src/core/index.js"
import { useRoute } from 'vue-router';

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
    const route = useRoute()
    const { detailsReducer } = store.getState()
    const hd_sd = ref(detailsReducer.hd_sd)

    let send_gcuuid = ''
    const { match_of_list } = props
    console.log('match_of_list: ', match_of_list);
    const match_id = computed(() => route.params.mid || match_of_list.mid)

    /**
     * 赛事栏目点击相关
     */


    const check_url = (url, which) => {
      // // 本地代码连接 调试 时，打开此注释即可播放视频------勿删除此注释
      let data = {
        media_src: url,
        active: 'muUrl',
      };
      MatchDetailCalss.set_video_url(data);
      useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true);
      MatchDetailCalss.set_iframe_onload(false);
      setTimeout(() => {
        MatchDetailCalss.set_iframe_onload(true);
      }, 2000)
      return
      api_common.get_full_url(url).then((v) => {
        if (v) {
          let data = {
            media_src: url,
            active: which ? which : 'muUrl',
          };
          console.error(data);
          MatchDetailCalss.set_video_url(data);
          // 开启视频
          useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true),
            // iframe标签
            useMittEmit(MITT_TYPES.EMIT_SET_IFRAME_ONLOAD, false),
            timer1_.value = setTimeout(() => {
              // iframe 标签
              useMittEmit(MITT_TYPES.EMIT_SET_IFRAME_ONLOAD, true);
            }, 2000)
        } else {
          //   set_toast({
          //     txt: i18n_t('video.sorry'),
          //   });
        }
      }).catch(() => {
        // set_toast({
        //   txt: i18n_t('video.sorry'),
        // });
      })
    }
    /**
     * 点击直播
     */
    const icon_click_lvs = () => {
      let params = {
        mid: match_id.value,
        device: 'H5'
      };
      api_common.getliveVideoUrl(params).then((res) => {
        let { code, data } = res
        console.log('点击直播---------', code, data);
        if (code == 200) {
          // "chatRoomId": "1001",//聊天室ID
          // "crs": 1,  //聊天室开关 0 ：关闭  1：开启
          // hdUrl : "rtmp://test-pull-live.wafqa2.com/live/123456"  //直播视频高清播放地址
          // liveState : 1
          // programPath : ""  //赛前节目播放地址
          // referUrl : "http://testliveh5.sportxxx13ky.com"//域名
          // sdUrl : "rtmp://test-pull-live.wafqa2.com/live/654321"  //直播视频标清地址
          // serverTime : "1663733773446"
          let media_src = video.get_video_url_h5(res, params.mid, 3, hd_sd.value);
          // check_url(media_src, which);
          check_url(media_src, 'lvs');

        }
      })
    }
    /**
     * 点击视频
     */
    const icon_click_muUrl = () => {
      let check = match_of_list.mms >= 2 || match_of_list.mvs > -1

      if (!check) {
        return false
      }
      let params = {
        mid: match_id.value,
        type: 'Video'
      };
      api_common.getMatchUserIsLogin().then(res => {
        console.error(res);
        // 判断用户是否登录
        if (res && res.code == 200 && res.data.isLogin) {
          let referUrl = lodash.get(window.BUILDIN_CONFIG, "DOMAIN_RESULT.live_domains[0]");
          let media_src
          if (referUrl) {
            media_src = video.get_video_url_h5({ data: { referUrl } }, params.mid, 1);
            check_url(media_src);
          } else {
            let param = {}
            send_gcuuid = uid();
            param.gcuuid = send_gcuuid;
            api_common.getVideoReferurl(param).then(res => {
              if (send_gcuuid != res.gcuuid) return;
              media_src = video.get_video_url_h5(res, params.mid, 1);
              check_url(media_src);
            });
          }
          ;
        } else {
          if (lodash.get(res, 'code') == '0401038') {
            // set_toast({
            //   txt: i18n_t('msg.msg_nodata_22'),
            // });
            return;
          }
          let data = {};
          data.active = 'muUrl';
          MatchDetailCalss.set_video_url(data);
          // 开启视频
          useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true)
          let video_sorry_temp = "";
          if (lang == 'zh') {
            video_sorry_temp = "!";
          }
          // set_toast({
          //   txt: i18n_t('video.sorry') + video_sorry_temp,
          // });
        }
      }).catch(() => {
        let video_sorry_temp = "";
        if (lang == 'zh') {
          video_sorry_temp = "!";
        }
        // set_toast({
        //   txt: i18n_t('video.sorry') + video_sorry_temp,
        // });
      })
    }
    /**
     * 点击动画
     */
    const icon_click_animationUrl = () => {
      let check = match_of_list.mms >= 2 || match_of_list.mvs > -1

      if (!check) {
        return false
      }

      let params = {
        mid: match_id.value,
        type: 'Animation'
      };
      send_gcuuid = uid();
      params.gcuuid = send_gcuuid;

      api_common.videoAnimationUrl(params).then((result) => {
        let res = {}
        if (result.status) {
          res = result.data
        } else {
          res = result
        }
        const { data } = res
        if (send_gcuuid != res.gcuuid) return;
        let animationUrl = ''
        //足篮棒网使用3.0动画  其他使用2.0
        console.error(res);
        if ([1, 2, 3, 5].includes(lodash.get(match_of_list, 'csid') * 1)) {
          let animation3Url = data.animation3Url || []
          animation3Url.forEach(item => {
            if (item.styleName.indexOf('day') >= 0) {
              animationUrl = item.path
            }
          })
        }
        animationUrl = animationUrl || data.animationUrl
        data.animationUrl = animationUrl.replace(/https?:/, "") // 动画
        data.referUrl = data.referUrl && (data.referUrl.replace(/http:|https:/, '')) // 视频
        data.active = 'animationUrl';
        data.referUrl = `${location.protocol}${data.referUrl}`;
        MatchDetailCalss.set_video_url(data);
        // 开启视频
        useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, true);
      })
    }

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
      const play_data = props.match_of_list?.hps?.[0] || {}
      // 列表取 hsw
      let hsw = lodash.get(play_data, `hl._play.hsw`) || "";
      let sport_id = lodash.get(props.match_of_list, "csid");
      // 电竞赔率精度处理
      // if (lodash.isUndefined(sport_id) && menu_config.is_esports()) {
      //   sport_id = "101";
      // }
      const match_odds = compute_value_by_cur_odd_type(
        ov,
        obv,  //todo
        hsw,
        sport_id
      );
      return match_odds
    };


    const format_odds_value = (data) => {
      const { ov, obv } = data
      return format_odds(ov, obv)

    }
    return {
      icon_click_lvs,
      icon_click_animationUrl,
      icon_click_muUrl,
      format_odds_value,
      curMatchOdds,
      _,
      lang, theme, i18n_t, compute_img_url, format_time_zone, GlobalAccessConfig, footer_menu_id, LOCAL_PROJECT_FILE_PREFIX,
      is_hot, menu_type, menu_lv2, is_detail, is_export, is_results, standard_edition, mearlys_icon, footer_menu_id
    }
  }
}

</script>
  
   
<style scoped lang="scss">
/* ********赛事容器相关********** -S*/

.match-container {
  width: 100%;
  height: auto;
  position: relative;

  .match-status-fixed {
    padding: 5px 0 5px 14px;
    gap: 4px;
    display: flex;
    align-items: center;
    height: 25px;
  }

  .counting-down-up-container {
    :deep(.counting-down-wrap) {
      width: auto !important;
      gap:4px;
      /* width:0.9rem!important; */
      >span{
        display:inline-block;
        white-space:nowrap;
      }
    }
  }

  .match-inner-container {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ffffff;

    .buffer-container {
      background: #f7f9fe;
      height: 5px;
      width: 100%;
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

    .favorite-icon-top {
      width: 0.14rem;
      height: 100%;
      height: 0.13rem;
      flex-shrink: 0;
      margin-right: .07rem;
      position: relative;
      top: 1px;

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
    background: #ffffff !important;
    height: 25px;
    border-bottom: 1px solid #F2F2F6;

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
    background: #f7f9fe;
    line-height: 20px;
    font-size: 11px;

    .score-inner-span {
      width: 100%;
      //transform: translateY(-3px);
    }
  }

  /* **************体育展示********************** -E*/

  /* **************联赛展示********************** -S*/
  .league {
    height: 0.26rem;
    border-radius: 0;

    .league-t-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;

      .favorited-icon {
        height: 100%;
        /* margin: 0 0.08rem; */
        margin: 0 4px 0 7px;
        position: relative;
        top: 1px;
        flex-shrink: 0;

        >img {
          width: 0.14rem;
          height: 100%;
        }
      }
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
    background: #fff;
    padding: 0 9px;

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
        }
      }

      .odds {
        display: flex;
        align-items: center;
        justify-content: center;
        /* justify-content: space-between; */
        /* padding-right: 46px; */
        margin-top: 8px;

        .bet_btn {
          display: flex;
          align-items: center;
          width: 274px;
          gap: 2px;
          justify-content: center;

          .item {
            padding: 2px 0px;
            flex: 1;
            height: 32px;
            flex-shrink: 0;
            border-radius: 2px;
            background: var(--sys-brand-secodary-secondary-50, #F2F2F6);
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;

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
      padding: 4px 0 0;

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
        gap: 2px;

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
  