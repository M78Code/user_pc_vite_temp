/*
 * @Description:  目前的 赛事列表的  各种模板的 配置
 * @Author:
 * @Date: 2021-12-05 14:29:24
 */


// 赛事状态标题卡片模板   已开赛   
export const play_title_card_template = {
  // 卡片类型  
  card_type:'play_title',
  // 卡片总高度
  card_total_height:38,
  // 该赛事状态下的赛事数量
  match_count:0,
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
 
 
}

// 赛事状态标题卡片模板   未开赛 
export const no_start_title_card_template = {
  // 卡片类型  
  card_type:'no_start_title',
  // 卡片总高度
  card_total_height:38,
  // 该赛事状态下的赛事数量
  match_count:0,
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
 
 
}

// 球种标题卡片模板
export const sport_title_card_template = {

  // 卡片类型
  card_type:'sport_title',
  // 球种名称
  csna:'',
  // 球种ID
  csid:'',
  // 卡片总高度
  card_total_height:38,
  // 该赛事状态下的赛事数量
  match_count:0,
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
}

// 联赛标题卡片模板
export const league_title_card_template = {

  // 卡片类型 league_title  
  card_type:'league_title',
  // 卡片总高度 即当前页面渲染的高度
  card_total_height:38,
  // 卡片总高度备份 用于折叠展开后还原卡片高度
  card_total_height_back:38,
  // 联赛未折叠高度
  league_nofold_height:38,
  // 联赛已折叠高度
  league_fold_height:38,
  // 联赛id 
  tid:0,
  // 联赛下第一个赛事ID 用于某些模板需要根据赛事状态来区分玩法标题
   mid:0,
  // 卡片总高度
  card_total_height:38,
  // 该赛事状态下的赛事数量
  match_count:0,
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
 
}
 


// 冠军 投注截止时间  模板  
export const  champion_hmend_card_template = {

  // 卡片类型
  card_type:'champion_hmend',
  
  // 玩法ID
  hpid:'',
  // 卡片总高度
  card_total_height:38,

}
// 冠军  玩法标题  模板  
export const  champion_hps_card_template = {

  // 卡片类型
  card_type:'champion_hps', 
  // 玩法ID
  hpid:'',
  // 卡片总高度
  card_total_height:38,

}


// 通用主盘口 区域高度 
  
export const  common_main_odds_card_template = {

  // 卡片类型
  card_type:'common_main_odds', 
  // 球种ID
  csid:'',
  // 赛事id 
  mid:"",
  // 卡片总高度
  card_total_height:38,

}
// 通用 简单版 盘口 区域高度 
  
export const  common_simple_odds_card_template = {

  // 卡片类型
  card_type:'common_simple_odds', 
  // 球种ID
  csid:'',
  // 赛事id 
  mid:"",
  // 卡片总高度
  card_total_height:38,

}

// 次要玩法 头部 

  
export const  secondary_odds_title_card_template = {

  // 卡片类型
  card_type:'secondary_odds_title', 
  // 联赛ID
  tid:'',
  // 赛事id 
  mid:"",
  // 卡片总高度
  card_total_height:38,

}


// 次要玩法 展示区域 

export const  secondary_odds_card_template = {

  // 卡片类型
  card_type:'secondary_odds_title', 
  // 联赛ID
  tid:'',
  // 赛事id 
  mid:"",
  //tab key    hpsCorner  这个类似 
  odds_key:'',
  // 卡片总高度
  card_total_height:38,

}



 
 // 热门 球种标题 

export const  hot_sport_title_card_template = {

  // 卡片类型
  card_type:'hot_sport_title', 
  // 球种名称
  csna:'',
  // 球种ID
  csid:'',
  // 卡片总高度
  card_total_height:38,

}


 // 热门 时间标题 

 export const  hot_sport_time_card_template = {

  // 卡片类型
  card_type:'hot_sport_time', 
  // 时间
  time:'',
  // 卡片总高度
  card_total_height:38,

}

 // 精选赛事标题 文字标题 

 export const  hot_literal_title_card_template = {

  // 卡片类型
  card_type:'hot_literal_title', 
  // 时间
  time:'',
  // 卡片总高度
  card_total_height:38,

}

// 猜你喜欢 标题和 轮播区域 一起  

export const   recommend_carousel_card_template = {

  // 卡片类型
  card_type:'recommend_carousel', 
  // 时间
  time:'',
  // 卡片总高度
  card_total_height:38,

}






