<!--
 * @Description: 虚拟体育足球篮球赛事项组件
-->

<template>
  <div class="match-item-wrap hairline-border" :class="{standard:standard_edition == 2}">
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
      <div class="row items-start team-w-container" @click="goto_details(match_item)" v-if="standard_edition == 2">
        <div class="team-wrapper" :class="{standard:standard_edition == 2}">
          <!-- 战队名称 -->
          <div class="team-title" :class="{over:[2,11].includes(+match_item.match_status)}">
            <img v-img="([lodash.get(match_item,'mhlu'), lodash.get(match_item,'frmhn')])" />
            <div class="ellipsis">{{match_item.teams ? match_item.teams[0] : ''}}</div>
          </div>
          <div class="team-title" :class="{over:[2,11].includes(+match_item.match_status)}">
            <img v-img="([lodash.get(match_item,'malu'), lodash.get(match_item,'frman')])" />
            <div class="ellipsis">
              {{match_item.teams ? match_item.teams[1] : ''}}
            </div>
          </div>

          <div
            v-if="false"
            class="match-play-count standard row justify-start items-center">
            <!-- 比赛时间 -->
            <div class="time-wrap" v-if="match_item.csid != 1004"
              :class="{whistle:[2,11].includes(+match_item.match_status)}"
              v-show="match_item.show_time > 0 || [2,11].includes(+match_item.match_status)" >
              <div class="time">
                {{match_item.show_time}}
              </div>
            </div>
            <!-- 固定60秒 -->
            <div v-if="match_item.csid == 1004 && match_item.mmp != 'PREGAME'" class="time-wrap icon-s-wrap"
              :class="{whistle:[2,11].includes(+match_item.match_status)}"
              v-show="match_item.match_status == 0 && !is_basketball_score">
              <div class="time">
                60
              </div>
            </div>
            <!-- live -->
            <div v-if="match_item.csid == 1004" class="live-icon-pre icon-s-wrap"
              v-show="match_item.match_status == 1 || is_basketball_score">
              live
            </div>
            <!-- 结束 -->
            <div v-if="match_item.csid == 1004" class="finally icon-s-wrap"
              v-show="match_item.match_status == 2">
              Fin.
            </div>
          </div>
        </div>
      </div>
      <!-- 玩法 -->
      <div class="row items-center shrink-0 justify-between m-c-container"
        :class="{standard:standard_edition == 2,simple:standard_edition == 1}"
      >
        <!-- 比分和视频icon -->
        <div class="score-wrap" v-if="false">
          <div class="score"
            v-if="match_item.mmp == 'INGAME' && (match_item.match_status > 0 || show_basketball_score)">
            {{match_item.home}}
          </div>
          <div class="score"
            v-if="match_item.mmp == 'INGAME' && (match_item.match_status > 0 || show_basketball_score)">
            {{match_item.away}}
          </div>
          <!-- 视频icon -->
          <div class="play-icon-wrapper yb-flex-center"
            v-if="standard_edition == 2 && match_item.mms > 0" @click="switch_match_handle(i,match_item)">
            play
            <span class="video-play-icon" :data_si="match_selected_i" :data_i="i"
              :class="get_play_btn_class(match_item,i)" />
          </div>
        </div>
        <div class="simple-time" v-if="false">
          <!-- 比赛时间 -->
          <div class="time-wrap" v-show="match_item.show_time > 0 || match_item.match_status == 2 || match_item.match_status == 11" :class="{whistle:match_item.match_status == 2 || match_item.match_status == 11}">
            <div class="time">{{match_item.show_time}}</div>
          </div>
        </div>
        <!--专业版-->
        <div class="profession" v-if="standard_edition == 2">
           <!--复刻版vr不能滑动-->
          <!-- <template v-if="0 && get_hp_list(1).length"> -->
           <!-- 玩法数量 -->
           <div v-if="match_item.mc" class="play-count" @click="goto_details(match_item)">
              {{lodash.get(get_access_config,'handicapNum') ? `${match_item.mc}`: i18n_t('footer_menu.more')}}
              <icon-wapper class="icon" color="#e1e1e1" name="icon-arrow"  />
            </div>

          <!--标准版赔率容器-->
          <div class="standard-odd-l-w" v-touch-pan.horizontal.prevent.mouse="odd_wrapper_pan"
            :class="{'status2':standard_odd_status == 1}" v-if="standard_edition == 2">
            <!--标准版-->
            <div class="standard-odd-list row">
              <div class="odd-column-w" :key="hp_i_i"
                v-for="(hp_i,hp_i_i) of get_hp_list(0)">
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
                    bet_type="vr_bet"
                    :is_vr_lock="is_vr_lock"
                    :ol_data="ol_item"
                    :match_data_type="pc_list" 
                    :is_scroll_ball="false"
                    />
                </div>
              </div>
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
                    :ol_data="ol_item"
                    :match_data_type="pc_list" 
                    :is_scroll_ball="false"
                    bet_type="vr_bet"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 新手版 -->
        <div v-if="standard_edition == 1" class="match-play-count column justify-end items-end simple" @click="goto_details(match_item)">
          <!--根据bug单号52926 注释掉此处-->
          <!-- <div v-if="match_item.mc">{{match_item.mc}}+ > </div> -->
          <div v-if="match_item.mc"> > </div>
        </div>
        <div class="event-team" v-if="standard_edition == 1">
          <div class="name">
            <div class='left'>
              <span>
                {{match_item.teams ? match_item.teams[0] : ''}}
              </span>
              <!-- 1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 -->
              <image-cache-load v-if="match_item?.mhlu?.length && !([5, 10, 7, 8].includes(Number(match_item.csid)))"
                :csid="+match_item.csid" :path="match_item.mhlu" type="home"></image-cache-load>
              <!-- <img v-if="match?.mhlu?.length" class="logo" v-img="([match_item.mhlu[0], match_item.frmhn[0], match_item.csid])" /> -->
            </div>
            <span class="vs">VS</span>
            <div class='right'>
              <image-cache-load v-if="match_item?.malu?.length && !([5, 10, 7, 8].includes(Number(match_item.csid)))"
                :csid="+match_item.csid" :path="match_item.malu" type="home"></image-cache-load>
              <span>
                {{match_item.teams ? match_item.teams[1] : ''}}
              </span>
            </div>
          </div>
        </div>
        <!--新手版-->
        <div v-if="standard_edition == 1" class="bet-item-wrap row border-radius4">
          <v-s-odd-item :ol_item="ol_item" :hl_item="get_hl_item(match_item)" @click.native="item_click4(match_item,ol_item)"
            :match_invalid="match_item.invalid" :match="match_item"  :is_vr_lock="is_vr_lock"
            v-for="(ol_item,o_i) of get_ol_list_f_match(match_item)" :key="o_i">
          </v-s-odd-item>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import virtual_sports_match_item_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-match-item-mixin.js";
import v_s_odd_item from "src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-odd-item.vue"
import v_s_match_timer from "src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-match-timer.vue"
// import odd_column_item from "src/base-h5/components/match-container/template/app/components/odd-column-item.vue"
import odd_column_item from "src/base-pc/components/bet-item/bet-item-list-ouzhou-data.vue"
import ImageCacheLoad from "src/core/public-cache-image/public-cache-image.vue";
import { IconWapper } from 'src/components/icon'

export default {
  mixins:[virtual_sports_match_item_mixin],
  components:{
    "v-s-odd-item":v_s_odd_item,
    'v-s-match-timer':v_s_match_timer,
    "odd-column-item":odd_column_item,
    'image-cache-load': ImageCacheLoad,
    'icon-wapper': IconWapper,
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
  // width: 3.61rem;
  width: 60vw;
  min-height: 1.05rem;
  margin: 0 auto 0.08rem auto;
  border-radius: 0;
  border-bottom: 1px solid var(--q-gb-bd-c-4);
  position: relative;

  &.standard {
    height: 1.4rem;
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
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    font-size: 0.14rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    // background-color: red;

    &.standard {
      .team-w-container {
        padding-left: 0.10rem;
        padding-top: 0.31rem;
      }

      .team-title {
        height: 0.32rem;
        line-height: 0.3rem;
        margin-bottom: 0.02rem;

      }
    }

    .team-w-container {
      flex-grow: 1;
      width: 50%
    }

    .team-wrapper {
      flex: 1;
      // font-weight: bold;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      &.standard {
        height: 1.07rem;

        .team-title {
          width: 1.4rem;
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

    &.standard {
      // height: 1.07rem;
    }

    .profession {
      // padding-top: 0.13rem;
      // height: 1.21rem;
      overflow: hidden;
      position: relative;

      .play-count {
          font-size: 0.1rem;
          color: #AFB3C8;
          text-align: right;
          padding-right: 0.1rem;
          margin-bottom: 0.05rem;
          // background-color: red;
          i {
            transform: rotate(90deg);
            font-size: 0.1rem;
          }
      }

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

    .border-radius4 {
      border-radius: 0.04rem;
      overflow: hidden;
    }

    .video-play-icon {
      width: 0.16rem;
      height: 0.16rem;
      background-size: 100%;
      background-position: center;
    }

    .match-play-count {
      font-weight: normal;
      color: #AFB3C8;
      padding-right: 0.1rem;

      &.standard {
        line-height: 0.3rem;
        height: 0.3rem;
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
      justify-content: flex-start;
      align-items: center;
      font-size: 0.12rem;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      // position: relative;

      // .ellipsis {
        // position: absolute;
        // left: 0;
        // top: 0;
        // width: 100%;
        // height: 100%;
      // }
    }
  }

  .time-wrap {
    width: 0.37rem;
    height: 0.16rem;
    font-size: 0.12rem;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    margin-right: 0.07rem;
    padding-top: 0.02rem;
    padding-left: 0.01rem;

    .time {
      min-width: 0.18rem;
      text-align: center;
      line-height: 1;
    }
  }

  .icon-s-wrap {
    margin-right: 0.07rem;
  }

  .live-icon-pre {
    width: 0.27rem;
    height: 0.12rem;
    line-height: 1;
    border-radius: 0.1rem;
    // background-color: #FFB001;
    font-size: 0.11rem;
    color: #ffffff;
    text-align: center;
    font-style: italic;
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
        color: var(--q-gb-t-c-5);
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