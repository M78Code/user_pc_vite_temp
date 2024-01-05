
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
export default {
    computed: {
        match_style_obj() {
            return MatchListCardDataClass.get_card_obj_bymid(lodash.get(props.card_style_obj, 'mid'), MatchListCardDataClass.list_version.value)
        },
        match_list_tpl_size(){
            return MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`].width_config
        }

    }
}