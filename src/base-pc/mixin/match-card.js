
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { computed } from 'vue';
export function useMatchCard(props) {
    const match_style_obj = computed(() => {
        return MatchListCardDataClass.get_card_obj_bymid(lodash.get(props, 'mid'), MatchListCardDataClass.list_version.value)
    })
    const match_list_tpl_size = computed(() => {
        return MATCH_LIST_TEMPLATE_CONFIG[`template_${match_style_obj.data_tpl_id}_config`].width_config
    })
    return {
        match_style_obj, match_list_tpl_size
    }
}