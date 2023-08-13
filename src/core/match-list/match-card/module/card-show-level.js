


 /**
   * 设置卡片显示等级
   * 一级   列表可视区域
   * 二级   列表可视区域 加前500px  和后500px
   * 三级   列表可视区域 加前1000px 和后1000px
   * 四级   列表可视区域 加前2000px 和后2000px
   * 五级   列表可视区域 加前3000px 和后3000px
  */
 export const  set_card_show_level=()=>{
    let scroll_top = this.view.$matchlist.scroll_top
    // 列表高度
    let list_content_height = JSON.parse(localStorage.getItem('get_layout_size')).content_height

    // 一级区域offset_top
    this.level1_offset_top = scroll_top
    // 一级区域offset_bottom
    this.level1_offset_bottom = this.level1_offset_top + list_content_height

    // 二级区域offset_top
    this.level2_offset_top = scroll_top - 500
    // 二级区域offset_bottom
    this.level2_offset_bottom = this.level2_offset_top + list_content_height + 500 * 2

    // 三级区域offset_top
    this.level3_offset_top = scroll_top - 1000
    // 三级区域offset_bottom
    this.level3_offset_bottom = this.level3_offset_top + list_content_height + 1000 * 2

    // 可视区域赛事ID
    let show_mids_arr = []

    // 遍历所有卡片
    this.match_list_card_key_arr.forEach(card_key => {
      let card_obj = this.all_card_obj[card_key]

      // 是否联赛容器卡片
      if(card_obj.card_type == 'league_container'){
        // 设置卡片显示等级
        card_obj.show_level = this.get_show_level(card_obj)
        // 设置对应的联赛标题卡片显示等级
        let league_title_card_obj = this.all_card_obj[card_obj.league_title_card_key] || {}
        league_title_card_obj.show_level = card_obj.show_level

        let mids_arr = card_obj.mids.split(',')
        // 遍历联赛容器下的赛事卡片  设置显示等级
        mids_arr.forEach( mid => {
          let match_card_obj = this.all_card_obj['mid_'+mid] || {}
          match_card_obj.show_level = this.get_show_level(match_card_obj)
          if(match_card_obj.show_level == 1 && card_obj.is_show_card){
            show_mids_arr.push(mid)
          }
        })
      }else{
        // 球种标题卡片 和赛事状态卡片 因为设置吸顶的原因，不能用offset_top判断判断是否可视，所以这个类型卡片需要一直显示
        card_obj.show_level = 1
      }

    })
    this.view.$matchlist.set_show_mids(show_mids_arr)
  }




    /**
   * @Description 获取显示等级
  */
    export const     get_show_level=(card_obj)=>{
        let show_level
        if((card_obj.offset_top > this.level1_offset_top && card_obj.offset_top < this.level1_offset_bottom) || (card_obj.offset_bottom > this.level1_offset_top && card_obj.offset_top < this.level1_offset_bottom)){
          show_level = 1
        }else if((card_obj.offset_top > this.level2_offset_top && card_obj.offset_top < this.level2_offset_bottom) || (card_obj.offset_bottom > this.level2_offset_top && card_obj.offset_top < this.level2_offset_bottom)){
          show_level = 2
        }else if((card_obj.offset_top > this.level3_offset_top && card_obj.offset_top < this.level3_offset_bottom) || (card_obj.offset_bottom > this.level3_offset_top && card_obj.offset_top < this.level3_offset_bottom)){
          show_level = 3
        }else{
          show_level = 4
        }
        return show_level
      }
    