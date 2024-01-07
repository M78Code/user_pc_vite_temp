/**
 * 赛事数据处理过滤/获取
*/


import { get_match_status } from 'src/output/module/constant-utils.js'
import { time_conversion } from 'src/output/module/constant-utils.js'
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/output/module/match-data-base.js";
import { get_compute_other_play_data, get_play_current_play, get_tab_play_keys } from 'src/core/match-list-pc/composables/match-list-other.js'
import { match_state_convert_score_dict, history_score_dict } from 'src/core/constant/project/module/data-class-ctr/score-keys.js'
import { get_match_template_id } from './list-template/match-list-tpl'
import { get_21_bold_template, get_template_data, switch_other_play, set_min15 } from './composables/match-list-other'
import { has_cur_handicap_tpl_ids } from 'src/core/constant/project/module/data-class-ctr/play-tpl-id.js'
import { MenuData } from 'src/output';
export * from './list-template/match-list-tpl'

window.MatchListData = MatchListData
/**
 * 设置到数据仓库缓存
 * @param {*} mid 
 * @param {*} MatchListData 
 * @returns [match,{set}]
 */
export function set_match(mid, val = {}) {
    MatchListData.cache_match[mid] = MatchListData.cache_match[mid] || {}
    Object.assign(MatchListData.cache_match[mid], val)
}
/**
 * 获取处理后的赛事
 * @param {*} mid 
 * @param {*} MatchListData 
 * @returns 
 */
export function get_match(mid, MatchListData) {
    const _match = MatchListData.get_quick_mid_obj(lodash.get(mid, 'mid', mid));
    return {
        ..._match,
        ...(MatchListData.cache_match[mid] || {})
    };
}
/**
 * 给赛事对象添加额外属性
 * tpl_id
 * api_update_time
 */
export function match_list_handle_set(match_list) {
    if (Object.prototype.toString.call(match_list) == '[object Array]') {
        const date_now = Date.now();
        match_list.forEach(match => {
            match.tpl_id = get_match_template_id(match);
            match.api_update_time = date_now;
            match.tab_play_keys = get_tab_play_keys(match)
            match.qi = match.tab_play_keys && String(match.tab_play_keys).split(',').length > 0; // 该值设置取决于match.tab_play_keys字段,可以删除
            match.play_current_key = get_play_current_play(match)
            match.other_handicap_list = get_compute_other_play_data(match);
            const ass = compute_match_all_handicap_data(match)
            Object.assign(match, {
                tpl_id: match.tpl_id,
                hSpecial: match.hSpecial,
                hSpecial5min: match.hSpecial5min,
            }, ass)
            set_match(match.mid, {
                tpl_id: match.tpl_id,
                hSpecial: match.hSpecial,
                hSpecial5min: match.hSpecial5min
                , ...ass
            })
        })

    }
}

/**
 * 判断才是是否结束
 * @param {*} match 
 * @param {*} callback 
 */
export const check_match_end = (match, callback) => {
    if (match?.mmp == 999) {
        // 移除赛事
        callback(match);
    }
    // 赛事状态ms  0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断 110 即将开赛
    else if (![0, 1, 2, 7, 10, 110].includes(+match?.ms) && !match.ms) {
        // 移除赛事
        callback(match);
    }
}
/**
     * @description 获取总比分
     * @param  {object} match  当场赛事信息
     * @return {[主,客]} [主，客]
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
   * @description 获取历史比分列表
   * @param  {object} match  当场赛事信息
 * @param {*} match 
 * @returns  [历史比分，总分，当前分]
 */
export function get_history_score_list(match) {
    let csid = Number(match.csid)
    // 比分列表
    let score_list = [];
    // 需显示的比分集
    let score_dict = history_score_dict[`csid_${csid}`] || [];
    // 篮球半场
    if (csid == 2 && match.mle == 17) {
        score_dict = history_score_dict.csid_2_half
    }

    // 赛事阶段对应的 比分 key
    let cur_score_key = lodash.get(match_state_convert_score_dict, `csid_${csid}.mmp_${match.mmp}`)
    // 斯诺克根据第几局获取比分key
    if (csid == 7) {
        cur_score_key = lodash.get(match_state_convert_score_dict, `csid_${csid}.${match.mct}`)
    }
    // 主队总分
    let total_home = 0
    // 客队总分
    let total_away = 0

    // 是否有S120 比分
    let has_s120 = false
    // 是否有S121 比分
    let has_s121 = false
    // 遍历需显示比分集
    score_dict.forEach(key => {
        let cur_score = match.msc_obj[key]
        // 接口有返回对应比分
        if (cur_score) {
            if (key == 'S120') {
                has_s120 = true
            } else if (key == 'S121') {
                has_s121 = true
            }
            score_list.push(cur_score)
            // 总分累加
            total_home += Number(cur_score.home)
            total_away += Number(cur_score.away)

        } else if (key == cur_score_key) {
            if (key == 'S120') {
                has_s120 = true
            } else if (key == 'S121') {
                has_s121 = true
            }
            // 当前局服务器没有返回默认为 0-0
            score_list.push({
                home: 0,
                away: 0
            })
        }
    })

    // 如果是排球 并且有第二局比分  并且没有第一局比分 则给第一局比分设置空比分
    if (match.csid == 9 && has_s121 && !has_s120) {
        score_list.unshift({
            home: '',
            away: ''
        })
    }
    let cur_score;
    // 设置当前局比分
    //篮球有半场玩法第二节设置上半场比分未当前局比分
    if (match.csid == 2 && match.mmp == 14 && match.up_half_text) {
        cur_score = lodash.get(match, 'score_obj.S2', { home: '', away: '' })
    } else {
        cur_score = lodash.last(score_list) || { home: 0, away: 0 }
    }
    return [score_list, `${total_home}-${total_away}(${total_home + total_away})`, cur_score]
}

/**
   * @description: 获取将赛事详情非坑位对象,以便提高操作速度和效率
   * @param {String} mid 赛事对象
   * @param {Array} key_arr 需要获取的值key ["hpsBold","hpsOvertime"]等
   * @return {undefined} undefined
   */
export function get_match_to_map_obj(match, key_arr, type = 1) {
    let map_obj = {}
    // const match=MatchListData.get_quick_mid_obj(mid)
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
                if (!hps_data_arr || !Array.isArray(hps_data_arr)) {
                    return
                }
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
                                    item2.hsw = lodash.get(match, `play_obj.hpid_${item2.hpid}.hsw`);
                                }
                                // 检查是否有盘口数据
                                if (lodash.get(item2, 'hl.length')) {
                                    // 遍历盘口数据
                                    item2.hl.forEach(item3 => {
                                        if (item3 && !item3.hn) {
                                            if (item3.hid) {
                                                // 增加玩法信息到盘口级别
                                                item3.mid = match.mid;
                                                item3.hpid = item2.hpid;
                                                item3.hsw = item2.hsw;
                                            }
                                            if (lodash.get(item3, 'ol.length')) {
                                                // 遍历投注项数据
                                                item3.ol.forEach(item4 => {
                                                    // 处理ot是小数的情况,进行数据修正
                                                    if (!item4) return;
                                                    let ot = '';
                                                    if (item4.ot && item4.ot.includes('.')) {
                                                        ot = item4.ot.replace('.', '-');
                                                    } else {
                                                        ot = item4.ot;
                                                    }
                                                    // 设置坑位信息
                                                    let _hn = `${match.mid}_${item2.hpid}_${type}_${ot}`;
                                                    // 押注项设置盘口状态
                                                    Object.assign(item4, {
                                                        _hpid: item2.hpid,
                                                        _hs: (item3.hs ? item3.hs : 0),
                                                        _mhs: (match.mhs ? match.mhs : 0),
                                                        _mid: match.mid,
                                                        _hid: item3.hid,
                                                        _hn,
                                                        _hsw: item2.hsw,
                                                        _hipo: item3.hipo,
                                                        os: Object.hasOwnProperty.call(item4, 'os') ? item4.os : 1,
                                                    });
                                                    // 快速查询对象hn_obj增加数据
                                                    map_obj[MatchListData.get_list_to_obj_key(match.mid, _hn, 'hn')] = item4;
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
                                    item2.hsw = lodash.get(match, `play_obj.hpid_${item2.hpid}.hsw`);
                                }
                                // 检查是否有盘口数据
                                if (lodash.get(item2, 'hl.ol.length')) {
                                    // if(item2.hl.ol.forEach(item3 => {
                                    if (lodash.get(item2, 'hl')) {
                                        let item3 = item2.hl;
                                        if (item3 && !item3.hn) {
                                            if (item3.hid) {
                                                // 增加玩法信息到盘口级别
                                                item3.mid = match.mid;
                                                item3.hpid = item2.hpid;
                                                item3.hsw = item2.hsw;
                                            }
                                            if (lodash.get(item3, 'ol.length')) {
                                                // 遍历投注项数据
                                                item3.ol.forEach(item4 => {
                                                    if (!item4) return;
                                                    // 处理ot是小数的情况,进行数据修正
                                                    let ot = '';
                                                    if (item4.ot && item4.ot.includes('.')) {
                                                        ot = item4.ot.replace('.', '-');
                                                    } else {
                                                        ot = item4.ot;
                                                    }
                                                    // 设置非坑位信息
                                                    let _hn = `${match.mid}_${item2.hpid}_1_${ot}`;
                                                    // 押注项设置盘口状态
                                                    Object.assign(item4, {
                                                        _hpid: item2.hpid,
                                                        _hs: (item3.hs ? item3.hs : 0),
                                                        _mhs: (match.mhs ? match.mhs : 0),
                                                        _mid: match.mid,
                                                        _hid: item3.hid,
                                                        _hn,
                                                        _hsw: item2.hsw,
                                                        _hipo: item3.hipo,
                                                        os: Object.hasOwnProperty.call(item4, 'os') ? item4.os : 1,
                                                    });
                                                    // 快速查询对象hn_obj增加数据
                                                    map_obj[MatchListData.get_list_to_obj_key(match.mid, _hn, 'hn')] = item4;
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
/**
* @description: 获取赛事的让球方
* @param {Object} match
* @return {Number} 0未找到让球方 1主队为让球方 2客队为让球方
*/
export function get_handicap_index_by(match) {
    let result = 0;
    if (match) {
        let hpid = get_handicap_w_id(match.csid);
        const hps = lodash.get(match, 'hps') || lodash.get(match, 'hpsData[0].hps', [])
        let hp_item = hps.find((item) => item.hpid == hpid);
        if (hp_item) {
            let hl_item = lodash.get(hp_item, 'hl[0]') || lodash.get(hp_item, 'hl');

            // 网球csid 5  让盘hpid 154
            if (!hl_item || !hl_item.ol) {
                if (match.csid == 5) {
                    hp_item = hps.filter((item) => item.hpid == 154)[0];
                    if (hp_item) {
                        hl_item = lodash.get(hp_item, 'hl[0]') || lodash.get(hp_item, 'hl')
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
export function get_handicap_w_id(csid) {
    const sport_id = csid * 1;
    let sport_id_convert = 4;
    switch (sport_id) {
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



/**
* @description 获取比分 比分变化 或者 赛事阶段变化时调用
* @param  {object} match  当场赛事信息
*/
export const get_match_score = (match) => {
    if (!match) return { home_score: '0', away_score: '0' }
    let key = "S1";
    let { csid, mmp, msc_obj } = match;
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
* @description 搜索结果，获取比分
* @param  {object} match  当场赛事信息
*/
export const get_match_score_result = (match) => {
    if (!match) return { home_score: '0', away_score: '0' }
    let msc_obj = {}
    match.msc.forEach(item => {
        let format = item.split("|");
        msc_obj[format[0]] = {
            home: format[1].split(":")[0],
            away: format[1].split(":")[1],
        };
    })
    let key = "S1";
    let { csid, mmp } = match;
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
   * @Description 克隆数组
   * @param {array} arr 需要克隆的数值
   */
const clone_arr = (arr) => {
    let new_arr = [];
    lodash.merge(new_arr, arr || []);
    return new_arr;
}
/**
   * @Description 计算赛事所有盘口数据
   * @param {undefined} undefined
  */
export function compute_match_all_handicap_data(match) {
    let match_assign = {}
    let { tpl_id, csid, mmp } = match
    // 模板玩法配置
    let play_config = lodash.get(MATCH_LIST_TEMPLATE_CONFIG, `template_${tpl_id}_config.template_${tpl_id}`, {});
    // 是否角球菜单
    let is_corner_menu = MenuData.is_corner_menu()
    //盘口类型
    let type = 1
    // 主盘口列表
    let main_handicap_list = clone_arr(play_config.main_handicap_list)
    // 角球主盘口列表
    if (tpl_id == 1 && is_corner_menu) {
        main_handicap_list = clone_arr(play_config.hpsCorner)
    }
    // 足球 加时赛阶段主盘口列表  mmp：即将加时(32)、加时休息(33)、加时上半场(41)、加时下半场(42)
    else if (tpl_id == 1 && [32, 33, 41, 42].includes(+mmp)) {
        main_handicap_list = clone_arr(play_config.hpsOvertime)
    }
    // 美足 主盘口列表
    else if (tpl_id == 1 && csid == 6) {
        main_handicap_list = clone_arr(play_config.main_handicap_list_6)
    }
    // 网球准确局数 | 排球准确局数 | 羽毛球准确局数 根据赛制获取主盘列表
    else if (tpl_id == 10) {
        // 赛制 3局或5局
        let mft = match.mft == 3 ? 3 : 5
        if ([5, 9].includes(+csid)) {
            main_handicap_list = clone_arr(lodash.get(play_config, `template_${tpl_id}.main_handicap_list_5_${mft}`))
        } else {
            main_handicap_list = clone_arr(lodash.get(play_config, `template_${tpl_id}.main_handicap_list_${csid}_${mft}`))
        }
    }
    // 兵乓球准确局数  根据赛制获取主盘列表
    else if (tpl_id == 15) {
        // 赛制 3局或5局
        let mft = match.mft == 5 ? 5 : 7
        main_handicap_list = clone_arr(play_config[`main_handicap_list_${mft}`])
    }
    // 斯诺克让球与大小主盘列表
    else if (tpl_id == 11 && csid == 7) {
        main_handicap_list = clone_arr(play_config.main_handicap_list_7)
    }
    // 美足总分单双
    else if (tpl_id == 3 && csid == 6) {
        main_handicap_list = clone_arr(play_config.main_handicap_list_6)
    }
    //虚拟泥地摩托车
    else if (tpl_id == 1002 && csid == 1009) {
        main_handicap_list = clone_arr(play_config.main_handicap_list_1009)
    }
    // 足球比分
    else if (tpl_id == 21 && csid == 1) {
        main_handicap_list = get_21_bold_template(match)
    }
    //  15分钟主盘口列表
    else if (tpl_id == 24 && csid == 1) {
        main_handicap_list = clone_arr(MATCH_LIST_TEMPLATE_CONFIG.template_1_config.template_1.hps15Minutes)
        type = 4
        Object.assign(match_assign, set_min15(match, match.mst))
    }
    //  罚牌主盘口列表
    else if (tpl_id == 29 && csid == 1) {
        main_handicap_list = clone_arr(MATCH_LIST_TEMPLATE_CONFIG.template_1_config.template_1.hpsPunish)
    }
    Object.assign(match_assign, {
        main_handicap_list: get_template_data({ match, handicap_list: main_handicap_list, type })
    })
    //足球 让球与大小 模板
    if (csid == 1 && [1, 13].includes(+tpl_id) && !is_corner_menu) {
        // 计算角球、罚牌等其他玩法数据
        Object.assign(match_assign, {
            other_handicap_list: get_compute_other_play_data(match)
        })
        // 设置赛事附加盘盘口数据
        Object.assign(match_assign, get_match_add_handicap_data(match))
    }
    // 篮球让球与大小
    if (tpl_id == 7) {
        // 设置赛事附加盘盘口数据
        Object.assign(match_assign, get_match_add_handicap_data(match))
    }
    // 有当前局玩法的模板  设置当前局盘口数据   沙滩排球13没有当前局
    if (has_cur_handicap_tpl_ids.includes(+tpl_id) && csid != 13) {
        // 设置赛事当前局盘口数据
        Object.assign(match_assign, get_match_cur_handicap_data(match))
    }
    return match_assign
}
/**
   * @Description 设置赛事附加盘盘口数据(获取模板数据，并与接口数据合并)
   * @param {undefined} undefined
  */
function get_match_add_handicap_data(match) {
    const { tpl_id } = match
    // 附加盘1盘口列表
    let add1_handicap_list = clone_arr(lodash.get(MATCH_LIST_TEMPLATE_CONFIG, `template_${tpl_id}_config.template_${tpl_id}.add_handicap_list`, []))
    // 附加盘2盘口列表
    let add2_handicap_list = clone_arr(lodash.get(MATCH_LIST_TEMPLATE_CONFIG, `template_${tpl_id}_config.template_${tpl_id}.add_handicap_list`, []))
    add1_handicap_list = get_template_data({ match, handicap_list: add1_handicap_list, type: 2 })
    add2_handicap_list = get_template_data({ match, handicap_list: add2_handicap_list, type: 3 })
    return { add1_handicap_list, add2_handicap_list }
}
/**
   * @Description 获取当前局盘口列表模板
   * @param {undefined} undefined
  */
function get_cur_handicap_list(match, play_config) {
    // 当前局盘口列表
    let cur_handicap_list = []
    // 篮球根据赛事阶段获取当前局盘口列表
    // play_config = play_config[`template_${match.tpl_id}`]
    if (match.tpl_id == 7) {
        switch (+match.mmp) {
            case 1: //上半场
                cur_handicap_list = clone_arr(play_config.cur_handicap_list_up)
                break;
            case 31: //中场休息
            case 2: //下半场
                cur_handicap_list = clone_arr(play_config.cur_handicap_list_down)
                break;
            case 13: //第一节
                cur_handicap_list = clone_arr(play_config.cur_handicap_list_1)
                break;
            case 301: //第一节休息
                cur_handicap_list = clone_arr(play_config.cur_handicap_list_1_rest)
                break
            case 14: //第二节
                cur_handicap_list = clone_arr(play_config.cur_handicap_list_2)
                break;
            case 302: //第二节休息
            case 15: //第三节
                cur_handicap_list = clone_arr(play_config.cur_handicap_list_3)
                break;
            case 303: //第三节休息
            case 16: //第四节
                cur_handicap_list = clone_arr(play_config.cur_handicap_list_4)
                break;
            default:
                cur_handicap_list = clone_arr(play_config.cur_handicap_list)
                break
        }
    }
    // 斯诺克让球与大小当前局盘口列表
    else if (match.tpl_id == 11 && match.csid == 7) {
        cur_handicap_list = clone_arr(play_config.cur_handicap_list_7)
    }
    // 排球让球与大小当前局盘口列表
    else if (match.tpl_id == 11 && match.csid == 9) {
        cur_handicap_list = clone_arr(play_config.cur_handicap_list_9)
    }
    // 判断模板是否有当前局玩法
    else if (has_cur_handicap_tpl_ids.includes(+match.tpl_id)) {
        cur_handicap_list = clone_arr(play_config.cur_handicap_list)
    }
    return cur_handicap_list
}
/**
  * @Description 设置赛事当前局盘口数据
  * @param {boolean} is_ws_call 是否ws调用
  * @param {undefined} undefined
 */
function get_match_cur_handicap_data(match, is_ws_call) {
    // 模板玩法配置
    let play_config = MATCH_LIST_TEMPLATE_CONFIG[`template_${match.tpl_id}_config`][`template_${match.tpl_id}`] || {}
    // 当前局盘口列表
    let cur_handicap_list = get_cur_handicap_list(match, play_config)
    cur_handicap_list = get_template_data({ match, handicap_list: cur_handicap_list, type: 1 })
    // 是否ws调用
    if (is_ws_call) {
        lodash.merge(match.cur_handicap_list, cur_handicap_list)
    } else {
        match.cur_handicap_list = cur_handicap_list
    }
    // 设置是否显示当前局玩法
    return {
        cur_handicap_list: match.cur_handicap_list,
        is_show_cur_handicap: get_is_show_cur_handicap(match)
    }
}
/**
 * @Description 计算赛事所有盘口数据--冠军玩法
 * @param {undefined} undefined
*/
export function compute_match_all_handicap_data_champion(match) {
    // 主盘口列表
    let main_handicap_list = [];
    // 遍历主盘口数据
    lodash.each(match.hpsData, (hpsData) => {
        lodash.each(hpsData.hps, (item) => {
            let hl_obj = lodash.get(item, "hl", {});
            if (hl_obj.hid) {
                hl_obj.end_time = time_conversion(hl_obj.hmed);
                hl_obj.hpn = match.hpsPns.find(option => option.hid == hl_obj.hid)?.hpn
                main_handicap_list.push(hl_obj);
            }
        });
    });
    return main_handicap_list;
}
/**
 * 获取是否显示当全局盘口
 * @param {*} match 
 */
export function get_is_show_cur_handicap(match) {
    return match.tpl_id == 7 ? get_basketball_is_show_cur_handicap(match) : get_match_status(match.ms, [110]) == 1
}
/**
   * @Description 获取篮球是否显示当前局盘口
   * @param {undefined} undefined
  */
function get_basketball_is_show_cur_handicap(match) {
    if (get_match_status(match.ms, [110]) == 0) {
        return false
    }
    let is_show_cur_handicap = false
    let mmp = match.mmp
    // 篮球第四节(16|100) || 篮球 3*3 不显示当前局
    if (mmp == 16 || mmp == 100 || match.mle == 73) {
        is_show_cur_handicap = false
    }
    // 篮球第二节 需要判断 当前局盘口是否关闭
    else if (mmp == 14) {
        match.cur_handicap_list?.forEach(col => {
            col.ols.forEach(ol => {
                // 非投注项关盘
                if (ol.oid && ol._hs != 2 && ol.os != 3) {
                    // match.up_half_text = '-'+window.vue.$root.$t('common.up_half')
                    is_show_cur_handicap = true
                }
            })
        })
    } else {
        //第一节        刚开赛
        //   if(mmp ==13 || mmp ==0 ){
        //     match.up_half_text = '-'+window.vue.$root.$t('mmp.2.13')
        //   }
        //   //第三节   第二节休息
        //   if(mmp ==15 || mmp == 302){
        //     match.up_half_text = '-'+window.vue.$root.$t('mmp.2.15')
        //   }
        is_show_cur_handicap = true
    }
    return is_show_cur_handicap
}


