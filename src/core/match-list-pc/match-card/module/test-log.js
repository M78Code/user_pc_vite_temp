const MenuData ={
  is_show_hot :false
}

  
  

  
  /**
   *   other_params  其他 附加参数
   * @Description 打印数据  调试用
  */
 export const   test_log_data=(other_params={})=>{
    // 错误的卡片数据
    let error_card_obj = {}
    MatchListCardData.match_list_card_key_arr.forEach( card_key => {
      let card_obj = MatchListCardData.all_card_obj[card_key]
      // 卡片显示 高度为0
      if(card_obj.is_show_card && card_obj.card_total_height == 0){
        error_card_obj[card_key] = card_obj
      }
      // 卡片不显示  高度不等于0
      else if(!card_obj.is_show_card && card_obj.card_total_height != 0){
        error_card_obj[card_key] = card_obj
      }
    })
    let log_data = {
      error_card_obj,
      which_list:MenuData.which_list,
      all_card_obj:MatchListCardData.all_card_obj,
      match_list_card_key_arr:MatchListCardData.match_list_card_key_arr,
      csid_to_card_key_obj:MatchListCardData.csid_to_card_key_obj,
      play_to_card_key_arr:MatchListCardData.play_to_card_key_arr,
      no_start_to_card_key_arr:MatchListCardData.no_start_to_card_key_arr,
      match_list_mapping_relation_obj_type:MatchListCardData.match_list_mapping_relation_obj_type,
      is_run_card_function:MatchListCardData.is_run_card_function,
      mid_obj: MatchListData.match_list_data.mid_obj,
      hl_obj: MatchListData.match_list_data.hl_obj,
      ol_obj: MatchListData.match_list_data.ol_obj,
      hn_obj: MatchListData.match_list_data.hn_obj,
      match_list: MatchListData.match_list_data.match_list,
      all_league_obj: MatchListData.match_list_data.league_list_obj,
      scroll_top:  other_params.scroll_top,
    }
    if(window.is_custom_test){
      console.info(log_data);
    }else{
      console.log('=====打印数据')
      console.log(log_data)
      let is_clog = (sessionStorage.getItem('clog') == 1)?1: ((location.href.indexOf('clog=1') != -1)?1:0);
      // this.view.useMittEmit('SHOW_TOAST',is_clog ? '打印成功' : 'clog=1未开启')
    }
  }