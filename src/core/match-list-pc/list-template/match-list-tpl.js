
import { MenuData } from "src/output";
import { computed_menu_to_match_templte } from './pc-menu-match-template.js'
import { computed_menu_to_match_templte_ouzhou } from './ouzhou-pc-menu-match-template.js';
import { MATCH_LIST_TEMPLATE_CONFIG } from './index.js'
import { get } from 'lodash'
import BaseData from "src/core/base-data/base-data.js";
import { PROJECT_NAME } from 'src/output/module/constant-utils.js'
setTimeout(() => {
    window.BaseData = BaseData
    window.MenuData = MenuData;
})
/**
* 获取当前的列表的默认的 模板配置
*/
function get_match_tpl_number() {
    // 根据当前的菜单id 取到对应的模板id
    let current_template_id;
    if (PROJECT_NAME == 'ouzhou-pc') {
        let euid = get(MenuData.left_menu_result, 'lv1_mi');
        current_template_id = computed_menu_to_match_templte_ouzhou(euid)
    } else {
        current_template_id = get_match_tpl_number2()
    }
    return current_template_id
}
/**
 * 设置模板的宽度
 * @param {*} a 
 * @param {*} b 
 * @param {*} c 
 * @param {*} d 
 */
function set_template_width(a, b, c, d) {
    let tpl_num = get_match_tpl_number()
    try {
        if (PROJECT_NAME == 'ouzhou-pc') {
            tpl_num = 101 //欧洲是固定模板宽
        }
        MATCH_LIST_TEMPLATE_CONFIG[`template_${tpl_num}_config`].set_template_width(a, b, c, d)
    } catch (error) {
        console.error(tpl_num, BaseData.mi_info_map[`mi_${MenuData.menu_current_mi}`], error)
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
    let { orpt: r } = BaseData.mi_info_map[`mi_${MenuData.menu_current_mi}`] || {};
    // 电竞常规赛事
    if (MenuData.is_kemp()||MenuData.is_common_kemp() || MenuData.is_esports_champion()) {
        r = 18
    }
    // 电竞
    else if (MenuData.is_esports()) {
        r = 28;
    }
    //搜索13列玩法
    if (MenuData.is_multi_column) {
        r = 13
    }
    if (!r) {
        //  兜底
        let mi = get(MenuData.left_menu_result, 'lv2_mi');
        r = computed_menu_to_match_templte((mi))
    }
    return r == 0 ? 1 : r
    // const { left_menu_result = {}, mid_menu_result = {} } = MenuData;
    // let match_tpl_number = -1
    // // 玩法菜单
    // let play_menu = get_menu_obj_by_menu_id(lodash.get(left_menu_result, "lv1_mi"))
    // // 详情页热门赛事 或者 搜索 或者列表强力推荐
    // if (PageSourceData.route_name == 'details' || PageSourceData.route_name == 'search' || is_hot) {
    //     match_tpl_number = -1
    //     //搜索13列玩法
    //     //&& store.getters.get_unfold_multi_column
    //     if (lodash.get(MenuData, 'current_ball_type', -1) == '1' && MenuData.is_multi_column) {
    //         match_tpl_number = 13
    //     }
    // }
    // // 竟足赛事 12模板
    // else if (mid_menu_result.mi == 30101) {
    //     match_tpl_number = 12
    // }
    // // 冠军聚合页  或者电竞冠军 18模板 
    // else if (MenuData.is_kemp() || MenuData.is_esports_champion()) {
    //     match_tpl_number = 18
    // }
    // // 电竞常规赛事
    // else if (MenuData.is_esports()) {
    //     match_tpl_number = 'esports'
    // }
    // //13列玩法菜单 && store.getters.get_unfold_multi_column
    // else if (MenuData.is_multi_column && PageSourceData.page_source == 'home') {
    //     match_tpl_number = 13
    // }
    // // 取玩法菜单
    // else if (play_menu.field2 == 0 || play_menu.field2) {
    //     match_tpl_number = play_menu.field2
    // }
    // return match_tpl_number
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
    let tpl_id = get_match_tpl_number()
    if (MenuData.is_kemp() || MenuData.is_esports_champion()) {
        tpl_id = 18
    }
    // 电竞
    else if (MenuData.is_esports()) {
        tpl_id = 28;
    }
    else if (!tpl_id || tpl_id == '0' || MenuData.is_scroll_ball()) {
        tpl_id = csid_to_tpl_id(csid)
    }
    tpl_id = Number(tpl_id) + Number(different_version_config[PROJECT_NAME])
    if ('ouzhou-pc' == PROJECT_NAME) {
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
    let tpl_id = 99
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
            return 101
        case 2:
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
