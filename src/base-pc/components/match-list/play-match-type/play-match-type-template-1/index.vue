<template>
  <!-- 滚球盘 标题-->
  <div :class="['match-type text-left yb-flex-between', { 'match-type-even': card_style_obj.is_even_type }]"
  @click="cur_title_info.func_name(card_style_obj)">
    
    <div class="col-left">
      <div class="list-play" v-if="is_no_start_title" :style="compute_css_obj({ key: 'pc-home-list-play' })"></div>
      <!-- 滚球盘 -->
      {{ cur_title_info.name }}
      <!-- 赛事数量 -->
      <span v-if="cur_title_info.show_num" class="match-number">{{ cur_title_info.match_count }}</span>
    </div>
  </div>
</template>
  
<script setup>

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import lodash from 'lodash';

import MenuData from "src/core/menu-pc-yazhou/menu-data-class.js";
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import {
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie
} from 'src/core/match-list-pc/match-card/module/fold-csid.js';
import {
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_zaopan_gunqiu_zhedie
} from 'src/core/match-list-pc/match-card/module/fold-kaisai-weikaisi.js';
import { compute_css_obj } from 'src/core/server-img/index.js'

const route = useRoute()
// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
const props = defineProps({
  card_style_obj: {
    type: Object,
    default: () => {},
  },
})
const cur_title_info = computed(() => {
  let { card_type = 'no_start_title', csna, match_count } = props.card_style_obj;
  let num = ''
  MenuData.in_play_list.map(item => {
    if (item.mif == (+props.card_style_obj.csid + 100)) {
      num = item.ct
    }
  })
  let title_obj = {
    //球种标题
    sport_title: {
      name: csna,
      match_count: lodash.get(MatchListCardData, `sport_match_count.csid_${props.card_style_obj.csid}.count`) || num,
      show_num: MenuData.menu_root != 400 && route.name != "search",
      func_name: recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie
    },
    //滚球标题
    play_title: {
      name: i18n_t("menu.match_play"),
      match_count,
      show_num: true,
      func_name:recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_zaopan_gunqiu_zhedie
    },
    //未开赛标题
    no_start_title: {
      name: i18n_t("list.match_no_start"),
      match_count,
      show_num: true,
      func_name:recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_zaopan_gunqiu_zhedie
    },
  };
  return title_obj[card_type];
})

const is_no_start_title = computed(() => {
  let { card_type = 'no_start_title', csna, match_count } = props.card_style_obj;
  return card_type == 'no_start_title'
})

</script>
<style lang="scss" scoped>
.match-type {
  padding: 0 15px 0 10px;
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  cursor: pointer;
  .col-left {
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    .list-play {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
  }
  .match-number {
    margin-left: 5px;
    font-size: 14px;
    font-weight: 500;
  }

  &.text-left {
    &.yb-flex-between {
      border-radius: 0 0 6px 6px;
      border: 1px solid var(--q-gb-bd-c-6);
      border-top: 0;
      background: var(--q-gb-bd-c-13);
    }
    &.match-type-even {
      border-radius: 6px;
      border-top: 1px solid var(--q-gb-bd-c-6);
      background: var(--q-gb-bg-lg-7) !important;
    }
  }
}
</style>