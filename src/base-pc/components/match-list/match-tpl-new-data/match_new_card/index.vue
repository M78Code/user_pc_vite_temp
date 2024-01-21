<!--
 * @Author: Cooper
 * @Date: 2023-09-27 18:01
 * @Description: 赛事主列表页——新手版列表
-->
<template>
  <div class="match-new-card" :class="MenuData.is_virtual_sport && 'virtual_sport'">
    <div class="match-part" v-if="!MenuData.is_virtual_sport">
      <!-- 比赛进程 -->
      <match-process v-if="is_mounted && match" :match="match" source='match_list' show_page="match-list" :rows="2" />
    </div>
    <div class="match-part" v-else>
    
      {{ match._match_index }}
    </div>
    <!-- 中间赛事信息 -->
    <div class="match-des">
    
      <div class="match-data" :class="!show_data && 'no-data'" @click.stop="show_data && click_handle()" v-if="!MenuData.is_virtual_sport">
        <!-- 数据 -->
        <span v-if="show_data && !['7'].includes(play_csid) && !MenuData.is_esports()">
          {{ i18n_t("analysis.data") }}
        </span>
        <span v-else> {{ match.mfo }}</span>
      </div>
      <div class="match-data" v-if="show_data && MenuData.is_virtual_sport" @click="click_popup">
        <span>{{ i18n_t("analysis.data") }}</span>
        <!-- 统计分析 弹层-->
        <q-menu v-model="is_show" anchor="bottom middle" self="top left" :content-class="`tips-body ${popup_class}`">
           <!-- 弹层箭头 -->
          <!-- <div class="direction" :class="{'other':match.csid !=1001}"></div> -->
          <!-- 统计分析主体 -->
          <!-- <virtual-match-statistic :match="match" :row_index="match.csid !=1001 ? statistic_mark : -1" :class="['statistic-popup']" /> -->
        </q-menu>
      </div>
      <div
        class="match-new-handicap match-left"
        @click="onMatchNewHandicapClick('betItemLeft')"
        :class="{
          active: betItemActive.left,
          lift_up:
            lift_obj.oid == handicap_list[0].oid && lift_obj.odds_lift == 'up',
          lift_down:
            lift_obj.oid == handicap_list[0].oid &&
            lift_obj.odds_lift == 'down',
          'is_iframe': is_iframe
        }"
      >
        <div>
          <bet-item
            v-if="is_mounted"
            :ol_data="handicap_list[0]"
            @oddsChange="
              (odds_lift_obj) => {
                lift_obj = odds_lift_obj;
              }
            "
            ref="betItemLeft"
            @stateChage="onBetItemStateChange('left', $event)"
            direction="left"
            :odds_state_default_val="get_version==2?'seal':''"
          />
        </div>
        <div
          class="match-item-team-name"
          style="margin-left: var(--private-margin)"
        >
          <div class="match-name" v-tooltip='{content:match.mhn, overflow: 2 }'>
            {{
              MenuData.is_virtual_sport ? _.get(match, "teams[0]") : match.mhn
            }}
          </div>
          <img
            v-if="is_mounted"
            style="width: 28px; max-height: 28px; margin-left: 6px"
            v-img="[
              match.match_logo.home_1_logo,
              match.match_logo.home_1_letter,
              match.csid,
            ]"
          />
        </div>
      </div>
      <!-- 主比分 -->
      <div class="match-score">
        {{
          play_name_obj.score_key
            ? _.get(match, `score_obj.${play_name_obj.score_key}.home`)
            : match.home_score
            ? match.home_score
            : ""
        }}
      </div>
      <!-- 平局 -->
      <div
        v-if="['1', '1001'].includes(match.csid) && handicap_list.length > 2"
        :class="{
          'odd-detail': true,
          active: betItemActive.detail,
          lift_up:
            lift_obj1.oid == handicap_list[2].oid &&
            lift_obj1.odds_lift == 'up',
          lift_down:
            lift_obj1.oid == handicap_list[2].oid &&
            lift_obj1.odds_lift == 'down',
        }"
        @click="onMatchNewHandicapClick('betItemDetail')"
      >
        <span class="common-text mr-8">{{ i18n_t("analysis.draw") }}</span>
        <span class="match-odd">
          <bet-item
            v-if="is_mounted"
            @oddsChange="
              (odds_lift_obj) => {
                lift_obj1 = odds_lift_obj;
              }
            "
            ref="betItemDetail"
            @stateChage="onBetItemStateChange('detail', $event)"
            :ol_data="handicap_list[2]"
            :odds_state_default_val="get_version==2?'seal':''"
        /></span>
      </div>
      <div v-else style="width: 120px; text-align: center">—</div>
      <!-- 比分 -->
      <div class="match-score">
        {{
          play_name_obj.score_key
            ? _.get(match, `score_obj.${play_name_obj.score_key}.away`)
            : match.away_score
            ? match.away_score
            : ""
        }}
      </div>
      <div
        class="match-new-handicap match-right"
        @click="onMatchNewHandicapClick('betItemRight')"
        :class="{
          active: betItemActive.right,
          lift_up:
            lift_obj2.oid == handicap_list[1].oid &&
            lift_obj2.odds_lift == 'up',
          lift_down:
            lift_obj2.oid == handicap_list[1].oid &&
            lift_obj2.odds_lift == 'down',
          'is_iframe': is_iframe
        }"
      >
        <div
          class="match-item-team-name"
          style="margin-right: var(--private-margin)"
        >
          <img
            v-if="is_mounted"
            style="width: 28px; max-height: 28px; margin-right: 6px"
            v-img="[
              match.match_logo.away_1_logo,
              match.match_logo.away_1_letter,
              match.csid,
            ]"
          />

          <div class="match-name" v-tooltip='{content:match.man, overflow: 2 }'>
            {{
              MenuData.is_virtual_sport ? _.get(match, "teams[1]") : match.man
            }}
          </div>
        </div>
        <div>
          <span class="match-odd">
            <bet-item
              v-if="is_mounted"
              @oddsChange="
                (odds_lift_obj) => {
                  lift_obj2 = odds_lift_obj;
                }
              "
              ref="betItemRight"
              @stateChage="onBetItemStateChange('right', $event)"
              :ol_data="handicap_list[1]"
              :odds_state_default_val="get_version==2?'seal':''"
          /></span>
        </div>
      </div>
      <div
        class="match-data"
        :class="!show_data ? 'md-more' : ''"
        @click="toDetail()"
      >
        <!-- 更多 -->
        {{ i18n_t("match_info.more") }}
      </div>
    </div>
    <!-- 赛事收藏，视频播放 -->
    <div class="match-method" v-if="!MenuData.is_virtual_sport">
      <!-- 是否收藏 -->
      <span
        @click.stop="collect"
        class="yb-flex-center yb-hover-bg m-star-wrap-match mb-15"
        v-if="get_global_switch.collect_switch"
      >
        <i
          aria-hidden="true"
          class="icon-star q-icon c-icon"
          :class="(match.mf == 1 || match.mf == true) && 'active'"
        ></i>
      </span>
      <!-- 视频 -->
      <div
        v-if="cur_video_icon.type=='video'"
        @click="on_switch_match(cur_video_icon.type)"
        v-tooltip="{ content: cur_video_icon.text }"
        class="icon-wrap relative-position"
      >
        <div
          :class="[
            'v-icon',
            {
              'video-active':
                vx_detail_params.mid == match.mid &&
                (vx_play_media.media_type == cur_video_icon.type ||
                  (MenuData.is_esports() && route.name != 'search')),
            },
          ]"
        >
          <!-- 视频 -->
          {{ i18n_t("video.icon_video") }}
        </div>
      </div>
      <!-- 演播厅 -->
      <div
        v-if="cur_video_icon.type=='studio'"
        @click="on_switch_match(cur_video_icon.type)"
        v-tooltip="{ content: cur_video_icon.text }"
        class="icon-wrap relative-position"
      >
        <div
          :class="[
            'v-icon',
            {
              'video-active':
                vx_detail_params.mid == match.mid &&
                (vx_play_media.media_type == cur_video_icon.type ||
                  (MenuData.is_esports() && route.name != 'search')),
            },
          ]"
        >
          <!-- 演播厅 -->
          {{ i18n_t("common.studio") }}
        </div>
      </div>
      <!-- 动画 -->
      <div
        v-else-if="match.mvs > -1 && !cur_video_icon.type"
        class="icon-wrap relative-position"
        @click="on_switch_match('animation')"
        v-tooltip="{ content: i18n_t('common.animate') }"
      >
        <div
          class="v-icon"
          :class="
            vx_detail_params.mid == match.mid &&
            vx_play_media.media_type == 'animation' &&
            'video-active'
          "
        >
          <!-- 动画 -->
          {{ i18n_t("video.icon_animation") }}
        </div>
      </div>
      <!-- 比分 -->
      <div
        v-tooltip="{ content: i18n_t('common.score_board') }"
        class="icon-wrap after_tpl0 relative-position"
        :class="
          vx_detail_params.mid == match.mid &&
          vx_play_media.media_type == 'info' &&
          'active'
        "
        @click="on_switch_match('auto')"
        v-show="(!MenuData.is_esports() || route.name == 'search') && match.mvs < 0 && !cur_video_icon.type"
      >
        <div
          class="v-icon"
          :class="
            vx_detail_params.mid == match.mid &&
            (vx_play_media.media_type == 'info' ||
              vx_play_media.media_type == 'auto') &&
            'video-active'
          "
        >
          <!-- 比分 -->
          {{ i18n_t("video.icon_score") }}
        </div>
      </div>
    </div>
    <!-- 虚拟体育 视频播放 -->
    <div class="match-method" v-else>
      <!-- 视频 -->
      <div v-if="match.mms == 1" @click="on_switch_match()">
        <div
          :class="[
            'v-icon',
            { 'video-active': get_vsport_params.mid == match.mid },
          ]"
        >
          <!-- 视频 -->
          {{ i18n_t("video.icon_video") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MatchProcessFullVersionWapper as MatchProcess } from 'src/components/match-process/index.js';
import betItem from "src/base-pc/components/bet-item/bet-item-list-ouzhou-data.vue"
import { ref, computed, watch, onMounted, inject, reactive } from 'vue';
import { MenuData } from "src/output/index.js";
import { getScrollbarWidth } from 'src/core/utils/common/index'
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const match = inject("match")
const betItemActive = reactive({
  left: false,
  detail: false,
  right: false,
})
const popup_class = ref("")

// 获取胜平负数据
const handicap_list = ()  => {
  if(MenuData.cur_level2_menu=='30101'){
    let ols = []
    ols = match.value.main_handicap_list.map(item=>item.ols[0])
  return ols
  }else{
    return match.value.main_handicap_list[0].ols;
  }
  
}

const show_data = () => {
  let state = false
    //足球 篮球 电竞 vr足球  B03电子足球、C01、O01等
  if(['1','2','100','101','102','103','1001'].includes(match.value.csid) && !['B03','C01','O01'].includes(match.value.cds)){
    state = true
  }
  return state;
}
/**
 * @Description 点击弹层 
 * @param {undefined} undefined
*/
const click_popup = (e) =>{
  let height = match.value.csid == 1001 ? 282 : 110
  //元素底部距离浏览器顶部位置
  let bottom = e.target.getBoundingClientRect().bottom
  //获取滚动条宽度
  let margin = getScrollbarWidth()
  //客放位置高度
  let innerHeight = window.innerHeight - margin
  if (bottom + height > innerHeight) {
    popup_class.value = 'style2'
  }else{
    popup_class.value = 'style1'
  }
}

const onBetItemStateChange = (activeKey, state) => {
  if (state == "active") {
    betItemActive[activeKey] = true;
  } else {
    betItemActive[activeKey] = false;
  }
}

</script>

<style lang="scss" scoped>
@import "./index.scss";
.match-item-team-name {
  --private-margin: 5px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex: 1;
}

/*  弹窗样式 */
.tips-body {
  overflow: unset;
  &.style1 {
    transform: translate(10px, 8px);
    .direction {
      top: -12px;
    }
  }
  &.style2 {
    transform: translate(10px, -8px);
    .direction {
      bottom: -12px;
      transform: rotate(180deg);
    }
  }

  /* 箭头 */
  .direction {
    position: absolute;
    left: 0px;
    width: 14px;
    height: 14px;
    border: 7px solid transparent;
    border-bottom: 7px solid #eaeaea;
    //虚拟摩托车等箭头位置
    &.other {
      left: 200px;
    }
  }
  .direction:after {
    position: absolute;
    border-width: 0 5px 5px;
    border-style: solid;
    border-color: transparent transparent #f7f8fa;
    content: "";
    top: 2px;
    left: -5px;
    pointer-events: none;
  }
}
.virtual_sport {
  margin-top: 4px;
}
</style>
