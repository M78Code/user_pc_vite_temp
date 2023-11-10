/**
 * 赛事数据处理过滤
*/


import { csid_to_tpl_id } from 'src/core/constant/util/csid-util.js'
import { MenuData } from 'src/core/index.js'


/**
   * @Description 获取当前列表模板编号  
   * @param {undefined} undefined
  */
function get_match_tpl_number(is_hot) {
    let match_tpl_number = -1
    // 玩法菜单
    let play_menu = this.get_menu_obj_by_menu_id(this.menu_data.cur_level3_menu)
    // 详情页热门赛事 或者 搜索 或者列表强力推荐
    if (window.vue.$route.name == 'details' || window.vue.$route.name == 'search' || is_hot) {
        match_tpl_number = -1
        //搜索13列玩法
        if (lodash.get(vue, '$route.query.csid', -1) === '1' && this.menu_data.is_multi_column && store.getters.get_unfold_multi_column) {
            match_tpl_number = 13
        }
    }
    // 竟足赛事 12模板
    else if (this.menu_data.cur_level2_menu == 30101) {
        match_tpl_number = 12
    }
    // 冠军聚合页  或者电竞冠军 18模板 
    else if (this.menu_data.cur_level1_menu == 'winner_top' || this.menu_data.is_esports_champion) {
        match_tpl_number = 18
    }
    // 电竞常规赛事
    else if (this.menu_data.is_esports) {
        match_tpl_number = 'esports'

    }
    //13列玩法菜单
    else if (this.menu_data.is_multi_column && store.getters.get_unfold_multi_column && store.getters.get_layout_cur_page.cur == 'home') {
        match_tpl_number = 13
    }
    // 取玩法菜单
    else if (play_menu.field2 == 0 || play_menu.field2) {
        match_tpl_number = play_menu.field2
    }
    return match_tpl_number
}
/**
 * @Description 获取赛事模板ID
 * @param {number} csid 球种类型
*/
export function get_match_template_id({ csid }) {
    let tpl_id = get_match_tpl_number(menu_data)
    // 虚拟足球1001、虚拟篮球1004
    if ([1001, 1004].includes(+csid)) {
        tpl_id = csid
    }
    // 虚拟赛狗1002 虚拟摩托1010 虚拟赛马1011 泥地摩托车1009
    else if ([1002, 1010, 1011, 1009].includes(+csid)) {
        tpl_id = 1002
    }
    // 99模板根据球种获取模板ID
    else if (tpl_id == -1) {
        tpl_id = csid_to_tpl_id(csid)
    }
    return tpl_id
}


/**
     * @description 获取总比分
     * @param  {object} match  当场赛事信息
     * @return {undefined} undefined
     */
export function get_main_score(match) {
    let _home_score = ""
    let _away_score = ""
    if (get_match_status(match.ms)) {
        let key = "S1"
        _home_score = "0"
        _away_score = "0"
        // 足球 | 手球
        if ([1, 11].includes(Number(match.csid))) {
            // S7:加时赛比分
            if ([32, 33, 41, 42, 110].includes(Number(match.mmp))) {
                key = "S7"
            }
            // S170:点球大战比分
            else if ([34, 50, 120].includes(Number(match.mmp))) {
                key = "S170"
            }
        }
        let main_score = match.msc_obj[key]
        if (main_score) {
            _home_score = lodash.get(main_score, "home")
            _away_score = lodash.get(main_score, "away")
        }
    }
    return [_home_score, _away_score]
}