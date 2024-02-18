 
import { defineComponent } from 'vue'
import store from "src/store-redux/index.js";
import lodash from 'lodash'
import { i18n_t} from 'src/output/index.js'
import data_pager from "src/base-h5/components/common/data-pager.vue"
import { get_server_file_path } from "src/core/file-path/file-path.js";
import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { is_hot, menu_type, is_detail, is_results, menu_lv1 } from 'src/base-h5/mixin/menu.js'
import MatchFold from 'src/core/match-fold'
import { useMittEmit, MITT_TYPES, project_name } from  "src/output"


export default defineComponent({
  data () {
    return {
      avatar_prefix: '/client/h5/v1/bw3/svg/team-logo-20210202/',
      home_erroed: false,
      away_erroed: false,
      get_lang: lang,
      get_theme: theme,
    }
  },
  mounted() {
    this.run_new_init_timer();
  },
  computed: {
    match () {
      return this.match_of_list;
    },
    match_list () { //全量
      return MatchMeta.complete_matchs
    },
    i_list () {
      return this.i
    },
    collapsed () {
      if (is_hot.value) return false
      const key = MatchFold.get_match_fold_key(this.match_of_list)
      const show_card = lodash.get(MatchFold.match_mid_fold_obj.value, `${key}.show_card`, true)
      return show_card
    },
    stage_result () {
      let result = "";
      // teamGroup 阶段 GROUPS 小组赛  Q16 32强 Q8 16强 Q4 8强 SEMIFINAL 半决赛  FINAL 决赛
      let color_1 = 'var(--qq-gb-t-c-3)';
      // if(('theme01_y0')){
      //   color_1 = '#569FFD'
      // }else if(('theme02_y0')){
      //   color_1 ='#569FFD'
      // }
      if(this.match.teamGroup && !this.match.sportId == '1004'){
        if(this.match.matchDay){
          let m_str = i18n_t('virtual_sports.matchDay');
          let append_space = "&nbsp;&nbsp;"
          if(['zh','tw', 'hk'].includes(this.get_lang)){
            append_space = "";
          }
          result = m_str.replace('%s',`<span style="{color:${color_1}">${append_space}${this.match.matchDay}</span>`);
        }
        else{
          let lang_key = `virtual_sports.${this.match.teamGroup}`
          result = `${i18n_t(lang_key)}`;
    
          let found_str_list = [];
          let found = result.this.match(/[0-9]/ig);
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
          if(['zh','tw', 'hk'].includes(this.get_lang)){
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
        if(['zh','tw', 'hk'].includes(this.get_lang)){
          append_space = "";
        }
        result = m_str.replace('%s',`<span style="color: ${color_1}">${append_space}${this.match.matchDay}</span>`);
      }
      // 虚拟篮球显示期数matchesGroupId
      else if(this.match.sportId == '1004'){
        if(this.get_lang == 'vi'){
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
    match_score () {
      return this.match.scoreResult.split(':')
    },
    has_penalty_score () {
      return this.match.penaltyScore
    },
    is_cup_match () {
      return +this.match.cupMatch === 1
    },
    penalty_score () {
      return has_penalty_score && has_penalty_score.split(':')
    },
    get_is_show_title () {
      let flag = false;
      if(this.i_list == 0){
        flag = true;
      }
      else{
        try {
          let i = this.i_list - 1;
          let prev_match = this.match_list[i];
          console.log('let prev_match = this.match_list[i];', prev_match)
          flag = prev_match.sportId != this.match.sportId;
        } catch (_) {}
      }
      return flag;
    },
    get_server_file_path_local (path, csid) {
      return get_server_file_path(path, csid);
    },
    get_is_next_show_league () {
      let flag = false;
    
      let i = this.i_list + 1;
      let next_match = this.match_list[i];
      if(!next_match){
        flag = true
      }
      else{
        try {
          flag = next_match.tournamentNameCode != this.match.tournamentNameCode;
        } catch(_) {}
      }
      return flag;
    },
    get_is_show_league () {
      let flag = false;
      if(this.i_list == 0){
        flag = true;
      }
      else{
        try {
          let i = this.i_list - 1;
          let prev_match = this.match_list[i];
          flag = prev_match.tournamentNameCode != this.match.tournamentNameCode;
        } catch(_) {}
      }
      return flag;
    }
  },
  methods: {
    run_new_init_timer () {
      // 用于对应列表的进球动画
      if (this.is_new_init_timer2) {
        clearTimeout(this.is_new_init_timer2)
      }
      this.is_new_init2 = false;
      this.is_new_init_timer2 = setTimeout(() => {
        this.is_new_init2 = true
      }, 3000)
    },
    get_batch_no_by_language (batch_no) {
      let lang = `${i18n_t('virtual_sports.date_number_title')}`;
      let r = `${batch_no} ${lang}`;
      if(this.get_lang == 'vi'){
        r = lang.replace('%s',batch_no);
      }
      return r;
    },
    get_team_icon (is_away) {
      let result = '';
      //主队
      if(!is_away){
        if(this.match.homeUrl){
          result = get_server_file_path(this.match.homeUrl);
        }
        else{
          home_erroed.value = true;
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
          result = get_server_file_path(this.match.awayUrl);
        }
        else{
          away_erroed.value = true;
          // 获取赛事字母logo
          let match_letter = this.match.t2FirstWd;
          if(match_letter && /[a-z]/i.test(match_letter)){
            result = false;
          }
        }
      }
      return result;
    },
     /**
     * @description 联赛折叠
     */
     handle_league_fold () {
      const { tid, is_virtual = false, warehouse_type = '', start_flag = '' }  = this.match_of_list
      // 首页热门，详情页，不需要用到折叠
      if (is_hot.value || is_detail.value) return;
      MatchFold.set_league_fold(this.match_of_list, start_flag)
      // 不需要虚拟计算，欧洲版五大联赛
      if (is_virtual || ['five_league'].includes(warehouse_type)) return
      // app-h5 简版 先试运行看效果
      if (project_name === 'app-h5' && standard_edition.value == 1) MatchMeta.compute_current_matchs()
      MatchMeta.compute_page_render_list({ scrollTop: 0, type: 2, is_scroll: false})
      // 赛事个数小于18 不需要继续获取赔率
      if (!is_results.value && MatchMeta.complete_matchs.length > 17) MatchMeta.get_match_base_hps_by_mids({is_again: false})
    },
    team_icon_error (is_away,ev) {
      let result = '';
      //主队
      if(!is_away){
        if(!home_erroed.value){
          // 获取赛事字母logo
          home_erroed.value = true;
          let match_letter = this.match.t1FirstWd;
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
          let match_letter = this.match.t2FirstWd;
          if(match_letter && /[a-z]/i.test(match_letter)){
            result = `${static_serve}${avatar_prefix.value}${match_letter}.svg`;
          }
        }
      }
      if(result){
        ev.currentTarget.src = result;
      }
    
      ev.target.onerror = null
    },
    get_rank_background (rank_i,match) {
      let s_type = 'dog';//赛马horse或赛狗dog
      let virtual_sports= ''
      if(this.match.sportId == 1011){  // 赛马
        s_type = 'horse'
      }
      else if([1002, 1010, 1009].includes(+this.match.sportId)){ // 赛狗 摩托车 泥地摩托车
        s_type = 'dog'
      } else {
        return null
      }
      if([1010, 1009].includes(+this.match.sportId)){
        virtual_sports = `motorcycle${rank_i.no}`
      }
      if ([1009].includes(+this.match.sportId)) {
        virtual_sports = `dirt_motorcycle${rank_i.no}`;
      }
      return `${rank_i.no}`;
    },
    get_match_rank (match) {
      let result = [];
      if(this.match.teamsTop){
        result = this.match.teamsTop.map(team => {
          let m = {
            no:team.split('_')[0],
          };
          return m;
        });
      }
      return result;
    },
    get_icon_path_by_type () {
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
    data_page_changed ($event) {
      useMittEmit(MITT_TYPES.EMIT_VIRTUAL_RESULT_PAGE_CHANGE,$event);
    }
  },
  destroyed() {
    this.unsubscribe()
  }
})