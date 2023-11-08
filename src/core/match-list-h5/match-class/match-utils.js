import lodash from 'lodash'
import BaseData from 'src/core/base-data/base-data.js'
import MenuData from "src/core/menu-app-h5/menu-data-class.js"
import PageSourceData from "src/core/page-source/page-source.js";
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';

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
      // ms 1 100 为 已开赛
      if ([1,110].includes(+t.ms)) {
        started.push(t)
      } else {
        not_started.push(t)
      }
    })
    // 设置开赛，未开赛标题以及数量
    const s_length = lodash.get(started, 'length', 0)
    if (s_length > 0) {
      started[0].start_flag = 1
      started[0].in_progress_total = s_length
      this.get_match_total_by_csid('progress', started)
    }
    const n_length = lodash.get(not_started, 'length', 0)
    if (n_length > 0) {
      not_started[0].start_flag = 2
      not_started[0].no_start_total = n_length
      this.get_match_total_by_csid('not', not_started)
    }
    return lodash.uniqBy([ ...this.handler_match_classify_by_csid(started), ...this.handler_match_classify_by_csid(not_started) ], 'mid')
  }

  /**
   * @description 赛事球种归类 
   * @param {*} list 赛事数据
   */
  handler_match_classify_by_csid (list) {
    const csid_list = list.map(l => {
      return l.csid
    })
    const result_csids = lodash.uniq(csid_list)
    const csid_matchs = []
    result_csids.forEach(csid => {
      const cur_csid_arr = list.filter(item => item.csid === csid)
      cur_csid_arr.length > 0 && csid_matchs.push(...cur_csid_arr)
    })
    return csid_matchs
  }

  /**
   * @description 赛事未开赛标题
   * @param {*} i 赛事下标
   * @returns 
   */
  get_match_is_show_ball_title (i, list) {
    // 当前赛事
    let is_show_ball_title = false
    const match = list[i]
    if ([1,2].includes(match.start_flag)) {
      is_show_ball_title = true
    } else if (i === 0) {
      is_show_ball_title = true
    } else {
      const prev_match = list[i - 1];
      is_show_ball_title = match.csid !== prev_match.csid
    }
    return is_show_ball_title
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
    const menu_lv_v1 = MenuData.current_lv_1_menu_i
    // 详情页，或者  非今日串关不显示
    if(PageSourceData.page_source == 'detail_match_list' || ![1,2,3,6].includes(+menu_lv_v1)){
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
  /**
	 * @description 获取比分 比分变化 或者 赛事阶段变化时调用
	 * @param  {object} match  当场赛事信息
	 */
	get_match_score(match) {
		let key = "S1";
		let { csid, mmp, msc_obj = {} } = match;
		// 足球 | 手球
		if ([1, 11].includes(+csid)) {
			// S7:加时赛比分
			if ([32, 33, 41, 42, 110].includes(+mmp)) {
				key = "S7";
			}
			// S170:点球大战比分
			else if ([34, 50, 120].includes(+mmp)) {
				key = "S170";
			}
		}
		// 主队比分
    let home_score = lodash.get(msc_obj, `${key}.home`, "0")
    // 客队比分
    let away_score = lodash.get(msc_obj, `${key}.away`, "0")
    return { home_score, away_score }
	}
  /**
   * @description 获取 各球种的数量
   * @param { String } key
   * @param { Array } list
   */
  get_match_total_by_csid (key, list) {
    const csids = list.map(item => item.csid)
    const csid_list = lodash.uniq(csids)
    csid_list.forEach(t => {
      const matchs = list.filter(list => list.csid === t)
      MatchResponsive.set_ball_seed_count(`${key}_csid_${t}`, matchs.length)
    })
  }
}

export default new MatchUtils()