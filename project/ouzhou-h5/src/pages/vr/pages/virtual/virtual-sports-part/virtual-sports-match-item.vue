<!--
 * @Description: 虚拟体育足球篮球赛事项组件
-->

<template>
  <div class="match-item-wrap" :class="{standard:standard_edition == 2, vr_basketball_match_item_wrap: VR_CTR.state.virtual_current_sub_menuid == 1004}">
    <div class="test-line" v-if="show_debugger_line">
      {{match_item.batchNo +'-'+ match_item.mid}}
    </div>
    <div class="match-data-item row"
      :class="{
        standard:standard_edition == 2,
        'items-start':standard_edition == 2,
        'items-center':standard_edition == 1
      }">
      <!-- 赛事信息 -->
      <div class="team-w-container" :class="{vr_basketball_team_w_container: VR_CTR.state.virtual_current_sub_menuid == 1004}" v-if="standard_edition == 2">
        <div class="match-play-count standard row justify-between items-center">
          <!-- 比赛时间 -->
          <div class="match-play-left row justify-start items-center">
            <div class="time-wrap" v-if="match_item.csid != 1004"
              :class="{whistle:[2,11].includes(+match_item.match_status)}"
              v-show="match_item.show_time > 0 || [2,11].includes(+match_item.match_status)" >
              <div class="time">
                {{match_item.show_time}}'
              </div>
            </div>
            <template v-if="match_item.csid == 1004">
              <!-- {{ match_item }} --- {{is_basketball_score}}---cc -->
                <!-- 固定60秒 -->
                <div v-if="match_item.mmp == 'PREGAME'"
                     class="time-wrap icon-s-wrap"
                    :class="{whistle:[2,11].includes(+match_item.match_status)}"
                    v-show="match_item.mmp == 0 && !is_basketball_score">

                  <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/vr/countdown.png`" alt="">
                  <div class="time" v-show="match_item.show_time">
                    {{match_item.show_time}}'
                  </div>

                </div>

                <!-- live -->
                <div class="live-icon-pre icon-s-wrap" v-show="match_item.match_status == 1 || is_basketball_score">
                  <!-- <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/vr/live.png`" alt=""> -->
                  <span class="span_live">LIVE</span>
                  <span class="span_show_time" v-show="match_item.show_time">{{match_item.show_time}}'</span>
                </div>
                <!-- 结束 -->
                <div class="finally icon-s-wrap" v-show="match_item.match_status == 2">
                  <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/vr/referee.png`" alt="">
                  <span>{{match_item.show_time}}'</span>
                </div>
            </template>
            <!-- 视频icon -->
            <div class="play-icon-wrapper yb-flex-center"
              @click="switch_match_handle(i,match_item)">
              <span class="video-play-icon" :data_si="match_selected_i" :data_i="i"
                :class="get_play_btn_class(match_item,i)" />
            </div>
          </div>
            
          <!-- 玩法数量 -->
          <div class="play-count" @click="goto_details(match_item)">
            {{lodash.get(get_access_config,'handicapNum') ? `${match_item.mc}`: i18n_t('footer_menu.more')}}
            <icon-wapper class="icon" color="#e1e1e1" name="icon-arrow"  />
          </div>
        </div>
        
        <div class="team-wrapper" @click="goto_details(match_item)" :class="{standard:standard_edition == 2}">

          <template v-if="VR_CTR.state.virtual_current_sub_menuid == 1004">
            <div class="team-wrapper_left">
              <span>{{ i+1 }}</span>  
            </div>

            <!-- 战队名称 -->
            <div class="team-wrapper_right">
              <div class="team-title" :class="{over:[2,11].includes(+match_item.match_status)}">
                <div class="ellipsis">{{match_item.teams ? match_item.teams[0] : ''}}</div>
                <div class="team-score">{{ match_item.home || 0 }}</div>
              </div>
              <div class="team-title" :class="{over:[2,11].includes(+match_item.match_status)}">
                <div class="ellipsis">
                  {{match_item.teams ? match_item.teams[1] : ''}}
                </div>
                <div class="team-score">{{ match_item.away || 0 }}</div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="team-title" :class="{over:[2,11].includes(+match_item.match_status)}">
              <div class="ellipsis">{{match_item.teams ? match_item.teams[0] : ''}}</div>
              <div class="team-score">{{ match_item.home || 0 }}</div>
            </div>
            <div class="team-title" :class="{over:[2,11].includes(+match_item.match_status)}">
              <div class="ellipsis">
                {{match_item.teams ? match_item.teams[1] : ''}}
              </div>
              <div class="team-score">{{ match_item.away || 0 }}</div>
            </div>
          </template>



        </div>
      </div>
      <!-- 玩法 -->
      <div class="row items-center shrink-0 justify-between m-c-container"
        :class="{standard:standard_edition == 2,simple:standard_edition == 1, vr_basketball_m_c_container: VR_CTR.state.virtual_current_sub_menuid == 1004}"
      >
        <!--专业版-->
        <div class="profession" v-if="standard_edition == 2">
          <!--标准版赔率容器-->
          <div class="standard-odd-l-w" v-touch-pan.horizontal.prevent.mouse="odd_wrapper_pan"
            :class="{'status2':standard_odd_status == 1, vr_basketball_standard_odd_l_w: VR_CTR.state.virtual_current_sub_menuid == 1004}" v-if="standard_edition == 2">
            <!--标准版-->
            <div class="standard-odd-list row" :class="{vr_basketball_standard_odd_list: VR_CTR.state.virtual_current_sub_menuid == 1004}">
              <!-- 右边盘口组件 -->
              <template v-if="match_item">
                <ScoreList :match_info="match_item"></ScoreList>
              </template>
            </div>
            <!--标准版第二部分-->
            <!--复刻版vr不能滑动-->
            <div class="standard-odd-list row second" :class="{'status2':standard_odd_status == 1}" v-if="0 && get_hp_list(1).length"> 
              <div class="odd-column-w" :key="hp_i_i"
                v-for="(hp_i,hp_i_i) of get_hp_list(1)">
                <div class="odd-wrap-min" :class="`hp-${get_ol_length(hp_i,hp_i_i)}`"
                  :key="ol_item_i" v-for="(ol_item,ol_item_i) of get_ol_list(hp_i,hp_i_i)">
                  <odd-column-item
                    :placeholder="ol_item.placeholder"
                    :n_s="Number(standard_edition)"
                    :column_ceil="get_ol_length(hp_i)"
                    :odd_item_i="ol_item_i"
                    :match="match_item"
                    :odd_field="hp_i"
                    :hl_hs="get_hl_hs(hp_i)"
                    :is_vr_lock="is_vr_lock"
                    bet_type="vr_bet"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import virtual_sports_match_item_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-match-item-mixin.js";
import v_s_odd_item from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/virtual-sports-odd-item.vue"
import v_s_match_timer from "project_path/src/pages/vr/pages/virtual/virtual-sports-part/virtual-sports-match-timer.vue"
import odd_column_item from "src/base-h5/components/match-container/template/app/components/odd-column-item.vue"
import ImageCacheLoad from "src/core/public-cache-image/public-cache-image.vue";
import { IconWapper } from 'src/components/icon'
import ScoreList from 'src/base-h5/components/match-container/template/ouzhou/components/score-list.vue';

import VR_CTR from 'src/core/vr/vr-sports/virtual-ctr'

export default {
  mixins:[virtual_sports_match_item_mixin],
  components:{
    "v-s-odd-item":v_s_odd_item,
    'v-s-match-timer':v_s_match_timer,
    "odd-column-item":odd_column_item,
    'image-cache-load': ImageCacheLoad,
    'icon-wapper': IconWapper,
    ScoreList
  },
  setup(){
    return {
      VR_CTR
    }
  },
  
}
</script>

<style lang="scss" scoped>


@keyframes dir_remind_animate {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  60% {
    transform: translateX(-0.06rem);
    opacity: 1;
  }
  100% {
    transform: translateX(-0.09rem);
    opacity: 0;
  }
}

@keyframes dir_right_remind_animate {
  0% {
    transform: translateX(-0.09rem);
    opacity: 0;
  }
  60% {
    transform: translateX(-0.06rem);
    opacity: 1;
  }
  100% {
    transform: translateX(0);
    opacity: 0;
  }
}

.match-item-wrap {
  min-height: 0.9rem;
  border-radius: 0;
  border-bottom: 1px solid #F5F5F5;
  padding: 10px 0 10px 10px;

  &.standard {
    height: 0.9rem;
  }

  &.vr_basketball_match_item_wrap{
    height: 100%;
    padding: 0px 0 0px 0px;
    width: 100%;
    // background-color: pink;
    display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

    .match-data-item{
      width: 100%;
      // background-color: orange;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    // background-color: red;
    }
  }

  .test-line {
    position: absolute;
    right: 0;
    top: 0;
    color: red;
    z-index: 2;
  }

  .team-title img {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }

  .match-data-item {
    font-size: 0.14rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    // background-color: red;

    .team-w-container {
      flex-grow: 1;
      width: 50%;
      padding-right: 10px;
      border-right: 1px solid rgba(88,88,88,.1);
    }

    .vr_basketball_team_w_container{
      width: 40%;
      height: 100%;
      padding-top: 0px;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center ;
      // background-color: orange;
      .match-play-count{
        width: 100%;
      }

      .team-wrapper{
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;

          .team-wrapper_left{
            padding-right: 10px;
            // background-color: red;
            span{
              font-size: 12px;
            }
          }
          .team-wrapper_right{
            width: 95%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            // background-color: red;
          }
      }
    }

    .team-wrapper {
      flex: 1;
      // font-weight: bold;
      // display: flex;
      // flex-direction: row;
      // justify-content: space-between;
      // align-items: center;
      
      &.standard {
        .team-title {
          width: 100%;
        }
      }
    }

    .score-w-container {
      height: 0.46rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 0.08rem;
      visibility: hidden;

      &.show-score {
        visibility: visible;
      }

      &.standard {
        height: 0.57rem;
        padding-top: 0.03rem;
        margin-left: 0.32rem;

        .score {
          height: 0.23rem;
        }
      }
    }

    .m-c-container {
      // background-color: yellow;
      width: 80vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &.standard {
        width: 1.92rem;
        .score-wrap {
          padding-top: 0.13rem;
          width: 0.4rem;

          .score {
            height: 0.3rem;
            line-height: 0.3rem;
            margin-bottom: 0.02rem;
          }
        }
      }

      &.simple {
        // display: block;
        width: 100vw;
        .bet-item-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
          flex-wrap: nowrap;
          gap: 0.02rem;
          width: 2.74rem;
          margin: 0 auto;
        }
      }

      .play-icon-wrapper {
        height: 0.3rem;
        min-width: 0.43rem;
      }

      .score-wrap {
        width: 0.15rem;
        text-align: center;

        .score {
          height: 0.23rem;
          line-height: 0.21rem;
          margin-bottom: 0.03rem;
        }
      }

      .simple-time {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 0.07rem;
        flex-direction: column;

        .time-wrap {
          margin: auto;
          margin-top: 0.08rem;
          margin-bottom: 0.05rem;
        }
      }
    }


    .vr_basketball_m_c_container{
      &.standard {
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
    }

    &.standard {
      // height: 1.07rem;
    }

    .profession {
      // padding-top: 0.13rem;
      // height: 1.21rem;
      width: 100%;
      overflow: hidden;
      position: relative;


      .slide_icon {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);

        &.animate-effect {
          animation: dir_remind_animate cubic-bezier(0.49, 0.49, 0.61, 0.59) 1.4s infinite;
        }

        &.animate-effect-r {
          animation: dir_right_remind_animate cubic-bezier(0.49, 0.49, 0.61, 0.59) 1.4s infinite;
        }
      }

      .standard-odd-l-w {
        width: 1.92rem;
        flex-shrink: 0;
        display: flex;
        transition: all 0.2s;
        -webkit-transition: all 0.2s;

        &.status2 {
          transform: translateX(-1.84rem);
          -webkit-transform: translateX(-1.84rem);
        }
      }

      .vr_basketball_standard_odd_l_w{
        width: 100%;
      }
    }

    .dir-standard {
      width: 100%;
      margin-top: 0.04rem;

      .block {
        width: 0.08rem;
        height: 0.02rem;
        border-radius: 0.01rem;

        &:last-child {
          margin-left: 0.04rem;
        }
      }
    }

    .standard-odd-list {
      width: 1.84rem;
      flex-shrink: 0;
      justify-content: space-between;

      &.second {
        margin-left: 0.08rem;
      }

      &.status2 {
        margin-left: 0;
      }

      .odd-wrap-min {
        width: 0.6rem;
        height: 0.32rem;
        overflow: hidden;
        border-radius: 0.02rem;
        margin-bottom: 0.02rem;
        background-color: var(--q-gb-bg-c-28);
        :deep(.odd-column-item .odd-title){
          color: #AFB3C8;
        }
        &.hp-2, &.hp-0 {
          height: 0.49rem;
        }

        &:last-child {
          margin-bottom: 0;
        }

        &.column2 {
          height: 0.46rem;
        }
      }
    }

    .vr_basketball_standard_odd_list{
      width: 100%;
    }

    .border-radius4 {
      border-radius: 0.04rem;
      overflow: hidden;
    }

    .match-play-count {
      font-weight: normal;
      color: #AFB3C8;
      flex-grow: 1;
      .play-count {
        color: #1A1A1A;
        i {
          transform: rotate(90deg);
        }
      }

      .video-play-icon {
        width: 0.14rem;
        height: 0.12rem;
        background-size: 100%;
        background-position: center;
        &.img-playing {
          background-image: url($SCSSPROJECTPATH + "/image/vr/img-playing.png");
        }
        &.img-play {
          background-image: url($SCSSPROJECTPATH + "/image/vr/img-play.png");
        }
        &.img-disabled {
          background-image: url($SCSSPROJECTPATH + "/image/vr/img-disabled.png");
        }
      } 


      &.standard {
        font-size: 0.12rem;
      }

      &.simple {
        width: 0.38rem;
        font-size: 0.13rem;
        width: 95%;
        // width: 2.74rem;

        .yb-icon-arrow {
          margin-top: 0.02rem;
        }
      }
    }

    .team-title {
      height: 0.23rem;
      margin-bottom: 0.03rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.14rem;
      .team-score {
        font-size: 0.14rem;
        font-weight: 500;
      }
    }
  }

  .time-wrap {
    width: 0.3rem;
    height: 0.16rem;
    font-size: 0.12rem;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    padding-top: 0.02rem;
    padding-left: 0.01rem;

    .time {
      min-width: 0.18rem;
      text-align: center;
      line-height: 1;
      color: #FF7000;
    }
  }

  .icon-s-wrap {
    margin-right: 0.07rem;
  }

  .live-icon-pre {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    // background-color: yellowgreen;

    // width: 0.27rem;
    height: 0.15rem;
    line-height:  0.15rem;
    // border-radius: 0.1rem;
    // background-color: #FFB001;
    font-size: 0.14rem;
    // color: #ffffff;
    text-align: center;
    font-style: italic;
    color: var(--q-gb-t-c-1);
    // img{
    //   width: .138rem;
    //   height: .0564rem;
    // }
    span{
      display: block;
      height: 100%;
    }
    .span_live{
      // height: 0.12rem;
      font-size: .09rem;
      // background-color: red;

      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .span_show_time{

      // height: 0.12rem;
      margin-left: 0.05rem;
      font-size: .12rem;
      // background-color: blue;

      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    
  }

  .finally {
    width: 0.27rem;
    height: 0.12rem;
    background-size: contain;
    background-repeat: no-repeat;
    line-height: 1;
    font-size: 0.11rem;
    color: #ffffff;
    background-image: var(--q-color-com-img-bg-111);
  }

  .event-team {
    width: 2.74rem;
      padding: 8px 0;

      .name {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--q-gb-t-c-18);
        font-size: 12px;
        font-weight: 400;

        .serving-party {
          border-radius: 2px;
          background: var(--sys-feedback-success-success-400, #4AB06A);
          width: 4px;
          height: 4px;
        }

        .logo {
          width: 20px;
          height: 20px;
        }

        .vs {
          margin: 0 16px;
        }

        >div {
          display: flex;
          align-items: center;
          gap: 4px;
          // width: 1.6rem;
          flex: 1;
          // background-color: red;

          &.left {
            justify-content: flex-end;
            // justify-content: center;
          }

          &.right {
            justify-content: flex-start;
            // justify-content: center;
          }
        }
      }

      .odds {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: .08rem 0;

        .bet_btn {
          display: flex;
          align-items: center;
          width: 274px;
          gap: 2px;
          justify-content: center;

          .active {
            background: var(--sys-neutral-white-white, #FFF);
          }

          .item {
            padding: 2px 0px;
            flex: 1;
            height: 32px;
            flex-shrink: 0;
            border-radius: 2px;
            background: var(--q-gb-bg-c-15);
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.04);
            &.active {
              background: var(--sys-brand-secodary-secondary-200, #C9CDDB);
            }

            .on {
              color: var(--sys-brand-secodary-secondary-300, #AFB3C8);
              text-align: center;
              font-size: 10px;
              font-weight: 500;
            }

            .num {
              color: var(--sys-brand-secodary-secondary-800, #303442);
              text-align: center;
              font-size: 10px;
              font-weight: 700;
            }
          }
        }
      }



    }
}
</style>
src/core/vr/mixin/pages/virtual/virtual-sports_part/virtual_sports_match_item_mixin.js