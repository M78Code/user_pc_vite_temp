import { i18n } from 'src/boot/i18n'

export const csid_map_smenu_type = {
  1: 5 ,// 足球"
  2: 7 ,// 篮球"
  3: 19 ,// 棒球"
  4: 18 ,// 冰球"
  5: 13 ,// 网球"
  6: 20 ,// 美式足球"
  7: 14 ,// 斯诺克"
  8: 16 ,// 乒乓球"
  9: 17 ,// 排球"
  10: 15 ,// 羽毛球"
  11: 43 ,// 手球"
  12: 44 ,// 拳击"
  13: 45 ,// 沙滩排球"
  14: 22 ,// 联合式橄榄球"
  // 14: 45 ,// 橄榄球"
  15: 23 ,// 曲棍球"
  16: 24 ,// 水球"
}

export const bottom_spacing = .81;

export const match_dom_height_obj = {
  //体育类型区域
  sport_type_space:.26+0.11,// 自身高0.26 margin top 0.11
  //联赛上边距 两个联赛的间隔 本来应为0.6 为了把间隙显示出来加了0.002 是为了留间隙
  league_spacing: .06+0.002,
  //联赛高度
  league_height: .40, // 理论上是0.397 设置大一点 显示边框
  //时钟区域
  timer_height: 0.30,
  //未开赛标题
  weikaisai_title_space: .266, 
  //投注项区域  对应 match-odds-container 没有子玩法时 match-odds-containe 容器的高度 -  时钟区域 1.4099817961165049-0.2999
  odd_list_height: 1.110 + 0.06 , // 0.06rem 为match-odds-container 距离头部的间隔  + 0.01 是为了增加间隙
  //次要玩法头部
  secondary_head: .36,
  //次要玩法投注区域
  secondary_content: 1.109,
}
