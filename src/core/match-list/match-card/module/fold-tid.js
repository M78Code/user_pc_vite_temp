
 /**
   * @Description 折叠所有联赛   调试用
  */
 fold_all_league(){
    this.match_list_card_key_arr.forEach(card_key => {
      let card_obj = this.all_card_obj[card_key] || {}
      if(card_obj.card_type == 'league_title'){
        card_obj.is_league_fold = false
        this.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie(card_obj)
      }
    })
  }

   /**
    * 联赛 折叠
    * click_card_obj 点击的联赛卡片对象
    */
   recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie(click_card_obj){
    click_card_obj.is_league_fold = !click_card_obj.is_league_fold
    // 折叠的联赛容器卡片
    let league_container_card_obj = this.all_card_obj[click_card_obj.league_container_card_key]
    // 设置联赛容器卡片是否折叠
    league_container_card_obj.is_league_fold = click_card_obj.is_league_fold
    // 设置联赛容器卡片是否显示
    league_container_card_obj.is_show_card = !click_card_obj.is_league_fold

    // 根据折叠状态设置联赛标题卡片高度 联赛标题卡片高度有折叠和未折叠两种状态
    if(click_card_obj.is_league_fold){
      // 联赛折叠
      // 设置折叠后的列表scroll_top
      this.set_fold_match_list_scroll_top(click_card_obj.offset_top,true)
      // 设置联赛标题卡片高度
      click_card_obj.card_total_height = click_card_obj.league_fold_height
      click_card_obj.card_total_height_back = click_card_obj.league_fold_height

      // 设置联赛容器卡片
      league_container_card_obj.card_total_height = 0

    }else{
      // 联赛展开
      // 还原联赛标题卡片高度
      click_card_obj.card_total_height = click_card_obj.league_nofold_height
      click_card_obj.card_total_height_back = click_card_obj.league_nofold_height

      // 设置联赛容器卡片高度
      if(league_container_card_obj.load_data_status == 'loaded'){
        league_container_card_obj.card_total_height = league_container_card_obj.card_total_height_back
      }else{
        league_container_card_obj.load_data_status = 'loading'
        league_container_card_obj.card_total_height = 200
      }
    }

    // 计算所有卡片偏移量 和列表总高度
    this.conpute_match_list_card_offset()
  }


   /**
   * 新增赛事重新设置折叠
   * 哪种列表类型
   * 1. 列表数据类型为联赛列表   单一赛种，有未开赛 已开赛 ，不区分赛种
   * 2. 列表数据类型为赛事列表   全部赛种 不区分 是否开赛，区分赛种
   * 3. 列表数据类型为联赛列表   单一赛种，不区分赛种 ，只有未开赛，只有联赛
   * 4. 列表数据类型为赛事列表   单一赛种，有未开赛 已开赛 ，不区分赛种
   * 5. 冠军赛事列表            全部赛种 不区分是否开赛
   * 6. 冠军赛事列表            单一赛种 不区分是否开赛
   */
   set_new_league_fold(){
    // 列表类型区分已开赛 和 未开赛
    if([1,4].includes(this.match_list_mapping_relation_obj_type)){
      let play_title_card_obj = this.all_card_obj.play_title || {}
      // 如果滚球已折叠 调用滚球折叠方法  设置所有的滚球联赛折叠
      if(play_title_card_obj.is_match_status_fold){
        play_title_card_obj.is_match_status_fold = false
        this.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_zaopan_gunqiu_zhedie(play_title_card_obj,true)
      }
      let no_start_title_card_obj = this.all_card_obj.no_start_title || {}
      // 如果未开赛已折叠 调用未开赛折叠方法  设置所有的未开赛联赛折叠
      if(no_start_title_card_obj.is_match_status_fold){
        no_start_title_card_obj.is_match_status_fold = false
        this.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_zaopan_gunqiu_zhedie(no_start_title_card_obj,true)
      }
    }
    // 列表类型区分球种
    else if([2,5].includes(this.match_list_mapping_relation_obj_type)){
      // 遍历所有球种标题卡片列表
      _.each(this.csid_to_card_key_obj, card_keys_arr => {
        // 球种标题卡片对象
        let sport_title_card_obj = this.all_card_obj[card_keys_arr[0]] || {}
        // 如果球种已折叠 调用球种折叠方法  设置所有的球种联赛折叠
        if(sport_title_card_obj.is_sport_fold){
          sport_title_card_obj.is_sport_fold = false
          this.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie(sport_title_card_obj,true)
        }
      })
    }
  }


  /**
   * @Description 展开所有联赛 调试用
  */
  unfold_all_league(){
    let params
    this.match_list_card_key_arr.forEach(card_key => {
      let card_obj = this.all_card_obj[card_key] || {}
      if(card_obj.card_type == 'league_title'){
        if(card_obj.is_league_fold){
          if(['today','early','bet'].includes(this.which_list)){
            params = {
              mids: card_obj.league_obj.mids.split(','),
            };
            // 拉取http请求
            window.vue.$root.$emit(window.vue.emit_cmd.EMIT_API_BYMIDS,params)
          }
          card_obj.is_league_fold = true
          this.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie(card_obj)
        }
      }
    })
  }