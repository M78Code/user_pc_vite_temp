<!--
 * @Author: Cable
 * @Date: 2020-09-04 15:08:19
 * @Description: 视频大屏版页面头部
-->
<template>
  <div class="video-header  relative-position">
    <!-- 返回按钮 -->
    <div class="left-wrap row items-center">
      <icon name="icon-back" size="14px" @click="on_return"/>
    </div>
    <!-- 中间区域 -->
    <div class="center-wrap">
      <!-- 主队logo -->
      <div class="logo-wrap yb-flex-center left-logo">
        <div class="double  relative-position" v-if="_.get(match_info,'mhlu[1]')">
          <img style="width: 28px;height: 28px;" v-img="([match_info.mhlu[0],match_info.frmhn[0],match_info.csid])">
          <img style="width: 28px;height: 28px;" v-img="([match_info.mhlu[1],match_info.frmhn[1],match_info.csid])">
        </div>
        <img style="width: 28px;height: 28px;" v-else v-img="([match_info.mhlu[0],match_info.frmhn[0],match_info.csid])">
      </div>
      <!-- 战队名称 -->
      <div class="name-wrap left-name">
        <div class="name relative-position">
          <div class="ellipsis yb-absolute">{{match_info.mhn}}</div>
          <q-tooltip v-if="version_name == 'zhuanye'" anchor="top middle" self="center middle" :content-style="tooltip_style+'transform:translateY(3px);'">
            {{match_info.mhn}}
          </q-tooltip>
        </div>
        <div class="score active" :class="{scoring}">
          <template v-if="match_info.ms != 110">{{scoring?i18n_t('mmp.100.scoring'):main_score.home}}</template>
        </div>
      </div>
      <div class="time-wrap yb-flex-center">
        <match-progress :match_props="{match:match_info}" :row="2" />
      </div>
      <div class="name-wrap right-name">
        <div class="score active" :class="{scoring}">
          <template v-if="match_info.ms != 110">{{ scoring?i18n_t('mmp.100.scoring'):main_score.away}}</template>
        </div>
        <div class="name relative-position">
          <div class="ellipsis yb-absolute">{{match_info.man}}</div>
          <q-tooltip v-if="version_name == 'zhuanye'" anchor="top middle" self="center middle" :content-style="tooltip_style+'transform:translateY(3px);'">
            {{match_info.man}}
          </q-tooltip>
        </div>
      </div>
      <!-- 客队logo -->
      <div class="logo-wrap yb-flex-center right-logo">
        <div class="double  relative-position" v-if="_.get(match_info,'malu[1]')">
          <img style="width: 28px;height: 28px;" v-img="([match_info.malu[0],match_info.frman[0],match_info.csid])">
          <img style="width: 28px;height: 28px;" v-img="([match_info.malu[1],match_info.frman[1],match_info.csid])">
        </div>
        <img style="width: 28px;height: 28px;" v-else v-img="([match_info.malu[0],match_info.frman[0],match_info.csid])">
      </div>
    </div>
    <!-- 右边按钮 -->
    <div class="right-wrap">
      <!-- 统计分析 -->
      <div class="yb-flex-center" v-show="is_show_sr_flg(match_info)" @click="sr_click_handle">
        <icon size="14px" name="icon-signal" />
        <q-tooltip v-if="version_name == 'zhuanye'" anchor="top middle" self="center middle" :content-style="tooltip_style">{{i18n_t('common.analysis')}}</q-tooltip>
      </div>
      <!-- 刷新按钮 -->
      <div class="refresh">
        <refresh :other_icon="true" icon_name="icon-balance_refresh" :loaded="refresh_loading" @click="refresh()" />
      </div>
      <!-- 退出全屏 -->
      <!-- <div class="yb-flex-center" @click="exit_full_screen">
        <icon size="14px" name="icon-small" />
        <q-tooltip v-if="version_name == 'zhuanye'" anchor="top middle" self="center middle" :content-style="tooltip_style">{{i18n_t('video.outbig')}}</q-tooltip>
      </div> -->
    </div>
  </div>
</template>

<script>
import {MatchProcessFullVersionWapper as MatchProgress} from "src/components/match-process/index.js"
import { is_show_sr_flg } from "src/core/utils/project/module/other.js";
import details from "src/core/match-list-pc/details-class/details.js"
import video from "src/core/video/video.js"
import refresh from "src/components/refresh/refresh.vue"
const { DEFAULT_VERSION_NAME } = window.BUILDIN_CONFIG;
export default {
  name: "VideoHeader",
  components:{
    MatchProgress,
    refresh
  },
  props:{
    match_info:{
      type:Object,
      default:{}
    },
    refresh_loading:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      version_name:DEFAULT_VERSION_NAME,
    }
  },
  computed:{
    // ...mapGetters(['get_layout_cur_page',"get_play_media"]),
    // 是否展示为比分判定中 
    scoring() {
      const {csid, ms, mmp} = this.match_info || {};
      const home_score = _.get(this.main_score,'home',0);
      const away_score = _.get(this.main_score,'away',0);
      let scoring = false
      if (
        this.$is_eports_csid(csid) && // 电竞赛事
        this.$get_match_status(ms, [ 110 ]) // 且为滚球（进行中）状态
      ) {
        // 电竞未开赛 展示为 第一局
        const mmp_state = mmp || 1
        // 当前局数不等于 比分总和加一，則提示比分判定中
        if (mmp_state != (Number(home_score) + Number(away_score) + 1)) {
          scoring = true
        }
      }
      return scoring
    },
    /**
     * @Description 主比分 
     * @param {object} 
    */
    main_score(){
      let key = "S1"
      // 足球
      if (this.match_info.csid == 1) {
        // S7:加时赛比分
        if ([32, 33, 41, 42, 110].includes(this.match_info.mmp*1)) {
          key = "S7"
        }
        // S170:点球大战比分
        else if ([34, 50, 120].includes(this.match_info.mmp*1)) {
          key = "S170"
        } 
      }
      return this.match_info.msc[key]
    }
  },
  mounted() {
    // 刷新按钮节流
    this.refresh = this.throttle(this.refresh, 1000,{leading:true, trailing:false});
  },
  methods:{
    // ...mapActions(['set_play_media','set_is_back_btn_click']),
    /**
     * @description 刷新页面
     */
    refresh() {
      this.$emit('refresh')
    },
    /**
    * @Description:返回按钮
    * @return {undefined} undefined
    */
    on_return(){
    	// 当时大视频页面时
      if(this.$route.name=='video'){
        // 判断是否是动画和视频的大视频模式
        if([1,2].includes(this.$route.params.play_type))
        {
          // 返回上个页面
          window.vue.$router.back();
          return
        }
      }
      sessionStorage.setItem('back_from_page', 'video')
      if (this.get_play_media.media_type === 'topic') {
        video.send_message({
          cmd: 'record_play_info',
          val: {
            record_play_time: true
          }
        })
      }
      
      clearTimeout(this.back_to_timer)
      this.back_to_timer = setTimeout(() => {
        this.$redirect_router('/home')
        let time = Date.now()
        
        this.set_play_media({
          mid:this.match_info.mid,
          media_type: this.get_play_media.media_type,
          time
        })
        
        this.$root.$emit(this.emit_cmd.EMIT_BACK_FROM_PAGE, {page: 'video'})
      }, 50)
    },
    /**
    * @Description:跳转数据分析
    * @return {undefined} undefined
    */
    sr_click_handle(){
      details.sr_click_handle(this.match_info)
    },
  },
  destroyed() {
    clearTimeout(this.back_to_timer)
    this.debounce_throttle_cancel(this.refresh);
    this.back_to_timer = null
  }
}
</script>

<style lang="scss" scoped>
.video-header {
  height: 36px;
  /** 比分判定中*/
  .scoring{
    margin-left: 8px;
    margin-right: 8px;
  }

  /** 中间区域 -S*/
  .center-wrap {
    margin: auto;
    display: flex;
    width: 73%;
    height: 100%;
    max-width: 634px;
    .time-wrap {
      width: 90px;
      height: 100%;
      background-size: 100%;
      line-height: 14px;
      text-align: center;
      :deep(*) {
        width: 100%;
      }
    }
    .logo-wrap {
      width: 110px;
      height: 100%;
      background-size: 100%;
      &.left-logo {
        .double {
          margin-right: 15px;
        }
        > img {
          margin-right: 17px;
        }
      }
      &.right-logo {
        .double {
          margin-left: 15px;
        }
        > img {
          margin-left: 17px
        }
      }

      img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
      }
      .double {
        height: 28px;
        width: 46px;

        img:last-child {
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
    .name-wrap {
      flex: 1;
      background-repeat: repeat-x;
      background-size: 1px 100%;
      display: flex;
      align-items: center;
      &.left-name {
        justify-content: flex-end;
        .ellipsis {
          text-align: right;
        }
      }
      .name {
        height: 100%;
        line-height: 36px;
        flex: 1;
      }
      .score {
        min-height: 10px;
        font-size: 16px;
        min-width: 36px;
        text-align: center;
      }
    }
  }
  /** 中间区域 -E*/
  .left-wrap {
    padding-left: 15px;
    width: 90px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    .q-icon {
      cursor: pointer;
    }
  }
  /** 右边区域 -S*/
  .right-wrap {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    padding-right: 10px;
    align-items: center;
    width: 90px;
    height: 100%;
    justify-content: flex-end;
    .yb-flex-center {
      border-radius: 8px;
      width: 26px;
      height: 26px;
      margin-left: 5px;
      cursor: pointer;
    }
  }
  /** 右边区域 -E*/
  .refresh {
    width: 24px;
    height: 24px;
    border-radius: 13px;
    padding: 0;
    :deep(.icon-wrap)  {
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
</style>