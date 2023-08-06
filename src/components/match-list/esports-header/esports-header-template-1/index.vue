<template>
  <!-- 电竞背景图 sportsbg-csid -->
  <div class="c-esports-header" :class="`sportsbg-${current_menu.csid}`" v-if="NewMenu.menu_root == 2000">
    <!-- 游戏种类列表 -->
    <div class="sport-tab">
      <div
        class="sport-item"
        :class="{ active: current_menu.mi == item.mi }"
        v-for="item in dianjing_sublist"
        :key="item.csid"
        @click="sport_click(item)"
      >
        <!-- 游戏logo -->
        <sport-icon :sport_id="item.csid" status="2" size="24px" />
        <!-- 游戏名称-->
        <div class="sport-name">
          <!-- {{ current_menu.mi }} -->
          {{ menus_i18n_map[item.mi] }}
        </div>
      </div>
    </div>

    <!-- 日期列表 -->
    <div class="date-wrap">
      <DateTab />
    </div>
  </div>
</template>

<script>

import { computed, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import { useRegistPropsHelper, useProps } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
import { EMIT_MX_COLLECT_MATCH } from 'project_path/src/core/mitt/mitt-keys.js';
useRegistPropsHelper(component_symbol, need_register_props)
import { useMittEmit } from 'src/core/mitt/index.js'
import { get_match_status } from 'src/core/utils/index'
import details from 'src/core/match-list/details-class/details.js'
import { other_play_name_to_playid } from 'src/core/match-list/data-class-ctr/conifg/other_play_id.js';
// ...mapGetters({
//     // 左侧详情参数
//     vx_detail_params: "get_match_details_params",
//     //视屏播放类型
//     vx_play_media: "get_play_media",
//     //获取当前菜单信息
//     vx_cur_menu_type: "get_cur_menu_type",
//      // 页面布局大小信息
//     vx_get_layout_size: "get_layout_size",
//     //全局开关
//      get_global_switch:'get_global_switch',
//      lang: "get_lang",
//      //视频是否展开状态
//     vx_get_is_fold_status:'get_is_fold_status'
//   }),

// ...mapActions({
//     set_is_pause_video: "set_is_pause_video",
//     //设置多列玩法状态
//     set_unfold_multi_column:"set_unfold_multi_column",
//     // 设置获取视频是否展开状态
//     vx_set_is_fold_status: "set_is_fold_status"
//   }),

const props = defineProps({ ...useProps })
const route = useRoute();

// 盘口数量
const handicap_num = computed(() => {
  if (this.get_global_switch.handicap_num) {
    return `+${props.match.mc || 0}`
  } else {
    return this.$root.$t('match_info.more')
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
  let is_esports = props.NewMenu.is_esports()
  //滚球状态
  let is_play = get_match_status(ms)
  // 包含的语言
  let status = ['zh', 'tw'].includes(localStorage.getItem(lang))
  //演播厅
  if (lvs == 2 && status && [1, 0].includes(lss)) {
    if (lss === 1) {
      cur_video_icon = {
        type: "studio",
        text: this.$root.$t('common.studio'),
      }
      //专题
    } else if (lss === 0 && !is_play) {
      cur_video_icon = {
        type: "topic",
        text: this.$root.$t('common.topic'),
      }
    }
    //主播
  } else if (tvs == 2 && status) {
    cur_video_icon = {
      type: "anchor",
      text: this.$root.$t('common.anchor'),
    }
    //源视频                       非电竞 或者电竞有url
  } else if (mms == 2 && (varl || vurl || !is_esports) && is_play) {
    cur_video_icon = {
      type: "video",
      text: this.$root.$t('common.o_video'),
    }
  }
  return cur_video_icon
})

/**
 * @Description 切换右侧赛事
 * @param {string} media_type 播放类型
 * @param {undefined} undefined
*/
const on_switch_match = (media_type) => {
  //展开右侧详情
  this.set_unfold_multi_column(false)
  this.set_is_pause_video(false)
  if ((route.name == 'details' || route.name == 'search') && media_type == 'auto') {
    media_type = 'info'
  }
  if (['auto', 'info'].includes(media_type) && this.vx_detail_params.mid == this.match.mid && this.vx_play_media.media_type != 'auto') {
    details.sync_mst(props.match.mid, this.match.csid)
  }
  let play_id = other_play_name_to_playid[props.match.play_current_key] || ''
  details.on_switch_match(media_type, props.match, play_id)
  // 如果右侧视频区是折叠，则会展开
  if (!this.vx_get_is_fold_status) {
    this.vx_set_is_fold_status(!this.vx_get_is_fold_status)
  }
}
/**
 * 跳转至详情
 * @return {undefined} undefined
 */
const on_go_detail = () => {
  if (is_eports_csid(props.match.csid)) {
    props.match.go_detail_type = 'no_switch'
  }
  details.on_go_detail(props.match)
}
/**
 * @Description 赛事收藏
 * @param {undefined} undefined
*/
const collect = () => {
  useMittEmit(EMIT_MX_COLLECT_MATCH, props.match)
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
    margin: 4px 0;

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
}</style>