<template>
  <!-- 滚球盘 标题-->
  <div
    :class="['match-type text-left yb-flex-between',{ 'match-type-even': card_style_obj.is_even_type }]"
    @click="match_list_card[cur_title_info.func_name](card_style_obj)"
  >
    <div class="col-left">
      <!-- 滚球盘 -->
      {{ cur_title_info.name }}
      <!-- 赛事数量 -->
      <span v-if="cur_title_info.show_num" class="match-number">{{ cur_title_info.match_count }}</span>
    </div>
  </div>
 </template>
  
 <script setup>

  import { defineProps, computed } from 'vue';
  import { useRoute } from 'vue-router';

  import  { useRegistPropsHelper, useProps  } from "src/composables/regist-props/index.js"
  import {component_symbol ,need_register_props} from "../config/index.js"
  useRegistPropsHelper(component_symbol, need_register_props)
  
  const props = defineProps({ ...useProps })
  const route = useRoute()

  const cur_title_info = computed(() => {
    let { card_type = 'no_start_title', csna, match_count } = props.card_style_obj;
    let func_name = 'recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_zaopan_gunqiu_zhedie'
    let title_obj = {
      //球种标题
      sport_title: {
        name: csna,
        match_count:  _.get(this.match_list_data,`sport_match_count.csid_${props.card_style_obj.csid}.count`),
        show_num: this.vx_cur_menu_type.type_name != "winner_top" && route.name != "search",
        func_name:'recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie'
      },
      //滚球标题
      play_title: {
        name: this.$root.$t("menu.match_play"),
        match_count,
        show_num: true,
        func_name
      },
      //未开赛标题
      no_start_title: {
        name: this.$root.$t("list.match_no_start"),
        match_count,
        show_num: true,
        func_name
      },
    };
    return title_obj[card_type];
  })
  
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
   .col-left span {
     margin-left: 5px;
   }
   .icon-refresh-wrap {
     display: none;
   }
   &:hover {
     .icon-refresh-wrap {
       display: block;
     }
   }
 }
 </style>
 
 