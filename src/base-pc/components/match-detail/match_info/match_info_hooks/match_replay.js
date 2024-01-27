import { UserCtr ,MatchDetailCalss,MITT_TYPES,useMittOn} from "src/output/index";
import { api_details, api_analysis } from "src/api/index";
import { useMittEmit } from "src/output";
import BUILDIN_CONFIG from "app/job/output/env/index.js";

// components
import SliderX from "src/base-pc/components/match-detail/match_info/slider_x.vue"
import { TabWapper as Tabs } from "src/components/common/tab"

import { reactive, ref, watch, onBeforeMount, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

const route = useRoute()

// 精彩回放数据请求定时器
const replayDataTimer = ref(null);
const hide_replay_fullscreen_btn_timer = ref(null);

const State = reactive({
  off_mitt: null,
  media_src_temp: '', // 播放地址零时url
  is_expand_video_list: false, // 是否展示精彩回放列表
  events_list: [], // 精彩事件列表
  current_events_type: 0, // 当前精彩事件类型
  current_replay: null, // 当前重播
  tab_list: [], // 精彩回放tab筛选
  show_video_replay: false, // 是否显示精彩回播
  is_exist_media: true, // 视频播放地址是否有效存在
  is_first_time_get_history_list: true, // 是否第一次请求历史接口数据
  replay_event_id: 0, // 回播赛事event_id
  has_replay_data: false, // 回播是否有数据
  vx_play_media: MatchDetailCalss.playMedia, // 播放类型
  vx_get_user: UserCtr.getUser(), // 获取用户
  user_version: UserCtr.userVersion, // 用户类版本号
  details_data_version: MatchDetailCalss.detailsDataVersion, // 仓库版本号
})


watch(    // 监听路由变化大视频和全屏切换
  () => route.params.video_size,
  (n) => {
    // 大屏
    if (n == 1) {
      get_video_replay()
    } else {
      // 不是大屏的时候，重置回播数据
      reset_replay_data();
    }
  }
);

watch(    // 赛事ID改变
  () => match_info.mid,
  (res) => {
    // 关闭精彩回顾展开
    State.is_expand_video_list = false
    // 关闭正在重播的
    State.current_replay = null
    // 清空回放列表
    State.events_list = []
    // 获取最新回放数据
    if (this.show_video_replay) {
    // 延迟加载防止赛事组件加载慢问题
    clearTimeout(State.get_video_replay_timer);
      State.get_video_replay_timer = setTimeout(() => {
      State.has_replay_data = false
      get_video_replay()
    }, 600);
    }
  }
);

watch(    // 监听详情类的版本号
  () => details_data_version.version,
  (res) => {
    State.vx_play_media = MatchDetailCalss.play_media
  }
);

watch(    // 监听user类的版本号
  () => user_version.version,
  (res) => {
    State.vx_get_user = UserCtr.get_user()
  }
);

watch(    // 精彩回播配置信息
  () => vx_get_user.merchantEventSwitchVO,
  (res) => {
    if(!res) return
    // 开启关闭
    if(res?.eventSwitch) {
      get_video_replay()
      replayDataTimer.value && clearInterval(replayDataTimer.value)
      replayDataTimer.value = setInterval(() => get_video_replay(), 60 * 1000)
      State.show_video_replay = true
    } else {
      replayDataTimer.value && clearInterval(replayDataTimer.value)
      State.show_video_replay = false
    }

    // tab按钮开关
    let _tab_list = [
      {title: i18n_t('replay_video.all'), code: 0},
      {title:i18n_t('replay_video.goal'), code: 1},
    ]
    if (res.cornerEvent) {
      _tab_list.push({title:i18n_t('replay_video.corner_kick'), code: 2})
    }
    if (res.penaltyEvent) {
      _tab_list.push({title:i18n_t('replay_video.punish'), code: 3})
    }
    // 当角球和罚牌都没有时不显示tab
    State.tab_list = _tab_list
  }
);

watch(
  () => vx_play_media.media_type,
  () => {
    State.is_expand_video_list = false
    State.current_replay = null
    if (res === 'video') {
      get_video_replay()
      replayDataTimer.value && clearInterval(replayDataTimer.value)
      replayDataTimer.value = setInterval(() => get_video_replay(), 60 * 1000)
    } else {
      replayDataTimer.value && clearInterval(replayDataTimer.value)
    }
  }
)

/**
 * @description 切换精彩回放视频
 * @param item 目标视频信息
 */
const change_event_video = function(item) {
  let live_type =route.params.play_type

  // mp4 拼接格式
  // http://lsprelivepc.sportxxx13ky.com/videoReplay.html?src=http://test-playback.d965r6f.com/video/8045e066c41cdb269e126a892c648ffe.mp4
  let live_domains = lodash.get(BUILDIN_CONFIG.DOMAIN_RESULT,"live_domains[0]") || lodash.get(State.vx_get_user,'oss.live_pc');
  // 显示返回按钮
  const back_but = route.params.video_size != 1 ? 1 : 0
  // 隐藏全屏按钮
  const hide_full_screen = route.params.video_size == 1 ? 1 : 0;
  const lang = window.reset_lang || UserCtr.lang || "zh";
  State.media_src = `${live_domains}/videoReplay.html?lang=${lang}&c_f_s=1&title=${`${item.homeAway} ${this.event_name(item.eventCode)}: ${item.firstNum}`}&back_but=${back_but}&hide_full_screen=${hide_full_screen}&src=${item.fragmentVideo}`
  let lang_obj={full_screen:i18n_t('video.full_screen_mode'), back:i18n_t('common.back'), back_live:i18n_t('video.back_live')}
  if(route.name == "home"){
    lang_obj.full_screen = '';
    lang_obj.back = '';
    media_src=`${State.media_src}&head=2`;
  } else {
    State.media_src=`${State.media_src}&head=1`;
  }
  State.media_src=`${State.media_src}&txt=${JSON.stringify(lang_obj)}`;
  State.show_type = 'play-video'
  State.current_replay = {
    ...item,
    titleInfo: `${item.homeAway} ${this.event_name(item.eventCode)}: ${item.firstNum}`
  }
}

/**
 * 获取精彩回放事件
 */
const get_video_replay = function() {
  if (!State.match_info?.mid) {
    return false
  }
  const params = {
    mid: State.match_info.mid,
    device: 'PC',
    eventCode: State.current_events_type
  }
  api_analysis.post_playback_video_url(params)
  .then(( data ) => {
    if (data.code == 200 && data.data.eventList) {
      State.events_list = data.data.eventList
      // 全部tab下是否有数据
      if (State.current_events_type === 0 && State.events_list.length) {
        State.has_replay_data = true
      }
      console.log('===replay', State.is_first_time_get_history_list, route.params)
      if (State.is_first_time_get_history_list && State.$route.params.video_size == 1) {
        State.is_first_time_get_history_list = false
        // 获取重播赛事id
        if (route.params && route.params.replay_id) {
          const replay_id = route.params.replay_id
          State.replay_event_id = replay_id;
          const replay_video_info = State.events_list.find(v => v.eventId == replay_id)
          console.log('===replay info',  replay_video_info)
          if (replay_video_info) {
            change_event_video(replay_video_info)
          }
        }
      }
    }
  })
}

const event_name = function(type) {
  let event_name
  switch (type) {
    case 'goal': event_name = i18n_t('replay_video.goal'); break;  // 进球
    case 'corner': event_name = i18n_t('replay_video.corner_kick'); break;  // 角球
    case "red_card": event_name = i18n_t('icon_tips.red_card'); break;  // 红牌
    case "yellow_card": event_name = i18n_t('icon_tips.yellow_card'); break;  // 黄牌
    case "yellow_red_card": event_name = i18n_t('icon_tips.red_card'); break;  // 黄红牌
    default: event_name = ''; break;
  }
  return event_name;
}

// 重置回播数据状态
const reset_replay_data = function() {
  State.replay_event_id = 0
  State.current_replay = null
  State.is_first_time_get_history_list = true
}

// 重播
const changeVideo2Live = function() {
  if (State.replay_event_id) {
    useMittEmit(MITT_TYPES.EMIT_EXIT_FULL_SCREEN_MSG_EVENT, 'xl');

    // 弹出新视频
    if(route.name != 'home'){
      useMittEmit(MITT_TYPES.EMIT_VIDEO_ZONE_EVENT_CMD, {
        cmd: 'play',
        url: State.current_replay.fragmentVideo,
        video_info: State.current_replay,
        match: State.match_info,
        no_init_window_xy:1,
      });
    }
    // 重置回播id
    reset_replay_data();
    // 重置视频url
    State.media_src = ''
  } else {
    State.media_src = State.media_src_temp
    State.current_replay = null
  }
}

// 精彩回放按钮点击
const toggleVideoReplay = function() {
  State.current_events_type = 0
  State.is_expand_video_list = !State.is_expand_video_list
  // 开启时，重新拉取最新的
  if (State.is_expand_video_list) {
    get_video_replay()
  }
}

// 视频关闭通知
const video_event = function(data) {
  if (data && data.cmd == 'video_replay_back_but_event') {
    changeVideo2Live()
  }
}

// 切换精彩回顾列表类型
const change_video_history_list = function({tab, index}) {
  State.current_events_type = tab.code
  get_video_replay(tab.code)
}




onBeforeMount(()=>{
  get_video_replay();
  let {off} =  useMittOn(MITT_TYPES.EMIT_VIDEO_ZONE_EVENT_CMD_END, video_event); 
  State.off_mitt = off
})

onBeforeUnmount(()=>{
  off_mitt()
  replayDataTimer.value && clearInterval(replayDataTimer.value)
  hide_replay_fullscreen_btn_timer.value && clearTimeout(hide_replay_fullscreen_btn_timer.value)
  clearTimeout(State.get_video_replay_timer);
})