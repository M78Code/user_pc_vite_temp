
import PageSourceData from "src/core/page-source/page-source.js";
import MatchListCardData from "./match-list-card-data-class.js";
import MenuData from "src/core/menu-pc/menu-data-class.js";

/**
 * @Description 设置吸顶高度
 * @param {Object}
 */
export const set_sticky_top = () => {
  const page_source = PageSourceData.page_source;
  let obj = {
    type: 32,
    league: 32,
  };

  // 搜索页面
  if (page_source == "search") {
    obj = {
      type: 36,
      league: 74,
    };
  }
  // 冠军聚合页
  else if (page_source == "match-champion") {
    obj = {
      type: 84,
      league: 122,
    };
  }
  // 非滚球电竞
  else if (MenuData.is_esports() && !["hot", "play"].includes(page_source)) {
    obj = {
      type: 196,
      league: 196,
    };
  }
  // 冠军 并且不是早盘
  else if (MenuData.is_guanjun() && page_source != "match-early-common") {
    obj = {
      type: 40,
      league: 40,
    };
  }
  // 今日
  else if (page_source == "today") {
    obj = {
      type: 36,
      league: 74,
    };
  }
  // 滚球
  else if (page_source == "match-play-common") {
    obj = {
      type: 84,
      league: 122,
    };
    // if (this.is_show_hot) {
    //   obj = {
    //     type: 36,
    //     league: 74,
    //   };
    // }
    //虚拟体育
    if (MenuData.is_virtual_sport()) {
      // 虚拟足球
      if (MenuData.cur_level2_menu == "30054") {
        obj = {
          type: 160,
          league: 20,
        };
      } else {
        obj = {
          type: 117.5,
          league: 20,
        };
      }
    }
  }
  // 早盘
  else if (page_source == "match-early-common") {
    obj = {
      type: 90,
      league: 90,
    };
    // if (this.is_show_hot) {
    //   obj = {
    //     type: 36,
    //     league: 74,
    //   };
    // }
  }
  // 串关
  else if (page_source == "bet") {
    obj = {
      type: 86,
      league: 124,
    };
    // if (this.is_show_hot) {
    //   obj = {
    //     type: 36,
    //     league: 74,
    //   };
    // }
  }
  // 热门赛事
  else if (page_source == "hot") {
    obj = {
      type: 84,
      league: 122,
    };
  }
  // 收藏页面
  if (page_source == "match-collect") {
    obj = {
      type: 36,
      league: 74,
    };
    // 电竞收藏
    if (MenuData.is_esports()) {
      obj = {
        type: 196,
        league: 196,
      };
    }
    // 冠军收藏
    else if (MenuData.is_guanjun() && page_source != "winner_top") {
      obj = {
        type: 40,
        league: 40,
      };
    }
  }
  console.log('page_source', PageSourceData);
  obj.fixed_header_height = obj.type + "px";

  Object.assign(MatchListCardData.sticky_top, obj);
};
