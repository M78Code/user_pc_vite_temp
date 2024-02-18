
<!--
 * @Description: yazhou-h5  冠军  冠军赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div class="champion-wrap" v-if="is_show">
    <!--体育类别  menuType 1:滚球 2:即将开赛 3:今日 4:早盘 11:串关 -->
    <div class="sport-title match-indent" v-if="get_sport_show(i)" @click="handle_ball_seed_fold">
      <span class="score-inner-span"> {{match_of_list.csna}} </span>
      <div class="collapse-dire">
        <img class="icon-down-arrow" :class="{ 'collapsed': league_collapsed }" :src='compute_img_url("icon-collapse")' />
      </div>
    </div>
    <div v-if="is_show_league(i)" class="league-container flex items-center justify-between hairline-border" @click="handle_league_fold">
      <div class="league-wrapper champion flex items-center">
        <div @click.stop="handle_match_collect" class="collect-img">
          <!-- 未收藏图标 -->
          <img v-if="!match_collect_state" :src="compute_img_url('icon-favorite')" alt="">
          <!-- 收藏图标 -->
          <img v-if='match_collect_state' :src="compute_img_url('icon-favorite-s')">
        </div>
        <div v-if="menu_type === 100 && GlobalAccessConfig.get_collectSwitch()"  class="favorite" :class="[{favorited:match_of_list.tf},theme]"
          @click.stop="handle_league_fold"></div>
            <div class="league-title-text row justify-between" :class="{'without-collect': menu_type !== 100 || (menu_type === 100 && !GlobalAccessConfig.get_collectSwitch())}" >
              {{menu_type == 100 ? match_of_list.onTn : match_of_list.tn}}
            </div>
        </div>

      <div class="collapse-dire">
        <img class="icon-down-arrow" :class="{collapsed:collapsed}" alt="" :src="compute_img_url('icon-collapse')">
      </div>
    </div>

    <template v-for="(hp,index) of match_of_list.hps">
      <div class="hps-wrap hairline-border" v-if="hp.hs != 2 && !collapsed" :key="index">
       
        <div class="match-title flex items-center"
          :class="{'is-favorite':get_show_favorite_list}">
          <div class="debug-head" style="color:red;position:absolute;right:0;">
            {{get_key_by_obg(hp)}}
          </div>
          <div class="hpn-wrap ellipsis">
            {{hp.hps}}
          </div>
        </div>

        <div v-if="!collapsed && hp.hmed" class="limit-time flex items-center justify-center"
          :class="{'first-t':index == 0}">
          <div class="limit-t-i row justify-center items-center">
            <template v-if="!['zh', 'tw', 'hk'].includes(lang)">
              {{(new Date(+hp.hmed)).Format(i18n_t('time7'))}} {{ i18n_t('match_main.cut_off')}}
            </template>
            <template v-else>
              {{(new Date(+hp.hmed)).Format(i18n_t('time7'))}} {{ i18n_t('match_main.cut_off')}}
            </template>
          </div>
        </div>

        <div class="ol-list-wrap flex justify-start" :data-ol="hp.ol.length" v-if="hp.ol">

          <odd-item-champion 
            v-for="(ol_item,i) of hp.ol"
            :key="i"
            :hs="hp.hs"
            :data-i="i"
            :ol_item="ol_item"
            :style="calc_bgcolor(ol_item)"
            :class="calc_bgcolor(ol_item) && 'active-item'"
            :csid="match_of_list.csid"
            @click.stop="item_click(match_of_list,hp,ol_item)">
          </odd-item-champion>
        </div>
      </div>
    </template>

  </div>
</template>
<script>

import { lang, theme } from 'src/base-h5/mixin/userctr.js'
import { menu_type } from 'src/base-h5/mixin/menu.js'
import { compute_img_url } from "src/output/index.js"

import { IconWapper } from 'src/components/icon'
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import OddItemChampion from "src/base-h5/components/match-list/components/odd-item-champion.vue";

import champion_mixin from '../../mixins/champion.mixin.js'
import 'src/base-h5/css/pages/match-container-champion.scss'

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
  setup () {
    return { 
      lang,
      theme,
      i18n_t,
      menu_type,
      compute_img_url,
      GlobalAccessConfig,
    }
  }
}
</script>
<style scoped lang="scss">
.champion-wrap {
  //width: 3.61rem;
  //margin: 0 0 0 0.07rem;
  //border-radius: 0.08rem;
  //overflow: hidden;
  width: 100%;
  height: auto;
  position: relative;
  border-radius: 4px;

  .league-container {
    height: 0.4rem;
    margin: 0 0.07rem;
    margin-top: 0.07rem;
    border-radius: 0.08rem;

    .league-wrapper {
      height: auto;

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
        font-size: 0.12rem;
        height: 0.22rem;
        transform: translateY(0.01rem);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex-wrap: nowrap;
        padding-top: 0.02rem;
        width: 2.95rem;

        &.without-collect {
          margin-left: .06rem;
          display: contents;
        }
      }
      .collect-img{
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 20px;
        margin: 0 6px 0 10px;
        > img {
          width: 14px;
          height: 13px;
        }
      }
    }
  .collect-tubiao{
    height: 0.15rem;
    width: 0.02rem;
    background-color:var(--q-gb-t-c-1) ;
    border-radius: 10px;

  }
    .collapse-dire {
      margin: 0.05rem 0.11rem 0.07rem 0;

      .icon-down-arrow {
        width: 0.12rem;
        height: 0.06rem;
        display: block;
        transition: transform 0.3s;

        &.collapsed {
          transform: rotateZ(180deg);
        }
      }
    }

    .collapse-dire {
      margin: 0.05rem 0.11rem 0.07rem 0;

      .icon-down-arrow {
        width: 0.12rem;
        height: 0.06rem;
        display: block;
        transition: transform 0.3s;

        &.collapsed {
          transform: rotateZ(180deg);
        }
      }
    }
  }
  .limit-time {
    width: 100%;
    height: 0.25rem;
    font-size: 0.11rem;

    &.first-t {
      padding-top: 0;
      height: 0.2rem;
      margin-top: 0.05rem;
    }

    .limit-t-i {
      width: 3.45rem;
      height: 0.2rem;
      line-height: normal;
      margin: 0 auto;
      color: #414655;
      border-radius: 0.04rem;
    }
  }

  .hps-wrap {
    margin: 0 0.07rem;
    //margin-top: 0.05rem;
    padding-top: 0.05rem;

    .match-title {
      height: 0.34rem;
      // padding-left: 0.11rem;
      // padding-top: 0.12rem;
      position: relative;
     

      &:before {
        width: 0.03rem;
        height: 0.16rem;
        transform: translateY(-1px);
        content: ' ';
        display: block;
        border-radius: 0.015rem;
      }

      .hpn-wrap {
        width: 96%;
        color: #414655;
        margin-left: 0.06rem;
      }
    }

    .ol-list-wrap {
      width: 100%;
      height: auto;
      flex-wrap: wrap;
      margin-top: 0.07rem;
      padding-left: 0.07rem;
      padding-bottom: 0.08rem;
    }

    .ol-list-wrap2 {
      padding-bottom: 0.08rem;
    }
  }
}

.sport-title {
  width: calc(100% - 0.07rem * 2);
  display: flex;
  align-items: center;
  padding-left: 0.1rem;
  height: 0.26rem;
  font-size: 0.11rem;
  background-image: var(--q-gb-bg-lg-19);
  /*transform: translateY(3px);*/
  margin: 0 auto;
  border-radius: 0.06rem;

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
    margin: 0.05rem 0.11rem 0.07rem 0;

    .icon-down-arrow {
      width: 0.12rem;
      height: 0.06rem;
      display: block;
      transition: transform 0.3s;

      &.collapsed {
        transform: rotateZ(180deg);
      }
    }
  }
}
</style>
