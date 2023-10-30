import lodash from 'lodash'
import BaseData from 'src/core/base-data/base-data.js'
import MenuData from "src/core/menu-app-h5/menu-data-class.js"
import PageSourceData from "src/core/page-source/page-source.js";

class MatchUtils {

  /**
   * @description 赛事归类
   * @param {*} list 赛事数据
   */
  handler_match_classify_by_ms (list) {
    const length = lodash.get(list, 'length', 0)
    if (!(list instanceof Array) || length < 1) return
    let started = []
    let not_started = []
    list.forEach(t => {
      if ([1,110].includes(+t.ms)) {
        started.push(t)
      } else {
        not_started.push(t)
      }
    })
    return lodash.uniqBy([ ...started, ...not_started ], 'mid')
  }

  /**
   * @description 赛事未开赛标题
   * @param {*} i 赛事下标
   * @returns 
   */
  get_match_is_show_no_play (i, mids)  {
    // 当前赛事
    const match = BaseData.resolve_base_info_by_mid(mids[i])
    let is_show_no_play = false;
    const menu_lv_v1 = MenuData.current_lv_1_menu_mi.value
    // 详情页，或者  非今日串关不显示
    if(PageSourceData.page_source == 'detail_match_list' || ![3,11].includes(+menu_lv_v1)){
      return false
    } else if(menu_lv_v1 == 11){
      //串关时,日期为今日才显示
      const md = lodash.get(MenuData.current_lv_3_menu, 'field1')
      //串关今日id为0或'0'
      if(md !== 0 && md !== '0'){
        return is_show_no_play;
      }
    }
    if(match){
      // 如果大于第一个赛事
      if(i > 0){
        // 上一个赛事
        let prev_match = BaseData.resolve_base_info_by_mid(mids[i - 1]);
        //当前赛事是 1:已开赛（滚球）  110:即将开赛  不显示未开赛标题
        //当前赛事是进行中,不显示未开赛标题
        if([1,110].includes(+match.ms)){
          is_show_no_play = false;
        } else if(![1,110].includes(+match.ms) && [1,110].includes(+prev_match.ms)){ //否则当前赛事为未开赛并且上一赛事是进行中则,显示未开赛标题
          is_show_no_play = true;
        }
      }
      //如果是第一个赛事并且是未开赛则显示未开赛标题
      else if(i == 0 && ![1,110].includes(+match.ms)){
        is_show_no_play = true;
      }
    }
    return is_show_no_play;
  }

  /**
   * @description 是否展示联赛标题
   * @param {*} i 赛事下标
   * @returns 
   */
  get_match_is_show_league (i, mids)  {
    // 当前赛事
    const match = BaseData.resolve_base_info_by_mid(mids[i])
    let is_show_league = false
    if (i > 0) {
      const prev_match = BaseData.resolve_base_info_by_mid(mids[i - 1])
       // 上一个赛事对象
      is_show_league = i === 0 ? true : match.tid !== prev_match.tid
    } else {
      is_show_league = true
    }
    return is_show_league
  }
}

export default new MatchUtils()