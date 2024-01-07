<!--
 * @Author: Cable
 * @Date: 2020-07-31 16:14:55
 * @Description: 右侧视频控制区域组件
-->
<template>
  <div class="component i-pc c-video-ctrl">
    <!-- 控制区 -->
    <div class="ctrl-wrap row items-center justify-between">
      <div
        class="unfold"
        :class="{ open: vx_get_is_fold_status }"
        @click="$emit('setfoldStatus')"
        :style="compute_css_obj('pc-img-match-info-unfold-open')"
      ></div>

      <div class="col-center row full-height">
        <!-- 媒体图标 -->
        <div
          v-for="item in media_icons"
          :key="item.type"
          class="wrap_source relative-position"
          :class="{
            active: vx_play_media.media_type == item.type,
            line: vx_play_media.media_type == item.type && !is_hover,
          }"
          @click="toggle_play_media(item.type)"
          @mouseenter="is_hover = true"
          v-show="get_media_icon_show(item.type)"
        >
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style + ';transform:translateY(8px)'"
            >{{ item.text }}</q-tooltip
          >
          <div
            :style="compute_css_obj(item.icon)"
            :class="[
              'vicon',
              `${item.type}-icon`,
              { active: vx_play_media.media_type == item.type },
            ]"
          ></div>
        </div>
      </div>
      <!-- 全屏 -->
      <div class="col-right">
        <div
          class="fold-btn"
          @click="LayOutMain_pc.set_unfold_multi_column(true)"
          v-if="
            menu_data.is_multi_column &&
            GlobalSwitchClass.global_switch.multi_column &&
            !LayOutMain_pc.get_is_unfold_multi_column() &&
            ['search', 'home'].includes(route.name) &&
            !filterHeader.show_filter_popup
          "
        >
          <span class="text">{{i18n_t("icon_tips.fold") }}</span>
          <i class="icon-arrow q-icon c-icon" size="12px"></i>
        </div>
        <div
          v-if="
            animation_btn_show &&
            ['animation'].includes(vx_play_media.media_type) &&
            vx_get_is_fold_status
          "
        >
          <icon-wapper
            name="icon-big"
            color="#5A6074"
            size="14px"
            @click="full_screen"
          />
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style + ';white-space: nowrap;'"
            >{{i18n_t("video.big_screen_mode") }}</q-tooltip
          >
          <!-- 全屏 -->
        </div>
        <!-- 刷新按钮 -->
        <div class="refresh">
          <refresh
            :other_icon="true"
            icon_name="icon-balance_refresh"
            :loaded="refresh_loading"
            @click="refreshFunc()"
          />
        </div>
      </div>
    </div>

    <!-- 战队信息 -->
    <div class="vs-team-wrap relative-position" v-if="match_info.mid != -1">
      <div
        class="absolute-wrap"
        :data-mid="match_info.mid"
        :style="{ height: team_height }"
      >
        <!--对战队伍展示-->
        <div
          class="item current vs-team-container"
          :class="{
            'cursor-pointer': vx_play_media.media_type == 'video',
            'team-wrap-bg': !vx_get_is_fold_status,
          }"
          @click.stop="toggle_item"
        >
          <div class="line"></div>
          <span class="soprts_id_icon"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_${BaseData.compute_sport_id(menu_data.left_menu_result.lv1_mi.slice(0,-1))}` })"
            :alt="BaseData.menus_i18n_map[menu_data.left_menu_result.lv1_mi]"></span>
          <!-- <sport-icon
            v-if="match_info.csid && match_info.csid != -1"
            :sport_id="match_info.csid"
          
            key_name="pc-left-menu-bg-image" 
            size="18px"
          /> -->
          <div
            class="team-wrap ellipsis col allow-user-select"
            v-if="match_info.mhn"
          >
            {{ match_info.mhn }}
            <span class="separate">v</span>
            {{ match_info.man }}
          </div>
          <div
            class="yb-icon-arrow"
            :class="{ active: team_height == height1 }"
            v-show="
              videos.length > 0 &&
              ['video', 'animation'].includes(vx_play_media.media_type) &&
              vx_get_is_fold_status
            "
          ></div>
        </div>
        <!--视频切换-->
        <q-scroll-area
          class="scroll-area rule-scroll-area"
          ref="match_scroll_area"
        >
          <div
            class="item"
            :class="{ active: val.mid == match_info.mid }"
            v-for="(val, key) in videos"
            :key="key"
            @click="switch_video(val)"
          >
            <div class="line"></div>
            <!-- <sport-icon :sport_id="val.csid" status="2" size="18px" /> -->
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
<script setup>
import { tooltip_style } from "src/core/config/global-component-style.js";
// import sportIcon from "src/components/sport_icon/sport-icon.vue";
import video from "src/core/video/video.js"
import details from "src/core/match-list-pc/details-class/details.js";
import { computed, onMounted, onUnmounted, ref, watch,nextTick } from "vue";
import { IconWapper } from "src/components/icon";
import refresh from "src/components/refresh/refresh.vue";
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
import { get_match_status,UserCtr ,GlobalSwitchClass,MatchDetailCalss,get_media_icon_index,MenuData} from "src/output/index.js";
import { compute_css_obj } from "src/core/server-img/index.js";
import filterHeader from "src/core/filter-header/filter-header.js";
import { debounce_throttle_cancel } from "src/core/utils/common/module/other.js";
import { useRoute, useRouter } from "vue-router";
import BaseData from "src/core/base-data/base-data.js"

const  route = useRoute()
const  router= useRouter()
import lodash from "lodash";
const props = defineProps({
  refresh_loading: {
    type: Boolean,
    default: false,
  },
  match_info: Object, //赛事详情
  icons_right: Number,
});
const match_scroll_area=ref(null)
const emit = defineEmits(["refresh"]);
const thumb_style2 = ref({}); //赛事列表滚动条样式
const height0 = ref("100%"); //战队信息盒子高度初始高度
const height1 = ref("216px"); //有视频的赛事列表滚动区域高度
const team_height = ref(height0.value); //战队信息盒子高度
const videos = ref([]); //有视频的赛事列表
const is_hover = ref(false); //视频icon是否hover
const menu_data = ref(MenuData); //菜单数据
const lang = ref(UserCtr.lang)// 语言
const media_icons = [
  /**比分版 */
  {
    type: "info",
    text: i18n_t("common.score_board"),
    icon: "pc-img-match-info-switch2",
  },
  /**演播室 */
  {
    type: "studio",
    text: i18n_t("common.studio"),
    icon: "studio",
  },
  /**主播 */
  {
    type: "anchor",
    text: i18n_t("common.anchor"),
    icon: "anchor",
  },
  /** 专题*/
  {
    type: "topic",
    text: i18n_t("common.topic"),
    icon: "topic",
  },
  /**源视频 */
  {
    type: "video",
    text: i18n_t("common.o_video"),
    icon: "pc-img-match-info-video0",
  },
  /**动画 */
  {
    type: "animation",
    text: i18n_t("common.animate"),
    icon: "pc-img-match-info-animation0",
  },
];
const  isTop  = ref(MatchDetailCalss.isTop) //视频置顶
const  vx_play_media = ref(MatchDetailCalss.play_media) // 视频播放信息
const  details_params = ref(MatchDetailCalss.params) // 赛事详细参数（赛事/联赛/球类/直播类型）
const  get_global_click = ref(GlobalSwitchClass.global_click)   //全局点击事件数
//   // 设置获取视频是否展开状态
const vx_get_is_fold_status = ref(GlobalSwitchClass.is_fold_status);
let set_play_media_timer = null;
/**
 * @Description:获取图标是否显示
 * @returns
 */
const get_media_icon_show = (type) => {
  switch (type) {
    case "info":
      return true;
    case "video":
      return video_btn_show.value;
    case "animation":
      return animation_btn_show.value;
    case "studio":
      return studio_btn_show.value;
    case "topic":
      return topic_btn_show.value;
    default:
      return false;
  }
};
const refreshFunc = lodash.throttle(
  () => {
    // 刷新按钮节流
    emit("refresh");
  },
  1000,
  {
    leading: true,
    trailing: false,
  }
);
/*
 ** 监听MatchDetailCalss的版本号  获取最新的详情参数
 */
watch(
  () => MatchDetailCalss.details_data_version.version,
  (val) => {
    if (val) {
      vx_play_media.value = MatchDetailCalss.play_media;
      details_params.value = MatchDetailCalss.params;
    }
  },
  { deep: true }
);
/*
 ** 监听GlobalSwitchClass的版本号  获取最新的全局状态
 */
 watch(
  () => GlobalSwitchClass.global_switch_version.version,
  (val) => {
    if (val) {
      get_global_click.value = GlobalSwitchClass.global_click;
      vx_get_is_fold_status.value = GlobalSwitchClass.global_click;
    }
  },
  { deep: true }
);
//     computed: { 
//   // ...mapGetters({
//   //   //全局点击事件
//   //   get_global_click: 'get_global_click',
/**
 * @Description:视频按钮是否显示
 * @return {boolean}
 */
const video_btn_show = computed(() => {
  return (
    props.match_info.mms == 2 && get_match_status(props.match_info.ms) == 1
  );
});
/**
 * @Description:动画按钮是否显示
 * @return {boolean}
 */
const animation_btn_show = computed(() => {
  return props.match_info.mvs > -1;
});
/**
 * @Description:演播室按钮是否显示
 * @returns
 */
const studio_btn_show = computed(() => {
  return (
    props.match_info.lvs == 2 &&
    props.match_info.lss === 1 &&
    ["zh", "tw"].includes(lang.value)
  );
});
/**
 * @Description:演播室按钮是否显示
 * @returns
 */
const topic_btn_show = computed(() => {
  return (
    props.match_info.lvs == 2 &&
    props.match_info.lss === 0 &&
    ["zh", "tw"].includes(lang.value) &&
    get_match_status(props.match_info.ms) !== 1
  );
});
//切换赛事列表盒子高度改变
watch(
  () => team_height,
  (res) => {
    if (res == height1.value) {
      get_videos();
    }
  }
);
//全局点击事件
watch(
  () => get_global_click,
  () => {
    team_height.value = height0.value;
    // is_show_content = false;  暂时没有看见用
  }
);


/**
 * @Description:切换视频
 * @param {string} match 赛事信息
 */
const switch_video = (match) => {
  team_height.value = height0.value;
  if (match.mid == props.match_info.mid) return;
  let { mid, tid, csid: sportId } = match;
  let play_id = details_params.play_id;
  MatchDetailCalss.set_match_details_params({
    mid,
    tid,
    sportId,
    play_id,
    media_type: vx_play_media.value.media_type,
    category: route.name == "details" ? 1 : 0,
  })
  if (route.name == "details") {
    router.push({
      name: "details",
      params: {
        mid,
        tid,
        csid: sportId,
      },
    });
  }
};
/**
 * @Description:切换赛事列表弹层
 * @return {undefined} undefined
 */
const toggle_item = () => {
  // 如果右侧视频区是折叠，则会展开
  if (!vx_get_is_fold_status.value) {
      GlobalSwitchClass.set_is_fold_status(!vx_get_is_fold_status.value);
  }
  if (
    !["video", "animation", "studio", "anchor", "topic"].includes(
      vx_play_media.value.media_type
    ) ||
    !vx_get_is_fold_status.value
  ) {
    team_height.value = height0.value;
    return;
  }
  team_height.value =
    team_height.value == height1.value ? height0.value : height1.value;
};
/**
 * @Description:获取有视频的赛事列表
 * @return {undefined} undefined
 */
const get_videos = () => {
  video.get_videos((res) => {
    videos.value = res;
    let index = details.get_match_index(props.match_info.mid, res);
    //当前选择赛事不在可见区域时 滚动到可见区域
    if (index > 4) {
      nextTick(() => {
        let top = (index - 3) * 36;
       match_scroll_area.value &&
          match_scroll_area.value.setScrollPosition("vertical",top, 0);
      });
    }
  });
};
/**
 * @Description:切换视频或动画
 * @param {string} media_type 切换类型
 */
const toggle_play_media = (media_type) => {
  // 如果右侧视频区是折叠，则会展开
  if (!vx_get_is_fold_status.value) {
    GlobalSwitchClass.set_is_fold_status(!vx_get_is_fold_status.value);
  }
  let { mms, mvs, mid, lvs = -1, lss = -1 } = props.match_info;
  let { mid: play_mid, media_type: play_media_type } = vx_play_media.value;

  // 当前已在播放了 则不在重新加载
  if (mid != play_mid || (mid == play_mid && media_type != play_media_type)) {
    if (
      (media_type == "video" && mms == 2) ||
      (media_type == "animation" && mvs > -1) ||
      (media_type == "studio" && lvs == 2 && lss === 1) ||
      (media_type == "topic" && lvs == 2 && lss === 0) ||
      media_type == "info"
    ) {
      if (media_type == "info") {
        details.sync_mst(mid);
      }

      // 专题视频切换其他媒体类型前 通知子iframe记录当前播放时间
      if (play_media_type === "topic") {
        video.send_message({
          cmd: "record_play_info",
          val: {
            record_play_time: true,
          },
        });
      }

      clearTimeout(set_play_media_timer);
      set_play_media_timer = setTimeout(() => {
        MatchDetailCalss.set_play_media( { media_type, mid, time: Date.now() })
      }, 50);
    }
  }
};
/**
 * @Description:视频进入全屏
 */
const full_screen = () => {
  // 根据icon获取数据源类型
  let play_type = get_media_icon_index(
    vx_play_media.value.media_type
  );
  video.full_screen(props.match_info, play_type,route,router);
};

onMounted(() => {
  let autoPlay = sessionStorage.getItem("auto_play_media");
  if (autoPlay) {
    toggle_play_media("video");
    sessionStorage.removeItem("auto_play_media");

  }
  Object.assign(thumb_style2.value, {
      width: "8px",
      right: "4px",
    });
    get_videos();
    refreshFunc();
});
onUnmounted(() => {
  debounce_throttle_cancel(refresh);
  clearTimeout(set_play_media_timer);
  set_play_media_timer = null;
});
</script>

<style lang="scss" scoped>
@import "src/base-pc/components/match-detail/match_info/video.scss";
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
  .col-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  /** 视频icon -S*/
  .vicon {
    width: 20px;
    height: 14px;
  }
  .q-icon {
    cursor: pointer;
  }
  .col-right {
    display: flex;
    .fold-btn {
      border-radius: 11px;
      padding: 2px 7px 2px 11px;
      color: var(--q-gb-t-c-1);
      display: flex;
      align-items: center;
      font-size: 12px;
      cursor: pointer;
      .text {
        margin-right: 2px;
      }
      .icon-arrow {
        transform: rotate(90deg);
        &::before {
          color: var(--q-gb-t-c-1);
        }
      }
    }
    .icon-big {
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
      :deep(.icon-wrap) {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon-balance_refresh {
          span {
            font-size: 18px;
            &::before {
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
      :deep(.q-scrollarea__thumb) {
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
    .yb-icon-triangle {
      position: absolute;
      top: -5px;
      left: 17px;
    }
  }
}

.soprts_id_icon {
  width: 18px;
  height: 18px;
  background-size: 100% auto;
}


.video-icon {
    background-image:url($SCSSPROJECTPATH+"/image/theme01/img/svg/video0.svg"); // TODO: video0.svg

    &.active {
      background-image: url($SCSSPROJECTPATH+"/image/theme01/img/svg/video2.svg"); // TODO: video2.svg)
    }
  }
  .animation-icon {
    background-image:url($SCSSPROJECTPATH+"/image/theme01/img/svg/animation0.svg"); // TODO: animation0.svg

    &.active {
      background-image: url($SCSSPROJECTPATH+"/image/theme01/img/svg/animation2.svg"); // TODO: animation2.svg
    }
  }

  .info-icon {
    background-image:url($SCSSPROJECTPATH+"/image/theme01/img/svg/switch0.svg");// TODO: switch0.svg
    background-repeat: no-repeat;

    &.active {
      background-image: url($SCSSPROJECTPATH+"/image/theme01/img/svg/switch2.svg");// TODO: switch2.svg
    }
  }
/** 提示内容 -S*/
</style>