/*
 * @Description: 虚拟体育赛狗赛马赛果项(应该是老版h5列表页面使用)
 */
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import UserCtr from "src/core/user-config/user-ctr.js"; 
const static_serve = lodash.get(window.BUILDIN_CONFIG,'OSS_JSON.static[0]');
export default {
  name:'virtual_match_container',
  props:{
    match_list:Array,
    match:Object,
    i_list:Number,
    sport_id:Number|String,
    o_r_v_collapse:String,
  },
  data(){
    return {
      // 图标文件链接前缀
      avatar_prefix:'/client/h5/v1/bw3/svg/team-logo-20210202/',
      collapsed:false,
      home_erroed:false,
      away_erroed:false,
    };
  },
  methods:{
    get_batch_no_by_language(batch_no){
      let lang = `${i18n_t('virtual_sports.date_number_title')}`;
      let r = `${batch_no} ${lang}`;
      if(lang.value == 'vi'){
        r = lang.replace('%s',batch_no);
      }
      return r;
    },
    get_team_icon(is_away){
      let result = '';
      //主队
      if(!is_away){
        if(this.match.homeUrl){
          result = this.get_file_path(this.match.homeUrl);
        }
        else{
          this.home_erroed = true;
          // 获取赛事字母logo
          let match_letter = this.match.t1FirstWd;
          if(match_letter && /[a-z]/i.test(match_letter)){
            result = false;
          }
        }
      }
      //客队
      else{
        if(this.match.awayUrl){
          result = this.get_file_path(this.match.awayUrl);
        }
        else{
          this.away_erroed = true;
          // 获取赛事字母logo
          let match_letter = this.match.t2FirstWd;
          if(match_letter && /[a-z]/i.test(match_letter)){
            result = false;
          }
        }
      }
      return result;
    },
    team_icon_error(is_away,ev){
      let result = '';
      //主队
      if(!is_away){
        if(!this.home_erroed){
          // 获取赛事字母logo
          this.home_erroed = true;
          let match_letter = this.match.t1FirstWd;
          if(match_letter && /[a-z]/i.test(match_letter)){
            result = `${static_serve}${this.avatar_prefix}${match_letter}.svg`;
          }
        }
      }
      //客队
      else{
        if(!this.away_erroed){
          // 获取赛事字母logo
          this.away_erroed = true;
          let match_letter = this.match.t2FirstWd;
          if(match_letter && /[a-z]/i.test(match_letter)){
            result = `${static_serve}${this.avatar_prefix}${match_letter}.svg`;
          }
        }
      }
      if(result){
        ev.currentTarget.src = result;
      }

      ev.target.onerror = null
    },
    get_rank_background(rank_i,match){
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
    },
    //获取赛事排行榜
    get_match_rank(match){
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
    },
    get_icon_path_by_type(){
      if([1001].includes(+this.match.sportId)){
        return `url(${"image/bw3/svg/nav-sport-icon/sport-football-icon.svg"})`
      }
      else if(this.match.sportId == 1004){
        return `url(${"image/bw3/svg/nav-sport-icon/sport-basketball-v-icon.svg"})`
      }
      else if(this.match.sportId == 1002){
        return `url(${"image/bw3/svg/nav-sport-icon/sport-greyhound-icon.svg"})`
      }
      else if(this.match.sportId == 1011){
        return `url(${"image/bw3/svg/nav-sport-icon/sport-horserace-icon.svg"})`
      }
      else if(this.match.sportId == 1010){
        return `url(${"image/bw3/svg/nav-sport-icon/sport-moto-icon.svg"})`
      }
      else if(this.match.sportId == 1009){
        return `url(${"image/bw3/svg/nav-sport-icon/sport-moto2-icon.svg"})`
      }
    },
    /**
     * 数据页变化
     */
    data_page_changed($event){
      useMittEmit(MITT_TYPES.EMIT_VIRTUAL_RESULT_PAGE_CHANGE, $event);
    }
  },
  computed:{
    lang(){ return UserCtr.lang },
    get_theme(){return 'theme01'},
    stage_result(){
      let result = "";
      // teamGroup 阶段 GROUPS 小组赛  Q16 32强 Q8 16强 Q4 8强 SEMIFINAL 半决赛  FINAL 决赛
      let color_1 = '#FFB001'

      if(this.get_theme.includes('theme01_y0')){
        color_1 = '#569FFD'
      }else if(this.get_theme.includes('theme02_y0')){
        color_1 ='#569FFD'
      }
      if(this.match.teamGroup && !this.match.sportId == '1004'){
        if(this.match.matchDay){
          let m_str = i18n_t('virtual_sports.matchDay');
          let append_space = "&nbsp;&nbsp;"
          if(['zh','tw', 'hk'].includes(lang.value)){
            append_space = "";
          }
          result = m_str.replace('%s',`<span style="{color:${color_1}">${append_space}${this.match.matchDay}</span>`);
        }
        else{
          let lang_key = `virtual_sports.${this.match.teamGroup}`
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
        if(this.match.legOrder){
          let lang_leg_order = i18n_t('virtual_sports.legOrder');
          let append_space = "&nbsp;&nbsp;"
          if(['zh','tw', 'hk'].includes(lang.value)){
            append_space = "";
          }
          let result2 = lang_leg_order.replace('%',`<span style="color:${color_1}">${this.match.legOrder}${append_space}</span>`);
          result += `&nbsp;&nbsp;${result2}`;
        }
      }
      // matchDay 轮次
      else if(this.match.matchDay && !this.match.sportId == '1004'){
        let m_str = i18n_t('virtual_sports.matchDay');
        let append_space = "&nbsp;&nbsp;"
        if(['zh','tw', 'hk'].includes(lang.value)){
          append_space = "";
        }
        result = m_str.replace('%s',`<span style="color: ${color_1}">${append_space}${this.match.matchDay}</span>`);
      }
      // 虚拟篮球显示期数matchesGroupId
      else if(this.match.sportId == '1004'){
        if(lang.value == 'vi'){
          let w = i18n_t('virtual_sports.date_number_title');
          result = w.replace('%s',`&nbsp;<span style="color: ${color_1}">${this.match.batchNo}</span>`);
        }
        else{
          result = `<span style="color: ${color_1};font-family:dinRegular;">
            ${this.match.batchNo}
          </span>&nbsp;<span>${i18n_t('virtual_sports.date_number_title')}</span>`;
        }
      }
      else{
        let language_des = i18n_t('virtual_sports.date_number_title');
        if(language_des.indexOf('%s') > -1){
          result = language_des.replace('%s',`&nbsp;<span style="color: ${color_1}">${this.match.batchNo}</span>`);
        }
        else{
          result = `<span style="color:${color_1};font-family:dinRegular;">
            ${this.match.batchNo}
          </span>&nbsp;<span>${i18n_t('virtual_sports.date_number_title')}</span>`;
        }
      }
      return result;
    },
    // 常规赛时比分
    match_score(){
      return this.match.scoreResult.split(':')
    },
    // 点球比分
    penalty_score() {
      if (this.has_penalty_score) {
        return this.has_penalty_score.split(':')
      }
    },
    // 当前赛事是否存在点球比分
    has_penalty_score() {
      return this.match.penaltyScore
    },
    // 是否是杯赛 0 常规 1 杯赛
    is_cup_match() {
      return +this.match.cupMatch === 1
    },
    get_is_show_title(){
      let flag = false;
      if(this.i_list == 0){
        flag = true;
      }
      else{
        let i = this.i_list - 1;
        let prev_match = this.match_list[i];
        flag = prev_match.sportId != this.match.sportId;
      }
      return flag;
    },
    get_is_next_show_league(){
      let flag = false;

      let i = this.i_list + 1;
      let next_match = this.match_list[i];
      if(!next_match){
        flag = true
      }
      else{
        flag = next_match.tournamentNameCode != this.match.tournamentNameCode;
      }
      return flag;
    },
    get_is_show_league(){
      let flag = false;
      if(this.i_list == 0){
        flag = true;
      }
      else{
        let i = this.i_list - 1;
        let prev_match = this.match_list[i];
        flag = prev_match.tournamentNameCode != this.match.tournamentNameCode;
      }
      return flag;
    }
  },
}