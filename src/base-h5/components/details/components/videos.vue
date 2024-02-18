<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页视频+动画直播区域
-->
<template>
  <div
    ref="video_height"
    class="player"
    :class="{
      'across-height': get_is_full_screen && get_video_url.active == 'muUrl' && get_is_hengping,
    }"
  >
    <div :class="{'top-space':nail && get_zhiding}">
      <!-- 播放出错 -->
      <div v-if="video_iframe_status == 'error'" class="video_reload_box">
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
            <img :src="_.get(get_detail_data,'lss') == 1 ? studio_icon : lvs_icon_pre"/>
          </div>
          <!-- 视频 -->
          <div class="img-wrap" v-if="get_detail_data.mms >= 2 && get_video_url.active != 'muUrl'" @click="toggle_click(4, 'muUrl')">
            <img :src="shipin"/>
          </div>
          <!-- 动画 -->
          <div class="img-wrap" v-if="get_detail_data.mvs > -1 && lodash.get(UersCtr, 'user_info.ommv') && get_video_url.active != 'animationUrl' && !get_is_full_screen" @click="toggle_click(4, 'animationUrl')">
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
      <div v-else style="width:100%;height:2.11rem;" class="iframe-wrap DJ-score-information" :class="{stickyed:nail && get_zhiding,'full-screen':get_is_full_screen}">
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
        <iframe 
        v-if="(get_video_url.active == 'animationUrl' || get_iframe_onload) && !is_show_no_handle && iframe_src" 
        v-show="!is_playing_replay" 
        ref="iframe" 
        id="bdIframe" 
        style="width:100%;height:100%;" 
        allow="autoplay" 
        frameborder="0" 
        scrolling="no" 
        :src="iframe_src+'&rdm='+iframe_rdm"
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
            <img src="image/bw3/svg/details/replay_logo.svg" />
          </div>

          <div v-show="is_controller_show" class="highlights-controller" :class="{'bottom-controller-bar': !get_is_hengping}">
            <!-- 视频声音 -->
            <div class="voice-wrap" @click="set_video_voice">
              <svg v-if="!current_event_video.voice"  xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8z"></path></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528zM25.152 16q0 2.72-1.536 5.056t-4 3.36q-0.256 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.704 0.672-1.056 1.024-0.512 1.376-0.8 1.312-0.96 2.048-2.4t0.736-3.104-0.736-3.104-2.048-2.4q-0.352-0.288-1.376-0.8-0.672-0.352-0.672-1.056 0-0.448 0.32-0.8t0.8-0.352q0.224 0 0.48 0.096 2.496 1.056 4 3.36t1.536 5.056z"></path></svg>
            </div>
            <!--&lt;!&ndash; 视频info说明弹窗 &ndash;&gt;-->
            <!--<div v-show="!get_is_hengping" class="tips-wrap" @click="change_info">-->
            <!--  <img src="image/bw3/svg/details/tips.svg" />-->
            <!--</div>-->
            <!-- 全屏按钮 -->
            <div class="full-screen-btn" @click="exit_full_screen">
              <img src="image/bw3/svg/pack_up.svg">
            </div>
          </div>
        </template>

        <!-- 精彩回放 -->
        <template v-if="get_detail_data.csid === '1' && get_is_hengping && is_replay_switch && events_list.length">

          <!-- 精彩回放事件类型切换 -->
          <tabs v-show="is_expand_video_list" :tabs="tab_list" @click="get_video_list" ref="tabs"></tabs>

          <template v-if="get_is_hengping">
            <!--（精彩/收起）回放 -->
            <div v-if="events_list.length" class="toggle-replay-video-wrap hairline-border" :class="{'move-up': is_expand_video_list}" @click="toggle_slider_btn">
              <img src="image/bw3/svg/details/replay_toggle.svg" />
              <span>{{ !is_expand_video_list ? i18n_t('highlights.title') : i18n_t('highlights.collapse_replay') }}</span>
            </div>

            <!-- 关闭回放视频 -->
            <div v-show="is_playing_replay" class="close-video-wrap" @click="exit_full_screen">
              <img src="image/bw3/svg/details/close.svg" />
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
              <div class="event-time">{{ $filters.format_mgt_time(+slotProps.item.secondsFromStart) }}</div>
            </template>
          </slider-x>

        </template>

        <!-- 长时间未操作 -->
        <div v-if="is_show_no_handle" class="no-handle information-score">
          <div class="text text-center">{{i18n_t('video.nohandle')}}</div>
          <div class="collect-icon" @click="is_show_no_handle = false"></div>
        </div>
        <!-- 动画背景遮罩层 -->
        <div v-show="get_video_url.active == 'animationUrl' || (get_is_full_screen && !is_show_no_handle)"
            class="bg"
            v-touch-swipe.horizontal.prevent.mouse="bg_touchmove"
           ></div>
        <!--<div class="bg" v-show="get_video_url.active == 'animationUrl'" @touchmove.prevent></div>-->
        <football-events></football-events>

        <!-- 展示球队名称、比分 -->
        <div v-show="show_icons" class="title">
          <!-- 视频全屏时的样式单独处理 -->
          <template v-if="get_is_full_screen && get_video_url.active == 'muUrl' && get_is_hengping">
            <div class="hengping-title row">
              <!-- 返回按钮 -->
              <div class="video_back yb_mx10" @click="close_video" style="height: 0.16rem"></div>
              <!-- 对阵信息 -->
              <span class="hengping-duiming ellipsis">{{title.mhn}}</span>
              <span :style="{visibility: get_detail_data.ms == 110 ? 'hidden':'visible'}" class="score-title yb_mx4">{{title.msc}}</span>
              <span class="hengping-duiming ellipsis">{{title.man}}</span>
              <!-- 比分 -->
              <div style="margin-left:auto" v-if="get_menu_type !== 3000">
                <match-score :detail_data="get_detail_data"></match-score>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="row justify-between full-height mx-15"  @click.stop="click_mask">
              <div class="col-1 go-back-btn-wrap" @click="close_video">
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
          <div class="img-wrap" v-if="show_lvs" @click="toggle_click(4, 'lvs' )">
            <img :src="_.get(get_detail_data,'lss') == 1 ? studio_icon : lvs_icon_pre"/>
          </div>
          <!-- 视频 -->
          <div class="img-wrap" v-if="get_detail_data.mms >= 2 && get_video_url.active != 'muUrl'" @click="toggle_click(4, 'muUrl')">
            <img :src="shipin"/>
          </div>
          <!-- 动画 -->
          <div class="img-wrap" v-if="get_detail_data.mvs > -1 && lodash.get(UersCtr, 'user_info.ommv') && get_video_url.active != 'animationUrl' && !get_is_full_screen" @click="toggle_click(4, 'animationUrl')">
            <img :src="donghua"/>
          </div>

           <!-- 视频 info 说明弹窗 -->
           <div class="img-wrap" v-if="show_animation || get_is_full_screen || media_type === 'progress_bar_video'">
             <!-- 视频info说明弹窗 -->
             <img :src="tips ? tips_act :tips_def" @click.stop="change_info"/>
           </div>

          <div class="img-wrap" v-if="['1', '2'].includes(get_detail_data.csid) && [0,1,110].includes(+get_detail_data.ms) && get_is_full_screen && get_video_url.active == 'muUrl' && get_is_hengping">
            <!-- 投注弹窗 -->
            <img :src="bet" @click.stop="change_bet"/>
          </div>
          <div class="img-wrap" v-if="[1,2].includes(+get_detail_data.csid) && get_is_full_screen && get_video_url.active == 'muUrl' && get_is_hengping">
            <!-- 分析弹窗 -->
            <!-- <img :src="select_item == 3 ? (!('y0')?analyze2:analyze2_y0) : (!('y0')?analyze:analyze_yo)" @click.stop="change_analyze"/> -->
            <img :style="compute_img_url(select_item == 3?'video-analyze':'video-analyze-s')">

          </div>
        </div>
        <!-- 声音按钮 -->
        <!-- <div v-show="show_icons && get_video_url.active === 'muUrl' && !load_error" class="voice-btn" @click="toggle_click(2, get_video_url.active)">
          <img v-if="voice" :src="voice_def">
          <img v-else :src="voice_act">
        </div> -->
        <!-- 全屏按钮 -->
        <div v-show="show_icons && ['muUrl', 'lvs'].includes(get_video_url.active)&& !load_error && !is_playing_replay" class="full-screen-btn" @click="set_full_screen">
          <img v-if="get_is_full_screen"  src="image/bw3/svg/pack_up.svg">
          <img v-else  src="image/bw3/svg/full_screen.svg">
        </div>
        <!-- 视频info说明弹窗 -->
        <div
          v-show="!show_animation && !get_is_full_screen && show_icons && !load_error && media_type !== 'progress_bar_video'"
          class="description-popup"
        >
          <span class="font_color" @click="show_HD_SD" v-if="get_detail_data.lvs != -1 && _.get(get_detail_data,'lss') ==  1&& get_video_url.active == 'lvs'">
            {{get_hd_sd == 1 ? i18n_t("common.HD"): i18n_t("common.SD")}}
          </span>
          <div class="img-wrap">
            <img :src="tips ? tips_act :tips_def" @click="change_info"/>
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
// #TODO vuex
// import {mapGetters, mapMutations} from "vuex";
// import global_filters from 'src/boot/global-filters.js'
import {api_common, api_analysis} from 'src/project/api/index.js';
import video from "src/base-h5/utils/video/video.js"   // 视频相关公共方法
import matchScore from 'src/project/components/match/match_score.vue' // 比分组件
import footballEvents from "src/base-h5/components/details/football_events.vue";
import analysis_football_matches from "src/base-h5/components/details/analysis-matches/football_match_analysis/analysis_football_matches.vue"; // 详情页  足球赛事分析
import basketball_match_analysis from "src/base-h5/components/details/analysis-matches/basketball_match_analysis/basketball_match_analysis";  // 详情页 或者 赛果  篮球赛事分析
import lodash from "lodash";

import { useRouter, useRoute } from "vue-router";
import { useMittOn, useMittEmit, MITT_TYPES, MenuData, MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouse, MatchDetailCalss,LOCAL_PROJECT_FILE_PREFIX } from  "src/output/index.js"
import { format_total_score } from "src/output/index.js"
import { video_info } from "./videos.js";
import { defineComponent, reactive, computed, onMounted, onUnmounted, toRefs, watch,ref } from "vue";
import { i18n_t } from "src/boot/i18n.js";
import {UserCtr,compute_img_url} from "src/output/index.js";


//国际化

const route = useRoute()
export default defineComponent({
  name: "videos",
  components: {
    matchScore,
    footballEvents,
    "analysis-football-matches": analysis_football_matches,  //足球分析
    "basketball-match-analysis": basketball_match_analysis,  //篮球分析
    "tabs": () => import("src/base-h5/components/details/analysis-matches/components/tabs.vue"),
    "slider-x": () => import("src/base-h5/components/details/analysis-matches/components/slider_x.vue"),
  },
  props:[
    //视频说明是否展示
    'tips',
    // 随机数props传参是否显示视频对阵信息
    'is_show_text',
    // 是否展示返回按钮
    'show_go_back',
    'detail_data' //详情数据
  ],

  setup(props, evnet) {
    // 详情页的数据
    const get_detail_data = ref(lodash.get(MatchDataWarehouse, 'list_to_obj.mid_obj[`${route.params.mid}_`]'))
    let component_data = reactive({
      tips_def: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/video_b.svg`,
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
      voice: true,
      nail: true,
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
      // 视频单页是否已加载 
      get_iframe_onload: false,
    });
    // 收藏菜单为6
    const get_menu_type = computed(() => {
      return MenuData.menu_type
    });
    const get_change_count = computed(() => {
      return ""
    });
    const get_is_user_no_handle = computed(() => {
      return ""
    });
    // 视频url信息
    const get_video_url = computed(() => {
      return MatchDetailCalss.video_url
    });
    // 视频显示状态
    const get_show_video = computed(() => {
      return ""
    });
    // // 用户令牌信息
    // const get_user_token = computed(() => {
    //   return ""
    // });
    // 置顶按钮是否高亮
    const get_zhiding = computed(() => {
      return ""
    });
    // 点击视频或者是动画的时候玩法集是否固定
    const get_tab_fix = computed(() => {
      return ""
    });
    // 用户信息,用户金额,userId 需要监听变化
    // const get_user = computed(() => {
    //   return ""
    // });
    // 是否全屏
    const get_is_full_screen = computed(() => {
      return ""
    });
    // 是否横屏
    const get_is_hengping = computed(() => {
      return ""
    });
    // 是否显示横屏全屏下投注弹窗
    const get_bet_show = computed(() => {
      return ""
    });
    // 获取分析赛事状态（显示和不显示）
    const get_analyze_show = computed(() => {
      return ""
    });
    // // 获取当前主题颜色
    // const UserCtr.theme = computed(() => {
    //   return ""
    // });
    // 标清0 高清1
    const get_hd_sd = computed(() => {
      return ""
    });
    const get_is_dp_video_full_screen = computed(() => {
      return ""
    });
    // 鉴权域名 + 回放视频url（拼接后的最终url）
    const replay_video_src = computed(() => {
      const host_url = window.BUILDIN_CONFIG.live_domains[0] || _.get(UserCtr,'user_info.oss.live_h5')
      return `${host_url}/videoReplay.html?src=${replay_url}&lang=${UserCtr.lang}&volume=${is_user_voice ? 1 : 0}`

      // const host_url = 'http://localhost:4000/videoReplay.html?'
      // return `${host_url}src=${replay_url}&volume=${is_user_voice ? 1 : 0}`
    });
    // 展示lvs 图标
    const show_lvs = computed(() => {
      return get_detail_data.value.lvs != -1 && get_video_url.active != 'lvs' && ['string', 'number'].includes(typeof lodash.get(get_detail_data.value,'lss')) && ['zh','tw', 'hk'].includes(UserCtr.lang)
    });
    // 判断此商户是否属于乐天
    const is_letian = computed(() => {
      // letian = 乐天  oubao = 欧宝
      if(UserCtr.user_info.merchantCode){
        return UserCtr.user_info.merchantCode == 'letian'
      }
    });
    // const iframe_show = computed(() => {
    //   console.error("计算属性");
    //   if(get_video_url.active == 'animationUrl' || component_data.get_iframe_onload){
    //     return true
    //   }
    //   return false
    // });
    // 动画下显示tips icon
    const show_animation = computed(() => {
      return get_detail_data.value.mvs > -1 && get_video_url.active == 'animationUrl'
    });
    // 媒体类型
    const media_type = computed(() => {
      const {lss} = get_detail_data.value
      const {active} = get_video_url

      // 专题视频，mp4等带有可控制进度条
      if (lss === 0 && active === 'lvs') {
        return 'progress_bar_video'
      } else {
        // 其他类别，可扩展
        return 'others'
      }
    });
    // 赛事id
    const match_id = computed(() => {
      return $route.params.mid || get_detail_data.value.mid
    });
    // 赛事id
    const score = computed(() => {
      return {
        home: "",
        away: ""
        // home: format_total_score(detail_data, 0),
        // away: format_total_score(detail_data, 1)
      }
    });
    const eports_scoring = computed(() => {
      //比分判断处理
      let scoring = false
      //如果是电竞，则进行比分判定处理
      if(get_menu_type == 3000) {
        const mmp_state = detail_data.mmp || 1
        if(mmp_state != (Number(score.home) + Number(score.away) +1)) {
          scoring = true
        }
      }
      return scoring
    });
    // 事件列表（非全屏）
    const events_list_vertical = computed(() => {
      const curr_tab_index = tabIndex
      let events_list
      if (curr_tab_index === 0) {
        events_list = _.cloneDeep(events_list)
      } else if (curr_tab_index === 1) {
        events_list = events_list.filter(item => item.eventCode === 'goal')
      } else if (curr_tab_index === 2) {
        events_list = events_list.filter(item => item.eventCode === 'corner')
      } else {
        events_list = events_list.filter(item => !['goal', 'corner'].includes(item.eventCode))
      }
      return events_list.reverse()
    });
    // 事件列表（全屏）
    const slider_events_list = computed(() => {
      return _.cloneDeep(events_list_vertical).reverse()
    });
    // 精彩回放视频开关是否开启
    const is_replay_switch = computed(() => {
      const { configValue, eventSwitch } = _.get(UserCtr, 'user_info.merchantEventSwitchVO', {})
      return configValue == 1 && eventSwitch == 1
    });
    // slider列表长度是否小于屏幕横屏宽度
    const is_slider_in_screen = computed(() => {
      const full_screen_width = get_is_hengping ? innerWidth : innerHeight
      const font_size = (get_is_hengping ? innerHeight : innerWidth) * 100 / 375

      return slider_events_list.length * Math.ceil(1.44 * font_size) < full_screen_width
    });
    // 监听用户是否长时间未操作
    watch(
      () => get_is_user_no_handle.value,
      (res) => {
        if(res && iframe_show && get_video_url.active == 'muUrl'){
          iframe_rdm = new Date().getTime()
          is_show_no_handle = true
          sendMessage2({cmd: 'destroy_video'})
        }
      }
    );
    // 监听屏幕改变
    watch(
      () => get_is_hengping.value,
      (is_hengping) => {
        if (!is_hengping) {
          set_bet_show(false)
          set_analyze_show(false);
        }
        set_analyze_show(false);
        // 播放视频的时候横屏，自动触发全屏
        if (is_hengping && get_show_video && get_video_url.active == 'muUrl') {
          set_is_full_screen(true)
          show_icons = true;
          clear_timer()
          if(is_need_timer) {
            timer1_ = setTimeout(() => {
            show_icons = false;
            sendMessage2({cmd: 'hide_icon'})
          }, 3000)
        }
        }
        // 视频播放时，切换横屏则清除投注项数据
        set_bet_list([]);

        // 横屏、竖屏切换时通知子iframe
        if (is_playing_replay) {
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


      }
    );
    // 监听随机数是否显示视频对阵信息
    watch(
      () => component_data.is_show_text,
      (new_) => {
        console.log(new_,"new_new_new_");
        // 当是动画当时候，详情外面点击默认就是展示返回按钮，关闭的话只能点击顶部返回
        if(get_video_url.active == 'animationUrl' && show_go_back){
          show_icons = true
          if(show_icons){
            sendMessage2({cmd: 'show_icon'})
          }else{
            sendMessage2({cmd: 'hide_icon'})
          }
          fade_icons();
          // set_bet_show(false);
          set_analyze_show(false);
          select_item = -1;
        }else{
          // 视频中的iframe是可以交互隐藏返回显示按钮的
          show_icons = !show_icons
          if(show_icons){
            sendMessage2({cmd: 'show_icon'})
          }else{
            sendMessage2({cmd: 'hide_icon'})
          }
          fade_icons();
          // set_bet_show(false);
          set_analyze_show(false);
          select_item = -1;
        }
      }
    );
    watch(
      () => get_video_url.value,
      (new_value, old_value) => {
        if(new_value.active == 'muUrl'){
          if ([100,101,102,103].includes(+get_detail_data.value.csid)){
            component_data.iframe_src = new_value.media_src + dj_http_fix(new_value.media_src) +'controls=1'
          } else {
            component_data.iframe_src = new_value.media_src + '&controls=1'
          }
          //用戶第一次登录 显示 视频指引层
          let is_login_one = localStorage.getItem("is_first_login");
          if (get_show_video && is_login_one != "end") {
            first_login = true;
            if(timer5_) { clearTimeout(timer5_) }
            timer5_ = setTimeout(()=>{
              first_login = false;
            },5000)
            localStorage.setItem("is_first_login", "end");
          }
        }
        else{
          if (new_value.referUrl && new_value[new_value.active]) {
            if ([100,101,102,103].includes(+get_detail_data.value.csid)){
              component_data.iframe_src = new_value[new_value.active] + dj_http_fix(new_value[new_value.active]) +'controls=1'
            } else {
              component_data.iframe_src = new_value[new_value.active] + '&controls=1'
            }

          }
        }
      }
    );
    watch(
      () => component_data.nail,
      (n, o) => {
        if(n == true){
          set_zhiding_info(true);
        }else{
          set_zhiding_info(false);
        }
      }
    );
    watch(
      () => component_data.tips,
      (n, o) => {
        if(n == true){
          set_video_zhiding(true);
        }else{
          set_video_zhiding(false);
        }
      }
    );
    // 比分（比分类型|比分）变化
    watch(
      () => get_detail_data.value.msc,
      (new_value) => {
        get_msc()
      }
    );
    // 动画状态 -1 没有配置动画源 ，0 ： 已配置，但是不可用   1： 已配置，可用，播放中   2：已配置，可用，播放中
    watch(
      () => get_detail_data.value.mvs,
      (new_value) => {
        if(new_value == -1 && get_video_url.active == 'animationUrl'){
          set_toast({
            txt: i18n_t("video.close_1"),
          });
          close_video()
        }
      }
    );
    // 视频状态 -1 没有配置视频源 ，0 ： 已配置，但是不可用   1： 已配置，可用,暂未播放  2：已配置，可用，播放中
    watch(
      () => get_detail_data.value.mms,
      (new_value) => {
        if(new_value != 2 && get_video_url.active == 'muUrl'){
          close_video()
          set_toast({
            txt: i18n_t("video.close_2"),
          });
        }
      }
    );
    /*"vdo": { 只有视频的时候：视频的每次线路的状态
      "sid": "2446509", 视频流ID
      "sms": 2, 该视频流状态值,0,1,2
      "sts": "open" 该视频流出售状态：close 关闭 open 打开
    }*/
    watch(
      () => get_detail_data.value.vdo,
      (new_value) => {
        if(new_value){
          for(let i = 0;i < new_value.length;i++){
            sendMessage2({cmd: 'update_sts', val: new_value[i]})
          }
        }
      }
    );
    watch(
      () => get_is_dp_video_full_screen.value,
      (status) => {
        if (!status) {
          clearTimeout(reload_iframe_timer)
          reload_iframe_timer = setTimeout(() => {
            // 部分iPhone safari退出全屏后，视频高度不正确，重载iframe更新
            component_data.get_iframe_onload = false
            $nextTick(() => {
              component_data.get_iframe_onload = true
            })
          }, 300)
        }
      }
    );
    // 设置iframe标签是否开启
    const set_iframe_onload = (param) => {
      component_data.get_iframe_onload = param
    }
    onMounted(() => {
      // 延时器
      timer1_ = null;
      timer2_ = null;
      timer3_ = null;
      timer4_ = null;
      timer5_ = null;
      timer6_ = null;
      reload_create_fun();
      // iframe视频参数时间戳
      iframe_rdm = new Date().getTime()
      useMittOn(MITT_TYPES.EMIT_IFRAME_VIDEO_VOLUME, video_volume);
      // iframe标签
      useMittOn(MITT_TYPES.EMIT_SET_IFRAME_ONLOAD, set_iframe_onload);

      // 监听精彩回放iframe传来的消息
      window.addEventListener("message", handle_replay_message);

      replay_url = 'http://localhost:3000/replay.mp4'


      // 原mounted
      set_zhiding_info( false )
      set_video_zhiding( false )
      useMittOn(MITT_TYPES.EMIT_VIDEO_SWITCHING,icon_click_lvs);
      mapFrame = $refs.iframe
    });
    onUnmounted(() => {
      set_video_url({media_src:'',referUrl:''})
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("message", handle_replay_message);
      set_tab_fix(false);
      set_is_dp_video_full_screen(false);
      clear_timer()
      if(get_video_url.active == 'muUrl') localStorage.setItem("is_first_login", "end");
      clearTimeout(timer1_)
      clearTimeout(timer2_)
      clearTimeout(timer3_)
      clearTimeout(timer4_)
      clearTimeout(timer5_);
      clearTimeout(timer6_)
      clearTimeout(media_type_change_timer)
      clearTimeout(reload_iframe_timer)
      clearInterval(get_replay_video_timer)
      useMittOn(MITT_TYPES.EMIT_VIDEO_SWITCHING,icon_click_lvs).off;
      useMittOn(MITT_TYPES.EMIT_IFRAME_VIDEO_VOLUME, video_volume).off;
    });
    // #TODO vuex actions
    // ...mapMutations([
    //   'set_change_count',
    //   'set_video_url',
    //   'set_show_video',
    //   'set_video_zhiding',
    //   'set_toast',
    //   "set_zhiding_info",
    //   'set_iframe_onload',
    //   'set_is_close_video',
    //   'set_tab_fix',
    //   'set_info_show',
    //   'set_hd_sd_show',
    //   'set_hd_sd',
    //   'set_is_full_screen',
    //   'set_is_in_play',
    //   'set_bet_show',
    //   'set_analyze_show',
    //   'set_bet_obj',
    //   'set_bet_list',
    //   'set_is_hengping',
    //   'set_event_list',
    //   'set_is_dp_video_full_screen',
    // ]),

    return {compute_img_url,
      LOCAL_PROJECT_FILE_PREFIX,
      ...toRefs(data)
    }

  }
})

</script>
<style scoped lang="scss">
  @import "../styles/videos.scss";
</style>
