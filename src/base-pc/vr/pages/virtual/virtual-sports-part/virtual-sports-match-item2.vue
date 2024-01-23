<!--
 * @Description: 虚拟体育赛狗,赛马列表赛事项组件
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
      <!-- 玩法 -->
      <div class="row items-center justify-between m-c-container"
        :class="{standard:standard_edition == 2,simple:standard_edition == 1}"
      >
        <!--专业版-->
        <div>
          <!--标准版赔率容器-->
          <div v-touch-pan.horizontal.prevent.mouse="odd_wrapper_pan"
            :class="{'status2':standard_odd_status == 1}" >
            <!--标准版-->
            <div v-for="(data_i,i) of match_item.hps" :key="i" class="dddd">
              <div class="hpn-title" @click="goto_details(match_item)">
                <span>{{ data_i.hpn }}</span>
                <span>{{ i18n_t("virtual_sports.show_all_markets") }} ></span>
                <!-- 赛马类截止时间 暂不显示 -->
                <!-- <span v-else>
                  {{(new Date(+match_item.mgt)).Format(i18n_t('time7'))}} {{ i18n_t('match_main.cut_off')}}
                </span> -->
              </div>
              <temp9
                :item_details="data_i"
                :match_info="match_item"
                :item_data="data_i||{}"
                :title="data_i.title"
                :csid="match_item.csid"
                :teams="match_item.teams"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import virtual_sports_match_item2_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-match-item2-mixin.js";
import v_s_odd_item from "src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-odd-item.vue"
import v_s_match_timer from "src/base-pc/vr/pages/virtual/virtual-sports-part/virtual-sports-match-timer.vue"
// import odd_column_item from "src/base-h5/components/match-container/template/app/components/odd-column-item.vue"
import odd_column_item from "src/base-pc/components/bet-item/bet-item-list-ouzhou-data.vue"
import ImageCacheLoad from "src/core/public-cache-image/public-cache-image.vue";
// import temp9 from "src/base-h5/components/details/components/tournament-play/template-2/temp9.vue"
import temp9 from "src/base-pc/components/match-detail/template9/detail-template9-1/index.vue"
export default {
  mixins:[virtual_sports_match_item2_mixin],
  name:'virtual_sports_detail_tab',
  components:{
    "v-s-odd-item":v_s_odd_item,
    'v-s-match-timer':v_s_match_timer,
    "odd-column-item":odd_column_item,
    'image-cache-load': ImageCacheLoad,
    temp9,
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
  width: 3.61rem;
  min-height: 0.9rem;
  margin: 0 auto 0.08rem auto;
  border-radius: 0;
  // border-bottom: 1px solid var(--q-gb-bd-c-4);
  position: relative;

  .test-line {
    position: absolute;
    right: 0;
    top: 0;
    color: var(--q-gb-t-c-21);
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
    font-size: 0.14rem;
    justify-content: space-between;
    flex-wrap: nowrap;

    &.standard {
      .team-w-container {
        padding-top: 0.21rem;
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
      font-weight: bold;

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

      .hpn-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--q-gb-bd-c-4);
        height: 0.25rem;
        margin-top: 0.05rem;
        span {
          font-size: 0.12rem;
          color: var(--q-gb-t-c-5);
        }
        span + span {
          font-size: 0.1rem;
          color: var(--q-gb-t-c-19);
        }
      }
      &.standard {

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
        display: block;
        .bet-item-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
          flex-wrap: nowrap;
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

    .profession {
      padding-top: 0.13rem;
      // height: 1.21rem;
      overflow: hidden;
      position: relative;

      .play-count {
          font-size: 0.1rem;
          color: var(--q-gb-t-c-19);
          text-align: right;
          padding-right: 0.1rem;
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
        -webkit-transition: all 0.2s;

        &.status2 {
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
        background-color: var(--q-gb-bg-c-18);
        :deep(.odd-column-item .odd-title){
          color: var(--q-gb-t-c-19);
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

      &.standard {
        line-height: 0.3rem;
        height: 0.3rem;
        font-size: 0.12rem;
      }

      &.simple {
        width: 0.38rem;
        font-size: 0.13rem;

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
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      // position: relative;

      .ellipsis {
        // position: absolute;
        // left: 0;
        // top: 0;
        // width: 100%;
        // height: 100%;
      }
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
          width: 1.6rem;

          &.left {
            justify-content: flex-end;
          }

          &.right {
            justify-content: flex-start;
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
              color: var(--sys-brand-secodary-secondary-300, --q-gb-bg-c-19);
              text-align: center;
              font-size: 10px;
              font-weight: 500;
            }

            .num {
              color: var(--sys-brand-secodary-secondary-800, --q-gb-bg-c-18);
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
