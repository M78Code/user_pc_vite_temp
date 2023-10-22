import { compute_local_project_file_path } from 'src/core'

const img1 = compute_local_project_file_path('/image/list/m_list_jiaoqiu_icon.svg')
// 白色版角球选中图标
const img2 = compute_local_project_file_path('/image/list/m_list_jiaoqiu_icon_s.svg')
// 黑色版角球图标
const img3 = compute_local_project_file_path('/image/list/m_list_jiaoqiu_icon_black.svg')
// 黑色版角球选中图标
const img4 = compute_local_project_file_path('/image/list/m_list_jiaoqiu_icon_black_s.svg')
// Y0 白色版角球选中图标/public/
const Y0_img_white = compute_local_project_file_path('/image/list/m_list_jiaoqiu_icon_black_s_y0_white.png')
// Y0 白色版角球选中图标
const match_icon_lock = compute_local_project_file_path('/image/common/match-icon-lock.svg') // Y0 白色版角球选中图标
// 未收藏相关图标
const normal_img_not_favorite_white = compute_local_project_file_path('/image/common/m-list-favorite.svg')
const normal_img_not_favorite_black = compute_local_project_file_path('/image/common/m-list-favorite-s.svg')
// 已经收藏的图标
const normal_img_is_favorite = compute_local_project_file_path('/image/common/m-list-favorite-s.svg')
const y0_img_favorite_black = compute_local_project_file_path('/image/common/m-list-favorite-s-y0.svg')
// 正在直播的
const lvs_icon_theme01 = compute_local_project_file_path('/image/common/zhibo-l.png')
// 赛前直播的
const lvs_icon_theme02 = compute_local_project_file_path('/image/common/zhibo-before.svg')
const animationUrl_icon_theme01 = compute_local_project_file_path('/image/common/donghua-zhichi.svg')
const animationUrl_icon_theme02 = compute_local_project_file_path('/image/common/donghua-zhichi.svg')
const muUrl_theme01 = compute_local_project_file_path('/image/list/video_play-button-play.svg')
const muUrl_theme01_y0 = compute_local_project_file_path('/image/list/video_play-button-play_y0.svg')
const muUrl_theme02 = compute_local_project_file_path('/image/list/video_play-button-play-theme02.svg')
const muUrl_theme02_y0 = compute_local_project_file_path('/image/list/video_play-button-play_y0.svg')

const image_panda_placeholder = "/public/panda/image/panda_placeholder.jpg"
// 无联赛logo图标
const none_league_icon = compute_local_project_file_path('/image/common/match_cup.svg')
// 无联赛logo图标黑色版
const none_league_icon_black = compute_local_project_file_path('/image/common/match_cup_black.svg')
const default_league_icon = compute_local_project_file_path('/image/common/match_cup.svg')
// 主队默认头像
const home_default_avatar = compute_local_project_file_path('/image/common/team_s_l.png')
// 客队默认头像
const away_default_avatar = compute_local_project_file_path('/image/common/team_s_r.png')

// 数据分析
const match_analysis = compute_local_project_file_path('/image/svg/match_analysis.svg')
const match_analysis2 = compute_local_project_file_path('/image/svg/match_analysis2.svg')
// 提前结算
const mearlys_icon = compute_local_project_file_path('/image/list/mearlys.png')

const league_collapse_icon = compute_local_project_file_path('/image/list/league-collapse-icon.svg')
const league_icon = compute_local_project_file_path('/image/list/league-collapse-icon.svg')
const league_icon_back = compute_local_project_file_path('/image/list/league-collapse-icon-black.svg')

const polular_spirite =  compute_local_project_file_path('/image/png/home_page/polular_spirite.png')
const polular_spirite_theme02 =  compute_local_project_file_path('/image/png/home_page/polular_spirite_theme02.png')

//弹出框菜单图片
const popup_menu = {
  refesh: compute_local_project_file_path('/image/menu/refesh.svg'),
  left_menubj: compute_local_project_file_path('/image/menu/left_menubj.svg'),
  set_switch: compute_local_project_file_path('/image/menu/set_switch.svg'),
  lang: compute_local_project_file_path('/image/menu/lang.png'),
  skin1: compute_local_project_file_path('/image/menu/skin1.svg'),
  skin1_2: compute_local_project_file_path('/image/menu/skin1_2.svg'),
  skin2: compute_local_project_file_path('/image/menu/skin2.svg'),
  skin2_2: compute_local_project_file_path('/image/menu/skin2_2.svg')
}

export {
  img1, img2, img3, img4, Y0_img_white, match_icon_lock, normal_img_not_favorite_white, normal_img_not_favorite_black, normal_img_is_favorite, y0_img_favorite_black,
  lvs_icon_theme01, lvs_icon_theme02, animationUrl_icon_theme01, animationUrl_icon_theme02, muUrl_theme01, muUrl_theme01_y0, muUrl_theme02, muUrl_theme02_y0,
  none_league_icon, none_league_icon_black, image_panda_placeholder, default_league_icon, home_default_avatar, away_default_avatar, match_analysis, match_analysis2, mearlys_icon,
  league_collapse_icon, league_icon, league_icon_back, popup_menu, polular_spirite, polular_spirite_theme02
}