  /**
   * @Description 打印数据  调试用
  */
  test_log_data(){
    // 错误的卡片数据
    let error_card_obj = {}
    this.match_list_card_key_arr.forEach( card_key => {
      let card_obj = this.all_card_obj[card_key]
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
      which_list:this.which_list,
      all_card_obj:this.all_card_obj,
      match_list_card_key_arr:this.match_list_card_key_arr,
      csid_to_card_key_obj:this.csid_to_card_key_obj,
      play_to_card_key_arr:this.play_to_card_key_arr,
      no_start_to_card_key_arr:this.no_start_to_card_key_arr,
      match_list_mapping_relation_obj_type:this.match_list_mapping_relation_obj_type,
      is_run_card_function:this.is_run_card_function,
      mid_obj: this.match_list_data.mid_obj,
      hl_obj: this.match_list_data.hl_obj,
      ol_obj: this.match_list_data.ol_obj,
      hn_obj: this.match_list_data.hn_obj,
      match_list: this.match_list_data.match_list,
      all_league_obj: this.match_list_data.league_list_obj,
      scroll_top:this.view.$matchlist.scroll_top,
    }
    if(window.is_custom_test){
      console.info(log_data);
    }else{
      console.log('=====打印数据')
      console.log(log_data)
      let is_clog = (sessionStorage.getItem('clog') == 1)?1: ((location.href.indexOf('clog=1') != -1)?1:0);
      this.view.$root.$emit('SHOW_TOAST',is_clog ? '打印成功' : 'clog=1未开启')
    }
  }