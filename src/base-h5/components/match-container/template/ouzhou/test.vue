<!--
 * @Description: app-h5 赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div :class="['match-container']" 
    :style="{ marginTop: is_hot ? '0' : '' }">
    <template v-if="match" >
      <!-- 赛事标题 -->
      <header class="match-header">
        <div>
          <sport_icon size="24" :status="false" :sport_id="match_of_list.icon" />
          <span>{{ match_of_list.csna }}</span>
        </div>
        <div class="select_time">
          <!-- 玩法dropdown -->
          <span @click.stop>
            <q-btn-dropdown flat outline  style="color: #FF7000"  padding="0" :label="match_of_list.selectTitle" 
              dropdown-icon="expand_more" content-class="select_time_style">
              <q-list>
                <q-item v-for="item in match_of_list.pMethods" :key="item.hpid"
                   :class="{active: selectPlay === item.hpid}" clickable v-close-popup 
                   @click.stop="on_select_play(match_of_list, item)">
                  <q-item-section>
                    <q-item-label>{{ item.hpn }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </span>
        </div>
      </header>
      
      <div class="title">
        <div class="left">
          <img @click.stop="on_collect(item)" v-if="!item.isCollect" src="~assets/images/top_events/collect.png" alt="">
          <img @click.stop="on_collect(item)" v-else src="~assets/images/top_events/collect-y.svg" alt="">
          <span> {{ item.tn }} </span>
        </div>
        <template v-if="item.visible">
          <div class="right">
            <span v-for="p in match_of_list.panel" :key="p">{{ p }}</span>
          </div>
        </template>
        <template v-else>
          <span class="number" style="text-align: right;padding-right: 27px;">{{ item.data.length }}</span>
        </template>
      </div>
      <q-slide-transition>
        <div class="slide_content" v-show="item.visible">
          <div class="match_item" v-for="list in item.data" :key="list.id">
            <div class="info" @click="toDetail(list)">
              <div class="label">
                <div class="img">
                  <img @click.stop="on_children_collect(list, item)" v-if="!list.isCollect" src="~assets/images/top_events/collect.png" alt="">
                  <img @click.stop="on_children_collect(list, item)" v-else src="~assets/images/top_events/collect-y.svg" alt="">
                </div>
                <div class="time">
                  <span>
                    <span>{{list.course}} {{ list.ms === 110 ? "" : list.mstValue }} 
                      <span>{{list.ms === 110 ? "" : list.mstValueTime}}</span> 
                    </span>
                    <img v-if="[1].includes(list.mearlys)" src="~assets/images/top_events/cartoon.png" alt="">
                    <img v-if="[1,2].includes(list.mvs)" class="video" src="~assets/images/top_events/video.png" alt="">
                    <img v-if="['1','2'].includes(list.csid)" class="video" src="~assets/images/top_events/analysis.png" alt="">
                  </span>
                  <div class="dropdown"><span>{{list.mc || 0}}</span> <span><img src="~assets/images/top_events/dropdown.png" alt=""></span></div>
                </div>
              </div>
              <!-- 队伍名称 -->
              <div class="content">
                <div class="index">
                  <template v-if="['3','5','8','9','10'].includes(game.csid)">
                    <!-- 发球方 -->
                    <div><span :class="[list.mat ? list.mat === 'home' ? 'starting' : 'ending' : '']"></span></div>
                    <div><span :class="[list.mat ? list.mat === 'away' ? 'starting' : 'ending' : '']"></span></div>
                  </template>
                  <span v-if="false" class="yellow"></span>
                </div>
                <div class="name">
                  <div class="host">
                    <span>{{ list.mhn }}</span>
                    <span class="f_family" v-show="list.ms === 1">{{ list.mscValue && list.mscValue[0] || 0 }}</span>
                  </div>
                  <div class="visitor">
                    <span>{{ list.man }}</span>
                    <span class="f_family" v-show="list.ms === 1">{{ list.mscValue && list.mscValue[1] || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 赔率 -->
            <div class="score f_family">
              <template v-if="list.panel.length > 0">
                <span v-for="s in list.panel" :key="s" @click="show_betting({payload:list,ol:s},active_score === `${list.id}${s.oid}`)" :class="{active: active_score === `${list.id}${s.oid}` }">
                  <span v-if="s.os === 1">{{ s.ov }}</span>
                  <img v-else class="lock" src="~assets/images/top_events/lock.png" alt="">
                </span>
              </template>
              <template v-else>
                <span v-for="s in game.panel.length" :key="s"><img class="lock" src="~assets/images/top_events/lock.png" alt=""></span>
              </template>
            </div>
          </div>
        </div>
      </q-slide-transition>
    </template>
  </div>
</template>
  
<script>

import { ref, computed, watch, nextTick } from 'vue'
import { LOCAL_PROJECT_FILE_PREFIX } from  "src/core"

import { IconWapper } from 'src/components/icon'
import CountingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import CountingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import ScoreList from 'src/base-h5/components/match-list/components/score-list.vue';
import OddListWrap from 'src/base-h5/components/match-list/components/odd-list-wrap.vue';
import ImageCacheLoad from "src/base-h5/components/match-list/components/public-cache-image.vue";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import PageSourceData  from  "src/core/page-source/page-source.js";
import { i18n_t, compute_img_url, compute_css_obj  } from "src/core/index.js"
import { format_time_zone } from "src/core/format/index.js"
import { in_progress, not_begin, animation_icon, video_icon, 
  normal_img_not_favorite_white, not_favorite_app, normal_img_is_favorite, corner_icon, mearlys_icon_app, midfield_icon_app } from 'src/base-h5/core/utils/local-image.js'

import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2, is_detail, is_export, is_results, footer_menu_id, is_zaopan } from 'src/base-h5/mixin/menu.js'

import default_mixin from '../../mixins/default.mixin.js'

export default {
  name: "match-container-main-template4",
  mixins: [default_mixin],
  props: {
    // 当前组件的赛事数据对应列表的赛事
    match_of_list: Object,
    // 赛事处于列表中的下标
    i: Number,
    // 赛事列表相关操作的类型封装对象
    matchCtr: Object,
    main_source:String,
  },
  components: {
    ScoreList,
    IconWapper,
    OddListWrap,
    ImageCacheLoad,
    CountingDownStart,
    CountingDownSecond,
  },
  setup (ctx) {
    // 是否显示球种标题
    const show_sport_title = computed(() => {
      const { is_show_ball_title } = ctx.match_of_list
      return is_show_ball_title
    })
    return { 
      lang, theme, i18n_t, compute_img_url, format_time_zone, GlobalAccessConfig, footer_menu_id,LOCAL_PROJECT_FILE_PREFIX,in_progress,not_begin,
      is_hot, menu_type, menu_lv2, is_detail, is_export, is_results, standard_edition, compute_css_obj, show_sport_title, animation_icon, video_icon,
      normal_img_not_favorite_white,not_favorite_app, normal_img_is_favorite, PageSourceData, corner_icon, mearlys_icon_app, midfield_icon_app, is_zaopan
    }
  }
}

</script>
   
<style scoped lang="scss">
/* ********赛事容器相关********** -S*/
.match-header{
  height: 50px;
  display: flex;
  align-items: center;
  padding: 11px 10px;
  > div{
    flex: 1;
    display: flex;
    color: #1A1A1A;
    font-size: 16px;
    font-weight: 500;
    align-items: center;
    .icon {
      width: 17px;
      height: 17px;
      margin-right: 10px;
      display: inline-block;
    }
    .path{
      width: 15px;
      height: 5px;
    }
  }
  .select_time{
    display: flex;
    align-items: center;
    color: #FF7000;
    justify-content: flex-end;
    padding-right: 5px;
    > img {
      padding-left: 8px;
    }
    :deep(.q-btn){
      &.disabled{
        opacity: 1 !important;
      }
      .q-btn__content{
        text-transform: capitalize;
        .block{
          font-size: 13px;
          font-weight: 500;
          margin-right: 10px;
        }
        .q-icon{
          color: #333;
          font-size: 14px;
          margin-left: 5px;
          display: none;
        }
      }
      .q-ripple{
        display: none;
        }
      }
    }
  }
.play-icon {
  background-image: var(--q-color-img-bg-103);
  background-repeat: no-repeat;
  width: 0.14rem;
  height: 0.14rem;
  margin-top: 0.07rem;
}

.auto-full-width-100 {
  width: 100%;
}

.match-container {
  width: 100%;
  height: auto;
  position: relative;
  &.border_top{
    border-top: 1px solid rgba(175, 179, 200, 0.1);
  }
  &.is_zaopan{
    .progress{
      border-color: #FEBE55;
    }
  }

  .match-status-fixed {
    width: 100%;
    height: 0.25rem;
    line-height: 1;
    font-size: 0.11rem;
    padding-left: 0.20rem;
    display: flex;
    align-items: center;
    color: var(--q-color-com-fs-color-38);
    background: #fff;
    &.progress{
      border-top: 2px solid #74C4FF
    }
    &.not_begin{
      border-top: 2px solid #E95B5B
    }

    img {
      margin-right: .06rem;
      width: .13rem;
      height: .13rem;
    }
  }

  .v-mode-span {
    margin-right: 0.1rem;
  }
  .buffer-container{
    background: #fff;
    height: 5px;
    margin: 0 4px;
  }
  .match-inner-container {
    margin: 0 auto;
    /* 兼容iPhone11边框显示不全 */
    //width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ffffff;

    // padding-top: 0.05779rem;  /* 兼容iPhone11边框显示不全 */
    &.show-sport {
      border-top-left-radius: 0.08rem;
      border-top-right-radius: 0.08rem;
    }
    .match-content{
      background: #fff;
      padding: 0 0.1rem;
    }
  }

  &.started_and_un_started {
    display: block;
  
  }

  &.show_un_started {
    display: block;

    .match-indent {
      display: flex;
    }
  }

  .match-odds-container {
    width: 100%;
    display: block;
    position: relative;
    transition: max-height 0.3s;
    padding-left: 6px;
    background: var(--q-match-page-bg-color-10);

    .match-odds-container-border-radius {
      overflow: hidden;
    }
    &.border-top{
      border-top: 1px solid #e9e9e9;
    }

    .eports_scoring_tip {
      color: var(--q-gb-t-c-13);
    }
    &.hairline-border{
      border-radius: 0;
    }
  }

  &.is_league_tail {
    .match-inner-container {
      box-shadow: var(--q-color-box-shadow-color-4);
      border-bottom-left-radius: 0.08rem;
      border-bottom-right-radius: 0.08rem;
      //overflow: hidden;
    }
  }

  &.is_division_league {
    margin-bottom: 0.05rem;
    &.started_un_started_next {
      .match-odds-container {
        &:after {
          display: inline;
        }
      }
    }

    .no-radius {
      border-radius: unset;
    }
    .no-border{
      border: none !important;
    }

    .odd-list-inner.odd {
      border-bottom: none !important;
    }
  }

  &.is_division_sport {
    margin-bottom: 0;

    .match-odds-container {
      &:after {
        display: none;
      }
    }
  }


  &.favorite_un_start_title {
    margin-top: 0 !important;
  }

  .match-indent {
    width: 100%;
    margin: 0 auto;
    background: #f7f9fe;
    &.bottom{
      margin-top: 0.05rem;
    }
  }

  /* **************体育展示********************** -S*/
  .hot_time_change {
    font-weight: bold;
    width: 100%;
    font-size: 0.14rem;
    padding: 0.1rem 0 0.1rem 0.08rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    >span {
      &:nth-child(2) {
        padding: 0 0.09rem;
        height: 0.24rem;
        line-height: 0.24rem;
        border-radius: 0.115rem;
        box-sizing: border-box;
        font-size: 0.12rem;
        font-weight: 400;
        z-index: 110;
        position: relative;
        left: -0.08rem;
      }
    }
  }

  .sport-title {
    width: 100%;
    height: 20px;
    border-radius: 0;
    font-size: 12px;
    padding: 0 5px 0 20px;
    background: rgba(175, 179, 200, 0.1);
    line-height: 20px;
    font-size: 11px;
    .league-collapse-dir{
      display: none;
    }

    &.first {
    }

    .score-inner-span {
      width: 100%;
      //transform: translateY(-3px);
    }

    &.home_hot_page {
      width: 100%;
      // height: unset;
      padding-left: unset;
      // display: unset !important;
      height: 0.5rem !important;
      margin-top: .03rem;
      transform: translateY(0);

      &.first {
        margin-top: 0;
      }

      .ball_img {
        width: 100%;
        text-align: center;
        height: 0.5rem;
        overflow: hidden;
        margin-top: -0.06rem;

        > img,.img {
          width: 100%;
          object-fit: cover;
          height: 100%;
          background-color: var(--q-gb-bg-c-17);
        }

        >span {
          position: absolute;
          top: 56%;
          left: 50%;
          transform: translate(-50%, -50%);

          font-size: 0.16rem;
          display: flex;
          align-items: center;
          justify-content: center;

          >i {
            display: inline-block;
            margin-right: 0.05rem;
            width: 0.18rem;
            height: 0.18rem;
            background-size:  0.18rem 2.3rem;
          }

          @each $bg,
          $y in (s2: 1, s5: 2, s7: 3, s10: 4, s8: 5, s9: 6, s4: 7, s3: 8, s6: 9) {
            .#{$bg} {
              background-position-y: calc(var(--per) * #{$y});
            }
          }

          >p {
            position: relative;
            top: 0.02rem;
          }
        }
      }
    }

    &.hidden_sport {
      display: none !important;
    }

    .icon_match_cup,
    .icon_notstarted {
      margin-right: 0.1rem;
      font-size: 0.12rem;

      &:before {
        color: var(--q-color-com-fs-color-35);
      }
    }

    .icon_notstarted {
      &:before {
        color: var(--q-color-com-fs-color-36);
      }
    }

    &.menu-type-3 {
      height: 0.25rem;
      border-top: 1px solid var(--q-color-com-border-color-19);
      background-color: var(--q-color-com-bg-color-12);
      font-weight: bold;
      box-shadow: var(--q-color-box-shadow-color-3);
      position: relative;
      z-index: 2;
      padding-left: 0;

      &.not-playing {
        &:before {
          background: var(--q-color-com-bg-color-38);
        }
      }

      &:before {
        margin-right: 0.1rem;
        display: block;
        content: ' ';
        width: 0.04rem;
        height: 100%;
        background: var(--q-color-com-bg-color-39);
      }
    }
  }

  /* **************体育展示********************** -E*/

  /* **************联赛展示********************** -S*/
  .league {
    height: 0.26rem;
    border-radius: 0;
    // padding: 0 0.1rem;

    &.show-sport {
      border-radius: 0.12rem 0.12rem 0 0;
    }

    &.home-hot {
      margin-top: .05rem;
    }

    .league-t-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      //padding-left: 0.08rem;
      .esport {
        margin: 0.01rem 0.07rem 0 0rem;
        position: relative;
        --per: -0.32rem;
        display: block;
        width: auto;
        height: 0.22rem;
        width: 0.22rem;
        background-position: 0 0;
        background-size: 0.22rem 18.88rem;
        flex-shrink: 0;
        img {
          width: 0.22rem;
          height: 0.22rem;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .league-t-tubiao {
        height: 0.15rem;
        width: 0.02rem;
        background-color:var(--q-gb-bg-c-13);
        border-radius: 10px;
        width: 200px; 
      }
      .league-collapse-dir {
        width: 0.12rem;
        height: 0.06rem;
        position: relative;
        right: 0.1rem;

        &.collapsed {
          transform: rotateZ(180deg);
        }
      }
      .favorited-icon{
        width: 14px;
        height: 14px;
        margin: 0 10px 0 12px;
        position: relative;
        top: 1px;
        flex-shrink: 0;
        > img {
          width: 0.14rem;
          height: 100%;
        }
      }
    }
    
    .dir {
      margin-right: 0.09rem;

      i {
        display: block;
        font-size: 0.1rem;
        transition: transform 0.3s;

        &.collapse {
          transform: rotateZ(180deg);
        }
      }
    }
  }

  .odd-title-wraper {
    height: 0.2rem;
    position: relative;
    flex-wrap: nowrap;
    display: flex;
    font-size: 0.1rem;
    color: #303442;
    flex-direction: row-reverse;
    background: var(--q-match-page-bg-color-10);
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;

    .odd-title-i-w {
      width: 50%;
      overflow: hidden;

      .odd-t-i-wrapper {
        flex-shrink: 0;
        transition: transform 0.2s;

        &.status2 {
          transform: translateX(-1.84rem);
        }
      }
    }
      
    .odd-title-wrape-tab {
      border-top: 1px solid #000;
      width: 96%;
    }
    .row {
      height: 100%;
    }

    .hpl-title {
      width: 0.6rem;
      height: auto;
      line-height: 1;
      margin-left: 0.01rem;
      font-size: 0.1rem;
      color: var(--q-color-com-fs-color-1);
      flex-shrink: 0;

      &.boxing {
        width: 0.95rem;
      }

      .hpl-t-inner {
        width: auto;
        max-height: 0.23rem;
        text-align: center;
        font-weight: 400;
      }

      &:first-child {
        margin-left: 0;
      }
    }
  }

  /* **************联赛展示********************** -E*/

  /* **************收藏********************** -S*/
  .fav-icon-wrap {
    width: 0.26rem;
    margin-right: 0.04rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
    .icon-wapper{
      transform: rotate(90deg);
    }
    .close{
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
      &.match-main-league {
        //max-width: 1.4rem;
      }
    }


    color: var(--q-color-com-fs-color-26);

    font-weight: 600;
  }

  .match-type {
    margin-right: 0.04rem;
    transition: opacity 0.2s;
    opacity: 1;
  }
}

.league-collapse-dir {
  width: 0.12rem;
  height: 0.06rem;
  position: relative;
  right: 0.1rem;
  transition: all 0.3s ease-in;

  &.collapsed {
    transform: rotateZ(180deg);
  }
}

.odd-list {
  line-height: 1;
  background-color: var(--q-color-com-bg-color-12);
  height: auto;
  position: relative;
  height: 1.12rem;

  &.simple,
  &.result {
    min-height: auto;
  }

  .w-score-result {
    position: absolute;
    right: 0.11rem;
    bottom: 0.13rem;
  }

  .odd-list-inner {
    height: 0.2rem;
    width: 100%;
    padding: 0.1rem 2% 0 2%;
    display: flex;
    justify-content: space-between;
    position: relative;
    overflow: hidden;

    .triangle-wrapper {
      width: 0.24rem;
      height: 0.18rem;
      border-radius: 0.1rem 0 0 0.1rem;
      position: absolute;
      right: 0;
      top: 0.12rem;

      .t-w-inner {
        font-size: 0.11rem;
      }
    }

    &.n-s-edition {
      padding-top: 0;

      &:before {
        display: none;
      }
    }

    &.odd {
      &:after {
        width: 100%;
        left: 0;
      }

      &.result {
        padding-top: 0.1rem;
        padding-bottom: 0.1rem;
      }
    }

    .w-score-result {
      padding-top: 0.17rem;
    }

    .team-wrapper2 {
      margin-left: -2%;
      padding-left: 0.3rem;
      display: flex;
      align-items: center;
      font-size: 0.1rem;
    }

    .team-wrapper {
      min-height: 100%;
      height: auto;
      width: 1.61rem;
      position: relative;
      z-index: 1;

      &.simple {
        transform: translateY(-1px);
      }

      &.team_title {
        .team-title-inner-con {
          width: 1.8rem !important;
        }
      }

      .score-wrapper {
        position: absolute;
        bottom: 2px;

        .score-section {
          padding-left: 0;
          transform: translateX(-0.02rem);
        }

        .go-container-w {
          .disabled{
            filter: grayscale(100%);
          }
          .goto-detail {
            display: flex;
            height: auto;
            align-items: center;

            .count_span {
              height: 0.11rem;
              display: flex;
              align-items: flex-end;
              margin-right: 0.04rem;
              line-height: 1;
              top: 2px;
              position: relative;
            }

            .icon_arrow_down {
              width: 0.04rem;
              height: 0.07rem;
              display: block;
            }
          }

          &.new-standard {
            .live-i-b-wrap {
              width: 0.18rem;
              margin-right: 0.05rem;

              img {
                height: 0.16rem;
                width: 0.16rem;
              }

              .live-icon-btn {
                width: 100%;
              }

              .live-icon-play-btn {
                width: 100%;
                height: 0.14rem;
              }
            }
          }

          .favorite-icon {
            width: 0.14rem;
            height: 0.14rem;
            margin-right: 0.05rem;

            img {
              width: 100%;
              height: 100%;
            }

            .f-icon {
              display: none;
            }
          }
        }

        .week-mcid {
          margin: 0 0 0 0.09rem;

          span {
            height: 0.12rem;
            line-height: 1;
          }
        }
      }

      .team-title-container {
        height: 0.31rem;
        display: flex;
        justify-content: space-between;
        position: relative;

        &.simple {
          width: 1.72rem;

          &:first-child {
            margin-bottom: -0.04rem !important;
          }
        }

        .visibility-hidden {
          visibility: hidden;
        }

        &:first-child {
          &.standard {
            margin-bottom: 0.02rem;
          }
        }

        .team-title-inner-con {
          width: 1.31rem;
          position: relative;
          line-height: 0.14rem;
          display: flex;
          align-items: center;

          /*图标*/
          .team-icon {
            width: 0.18rem;
            height: 0.18rem;
            margin-right: 0.06rem;
            flex-shrink: 0;
            justify-content: center;

            &.logo-is-double {
              width: 0.28rem;
            }

            img,
            .sprite-div {
              display: block;
              width: 0.18rem;
              flex-shrink: 0;
              height: 0.18rem;
              margin-left: .06rem;

              &.is-double-first {
                width: 0.18rem;
                transform: translateX(0.04rem);
              }

              &.is-double-second {
                width: 0.18rem;
                transform: translateX(-0.04rem);
              }
            }
          }

          .gif-text {
            white-space: nowrap;
            margin-left: 3px;
            color: var(--q-color-com-fs-color-31);
            animation: 1s text-flash linear infinite normal;
          }

          .team-t-title-w {
            font-size: 0.12rem;
            height: 0.3rem;
            -webkit-line-clamp: 2;
            display: flex;
            width: 100%;
            overflow: hidden;
            flex-shrink: 0;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 600;
            flex-direction: column-reverse;
            &.is-handicap {
              font-weight: bold;
            }
          }
        }

        .score-punish {
          width: 0.12rem;
          height: 0.14rem;
          color: var(--q-gb-t-c-18);
          flex-shrink: 0;
          background: var(--q-color-com-bg-color-43);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.1rem;
          border-radius: 0.02rem;
          margin-left: 0.04rem;

          &.yellow {
            background: var(--q-color-com-bg-color-23);
          }

          &.flash {
            animation: 1s text-flash linear infinite normal;
          }
        }

        .serving-party {
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--q-color-page-bg-color-59);
          flex-shrink: 0;
          margin: 0.13rem 0.05rem 0;

          &.simple {
            margin-right: 0.03rem;
          }
        }

        .score {
          height: 0.3rem;
          font-size: 0.14rem;
          display: flex;
          align-items: center;
          position: absolute;
          right: 0.07rem;
          bottom: 0;
          flex-direction: column-reverse;
          font-weight: 600;

          &.simple {
            right: 0.08rem;
          }
        }
      }

      .result.fav-i-wrap-match {
        width: 0.2rem;
        height: 0.2rem;
        flex-shrink: 0;
        margin: 0.05rem 0 0 0.02rem;

        .favorite-icon {
          width: 0.14rem;
          height: 0.14rem;

          img {
            width: 100%;
            height: 100%;
          }

          .f-icon {
            display: none;
          }
        }
      }

      .m-result-time {
        min-width: 0.75rem;
        margin-top: 0.08rem;
        padding-left: 0.03rem;
      }
    }

    &.odd {
      height: auto;
    }

    .match-result-score-wrap {
      padding-top: 0.07rem;
    }

    .score-result-wrapper {
      font-size: 0.16rem;

      .score-row {
        height: 0.16rem;

        &:first-child {
          margin-bottom: 0.15rem;
        }
      }
    }

    .go-to-d-detail-w {
      font-size: 0.14rem;
      margin-left: 0.16rem;

      .go-to-i-detail-i {
        width: 0.68rem;
        height: 0.47rem;
        border-left: 1px solid #f5f5f5;

        .word {
          margin-right: 0.08rem;
          font-size: 0.12rem;
        }

        .go-to-d-icon {
          width: 0.05rem;
          height: 0.08rem;
          display: block;
          color: var(--q-color-com-fs-color-29);
        }
      }
    }
  }
}

/* **************收藏********************** -E*/

/* **************日期********************** -S*/
.date-container {
  background-color: var(--q-color-com-bg-color-12);
  width: 100%;
  color: #999;
  padding-left: 6px;
  height: 0.2rem;
  display: flex;
  align-items: center;
  margin: 0 auto;
  font-size: 0.1rem;
  align-items: center;
  justify-content: space-between;

  &.simple {
    height: 0.34rem;

    .live-icon-play-btn {
      margin-left: 0.08rem;
      margin-top: -0.01rem;
    }

    .counting-down-up-container {
      height: 0.14rem !important;
    }
  }

  &.n-s-edition {
    &:before {
      top: 0;
      left: 0;
      position: absolute;
      content: ' ';
      display: block;
      width: 100%;
      height: 0.01rem;
      background-color: var(--q-color-com-bg-color-41);
      transform: scaleY(0.5);
    }
  }

  .score-wrapper {
    width: auto;
    font-size: 0.12rem;
    color: var(--q-color-com-fs-color-11);
    line-height: 1;
    white-space: nowrap;
    height: 100%;
    flex-wrap: nowrap;

  }

  .go-container-w {
    width: auto;
    margin-left: 0.06rem;
    height: 100%;
    justify-content: flex-end;
    align-items: center;

    &.favorite {
      height: 0.24rem;
      justify-content: center;
      align-items: center;
      margin-left: 0;
      margin-right: .05rem;
    }

    &.no-margin {
      margin-left: 0;
    }

    &.mcount {
      margin-left: 0.08rem;
    }

    .fav-i-wrap-match {
      height: 0.16rem;

      .favorite-icon {
        height: 100%;

        img {
          width: 0.14rem;
          height: 0.14rem;
        }
      }
    }

    .goto-detail {
      .count_span {
        .mc-n {
          width: 0.14rem;
        }
      }
    }
   
  }

  .timer-wrapper-c {
    height: 100%;
    color: #999;

    &.newer {
      margin-left: 0;
    }

    &>div {
      height: auto;
    }
  }

  .favorite-icon-top {
    width: 0.14rem;
    height: 100%;
    height: 0.13rem;
    flex-shrink: 0;
    margin-right: .07rem;
    position: relative;
    top: 1px;

    img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
      margin-top: -2px;
    }

    .f-icon {
      display: none;
    }
  }

  &.no-running-timer-wrapper {
    .live-i-b-wrap {
      margin-left: 0.08rem;
    }
  }

  .live-i-b-wrap {
    height: 0.14rem;
    width: auto;
    display: flex;
    margin-left: 0.08rem;

    .live-icon-btn,
    .live-icon-play-btn {
      width: 0.18rem;
      height: 0.14rem;
    }

    .neutral-icon-btn {
      width: 0.18rem;
      height: 0.14rem;
      /*margin-left: 0.08rem;*/
    }
  }

  .l {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    font-size: 0.1rem;

    .favorite-icon {
      position: relative;
      top: -.01rem;
    }

    .date-time {
      white-space: nowrap;
      color: var(--q-color-com-fs-color-37);
    }

    .counting-down-up-container {
      width: 1rem;
      height: .14rem;

      &.intermission {
        width: 0.57rem;
      }

      &.long-time {
        width: 0.86rem;
      }

      .match-type {
        margin-right: 0.14rem;
      }
    }

    .special-match-container {
      .counting-down-wrap {
        position: unset;
        display: inline-flex;
      }
    }

    .week-mcid {
      margin: 0 0 0 0.09rem;

      span {
        height: 0.12rem;
        line-height: 1;
      }
    }

    &.test-match-mf {
      .week-mcid {
        margin: 0 0.06rem 0 0;
      }
    }
  }

  .add_text {
    font-size: 0.12rem;
    .icon-wapper-more{
      transform: rotate(-90deg);
    }
  }

  .mfo-title {
    margin-right: .05rem;
  }

  .flag-chuan {
    margin-left: .1rem;
    padding: 0 .01rem;
    height: 0.16rem;
    line-height: .16rem;
    border-radius: .03rem;

    &.special-lang {
      margin-left: .06rem;
    }
  }
}
.match-list-container.jingzu {
  .date-container {
    .l .week-mcid {
      margin: 0 0.06rem 0 0 !important;
    }
  }
}
/* **************日期********************** -E*/

/* ********赛事容器相关********** -E*/
</style>
  
