<template>
  <div class="highlights analysis-odds">
    <!-- tab菜单 -->
    <div class="heade-wrapper" :class="[{'is-result-details': get_menu_type === 28}, {'is-hidden': is_full_screen}]" v-if="lodash.get(get_detail_data, 'csid') == 1">
      <div class="heade">
        <span v-for="(item,i) in tab_list" :key="i"
              :class="['ellipsis', {'is-active' : tabIndex == i}]"
              @click="tab_click(item, i)"
        >
          {{ item.title }}
        </span>
      </div>
    </div>

    <div v-if="events_list.length" class="events-scroller" ref="events_scroller">
      <div class="events-list">

        <!-- 赛果详情页显示内容 -->
        <template v-if="get_menu_type === 28">
          <div class="row game-over">
            <div class="time-line half-line"></div>
            <div class="dot-game-over"></div>
            <div class="item-flag icon-flag-game-over"></div>
            <div class="item-content real-time-contv-ifent hairline-border">
              <!-- <span class="time">{{ lodash.get(get_detail_data, 'mststr', 0) | format_mgt_time}}</span> -->
              <span class="time" v-if="get_detail_data.mmp==31">{{ $root.$t('mmp.1.31') }}</span>
              <span class="time" v-else>{{ lodash.get(get_detail_data, 'mststr', 0) | format_mgt_time}}</span>
              <span class="score">[{{ get_detail_data | format_total_score(0) }}-{{ get_detail_data | format_total_score(1) }}]</span>
              <span class="text">{{ $root.$t('match_info.match_over') }}</span>
            </div>
          </div>
        </template>

        <!-- 常规详情页显示内容 -->
        <template v-else>
          <div class="row real-time">
            <div class="time-line half-line"></div>
            <div class="dot-real-time"></div>
            <div class="item-flag item-flag-real-time"></div>
            <div class="item-content real-time-content hairline-border">
              <span class="time" v-if="get_detail_data.mmp==31">{{ $root.$t('mmp.1.31') }}</span>
              <span class="time" v-else>{{ real_time }}</span>
              <span class="score">[{{ get_detail_data | format_total_score(0) }}-{{ get_detail_data | format_total_score(1) }}]</span>
              <span class="text" >{{ $root.$t('msc.S1') }}</span>
            </div>
          </div>
        </template>

        <!-- 精彩回放列表 -->
        <div class="row" v-for="(event, i) in events_list_vertical" :key="i">
          <div class="time-line"></div>
          <div class="time-line-ball"></div>
          <div :class="['item-flag', flag_icon(event.eventCode)]"></div>
          <div class="item-content hairline-border"  @click="handle_click_event(i, event)">
            <span class="time">{{ +event.secondsFromStart | format_mgt_time }}</span>
            <span class="score">[{{ event.t1 }}-{{ event.t2 }}]</span>
            <div class="text-wrapper">
              <!-- 点球大战 -->
              <div class="text-scroller" v-if="event.matchPeriodId==50">
                <span class="text" v-scroll-text>{{$root.$t('mmp')[1][event.matchPeriodId]}}</span>
              </div>
              <!-- 加时赛 -->
              <div class="text-scroller" v-else-if="event.matchPeriodId==41||event.matchPeriodId==42">
                <span class="text" v-scroll-text>{{$root.$t('mmp')[2][40]}} {{event.homeAway}} {{$root.$t(`highlights.event_type.${event.eventCode}`, {X: trans_num(event.firstNum)})}}</span>
              </div>
              <div class="text-scroller" v-else>
                <span class="text" v-scroll-text>{{event.homeAway}} {{$root.$t(`highlights.event_type.${event.eventCode}`, {X: trans_num(event.firstNum)})}}</span>
                <!--<span class="text">{{event.homeAway}} {{$root.$t(`highlights.event_type.${event.eventCode}`, {X: trans_num(event.firstNum)})}}</span>-->
              </div>
            </div>
            <i class="icon icon-replay-red"></i>
          </div>

          <div
              v-show="i === event_index"
              class="replay-wrapper"
              :class="[
                i === event_index && is_expand ? 'expand' : 'expand pack-up',
                {
                  'full-screen-replay-wrapper': get_is_hengping,
                  'full-screen-portrait': is_full_screen && !get_is_hengping,
                }
              ]">
            <div class="load-error-mask" v-show="is_expand && is_replay_load_error">
              <div><img src="image/bw3/svg/details/reconnect.svg" /></div>
              <div>{{ $root.$t('highlights.reconnect') }}</div>
            </div>

            <!-- 精彩回放视频iframe -->
            <iframe
                v-if="i === event_index && is_expand"
                v-show="!is_replay_load_error"
                id="replayIframe"
                :src="replay_video_src+'&rdm='+iframe_rdm"
                style="width:100%;height:100%;"
                allow="autoplay"
                frameborder="0"
                scrolling="no"
                @load="handle_replay_video_loaded"
            ></iframe>

            <template v-if="i === event_index && is_expand">
              <div v-show="is_controller_show" class="event-title-wrapper" :class="{'is-full-screen': is_full_screen}">
                <!-- 事件title -->
                <div class="event-title">{{event.homeAway}} {{$root.$t(`highlights.event_type.${event.eventCode}`, {X: event.firstNum})}}</div>
                <!-- 主客队比分 -->
                <div class="home-away-score-wrapper">
                  <team-img :type="0" :csid="lodash.get(get_detail_data, 'csid')" :url="lodash.get(get_detail_data, 'mhlu[0]')" :fr="get_menu_type != 3000 ? lodash.get(get_detail_data, 'frmhn[0]'): lodash.get(get_detail_data, 'frmhn')" :size="13"></team-img>
                  <div class="score">
                    <span>{{ event.t1 }}</span>
                    <span class="colon">:</span>
                    <span>{{ event.t2 }}</span>
                  </div>
                  <team-img :type="0" :csid="lodash.get(get_detail_data, 'csid')" :url="lodash.get(get_detail_data, 'malu[0]')" :fr="get_menu_type != 3000 ? lodash.get(get_detail_data, 'frman[0]'): lodash.get(get_detail_data, 'frman')" :size="13"></team-img>
                </div>
              </div>


              <!-- 顶部title、比分 -->
              <title-x v-if="get_is_hengping && is_controller_show" @handle_callback="close_video"></title-x>

              <!-- 精彩回放事件类型切换 -->
              <tab v-show="is_expand_video_list" :tabs="tab_list" @click="get_video_list" ref="tabs" :isChange="true"></tab>

              <!-- 精彩回放视频滚动列表 -->
              <slider-x
                v-if="get_is_hengping"
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
                  <div class="event-time">{{ +slotProps.item.secondsFromStart | format_mgt_time }}</div>
                </template>
              </slider-x>

              <!-- 回放视频标识logo -->
              <div class="replay-logo-wrap" v-if="is_full_screen">
                <img src="image/bw3/svg/details/replay_logo.svg" />
              </div>

              <template v-if="get_is_hengping">
                <!--（精彩/收起）回放 -->
                <div class="toggle-replay-video-wrap hairline-border" :class="{'move-up': is_expand_video_list}" @click="toggle_slider_btn">
                  <img src="image/bw3/svg/details/replay_toggle.svg" />
                  <span>{{ !is_expand_video_list ? $root.$t('highlights.title') : $root.$t('highlights.collapse_replay') }}</span>
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
                <!--<div v-show="!get_is_hengping" class="tips-wrap" @click="change_info">-->
                <!--  <img src="image/bw3/svg/details/tips.svg" />-->
                <!--</div>-->
                <!-- 全屏按钮 -->
                <div class="full-screen-btn" @click="set_full_screen">
                  <img v-if="is_full_screen"  src="image/bw3/svg/pack_up.svg">
                  <img v-else  src="image/bw3/svg/full_screen.svg">
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- 赛事开始展示视图 -->
        <div class="row game-start">
          <div class="time-line half-line"></div>
          <div class="dot-game-start"></div>
          <div class="item-flag icon-flag-game-start"></div>
          <div class="item-content">
            <span class="time">00:00</span>
            <span class="score">[0-0]</span>
            <span class="text">{{ $root.$t('game.start') }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// import {mapGetters, mapMutations} from "vuex";
import { 
  ref, 
  onMounted, 
  computed, 
  onUnmounted, 
  nextTick, 
  watch
} from 'vue'
import loadsh from 'lodash'
// TODO: 后续修改调整
import {api_common, api_result} from "src/project/api/index.js";
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"

// components: {
  // 队标视图
    let teamImg = defineAsyncComponent(() => import("src/project/components/details/team_img.vue"))
    // 全屏播放时，顶部title 
    let titleX = defineAsyncComponent(() => import("src/project/pages/details/analysis-matches/components/title_x.vue"))  
     // 事件类型菜单
    let tab = defineAsyncComponent(() => import("src/project/pages/details/analysis-matches/components/tabs.vue"))  
    // 精彩回放视频滚动列表
    let sliderX= defineAsyncComponent(() => import("src/project/pages/details/analysis-matches/components/slider_x.vue"))   
  // }

  directives(
    // 对阵文案过长时，无限滚动展示
    scroll-text, {
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
    })
    

    // 定时器
    let get_football_replay_timer = ref(null)
    let update_slider_index_timer = ref(null)
    let is_controller_show_timer = ref(null)
    let is_replay_load_error_timer = ref(null)
    // 锚点
    let events_scroller = ref(null)
    let tabs = ref(null)
    let slider_video = ref(null)
    let slider_x = ref(null)
    let item_wrapper = ref(null)
    let video_wrapper = ref(null)
    // 事件类型菜单选项
    let tab_list = ref([])
    // 当前选中事件类型
    let tabIndex = ref(0)
    let tabEvenCode = ref(0)
    // 事件列表
    let events_list = ref([])
    // 事件列表选中索引
    let event_index = ref(0)
    // 目标事件列表是否展开
    let is_expand = ref(false)
    // 当前播放视频信息
    let current_event_video = ref({
        totalTime: 0,
        voice: true,
        status: 0,
      })
    // 用户是否控制开启声音
    let is_user_voice = ref(true)
    // 当前选中的slider信息(全屏)
    let curr_active_event = ref({
        video_url: '',
        event_id: '',
        slider_index: 0,
      })
    // 是否是全屏
    let is_full_screen = ref(false)
    // 是否展示slider列表(全屏)
    let is_expand_video_list = ref(false)
    // 是否显示控件
    let is_controller_show = ref(true)
    // 实时时间（赛事进行中）
    let real_time = ref('00:00')
    // 精彩回放视频url
    let replay_url = ref('http://localhost:3000/replay.mp4')
    // 精彩回放视频是否加载失败
    let is_replay_load_error = ref(false)
    // 精彩回放视频增加随机数
    let iframe_rdm = ref('')
    // TODO: $utils 后续修改调整
    $utils.load_player_js()
    // TODO: set_event_list 后续修改调整
    // set_event_list([])

    // 监听iframe传来的消息
    window.addEventListener("message", handleMessage);

    // 接收到子iframe消息后，做相应处理
    const handleMessage = (e) => {
      const data = e.data;

      switch (data.cmd) {
        case 'icon':
          is_controller_show = data.val
          break;
      }
    }
    // 检测精彩回放视频资源加载状态
    const check_replay_url = (url) => {
      // TODO: api_common 后续修改调整
      api_common.get_full_url(url)
        .then((v) => {
          console.log('精彩回放视频加载成功...')
          is_replay_load_error = false
        })
        .catch(err => {
          console.error('精彩回放视频加载失败...')
          clearTimeout(is_replay_load_error_timer)
          is_replay_load_error_timer = setTimeout(() => {
            is_replay_load_error = true
          }, 200)
        })
    }
    // 第X个——英文下转换
    const trans_num = (num) => {
      let suffix = ''
      // TODO: get_lang 后续修改调整
      if (get_lang === 'en') {
        if (num === 1) {
          suffix = 'st'
        } else if (num === 2) {
          suffix = 'nd'
        } else if (num === 3 ) {
          suffix = 'rd'
        } else {
          suffix = 'th'
        }
      }
      return num + suffix
    }
    // 菜单切换后，更新相应状态
    const tab_click = (item, i) => {
      if(tabIndex === i) return
      
      tabIndex = i
      tabEvenCode = Number(item.code)
      if (!is_full_screen) {
        is_expand = false
      }
    }
    // 横屏下精彩回放的事件tab切换
    const get_video_list = ({tab, index}) => {
      tabEvenCode = index
      tabIndex  = index
      tabs[0].changeTabIndex(index)
    }
    // 精彩回放列表显示'的图标
    const flag_icon = (type) => {
      let flag
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
      let event_name
      switch (type) {
        // 进球
        // TODO: 国际化后续修改调整
        case 'goal': 
        event_name = $root.$t('highlights.type.goal'); 
        break;  
        // 角球
        case 'corner': 
        event_name = $root.$t('highlights.type.corner'); 
        break;  
        // 红牌
        case "red_card": 
        event_name = $root.$t('highlights.type.card_red'); 
        break;
        // 黄牌  
        case "yellow_card": 
        event_name = $root.$t('highlights.type.card_yellow'); 
        break; 
        // 黄红牌 
        case "yellow_red_card": 
        event_name = $root.$t('highlights.type.card_yellow_red'); 
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
      if (get_is_hengping) {
        const data = {
          cmd: 'full_screen_landscape',
          full_screen_landscape: 1
        }

        document.getElementById('replayIframe').contentWindow.postMessage(data,'*')

      }
    }
    /**
     * @description 切换精彩回放视频
     * @param item 目标视频信息
     * @param index 目标视频索引
     */
    const change_event_video = ({item, index}) => {
      if (item) {
        is_replay_load_error = false
        iframe_rdm = Date.now()
        is_user_voice = current_event_video.voice
        replay_url = slider_events_list[index].fragmentVideo
        check_replay_url(replay_video_src)
        // 静音当前播放媒体
        useMittEmit(MITT_TYPES.IFRAME_VIDEO_VOLUME, {volume:0})
      }

      // 滚动目标到屏幕显示区域
      // TODO: $utils 后续修改调整
      nextTick(()=>{
        $utils.tab_move(index, slider_video[0].slider_x, slider_video[0].item_wrapper, true)
      })
    }
    // 点击精彩回放视频时，控件显示状态变更
    const click_video_screen = (e) => {
      is_controller_show = !video_wrapper[0].classList.contains('dplayer-hide-controller')
    }
    /**
     * 获取精彩回放事件
     * @param {String} event_code 事件code
     */
    const get_football_replay = (event_code) => {
      const params = {
        // TODO: get_detail_data 后续修改调整
        mid: loadsh.get(get_detail_data, 'mid'),
        device: 'H5',
        eventCode: event_code
      }
      api_result.get_replay_football(params)
        .then(res => {
          if (res.code == 200 && loadsh.get(res.data, 'eventList.length')) {
            events_list = res.data.eventList
            // TODO: 后续修改调整 set_event_list
            set_event_list(res.data.eventList)
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
      const selected_item_index = events_list_vertical.findIndex(item => item.eventId === event.eventId)

      // 记录当前slider信息
      curr_active_event = {
        video_url: event.fragmentVideo,
        event_id: event.eventId,
        slider_index: events_list_vertical.length - 1 - selected_item_index
      }

      is_replay_load_error = false
      iframe_rdm = Date.now()
      replay_url = event.fragmentVideo

      if (event_index === index && !is_expand || event_index !== index) {
        check_replay_url(replay_video_src)
      }

      // 收起、展开列表
      if (event_index === index) {
        is_expand = !is_expand
      } else {
        event_index = index
        is_expand = false
        nextTick(() => {
          is_expand = true
          is_user_voice = current_event_video.voice


          // 静音当前播放媒体
          useMittEmit(MITT_TYPES.IFRAME_VIDEO_VOLUME, {volume:0})
        })

      }

      // 延时显示底部交互按钮（声音、全屏）
      is_controller_show = false
      clearTimeout(is_controller_show_timer)
      is_controller_show_timer = setTimeout(() => {
        is_controller_show = true
      },300)
    }
    /**
     * @Description 设置全屏
     * @param {undefined} undefined
     */
    const set_full_screen = () => {
      let data = {}
      if (is_full_screen) {
        // TODO: 后续修改调整  set_event_list  set_event_list set_is_hengping
        set_is_full_screen(false)
        set_is_dp_video_full_screen(false)

        set_is_hengping(false)
        exit_browser_full_screen()
        screen.orientation && screen.orientation.unlock()

        is_expand_video_list = false

        data = {
          cmd: 'full_screen_portrait',
          full_screen_portrait: 0
        }
      } else {
        set_is_full_screen(true)
        set_is_dp_video_full_screen(true)

        set_is_hengping(true)
        browser_full_screen()
        screen.orientation && screen.orientation.lock('landscape')

        data = {
          cmd: 'full_screen_portrait',
          full_screen_portrait: 1
        }
      }
      is_full_screen = !is_full_screen


      document.getElementById('replayIframe').contentWindow.postMessage(data,'*')
    }
    // 更新slider信息
    const update_slider_index = () => {
      clearTimeout(update_slider_index_timer)
      update_slider_index_timer = setTimeout(() => {
        tabs[0].tab_index = tabIndex
        slider_video[0].handle_item_click(null, curr_active_event.slider_index)
      }, 50)

    }
    // （精彩/收起）回放按钮点击处理
    const toggle_slider_btn = () => {
      update_variable_event_n()
      is_expand_video_list = !is_expand_video_list
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
      // set_is_full_screen(false)
      // set_is_dp_video_full_screen(false)
      is_full_screen = !is_full_screen
      is_expand_video_list = false
      is_replay_load_error = false
    }
    /**
     * @Description 设置视频声音
     * @param {undefined} undefined
     */
    const set_video_voice = () => {
      current_event_video.voice = !current_event_video.voice
      const data = {
        cmd: 'replay_volume_video',
        volume: current_event_video.voice ? 1 : 0
      }
      document.getElementById('replayIframe').contentWindow.postMessage(data,'*')
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
      if(cfs) {
        cfs.call(video_dm);
      }
    }
    // 精彩回播配置信息
    watch(() => get_user.merchantEventSwitchVO, (res) => {
      // handler = (res) => {
        // tab按钮开关
        // TODO:  国际化后续修改调整
        let new_tab_list = [
          {title: $root.$t('footer_menu.all'), code: '0'},
          {title: $root.$t('match_result.goal'), code: '1'},
        ]
        if (res.cornerEvent) {
          new_tab_list.push({title: $root.$t('match_result.corner_kick'), code: '2'})
        }
        if (res.penaltyEvent) {
          new_tab_list.push({title: $root.$t('football_playing_way.penalty_cards'), code: '3'})
        }
        tab_list = new_tab_list
      // }
      // immediate: true
    })
    // 更新实时时间
    watch(() => get_match_real_time, (time) => {
      real_time = time
    })
    // 更新slider选中索引
    watch(() => is_expand_video_list, (is_expand) => {
      if (is_expand) {
        update_slider_index()
      }
    })
    // 横屏、竖屏切换时通知子iframe
    watch(() => get_is_hengping, (is_hengping) => {
      if (is_hengping) {
        const data = {
          cmd: 'full_screen_landscape',
          full_screen_landscape: 1
        }
        document.getElementById('replayIframe').contentWindow.postMessage(data,'*')
      } else {
        const data = {
          cmd: 'full_screen_portrait',
          full_screen_portrait: 1
        }
        document.getElementById('replayIframe').contentWindow.postMessage(data,'*')
      }
    })
  // onMounted(() => {
    // 事件列表（非全屏）
  const events_list_vertical = computed(() => {
      const curr_tab_index = tabEvenCode
      let new_events_list
      if (curr_tab_index === 0) {
        new_events_list = loadsh.cloneDeep(events_list)
      } else if (curr_tab_index === 1) {
        new_events_list = events_list.filter(item => item.eventCode === 'goal')
      } else if (curr_tab_index === 2) {
        new_events_list = events_list.filter(item => item.eventCode === 'corner')
      } else {
        new_events_list = events_list.filter(item => !['goal', 'corner'].includes(item.eventCode))
      }
      new_events_list.sort((a, b)=>{
        if(b.secondsFromStart < a.secondsFromStart){
          return 1
        }else if(b.secondsFromStart > a.secondsFromStart){
          return -1
        }
        if(b.firstNum<a.firstNum){
          return 1
        }else if(b.firstNum>a.firstNum){
          return -1
        }
        return 0
      })

      // 无相应类型事件时返回
      // TODO:  get_is_hengping 后续修改调整
      if (get_is_hengping && !new_events_list.length) {
        return [{}]
      }
      return new_events_list.reverse()
    })
    // 事件列表（全屏）
  const slider_events_list = computed(() => {
      return loadsh.cloneDeep(events_list_vertical).reverse()
    })
    // 鉴权域名 + 回放视频url（拼接后的最终url）
  const replay_video_src = computed(() => {
      // TODO:  get_user  get_lang 后续修改调整
      const host_url = window.env.config.live_domains[0] || loadsh.get(get_user,'oss.live_h5')
      return `${host_url}/videoReplay.html?src=${replay_url}&lang=${get_lang}&volume=${is_user_voice ? 1 : 0}`
    })
    // slider列表长度是否小于屏幕横屏宽度
  const is_slider_in_screen = computed(() => {
      // TODO:  get_is_hengping 后续修改调整
      const full_screen_width = get_is_hengping ? innerWidth : innerHeight
      const font_size = (get_is_hengping ? innerHeight : innerWidth) * 100 / 375

      return slider_events_list.length * Math.ceil(1.44 * font_size) < full_screen_width
    })
  // })
  onMounted(() => {
    if (events_scroller) {
      // TODO: $utils 后续修改调整
      // events_scroller.style.minHeight = window.innerHeight - $utils.rem(1.94) + 'px';
    }

    // 每隔1分钟请求一次精彩回放接口
    get_football_replay(0)
    clearInterval(get_football_replay_timer)
    get_football_replay_timer = setInterval(() => {
      get_football_replay(0)
    }, 60 * 1000)
  })
  onUnmounted(() => {
    clearInterval(get_football_replay_timer)
    get_football_replay_timer = null
    clearTimeout(update_slider_index_timer)
    update_slider_index_time = null
    clearTimeout(is_controller_show_timer)
    is_controller_show_timer = null
    clearTimeout(is_replay_load_error_timer)
    is_replay_load_error_timer = null
    // TODO: set_is_dp_video_full_screen 后续修改调整
    // set_is_dp_video_full_screen(false)
    window.removeEventListener("message", handleMessage);
  })

  // TODO: 后续修改调整
  //   ...mapGetters([
  //     'get_detail_data',
  //     'get_menu_type',
  //     'get_is_hengping',
  //     'get_is_full_screen',
  //     'get_is_dp_video_full_screen',
  //     'get_match_real_time',
  //     'get_user',
  //     'get_lang',
  //   ]),
    
</script>

<style scoped lang="scss">
.highlights{
  position: relative;
  z-index: 100;
}
.heade-wrapper {
  width: 100%;
  height: auto;
  margin: 0 auto;
  position: sticky;
  top: 1.22rem;
  padding: 0.2rem 0.48rem;
  z-index: 15;
  &.is-result-details {
    top: 1.62rem;
  }
  &.no-z-index {
    z-index: 0;
  }
  &.is-hidden{
    display: none;
  }
  .heade {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.08rem;

    &::after {
      content: "";
      pointer-events: none;
      position: absolute;
      left: 0;
      top: 0;
      border: 1px solid var(--q-color-border-color-25);
      border-radius: 0.16rem;
      width: 200%;
      height: 200%;
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
      -webkit-transform-origin: left top;
      transform-origin: left top;
    }

    > span {
      height: 0.3rem;
      line-height: 0.3rem;
      flex: 1;
      letter-spacing: 0;
      text-align: center;
      font-size: 0.14rem;
      border-radius: 0.08rem;
      padding: 0 .15rem;

      &:not(:first-child) {
        position: relative;

        &:before {
          content: '';
          width: 0.01rem;
          height: 0.14rem;
          position: absolute;
          left: 0;
          top: 0.08rem;
        }

        &.is-active {
          &::before {
            display: none;
          }
        }
      }

      &.is-active {
        height: 0.29rem;
        border-radius: 0.08rem;
      }
    }
  }
}

.events-list {
  width: 100%;
  //height: 3.85rem;
  padding: 0 .16rem 0 .19rem;
  overflow-y: auto;

  .row {
    position: relative;
    align-items: center;
    .dot-game-start, .dot-real-time, .dot-game-over {
      position: absolute;
      left: -.015rem;
      top: 50%;
      transform: translateY(-50%);
      width: .04rem;
      height: .04rem;
      border-radius: 50%;
      z-index: 10;
    }
    .time-line {
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
      height: .55rem;
    }
    .time-line-ball {
      position: absolute;
      left: -.03rem;
      top: calc(0.55rem / 2 - 0.07rem / 2);
      width: 0.07rem;
      height: 0.07rem;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      z-index: 10;
    }
    &.real-time, &.game-over {
      .time-line {
        top: 50%;
        height: 0.55rem;
        z-index: 9;
      }
    }
    &.game-start {
      .time-line {
        height: calc(0.55rem / 2);
      }
    }

    .replay-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-left: .1rem;
      transition: height .3s ease-in-out;
      &.expand {
        height: 1.85rem;
        border-left: 1px solid var(--q-color-page-bg-color-50);

        .video-wrapper {
          width: 100%;
          height: 100%;
          background: var(--q-color-com-bg-color-5);

          ::v-deep {
            .dplayer-icons-right {
              display: none !important;
            }
            .dplayer-controller {
              .dplayer-bar-wrap {
                width: 1.52rem;
                bottom: 15.5px;
                left: .35rem;
              }
              .dplayer-icons {
                bottom: 2px;
                left: calc(1.75rem + 0.15rem);
                transform: scale(0.8);
              }
            }
          }
        }
      }
      &.pack-up {
        height: 0;
      }
      &.full-screen-replay-wrapper {
        position: fixed;
        bottom: 0;
        left: 0;
        height: 3.75rem;
        padding-left: 0;
        z-index: 999;

        .video-wrapper {

          ::v-deep {
            .dplayer-controller {
              .dplayer-bar-wrap {
                left: .64rem;
                width: 4.5rem;
              }
              .dplayer-icons {
                left: calc(5.14rem + 0.1rem);
              }
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
          top: 0.4rem;
          left: 0.25rem;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100000;
        }
        .close-video-wrap {
          position: absolute;
          top: 0.4rem;
          right: 0.25rem;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100000;
        }
        .voice-wrap {
          left: .31rem;
          z-index: 100000;
        }
        .full-screen-btn {
          right: .35rem;
          z-index: 100000;
        }

        ::v-deep {
          .tabs-wrapper {
            position: absolute;
            bottom: 1.18rem;
            left: 0.3rem;
            z-index: 100000;
          }
          .slider-x {
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
              background: #333;
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
        .load-error-mask {
          width: 100%;
          height: 100%;
        }
      }
      &.full-screen-portrait {
        padding-left: 0;
        position: fixed;
        width: 100%;
        height: 100% !important;
        z-index: 9999;
        left: 0;
        top: 0;
        background-color: var(--q-color-com-bg-color-37);
        .video-wrapper {

          ::v-deep {
            .dplayer-controller {
              bottom: .15rem;
              .dplayer-bar-wrap {
                left: .58rem;
              }
              .dplayer-icons {
                left: calc(2rem + 0.15rem);
              }
            }
          }
        }

        .replay-logo-wrap {
          position: absolute;
          top: 50%;
          left: 0.4rem;
          transform: translateY(calc(-50% - 0.6rem));
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100000;
          img{
            width: 0.5rem;
          }
        }

        .bottom-controller-bar {
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

        .load-error-mask {
          width: 100%;
          height: 100%;
        }
      }

      .load-error-mask {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: absolute;
        width: calc(100% - 0.1rem);
        height: 1.85rem;
        color: var(--q-color-com-fs-color-8);
      }

      .event-title-wrapper {
        position: absolute;
        top: 0;
        width: calc(100% - 0.1rem);
        height: 0.44rem;
        color: var(--q-color-com-fs-color-8);
        z-index: 9;
        box-shadow: var(--q-color-com-box-shadow-11);
        &.is-full-screen {
          width: 100%;
        }
      }
      .event-title {
        position: absolute;
        top: .08rem;
        left: .24rem;
        color: var(--q-color-com-fs-color-8);
        font-size: .12rem;
      }
      .home-away-score-wrapper {
        position: absolute;
        top: .08rem;
        right: .14rem;
        color: var(--q-color-com-fs-color-8);
        font-size: .12rem;
        display: flex;
        align-items: center;

        .score {
          margin: 0 .11rem;
          .colon {
            display: inline-block;
            margin: -0.03rem 0.03rem 0 0.03rem;
            vertical-align: middle;
          }
        }

        ::v-deep .team-img {
          width: .13rem;
          height: .13rem;
          .img-style {
            width: .13rem;
            height: .13rem;
            background-size: cover !important;
          }
        }
      }

      .voice-wrap {
        position: absolute;
        bottom: .12rem;
        left: .22rem;
        //width: 0.4rem;
        height: 0.2rem;
        display: flex;
        justify-content: center;
        align-items: center;

        svg {
          width: 0.2rem;
          height: 0.2rem;
          fill: rgba(255, 255, 255, 0.9);
        }
      }
      .tips-wrap {
        position: absolute;
        bottom: 0.15rem;
        right: 0.46rem;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 0.14rem;
          height: 0.14rem;
        }
      }
      .full-screen-btn {
        position: absolute;
        bottom: 0.15rem;
        right: 0.14rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .item-flag {
    margin: 0 .1rem;
  }
  .item-flag-real-time {
    min-width: 0.14rem;
  }
  .item-content {
    display: flex;
    align-items: center;
    flex: 1;
    height: .55rem;
    line-height: .55rem;
    span {
      margin-right: .04rem;
    }
    .text-wrapper {
      max-width: 2.2rem;
      overflow: hidden;
      .text-scroller {
        width: fit-content;
        white-space: nowrap;
        animation: seamless-scrolling linear infinite;
        .text:not(.text-move) {
          margin-right: .04rem;
        }
        ::v-deep .text {
          display: inline-block;
          margin-right: .2rem;
        }
      }
    }
    &.hairline-border::after {
      border-radius: 0;
      border-left: 0 !important;
      border-top: 0 !important;
      border-right: 0 !important;
    }
    .icon-replay-red {
      display: inline-block;
      width: 0.16rem;
      height: 0.14rem;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      vertical-align: sub;
    }
  }
  [class*=icon-flag-] {
    width: 0.14rem;
    height: 0.14rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}

@include keyframes(seamless-scrolling) {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
