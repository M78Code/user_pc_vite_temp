import { MatchDataWarehouse_PC_List_Common as MatchListData } from 'src/core/index.js'
import MatchListCardData from "./match-list-card-data-class.js";
import lodash from "lodash";

import {conpute_match_list_card_offset ,set_fold_match_list_scroll_top} from  "./card-show-offset.js"
 
 
 /**
    * 赛种 折叠
    *   click_card_obj 点击折叠的卡片对象
    */

 export const  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie=(click_card_obj,is_no_emit_fold_change)=>{
    // 是否赛种折叠
    let is_sport_fold = !click_card_obj.is_sport_fold
    // 赛种已折叠
    if(is_sport_fold){
      // 设置已折叠高度
      click_card_obj.card_total_height = click_card_obj.card_fold_height
      if(!is_no_emit_fold_change){
        // 设置折叠后的列表scroll_top
        set_fold_match_list_scroll_top(click_card_obj.offset_top)
      }
    }else{
      // 设置未折叠高度
      click_card_obj.card_total_height = click_card_obj.card_nofold_height
    }
    // 赛种下所有卡片key列表
    let sport_card_keys_arr = MatchListCardData.csid_to_card_key_obj['csid_'+click_card_obj.csid] || []

    // 遍历所有赛种下卡片  设置赛种折叠
    sport_card_keys_arr.forEach(card_key => {
      let card_obj = MatchListCardData.all_card_obj[card_key]
      // 设置赛种折叠
      card_obj.is_sport_fold = is_sport_fold

      // 非球种标题类型卡片 设置卡片是否显示
      if(card_obj.card_type != 'sport_title'){
        // 设置卡片是否显示
        if(is_sport_fold){
          // 赛种已折叠
          card_obj.is_show_card = false
        }else{
          // 赛种未折叠
          // 如果是联赛标题卡片则显示 ， 联赛容器卡片是否显示等于自身是否折叠
          card_obj.is_show_card = ['league_title','champion_league_title'].includes(card_obj.card_type) ? true : !card_obj.is_league_fold
        }
        // 如果卡片隐藏 设置卡片高度为0  否则还原卡片高度
        if(card_obj.is_show_card){
          card_obj.card_total_height = card_obj.card_total_height_back
        }else{
          card_obj.card_total_height = 0
        }
      }
    })
    // 设置列表总高度
    conpute_match_list_card_offset()
  }