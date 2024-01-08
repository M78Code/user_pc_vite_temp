
import { MenuData } from "src/output";
import { computed_menu_to_match_templte } from './pc-menu-match-template.js'
import { computed_menu_to_match_templte_ouzhou } from './ouzhou-pc-menu-match-template.js';
import { MATCH_LIST_TEMPLATE_CONFIG } from './index.js'
import { csid_to_tpl_id } from 'src/core/constant/common/module/csid-util.js'
import { get } from 'lodash'
import BaseData from "src/core/base-data/base-data.js";
import { PROJECT_NAME } from 'src/output/module/constant-utils.js'

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
        let mi = get(MenuData.left_menu_result, 'lv2_mi');
        current_template_id = computed_menu_to_match_templte((mi))
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
    if (PROJECT_NAME == 'ouzhou-pc') {
        tpl_num = 101 //欧洲是固定模板宽
    }
    MATCH_LIST_TEMPLATE_CONFIG[`template_${tpl_num}_config`].set_template_width(a, b, c, d)
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
