import lodash from 'lodash'
import BaseData from 'src/core/base-data/base-data.js'
import MenuData from "src/core/menu-app-h5/menu-data-class.js"
import PageSourceData from "src/core/page-source/page-source.js";
import { playingMethods_15 } from "src/core/constant/config/15-minute.js";
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
   /**
   * @description 15分钟玩法赛事阶段 ms 1 滚球
   * @param { Number } ms
   * @param { Number } mst
   */
   // 
  get_match_15_minute_stage (ms, mst)  {
    let isLock = false
    let title = ''
    if (ms !== 1) {
      title = playingMethods_15[0].title
    } else if (mst == 0) {
      title = playingMethods_15[0].title
    } else {
      const difference = Math.floor(Number(mst) / 60)
      const residue = Math.floor(difference / 15)
      if (difference > 0 && difference <= 90) {
        title = playingMethods_15.find(p => p.value === residue)?.title
      }
      if (difference < 0) {
        isLock = true
        title = playingMethods_15[0].title
      }
      if (difference > 90) {
        isLock = true
        title = playingMethods_15[playingMethods_15.length - 1]?.title
      }
    }
    return { isLock, title }
  }

  /**
   * @description 获取 欧洲版 首页 in-play 赛事
   * @remarks
   *  1. 默认足篮网，足球最多展示10场赛事，篮球与网球最多展示5场赛事，按开赛时间排序展示，最多展示20场
   *  2. 如果不足20场按菜单球种排序补充上，直到展示20场数据。
   */
  get_home_in_play_data (list) {
    const match_data = list.sort((a,b) => +a.csid - +b.csid)
    const csid_obj = {}
    const result = []
    match_data.some(t => {
      const { csid } = t
      t.is_virtual = true
      const key = `csid_${csid}`
      if (csid_obj[key]) {
        csid_obj[key]++
      } else {
        csid_obj[key] = 1
      }
      if (result.length >= 20) return true
      if (csid == 1 &&  csid_obj[key] < 11) {
        result.push(t)
      } else {
        if (csid_obj[key] < 6) result.push(t)
      }
    })
    return result
  }
}

export default new MatchUtils()