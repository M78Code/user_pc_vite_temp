<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页视频+动画直播区域
-->
<template>    
  <div
    ref="video_height"
    class="component videos2 player"
    :class="{
      'across-height': get_is_full_screen && get_video_url.active == 'muUrl' && get_is_hengping,
    }"
  >
    <div class="icontainer-wrap" :class="{'top-space':nail && get_zhiding}">
      <!-- 播放出错 -->
      <div v-if="video_iframe_status == 'error'" class="video_reload_box icontainer">
        <!-- 展示球队名称、比分 -->
        <div class="title">
          <div class="row full-height mx-15">
            <div class="go-back-btn-wrap" @click="close_video">
              <div class="video_back"></div>
            </div>
            <div class="row" style="margin-right:0.1rem;max-width:2.43rem;">
              <div class="col title-text-style">{{title.mhn}}</div>
              <div class="col title-text-style eports_scoring_tip" v-if="eports_scoring">{{i18n_t('mmp.eports_scoring')}}</div>
              <div v-else :style="{visibility: get_detail_data.ms == 110 ? 'hidden':'visible'}" class="col title-text-style">{{title.msc}}</div>
              <div class="col title-text-style">{{title.man}}</div>
            </div>
          </div>
        </div>
        <div v-show="show_icons && !is_playing_replay" class="icons2">
          <div class="img-wrap" v-if="show_lvs" @click="toggle_click(4, 'lvs' )">
            <img :src="lodash.get(get_detail_data,'lss') == 1 ? studio_icon : lvs_icon_pre"/>
          </div>
          <!-- 视频 -->
          <div class="img-wrap" v-if="get_detail_data.mms >= 2 && get_video_url.active != 'muUrl'" @click="toggle_click(4, 'muUrl')">
            <img :src="shipin"/>
          </div>
          <!-- 动画 -->
          <div class="img-wrap" v-if="get_detail_data.mvs > -1 && lodash.get(UserCtr, 'user_info.ommv') && get_video_url.active != 'animationUrl' && !get_is_full_screen" @click="toggle_click(4, 'animationUrl')">
            <img :src="donghua"/>
          </div>

          <div class="img-wrap" v-if="show_animation || get_is_full_screen || media_type === 'progress_bar_video'">
            <!-- 视频info说明弹窗 -->
            <img :src="tips ? tips_act :tips_def" @click="change_info"/>
          </div>
        </div>

        <div class="text-center" @click="reload_video_methods()">
          <img  src="image/bw3/svg/video_reload.svg" :class="[rotate ? 'rotate_2': 'rotate_1']">
        </div>
        <div style="padding: 0.1rem;color:#6D7075;">
          {{i18n_t("video.sorry")}}
        </div>
      </div>

      <!-- 播放正常 -->
      <div v-else style="width:100%" class="iframe-wrap DJ-score-information icontainer" :class="{stickyed:nail && get_zhiding,'full-screen':get_is_full_screen}">
        <!-- 电竞的背景 -->
        <div class="show_DJ_back_css" v-if="get_menu_type == 3000" @click.self.stop="show_DJ_back()"></div>
        <!-- 第一次显示 用户指导页 -->
        <div class="floating-layer" v-if="first_login" @click.self.stop="first_login = false">
          <div>
            <img class="animate-bounce-up" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/one-click.svg`" alt="">
            <span>{{i18n_t("video.click_on")}}</span>
            <p>{{i18n_t("video.show_hide")}}</p>
          </div>
          <div>
            <img class="animate-bounce-up" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/double-click.svg`" alt="">
            <span>{{i18n_t("video.double_click")}}</span>
            <p>{{i18n_t("video.full_screen_play")}}</p>
          </div>
        </div>
        <!-- 视频单页项目-->
        <!-- {{ iframe_src+'&rdm='+iframe_rdm }} -->
        <!-- iframe_show && !is_show_no_handle && iframe_src-->
        <iframe 
          v-if=" iframe_src" 
          v-show="!is_playing_replay" 
          ref="iframe" id="video-iframe" 
          style="width:100%;height:100%;" 
          frameborder="0"
          marginwidth="0"
          marginheight="0"
          hspace="0"
          vspace="0"
          scrolling="no"
          allowfullscreen="true"
          allow="autoplay"
          :src="`${iframe_src}&rdm=${iframe_rdm}`"
        ></iframe>
        
        <!-- 视频单页项目精彩回放页面-->
        <iframe
          v-if="is_playing_replay"
          v-show="!is_replay_load_error"
          id="replayIframe"
          :src="replay_video_src+'&rdm='+iframe_rdm"
          style="width:100%;height:100%;"
          allow="autoplay"
          frameborder="0"
          scrolling="no"
          @load="handle_replay_video_loaded"
        ></iframe>
        <div class="load-error-mask" v-show="is_replay_load_error">
          <div><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/details/reconnect.svg`" /></div>
          <div>{{ i18n_t('highlights.reconnect') }}</div>
        </div>

        <template v-if="is_playing_replay">
          <!-- 回放视频标识logo -->
          <div class="replay-logo-wrap" :class="{'replay-logo-wrap-portrait': !get_is_hengping}">
            <img class="replay-logo-svg" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/details/replay_logo.svg`" />
          </div>

          <div v-show="is_controller_show" class="highlights-controller" :class="{'bottom-controller-bar': !get_is_hengping}">
            <!-- 视频声音 -->
            <div class="voice-wrap" :class="{'replay-voice-wrap': ProjectName == 'app-h5'}" 
              @click="set_video_voice" v-if="!['result_details','match_result'].includes(route?.name)">
              <svg v-if="!current_event_video.voice"  xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8z"></path></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528zM25.152 16q0 2.72-1.536 5.056t-4 3.36q-0.256 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.704 0.672-1.056 1.024-0.512 1.376-0.8 1.312-0.96 2.048-2.4t0.736-3.104-0.736-3.104-2.048-2.4q-0.352-0.288-1.376-0.8-0.672-0.352-0.672-1.056 0-0.448 0.32-0.8t0.8-0.352q0.224 0 0.48 0.096 2.496 1.056 4 3.36t1.536 5.056z"></path></svg>
            </div>
            <!--&lt;!&ndash; 视频info说明弹窗 &ndash;&gt;-->
            <!--<div v-show="!get_is_hengping" class="tips-wrap" @click="change_info">-->
            <!--  <img src="image/bw3/svg/details/tips.svg" />-->
            <!--</div>-->
            <!-- 全屏按钮 -->
            <!-- <div class="full-screen-btn" @click="exit_full_screen" v-if="!['result_details','match_result'].includes(route?.name)"> -->
          </div>
        </template>

        <!-- 精彩回放 -->
        <template v-if="get_detail_data.csid === '1' && get_is_hengping && is_replay_switch && events_list.length">
          
          <!--<div v-show="is_playing_replay" class="video-wrapper" ref="video_wrapper" @click="click_video_screen"></div>-->
          <!-- 精彩回放事件类型切换 -->
          <!-- <tabs v-show="is_expand_video_list" :tabs="tab_list" @click="get_video_list" ref="tabs"></tabs> -->
          
          <template v-if="get_is_hengping">
            <!--（精彩/收起）回放 -->
            <div v-if="events_list.length" class="toggle-replay-video-wrap hairline-border" :class="{'move-up': is_expand_video_list}" @click="toggle_slider_btn">
              <img src="image/bw3/svg/details/replay_toggle.svg" />
              <span>{{ !is_expand_video_list ? i18n_t('highlights.title') : i18n_t('highlights.collapse_replay') }}</span>
            </div>

            <!-- 关闭回放视频 -->
            <div v-show="is_playing_replay" class="close-video-wrap" @click="exit_full_screen">
              <img src="`${LOCAL_PROJECT_FILE_PREFIX}/image/bw3/svg/details/close.svg`" /> 
            </div>
          </template>

          <!-- 精彩回放视频滚动列表 -->
          <slider-x
              :slider_list="slider_events_list"
              image_key="fragmentPic"
              background-image
              @click="change_event_video"
              :class="{
                'video-move-in': is_expand_video_list,
                'video-move-in-middle': is_expand_video_list && is_slider_in_screen
              }"
              ref="slider_video"
          >
            <template v-slot:default="slotProps">
              <div class="score"><span>{{ slotProps.item.t1 }}</span><span class="colon">:</span><span>{{ slotProps.item.t2 }}</span></div>
              <div class="event-team ellipsis">{{ slotProps.item.homeAway }}</div>
              <div class="event-name">{{ event_name(slotProps.item.eventCode) }}: {{ slotProps.item.firstNum }}</div>
              <div class="event-time">{{ +slotProps.item.secondsFromStart | format_mgt_time }}</div>
            </template>
          </slider-x>
          
        </template>
        
        <!-- 长时间未操作 -->
        <div v-if="is_show_no_handle" class="no-handle information-score">
          <div class="text text-center">{{i18n_t('video.nohandle')}}</div>
          <div class="collect-icon" @click="is_show_no_handle = false"></div>
        </div>
        <!-- 动画背景遮罩层 -->
        <div 
          v-show="get_video_url.active == 'animationUrl' || (get_is_full_screen && !is_show_no_handle)"
          class="bg"
          v-touch-swipe.horizontal.prevent.mouse="bg_touchmove"
        ></div>
        <!--<div class="bg" v-show="get_video_url.active == 'animationUrl'" @touchmove.prevent></div>-->
        <football-events></football-events>

        <!-- 展示球队名称、比分 -->
        <div v-show="get_show_back_icons"  class="title" :class="{'opacity-header': ProjectName === 'app-h5' }">
          <!-- 视频全屏时的样式单独处理 -->
          <template v-if="get_is_full_screen && get_video_url.active == 'muUrl' && get_is_hengping">
            <div class="hengping-title row">
              <!-- 返回按钮 -->
              <div class="video_back yb_mx10" @click="close_video" style="height: 0.16rem"></div>
              
              <!-- 对阵信息 -->
              <span class="hengping-duiming ellipsis">{{title.mhn}}</span>
              <span :style="{visibility: get_detail_data.ms == 110 ? 'hidden':'visible'}" class="score-title yb_mx4">{{eports_scoring?(i18n_t('mmp.eports_scoring')):title.msc}}</span>
              <span class="hengping-duiming ellipsis">{{title.man}}</span>
              <!-- 比分 -->
              <div style="margin-left:auto" v-if="get_menu_type !== 3000">
                <match-score :detail_data="get_detail_data"></match-score>
              </div>

              
            </div>
          </template>
          <template v-else>
            <div class="row justify-between full-height mx-15"  @click.stop="click_mask">
               <!-- 缩放按钮 -->
              <img v-if="get_is_full_screen && show_exit_btn && ProjectName != 'ouzhou-h5'" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/pack_up.svg`" alt="exit" class="exit-img" @click="set_full_screen"/>
            
              <div class="col-1 go-back-btn-wrap" @click="close_video" >
                <div class="video_back"></div>
              </div>
              <!-- 动画不显示对阵信息 -->
              <div v-if="get_video_url.active == 'muUrl'" class="col-10 row" style="max-width: 2.43rem;">
                <div class="col title-text-style">{{title.mhn}}</div>
                <div class="col title-text-style eports_scoring_tip" v-if="eports_scoring">{{i18n_t('mmp.eports_scoring')}}</div>
                <div v-else :style="{visibility: get_detail_data.ms == 110 ? 'hidden':'visible'}" class="col title-text-style">{{title.msc}}</div>
                <div class="col title-text-style">{{title.man}}</div>
              </div>
              <div class="col-1"></div>
            </div>
          </template>
        </div>

        <div v-show="show_icons && !load_error && !is_playing_replay" class="icons2">
          <!-- 演播厅和 演播厅赛前图标 -->
          <div class="img-wrap" v-if="show_lvs " @click="toggle_click(4, 'lvs' )">
            <img :src="lodash.get(get_detail_data,'lss') == 1 ? studio_icon : lvs_icon_pre"/>
          </div>
          
          <template v-if="show_animation_and_video_status">
            <!-- 视频 -->
            <div class="img-wrap" v-if="get_detail_data.mms >= 2 && get_video_url.active != 'muUrl'" @click="toggle_click(4, 'muUrl')">
              <img :src="shipin"/>
            </div>
          </template>
          <template v-if="show_animation_and_video_status">
            <!-- 动画 -->
            <div class="img-wrap" v-if="get_detail_data.mvs > -1 && lodash.get(UserCtr, 'user_info.ommv') && get_video_url.active != 'animationUrl' && !get_is_full_screen" @click="toggle_click(4, 'animationUrl')">
              <img :src="donghua"/>
            </div>
          </template>

           <!-- 视频 info 说明弹窗 -->
           <div class="img-wrap" v-if="show_animation || get_is_full_screen || media_type === 'progress_bar_video'">
             <!-- 视频info说明弹窗 -->
             <img :src="tips ? tips_act :`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_b.svg`" @click.stop="change_info"/>
           </div>

          <div class="img-wrap" v-if="['1', '2'].includes(get_detail_data.csid) && [0,1,110].includes(+get_detail_data.ms) && get_is_full_screen && get_video_url.active == 'muUrl' && get_is_hengping">
            <!-- 投注弹窗 -->
            <img :src="bet" @click.stop="change_bet"/>
          </div>
          <div class="img-wrap" v-if="[1,2].includes(+get_detail_data.csid) && get_is_full_screen && get_video_url.active == 'muUrl' && get_is_hengping">
            <!-- 分析弹窗 -->
            <!-- <img :src="select_item == 3 ? (!('y0')?analyze2:analyze2_y0) : (!('y0')?analyze:analyze_yo)" @click.stop="change_analyze"/> -->
            <div :style="compute_img_url(select_item == 3?'video-analyze':'video-analyze-s')"></div>
          </div>
        </div>
        <!-- 声音按钮 -->
        <!-- <div v-show="show_icons && ['muUrl', 'lvs'].includes(get_video_url.active)&& !load_error && !is_playing_replay && !load_error" class="voice-btn" @click.stop="toggle_click(2, get_video_url.active)">
          <img v-if="voice" :src="voice_def">
          <img v-else :src="voice_act">
        </div> -->
        <slider v-if="false" class="slider-container" :value="current_event_video.voice" 
                v-show="show_icons && ['muUrl', 'lvs'].includes(get_video_url.active)&& !load_error && !is_playing_replay"  @change="change_volumn"/>
        
        <!-- <AnimationSlider></AnimationSlider> -->
       
        <div class="actions mb-8">
          <!-- 视频info说明弹窗 -->
          <div
            v-show="!show_animation && !get_is_full_screen && show_icons && !load_error && media_type !== 'progress_bar_video'"
            class="description-popup ml-8"
            v-if="!is_playing_replay"
          >
            <span class="font_color" @click="show_HD_SD" v-if="get_detail_data.lvs != -1 && lodash.get(get_detail_data,'lss') ==  1&& get_video_url.active == 'lvs'">
              {{get_hd_sd == 1 ? i18n_t("common.HD"): i18n_t("common.SD")}}
            </span>
            <img :src="tips ? tips_act :tips_def" @click="change_info" class="w-24 h-24"/>

          </div>
          <!-- 固钉 -->
          <!-- TODO: 暂无固定按钮图片 -->
          <!-- <img @click.stop="fix_top"
            v-if="fix_status && show_icons && ['muUrl', 'lvs'].includes(get_video_url.active)&& !load_error && !is_playing_replay" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/details/no_pin.svg`" alt="" class="w-24 h-24 ml-8"> -->

           <!-- 全屏按钮 -->
          <div 
            v-show="show_icons && ['muUrl', 'lvs'].includes(get_video_url.active)&& !load_error && !is_playing_replay" 
            class="full-screen-btn ml-8 mr-14" @click="set_full_screen">
            <!-- image/svg/pack_up.svg -->
            <img v-if="get_is_full_screen"  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/pack_up.svg`">
            <img v-else  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/details/fullscreen.svg`" class="w-24 h-24 ">
          </div>

          
        </div>
       
      </div>
    </div>
    <div class="tips details_bg6 details_t_color1" v-if="tips && video_iframe_status != 'error'">
      <div class="tips_content details_t_color3">
        {{i18n_t("video.msg")}}
      </div>
    </div>
    <div v-if="(get_is_hengping && get_analyze_show)"  :class="{'analyze-show':(get_is_hengping && get_analyze_show)}">
        <!-- 足球赛事分析 页面-->
        <analysis-football-matches v-if="get_detail_data.csid === '1'"></analysis-football-matches>
        <!-- 篮球赛事分析 页面-->
        <basketball-match-analysis v-if="get_detail_data.csid === '2'"></basketball-match-analysis>
    </div>
  </div>
</template>

<script>
import {api_common} from "src/api/index.js";
import video from "src/core/video/video.js"   // 视频相关公共方法
import matchScore from 'src/base-h5/components/match/match-score.vue' // 比分组件
import footballEvents from "src/base-h5/components/details/football-events.vue";
import analysis_football_matches from "src/base-h5/components/details/analysis-matches/football-match-analysis/analysis-football-matches.vue"; // 详情页  足球赛事分析
import basketball_match_analysis from "src/base-h5/components/details/analysis-matches/basketball-match-analysis/basketball-match-analysis.vue";  // 详情页 或者 赛果  篮球赛事分析

import { uid } from "quasar"
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt/index.js"
import { MenuData, MatchDetailCalss,compute_img_url, LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import slider from "src/base-h5/components/details/components/slider/slider.vue"
import AnimationSlider from "src/base-h5/components/details/components/slider/AnimationSlider.vue"
import OrientationSubscrbe from 'src/base-h5/components/common/orientation/orientation-subscribe'
import { useRoute } from "vue-router"
import { project_name ,into_video_anima_event} from "src/output/index.js"
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
export default {
  name: "videos",
  components: {
    matchScore,
    footballEvents,
    "analysis-football-matches": analysis_football_matches,  //足球分析
    "basketball-match-analysis": basketball_match_analysis,  //篮球分析
    // "tabs": () => import("src/base-pc/components/match-detail/match_info/tabs.vue"),
    "slider-x": () => import("src/base-h5/components/details/analysis-matches/components/slider-x.vue"),
    slider: slider,
    AnimationSlider
  },
  data() {
    return {
      UserCtr,
      LOCAL_PROJECT_FILE_PREFIX:LOCAL_PROJECT_FILE_PREFIX,
      tips_def: `${LOCAL_PROJECT_FILE_PREFIX}/image/details/info.svg`,
      // tips_def: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_b.svg`,
      tips_act: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_a.svg`,
      voice_def: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_i.svg`,
      voice_act: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_h.svg`,
      // nail_def: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_f.svg`,
      // nail_act: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_e.svg`,
      donghua: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/v-donghua.svg`,
      // 直播 切换的图标
      shipin: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/v-shipin.svg`,
      // 演播厅 切换的图标
      studio_icon:`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/studio_icon.svg`,
      // 赛前直播的
      lvs_icon_pre : `${LOCAL_PROJECT_FILE_PREFIX}/image/common/zhibo-before.svg`,
      // ding1: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/ding1.svg`,
      // ding2: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/ding2.svg`,
      bet: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/bet.svg`,
      analyze: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/analyse.svg`,
      analyze2: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/analyse2.svg`,
      analyze_yo: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/analyse2_y0.svg`,
      analyze2_y0: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/analyse_y0.svg`,
      select_item:-1,
      voice: false,
      nail: true,
      route: useRoute(),
      show_icons: false, //控制图标默认展示
      iframe_src: '',
      title: {
        mhn: '',//主队名称
        man: '',//客队名称
        msc: '0 v 0',//比分
      },
      video_iframe_status: '',
      rotate: false,
      video_line_list:[],
      video_line_index:0,
      // iframe_onload:false,
      // 用户第一次登陆，第一次显示视频时，提示 指引页
      first_login: false,
      mapFrame: null,
      // 视频加载错误标识（抱歉，暂时无法加载资源）
      load_error: false,
      //是不是需要6秒后消失
      is_need_timer:true,
      // 是否显示长时间未操作页面
      is_show_no_handle:false,
      // 事件列表
      events_list: [],
      // 是否展示slider列表(全屏)
      is_expand_video_list: false,
      // 事件类型菜单选项
      tab_list:[
        {title: i18n_t('footer_menu.all')},
        {title:i18n_t('match_result.goal')},
        {title:i18n_t('match_result.corner_kick')},
        {title:i18n_t('football_playing_way.penalty_cards')},
      ],
      // 当前播放视频信息
      current_event_video: {
        totalTime: 0,
        voice: true,
        status: 0,
      },
      // 用户是否控制开启声音
      is_user_voice: true,
      // 是否显示控件
      is_controller_show: true,
      // 当前是否为精彩回放视频
      is_playing_replay: false,
      // 当前选中事件类型
      tabIndex: 0,
      // 精彩回放视频url
      replay_url: '',
      // 精彩回放视频是否加载失败
      is_replay_load_error: false,
      //视频单页是否已加载     作用：防止白屏
      get_iframe_onload: false,
      iframe_rdm: new Date().getTime(),
      // 视频显示状态
      get_show_video: false,
      // 视频url信息
      get_video_url: MatchDetailCalss.video_url,
      // 是否全屏
      get_is_full_screen: false,
      ProjectName: project_name
    }
  },
  computed: {
      // 收藏菜单为6
      get_menu_type(){return MenuData.get_menu_type();},
      get_change_count(){return '';},
      get_is_user_no_handle(){return '';},
      // 详情页的数据
      get_detail_data(){
        return this.detail_data;
      },
      // 用户令牌信息
      get_user_token(){return '';},
      //视频单页是否已加载     作用：防止白屏
      // get_iframe_onload(){return '';},
      // 置顶按钮是否高亮
      get_zhiding(){return '';},
      // 点击视频或者是动画的时候玩法集是否固定
      get_tab_fix(){return '';},
      // 用户信息,用户金额,userId 需要监听变化
      get_user(){return '';},
      
      // 是否横屏
      get_is_hengping(){return '';},
      // 是否显示横屏全屏下投注弹窗
      get_bet_show(){return '';},
      //获取分析赛事状态（显示和不显示）
      get_analyze_show(){return '';},
      //获取当前主题颜色
      get_theme(){return '';},
      // 标清0 高清1
      get_hd_sd(){return '';},
      get_lang(){return '';},
      get_is_dp_video_full_screen(){return '';},
      get_show_back_icons(){
        if(this.ProjectName ==='app-h5'){
          return true
        }else{
          return this.show_icons
        }
      },

    replay_video_src() {
      const host_url = BUILDIN_CONFIG.DOMAIN_RESULT.live_domains[0] || lodash.get(this.get_user,'oss.live_h5')
      return `${host_url}/videoReplay.html?src=${this.replay_url}&lang=${this.get_lang}&volume=${this.is_user_voice ? 1 : 0}`

      // const host_url = 'http://localhost:4000/videoReplay.html?'
      // return `${host_url}src=${this.replay_url}&volume=${this.is_user_voice ? 1 : 0}`
    },
    // 展示lvs 图标
    show_lvs() {
      return this.get_detail_data.lvs != -1 && this.get_video_url.active != 'lvs' && ['string', 'number'].includes(typeof lodash.get(this.get_detail_data,'lss')) && ['zh','tw', 'hk'].includes(this.get_lang)
    },
    // 判断此商户是否属于乐天
    is_letian(){
      // letian = 乐天  oubao = 欧宝
      if(this.get_user.merchantCode){
        return this.get_user.merchantCode == 'letian'
      }
    },
    iframe_show(){
      if(this.get_video_url.active == 'animationUrl' || this.get_iframe_onload){
        return true
      }
      return false
    },
    // 动画下显示tips icon
    show_animation() {
      return this.get_detail_data.mvs > -1 && this.get_video_url.active == 'animationUrl'
    },
    // 媒体类型
    media_type() {
      const {lss} = this.get_detail_data
      const {active} = this.get_video_url

      // 专题视频，mp4等带有可控制进度条
      if (lss === 0 && active === 'lvs') {
        return 'progress_bar_video'
      } else {
        // 其他类别，可扩展
        return 'others'
      }
    },
    // 赛事id
    match_id() {
      return this.$route.params.mid || this.get_detail_data.mid
    },
    score(){
      return {
        home: this.$filters.format_total_score(this.detail_data, 0),
        away: this.$filters.format_total_score(this.detail_data, 1)
      }
    },
    eports_scoring() {
      //比分判断处理
      let scoring = false
      //如果是电竞，则进行比分判定处理
      if(this.get_menu_type == 3000) {
        const mmp_state = this.detail_data.mmp || 1
        if(mmp_state != (Number(this.score.home) + Number(this.score.away) +1)) {
          scoring = true
        }
      }
      return scoring
    },
    events_list_vertical() {
      const curr_tab_index = this.tabIndex
      let events_list
      if (curr_tab_index === 0) {
        events_list = lodash.cloneDeep(this.events_list)
      } else if (curr_tab_index === 1) {
        events_list = this.events_list.filter(item => item.eventCode === 'goal')
      } else if (curr_tab_index === 2) {
        events_list = this.events_list.filter(item => item.eventCode === 'corner')
      } else {
        events_list = this.events_list.filter(item => !['goal', 'corner'].includes(item.eventCode))
      }
      return events_list.reverse()
    },
    slider_events_list() {
      return lodash.cloneDeep(this.events_list_vertical).reverse()
    },
    // 精彩回放视频开关是否开启
    is_replay_switch() {
      const { configValue, eventSwitch } = lodash.get(this.get_user, 'merchantEventSwitchVO', {})
      return configValue == 1 && eventSwitch == 1
    },
    // slider列表长度是否小于屏幕横屏宽度
    is_slider_in_screen() {
      const full_screen_width = this.get_is_hengping ? innerWidth : innerHeight
      const font_size = (this.get_is_hengping ? innerHeight : innerWidth) * 100 / 375

      return this.slider_events_list.length * Math.ceil(1.44 * font_size) < full_screen_width
    },
    // 是否展示动画和视频按钮
    show_animation_and_video_status() {
      return this.show_icon_status != undefined ||this.show_icon_status != null ? this.show_icon_status : true
    }
  },
  props:[
    //视频说明是否展示
    'tips',
    // 随机数props传参是否显示视频对阵信息
    'is_show_text',
    // 是否展示返回按钮
    'show_go_back',
    'detail_data', //详情数据
    'show_icon_status', // 是否展示图标
    'fix_status', // 是否显示固钉
    'show_exit_btn', // 欧洲版显示旧的退出全屏
  ],
  watch: {
    get_is_full_screen(value) {
      this.$emit('change_fullscreen', value)
      if(this.ProjectName == 'ouzhou-h5'){
          document.querySelector("#top-header-oz").style.display=!this.get_is_full_screen ? "block" :"none"
          document.querySelector("#page-footer").style.display=!this.get_is_full_screen ? "block" :"none"
       }
     
    },
    iframe_src(value) {
      console.log(value, "value======");
    },
    // 监听用户是否长时间未操作
    get_is_user_no_handle(res){
      if(res && this.iframe_show && this.get_video_url.active == 'muUrl'){
        this.iframe_rdm = new Date().getTime()
        this.is_show_no_handle = true
        this.sendMessage2({cmd: 'destroy_video'})
      }
    },
    //监听屏幕改变
    get_is_hengping(is_hengping) {
      if (!is_hengping) {
        this.set_bet_show(false)
        this.set_analyze_show(false);
      }
      this.set_analyze_show(false);
      // 播放视频的时候横屏，自动触发全屏
      if (is_hengping && this.get_show_video && this.get_video_url.active == 'muUrl') {
        this.get_is_full_screen = true
        this.show_icons = true;
        this.clear_timer()
        if(this.is_need_timer) {
          this.timer1_ = setTimeout(() => {
          this.show_icons = false;
          this.sendMessage2({cmd: 'hide_icon'})
        }, 3000)
      }
      }
      // 视频播放时，切换横屏则清除投注项数据
      this.set_bet_list([]);

      // 横屏、竖屏切换时通知子iframe
      if (this.is_playing_replay) {
        if (!is_hengping) {
          const data = {
            cmd: 'full_screen_portrait',
            full_screen_portrait: 1
          }
          document.getElementById('replayIframe').contentWindow.postMessage(data,'*')

        } else {
          const data = {
            cmd: 'full_screen_landscape',
            full_screen_landscape: 1
          }
          document.getElementById('replayIframe').contentWindow.postMessage(data,'*')

        }
      }
      

    },
    // 监听随机数是否显示视频对阵信息
    is_show_text:{
      handler(new_){
        console.log(new_,"new_new_new_");
        // 当是动画当时候，详情外面点击默认就是展示返回按钮，关闭的话只能点击顶部返回
        if(this.get_video_url.active == 'animationUrl' && this.show_go_back){
          this.show_icons = true
          if(this.show_icons){
            this.sendMessage2({cmd: 'show_icon'})
          }else{
            this.sendMessage2({cmd: 'hide_icon'})
          }
          this.fade_icons();
          // this.set_bet_show(false);
          this.set_analyze_show(false);
          this.select_item = -1;
        }else{
          // 视频中的iframe是可以交互隐藏返回显示按钮的
          this.show_icons = !this.show_icons
          if(this.show_icons){
            this.sendMessage2({cmd: 'show_icon'})
          }else{
            this.sendMessage2({cmd: 'hide_icon'})
          }
          this.fade_icons();
          // this.set_bet_show(false);
          this.set_analyze_show(false);
          this.select_item = -1;
        }
      },
      // 不能立即监听
      // immediate:true
    },
    get_video_url(new_value, old_value) {
      if(new_value.active == 'muUrl'){
        if ([100,101,102,103].includes(+this.get_detail_data.csid)){
          this.iframe_src = new_value.media_src + this.dj_http_fix(new_value.media_src) +'controls=1'
        } else {
          this.iframe_src = new_value.media_src + '&controls=1'
        }
        //用戶第一次登录 显示 视频指引层
        let is_login_one = localStorage.getItem("is_first_login");
        if (this.get_show_video && is_login_one != "end") {
          this.first_login = true;
          if(this.timer5_) { clearTimeout(this.timer5_) }
          this.timer5_ = setTimeout(()=>{
            this.first_login = false;
          },5000)
          localStorage.setItem("is_first_login", "end");
        }
      }
      else{
        if (new_value.referUrl && new_value[new_value.active]) {
          if ([100,101,102,103].includes(+this.get_detail_data.csid)){
            this.iframe_src = new_value[new_value.active] + this.dj_http_fix(new_value[new_value.active]) +'controls=1'
          } else {
            this.iframe_src = new_value[new_value.active] + '&controls=1'
          }
          
        }
      }
    },
    nail(n, o){
      if(n == true){
        this.set_zhiding_info(true);
      }else{
        this.set_zhiding_info(false);
      }
    },
    tips(n, o) {
      if(n == true){
        this.set_video_zhiding(true);
      }else{
        this.set_video_zhiding(false);
      }
    },
    // 比分（比分类型|比分）变化
    'get_detail_data.msc'(new_value) {
      this.get_msc()
    },
    // 动画状态 -1 没有配置动画源 ，0 ： 已配置，但是不可用   1： 已配置，可用，播放中   2：已配置，可用，播放中
    'get_detail_data.mvs'(new_value) {
      if(new_value == -1 && this.get_video_url.active == 'animationUrl'){
        this.set_toast({
          txt: i18n_t("video.close_1"),
        });
        this.close_video()
      }
    },
    // 视频状态 -1 没有配置视频源 ，0 ： 已配置，但是不可用   1： 已配置，可用,暂未播放  2：已配置，可用，播放中
    'get_detail_data.mms'(new_value) {
      if(new_value != 2 && this.get_video_url.active == 'muUrl'){
        this.close_video()
        this.set_toast({
          txt: i18n_t("video.close_2"),
        });
      }
    },
    /*"vdo": { 只有视频的时候：视频的每次线路的状态
      "sid": "2446509", 视频流ID
      "sms": 2, 该视频流状态值,0,1,2
      "sts": "open" 该视频流出售状态：close 关闭 open 打开
    }*/
    'get_detail_data.vdo'(new_value) {
      if(new_value){
        for(let i = 0;i < new_value.length;i++){
          this.sendMessage2({cmd: 'update_sts', val: new_value[i]})
        }
      }
    },
    get_is_dp_video_full_screen(status) {
      if (!status) {
        clearTimeout(this.reload_iframe_timer)
        this.reload_iframe_timer = setTimeout(() => {
          // 部分iPhone safari退出全屏后，视频高度不正确，重载iframe更新
          this.set_iframe_onload(false)
          this.$nextTick(() => {
            this.set_iframe_onload(true)
          })
        }, 300)
      }
    }
  },
  beforeMount() {
    // 延时器
    this.timer1_ = null;
    this.timer2_ = null;
    this.timer3_ = null;
    this.timer4_ = null;
    this.timer5_ = null;
    this.timer6_ = null;
    this.mitt_obj = {};
    this.reload_create_fun();
    // iframe视频参数时间戳
    this.iframe_rdm = new Date().getTime()
    this.mitt_obj[MITT_TYPES.EMIT_IFRAME_VIDEO_VOLUME] = useMittOn(MITT_TYPES.EMIT_IFRAME_VIDEO_VOLUME, this.video_volume);
    this.mitt_obj[MITT_TYPES.EMIT_SET_IFRAME_ONLOAD] = useMittOn(MITT_TYPES.EMIT_SET_IFRAME_ONLOAD, this.set_iframe_onload);
    // 监听精彩回放iframe传来的消息
    window.addEventListener("message", this.handle_replay_message);

    this.replay_url = 'http://localhost:3000/replay.mp4'
  },
  unmounted() {
    this.get_video_url = {media_src:'',referUrl:''}
    window.removeEventListener("message", this.handleMessage);
    window.removeEventListener("message", this.handle_replay_message);
    this.set_tab_fix(false);
    this.set_is_dp_video_full_screen(false);
    this.clear_timer()
    if(this.get_video_url.active == 'muUrl') localStorage.setItem("is_first_login", "end");
    clearTimeout(this.timer1_)
    clearTimeout(this.timer2_)
    clearTimeout(this.timer3_)
    clearTimeout(this.timer4_)
    clearTimeout(this.timer5_);
    clearTimeout(this.timer6_)
    clearTimeout(this.media_type_change_timer)
    clearTimeout(this.reload_iframe_timer)
    clearInterval(this.get_replay_video_timer)

    for (const key in this.mitt_obj) {
      this.mitt_obj[key].off();
    }
    this.player && this.player.destroy()
  },
  methods: {compute_img_url,
      set_change_count(){},
      set_video_zhiding(){},
      set_toast(){},
      set_zhiding_info(){},
      set_is_close_video(){},
      set_tab_fix(){},
      set_info_show(){},
      set_hd_sd_show(){},
      set_hd_sd(){},
      set_is_in_play(){},
      set_bet_show(){},
      set_analyze_show(){},
      set_bet_obj(){},
      set_bet_list(){},
      set_is_hengping(){},
      set_is_dp_video_full_screen(){},
      fix_top() {

      },
      // 设置音量
      change_volumn(volume) {
        console.log(volume,'volume');
        const data = {
          cmd: 'volume_video',
          volume
        }
        this.voice = volume > 0;
        this.current_event_video.voice = volume;
        
        video.send_message(data)
      },
      // 设置iframe标签是否开启
    set_iframe_onload(param) {
     
      this.get_iframe_onload = param
    },
     /**
     * @description: 给iframe发送全局视频类型变化事件
     * @param {int} type 1:高清flv, 2:流畅m3u8
     * @return {*}
     */
    switch_video_url(type = 1) {
      video.send_message({
        cmd:'switch_type',
        val:type
      })
    },
    /**
     * 电竞赛事url加参数前缀检测函数
    */
    dj_http_fix(url){
      let res = '&';
      let str = url;
      str = str.replace('?http','');
      console.log(str);
      if(str.indexOf('?')==-1){
          res='?';
      } else {
          res='&';
      }
      return res;
    },
    /**
     * 点击遮罩层，做取反操作，显示或隐藏遮罩层
    */
   click_mask(){
    console.log('点击遮罩层，做取反操作', this.show_icons);
    this.show_icons = !this.show_icons
    this.$emit('change_go_back',this.show_icons)
    if(this.show_icons){
      this.sendMessage2({cmd: 'show_icon'})
    }else{
      this.sendMessage2({cmd: 'hide_icon'})
    }
    this.fade_icons();
    this.set_bet_show(false);
    this.set_analyze_show(false);
    this.select_item = -1;
   },

    /**
     *@description 监听页面可见性，当页面不可见时关闭视频声音
     */
    visibilitychange_handle(){
      if (this.$route.name != 'category') return;
      if (document.visibilityState == 'hidden') {
        this.iframe_src = ''
      }
      if (document.visibilityState == 'visible') {
        this.reload_create_fun()
      }
    },
    /**
     * @description 切换精彩回放视频
     * @param item 目标视频信息
     * @param index 目标视频索引
     */
    change_event_video({item, index}) {
      this.is_replay_load_error = false
      this.iframe_rdm = Date.now()
      this.is_user_voice = this.current_event_video.voice
      this.replay_url = item.fragmentVideo
      // this.replay_url = 'http://localhost:3000/replay.mp4'

      this.check_replay_url(this.replay_video_src)
      // 滚动目标到屏幕显示区域
      this.$nextTick(()=>{
        // this.$tab_move(index, this.$refs.slider_video.$refs.slider_x, this.$refs.slider_video.$refs.item_wrapper, true)
      })
      
      
      this.is_playing_replay = true
      // 静音当前播放媒体
      this.video_volume({volume:0})
    },
    handle_replay_video_loaded(e) {
      if (this.get_is_hengping) {
        const data = {
          cmd: 'full_screen_landscape',
          full_screen_landscape: 1
        }

        document.getElementById('replayIframe').contentWindow.postMessage(data,'*')

      }
    },
    check_replay_url(url) {
      api_common.get_full_url(url)
          .then((v) => {
            console.log('精彩回放视频加载成功...')
            this.is_replay_load_error = false
          })
          .catch(err => {
            console.error('精彩回放视频加载失败...')
            this.is_replay_load_error = true
          })
    },
    get_video_list({tab, index}) {
      if(this.tabIndex === index) return
      console.log(tab, '---tab')
      this.tabIndex = index
      this.update_variable_event_n()
    },
   // 控制info弹窗说明
    change_info(){
      this.set_info_show(true)
      this.set_analyze_show(false);
      this.select_item = 1;
      this.is_need_timer = true;
      useMittEmit(MITT_TYPES.EMIT_VIDEO_DESCRIPTION_SHOW, true)
    },
    // 弹出高清和标清的页面
    show_HD_SD() {
      this.set_info_show(true)
      this.set_hd_sd_show(true)
    },
    change_bet() {
      this.set_analyze_show(false);
      this.set_bet_show(true)
      this.select_item = 2;
      this.is_need_timer = true;
    },
    change_analyze() {
      if(![1,2].includes(this.get_detail_data.csid*1)) return;
      this.clear_timer();
      if(this.select_item == 3) {
        this.set_analyze_show(false);
        this.select_item = -1;
      }else{
        this.select_item = 3;
        this.set_analyze_show(true);
      }
      this.set_info_show(false)
      this.show_icons = true;
      this.is_need_timer = false;
    },
    get_msc() {
      !lodash.isEmpty(this.get_detail_data) && this.get_detail_data.msc.map(item => {
        if (item.indexOf('S1|') > -1) {
          this.title.msc = item.split('|')[1].split(':').join(' v ')
        }
      })
    },
    /**
     * @Description 设置全屏
     */
    set_full_screen(){
      console.log(document.querySelector("#top-header-oz"));
    
      if(this.get_is_full_screen){
        this.set_is_hengping(false)
        this.exit_browser_full_screen()
        if(lodash.get(window,'screen.orientation.unlock')){
           window.screen.orientation.unlock()
        }
        if (this.get_video_url.active === 'lvs') {
          this.sendMessage2({
            cmd: 'record_play_info',
            val: {
              record_play_time: true
            }
          })
        }

        clearTimeout(this.reload_iframe_timer)
        this.reload_iframe_timer = setTimeout(() => {
          // 部分iPhone safari退出全屏后，视频高度不正确，重载iframe更新
          this.set_iframe_onload(false)
          this.$nextTick(() => {
            this.set_iframe_onload(true)
          })
        }, 300)
      }else{
        this.get_replay_video()
        this.set_is_hengping(true)
        this.browser_full_screen()
        if(lodash.get(window,'screen.orientation.lock')){
          window.screen.orientation.lock('landscape')
        }
      }
      this.get_is_full_screen = !this.get_is_full_screen
    },
    // （精彩/收起）回放按钮点击处理
    toggle_slider_btn() {
      this.update_variable_event_n()
      this.is_expand_video_list = !this.is_expand_video_list
    },
    // 更新event_n变量值
    update_variable_event_n() {
      if (this.is_slider_in_screen) {
        // 若橫屏下，slider列表长度小于屏幕横屏宽度，则设置动态属性--event_n，用于slider列表居中计算
        document.documentElement.style.setProperty('--event_n', this.slider_events_list.length)
      }
    },
    /**
     * @Description 设置视频声音
     * @param {undefined} undefined
     */
    set_video_voice(){
      console.log(document.getElementById('replayIframe').contentWindow,2222);
      // this.player.video.muted = this.current_event_video.voice;
      this.current_event_video.voice = !this.current_event_video.voice
      const data = {
        cmd: 'replay_volume_video',
        volume: this.current_event_video.voice ? 1 : 0
      }
      document.getElementById('replayIframe').contentWindow.postMessage(data,'*')
    },
    exit_full_screen() {
      this.player && this.player.destroy()
      this.player = null
      this.is_playing_replay = false
      this.is_expand_video_list = false
      this.is_replay_load_error = false
    },
    /**
     * @Description 浏览器全屏
     * @param {undefined} undefined
     */
    browser_full_screen(){
      let video_dm = document.documentElement;
      let rfs = video_dm.requestFullscreen || video_dm.webkitRequestFullScreen || video_dm.mozRequestFullScreen || video_dm.msRequestFullScreen;
      if (rfs) {
        rfs.call(video_dm);
      }
      // OrientationSubscrbe.instance.change_status(true);
    },
    /**
     * @Description 退出浏览器全屏
     * @param {undefined} undefined
     */
    exit_browser_full_screen(){
      let video_dm = document;
      let cfs = video_dm.cancelFullscreen || video_dm.webkitCancelFullScreen || video_dm.mozCancelFullScreen || video_dm.exitFullscreen;
      if(cfs) {
        cfs.call(video_dm);
      }
      // OrientationSubscrbe.instance.change_status(false);

    },
    // 接收精彩回放iframe消息
    handle_replay_message(e) {
      const data = e.data;

      switch (data.cmd) {
        case 'icon':
          this.is_controller_show = data.val
          break;
      }
    },
    // 接受iframe消息
    handleMessage(e) {
      let status_text = ['loading','success','error']
      var data = e.data;
      
      switch (data.cmd) {
        case 'icon':
          //处理业务逻辑
          this.show_icons = !this.show_icons;
          if(!this.show_icons){
            this.sendMessage2({cmd: 'hide_icon'})
          }else{
            this.sendMessage2({cmd: 'show_icon'})
          }
          this.fade_icons();

          if (this.get_bet_show) {
            this.set_bet_show(false)
          }
          if (this.get_analyze_show) {
            this.set_analyze_show(false)
          }
          break;
        case 'double_click':
          // 如果是 视频的情况下，双击全屏事件
          if(this.get_video_url.active == 'muUrl'){
            this.set_full_screen()
          }
          break;
        case 'video_quality':
          // 处理业务逻辑
          this.video_line_list = data.val
          break;
        case 'video_line_index':
          // 处理业务逻辑
          // this.voice = true
          this.video_line_index = data.val
          break;
        case 'onload':
          // 处理业务逻辑,代表 显示video 单页 视频了
          this.set_iframe_onload(true);
          break;
        case 'error_message':
          console.error(data);
          break;
      }

      // 视频加载错误，则隐藏相应交互按钮
      if (data.cmd == 'error_message' || (data.testmsg && data.data.includes('404'))) {
        this.load_error = true
      } else if (data.testmsg && data.data === '可以播放') {
        this.load_error = false
      }

      if(data.video_iframe_msg && status_text.includes(data.msg)){
        this.video_iframe_status = data.msg
      }
    },
    sendMessage(data) { // 父向子传参方式二
      if (this.mapFrame.attachEvent) {  //兼容浏览器判断
        this.mapFrame.attachEvent("onload", function () {
          this.sendMessage2(data)
        })
      } else {
        this.mapFrame.onload = function () {
          this.sendMessage2(data)
        }
      }
    },
    // 向子iframe发送message
    sendMessage2(data){
      console.log(document.getElementById('video-iframe'),'iframe');
      if(document.getElementById('video-iframe')){
        // let iframeWin = this.mapFrame.contentWindow;
        // iframeWin && iframeWin.postMessage(data, '*');
        console.log(data,'data');
        document.getElementById('video-iframe').contentWindow.postMessage(data,'*')
      }
    },
    /**
    * @Description:设置视频音量
    * @return {undefined} undefined
    */
    video_volume(obj){
      this.sendMessage2({cmd:'volume_video',volume:lodash.get(obj,'volume',0)});
    },
    toggle_click(num,val) {
      // 开启/关闭声音
      if (num == 2) {
        console.log(2222,this.voice);
        this.voice = !this.voice;
        this.change_volumn(this.voice ?1:0)
        // this.sendMessage2({cmd: 'volume_video', val:this.voice ?1:0})
      }
      if (num == 4) {
        if (this.get_video_url.active == 'lvs') {
          this.sendMessage2({
            cmd: 'record_play_info',
            val: {
              record_play_time: true
            }
          })
        }

        clearTimeout(this.media_type_change_timer)
        this.media_type_change_timer = setTimeout(() => {
          this.set_change_count(this.get_change_count + 1);
          this.icon_click(val);
          // 发送进入动画和视频的埋点
    	    into_video_anima_event(val,{match:this.get_detail_data,source:'details'});
        }, 50)
      }
    },
    // 全屏点击
    bg_click(e) {
      // 点击隐藏投注弹框
      if (this.get_is_hengping && this.get_bet_show) {
        this.set_bet_show(false)
      }
      if (this.get_is_hengping && this.get_analyze_show) {
        this.set_analyze_show(false)
        this.select_item = -1;
        this.is_need_timer = true;
      }
    },
    // 全屏手势滑动
    bg_touchmove({ direction,isFinal }) {
      this.sendMessage2({cmd: 'show_icon'})
      if(!isFinal && [1,2].includes(this.get_detail_data.csid*1) && this.get_is_full_screen && this.get_video_url.active == 'muUrl' && this.get_is_hengping) {
        if('left' == direction) {
            !this.get_bet_show && this.set_analyze_show(true)
            this.show_icons = true;
            this.select_item = 3;
            this.is_need_timer = false;
        }else if('right' == direction) {
            this.set_analyze_show(false)
            this.show_icons = false;
            this.select_item = -1;
            this.is_need_timer = true;
        }
      }
    },
    switch_video(index){
      if(index == this.video_line_index){
        return
      }
      this.sendMessage2({cmd: 'switch', val:index})
    },
    close_video() {
      console.log(2222);
      this.get_is_full_screen = false
      this.exit_browser_full_screen();
      this.$emit('change_fullscreen', false)
      // iPhone Safari 不兼容screen.orientation
      if(lodash.get(window,'screen.orientation.unlock')){
        window.screen.orientation.unlock()
      }
      this.set_tab_fix(false);
      this.set_is_close_video(Math.random());
      useMittEmit(MITT_TYPES.EMIT_SET_SHOW_VIDEO, false)
      this.set_zhiding_info(false);
      this.set_is_in_play('');
    },
    fade_icons(){
      if (this.is_letian) return;  //乐天商户不需要6秒消失
      this.clear_timer()
        if(this.is_need_timer) {
          this.timer1_ = setTimeout(() => {
          this.show_icons = false;
          this.sendMessage2({cmd: 'hide_icon'})
        }, 6000)
      }
    },
    clear_timer(){
      clearTimeout(this.timer1_);
    },
    // 如果是电竞，点击显示返回按钮
    show_DJ_back() {
      if(this.get_menu_type == 3000) {
        this.show_icons = true;
        this.fade_icons();
      }
    },
    reload_video_methods( ){
      this.rotate=!this.rotate;
      this.timer2_ = setTimeout( ()=>{
        this.rotate = false;
        this.icon_click();
      }, 1000)
    },
    icon_click(arg){
      let which = arg ||this.get_video_url.active;
      switch (which) {
       case 'lvs':
         this.icon_click_lvs()
         break;
         case 'muUrl':
         this.icon_click_muUrl()
         break;
         case 'animationUrl':
         this.icon_click_animationUrl()
         break;
       default:
         break;
      }
    },
      /**
       * 点击直播
       * @param {number} hd_sd  0标清, 1 高清
       */
    icon_click_lvs(hd_sd) {
      let params = {
        mid: this.match_id,
        device: 'H5'
      };
      api_common.getliveVideoUrl(params).then((res) => {
        let {code, data} = res
        if (code == 200) {
        // "chatRoomId": "1001",//聊天室ID
        // "crs": 1,  //聊天室开关 0 ：关闭  1：开启
        // hdUrl : "rtmp://test-pull-live.wafqa2.com/live/123456"  //直播视频高清播放地址
        // liveState : 1
        // programPath : ""  //赛前节目播放地址
        // referUrl : "http://testliveh5.sportxxx13ky.com"//域名
        // sdUrl : "rtmp://test-pull-live.wafqa2.com/live/654321"  //直播视频标清地址
        // serverTime : "1663733773446"
          // 如果是数字，代表点击切换了
          if(typeof hd_sd == 'number'){
            // 设置高清或者标清
            this.set_hd_sd(hd_sd)
          }
          let media_src = video.get_video_url_h5(res, params.mid, 3, hd_sd = this.get_hd_sd);
          let data = {
            media_src,
            active: 'lvs',
          };
          this.get_video_url = data;
          this.timer4_ = setTimeout(() => {
            this.clear_timer(); // 清除相关计时器操作;
            this.reload_create_fun();
          }, 500)
          this.get_show_video = true;
        }
      })
    },
    icon_click_muUrl(){
      //   let check =  this.get_detail_data.mms >=2 || this.get_detail_data.mvs > -1
      // if(!check){return false }
      let params = {
        mid: this.match_id,
        type:   'Video'
      };
      this.is_show_no_handle = false
      api_common.getMatchUserIsLogin().then(res => { 
        if(res && res.code == 200 && res.data.isLogin){
          let referUrl = BUILDIN_CONFIG.DOMAIN_RESULT.live_domains[0];
          let media_src
          if(referUrl) {
            media_src = video.get_video_url_h5({data:{referUrl}},params.mid,1);
            let data = {
              media_src,
              active:'muUrl',
            };
            MatchDetailCalss.set_video_url(data);
            this.get_video_url = data
            this.timer3_ = setTimeout(()=>{
              this.clear_timer(); // 清除相关计时器操作;
              this.reload_create_fun();
            }, 500)
            this.get_show_video = true;
          } else {
            let param = {}
            this.send_gcuuid = uid();
            param.gcuuid = this.send_gcuuid;
            api_common.getVideoReferurl(param).then(res => {
              if(this.send_gcuuid != res.gcuuid) return;
              if(res.code == 200){
                let media_src = video.get_video_url_h5(res,params.mid,1)
                let data = {
                  media_src,
                  active:'muUrl',
                };
                this.get_video_url = data;
                this.timer4_ = setTimeout(()=>{
                  this.clear_timer(); // 清除相关计时器操作;
                  this.reload_create_fun();
                }, 500)
                this.get_show_video = true;
              }
            });
          };
        }else{
          let data = {};
          data.active = 'muUrl';
          this.get_video_url = data;
          this.get_show_video = true;
          this.set_change_count(this.get_change_count - 1);
        }
      });
    },
    icon_click_animationUrl(){
      // let check =   this.get_detail_data.mms >=2 || this.get_detail_data.mvs > -1
      // if(!check){return false }
       let params = {
         mid: this.match_id,
         type: 'Animation'
       };
       this.send_gcuuid = uid();
       params.gcuuid = this.send_gcuuid;
       this.is_show_no_handle = false
       api_common.videoAnimationUrl(params).then((res) => {
        const { data } = res
        if(this.send_gcuuid != res.gcuuid) return;
          if(!data.animationUrl){
            this.set_toast({
              txt: i18n_t("match_info.m_anima_not_start"),
            });
            return
          }
          let animationUrl = ''
          //足篮棒网使用3.0动画  其他使用2.0
          if([1,2,3,5].includes(this.get_detail_data.csid*1)){
            let animation3Url = data.animation3Url || []
            animation3Url.forEach( item =>{
              if(item.styleName.indexOf('day') >= 0){
                animationUrl = item.path
              }
            })
          }
          animationUrl = animationUrl || data.animationUrl
          data.animationUrl = animationUrl.replace(/https?:/, "") // 动画
          data.referUrl = data.referUrl && (data.referUrl.replace(/http:|https:/,'')) // 视频
          data.active = 'animationUrl';
          data.referUrl = `${location.protocol}${data.referUrl}`;
          let CTime = this.get_detail_data.mgt;
          let STime = data.serverTime;
          MatchDetailCalss.set_playback_video_list(data);
          this.get_video_url = data
          this.timer6_ = setTimeout(()=>{
            this.clear_timer(); // 清除相关计时器操作;
            this.reload_create_fun()
          }, 500)
        })
    },
    icon_click_sdd( arg ){
      let which = arg ||this.get_video_url.active;
      let params = {
        mid: this.match_id,
        type: val == 'muUrl' ? 'Video' : 'Animation'
      };
      this.is_show_no_handle = false
      if(val == 'muUrl'){

      }else{

      }
    },
    reload_create_fun(){
      if([ "muUrl", "lvs"].includes(this.get_video_url.active) ){
        if ([100,101,102,103].includes(+this.get_detail_data.csid)){
          this.iframe_src = this.get_video_url.media_src + this.dj_http_fix(this.get_video_url.media_src) +'controls=1'
        } else {
          this.iframe_src = this.get_video_url.media_src + '&controls=1';
        }
      } else {
        if(( this.get_video_url.active == "muUrl" && this.get_video_url.referUrl == '') || ( this.get_video_url.active == "animationUrl" && this.get_video_url.animationUrl == '' )){
          this.video_iframe_status = 'error';
        }
        this.iframe_src = this.get_video_url.animationUrl
      }
      this.fade_icons();
      window.addEventListener("message", this.handleMessage);
      this.title.mhn = this.get_detail_data.mhn;
      this.title.man = this.get_detail_data.man;
      this.get_msc()
    },
    get_replay_video() {
      const { configValue, eventSwitch } = lodash.get(this.get_user, 'merchantEventSwitchVO', {})
      if (configValue == 1 && eventSwitch == 1 && lodash.get(this.get_detail_data, 'csid') == '1') {
        this.get_football_replay(0)
        this.$load_player_js()
        clearInterval(this.get_replay_video_timer)
        this.get_replay_video_timer = setInterval(() => {
          this.get_football_replay(0)
        }, 60 * 1000)
      }
    },
    /**
     * 初始化视频播放器
     */
    init_video_player(target){
      console.log(22222);
      let video_wrap_dom = document.querySelector('.video-wrapper')

      this.player = new DPlayer({
        container: video_wrap_dom,
        live: false,
        autoplay: true,
        video:{
          url: target.fragmentVideo,
          type: 'auto',
          autoplay: true,
        },
        // chromecast: true,
      });

      this.current_event_video.status = false
      // 监听视频可以播放
      this.player.on('canplaythrough', () => {
        if(!this.player) return;
        this.player.video.setAttribute('autoplay','autoplay');
        if (this.current_event_video.voice) {
          this.player.volume(0.5, true, false)
        }

      });
      // 播放
      this.player.on('play',() => {
        this.current_event_video.status = 0;
      });
      // 播放中
      this.player.on('playing',() => {
        this.current_event_video.status = 1;
      });
      // 视频结束
      this.player.on('ended',() => {
        this.current_event_video.status = 2;
      });
      // 视频中断
      this.player.on('abort',() => {
        this.current_event_video.status = 2;
      });
      // 开始播放时,设置视频时长
      this.player.on('seeking',(res)=>{
        if(this.player && isFinite(this.player.video.duration))
        {
          this.current_event_video.totalTime=this.player.video.duration;
        }
      });

      video_wrap_dom = null
    },
    /**
     * 获取精彩回放事件
     * @param {String} event_code 事件code
     */
    get_football_replay(event_code) {
      const params = {
        mid: lodash.get(this.get_detail_data, 'mid'),
        device: 'H5',
        eventCode: event_code
      }
      api_result.get_replay_football(params)
          .then(res => {
            if (res.code == 200 && lodash.get(res.data, 'eventList.length')) {
              this.events_list = res.data.eventList
              MatchDetailCalss.set_playback_video_list(res.data.eventList)
            }
          })
          .catch(err => {
            console.error(err)
          })
          .finally(() => {
            const demo_data = {
              "eventList": [
                {
                  "eventCode":"corner",
                  "eventId":"43550886",
                  "eventTime":"1682819730000",
                  "extraInfo":"",
                  "firstNum":1,
                  "fragmentCode":"942249f612829581e1bcb9111efccb28",
                  "fragmentId":"58548",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/942249f612829581e1bcb9111efccb28.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/942249f612829581e1bcb9111efccb28.mp4",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":1199,
                  "t1":0,
                  "t2":1
                },
                {
                  "eventCode":"corner",
                  "eventId":"43550918",
                  "eventTime":"1682819782000",
                  "extraInfo":"",
                  "firstNum":2,
                  "fragmentCode":"66dac8d3b06b7d70d27398a5014d9e55",
                  "fragmentId":"58549",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/66dac8d3b06b7d70d27398a5014d9e55.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/66dac8d3b06b7d70d27398a5014d9e55.mp4",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":1245,
                  "t1":0,
                  "t2":2
                },
                {
                  "eventCode":"corner",
                  "eventId":"43551093",
                  "eventTime":"1682820282000",
                  "extraInfo":"",
                  "firstNum":1,
                  "fragmentCode":"7945d61a1a570ecc2b55751cc1ca0d40",
                  "fragmentId":"58567",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/7945d61a1a570ecc2b55751cc1ca0d40.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/7945d61a1a570ecc2b55751cc1ca0d40.mp4",
                  "homeAway":"麦德林独立",
                  "mid":"3466323",
                  "secondsFromStart":1753,
                  "t1":1,
                  "t2":2
                },
                {
                  "eventCode":"corner",
                  "eventId":"43551157",
                  "eventTime":"1682820478000",
                  "extraInfo":"",
                  "firstNum":3,
                  "fragmentCode":"",
                  "fragmentId":"",
                  "fragmentPic":"",
                  "fragmentVideo":"",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":1952,
                  "t1":1,
                  "t2":3
                },
                {
                  "eventCode":"corner",
                  "eventId":"43551156",
                  "eventTime":"1682820478000",
                  "extraInfo":"",
                  "firstNum":4,
                  "fragmentCode":"081b1b91112f95d53dfe2cd6c1e005a7",
                  "fragmentId":"58573",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/081b1b91112f95d53dfe2cd6c1e005a7.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/081b1b91112f95d53dfe2cd6c1e005a7.mp4",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":1952,
                  "t1":1,
                  "t2":4
                },
                {
                  "eventCode":"goal",
                  "eventId":"43551437",
                  "eventTime":"1682821263000",
                  "extraInfo":"",
                  "firstNum":2,
                  "fragmentCode":"b62ad7c12b46e480c15af0ac86721b0b",
                  "fragmentId":"58612",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/b62ad7c12b46e480c15af0ac86721b0b.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/b62ad7c12b46e480c15af0ac86721b0b.mp4",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":2700,
                  "t1":0,
                  "t2":2
                },
                {
                  "eventCode":"corner",
                  "eventId":"43551436",
                  "eventTime":"1682821263000",
                  "extraInfo":"",
                  "firstNum":5,
                  "fragmentCode":"3732fece910f16c1c8490cce7e3f767a",
                  "fragmentId":"58613",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/3732fece910f16c1c8490cce7e3f767a.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/3732fece910f16c1c8490cce7e3f767a.mp4",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":2700,
                  "t1":1,
                  "t2":5
                },
                {
                  "eventCode":"corner",
                  "eventId":"43551841",
                  "eventTime":"1682822610000",
                  "extraInfo":"",
                  "firstNum":7,
                  "fragmentCode":"198373690481ab43024ea7da56c45612",
                  "fragmentId":"58679",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/198373690481ab43024ea7da56c45612.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/198373690481ab43024ea7da56c45612.mp4",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":2831,
                  "t1":1,
                  "t2":7
                },
                {
                  "eventCode":"corner",
                  "eventId":"43551847",
                  "eventTime":"1682822658000",
                  "extraInfo":"",
                  "firstNum":7,
                  "fragmentCode":"4e62820e5c0016769bf77c6c6b6ddee2",
                  "fragmentId":"58683",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/4e62820e5c0016769bf77c6c6b6ddee2.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/4e62820e5c0016769bf77c6c6b6ddee2.mp4",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":2901,
                  "t1":1,
                  "t2":7
                },
                {
                  "eventCode":"corner",
                  "eventId":"43551871",
                  "eventTime":"1682822794000",
                  "extraInfo":"",
                  "firstNum":8,
                  "fragmentCode":"",
                  "fragmentId":"",
                  "fragmentPic":"",
                  "fragmentVideo":"",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":3036,
                  "t1":1,
                  "t2":8
                },
                {
                  "eventCode":"goal",
                  "eventId":"43551968",
                  "eventTime":"1682823281000",
                  "extraInfo":"",
                  "firstNum":3,
                  "fragmentCode":"0bca7f66b5df00133790d32ec0bd17f3",
                  "fragmentId":"58700",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/0bca7f66b5df00133790d32ec0bd17f3.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/0bca7f66b5df00133790d32ec0bd17f3.mp4",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":3528,
                  "t1":0,
                  "t2":3
                },
                {
                  "eventCode":"yellow_card",
                  "eventId":"43552016",
                  "eventTime":"1682823501000",
                  "extraInfo":"",
                  "firstNum":2,
                  "fragmentCode":"a5a6d2d6ad51763c22d71776622db210",
                  "fragmentId":"58707",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/a5a6d2d6ad51763c22d71776622db210.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/a5a6d2d6ad51763c22d71776622db210.mp4",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":3689,
                  "t1":0,
                  "t2":2
                },
                {
                  "eventCode":"yellow_card",
                  "eventId":"43552001",
                  "eventTime":"1682823455000",
                  "extraInfo":"",
                  "firstNum":2,
                  "fragmentCode":"fd98bab84b0648ce58da68b8bb037a16",
                  "fragmentId":"58705",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/fd98bab84b0648ce58da68b8bb037a16.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/fd98bab84b0648ce58da68b8bb037a16.mp4",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":3715,
                  "t1":0,
                  "t2":2
                },
                {
                  "eventCode":"goal",
                  "eventId":"43552027",
                  "eventTime":"1682823600000",
                  "extraInfo":"",
                  "firstNum":1,
                  "fragmentCode":"e10e3d611814e43fbbfc069ff9459f8c",
                  "fragmentId":"58710",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/e10e3d611814e43fbbfc069ff9459f8c.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/e10e3d611814e43fbbfc069ff9459f8c.mp4",
                  "homeAway":"麦德林独立",
                  "mid":"3466323",
                  "secondsFromStart":3847,
                  "t1":1,
                  "t2":3
                },
                {
                  "eventCode":"yellow_card",
                  "eventId":"43552129",
                  "eventTime":"1682824247000",
                  "extraInfo":"",
                  "firstNum":1,
                  "fragmentCode":"",
                  "fragmentId":"",
                  "fragmentPic":"",
                  "fragmentVideo":"",
                  "homeAway":"麦德林独立",
                  "mid":"3466323",
                  "secondsFromStart":4500,
                  "t1":1,
                  "t2":2
                },
                {
                  "eventCode":"yellow_card",
                  "eventId":"43552182",
                  "eventTime":"1682824677000",
                  "extraInfo":"",
                  "firstNum":3,
                  "fragmentCode":"a9a18722a620bafdf27cc1f2b5ffcf5f",
                  "fragmentId":"58737",
                  "fragmentPic":"http://test-playback.d965r6f.com/pic/a9a18722a620bafdf27cc1f2b5ffcf5f.jpg",
                  "fragmentVideo":"http://test-playback.d965r6f.com/video/a9a18722a620bafdf27cc1f2b5ffcf5f.mp4",
                  "homeAway":"马竞麦德林",
                  "mid":"3466323",
                  "secondsFromStart":4926,
                  "t1":1,
                  "t2":3
                },
                {
                  "eventCode":"corner",
                  "eventId":"43552239",
                  "eventTime":"1682825076000",
                  "extraInfo":"",
                  "firstNum":2,
                  "fragmentCode":"",
                  "fragmentId":"",
                  "fragmentPic":"",
                  "fragmentVideo":"",
                  "homeAway":"麦德林独立",
                  "mid":"3466323",
                  "secondsFromStart":5308,
                  "t1":2,
                  "t2":8
                }
              ],
              "playBackUrl": "http://test-playback.d965r6f.com",
              "referUrl": "http://testliveh5.sportxxx13ky.com",//域名验签
              "serverTime": "1682485323358"
            }
            // this.events_list = demo_data.eventList
          })
    },
    event_name(type) {
      let event_name
      switch (type) {
        case 'goal': event_name = i18n_t('highlights.type.goal'); break;  // 进球
        case 'corner': event_name = i18n_t('highlights.type.corner'); break;  // 角球
        case "red_card": event_name = i18n_t('highlights.type.card_red'); break;  // 红牌
        case "yellow_card": event_name = i18n_t('highlights.type.card_yellow'); break;  // 黄牌
        case "yellow_red_card": event_name = i18n_t('highlights.type.card_yellow_red'); break;  // 黄红牌
        default: event_name = ''; break;
      }
      return event_name;
    },
    click_video_screen(e) {
      this.is_controller_show = !this.$refs.video_wrapper.classList.contains('dplayer-hide-controller')
    },
    listener(value) {
      console.log(value, "如果切换横竖屏，会触发此函数");
      // 如果切换横竖屏，会触发此函数
     
      this.set_full_screen();

    }
  },
  mounted() {
    OrientationSubscrbe.instance.change_status(true);
    OrientationSubscrbe.instance.add_notify(this.listener);
    this.set_zhiding_info( false )
    this.set_video_zhiding( false )
    this.mitt_obj[MITT_TYPES.EMIT_VIDEO_SWITCHING] = useMittOn(MITT_TYPES.EMIT_VIDEO_SWITCHING,this.icon_click_lvs);
    this.mapFrame = this.$refs.iframe
  },
  destroyed() {
    OrientationSubscrbe.instance.change_status(false);
    OrientationSubscrbe.instance.destory_notify();

  },
}
</script>



<style lang="scss" scoped>
.player {
  background: var(--q-color-com-img-bg-130) no-repeat center content-box content-box;
  padding-bottom: 0.02rem;
  &.across-height {
    height: 3.75rem;
  }
  > div {
    position: relative;
  }

  .bg {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 0.44rem;
    color: var(--q-color-com-fs-color-8);
    z-index: 200;
    // box-shadow: 0 0.38rem 0.1rem rgba(66, 66, 66, 0.8) inset;
    // position: absolute;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 30px;
    // z-index: 2;
  }
  .opacity-header {
    opacity: 0.5;  
  }
  .title {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 0.44rem;
    color: var(--q-gb-t-c-14);
    z-index: 200;
    box-shadow: var(--q-gb-b-s-18);

    .go-back-btn-wrap {
      line-height: 0.44rem;
      display: flex;
      align-items: center;

      .icon_arrow_down.go {
        display: block;
        transform: rotateZ(90deg);
        font-size: 0.12rem;

        &::before {
          color: var(--q-color-com-fs-color-8);
        }
      }
    }

    .video_back {
      display: inline-block;
      width: 0.12rem;
      height: 0.2rem;
      background-image: url($SCSSPROJECTPATH + "/image/common/go_back.svg");
      background-size: 100% 100%;
    }

    > div {
      .title-text-style {
        text-align: center;
        line-height: 0.44rem;
        font-size: 0.16rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .icons {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 50px;
    z-index: 51;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    padding: 0 18px;
  }

  .icons2 {
    position: absolute;
    right: 6%;
    top: calc(50% - 0.55rem);
    z-index: 100;
    .img-wrap {
      padding: 0.095rem 0.16rem;
    }
  }
  // 声音按钮
  .voice-btn {
     position: absolute;
     left: 10px;
     bottom: 4px;
     width: 60px;
     height: 36px;
     display: flex;
     justify-content: center;
     align-items: center;
     z-index: 100;
  }

  .actions {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    bottom: 2px;
    z-index:9991;
  }
  .ml-8 {
    margin-left: 8px;
  }
  .full-screen-btn {
    // position: absolute;
    // right: 6%;
    // bottom: .10rem;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    // padding: 0.095rem 0.2rem;
  }
  .description-popup{
    // position: absolute;
    // right: .53rem;
    // bottom: .02rem;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    // padding: 0.095rem 0.2rem;
    .font_color{
      color: var(--q-color-com-fs-color-8);
      position: relative;
      top: -.02rem;
      margin-right: .15rem;
    }
  }

  // 长时间无操作
  .no-handle{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .text{
      max-width: 90%;
      height: 0.4rem;
      color: var(--q-color-com-fs-color-30);
    }
    .collect-icon{
      width: 32px;
      height: 32px;
    }
  }

  .iframe-wrap {
    background-color: var(--q-gb-bg-c-2);

    &.full-screen {
      position: fixed;
      height: 100% !important;
      z-index: 9999;
      left: 0;
      .load-error-mask {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: absolute;
        width: 100%;
        height: 100%;
        color: var(--q-color-com-fs-color-8);
        background: var(--q-color-com-bg-color-5);
      }
    }

    .show_DJ_back_css {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0.5rem;
    }

    .floating-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background: var(--q-color-com-bg-color-36);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      img {
        width: 0.26rem;
        height: 0.26rem;
      }

      > div {
        width: 2rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: var(--q-color-com-fs-color-8);
        position: relative;
        left: 0.2rem;

        &:first-child {
          margin-bottom: 0.28rem;
        }

        span {
          font-family: PingFangSC-Medium;
          font-size: 0.16rem;
          margin: 0 0.15rem 0 0.08rem;
        }

        p {
          font-family: PingFangSC-Regular;
        }
      }
    }
  }

  .stickyed {
    position: absolute;
    z-index: 100;
    top: 0;
  }

  .tips {
    padding: 0.05rem 0;
    background-color: var(--q-color-com-bg-color-12);
    color: var(--q-color-com-fs-color-28);
    font-size: 0.1rem;
  }

  .tips_content {
    margin: 0 0.18rem;
    font-size: 0.1rem;
  }

  .top-space {
    padding-top: 2.11rem;
  }

  .video_reload_box {
    width: 100%;
    height: 2.11rem;
    background: var(--q-color-com-img-bg-130) no-repeat center content-box content-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .rotate_1 {
    transition: all 1s;
  }

  .rotate_2 {
    transform: rotate(360deg);
    transition: all 1s;
  }
    :deep(.tabs-wrapper) {
      position: absolute;
      bottom: 1.18rem;
      left: 0.3rem;
      z-index: 100000;
    }
    :deep(.slider-x) {
      position: absolute;
      bottom: .45rem;
      left: 0.3rem;
      width: 6.57rem;
      padding-right: .5rem;
      gap: .04rem;
      color: var(--q-color-com-fs-color-8);
      transform: translate3d(100vw, 0, 0);
      transition: transform .2s ease-out;
      overflow-x: auto;
      scroll-behavior: smooth;
      z-index: 100000;
      &.video-move-in {
        transform: translate3d(0, 0, 0);
      }
      &.video-move-in-middle {
        // transform: translate3d(calc(-0.3rem + 100vw / 2 - 1.4rem * var(--event_n) / 2), 0, 0);
      }
      .item-wrapper {
        position: relative;
        flex: 0 0 1.4rem;
        width: 1.4rem;
        height: .6rem;
        padding: .07rem;
        border-radius: .06rem;
        flex-direction: column;
        justify-content: space-between;
        .score {
          display: flex;
          height: .14rem;
          line-height: .14rem;
          font-size: .14rem;
          font-weight: 700;
          .colon {
            margin-top: -0.02rem;
            margin-right: 0.02rem;
            margin-left: 0.01rem;
          }
        }
        .event-team, .event-name, .event-time {
          height: .1rem;
          line-height: .1rem;
          font-size: .1rem;
        }
        .event-time {
          position: absolute;
          right: .14rem;
          top: .09rem;
          color: var(--q-color-com-fs-color-32);
          font-size: .1rem;
        }
      }
    }
}

.switch-video-wrap {
  position: fixed !important;
  width: 100%;
  height: 100%;
  background-color: var(--q-color-com-bg-color-36);
  left: 0;
  top: 0;
  z-index: 999999;

  .content {
    position: absolute !important;
    width: 100%;
    max-height: 0px;
    background-color: rgb(244, 244, 244);
    left: 0;
    bottom: 0;
    font-size: 14px;
    color: var(--q-color-com-fs-color-28);
    overflow: hidden;
    transition: max-height 0.3s;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 20px;
      height: 50px;
      background-color: var(--q-color-com-bg-color-12);

      &:last-child .text-wrap {
        border-bottom: none;
      }

      .text-wrap {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 20px;
        border-bottom: 1px solid var(--q-color-com-border-color-10);
        height: 100%;
      }
    }

    .index {
      margin-bottom: 10px;
      padding-right: 20px;
    }

    .close {
      font-size: 14px;
      color: var(--q-color-com-fs-color-29);
      height: 64px;
      line-height: 50px;
      text-align: center;
      background-color: var(--q-color-com-bg-color-12);
      margin-top: 10px;
    }
  }
}

/* ************** 视频全屏的样式 ************** -S */

.a-show {
  right: 0;
  transition: all 10.15s ease-in;
}
.a-hide {
  right: -2.8rem;
  transition: all 10.15s ease-in;
}
.analyze-show {
  position: absolute !important;
  top: 0;
  bottom: 0;
  margin: auto;
  right: 12%;
  width: 3.67rem;
  //min-height 3.75rem
  height: 2.66rem;
  z-index: 1000000;
  //overflow: auto;
  background: transparent !important;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.hengping-title {
  height: 100%;
  align-items: center;

  span {
    display: inline-block;
    font-size: 0.14rem;
  }
}

.hengping-duiming {
  max-width: 20vw;
}

.video-wrapper {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  :deep(.dplayer-icons-right) {
      display: none !important;
    }
    :deep(.dplayer-controller) {
      .dplayer-bar-wrap {
        width: 4.5rem;
        bottom: 15.5px;
        left: .64rem;
      }
      .dplayer-icons {
        bottom: 2px;
        left: calc(5.14rem + 0.1rem);
        transform: scale(0.8);
      }
    }
  
}

.toggle-replay-video-wrap {
  position: absolute;
  right: .9rem;
  bottom: .46rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .04rem;
  height: .2rem;
  padding: 0 .04rem;
  background: var(--q-color-com-bg-color-32);
  backdrop-filter: blur(2px);
  border-radius: 3rem;
  transition: bottom .2s ease-out;
  z-index: 100000;
  &.move-up {
    bottom: 1.18rem;
  }
  &.hairline-border::after {
    border-color: var(--q-color-com-border-color-22) !important;
    border-radius: 3rem;
  }
  span {
    font-size: .12rem;
    color: var(--q-color-com-fs-color-32);
  }
}
.replay-logo-wrap {
  position: absolute;
  top: 0.52rem;
  left: 0.72rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
  &.replay-logo-wrap-portrait {
    top: 50%;
    left: 0.4rem;
    transform: translateY(calc(-50% - 0.6rem));
  }
  .replay-logo-svg {
    display: block;
    width: 0.6rem;
  }
}
.close-video-wrap {
  position: absolute;
  top: 0.52rem;
  right: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
}

.highlights-controller {
  // position: relative;
  &.bottom-controller-bar {
    position: fixed;
    bottom: .3rem;
    left: 0;
    width: 100%;
    z-index: 100000;
    .voice-wrap {
      bottom: -0.03rem;
      left: .2rem;
    }
    .tips-wrap {
      bottom: 0;
      right: .52rem;
    }
    .full-screen-btn {
      bottom: 0;
      right: .2rem;
    }
  }
  .replay-voice-wrap{
      top: -6.28rem !important;
      left: .1rem !important;
    }
  .voice-wrap {
    position: absolute;
    bottom: .12rem;
    left: .33rem;
    //width: 0.4rem;
    height: 0.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100000;

    svg {
      width: 0.2rem;
      height: 0.2rem;
      fill: rgba(255, 255, 255, 0.9);
    }
  }
  .full-screen-btn {
    padding: 0;
    bottom: 0.15rem;
    right: .35rem;
  }


}
.exit-img {
  position: absolute;
  right: 0.3rem;
  bottom: 0.3rem;
  top: 80vh;
  width: .2rem;
  z-index: 99999;
  height: .2rem;
}

/* ************** 视频全屏的样式 ************** -E */
.slider-container {
  position: absolute;
  bottom: 20px;
  left: 60px;
}
.mb-8 {
  margin-bottom: 8px;
}
.w-24 {
  width: 24px;
}
.h-24 {
  height: 24px;
}
.mr-14 {
  margin-right: 14px;
}
.icontainer-wrap{
  position: relative;
  width: 100%;
  padding-bottom: 56%;
  .icontainer{
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>