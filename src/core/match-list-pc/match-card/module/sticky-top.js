
import PageSourceData from "src/core/page-source/page-source.js";
import MatchListCardData from "./match-list-card-data-class.js";
import { MenuData } from "src/output/project/index.js"
/**
   * @Description 设置吸顶高度
   * @param {Object}
  */
export function set_sticky_top() {
  let type_name = ''
  let obj = {
    type: 32,
    league: 32
  }
  // 搜索页面
  if (PageSourceData.page_source == 'search') {
    obj = {
      type: 36,
      league: 74
    }
  }
  // 冠军聚合页
  else if (MenuData.is_kemp()&&!MenuData.is_today()&&!MenuData.is_zaopan()) {
    obj = {
      type: 84,
      league: 122
    }
  }
  // 非滚球电竞
  else if (MenuData.is_esports() && !['hot', 'play'].includes(type_name)) {
    obj = {
      type: 170,
      league: 170
    }
  }
  // 常规冠军
  else if (MenuData.is_common_kemp()&&MenuData.is_today()) {
    obj = {
      type: 40,
      league: 40
    }
  }
  // 今日
  else if (MenuData.is_today()) {
    obj = {
      type: 36,
      league: 74
    }
  }
  // 滚球
  else if (MenuData.is_scroll_ball()) {
    obj = {
      type: 84,
      league: 122
    }
    if (MenuData.is_show_hot) {
      obj = {
        type: 36,
        league: 74
      }
    }
    //虚拟体育
    if (MenuData.is_vr()) {
      // 虚拟足球
      if (MenuData.menu_current_mi == "30054") {
        obj = {
          type: 160,
          league: 20
        }
      } else {
        obj = {
          type: 117.5,
          league: 20
        }
      }
    }
  }
  // 早盘
  else if (MenuData.is_zaopan()) {
    obj = {
      type: 90,
      league: 90
    }
    if (MenuData.is_show_hot) {
      obj = {
        type: 36,
        league: 74
      }
    }
  }
  // 串关
  else if (MenuData.is_mix()) {
    obj = {
      type: 86,
      league: 124
    }
    if (MenuData.is_show_hot) {
      obj = {
        type: 36,
        league: 74
      }
    }
  }
  // 热门赛事
  else if (MenuData.is_hot()) {
    obj = {
      type: 84,
      league: 122
    }
  }
  // 收藏页面
  if (MenuData.is_collect) {
    obj = {
      type: 36,
      league: 74
    }
    // 电竞收藏
    if (MenuData.is_esports()) {
      obj = {
        type: 170,
        league: 170
      }
    }
    // 冠军收藏
    else if (MenuData.is_kemp() && type_name != 'winner_top') {
      obj = {
        type: 40,
        league: 40
      }
    }
  }
  const fixed_header_height = obj.type + 'px'
  MatchListCardData.set_sticky_top(
    {
      fixed_header_height,
      ...obj
    }
  )
}
