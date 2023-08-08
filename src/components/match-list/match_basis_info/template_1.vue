<!--
 * @Author: Cable
 * @Date: 2021-08-04 17:13:55
 * @Description: 赛事基础信息
-->
<template>
  <div class="basic-wrap" @click.stop="on_go_detail" >
    <!-- 主队信息 -->
    <div class="row-item team-item">
      <div class="team-logo">
        <img v-if="show_type == 'all'" style="width: 22px; max-height: 24px;" v-img="[((match.match_logo || {}) || {}).home_1_logo,(match.match_logo || {}).home_1_letter]" />
      </div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name home ellipsis allow-user-select" :class="{'bold':match.team_let_ball=='T1'}" v-tooltip="{content:match.mhn+play_name_obj.suffix_name,overflow:1}">{{match.mhn}}{{play_name_obj.suffix_name}}</div>
          <!-- 进球动画 -->
          <div class="yb-flex-center" v-if="is_show_home_goal">
            <div class="yb-goal-gif"></div>
            <div class="gif-text">{{$root.$t('common.goal')}}</div>
          </div>
          <!-- 红牌数 -->
          <span
            v-show="(match.score_obj || {}).S11.home > 0"
            class="red-ball"
            :class="{flash:is_show_home_red}"
          >{{match.score_obj.S11.home}}</span>
        </div>
      </div>
      <!-- 主比分 -->
      <div class="score" v-if="show_type == 'all'" v-tooltip="{content: is_15min ? $root.$t('list.15min_stage'):'' ,overflow:1}">{{  play_name_obj.score_key ?  _.get(match,`score_obj.${play_name_obj.score_key}.home`) : match.home_score}}</div>
    </div>
    <!-- 客队信息 -->
    <div class="row-item team-item">
      <div class="team-logo">
        <img v-if="show_type == 'all'" style="width: 22px; max-height: 24px;" v-img="[(match.match_logo || {}).away_1_logo,(match.match_logo || {}).away_1_letter]" />
      </div>
      <div class="ellipsis-wrap">
        <div class="row no-wrap absolute-full">
          <div class="team-name away ellipsis allow-user-select" :class="{'bold':match.team_let_ball=='T2'}" v-tooltip="{content:_.get(match,'man')+play_name_obj.suffix_name,overflow:1}">{{match.man}}{{play_name_obj.suffix_name}}</div>
          <!-- 进球动画 -->
          <div class="yb-flex-center" v-if="is_show_away_goal">
            <div class="yb-goal-gif"></div>
            <div class="gif-text">{{$root.$t('common.goal')}}</div>
          </div>
          <!-- 红牌数 -->
          <span
            v-show="match.score_obj.S11.away > 0"
            class="red-ball"
            :class="{flash:is_show_away_red}"
          >{{match.score_obj.S11.away}}</span>
        </div>
      </div>
      <!-- 主比分 -->
      <div class="score" :key="match.mid" v-if="show_type == 'all'" v-tooltip="{content: is_15min ? $root.$t('list.15min_stage'):'' ,overflow:1}">{{play_name_obj.score_key ?  _.get(match,`score_obj.${play_name_obj.score_key}.away`) :  match.away_score}}</div>
    </div>


    <!-- 中立场、盘口数 -->
    <div class="row-item match-icon" v-if="show_type == 'all' ">
       <!-- 提前结算 -->
       <div @click.stop="">
         <div
          v-if="_.get(match, 'mearlys', 0) && match.tpl_id != 12 && vx_cur_menu_type.type_name!='bet'"
          class="icon-wrap settlement-pre relative-position"
          v-tooltip="{content: $root.$t('bet_record.settlement_pre')}"
        >
          <img class="match_pre" :src="`${$g_image_preffix}/image/yabo/png/match_pre.png`"/>
        </div>
       </div>
       <div class="more-info flex">
          <!-- 中立场 -->
          <div class="neutral-wrap">
            <span v-if="match.mng"   class="icon-neutral q-icon c-icon"><span class="path1"></span><span class="path2"></span></span>
          </div>

          <!-- 是否收藏 -->
         
          <span @click.stop="collect" class="yb-flex-center yb-hover-bg m-star-wrap-match" v-if="get_global_switch.collect_switch">
            <i aria-hidden="true" class="icon-star q-icon c-icon" :class="is_collect && 'active'"></i>
          </span>
          <!-- 统计分析 -->
          <div class="sr-link-icon-w" v-tooltip="{content:$root.$t('common.analysis')}" v-if="$utils.is_show_sr_flg(match)" @click.stop='sr_click_handle(match)'>
            <i aria-hidden="true" class="icon-signal q-icon c-icon"></i>
          </div>
          <!-- 玩法数量 -->
          <div class="play-count-wrap row no-wrap">
            <span class="play-count">{{ handicap_num }}</span>
            <span class="yb-flex-center">
              <div class="yb-icon-arrow"></div>
            </span>
          </div>
       </div>
    </div>

  </div>
</template>

<script>

import match_basis_info_mixin from "src/project/yabo/components/match_list/match_basis_info/match_basis_info_mixin.js"
import { mapGetters } from "vuex";
export default {
  mixins:[match_basis_info_mixin],
  props: {
    // 显示类型 'no-more':不显示 收藏、玩法数量等 'all' 显示所有信息
    show_type: String,
    is_15min:{
      type:Boolean,
      default:false
    }
  },
  inject:['match_list_data'],

  data(){
    return {
      // 是否显示主队进球动画
      is_show_home_goal:false,
      // 是否显示客队进球动画
      is_show_away_goal:false,
      // 是否显示主队红牌动画
      is_show_home_red:false,
      // 是否显示客队红牌动画
      is_show_away_red:false,
       //赛事是否收藏
      is_collect:false
    }
  },
  computed:{
    ...mapGetters({
      get_collect_count:'get_collect_count'
    }),
    play_name_obj() {
			let play_name_obj = {
				key: 'main',
				suffix_name: '',
        score_key: ''
			}
      let {ms,tpl_id,hSpecial}  =  this.match || {}
      //滚球
			if (this.$utils.get_match_status(ms, [110]) == 1) {
         //角球后缀
				if ($NewMenu.is_corner_menu()) {
					play_name_obj = {
						key: 'corner',
						suffix_name: ' - ' + this.$root.$t('list.corner'),
            score_key: 'S5'
					}
          //罚牌后缀
				} else if (tpl_id == 25) {
					play_name_obj = {
						key: 'punish',
						suffix_name: ' - ' + this.$root.$t('list.punish'),
            score_key: 'S10102'
					}
          // 15分钟比分
				}else if(tpl_id == 24 ){
          play_name_obj = {
                key: 'main',
                suffix_name: '',
                score_key: `S100${hSpecial}`
          }
        }
			}
      return play_name_obj
		},
  },
  watch:{
    // 监听收藏数量，更新收藏icon 颜色
    get_collect_count(v){
      const cur = this.match_list_data.mid_obj
      this.is_collect = Boolean (cur['mid_'+this.match.mid].mf)
    },
   
    // 监听主比分变化
    'match.home_score'(n,o){
      //推送时间是否过期
      let is_time_out = (this.$utils.get_remote_time()-this.match.ws_update_time)<3000
      // 足球 并且已开赛
      if(this.match.csid == 1 && this.$utils.get_match_status(this.match.ms,[110]) == 1 && n!=0 && is_time_out ){
        this.is_show_home_goal = true;
        this.hide_home_goal();
      }
    },
    // 监听主比分变化
    'match.away_score'(n,o){
      //推送时间是否过期
      let is_time_out = (this.$utils.get_remote_time()-this.match.ws_update_time)<3000
      // 足球 并且已开赛
      if(this.match.csid == 1 && this.$utils.get_match_status(this.match.ms,[110]) == 1  && n!=0 && is_time_out ){
        this.is_show_away_goal = true;
        this.hide_away_goal();
      }
    },
  },
  created(){
    this.is_collect = Boolean (this.match.mf)
    //进球特效防抖
    this.hide_home_goal = this.debounce(this.hide_home_goal,5000);
    this.hide_away_goal = this.debounce(this.hide_away_goal,5000);
  },
  beforeDestroy(){
    this.debounce_throttle_cancel(this.hide_home_goal);
    this.debounce_throttle_cancel(this.hide_away_goal);
  },
  methods:{
    /**
     * @Description 隐藏主队进球动画
     * @param {undefined} undefined
    */
    hide_home_goal(){
      this.is_show_home_goal = false;
    },
    /**
     * @Description 隐藏客队进球动画
     * @param {undefined} undefined
    */
    hide_away_goal(){
      this.is_show_away_goal = false;
    },
  }
};
</script>

<style lang="scss" scoped>
.basic-col {
  .row-item {
    display: flex;
    height: 35px;
    align-items: center;
    .team-logo {
      display: flex;
      width: 22px;
      min-width: 22px;
      align-items: center;
    }
  }
  .gif-text {
    white-space: nowrap;
    padding-left: 3px;
    animation: 1s text-flash linear infinite normal;
  }
  .red-ball {
    margin: 0 0 2.5px 8px;
    position: relative;
    top: 1px;
    padding: 0 2px;
    height: 14px;
    line-height: 14px;
    &.flash {
      animation: 1s text-flash linear infinite normal;
    }
  }
  .match-icon {
    justify-content: space-between;
  }
  .more-info{
     align-items: center;
  }
}
</style>
