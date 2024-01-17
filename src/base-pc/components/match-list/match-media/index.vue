<template>
  <div class="media-col-wrap">
    <!-- 无直播源 -->
    <!--  :style="compute_css_obj({key:'pc-img-match-info-switch2'})" -->
    <div class="icon-wrap after_tpl0 relative-position"
      :class="vx_detail_params.mid == match.mid && vx_play_media.media_type == 'info' && 'active'"
      @click="on_switch_match('auto')" v-if="!MenuData.is_esports() || route.name == 'search'">
      <div class="v-icon switch-icon info-icon"
        :class="vx_detail_params.mid == match.mid && vx_play_media.media_type == 'info' && 'active'"></div>
        <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style + ';transform:translateY(8px)'"
            >{{ i18n_t('common.score_board') }}</q-tooltip
          >
    </div>
    <div>
      <!-- 收藏 -->
      <div
        v-if="MenuData.is_esports() && (![1, 500].includes(MenuData.menu_root)) && route.name != 'search' && GlobalAccessConfig.get_collectSwitch()"
        class="yb-flex-center yb-hover-bg play-count-wrap" @click.stop="collect">
        <i aria-hidden="true" class="icon-star q-icon c-icon"
          :class="{ 'active': (match.mf == 1 || match.mf == true) }"></i>
      </div>
      <!-- 视频 -->
      <!-- :style="compute_css_obj({key:'pc-img-match-list-video'})" -->
      <div v-if="cur_video_icon.type" @click="on_switch_match(cur_video_icon.type)"
        class="icon-wrap relative-position video-icon">
        <div
          :class="['v-icon', `${cur_video_icon.type}-icon`, { 'active': vx_detail_params.mid == match.mid && (vx_play_media.media_type == cur_video_icon.type || (MenuData.is_esports() && route.name != 'search')) }]">
        </div>
        <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style + ';transform:translateY(8px)'"
            >{{ cur_video_icon.text }}</q-tooltip
          >
      </div>
    </div>
    <!-- 动画 -->
    <!-- :style="compute_css_obj({key:'pc-img-match-list-animation'})" -->
    <div v-if="match.mvs > -1" class="icon-wrap relative-position" @click="on_switch_match('animation')">
      <div class="v-icon animation-icon"
        :class="vx_detail_params.mid == match.mid && vx_play_media.media_type == 'animation' && 'active'"></div>
        <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style + ';transform:translateY(8px)'"
            >{{ i18n_t('common.animate') }}</q-tooltip
          >
    </div>
    <!-- 盘口数量 -->
    <!-- <div class="play-count-wrap no-wrap yb-flex-center" @click="on_go_detail" style="margin-top:10px;"
      v-if="MenuData.is_esports() && route.name != 'search'">
      <span class="count">{{ handicap_num }}</span>
      <div class="yb-flex-center" style="margin-left:5px">
        <div class="yb-icon-arrow"></div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { tooltip_style } from "src/core/config/global-component-style.js";
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import { is_eports_csid } from "src/core/constant/common/module/csid-util.js";
import { get_match_status, LayOutMain_pc, MatchDetailCalss, other_play_name_to_playid } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import details from 'src/core/match-list-pc/details-class/details.js'
//import store from 'src/store-redux/index.js';
import menu_config from "src/core/menu-pc/menu-data-class.js";
import { MenuData } from "src/output/project/index.js"


const router = useRouter()
// let state = store.getState();
// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));

const props = defineProps({
  match: {
    type: Object,
    default: () => { },
  },
})

const route = useRoute();
// 左侧详情参数
let vx_detail_params = reactive(MatchDetailCalss.params)
//视屏播放类型
const vx_play_media = ref(MatchDetailCalss.play_media)
/*
 ** 监听MatchDetailCalss的版本号  获取视屏播放类型
 */
watch(
  () => MatchDetailCalss.details_data_version.version,
  (val) => {
    if (val) {
      vx_play_media.value = MatchDetailCalss.play_media;
      lodash.merge(vx_detail_params,MatchDetailCalss.params)
    }
  },
  { deep: true }
);
let lang = UserCtr.lang;
// 视频是否展开状态
const vx_get_is_fold_status = ref(null)
// 盘口数量
const handicap_num = computed(() => {
  if (GlobalAccessConfig.get_handicapNum()) {
    return `+${props.match.mc || 0}`
  } else {
    return i18n_t('match_info.more')
  }
})

/**
   * @Description 计算当前视频图标
   * @return {Object}
  */
const cur_video_icon = computed(() => {
  let { lvs = -1, mms = -1, lss = -1, tvs = -1, ms, varl = "", vurl = "" } = props.match
  let cur_video_icon = {
    type: "",
    text: "",
  }
  //电竞
  let is_esports = MenuData.is_esports()
  //滚球状态
  let is_play = get_match_status(ms)
  // 包含的语言
  let status = ['zh', 'tw', 'hk'].includes(localStorage.getItem(lang))
  //演播厅
  if (lvs == 2 && status && [1, 0].includes(lss)) {
    if (lss === 1) {
      cur_video_icon = {
        type: "studio",
        text: i18n_t('common.studio'),
      }
      //专题
    } else if (lss === 0 && !is_play) {
      cur_video_icon = {
        type: "topic",
        text: i18n_t('common.topic'),
      }
    }
    //主播
  } else if (tvs == 2 && status) {
    cur_video_icon = {
      type: "anchor",
      text: i18n_t('common.anchor'),
    }
    //源视频                       非电竞 或者电竞有url
  } else if (mms == 2 && (varl || vurl || !is_esports) && is_play) {
    cur_video_icon = {
      type: "video",
      text: i18n_t('common.o_video'),
    }
  }
  return cur_video_icon
})

/**
 * @Description 切换右侧赛事
 * @param {string} media_type 播放类型
 * @param {undefined} undefined
*/
function on_switch_match(media_type) {
  if ((route.name == 'details' || route.name == 'search') && media_type == 'auto') {
    media_type = 'info'
  }

  //展开右侧详情
  //展开右侧详情
  // store.dispatch({
  //   type: 'SET_UNFOLD_MULTI_COLUMN',
  //   data: false
  // })
  // store.dispatch({
  //   type: 'SET_IS_PAUSE_VIDEO',
  //   data: false
  // })
  if ((route.name == 'details' || route.name == 'search') && media_type == 'auto') {
    media_type = 'info'
  }
  if (['auto', 'info'].includes(media_type) && vx_detail_params.mid == props.match.mid && vx_play_media.value.media_type != 'auto') {
    details.sync_mst(props.match.mid, props.match.csid)
  }
  let play_id = other_play_name_to_playid[props.match.play_current_key] || ''
  details.on_switch_match(media_type, props.match, play_id)
  LayOutMain_pc.set_unfold_multi_column(false)//多列隐藏
  // 如果右侧视频区是折叠，则会展开
  if (!vx_get_is_fold_status.value) {
    // store.dispatch({p
    //   type: 'SET_IS_FOLD_STATUS',
    //   data: !vx_get_is_fold_status.value
    // })
  }
}
/**
 * 跳转至详情
 * @return {undefined} undefined
 */
function on_go_detail() {
  if (is_eports_csid(props.match.csid)) {
    props.match.go_detail_type = 'no_switch'
  }
  details.on_go_detail(props.match, null, router)
}
/**
 * @Description 赛事收藏
 * @param {undefined} undefined
*/
function collect() {
  useMittEmit(MITT_TYPES.EMIT_MX_COLLECT_MATCH, props.match)
}

</script>
<style lang="scss" scoped>
/*  视频按钮 */
.media-col-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .icon-wrap {
    width: 20px;
    height: 14px;
    margin: 4px auto;
    .match_pre {
      width: 26px;
      height: auto;
    }
  }

  .c-icon {
    font-size: 14px;
  }

  .v-icon {
    width: 20px;
    height: 14px;
    cursor: pointer;
    margin-left: auto;
    margin-right: auto;
  }

  .flex-center {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 3px;
  }

  .settlement-pre {
    display: flex;
    justify-content: center;
  }
}

.play-count-wrap {
  cursor: pointer;
}

@media (max-width: 1698px) {
  .media-col-wrap {
    .flex-center {
      margin: 0;
    }
  }
}

.video-icon {
  background-image: url($SCSSPROJECTPATH+"/image/theme01/img/svg/video0.svg"); // TODO: video0.svg

  &.active {
    background-image: url($SCSSPROJECTPATH+"/image/theme01/img/svg/video2.svg"); // TODO: video2.svg)
  }
}

.animation-icon {
  background-image: url($SCSSPROJECTPATH+"/image/theme01/img/svg/animation0.svg"); // TODO: animation0.svg

  &.active {
    background-image: url($SCSSPROJECTPATH+"/image/theme01/img/svg/animation2.svg"); // TODO: animation2.svg
  }
}

.info-icon {
  background-image: url($SCSSPROJECTPATH+"/image/theme01/img/svg/switch0.svg"); // TODO: switch0.svg
  background-repeat: no-repeat;

  &.active {
    background-image: url($SCSSPROJECTPATH+"/image/theme01/img/svg/switch2.svg"); // TODO: switch2.svg
  }
}
</style>