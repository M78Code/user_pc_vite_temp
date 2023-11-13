<template>
  <!-- 滚球盘 标题-->
  <!-- @click="MatchListCardData[cur_title_info.func_name](card_style_obj)" -->
  <div :class="['ouzhou-match-type yb-flex-between']">
    <div class="yb-flex-between">
      <!-- 滚球盘 -->
      {{ cur_title_info.name }}
      <!-- 赛事数量 -->
      <span v-if="cur_title_info.show_num" class="match-number">{{ cur_title_info.match_count }}</span>
    </div>
    <div class="choose-csid-hpids" v-if="card_style_obj?.card_type == 'sport_title'">
      <div @click.stop="show_list = !show_list">
        {{ $t(`${card_style_obj.csid}_${current_csid_hpids.first_hpid}`) }} & {{
          $t(`${card_style_obj.csid}_${current_csid_hpids.second_hpid}`) }}
      </div>
      <div class="choose-list" v-show="show_list">
        <div v-for="item in choose_config[card_style_obj.csid || '1']" @click.stop="handle_hpid_choose(item)">
          {{ $t(`${card_style_obj.csid}_${item.first_hpid}`) }} & {{
            $t(`${card_style_obj.csid}_${item.second_hpid}`) }}
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import choose_config from 'src/core/constant/config/ouzhou-pc-choose-config.js'
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import lodash from 'lodash';
import MenuData from 'src/core/menu-pc/menu-data-class.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
import { t } from "src/core/index.js";
const route = useRoute()
// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
const props = defineProps({
  card_style_obj: {
    type: Object,
    default: () => { },
  },
})
const show_list = ref(false)
const cur_title_info = computed(() => {
  let { card_type = 'no_start_title', csna, match_count } = props.card_style_obj;
  let func_name = 'recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_zaopan_gunqiu_zhedie'
  let title_obj = {
    //球种标题
    sport_title: {
      name: csna,
      match_count: lodash.get(MatchListCardData, `sport_match_count.csid_${props.card_style_obj.csid}.count`),
      show_num: MenuData.menu_root != 400 && route.name != "search",
      func_name: 'recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie'
    },
    //滚球标题
    play_title: {
      name: t("menu.match_play"),
      match_count,
      show_num: true,
      func_name
    },
    //未开赛标题
    no_start_title: {
      name: t("list.match_no_start"),
      match_count,
      show_num: true,
      func_name
    },
  };
  return title_obj[card_type];
})

const current_csid_hpids = ref(MatchListCardDataClass.get_csid_current_hpids(props.card_style_obj.csid))
function handle_hpid_choose(item) {
  show_list.value=false
  current_csid_hpids.value = item
  MatchListCardDataClass.set_csid_current_hpids(props.card_style_obj.csid, item)
}
</script>
<style lang="scss" scoped>
.match-type {
  padding: 0 15px 0 10px;
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  cursor: pointer;

  .match-number {
    margin-left: 5px;
  }

  &.text-left {
    &.yb-flex-between {
      border-radius: 0 0 6px 6px;
      border: 1px solid var(--q-gb-bd-c-6);
      border-top: 0;
    }
  }
}

.ouzhou-match-type {
  font-family: Roboto;
  font-size: 18px;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0px;
  text-align: left;
}

.choose-csid-hpids {
  color: #ff7000;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  cursor: pointer;
  margin-right: 30px;
  .choose-list {
    position: absolute;
    right: 0;
    top: 100%;
    white-space: nowrap;
    z-index: 9999;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 0 8px #00000010;
    line-height: 2;
    border-radius: 5px;
  }
}
</style>
 
 