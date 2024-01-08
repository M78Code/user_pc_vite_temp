import { computed, ref, watch, inject, onMounted, onUnmounted } from 'vue';
import lodash from 'lodash'


import { get_match_status } from 'src/core/utils/common/index'
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import { MenuData, MatchDataWarehouse_PC_List_Common, i18n_t, compute_img_url } from "src/output/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import { get_remote_time } from "src/output/index.js"
import details from "src/core/match-list-pc/details-class/details.js"
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { useRouter, useRoute } from "vue-router";
import { format_mst_data } from 'src/core/utils/matches_list.js'
import { useMittEmit, MITT_TYPES, useMittOn } from 'src/core/mitt/index.js'

import { get_handicap_index_by, get_match_score } from 'src/core/match-list-pc/match-handle-data.js'


export function BaseInfo (match) {

const is_show_home_goal = ref(false) // 是否显示主队进球动画
const is_show_away_goal = ref(false) // 是否显示客队进球动画
const is_show_home_red = ref(false) // 是否显示主队红牌动画
const is_show_away_red = ref(false) // 是否显示客队红牌动画
const is_show_away_var = ref(false) // 客队var事件
const is_show_home_var = ref(false) // 主队var事件
const var_text = ref(false) // var事件名称
const is_collect = ref(false) //赛事是否收藏
const show_default_img = ref(false); //是否显示默认队伍头像
let animation_timer = null;
const update_show_default = (value) => {
    show_default_img.value = value;
}

is_collect.value = Boolean(lodash.get(match.value, 'mf'))

let mitt_list = []
let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(lodash.get(match.value, 'mid'))
const handicap_num = computed(() => {
    if (GlobalAccessConfig.get_handicapNum()) {
        const mc = lodash.get(match.value, 'mc')
        return mc ? `+${lodash.get(match.value, 'mc')}` : '+0'
    } else {
        return i18n_t('match_info.more')
    }
})

const home_avatar = computed(()=>{
    const url = ((lodash.get(match.value, 'match_logo') || {}) || {}).home_1_logo;
    return url
  })
  const home_avatar2 = computed(()=>{
    const url = ((lodash.get(match.value, 'match_logo') || {}) || {}).home_2_logo;
    return url
  })
  
  const away_avatar = computed(()=>{
    const url = (lodash.get(match.value, 'match_logo') || {}).away_1_logo;
    return url
  })
  
  const away_avatar2 = computed(()=>{
    const url = (lodash.get(match.value, 'match_logo') || {}).away_2_logo;
    return url
  })

const play_name_obj = computed(() => {
    let play_name_obj = {
        key: 'main',
        suffix_name: '',
        score_key: ''
    }
    let { ms, hSpecial } = match.value || {}
    //滚球
    if (get_match_status(ms, [110]) == 1) {
        //角球后缀
        if (MenuData.is_corner_menu()) {
            play_name_obj = {
                key: 'corner',
                suffix_name: ' - ' + i18n_t('list.corner'),
                score_key: 'S5'
            }
            //罚牌后缀
        } else if (match_style_obj.data_tpl_id == 29) {
            play_name_obj = {
                key: 'punish',
                suffix_name: ' - ' + i18n_t('list.punish'),
                score_key: 'S10102'
            }
            // 15分钟比分
        } else if (match_style_obj.data_tpl_id == 24) {
            play_name_obj = {
                key: 'main',
                suffix_name: '',
                score_key: `S100${hSpecial}`
            }
        }
    }
    return play_name_obj
})
const home_score = computed(() => {
    let obj = get_match_score(match.value)
    return obj.home_score
})
const away_score = computed(() => {
    let obj = get_match_score(match.value)
    return obj.away_score
})
let handicap_index = computed(() => {
    return get_handicap_index_by(match.value)
})
onMounted(() => {
    mitt_list = [
        useMittOn(MITT_TYPES.EMIT_VAR_EVENT, handle_var_event).off
    ]
})
/**
 * @Description 赛事收藏 
*/
const collect = () => {
    //前端修改收藏状态
    is_collect.value = !is_collect.value
    useMittEmit(MITT_TYPES.EMIT_MX_COLLECT_MATCH, match.value)
}
// 监听收藏变化
watch(() => match.value.mf, (n) => {
    is_collect.value = Boolean(n)
}, { immediate: true })

// 监听收藏数量，更新收藏icon 颜色
// watch(get_collect_count, () => {
//   const cur = match.value_list_data.mid_obj
//   is_collect.value = Boolean (cur['mid_'+match.mid].mf)
// })
// 监听主比分变化
watch(home_score, (n, o) => {
    //推送时间是否过期
    let is_time_out = get_remote_time() - MatchDataWarehouse_PC_List_Common.ws_match_key_upd_time_cache_get_time(match.value, 'msc') < 3000
    // 足球 并且已开赛
    if (match.value.csid == 1 && get_match_status(match.value.ms, [110]) == 1 && n != 0 && n > o && is_time_out) {
        reset_event();
        is_show_home_goal.value = true;
    }
}, { deep: true })
// 监听主比分变化
watch(away_score, (n, o) => {
    //推送时间是否过期
    let is_time_out = get_remote_time() - MatchDataWarehouse_PC_List_Common.ws_match_key_upd_time_cache_get_time(match.value, 'msc') < 3000
    // 足球 并且已开赛
    if (match.value.csid == 1 && get_match_status(match.value.ms, [110]) == 1 && n != 0 && n > o && is_time_out) {
        reset_event();
        is_show_away_goal.value = true;
    }
}, { deep: true })
let timer;
/**
 * @description 开赛时间自动加1
 * @param {object} payload 
 */
const use_polling_mst = payload => {
    if (payload.cmec === 'timeout') return payload.mstValue = format_mst_data(payload.mst)
    // mlet 每个阶段的时间
    if ([301, 302, 303].includes(payload.mle)) return payload.mstValue = payload.mlet;
    if (Number(payload.mst) <= 0 || payload.ms !== 1) return
    if (payload.csid === '2') {
        timer = setInterval(() => {
            if (payload.mst <= 0) return
            payload.mst--
            payload.mstValue = format_mst_data(payload.mst)
        }, 1000)
    } else {
        timer = setInterval(() => {
            payload.mst++
            payload.mstValue = format_mst_data(payload.mst)
        }, 1000)
    }
}

//是否展示为比分判定中
const scoring = computed(() => {
    const {csid, ms, mmp, home_score, away_score} = match.value
    let scoring = false
    if (
      is_eports_csid(csid) && // 电竞赛事
      get_match_status(ms, [ 110 ]) // 且为滚球（进行中）状态
    ) {
      // 电竞未开赛 展示为 第一局
      const mmp_state = mmp || 1
      // 当前局数不等于 比分总和加一，則提示比分判定中
      if (mmp_state != (Number(home_score) + Number(away_score) + 1)) {
        scoring = true
      }
    }
    return scoring
})
// var 事件处理
function handle_var_event(ws_data) {
    const { skt_data: { mat, mid }, var_item } = ws_data
    if (match.value.mid !== mid) return
    if (mat === 'home') {
        is_show_home_var.value = true
    } else if (mat === 'away') {
        is_show_away_var.value = true
    } else {
        // 不确定队伍，则都显示
        is_show_home_var.value = true
        is_show_away_var.value = true
    }
    var_text.value = var_item[UserCtr.lang]
    clear_var_event()
}
/**
 * @description 清除var事件状态
 */
function clear_var_event() {
    let timer = setTimeout(() => {
        is_show_home_var.value = false
        is_show_away_var.value = false
        clearTimeout(timer)
        timer = null
    }, 10000)
}
// 重置事件
function reset_event() {
    clearTimeout(animation_timer)
    animation_timer = null
    is_show_home_goal.value = false
    is_show_away_goal.value = false
    is_show_home_var.value = false
    is_show_away_var.value = false
    is_show_home_red.value = false
    is_show_away_red.value = false
    animation_timer = setTimeout(() => {
        is_show_home_goal.value = false
        is_show_away_goal.value = false
    }, 5000)
}

/**
 * @Description 隐藏主队进球动画
 * @param {undefined} undefined
*/
const hide_home_goal = lodash.debounce(() => {
    is_show_home_goal.value = false;
  }, 5000)
  
/**
 * @Description 隐藏客队进球动画
 * @param {undefined} undefined
 */
const hide_away_goal = lodash.debounce(() => {
is_show_away_goal.value = false;
}, 5000)

onUnmounted(() => {
    clearInterval(timer);
    clearTimeout(animation_timer)
    animation_timer = null
    timer = null;
    mitt_list.forEach(i => i());
    lodash.isFunction(hide_away_goal.cancel)&&hide_away_goal.cancel();
    lodash.isFunction(hide_home_goal.cancel)&&hide_home_goal.cancel();
})


return {
    home_score,
    away_score,
    handicap_index,
    use_polling_mst,
    collect,
    play_name_obj,
    home_avatar,
    home_avatar2,
    away_avatar,
    away_avatar2,
    handicap_num,
    is_collect,
    is_show_home_goal,
    is_show_away_goal,
    is_show_home_red,
    is_show_away_red,
    is_show_home_var,
    update_show_default,
    scoring
}

}
