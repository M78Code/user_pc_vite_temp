<!--
 * @Author: success
 * @Description: 视频高清/流畅切换组件
-->
<template>
  <div class="video-type-ctr-wrap relative-position" :style="`height:${is_show_type_list ? '100%' : '0px'}`" @click.stop>
    <!-- 刷新按钮 -->
    <div class="video-refresh yb-flex-center" v-if="!is_esports">
      <span class="refresh-video" @click="video_refresh" :class="{is_rotate:is_rotate}"></span>
    </div>
    <!-- 切换线路按钮 -->
    <div class="video-type-but-flg" :style="{'right' : `${($route.params.video_size ==1 ? 225 : 260) + icons_right}px`}"  @click="show_click()" v-if="!is_esports && !is_topic">
      {{get_video_clarity_name()}}
    </div>

    <div class="type-list-bg" v-show="is_show_type_list">
      <!-- 线路列表 -->
      <div class="type-list">
        <!-- 高清 -->
        <div class="video-type-but" :class="{'video-type-but-action':ctr_data.video_type==1}" @click="send_video_type_click(1)">{{get_video_clarity_name2(1)}}</div>
        <!-- 流畅 -->
        <div class="video-type-but" :class="{'video-type-but-action':ctr_data.video_type==2}" @click="send_video_type_click(2)">{{get_video_clarity_name2(2)}}</div>
      </div>
      <img class="close-btn" @click="is_show_type_list = false" src="~public/image/common/png/close_white.png">
    </div>
    <!-- 画中画提示框 -->
      <div v-show="pip_mouseover&&$route.name == 'home'" class="pip_mouseover">{{ i18n_t('video.open_pip')}}</div>
    <div id="vide_size">{{ $route.params.video_size  }}</div> 
    <div class="full-screen-wrap" :class="{esports:is_esports}" v-if="$route.params.video_size !=1 && !is_esports">
      <!-- 退出中屏 -->
      <icon-wapper v-if="$route.name == 'video'" size="14px" src="" color="#FFFFFF" name="icon-small"  @click="exit_full_screen" />
      <!-- 进入中屏 -->
      <icon-wapper v-else size="14px" color="#FFFFFF" :name="`img:${LOCAL_PROJECT_FILE_PREFIX}/image/common/svg/big_screen.svg`" @click="full_screen()" />
      <q-tooltip
        anchor="top middle"
        self="center middle"
        :content-style="tooltip_style + ';white-space: nowrap;'"
      >{{ i18n_t($route.name == 'video' ? 'common.back' : 'video.big_screen_mode')}}</q-tooltip>
    </div>
    <!-- 全屏 -->
    <div class="xl-screen-wrap" v-if="$route.params.play_type != 2" :class="{esports:is_esports, disabled: video_fullscreen_disabled}">
      <!-- 退出全屏 -->
      <icon-wapper v-if="$route.name == 'video' && ($route.params.video_size === '1' || is_esports)" size="14px" color="#FFFFFF" name="icon-small" @click="exit_full_screen('xl')" />
      <!-- 进入全屏 -->
      <icon-wapper v-else  size="14px" color="#FFFFFF" name="icon-big"  @click="full_screen('xl')" />
      <q-tooltip
        anchor="top middle"
        self="center middle"
        :content-style="tooltip_style + ';white-space: nowrap;'"
      >{{ i18n_t(($route.name == 'video') && ($route.params.video_size == 1 || is_esports) ? 'common.back' : 'video.full_screen_mode')}}</q-tooltip>
    </div>
  </div>
</template>

<script>
// import { mapGetters, mapActions } from "vuex"
import video from "src/core/video/video.js"
import { IconWapper } from 'src/components/icon'
import { get_media_icon_index,debounce_throttle_cancel} from "src/output/module/constant-utils.js";
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/core/file-path/file-path.js'
import { MatchDetailCalss} from "src/output/module/project-single.js";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt/index.js"
const tooltip_style = 'background:rgba(0,0,0,0.8);padding:4px 5px;border-radius:0px;color:#fff'
export default {
  components: {
    IconWapper,
  },
  props: {
    ctr_data: {
      type: Object,
      default: () => {
        return {
          video_type:1, //1:高清flv, 2:流畅m3u8
        };
      },
    },
    // 是否电竞
    is_esports: Boolean,
    // 鼠标是否经过视频
    is_video_hover: Boolean,
    // 赛事信息
    match_info: Object,
    icons_right:Number,
    video_fullscreen_disabled: {
      type: Boolean,
      default: false
    },
    // 屏蔽兼容以前的显示 中屏
    show_full_screen_wrap: {
      type: Boolean,
      default: true
    },
    // 屏蔽兼容以前的显示 大屏
    show_xl_full_screen_wrap: {
      type: Boolean,
      default: true
    },
  },
  data(){
    return {
      tooltip_style,
      // video_type:1,//1:高清flv, 2:流畅m3u8
      is_rotate:false,  // 刷新按钮是否旋转
      is_show_type_list:false,  // 是否显示切换列表
      pip_mouseover:false,
       //视屏播放类型
      vx_play_media:MatchDetailCalss.play_media,
      LOCAL_PROJECT_FILE_PREFIX: LOCAL_PROJECT_FILE_PREFIX
    }
  },
  computed:{
    // ...mapGetters({
    //   vx_play_media: "get_play_media",//获取右侧赛事详情视频信息
    // }),
    //是否专题
    is_topic(){
      let index  = lodash.get('$route.params.play_type')  ||  get_media_icon_index(this.vx_play_media.media_type)
        return index == 5
    },
  },
  watch:{
    // 监听鼠标是否经过视频
    is_video_hover(res){
      if(!res){
        this.is_show_type_list = false
      }
    }
  },
  methods:{
    // ...mapActions({
    //   set_play_media: "set_play_media", //设置右侧赛事详情视频信息
    //   set_is_back_btn_click: "set_is_back_btn_click"//设置获取是否从详情页返回
    // }),
     get_video_clarity_name(){
      let  type  = lodash.get('$route.params.play_type')  || get_media_icon_index(this.vx_play_media.media_type)
      let text = ""
        if(type == 1){
          if(this.ctr_data.video_type == 1){
            text=  i18n_t('video.flv')
          }else{
            text=  i18n_t('video.m3u8')
          }
            
        }else{
           if(this.ctr_data.video_type == 1){
            text=  i18n_t('video.clarity1')
          }else{
            text=  i18n_t('video.clarity2')
          }
        }
        return text
    },
    get_video_clarity_name2(num){
      let  type  = lodash.get('$route.params.play_type')  || get_media_icon_index(this.vx_play_media.media_type)
      let text = ""
        if(type == 1){
          if(num == 1){
            text = i18n_t('video.flv')
          }else{
            text = i18n_t('video.m3u8')
          }
        }else{
          if(num == 1){
            text = i18n_t('video.clarity1')
          }else{
            text = i18n_t('video.clarity2') 
          }
        }
        return text
      
    },
    /**
    * @Description:视频进入全屏
    * param{size} ''  || xl
    */
    full_screen(size){
      // 全屏禁用
      if(this.video_fullscreen_disabled && size === 'xl') {
        return false
      }
      let play_type = get_media_icon_index(this.vx_play_media.media_type)
      if(this.$route.name == 'video'){
        play_type = this.$route.params.play_type
      }
      if(this.is_esports ){
        play_type = 1
      }
      if (size == 'xl') {
        // 进入全屏
        play_type = 2;
      }
      console.log(play_type, size, " 进入全屏");
      if (this.vx_play_media.media_type === 'topic') {
        video.send_message({
          cmd: 'record_play_info',
          val: {
            record_play_time: true
          }
        })
      }
      console.log(play_type, "play_type2222");
      clearTimeout(this.handle_screen_timer)
      this.handle_screen_timer = setTimeout(() => {
        video.full_screen(this.match_info,play_type,size,this.$route,this.$router)
      }, 50)
    },
    /**
    * @Description:画中画功能
    * @return {undefined} undefined
    */
    pic_full_screen(size){
      if (this.vx_play_media.media_type === 'video') {
        video.send_message({
          cmd: 'pip_click',
          val: {
            pip_click: true
          }
        })
      }
    },
    /**
    * @Description:退出全屏
    * @return {undefined} undefined
    */
    exit_full_screen(size){
      if (this.vx_play_media.media_type === 'topic') {
        video.send_message({
          cmd: 'record_play_info',
          val: {
            record_play_time: true
          }
        })
      }

      clearTimeout(this.handle_screen_timer)
      this.handle_screen_timer = setTimeout(() => {
        useMittEmit(MITT_TYPES.EMIT_EXIT_FULL_SCREEN_MSG_EVENT, size);
      }, 100)
    },
    show_click(){
      this.is_show_type_list = !this.is_show_type_list;
    },
    /**
     * @Description 刷新视频
     * @param {undefined} undefined
    */
    video_refresh(){
      this.is_rotate = true
      this.stop_rotate()
      video.send_message({
        cmd:'refresh_video',
        val:''
      })

    },
    /**
     * @Description 停止旋转
     * @param {undefined} undefined
    */
    stop_rotate(){
      this.is_rotate = false
    },
    /**
    * @Description:监听message
    * @return {undefined} undefined
    * @param {object} e 事件信息
    */
    handleMessage(e){
      if (e.data.cmd == 'global_click') {
        this.match_show = false
      }
      if (e.data.cmd == 'show_controller') {
        this.$emit('VideoShowController',e.data)
      }
      if (e.data.cmd == 'open_pip_done_mouse') {
        if(e.data.val=='pip_mouseover')
        {
          this.pip_mouseover = true;
        } else if(e.data.val=='pip_mouseout')
        {
          this.pip_mouseover = false;
        }
      }
    },

    /**
     * @description: 给iframe发送全局视频类型变化事件
     * @param {int} type 1:高清flv, 2:流畅m3u8
     * @return {*}
     */
    send_video_type_click(type){
      window.video_type = type;
      this.is_show_type_list = false;
      if(this.ctr_data.video_type == type){
        return;
      }
      this.ctr_data.video_type = type;
      video.send_message({
        cmd:'switch_type',
        val:type
      })

    }
  },
  // watch:{
  // },
  created() {
    this.stop_rotate = lodash.debounce(this.stop_rotate,300)
    if(!window.video_type){
      window.video_type = this.ctr_data.video_type;
    } else {
      this.ctr_data.video_type=window.video_type;
    }
    // 监听message
    window.addEventListener("message", this.handleMessage);
  },
  beforeUnmount() {
    clearTimeout(this.handle_screen_timer)
    this.handle_screen_timer = null
    debounce_throttle_cancel(this.stop_rotate);
    // 移除监听message
    window.removeEventListener("message", this.handleMessage);
  },
};
</script>

<style lang="scss" scoped>
.video-type-ctr-wrap {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  &.is-video-page
  .video-type-but-flg {
    right: 375px;
    &.xl-video-but{
       right: 340px;
    }
  }
}

.pip_mouseover{
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 0 5px;
  height: 26px;
  line-height: 26px;
  pointer-events: none;
  z-index: 10000;
  white-space: nowrap;
  position: absolute;
  right: 68px;
  bottom: 50px;
}
.full-screen-wrap {
  position: absolute;
  height: 50px;
  width: 20px;
  bottom: 0px;
  right: 43px;
  display: flex;
  align-items: center;
  &.esports {
    height: 100px;
  }
  span {
    cursor: pointer;
  }
  i {
    cursor: pointer;
  }
}
.xl-screen-wrap {
  position: absolute;
  height: 50px;
  width: 20px;
  bottom: 0px;
  right: 10px;
  display: flex;
  align-items: center;
  &.esports {
    //height: 100px;
  }

  &.disabled {

  }

  i {
    cursor: pointer;
  }
}

@keyframes video-reload-btn {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(3600deg);
  }
}
.video-refresh  {
  position: absolute;
  height: 50px;
  width: 40px;
  bottom: 0px;
  left: 0;
  .refresh-video  {
    cursor: pointer;
    width: 16px;
    height: 16px;
     background-image: url($SCSSPROJECTPATH + "/image/svg/virtual-ref.svg");
    background-size: cover;
    &.is_rotate {
      animation: video-reload-btn 5s linear 0s infinite normal;
    }
    &:before  {
      color: #fff;
    }
  }
}
.video-type-but-flg {
  height: 50px;
  position: absolute;
  bottom: 0px;
  right: 115px;
  color: #fff;
  text-align: center;
  min-width: 40px;
  white-space: nowrap;
  line-height: 50px;
  cursor: pointer;
}
.type-list-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  .close-btn {
    position: absolute;
    width: 15px;
    height: 15px;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
  .video-type-but {
    height: 36px;
    line-height: 36px;
    text-align: center;
    min-width: 150px;
    padding: 0 10px;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    &.video-type-but-action {
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
}
</style>