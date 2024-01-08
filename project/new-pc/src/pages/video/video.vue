<!--
 * @Description: 视频大屏版页面 "/video/:mid/:tid/:csid/:play_type/:video_size",
-->
<template>
  <div class="video-wrap c-big-video v-scroll-area relative-position"
    :class="{ 'big-video-right': route.params.video_size == 1 }">
    <load-data class="fit" :state="load_data_state">
      <!-- 视屏头部 -->
      <video-header v-if="route.params.video_size != 1" :refresh_loading="refresh_loading" :match_info="match_info"
        @refresh="refresh_data" />

      <!-- 视频播放器 -->
      <video-iframe :match_info="match_info" :refresh_time="refresh_time"
        @set_full_screen_status="set_full_screen_status" />

      <!-- 统计/聊天室 -->
      <template v-if="show_video_replay || show_chatroom">
        <div class="video-bottom-panel" :class="{ 'iframe-video-bottom-panel': $is_iframe }">
          <div class="panel-wrapper" :class="{ 'no-chatroom': !show_chatroom }">
            <div>
              <!-- 精彩回放 -->
              <video-history-line v-if="_.get(match_info, 'cds') != 'C01' && Number(match_info.csid) === 1"
                :match_info="match_info" :mid="mid" mode="Card" :mmp="+_.get(match_info, 'mmp')"
                :matchTime="+_.get(match_info, 'mst')" />
              <!-- 统计 -->
              <Stats :match_info="match_info"></Stats>
            </div>
            <Chatroom v-if="show_chatroom" :chatroom_info.sync="chatroom_info"></Chatroom>
          </div>
        </div>
      </template>
      <!-- 本场数据 -->
      <template v-else>
        <div class="data-title yb-flex-center"
          v-if="!$is_eports_csid($route.params.csid) && $route.params.video_size != 1">
          <div class="img"></div>
          <!-- 本场数据 -->
          <div>{{ i18n_t('video.data') }}</div>
        </div>
        <!-- 比分板 -->
        <div v-if="$route.params.video_size != 1">
          <!-- 足球1 -->
          <data-template1 v-if="match_info.csid == 1" :match_info="match_info" />
          <!-- 篮球2 -->
          <data-template2 v-if="match_info.csid == 2" :match_info="match_info" />
          <!-- 棒球3 -->
          <data-template3 v-if="match_info.csid == 3" :match_info="match_info" />
          <!-- 冰球4  网球5  美足6  斯诺克7  排球9  羽毛球10 沙滩排球13  曲棍球15  水球16-->
          <data-template4 v-if="[4, 5, 6, 7, 9, 10, 13, 15, 16].includes(match_info.csid * 1)" :match_info="match_info" />
          <!-- 兵乓球8 手球11 橄榄球14-->
          <data-template8 v-if="[8, 11, 14].includes(match_info.csid * 1)" :match_info="match_info" />
        </div>
      </template>

    </load-data>
  </div>
</template>

<script setup>

import { onMounted, ref } from "vue";
import LoadData from "src/base-pc/components/load-data/load-data.vue"
// 视屏头部
import VideoHeader from "src/base-pc/components/video/video-header.vue"
// 视频组件dn
// import VideoIframe from "src/project/yabo/components/video/video_iframe.vue"
// 比分板足球模板
// import DataTemplate1 from "src/project/yabo/components/video/data_template/template1.vue"
// 比分板篮球模板
// import DataTemplate2 from "src/project/yabo/components/video/data_template/template2.vue"
// 比分板棒球模板
// import DataTemplate3 from "src/project/yabo/components/video/data_template/template3.vue"
// 比分板模板 冰球4  网球5  美足6  斯诺克7  排球9  羽毛球10 沙滩排球13  曲棍球15  水球16
// import DataTemplate4 from "src/project/yabo/components/video/data_template/template4.vue"
// 比分板模板 兵乓球8 手球11 橄榄球14
// import DataTemplate8 from "src/project/yabo/components/video/data_template/template8.vue"
// 聊天室组件
// import Chatroom from "src/project/yabo/components/match_details/panel/chatroom.vue"
// 统计组件
// import Stats from "src/project/yabo/components/match_details/panel/stats.vue"
// 精彩回放组件
// import VideoHistoryLine from "src/project/yabo/components/video/video_history_line.vue";
// 视频操作相关工具库
// import video from "project_path/src/utils/video/video.js"
// websocket数据页面数据接入
// import skt_data_video from "project_path/src/mixins/websocket/data/skt_data_video.js"
// 赛事详情页面信息操作类
import MatchInfoCtr from "src/core/utils/dataclass-ctr/match_info_ctr"
//  直播聊天室相关
// import live_chatroom from "src/project/yabo/mixins/live_chatroom/live_chatroom";
// import { mapGetters, mapActions } from "vuex"
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import video from "src/core/video/video";
import { useRoute } from "vue-router";
const route = useRoute();
const load_data_state =  ref("loading");
const match_info_ctr = new MatchInfoCtr();  // 赛事控制类
const show_loading = ref(false); // 是否展示loading
const match_info = ref({}); // 赛事信息
const refresh_loading = ref(false); // 刷新loading
const refresh_time = ref(0); // 刷新时间
let refresh_loading_timer = null; // 倒计时
//   export default {
// name: "Video",
// mixins:[skt_data_video, live_chatroom],
// components:{
//   LoadData,
//   VideoHeader,
//   VideoIframe,
//   DataTemplate1,
//   DataTemplate2,
//   DataTemplate3,
//   DataTemplate4,
//   DataTemplate8,
//   Stats,
//   Chatroom,
//   VideoHistoryLine
// },
// data(){
//   return {
//     load_data_state:'loading',//数据加载状态
//     mid:0,//赛事ID
//     match_info:{},//赛事详情数据
//     match_info_ctr: new MatchInfoCtr(), // 赛事控制类
//     socket_name: 'skt_data_video', //对应的socket名称
//     refresh_loading: false, // 刷新loading、
//     refresh_time: 0, // 刷新次数
//     chatroom_info: {
//       all_mute: 0,
//       chatRoomId: '',
//       crs: 0,
//     }
//   }
// },
// computed: {
//   ...mapGetters({
//     get_lang: 'get_lang',
//     vx_details_params: "get_match_details_params",
//     vx_play_media: "get_play_media",
//     get_layout_cur_page: "get_layout_cur_page",
//     vx_get_chatroom_available: "get_chatroom_available",
//     vx_get_user: "get_user",
//     get_chatroom_id: "get_chatroom_id",
//   }),

//   // 是否显示 统计/聊天室
//   show_chatroom() {
//     return (
//         UserCtr.user_info.chatRoomSwitch &&
//         this.vx_get_chatroom_available &&
//         ['zh', 'tw'].includes(this.get_lang) &&
//         this.$route.params.video_size === '0'
//     )
//   },
//   // 是否显示精彩回播
//   show_video_replay() {
//     // 配置信息
//     const replayInfo = UserCtr.user_info.merchantEventSwitchVO
//     console.log('this.$route.params.video_size', this.$route.params.video_size)
//     return replayInfo && replayInfo.eventSwitch && this.vx_play_media.media_type === 'video' && Number(this.$route.params.video_size) !== 1
//   },
//     /**
//  * @Description 是否电竞的视频赛事
//  * @param {undefined} undefined
// */
// is_eports(){
//   // 英雄联盟100  dota2 101 csgo 102 王者荣耀103
// const {sportId } = this.vx_details_params
//   return ![100,101,102,103].includes(+sportId)
// },
// },
// created(){
//   // 记录从什么页面进入
//   this.from = this.get_layout_cur_page.from
//   video.from = this.$route.params.video_size
//   // 站点 tab 休眠状态转激活
//   useMittOn(MITT_TYPES.EMIT_SITE_TAB_ACTIVE, this.emit_site_tab_active).on;
//   useMittOn(`exit_full_screen`, this.exit_full_screen).on;
//   useMittOn(`exit_browser_full_screen`, this.exit_browser_full_screen).on;
//   window.addEventListener('keydown',this.cur_keydown);

//   // 获取直播、聊天室信息
//   this.get_live_chat_info()
// },
// beforeUnmount() {
//   // 站点 tab 休眠状态转激活
useMittOn(MITT_TYPES.EMIT_SITE_TAB_ACTIVE, emit_site_tab_active).off;
useMittOn(MITT_TYPES.EMIT_EXIT_FULL_SCREEN_MSG_EVENT, exit_full_screen).off;
useMittOn(MITT_TYPES.EMIT_EXIT_BROWSER_FULL_SCREEN, exit_browser_full_screen).off;
//   this.refresh_loading_timer && clearTimeout(this.refresh_loading_timer)
//   window.removeEventListener('keydown',this.cur_keydown);
// }

//   ...mapActions([
//     'set_match_details_params',
//     "set_play_media",
//     "set_is_back_btn_click",
//   ]),

function emit_site_tab_active() {
  get_match_info(false)
}
/**
 * @Description 浏览器全屏
 * @param {undefined} undefined
 */
function browser_full_screen() {
  let video_dm = document.documentElement;
  let rfs = video_dm.requestFullScreen || video_dm.webkitRequestFullScreen || video_dm.mozRequestFullScreen || video_dm.msRequestFullScreen;
  if (rfs) {
    rfs.call(video_dm);
  }
}
/**
 * @Description:键盘事件
 * @param {object} e 事件详情
 * @return {undefined} undefined
 */
function cur_keydown(e) {
  if (e.keyCode == 27) {
    //video_type ==1 从大屏退出
    this.exit_full_screen(this.$route.params.video_size == 1 ? 'xl' : '')
  }
}
/**
 * @Description:退出全屏  返回上一个页面
 * @return {undefined} undefined
 */
function exit_full_screen(size) {
  const { mid, tid, csid } = this.match_info
  // 如果是从详情页进入大屏返回详情页
  if (this.from == 'details') {
    this.$router.push({
      name: 'details',
      params: {
        mid,
        tid,
        csid
      }
    })
    sessionStorage.setItem('auto_play_media', '1');
  } else if (video.from == 0 && size == 'xl' && !this.$is_eports_csid(this.$route.params.csid)) {
    this.$router.push({
      name: 'video',
      params: {
        mid,
        tid,
        csid,
        play_type: this.$route.params.play_type,
        video_size: '0'
      }
    })
  } else {
    MatchDetailCalss.set_is_back_btn_click(true);
    this.$redirect_router('/home')
  }
  let time = Date.now()
  MatchDetailCalss.set_play_media({
    mid: this.match_info.mid,
    media_type: this.vx_play_media.media_type,
    time
  })
  if (size == 'xl') {
    this.exit_browser_full_screen()
  }
}
/**
 * @Description 退出浏览器全屏
 * @param {undefined} undefined
 */
function exit_browser_full_screen() {
  let video_dm = document;
  let cfs = video_dm.cancelFullScreen || video_dm.webkitCancelFullScreen || video_dm.mozCancelFullScreen || video_dm.exitFullScreen;
  if (cfs) {
    cfs.call(video_dm);
  }
}
/**
 * @Description:获取赛事详情
 * @return {undefined} undefined
 */
function get_match_info(show_loading = true) {
  // show_loading && (this.load_data_state = 'loading')

  video.api_get_match_info(route.params['mid'], route, (_match_info, _load_data_state) => {
    load_data_state.value = _load_data_state
    match_info_ctr.init_match_obj(_match_info); // 初始化赛事控制类
    match_info.value = match_info_ctr.match_obj
  })
}
//设置全屏状态
function set_full_screen_status() {
  if (route.params.video_size == 1) {
    browser_full_screen()
  } else {
    exit_browser_full_screen()
  }
}
// 刷新数据
function refresh_data() {
  // if (this.refresh_loading) {
  //   return false
  // }
  refresh_loading.value = true
  refresh_time.value += 1
  // 重新获取赛事信息
  get_match_info(false)
  // 刷新前 先关闭聊天室
  // set_chatroom_available(0)
  // 聊天室开关开启后才显示聊天室
  if (UserCtr.user_info.chatRoomSwitch) {
    // 获取直播、聊天室信息
    get_live_chat_info()
  }
  refresh_loading_timer && clearTimeout(refresh_loading_timer)
  this.refresh_loading_timer = setTimeout(() => this.refresh_loading = false, 2500)
}

onMounted(() => {
  get_match_info();
})

// watch:{
//   //监听mid改变
//   '$route.params.mid':{
//     handler(res) {
//       let { mid, csid: sportId, tid } = this.$route.params;
//       this.mid = mid
//       // 获取赛事详情
//       this.get_match_info();
//       let play_id = this.vx_details_params.play_id;
//       // 保存详情右侧参数
//       this.set_match_details_params({ mid, sportId, tid, play_id });
//     },
//     immediate: true,
//   },
//   /**
//    * @Description:匹配语言跳转路由
//    * @returns
//    */
//   get_lang(_new){
//     let langs =  ['zh','tw']
//     let status = langs.includes(_new)
//     if(!status){
//       let {mid,tid,csid,play_type,video_size} =this.$route.params
//       if([3,4].includes(+play_type)){
//         this.$router.push({
//           name: 'video',
//           params: {
//             mid,
//             tid,
//             csid,
//             play_type: '1',
//             video_size
//           }
//         })
//       }else if(play_type === '5'){
//         this.$router.push({
//           name: 'details',
//           params: {
//             mid,
//             tid,
//             csid
//           }
//         })
//       }
//     }
//   },
//   //赛事关闭
//   'match_info.ms'(new_) {
//     // 如果赛事不是滚球  并且不是未开赛
//     if(this.$get_match_status(new_) != 1 && this.match_info.ms != 0 && ![3,4,5].includes(+this.$route.params.play_type)) {
//       video.match_close(this.mid);
//     }
//   },
//   //监听赛事阶段改变
//   'match_info.mmp':{
//     handler(res) {
//       // 赛事关闭
//       if(res == 999) {
//         if(![3,4,5].includes(+this.$route.params.play_type)){
//           video.match_close(this.mid);
//         }
//       }
//       video.set_mmp_score(this.match_info)
//     },
//     immediate: true,
//   },
//   // 视频关闭
//   'match_info.mms'(new_) {
//     // 如果视频关闭 并且当前播放的是视频
//     if(new_ != 2 && this.$route.params.play_type == 1) {
//       video.match_close(this.mid);
//     }
//   },
//   // 演播厅关闭
//   'match_info.lvs'(new_) {
//     // 如果视频关闭 并且当前播放的是视频
//     if(new_ != 2 && this.$route.params.play_type == 3) {
//       video.match_close(this.mid);
//     }
//   },
//   // 监听比赛局数改变
//   'match_info.mct'(res) {
//     res = parseInt(res)
//     if(this.match_info.csid != 3 || res < 8) return
//     let index = res - 1
//     let score_key = 120 + index
//     if(!this.match_info.score_list[index]){
//       this.match_info.score_list.push({
//         name:res,
//         score:'S'+score_key,
//       })
//     }
//   },
// }
//   }
</script>

<style lang="scss" scoped>
.video-wrap {
  padding-right: 14px;

  &.big-video-right {
    padding-right: 0;

    &::after {
      width: 0;
      background: none;
      border: none;
    }
  }

  .data-title {
    height: 40px;
    margin-bottom: 15px;

    .img {
      width: 16px;
      height: 16px;
      margin-right: 9px;
      background-repeat: no-repeat;
    }
  }

  /* 比分数据 */
  .data-template {
    display: flex;
    justify-content: center;

    :deep(.column-between) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .video-bottom-panel {
    margin-top: 4px;
    margin-bottom: 1px;

    &.iframe-video-bottom-panel {
      :deep(.panel-wrapper) {
          .chatroom {
            margin-top: 0;

            .chat-scroll-area {
              height: 171px;
            }

            .emoji-picker {
              height: 145px;
            }
          }

          .total_chart {
            .wrap-score {
              padding: 29px 40px 33px 40px;
            }
          }

      }
    }

    .panel-wrapper {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0 8px;

      &.no-chatroom {
        display: block;
      }

      >div {
        border: none;
        // border: 1px solid var(--qq--match-border-color2);
      }
        :deep(.video-history-line) {
          margin-bottom: 4px;
        }

        :deep(.stats-wrapper,
        .chatroom,
        .video-history-line) {
          border: 1px solid var(--qq--match-border-color2);
        }

        :deep(.chatroom) {
          margin-top: 0;

          .chat-scroll-area {
            //height: 230px;
            height: 171px;
          }

          .emoji-picker {
            //height: 238px;
            height: 145px;
          }
        }

        :deep(.total_chart) {
          .wrap-score {
            //padding: 57px 40px 70px 40px;
            padding: 29px 40px 33px 40px;

            &.basketball-score {
              padding: 0;
            }
          }

          .q-knob {
            font-size: 54px;
          }
        }
    }
  }
}
</style>
