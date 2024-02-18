

import MatchListCardData from "./match-list-card-data-class.js";

import {conpute_match_list_card_offset,set_fold_match_list_scroll_top} from  "./card-show-offset.js"

  /**
  * 未开赛 开赛 折叠
  *   click_card_obj 点击折叠的卡片对象
  */
 export const  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_zaopan_gunqiu_zhedie=(click_card_obj,is_no_emit_fold_change)=>{
    let is_match_status_fold = !click_card_obj.is_match_status_fold
    // 已折叠
    if(is_match_status_fold){
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
    let fold_card_keys_arr
    if(click_card_obj.card_type == 'play_title'){
      // 滚球折叠
      fold_card_keys_arr = MatchListCardData.play_to_card_key_arr
    }else{
      // 未开赛折叠
      fold_card_keys_arr = MatchListCardData.no_start_to_card_key_arr
    }

    fold_card_keys_arr.forEach(card_key => {
      let card_obj = MatchListCardData.all_card_obj[card_key]
      // 设置赛事状态折叠
      card_obj.is_match_status_fold = is_match_status_fold

      // 非已开赛、未开赛标题类型卡片 设置卡片是否显示
      if(!['play_title','no_start_title'].includes(card_obj.card_type)){
        // 设置卡片是否显示
        if(is_match_status_fold){
          card_obj.is_show_card = false
        }else{
          // 如果赛事状态未折叠并且是联赛标题卡片 则显示  否则是否显示等于是否折叠
          card_obj.is_show_card = card_obj.card_type == 'league_title' ? true : !card_obj.is_league_fold
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