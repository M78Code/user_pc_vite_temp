

import {update_match_parent_card_style} from  "./utils.js"

  /**
   * @Description 移除一场联赛
   * @param {number} remove_tid 移除的联赛ID
  */
  remove_league(remove_tid){

    if($menu.menu_data.is_esports){
      // 列表接口数据类型为联赛列表

      let all_league_obj = this.match_list_data.league_list_obj
      // 遍历所有赛事数据
      let match_status_type_arr = ['livedata','nolivedata']
      match_status_type_arr.forEach(match_status_type => {
        // 遍历联赛列表
        let league_list = _.get(all_league_obj,match_status_type,[])
        league_list.forEach( (league_obj,league_index) => {
          // 判断联赛ID是否相等
          if(remove_tid == league_obj.tid){
            league_list.splice(league_index,1)
          }
        })
      })
      // 重新计算卡片样式
        this.compute_match_list_style_obj_and_match_list_mapping_relation_obj(all_league_obj,true)
    }else{
      // 列表接口数据类型为赛事列表
      let match_list = this.match_list_data.match_list
      // 移除联赛ID一样的赛事
      _.remove(match_list, match => {
        return match.tid == remove_tid
      })
      // 重新计算卡片样式
      this.compute_match_list_style_obj_and_match_list_mapping_relation_obj(match_list,true)
    }
  }

   /**
   * 更新     all_card_obj
   * 更新     映射信息
   * 这里注意  单个赛事增删  不用遍历循环全部 的 数据
   * bymids接口拉取数据或者 ws推送改变赛事盘口变更
   */
   recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs(mids_arr){
    // 是否走卡片逻辑
    if(!this.is_run_card_function){
      return
    }
    mids_arr.forEach( mid => {
      // 原来的样式数据
      let old_match_style_obj = this.all_card_obj['mid_'+mid] || {}
      // 判断是否需要动态计算高度
      if(old_match_style_obj.is_dynamic_compute_height || !old_match_style_obj.card_total_height){
        // 更新赛事表征数据
        let match = this.match_list_data.mid_obj['mid_'+mid] || {}
        let match_style_obj = this.compute_style_template_by_matchinfo(match,match.tpl_id)
        Object.assign(old_match_style_obj,match_style_obj)
        // 更新赛事父级卡片样式 即对应的联赛容器卡片样式
        update_match_parent_card_style(old_match_style_obj,this.all_card_obj)
      }
    })

    // 设置列表总高度
    this.conpute_match_list_card_offset()
  }

    /**
   * @Description 移除一场赛事
   * @param {number} remove_mid 移除的赛事ID
  */
    remove_match(remove_mid){
        if(window.vue.$route.name =='search') {
          return
        }
        if([1,3].includes(this.match_list_mapping_relation_obj_type)){
          // 列表接口数据类型为联赛列表
          // 移除的赛事联赛ID
          let remove_tid = _.get(this.match_list_data.mid_obj,`mid_${remove_mid}.tid`)
          let all_league_obj = this.match_list_data.league_list_obj
          // 遍历所有赛事数据
          let match_status_type_arr = ['livedata','nolivedata']
          match_status_type_arr.forEach(match_status_type => {
            // 遍历联赛列表
            let league_list = _.get(all_league_obj,match_status_type,[])
            league_list.forEach( (league_obj,league_index) => {
              // 判断联赛ID是否相等
              if(remove_tid == league_obj.tid){
                // 赛事ID数组
                let mids_arr = league_obj.mids.split(',')
                // 遍历联赛下所有赛事ID
                mids_arr.forEach( (mid,mid_index) => {
                  // 判断赛事ID是否相等
                  if(mid == remove_mid){
                    mids_arr.splice(mid_index,1)
                    if(mids_arr.length == 0){
                      // 联赛下没有赛事  移除联赛
                      league_list.splice(league_index,1)
                    }else{
                      // 移除赛事后  重新赋值联赛的mids
                      league_obj.mids = mids_arr.join(',')
                    }
                  }
                })
              }
            })
          })
          let match_length = _.get(all_league_obj,'livedata.length',0) + _.get(all_league_obj,'nolivedata.length',0)
          if(match_length == 0){
            this.view.set_load_data_state('empty')
          }else{
            // 重新计算卡片样式
            this.compute_match_list_style_obj_and_match_list_mapping_relation_obj(all_league_obj,true,true)
          }
        }else{
          // 列表接口数据类型为赛事列表
          let match_list = this.match_list_data.match_list
          match_list.forEach( (match,index) => {
            if(match.mid == remove_mid){
              match_list.splice(index,1)
            }
          })
          if(match_list.length == 0){
            // 收藏时当列表为空时跳转菜单
            if(localStorage.getItem('get_layout_list_type') == 'collect'){
              //取消最后一个收藏定位到赛事列表
              this.view.vx_set_layout_list_type("match");
              // 获取赛事列表数据
              this.view.fetch_match_list()
            }else{
              this.view.set_load_data_state('empty')
            }
          }else{
            // 重新计算卡片样式
            this.compute_match_list_style_obj_and_match_list_mapping_relation_obj(match_list,true,true)
          }
          // 滚球 重新计算菜单数量
          if($menu.menu_data.cur_level1_menu == 'play' && !localStorage.getItem('get_layout_list_type') == 'collect'){
            this.match_list_data.compute_sport_count(remove_mid)
          }
        }
      }
    


       /**
   * @Description 新增球种标题卡片 或者赛事状态标题卡片 设置折叠数据
  */
  set_new_sport_title_card_fold(){
    // 新增球种操作
    _.each(this.csid_to_card_key_obj, card_key_arr => {
      let sport_card_obj = this.all_card_obj[card_key_arr[0]] || {}
      // 如果未设置折叠数据  设置折叠数据
      if(!sport_card_obj.hasOwnProperty('is_show_card')){
        Object.assign(sport_card_obj,fold_template)
      }
    })
    // 滚球标题卡片折叠数据处理
    let play_card_obj = this.all_card_obj['play_title'] || {}
    if(!play_card_obj.hasOwnProperty('is_show_card')){
      Object.assign(play_card_obj,fold_template)
    }
    // 未开赛标题卡片折叠数据处理
    let no_start_card_obj = this.all_card_obj['no_start_title'] || {}
    if(!no_start_card_obj.hasOwnProperty('is_show_card')){
      Object.assign(no_start_card_obj,fold_template)
    }
  }