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

export * from './list-template/match-list-tpl'

/**
 * 设置到数据仓库缓存
 * @param {*} mid 
 * @param {*} MatchListData 
 * @returns [match,{set}]
 */
export function set_match(mid, val = {}) {
    const _match = MatchListData.get_quick_mid_obj(lodash.get(mid, 'mid', mid));
    MatchListData.cache_match[mid] = MatchListData.cache_match[mid] || {}
    Object.assign(MatchListData.cache_match[mid], val)
    return {
        ..._match,
        ...MatchListData.cache_match[mid]
    }
}
/**
 * 获取处理后的赛事
 * @param {*} mid 
 * @param {*} MatchListData 
 * @returns 
 */
export function get_match(mid, MatchListData) {
    const _match = MatchListData.get_quick_mid_obj(lodash.get(mid, 'mid', mid));
    MatchListData.cache_match[mid] = MatchListData.cache_match[mid] || {}
    Object.assign(_match, MatchListData.cache_match[mid])
    match_list_handle_set([_match]);
    return _match;
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
            match.has_other_play = match.tab_play_keys && String(match.tab_play_keys).split(',').length > 0; // 该值设置取决于match.tab_play_keys字段,可以删除
            match.play_current_key = get_play_current_play(match)
            match.other_handicap_list = get_compute_other_play_data(match);
        })
    }
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
    let { tpl_id, csid, mmp } = match
    // 模板玩法配置
    let play_config = MATCH_LIST_TEMPLATE_CONFIG[`template_${tpl_id}_config`] || {}
    // 是否角球菜单
    let is_corner_menu = false// $NewMenu.is_corner_menu()
    //盘口类型
    let type = 1
    // 主盘口列表
    let main_handicap_list = clone_arr(play_config.main_handicap_list)
    // 角球主盘口列表
    if (tpl_id == 0 && is_corner_menu) {
        main_handicap_list = clone_arr(play_config.hpsCorner)
    }
    // 足球 加时赛阶段主盘口列表  mmp：即将加时(32)、加时休息(33)、加时上半场(41)、加时下半场(42)
    else if (tpl_id == 0 && [32, 33, 41, 42].includes(+mmp)) {
        main_handicap_list = clone_arr(play_config.hpsOvertime)
    }
    // 美足 主盘口列表
    else if (tpl_id == 0 && csid == 6) {
        main_handicap_list = clone_arr(play_config.main_handicap_list_6)
    }
    // 网球准确局数 | 排球准确局数 | 羽毛球准确局数 根据赛制获取主盘列表
    else if (tpl_id == 10) {
        // 赛制 3局或5局
        let mft = match.mft == 3 ? 3 : 5
        if ([5, 9].includes(+csid)) {
            main_handicap_list = clone_arr(lodash.get(play_config,`template_${tpl_id}.main_handicap_list_5_${mft}`))
        } else {
            main_handicap_list = clone_arr(lodash.get(play_config,`template_${tpl_id}.main_handicap_list_${csid}_${mft}`))
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
        main_handicap_list = clone_arr(MATCH_LIST_TEMPLATE_CONFIG.template_1_config.hps15Minutes)
        type = 4
        set_min15(match, match.mst)
    }
    //  罚牌主盘口列表
    else if (tpl_id == 25 && csid == 1) {
        main_handicap_list = clone_arr(MATCH_LIST_TEMPLATE_CONFIG.template_1_config.hpsPunish)
    }
    // match.main_handicap_list = this.
    return get_template_data({ match, handicap_list: main_handicap_list, type })
    // 足球 让球与大小 模板
    // if (csid == 1 && [0, 13].includes(+tpl_id) && !is_corner_menu) {
    //     // 计算角球、罚牌等其他玩法数据
    //     this.compute_other_play_data(match)
    //     // 设置赛事附加盘盘口数据
    //     this.set_match_add_handicap_data(match)
    // }

    // // 篮球让球与大小
    // if (tpl_id == 7) {
    //     // 设置赛事附加盘盘口数据
    //     this.set_match_add_handicap_data(match)
    // }

    // // 有当前局玩法的模板  设置当前局盘口数据   沙滩排球13没有当前局
    // if (has_cur_handicap_tpl_ids.includes(+tpl_id) && csid != 13) {
    //     // 设置赛事当前局盘口数据
    //     this.set_match_cur_handicap_data(match)
    // }
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
  * @Description 简化盘口文本
  * @param {string} lang 语言
  * @param {string} onb 盘口文本
  * @return  {string} text 盘口文本
 */
export function disk_text_replace(lang, onb) {
    let text = ''
    if (onb) {
        switch (lang) {
            case 'en':
            case 'ad':
            case 'ms':
                text = onb.replace("Home", "H").replace("Away", "A").replace("Draw", "D")
                break;
            case 'vi':
                text = onb.replace("Chủ", "C").replace("Khách", "K").replace("Hòa", "H")
                break;
            case 'th':
                text = onb.replace("เจ้าบ้าน", "H").replace("แขก", "A").replace("วาด", "D")
                break;
            case 'zh':
            case 'tw':
                text = onb.replace("胜", "").replace("局", "").replace("勝", "")
                break;

            default:
                text = onb
                break;
        }
    }
    return text
}

/**
   * @Description 计算投注项数据
   * @param {Object} hl_data 盘口对象
   * @param {object} match 赛事对象
   * @param {number} handicap_type 盘口类型 1:主盘，  2：附加盘1， 3：附加盘2   (特殊 15分钟玩法是取阶段保存)
  */
export function compute_ol_data(hl_data, match, handicap_type) {
    // 遍历盘口 所有投注项
    _.each(hl_data.ol, ol => {
        // 投注项坑位值
        let hn = `${match.mid}_${hl_data.chpid}_${handicap_type}_${ol.ot}`
        // 投注项坑位旧值
        let old_hn = `${match.mid}_${hl_data._hpid}_${handicap_type}_${ol.ot}`
        // 赛事级开盘状态
        ol._mhs = match.mhs
        // 盘口级 开盘状态
        ol._hs = hl_data.hs
        // 盘口ID
        ol._hid = hl_data.hid
        // 玩法ID
        ol._hpid = hl_data._hpid
        // 是否支持串关 1:支持串关 0: 不支持串关
        ol._hipo = hl_data.hipo;
        // 赛事ID
        ol._mid = match.mid
        // 球种ID
        ol.csid = match.csid
        //内嵌简化盘口文本
        if (utils.is_iframe) {
            ol.onb = disk_text_replace(store.getters.get_lang, _.get(ol, 'onb', ''))
        }
        //简化盘口文本
        if (match.tpl_id == 22 && String(ol.onb).endsWith('.0')) {
            ol.onb = ol.onb.replace('.0', '')
        }
        // 简化盘口文本
        if (match.tpl_id == 13) {
            ol.onb = ol.onb.replace('Không có bàn thắng', '- 0 BT').replace('ไม่มีเป้าหมาย', 'ไม่ได้ประตู')
        }
        // 支持的盘口类型
        if (hl_data.hSpecial) {
            ol._hsw = _.get(match.play_obj, `hpid_${hl_data._hpid}_${hl_data.hSpecial}.hsw`, '')
        } else {
            ol._hsw = _.get(match.play_obj, `hpid_${hl_data._hpid}.hsw`, '')
        }


        // 盘口是否高亮
        ol.handicap_highlight = handicap_highlight_paly_id.includes(+hl_data._hpid)

        // 判断盘口是否有坑位  设置投注项坑位值
        if (hl_data.hn) {
            ol._hn = hn
        }
        match.all_ol_data[old_hn] = ol
        match.all_oid_arr.push(ol.oid)
    })
}


/**
   * @Description 计算单个盘口数据
   * @param {Object} match    赛事数据
   * @param {Object} hl_obj   盘口数据
   * @param {Array} all_hids 当前赛事所有玩法 id
   * @param {Object} all_hl_obj  当前赛事所有盘口数据
   * @param {Number} hl_index  附加盘
  */
export function compute_hl_obj_data({ match, hl_obj, all_hids, all_hl_obj, hl_index }) {
    let { hl, hSpecial, hpid, chpid, hl: { hid } } = hl_obj
    if ([7, 20, 74, 341, 342].includes(+hpid) && _.get(hl_obj, 'hl.hs', 2) != 2) {
        match.tpl_21_hpids += hpid + ','
    }
    if (hid) {
        let handle_type = 1
        if (hSpecial) {
            hl.hSpecial = hSpecial
            handle_type = Number(hSpecial)
        }
        if (hl_index) {
            handle_type = hl_index
        }
        // 添加盘口ID
        all_hids.push(hid)
        // 玩法ID
        hl._hpid = hpid
        // 玩法唯一标识
        hl.chpid = chpid || hpid
        // 赛事级别盘口状态
        hl._mhs = match.mhs
        all_hl_obj['hid_' + hid] = hl
        // 计算投注项数据
        compute_ol_data(hl, match, handle_type)
    }
}

/**
 * @Description 计算玩法数据
 * @param {object} match 赛事对象
*/
export function compute_play_data(match) {
    // 玩法对象临时变量
    let play_obj = {}
    // 遍历所有玩法
    _.each(match.hpsPns, hps => {
        if (match.tpl_id == 18) {
            hps.hsw = '1,3,4,5,6'
            // 冠军用盘口ID保存玩法数据
            play_obj['hid_' + hps.hid] = hps

        } else if (hps.hSpecial) {
            // 15分钟玩法用玩法ID+阶段保存玩法数据
            play_obj[`hpid_${hps.hpid}_${hps.hSpecial}`] = hps
        } else {
            // 非冠军用玩法ID保存玩法数据
            play_obj['hpid_' + hps.hpid] = hps
        }
    })
    match.play_obj = play_obj
}

/**
 * @Description 设置赛事所有盘口数据
 * @param {undefined} undefined
*/
export function set_match_all_handicap_data(match) {
    let all_hl_obj = {}
    let all_hids = []
    // 计算玩法数据
    compute_play_data(match)
    if ([21, 0, 13].includes(+match.tpl_id)) {
        match.tpl_21_hpids = ""
    }
    // 所有投注项ID列表
    match.all_oid_arr = []
    match.all_ol_data = {}
    // 遍历主盘口数据
    _.each(match.hpsData, hpsData => {
        _.each(hpsData.hps, hl_obj => {
            compute_hl_obj_data({ match, hl_obj, all_hids, all_hl_obj })
        })
    })
    // 遍历附加盘数据
    let add_hps = _.get(match, 'hpsData[0].hpsAdd', [])
    add_hps.forEach(item => {
        // 遍历附加盘盘口
        let { hl: hls_arr = [], hpid, chpid } = item
        hls_arr.forEach((hl, hl_index) => {
            compute_hl_obj_data({ match, hl_obj: { hl, hpid, chpid }, all_hids, all_hl_obj, hl_index: hl_index + 2 })
        })
    })

    // 足球让球与大小玩法 遍历其他玩法数据
    if (match.csid == 1 && [0, 13].includes(+match.tpl_id)) {
        _.each(Object.keys(other_play_name_to_playid), key => {
            _.each(match[key], hl_obj => {
                compute_hl_obj_data({ match, hl_obj, all_hids, all_hl_obj })
            })
        })
    }

    // _.merge(this.hl_obj,all_hl_obj)
    match.all_hids = all_hids.join(',')
    match.all_oids = match.all_oid_arr.join(',')
    // 过期旧投注项ID列表
    // let old_oid_arr = _.filter(_.get(this.mid_obj['mid_'+match.mid],'all_oids','').split(','),oid=>!match.all_oids.includes(oid),[])
    // 删除旧投注项数据
    // old_oid_arr.forEach( oid => {
    //   delete this.ol_obj['oid_'+oid]
    // })
    if (match.tpl_id == 18) {
        // 计算赛事所有盘口数据--冠军玩法
        compute_match_all_handicap_data_champion(match)
    } else {
        // 计算赛事所有盘口数据
        compute_match_all_handicap_data(match)
    }

}