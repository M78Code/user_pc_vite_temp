<template>
  <!-- 滚球盘 标题-->
  
  <div class="play-match-type-2" @click="cur_title_info.func_name(card_style_obj)">
    <div class="left-box">
      <sport-icon v-if="card_style_obj?.card_type == 'sport_title'" :data-id="card_style_obj.csid"
        :sport_id="get_sport_id()" :key="get_sport_id()" key_name="pc-left-menu-bg-image" size="18" class="icon" color_type="gray_ball" />
      <!-- 滚球盘 -->
      <span>{{ BaseData.menus_i18n_map[get_card_csid()] }}</span>
      <!-- 赛事数量 -->
    </div>
    <span v-if="cur_title_info.show_num" class="match-number">{{ cur_title_info.match_count }}</span>
    <div class="choose-csid-hpids" v-if="card_style_obj?.card_type == 'sport_title'&& !MenuData.is_kemp()">
      <div class="active flex flex-start items-center" @click.stop="handle_click">
        <div>
          {{ i18n_t(`ouzhou.match.play_map.${card_style_obj.csid}.${current_csid_hpids.first_hpid}`) }} & {{
            i18n_t(`ouzhou.match.play_map.${card_style_obj.csid}.${current_csid_hpids.second_hpid}`) }}
        </div>
        <div class="yb-icon-arrow"></div>
      </div>
      <div class="choose-list" v-if='show_list && !MenuData.is_kemp()'>
        <div class="choose-list-item" v-for="item in choose_config[card_style_obj.csid || '1']"
        :key="item.first_hpid+'_'+item.second_hpid"
          @click.stop="handle_hpid_choose(item)" :class="{
            active: JSON.stringify(current_csid_hpids) == JSON.stringify(item)
          }">
          <div>
            {{ i18n_t(`ouzhou.match.play_map.${card_style_obj.csid}.${item.first_hpid}`) }} & {{
            i18n_t(`ouzhou.match.play_map.${card_style_obj.csid}.${item.second_hpid}`) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import sportIcon from "src/components/sport_icon/sport-icon.vue";
import {choose_config } from 'src/output/index.js'
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import lodash from 'lodash';
import MenuData from 'src/core/menu-pc/menu-data-class.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import BaseData from "src/core/base-data/base-data.js";
import {
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie_2
} from 'src/core/match-list-pc/match-card/module/fold-csid.js';
import {
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie
} from 'src/core/match-list-pc/match-card/module/fold-tid.js';
const route = useRoute()
const props = defineProps({
  card_style_obj: {
    type: Object,
    default: () => { },
  },
})
const show_list = ref(false)
function handle_click() {
  show_list.value = !show_list.value
  if (show_list.value) {
    window.addEventListener('click', () => {
      show_list.value = false
    }, { once: true })
  }
}

const get_card_csid = () => {
  let csid = 1
  if (!MenuData.is_home()) {
    csid = Number(MenuData.current_ball_type) + 100
    if (MenuData.is_esports()) {
      csid = Number(props.card_style_obj?.csid) + 2000
    }
    if (MenuData.is_kemp()) {
      csid = Number(props.card_style_obj?.csid) + 400
    }
  } else {
    csid = Number(props.card_style_obj?.csid) + 100
  }
  return csid
}

const get_sport_id = () => {
  let sport_id = 1
  if (!MenuData.is_home()) {
    sport_id = MenuData.current_ball_type
    if (MenuData.is_esports()) {
      sport_id = props.card_style_obj?.csid
    }
  } else {
    sport_id = props.card_style_obj?.csid
  }
  return sport_id
}

const cur_title_info = computed(() => {
 
  let { card_type = 'no_start_title', csid, match_count } = props.card_style_obj;
  let title_obj = {
    //球种标题
    sport_title: {
      version:BaseData.base_data_version.value,
      name: lodash.get(BaseData.csids_map,`csid_${csid}`,{}).csna,
      match_count: lodash.get(MatchListCardData, `sport_match_count.csid_${props.card_style_obj.csid}.count`),
      show_num: MenuData.menu_root != 400 && route.name != "search",
      func_name: recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie_2
    },
    //滚球标题
    play_title: {
      name: i18n_t("menu.match_play"),
      match_count,
      show_num: true,
      func_name:recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie
    },
    //未开赛标题
    no_start_title: {
      name: i18n_t("list.match_no_start"),
      match_count,
      show_num: true,
      func_name:recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie
    },
  };
  return title_obj[card_type];
})
const current_csid_hpids = ref(MatchListCardDataClass.get_csid_current_hpids(props.card_style_obj.csid))
function handle_hpid_choose(item) {
  show_list.value = false
  current_csid_hpids.value = item
  MatchListCardDataClass.set_csid_current_hpids(props.card_style_obj.csid, item)
}


</script>
<style lang="scss" scoped>
.play-match-type-2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Roboto;
  font-weight: 500;
  line-height: 39px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  text-align: left;
  border-bottom: 1px solid var(--q-gb-bd-c-1);
  background-color: var(--q-gb-bg-c-4);
  padding: 0 16px 0 20px;
  color: var(--q-gb-t-c-5);
  font-size: 13px;

  .left-box {
    display: flex;
    align-items: center;
  }

  .match-number {
    margin-left: 5px;
  }

  .icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

  .choose-csid-hpids {
    font-size: 14px;
    font-weight: 500;
    position: relative;
    cursor: pointer;

    .active {
      color: var(--q-gb-bg-c-1);

      .yb-icon-arrow {
        color: var(--q-gb-t-c-8);
        margin-left: 10px;
        transform: rotate(90deg);
      }
    }
  }

  .choose-list {
    position: absolute;
    right: 0;
    top: 41px;
    min-width: 300px;
    line-height: 40px;
    padding: 12px 0;
    border-radius: 2px;
    background: var(--q-gb-bg-c-4);
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
    z-index: 99;

    &-item {
      padding: 0 16px;
      height: 40px;
      >div {
        border-bottom: 1px solid var(--q-gb-bd-c-2);
      }
      &:hover {
        background-color: var(--q-gb-bg-c-5);
      }
    }

    >div {

      &:last-child div {
        border-bottom: none;
      }
    }
  }
}
</style>