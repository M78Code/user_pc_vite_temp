/*
 * @FilePath: /src/project/yabo/mixins/match_list/match_list_card_config.js
 * @Description:  目前的 赛事列表的  各种模板的 配置
 * @Author:
 * @Date: 2021-12-05 14:29:24
 */


// 赛事状态标题卡片模板
export const match_status_title_card_template = {
  // 卡片索引
  card_index:0,
  // 卡片类型  'play_title' 或者 'no_start_title'
  card_type:'play_title',
  // 卡片总高度
  card_total_height:38,
  // 卡片总高度备份 用于折叠展开还原卡片高度
  card_total_height_back:38,
  // 卡片未折叠高度
  card_nofold_height:38,
  // 卡片已折叠高度
  card_fold_height:38,
  // 是否改类型卡片 的偶数卡片  用于设置偶数类型背景色
  is_even_type:false,
  // 该赛事状态下的赛事数量
  match_count:0,
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
  // 卡片在前端的显示等级
  show_level:1,
  // 可能未来要加上他自己下面的所有联赛的内容高度
}

// 球种标题卡片模板
export const sport_title_card_template = {
  // 卡片索引
  card_index:0,
  // 卡片类型
  card_type:'sport_title',
  // 球种名称
  csna:'',
  // 球种ID
  csid:'',
  // 卡片总高度
  card_total_height:38,
  // 卡片总高度备份 用于折叠展开还原卡片高度
  card_total_height_back:38,
  // 卡片未折叠高度
  card_nofold_height:38,
  // 卡片已折叠高度
  card_fold_height:38,
  // 是否改类型卡片 的偶数卡片  用于设置偶数类型背景色
  is_even_type:false,
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
  // 卡片在前端的显示等级
  show_level:1,
  // 可能未来要加上他自己下面的所有联赛的内容高度
}

// 联赛标题卡片模板
export const league_title_card_template = {
  // 卡片索引
  card_index:0,
  // 卡片类型 league_title 或者 champion_league_title
  card_type:'league_title',
  // 卡片总高度 即当前页面渲染的高度
  card_total_height:38,
  // 卡片总高度备份 用于折叠展开后还原卡片高度
  card_total_height_back:38,
  // 联赛未折叠高度
  league_nofold_height:38,
  // 联赛已折叠高度
  league_fold_height:37,
  // 联赛下赛事数量
  match_count:0,
  // 联赛下第一个赛事ID 用于某些模板需要根据赛事状态来区分玩法标题
  mid:0,
  // 对应的联赛容器卡片key
  league_container_card_key:'',
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
  // 卡片在前端的显示等级
  show_level:1,
  // 联赛信息对象 联赛名称 联赛logo等
  league_obj:{
    // 球种ID
    csid:0,
    // 联赛logo
    lurl:'',
    // 联赛是否收藏
    tf:false,
    // 联赛ID
    tid:0,
    // 联赛名称
    tn:'',
    // 冠军联赛名称
    onTn:'',
    // 联赛下的赛事ID 字符串格式 逗号隔开
    mids:''
  },
  // 可能未来要加上他自己下面的所有赛事的内容高度
}

// 联赛容器卡片模板
export const league_container_card_template  = {
  // 卡片索引
  card_index:0,
  // 卡片类型
  card_type:'league_container',
  // 卡片总高度  联赛内容所有赛事高度
  card_total_height:0,
  // 卡片总高度备份 用于折叠展开还原卡片高度
  card_total_height_back:0,
  // 联赛下的赛事ID 字符串格式 逗号隔开
  mids:'',
  // 对应的联赛标题卡片key
  league_title_card_key:'',
  // 赛事数据加载状态 loaded：赛事数据已加载，loading：数据加载中，user_api_limited：接口限流 empty:暂无数据
  load_data_status:'loaded',
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
  // 卡片在前端的显示等级
  show_level:1,
  // 可能未来要加上他自己下面的所有赛事的内容高度
}

// 暂无数据卡片模板
export const no_data_card_template  = {
  // 卡片索引
  card_index:0,
  // 卡片类型
  card_type:'no_data',
  // 卡片总高度
  card_total_height:290,
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
  // 卡片在前端的显示等级
  show_level:1,
  // 是否显示卡片
  is_show_card:true,
}

// 折叠数据模板
export const fold_template = {
  // 是否已开赛、未开赛折叠
  is_match_status_fold:false,
  // 是否赛种折叠
  is_sport_fold:false,
  // 是否联赛折叠
  is_league_fold:false,
  // 是否显示卡片  赛种折叠 或者 联赛折叠 或者 赛种状态折叠的时候 隐藏卡片
  is_show_card:true,
}

// 欧洲版 顶部 15分钟 卡片模板
export const ouzhou_main_matc_15mins = {
  // 卡片总高度
  card_total_height: 150,
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
  // 卡片在前端的显示等级
  show_level:1,
}

// 欧洲版  热门 卡片模板
export const ouzhou_main_matc_featured = {
  // 卡片总高度
  card_total_height: 140,
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
  // 卡片在前端的显示等级
  show_level:1,
}

// 欧洲版 赛事状态标题卡片模板 以及 15Mins 和 Featured Matches 标题模板
export const ouzhou_match_status_title_card_template = {
  // 卡片索引
  card_index:0,
  // 卡片类型  'play_title' 或者 'no_start_title'
  card_type:'play_title',
  // 卡片总高度
  card_total_height:40,
  // 该赛事状态下的赛事数量
  match_count:0,
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
  // 卡片在前端的显示等级
  show_level:1,
  // 可能未来要加上他自己下面的所有联赛的内容高度
}
// 欧洲版球种标题间距卡片
export const ouzhou_split_line_card_template = {
  // 卡片索引
  card_index:0,
  // 卡片类型
  card_type:'sport_line',
  card_total_height:10,
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
  // 卡片在前端的显示等级
  show_level:1,
  // 可能未来要加上他自己下面的所有联赛的内容高度
}
// 欧洲版球种标题卡片
export const ouzhou_sport_title_card_template = {
  // 卡片索引
  card_index:0,
  // 卡片类型
  card_type:'sport_title',
  // 球种名称
  csna:'',
  // 球种ID
  csid:'',
  // 卡片总高度
  card_total_height:40,
  // 卡片总高度备份 用于折叠展开还原卡片高度
  card_total_height_back:40,
  // 卡片未折叠高度
  card_nofold_height:40,
  // 卡片已折叠高度
  card_fold_height:40,
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
  // 卡片在前端的显示等级
  show_level:1,
  // 可能未来要加上他自己下面的所有联赛的内容高度
}

// 欧洲版联赛标题卡片
export const ouzhou_league_title_template = {
  // 卡片索引
  card_index:0,
  // 卡片类型 league_title 或者 champion_league_title
  card_type:'league_title',
  // 卡片总高度 即当前页面渲染的高度
  card_total_height:40,
  // 卡片总高度备份 用于折叠展开后还原卡片高度
  card_total_height_back:40,
  // 联赛未折叠高度
  league_nofold_height:40,
  // 联赛已折叠高度
  league_fold_height:40,
  // 联赛下赛事数量
  match_count:0,
  // 联赛下第一个赛事ID 用于某些模板需要根据赛事状态来区分玩法标题
  mid:0,
  // 对应的联赛容器卡片key
  league_container_card_key:'',
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
  // 卡片在前端的显示等级
  show_level:1,
  // 联赛信息对象 联赛名称 联赛logo等
  league_obj:{
    // 球种ID
    csid:0,
    // 联赛是否收藏
    tf:false,
    // 联赛ID
    tid:0,
    // 联赛名称
    tn:'',
    // 冠军联赛名称
    onTn:'',
    // 联赛下的赛事ID 字符串格式 逗号隔开
    mids:''
  },
}

// 欧洲版联赛容器卡片
export const ouzhou_league_container_template = {
  // 卡片索引
  card_index:0,
  // 卡片类型
  card_type:'league_container',
  // 卡片总高度  联赛内容所有赛事高度
  card_total_height:0,
  // 卡片总高度备份 用于折叠展开还原卡片高度
  card_total_height_back:0,
  // 联赛下的赛事ID 字符串格式 逗号隔开
  mids:'',
  // 对应的联赛标题卡片key
  league_title_card_key:'',
  // 赛事数据加载状态 loaded：赛事数据已加载，loading：数据加载中，user_api_limited：接口限流 empty:暂无数据
  load_data_status:'loaded',
  // 卡片顶部到列表顶部的偏移量
  offset_top:0,
  // 卡片底部到列表顶部的偏移量
  offset_bottom:0,
  // 卡片在前端的显示等级
  show_level:1,
  // 可能未来要加上他自己下面的所有赛事的内容高度
}