<template>
  <!-- 滚球盘 标题-->
  <!-- @click="MatchListCardData[cur_title_info.func_name](card_style_obj)" -->
  <div class="play-match-type-2">
    <div class="left-box">
      <sport_icon v-if="card_style_obj?.card_type == 'sport_title'" :data-id="card_style_obj.csid"
        :sport_id="card_style_obj.csid" size="18px" class="icon" color_type="gray_ball" />
      <!-- 滚球盘 -->
      <span>{{ cur_title_info.name }}</span>
      <!-- 赛事数量 -->
    </div>
    <span v-if="cur_title_info.show_num" class="match-number">{{ cur_title_info.match_count }}</span>
    <div class="choose-csid-hpids" v-if="card_style_obj?.card_type == 'sport_title'">
      <div class="active flex flex-start items-center" @click.stop="show_list = !show_list">
        <div>
          {{ $t(`${card_style_obj.csid}_${current_csid_hpids.first_hpid}`) }} & {{
          $t(`${card_style_obj.csid}_${current_csid_hpids.second_hpid}`) }}
        </div>
        <div class="yb-icon-arrow"></div>
      </div>
      <div class="choose-list" v-show="show_list">
        <div class="choose-list-item" v-for="item in choose_config[card_style_obj.csid || '1']"
          @click.stop="handle_hpid_choose(item)" :class="{
            active: JSON.stringify(current_csid_hpids) == JSON.stringify(item)
          }">
          {{ $t(`${card_style_obj.csid}_${item.first_hpid}`) }} & {{
            $t(`${card_style_obj.csid}_${item.second_hpid}`) }}

        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import choose_config from 'src/core/constant/config/ouzhou-pc-choose-config.js'
import sport_icon from "src/base-pc/components/sport_icon.vue";
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import lodash from 'lodash';
import MenuData from 'src/core/menu-pc/menu-data-class.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import MatchListCardData from 'src/core/match-list-pc/match-card/match-list-card-class.js'
import { get_ouzhou_data_tpl_id } from 'src/core/match-list-pc/match-handle-data.js'
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
  text-align: left;
  border-bottom: 1px solid #ff7000;
  background-color: #fff;
  padding: 0 16px 0 20px;
  color: #1A1A1A;
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
    height: 16;
    margin-right: 8px;
  }

  .choose-csid-hpids {
    font-size: 14px;
    font-weight: 500;
    position: relative;
    cursor: pointer;
    .active {
      color: #ff7000;
      .yb-icon-arrow {
        color: #8A8986;
        margin-left: 10px;
        transform: rotate(90deg);
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
      background: #FFF;
      box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
      z-index: 99;

      &-item {
        padding: 0 16px;
        height: 40px;

        &:hover {
          background-color: #fff1e6;
        }
      }

      div {
        border-bottom: 1px solid #E2E2E2;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

}
</style>
 
 