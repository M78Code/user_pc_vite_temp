<!--
 * @Description: ouzhou-h5  赛果冠军组件   冠军赛事组件，用于赛事列表展示赛事信息
-->
<template>
  <div class="champion-wrap-2 component match-container-main-template6">
    <div class="sport-title match-indent" @click="handle_ball_seed_fold" v-if="!i && routeName">
      <div class="flex items-center">
        <SportIcon size="20"  :status="false" :sport_id="String(Number(match_of_list.csid ) + 100)" />
        <span class="score-inner-span"> {{ match_of_list.csna }} </span>
      </div>
      <div class="collapse-dire">
        <icon-wapper color="#c9c9c9" name="icon-arrow" size="15px" :class="['icon-wapper', { 'collapsed': !collapsed }]" />
      </div>
    </div>
    <div v-if="is_show_league(i)"
      :class="['league-container flex items-center justify-between right-border', { collapsed: !collapsed }]"
      @click.stop="handle_league_fold">
      <div class="league-wrapper champion flex items-center">
       
        <span class="league-title-text row justify-between"
          :class="{ 'without-collect': menu_type !== 100 || (menu_type === 100 && !GlobalAccessConfig.get_collectSwitch()) }">
            <div class="league-icon-mini">
              <!-- <img :src="get_server_file_path(match_of_list.lurl)"> -->
              <img loading="lazy" decoding="async" :src="image_src" @error="league_icon_error">
            </div>
            <span>{{ menu_type == 100 ? match_of_list.onTn : match_of_list.tn }}</span>
        </span>
        
      </div>

      <img class="national_icon" :src="match_collect_state ? have_collect_ouzhou : no_collect_ouzhou" alt="" @click.stop="handle_match_collect">

    </div>

    <template v-for="(hp, index) of match_of_list.hps">
      <div class="hps-wrap hairline-border" v-if="hp.hs != 2 && collapsed" :key="index">

        <div class="hps-wrap-title flex items-center justify-between" :class="{ 'is-favorite': false }" @click.stop>
          <div class="match-title items-center font-weight match-title-width">
            <div class="hpn-wrap ellipsis">
              {{hp.hps}}
            </div>
          </div>
          <div class="match-title items-center">
            <div class="hpn-wrap ellipsis date-style">
              {{(new Date(+match_of_list.med)).Format(i18n_t('time10'))}}
              {{ i18n_t('match_main.cut_off')}}
            </div>
          </div>
        </div>

        <div class="ol-list-wrap flex" :data-ol="hp.ol.length" v-if="hp.ol">
            <OddItemChampion v-for="(ol_item, i) of hp.ol" :key="i" :hs="hp.hs" :data-i="i" :ol_item="ol_item"
              :csid="match_of_list.csid" @click.stop="item_click(match_of_list, hp, ol_item)">
            </OddItemChampion>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { i18n_t } from 'src/output/index.js'
import { lang, theme } from 'src/base-h5/mixin/userctr.js'
import { menu_type } from 'src/base-h5/mixin/menu.js'
import { compute_img_url } from "src/output/index.js"
import SportIcon from "src/base-h5/components/top-menu/top-menu-ouzhou-1/components/left-menu/sport-icon.vue"
import { IconWapper } from 'src/components/icon'
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import OddItemChampion from "src/base-h5/components/match-list/components/odd-item-champion.vue";
import { have_collect_ouzhou, no_collect_ouzhou } from 'src/base-h5/core/utils/local-image.js'
import champion_mixin from '../../mixins/champion.mixin.js'
import 'src/base-h5/css/pages/match-container-champion.scss'
import { get_server_file_path } from "src/core/file-path/file-path.js";

export default {
  name: "match-container-main-template2",
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
    SportIcon
  },
  setup(ctx) {

    const route = useRoute();
    const routeName = route.name !== 'matchList'

    return {
      lang,
      theme,
      i18n_t,
      menu_type,
      compute_img_url,
      GlobalAccessConfig,
      have_collect_ouzhou,
      no_collect_ouzhou,
      get_server_file_path,
      routeName
    }
  }
}
</script>

<style scoped lang="scss">
.champion-wrap-2 {
  height: auto;
  position: relative;
  margin: 0 auto;
  background: var(--q-gb-bg-c-2);
  border-radius: 0.05rem;

  .league-container {
    height: 0.4rem;
    border: .01rem solid var(--q-gb-bd-c-5);
    border-top: none;

    &::before {
      display: none !important;
    }

    .national_icon{
        width: 14px;
        height: 14px;
        margin-right: .18rem;
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

      .league-title-text {
        font-weight: 600;
        align-items: center;
        font-size: .13rem;
        .league-icon-mini {
          width: 0.22rem;
          height: 0.22rem;
          margin: -0.01rem 0.07rem 0 0.06rem;
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
      margin-right: 0.18rem;

      .icon-arrow {
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

    .hps-wrap-title {
      background-color: var(--q-gb-bg-c-10);
      height: .36rem;
      padding: 0 .18rem;
      flex-wrap: nowrap;
      // border-bottom: 1px solid var(--q-gb-t-c-6);
    }

    .font-weight {
      font-weight: bold;
    }

    .match-title {
      height: 0.24rem;
      position: relative;
      display: flex;

      .hpn-wrap {
        color: #414655;
        font-size: 0.12rem;
      }
      .date-style {
        color: var(--q-gb-t-c-1) !important;
      }
    }

    .match-title-width {
      width: 1.8rem;
    }

    

    .ol-list-wrap {
      width: 100%;
      display: flex;
      height: auto;
      justify-content: flex-start;
      border-bottom: .01rem solid var(--q-gb-bg-c-19);
      :deep(.on) {
        color: var(--q-gb-t-c-4);
      }
      // padding-bottom: 0.08rem;
      .ol-li-item {
        background: #fff;
        width: 50%;
        height: auto;
        padding: .14rem .20rem;
        margin: 0;
        border-bottom: .01rem solid var(--q-gb-bg-c-19);
        border-right: .01rem solid var(--q-gb-bg-c-19);
        border-radius: 0;
        :deep(.odds) {
          color: var(--q-gb-t-c-1);
        }
        &.active{
          //background: linear-gradient(0deg,rgba(255,112,0,.1) 0%,rgba(255,112,0,.1) 100%),#FFF;
          background-color: var(--q-gb-bg-c-1) !important;

        }
      }
      .ol-li-item:nth-child(even) {
        border-right: 0;
      }
      .ol-li-item:nth-last-child(-n+1) {
        border-bottom: none;
      }
      // .ol-li-item:hover, .ol-li-item:focus {
      //   background-color: var(--q-gb-bg-c-1);
      //   :deep(.odds) {
      //     color: var(--q-gb-t-c-2);
      //   }
      //   :deep(.on) {
      //     color: var(--q-gb-t-c-2);
      //   }
      // }
    }
  }
}

.sport-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 0.4rem;
  font-size: 0.12rem;
  background-image: var(--q-gb-bg-c-2);
  margin: 0 auto;
  border-bottom: .01rem solid var(--q-gb-t-c-1);
  padding: 0 .18rem;
  padding-right: .09rem;

  .collapse-dire {
      margin-right: 0.18rem;

      .icon-arrow {
        width: 0.12rem;
        height: 0.06rem;
        display: block;
        transition: transform 0.3s;

        &.collapsed {
          transform: rotateZ(180deg);
        }
      }
    }

  &.hidden_sport {
    display: none !important;
  }

  .score-inner-span {
    font-size: .13rem;
    font-weight: bold;
    color: var(--q-match-fs-color-153);
    padding-left: .08rem;
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
