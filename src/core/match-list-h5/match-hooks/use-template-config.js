/*
 * @Description: 菜单对应的赛事dom高度配置
 */
import { match_dom_height_obj } from '../match-constant/common'

export const useTemplateConfig = (config) => {
  //赛事显示各dom区域状况信息
  const { mid,
    is_show_league,
    is_show_secondary_head,
    show_secondary_play_list,
    is_collapse,
    is_show_no_play,
    show_sport_type,
    is_show_time_title,
    invok_source,
    sub_menu_type,
    number_of_bets
  } = config;
  //各dom区域高度信息
  let r = {
    mid: mid,
    ...match_dom_height_obj,
  };
  //简单版1
  if (config.is_newer_edition || invok_source == 'detail_match_list') {
    r.odd_list_height = 1.0197 + 0.06; // 0.6 为间隙
    r.timer_height = 0;
    r.secondary_content = 0;
    r.secondary_head = 0;
  }
  //赛果
  if (config.menu_type == 28) {
    r.odd_list_height = 1.13;
    r.timer_height = 0;
    // 赛果虚拟足球|篮球 ,
    if ([1001, 1004].includes(sub_menu_type)) {
      r.league_height = .47;
      r.odd_list_height = 0.91;
    }
    // 赛果虚拟赛马|赛狗 ,摩托车
    if ([1002, 1011, 1010, 1009].includes(sub_menu_type)) {
      r.league_height = .47;
      r.odd_list_height = .45;
    }
    // 赛果冠军虚拟高度 对应 BUG 43513
    if ([100].includes(sub_menu_type)) {
      r.odd_list_height = 1;
    }
  }
  //联赛头部
  if (!is_show_league) {
    r.league_spacing = 0;
    r.league_height = 0;
    if (!['home_hot_page_schedule'].includes(invok_source)) {
    }
  }
  //次要玩法头部
  if (!is_show_secondary_head) {
    r.secondary_head = 0;
  }
  //赛事折叠
  if (is_collapse) {
    r.timer_height = 0;
    r.odd_list_height = 0;
    r.secondary_head = 0;
    r.secondary_content = 0;
  }
  //未开赛标题
  if (!is_show_no_play) {
    r.weikaisai_title_space = 0;
  }
  //二级菜单多选(滚球选中全部时)
  if (!show_sport_type) {
    r.sport_type_space = 0;
  }
  else {
    //首页热门赛事
    if (['home_hot_page_schedule'].includes(invok_source)) {
      r.sport_type_space = .58;
    }
  }
  //是否显示次要玩法投注区域
  if (!show_secondary_play_list) {
    r.secondary_content = 0;
  } else {
    // 波胆玩法动态高度 计算
    if ([18, 19].includes(+show_secondary_play_list)) {
      if (number_of_bets) {
        let num_gaodu = 0
        // 波胆玩法
        if (show_secondary_play_list == 18) {
          num_gaodu = .275 + (number_of_bets * 0.32);
        }
        // 5分钟玩法高度
        else if (show_secondary_play_list == 19) {
          num_gaodu = .08 + (number_of_bets * 0.32);
        }
        // 小数点两位数
        r.secondary_content = Math.floor(num_gaodu * 100) / 100;
      } else {
        r.secondary_content = .3
      }
    }
  }
  //热门时间标题例如星期
  if (is_show_time_title) {
    r.time_title = .41;
  }
  return r;
}
