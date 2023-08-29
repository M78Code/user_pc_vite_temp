<!--
 * @Author: hammar
 * @Date: 2023-04-25 14:47:43
 * @Description: 视频画中画效果实现
-->
<template>
  <!-- <div class="video-zone-layout"> -->
    <vue-draggable-resizable
        v-show="show"
            :axis="'both'"
            :x="x"
            :y="y"
            :w="width"
            :h="height"
            :z="2000"
            :active="true"
            :width="width"
            :height="height"
            :min-width="min_width"
            :min-height="min_height"
            :parent="true"
            :resizable="true"
            :handles="handles"
            :prevent-deactivation="true"
            @dragging="onDrag" @resizing="onResize" @dragstop="dragstop"
            :style="draggable_style"
            class-name="video-zone"
            class="video-zone"
            >
            <div class="stop_layout" :style="{width:width+'px',height:height+'px'}" v-show="stop_layout"></div>
            <div class="test-text" v-if="is_test"> {{video_url}}</div>
            <div class="col-auto col-delete" @click.stop="close_video">
              <icon
                size="12px"
                name="icon-del"
                class="bet-del"
              />
            </div>
            <img class="replay-icon2" src="~public/image/yabo/svg/replay_icon2.svg"/>
            <div id="dplayer-video-zone" :style="{width:width+'px',height:height+'px'}" @click.stop="" @mouseover="mouseover" @mouseout="mouseout">
              <iframe @load="send_message_xywh" id="dplayer-video-zone-iframe" class="iframe" :width="width" :height="height" :src="video_url" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"
               allow="autoplay"></iframe>
            </div>
            <video-replay-error @iframe_status="iframe_status" v-if="show" :url="video_url"/>
    </vue-draggable-resizable>
  <!-- </div> -->
</template>

<script>
import { mapGetters} from "vuex";
import videoReplayError from "./video-replay-error.vue"
import VueDraggableResizable from 'vue-draggable-resizable'
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
// VueDraggableResizable组件api: https://gitcode.net/mirrors/mauricius/vue-draggable-resizable?utm_source=csdn_github_accelerator
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
export default {
  components:{
    // "draggable-resizable":() => import( /* webpackChunkName: "details" */ "src/project/yabo/components/vue_draggable_resizable/vue_draggable_resizable.min.js"),
    VueDraggableResizable,
    videoReplayError
  },
  props:{

  },
  data(){
    return {
      // 最小宽高
      min_width:0,
      min_height:0,
      // 窗口宽高
      width:0,
      height:0,
      // 窗口显示位置x,y
      x:0,
      y:0,
      // 视频窗口显示开关
      show:false,
      // 阻止视频点击事件蒙层
      stop_layout:false,

      handles:['tr','tl','bl','br'],//['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],

      // 视频声音 true有声  false无声
      video_voice: true,
      // 视频加载状态  loading 加载中  done 加载完成 play_end 播放完毕 error 加载失败
      video_load_state:'loading',
      // 视频链接
      video_url : '', //'https://www.runoob.com/try/demo_source/movie.mp4' ,
      // 是否调试
      is_test : sessionStorage.getItem('wsl') ,

      // 484X272
      // video_default_w_h.w
      video_default_w_h:{w:484,h:272}
    }
  },
  computed: {
    ...mapGetters({
      vx_get_layout_size: "get_layout_size",
    }),
    // 拖拽区域的样式  计算属性用于计算拖拽位置
    draggable_style() {
      return {
        // 视频区域位置设置样式
        transform: `translate(${x}px, ${y}px)`,
        left: null,
        top: 0,
        bottom: null,
        width:width,
        height:height
      }
    },
  },
  created() {
    // 设置视频宽高和位置
    set_video_x_y_w_h();
    // 加载所需js文件
    $utils.load_player_js()
    // 监听命令逻辑函数
    useMittOn('VIDEO_ZONE_EVENT_CMD', video_zone_event).on;
    // 监听message
    window.addEventListener("message", handleMessage);
  },
  mounted () {
    try {
      dom_mr = document.getElementsByClassName('handle-mr')[0];
      dom_ml = document.getElementsByClassName('handle-ml')[0];
      // 监听handles mr按钮
      if(dom_mr){
        dom_mr.addEventListener('mousedown',handles_ml_mr_envent_mousedown)
        dom_mr.addEventListener('mouseup',handles_ml_mr_envent_mouseup)
      }
      // 监听handles ml按钮
      if(dom_ml){
        dom_ml.addEventListener('mousedown',handles_ml_mr_envent_mousedown)
        dom_ml.addEventListener('mouseup',handles_ml_mr_envent_mouseup)
      }
    } catch (error) {
      console.error(error);
    }
  },
  beforeDestroy(){
    // 销毁视频
    destroy_video();
    clearTimeout(video_timer)
    clearTimeout(player_timeout_id)
    clearTimeout(stop_layout_timer)
    clearTimeout(close_video_timer);
    clearTimeout(open_full_video_timer);
    clearTimeout(close_video_timer);
    // 移出命令逻辑函数
    useMittOn('VIDEO_ZONE_EVENT_CMD', video_zone_event).off;
    video_url = '';
    // 移除监听message
    window.removeEventListener("message", handleMessage);
    try {
      if(dom_mr){
        dom_mr.removeEventListener('mousedown',handles_ml_mr_envent_mousedown)
        dom_mr.removeEventListener('mouseup',handles_ml_mr_envent_mouseup)
      }
      if(dom_ml){
        dom_ml.removeEventListener('mousedown',handles_ml_mr_envent_mousedown)
        dom_ml.removeEventListener('mouseup',handles_ml_mr_envent_mouseup)
      }
    } catch (error) {
      console.error(error);
    }
  },
  methods:{
    /**
    * @Description:handles居中左右按钮操作事件：onmouseover
    */
    handles_ml_mr_envent_mousedown(){
      move_mr_ml=true;
    },
    /**
    * @Description:handles居中左右按钮操作事件：onmouseover
    */
    handles_ml_mr_envent_mouseup(){
      move_mr_ml=false;
    },
    /**
    * @Description:iframe加载状态操作函数
    * @return {undefined} undefined
    * @param {object} e 事件信息
    */
    iframe_status(res){
      if(!res.ok){
        destroy_video();
      }
    },
    /**
    * @Description:监听message
    * @return {undefined} undefined
    * @param {object} e 事件信息
    */
    handleMessage(e){
      // 移动窗口事件
      if(e.data.cmd == 'video_replay_mouse_move'){
        // 设置偏移量
        x=x+e.data.val.x;
        y=y+e.data.val.y;
      } else if(e.data.cmd == 'video_replay_back_but_event'){
        // 设置偏移量
        useMittEmit('VIDEO_ZONE_EVENT_CMD_END',e.data);
      } else if(e.data.cmd == 'video_replay_full_srceen_event'){
        // 设置偏移量
        useMittEmit('IFRAME_VIDEO_VOLUME', {volume: 0, src:'localStorage'});
        clearTimeout(open_full_video_timer);
        open_full_video_timer = setTimeout(() => {
          if(_.get(e.data,'val.type') == 1 && play_data){
            $router.push({
              name: 'video',
              params: {
                mid:play_data.match.mid,
                tid:play_data.match.tid,
                csid:play_data.match.csid,
                play_type:1,
                video_size:'1',
                replay_id:_.get(play_data,'video_info.eventId')
              }
            })
            clearTimeout(close_video_timer);
            close_video_timer=setTimeout(() => {
              close_video();
            }, 1000);
          }
        }, 500);

      } else if(e.data.cmd == 'replay_video_get_status_cmd'){
        useMittEmit('IFRAME_VIDEO_MSG_EVENT', {cmd:'replay_video_status_cmd',val:{show:show}});
        // send_message({cmd:'replay_video_status_cmd',val:{show:show}})
      }
    },
    /**
     * @Description 发送宽高和位置外部消息
    */
    send_message_xywh(){
      send_message({cmd:'move_video_layout',val:{x:x, y:y, w:width, h:height}})
    },
    /**
     * @Description 发送外部消息
    */
    send_message(data){
      if(!iframe){
        iframe = document.getElementById("dplayer-video-zone-iframe");
      }
      if(iframe && iframe.contentWindow){
        iframe.contentWindow.postMessage(data,"*");
      }
    },
    /**
     * @Description 接收外部命令逻辑函数
    */
    video_zone_event(obj){
      rdm = new Date().getTime();
      const lang = window.reset_lang || window.vue.lang || "zh";
      // 获取命令
      let cmd = _.get(obj, 'cmd');
      let live_domains = window.BUILDIN_CONFIG.live_domains[0] || _.get(UserCtr.user_info,'oss.live_pc');
      let lang_obj={full_screen:i18n_t('video.full_screen_mode'), back:i18n_t('common.back'), back_live:i18n_t('video.back_live')};
      switch (cmd) {
        case 'play': // 播放
          // window.BUILDIN_CONFIG.live_domains[0]='http://127.0.0.1:5500/video/pc/final'
          let video_url = `${live_domains}/videoReplay.html?lang=${lang}&c_f_s=1&src=${_.get(obj, 'url')}`;
          // video_url = 'http://127.0.0.1:5500/video/pc/final/videoReplay.html?src=https://www.runoob.com/try/demo_source/movie.mp4&c_f_s=1'
          video_url=`${video_url}&txt=${JSON.stringify(lang_obj)}`;
          if(!_.get(obj, 'no_init_window_xy')){
            if(video_url == video_url && show){
              send_message({
                cmd: 'replay_video_jq_cmd',
                val: "that && that.player && that.player.play();"
              })
              return;
            } else {
              set_video_x_y_w_h(obj);
            }
          }
          video_url = video_url;
          show=true;
          // 清除自动编辑组件
          mouseout('no_set_timeout');
          // video_url = video_url+'&rdm='+rdm;
          // play_video();
          play_data = obj;
          break;
        case 'resultPlay': // 赛果页面播放
          // 获取屏幕宽高
          let body_w = document.body.clientWidth;
          let body_h = document.body.clientHeight;
          // 按照ui设置当前视频窗口宽高
          width= 502;
          height= 280;
          // 设置当前视频窗口居中位置
          x= body_w/2 - width/2;
          y= body_h/2 - height/2;
          video_url = `${live_domains}/videoReplay.html?lang=${lang}&head=2&src=${_.get(obj, 'url')}&title=${_.get(obj, 'title','')}`;
          //video_url = `http://127.0.0.1:5500/video/pc/final/videoReplay.html?src=https://www.runoob.com/try/demo_source/movie.mp4&head=1&title=${_.get(obj, 'title','')}`
          video_url=`${video_url}&txt=${JSON.stringify(lang_obj)}`;
          show=true;
          // 清除自动编辑组件
          mouseout('no_set_timeout');
          // play_video();
          play_data = obj;
          break;
        case 'colse': // 关闭
          close_video();
          break;
        case 'replay_video_jq_cmd': // iframe postmaessage JS命令
          send_message(obj)
          break;
        default:
          break;
      }
    },
    /**
     * @Description 设置视频宽高和位置
    */
    set_video_x_y_w_h(obj){
      // if(route_name_old == $route.name){
        // return;
      // }
      // 高宽比：video_default_w_h.h * video_default_w_h.w
      let padd_x=20;
      let padd_y=20;
      // 获取屏幕宽高
      let body_w = document.body.clientWidth;
      let body_h = document.body.clientHeight;

      let min_width;
      let min_height;
      let width;
      let height;
      let x;
      let y;

      // 设置最小可视宽高
      min_width=body_w*20/100;
      min_height=video_default_w_h.h*min_width/video_default_w_h.w;

      // 设置当前视频窗口宽高
      width= body_w*20/100;
      height= video_default_w_h.h*width/video_default_w_h.w;

      let x_move = 0;
      let y_move = 0;
      let rect = _.get(obj, 'rect');
      switch ($route.name) {
        case 'video': // 大视频页面
            x_move = vx_get_layout_size.right_width;
            // 设置当前视频窗口右下角位置
            x= body_w - width -padd_x - x_move;
            y= body_h - height -padd_y - y_move;
          break;
        case 'details': // 赛事详情页面
          if(rect){
            // 设置当前视频窗口右下角位置
            x= rect.x+10;
            y= rect.y+60;
          } else {
            x_move = vx_get_layout_size.right_width;
            // 设置当前视频窗口右下角位置
            x= body_w - width -padd_x - x_move;
            y= body_h - height -padd_y - y_move;
          }
          break;
        default:
          // 设置当前视频窗口右下角位置
          x= body_w - width -padd_x - x_move;
          y= body_h - height -padd_y - y_move;
          break;
      }

      min_width=min_width;
      min_height=min_height;
      width= width;
      height= height;
      x= x;
      y= y;

      route_name_old = $route.name;
      send_message_xywh();
    },
    /**
     * @Description 关闭隐藏视频显示框
    */
    close_video(){
      show = false;
      // 销毁视频
      destroy_video();
      video_url = '';
      useMittEmit('VIDEO_ZONE_EVENT_CMD_END',{cmd:"play_end",val:play_data});
      useMittEmit('IFRAME_VIDEO_VOLUME', {volume: 0, src:'localStorage'});
    },
    /**
     * @Description 鼠标移入
    */
    mouseover(){
      clearTimeout(video_timer)
      //增加视频大小改变组件
      if(!handles.length){
        handles.push('tr')
        handles.push('tl')
        handles.push('bl')
        handles.push('br')
      }
    },
    /**
     * @Description 鼠标移出
    */
    mouseout(obj){
      // 清空视频大小改变组件
      // if(handles.length){
      //   clearTimeout(video_timer)
      //   if('no_set_timeout'==obj){
      //     handles.splice(0,4)
      //   } else {
      //     video_timer = setTimeout(() => {
      //       handles.splice(0,4)
      //     }, 2000);
      //   }
      // }
    },
    /**
     * @Description 窗口大小改变
    */
    onResize: function (x, y, w, h) {
      x = x
      y = y
      if(move_mr_ml){
        width = 0
        height = h
      } else {
        width = w
        height = 0
      }

      if(width != w){
        // 判断是否宽度变化
        // // 向右向右移动
        // console.error('向右向右移动');
        width = w
        height = video_default_w_h.h*w/video_default_w_h.w
        h=height;
      } else if(height != h){
        // 判断是否高度变化
        // 向上向下移动
        // console.error('向上向下移动');
        width = video_default_w_h.w*h/video_default_w_h.h
        w=width;
        height = h
      } else {
        // width = w
        // height = h
      }
      clearTimeout(stop_layout_timer)
      stop_layout_timer = setTimeout(() => {
        stop_layout=false;
      }, 1000);
      stop_layout=true;
      send_message_xywh();
    },
    /**
     * @Description 窗口移动
    */
    onDrag: function (x, y) {
      x = x
      y = y
      stop_layout=true;
      return true;
    },
    /**
     * @Description 窗口移动停止
    */
    dragstop: function (x, y) {
      stop_layout=false;
    },

    /**
     * @Description 销毁视频
     * @param {undefined} undefined
    */
    destroy_video(){
      clearTimeout(player_timeout_id)
      iframe = null;
      if(player){
        player.destroy();
        playe = null;
      }
    },
    /**
     * @Description 捕获视频错误信息
     * @param {undefined} undefined
    */
    capture_video_error(){
      if(!player.plugins.hls){
        console.log('捕获视频错误信息1');
        return
      }
      player.plugins.hls.on(Hls.Events.ERROR, (event, data) => {
        console.log('捕获视频错误信息2');
        // 致命错误  无法播放
        if(data.fatal){
          destroy_video()
          video_load_state = 'error'
        }
      })
    },
    /**
     * @Description 播放视频
    */
    play_video(){
      clearTimeout(player_timeout_id)
      destroy_video()
      if(!video_url){
        return;
      }
      // 如果js文件没加载成功 延迟200再次尝试
      if(!window.Hls || !window.DPlayer){
        player_timeout_id = setTimeout(() => {
          play_video()
        },200)
        return
      }
      // 创建播放对象
      player = new DPlayer({
        container: document.getElementById('dplayer-video-zone'),
        live: true,
        autoplay: true,
        hotkey:true,
        loop:true,
        video: {
          url:video_url,
          type:'auto',
          lang:"en",
        },
      });
      // 隐形部分功能按钮
      player.video.setAttribute('controlslist','nodownload noremoteplayback noplaybackrate');
      // 隐藏画中画
      player.video.setAttribute('disablePictureInPicture','disablePictureInPicture');
      // 自动播放
      player.video.setAttribute('autoplay','autoplay');
      // 显示控制按钮
      player.video.controls=true;
      // player.video.disablePictureInPicture=false;
      capture_video_error();
      // 监听视频可以播放
      player.on('canplaythrough', () => {
        console.log('监听视频可以播放');
        let val = video_voice ? 1 : 0
        player.volume(val, true, false)
        player.play();
        // video_duration = player.video.duration
        video_load_state = 'done'
      });
      // 监听视频播放完毕
      player.on('ended', () => {
        console.log('监听视频播放完毕');
        video_load_state = 'play_end'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#dplayer-video-zone{
  //border: solid 3px rgba(0,0,0,0);
  background-color: #000;
}
#dplayer-video-zone:hover{
  //border: solid 3px rgba(100,100,100,0.5);
  cursor:move;
}

.video-zone{
  position: fixed;
}
.video-zone-layout{
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 999999;
}
//::v-deep video::-webkit-media-controls-fullscreen-button {
//  display: none;
//}

::v-deep .handle.handle-tr{
  top: -5px !important;
  right: -5px !important;
}

::v-deep .handle.handle-tl{
  top: -5px !important;
  left: -5px !important;
}

::v-deep .handle.handle-bl{
  bottom: -5px !important;
  left: -5px !important;
}

::v-deep .handle.handle-br{
  bottom: -5px !important;
  right: -5px !important;
}

::v-deep .handle.handle-tm{
  width: 100%;
  left: 5px !important;
  top: -5px;
  z-index: -1;
}

::v-deep .handle.handle-bm{
  width: 100%;
  left: 5px !important;
  bottom: -5px;
  z-index: -1;
}

::v-deep .handle.handle-ml{
  height: 100%;
  left: -5px !important;
  top: 5px;
  z-index: 1;
}

::v-deep .handle.handle-mr{
  height: 100%;
  right: -5px !important;
  top: 5px;
  z-index: 1;
}

::v-deep .handle{
  border-color: transparent!important;
  background: transparent!important;
}
.replay-icon2{
  position: absolute;
  right: 35px;
  top: 11px;
  width: 65px;
  height: 18px;
  z-index: 12;
}
/*  关闭按钮的样式 */
.col-delete {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  height: 20px;
  z-index: 20001;
  background-color: rgba(51,51,51,0.4);
  border-radius: 50%;
  /* X按钮 */
  .bet-del {
    z-index: 20;
    font-size: 6px;
    display: flex;
    top: 4px;
    left: 4px;
  }
  .icon-del:before {
    color: #fff;
  }
}
.stop_layout{
  position: absolute;
  z-index: 3001;
}
.test-text{
  position: absolute;
  z-index: 3001;
  color: red;
  background-color: rgba(255,255,255,0.8);
}
</style>
