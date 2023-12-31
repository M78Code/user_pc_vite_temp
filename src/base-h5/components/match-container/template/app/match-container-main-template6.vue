<!--
 * @Description: app-h5  赛果冠军组件   冠军赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div class="champion-wrap-2 component match-container-main-template6" v-if="is_show" :style="{paddingBottom:is_show_league(i)?'':'0px'}">
    <div v-if="match_of_list.is_show_ball_title"  class="sport-title match-indent" @click="handle_ball_seed_fold">
      <span class="score-inner-span"> {{ match_of_list.csna + `(${match_of_list._total})`}} </span>
      <div class="collapse-dire">
        <!-- <img class="icon-down-arrow" :class="{ 'collapsed': league_collapsed }" :src='compute_img_url("icon-collapse")' /> -->
      </div>
    </div>
    <div :class="['cw2-bg-content', !collapsed && 'collapsed']">
      <div v-if="is_show_league(i)"
        :class="['league-container flex items-center justify-between right-border', { collapsed: !collapsed }]"
        @click="handle_league_fold">
        <div class="league-wrapper champion flex items-center">
          <div v-if="menu_type === 100 && GlobalAccessConfig.get_collectSwitch()" class="favorite"
            :class="[{ favorited: match_of_list.tf }, theme]" @click.stop="handle_league_fold"></div>
          <span class="league-title-text row justify-between"
            :class="{ 'without-collect': menu_type !== 100 || (menu_type === 100 && !GlobalAccessConfig.get_collectSwitch()) }">
            {{ match_of_list.tournamentName }}
          </span>
        </div>

        <div class="collapse-dire">
          <icon-wapper color="#c9c9c9" name="icon-arrow" size="15px" :class="['icon-wapper', { 'collapsed': !collapsed }]" />
        </div>
      </div>

      <div class="champion-match-results-content" v-if="collapsed" :class="[(is_show_border_raduis || is_last) && 'border-raduis']">
        <div class="match-line-module" v-if="!is_show_league(i)">
          <div class="match-line"></div>
        </div>
        <div class="cmrc-title">
          <div class="cmrc-t-league">
            <img :src="get_server_file_path(match_of_list.picUrl)">
            <span class="cmrc-tl-text">{{ match_of_list.tournamentName }}</span>
          </div>
          <div>{{ match_of_list.playName }}</div>
        </div>
        <div class="cmrc-t-teams">{{ match_of_list.scoreResult }}</div>
        <div class="cmrc-t-time">{{ format_time_zone(+match_of_list.matchTime).Format(i18n_t('time11')) }}</div>
      </div>
    </div>
  </div>
</template>

<script>

import { i18n_t } from 'src/output/index.js'
import { lang, theme } from 'src/base-h5/mixin/userctr.js'
import { menu_type } from 'src/base-h5/mixin/menu.js'
import { compute_img_url } from "src/output/index.js"

import { IconWapper } from 'src/components/icon'
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import OddItemChampion from "src/base-h5/components/match-list/components/odd-item-champion.vue";
import { format_time_zone } from "src/output/index.js"

import champion_mixin from '../../mixins/champion.mixin.js'
import 'src/base-h5/css/pages/match-container-champion.scss'
import { get_server_file_path } from "src/core/file-path/file-path.js"

export default {
  name: "match-container-main-template4",
  mixins: [champion_mixin],
  props: {
    // 当前组件的赛事数据对应列表的赛事
    match_of_list: Object,
    // 赛事处于列表中的下标
    i: Number,
  },
  components: {
    IconWapper,
    OddItemChampion,
  },
  setup() {
    return {
      lang,
      theme,
      i18n_t,
      menu_type,
      compute_img_url,
      GlobalAccessConfig,
      format_time_zone,
      get_server_file_path
    }
  }
}
</script>

<style scoped lang="scss">
.cw2-bg-content {
  background: var(--q-gb-bg-c-18);
  margin: 0 .05rem;
  box-shadow: var(--q-color-box-shadow-color-4);
  border-top-right-radius: .08rem;
  border-top-left-radius: .08rem;
  border-radius: 0 0 0.08rem 0.08rem;
  .league-container {
    border-top-right-radius: .08rem;
    border-top-left-radius: .08rem;
    border: 1px solid var(--q-gb-bd-c-15);
    border-bottom: 1px solid var(--q-gb-bd-c-4);
  }
  // border: 1px solid var(--q-gb-bd-c-15);
  &.collapsed {
    border-radius: .08rem;
    .league-container {
      border-radius: .08rem;
      border: 1px solid var(--q-gb-bd-c-15);
    }
  }
  &.no-radius {
    border-radius: 0;
  }
}

.match-line-module {
  padding: 0 0.1rem;
  // background-color: var(--q-gb-bg-c-21) !important;
  height: 1px;
  .match-line {
    width: 100%;
    height: 0.005rem;
    background-color: var(--q-gb-bd-c-4);
  }
}
.champion-wrap-2 {
  //width: 3.61rem;
  //margin: 0 0 0 0.07rem;
  //border-radius: 0.08rem;
  //overflow: hidden;
  // width: calc(100% - 0.1rem);
  height: auto;
  position: relative;
  margin: 0 auto;
  background: var(--q-gb-bg-c-21);
  border-radius: 0.05rem;

  .league-container {
    height: 0.26rem;
    // border-bottom: 1px solid var(--q-gb-bd-c-15) !important;
    // border: 1px solid var(--q-gb-bd-c-15);

    &.collapsed {
      // border-bottom: 1px solid var(--q-gb-t-c-4);
    }

    .league-wrapper {
      padding-left: 0.1rem;

      .favorite {
        width: 0.16rem;
        height: 0.16rem;
        margin: 0 0.1rem 0.02rem 0.06rem;
        background: var(--q-color-com-img-bg-38);
        background-size: contain;
        background-repeat: no-repeat;

        &.favorited {
          background-image: var(--q-color-com-img-bg-8);
        }

        &.theme02 {
          &.favorited {
            background-image: var(--q-color-com-img-bg-9);
          }
        }

        &.theme01_y0,
        &.theme02_y0 {
          &.favorited {
            background-image: var(--q-color-com-img-bg-10);
          }
        }
      }

      .league-title {
        overflow: hidden;
        white-space: nowrap;
        font-size: 0.13rem;
        font-weight: bold;
        
        .league-icon-mini {
          width: 0.22rem;
          height: 0.22rem;
          margin: 0.01rem 0.07rem 0 0.09rem;
          position: relative;
          transform: scale(0.85);

          &.league-icon-mini2 {
            --per: -0.32rem;
            background: var(--q-color-com-img-bg-11) no-repeat center / 0.2rem 18.88rem;
            background-position-y: calc(var(--per) * var(--num));
          }

          img {
            width: 0.22rem;
            height: 0.22rem;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }

      .league-title-text {
        font-weight: 600;
        color: var(--q-gb-t-c-18);
      }

      .collect-img {
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 20px;
        margin: 0 6px 0 10px;

        >img {
          width: 14px;
          height: 13px;
        }
      }
    }

    .collapse-dire {
      margin-right: 0.05rem;

      .icon-arrow {
        width: 0.12rem;
        height: 0.06rem;
        display: block;
        // transition: transform 0.3s;
        transform: rotateZ(180deg);

        &.collapsed {
          transform: rotateZ(90deg);
        }
      }
    }
  }

  .limit-time {
    // width: 100%;
    height: 0.25rem;
    font-size: 0.11rem;
    text-align: right;
    margin-top: 0.02rem;
    margin-right: 0.08rem;
      padding-left: 0.11rem;
    display: flex;
    align-items: center;
    border-bottom: 0 !important;

    .limit-t-i {
      // width: 3.45rem;
      // margin: 0 auto;
      color: #999;
      border-radius: 0.04rem;
    }
  }

  .hps-wrap {

    >div {
      border-bottom: 1px solid var(--q-gb-t-c-4);
    }

    .match-title {
      height: 0.24rem;
      padding-left: 0.11rem;
      // padding-top: 0.12rem;
      position: relative;
      display: flex;
      width: 50%;
      justify-content: center;


      // &:before {
      //   width: 0.03rem;
      //   height: 0.16rem;
      //   transform: translateY(-1px);
      //   content: ' ';
      //   display: block;
      //   border-radius: 0.015rem;
      //   background: var(--q-gb-t-c-1);
      // }

      .hpn-wrap {
        color: #414655;
        font-size: 11px;
      }
    }

    .ol-list-wrap {
      width: 100%;
      height: auto;
      flex-wrap: wrap;
      margin-top: 0.07rem;
      padding-left: 0.07rem;
      justify-content: space-between;
      // padding-bottom: 0.08rem;
      .ol-li-item {
        background: var(--q-gb-bg-c-15);
        width: 98%;
        margin: 0;
        margin-bottom: .06rem;
      }
      .ol-list-left {
        flex: 1;
        .ol-list-left-title {
          background: var(--q-gb-bg-c-15);
          width: 98%;
          margin: 0;
          margin-bottom: 0.06rem;
          height: 0.4rem;
          padding: 0 0.1rem;
          overflow: hidden;
          justify-content: center;
          align-items: center;
          display: flex;
          border-radius: 0.04rem;
          span {
            max-width: 1.56rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
      .ol-list-right {
        flex: 1;
      }
    }

    .ol-list-wrap2 {
      padding-bottom: 0.08rem;
    }
  }
}

.sport-title {
  display: flex;
  align-items: center;
  padding-left: 0.1rem;
  height: 0.2rem;
  font-size: 0.11rem;
  background-color: var(--q-gb-bg-c-21);
  color: var(--q-gb-t-c-24);
  /*transform: translateY(3px);*/
  margin: 0 auto;
  justify-content:space-between;
  &.hidden_sport {
    display: none !important;
  }

  .score-inner-span {
    width: 3.3rem;
    color: var(--q-match-fs-color-153);
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

  .collapse-dire {
    margin: 0.05rem 0.12rem 0.07rem 0;

    .icon-arrow {
      width: 0.12rem;
      height: 0.06rem;
      display: block;
      transition: transform 0.3s;
    }
  }
}

.champion-match-results-content {
  padding:0 .08rem .08rem;
  background: var(--q-gb-bg-c-18);
  border: 1px solid var(--q-gb-bd-c-15);
  border-bottom-color: var(--q-gb-bg-c-18);
  .cmrc-title {
    display:flex;
    justify-content: space-between;
    margin-bottom:.1rem;
    color: var(--q-gb-t-c-18);
    padding-top: .08rem;
    .cmrc-t-league {
      display:flex;
      align-items:center;
      margin-right:.2rem;
      .cmrc-tl-text {
        width:1.4rem;
      }
      img {
        width:.18rem;
        height:.18rem;
        margin-right: .04rem;
      }
    }
  }
  .cmrc-t-teams {
    font-weight:500;
    margin-bottom:.1rem;
    color: var(--q-gb-t-c-18);
  }
  .cmrc-t-time {
    color:#AFB3C8;
  }
  &.border-raduis{
    border-bottom: 1px solid var(--q-gb-bd-c-15);
    border-radius: 0 0 0.08rem 0.08rem;
  }
}
</style>
