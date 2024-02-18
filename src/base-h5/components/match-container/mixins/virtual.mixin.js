 
import { computed, onUnmounted, ref } from 'vue'
import store from "src/store-redux/index.js";
import lodash from 'lodash'
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { i18n_t} from 'src/output/index.js'
import data_pager from "src/base-h5/components/common/data-pager.vue"

const store_state = store.getState()
const avatar_prefix = ref('/client/h5/v1/bw3/svg/team-logo-20210202/')
const collapsed = ref(false)
const home_erroed = ref(false)
const away_erroed = ref(false)

const get_lang = ref(store_state.get_lang)
const get_theme = ref(store_state.get_theme)

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
  get_theme.value = new_state.get_theme
  get_lang.value = new_state.get_lang
})

const stage_result = computed(() => {
  let result = "";
  // teamGroup 阶段 GROUPS 小组赛  Q16 32强 Q8 16强 Q4 8强 SEMIFINAL 半决赛  FINAL 决赛
  let color_1 = 'var(--qq-gb-t-c-3)';
  // if(('theme01_y0')){
  //   color_1 = '#569FFD'
  // }else if(('theme02_y0')){
  //   color_1 ='#569FFD'
  // }
  if(match.teamGroup && !match.sportId == '1004'){
    if(match.matchDay){
      let m_str = i18n_t('virtual_sports.matchDay');
      let append_space = "&nbsp;&nbsp;"
      if(['zh','tw', 'hk'].includes(get_lang.value)){
        append_space = "";
      }
      result = m_str.replace('%s',`<span style="{color:${color_1}">${append_space}${match.matchDay}</span>`);
    }
    else{
      let lang_key = `virtual_sports.${match.teamGroup}`
      result = `${i18n_t(lang_key)}`;

      let found_str_list = [];
      let found = result.match(/[0-9]/ig);
      if(found && found.length){
        found.forEach((s,i) => {
          let h_space = '';
          if(i == found.length - 1){
            h_space = '&nbsp;';
          }
          found_str_list.push(`<span style="color:${color_1}">${s}${h_space}</span>`);
        });
        let part2 = result.substring(found.length);
        result = found_str_list.join('') + part2;
      }
    }

    // legOrder 回合
    if(match.legOrder){
      let lang_leg_order = i18n_t('virtual_sports.legOrder');
      let append_space = "&nbsp;&nbsp;"
      if(['zh','tw', 'hk'].includes(get_lang.value)){
        append_space = "";
      }
      let result2 = lang_leg_order.replace('%',`<span style="color:${color_1}">${match.legOrder}${append_space}</span>`);
      result += `&nbsp;&nbsp;${result2}`;
    }
  }
  // matchDay 轮次
  else if(match.matchDay && !match.sportId == '1004'){
    let m_str = i18n_t('virtual_sports.matchDay');
    let append_space = "&nbsp;&nbsp;"
    if(['zh','tw', 'hk'].includes(get_lang.value)){
      append_space = "";
    }
    result = m_str.replace('%s',`<span style="color: ${color_1}">${append_space}${match.matchDay}</span>`);
  }
  // 虚拟篮球显示期数matchesGroupId
  else if(match.sportId == '1004'){
    if(get_lang.value == 'vi'){
      let w = i18n_t('virtual_sports.date_number_title');
      result = w.replace('%s',`&nbsp;<span style="color: ${color_1}">${match.batchNo}</span>`);
    }
    else{
      result = `<span style="color: ${color_1};font-family:dinRegular;">
        ${match.batchNo}
      </span>&nbsp;<span>${i18n_t('virtual_sports.date_number_title')}</span>`;
    }
  }
  else{
    let language_des = i18n_t('virtual_sports.date_number_title');
    if(language_des.indexOf('%s') > -1){
      result = language_des.replace('%s',`&nbsp;<span style="color: ${color_1}">${match.batchNo}</span>`);
    }
    else{
      result = `<span style="color:${color_1};font-family:dinRegular;">
        ${match.batchNo}
      </span>&nbsp;<span>${i18n_t('virtual_sports.date_number_title')}</span>`;
    }
  }
  return result;
})

// 常规赛时比分
const match_score = computed(() => match.scoreResult.split(':'))

// 当前赛事是否存在点球比分
const has_penalty_score = computed(() => match.penaltyScore)

// 是否是杯赛 0 常规 1 杯赛
const is_cup_match = computed(() => +match.cupMatch === 1)

// 点球比分
const penalty_score = computed(() => has_penalty_score && has_penalty_score.split(':'))

const get_is_show_title = computed(() => {
  let flag = false;
  if(i_list == 0){
    flag = true;
  }
  else{
    let i = i_list - 1;
    let prev_match = match_list[i];
    flag = prev_match.sportId != match.sportId;
  }
  return flag;
})

const get_is_next_show_league = computed(() => {
  let flag = false;

  let i = i_list + 1;
  let next_match = match_list[i];
  if(!next_match){
    flag = true
  }
  else{
    flag = next_match.tournamentNameCode != match.tournamentNameCode;
  }
  return flag;
})

const get_is_show_league = computed(() => {
  let flag = false;
  if(i_list == 0){
    flag = true;
  }
  else{
    let i = i_list - 1;
    let prev_match = match_list[i];
    flag = prev_match.tournamentNameCode != match.tournamentNameCode;
  }
  return flag;
})

const get_batch_no_by_language = (batch_no) => {
      let lang = `${i18n_t('virtual_sports.date_number_title')}`;
      let r = `${batch_no} ${lang}`;
      if(get_lang.value == 'vi'){
        r = lang.replace('%s',batch_no);
      }
      return r;
}
const get_team_icon = (is_away) => {
  let result = '';
  //主队
  if(!is_away){
    if(match.homeUrl){
      result = get_server_file_path(match.homeUrl);
    }
    else{
      home_erroed.value = true;
      // 获取赛事字母logo
      let match_letter = match.t1FirstWd;
      if(match_letter && /[a-z]/i.test(match_letter)){
        result = false;
      }
    }
  }
  //客队
  else{
    if(match.awayUrl){
      result = get_server_file_path(match.awayUrl);
    }
    else{
      away_erroed.value = true;
      // 获取赛事字母logo
      let match_letter = match.t2FirstWd;
      if(match_letter && /[a-z]/i.test(match_letter)){
        result = false;
      }
    }
  }
  return result;
}
const team_icon_error = (is_away,ev) => {
  let result = '';
  //主队
  if(!is_away){
    if(!home_erroed.value){
      // 获取赛事字母logo
      home_erroed.value = true;
      let match_letter = match.t1FirstWd;
      if(match_letter && /[a-z]/i.test(match_letter)){
        result = `${static_serve}${avatar_prefix.value}${match_letter}.svg`;
      }
    }
  }
  //客队
  else{
    if(!away_erroed.value){
      // 获取赛事字母logo
      away_erroed.value = true;
      let match_letter = match.t2FirstWd;
      if(match_letter && /[a-z]/i.test(match_letter)){
        result = `${static_serve}${avatar_prefix.value}${match_letter}.svg`;
      }
    }
  }
  if(result){
    ev.currentTarget.src = result;
  }

  ev.target.onerror = null
}
const get_rank_background = (rank_i,match) => {
  let s_type = 'dog';//赛马horse或赛狗dog
  let virtual_sports= ''
  if(match.sportId == 1011){  // 赛马
    s_type = 'horse'
  }
  else if([1002, 1010, 1009].includes(+match.sportId)){ // 赛狗 摩托车 泥地摩托车
    s_type = 'dog'
  } else {
    return null
  }
  if([1010, 1009].includes(+match.sportId)){
    virtual_sports = `motorcycle${rank_i.no}`
  }
  if ([1009].includes(+match.sportId)) {
    virtual_sports = `dirt_motorcycle${rank_i.no}`;
  }
  return `match-${s_type}${rank_i.no} ${virtual_sports}`;
}
//获取赛事排行榜
const get_match_rank = (match) => {
  let result = [];
  if(match.teamsTop){
    result = match.teamsTop.map(team => {
      let m = {
        no:team.split('_')[0],
      };
      return m;
    });
  }
  return result;
}
const get_icon_path_by_type = () => {
  if([1001].includes(+match.sportId)){
    return `url(${"image/bw3/svg/nav-sport-icon/sport-football-icon.svg"})`
  }
  else if(match.sportId == 1004){
    return `url(${"image/bw3/svg/nav-sport-icon/sport-basketball-v-icon.svg"})`
  }
  else if(match.sportId == 1002){
    return `url(${"image/bw3/svg/nav-sport-icon/sport-greyhound-icon.svg"})`
  }
  else if(match.sportId == 1011){
    return `url(${"image/bw3/svg/nav-sport-icon/sport-horserace-icon.svg"})`
  }
  else if(match.sportId == 1010){
    return `url(${"image/bw3/svg/nav-sport-icon/sport-moto-icon.svg"})`
  }
  else if(match.sportId == 1009){
    return `url(${"image/bw3/svg/nav-sport-icon/sport-moto2-icon.svg"})`
  }
}
/**
 * 数据页变化
 */
const data_page_changed = ($event) => {
  useMittEmit(MITT_TYPES.EMIT_VIRTUAL_RESULT_PAGE_CHANGE,$event);
}

onUnmounted(() => {
  unsubscribe()
})

 