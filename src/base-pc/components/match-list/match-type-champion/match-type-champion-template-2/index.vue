<!--
 * @Author: Amor
 * @Date: 2020-08-08 08:56:43
 * @Description: 赛事列表头部——冠军信息
-->
<template>
  <div
    class="c-match-league"
    :class="{'leagues-pack':card_style_obj.is_league_fold}"
  >
    <div v-show="false">{{ MatchListCardDataClass.list_version }}</div>
    <div class="tr-match-head-ouzhou">
      <div
        class="leagues-wrap"
        @click.stop="MatchListCardClass.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie(card_style_obj)"
      >
        <!-- 联赛图标 -->
        <div class="league-icon-wrap">
          <span class="soprts_id_icon"
            v-if="menu_config.is_esports()"
            :style="compute_css_obj({key:'pc-left-menu-bg-image', position: `item_${compute_sport_id(card_style_obj.league_obj.csid)}` })"></span>
          <img v-img="[lodash.get(card_style_obj.league_obj,'lurl')]" />
        </div>
        <!-- 联赛名称 -->
        <div class="ellipsis-wrap">
          <div class="absolute-full">
            <span class="ellipsis allow-user-select ">{{ card_style_obj.league_obj.onTn || card_style_obj.league_obj.tn }}</span>
          </div>
        </div>
        <!-- 冠军联赛是否收藏 -->
        <div @click.stop="collect"
            class="icon-wrap m-star-wrap-league" v-if="!menu_config.is_esports() && GlobalAccessConfig.get_collectSwitch">
            <div class="collect-start" :style="compute_css_obj({key: is_collect() ? 'pc-home-star-fill' : 'pc-home-star-empty'})"></div>
          </div>

      </div>
    </div>
  </div>
</template>
<script setup>
import lodash from 'lodash';    
import { compute_sport_id  } from 'src/output/module/constant-utils.js'
import menu_config from "src/core/menu-pc/menu-data-class.js";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import MatchListCardClass from 'src/core/match-list-pc/match-card/match-list-card-class.js';
import {mx_collect} from "src/core/match-list-pc/composables/match-list-collect.js";
import { compute_css_obj } from "src/output/index.js";
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";

const props = defineProps({
  card_style_obj: {
    type: Object,
    default: () => {},
  },
})

// const is_collect = ref(false);
// watch(() => props.card_style_obj, () => {
//   //第一次进页面时，收藏从接口获取状态，后续点击前端控制
//   is_collect.value = Boolean(lodash.get(props.card_style_obj, 'league_obj.tf'))
// }, {immediate: true })

function is_collect() {
  return Boolean(lodash.get(props.card_style_obj, 'league_obj.tf'))
}

const collect = lodash.throttle(() => {
  mx_collect({ type: 'champion', match: props.card_style_obj.league_obj });
  // 前端控制收藏状态
  // is_collect.value = !is_collect.value;
}, 1000)

</script>
<style lang="scss" scoped>
.c-match-league {
  margin-top: -1px;
  border-top: 1px solid var(--q-gb-bd-c-1);
}
.tr-match-head-ouzhou {
  height: 40px;
  cursor: pointer;
  .leagues-wrap {
    display: flex;
    align-items: center;
    font-size: 13px;
    padding: 0 10px;
    height: 100%;
     .icon-arrow {
      font-size: 20px;
      margin-right: 20px;
      left: 10px;
      top: -1px;
      transition: transform 0.3s;
    }
    .icon-wrap {
      margin-right: 10px;
    }
    .league-icon-wrap {
      width: 18px;
      height: 18px;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.leagues-pack {
  .leagues-wrap {
    .icon-arrow {
        transform: rotate(180deg);
      }
  }
}
.collect-start {
  width: 14px;
  height: 14px;
  cursor: pointer;
  background-size: 100%;
}
</style>