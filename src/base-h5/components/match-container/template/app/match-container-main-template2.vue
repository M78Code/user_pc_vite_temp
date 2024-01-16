<!--
 * @Description: app-h5  冠军   冠军赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <!-- 全部联赛标题 -->
  <div class="all_league_title component match-container-main-template2" v-if="i === 0" @click.stop="handle_all_ball_seed_fold">
    <div> <img :src="icon_date" alt=""> <span>{{i18n_t("filter.all_leagues")}}</span> </div>
    <!-- <img :class="['expand_item', {ball_seed_collapsed: !all_ball_seed_collapsed}]" :src="expand_item" alt=""> -->
    <div class="expand_item" :class="{ball_seed_collapsed: !all_ball_seed_collapsed}" :style="compute_css_obj({key: 'h5-kyapp-expand-lague'})"></div>
  </div>
  <div :class="['champion-wrap-2', !collapsed && 'collapsed']" v-if="is_show">
    <div v-if="is_show_league(i)" 
      :class="['league-container flex items-center justify-between right-border collapsed']"
      @click="handle_league_fold">
      <div class="league-wrapper champion flex items-center">
        <div class="favorite-icon-top match list-m" @click.stop="handle_match_collect" v-if="!is_esports">
          <!-- 未收藏图标 compute_img_url('icon-favorite')-->
          <img v-if="!match_collect_state" :src="not_favorite_app" alt="">
          <!-- 收藏图标 compute_img_url('icon-favorite-s')-->
          <img v-if='match_collect_state' :src="normal_img_is_favorite">
        </div>
        <span class="league-title-text row justify-between" 
          :class="{'without-collect': menu_type !== 100 || (menu_type === 100 && !GlobalAccessConfig.get_collectSwitch())}" >
          {{menu_type == 100 ? match_of_list.onTn : match_of_list.tn}}
        </span>
      </div>

      <div class="collapse-dire">
        <icon-wapper color="#c9c9c9" name="icon-arrow" size="15px" :class="['icon-wapper', {'collapsed': collapsed}]" />
      </div>
    </div>

    <template v-for="(hp,index) of match_of_list.hps">
      <div class="hps-wrap hairline-border" v-if="hp.hs != 2 && collapsed" :key="index">
        <div class="title flex items-center justify-between"
          :class="{'is-favorite': false}">
          <div class="match-title items-center">
            <div class="debug-head" style="color:red;position:absolute;right:0;">
              {{get_key_by_obg(hp)}}
            </div>
            <div class="hpn-wrap ellipsis">
              {{hp.hps}}
            </div>
          </div>
          <div v-if="collapsed && hp.hmed" class="limit-time">
            <div class="limit-t-i">
              <template v-if="!['zh', 'tw', 'hk'].includes(lang)">
                {{(new Date(+hp.hmed)).Format(i18n_t('time7'))}} {{ i18n_t('match_main.cut_off')}}
              </template>
              <template v-else>
                {{(new Date(+hp.hmed)).Format(i18n_t('time7'))}} {{ i18n_t('match_main.cut_off')}}
              </template>
            </div>
          </div>
        </div>
        
        <div class="ol-list-wrap flex justify-start" :data-ol="hp.ol.length" v-if="hp.ol">
          <!-- 右侧赔率组件 -->
          <OddItemChampion
            v-for="(ol_item,i) of hp.ol"
            :key="i"
            :hs="hp.hs"
            :data-i="i"
            :ol_item="ol_item"
            :csid="match_of_list.csid"
            @click.stop="item_click(match_of_list,hp,ol_item)">
          </OddItemChampion>
        </div>
      </div>
    </template>

  </div>
</template>

<script>

import { i18n_t , compute_css_obj} from 'src/output/index.js'
import { lang, theme } from 'src/base-h5/mixin/userctr.js'
import { menu_type } from 'src/base-h5/mixin/menu.js'
import { compute_img_url } from "src/output/index.js"

import { IconWapper } from 'src/components/icon'
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import OddItemChampion from "src/base-h5/components/match-list/components/odd-item-champion.vue";
import { icon_date, expand_item } from 'src/base-h5/core/utils/local-image.js'

import champion_mixin from '../../mixins/champion.mixin.js'
import 'src/base-h5/css/pages/match-container-champion.scss'
import { not_favorite_app, normal_img_is_favorite} from 'src/base-h5/core/utils/local-image.js'
import { is_esports } from 'src/base-h5/mixin/menu.js'


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
      icon_date,
      is_esports,
      expand_item,
      compute_img_url,
      compute_css_obj,
      GlobalAccessConfig,
      not_favorite_app,
      normal_img_is_favorite
    }
  }
}
</script>

<style scoped lang="scss">
.all_league_title{
  display: flex;
  height: 30px;
  background: var(--q-gb-bg-c-25);
  padding: 0 10px;
  align-items: center;
  justify-content: space-between;
  border-top: 2px solid var(--q-gb-bd-c-3);
  color: var(--q-gb-t-c-18);
  > div {
    display: flex;
    align-items: center;
    > span {
      padding-left: 5px;
    }
  }
  .expand_item{
    display: block;
    width: 20px;
    height: 16px;
    transition: transform 0.25s ease;
    transform: rotate(0);
  }
  .ball_seed_collapsed{
    transform: rotate(-90deg) !important;
  }

}
.champion-wrap-2 {
  //width: 3.61rem;
  //margin: 0 0 0 0.07rem;
  //border-radius: 0.08rem;
  //overflow: hidden;
  width: calc(100% - 0.1rem);
  height: auto;
  position: relative;
  margin: 0 auto;
  background: var(--q-gb-bg-c-18);
  border-radius: 0.05rem;
  color: var(--q-gb-t-c-18);
  margin-bottom: .05rem;

  .league-container {
    height: 0.26rem;
    border-top-right-radius: .08rem;
    border-top-left-radius: .08rem;
    border: 1px solid var(--q-gb-bd-c-15);
    border-bottom: 1px solid var(--q-gb-bd-c-4);
    

    .league-wrapper {
      padding-left: 0.12rem;
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

      .favorite-icon-top {
        width: 0.14rem;
        height: 100%;
        height: 0.14rem;
        flex-shrink: 0;
        margin-right: .06rem;
        position: relative;

        img {
          width: 100%;
          height: 100%;
          // vertical-align: middle;
          margin-top: -2px;
        }

        .f-icon {
          display: none;
        }
      }


      .league-title-text {
        font-weight: 600;
        line-height: 0.26rem;

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

    .collapse-dire {
      margin-right: 0.05rem;
      .icon-arrow {
        width: 0.12rem;
        height: 0.06rem;
        display: block;
        transition: transform 0.3s;
        transform: rotateZ(90deg);
        &.collapsed {
          transform: rotateZ(180deg);
        }
      }
    }
  }

  &.collapsed{
    border-radius: .08rem;
    .league-container {
      border-radius: .08rem;
      border: 1px solid var(--q-gb-bd-c-15);
    }
  }
  &.no-radius {
    border-radius: 0;
  }
  .limit-time {
    // width: 100%;
    height: 0.25rem;
    font-size: 0.11rem;
    text-align: right;
    margin-top: 0.02rem;
    //margin-right: 0.08rem;
    display: flex;
    align-items: center;

    .limit-t-i {
      // width: 3.45rem;
      margin: 0 auto;
      color: var(--q-gb-t-c-19);
      border-radius: 0.04rem;
    }
  }

  .hps-wrap {
    border: 1px solid var(--q-gb-bd-c-15);
    border-radius: 0;
    border-bottom-left-radius: 0.05rem;
    border-bottom-right-radius: 0.05rem;

    > .title {
      margin: 0 0.08rem 0 0.11rem;
      border-bottom: 1px solid var(--q-gb-bd-c-5);
      //border-bottom: 1px solid var(--q-gb-bd-c-4);
    }

    .match-title {
      height: 0.24rem;
      //padding-left: 0.11rem;
      // padding-top: 0.12rem;
      position: relative;
      display: flex;
      width: 59%;
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
        color: var(--q-gb-t-c-18);
        font-size: 11px;
      }
    }

    .ol-list-wrap {
      width: 100%;
      height: auto;
      flex-wrap: wrap;
      margin-top: 0.07rem;
      padding-left: 0.07rem;
      // padding-bottom: 0.08rem;
      .ol-li-item{
        background: var(--q-gb-bg-c-28);
      }
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

    .icon-arrow {
      width: 0.12rem;
      height: 0.06rem;
      display: block;
      transition: transform 0.3s;
    }
  }
}
</style>
