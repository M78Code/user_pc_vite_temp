import lodash from 'lodash'
import MatchFold from 'src/core/match-fold/index.js'
import BaseData from 'src/core/base-data/base-data.js'
import { MenuData } from 'src/output/project/index.js'
import UserCtr from 'src/core/user-config/user-ctr.js'
import PageSourceData from "src/core/page-source/page-source.js";
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { use_playingMethods_15, project_name } from "src/output/module/constant-utils.js";
import { template_default_config } from "src/core/match-list-h5/match-card/template/template-common.js"


class MatchUtils {

  /**
   * @description 赛事归类开赛、未开赛
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
        t.start_flag = 3
      } else {
        not_started.push(t)
        t.start_flag = 4
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
    // 已开赛球种归类后的数据
    const result_started = this.handler_match_classify_by_csid(started)
    // 未开赛球种归类后的数据
    const result_not_started = this.handler_match_classify_by_csid(not_started)
    // 最终数据
    return lodash.uniqBy([ ...result_started, ...result_not_started ], 'mid')
    // return lodash.uniqBy([ ...this.handler_match_classify_by_tid(result_started), ...this.handler_match_classify_by_tid(result_not_started) ], 'mid')
  }

  /**
   * @description 赛事球种归类 
   * @param {*} list 赛事数据
   */
  handler_match_classify_by_csid (list) {
    const csid_list = list.map(l => l.csid)
    const result_csids = lodash.uniq(csid_list)
    const csid_matchs = []
    result_csids.forEach(csid => {
      const cur_csid_arr = list.filter(item => item.csid === csid)
      cur_csid_arr.length > 0 && csid_matchs.push(...cur_csid_arr)
    })
    return csid_matchs
  }

  /**
   * @description 赛事联赛归类 
   * @param {*} list 赛事数据
   */
  handler_match_classify_by_tid (list) {
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return []
    const tid_list = list.map(l => l.tid)
    const result_tids = lodash.uniq(tid_list)
    const tids_matchs = []
    result_tids.forEach(tid => {
      const cur_tid_arr = list.filter(item => item.tid == tid)
      cur_tid_arr.length > 0 && tids_matchs.push(...cur_tid_arr)
    })
    return tids_matchs
  }

  /**
   * @description 赛事联赛归类 
   * @param {*} list 赛事数据
   */
  handler_champion_match_classify_by_sport_id (list) {
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return []
    const result_tids = lodash.uniq(list.map(l => l.sportId))
    const result_matchs = []
    result_tids.forEach(sport_id => {
      const cur_sport_arr = list.filter(item => item.sportId == sport_id)
      cur_sport_arr.length > 0 && result_matchs.push(...cur_sport_arr)
    })
    return result_matchs
  }

  /**
   * @description 赛事未开赛标题 or 球种显示
   * @param {*} i 赛事下标
   * @returns 
   */
  get_match_is_show_ball_title (i, list) {
    // 当前赛事
    let is_show_ball_title = false
    const match = list[i]
    if ([1,2].includes(+match.start_flag)) {
      is_show_ball_title = true
    } else if (i === 0) {
      is_show_ball_title = true
    } else {
      const prev_match = list[i - 1];
      is_show_ball_title = match.csid != prev_match.csid && match.csid && prev_match.csid 
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
   * @description 元数据 是否展示联赛标题   
   * @param {*} i 赛事下标
   * @returns Boolean 
   */
  get_origin_match_is_show_league (i, mids)  {
    // 当前赛事
    const match = BaseData.resolve_base_info_by_mid(mids[i])
    let is_show_league = false
    if (!match) return false
    if (i > 0) {
      const prev_match = BaseData.resolve_base_info_by_mid(mids[i - 1])
       // 上一个赛事对象
      is_show_league = prev_match && i === 0 ? true : match.tid !== prev_match.tid
    } else {
      is_show_league = true
    }
    // 显示开赛、未开赛 一定显示联赛标题
    if ([1,2].includes(+match.start_flag)) is_show_league = true
    return is_show_league
  }
  /**
   * @description 非元数据 是否展示联赛标题   
   * @param {*} i 赛事下标
   * @returns Boolean 
   */
  get_match_is_show_league (i, list)  {
    // 当前赛事
    const match = list[i]
    let is_show_league = false
    if (!match) return false
    if (i > 0) {
      // 上一个赛事对象
      const prev_match = list[i - 1]
      is_show_league = prev_match && match.custom_tid !== prev_match.custom_tid
    } else {
      is_show_league = true
    }
    // 显示开赛、未开赛 一定显示联赛标题
    if ([1,2].includes(+match.start_flag)) is_show_league = true
    return is_show_league
  }

  // 是否显示 卡片 下边 圆角
  get_is_show_border_radius (i, list)  {
    // 当前赛事
    const match = list[i]
    const next_match = list[i + 1]
    if (!next_match) return true
    return match?.custom_tid !== next_match?.custom_tid
  }

  // 生成新的 联赛 归类 id
  generate_match_classify_tid (list) {
    const league_repeat_count_obj = {}
    list.forEach((t, i) => {
      league_repeat_count_obj[t.tid] = +league_repeat_count_obj[t.tid] || 0
      // 生成自定义联赛ID
      league_repeat_count_obj[t.tid]++
      const new_tid = `${t.tid}_${league_repeat_count_obj[t.tid]}`
      if (i === 0) return t.custom_tid = new_tid
      if (t.tid === list[i - 1].tid) {
        t.custom_tid = list[i - 1].custom_tid
      } else {
        t.custom_tid = new_tid
      }
    })
    return list
  }

  /**
	 * @description 获取比分 比分变化 或者 赛事阶段变化时调用
	 * @param  {object} match  当场赛事信息
	 */
	get_match_score(match) {
    if (!match) return {home_score: '0', away_score: '0'}
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
    if ([5].includes(+csid) && !MenuData.is_results()) {
      key = "S103";
    }
		// 主队比分
    let home_score = lodash.get(msc_obj, `${key}.home`, "0")
    // 客队比分
    let away_score = lodash.get(msc_obj, `${key}.away`, "0")
    return { home_score, away_score }
	}
  /**
   * @description 获取 开赛，未开赛 下的各球种数量
   * @param { String } key
   * @param { Array } list
   */
  get_match_total_by_csid (key, list) {
    // MatchResponsive.clear_ball_seed_count()
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
  get_match_15_minute_stage (ms, mst)  {
    const playingMethods_15 = use_playingMethods_15()
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
    const match_data = list.sort((a,b) => Number(a.csid) - Number(b.csid))
    const csid_obj = {}
    const result = []
    match_data.some(t => {
      const { csid } = t
      // if (![1, 2, 5].includes(+csid)) return
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
      } else if (csid != 1) {
        if (csid_obj[key] < 6) result.push(t)
      }
    })
    return result
  }
   /**
   * @description 获取最近一组15分玩法数据
   * @param {*} payload 正在比赛的数据
   */
  get_ouzhou_15_minute_data (payload) {
    return payload.map((item) => {
      const { ms, mst } = item
      const { title, isLock } = this.get_match_15_minute_stage(ms, mst)
      return {
        title,
        isLock,
        ...item,
        match_data_type: 'h5_ten_five_mins',
        icon: String(Number(item.csid) + 100)
      }
    })
  }
  /**
   * @description 时间戳 转 当前时间的 开始时间
   * @param {*} md 
   * @returns 
   */
  get_match_time_start_time (md) {
    // 创建Date对象并传入时间戳作为参数
    const time = new Date(Number(md));
    // 获取年份
    const year = time.getFullYear();
    // 获取月份
    const month = (time.getMonth() + 1).toString().padStart(2, '0');
    // 获取天数
    const day = time.getDate().toString().padStart(2, '0')
    // 当前时间
    const now_date = `${year}-${month}-${day}`
    const start_time = new Date(`${now_date} 00:00:00`).getTime();
    const end_time = new Date(`${year}-${month}-${day} 23:59:59`).getTime();
    return { start_time, end_time }
  }
  /**
   * @description 增加 estimateHeight； estimateHeight 关系 不大， 就算不对 后续会主动修复， estimateHeight 只作为辅助值， 辅助初始渲染，偏差没那么大
   * @param {*} match  赛事信息
   * @returns 
   */
  get_default_estimateHeight (match) {
    const { is_show_league = true } = match
    // 版本 1 简版   2  新版
    const standard_edition = UserCtr.standard_edition
    // 折叠对象
    const fold_data = MatchFold.match_mid_fold_obj.value
    // 赛事折叠信息
    const fold_key = MatchFold.get_match_fold_key(match)
    // 赛事是否显示
    const show_card = lodash.get(fold_data[fold_key], `show_card`, false)
    // 当前项目 默认配置
    const project_config = template_default_config[project_name] || template_default_config['app-h5']
    // 当前版本默认配置
    const standard_config = project_config[standard_edition] || project_config['2']
    let estimateHeight;
    if (is_show_league && show_card) {           // 显示联赛  显示卡片
      estimateHeight = standard_config['1']
    } else if (is_show_league && !show_card) {   // 显示卡片 不显示联赛
      estimateHeight = standard_config['2']
    } else if (!is_show_league && show_card)  {  // 显示联赛  不显示卡片
      estimateHeight = standard_config['3']
    } else {                                     // 默认
      estimateHeight = standard_config['default']
    }
    return estimateHeight
  }
  /**
   * @description 获取赛事红黄牌
   * @param {*} match 
   */
  get_match_red_yellow_card (match) {
    const { msc = [] } = match
    let home_red_score = ''
    let away_red_score = ''
    let home_yellow_score = ''
    let away_yellow_score = ''
    if (msc && msc.length > 0) {
      match.msc.forEach(score => {
        //红牌
        if (score.indexOf('S11|') > -1) {
          let score2 = score.split('S11|')[1];
          home_red_score = score2.split(':')[0] * 1;
          away_red_score = score2.split(':')[1] * 1;
        }
        //黄牌
        if (score.indexOf('S12|') > -1) {
          let score2 = score.split('S12|')[1];
          home_yellow_score = score2.split(':')[0] * 1;
          away_yellow_score = score2.split(':')[1] * 1;
        }
      });
    }
    return { home_red_score, away_red_score, home_yellow_score, away_yellow_score }
  }
  /**
   * @description: 获取赛事的让球方
   * @param {Object} match
   * @return {Number} 0未找到让球方 1主队为让球方 2客队为让球方
   */
  get_handicap_index_by (match) {
    let result = 0;
    if (match && match.hps) {
      let hpid = this.get_handicap_w_id(match.csid);
      let hp_item = match.hps.filter((item) => item.hpid == hpid)[0];
      if (hp_item) {
        let hl_item = hp_item.hl[0];

        // 网球csid 5  让盘hpid 154
        if (!hl_item || !hl_item.ol) {
          if (match.csid == 5) {
            hp_item = match.hps.filter((item) => item.hpid == 154)[0];
            if (hp_item) {
              hl_item = hp_item.hl[0];
            }
          }
        }

        if (hl_item && hl_item.ol) {
          let found_i = 0;
          hl_item.ol.forEach((ol_item, i) => {
            if (ol_item.on) {
              let on_str = String(ol_item.on);
              if (on_str[0] == "-") {
                found_i = i + 1;
              }
            }
          });
          result = found_i;
        }
      }
    }
    return result;
  }
  /**
   * 根据体育类型的csid获取赛事的让球玩法id
   * @param {Number} csid 体育类型id
   */
  get_handicap_w_id(csid){
    const sport_id = csid * 1;
    let sport_id_convert = 4;
    switch(sport_id){
      // 网球
      case 5:
        sport_id_convert = 154  //让盘154 让局155
        break;
      // 羽毛球
      case 10:
        sport_id_convert = 172
        break;
      // 乒乓球
      case 8:
        sport_id_convert = 172
        break;
      // 斯诺克
      case 7:
        sport_id_convert = 181
        break;
      // 篮球
      case 2:
        sport_id_convert = 39
        break;
      // 足球
      case 1:
        sport_id_convert = 4;
        break;
      // 3、4、6、9棒冰美排
      case 3:  //棒
        sport_id_convert = 243
        break;
      case 4:  //冰
        sport_id_convert = 4;
        break;
      case 6:  //美
        sport_id_convert = 39
        break;
      case 9: //排
        sport_id_convert = 172
        break;
      default:
        sport_id_convert = 4;
        break;
    }
    return sport_id_convert;
  }
}

export default new MatchUtils()