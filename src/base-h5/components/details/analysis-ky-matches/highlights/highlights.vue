<template>
  <div class="highlights analysis-odds">
    <!-- 精彩集锦 -->
    <div class="wonderful">
      <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/details/border_left.svg`" alt="" class="border-left">
      <div class="wonderful-header">
        <p>{{ i18n_t('app_h5.detail.highlights') }}</p>
        <!-- <ul class="wonderful-tabs">
          <li v-for="(item, i) in wonderful_tabs" :key="i" @click="change_wonderful_active(i)"
              :class="[wonderful_active == i ? 'wonderful-active':'disable-text']">
            {{ item.name }}
          </li>
        </ul> -->
      </div>

      <!-- 内容 -->
      <div class="wonderful-content">
        <!-- tab菜单 -->
        <div class="heade-wrapper" :class="[{'is-result-details': menu_type == 28}, {'is-hidden': is_full_screen}]" v-if="lodash.get(get_detail_data, 'csid') == 1">
          <div class="heade">
            <span v-for="(item,i) in tab_list" :key="i"
                  :class="['ellipsis', {'is-active' : tabIndex == i}]"
                  @click="tab_click(item, i)"
            >
              {{ item.title }}
            </span>
          </div>
        </div>

        <div class="wonderful-list" ref="wonderfulListRef">
          <!-- 精彩回放列表 -->
          <template v-if="events_list_vertical.length > 0">
            <div class="row" v-for="(event, i) in events_list_vertical" :key="i" >
            <div class="time-line"></div>
            <div class="time-line-ball"></div>
            <div :class="['item-flag', flag_icon(event.eventCode)]"></div>
            <!-- <div class="item-content hairline-border"  @click="handle_click_event(i, event)"> -->
            <div class="item-content hairline-border"  @click="toPlay(i, event)">
              <!-- 背景图 -->
              <div :style="{
                'background-image': `url(${event.fragmentPic})`
              }" class="fragment-pic">
              <!-- 播放视频按钮 -->
              <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/details/play.svg`" alt="" class="play"/>
              <span class="score">{{ event.t1 }}-{{ event.t2 }}</span>
              <span class="time">{{ $filters.format_mgt_time(+event.secondsFromStart) }}</span>
            </div>
              <div class="text-wrapper">
                <!-- 点球大战 -->
                <div class="text-scroller" v-if="event.matchPeriodId==50">
                  <span class="text" v-scroll-text>

                     {{i18n_t('mmp')[1][event.matchPeriodId]}}
                  </span>
                </div>
                <!-- 加时赛 -->
                <div class="text-scroller" v-else-if="event.matchPeriodId==41||event.matchPeriodId==42">
                  <span class="text" v-scroll-text>{{i18n_t('mmp')[2][40]}} {{event.homeAway}} {{i18n_tc(`highlights.event_type.${event.eventCode}`, {X: trans_num(event.firstNum)})}}</span>
                </div>
                <div class="text-scroller" v-else>
                  <span class="text" v-scroll-text>
                    <span>{{event.homeAway}}</span>
                    <span> {{  i18n_tc(`highlights.event_type.new_${event.eventCode}`, {X: trans_num(event.firstNum)})}}</span>
                  </span>
                </div>
              </div>
              <i class="icon icon-replay-red"></i>
            </div>

            <div
                v-show="i == event_index"
                class="replay-wrapper"
                :class="[
                  i == event_index && is_expand ? 'expand' : 'expand pack-up',
                  {
                    'full-screen-replay-wrapper': is_hengping,
                    'full-screen-portrait': is_full_screen && !is_hengping,
                  }
                ]">
              <div class="load-error-mask" v-show="is_expand && is_replay_load_error">
                <div><img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/details/reconnect.svg`" /></div>
                <div>{{ i18n_t('highlights.reconnect') }}</div>
              </div>

              <!-- 精彩回放视频iframe -->
              <iframe
                  v-if="i == event_index && is_expand"
                  v-show="!is_replay_load_error"
                  id="replayIframe"
                  :src="replay_video_src+'&rdm='+iframe_rdm"
                  style="width:100%;height:100%;"
                  allow="autoplay"
                  frameborder="0"
                  scrolling="no"
                  @load="handle_replay_video_loaded"
              ></iframe>

              <template v-if="i == event_index && is_expand">
                <div v-show="is_controller_show" class="event-title-wrapper" :class="{'is-full-screen': is_full_screen}">
                  <!-- 事件title -->
                  <div class="event-title">{{event.homeAway}} {{i18n_tc(`highlights.event_type.${event.eventCode}`, {X: event.firstNum})}}</div>
                  <!-- 主客队比分 -->
                  <div class="home-away-score-wrapper">
                    <team-img :type="0" :csid="lodash.get(get_detail_data, 'csid')" :url="lodash.get(get_detail_data, 'mhlu[0]')" :fr="menu_type != 3000 ? lodash.get(get_detail_data, 'frmhn[0]'): lodash.get(get_detail_data, 'frmhn')" :size="13"></team-img>
                    <div class="score">
                      <span>{{ event.t1 }}</span>
                      <span class="colon">:</span>
                      <span>{{ event.t2 }}</span>
                    </div>
                    <team-img :type="0" :csid="lodash.get(get_detail_data, 'csid')" :url="lodash.get(get_detail_data, 'malu[0]')" :fr="menu_type != 3000 ? lodash.get(get_detail_data, 'frman[0]'): lodash.get(get_detail_data, 'frman')" :size="13"></team-img>
                  </div>
                </div>


                <!-- 顶部title、比分 -->
                <title-x v-if="is_hengping && is_controller_show" @handle_callback="close_video" :get_detail_data="get_detail_data"></title-x>

                <!-- 精彩回放事件类型切换 -->
                <tabs v-show="is_expand_video_list" :tabs="tab_list" @click="get_video_list" ref="tabs" :isChange="true"></tabs>

                <!-- 精彩回放视频滚动列表 -->
                <slider-x
                  v-if="is_hengping"
                  v-show="slider_events_list[0].eventId"
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

                <!-- 回放视频标识logo -->
                <div class="replay-logo-wrap" v-if="is_full_screen">
                  <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/details/replay_logo.svg`" />
                </div>

                <template v-if="is_hengping">
                  <!--（精彩/收起）回放 -->
                  <div class="toggle-replay-video-wrap hairline-border" :class="{'move-up': is_expand_video_list}" @click="toggle_slider_btn">
                    <img src="image/bw3/svg/details/replay_toggle.svg" />
                    <span>{{ !is_expand_video_list ? i18n_t('highlights.title') : i18n_t('highlights.collapse_replay') }}</span>
                  </div>

                  <!-- 关闭回放视频 -->
                  <div class="close-video-wrap" @click="close_video">
                    <img src="image/bw3/svg/details/close.svg" />
                  </div>
                </template>

                <div v-show="is_controller_show && !is_replay_load_error" :class="{'bottom-controller-bar': is_full_screen && !get_is_hengping}">
                  <!-- 视频声音 -->
                  <div class="voice-wrap" @click="set_video_voice">
                    <svg v-if="!current_event_video.voice" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8z"></path></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528zM25.152 16q0 2.72-1.536 5.056t-4 3.36q-0.256 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.704 0.672-1.056 1.024-0.512 1.376-0.8 1.312-0.96 2.048-2.4t0.736-3.104-0.736-3.104-2.048-2.4q-0.352-0.288-1.376-0.8-0.672-0.352-0.672-1.056 0-0.448 0.32-0.8t0.8-0.352q0.224 0 0.48 0.096 2.496 1.056 4 3.36t1.536 5.056z"></path></svg>
                  </div>
                  <!-- 视频info说明弹窗 -->
                  <!--<div v-show="!is_hengping" class="tips-wrap" @click="change_info">-->
                  <!--  <img src="image/bw3/svg/details/tips.svg" />-->
                  <!--</div>-->
                  <!-- 全屏按钮 -->
                  <div class="full-screen-btn" @click="set_full_screen">
                    <img v-if="is_full_screen"  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/pack_up.svg`">
                    <img v-else  :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/svg/full_screen.svg`">
                  </div>
                </div>
              </template>
            </div>
            </div>
          </template>
          
          <noData v-else which='noMatch' height='500'/>
        </div>
      </div>

      
    </div>
    <!-- 赛事事件 -->
    <div class="wonderful" v-if="false">
      <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/details/border_left.svg`" alt="" class="border-left">
      <div class="wonderful-header" @click="change_event_active">
        <p>{{ i18n_t('app_h5.detail.events') }}</p>
        <!-- <ul class="wonderful-tabs">
          <li v-for="(item, i) in wonderful_tabs" :key="i" @click="change_wonderful_active(i)"
              :class="[wonderful_active == i ? 'wonderful-active':'disable-text']">
            {{ item.name }}
          </li>
        </ul> -->
        <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/details/arrow.svg`" :class="['arrow', event_active ? 'rotate-90':'']"/>
          
      </div>
    </div>
    <!-- 技术统计 -->
    <div class="wonderful" v-if="false">
      <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/details/border_left.svg`" alt="" class="border-left">
      <div class="wonderful-header">
        <p>{{ i18n_t('app_h5.detail.technical_statistics') }}</p>
        <!-- <ul class="wonderful-tabs">
          <li v-for="(item, i) in bureau_tabs" :key="i" @click="change_bureau_tabs(i)"
              :class="[bureau_active == i ? 'wonderful-active':'disable-text']">
            {{ item.name }}
          </li>
        </ul> -->
      </div>
    </div>
    
  </div>
</template>

<script>
import {
  ref,
  onMounted,
  computed,
  onUnmounted,
  nextTick,
  watch,
  defineAsyncComponent,
  inject
} from 'vue'
import lodash from 'lodash'
import {api_common, api_analysis} from "src/api/index.js";
import { MatchDetailCalss, useMittOn, useMittEmit, MITT_TYPES,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import { pre_load_video } from "src/core/pre-load/index.js"
import { format_total_score } from "src/output/index.js"
import { i18n_t, i18n_tc } from "src/boot/i18n.js";;
import { useRoute } from "vue-router"
import { MatchDataWarehouse_H5_Detail_Common as matchDetailData, MenuData } from "src/output/index.js";
import sliderX from "src/base-h5/components/details/analysis-matches/components/slider-x.vue"
// 队标视图
import teamImg from "src/base-h5/components/details/team-img.vue"
// 全屏播放时，顶部title
import titleX from "src/base-h5/components/details/analysis-matches/components/title-x.vue" 
// 事件类型菜单
import tabs from "src/base-h5/components/details/analysis-matches/components/tabs.vue" 
import noData from "src/base-h5/components/common/no-data.vue";


// 精彩回放视频滚动列表
export default {
  name: "highlights",
  directives: {
    // 对阵文案过长时，无限滚动展示
    'scroll-text': {
      inserted: function (el) {
        const font_size = innerWidth * 100 / 375
        const width = el.clientWidth
        if (width >=  Math.floor(2.2 * font_size)) {
          let span = document.createElement('span')
          span.className = 'text text-move'
          span.textContent = el.textContent
          el.parentElement.appendChild(span)
          el.classList.add('text-move')
          span = null
          el.parentElement.style.animationDuration = `${width / 30 / 2}s`
        }
      }
    }
  },
  components: {
    sliderX,
    teamImg,
    titleX,
    tabs,
    noData
  },
props: {
  detail_data: {
    type: Object,
    default: {}
  }
},
setup(props, context){
  const ChangeVideoKind = inject('ChangeVideoKind')
  let route = useRoute()
    // 定时器
  const get_football_replay_timer = ref(null)
  const update_slider_index_timer = ref(null)
  const is_controller_show_timer = ref(null)
  const is_replay_load_error_timer = ref(null)
  /** @type {import('vue').Ref<HTMLDivElement>} */
  const wonderfulListRef = ref(null);
  // 锚点
  const events_scroller = ref(null)
  const event_active = ref(true);
  const tabs = ref(null)
  const slider_video = ref(null)
  // TODO:待调试处理
  const slider_x = ref(null)
  const item_wrapper = ref(null)
  const video_wrapper = ref(null)
  // 事件类型菜单选项
  const tab_list = ref([])
  // 当前选中事件类型
  const tabIndex = ref(0)
  const tabEvenCode = ref(0)
  // 事件列表
  const events_list = ref([])
  // 事件列表选中索引
  const event_index = ref(0)
  // 目标事件列表是否展开
  const is_expand = ref(false)
  // 当前播放视频信息
  const current_event_video = ref({
    totalTime: 0,
    voice: true,
    status: 0,
  })
  // 用户是否控制开启声音
  const is_user_voice = ref(true)
  // 当前选中的slider信息(全屏)
  const curr_active_event = ref({
    video_url: '',
    event_id: '',
    slider_index: 0,
  })
  // 局进度
  const bureau_active = ref(0);
  const bureau_tabs = computed(() => [
    {name: '全场', id: 0},
    {name: '上半场', id: 1},
    {name: '下半场', id: 2},
  ])
  // 顶部tabs
  const wonderful_tabs = computed(() => [
    {name: '常规', id: 0},
    {name: '加时', id: 1},
    {name: '点球', id: 2},
  ])
  const wonderful_active = ref(0);
  // 是否是全屏
  const is_full_screen = ref(false)
  // 是否展示slider列表(全屏)
  const is_expand_video_list = ref(false)
  // 是否显示控件
  const is_controller_show = ref(true)
  // 实时时间（赛事进行中）
  const real_time = ref('00:00')
  // 精彩回放视频url
  const replay_url = ref('http://localhost:3000/replay.mp4')
  // 精彩回放视频是否加载失败
  const is_replay_load_error = ref(false)
  // 精彩回放视频增加随机数
  const iframe_rdm = ref('')
  const menu_type = ref(MenuData.menu_type); //菜单选中项
  // 是否横屏
  const is_hengping = ref(false)
  // 是否是dplayer视频全屏
  const is_dp_video_full_screen = ref(false)
  // 赛果详情数据
  const get_detail_data = ref(matchDetailData.get_quick_mid_obj(route.params.mid))
  onMounted(() => {
    pre_load_video.load_player_js(true);
    console.log(get_detail_data, "get_detail_data");
    // store.dispatch({
    //   type: 'SET_EVENT_LIST',
    //   data: []
    // })

    // 监听iframe传来的消息
    window.addEventListener("message", handleMessage);
    if (events_scroller.value) {
      events_scroller.value.style.minHeight = window.innerHeight - rem(1.94) + 'px';
    }

    // 每隔1分钟请求一次精彩回放接口
    get_football_replay(0)
    clearInterval(get_football_replay_timer.value)
    get_football_replay_timer.value = setInterval(() => {
      get_football_replay(0)
    }, 60 * 1000)
  })

  // 接收到子iframe消息后，做相应处理
  const handleMessage = (e) => {
    const data = e.data;

    switch (data.cmd) {
      case 'icon':
        is_controller_show.value = data.val
        break;
    }
  }


  const change_event_active = () => {
    event_active.value = !event_active.value;
  }

  // 检测精彩回放视频资源加载状态
  const check_replay_url = (url) => {
    api_common.get_full_url(url)
      .then((v) => {
        // console.log('精彩回放视频加载成功...')
        is_replay_load_error.value = false
      })
      .catch(err => {
        // console.error('精彩回放视频加载失败...')
        clearTimeout(is_replay_load_error_timer.value)
        is_replay_load_error_timer.value = setTimeout(() => {
          is_replay_load_error.value = true
        }, 200)
      })
  }

  const change_wonderful_active = (value) => {
    wonderful_active.value = value;
  }
  // 第X个——英文下转换
  const trans_num = (num) => {
    let suffix = ''
    if (UserCtr.lang == 'en') {
      if (num == 1) {
        suffix = 'st'
      } else if (num == 2) {
        suffix = 'nd'
      } else if (num == 3) {
        suffix = 'rd'
      } else {
        suffix = 'th'
      }
    }
    return num + suffix
  }
  // 菜单切换后，更新相应状态
  const tab_click = (item, i) => {
    if (tabIndex.value == i) return

    tabIndex.value = i
    tabEvenCode.value = Number(item.code)
    if (!is_full_screen.value) {
      is_expand.value = false
    }
    wonderfulListRef.value.scrollTo({
      left: 0
    })
  }
  // 横屏下精彩回放的事件tab切换
  const get_video_list = ({ tab, index }) => {
    tabEvenCode.value = index
    tabIndex.value = index
    tabs.value[0].changeTabIndex(index)
  }
  // 精彩回放列表显示'的图标
  const flag_icon = (type) => {
    let flag = ''
    switch (type) {
      // 进球
      case 'goal':
        flag = 'icon-flag-goal';
        break;
      // 角球
      case 'corner':
        flag = 'icon-flag-corner';
        break;
      // 红牌
      case "red_card":
        flag = 'icon-flag-card-red';
        break;
      // 黄牌
      case "yellow_card":
        flag = 'icon-flag-card-yellow';
        break;
      // 黄红牌
      case "yellow_red_card":
        flag = 'icon-flag-card-red';
        break;
      default:
        flag = '';
        break;
    }
    return flag;
  }
  // 精彩回放列表显示的事件文案
  const event_name = (type) => {
    let event_name = ''
    switch (type) {
      // 进球
      case 'goal':
        event_name = i18n_t('highlights.type.goal');
        break;
      // 角球
      case 'corner':
        event_name = i18n_t('highlights.type.corner');
        break;
      // 红牌
      case "red_card":
        event_name = i18n_t('highlights.type.card_red');
        break;
      // 黄牌
      case "yellow_card":
        event_name = i18n_t('highlights.type.card_yellow');
        break;
      // 黄红牌
      case "yellow_red_card":
        event_name = i18n_t('highlights.type.card_yellow_red');
        break;
      // 默认
      default:
        event_name = '';
        break;
    }
    return event_name;
  }
  // iframe加载成功后，通知子iframe
  const handle_replay_video_loaded = (e) => {
    // TODO:  get_is_hengping 后续修改调整
    if (is_hengping.value) {
      const data = {
        cmd: 'full_screen_landscape',
        full_screen_landscape: 1
      }

      document.getElementById('replayIframe').contentWindow.postMessage(data, '*')

    }
  }
  /**
   * @description 切换精彩回放视频
   * @param item 目标视频信息
   * @param index 目标视频索引
   */
  const change_event_video = ({ item, index }) => {
    if (item) {
      is_replay_load_error.value = false
      iframe_rdm.value = Date.now()
      is_user_voice.value = current_event_video.value.voice
      replay_url.value = slider_events_list[index].fragmentVideo
      check_replay_url(replay_video_src.value)
      // 静音当前播放媒体
      useMittEmit(MITT_TYPES.EMIT_IFRAME_VIDEO_VOLUME, { volume: 0 })
    }

    // 滚动目标到屏幕显示区域
    nextTick(() => {
      tab_move(index, slider_video.value[0].slider_x, slider_video[0].item_wrapper, true)
    })
  }
  // 点击精彩回放视频时，控件显示状态变更
  const click_video_screen = (e) => {
    is_controller_show.value = !video_wrapper.value[0].classList.contains('dplayer-hide-controller')
  }
  /**
   * 获取精彩回放事件
   * @param {String} event_code 事件code
   */
  const get_football_replay = (event_code) => {
    const params = {
      // TODO: get_detail_data 后续修改调整
      mid: lodash.get(get_detail_data.value, 'mid'),
      device: 'H5',
      eventCode: event_code
    }
    api_analysis.post_playback_video_url(params)
      .then(res => {
        if (res.code == 200 && lodash.get(res.data, 'eventList.length')) {
          events_list.value = res.data.eventList
        }
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {

      })
  }
  // 点击播放目标回放视频（竖屏非全屏）
  const handle_click_event = (index, event) => {
    const selected_item_index = events_list_vertical.value.findIndex(item => item.eventId == event.eventId)

    // 记录当前slider信息
    curr_active_event.value = {
      video_url: event.fragmentVideo,
      event_id: event.eventId,
      slider_index: events_list_vertical.value.length - 1 - selected_item_index,
      active: 'muUrl'
    }

    is_replay_load_error.value = false
    iframe_rdm.value = Date.now()
    replay_url.value = event.fragmentVideo

    if (event_index.value == index && !is_expand.value || event_index.value !== index) {
      check_replay_url(replay_video_src.value)
    }
    // 开启视频
    
    // 收起、展开列表
    if (event_index.value == index) {
      is_expand.value = !is_expand.value
    } else {
      event_index.value = index
      is_expand.value = false
      nextTick(() => {
        is_expand.value = true
        is_user_voice.value = current_event_video.value.voice


        // 静音当前播放媒体
        useMittEmit(MITT_TYPES.EMIT_IFRAME_VIDEO_VOLUME, { volume: 0 })
      })

    }

    // 延时显示底部交互按钮（声音、全屏）
    is_controller_show.value = false
    clearTimeout(is_controller_show_timer.value)
    is_controller_show_timer.value = setTimeout(() => {
      is_controller_show.value = true
    }, 300)
  }
  /**
   * @Description 设置全屏
   * @param {undefined} undefined
   */
  const set_full_screen = () => {
    let data = {}
    if (is_full_screen.value) {
      is_full_screen.value = false
      is_dp_video_full_screen.value = false

      is_hengping.value = false
      exit_browser_full_screen()
      if(lodash.get(window,'screen.orientation.unlock')){
        window.screen.orientation.unlock()
      } 
      is_expand_video_list.value = false

      data = {
        cmd: 'full_screen_portrait',
        full_screen_portrait: 0
      }
    } else {
      is_full_screen.value = true
      is_dp_video_full_screen.value = true

      // is_hengping.value = true
      browser_full_screen()
      if(lodash.get(window,'screen.orientation.lock')){
        window.screen.orientation.lock('landscape')
      }
      data = {
        cmd: 'full_screen_portrait',
        full_screen_portrait: 1
      }
    }
    document.getElementById('replayIframe').contentWindow.postMessage(data, '*')
  }
  // 更新slider信息
  const update_slider_index = () => {
    clearTimeout(update_slider_index_time.value)
    update_slider_index_timer.value = setTimeout(() => {
      tabs.value[0].tab_index = tabIndex
      slider_video.value[0].handle_item_click(null, curr_active_event.value.slider_index)
    }, 50)

  }
  // （精彩/收起）回放按钮点击处理
  const toggle_slider_btn = () => {
    update_variable_event_n()
    is_expand_video_list.value = !is_expand_video_list.value
  }
  // 更新event_n变量值
  const update_variable_event_n = () => {
    if (is_slider_in_screen) {
      // 若橫屏下，slider列表长度小于屏幕横屏宽度，则设置动态属性--event_n，用于slider列表居中计算
      document.documentElement.style.setProperty('--event_n', slider_events_list.length)
    }
  }
  /**
   * @Description 浏览器全屏
   * @param {undefined} undefined
   */
  const browser_full_screen = () => {
    let video_dm = document.documentElement;
    let rfs = video_dm.requestFullscreen || video_dm.webkitRequestFullScreen || video_dm.mozRequestFullScreen || video_dm.msRequestFullScreen;
    if (rfs) {
      rfs.call(video_dm);
    }
  }
  // 退出精彩回放视频
  const close_video = () => {
    is_dp_video_full_screen.value = false
    is_full_screen.value = !is_full_screen.value
    is_expand_video_list.value = false
    is_replay_load_error.value = false
  }
  /**
   * @Description 设置视频声音
   * @param {undefined} undefined
   */
  const set_video_voice = () => {
    current_event_video.value.voice = !current_event_video.value.voice
    const data = {
      cmd: 'replay_volume_video',
      volume: current_event_video.value.voice ? 1 : 0
    }
    document.getElementById('replayIframe').contentWindow.postMessage(data, '*')
  }
  // 控制info弹窗说明
  const change_info = () => {
    set_info_show(true)
  }
  /**
   * @Description 退出浏览器全屏
   * @param {undefined} undefined
   */
  const exit_browser_full_screen = () => {
    let video_dm = document;
    let cfs = video_dm.cancelFullscreen || video_dm.webkitCancelFullScreen || video_dm.mozCancelFullScreen || video_dm.exitFullscreen;
    if (cfs) {
      cfs.call(video_dm);
    }
  }
  // 精彩回播配置信息
  watch(() => UserCtr.user_info.merchantEventSwitchVO, (res) => {
    // handler = (res) => {
    // tab按钮开关
    // TODO:  国际化后续修改调整
    let new_tab_list = [
      { title: i18n_t('footer_menu.all'), code: '0' },
      { title: i18n_t('match_result.goal'), code: '1' },
    ]
    if (res && res.cornerEvent) {
      new_tab_list.push({ title: i18n_t('match_result.corner_kick'), code: '2' })
    }
    if (res && res.penaltyEvent) {
      new_tab_list.push({ title: i18n_t('football_playing_way.penalty_cards'), code: '3' })
    }
    tab_list.value = new_tab_list
  }, {immediate: true})
  // 更新实时时间
  // watch(() => get_match_real_time, (time) => {
  //   real_time.value = time
  // })
  // 更新slider选中索引
  watch(() => is_expand_video_list.value, (is_expand) => {
    if (is_expand) {
      update_slider_index()
    }
  })
  // 横屏、竖屏切换时通知子iframe
  watch(() => is_hengping.value, (is_hengping) => {
    if (is_hengping) {
      const data = {
        cmd: 'full_screen_landscape',
        full_screen_landscape: 1
      }
      document.getElementById('replayIframe').contentWindow.postMessage(data, '*')
    } else {
      const data = {
        cmd: 'full_screen_portrait',
        full_screen_portrait: 1
      }
      document.getElementById('replayIframe').contentWindow.postMessage(data, '*')
    }
  })
  // 事件列表（非全屏）
  const events_list_vertical = computed(() => {
    const curr_tab_index = tabEvenCode.value
    console.log(events_list.value, "events_list====");
    let new_events_list
    if (curr_tab_index == 0) {
      new_events_list = lodash.cloneDeep(events_list.value)
    } else if (curr_tab_index == 1) {
      new_events_list = events_list.value.filter(item => item.eventCode == 'goal')
    } else if (curr_tab_index == 2) {
      new_events_list = events_list.value.filter(item => item.eventCode == 'corner')
    } else {
      new_events_list = events_list.value.filter(item => !['goal', 'corner'].includes(item.eventCode))
    }
    new_events_list.sort((a, b) => {
      if (b.secondsFromStart < a.secondsFromStart) {
        return 1
      } else if (b.secondsFromStart > a.secondsFromStart) {
        return -1
      }
      if (b.firstNum < a.firstNum) {
        return 1
      } else if (b.firstNum > a.firstNum) {
        return -1
      }
      return 0
    })

    // 无相应类型事件时返回
    if (is_hengping.value && !new_events_list.length) {
      return [{}]
    }
    return new_events_list.reverse()
  })
  // 事件列表（全屏）
  const slider_events_list = computed(() => {
    return lodash.cloneDeep(events_list_vertical.value).reverse()
  })
  // 鉴权域名 + 回放视频url（拼接后的最终url）
  const replay_video_src = computed(() => {
    const host_url = lodash.get(window, 'BUILDIN_CONFIG.live_domains[0]') || lodash.get(UserCtr, 'user_info.oss.live_h5')
    return `${host_url}/videoReplay.html?src=${replay_url.value}&lang=${UserCtr.lang}&volume=${is_user_voice ? 1 : 0}`
  })
  // slider列表长度是否小于屏幕横屏宽度
  const is_slider_in_screen = computed(() => {
    const full_screen_width = is_hengping.value ? innerWidth : innerHeight
    const font_size = (is_hengping.value ? innerHeight : innerWidth) * 100 / 375

    return slider_events_list.length * Math.ceil(1.44 * font_size) < full_screen_width
  })

  const change_bureau_tabs = (value) => {
    bureau_active.value = value;
  }

  const toPlay = function(index,replay){
    exit_browser_full_screen()
    const replayData = {
      item: replay,
      index
    }
    ChangeVideoKind(replayData)
  }

  onUnmounted(() => {
      clearInterval(get_football_replay_timer.value)
      get_football_replay_timer.value = null
      clearTimeout(update_slider_index_timer.value)
      update_slider_index_timer.value = null
      clearTimeout(is_controller_show_timer.value)
      is_controller_show_timer.value = null
      clearTimeout(is_replay_load_error_timer.value)
      is_replay_load_error_timer.value = null
      is_dp_video_full_screen.value = false
      window.removeEventListener("message", handleMessage);
  })
  return {
    get_football_replay_timer,
    update_slider_index_timer,
    is_controller_show_timer,
    is_replay_load_error_timer,
    wonderful_tabs,
    wonderful_active,
    wonderfulListRef,
    change_event_active,
    bureau_tabs,
    change_bureau_tabs,
    bureau_active,
    event_active,
    // 锚点
    events_scroller,
    change_wonderful_active,
    tabs,
    slider_video,
    // TODO:待调试处理
    slider_x,
    item_wrapper,
    video_wrapper,
    // 事件类型菜单选项
    tab_list,
    // 当前选中事件类型
    tabIndex,
    tabEvenCode,
    // 事件列表
    events_list,
    // 事件列表选中索引
    event_index,
    // 目标事件列表是否展开
    is_expand,
    // 当前播放视频信息
    current_event_video,
    // 用户是否控制开启声音
    is_user_voice,
    // 当前选中的slider信息(全屏)
    curr_active_event,
    // 是否是全屏
    is_full_screen,
    // 是否展示slider列表(全屏)
    is_expand_video_list,
    // 是否显示控件
    is_controller_show,
    // 实时时间（赛事进行中）
    real_time,
    // 精彩回放视频url
    replay_url,
    // 精彩回放视频是否加载失败
    is_replay_load_error,
    // 精彩回放视频增加随机数
    iframe_rdm,
    is_hengping,
    get_detail_data,
    menu_type,
    //=============
    is_slider_in_screen,
    replay_video_src,
    slider_events_list,
    events_list_vertical,
    i18n_t,
    i18n_tc,
    //================
    exit_browser_full_screen,
    change_info,
    set_video_voice,
    close_video,
    browser_full_screen,
    toggle_slider_btn,
    update_slider_index,
    set_full_screen,
    handle_click_event,
    get_football_replay,
    click_video_screen,
    change_event_video,
    handle_replay_video_loaded,
    event_name,
    flag_icon,
    get_video_list,
    tab_click,
    trans_num,
    check_replay_url,
    handleMessage,
    format_total_score,
    LOCAL_PROJECT_FILE_PREFIX,
    toPlay
  }
}
}



  // TODO: 后续修改调整
  //   ...mapGetters([
  //     'get_detail_data',
  //     'get_menu_type',
  //     'get_is_full_screen',
  //     'get_match_real_time',
  //     'get_lang',
  //   ]),

</script>

<style scoped lang="scss">
@import '../styles/highlights.scss';
</style>
