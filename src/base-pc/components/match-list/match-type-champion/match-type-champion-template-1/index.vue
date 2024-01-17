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
    <div class="tr-match-head">
      <div
        class="leagues-wrap"
        @click.stop="MatchListCardClass.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie(card_style_obj)"
      >
       <!-- 箭头 -->
      <i class="icon-arrow q-icon c-icon" size="14px" ></i>
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
         <!-- 联赛收藏 -->
        <div
          class="icon-wrap"
          :class="card_style_obj.league_obj.tf && 'active'"
          v-if="!menu_config.is_esports() && GlobalAccessConfig.get_collectSwitch()"
          @click.stop="mx_collect({type: menu_config.is_esports() ? 'leagues' : 'champion', match: card_style_obj.league_obj})"
        >
          <i class="icon-star q-icon c-icon" :class="card_style_obj.league_obj.tf && 'active'"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import lodash from 'lodash';
// import sportIcon from "src/public/components/sport_icon/sport-icon.vue"
import menu_config from "src/core/menu-pc/menu-data-class.js";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import MatchListCardClass from 'src/core/match-list-pc/match-card/match-list-card-class.js';
import {mx_collect} from "src/core/match-list-pc/composables/match-list-collect.js";

const props = defineProps({
  card_style_obj: {
    type: Object,
    default: () => {},
  },
})


</script>
<style lang="scss" scoped>
.c-match-league {
  height: 34px;
}
.tr-match-head {
  height: 34px;
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
</style>
