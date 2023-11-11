/**
 * 赛事数据处理过滤/获取
*/


import { csid_to_tpl_id } from 'src/core/constant/util/csid-util.js'
import { MenuData, get_match_status, PageSourceData } from 'src/core/index.js'
import BaseData from "src/core/base-data/base-data.js";

/**
   * @Description  根据菜单ID 获取一个菜单对象
   * @param {number} menu_id 菜单ID
   * @param {undefined} undefined
  */
function get_menu_obj_by_menu_id(menu_id) {
    return BaseData.get_menu_list(menu_id) || { count: 0, subList: [], topMenuList: [] }
}
/**
   * @Description 获取当前列表模板编号  
   * @param {undefined} undefined
  */
function get_match_tpl_number(is_hot) {
    const { left_menu_result = {}, mid_menu_result = {} } = MenuData;
    let match_tpl_number = -1
    // 玩法菜单
    let play_menu = get_menu_obj_by_menu_id(lodash.get(left_menu_result,"lv1_mi"))
    // 详情页热门赛事 或者 搜索 或者列表强力推荐
    if (PageSourceData.route_name == 'details' || PageSourceData.route_name == 'search' || is_hot) {
        match_tpl_number = -1
        //搜索13列玩法
        //&& store.getters.get_unfold_multi_column
        if (lodash.get(vue, '$route.query.csid', -1) === '1' && MenuData.is_multi_column) {
            match_tpl_number = 13
        }
    }
    // 竟足赛事 12模板
    else if (mid_menu_result.mi == 30101) {
        match_tpl_number = 12
    }
    // 冠军聚合页  或者电竞冠军 18模板 
    else if (MenuData.is_kemp() || MenuData.is_esports_champion()) {
        match_tpl_number = 18
    }
    // 电竞常规赛事
    else if (MenuData.is_export()) {
        match_tpl_number = 'esports'
    }
    //13列玩法菜单 && store.getters.get_unfold_multi_column
    else if (MenuData.is_multi_column && PageSourceData.page_source == 'home') {
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
    let tpl_id = get_match_tpl_number()
    console.log(tpl_id, 'get_match_tpl_number')

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
    console.log(tpl_id, 'get_match_tpl_number1')
    return tpl_id
}


/**
     * @description 获取总比分
     * @param  {object} match  当场赛事信息
     * @return {[主,客]]} [主，客]
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


/**
   * @description: 获取将赛事详情非坑位对象,以便提高操作速度和效率
   * @param {String} mid 赛事对象
   * @param {Array} key_arr 需要获取的值key ["hpsBold","hpsOvertime"]等
   * @return {undefined} undefined
   */
export function get_match_to_map_obj(match, key_arr) {
    let map_obj = {}
    if (lodash.get(match, 'mid')) {
        try {
            // 需要解析的投注项赛事基础数据的路径
            const hps_key_arr = key_arr ? key_arr :
                ['hps', 'hpsAdd', 'hpsData[0].hps', 'hpsData[0].hpsAdd', "hpsBold", "hpsOvertime", "hps15Minutes", "hps5Minutes", "hpsCorner", "hpsPunish", "hpsPenalty", "hpsPromotion", "hpsOutright", "odds_info"];
            // 角球开关----------------------hpsCorner
            // 罚牌开关----------------------hpsPunish
            // 冠军开关----------------------hpsOutright
            // 晋级赛开关--------------------hpsPromotion
            // 加时赛开关--------------------hpsOvertime
            // 点球大战开关------------------hpsPenalty
            // 15分钟开关--------------------hps15Minutes
            // 5分钟开关 ----------------------hps5Minutes                              
            // 波胆开关-----------------------hpsBold
            // 主盘口------------------------hps
            // 副盘口------------------------hpsAdd
            // 赛事详情,所有投注数据----------odds_info
            // 投注项赛事列表数据
            let hps_data_arr = null
            hps_key_arr.forEach(hps_key_str => {
                // 设置投注项赛事列表数据
                hps_data_arr = lodash.get(match, hps_key_str)
                switch (hps_key_str) {
                    // 主玩副盘口数据时
                    case 'hpsData[0].hpsAdd':
                    case 'hps':
                    case 'hpsAdd':
                    // 赛事详情所有玩法数据时
                    case 'odds_info':
                        if (lodash.get(hps_data_arr, 'length') && Array.isArray(hps_data_arr)) {
                            // 遍历玩法数据
                            hps_data_arr.forEach(item2 => {
                                if (!lodash.get(item2, 'hsw')) {
                                    item2.hsw = lodash.get(item, `play_obj.hpid_${item2.hpid}.hsw`);
                                }
                                // 检查是否有盘口数据
                                if (lodash.get(item2, 'hl.length')) {
                                    // 遍历盘口数据
                                    item2.hl.forEach(item3 => {
                                        if (item3) {
                                            if (item3.hid) {
                                                // 增加玩法信息到盘口级别
                                                item3.mid = item.mid;
                                                item3.hpid = item2.hpid;
                                                item3.hsw = item2.hsw;
                                            }
                                            if (lodash.get(item3, 'ol.length')) {
                                                // 遍历投注项数据
                                                item3.ol.forEach(item4 => {
                                                    // 处理ot是小数的情况,进行数据修正
                                                    let ot = '';
                                                    if (item4.ot && item4.ot.includes('.')) {
                                                        ot = item4.ot.replace('.', '-');
                                                    } else {
                                                        ot = item4.ot;
                                                    }
                                                    // 设置坑位信息
                                                    if (!item3.hn) {
                                                        let _hn = `${item.mid}_${item2.hpid}_1_${ot}`;
                                                        // 押注项设置盘口状态
                                                        Object.assign(item4, {
                                                            _hpid: item2.hpid,
                                                            _hs: (item3.hs ? item3.hs : 0),
                                                            _mhs: (item.mhs ? item.mhs : 0),
                                                            _mid: item.mid,
                                                            _hid: item3.hid,
                                                            _hn,
                                                            _hsw: item2.hsw,
                                                            _hipo: item3.hipo,
                                                            os: Object.hasOwnProperty.call(item4, 'os') ? item4.os : 1,
                                                        });
                                                        // 快速查询对象hn_obj增加数据
                                                        map_obj[this.get_list_to_obj_key(item.mid, _hn, 'hn')] = item4;
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        break;
                    default:
                        if (lodash.get(hps_data_arr, 'length') && Array.isArray(hps_data_arr)) {
                            // 遍历玩法数据
                            hps_data_arr.forEach(item2 => {
                                if (!lodash.get(item2, 'hsw')) {
                                    item2.hsw = lodash.get(item, `play_obj.hpid_${item2.hpid}.hsw`);
                                }
                                // 检查是否有盘口数据
                                if (lodash.get(item2, 'hl.ol.length')) {
                                    // if(item2.hl.ol.forEach(item3 => {
                                    if (lodash.get(item2, 'hl')) {
                                        let item3 = item2.hl;
                                        if (item3) {
                                            if (item3.hid) {
                                                // 增加玩法信息到盘口级别
                                                item3.mid = item.mid;
                                                item3.hpid = item2.hpid;
                                                item3.hsw = item2.hsw;
                                            }
                                            if (lodash.get(item3, 'ol.length')) {
                                                // 遍历投注项数据
                                                item3.ol.forEach(item4 => {
                                                    // 处理ot是小数的情况,进行数据修正
                                                    let ot = '';
                                                    if (item4.ot && item4.ot.includes('.')) {
                                                        ot = item4.ot.replace('.', '-');
                                                    } else {
                                                        ot = item4.ot;
                                                    }
                                                    // 设置非坑位信息
                                                    if (!item3.hn) {
                                                        let _hn = `${item.mid}_${item2.hpid}_1_${ot}`;
                                                        // 押注项设置盘口状态
                                                        Object.assign(item4, {
                                                            _hpid: item2.hpid,
                                                            _hs: (item3.hs ? item3.hs : 0),
                                                            _mhs: (item.mhs ? item.mhs : 0),
                                                            _mid: item.mid,
                                                            _hid: item3.hid,
                                                            _hn,
                                                            _hsw: item2.hsw,
                                                            _hipo: item3.hipo,
                                                            os: Object.hasOwnProperty.call(item4, 'os') ? item4.os : 1,
                                                        });
                                                        // 快速查询对象hn_obj增加数据
                                                        map_obj[this.get_list_to_obj_key(item.mid, _hn, 'hn')] = item4;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            });
                        }
                        break;
                }
            });
        } catch (error) {
            console.error('get_match_to_map_obj', error)
        }
    }
    return map_obj;
}

