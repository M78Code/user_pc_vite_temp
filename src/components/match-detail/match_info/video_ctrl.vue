<!--
 * @Author: Cable
 * @Date: 2020-07-31 16:14:55
 * @Description: 右侧视频控制区域组件
-->
<template>
  <div class="c-video-ctrl">
    <!-- 控制区 -->
    <div class="ctrl-wrap row items-center justify-between">
      <div class="unfold" :class="{ 'open': vx_get_is_fold_status }" @click="$emit('setfoldStatus')"></div>

      <div class="col-center row full-height">
        <!-- 媒体图标 -->
        <div v-for="item in media_icons" :key="item.type" class="wrap_source relative-position"
          :class="{ active: vx_play_media.media_type == item.type, line: vx_play_media.media_type == item.type && !is_hover }"
          @click="toggle_play_media(item.type)" @mouseenter="is_hover = true" @mouseleave="is_hover = false"
          v-show="get_media_icon_show(item.type)">
          <q-tooltip anchor="top middle" self="center middle"
            :content-style="tooltip_style + ';transform:translateY(8px)'">{{ item.text }}</q-tooltip>
          <div :class="['vicon', `${item.icon}-icon`, { active: vx_play_media.media_type == item.type }]"></div>
        </div>
      </div>
      <!-- 全屏 -->
      <div class="col-right">
        <div class="fold-btn" @click="set_unfold_multi_column(true)"
          v-if="menu_data.is_multi_column && get_global_switch.multi_column && !get_unfold_multi_column && ['search', 'home'].includes($route.name) && !vx_show_filter_popup">
          <span class="text">{{ $t('icon_tips.fold') }}</span>
          <i class="icon-arrow q-icon c-icon" size="12px"></i>
        </div>
        <div v-if="animation_btn_show && ['animation'].includes(vx_play_media.media_type) && vx_get_is_fold_status">
          <icon name="icon-big" color="#5A6074" size="14px" @click="full_screen" />
          <q-tooltip anchor="top middle" self="center middle"
            :content-style="tooltip_style + ';white-space: nowrap;'">{{ $t('video.big_screen_mode') }}</q-tooltip>
          <!-- 全屏 -->
        </div>
        <!-- 刷新按钮 -->
        <div class="refresh">
          <refresh :other_icon="true" icon_name="icon-balance_refresh" :loaded="refresh_loading" @click="refresh()" />
        </div>
      </div>
    </div>

    <!-- 战队信息 -->
    <div class="vs-team-wrap relative-position" v-if="match_info.mid != -1">
      <div class="absolute-wrap" :data-mid='match_info.mid' :style="{ height: team_height }">
        <!--对战队伍展示-->
        <div class="item current vs-team-container"
          :class="{ 'cursor-pointer': vx_play_media.media_type == 'video', 'team-wrap-bg': !vx_get_is_fold_status }"
          @click.stop="toggle_item">
          <div class="line"></div>
          <sport-icon v-if="match_info.csid && match_info.csid != -1" :sport_id="match_info.csid" status="2"
            size="18px" />
          <div class="team-wrap ellipsis col allow-user-select" v-if="match_info.mhn">
            {{ match_info.mhn }}
            <span class="separate">v</span>
            {{ match_info.man }}
          </div>
          <div class="yb-icon-arrow" :class="{ active: team_height == this.height1 }"
            v-show="videos.length > 0 && ['video', 'animation'].includes(vx_play_media.media_type) && vx_get_is_fold_status">
          </div>
        </div>

        <!--视频切换-->
        <q-scroll-area class="scroll-area rule-scroll-area" ref="match_scroll_area">
          <div class="item" :class="{ active: val.mid == match_info.mid }" v-for="(val, key) in videos" :key="key"
            @click="switch_video(val)">
            <div class="line"></div>
            <sport-icon :sport_id="val.csid" status="2" size="18px" />
            <div class="team-wrap ellipsis col">
              {{ val.mhn }}
              <span class="separate">v</span>
              {{ val.man }}
            </div>
          </div>
        </q-scroll-area>
      </div>
    </div>


  </div>
</template>

<script>
import video_ctrl from "src/project/yabo/mixins/match_details/match_info/video_ctrl";
// import refresh from "/components/refresh/refresh.vue";
export default {
  mixins: [video_ctrl],
  components: {refresh},
  props: {
    refresh_loading: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
       media_icons:[
        /**比分版 */
        {
          type:"info",
          text:i18n_t('common.score_board'),
          icon:"switch"
        },
        /**演播室 */
        {
          type:"studio",
          text:i18n_t('common.studio'),
          icon:"studio"
        },
        /**主播 */
        {
          type:"anchor",
          text:i18n_t('common.anchor'),
          icon:"anchor"
        },
        /** 专题*/
        {
          type:"topic",
          text:i18n_t('common.topic'),
          icon:"topic"
        },
        /**源视频 */
        {
          type:"video",
          text:i18n_t('common.o_video'),
          icon:"video"
        },
         /**动画 */
       {
          type:"animation",
          text:i18n_t('common.animate'),
          icon:"animation"
        },
       ]
    }
  },
  methods:{
    /**
     * @Description:获取图标是否显示
     * @returns
     */
    get_media_icon_show(type){
      switch (type) {
        case 'info':
          return true
        case 'video':
          return  this.video_btn_show
        case 'animation':
          return  this.animation_btn_show
        case 'studio':
          return this.studio_btn_show
        case 'topic':
          return this.topic_btn_show
        default:
          return false
      }

    },
    refresh() {
      this.$emit('refresh')
    }
  },
  created(){
    let autoPlay = sessionStorage.getItem('auto_play_media')
    if(autoPlay) {
      this.toggle_play_media('video')
      sessionStorage.removeItem('auto_play_media');
    }
    // 刷新按钮节流
    this.refresh = this.throttle(this.refresh, 1000,{leading:true, trailing:false});
  },
  beforeUnmount() {
    this.debounce_throttle_cancel(this.refresh);
  }
};
</script>

<style lang="scss" scoped>
.ctrl-wrap {
  padding: 0 16px;
  height: 36px;
  font-size: 14px;
  width: 100%;
  position: relative;
  .unfold {
    width: 16px;
    height: 15.4px;
    background-repeat: no-repeat;
    background-size: 100%;
    cursor: pointer;
  }
  .col-center{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  /** 视频icon -S*/
  .vicon {
    width: 20px;
    height: 14px;
  }
  .q-icon  {
    cursor: pointer;
  }
  .col-right  {
    display: flex;
    .fold-btn{
      border-radius: 11px;
      padding: 2px 7px 2px 11px;
      color: #fff;
      display: flex;
      align-items: center;
      font-size: 12px;
      cursor: pointer;
       .text{
        margin-right: 2px;
      }
      .icon-arrow{
          transform: rotate(90deg);
          &::before{
           color: #fff;
          }
      }
    }
    .icon-big{
      padding-left: 8px;
    }
    .refresh {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      padding: 0;
      margin-left: 8px;
      background-color: var(--qq--yb-bg-color7);
      border: 1px solid var(--qq--go-top-btn-border);
      ::v-deep .icon-wrap {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon-balance_refresh {
          span{
            font-size: 18px;
            &::before{
              color: #999;
            }
          }
        }
      }
    }
  }
  .wrap_source {
    cursor: pointer;
    margin: 0 10px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    position: relative;
  }
  /** 视频icon -E*/
}
.ie-browser .ctrl-wrap .wrap_source .icon {
  transform: translateX(-2.5px);
}

/** 有视频的赛事列表 -S*/
.vs-team-wrap {
  height: 36px;
  .absolute-wrap {
    left: 0;
    top: 0;
    position: absolute;
    width: 100%;
    z-index: 501;
    overflow: hidden;
    transition: height 0.2s;
    height: 100%;
    .scroll-area {
      width: 100%;
      height: 180px;
      ::v-deep .q-scrollarea__thumb {
        right: 4px;
      }
    }
    .item {
      height: 36px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 10px;
      .team-wrap {
        margin-left: 14px;
        font-size: 14px;
        .separate {
          margin: 0 7px;
        }
      }
      .line {
        width: 15px;
        height: 100%;
      }
      .yb-icon-arrow {
        transform: rotate(90deg);
        transition: transform 0.3s;
        margin-right: 7px;
        &.active {
          transform: rotate(270deg);
        }
      }
    }
  }
}
/** 有视频的赛事列表 -E*/
/** 提示内容 -S*/
.tip-content {
  width: calc(100% - 14px);
  position: absolute;
  bottom: 0;
  z-index: 10;
  top: 30px;
  .content-wrap {
    position: absolute;
    top: 6px;
    width: 100%;
    .content {
      padding: 9px 28px;
      font-size: 12px;
    }
    .yb-icon-triangle  {
      position: absolute;
      top: -5px;
      left: 17px;
    }
  }
}
/** 提示内容 -S*/
</style>
