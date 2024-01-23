
import { MenuData } from "src/output";
import { computed_menu_to_match_templte_ouzhou } from './ouzhou-pc-menu-match-template.js';
import { MATCH_LIST_TEMPLATE_CONFIG } from './index.js'
import { get } from 'lodash'
import BaseData from "src/core/base-data/base-data.js";
import { project_name } from 'src/output/module/constant-utils.js'
import {LayOutMain_pc} from "src/output/project/index.js";

/**
* 获取当前的列表的默认的 模板配置
*/
function get_match_tpl_number() {
    // 根据当前的菜单id 取到对应的模板id
    let current_template_id;
    if (project_name == 'ouzhou-pc') {
        let euid = get(MenuData.left_menu_result, 'lv1_mi');
        current_template_id = computed_menu_to_match_templte_ouzhou(euid)
    } else {
        current_template_id = get_match_tpl_number2()
    }
    return current_template_id
}
/**
 * 设置模板的宽度
 * @param {*} 宽度
 * @param {*} 其他参数 
 * @param {*} c 
 * @param {*} d 
 */
function set_template_width(a, b, c, d) {
    if (project_name == 'ouzhou-pc') {
        MATCH_LIST_TEMPLATE_CONFIG['template_101_config'].set_template_width(a, b, c, d)
    } else {
        for (const key in MATCH_LIST_TEMPLATE_CONFIG) {
            if (MATCH_LIST_TEMPLATE_CONFIG[key].set_template_width)
                MATCH_LIST_TEMPLATE_CONFIG[key].set_template_width(a, b, c, d)
        }
    }
}
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
function get_match_tpl_number2() {
    //搜索13列玩法
    if (LayOutMain_pc.is_unfold_multi_column&&MenuData.is_multi_column) {
        return 13
    }
    // 电竞常规赛事
    if (MenuData.is_kemp() || MenuData.is_common_kemp() || MenuData.is_esports_champion()) {
        return 18
    } else if (MenuData.is_scroll_ball() || MenuData.is_hot()) {
        //热门和滚球走csid的
        return;
    }
    // 电竞
    else if (MenuData.is_esports()) {
        return 28;
    }
    let { orpt: r } = BaseData.mi_info_map[`mi_${MenuData.menu_current_mi}`] || {};
    return r == 0 ? 1 : r
}
/**
 * @Description 获取赛事模板ID
 * @param {number} csid 球种类型
*/
function get_match_template_id({ csid }) {
    // 这里的话 
    // 因为我们会有多个版本  
    // 需要映射到不同的赔率模板 
    // 所以加一个配置  
    // 欧洲版从100开始  
    // 亚洲版从0开始
    const different_version_config = {
        "ouzhou-pc": 100,
        "yazhou-pc": 0,
        "new-pc": 0,
    }
    let tpl_id;
    //搜索13列玩法
    if (LayOutMain_pc.is_unfold_multi_column&&MenuData.is_multi_column) {
        return 13
    }
    if (MenuData.is_kemp() || MenuData.is_common_kemp() || MenuData.is_collect_kemp()) {
        tpl_id = 18
    } else {
        tpl_id = get_match_tpl_number()
        if (!tpl_id) {
            tpl_id = csid_to_tpl_id(csid)
        }
    }
    tpl_id = Number(tpl_id) + Number(different_version_config[project_name])
    if ('ouzhou-pc' == project_name) {
        // 欧洲版冠军
        if (MenuData.is_kemp() || MenuData.is_common_kemp() || MenuData.is_collect_kemp()) {
            return tpl_id
        }
        return get_ouzhou_data_tpl_id(csid)
    }
    return tpl_id
}

/**
  * @Description 根据csid获取对应的模板ID
  * @param {undefined} undefined
 */
export function csid_to_tpl_id(csid) {
    csid = csid * 1
    let tpl_id = 1
    switch (csid) {
        case 1001://虚拟足球1000
            return 25
        case 1004://虚拟篮球1004
            return 26
        case 1002:
        case 1010: //虚拟赛狗1002 虚拟摩托1010 虚拟赛马1011 泥地摩托车1009
        case 1011:
            return 27
        case 1009:
            return 30
        case 1: // 足球
        case 11:// 手球
            return 1
        case 2: // 篮球
            return 7
        case 3: // 棒球
            return 17
        case 4: // 冰球
            return 16
        case 5: // 网球
            return 9
        case 6: // 美足
            return 1
        case 7: // 斯诺克
        case 8: // 乒乓球
        case 9: // 排球
        case 10: // 羽毛球
        case 13: // 沙滩排球
            return 11
        case 12: // 拳击
            tpl_id = 19
        case 14: // 橄榄球
        case 15: // 曲棍球
        case 16: // 水球
            return 20
        case 100: // lol
        case 101: // dota2
        case 102: // CSgo
        case 103: // 王者荣耀
            return 28
    }
    return tpl_id
}
/**
 * 
 * @param {Number | String} csid 
 * @returns 获取数据模板id
 * @description 获取欧洲版 不同球种的数据模板id
 */
function get_ouzhou_data_tpl_id(csid) {
    switch (Number(csid)) {
        case 1:
        case 90:
            return 101
        case 2:
        case 91:
            return 102;
        case 4:
            return 104;
        case 5:
            return 109;
        case 6:
            return 106;
        case 7:
            return 112;
        case 10:
        case 8:
        case 9:
        case 13:
            return 111;
        case 3:
            return 117;
        case 12:
            return 119;
        case 100:
        case 101:
        case 102:
        case 103:
            return 124;
        case 1001://虚拟足球1001
            return 129
        case 1004://虚拟篮球1004
            return 126
        default:
            return 101;
    }
}
export {
    get_match_tpl_number,
    get_match_template_id,
    set_template_width,
    get_ouzhou_data_tpl_id
}
