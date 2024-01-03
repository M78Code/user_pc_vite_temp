
import BUILDIN_CONFIG from "app/job/output/env/index.js";
import { MenuData } from "src/output";
import { computed_menu_to_match_templte } from './pc-menu-match-template.js'
import { computed_menu_to_match_templte_ouzhou } from './ouzhou-pc-menu-match-template.js';
import { MATCH_LIST_TEMPLATE_CONFIG } from './index.js'

import { get } from 'lodash'
export const { PROJECT_NAME } = BUILDIN_CONFIG;
class MatchListTpl {
    constructor(_PROJECT_NAME) {
        this.PROJECT_NAME = _PROJECT_NAME
    }
    /**
 * 获取当前的列表的默认的 模板配置
 */
    get_match_tpl_number() {
        // 根据当前的菜单id 取到对应的模板id
        let current_template_id;
        if (PROJECT_NAME == 'ouzhou-pc') {
            let euid = get(MenuData.left_menu_result, 'lv1_mi');
            current_template_id = computed_menu_to_match_templte_ouzhou(euid)
        } else {
            let euid = get(MenuData.left_menu_result, 'lv2_mi');
            current_template_id = computed_menu_to_match_templte(euid)
        }
        return current_template_id
    }
    set_template_width(a, b, c, d) {
        const tpl_num = this.get_match_tpl_number()
        if (PROJECT_NAME == 'ouzhou-pc') {
            tpl_num = 101 //欧洲是固定模板宽
        }
        MATCH_LIST_TEMPLATE_CONFIG[`template_${tpl_num}_config`].set_template_width(a, b, c, d)
    }
}
export default new MatchListTpl(PROJECT_NAME)
