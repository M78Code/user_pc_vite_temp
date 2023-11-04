<!--
 * @Description:  app-h5   新手版 
-->
<template>
      <div :style="{ marginTop: is_hot ? '0' : '' }" :class="['match-container']">
        <template v-if="match">
          <!-- <div style="display: none;">{{ MatchDataBaseH5.data_version.version }}</div> -->
          <!-- 未开赛标题  -->
          <div class="match-status-fixed flex items-center" v-if="match.is_show_no_play">
            <img src='image/list/list-red.svg' />
            <span class="din-regular">
              {{ $t('list.match_no_start') }}&nbsp;&nbsp;<span v-show="no_start_total">(0)</span>
            </span>
          </div>
          <!--体育类别 -- 标题  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
          <div v-if="get_sport_show" @click="handle_ball_seed_fold" :class="['sport-title match-indent', { first: i == 0 }]">
            <span class="score-inner-span"> {{ match_of_list.csna }}{{ '(' + menu_lv2.ct + ')' }} </span>
          </div>

          <!-- 最核心的div模块     标题 + 倒计时 + 比分 + 赔率盘口模块 -->
          <div :class="['match-inner-container', { 'collapsed': !collapsed }]">
            <!--联赛标题 -->
            <div @click="handle_league_fold" v-if="match.is_show_league || (is_hot && get_league_show(i))"
              :class="[('league match-indent')]">
              <div class="league-t-wrap right-border">
                <!-- 联赛收藏 -->
                <div v-if="![3000, 900].includes(menu_type)" class="favorited-icon" @click.stop="handle_league_collect">
                  <!-- 未收藏 -->
                  <img v-if="!league_collect_state" :src="compute_img_url('icon-favorite')" alt="">
                  <!-- 收藏图标 -->
                  <img v-if='league_collect_state' :src="compute_img_url('icon-favorite-s')">
                </div>
                <!-- 电竞图标 写死 -->
                <div class="esport" v-if="match_of_list.csid == 101"
                  :style="compute_css_obj('menu-sport-active-image', 2101)"></div>
                <div class="esport" v-else-if="match_of_list.csid == 103"
                  :style="compute_css_obj('menu-sport-active-image', 2103)"></div>
                <div class="esport" v-else-if="match_of_list.csid == 102"
                  :style="compute_css_obj('menu-sport-active-image', 2102)"></div>
                <div class="esport" v-else-if="match_of_list.csid == 100"
                  :style="compute_css_obj('menu-sport-active-image', 2100)"></div>
                <span class="league-title-text row justify-between">
                  <span :class="['league-t-wrapper', { 'league-t-main-wrapper': menu_type !== 28, export: is_export }]">
                    <span class="match-league ellipsis-2-lines" :class="{ 'match-main-league': menu_type !== 28 }">
                      {{ match.tn }}
                    </span>
                  </span>
                  <icon-wapper color="#c9c9c9" name="icon-arrow" size="15px"
                    :class="['icon-wapper', { 'close': collapsed }]" />
                </span>
              </div>

            </div>
            <!-- 赛事内容 -->
            <div class="match-content" v-if="collapsed">
              <!-- 比分版 | 视频 icon | 赛事阶段 | 比分| 盘口 -->
              <div class="title-details">
                <div class="details">
                  <!-- 图标 -->
                  <div class="operate-icon">
                    <!-- 直播 主播 视频 动画  icon 栏目   -->
                    <!-- 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画 -->
                    <div class="live-icon-btn">
                      <img :src='media_button_state_obj.icon_path' />
                    </div>
                    <!-- 足篮球展示赛事分析图标 -->
                    <div class="analysis" v-if="[1, 2].includes(+match.csid) && GlobalAccessConfig.get_statisticsSwitch()"
                      @click='goto_details(match, 1)'>
                      <img :src="compute_img_url('data-analysis')" alt="" style="width:0.12rem">
                    </div>
                    <!-- 此赛事支持提前结算 -->
                    <div class="settlement" v-if="match_of_list.mearlys == 1">
                      <img :src="mearlys_icon" alt="" style="width:0.2rem">
                    </div>
                  </div>
                  <!-- 赛事日期标准版 -->
                  <div :class="['timer-wrapper-c flex items-center', { esports: is_export, 'din-regular': is_export }]">
                    <!-- 赛事回合数mfo -->
                    <div v-if="match.mfo" class="mfo-title" :class="{ 'is-ms1': match.ms == 1 }">
                      {{ match.mfo }}
                    </div>

                    <!--即将开赛 ms = 110-->
                    <div class="coming-soon" v-if="match.ms" v-show="match.ms == 110">
                      {{ $t(`ms[${match.ms}]`) }}
                    </div>

                    <!--开赛日期 ms != 110 (不为即将开赛)  subMenuType = 13网球(进行中不显示，赛前需要显示)-->
                    <div class="date-time"
                      v-show="match.ms != 110 && !show_start_counting_down(match) && !show_counting_down(match)">
                      {{ format_time_zone(+match.mgt).Format(i18n_t('time4')) }}
                    </div>
                    <!--一小时内开赛 -->
                    <div class="start-counting-down" v-show="match.ms != 110 && show_start_counting_down(match)">
                      <CountingDownStart :match="match" :index="i" :mgt_time="match.mgt"></CountingDownStart>
                    </div>
                    <!--倒计时或正计时-->
                    <div v-if="match.ms != 110 && show_counting_down(match)"
                      :class="['counting-down-up-container relative-position', { 'special-match-container': match.mfo || [0, 31].includes(+match.mmp) }]"
                      :style="{ width: counting_down_up_wrapper_width === 'auto' ? 'auto' : match.mfo ? 'auto' : counting_down_up_wrapper_width + 'rem' }">
                      <!--足球csid:1 冰球csid:4 橄榄球csid:14 DotaCsid:101 累加 排球csid:9 倒计时-->
                      <CountingDownSecond ref="counting-down-second" :title="mmp_map_title" :mmp="match.mmp"
                        :is_add="[1, 4, 11, 14, 100, 101, 102, 103].includes(+match.csid)" :m_id="match.mid"
                        :second="match.mst" :match="match" @counting-wrapper-width="update_counting_down_up_wrapper_width">
                      </CountingDownSecond>
                    </div>
                  </div>
                  <!-- 比分版 -->
                  <div>{{ home_score }} - {{ away_score }}</div>
                </div>
                <!--玩法数量-->
                <div class="more" @click='goto_details(match)'>
                  <span class="count_span" :class="{ esports: 3000 == menu_type }">
                    <span class="mc-n">
                      {{ i18n_t('footer_menu.more') + `(${get_match_mc(match)})` }}
                    </span>
                    <span class="add_text" v-if="GlobalAccessConfig.get_handicapNum()">
                      <icon-wapper color="#c9c9c9" name="icon-triangle1" size="17px" class="icon-wapper-more" />
                    </span>
                  </span>
                </div>
              </div>
              <!-- 赛事队伍 -->
              <div class="event-team">
                <div class="name">
                </div>
                <div class="odds">

                </div>
              </div>
            </div>
          </div>


        </template>
      </div>
</template>

<script>

import { ref, computed, watch, nextTick } from 'vue'
import { LOCAL_PROJECT_FILE_PREFIX } from "src/core"

import { IconWapper } from 'src/components/icon'
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import ScoreList from 'src/base-h5/components/match-list/components/score-list.vue';
import OddListWrap from 'src/base-h5/components/match-list/components/odd-list-wrap.vue';
import ImageCacheLoad from "src/base-h5/components/match-list/components/public-cache-image.vue";
import GlobalAccessConfig from "src/core/access-config/access-config.js"

import { i18n_t, compute_img_url } from "src/core/index.js"
import { format_time_zone } from "src/core/format/index.js"
import { mearlys_icon } from 'src/base-h5/core/utils/local-image.js'

import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2, is_detail, is_export, is_results, footer_menu_id } from 'src/base-h5/mixin/menu.js'

import default_mixin from '../../mixins/default.mixin.js'

export default {
  name: "match-container-main-template8",
  mixins: [default_mixin],
  props: {
    // 当前组件的赛事数据对应列表的赛事
    match_of_list: Object,
    // 赛事处于列表中的下标
    i: Number,
    // 赛事列表相关操作的类型封装对象
    matchCtr: Object,
    main_source: String,
  },
  components: {
    ScoreList,
    IconWapper,
    OddListWrap,
    ImageCacheLoad,
    CountingDownStart,
    CountingDownSecond,
  },
  setup() {
    return {
      lang, theme, i18n_t, compute_img_url, format_time_zone, GlobalAccessConfig, footer_menu_id, LOCAL_PROJECT_FILE_PREFIX,
      is_hot, menu_type, menu_lv2, is_detail, is_export, is_results, standard_edition, mearlys_icon, footer_menu_id
    }
  }
}

</script>
  
   
<style scoped lang="scss">
/* ********赛事容器相关********** -S*/

.match-container {
  width: 100%;
  height: auto;
  position: relative;

  .match-inner-container {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ffffff;

    .buffer-container {
      background: #f7f9fe;
      height: 5px;
      width: 100%;
    }
  }

  .match-indent {
    width: 100%;
    margin: 0 auto;
    background: #f7f9fe;

    &.bottom {
      margin-top: 0.05rem;
    }
  }

  /* **************体育展示********************** -S*/

  .sport-title {
    width: 100%;
    height: 20px;
    border-radius: 0;
    font-size: 12px;
    padding: 0 5px 0 20px;
    background: #f7f9fe;
    line-height: 20px;
    font-size: 11px;

    .score-inner-span {
      width: 100%;
      //transform: translateY(-3px);
    }
  }

  /* **************体育展示********************** -E*/

  /* **************联赛展示********************** -S*/
  .league {
    height: 0.26rem;
    border-radius: 0;

    .league-t-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;

      .favorited-icon {
        height: 100%;
        margin: 0 0.08rem;
        position: relative;
        top: 1px;
        flex-shrink: 0;

        >img {
          width: 0.14rem;
          height: 100%;
        }
      }
    }

    .league-title-text {
      font-size: 0.13rem;
      width: 100%;
      height: 100%;
      padding-right: 5px;
      transform: translateY(1px);
      text-overflow: ellipsis;
      flex-wrap: nowrap;
      align-items: center;
      overflow: hidden;
      color: var(--q-color-com-fs-color-26);
      font-weight: 600;

      .icon-wapper {
        transform: rotate(90deg);
      }

      .close {
        transform: rotate(180deg);
      }

      .league-t-wrapper {
        line-height: 1;
        min-width: 1.18rem;
        display: flex;
        font-size: .12rem;

        &.export {
          min-width: 1.1rem;
        }
      }

      // 添加 line-height: 0.14rem 解决42682 生产BUG--malick
      .match-league {
        max-width: 2.8rem;
        line-height: 0.14rem;
      }
    }
  }

  .match-content {
    width: 100%;
    background: #fff;

    .title-details {
      height: 20px;
      display: flex;
      align-items: center;
      padding: 2px 9px ;
      justify-content: space-between;

      .details {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .operate-icon {
          height: 100%;
          display: flex;
          align-items: center;
        }

        .timer-wrapper-c {
          height: 100%;
          color: #999;

          &.newer {
            margin-left: 0;
          }

          &>div {
            height: 100%;
          }
        }
      }

      .more {
        .count_span {
          font-size: 10px;
          font-weight: 500;
          color: #afb3c8;
          display: flex;
          align-items: center;
        }

        .icon-wapper-more {
          position: relative;
          transform: rotate(-90deg);
        }
      }
    }
  }
}

/* ********赛事容器相关********** -E*/
</style>
  