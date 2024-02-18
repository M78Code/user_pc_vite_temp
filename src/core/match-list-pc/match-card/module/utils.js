

import  MatchListCardData from  "./match-list-card-data-class.js"

  /**
   * @Description 更新赛事父级卡片样式 即赛事对应的联赛容器卡片样式
   * @param {object} match_card_obj 赛事卡片对象
  */
  export const  update_match_parent_card_style =(match_card_obj,all_card_obj)=>{
    // 父级联赛内容卡片
    let parent_card_obj =  all_card_obj[match_card_obj.parent_card_key] || {mids:''}
    // 设置赛事数据加载状态为已加载
    parent_card_obj.load_data_status = 'loaded'
    let card_total_height = 0
    // 父级卡片下的mid列表
    let parent_card_mids_arr = parent_card_obj.mids.split(',')
    parent_card_mids_arr.forEach( mid => {

      let child_match_card_obj =  all_card_obj[mid+'_'] || {total_height:0}
      card_total_height += child_match_card_obj.total_height
    })
    // 更新父级卡片高度
    parent_card_obj.card_total_height_back = card_total_height

    if(parent_card_obj.is_show_card){
      parent_card_obj.card_total_height = card_total_height
    }
    // 更新联赛标题卡片mid
    let league_title_card_obj =  all_card_obj[parent_card_obj.league_title_card_key] || {league_obj:{mids:''}}
    league_title_card_obj.mid = league_title_card_obj.league_obj.mids.split(',')[0]
  }